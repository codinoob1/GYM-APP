'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

export default function StrengthTab({ parsedPlan, logs }) {
  const keyLifts = useMemo(() => {
    if (!parsedPlan || !logs) return [];
    const results = [];
    for (const day of parsedPlan) {
      for (const ex of day.exercises) {
        const exerciseLogs = logs.filter((l) => l.exerciseId === ex.name).sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );
        const start = exerciseLogs[0]?.weight_kg || ex.weight || 0;
        const latest = exerciseLogs[exerciseLogs.length - 1]?.weight_kg || ex.weight || 0;
        const delta = (latest - start).toFixed(1);
        results.push({ name: ex.name, start, latest, delta: Number(delta) });
      }
    }
    return results;
  }, [parsedPlan, logs]);

  const weeklyData = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    const byWeek = {};
    logs.forEach((log) => {
      const d = new Date(log.date);
      const weekKey = `${d.getFullYear()}-W${String(Math.ceil((d.getDate() + (d.getDay() || 7) - 1) / 7)).padStart(2, '0')}`;
      if (!byWeek[weekKey]) byWeek[weekKey] = 0;
      byWeek[weekKey] += (log.weight_kg || 0) * (log.reps_done || 0) * (log.sets_done || 0);
    });
    return Object.entries(byWeek).map(([week, volume]) => ({ week, volume }));
  }, [logs]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold mb-3">
          Key Lifts — Start vs Now
        </p>
        <div className="space-y-2">
          {keyLifts.map((lift) => (
            <div
              key={lift.name}
              className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-4 flex items-center justify-between"
            >
              <p className="text-sm font-semibold text-white w-1/3">{lift.name}</p>
              <p className="text-sm text-[#8b8d98]">
                {lift.start}kg →{' '}
                <span className="text-white font-semibold">{lift.latest}kg</span>
              </p>
              <p className="text-sm font-semibold text-[#c4f135]">
                +{lift.delta}kg
              </p>
            </div>
          ))}
          {keyLifts.length === 0 && (
            <p className="text-sm text-[#8b8d98]">No data yet. Start logging to see progress.</p>
          )}
        </div>
      </div>

      {weeklyData.length > 0 && (
        <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-5 space-y-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold">
            Weekly Volume (kg)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="week" tick={{ fill: '#8b8d98', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8b8d98', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#13141a', border: '1px solid #2a2d37', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#8b8d98' }}
              />
              <Bar dataKey="volume" fill="#c4f135" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
