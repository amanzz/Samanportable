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

  // Ad-hoc revision (15 Aug 2026, owner instruction) — when the comparison
  // paragraph moves inside the split card, it takes the card's own body
  // typography (saman-s2-split-text) instead of the outside bold styling, so
  // it reads as the card's second paragraph rather than a mismatched insert.
  const insideCard = card?.position === 'comparisonInsideCard';
  const comparisonParagraph = (
    <p
      className={
        insideCard
          ? 'saman-s2-split-text'
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
        <h3 className="saman-s2-split-subheading">{card.subheading}</h3>
        <p className="saman-s2-split-text">{card.body}</p>
        {insideCard && comparisonParagraph}
        <Link className="saman-s2-split-cta" href={card.ctaHref}>
          {card.ctaLabel}
        </Link>
      </div>
    </div>
  );

  // PC-05 revision v1.3 (14 Aug 2026) — SAMAN instruction: the split card
  // moves between the two paragraphs instead of after both, so the
  // comparison paragraph's own CTA becomes the closing line rather than
  // sitting immediately above the card's CTA. Opt-in per entry
  // (`splitCardPosition`); every entry that doesn't set it (every page
  // except fire-rated-porta-cabin) keeps the original order byte-identical.
  const cardBetweenParagraphs = card?.position === 'betweenParagraphs';

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
      <p className="text-sm leading-relaxed text-slate-700">{entry.body}</p>
      {insideCard ? (
        splitCard
      ) : cardBetweenParagraphs ? (
        <>
          {splitCard}
          {comparisonParagraph}
        </>
      ) : (
        <>
          {comparisonParagraph}
          {splitCard}
        </>
      )}
    </section>
  );
}
