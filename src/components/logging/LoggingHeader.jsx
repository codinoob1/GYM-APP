export default function LoggingHeader({ category, exerciseName, current, total, onExit }) {
  return (
    <div className="flex items-center justify-between">
      <button onClick={onExit} className="text-[#8b8d98] hover:text-white text-xl transition-colors">
        ✕
      </button>
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono">
          Logging · {category}
        </p>
        <h1 className="text-xl font-bold tracking-tight mt-0.5">{exerciseName}</h1>
      </div>
      <span className="text-sm text-[#8b8d98] font-mono">
        {current}/{total}
      </span>
    </div>
  );
}
