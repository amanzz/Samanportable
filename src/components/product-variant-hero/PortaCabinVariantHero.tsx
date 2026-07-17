'use client';
// T24.1 FINAL HERO LAYOUT (supersedes all prior hero-layout revisions).
// Desktop >=1024: THREE columns, one row, equal bottom edges (T28 universal
// rule) — related rail 25 / gallery 40 / info-only buy box 35. The gallery
// column's natural height drives the row; both side columns are full-height
// shells whose content scrolls internally on overflow (.t28-rail-scroll),
// exactly like ProductSummaryLayout variant="summary-first".
// Mobile <1024 (stacked): image+thumbs -> zone contacts -> buy-box info ->
// compare-table cards -> related products LAST; sticky bottom bar keeps the
// price + solid "Get a Quote" (the mobile conversion path).
// Interactive chip/gallery swap is the ONLY client state (T0 rule). Pages
// Router — full SSR HTML on first load; 'use client' is documentation-only,
// matching ds/SizeVariantChips.tsx.
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Download, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dsCssVariables } from '@/components/ds/tokens';
import ProductZoneCtas from '@/components/product/ProductZoneCtas';
import RelatedProductRail from '@/components/product/RelatedProductRail';
import type { RelatedRailItem } from '@/lib/c16PanelCatalog';
import type { VariantProductData } from './types';
import { formatIndianPrice } from './types';
import applicationsData from '@/data/products/porta-cabins-applications.json';

interface ApplicationPanel {
  sizeSlug: string;
  h3: string;
  paragraph: string;
  applications: string[];
}
interface ApplicationsData {
  h2: string;
  intro: string;
  panels: ApplicationPanel[];
}
const APPLICATIONS = applicationsData as ApplicationsData;

// Application-panel alt: "Elevated view of {size} ft porta cabin used as
// {first application}" — first checkmark lowercased + final word singularised
// (matches the owner's example: "…used as project and site office"). Unique per
// size, and distinct from the gallery alts (page-wide alt uniqueness).
const applicationAlt = (label: string, firstApp: string) => {
  const phrase = (firstApp.charAt(0).toLowerCase() + firstApp.slice(1)).replace(/s$/, '');
  return `Elevated view of ${label.replace('x', '×')} porta cabin used as ${phrase}`;
};

const EnquiryDialog = dynamic(() => import('@/components/EnquiryDialog'), { ssr: false });

interface PortaCabinVariantHeroProps {
  data: VariantProductData;
  productTitle: string;
  averageRating: string;
  ratingCount: number;
  railItems: RelatedRailItem[];
  currentHref: string;
}

// Star row for the review badge (Amendment G v2 — real rating: 4.6 from the 5
// SAMAN-verified reviews only). Renders solely when ratingCount > 0.
const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
  ));

// Deep-linkable size fragments (L12-safe: hash only, NEVER query params — the
// URL path/canonical/sitemap/schema stay identical, zero SEO surface change).
// The hero and the applications explorer are DECOUPLED, each with its own
// fragment namespace: #size-{WxL} (hero) and #sizedetails-{WxL} (explorer).
const sizeFragment = (sizeSlug: string) => `size-${sizeSlug}`;
const detailsFragment = (sizeSlug: string) => `sizedetails-${sizeSlug}`;
const SIZE_HASH_RE = /^#size-([0-9]+x[0-9]+)$/;
const DETAILS_HASH_RE = /^#sizedetails-([0-9]+x[0-9]+)$/;
const APPLICATIONS_SECTION_ID = 'porta-size-applications';

// ₹/sq ft display values — OFFICIAL owner-supplied figures (each = priceExGst /
// areaSqft exactly). Kept as literals here (not a data-file change) so they render
// verbatim as specified. Keyed by sizeSlug.
const PRICE_PER_SQFT: Record<string, string> = {
  '10x10': '1,375', '20x8': '1,375', '20x10': '1,250', '20x12': '1,200',
  '30x10': '1,200', '40x8': '1,175', '20x20': '1,175', '40x10': '1,175', '40x12': '1,150',
};


