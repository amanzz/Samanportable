'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import type { RelatedRailItem } from '@/lib/c16PanelCatalog';

// R11 (v1.3) / R13 (v1.4, 14 Aug 2026) — "You may also like", rendered between
// the calculator and the Product Details tabs on the porta-cabins hub only.
// v1.4 changes the LAYOUT ONLY: the wrapping grid became a single-row carousel.
// The card design (16:9 image, hover lift, image zoom, name, built-for line,
// "View details" CTA, whole-card link, no prices) is unchanged from v1.3.
//
// Consumes the same 10-item list as the hero's Column 3 rail
// (PORTA_CABIN_HUB_RAIL) — same titles, hrefs and "Built for" copy, no
// duplicated data. No prices: six of the ten children carry an unconfirmed
// "Derived planning estimate" price in the SSOT.
const ROTATE_MS = 4000;

// PC-01 (14 Aug 2026) — `subline` is opt-in. Omitted (undefined) keeps the hub's
// deployed sentence byte-identical; `null` renders no sub-line at all, which is what
// the MS page passes: its approved copy supplies no sub-line for this component and
// the hub's "Ten more…" sentence is untrue on a page that lists nine siblings.
export default function PortaCabinsYouMayAlsoLike({
  items,
  subline,
  useItemImageAltVerbatim = false,
}: {
  items: RelatedRailItem[];
  subline?: string | null;
  useItemImageAltVerbatim?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Cards visible at the current breakpoint — mirrors the CSS flex-basis rules
  // so the dot count and the clamp match what the viewport actually shows.
  useEffect(() => {
    const read = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setReduceMotion(mq.matches);
    read();
    mq.addEventListener('change', read);
    return () => mq.removeEventListener('change', read);
  }, []);

  const maxIndex = Math.max(0, items.length - perView);
  const clamped = Math.min(index, maxIndex);

  const go = useCallback(
    (next: number) => setIndex(next < 0 ? maxIndex : next > maxIndex ? 0 : next),
    [maxIndex]
  );

  // Auto-rotation: paused on hover/focus, and disabled entirely under
  // prefers-reduced-motion (manual controls still work).
  useEffect(() => {
    if (paused || reduceMotion || items.length <= perView) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, ROTATE_MS);
    return () => window.clearInterval(t);
  }, [paused, reduceMotion, maxIndex, perView, items.length]);

  const offsetPct = useMemo(
    () => (perView > 0 ? (clamped * 100) / perView : 0),
    [clamped, perView]
  );

  return (
    <section
      className="saman-youmaylike"
      aria-roledescription="carousel"
      aria-label="You may also like"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <h2 className="text-2xl font-bold">You may also like</h2>
      {subline !== null && (
        <p className="sub">{subline ?? 'Ten more porta cabin configurations, built on the same platform.'}</p>
      )}

      <div
        className="saman-ymal-viewport"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? clamped + 1 : clamped - 1);
          touchStartX.current = null;
        }}
      >
        <div
          className="saman-ymal-track"
          style={{ transform: `translateX(-${offsetPct}%)` }}
        >
          {items.map((item, i) => {
            const visible = i >= clamped && i < clamped + perView;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="saman-ymal-card"
                aria-hidden={visible ? undefined : true}
                tabIndex={visible ? undefined : -1}
              >
                <div className="img">
                  {item.imageSrc ? (
                    <Image
                      src={item.imageSrc}
                      unoptimized={shouldBypassOptimizer(item.imageSrc)}
                      alt={useItemImageAltVerbatim ? (item.imageAlt || item.title) : `You may also like card for ${item.imageAlt || item.title}`}
                      width={400}
                      height={225}
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="body">
                  <p className="name">{item.title}</p>
                  <p className="for">{item.blurb}</p>
                  <p className="cta">View details</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="saman-ymal-controls">
        <button
          type="button"
          className="saman-ymal-arrow"
          aria-label="Previous products"
          onClick={() => go(clamped - 1)}
        >
          <span aria-hidden="true">&#8592;</span>
        </button>
        <button
          type="button"
          className="saman-ymal-arrow"
          aria-label="Next products"
          onClick={() => go(clamped + 1)}
        >
          <span aria-hidden="true">&#8594;</span>
        </button>
        <div className="saman-ymal-dots" role="tablist" aria-label="Carousel position">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              className="saman-ymal-dot"
              aria-current={i === clamped}
              aria-label={`Show products ${i + 1} to ${Math.min(i + perView, items.length)}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
