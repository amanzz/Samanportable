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
import { Check, Download, Play, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import { dsCssVariables } from '@/components/ds/tokens';
import ProductZoneCtas from '@/components/product/ProductZoneCtas';
import RelatedProductRail from '@/components/product/RelatedProductRail';
import type { RelatedRailItem } from '@/lib/c16PanelCatalog';
import type { VariantProductData } from './types';
import { formatIndianPrice } from './types';
import { getVariantPreset, resolveVariantProductName, resolveVariantVideo } from './presets';
import portaCabinsApplications from '@/data/products/porta-cabins-applications.json';
import portableShopCabinApplications from '@/data/products/portable-shop-cabin-applications.json';
import portableCabinApplications from '@/data/products/portable-cabin-applications.json';
import containerOfficesApplications from '@/data/products/container-offices-applications.json';
import portableOfficeApplications from '@/data/products/portable-office-applications.json';
import portableCabinWithToiletApplications from '@/data/products/portable-cabin-with-toilet-applications.json';
import sectionHDatasets from '@/data/products/section-h-datasets.json';

interface ApplicationPanel {
  sizeSlug: string;
  h3: string;
  paragraph: string;
  applications: string[];
  /** Sub-heading above the applications list. Present only in the T25 Section H
      drop (its per-panel `h3`); the flagship dataset has no equivalent. */
  applicationsHeading?: string;
  /** Owner-authored alt for this panel's photo. Present only where the approved
      copy specifies one (C-02 with-toilet §H → the copy-pack §E exterior template).
      Absent everywhere else → the derived application alt is used, unchanged. */
  imageAlt?: string;
}
interface ApplicationsData {
  /** Section-level heading + intro. The flagship dataset carries them; the T25
      Section H drop is panel-only, so both are optional and their markup is
      omitted rather than invented when absent. */
  h2?: string;
  intro?: string;
  panels: ApplicationPanel[];
}

/**
 * T25 Section H drop — `{slug: {sizeSlug: {h2, intro, h3, applications[4]}}}`.
 * Field mapping (the drop is panel-scoped, the component is section-scoped):
 *   drop h2           -> panel heading   (renders where the flagship renders h3)
 *   drop intro        -> panel paragraph
 *   drop h3           -> applications sub-heading (new slot)
 *   drop applications -> the 4 checkmark items; [0] also feeds the panel image alt
 * No section-level h2/intro exists in the drop, so those stay undefined.
 */
type SectionHPanel = { h2: string; intro: string; h3: string; applications: string[] };
const fromSectionHDrop = (bySize: Record<string, SectionHPanel>): ApplicationsData => ({
  panels: Object.entries(bySize).map(([sizeSlug, p]) => ({
    sizeSlug,
    h3: p.h2,
    paragraph: p.intro,
    applications: p.applications,
    applicationsHeading: p.h3,
  })),
});

// T25 — Size & Applications Explorer copy, registered per dataset key. The key is
// `applicationsDataset` from the data file, else the preset's, else productSlug.
// A product with NO entry here renders NO explorer at all (see
// SizeApplicationsExplorer's null return): the per-slug applications copy is
// owner-authored and must never be substituted with another product's text.
const APPLICATIONS_DATASETS: Record<string, ApplicationsData> = {
  'porta-cabins': portaCabinsApplications as ApplicationsData,
  // C-02 portable-shop-cabin — same shape as the porta-cabins dataset, so it renders
  // through the identical SizeApplicationsExplorer. Resolved via productSlug (the data
  // file sets no applicationsDataset override), and additive → porta-cabins unaffected.
  'portable-shop-cabin': portableShopCabinApplications as ApplicationsData,
  // C-02 portable-cabin HUB — same dataset shape → identical SizeApplicationsExplorer.
  // Resolves via productSlug; additive, so porta-cabins/shop-cabin are unaffected.
  'portable-cabin': portableCabinApplications as ApplicationsData,
  // C-04 container-offices HUB — same dataset shape → identical SizeApplicationsExplorer.
  // Resolves via productSlug; additive, so the porta-cabin cluster is unaffected.
  'container-offices': containerOfficesApplications as ApplicationsData,
  // C-03 portable-office HUB — same dataset shape → identical SizeApplicationsExplorer.
  // Resolves via the preset's applicationsDataset key; additive, so every other
  // product's explorer is unaffected.
  'portable-office': portableOfficeApplications as ApplicationsData,
  // C-02 portable-cabin-with-toilet — §H drop (Fable 5, 25 Jul), same dataset shape
  // → identical SizeApplicationsExplorer. Resolves via productSlug; additive.
  'portable-cabin-with-toilet': portableCabinWithToiletApplications as ApplicationsData,
  ...Object.fromEntries(
    Object.entries(sectionHDatasets as Record<string, Record<string, SectionHPanel>>).map(
      ([slug, bySize]) => [slug, fromSectionHDrop(bySize)]
    )
  ),
};

// Application-panel alt: "Elevated view of {size} ft {product} used as
// {first application}" — first checkmark lowercased + final word singularised
// (matches the owner's example: "…used as project and site office"). Unique per
// size, and distinct from the gallery alts (page-wide alt uniqueness).
const applicationAlt = (label: string, firstApp: string, productLower: string) => {
  const phrase = (firstApp.charAt(0).toLowerCase() + firstApp.slice(1)).replace(/s$/, '');
  return `Elevated view of ${label.replace('x', '×')} ${productLower} used as ${phrase}`;
};

// "Porta Cabin" -> "Porta cabin". Used where the original copy was sentence-cased
// mid-string; keeps the flagship's aria-labels byte-identical.
const sentenceCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

// Explorer panel image. Prefers an explicit template (`{sizeSlug}` token); with no
// template it derives the path from that size's FIRST gallery image by swapping the
// trailing shot segment — so any product whose assets follow the house naming
// convention works without extra configuration.
const explorerImageSrc = (
  template: string | undefined,
  shot: string,
  sizeSlug: string,
  gallerySrc: string | undefined
): string | null => {
  if (template) return template.replace(/\{sizeSlug\}/g, sizeSlug);
  if (!gallerySrc) return null;
  const swapped = gallerySrc.replace(/-[a-z0-9]+-view(\.[a-z0-9]+)$/i, `-${shot}$1`);
  return swapped === gallerySrc ? null : swapped;
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

// T24.1-V — product overview video. ONE video per page. LAZY FACADE: the page ships
// only the poster WebP; the YouTube iframe is injected on click and never before, so
// a cold load makes ZERO requests to youtube.com / ytimg.com. The 1:1 box is reserved
// by the existing aspect-square wrapper, so swapping poster -> player is zero-CLS.
// T25 — OPT-IN: the video exists only for a product whose data file sets
// `hasProductVideo: true` AND supplies video metadata (resolveVariantVideo). Every
// other product gets no facade thumb and no VideoObject JSON-LD.

// ₹/sq ft display values — OFFICIAL owner-supplied figures. T25: derived per variant
// as round(priceExGst / areaSqft) in en-IN grouping, which reproduces the flagship's
// nine literals EXACTLY (1,375 · 1,375 · 1,250 · 1,200 · 1,200 · 1,175 · 1,175 ·
// 1,175 · 1,150 — verified against the previous hardcoded map). A product may still
// override any figure via `pricePerSqft` in its data file.
const pricePerSqft = (
  overrides: Record<string, string> | undefined,
  sizeSlug: string,
  priceExGst: number | null,
  areaSqft: number
): string => {
  const override = overrides?.[sizeSlug];
  if (override) return override;
  // Price GATED (null) → no derived ₹/sq ft. Never reached by the flagship (all
  // nine prices are numbers), so its output is unchanged.
  if (priceExGst == null) return '';
  if (!areaSqft) return '';
  return Math.round(priceExGst / areaSqft).toLocaleString('en-IN');
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
  // T24.1-V — false until the visitor clicks the video thumb. While false no
  // YouTube markup exists in the tree at all (facade), so nothing is requested.
  const [showVideo, setShowVideo] = useState(false);
  // Which size the enquiry dialog quotes (set at the moment a Get Quote is
  // clicked; never changes hero/explorer selection).
  const [quoteIndex, setQuoteIndex] = useState(defaultIndex);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // T25 — every value that used to be a porta-cabins literal, resolved from the
  // data file first, then the product's preset. Anything unresolved is omitted
  // rather than defaulted to the flagship's content.
  const preset = getVariantPreset(data);
  const productName = resolveVariantProductName(data, productTitle);
  const productNameLower = productName.toLowerCase();
  const categoryLabel = data.categoryLabel || preset.categoryLabel;
  const categoryLinkHref = data.categoryHref || preset.categoryHref;
  const productSku = data.productSku || preset.productSku;
  const specPdfHref = data.specPdfHref || preset.specPdfHref;
  // Trust-strip warranty segment: data → preset → the deployed default. Absent on every
  // product except container-offices → byte-identical trust strip everywhere else.
  const trustWarranty = data.trustWarranty || preset.trustWarranty || '5-yr structural warranty';
  // Video: null unless the product opted in AND supplied metadata (T25 §4).
  const video = resolveVariantVideo(data);
  // Explorer copy: resolved by dataset key. undefined => the Explorer section is
  // not rendered at all (never another product's copy).
  const applications = APPLICATIONS_DATASETS[data.applicationsDataset || preset.applicationsDataset || data.productSlug];

  const heroActive = data.variants[heroIndex];
  const heroImages = heroActive.images.length > 0 ? heroActive.images : null;

  // Hero chips: change ONLY the hero; write #size-{WxL} (replaceState — no
  // navigation, no scroll, no history entry).
  const selectHero = (index: number) => {
    setHeroIndex(index);
    setActiveImageIndex(0);
    // Changing size returns the viewer to that size's photos (the video is a
    // page-level asset, not a per-size one).
    setShowVideo(false);
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
        setShowVideo(false);
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
          {showVideo && video ? (
            // Injected ONLY after the thumb click. autoplay=1 because the click
            // that mounted it IS the play gesture. youtube-nocookie is not used:
            // the packet fixes the embed origin as youtube.com.
            <iframe
              src={video.embedSrc}
              title={video.title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : heroImages ? (
            <Image
              key={heroImages[activeImageIndex].src}
              src={heroImages[activeImageIndex].src}
              unoptimized={shouldBypassOptimizer(heroImages[activeImageIndex].src)}
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
              // T30 / T24.1-IMG §5.1 — the hero does NOT fill the viewport below
              // 1024: it sits inside the page container (px-4 <640, px-6 >=640) and
              // the gallery Card (p-2). MEASURED rendered width on this build:
              //   360 -> 312px | 390 -> 342px | 412 -> 364px  (= 100vw - 48px)
              //   768 -> 704px                                 (= 100vw - 64px)
              // Declaring 100vw overstated the box by ~12% and made mobile resolve
              // ~1170px, selecting the w=1200 candidate (~92 KiB into a 342px box) —
              // a direct breach of the MOBILE CWV LAW ("correct sizes attr so mobile
              // never downloads the 1200px variant"). calc() is exact at every width,
              // so it never under-declares either (no blurring).
              sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc(100vw - 64px), 40vw"
              quality={85}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-center p-4">
              <p className="text-sm text-muted-foreground">
                Photos for the {heroActive.label} {productName} are being finalised — send an enquiry for reference images.
              </p>
            </div>
          )}
        </div>

        {/* T24.1-V — 6 columns: the 5 photo thumbs plus the video facade thumb.
            Six-up keeps the row a single line, so gallery height, paint order and
            everything below it are byte-identical in flow to the 5-up build (no
            reflow, no CLS); only the per-thumb box shrinks.
            T25 — the video thumb is opt-in, so the track count follows the real
            number of thumbs: 6 with the video, 5 without. Full class names (not an
            interpolated `grid-cols-${n}`) so Tailwind's scanner emits both. */}
        {heroImages && (
          <div className={video ? 'grid grid-cols-6 gap-2' : 'grid grid-cols-5 gap-2'}>
            {heroImages.map((img, i) => (
              <button
                key={img.src}
                type="button"
                className={cn(
                  'aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden border-2 transition-all duration-200',
                  !showVideo && activeImageIndex === i ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'
                )}
                onClick={() => { setActiveImageIndex(i); setShowVideo(false); }}
                aria-label={`Show image ${i + 1} of ${heroActive.label} ${productNameLower}`}
              >
                {/* The thumbnail whose photo is currently enlarged in the main
                    viewer is decorative (alt="") — the main <img> already carries
                    that shot's descriptive alt, so this avoids the same alt/photo
                    reading twice on the page (V5). The other four keep their unique
                    per-shot alts and stay crawlable. The button's aria-label names
                    the control either way. */}
                {/* T30 / T24.1-IMG §5.3 — these 5 thumbnails are INSIDE the initial
                    viewport on mobile AND desktop (measured 52-62px boxes, all
                    in-viewport). loading="lazy" on an in-viewport image forces a
                    second discovery round-trip and delays first paint, so they load
                    eagerly. Deliberately NO fetchpriority: the law reserves high
                    priority for the first hero, which is the main viewer above. */}
                <Image src={img.src} unoptimized={shouldBypassOptimizer(img.src)} alt={!showVideo && i === activeImageIndex ? '' : img.alt} width={150} height={150} className="w-full h-full object-cover" loading="eager" decoding="async" sizes="(max-width: 1023px) 18vw, 80px" />
              </button>
            ))}

            {/* T24.1-V — video facade thumb. This is the ONLY YouTube-related
                surface on the page until it is clicked: a local WebP poster plus a
                CSS play badge. No iframe, no YouTube script, no ytimg preconnect.
                Accessible name comes from the poster alt (the packet's string), so
                no aria-label is added on top of it.
                T25 — rendered ONLY for a product that opted in via
                `hasProductVideo` and supplied video metadata. */}
            {video && (
            <button
              type="button"
              className={cn(
                'aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden border-2 transition-all duration-200 relative',
                showVideo ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'
              )}
              onClick={() => setShowVideo(true)}
            >
              {/* Sibling thumbs are eager because T30 MEASURED this row inside the
                  initial viewport at 360/390/412/768 and on desktop; lazy on an
                  in-viewport image costs a second discovery round-trip and delays
                  first paint. The poster follows the row it lives in. It is a 63 KB
                  WebP served into a ~44-52px box, i.e. the smallest srcset candidate. */}
              <Image
                src={video.posterSrc}
                unoptimized={shouldBypassOptimizer(video.posterSrc)}
                alt={video.posterAlt}
                width={150}
                height={150}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                sizes="(max-width: 1023px) 15vw, 70px"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/25" aria-hidden="true">
                <span className="flex items-center justify-center w-1/2 h-1/2 rounded-full bg-white/90 shadow">
                  <Play className="w-1/2 h-1/2 text-primary fill-primary" />
                </span>
              </span>
            </button>
            )}
          </div>
        )}

        {/* Zone contact cards directly under the thumbnails — the desktop
            conversion path (Call / Send Enquiry). lg:flex-1 stretches them to
            absorb remaining column height (T28.4 equal-bottom-edge rule). */}
        <div className="pt-1 md:pt-2 lg:flex lg:flex-1">
          <ProductZoneCtas variant="strip" className="w-full" stretch />
        </div>

        {/* Slim full-width outlined download button — plain <a download>, no JS.
            T25: rendered only when the product names a spec PDF (data file or
            preset); never points at another product's document. */}
        {specPdfHref && (
        <a
          href={specPdfHref}
          download
          className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--ds-color-leaf)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ds-color-leaf)] transition-colors hover:bg-[var(--ds-color-mist)]"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download specifications
        </a>
        )}
      </div>
    </Card>
  );

  const FEATURE_CELLS = [
    { label: 'Size', value: heroActive.dims },
    // Material: data → preset → the deployed literal. Absent on every product except
    // portable-office (W3-A Ruling 1) → byte-identical Material cell everywhere else.
    { label: 'Material', value: data.materialLabel || preset.materialLabel || 'MS Frame · Insulated Panels' },
    { label: 'Delivery', value: data.deliveryLabel || '7–21 Working Days' },
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
          <div className="grid grid-cols-3 gap-2" role="group" aria-label={`Choose ${productNameLower} size`}>
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
          {/* Two children (not three) so React SSR emits ONE `<!-- -->` text
              separator here — byte-identical to the T24.1 markup, which had the
              product noun as a literal in the trailing static string. */}
          <p className="text-sm text-muted-foreground">{heroActive.label}{` ${productName}`}</p>
          {/* Price GATED (priceExGst null): show the enquiry line, no numbers, no
              incl-GST line. When priceExGst is a number the ORIGINAL two elements
              render unchanged (the fragment is transparent → flagship byte-identity). */}
          {heroActive.priceExGst == null ? (
            <span className="text-2xl md:text-3xl font-bold text-[var(--ds-color-forest)] break-words">Price on request — send enquiry</span>
          ) : (
            <>
              <span className="text-2xl md:text-3xl font-bold text-[var(--ds-color-forest)] break-words">
                {formatIndianPrice(heroActive.priceExGst)} + GST
              </span>
              <p className="text-xs text-muted-foreground">{formatIndianPrice(heroActive.priceInclGst!)} incl. 18% GST</p>
            </>
          )}
        </div>

        {/* Price caption — one owner-approved line under the price, identical for
            all sizes so a chip swap cannot move it. Rendered OUTSIDE the fixed-height
            price box above, and only for a product that supplies the copy. */}
        {data.priceCaption && (
          <p className="-mt-1 text-xs text-muted-foreground">{data.priceCaption}</p>
        )}

        {/* Per-size shortDescription (Section E v2.1). Per-breakpoint FIXED heights
            (14px / 1.5 → 21px line): each sized to the TALLEST of the 9 blurbs at
            that tier's narrowest width, measured on the production build —
            <360:6L(126) · 360:5L(105) · 640:3L(63) · 768:2L(42) · 1024:5L(105) ·
            1280+:4L(84). All 9 share one height per tier, so size swaps are zero-CLS;
            every blurb fits with no truncation at 360/768/1024/1440. overflow-hidden
            is a safety net only (nothing is actually clipped at any width ≥320). */}
        {heroActive.shortDescription && (
          <p className="h-[126px] min-[360px]:h-[105px] sm:h-[63px] md:h-[42px] lg:h-[105px] xl:h-[84px] overflow-hidden text-sm leading-[1.5] text-[var(--ds-color-steel)]">
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
            gap between the green chips line and the trust row.
            T25: both rows are data-driven. A row (and, if neither resolves, the
            whole block) is omitted rather than showing another product's SKU or
            category anchor — those are owner-supplied values, never defaulted. */}
        {(productSku || (categoryLabel && categoryLinkHref)) && (
        <div className="rounded-lg border border-[var(--ds-color-border)] px-3 py-2.5">
          <h3 className="mb-1.5 text-[13px] font-semibold text-[var(--ds-color-ink)]">Product Information</h3>
          <dl className="space-y-1 text-[13px]">
            {productSku && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[10px] font-bold uppercase tracking-[0.7px] text-[var(--ds-color-steel)]">SKU</dt>
              <dd className="font-semibold text-[var(--ds-color-forest)]">{productSku}</dd>
            </div>
            )}
            {categoryLabel && categoryLinkHref && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[10px] font-bold uppercase tracking-[0.7px] text-[var(--ds-color-steel)]">Category</dt>
              <dd>
                <Link href={categoryLinkHref} className="font-semibold text-[var(--ds-color-leaf)] hover:underline">{categoryLabel}</Link>
              </dd>
            </div>
            )}
          </dl>
        </div>
        )}

        {/* Trust row — anchored at the card bottom (mt-auto within the
            full-height flex column). */}
        <p className="!mt-auto pt-4 text-xs text-muted-foreground text-center">
          {`GST Registered · ${trustWarranty} · Pan-India delivery`}
        </p>
      </div>
    </Card>
  );

  return (
    // data-ds-root + the injected token rule scope the --ds-* color variables to
    // this subtree — the same self-sufficient pattern Header.tsx uses for global
    // chrome outside PageShell. Hex lives only in ds/tokens.ts (T0 law).
    <section ref={heroRef} className="mb-4 scroll-mt-20" data-ds-root="">
      {/* DS color tokens + the single-tree layout. Layout CSS only (no hex). The
          hero mounts ONCE (V5 fix: the old hidden-lg / lg:hidden dual tree rendered
          gallery, buy box and rail twice). Source order is gallery → buy box →
          explorer → rail.
          MOBILE (<1024): plain BLOCK FLOW — the source order IS the visual order,
          and, crucially, the browser can lay out and paint the gallery (the LCP
          hero) FIRST, independently of the content-heavy buy box below it. H2 wrapped
          all four in ONE grid formatting context; a grid resolves its whole track
          layout (gallery + buy box) before first paint, which pushed the mobile LCP
          ~0.4s later than the baseline's block-flow mobile tree (the H2 regression).
          Block flow restores the baseline paint order at one mount.
          DESKTOP (>=1024): grid-template-areas repositions the rail (4th in source)
          into column 1 — rail|gallery|buybox 25/40/35, explorer full-width below,
          equal bottom edges (align-items:stretch). Visuals identical at every
          breakpoint; only the mobile formatting context changes. */}
      <style dangerouslySetInnerHTML={{ __html: `[data-ds-root]{${dsCssVariables()}}`
        + `.pc-hero-grid{display:block;}`
        + `.pc-hero-grid>.pc-gallery{min-width:0;}.pc-hero-grid>.pc-buybox{min-width:0;margin-top:1rem;}.pc-hero-grid>.pc-explorer{min-width:0;margin-top:1rem;}.pc-hero-grid>.pc-rail{margin-top:1rem;}`
        + `@media(min-width:1024px){.pc-hero-grid{display:grid;grid-template-columns:minmax(0,25fr) minmax(0,40fr) minmax(0,35fr);column-gap:1.5rem;row-gap:2rem;align-items:stretch;grid-template-areas:"rail gallery buybox" "explorer explorer explorer";}.pc-hero-grid>.pc-rail{grid-area:rail;margin-top:0;}.pc-hero-grid>.pc-gallery{grid-area:gallery;}.pc-hero-grid>.pc-buybox{grid-area:buybox;margin-top:0;}.pc-hero-grid>.pc-explorer{grid-area:explorer;margin-top:0;}}` } } />

      {/* SINGLE responsive tree (V5 fix). Every piece — rail, gallery, buy box,
          explorer — is mounted EXACTLY ONCE; grid-template-areas (see <style>)
          place them: desktop one row rail|gallery|buybox (25/40/35) with the
          explorer full-width below; mobile a single column gallery→buybox→
          explorer→rail. The buy box renders the sole H1. Rail (chrome) now renders
          once, not twice → related thumbnails satisfy the "one render each" gate. */}
      <div className="pc-hero-grid">
        {/* Gallery FIRST in source — on mobile (block flow) this makes the LCP hero
            image the first laid-out/painted element; its natural height drives the
            desktop row height. */}
        <div className="pc-gallery">{galleryColumn}</div>

        {/* Buy box — the ONLY H1 on the page. Internally-scrolling T28 shell on
            desktop; normal flow on mobile. */}
        <div className="pc-buybox lg:relative lg:min-h-0">
          <div className="t28-rail-scroll lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">{buyBoxColumn('h1')}</div>
        </div>

        {/* Size Applications Explorer — full-width row below on desktop, third on
            mobile. DECOUPLED from the hero (own explorerIndex + #sizedetails-*).
            Only the ACTIVE panel renders its <img> (P1/V7); every panel's text
            ships in SSR (crawlable); grid-stack → zero CLS. */}
        {/* T25 — the explorer is rendered only when THIS product has its own
            applications dataset. Without one the wrapper is omitted too, so the
            desktop grid simply loses its second row instead of reserving an empty
            full-width area. */}
        {applications && (
        <div className="pc-explorer">
          <SizeApplicationsExplorer
            data={data}
            applications={applications}
            productName={productName}
            sectionId={APPLICATIONS_SECTION_ID}
            activeIndex={explorerIndex}
            onSelectTab={selectExplorer}
            onGetQuote={openQuote}
          />
        </div>
        )}

        {/* Related rail — LAST in source: on mobile (block flow) it lands at the
            bottom, below the fold, so it never sits in the hero's paint path;
            desktop grid-template-areas repositions it into column 1. One instance
            only (V5). Real <a> links stay in SSR HTML (crawlable). */}
        <aside className="pc-rail lg:relative lg:min-h-0">
          <div className="t28-rail-scroll lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">
            <RelatedProductRail
              items={railItems}
              currentHref={currentHref}
              className="bg-white/80 shadow-lg lg:h-auto lg:min-h-full"
              scroll
            />
          </div>
        </aside>
      </div>

      {/* Mobile sticky buy bar — sits above the site-wide MobileBottomNav (h-16),
          hidden >=1024. The mobile conversion path stays: price + solid CTA. */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-2px_8px_rgba(20,33,27,0.08)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-[11px] text-muted-foreground leading-none">{heroActive.label} ft</p>
            <p className="text-base font-bold text-primary leading-tight">{heroActive.priceExGst == null ? 'Price on request' : <>{formatIndianPrice(heroActive.priceExGst)} + GST</>}</p>
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
        prefillMessage={`Enquiry for ${data.variants[quoteIndex].label} ${productName}`}
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
  /** This product's OWN applications copy. Required — there is no shared default,
      so a product without a dataset never reaches this component (T25 §3). */
  applications: ApplicationsData | undefined;
  productName: string;
  sectionId: string;
  activeIndex: number;
  onSelectTab: (index: number) => void;
  onGetQuote: (index: number) => void;
}

function SizeApplicationsExplorer({ data, applications, productName, sectionId, activeIndex, onSelectTab, onGetQuote }: SizeApplicationsExplorerProps) {
  // T25 — HARD NULL. The per-slug applications copy is owner-authored; when a
  // product has none this section renders NOTHING. It must never fall back to the
  // porta-cabins copy.
  if (!applications) return null;

  const preset = getVariantPreset(data);
  const productNameLower = productName.toLowerCase();
  const explorerTemplate = data.explorerImageTemplate || preset.explorerImageTemplate;
  const explorerShot = data.explorerImageShot || preset.explorerImageShot || 'elevated-view';

  // Align the copy panels to the variant order (both keyed by sizeSlug).
  const panelBySlug = new Map(applications.panels.map((p) => [p.sizeSlug, p]));

  return (
    <section
      id={sectionId}
      className="scroll-mt-20"
      {...(applications.h2
        ? { 'aria-labelledby': 'size-applications-heading' }
        : { 'aria-label': `${sentenceCase(productName)} sizes and applications` })}
    >
      {/* Section heading + intro exist only on datasets that supply them (the
          flagship). The T25 Section H drop is panel-only, so this block is omitted
          rather than filled with invented copy — each panel carries its own
          heading, which keeps the section self-describing either way. */}
      {applications.h2 && (
        <div className="mb-4">
          <h2 id="size-applications-heading" className="text-xl font-bold text-[var(--ds-color-forest)] sm:text-2xl">
            {applications.h2}
          </h2>
          {applications.intro && (
            <p className="mt-1 text-sm text-[var(--ds-color-steel)]">{applications.intro}</p>
          )}
        </div>
      )}

      {/* Tab strip — horizontal, scrollable on mobile; selected = leaf underline
          + forest text (homepage PopularSizes design language). */}
      <div role="tablist" aria-label={`${sentenceCase(productName)} sizes`} className="flex gap-1 overflow-x-auto border-b border-[var(--ds-color-border)]">
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
          const panelSrc = hasPhotos
            ? explorerImageSrc(explorerTemplate, explorerShot, v.sizeSlug, v.images[0]?.src)
            : null;
          const panelImage = panelSrc
            ? {
                src: panelSrc,
                // When the Explorer reuses this size's gallery HERO shot (panelSrc equals
                // the first gallery image — e.g. the C-02 shop cabin, which ships no
                // separate elevated-view per the FIX-PACKET), carry that image's own §E
                // alt. Products whose Explorer uses a DISTINCT shot (porta-cabins →
                // elevated-view) keep the derived application alt, byte-identical.
                // An owner-authored panel alt (C-02 with-toilet §H) wins outright;
                // otherwise the existing two-branch behaviour is unchanged.
                alt:
                  panel.imageAlt ||
                  (panelSrc === v.images[0]?.src && v.images[0]?.alt
                    ? v.images[0].alt
                    : applicationAlt(v.label, panel.applications[0], productNameLower)),
              }
            : null;
          const rate = pricePerSqft(data.pricePerSqft, v.sizeSlug, v.priceExGst, v.areaSqft);
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
              {/* LEFT — that size's elevated-view photo (or the honest placeholder
                  when a size has no photos). The aspect-[4/3] box always reserves
                  space (zero CLS, grid-stack). V7: only the ACTIVE panel renders an
                  <img>, so INACTIVE panels issue ZERO network requests at initial
                  load (display:none alone would still fetch). Every panel's TEXT
                  ships in SSR (crawlable); the newly-active panel mounts and fetches
                  its image on demand when the tab is selected — into the already
                  reserved box, so activation is zero-CLS. */}
              <div className="lg:w-[44%]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--ds-color-border)] bg-[var(--ds-color-mist)]">
                  {panelImage ? (
                    i === activeIndex ? (
                      /* T30 / T24.1-IMG §5.4 — this was the ONLY <img> on the page
                         with no intrinsic dimensions (next/image `fill` cannot emit
                         width/height). It swaps on every tab click, so it carried a
                         CLS risk. Explicit intrinsic width/height (the source files
                         are 1254x1254) + w-full/h-full/object-cover render exactly as
                         `fill` did inside the aspect-[4/3] box — same crop, same box,
                         but the browser now knows the intrinsic aspect.
                         Also right-sized (item 5): it renders ~326-378px on mobile
                         (measured = 100vw - 34px), not 100vw. */
                      <Image
                        src={panelImage.src}
                        unoptimized={shouldBypassOptimizer(panelImage.src)}
                        alt={panelImage.alt}
                        width={1254}
                        height={1254}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 1023px) calc(100vw - 34px), 500px"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-4 text-center">
                      <p className="text-sm text-[var(--ds-color-steel)]">
                        Photos for the {v.label} {productName} are being finalised — send an enquiry for reference images.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — H3, paragraph, 4 checkmark applications, data row, CTA.
                  L13 REV 2 STRUCTURAL FILL RULE — the single sanctioned CSS change on the
                  shared §H component. `justify-center` left the column short of the tab
                  image (measured 356px against a 400px image at 1536 on the W3-A preview:
                  a 45px gap under the CTA that widened on bigger monitors). `justify-between`
                  distributes the residual across the title / body / uses / stats+CTA groups,
                  so the CTA baseline lands on the image bottom edge at ANY viewport instead
                  of only at the width the copy was counted for. Character counts alone can
                  never track every monitor width — this absorbs whatever is left over.
                  Column-level layout only: no child markup, spacing or copy changes, and on
                  mobile (<1024) the panel is stacked and unconstrained, so there is no free
                  space to distribute and the rendering is unchanged. Every product page with
                  a §H explorer inherits it; there is no per-page styling. */}
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <h3 className="text-lg font-bold text-[var(--ds-color-ink)] sm:text-xl">{panel.h3}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ds-color-steel)]">{panel.paragraph}</p>

                {/* Sub-heading above the applications list — T25 Section H drop only. */}
                {panel.applicationsHeading && (
                  <p className="mt-4 text-sm font-semibold text-[var(--ds-color-forest)]">
                    {panel.applicationsHeading}
                  </p>
                )}

                {/* Margin class stays FIRST so the flagship keeps its exact original
                    class string ("mt-4 grid gap-2 sm:grid-cols-2") byte-for-byte. */}
                <ul className={cn(panel.applicationsHeading ? 'mt-2' : 'mt-4', 'grid gap-2 sm:grid-cols-2')}>
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
                  {/* Capacity is an occupancy claim, so it is rendered only where the
                      product's approved data supplies one. Without this guard a page
                      barred from people-count claims (C-02 with-toilet, §H rules) would
                      print an empty cell between two separators. Products that DO carry
                      capacity emit the same three nodes as before. */}
                  {v.capacity && (
                    <>
                      <span>{v.capacity}</span>
                      <span aria-hidden="true">·</span>
                    </>
                  )}
                  <span className="font-bold text-[var(--ds-color-forest)]">{v.priceExGst == null ? 'Price on request' : <>{formatIndianPrice(v.priceExGst)} + GST</>}</span>
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
