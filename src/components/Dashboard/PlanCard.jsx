'use client';

import { useRouter } from 'next/navigation';

const emojiMap = {
  chest: '🏋️',
  back: '🏋️',
  legs: '🦵',
  shoulders: '💪',
};

const dayAbbr = {
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED',
  thursday: 'THU',
  friday: 'FRI',
  saturday: 'SAT',
  sunday: 'SUN',
};

const colorMap = {
  chest: 'text-[#c4f135]',
  triceps: 'text-[#c4f135]',
  back: 'text-cyan-400',
  biceps: 'text-cyan-400',
  legs: 'text-violet-400',
  core: 'text-violet-400',
  shoulders: 'text-orange-400',
};

function getCategoryColor(category) {
  const lower = category.toLowerCase();
  for (const [key, color] of Object.entries(colorMap)) {
    if (lower.includes(key)) return color;
  }
  return 'text-white';
}

function getCategoryEmoji(category) {
  const lower = category.toLowerCase();
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lower.includes(key)) return emoji;
  }
  return '🏋️';
}

export default function PlanCard({ dayEntry, onClick, latestLogs }) {
  const main = dayEntry.exercises[0];
  const weightColor = getCategoryColor(dayEntry.category);
  const logged = main ? latestLogs?.[main.name] : null;

  return (
    <button
      onClick={onClick}
      className="bg-[#13141a] border border-[#2a2d37] rounded-xl p-5 text-left cursor-pointer hover:border-[#c4f135]/40 transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg">{getCategoryEmoji(dayEntry.category)}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b8d98] font-mono">
          {dayAbbr[dayEntry.day.toLowerCase()] || dayEntry.day.slice(0, 3).toUpperCase()}
        </span>
      </div>

      <p className="text-white font-semibold text-sm">{dayEntry.category}</p>
      <p className="text-xs text-[#8b8d98] mt-0.5">{dayEntry.exercises.length} exercises</p>

      <div className="mt-3 pt-3 border-t border-[#2a2d37]" />

      {main && (
        <>
          <p className="text-xs text-[#8b8d98] truncate">{main.name}</p>
          {logged ? (
            <p className={`text-base font-bold mt-0.5 ${weightColor}`}>
              {logged.weight_kg}kg × {logged.reps_done}
              <span className="text-[10px] text-[#8b8d98] font-mono ml-1">logged</span>
            </p>
          ) : (
            <p className={`text-base font-bold mt-0.5 ${weightColor}`}>
              {main.weight || '—'}kg × {main.reps}
            </p>
          )}
        </>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span />
        <span className="text-[#8b8d98] text-sm group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </button>
  );
}
