import React from 'react';
import Link from 'next/link';
import { BadgeCheck, ArrowRight } from 'lucide-react';
import { HOME_TRUST_CHIPS } from '@/data/certifications';

/**
 * Compact, premium "verified manufacturer credentials" strip for the homepage.
 * Kept deliberately slim (single band) so it complements — not repeats — the
 * existing TrustBar above it. Links to the full About certifications section,
 * never directly to the PDFs.
 */
const CertificationTrustStrip = () => {
  return (
    <section
      aria-label="Verified manufacturer credentials"
      className="bg-[#0A3D2A] text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Heading */}
          <div className="flex items-center gap-2.5 shrink-0">
            <BadgeCheck className="w-5 h-5 text-[#7FD1A8]" aria-hidden="true" />
            <span className="text-sm md:text-base font-semibold tracking-wide">
              Verified manufacturer credentials
            </span>
          </div>

          {/* Credential chips */}
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-2 md:flex-1">
            {HOME_TRUST_CHIPS.map((chip) => (
              <li
                key={chip}
                className="text-xs md:text-[13px] font-medium text-white/90 bg-white/10 border border-white/15 rounded-full px-3 py-1 whitespace-nowrap"
              >
                {chip}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/about-us#certifications"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7FD1A8] hover:text-white transition-colors shrink-0"
          >
            View certifications
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CertificationTrustStrip;
