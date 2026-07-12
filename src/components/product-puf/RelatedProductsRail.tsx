import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface RelatedItem {
  title: string;
  href: string;
  image: string;
  category: string;
  blurb: string;
}

// The C15 micro-catalog is exactly 4 fixed pages, so relationships are known
// and hardcoded — no live fetchProducts() query needed (that pattern exists in
// the WooCommerce template for a 150+ product catalog; here it would be
// over-engineering for a 4-item family).
export const PUF_CATALOG: Record<
  'hub' | 'price' | 'roofing' | 'sandwich' | 'house' | 'wall' | 'specification' | 'coldStorage',
  RelatedItem
> = {
  hub: {
    title: 'PUF Panel',
    href: '/product/puf-panel',
    image: '/images/puf-panel/hub-factory-stack-50mm-1200x675.webp',
    category: 'PUF Panels',
    blurb: 'The full factory-made PUF panel range — specs, manufacturing and applications.',
  },
  price: {
    title: 'PUF Panel Price',
    href: '/product/puf-panel/puf-panel-price',
    image: '/images/puf-panel/price-stack-40mm-1200x675.webp',
    category: 'PUF Panels',
    blurb: 'Fixed base rates by thickness, ₹1,050–₹1,470 per sq mt.',
  },
  roofing: {
    title: 'PUF Panel Roofing',
    href: '/product/puf-panel/puf-panel-roofing',
    image: '/images/puf-panel/roofing-installed-shed-40mm-1200x675.webp',
    category: 'PUF Panels',
    blurb: 'Insulated roof sheets in trapezoidal and ribbed profiles.',
  },
  sandwich: {
    title: 'PUF Sandwich Panel',
    href: '/product/puf-panel/puf-sandwich-panel',
    image: '/images/puf-panel/cutaway-detail-30mm-1200x675.webp',
    category: 'PUF Panels',
    blurb: 'The three-layer PUF sheet for wall, roof and cold-room use.',
  },
  house: {
    title: 'PUF Panel House',
    href: '/product/puf-panel/puf-panel-house',
    image: '/images/puf-panel/house/puf-panel-house-installation-wall-roof.webp',
    category: 'PUF Panels',
    blurb: 'Factory-made insulated panel house shells for residential and site use.',
  },
  wall: {
    title: 'PUF Wall Panel',
    href: '/product/puf-panel/puf-wall-panel',
    image: '/images/puf-panel/wall/40mm-puf-wall-panel-stockyard.webp',
    category: 'PUF Panels',
    blurb: 'Insulated wall, partition and ceiling panels, 30–200 mm.',
  },
  specification: {
    title: 'PUF Panel Specification',
    href: '/product/puf-panel/puf-panel-specification',
    image: '/images/puf-panel/spec/50mm-off-white-puf-panel-factory-stack.webp',
    category: 'PUF Panels',
    blurb: 'Owner-verified thickness, size, facing and weight reference.',
  },
  coldStorage: {
    title: 'Cold Storage PUF Panel',
    href: '/product/puf-panel/cold-storage-puf-panel',
    image: '/images/puf-panel/cold-storage/100mm-dairy-cold-storage-room-interior.webp',
    category: 'PUF Panels',
    blurb: 'Insulated panels for cold rooms and freezer rooms, freezer-grade to 150 mm.',
  },
};

// C16 material-family siblings — the shared cross-link set for the single-product
// C16 panel pages (EPS, PIR, and future Glass Wool). Each page renders the others
// as its left sidebar (Ruling 4 / L1 default). Blurbs are Claude-Senior supplied,
// truth-checked against the fixed price matrix and live pages. `puf` reuses the
// already-approved PUF hub rail entry.
export const C16_PANELS: Record<'puf' | 'pir' | 'eps' | 'rockwool' | 'glassWool' | 'sandwich', RelatedItem> = {
  puf: PUF_CATALOG.hub,
  pir: {
    title: 'PIR Panel',
    href: '/product/pir-panel',
    image: '/images/pir-panel/pir-factory-stack-1200x675.webp',
    category: 'PIR Panels',
    blurb: 'Fire-improved polyisocyanurate foam panels for cold rooms, cleanrooms and premium insulation.',
  },
  eps: {
    title: 'EPS Panel',
    href: '/product/eps-panel',
    image: '/images/eps-panel/eps-panel-wall-roof-stack-1x1.webp',
    category: 'EPS Panels',
    blurb: 'Budget-friendly lightweight insulated panels for dry-use walls and partitions. From ₹770 / sq mt.',
  },
  rockwool: {
    title: 'Rockwool Panel',
    href: '/product/rockwool-panel',
    image: '/images/rockwool-panel/rockwool-panel-product-front-sq.webp',
    category: 'Rockwool Panels',
    blurb: 'Non-combustible stone wool core for fire-rated walls and acoustic enclosures. From ₹1,290 / sq mt.',
  },
  glassWool: {
    title: 'Glass Wool Panel',
    href: '/product/glass-wool-panel',
    image: '/images/glass-wool-panel/glass-wool-panel-stack-yellow-core.webp',
    category: 'Glass Wool Panels',
    blurb: 'Acoustic mineral-fibre panels for plant rooms, generator enclosures and fire-conscious walls.',
  },
  sandwich: {
    title: 'Sandwich Panel',
    href: '/product/sandwich-panel',
    image: '/images/sandwich-panel/sandwich-panel-stack-facing-finishes.webp',
    category: 'Sandwich Panels',
    blurb: 'Compare all five insulated cores and choose the right panel for your job. From ₹770 / sq mt.',
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
                onError={(event) => {
                  event.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            {isSidebar ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{item.title}</p>
                <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {item.category}
                </span>
              </div>
            ) : (
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <span className="mt-2 inline-flex w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {item.category}
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
