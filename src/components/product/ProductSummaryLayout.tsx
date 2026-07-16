import type { ReactNode } from 'react';

type ProductSummaryLayoutProps = {
  rail: ReactNode;
  gallery: ReactNode;
  description: ReactNode;
  mobileRail: ReactNode;
};

/**
 * T28 — product-hero: contained 3-column equal-height layout.
 *
 * Desktop (lg+): summary 35 / gallery 40 / related 25 (fr units so the ratio
 * holds exactly after the grid gaps — raw percentages plus gap would overflow
 * the container). The GALLERY column establishes the row height; the summary
 * and related columns are position:relative shells whose content lives in an
 * absolute-inset overflow-y-auto wrapper, so they can never grow the row or
 * bleed over the sections below — they scroll internally instead.
 *
 * Below lg: single column, natural height, no inner scroll, in the order
 * image → summary → related (via order utilities; DOM order puts the summary
 * first for reading order at lg+).
 */
const ProductSummaryLayout = ({ rail, gallery, description, mobileRail }: ProductSummaryLayoutProps) => {
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
};

export default ProductSummaryLayout;
