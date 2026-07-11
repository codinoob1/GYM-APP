'use client';

import { useWorkout } from '@/lib/WorkoutContext';

function StatCard({ label, value, unit }) {
  return (
    <div className="bg-[#13141a] border border-[#2a2d37] rounded-lg p-5 flex-1 min-w-[120px]">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold">
        {label}
      </p>
      <p className="text-2xl font-bold text-white mt-2">
        {value}
        <span className="text-xs font-normal text-[#8b8d98] ml-1">{unit}</span>
      </p>
    </div>
  );
}

export default function StatsRow() {
  const { getWorkoutCount, getVolume } = useWorkout();

  return (
    <div className="flex flex-wrap gap-4">
      <StatCard label="Workouts" value={getWorkoutCount()} unit="this month" />
      <StatCard label="Volume" value={(getVolume() / 1000).toFixed(1)} unit="tonnes" />
      <StatCard label="Streak" value="0" unit="weeks" />
    </div>
  );
}
