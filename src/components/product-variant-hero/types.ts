export type ImageProvenance = 'photograph' | 'render' | 'unknown';

export interface VariantImage {
  src: string;
  alt: string;
  provenance: ImageProvenance;
  width: number;
  height: number;
}

export interface ProductVariant {
  sizeSlug: string;
  label: string;
  dims: string;
  areaSqft: number;
  /** Ex-GST price. `null` = price GATED (owner has not confirmed the ladder): the
      buy box shows "Price on request — send enquiry", the ₹/sq ft line is hidden,
      and NO per-variant offer / AggregateOffer is emitted in schema. A number
      renders exactly as before (flagship byte-identity). */
  priceExGst: number | null;
  /** Incl-GST (18%) price — owner-supplied figure; = priceExGst × 1.18. Shown as
      a muted line under the ex-GST price, and used for Merchant offers.price.
      `null` when priceExGst is null (gated). */
  priceInclGst: number | null;
  /** Indicative operator/service guidance. OPTIONAL — the porta-cabins buy-box does
      not show a capacity field, so pages matching that design (e.g. portable-shop-cabin)
      omit it. Rendered only in the Applications Explorer data row, when present. */
  capacity?: string;
  /** Per-size application line for the buy-box "Application" cell. OPTIONAL —
      the row is omitted entirely when a product has no owner-approved use-case
      copy, rather than being filled with a generated default (C-08 page six:
      prefabricated-container-house has no approved per-size application copy). */
  useCase?: string;
  sku?: string;
  images?: VariantImage[];
  imagesPending?: boolean;
  /** Per-size buy-box blurb (Fable 5 Section E). Rendered only when present —
      the copy has not been supplied yet, so the slot stays empty until then. */
  shortDescription?: string;
}

