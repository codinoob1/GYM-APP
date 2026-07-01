'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function NavBar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };
  

  return (
    <nav className="bg-[#0a0a0f] border-b border-[#2a2d37] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c4f135] rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">💪</span>
          </div>
          <span className="text-white font-bold text-lg">GYM TRACKER AI</span>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#8b8d98] hidden sm:inline">
              {user.email}
            </span>
            <Button variant="secondary" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="secondary">Log In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
