'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkout } from '@/lib/WorkoutContext';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function LogTodayBanner() {
  const router = useRouter();
  const { parsedPlan } = useWorkout();
  const [today, setToday] = useState(days[0]);

  useEffect(() => {
    setToday(days[new Date().getDay()]);
  }, []);

  const todayEntry = parsedPlan?.find(
    (d) => d.day.toLowerCase() === today.toLowerCase()
  );

  if (!todayEntry) return null;

  const slug = todayEntry.category.toLowerCase().replace(/[^a-z]+/g, '-');

  return (
    <button
      onClick={() => router.push(`/logging/${slug}`)}
      className="w-full bg-[#c4f135] rounded-xl p-5 flex items-center justify-between group text-left cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-black/10 grid place-items-center text-xl">
          💪
        </div>
        <div>
          <p className="text-black font-bold text-lg">Log Today&apos;s Workout</p>
          <p className="text-black/60 text-sm">
            {todayEntry.category} · {todayEntry.exercises.length} exercises
          </p>
        </div>
      </div>
      <span className="text-2xl text-black/40 group-hover:translate-x-1 transition-transform">
        →
      </span>
    </button>
  );
}
