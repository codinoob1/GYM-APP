export function Button({
  children,
  variant = 'primary',
  className = '',
  arrow = false,
  ...props
}) {
  const baseStyles = 'px-6 py-3 rounded-full font-semibold transition-all inline-flex items-center gap-2 cursor-pointer';
  
  const variants = {
    primary: 'bg-[#c4f135] text-black hover:scale-105 active:scale-98 hover:[&_svg]:translate-x-1',
    secondary: 'bg-transparent border border-[#8b8d98] text-white hover:border-[#c4f135] transition-colors',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {arrow && (
        <svg 
          className="w-5 h-5 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      )}
    </button>
  );
}
