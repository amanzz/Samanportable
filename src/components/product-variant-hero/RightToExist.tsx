import Image from 'next/image';
import Link from 'next/link';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import {
  getRightToExistEntry,
  getRightToExistHeadingId,
  hasRightToExistEntry,
} from './rightToExistEntries';

export { hasRightToExistEntry };

export default function RightToExist({ productSlug }: { productSlug: string }) {
  const entry = getRightToExistEntry(productSlug);
  if (!entry) return null;

  const headingId = getRightToExistHeadingId(productSlug);
  const card = entry.splitCard;
  // PC-02 rulings v1.3 follow-up — `copyInPanel` relocates these two paragraphs into the
  // card's copy column, beside the image and above the CTA. The markup and classes are
  // identical in both positions, so this is placement only, never a copy change. Default
  // false → the hub keeps paragraphs-above-card byte-identically.
  const copyInPanel = Boolean(card?.copyInPanel);
  const paragraphs = (
    <>
      <p className="text-sm leading-relaxed text-slate-700">{entry.body}</p>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-800">
        {entry.comparison}
        {entry.appendix}
      </p>
    </>
  );

  return (
    <section
      className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="mb-3 text-xl font-bold text-[var(--ds-color-forest)] sm:text-2xl"
      >
        {entry.heading}
      </h2>
      {!copyInPanel && paragraphs}

      {/* R15 (v1.4) — image-left / content-right split card. Rendered only for
          entries that supply one, so every other product page is unchanged. */}
      {card && (
        <div className="saman-s2-split">
          <div className="saman-s2-split-media">
            <Image
              src={card.imageSrc}
              unoptimized={shouldBypassOptimizer(card.imageSrc)}
              alt={card.imageAlt}
              width={card.imageWidth}
              height={card.imageHeight}
              loading="lazy"
              sizes="(max-width: 767px) 100vw, 45vw"
            />
          </div>
          <div className="saman-s2-split-body">
            {/* PC-02 revision v1.2 — both are optional now. A page whose approved copy
                supplies no card sub-heading or body renders the panel without them
                instead of inventing either; the hub supplies both and is unchanged. */}
            {card.subheading && <h3 className="saman-s2-split-subheading">{card.subheading}</h3>}
            {card.body && <p className="saman-s2-split-text">{card.body}</p>}
            {copyInPanel && paragraphs}
            <Link
              className={copyInPanel ? 'saman-s2-split-cta mt-4' : 'saman-s2-split-cta'}
              href={card.ctaHref}
            >
              {card.ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
