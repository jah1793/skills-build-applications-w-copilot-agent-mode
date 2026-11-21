import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCardView } from './CapabilityCard.js';

type LeaderboardData = { leaderboard: Array<{ teamName: string; totalPoints: number; rank: number }> };

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getJson<LeaderboardData>('/api/leaderboard')
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
    <CapabilityCardView<LeaderboardData>
      title="Leaderboard"
      description="Compare team point totals."
      emptyText=""
      data={data}
      loading={loading}
      error={error}
      renderItems={({ leaderboard }) => leaderboard.length === 0
        ? <p>No leaderboard rankings or scores found.</p>
        : <ol>{leaderboard.map((entry) =>
          <li key={entry.rank}>{entry.teamName}: {entry.totalPoints} points</li>
        )}</ol>}
    />
  );
}
