export default function ProgressStatsRow({ userProfile, logs }) {
  const totalVolume = logs?.reduce((s, l) => s + (l.weight_kg || 0) * (l.reps_done || 0) * (l.sets_done || 0), 0) || 0;
  const sessions = logs?.length || 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Start Weight', value: userProfile?.weight ? `${userProfile.weight}kg` : '—', sub: 'Day 1' },
        { label: 'Current Weight', value: userProfile?.weight ? `${userProfile.weight}kg` : '—', sub: 'Now' },
        { label: 'Sessions Logged', value: sessions, sub: 'total' },
        { label: 'Total Volume', value: `${(totalVolume / 1000).toFixed(1)}t`, sub: 'all time' },
      ].map((item) => (
        <div key={item.label} className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold">
            {item.label}
          </p>
          <p className="text-xl font-bold text-white mt-2">{item.value}</p>
          <p className="text-xs text-[#8b8d98] mt-0.5">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}
