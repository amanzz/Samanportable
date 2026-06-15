import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { PRODUCT_TRUST_LINE } from '@/data/certifications';

/**
 * Compact manufacturer-proof strip for product pages.
 * One line of locked credential facts + a link to the full About certifications
 * section. No certificate cards, no badges, no per-page 500+/15+/20+ metrics.
 */
const ManufacturerTrustStrip = () => {
  return (
    <section
      aria-label="Manufacturer credentials"
      className="rounded-xl border border-[#0A3D2A]/15 bg-[#F0F7F4] px-4 py-4 sm:px-5 sm:py-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <ShieldCheck className="w-6 h-6 text-[#0A3D2A] shrink-0" aria-hidden="true" />
        <p className="text-sm text-gray-700 flex-1 leading-relaxed">
          {PRODUCT_TRUST_LINE}
        </p>
        <Link
          href="/about-us#certifications"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A3D2A] hover:underline shrink-0"
        >
          View manufacturer credentials
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default ManufacturerTrustStrip;
