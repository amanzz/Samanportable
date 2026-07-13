import type { ReactNode } from 'react';

type ProductSummaryLayoutProps = {
  rail: ReactNode;
  gallery: ReactNode;
  description: ReactNode;
  mobileRail: ReactNode;
};

const ProductSummaryLayout = ({ rail, gallery, description, mobileRail }: ProductSummaryLayoutProps) => {
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
