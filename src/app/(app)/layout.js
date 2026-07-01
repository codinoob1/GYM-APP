'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { WorkoutProvider } from '@/lib/WorkoutContext';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';

export default function AppLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c4f135] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-[#0a0a0f] md:pl-60">
        <Sidebar />
        <main className="pb-24 md:pb-0">{children}</main>
        <BottomNav />
      </div>
    </WorkoutProvider>
  );
}
