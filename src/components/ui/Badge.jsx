export function Badge({ children, className = '', animated = false }) {
  return (
    <span className={`inline-flex items-center gap-1 bg-[#13141a] px-3 py-1 rounded-full text-xs font-medium text-[#c4f135] border border-[#c4f135] ${animated ? 'badge-pulse' : ''} ${className}`}>
      {children}
    </span>
  );
}
