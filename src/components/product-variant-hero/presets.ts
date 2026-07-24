// T25 — per-product presets for the variant-hero template.
//
// The T24.1 hero was written for /product/porta-cabins and carried that product's
// values as literals (SKU, category anchor, spec PDF, video metadata, explorer
// image path, "Porta Cabin" copy fragments). T25 makes the template reusable by
// sibling subpages at /product/porta-cabins/{slug} WITHOUT changing a single byte
// of the flagship's output.
//
// Resolution order for every value is:
//   1. an OPTIONAL field on the product's data/products/{slug}.json (VariantProductData)
//   2. the preset registered below for that productSlug
//   3. a safe generic fallback — which, for owner-authored values (SKU, spec PDF,
//      category anchor), means OMIT THE SURFACE ENTIRELY rather than inherit the
//      flagship's content. Nothing here invents copy for a product that has none.
//
// Only `porta-cabins` has a preset today, so the flagship keeps every literal it
// had, and any other product that gets wired in renders only what its own data
// file supplies.

import type { VariantProductData } from './types';

/** Product overview video (T24.1-V). Drives BOTH the hero's lazy facade and the
    VideoObject JSON-LD in ProductStructuredData, so the two can never drift. */
export interface VariantProductVideo {
  /** iframe src injected on click (carries autoplay=1 — the click IS the gesture). */
  embedSrc: string;
  /** Canonical embed URL for schema (no autoplay param). */
  embedUrl: string;
  /** Local poster WebP — the only video asset shipped before the click. */
  posterSrc: string;
  posterAlt: string;
  /** iframe title + VideoObject name. */
  title: string;
  schemaDescription: string;
  uploadDate: string;
  duration: string;
}

export interface VariantProductPreset {
  /** Singular product noun used in on-page strings, alts and the quote prefill. */
  productName?: string;
  /** Visible label + href of the "Category" row in the Product Information block. */
  categoryLabel?: string;
  categoryHref?: string;
  /** Page-level (not per-variant) SKU shown in the Product Information block. */
  productSku?: string;
  /** Target of the "Download specifications" button. Omitted → button not rendered. */
  specPdfHref?: string;
  /** Explorer panel image path template. `{sizeSlug}` is substituted. */
  explorerImageTemplate?: string;
  /** Shot name used when deriving the explorer image from the gallery hero shot. */
  explorerImageShot?: string;
  /** Named applications dataset (resolved in PortaCabinVariantHero's registry). */
  applicationsDataset?: string;
  video?: VariantProductVideo;
}

export const VARIANT_PRODUCT_PRESETS: Record<string, VariantProductPreset> = {
  // FLAGSHIP — every value here is the literal that was hardcoded in
  // PortaCabinVariantHero.tsx / ProductStructuredData.tsx before T25. Do not edit:
  // this registry entry IS the byte-identity guarantee for /product/porta-cabins.
  'porta-cabins': {
    productName: 'Porta Cabin',
    categoryLabel: 'Porta Cabins',
    categoryHref: '/product/porta-cabins',
    productSku: 'SP-20-PC-2024',
    specPdfHref: '/downloads/saman-porta-cabin-specifications.pdf',
    explorerImageTemplate: '/images/products/porta-cabins/{sizeSlug}/porta-cabin-{sizeSlug}-elevated-view.webp',
    applicationsDataset: 'porta-cabins',
    video: {
      embedSrc: 'https://www.youtube.com/embed/SDU26yNPBlA?autoplay=1',
      embedUrl: 'https://www.youtube.com/embed/SDU26yNPBlA',
      posterSrc: '/images/porta-cabin-product-video-poster.webp',
      posterAlt: 'Porta cabin product video — 9 standard sizes overview (play)',
      title: 'Porta Cabin — 9 Standard Sizes, Interiors & Prices | SAMAN Portable',
      schemaDescription:
        'Factory-built porta cabins in 9 standard sizes (10x10 ft to 40x12 ft) — exteriors, finished interiors and specifications. Product overview by SAMAN Portable.',
      uploadDate: '2026-07-18',
      duration: 'PT1M25S',
    },
  },
  // C-02 PORTABLE SHOP CABIN subpage (/product/portable-cabin/portable-shop-cabin).
  // Its own data/products/portable-shop-cabin.json supplies the variants; this preset
  // supplies only the DERIVED surfaces: the cluster category row, the on-disk explorer
  // image path, and the page-level SKU (the locked wp-export SKU, not per-variant).
  // Deliberately absent: `applicationsDataset` (no Section H explorer copy supplied →
  // Explorer renders nothing rather than borrowing another product's copy), `specPdfHref`
  // and `video` (none exist for this page). `productName` resolves from the page title.
  'portable-shop-cabin': {
    categoryLabel: 'Portable Cabin',
    categoryHref: '/product/portable-cabin',
    productSku: 'SP-PSC-15-2024',
    // Explorer tab image = each size's hero-view WebP (FIX-PACKET) — this product ships
    // 5 views (no elevated-view), so the Explorer reuses the gallery hero shot. The hero
    // component then carries that image's own §E alt (see panelImage below).
    explorerImageTemplate: '/images/products/portable-shop-cabin/{sizeSlug}/portable-shop-cabin-{sizeSlug}-hero-view.webp',
  },
  ...subpagePresets(),
};

