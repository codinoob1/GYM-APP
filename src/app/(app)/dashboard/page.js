'use client';

import { useRouter } from 'next/navigation';
import { useWorkout } from '@/lib/WorkoutContext';
import GreetingHeader from '@/components/dashboard/GreetingHeader';
import StatsRow from '@/components/dashboard/StatsRow';
import LogTodayBanner from '@/components/dashboard/LogTodayBanner';
import PlanCard from '@/components/dashboard/PlanCard';

export default function DashboardPage() {
  const router = useRouter();
  const { parsedPlan } = useWorkout();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <GreetingHeader />

      <StatsRow />

      <LogTodayBanner />

      {parsedPlan && parsedPlan.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-white">Your Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {parsedPlan.map((entry) => (
              <PlanCard
                key={entry.day}
                dayEntry={entry}
                onClick={() => {
                  const first = entry.exercises[0];
                  if (first) {
                    router.push(`/exercise/${encodeURIComponent(first.name)}`);
                  }
                }}
              />
            ))}
          </div>
        </section>
      )}

      {(!parsedPlan || parsedPlan.length === 0) && (
        <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-8 text-center">
          <p className="text-[#8b8d98] text-sm">
            No workout plan yet. Complete onboarding to get started.
          </p>
        </div>
      )}
    </div>
  );
}
