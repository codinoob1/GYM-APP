export function MuscleTag({ group = 'chest' }) {
  const colors = {
    chest: 'bg-green-500/20 text-green-400',
    back: 'bg-blue-500/20 text-blue-400',
    legs: 'bg-purple-500/20 text-purple-400',
    shoulders: 'bg-orange-500/20 text-orange-400',
  };

  const labels = {
    chest: 'Chest/Triceps',
    back: 'Back/Biceps',
    legs: 'Legs/Core',
    shoulders: 'Shoulders',
  };

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${colors[group]}`}>
      {labels[group]}
    </span>
  );
}