/**
 * T25 subpages — /product/porta-cabins/{slug}.
 *
 * Every value below is DERIVED, never authored: the category row is the cluster
 * these pages already sit in, the explorer image path is the on-disk convention,
 * and `productSku` is the ruled SKU (T25 content drop §1, `SP-{CODE}-{WxL}`) for
 * the size each page defaults to — the configuration the Product Information
 * block is describing.
 *
 * Deliberately ABSENT here:
 *  - `productName` — the page's real product title already resolves it
 *    ("MS Porta Cabin", "Porta Cabin Shop", …), so there is nothing to restate.
 *  - `specPdfHref` — no per-subpage specification PDF exists; the download button
 *    stays unrendered rather than pointing at the flagship's sheet.
 *  - `applicationsDataset` — the Section H explorer copy is incomplete (paragraphs
 *    supplied, h2/intro/h3/applications outstanding), so the Explorer renders
 *    nothing rather than borrowing another product's copy. Registering a dataset
 *    here is the ONLY change needed once that copy lands.
 *  - `video` — subpages carry no video (master §2 rule 1); `hasProductVideo` is
 *    absent from their data files, so `resolveVariantVideo` returns null anyway.
 */
function subpagePresets(): Record<string, VariantProductPreset> {
  // slug -> [ruled SKU cluster code, that page's default size]
  const SUBPAGES: Record<string, [string, string]> = {
    'buy-porta-cabins': ['SP-BPC', '20x10'],
    'luxury-porta-cabin': ['SP-LXPC', '20x10'],
    'mini-porta-cabin': ['SP-MNPC', '10x10'],
    'ms-porta-cabin': ['SP-MSPC', '20x10'],
    'porta-cabin-office': ['SP-PCO', '20x10'],
    'porta-cabin-shop': ['SP-PCS', '20x10'],
    'porta-cabin-with-toilet': ['SP-PCT', '20x10'],
    'prefabricated-porta-cabin': ['SP-PFPC', '20x10'],
    'small-portacabin': ['SP-SMPC', '10x10'],
    'steel-porta-cabin': ['SP-STPC', '20x10'],
    'low-cost-porta-cabin': ['SP-LCPC', '20x10'],
  };
  const out: Record<string, VariantProductPreset> = {};
  for (const [slug, [code, defaultSize]] of Object.entries(SUBPAGES)) {
    out[slug] = {
      categoryLabel: 'Porta Cabins',
      categoryHref: '/product/porta-cabins',
      productSku: `${code}-${defaultSize}`,
      explorerImageTemplate: `/images/products/${slug}/{sizeSlug}/${slug}-{sizeSlug}-elevated-view.webp`,
    };
  }
  return out;
}

export const getVariantPreset = (data: VariantProductData | null | undefined): VariantProductPreset =>
  (data ? VARIANT_PRODUCT_PRESETS[data.productSlug] : undefined) || {};

/**
 * Product noun used by the hero copy AND by the hasVariant schema names.
 * `fallback` is the page's real product title (never an invented string); it is
 * used only when neither the data file nor a preset names the product.
 */
export const resolveVariantProductName = (
  data: VariantProductData | null | undefined,
  fallback: string
): string => data?.productName || getVariantPreset(data).productName || fallback;

/**
 * Video config for a product. Returns null unless the product has BOTH opted in
 * (`hasProductVideo: true` in its data file) AND supplied the video metadata
 * (own `video` field, or a preset). Absent/false = no facade, no VideoObject.
 */
export const resolveVariantVideo = (
  data: VariantProductData | null | undefined
): VariantProductVideo | null => {
  if (!data?.hasProductVideo) return null;
  return data.video || getVariantPreset(data).video || null;
};
