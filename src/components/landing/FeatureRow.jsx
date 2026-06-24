'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: '📄',
    title: 'Paste or Upload Your Plan',
    description: 'Supports free-text or PDF. AI structures it automatically.',
  },
  {
    icon: '🎯',
    title: 'Progressive Overload, Automated',
    description: 'Gemini tracks your history and tells you when to add weight.',
  },
  {
    icon: '📊',
    title: 'Visual Progress Over Time',
    description: 'See strength trends per exercise across every session.',
  },
];

export function FeatureRow() {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      itemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="bg-[#0a0a0f] py-16 md:py-24 border-t border-[#2a2d37]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              ref={(el) => {
                if (el) itemsRef.current[idx] = el;
              }}
              className="feature-item"
            >
              <Card className="text-center flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4 leading-none">{feature.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-[#8b8d98] text-sm flex-grow">
                  {feature.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
