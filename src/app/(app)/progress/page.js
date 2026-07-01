'use client';

import { useState } from 'react';
import { useWorkout } from '@/lib/WorkoutContext';
import ProgressStatsRow from '@/components/progress/ProgressStatsRow';
import PhotosTab from '@/components/progress/PhotosTab';
import StrengthTab from '@/components/progress/StrengthTab';

export default function ProgressPage() {
  const { userProfile, parsedPlan, workoutLogs } = useWorkout();
  const [tab, setTab] = useState('photos');

  const sessions = workoutLogs?.length || 0;
  const weeks = Math.max(1, Math.ceil(sessions / 3));

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#8b8d98] font-mono">
          {weeks} weeks · {sessions} sessions
        </p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Your Progress</h1>
      </div>

      <ProgressStatsRow userProfile={userProfile} logs={workoutLogs} />

      <div className="flex gap-2">
        {[
          { key: 'photos', label: '📷 Photos' },
          { key: 'strength', label: '💪 Strength' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.key
                ? 'border border-[#c4f135] text-[#c4f135]'
                : 'border border-[#2a2d37] text-[#8b8d98] hover:border-white/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'photos' && <PhotosTab photoPreview={userProfile?.photoPreview} />}
      {tab === 'strength' && <StrengthTab parsedPlan={parsedPlan} logs={workoutLogs} />}
    </div>
  );
}
