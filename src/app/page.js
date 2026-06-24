import { NavBar } from '@/components/landing/NavBar';
import { Hero } from '@/components/landing/Hero';
import { FeatureRow } from '@/components/landing/FeatureRow';

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <FeatureRow />
      
      {/* Footer */}
      <footer className="bg-[#0a0a0f] border-t border-[#2a2d37] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-[#8b8d98] text-sm">
          <p>© 2025 Gym Tracker AI. Built with Next.js + Gemini.</p>
        </div>
      </footer>
    </>
  );
}
