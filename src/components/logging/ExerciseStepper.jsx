export default function ExerciseStepper({ label, value, unit, onChange, min = 0 }) {
  return (
    <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-5 flex-1 min-w-[100px]">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold text-center">
        {label}
      </p>

      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={() => onChange(Math.max(min, (value || 0) - 1))}
          className="w-8 h-8 rounded-full bg-[#2a2d37] grid place-items-center text-white text-sm hover:bg-[#3a3d47] transition-colors"
        >
          −
        </button>
        <span className="text-2xl font-bold text-white min-w-[3rem] text-center tabular-nums">
          {value ?? 0}
        </span>
        <button
          onClick={() => onChange((value || 0) + 1)}
          className="w-8 h-8 rounded-full bg-[#2a2d37] grid place-items-center text-white text-sm hover:bg-[#3a3d47] transition-colors"
        >
          +
        </button>
      </div>

      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b8d98] font-mono text-center mt-2">
        {unit}
      </p>
    </div>
  );
}
