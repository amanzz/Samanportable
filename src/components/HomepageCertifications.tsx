import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, X } from 'lucide-react';

// T6.15 — homepage "Certifications & Recognition" section. Copy verbatim from the
// draft. Certificates are VIEW-ONLY (owner v2 rule): each CTA opens an on-page
// lightbox showing the certificate as a watermarked image — no PDF link, no
// download. The source PDFs live in gitignored private-data/ and are not
// URL-accessible. Card background + logo images are local WebP (lazy, explicit
// dims -> 0 CLS). Distinct from the existing CertificationsSection (ISO/GST page).

type Cert = {
  bg: string;
  bgAlt: string;
  logo: string;
  title: string;
  body: string;
  cta: string;
  cert: string;
  certAlt: string;
  certH: number;
};

const CERTS: Cert[] = [
  {
    bg: '/homepage/cert-bg/cert-bg-zed-quality-inspection.webp',
    bgAlt: 'Quality inspection of insulated panels at a SAMAN Portable factory',
    logo: '/credentials/optimized/zed-bronze.webp',
    title: 'Zero Defect manufacturing, certified',
    body: "SAMAN Portable holds ZED Bronze certification under the Government of India's Zero Defect Zero Effect programme — a manufacturing quality standard covering how our cabins and panels are built.",
    cta: 'View ZED Bronze certificate',
    cert: '/homepage/certificates/zed-bronze.webp',
    certAlt: 'ZED Bronze certificate for SAMAN POS India Private Limited (verification copy)',
    certH: 1698,
  },
  {
    bg: '/homepage/cert-bg/cert-bg-msme-factory-floor.webp',
    bgAlt: 'Cabin fabrication line at a SAMAN Portable manufacturing facility',
    logo: '/credentials/optimized/msme-udyam.webp',
    title: 'A registered Indian manufacturer',
    body: "Registered under Udyam with the Ministry of MSME, Government of India — the official registry of the country's manufacturing enterprises.",
    cta: 'View Udyam certificate',
    cert: '/homepage/certificates/msme-udyam.webp',
    certAlt: 'Udyam registration certificate for SAMAN POS India Private Limited (verification copy)',
    certH: 1698,
  },
  {
    bg: '/homepage/cert-bg/cert-bg-dpiit-design-studio.webp',
    bgAlt: 'Modular building design and engineering at SAMAN Portable',
    logo: '/credentials/optimized/dpiit-startup.webp',
    title: 'Recognised under Startup India',
    body: 'Recognised by the Department for Promotion of Industry and Internal Trade (DPIIT) under the Startup India initiative.',
    cta: 'View DPIIT certificate',
    cert: '/homepage/certificates/dpiit-startup.webp',
    certAlt: 'DPIIT Startup India recognition certificate for SAMAN POS India Private Limited (verification copy)',
    certH: 850,
  },
  {
    bg: '/homepage/cert-bg/cert-bg-nsic-dispatch-yard.webp',
    bgAlt: 'Finished portable cabins ready for dispatch at a SAMAN Portable yard',
    logo: '/credentials/optimized/nsic.webp',
    title: 'NSIC registered enterprise',
    body: 'Registered with the National Small Industries Corporation — a Government of India enterprise supporting qualified small-scale manufacturers.',
    cta: 'View NSIC certificate',
    cert: '/homepage/certificates/nsic.webp',
    certAlt: 'NSIC registration document for SAMAN POS India Private Limited (verification copy)',
    certH: 1695,
  },
];

const CertLightbox = ({ cert, onClose }: { cert: Cert; onClose: () => void }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
        ).filter((el) => !el.hasAttribute('disabled'));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} — certificate`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 transition-opacity duration-200 motion-reduce:transition-none"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close certificate"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-colors hover:bg-white hover:text-[#0A3D2A]"
        >
          <X className="h-5 w-5" />
        </button>
        <Image
          src={cert.cert}
          alt={cert.certAlt}
          width={1200}
          height={cert.certH}
          className="mx-auto h-auto max-h-[85vh] w-auto object-contain"
        />
      </div>
    </div>
  );
};

const HomepageCertifications = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0A3D2A]/10 bg-[#0A3D2A]/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0A3D2A]">
            GOVERNMENT RECOGNISED
          </div>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Certified. Registered. Verifiable.</h2>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-600">
            Every credential below is issued by a Government of India body — open the certificate and check it yourself.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CERTS.map((c, i) => (
            <div key={c.title} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="relative h-40 overflow-hidden bg-gray-100">
                <Image src={c.bg} alt={c.bgAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" loading="lazy" className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl bg-white p-3 shadow-md">
                    <Image src={c.logo} alt="" width={64} height={64} loading="lazy" className="h-full w-auto object-contain" />
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold leading-snug text-gray-900">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-gray-600">{c.body}</p>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group mt-4 inline-flex items-center gap-1.5 self-start text-sm font-bold text-[#0A3D2A] transition-colors hover:text-[#082F20]"
                >
                  {c.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {open !== null && <CertLightbox cert={CERTS[open]} onClose={() => setOpen(null)} />}
    </section>
  );
};

export default HomepageCertifications;
