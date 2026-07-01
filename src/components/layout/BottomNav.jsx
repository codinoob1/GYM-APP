'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '◻' },
  { href: '/progress', label: 'Progress', icon: '📈' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-6 py-3"
      style={{
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        background: 'rgba(10, 10, 15, 0.75)',
        borderTop: '1px solid rgba(42, 45, 55, 0.6)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 8px) + 8px)',
      }}
    >
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${
              active ? 'text-[#c4f135]' : 'text-[#8b8d98]'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
