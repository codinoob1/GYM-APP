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
  const { getWorkoutCount, getVolume, workoutLogs } = useWorkout();

  const streak = (() => {
    if (!workoutLogs?.length) return 0;

    const uniqueDays = [...new Set(workoutLogs.map((log) => new Date(log.date).toDateString()))].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    let currentStreak = 1;
    let previousDay = new Date(uniqueDays[0]);

    for (let index = 1; index < uniqueDays.length; index += 1) {
      const currentDay = new Date(uniqueDays[index]);
      const diffDays = Math.round((currentDay.getTime() - previousDay.getTime()) / 86400000);

      if (diffDays === 1) {
        currentStreak += 1;
        previousDay = currentDay;
      } else if (diffDays > 1) {
        break;
      }
    }

    return currentStreak;
  })();

  return (
    <div className="flex flex-wrap gap-4">
      <StatCard label="Workouts" value={getWorkoutCount()} unit="this month" />
      <StatCard label="Volume" value={(getVolume() / 1000).toFixed(1)} unit="tonnes" />
      <StatCard label="Streak" value={streak} unit="days" />
    </div>
  );
}
