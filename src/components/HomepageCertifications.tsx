import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import { ArrowRight, X } from 'lucide-react';

// T6.16 — homepage "Certifications & Recognition" section, placed directly after the
// hero. Copy verbatim from the v2 draft (uniform one-line titles, two-line bodies,
// one "View Certificate" DS button on all four). Certificates are VIEW-ONLY: each
// button opens the watermarked-image lightbox (unchanged from T6.15). Source PDFs
// stay in gitignored private-data/ (not URL-accessible). Card banners + logos are
// local WebP, lazy (none preload before the hero) with explicit dims -> 0 CLS.
// Mobile (<768px): the four cards become a scroll-snap carousel (auto-advance,
// leaf-green dots). Tablet 2x2, desktop 4-across.

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
    title: 'Zero Defect manufacturing',
    body: "ZED Bronze certified under the Government of India's Zero Defect Zero Effect programme for manufacturing quality.",
    cta: 'View Certificate',
    cert: '/homepage/certificates/zed-bronze.webp',
    certAlt: 'ZED Bronze certificate for SAMAN POS India Private Limited (verification copy)',
    certH: 1698,
  },
  {
    bg: '/homepage/cert-bg/cert-bg-msme-factory-floor.webp',
    bgAlt: 'Cabin fabrication line at a SAMAN Portable manufacturing facility',
    logo: '/credentials/optimized/msme-udyam.webp',
    title: 'Registered Indian manufacturer',
    body: "Registered under Udyam with the Ministry of MSME, the Government of India's official registry of manufacturers.",
    cta: 'View Certificate',
    cert: '/homepage/certificates/msme-udyam.webp',
    certAlt: 'Udyam registration certificate for SAMAN POS India Private Limited (verification copy)',
    certH: 1698,
  },
  {
    bg: '/homepage/cert-bg/cert-bg-dpiit-design-studio.webp',
    bgAlt: 'Modular building design and engineering at SAMAN Portable',
    logo: '/credentials/optimized/dpiit-startup.webp',
    title: 'Recognised under Startup India',
    body: 'Recognised by the Department for Promotion of Industry and Internal Trade under the Startup India initiative.',
    cta: 'View Certificate',
    cert: '/homepage/certificates/dpiit-startup.webp',
    certAlt: 'DPIIT Startup India recognition certificate for SAMAN POS India Private Limited (verification copy)',
    certH: 850,
  },
  {
    bg: '/homepage/cert-bg/cert-bg-nsic-dispatch-yard.webp',
    bgAlt: 'Finished portable cabins ready for dispatch at a SAMAN Portable yard',
    logo: '/credentials/optimized/nsic.webp',
    title: 'NSIC registered enterprise',
    body: 'Registered with the National Small Industries Corporation, a Government of India enterprise for small-scale industry.',
    cta: 'View Certificate',
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
      aria-label={`${cert.title}, certificate`}
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
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-colors hover:bg-white hover:text-[var(--ds-surface-inverse)]"
        >
          <X className="h-5 w-5" />
        </button>
        <Image
          src={cert.cert}
          unoptimized={shouldBypassOptimizer(cert.cert)}
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
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[i];
    if (!track || !card) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: card.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  };

  // Mobile carousel: active-dot tracking + 5s auto-advance (loop). Pauses on
  // interaction; no auto-advance under prefers-reduced-motion (manual swipe works).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const mqMobile = window.matchMedia('(max-width: 767px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let io: IntersectionObserver | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let paused = false;
    const pause = () => {
      paused = true;
    };

    const start = () => {
      if (!mqMobile.matches) return;
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const idx = cardRefs.current.indexOf(e.target as HTMLDivElement);
              if (idx >= 0) {
                activeRef.current = idx;
                setActive(idx);
              }
            }
          });
        },
        { root: track, threshold: 0.6 }
      );
      cardRefs.current.forEach((c) => c && io!.observe(c));
      track.addEventListener('pointerdown', pause, { passive: true });
      track.addEventListener('touchstart', pause, { passive: true });
      track.addEventListener('wheel', pause, { passive: true });
      if (!reduce) {
        timer = setInterval(() => {
          if (paused) return;
          goTo((activeRef.current + 1) % CERTS.length);
        }, 5000);
      }
    };
    const stop = () => {
      if (io) io.disconnect();
      io = null;
      if (timer) clearInterval(timer);
      timer = null;
      track.removeEventListener('pointerdown', pause);
      track.removeEventListener('touchstart', pause);
      track.removeEventListener('wheel', pause);
      paused = false;
    };
    const onChange = () => {
      stop();
      start();
    };
    start();
    mqMobile.addEventListener('change', onChange);
    return () => {
      mqMobile.removeEventListener('change', onChange);
      stop();
    };
  }, []);

  return (
    <section className="bg-white py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Compact left-aligned header */}
        <div className="mb-8 max-w-2xl md:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--ds-surface-inverse)_10%,transparent)] bg-[color-mix(in_srgb,var(--ds-surface-inverse)_5%,transparent)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--ds-surface-inverse)]">
            GOVERNMENT RECOGNISED
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Certified. Registered. Verifiable.</h2>
          <p className="text-base font-light leading-relaxed text-gray-600">
            Every credential below is issued by a Government of India body, open the certificate and check it yourself.
          </p>
        </div>

        {/* Cards: mobile carousel (scroll-snap) / tablet 2x2 / desktop 4-across */}
        <div
          ref={trackRef}
          className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-6 md:overflow-visible lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
        >
          {CERTS.map((c, i) => (
            <div
              key={c.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="flex w-full shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg md:w-auto md:shrink"
            >
              {/* Logo-dominant banner (T6.17): photo recedes behind a soft dark overlay;
                  a large white logo tile centered fully inside the banner. */}
              <div className="relative h-[150px] overflow-hidden bg-gray-100">
                <Image src={c.bg} unoptimized={shouldBypassOptimizer(c.bg)} alt={c.bgAlt} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" loading="lazy" className="object-cover" />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-[72%] w-[58%] items-center justify-center rounded-xl bg-white p-4 shadow-lg">
                    <Image src={c.logo} unoptimized={shouldBypassOptimizer(c.logo)} alt="" width={200} height={200} loading="lazy" className="max-h-full max-w-full object-contain" />
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center px-5 pb-5 pt-5 text-center">
                <h3 className="text-base font-bold leading-snug text-gray-900">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-gray-600">{c.body}</p>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border-2 border-[var(--ds-primary)] px-4 py-2 text-sm font-bold text-[var(--ds-surface-inverse)] transition-all hover:bg-[var(--ds-surface-inverse)] hover:text-white"
                >
                  {c.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dots — mobile only */}
        <div className="mt-5 flex justify-center gap-2 md:hidden">
          {CERTS.map((_, i) => (
            <button key={i} type="button" onClick={() => goTo(i)} aria-label={`Go to certificate ${i + 1}`} className="flex items-center p-1.5">
              <span className={`block h-2 rounded-full transition-all duration-300 ${active === i ? 'w-6 bg-[var(--ds-primary)]' : 'w-2 bg-gray-300'}`} />
            </button>
          ))}
        </div>
      </div>

      {open !== null && <CertLightbox cert={CERTS[open]} onClose={() => setOpen(null)} />}
    </section>
  );
};

export default HomepageCertifications;
