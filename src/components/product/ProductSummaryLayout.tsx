import type { ReactNode } from 'react';

type ProductSummaryLayoutVariant = 'rail-left' | 'summary-first';

type ProductSummaryLayoutProps = {
  rail: ReactNode;
  gallery: ReactNode;
  description: ReactNode;
  mobileRail: ReactNode;
  /**
   * Column template + order (T28 amendment — bespoke pages keep their
   * approved presentation):
   * - 'rail-left'     (default): the pre-T28 bespoke layout — rail 240px /
   *                   gallery 1fr / description 420px, rail on the left.
   * - 'summary-first': the T28 generic-template layout — summary 35fr /
   *                   gallery 40fr / related 25fr, summary on the left.
   *
   * BOTH variants share the containment contract: the gallery column
   * establishes the row height; the rail and description columns are
   * position:relative shells whose content lives in an absolute-inset
   * overflow-y-auto wrapper, so they can never grow the row or bleed over
   * the sections below — they scroll internally instead. Below lg: single
   * column, natural height, no inner scroll, order image → summary → related.
   */
  variant?: ProductSummaryLayoutVariant;
};

const ProductSummaryLayout = ({ rail, gallery, description, mobileRail, variant = 'rail-left' }: ProductSummaryLayoutProps) => {
  if (variant === 'summary-first') {
    // T28 — generic product template: summary 35 / gallery 40 / related 25
    // (fr units so the ratio holds exactly after the grid gaps — raw
    // percentages plus gap would overflow the container).
    return (
      <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,35fr)_minmax(0,40fr)_minmax(0,25fr)]">
        {/* Column 1 (35%) — product summary; scrolls internally on overflow */}
        <div className="order-2 min-w-0 lg:relative lg:order-none lg:min-h-0">
          <div className="lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-2">{description}</div>
        </div>

        {/* Column 2 (40%) — image gallery; establishes the row height */}
        <div className="order-1 min-w-0 lg:order-none">{gallery}</div>

        {/* Column 3 (25%) — related products; contained, scrolls internally */}
        <aside className="order-3 hidden lg:relative lg:order-none lg:block lg:min-h-0">
          <div className="lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">{rail}</div>
        </aside>

        <div className="order-3 lg:hidden">{mobileRail}</div>
      </div>
    );
  }

  // 'rail-left' — pre-T28 bespoke layout, restored byte-exact.
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
