import { CapabilityCard } from './CapabilityCard.js';
export default function Teams() {
  type TeamData = { teams: Array<{ name: string; members?: string[] }> };
  return (
    <CapabilityCard<TeamData>
      title="Teams"
      description="Manage teams and members."
      path="/api/teams"
      emptyText=""
      renderItems={({ teams }) => teams.length === 0
        ? <p>No teams found.</p>
        : <ul>{teams.map((team, index) =>
          <li key={index}>{team.name}{team.members?.length ? ` - ${team.members.join(', ')}` : ''}</li>
        )}</ul>}
    />
  );
}
