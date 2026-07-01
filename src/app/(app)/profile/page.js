'use client';

import { useState } from 'react';
import { useWorkout } from '@/lib/WorkoutContext';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { userProfile, parsedPlan, rawPlanText, reanalyzePlan, clearData } = useWorkout();
  const [reanalyzing, setReanalyzing] = useState(false);
  const [msg, setMsg] = useState('');

  const handleReanalyze = async () => {
    if (!rawPlanText) return;
    setReanalyzing(true);
    setMsg('');
    try {
      const res = await fetch('/api/parse-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planText: rawPlanText }),
      });
      if (!res.ok) throw new Error('Re-analysis failed');
      const data = await res.json();
      reanalyzePlan(data.plan);
      setMsg('Plan re-analyzed successfully!');
    } catch (e) {
      setMsg(e.message);
    } finally {
      setReanalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-[#8b8d98] mt-1">Your account details and plan settings.</p>
      </div>

      <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#2a2d37] grid place-items-center text-2xl font-bold text-white uppercase">
            {userProfile?.name?.[0] || 'U'}
          </div>
          <div>
            <p className="text-xl font-bold text-white">{userProfile?.name || 'User'}</p>
            <p className="text-sm text-[#8b8d98]">{userProfile?.goal || 'No goal set'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Age', value: userProfile?.age },
            { label: 'Weight', value: userProfile?.weight ? `${userProfile.weight}kg` : '—' },
            { label: 'Height', value: userProfile?.height ? `${userProfile.height}cm` : '—' },
            { label: 'Training Since', value: userProfile?.trainingSince || '—' },
          ].map((item) => (
            <div key={item.label} className="bg-[#0f131d] rounded-lg p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8b8d98] font-mono">{item.label}</p>
              <p className="text-lg font-semibold text-white mt-1">{item.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-6 space-y-4">
        <h2 className="text-sm uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">Workout Plan</h2>
        <p className="text-sm text-[#8b8d98]">
          {parsedPlan ? `${parsedPlan.length} days · ${parsedPlan.reduce((s, d) => s + d.exercises.length, 0)} exercises` : 'No plan loaded'}
        </p>
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={handleReanalyze}
          disabled={reanalyzing || !rawPlanText}
        >
          {reanalyzing ? 'Re-analyzing...' : 'Re-analyze Plan'}
        </Button>
        {msg && (
          <p className={`text-sm ${msg.includes('success') ? 'text-[#c4f135]' : 'text-red-400'}`}>
            {msg}
          </p>
        )}
      </div>

      <button
        onClick={clearData}
        className="text-sm text-red-400/60 hover:text-red-400 transition-colors"
      >
        Clear local data (for testing)
      </button>
    </div>
  );
}
