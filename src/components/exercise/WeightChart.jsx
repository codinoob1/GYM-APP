'use client';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function WeightChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-5 space-y-3">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold">
          Weight Over Time
        </p>
        <p className="text-sm text-[#8b8d98]">No data yet. Start logging to see your progress.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-5 space-y-3">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#8b8d98] font-mono font-semibold">
        Weight Over Time
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fill: '#8b8d98', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8b8d98', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: '#13141a',
              border: '1px solid #2a2d37',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#8b8d98' }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#c4f135"
            strokeWidth={2}
            dot={{ fill: '#c4f135', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
