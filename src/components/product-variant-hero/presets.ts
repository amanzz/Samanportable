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
};

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
