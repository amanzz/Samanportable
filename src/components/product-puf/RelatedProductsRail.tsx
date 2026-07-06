import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export interface RelatedItem {
  title: string;
  href: string;
  image: string;
  blurb: string;
}

// The C15 micro-catalog is exactly 4 fixed pages, so relationships are known
// and hardcoded — no live fetchProducts() query needed (that pattern exists in
// the WooCommerce template for a 150+ product catalog; here it would be
// over-engineering for a 4-item family).
export const PUF_CATALOG: Record<'hub' | 'price' | 'roofing' | 'sandwich', RelatedItem> = {
  hub: {
    title: 'PUF Panel',
    href: '/product/puf-panel',
    image: '/images/puf-panel/hub-factory-stack-50mm-1200x675.webp',
    blurb: 'The full factory-made PUF panel range — specs, manufacturing and applications.',
  },
  price: {
    title: 'PUF Panel Price',
    href: '/product/puf-panel/puf-panel-price',
    image: '/images/puf-panel/price-stack-40mm-1200x675.webp',
    blurb: 'Fixed base rates by thickness, ₹1,050–₹1,470 per sq mt.',
  },
  roofing: {
    title: 'PUF Panel Roofing',
    href: '/product/puf-panel/puf-panel-roofing',
    image: '/images/puf-panel/roofing-installed-shed-40mm-1200x675.webp',
    blurb: 'Insulated roof sheets in trapezoidal and ribbed profiles.',
  },
  sandwich: {
    title: 'PUF Sandwich Panel',
    href: '/product/puf-panel/puf-sandwich-panel',
    image: '/images/puf-panel/cutaway-detail-30mm-1200x675.webp',
    blurb: 'The three-layer PUF sheet for wall, roof and cold-room use.',
  },
};

interface RelatedProductsRailProps {
  items: RelatedItem[];
  heading?: string;
  /** 'grid' = standard multi-column card grid (bottom-of-page / HUB nav grid).
   *  'sidebar' = single-column compact list for the 3-column top layout's left
   *  rail. Uses h3 (not h2) since it sits ahead of the page H1 in DOM order
   *  inside the sidebar column, keeping heading hierarchy valid. */
  variant?: 'grid' | 'sidebar';
}

const RelatedProductsRail = ({ items, heading = 'Related PUF Panel Products', variant = 'grid' }: RelatedProductsRailProps) => {
  const isSidebar = variant === 'sidebar';
  const Heading = isSidebar ? 'h3' : 'h2';

  return (
    <section aria-label="Related PUF panel products">
      <Heading className={isSidebar ? 'mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground' : 'mb-4 text-xl font-bold text-foreground sm:text-2xl'}>
        {heading}
      </Heading>
      <div className={isSidebar ? 'space-y-3' : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              isSidebar
                ? 'group flex items-center gap-3 rounded-xl border border-border bg-background p-2 shadow-sm transition-shadow hover:shadow-md'
                : 'group flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md'
            }
          >
            <div className={isSidebar ? 'relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted' : 'relative aspect-video w-full overflow-hidden bg-muted'}>
              <Image
                src={item.image}
                alt={item.title}
                width={isSidebar ? 112 : 400}
                height={isSidebar ? 112 : 225}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            {isSidebar ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{item.title}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  View <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </span>
              </div>
            ) : (
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-1 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                </div>
                <p className="mb-3 flex-1 text-sm text-muted-foreground">{item.blurb}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  View <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedProductsRail;
