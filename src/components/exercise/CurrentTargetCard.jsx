export default function CurrentTargetCard({ exercise, logs, currentWeight, currentReps, currentSets, coachNote }) {
  if (!exercise) return null;

  const tip = coachNote || computeCoachTip(logs);

  return (
    <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-5 space-y-4">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold">
        Current Target
      </p>

      <div className="flex gap-6">
        <div>
          <p className="text-3xl font-bold text-[#c4f135]">{currentWeight ?? exercise.weight ?? '—'}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b8d98] font-mono mt-1">Weight</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-cyan-400">{currentReps ?? exercise.reps}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b8d98] font-mono mt-1">Reps</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-cyan-400">{currentSets ?? exercise.sets}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b8d98] font-mono mt-1">Sets</p>
        </div>
      </div>

      <div className="bg-[#1b2210] border border-[#2a3a1a] rounded-lg p-4 flex items-start gap-3">
        <span className="text-lg">⚡</span>
        <div>
          <p className="text-xs font-semibold text-[#c4f135]">AI Coach:</p>
          <p className="text-sm text-[#d5d9e6] mt-0.5">{tip}</p>
        </div>
      </div>
    </div>
  );
}

function computeCoachTip(logs) {
  if (!logs || logs.length === 0) {
    return "Start logging your workouts to get AI-powered coaching insights.";
  }

  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const recent = sorted.slice(-3);

  const weightColumn = recent.map((l) => l.weight_kg);
  const allSameWeight = weightColumn.every((w) => w === weightColumn[0]);

  if (recent.length >= 3 && allSameWeight && weightColumn[0] > 0) {
    return "You've hit this weight 3 sessions in a row. Try +2.5kg next session.";
  }

  if (recent.length >= 2 && allSameWeight && weightColumn[0] > 0) {
    return "Consistent! One more session at this weight, then consider going up.";
  }

  const maxLog = Math.max(...sorted.map((l) => l.weight_kg));
  if (maxLog > recent[recent.length - 1]?.weight_kg) {
    return "You've lifted heavier before. Aim to match your personal best!";
  }

  const total = sorted.length;
  if (total >= 5) {
    const recentAvg = recent.reduce((s, l) => s + l.weight_kg, 0) / recent.length;
    const earlier = sorted.slice(0, Math.min(3, sorted.length));
    const earlierAvg = earlier.reduce((s, l) => s + l.weight_kg, 0) / earlier.length;
    if (recentAvg > earlierAvg) {
      return "Your strength is trending up. Keep the momentum!";
    }
  }

  return "Keep pushing! Consistency builds strength.";
}
