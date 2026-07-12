import React from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight } from 'lucide-react';

// T6 §2 — full-width price-transparency band directly under the hero.
// DS forest background, white text, leaf-green button. Copy is verbatim from the draft.
const CalculatorStrip = () => {
  return (
    <section className="w-full bg-[var(--ds-surface-inverse)] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-between md:gap-10 md:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/70 mb-3">
              <Calculator className="w-4 h-4" />
              INSTANT ESTIMATE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Know your price in 60 seconds
            </h2>
            <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
              Choose your size and specification — instant estimate. No registration, no calls required.
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-col items-center gap-2 md:items-end">
            <Link
              href="/portable-cabin-price-calculator"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-8 py-4 text-base font-black text-[var(--ds-surface-inverse)] shadow-xl transition-all hover:scale-105 hover:bg-green-400 md:text-lg"
            >
              Open Price Calculator
              <ArrowRight className="h-5 w-5" />
            </Link>
            <span className="text-sm font-medium text-white/60">Free · Takes about a minute</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorStrip;
