import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import {
  makeCalculatorPageUrl,
  resolveEmbeddedCalculatorProduct,
} from '@/lib/cabinCalculatorEmbedRoutes';

// These clusters use bespoke page sources whose full audit found no calculator
// mount call. This is a template-gap scope, not a copy of route classification;
// the resolver below remains the only authority on prefill behaviour.
const LAYOUT_FALLBACK_TEMPLATE_CLUSTERS = new Set([
  'eps-panel',
  'glass-wool-panel',
  'pir-panel',
  'puf-panel',
  'rockwool-panel',
  'roofing-sheet',
  'sandwich-panel',
  'wall-sheet',
]);

function fallbackRoute(pathnameValue: string) {
  // Every scoped template has a fixed filesystem route, so pathname is stable
  // during SSG and the first client render. asPath is not: its build-time and
  // hydration values can differ and force React to replace the page subtree.
  const pathname = pathnameValue.replace(/\/$/, '');
  const parts = pathname.split('/').filter(Boolean);
  const category = parts[0] === 'product' && parts[1] ? decodeURIComponent(parts[1]) : '';
  const slug = parts[2] ? decodeURIComponent(parts[2]) : undefined;
  const mapping = category && parts.length <= 3 && LAYOUT_FALLBACK_TEMPLATE_CLUSTERS.has(category)
    ? resolveEmbeddedCalculatorProduct(category, slug)
    : null;
  return { category, slug, shouldMount: Boolean(mapping && !mapping.prefill) };
}

export function needsProductCalculatorLayoutFallback(pathnameValue: string) {
  return fallbackRoute(pathnameValue).shouldMount;
}

export function needsProductCalculatorLayoutStreamGuard(pathnameValue: string) {
  const { category, shouldMount } = fallbackRoute(pathnameValue);
  return shouldMount && category !== 'sandwich-panel' && category !== 'roofing-sheet';
}

export default function ProductCalculatorLayoutFallback() {
  const router = useRouter();
  const { category, slug, shouldMount } = fallbackRoute(router.pathname || '');
  const pageUrl = makeCalculatorPageUrl(category, slug);
  const host = useRef<HTMLDivElement>(null);
  const [clientCalculator, setClientCalculator] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!shouldMount) return undefined;
    if (
      host.current?.dataset.calculatorRoute === pageUrl
      && host.current.querySelector('.cabin-calculator-ssr')
    ) return undefined;

    // This below-fold module is deliberately scheduled after the first-paint
    // window so fast static product pages keep their locked LCP. The reserved
    // slot prevents its later insertion from moving the footer.
    const mountDelay = category === 'sandwich-panel' || category === 'roofing-sheet' ? 5000 : 600;
    const timer = window.setTimeout(() => {
      void import('@/lib/cabinCalculatorSSR').then((renderer) => {
        if (cancelled) return;
        setClientCalculator(renderer.renderCabinCalculatorSSR({
          embedded: true,
          pageUrl,
        }));
      });
    }, mountDelay);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [category, pageUrl, shouldMount]);

  useEffect(() => {
    if (!shouldMount) return undefined;
    const main = host.current?.closest('main');
    main?.classList.add('calculator-layout-ready');
    return () => main?.classList.remove('calculator-layout-ready');
  }, [pageUrl, shouldMount]);

  if (!shouldMount) return null;

  return (
    <section className="mt-4 calculator-layout-fallback" id="cabin-calculator">
      <Script src="/scripts/cabin-cost-calculator.js" strategy="afterInteractive" />
      <div
        id="calculator-layout-fallback-host"
        data-calculator-route={pageUrl}
        ref={host}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: clientCalculator || '' }}
      />
    </section>
  );
}
