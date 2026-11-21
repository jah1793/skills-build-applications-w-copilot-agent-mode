import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCardView } from './CapabilityCard.js';

type TeamData = { teams: Array<{ name: string; members?: string[] }> };

export default function Teams() {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getJson<TeamData>('/api/teams')
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
    <CapabilityCardView<TeamData>
      title="Teams"
      description="Manage teams and members."
      emptyText=""
      data={data}
      loading={loading}
      error={error}
      renderItems={({ teams }) => teams.length === 0
        ? <p>No teams found.</p>
        : <ul>{teams.map((team, index) =>
          <li key={index}>{team.name}{team.members?.length ? ` - ${team.members.join(', ')}` : ''}</li>
        )}</ul>}
    />
  );
}
