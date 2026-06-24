'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MuscleTag } from '@/components/ui/MuscleTag';
import { ExerciseRow } from './ExerciseRow';

export function Hero() {
  return (
    <section className="bg-[#0a0a0f] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left Column */}
          <div className="space-y-6 flex flex-col justify-center">
            <div className="fade-in-up">
              <Badge animated>⚡ POWERED BY  AI</Badge>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight fade-in-up-delay-1">
              <span className="text-white block">YOUR PLAN.</span>
              <span className="text-[#c4f135] block">SMARTER</span>
              <span className="text-white block">EVERY WEEK.</span>
            </h1>

            {/* Subtext */}
            <p className="text-[#8b8d98] text-base leading-relaxed max-w-md fade-in-up-delay-2">
              Paste your existing workout plan. Our AI coach parses it, tracks your sessions, and automatically applies progressive overload — so you always know exactly what to lift next.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2 fade-in-up-delay-3">
              <Button variant="primary" arrow>
                Get Started Free
              </Button>
              <Button variant="secondary">
                Log In
              </Button>
            </div>
          </div>

          {/* Right Column - Session Preview Card */}
          <div className="relative">
            {/* Glow backdrop */}
            <div className="absolute inset-0 bg-[#c4f135] rounded-3xl blur-3xl opacity-20 glow-pulse" />
            
            {/* Card */}
            <Card className="relative slide-in-right hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-xl border border-[#2a2d37] overflow-hidden">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2a2d37]">
                  <h3 className="text-[#8b8d98] font-mono text-xs uppercase tracking-wider">TODAY'S SESSION</h3>
                  <MuscleTag group="chest" />
                </div>

                {/* Exercise Items */}
                <div className="space-y-0 -mx-6 px-6">
                  <ExerciseRow 
                    name="Bench Press" 
                    weight={90} 
                    reps={8} 
                    sets={4}
                    prevWeight={77.5}
                    delta={2.5}
                  />
                  <ExerciseRow 
                    name="Incline DB Press" 
                    weight={28} 
                    reps={10} 
                    sets={3}
                    prevWeight={28}
                    delta={0}
                  />
                  <ExerciseRow 
                    name="Tricep Pushdown" 
                    weight={22.5} 
                    reps={12} 
                    sets={3}
                    prevWeight={20}
                    delta={2.5}
                  />
                </div>

                {/* Button */}
                <button className="w-full mt-6 bg-[#c4f135] text-black font-semibold py-3 rounded-lg hover:bg-[#b8dd2a] active:scale-95 transition-all cursor-pointer">
                  Log Today's Workout
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
