import { NavBar } from '@/components/landing/NavBar';
import { Hero } from '@/components/landing/Hero';
import { FeatureRow } from '@/components/landing/FeatureRow';
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user && !user.user_metadata?.onboarding_completed) {
    redirect('/onboarding');
  }

  return (
    <>
      <NavBar />
      <Hero />
      <FeatureRow />
      <footer className="bg-[#0a0a0f] border-t border-[#2a2d37] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-[#8b8d98] text-sm">
          <p>© 2025 Gym Tracker AI. Built with Next.js + Gemini.</p>
        </div>
      </footer>
    </>
  );
}