export function PortaCabinVariantHero({
  data,
  productTitle,
  averageRating,
  ratingCount,
  railItems,
  currentHref,
}: PortaCabinVariantHeroProps) {
  const defaultIndex = Math.max(
    0,
    data.variants.findIndex((v) => v.sizeSlug === data.defaultVariant)
  );
  // DECOUPLED selection: the hero and the explorer each own their own index.
  const [heroIndex, setHeroIndex] = useState(defaultIndex);
  const [explorerIndex, setExplorerIndex] = useState(defaultIndex);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // Which size the enquiry dialog quotes (set at the moment a Get Quote is
  // clicked; never changes hero/explorer selection).
  const [quoteIndex, setQuoteIndex] = useState(defaultIndex);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const heroActive = data.variants[heroIndex];
  const heroImages = heroActive.images.length > 0 ? heroActive.images : null;

  // Hero chips: change ONLY the hero; write #size-{WxL} (replaceState — no
  // navigation, no scroll, no history entry).
  const selectHero = (index: number) => {
    setHeroIndex(index);
    setActiveImageIndex(0);
    window.history.replaceState(null, '', `#${sizeFragment(data.variants[index].sizeSlug)}`);
  };

  // Explorer tabs: change ONLY the explorer panel; write #sizedetails-{WxL}.
  const selectExplorer = (index: number) => {
    setExplorerIndex(index);
    window.history.replaceState(null, '', `#${detailsFragment(data.variants[index].sizeSlug)}`);
  };

  // Get Quote (from either surface) opens the dialog for that size only.
  const openQuote = (index: number) => {
    setQuoteIndex(index);
    setShowEnquiry(true);
  };

  // On load: #size-{WxL} pre-selects the hero only; #sizedetails-{WxL}
  // pre-selects the explorer only and scrolls it into view; no hash → both stay
  // at the 20x10 default. The URL carries one fragment, so at most one applies.
  // Runs once after hydration (hash invisible to SSR → no mismatch).
  useEffect(() => {
    const hash = window.location.hash;
    const m1 = hash.match(SIZE_HASH_RE);
    if (m1) {
      const i = data.variants.findIndex((v) => v.sizeSlug === m1[1]);
      if (i >= 0) {
        setHeroIndex(i);
        setActiveImageIndex(0);
      }
      return;
    }
    const m2 = hash.match(DETAILS_HASH_RE);
    if (m2) {
      const i = data.variants.findIndex((v) => v.sizeSlug === m2[1]);
      if (i >= 0) {
        setExplorerIndex(i);
        document.getElementById(APPLICATIONS_SECTION_ID)?.scrollIntoView({ block: 'start' });
      }
    }
    // Mount-only by design: later edits go through selectHero / selectExplorer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------------------------ */
  /* Column pieces. Desktop and mobile branches both render these, CSS-  */
  /* toggled by breakpoint (established pattern on this page). Factories */
  /* so the H1 exists exactly once per page (mobile = real h1).          */
  /* ------------------------------------------------------------------ */

  const galleryColumn = (
    <Card className="p-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm lg:h-full lg:flex lg:flex-col">
      <div className="space-y-2 lg:flex lg:flex-1 lg:flex-col">
        <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden relative">
          {heroImages ? (
            <Image
              key={heroImages[activeImageIndex].src}
              src={heroImages[activeImageIndex].src}
              alt={heroImages[activeImageIndex].alt}
              width={heroImages[activeImageIndex].width}
              height={heroImages[activeImageIndex].height}
              className="w-full h-full object-cover"
              // LCP: ONLY the default variant's first image is priority — next/image
              // then emits loading=eager + fetchpriority=high + <link rel=preload>.
              // Every other image (priority=false) defaults to loading=lazy. Passing
              // an explicit `loading` alongside `priority` is a next/image error, so
              // we rely on priority to drive both.
              priority={heroIndex === defaultIndex && activeImageIndex === 0}
              decoding="async"
              sizes="(max-width: 1023px) 100vw, 40vw"
              quality={85}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-center p-4">
              <p className="text-sm text-muted-foreground">
                Photos for the {heroActive.label} Porta Cabin are being finalised — send an enquiry for reference images.
              </p>
            </div>
          )}
        </div>

        {heroImages && (
          <div className="grid grid-cols-5 gap-2">
            {heroImages.map((img, i) => (
              <button
                key={img.src}
                type="button"
                className={cn(
                  'aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden border-2 transition-all duration-200',
                  activeImageIndex === i ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'
                )}
                onClick={() => setActiveImageIndex(i)}
                aria-label={`Show image ${i + 1} of ${heroActive.label} porta cabin`}
              >
                <Image src={img.src} alt={img.alt} width={150} height={150} className="w-full h-full object-cover" loading="lazy" decoding="async" sizes="(max-width: 1023px) 18vw, 80px" />
              </button>
            ))}
          </div>
        )}

        {/* Zone contact cards directly under the thumbnails — the desktop
            conversion path (Call / Send Enquiry). lg:flex-1 stretches them to
            absorb remaining column height (T28.4 equal-bottom-edge rule). */}
        <div className="pt-1 md:pt-2 lg:flex lg:flex-1">
          <ProductZoneCtas variant="strip" className="w-full" stretch />
        </div>

        {/* Slim full-width outlined download button — plain <a download>, no JS. */}
        <a
          href="/downloads/saman-porta-cabin-specifications.pdf"
          download
          className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--ds-color-leaf)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ds-color-leaf)] transition-colors hover:bg-[var(--ds-color-mist)]"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download specifications
        </a>
      </div>
    </Card>
  );

  const FEATURE_CELLS = [
    { label: 'Size', value: heroActive.dims },
    { label: 'Material', value: 'MS Frame · Insulated Panels' },
    { label: 'Delivery', value: '7–21 Working Days' },
    { label: 'Coverage', value: 'Bangalore · Delhi NCR' },
    { label: 'Brand', value: 'SAMAN Portable' },
    { label: 'Application', value: heroActive.useCase },
  ];

  // INFO-ONLY buy box: no CTA buttons here (owner ruling — desktop conversion
  // lives in the gallery column's zone cards; mobile keeps the sticky bar).
  const buyBoxColumn = (Heading: 'h1' | 'p') => (
    <Card className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden lg:min-h-full lg:flex lg:flex-col">
      <div className="space-y-3 lg:flex lg:flex-1 lg:flex-col">
        <div className="space-y-1">
          <Heading className="text-2xl md:text-3xl font-bold text-foreground leading-tight break-words">{productTitle}</Heading>
          {/* Amendment G v2 — real rating badge: the computed 4.6 average of the 5
              SAMAN-verified reviews only (ratingCount 5). Matches the JSON-LD
              aggregateRating + the Reviews tab. Renders only when ratingCount > 0. */}
          {ratingCount > 0 && (
            <div className="flex items-center space-x-2 flex-wrap">
              <div className="flex items-center space-x-1">{renderStars(parseFloat(averageRating) || 0)}</div>
              <span className="text-sm text-muted-foreground">
                {averageRating} ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Choose size</p>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Choose porta cabin size">
            {data.variants.map((v, i) => (
              <button
                key={v.sizeSlug}
                type="button"
                aria-pressed={i === heroIndex}
                onClick={() => selectHero(i)}
                className={cn(
                  'min-h-11 rounded-lg border px-2 py-2 text-sm font-semibold transition-colors',
                  i === heroIndex
                    ? 'bg-[var(--ds-color-leaf)] text-white border-[var(--ds-color-leaf)] shadow-sm'
                    : 'bg-white text-foreground border-slate-200 hover:border-[var(--ds-color-leaf)]'
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-label + price — fixed height so size swaps cause zero CLS.
            Ex-GST stays prominent; the incl-GST line (G1) is a small muted line
            below it. Both swap in place, constant height → no CLS. */}
        <div className="min-h-[5.25rem]" aria-live="polite">
          <p className="text-sm text-muted-foreground">{heroActive.label} Porta Cabin</p>
          <span className="text-2xl md:text-3xl font-bold text-[var(--ds-color-forest)] break-words">
            {formatIndianPrice(heroActive.priceExGst)} + GST
          </span>
          <p className="text-xs text-muted-foreground">{formatIndianPrice(heroActive.priceInclGst)} incl. 18% GST</p>
        </div>

        {/* Per-size shortDescription (Fable 5 Section E v2 — shortened) in the
            fixed 3-line/63px slot (14px / 1.5). The v2 blurbs (≤118 chars) fit
            3 lines at 1024+ with zero truncation; the fixed height keeps per-size
            swaps zero-CLS. */}
        {heroActive.shortDescription && (
          <p className="h-[63px] overflow-hidden text-sm leading-[1.5] text-[var(--ds-color-steel)]">
            {heroActive.shortDescription}
          </p>
        )}

        {/* Feature grid — 2-column bordered cells, small-caps gray labels, bold
            values; compacted ~10% (owner direction: tighter cells, no dead space
            in col 3). SIZE and APPLICATION swap with the selected chip; min-h
            keeps rows CLS-stable. */}
        <div className="grid grid-cols-2 rounded-lg border border-[var(--ds-color-border)] overflow-hidden">
          {FEATURE_CELLS.map((cell, i) => (
            <div
              key={cell.label}
              className={cn(
                'px-2.5 py-1.5 min-h-[3.25rem]',
                i % 2 === 0 && 'border-r border-[var(--ds-color-border)]',
                i < FEATURE_CELLS.length - 2 && 'border-b border-[var(--ds-color-border)]'
              )}
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.7px] text-[var(--ds-color-steel)]">{cell.label}</div>
              <div className="text-[13px] font-semibold text-[var(--ds-color-forest)]">{cell.value}</div>
            </div>
          ))}
        </div>

        {/* Green chips line (verbatim, from the approved short-description footer). */}
        <div className="flex items-center gap-2 rounded-md bg-[var(--ds-color-mist)] px-3 py-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ds-color-leaf)]" aria-hidden="true" />
          <p className="text-xs text-[var(--ds-color-ink)]">
            Custom sizes available · <strong className="text-[var(--ds-color-forest)]">500+ projects delivered</strong> · Factory-tested before dispatch
          </p>
        </div>

        {/* Product Information (owner ruling: mandatory on every product page) —
            static, not per-variant. Verbatim SKU + category anchor. Fills the
            gap between the green chips line and the trust row. */}
        <div className="rounded-lg border border-[var(--ds-color-border)] px-3 py-2.5">
          <h3 className="mb-1.5 text-[13px] font-semibold text-[var(--ds-color-ink)]">Product Information</h3>
          <dl className="space-y-1 text-[13px]">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[10px] font-bold uppercase tracking-[0.7px] text-[var(--ds-color-steel)]">SKU</dt>
              <dd className="font-semibold text-[var(--ds-color-forest)]">SP-20-PC-2024</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[10px] font-bold uppercase tracking-[0.7px] text-[var(--ds-color-steel)]">Category</dt>
              <dd>
                <Link href="/product/porta-cabins" className="font-semibold text-[var(--ds-color-leaf)] hover:underline">Porta Cabins</Link>
              </dd>
            </div>
          </dl>
        </div>

        {/* Trust row — anchored at the card bottom (mt-auto within the
            full-height flex column). */}
        <p className="!mt-auto pt-4 text-xs text-muted-foreground text-center">
          GST Registered · 5-yr structural warranty · Pan-India delivery
        </p>
      </div>
    </Card>
  );

  return (
    // data-ds-root + the injected token rule scope the --ds-* color variables to
    // this subtree — the same self-sufficient pattern Header.tsx uses for global
    // chrome outside PageShell. Hex lives only in ds/tokens.ts (T0 law).
    <section ref={heroRef} className="mb-4 scroll-mt-20" data-ds-root="">
      <style dangerouslySetInnerHTML={{ __html: `[data-ds-root]{${dsCssVariables()}}` }} />

      {/* Desktop >=1024: 25/40/35, one row, equal bottom edges. Gallery column's
          natural height is the SOLE row-height driver; rail + buy box live in
          absolute-inset internally-scrolling shells (T28.5 universal rule). */}
      <div className="hidden lg:grid items-stretch gap-6 lg:grid-cols-[minmax(0,25fr)_minmax(0,40fr)_minmax(0,35fr)]">
        <aside className="lg:relative lg:min-h-0">
          <div className="t28-rail-scroll lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">
            <RelatedProductRail
              items={railItems}
              currentHref={currentHref}
              className="bg-white/80 shadow-lg lg:h-auto lg:min-h-full"
              scroll
            />
          </div>
        </aside>

        <div className="min-w-0">{galleryColumn}</div>

        <div className="min-w-0 lg:relative lg:min-h-0">
          <div className="t28-rail-scroll lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">{buyBoxColumn('p')}</div>
        </div>
      </div>

      {/* Mobile <1024 (stacked): image/thumbs/zone-contacts/download -> buy-box
          info -> compare cards (below) -> related rail LAST (after the table). */}
      <div className="lg:hidden space-y-4">
        {galleryColumn}
        {buyBoxColumn('h1')}
      </div>

      {/* Size Applications Explorer — directly under the hero. Same design
          language as the homepage PopularSizes tabs (leaf-underline tab strip,
          image-left / details-right panels, var(--ds-*) tokens). DECOUPLED from
          the hero: its own explorerIndex + #sizedetails-* hash. All 9 panels ship
          in SSR (inactive = visibility:hidden, crawlable); grid-stack → zero CLS. */}
      <SizeApplicationsExplorer
        data={data}
        sectionId={APPLICATIONS_SECTION_ID}
        activeIndex={explorerIndex}
        onSelectTab={selectExplorer}
        onGetQuote={openQuote}
      />

      {/* Related products — mobile position: LAST, after the explorer. */}
      <div className="lg:hidden mt-4">
        <RelatedProductRail items={railItems} currentHref={currentHref} />
      </div>

      {/* Mobile sticky buy bar — sits above the site-wide MobileBottomNav (h-16),
          hidden >=1024. The mobile conversion path stays: price + solid CTA. */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-2px_8px_rgba(20,33,27,0.08)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-[11px] text-muted-foreground leading-none">{heroActive.label} ft</p>
            <p className="text-base font-bold text-primary leading-tight">{formatIndianPrice(heroActive.priceExGst)} + GST</p>
          </div>
          <Button
            type="button"
            className="bg-primary hover:bg-primary/90 text-white min-h-11 px-5"
            onClick={() => openQuote(heroIndex)}
          >
            Get a Quote
          </Button>
        </div>
      </div>
      {/* Reserve space so the sticky bar never covers page content on mobile. */}
      <div className="lg:hidden h-16" aria-hidden="true" />

      <EnquiryDialog
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        prefillMessage={`Enquiry for ${data.variants[quoteIndex].label} Porta Cabin`}
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Size Applications Explorer — H2 + intro + leaf-underline tab strip + 9 panels.
// Panels map to variants by sizeSlug; all copy is verbatim from
// data/products/porta-cabins-applications.json (Fable 5 Section H). Every panel
// is in SSR HTML (inactive = visibility:hidden, crawlable). DECOUPLED from the
// hero: its own explorerIndex + #sizedetails-* hash — tabs move ONLY this panel.
// ---------------------------------------------------------------------------

interface SizeApplicationsExplorerProps {
  data: VariantProductData;
  sectionId: string;
  activeIndex: number;
  onSelectTab: (index: number) => void;
  onGetQuote: (index: number) => void;
}

function SizeApplicationsExplorer({ data, sectionId, activeIndex, onSelectTab, onGetQuote }: SizeApplicationsExplorerProps) {
  // Align the copy panels to the variant order (both keyed by sizeSlug).
  const panelBySlug = new Map(APPLICATIONS.panels.map((p) => [p.sizeSlug, p]));

  return (
    <section id={sectionId} className="mt-8 scroll-mt-20" aria-labelledby="size-applications-heading">
      <div className="mb-4">
        <h2 id="size-applications-heading" className="text-xl font-bold text-[var(--ds-color-forest)] sm:text-2xl">
          {APPLICATIONS.h2}
        </h2>
        <p className="mt-1 text-sm text-[var(--ds-color-steel)]">{APPLICATIONS.intro}</p>
      </div>

      {/* Tab strip — horizontal, scrollable on mobile; selected = leaf underline
          + forest text (homepage PopularSizes design language). */}
      <div role="tablist" aria-label="Porta cabin sizes" className="flex gap-1 overflow-x-auto border-b border-[var(--ds-color-border)]">
        {data.variants.map((v, i) => {
          const selected = i === activeIndex;
          return (
            <button
              key={v.sizeSlug}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`app-panel-${v.sizeSlug}`}
              id={`app-tab-${v.sizeSlug}`}
              onClick={() => onSelectTab(i)}
              className={cn(
                '-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-semibold transition-colors',
                selected
                  ? 'border-[var(--ds-color-leaf)] text-[var(--ds-color-forest)]'
                  : 'border-transparent text-[var(--ds-color-steel)] hover:text-[var(--ds-color-forest)]'
              )}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Panels — GRID-STACK: all 9 occupy the SAME grid cell ([grid-area:1/1]),
          so the container always sizes to the TALLEST panel and its height never
          changes when tabs switch → zero CLS at every viewport, no magic min-h.
          The active panel is visible; the others are visibility:hidden (still in
          the DOM, still laid out, fully crawlable — stronger than display:none for
          SEO). All 9 panels ship in SSR. */}
      <div className="mt-4 grid">
        {data.variants.map((v, i) => {
          const panel = panelBySlug.get(v.sizeSlug);
          if (!panel) return null;
          // Panel photo = that size's ELEVATED-VIEW shot (a different file from the
          // gallery's hero-view, so no image repeats on the page). 40x8 has no
          // real photos yet → placeholder.
          const hasPhotos = v.images.length > 0;
          const panelImage = hasPhotos
            ? {
                src: `/images/products/porta-cabins/${v.sizeSlug}/porta-cabin-${v.sizeSlug}-elevated-view.webp`,
                alt: applicationAlt(v.label, panel.applications[0]),
              }
            : null;
          const rate = PRICE_PER_SQFT[v.sizeSlug];
          return (
            <div
              key={v.sizeSlug}
              id={`app-panel-${v.sizeSlug}`}
              role="tabpanel"
              aria-labelledby={`app-tab-${v.sizeSlug}`}
              aria-hidden={i !== activeIndex}
              className={cn(
                '[grid-area:1/1] flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-10',
                i === activeIndex ? 'visible' : 'invisible pointer-events-none'
              )}
            >
              {/* LEFT — that size's elevated-view photo (or placeholder for 40x8).
                  The aspect-[4/3] box always reserves space (zero CLS, grid-stack),
                  but the <img> of INACTIVE panels carries `hidden` (display:none) so
                  its lazy fetch is skipped — only the active panel's image downloads
                  (P1 R3). All 9 stay in SSR HTML (crawlable); the newly-active panel
                  fetches its image on demand when selected. */}
              <div className="lg:w-[44%]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--ds-color-border)] bg-[var(--ds-color-mist)]">
                  {panelImage ? (
                    <Image
                      src={panelImage.src}
                      alt={panelImage.alt}
                      fill
                      className={cn('object-cover', i !== activeIndex && 'hidden')}
                      sizes="(max-width: 1023px) 100vw, 500px"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-4 text-center">
                      <p className="text-sm text-[var(--ds-color-steel)]">
                        Photos for the {v.label} Porta Cabin are being finalised — send an enquiry for reference images.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — H3, paragraph, 4 checkmark applications, data row, CTA. */}
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <h3 className="text-lg font-bold text-[var(--ds-color-ink)] sm:text-xl">{panel.h3}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ds-color-steel)]">{panel.paragraph}</p>

                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {panel.applications.map((app, ai) => (
                    <li key={ai} className="flex items-start gap-2 text-sm text-[var(--ds-color-ink)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ds-color-leaf)]" aria-hidden="true" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>

                {/* Data row from the data file. */}
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--ds-color-steel)]">
                  <span className="font-medium text-[var(--ds-color-ink)]">{v.dims}</span>
                  <span aria-hidden="true">·</span>
                  <span>{v.areaSqft} sq ft</span>
                  <span aria-hidden="true">·</span>
                  <span>{v.capacity}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-bold text-[var(--ds-color-forest)]">{formatIndianPrice(v.priceExGst)} + GST</span>
                  <span aria-hidden="true">·</span>
                  <span>₹{rate}/sq ft</span>
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    className="bg-[var(--ds-color-leaf)] text-white hover:bg-[var(--ds-color-forest)]"
                    onClick={() => onGetQuote(i)}
                  >
                    Get Quote
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


export default PortaCabinVariantHero;
