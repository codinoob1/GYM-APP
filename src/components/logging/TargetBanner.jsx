export default function TargetBanner({ exercise }) {
  if (!exercise) return null;

  return (
    <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl px-5 py-3">
      <p className="text-sm text-[#8b8d98]">
        ◎ TARGET: {exercise.weight || '—'}kg × {exercise.reps} × {exercise.sets}sets
      </p>
    </div>
  );
}
