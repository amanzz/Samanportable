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
  /** YouTube-owned thumbnail URL extracted from oEmbed; schema only. */
  schemaThumbnailUrl: string;
  uploadDate: string;
  duration: string;
  transcriptHeading?: string;
  transcript?: string;
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
  /** Middle segment of the buy-box trust strip ("GST Registered · {trustWarranty} ·
      Pan-India delivery"). Default (absent) keeps the deployed literal "5-yr structural
      warranty" → flagship/other products byte-identical. Set only where the product's
      warranty differs (e.g. container-offices: "12-month workmanship warranty", per
      Decision-W1 — steel structural-frame product, NOT the 5–10-year panel line). */
  trustWarranty?: string;
  /** Buy-box "Material" feature cell. Default (absent) keeps the deployed literal
      "MS Frame · Insulated Panels" → every other product byte-identical. Same
      override family as `trustWarranty`/`deliveryLabel`; sanctioned by W3-A Ruling 1
      for portable-office, whose approved §A states the material line differently. */
  materialLabel?: string;
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
      embedSrc: 'https://www.youtube-nocookie.com/embed/SJml1DgMY3I?autoplay=1',
      embedUrl: 'https://www.youtube-nocookie.com/embed/SJml1DgMY3I',
      posterSrc: '/images/porta-cabin-product-video-poster.webp',
      posterAlt: 'Porta cabin product video: 9 standard sizes overview (play)',
      title: 'Porta Cabin Office by SAMAN | Prefab Cabins, Interiors & Custom Sizes: Made in India',
      schemaDescription:
        'A walkthrough of every SAMAN porta cabin size from 10 × 10 ft to 40 × 12 ft, showing what each footprint holds, how the cabin is built, and where each size is used on real project sites.',
      schemaThumbnailUrl: 'https://i.ytimg.com/vi/SJml1DgMY3I/hqdefault.jpg',
      uploadDate: '2026-07-21T22:13:18-07:00',
      duration: 'PT1M21S',
      transcriptHeading: 'Transcript: porta cabin sizes',
      transcript:
        'SAMAN Portable manufactures porta cabins at our own works in India. Each unit is newly fabricated from MS sheet, MS pipe framing and aluminium sections, not a converted shipping container, and is offered in nine standard sizes. The 10 × 10 ft cabin gives 100 sq ft for a single desk or duty post. The 20 × 8 ft gives 160 sq ft on a slim body for tight boundaries. The 20 × 10 ft, at 200 sq ft, is our most-ordered size. The 20 × 12 ft adds 240 sq ft with room for a records or meeting corner. The 20 × 20 ft gives a 400 sq ft square floor suited to briefings. The 30 × 10 ft holds two rooms across 300 sq ft on a single trailer. The 40 × 8 ft runs to 320 sq ft for site rows. The 40 × 10 ft gives 400 sq ft as a full site headquarters. The 40 × 12 ft, at 480 sq ft, is the largest cabin we build in one piece. Every unit uses a welded MS frame with insulated walls and roof, and arrives with wiring, lighting and AC provision fitted. Grades run from value to premium. Cabins are supplied as site offices, security posts, shops, units with an attached toilet, and heavy industrial builds. All units carry a 5-year structural warranty and a 1-year finishing warranty, extendable to 2 years on request. Delivery is 7 to 21 working days from our Bengaluru or Greater Noida facility.',
    },
  },
  // C-08 CONTAINER HOUSES hub (/product/container-houses). E4 item 3: ONE video,
  // ONE page. The five subpages neither declare `hasProductVideo` nor carry a
  // preset entry, so resolveVariantVideo returns null on every one of them and no
  // second VideoObject is ever emitted.
  //
  // Every value below was READ from YouTube for M9MsHw2_CCc on 05 Aug 2026 and
  // none is estimated. Provenance, field by field:
  //   title      meta[name=title] / meta[property=og:title], and the oEmbed
  //              endpoint's `title` — all three agree.
  //   description ytInitialPlayerResponse.videoDetails.shortDescription — the
  //              COMPLETE field, byte-identical, chapter timestamps, contact
  //              lines, URLs, hashtags and all (E5 item 5). Copied from the
  //              extract in page-structure/C08/c08-e4-youtube-metadata-extract.json
  //              rather than retyped, so no transcription error is possible.
  //   uploadDate meta[itemprop=datePublished], which matches
  //              microformat.playerMicroformatRenderer.uploadDate exactly.
  //   duration   meta[itemprop=duration] — YouTube's own ISO 8601 value. Note
  //              videoDetails.lengthSeconds reads 115 s against this 116 s;
  //              YouTube publishes PT1M56S, so PT1M56S is what we mirror.
  //   thumbnail  link[itemprop=thumbnailUrl] / meta[property=og:image].
  // The poster is OUR asset, served same-origin: the video's own frame,
  // unaltered, re-encoded to WebP at 1280×720.
  'container-houses': {
    video: {
      embedSrc: 'https://www.youtube-nocookie.com/embed/M9MsHw2_CCc?autoplay=1',
      embedUrl: 'https://www.youtube-nocookie.com/embed/M9MsHw2_CCc',
      posterSrc: '/images/container-house-product-video-poster.webp',
      posterAlt: 'Container House in India | Full Home Tour | SAMAN Portable',
      title: 'Container House in India | Full Home Tour | SAMAN Portable',
      schemaDescription:
        'Tour a modern container house in India by SAMAN Portable. See the landscaped exterior, bright living room, dining area, open kitchen, bedroom, bathroom, utility space and a customizable double-storey concept with a rooftop terrace.\n\nThis residential container house design is planned for buyers considering a farmhouse, weekend home, holiday stay or compact family home. Large windows bring in natural light, while the open living, dining and kitchen layout makes the interior feel welcoming and practical. The video also shows built-in storage, a comfortable bedroom and a thoughtfully planned bathroom and utility area.\n\nWhat you will see in this container house tour:\n• Red corrugated-steel exterior with large glazed openings\n• Landscaped courtyard and outdoor family space\n• Open living room, dining area and modern kitchen\n• Practical kitchen storage and everyday work space\n• Bedroom, bathroom and utility-area planning\n• Custom double-storey and rooftop-terrace concept\n• Factory-built approach for a faster, controlled build process\n\nSAMAN Portable manufactures container houses with layouts, insulation, electrical, plumbing and finish options selected for the buyer\'s project. The 21-day timeline mentioned in the video is the featured concept timeline; actual price, materials, site work, transport and delivery schedule are confirmed after the size, location and specifications are finalized.\n\nExplore container house designs, sizes and build options:\nhttps://www.samanportable.com/product/container-houses\n\nRequest a quotation:\nSouth / Bengaluru: +91 88616 22859 | sales@samanportable.com\nNorth / Greater Noida: +91 87960 39938 | ncr@samanportable.com\nWebsite: https://www.samanportable.com/product/container-houses\n\nCHAPTERS\n00:00 Welcome to SAMAN Portable\n00:04 Container house exterior and featured timeline\n00:10 Farmhouse, weekend-home and holiday-stay use\n00:20 Living, kitchen and bedroom layout\n00:30 Natural light and open interior\n00:40 Courtyard and landscaped garden\n00:50 Living room, dining area and open kitchen\n01:00 Modular kitchen and practical storage\n01:12 Double-storey and rooftop-terrace option\n01:20 Bedroom and storage\n01:30 Bathroom and utility area\n01:40 Factory-built container house\n01:50 Contact SAMAN Portable\n\n#ContainerHouse #ContainerHome #ContainerHouseIndia #ContainerHouseManufacturer #ModernContainerHome #SAMANPortable',
      schemaThumbnailUrl: 'https://i.ytimg.com/vi/M9MsHw2_CCc/maxresdefault.jpg',
      uploadDate: '2026-08-04T01:12:03-07:00',
      duration: 'PT1M56S',
    },
  },
  // C-02 PORTABLE CABIN hub (/product/portable-cabin). The page data opts into
  // this one page-owned video; no subpage inherits it.
  'portable-cabin': {
    video: {
      embedSrc: 'https://www.youtube-nocookie.com/embed/_0pSsmEN1eo?autoplay=1',
      embedUrl: 'https://www.youtube-nocookie.com/embed/_0pSsmEN1eo',
      posterSrc: '/images/portable-cabin-product-video-poster.webp',
      posterAlt: 'Portable Cabin Manufacturer in India | Movable Office Cabins | SAMAN Portable',
      title: 'Portable Cabin Manufacturer in India | Movable Office Cabins | SAMAN Portable',
      schemaDescription:
        'A walkthrough of every SAMAN portable cabin size, showing how each unit is craned, relocated and re-sited, and which footprint suits a site that moves as the work moves.',
      schemaThumbnailUrl: 'https://i.ytimg.com/vi/_0pSsmEN1eo/hqdefault.jpg',
      uploadDate: '2026-07-21T22:55:14-07:00',
      duration: 'PT1M39S',
      transcriptHeading: 'Transcript: portable cabin sizes',
      transcript:
        'SAMAN Portable builds portable cabins you can move when the work moves. Each unit is factory-built, craned onto your prepared base, and relocated when the site changes. The 10 × 10 ft cabin covers 100 sq ft for one person and lifts by pickup. The 20 × 8 ft gives 160 sq ft and is narrow enough to travel without a permit. The 20 × 10 ft offers 200 sq ft for a small team, ready to relocate. The 20 × 12 ft adds 240 sq ft with a second zone that survives the lift. The 20 × 20 ft gives 400 sq ft as two modules that separate and rejoin at the next site. The 30 × 10 ft covers 300 sq ft, partitioned and engineered to be lifted. The 40 × 8 ft gives 320 sq ft in rows that re-form at the next location. The 40 × 10 ft offers 400 sq ft as a headquarters that outlives a single project. The 40 × 12 ft, at 480 sq ft, is our biggest single-lift unit. Lifting lugs are designed against the completed unit weight, and a lifting drawing ships with every cabin: handle the unit only by that drawing. Cabins serve construction sites, infrastructure fronts, rental fleets and temporary offices that move between locations. All units carry a 5-year structural warranty and a 1-year finishing warranty, extendable to 2 years on request, and are installed by our own crew from Bengaluru or Greater Noida.',
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
    categoryHref: '/product/porta-cabins',
    productSku: 'SP-PSC-15-2024',
    // Explorer tab image = each size's hero-view WebP (FIX-PACKET) — this product ships
    // 5 views (no elevated-view), so the Explorer reuses the gallery hero shot. The hero
    // component then carries that image's own §E alt (see panelImage below).
    explorerImageTemplate: '/images/products/portable-shop-cabin/{sizeSlug}/portable-shop-cabin-{sizeSlug}-hero-view.webp',
  },
  // C-04 CONTAINER OFFICES hub (/product/container-offices). Its own
  // data/products/container-offices.json supplies the nine variants (ex/incl-GST ladder,
  // images, emitAggregateOffer). This preset supplies the derived surfaces: the singular
  // product noun, the Category row, the locked L3 SKU (page-level, not per-variant), and
  // the Explorer tab image = each size's elevated-hero WebP (copy pack §E / build step 3).
  // Deliberately absent: `specPdfHref` and `video` (none exist for this page).
  'container-offices': {
    productName: 'Container Office',
    categoryLabel: 'Container Offices',
    categoryHref: '/product/container-offices',
    productSku: 'SP-20-CO-2024',
    explorerImageTemplate: '/images/products/container-offices/{sizeSlug}/container-offices-{sizeSlug}-hero-view.webp',
    applicationsDataset: 'container-offices',
    trustWarranty: '12-month workmanship warranty',
  },
  // C-03 PORTABLE OFFICE hub (/product/portable-office). Its own
  // data/products/portable-office.json supplies the nine variants (§A ex/incl-GST ladder,
  // curated-5 images, emitAggregateOffer, deliveryLabel). This preset supplies the derived
  // surfaces: the singular product noun, the Category row, the L3-frozen page-level SKU,
  // and the Explorer tab image = each size's exterior-hero WebP (copy pack §E).
  // Deliberately absent: `specPdfHref` and `video` (none exist for this page).
  // trustWarranty + materialLabel are the two sanctioned overrides (W3-A §C / Ruling 1).
  'portable-office': {
    productName: 'Portable Office',
    categoryLabel: 'Portable Office',
    categoryHref: '/product/portable-office',
    productSku: 'SP-PPO-20-2025',
    explorerImageTemplate: '/images/products/portable-office/{sizeSlug}/portable-office-{sizeSlug}-exterior-hero.webp',
    applicationsDataset: 'portable-office',
    trustWarranty: 'ISO 9001:2015 certified manufacturer',
    materialLabel: 'MS structural frame + insulated panel build',
  },
  // C-05 CONTAINER CAFE hub (/product/container-cafe). Its own
  // data/products/container-cafe.json supplies the six variants (§7 ex/incl-GST ladder,
  // emitAggregateOffer, specPdfHref, L3 meta + opener) and the per-size explorer image
  // map. This preset supplies only the derived surfaces: the singular product noun and
  // the Category row. Deliberately absent: `productSku` (the wp-export SKU
  // `SP-CC-40-2024` does not match CLAUDE.md's SP-{cluster}-{code}-2026 pattern and the
  // replacement is not ruled — the row resolves from the legacy record rather than an
  // invented value), `video` (none exists), and `trustWarranty`/`materialLabel` (the
  // draft rules neither, so the deployed literals stand).
  'container-cafe': {
    productName: 'Container Cafe',
    categoryLabel: 'Container Cafe',
    categoryHref: '/product/container-cafe',
    applicationsDataset: 'container-cafe',
  },
  // C-05 subpages. Their own data files supply the six variants, the L3 zone and the
  // per-size explorer image map; these presets supply only the Category row. The
  // page-level SKU is deliberately absent on both: the wp-export values
  // (SP-CR-20-2023, SP-12-FTC-2024) do not match CLAUDE.md's SP-{cluster}-{code}-2026
  // pattern and no replacement is ruled, so nothing is invented.
  'container-restaurant': {
    categoryLabel: 'Container Cafe',
    categoryHref: '/product/container-cafe',
  },
  'food-truck-containers': {
    categoryLabel: 'Container Cafe',
    categoryHref: '/product/container-cafe',
  },
  'container-hotel': {
    categoryLabel: 'Container Cafe',
    categoryHref: '/product/container-cafe',
  },
  'modular-container-cafe': {
    categoryLabel: 'Container Cafe',
    categoryHref: '/product/container-cafe',
  },
  'container-coffee-shop': {
    categoryLabel: 'Container Cafe',
    categoryHref: '/product/container-cafe',
  },
  // PC-02 GI PORTA CABIN subpage (/product/porta-cabins/gi-porta-cabin). Its own
  // data/products/gi-porta-cabin.json supplies the six variants, the ladder, the
  // per-size galleries, the L3 meta and the spec PDF. This preset supplies only the
  // derived surfaces: the singular product noun, the cluster Category row and the
  // page-level SKU (Ruling 3: cluster code GIPC, `SP-GIPC-{defaultSize}`, following
  // the ruled sibling pattern `SP-MSPC-20x10`).
  //
  // Deliberately ABSENT: `explorerImageTemplate` — the approved 42-slot manifest has
  // no Explorer image, and the hero is told so explicitly via `explorerHidePanelImages`
  // rather than being left to derive a path that does not exist on disk.
  // `applicationsDataset` lives on the data file. `video` — none exists.
  'gi-porta-cabin': {
    productName: 'GI Porta Cabin',
    categoryLabel: 'Porta Cabins',
    categoryHref: '/product/porta-cabins',
    productSku: 'SP-GIPC-20x10',
  },
  // PC-03 DOUBLE STORY (G+1) subpage (/product/porta-cabins/double-story-porta-cabin).
  // Its own data/products/double-story-porta-cabin.json supplies the six variants, the
  // ladder, the per-size galleries, the L3 meta and the spec PDF. This preset supplies
  // only the derived surfaces: the singular product noun, the cluster Category row and
  // the page-level SKU. Deliberately absent: `explorerImageTemplate` (each panel names
  // its own image in the applications dataset) and `video` (none exists).
  'double-story-porta-cabin': {
    productName: 'Double Story (G+1) Porta Cabin',
    categoryLabel: 'Porta Cabins',
    categoryHref: '/product/porta-cabins',
    productSku: 'SP-DSPC-20x10',
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
    // PC-05 (14 Aug 2026) — Ruling G: FRPC is the ruled SKU cluster code for
    // this page, recorded here rather than invented per-variant. explorerImageTemplate
    // is overridden per-size in the page's own data file (data wins over preset),
    // so the derived `{slug}-{sizeSlug}-elevated-view.webp` pattern below is never
    // read for this slug — kept only for shape consistency with every other entry.
    'fire-rated-porta-cabin': ['SP-FRPC', '20x10'],
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
