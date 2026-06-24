export function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#13141a] rounded-lg p-6 border border-[#2a2d37] ${className}`}>
      {children}
    </div>
  );
}
