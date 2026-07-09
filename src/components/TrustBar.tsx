import React, { useEffect, useRef } from 'react';
import { Calendar, Factory, Truck, ShieldCheck, Award } from 'lucide-react';

const TrustBar = () => {
  const stats = [
    {
      icon: Award,
      value: 'ISO 9001:2015',
      label: 'Certified Manufacturer',
      accent: true,
    },
    {
      icon: Calendar,
      value: 'Since 2009',
      label: '15+ Years Experience',
    },
    {
      icon: Factory,
      value: '2 Factories',
      label: 'Bengaluru & Greater Noida',
    },
    {
      icon: Truck,
      value: '7–21 Day Delivery',
      label: 'Order to Installation',
    },
    {
      icon: ShieldCheck,
      value: '5-Year Structural Warranty',
      label: 'Structural Guarantee',
    },
  ];

  const rootRef = useRef<HTMLElement>(null);

  // Gentle count-up on first scroll into view. Vanilla JS + IntersectionObserver
  // (no new deps). Respects prefers-reduced-motion. SSR renders the exact value
  // strings and the animation restores them verbatim, so the text stays byte-identical.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-countup]'));
    if (!nodes.length) return;

    const animate = (node: HTMLElement) => {
      const final = node.getAttribute('data-final') || node.textContent || '';
      const parts = final.split(/(\d+)/); // numeric runs become their own groups
      const targets = parts.map((p) => (/^\d+$/.test(p) ? parseInt(p, 10) : null));
      const duration = 900;
      let start: number | null = null;
      const step = (ts: number) => {
        if (start === null) start = ts;
        const t = Math.min(1, (ts - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out
        if (t < 1) {
          node.textContent = parts
            .map((p, i) => (targets[i] === null ? p : String(Math.round((targets[i] as number) * eased))))
            .join('');
          requestAnimationFrame(step);
        } else {
          node.textContent = final; // exact, byte-identical final value
        }
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            io.disconnect();
            nodes.forEach(animate);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="bg-white border-b border-gray-100 shadow-sm relative z-30">
      {/* Top accent strip */}
      <div className="h-1 bg-gradient-to-r from-[#0A3D2A] via-[#1A6B45] to-[#0A3D2A]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center text-center px-2 md:px-6 group transition-all duration-300 hover:-translate-y-1 ${
                  stat.accent ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                {/* Filled DS-green tile (applied to all five) */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg bg-gradient-to-br from-[#0A3D2A] to-[#1A6B45] text-white shadow-md">
                  <Icon className="w-6 h-6" />
                </div>

                <div
                  data-countup
                  data-final={stat.value}
                  className="text-xl md:text-2xl font-bold leading-tight mb-1 text-gray-900"
                >
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-500 font-medium leading-tight max-w-[140px]">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
