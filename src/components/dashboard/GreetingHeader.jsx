'use client';

import { useWorkout } from '@/lib/WorkoutContext';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function GreetingHeader() {
  const { userProfile, parsedPlan } = useWorkout();

  const now = new Date();
  const dayName = days[now.getDay()];
  const hour = now.getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 18 ? 'GOOD AFTERNOON' : 'GOOD EV ENING';
  const name = userProfile?.name || 'ATHLETE';

  const todayCategory = parsedPlan?.find(
    (d) => d.day.toLowerCase() === dayName.toLowerCase()
  );

  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.3em] text-[#8b8d98] font-mono">
        {dayName} · WEEK 1
      </p>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        {greeting}, <span className="text-[#c4f135]">{name}</span>.
      </h1>
      {todayCategory && (
        <p className="text-sm text-[#8b8d98]">
          Next up: {todayCategory.category} — today
        </p>
      )}
    </div>
  );
}
