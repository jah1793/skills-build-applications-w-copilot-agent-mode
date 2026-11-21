import { CapabilityCard } from './CapabilityCard.js';
export default function Workouts() {
  type WorkoutData = { suggestions: Array<{ title: string; reason?: string }> };
  const email = encodeURIComponent('mona@example.com');
  return (
    <CapabilityCard<WorkoutData>
      title="Workout suggestions"
      description="Recommend workouts from activity patterns."
      path={`/api/workouts/suggestions/${email}`}
      emptyText=""
      renderItems={({ suggestions }) => suggestions.length === 0
        ? <p>No workout suggestions found.</p>
        : <ul>{suggestions.map((workout, index) =>
          <li key={index}>{workout.title}{workout.reason ? ` - ${workout.reason}` : ''}</li>
        )}</ul>}
    />
  );
}
