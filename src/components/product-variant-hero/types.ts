export type ImageProvenance = 'photograph' | 'render' | 'unknown';

export interface VariantImage {
  src: string;
  previewSrc?: string;
  alt: string;
  provenance: ImageProvenance;
  width: number;
  height: number;
  /** CO-09 (22 Aug 2026) — explorer-panel-only override for the fixed aspect-[4/3]
      object-cover box. A GA plan's approved ratio (1.3075) is close to but not
      exactly 4:3, and the ticket forbids cropping a dimensioned drawing under any
      circumstance. Absent everywhere else, so every other panel keeps its exact
      object-cover crop, byte-identical. */
  fit?: 'cover' | 'contain';
}

export interface ProductVariant {
  sizeSlug: string;
  label: string;
  /** Optional short UI label for compact selectors. Absent keeps existing pages on
      their full variant labels. */
  chipLabel?: string;
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
  /** LC-00 (16 Aug 2026) — full replacement for the standard five-cell
      Size/Material/Delivery/Coverage/Brand set, for a product whose approved
      FEATURE_CELLS table names entirely different concepts (labour colony:
      built-up area, sleeping capacity, rooms and floors, level ground needed,
      price ex-GST). Absent on every other product's variants -> the standard
      cell computation is untouched and byte-identical. */
  featureCells?: { label: string; value: string }[];
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
  /** PC-09 — optional caption rendered directly beneath the PDF button, for
      approved copy that carries a "not for construction" control the PDF
      itself lacks. Absent → no caption renders, byte-identical everywhere else. */
  specPdfCaption?: string;
  /** LC-02 — render the spec-PDF control in a disabled state (visible, no href,
      no download, no click) instead of omitting it, for a product whose PDF
      exists but is unsigned/draft and must not be linked. Uses the same default
      label text as the working button — no new copy is written for the
      disabled state. Absent → unchanged working-link behaviour everywhere else. */
  specPdfDisabled?: boolean;
  /** Owner-approved SEO title and meta description for runtime replacement of
      stale WordPress head fields. */
  seoTitle?: string;
  metaDescription?: string;
  canonical?: string;
  openGraphImage?: string;
  /** Owner-approved page opener rendered directly below the locked H1. Optional;
      pages without one keep their existing markup byte-identical. */
  opener?: string;
  /** Owner-approved replacement for the legacy Description-tab HTML. */
  descriptionHtml?: string;
  /** Owner-approved replacement for the Product Details > Specifications tab. */
  specificationsHtml?: string;
  /** Page-specific intro combined with the current shared Shipping tab renderer. */
  shippingHtml?: string;
  /** Owner-approved fixed hero facts table. When present, it replaces the standard
      computed feature cells instead of mixing generated facts into the buy box. */
  heroTable?: string[][];
  /** Optional owner-approved additions to an existing Description-tab string.
      Absent means the original HTML is returned byte-for-byte. */
  descriptionHtmlAdditions?: {
    beforeHtml?: string;
    insertHtml?: string;
    appendHtml?: string;
  };
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
  /** CO-00 (19 Aug 2026) — opt in to `#size-<slug>` DOM ids on each size section,
      forwarded to PortaCabinVariantHero's own `emitSizeAnchors` prop (default
      false there too). Absent on every other product → no id is emitted,
      byte-identical elsewhere. */
  emitSizeAnchors?: boolean;
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
  /** Optional page-owned size-section copy. When supplied, it takes precedence over
      the legacy registry so a signed page copy pack can remain the rendering source. */
  applicationsContent?: {
    h2?: string;
    intro?: string;
    panels: Array<{
      sizeSlug: string;
      h3: string;
      paragraph: string;
      paragraph2?: string;
      applications: string[];
      applicationsHeading?: string;
      imageAlt?: string;
      image?: VariantImage;
      tabLabel?: string;
    }>;
  };
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
  /** Merchant schema offer mode. Default aggregateOffer keeps existing variant pages
      unchanged; "offer" emits a single from-price Offer derived from the ladder. */
  schemaOfferType?: 'aggregateOffer' | 'offer';
  /** Merchant condition for the Product Offer, encoded from an owner/commercial ruling.
      Default remains new, matching the legacy product schema. */
  schemaItemCondition?: 'new' | 'refurbished' | 'used';
  /** Opt-in removal of product AggregateRating for pages whose ticket forbids it. */
  suppressAggregateRatingSchema?: boolean;
  /** Suppress all legacy visible/schema review claims when provenance is not established. */
  suppressReviewClaims?: boolean;
  /** Omit availability from Product/Offer schema for pages without an approved stock ruling. */
  suppressSchemaAvailability?: boolean;
  /** Optional cap for Product JSON-LD image URLs. Absent keeps current pages unchanged. */
  schemaImageLimit?: number;
  /** Optional schema brand override for route-owned product data. Absent preserves
      the legacy Product brand name for every existing page. */
  schemaBrandName?: string;
  /** Optional schema image selection. `variant-first-images` emits one lead image
      per size, instead of the first N gallery assets. */
  schemaImageMode?: 'variant-first-images';
  /** Optional expansion of the AggregateOffer with one ex-GST Offer per visible
      size row. Absent keeps existing AggregateOffer output unchanged. */
  schemaIncludeVariantOffers?: boolean;
  /** LC-05 (16 Aug 2026) - emit the sourced Product entity even while its owner-
      approved price ladder is pending. The entity carries no Offer, rating or
      review. Absent everywhere else, so the existing rich-result evidence gate
      remains unchanged for every sibling. */
  emitQuoteOnlyProduct?: boolean;
  /** Exact Product JSON-LD override for pages whose build ticket pins a bespoke
      Product node. Absent everywhere else, so existing generated schema remains. */
  schemaOverride?: Record<string, unknown>;
  /** Emit schemaOverride as the only JSON-LD node for tickets that forbid the
      default ItemPage/Breadcrumb wrapper. Absent keeps existing pages unchanged. */
  schemaOutputMode?: 'default' | 'productOnly';
  /** LC-05 (16 Aug 2026) - allow Next's responsive image pipeline for a page whose
      gallery assets are local WebPs. Absent/false preserves the deployed bypass
      decision byte-for-byte on every sibling product. */
  optimizeLocalGalleryImages?: boolean;
  /** Middle segment of the buy-box trust strip. Default (absent) → preset, else the
      deployed literal "5-yr structural warranty" (flagship byte-identical). */
  trustWarranty?: string;
  /** Exact owner-approved trust-strip copy. */
  trustStripText?: string;
  /** Suppress the template proof row when its generic claims are not approved. */
  hideHeroProofRow?: boolean;
  /** Hide the default hero trust row when a page supplies no approved string for it. */
  hideTrustRow?: boolean;
  /** T25 VIDEO OPT-IN. Absent/false (the default) = no video facade thumb and no
      VideoObject JSON-LD. Set true ONLY on a product that genuinely has its own
      overview video AND video metadata (own `video` field or a preset). */
  hasProductVideo?: boolean;
  /** Per-product video metadata; overrides the preset. Read only when
      `hasProductVideo` is true. */
  video?: VariantProductVideoData;
  /** Optional page-owned rail tiles. Used only by routes whose copy pack owns
      labels and hrefs for the range/YMAL cards. */
  breadcrumbText?: string;
  relatedTiles?: Array<{ title: string; href: string; category: string; blurb: string; imageSrc?: string; imageAlt?: string }>;
  ymalTiles?: Array<{ title: string; href: string; category: string; blurb: string; imageSrc?: string; imageAlt?: string }>;
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
