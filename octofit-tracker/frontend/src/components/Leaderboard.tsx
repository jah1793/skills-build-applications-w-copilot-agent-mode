import { CapabilityCard } from './CapabilityCard.js';
export default function Leaderboard() {
  type LeaderboardData = { leaderboard: Array<{ teamName: string; totalPoints: number; rank: number }> };
  return (
    <CapabilityCard<LeaderboardData>
      title="Leaderboard"
      description="Compare team point totals."
      path="/api/leaderboard"
      emptyText=""
      renderItems={({ leaderboard }) => leaderboard.length === 0
        ? <p>No leaderboard rankings or scores found.</p>
        : <ol>{leaderboard.map((entry) =>
          <li key={entry.rank}>{entry.teamName}: {entry.totalPoints} points</li>
        )}</ol>}
    />
  );
}
