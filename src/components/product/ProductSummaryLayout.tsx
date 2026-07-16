import type { ReactNode } from 'react';

type ProductSummaryLayoutVariant = 'rail-left' | 'summary-first';

type ProductSummaryLayoutProps = {
  rail: ReactNode;
  gallery: ReactNode;
  description: ReactNode;
  mobileRail: ReactNode;
  /**
   * Column template + order:
   * - 'rail-left'     (default): the pre-T28 bespoke layout — rail 240px /
   *                   gallery 1fr / description 420px; description in a
   *                   contained scroll wrapper. Bespoke pages (polycarbonate,
   *                   pvc, wall-sheet) — byte-identical to their approved
   *                   presentation.
   * - 'summary-first': the generic-template layout (name retained across
   *                   T28 amendments; geometry per Amendment 4 FINAL) —
   *                   see the comment on the branch below.
   */
  variant?: ProductSummaryLayoutVariant;
};

const ProductSummaryLayout = ({ rail, gallery, description, mobileRail, variant = 'rail-left' }: ProductSummaryLayoutProps) => {
  if (variant === 'summary-first') {
    // T28 Amendment 4 (FINAL) — generic product surfaces.
    // Desktop lg+: RELATED 25fr LEFT · GALLERY 40fr CENTER · SUMMARY 35fr RIGHT,
    // one grid row, items-stretch → all three columns share ONE bottom edge:
    //   · summary flows naturally (NO inner scroll) and drives the row height
    //     in the common case;
    //   · gallery is a flex-col whose zone-CTA row stretches (flex-1) to absorb
    //     any remaining space, so its bottom edge always meets the row bottom;
    //   · related contributes nothing to row height — its card list lives in an
    //     absolute-inset overflow-y-auto wrapper (visible thin scrollbar via
    //     .t28-rail-scroll) and scrolls internally when cards exceed the row.
    // Below lg: single column in plain DOM order — gallery (image → thumbnails
    // → zone contacts) → summary → related LAST — natural heights, no nested
    // scroll boxes (all containment classes are lg-prefixed).
    return (
      <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,25fr)_minmax(0,40fr)_minmax(0,35fr)]">
        {/* Column 1 (25fr) — related products; contained, scrolls internally */}
        <aside className="hidden lg:relative lg:block lg:min-h-0">
          <div className="t28-rail-scroll lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">{rail}</div>
        </aside>

        {/* Column 2 (40fr) — image gallery; zone CTAs stretch to the row bottom */}
        <div className="min-w-0">{gallery}</div>

        {/* Column 3 (35fr) — summary; natural flow, drives the row height */}
        <div className="min-w-0">{description}</div>

        <div className="lg:hidden">{mobileRail}</div>
      </div>
    );
  }

  // 'rail-left' — pre-T28 bespoke layout, byte-exact.
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[240px_minmax(0,1fr)_420px]">
      <aside className="order-3 hidden lg:relative lg:order-none lg:block lg:min-h-0">
        <div className="lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">{rail}</div>
      </aside>

      <div className="order-1 min-w-0 lg:order-none">{gallery}</div>

      <div className="order-2 lg:relative lg:order-none lg:min-h-0">
        <div className="lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-2">{description}</div>
      </div>

      <div className="order-3 lg:hidden">{mobileRail}</div>
    </div>
  );
};

export default ProductSummaryLayout;
