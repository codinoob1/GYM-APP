export function ExerciseRow({ name, weight, reps, sets, prevWeight, delta }) {
  const hasDelta = delta && delta !== 0;
  const isIncrease = delta > 0;

  return (
    <div className="py-4 first:pt-0 border-t border-[#2a2d37] first:border-t-0 hover:bg-[#0a0a0f] transition-colors px-2 -mx-2 rounded cursor-pointer">
      <div className="flex justify-between items-start">
        {/* Left: Exercise name & prev weight */}
        <div>
          <p className="text-white font-semibold text-sm">{name}</p>
          <p className="text-xs text-[#8b8d98] mt-1">prev: {prevWeight}kg</p>
        </div>

        {/* Right: Current weight and delta */}
        <div className="text-right">
          <p className="text-white font-bold text-sm">
            {weight}kg × {reps}
          </p>
          {hasDelta && (
            <p className={`text-xs font-semibold mt-1 flex items-center justify-end gap-1 ${isIncrease ? 'text-[#22c55e]' : 'text-red-500'}`}>
              <span>{isIncrease ? '↗' : '↘'}</span>
              {isIncrease ? '+' : ''}{delta}kg
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
