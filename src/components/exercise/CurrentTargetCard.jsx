export default function CurrentTargetCard({ exercise }) {
  if (!exercise) return null;

  return (
    <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-5 space-y-4">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold">
        Current Target
      </p>

      <div className="flex gap-6">
        <div>
          <p className="text-3xl font-bold text-[#c4f135]">{exercise.weight ?? '—'}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b8d98] font-mono mt-1">Weight</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-cyan-400">{exercise.reps}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b8d98] font-mono mt-1">Reps</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-cyan-400">{exercise.sets}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b8d98] font-mono mt-1">Sets</p>
        </div>
      </div>

      <div className="bg-[#1b2210] border border-[#2a3a1a] rounded-lg p-4 flex items-start gap-3">
        <span className="text-lg">⚡</span>
        <div>
          <p className="text-xs font-semibold text-[#c4f135]">AI Coach:</p>
          <p className="text-sm text-[#d5d9e6] mt-0.5">
            You&apos;ve hit this weight 3 sessions in a row. Try +2.5kg next session.
          </p>
        </div>
      </div>
    </div>
  );
}
