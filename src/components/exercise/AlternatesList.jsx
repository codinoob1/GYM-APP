export default function AlternatesList({ alternates }) {
  if (!alternates || alternates.length === 0) return null;

  return (
    <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-5 space-y-3">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold">
        Alternates
      </p>
      <div className="space-y-1">
        {alternates.map((alt, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-[#2a2d37] last:border-0"
          >
            <span className="text-sm text-white">{alt.name || alt}</span>
            <span className="text-[#8b8d98] text-sm">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}
