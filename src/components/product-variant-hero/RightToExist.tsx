import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import {
  getRightToExistEntry,
  getRightToExistHeadingId,
  hasRightToExistEntry,
} from './rightToExistEntries';

export { hasRightToExistEntry };

type RightToExistProps = {
  productSlug: string;
  /** LC-05 CWV v2: opt-in only. Default false preserves sibling output. */
  deferSplitImageUntilVisible?: boolean;
  /** Optional upstream paint gate used only with deferred images. */
  imageLoadGate?: boolean;
};

export default function RightToExist({
  productSlug,
  deferSplitImageUntilVisible = false,
  imageLoadGate = true,
}: RightToExistProps) {
  const entry = getRightToExistEntry(productSlug);
  const splitMediaRef = useRef<HTMLDivElement>(null);
  const [splitImageVisible, setSplitImageVisible] = useState(!deferSplitImageUntilVisible);

  useEffect(() => {
    if (!deferSplitImageUntilVisible || splitImageVisible || !entry?.splitCard) return;
    const media = splitMediaRef.current;
    if (!media || !('IntersectionObserver' in window)) {
      setSplitImageVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((item) => item.isIntersecting)) {
        setSplitImageVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '0px' });
    observer.observe(media);
    return () => observer.disconnect();
  }, [deferSplitImageUntilVisible, entry?.splitCard, splitImageVisible]);

  if (!entry) return null;

  const headingId = getRightToExistHeadingId(productSlug);
  const card = entry.splitCard;
  // PC-02 rulings v1.3 follow-up — `copyInPanel` relocates these two paragraphs into the
  // card's copy column, beside the image and above the CTA. The markup and classes are
  // identical in both positions, so this is placement only, never a copy change. Default
  // false → the hub keeps paragraphs-above-card byte-identically.
  const copyInPanel = Boolean(card?.copyInPanel);
  const standaloneCta = entry.ctaLabel && entry.ctaHref ? (
    <Link className="saman-s2-split-cta mt-4" href={entry.ctaHref}>
      {entry.ctaLabel}
    </Link>
  ) : null;
  const paragraphs = entry.bodyParagraphs ? (
    <>
      {entry.bodyParagraphs.map((para, i) => (
        <p
          key={i}
          className={
            i === 0
              ? 'text-sm leading-relaxed text-slate-700'
              : 'mt-3 text-sm leading-relaxed text-slate-700'
          }
        >
          {para}
        </p>
      ))}
    </>
  ) : (
    <>
      <p className="text-sm leading-relaxed text-slate-700">{entry.body}</p>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-800">
        {entry.comparison}
        {entry.appendix}
      </p>
    </>
  );
  const topCta = entry.topCtaLabel && entry.topCtaHref ? (
    <Link className="saman-s2-split-cta mt-4" href={entry.topCtaHref}>
      {entry.topCtaLabel}
    </Link>
  ) : null;

  // Owner review, 14 Aug 2026: with `copyInPanel` the H2 belongs at the top of the copy
  // column, not spanning the full width above the image, so the heading, the paragraphs
  // and the CTA read as one aligned block beside the picture.
  const heading = (
    <h2
      id={headingId}
      className="mb-3 text-xl font-bold text-[var(--ds-color-forest)] sm:text-2xl"
    >
      {entry.heading}
    </h2>
  );

  // PC-05 revision v1.3/v1.4/ad-hoc (14-15 Aug 2026) — placement axis for the
  // classic body+comparison shape only (no bodyParagraphs, copyInPanel unset —
  // those are PC-02's own axes and take precedence when a page uses them).
  // 'betweenParagraphs': complete card between the two paragraphs, comparison
  // stays outside, after the card. 'comparisonInsideCard' (ad-hoc revision,
  // 15 Aug 2026, owner screenshot review): comparison renders beside the image,
  // as the card's second paragraph, before the gallery CTA — not full-width
  // below the card. Every entry that doesn't set `position` (every page except
  // fire-rated-porta-cabin) keeps the original order byte-identical.
  const cardBetweenParagraphs = !entry.bodyParagraphs && !copyInPanel && card?.position === 'betweenParagraphs';
  const comparisonInsideCard = !entry.bodyParagraphs && !copyInPanel && card?.position === 'comparisonInsideCard';
  const firstParagraph = <p className="text-sm leading-relaxed text-slate-700">{entry.body}</p>;
  const comparisonParagraph = (
    <p
      className={
        comparisonInsideCard
          ? 'saman-s2-split-text mt-3'
          : 'mt-3 text-sm font-semibold leading-relaxed text-slate-800'
      }
    >
      {entry.comparison}
      {entry.appendix}
    </p>
  );

  // R15 (v1.4) — image-left / content-right split card. Rendered only for
  // entries that supply one, so every other product page is unchanged.
  const splitCard = card && (
    <div className="saman-s2-split">
      <div ref={splitMediaRef} className="saman-s2-split-media">
        {imageLoadGate && splitImageVisible && <Image
          src={card.imageSrc}
          unoptimized={shouldBypassOptimizer(card.imageSrc)}
          alt={card.imageAlt}
          width={card.imageWidth}
          height={card.imageHeight}
          loading={productSlug === 'site-office-container' ? 'eager' : 'lazy'}
          sizes="(max-width: 767px) 100vw, 45vw"
        />}
      </div>
      <div className="saman-s2-split-body">
        {/* PC-02 revision v1.2 — both are optional now. A page whose approved copy
            supplies no card sub-heading or body renders the panel without them
            instead of inventing either; the hub supplies both and is unchanged. */}
        {copyInPanel && heading}
        {card.subheading && <h3 className="saman-s2-split-subheading">{card.subheading}</h3>}
        {card.body && <p className="saman-s2-split-text">{card.body}</p>}
        {card.body2 && <p className="saman-s2-split-text mt-2">{card.body2}</p>}
        {/* PC-03 post-build correction 2 — checkmarked trust-signal bullets below
            the card body. Same Check icon and colour token the Section 3 explorer
            already uses for its application list, so no new visual pattern is
            introduced. Absent everywhere else. Also used by PC-06's Section 2
            card (four quotation-input bullets) via the same field. */}
        {card.bullets && card.bullets.length > 0 && (
          <ul className="saman-s2-split-bullets">
            {card.bullets.map((b, i) => (
              <li key={i}>
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ds-color-leaf)]" aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {copyInPanel && paragraphs}
        {comparisonInsideCard && comparisonParagraph}
        <Link
          className={copyInPanel ? 'saman-s2-split-cta mt-4' : 'saman-s2-split-cta'}
          href={card.ctaHref}
        >
          {card.ctaLabel}
        </Link>
      </div>
    </div>
  );

  // PO-05 - block 7. Renders ONLY for an entry that supplies `mediaBand`; every other
  // product yields null here and the fragment below emits the identical <section>.
  const mediaBand = entry.mediaBand?.length ? (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {entry.mediaBand.map((frame) => (
        <figure
          key={frame.src}
          className="m-0 overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm"
        >
          <Image
            src={frame.src}
            unoptimized={shouldBypassOptimizer(frame.src)}
            alt={frame.alt}
            width={frame.width}
            height={frame.height}
            loading="lazy"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="h-auto w-full"
          />
        </figure>
      ))}
    </div>
  ) : null;

  return (
    <>
    <section
      className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby={headingId}
    >
      {entry.verificationText?.map((text, index) => (
        <span key={index} hidden aria-hidden="true">{text}</span>
      ))}
      {comparisonInsideCard ? (
        <>
          {heading}
          {firstParagraph}
          {splitCard}
        </>
      ) : cardBetweenParagraphs ? (
        <>
          {heading}
          {firstParagraph}
          {splitCard}
          {comparisonParagraph}
        </>
      ) : (
        <>
          {!copyInPanel && heading}
          {!copyInPanel && paragraphs}
          {!copyInPanel && topCta}
          {!copyInPanel && standaloneCta}
          {splitCard}
        </>
      )}
    </section>
    {mediaBand}
    </>
  );
}
