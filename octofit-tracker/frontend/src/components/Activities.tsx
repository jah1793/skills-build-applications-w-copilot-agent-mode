import { CapabilityCard } from './CapabilityCard.js';
export default function Activities() {
  type ActivityData = { activities: Array<{ type: string; minutes: number; points: number }> };
  return (
    <CapabilityCard<ActivityData>
      title="Activities"
      description="Track student activity minutes and points."
      path="/api/activities"
      emptyText=""
      renderItems={({ activities }) => activities.length === 0
        ? <p>No activities found.</p>
        : <ul>{activities.map((activity, index) =>
          <li key={index}>{activity.type} - {activity.minutes} minutes ({activity.points} points)</li>
        )}</ul>}
    />
  );
}
