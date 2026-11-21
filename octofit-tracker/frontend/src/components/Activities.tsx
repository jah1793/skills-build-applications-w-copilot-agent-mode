import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCardView } from './CapabilityCard.js';

type ActivityData = { activities: Array<{ type: string; minutes: number; points: number }> };

export default function Activities() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getJson<ActivityData>('/api/activities')
      .then((result) => {
        if (active) setData(result);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Unable to load data');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <CapabilityCardView<ActivityData>
      title="Activities"
      description="Track student activity minutes and points."
      emptyText=""
      data={data}
      loading={loading}
      error={error}
      renderItems={({ activities }) => activities.length === 0
        ? <p>No activities found.</p>
        : <ul>{activities.map((activity, index) =>
          <li key={index}>{activity.type} - {activity.minutes} minutes ({activity.points} points)</li>
        )}</ul>}
    />
  );
}
