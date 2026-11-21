import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCardView } from './CapabilityCard.js';

type WorkoutData = { suggestions: Array<{ title: string; reason?: string }> };

export default function Workouts() {
  const [data, setData] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const email = encodeURIComponent('mona@example.com');

  useEffect(() => {
    let active = true;
    getJson<WorkoutData>(`/api/workouts/suggestions/${email}`)
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
  }, [email]);

  return (
    <CapabilityCardView<WorkoutData>
      title="Workout suggestions"
      description="Recommend workouts from activity patterns."
      emptyText=""
      data={data}
      loading={loading}
      error={error}
      renderItems={({ suggestions }) => suggestions.length === 0
        ? <p>No workout suggestions found.</p>
        : <ul>{suggestions.map((workout, index) =>
          <li key={index}>{workout.title}{workout.reason ? ` - ${workout.reason}` : ''}</li>
        )}</ul>}
    />
  );
}
