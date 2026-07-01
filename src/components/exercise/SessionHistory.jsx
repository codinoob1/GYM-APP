export default function SessionHistory({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-5 space-y-3">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold">
          Session History
        </p>
        <p className="text-sm text-[#8b8d98]">No sessions logged yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-5 space-y-3">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold">
        Session History
      </p>
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {logs.map((log, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-[#2a2d37] last:border-0"
          >
            <span className="text-sm text-[#8b8d98]">
              {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="text-sm font-semibold text-white">
              {log.weight_kg}kg × {log.reps_done}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
