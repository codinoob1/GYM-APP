'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useWorkout } from '@/lib/WorkoutContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '◻' },
  { href: '/progress', label: 'Progress', icon: '📈' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile } = useWorkout();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 bg-[#13141a] border-r border-[#2a2d37] z-50">
      <div className="p-6 border-b border-[#2a2d37]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c4f135] rounded-lg grid place-items-center font-bold text-black">
            G
          </div>
          <span className="text-white font-bold text-sm tracking-wide">
            GYM TRACKER AI
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#c4f135]/10 text-[#c4f135]'
                  : 'text-[#8b8d98] hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2a2d37] space-y-3">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-[#2a2d37] grid place-items-center text-xs text-white font-bold uppercase">
            {userProfile?.name?.[0] || 'U'}
          </div>
          <div className="text-sm">
            <p className="text-white font-medium truncate">
              {userProfile?.name || 'User'}
            </p>
            <p className="text-[#8b8d98] text-xs truncate">
              {userProfile?.goal || 'No goal set'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-[#8b8d98] hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
