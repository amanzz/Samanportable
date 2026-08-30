import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type DeferredCabinCalculatorProps = {
  productId: string;
  ladderKey: string;
  productName: string;
  pageUrl: string;
};

declare global {
  interface Window {
    __samanCabinCalculatorRuntime?: boolean;
  }
}

/**
 * PC-01 performance boundary.
 *
 * The calculator entry band remains server-rendered. The calculator itself is
 * hidden at rest on the live page, so its large form tree and enhancement
 * runtime are requested only when the band approaches the viewport or its CTA
 * is activated. The established SSR renderer remains the sole source of form,
 * price and freight markup after activation.
 */
export default function DeferredCabinCalculator({
  productId,
  ladderKey,
  productName,
  pageUrl,
}: DeferredCabinCalculatorProps) {
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [requested, setRequested] = useState(false);
  const [revealWhileLoading, setRevealWhileLoading] = useState(false);
  const [calculatorHtml, setCalculatorHtml] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const requestCalculator = useCallback((reveal = false) => {
    if (reveal) setRevealWhileLoading(true);
    setRequested(true);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || requested) return;

    if (!('IntersectionObserver' in window)) {
      requestCalculator();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        requestCalculator();
      }
    }, { rootMargin: '900px 0px' });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [requestCalculator, requested]);

  useEffect(() => {
    if (calculatorHtml) return;

    const entryLink = document.querySelector<HTMLAnchorElement>(
      '[data-calculator-entry] a[href="#cabin-calculator"]'
    );
    if (!entryLink) return;

    const activateFromEntry = (event: MouseEvent) => {
      event.preventDefault();
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#cabin-calculator`);
      requestCalculator(true);
    };

    entryLink.addEventListener('click', activateFromEntry);
    return () => entryLink.removeEventListener('click', activateFromEntry);
  }, [calculatorHtml, requestCalculator]);

  useEffect(() => {
    if (!requested || calculatorHtml || loadFailed) return;
    let cancelled = false;

    void import('@/lib/cabinCalculatorSSR')
      .then(({ renderCabinCalculatorSSR }) => {
        if (cancelled) return;
        setCalculatorHtml(renderCabinCalculatorSSR({
          embedded: true,
          config: { productId: productId as never },
          ladderKey,
          productName,
          pageUrl,
        }));
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [calculatorHtml, ladderKey, loadFailed, pageUrl, productId, productName, requested]);

  useEffect(() => {
    if (!calculatorHtml) return;

    const revealActivatedCalculator = () => {
      if (!revealWhileLoading) return;
      const section = sectionRef.current;
      if (!section) return;
      section.hidden = false;
      section.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
      window.setTimeout(() => {
        section.querySelector<HTMLElement>('input, select, textarea, button, a[href]')?.focus();
      }, 0);
    };

    if (window.__samanCabinCalculatorRuntime) {
      revealActivatedCalculator();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-pc01-calculator-runtime]');
    const script = existing || document.createElement('script');
    const onReady = () => revealActivatedCalculator();
    script.addEventListener('load', onReady, { once: true });

    if (!existing) {
      script.src = '/scripts/cabin-cost-calculator.js';
      script.async = true;
      script.dataset.pc01CalculatorRuntime = 'true';
      document.head.appendChild(script);
    }

    return () => script.removeEventListener('load', onReady);
  }, [calculatorHtml, revealWhileLoading]);

  return (
    <>
      <span ref={sentinelRef} className="block h-px" aria-hidden="true" />
      <section
        ref={sectionRef}
        className="mt-4"
        id="cabin-calculator"
        hidden={!revealWhileLoading}
        aria-busy={requested && !calculatorHtml && !loadFailed ? 'true' : undefined}
      >
        {calculatorHtml ? (
          <div dangerouslySetInnerHTML={{ __html: calculatorHtml }} />
        ) : (
          <div className="min-h-[720px] rounded-xl border border-slate-200 bg-white p-6 sm:min-h-[900px]" role="status">
            <p className="text-base font-semibold text-slate-900">
              {loadFailed ? 'The embedded calculator could not be loaded.' : 'Loading price calculator…'}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              <Link className="font-semibold text-[#0A3D2A] underline" href="/portable-cabin-price-calculator">
                Open the standalone price calculator
              </Link>
            </p>
          </div>
        )}
      </section>
      <noscript>
        <p className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
          JavaScript is optional.{' '}
          <Link className="font-semibold text-[#0A3D2A] underline" href="/portable-cabin-price-calculator">
            Open the standalone price calculator
          </Link>
          {' '}to use the maintained no-JavaScript quotation form.
        </p>
      </noscript>
    </>
  );
}