export interface VariantProductData {
  productSlug: string;
  variantAxis: string;
  defaultVariant: string;
  hsn?: string;
  gstPercent: number;
  variants: ProductVariant[];
  /** Current page gallery shared by every size when the image-manifest REV has
      not yet assigned per-size galleries. Existing products keep per-variant
      `images` and are unaffected. */
  galleryImages?: VariantImage[];

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
  /** Owner-approved H1 for the page, when the draft's L3 zone rules one that is not
      the product noun (C-05 subpages: "Container Restaurant: Six Factory-Fitted
      Dining Sizes"). Rendered ONLY as the visible heading — `productName` still
      drives alts, aria-labels and the enquiry prefill, so a long marketing H1 never
      leaks into them. Absent on every product that supplies none, so their heading
      is byte-identical.
      PC-00 (v1.5 merge, 14 Aug 2026): the porta-cabins hub's SEO H1 uses THIS field.
      The hub build had introduced a duplicate `heroH1` for the same purpose before
      this branch caught up with production; that duplicate is dropped in favour of
      the established field, so there is exactly one page-heading override. */
  h1?: string;
  /** PC-00 — overrides the "Download Specification PDF" / "Download specifications"
      button label. Absent → deployed literal, byte-identical everywhere else. */
  specPdfButtonLabel?: string;
  /** Owner-approved SEO title and meta description for runtime replacement of
      stale WordPress head fields. */
  seoTitle?: string;
  metaDescription?: string;
  /** Owner-approved page opener rendered directly below the locked H1. Optional;
      pages without one keep their existing markup byte-identical. */
  opener?: string;
  /** Owner-approved replacement for the legacy Description-tab HTML. */
  descriptionHtml?: string;
  /** HOLD the Description tab empty-safe. An empty `descriptionHtml` cannot express
      this, because the route falls through to the legacy body on any falsy value.
      Set true only where the legacy body contradicts the rebuilt page and approved
      replacement copy has not landed yet (C-05 close-out, Part 2): shipping nothing
      is safer than shipping a contradiction. Cleared the moment the copy arrives. */
  suppressLegacyDescription?: boolean;
  /** FAQPage JSON-LD that mirrors FAQs rendered in `descriptionHtml`. */
  faqSchema?: Record<string, unknown>;
  /** Visible text of the "Category" row in the Product Information block. */
  categoryLabel?: string;
  /** Href of the "Category" row. Row renders only when BOTH label and href resolve. */
  categoryHref?: string;
  /** Page-level SKU shown in the Product Information block. Row omitted when absent. */
  productSku?: string;
  /** Remove an obsolete WordPress SKU while the ruled replacement remains
      gated. No fallback or generated SKU is emitted. */
  suppressLegacySku?: boolean;
  /** Suppress a stale Rank Math FAQ graph when the approved replacement does not
      include product FAQs. */
  suppressLegacyFaqSchema?: boolean;
  /** "Download specifications" target. The button is omitted when absent. */
  specPdfHref?: string;
  /** Replaces the default "Price on request — send enquiry" line wherever a
      variant's price is GATED (priceExGst null). Absent on every product that
      supplies none → the deployed wording is unchanged. Set only from approved
      copy (C-08 page six: the 576 Pricing Matrix holds no row for this product,
      so it is quoted rather than laddered). */
  gatedPriceLabel?: string;
  /** 16:9 (1200×675) images placed INSIDE the Info/Description panel, spaced
      through the body copy and always above the specification block. Optional;
      a product that supplies none renders its description byte-identically. */
  infoImages?: VariantImage[];
  /** ₹/sq ft display strings keyed by sizeSlug. Default: derived per variant as
      round(priceExGst / areaSqft) in en-IN grouping — which reproduces the
      flagship's owner-supplied figures exactly for all 9 sizes. */
  pricePerSqft?: Record<string, string>;
  /** Explorer panel image path template; `{sizeSlug}` is substituted. A per-size
      path map is also accepted for products whose approved filenames do not share
      one template. Default: preset, else derived from the variant's first gallery
      image by swapping its trailing shot segment for `explorerImageShot`. */
  explorerImageTemplate?: string | Record<string, string>;
  /** Shot name used by the derived explorer image path. Default: 'elevated-view'. */
  explorerImageShot?: string;
  /** Key of the Size & Applications Explorer copy dataset. Default: preset, else
      productSlug. When no dataset is registered under the resolved key the whole
      Explorer section renders NOTHING — it never falls back to another product's
      copy. */
  applicationsDataset?: string;
  /** Override for the buy-box "Delivery" feature cell. Default (absent) keeps the
      porta-cabins value "7–21 Working Days" → flagship byte-identical. */
  deliveryLabel?: string;
  /** Owner-approved caption rendered directly under the buy-box price (same text for
      every size, so it never moves with a chip swap). Absent on every product that
      supplies none → nothing is rendered and their markup is byte-identical. */
  priceCaption?: string;
  /** Override for the buy-box "Material" feature cell. Default (absent) keeps the
      deployed literal "MS Frame · Insulated Panels" → every other product byte-identical.
      Set only where the product's approved copy states a different material line
      (W3-A Ruling 1: portable-office → "MS structural frame + insulated panel build"). */
  materialLabel?: string;
  /** PC-01 (14 Aug 2026) — override for the buy-box "Coverage" feature cell. Default
      (absent) keeps the deployed literal "Bangalore · Delhi NCR", so every other
      product renders byte-identically. Set only where the product's approved copy
      states a different coverage line. */
  coverageLabel?: string;
  /** PC-10 (15 Aug 2026) — replaces the "Material" feature cell with a "Frontage"
      cell (label AND value), for a product whose approved FEATURE_CELLS table names
      a frontage line rather than a material line. Absent on every other product →
      the Material cell renders exactly as before, byte-identical. */
  frontageLabel?: string;
  /** PC-10 (15 Aug 2026) — replaces the "Coverage" feature cell with a "Fit-out"
      cell (label AND value), for a product whose approved FEATURE_CELLS table names
      a fit-out line rather than a coverage line. Absent on every other product →
      the Coverage cell renders exactly as before, byte-identical. */
  fitOutLabel?: string;
  /** Emit an ex-GST AggregateOffer (lowPrice/highPrice/offerCount) on the ProductGroup
      instead of per-variant Offers. Absent on porta-cabins → per-variant Offers kept,
      byte-identical. Set true only when a page's price ladder is confirmed. */
  emitAggregateOffer?: boolean;
  /** Middle segment of the buy-box trust strip. Default (absent) → preset, else the
      deployed literal "5-yr structural warranty" (flagship byte-identical). */
  trustWarranty?: string;
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
  schemaThumbnailUrl: string;
  uploadDate: string;
  duration: string;
  transcriptHeading?: string;
  transcript?: string;
}

export const formatIndianPrice = (value: number): string => `₹${Math.round(value).toLocaleString('en-IN')}`;
