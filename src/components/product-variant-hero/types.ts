export interface VariantImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductVariant {
  sizeSlug: string;
  label: string;
  dims: string;
  areaSqft: number;
  priceExGst: number;
  /** Incl-GST (18%) price — owner-supplied figure; = priceExGst × 1.18. Shown as
      a muted line under the ex-GST price, and used for Merchant offers.price. */
  priceInclGst: number;
  capacity: string;
  useCase: string;
  sku: string;
  images: VariantImage[];
  imagesPending?: boolean;
  /** Per-size buy-box blurb (Fable 5 Section E). Rendered only when present —
      the copy has not been supplied yet, so the slot stays empty until then. */
  shortDescription?: string;
}

export interface VariantProductData {
  productSlug: string;
  variantAxis: string;
  defaultVariant: string;
  hsn: string;
  gstPercent: number;
  variants: ProductVariant[];

  /* ------------------------------------------------------------------ */
  /* T25 — OPTIONAL per-product overrides. Every one of these is absent  */
  /* from porta-cabins.json, so the flagship falls through to its preset */
  /* in ./presets.ts and renders byte-identically to the T24.1 build.    */
  /* A sibling subpage sets only what its owner-approved draft supplies; */
  /* anything it leaves unset is OMITTED, never inherited from the       */
  /* flagship (see presets.ts for the resolution order).                 */
  /* ------------------------------------------------------------------ */

  /** Singular product noun ("Porta Cabin") used in hero copy, image alts, the
      aria-labels and the enquiry prefill. Default: preset, else the page title. */
  productName?: string;
  /** Visible text of the "Category" row in the Product Information block. */
  categoryLabel?: string;
  /** Href of the "Category" row. Row renders only when BOTH label and href resolve. */
  categoryHref?: string;
  /** Page-level SKU shown in the Product Information block. Row omitted when absent. */
  productSku?: string;
  /** "Download specifications" target. The button is omitted when absent. */
  specPdfHref?: string;
  /** ₹/sq ft display strings keyed by sizeSlug. Default: derived per variant as
      round(priceExGst / areaSqft) in en-IN grouping — which reproduces the
      flagship's owner-supplied figures exactly for all 9 sizes. */
  pricePerSqft?: Record<string, string>;
  /** Explorer panel image path template; `{sizeSlug}` is substituted. Default:
      preset, else derived from the variant's first gallery image by swapping its
      trailing shot segment for `explorerImageShot`. */
  explorerImageTemplate?: string;
  /** Shot name used by the derived explorer image path. Default: 'elevated-view'. */
  explorerImageShot?: string;
  /** Key of the Size & Applications Explorer copy dataset. Default: preset, else
      productSlug. When no dataset is registered under the resolved key the whole
      Explorer section renders NOTHING — it never falls back to another product's
      copy. */
  applicationsDataset?: string;
  /** T25 VIDEO OPT-IN. Absent/false (the default) = no video facade thumb and no
      VideoObject JSON-LD. Set true ONLY on a product that genuinely has its own
      overview video AND video metadata (own `video` field or a preset). */
  hasProductVideo?: boolean;
  /** Per-product video metadata; overrides the preset. Read only when
      `hasProductVideo` is true. */
  video?: VariantProductVideoData;
}

/** Mirrors VariantProductVideo in ./presets.ts (kept here so a data file can
    declare it inline without importing the preset module). */
export interface VariantProductVideoData {
  embedSrc: string;
  embedUrl: string;
  posterSrc: string;
  posterAlt: string;
  title: string;
  schemaDescription: string;
  uploadDate: string;
  duration: string;
}

export const formatIndianPrice = (value: number): string => `₹${Math.round(value).toLocaleString('en-IN')}`;
