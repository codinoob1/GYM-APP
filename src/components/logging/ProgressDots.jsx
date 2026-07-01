export default function ProgressDots({ total, current }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const isCompleted = i < current;
        const isActive = i === current;
        return (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              isCompleted || isActive ? 'bg-[#c4f135]' : 'bg-[#2a2d37]'
            }`}
          />
        );
      })}
    </div>
  );
}
