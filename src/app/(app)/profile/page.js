'use client';

import { useState } from 'react';
import { useWorkout } from '@/lib/WorkoutContext';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { userProfile, parsedPlan, rawPlanText, workoutLogs, reanalyzePlan, syncToDb, setCoachNotes } = useWorkout();
  const [reanalyzing, setReanalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleReanalyze = async () => {
    if (!rawPlanText) return;
    setReanalyzing(true);
    setMsg('');
    try {
      const loggedExerciseNames = [...new Set((workoutLogs || []).map((log) => log.exercise_name).filter(Boolean))];
      const logSummary = loggedExerciseNames.map((name) => {
        const logs = (workoutLogs || [])
          .filter((log) => log.exercise_name === name)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        return {
          exercise_name: name,
          last_weight: logs[0]?.weight_kg,
          last_reps: logs[0]?.reps_done,
          last_sets: logs[0]?.sets_done,
          sessions_count: logs.length,
        };
      });

      const prompt = `
You are an AI fitness coach reviewing a user's workout progress.

Original plan:
${JSON.stringify(parsedPlan, null, 2)}

What the user has actually logged so far:
${JSON.stringify(logSummary, null, 2)}

For each exercise that has been logged, write a short 1-sentence coaching note.
Only comment on exercises that appear in the logged data.
Focus on: are they hitting targets? Should they increase weight or reps?
Return ONLY a JSON array like this, no explanation, no markdown:
[
  { "exercise_name": "Seated Cable Row", "coach_note": "Your note here" },
  ...
]
`;

      const res = await fetch('/api/parse-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planText: rawPlanText, prompt }),
      });
      if (!res.ok) throw new Error('Re-analysis failed');
      const data = await res.json();
      await reanalyzePlan(data.plan);

      if (Array.isArray(data.coachNotes)) {
        const notes = {};
        data.coachNotes.forEach((item) => {
          if (item?.exercise_name) notes[item.exercise_name] = item.coach_note;
        });
        setCoachNotes((prev) => ({ ...prev, ...notes }));
      }
      setMsg('Plan re-analyzed successfully!');
    } catch (e) {
      setMsg(e.message);
    } finally {
      setReanalyzing(false);
    }
  };

  const handleSync = async () => {
    setSaving(true);
    setMsg('');
    try {
      await syncToDb();
      setMsg('All data saved to server!');
    } catch (e) {
      setMsg(e.message);
    } finally {
      setSaving(false);
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
      </div>

      <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-6 space-y-4">
        <h2 className="text-sm uppercase tracking-[0.25em] text-[#8b8d98] font-semibold">Data Persistence</h2>
        <p className="text-xs text-[#8b8d98] leading-relaxed">
          iOS PWAs may clear local data when closed. Tap below to save your current profile, plan, and logs to the server.
        </p>
        <Button
          variant="secondary"
          className="w-full justify-center border-[#c4f135] text-[#c4f135]"
          onClick={handleSync}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save to Database'}
        </Button>
      </div>

      {msg && (
        <p className={`text-sm ${msg.includes('success') || msg.includes('saved') ? 'text-[#c4f135]' : 'text-red-400'}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
