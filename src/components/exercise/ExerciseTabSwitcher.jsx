export default function ExerciseTabSwitcher({ exercises, activeIndex, onSwitch }) {
  return (
    <div className="flex flex-wrap gap-2">
      {exercises.map((ex, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={ex.name}
            onClick={() => onSwitch(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active
                ? 'border border-[#c4f135] text-[#c4f135]'
                : 'border border-[#2a2d37] text-[#8b8d98] hover:border-white/20'
            }`}
          >
            {ex.name}
          </button>
        );
      })}
    </div>
  );
}
