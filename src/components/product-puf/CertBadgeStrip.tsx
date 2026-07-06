import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Leaf, HardHat, Landmark } from 'lucide-react';
import { CERTIFICATIONS, type CredentialCategory } from '@/data/certifications';

// The six certifications locked for the C15 PUF panel pages, sourced from the
// single certifications data file so numbers never drift from /about-us.
const LOCKED_KEYS = ['iso-9001', 'iso-14001', 'iso-45001', 'nsic', 'startup-india', 'udyam'];

const CATEGORY_ICON: Record<CredentialCategory, React.ComponentType<{ className?: string }>> = {
  quality: ShieldCheck,
  environment: Leaf,
  safety: HardHat,
  government: Landmark,
  tax: ShieldCheck,
  governance: ShieldCheck,
};

const badges = LOCKED_KEYS.map((key) => CERTIFICATIONS.find((c) => c.key === key)).filter(
  (c): c is NonNullable<typeof c> => Boolean(c)
);

const CertBadgeStrip = () => {
  return (
    <section
      aria-label="SAMAN certifications and registrations"
      className="rounded-xl border border-primary/15 bg-primary/[0.03] px-4 py-5 sm:px-6"
    >
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {badges.map((cert) => {
          const Icon = CATEGORY_ICON[cert.category] ?? ShieldCheck;
          return (
            <div
              key={cert.key}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 shadow-sm"
              title={cert.number ? `${cert.name} — ${cert.number}` : cert.name}
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div className="leading-tight">
                <p className="text-xs font-bold text-foreground whitespace-nowrap">{cert.name}</p>
                {cert.number && (
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap">{cert.number}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-primary/10 pt-3 text-xs text-muted-foreground sm:text-sm">
        <span>GST: 29ABBCS7101B1ZR (Bangalore) · 09ABBCS7101B1ZT (Noida)</span>
        <Link href="/about-us#certifications" className="shrink-0 font-semibold text-primary hover:underline">
          View credentials
        </Link>
      </div>
    </section>
  );
};

export default CertBadgeStrip;
