import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="bg-[#0a0a0f] border-b border-[#2a2d37] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c4f135] rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">💪</span>
          </div>
          <span className="text-white font-bold text-lg">GYM TRACKER AI</span>
        </div>

        {/* Log In Button */}
        <Link href="/login">
          <Button variant="secondary">Log In</Button>
        </Link>
      </div>
    </nav>
  );
}
