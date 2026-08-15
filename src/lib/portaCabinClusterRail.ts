// T25 — S4 related-rail contents for the porta cabin cluster.
//
// RULING v2.1 (SAMAN veto, 18 Jul 2026) — supersedes the matrix v2 "hub + 3 siblings"
// strip: every subpage's rail shows the FULL cluster — the hub first, then ALL sibling
// subpages in canonical order. The flagship's own rail is untouched.
//
// Still in force from matrix v2:
//  - rail entries are NAVIGATION, so exact product names are correct there and do NOT
//    count toward the cluster's exact-match anchor cap;
//  - "Portable Cabin" is BANNED from this cluster's related items;
//  - S2 in-body editorial links and every anchor rule are UNCHANGED by this ruling.
//
// Redirected slugs must never appear: they 301 away, so railing them would send users
// through a redirect. As of C01 (Fable 5 ruling, 24 Jul 2026) the redirected set is
// toilet-porta-cabins, buy-porta-cabins, small-portacabin, porta-cabin-office and
// prefabricated-porta-cabin. portacabin-office is NO LONGER redirected — the office pair
// was reversed and portacabin-office is now the live office survivor, so it joins the rail.
//
// This module only decides WHICH siblings appear and in WHAT ORDER. The rail items
// themselves (title, image, blurb, price) keep coming from the live product data, so
// no copy is authored here.

export const PORTA_CABIN_HUB_SLUG = 'porta-cabins';

// R1a (PC-00-revision-v1.3, 14 Aug 2026) — the hub's OWN Column 3 rail, listing
// all 10 configuration children (owner-delegated ruling; 7 of the 10 URLs are
// not yet live and will 404 until the cluster completes, per written owner
// acceptance). Static, not sourced from WooCommerce related-products, because 7
// of these 10 pages do not exist as products yet — the flagship's rail is
// deliberately NOT covered by portaCabinStripOrder() above (see its own
// comment: "The flagship's own rail is untouched"), so it needs its own list.
// R16 (v1.4, 14 Aug 2026) — every card now carries a real image from that
// child's OWN folder. Three came from a `*hero-view*` file; the other seven had
// no such file and were selected by the R16 priority rule (`main-exterior` →
// `exterior` → `hero` → alphabetically first) and then opened and visually
// confirmed to show that product's cabin exterior. No product is ever
// represented by another product's image.
export const PORTA_CABIN_HUB_RAIL: import('./c16PanelCatalog').RelatedRailItem[] = [
  {
    title: 'MS Porta Cabin',
    href: '/product/porta-cabins/ms-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Heavy industrial duty in a thicker mild-steel build',
    imageSrc: '/images/products/porta-cabins/children/ms-porta-cabin-card.webp',
    imageAlt: 'MS Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'GI (Galvanized Iron) Porta Cabin',
    href: '/product/porta-cabins/gi-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Coastal and high-corrosion sites',
    imageSrc: '/images/products/porta-cabins/children/gi-porta-cabin-card.webp',
    imageAlt: 'GI (Galvanized Iron) Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'PUF Porta Cabin',
    href: '/product/porta-cabins/puf-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Higher thermal insulation duty',
    imageSrc: '/images/products/porta-cabins/children/puf-porta-cabin-card.webp',
    imageAlt: 'PUF Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'Double Story (G+1) Porta Cabin',
    href: '/product/porta-cabins/double-story-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Two floors on one footprint',
    imageSrc: '/images/products/porta-cabins/children/double-story-porta-cabin-card.webp',
    imageAlt: 'Double Story (G+1) Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'Skid-Mounted Porta Cabin',
    href: '/product/porta-cabins/skid-mounted-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Repeated relocation on a heavy skid base',
    imageSrc: '/images/products/porta-cabins/children/skid-mounted-porta-cabin-card.webp',
    imageAlt: 'Skid-Mounted Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'Knock-Down Porta Cabin',
    href: '/product/porta-cabins/knock-down-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Flat-pack, bolt-together assembly on site',
    imageSrc: '/images/products/porta-cabins/children/knock-down-porta-cabin-card.webp',
    imageAlt: 'Knock-Down Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'Fire-Rated Porta Cabin',
    href: '/product/porta-cabins/fire-rated-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Sites with fire-performance requirements',
    imageSrc: '/images/products/porta-cabins/children/fire-rated-porta-cabin-card.webp',
    imageAlt: 'Fire-Rated Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'Soundproof Porta Cabin',
    href: '/product/porta-cabins/soundproof-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Acoustic-controlled rooms near noise',
    imageSrc: '/images/products/porta-cabins/children/soundproof-porta-cabin-card.webp',
    imageAlt: 'Soundproof Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'Porta Cabin with Toilet',
    href: '/product/porta-cabins/porta-cabin-with-toilet',
    category: 'Porta Cabins',
    blurb: 'Office or room with attached sanitation',
    imageSrc: '/images/products/porta-cabins/children/porta-cabin-with-toilet-card.webp',
    imageAlt: 'Porta Cabin with Toilet by SAMAN — exterior view',
  },
  {
    title: 'Porta Cabin Shop & Kiosk',
    href: '/product/porta-cabins/porta-cabin-shop',
    category: 'Porta Cabins',
    blurb: 'Retail counters, kiosks and shopfronts',
    imageSrc: '/images/products/porta-cabins/children/porta-cabin-shop-card.webp',
    imageAlt: 'Porta Cabin Shop & Kiosk by SAMAN — exterior view',
  },
];

/**
 * PC-01 (14 Aug 2026) — the MS page's OWN Column 3 rail. The approved MS build
 * ticket (§4 Column 3) names exactly three comparison destinations with the buyer
 * reason each one serves, so this page does NOT show the full-cluster rail that
 * `orderPortaCabinStrip` builds for its siblings. Titles and blurbs are verbatim
 * from that table; the card images are the same R16 files the hub rail uses, so no
 * product is represented by another product's image.
 */
export const PORTA_CABIN_MS_RAIL: import('./c16PanelCatalog').RelatedRailItem[] = [
  {
    title: 'GI Porta Cabin',
    href: '/product/porta-cabins/gi-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Zinc-coated material route for coastal/humid sites',
    imageSrc: '/images/products/porta-cabins/children/gi-porta-cabin-card.webp',
    imageAlt: 'GI (Galvanized Iron) Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'PUF Porta Cabin',
    href: '/product/porta-cabins/puf-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Higher thermal-insulation build',
    imageSrc: '/images/products/porta-cabins/children/puf-porta-cabin-card.webp',
    imageAlt: 'PUF Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'Porta Cabin with Toilet',
    href: '/product/porta-cabins/porta-cabin-with-toilet',
    category: 'Porta Cabins',
    blurb: 'Cabin plus attached sanitation',
    imageSrc: '/images/products/porta-cabins/children/porta-cabin-with-toilet-card.webp',
    imageAlt: 'Porta Cabin with Toilet by SAMAN — exterior view',
  },
];
/**
 * PC-04 (14 Aug 2026) — the with-toilet page's Column 3, exactly the three tabs and
 * the three buyer-comparison reasons in §1 of the approved draft v2. Not the
 * full-cluster strip, so it is scoped to this one slug in the route.
 *
 * v1.3 §1.2 — every card carries a real image of its own product, selected by the
 * ticket's deterministic rule and visually confirmed before wiring:
 *   MS Porta Cabin  -> children/ms-porta-cabin-card.webp (existing purpose-built card)
 *   Portable Toilet -> product-heroes/portable-toilet/mobile-toilet-cabin-white-exterior.webp
 *                      (first "exterior" match in that product's own folder)
 *   Porta Cabins    -> products/porta-cabins/40x12/porta-cabin-40x12-hero-view.webp
 *                      (no top-level file; first "hero" match in the largest size folder)
 * The latter two were processed to the cluster's 640x360 card format. No product is
 * ever shown under another product's image. Alts use the hyphen form, so no em dash
 * enters this page's markup.
 */
export const PORTA_CABIN_WITH_TOILET_RAIL: import('./c16PanelCatalog').RelatedRailItem[] = [
  {
    title: 'MS Porta Cabin',
    href: '/product/porta-cabins/ms-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Same frame and shell without the wet zone, lower rate',
    imageSrc: '/images/products/porta-cabins/children/ms-porta-cabin-card.webp',
    imageAlt: 'MS Porta Cabin by SAMAN - exterior view',
  },
  {
    title: 'Portable Toilet',
    href: '/product/portable-toilet',
    category: 'Portable Toilet',
    blurb: 'Sanitation-only alternative when no working room is needed',
    imageSrc: '/images/products/porta-cabins/children/portable-toilet-card.webp',
    imageAlt: 'Portable Toilet by SAMAN - exterior view',
  },
  {
    title: 'Porta Cabins Range',
    href: '/product/porta-cabins',
    category: 'Porta Cabins',
    blurb: 'Compare every cabin configuration and the full ladder',
    imageSrc: '/images/products/porta-cabins/children/porta-cabins-range-card.webp',
    imageAlt: 'Porta Cabins Range by SAMAN - exterior view',
  },
];

/**
 * PC-05 (14 Aug 2026) — the fire-rated page's OWN Column 3 rail. The approved
 * build ticket (§4 Column 3) names exactly four comparison destinations: MS
 * Porta Cabin, Soundproof Porta Cabin, PUF Porta Cabin, and the Porta Cabins
 * hub. The hub has no dedicated `children/` card (it isn't a child of itself),
 * so its own default-variant hero image is used — a real product photo, same
 * rule as every other card here.
 */
export const PORTA_CABIN_FIRE_RATED_RAIL: import('./c16PanelCatalog').RelatedRailItem[] = [
  {
    title: 'MS Porta Cabin',
    href: '/product/porta-cabins/ms-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Heavy industrial duty in a thicker mild-steel build',
    imageSrc: '/images/products/porta-cabins/children/ms-porta-cabin-card.webp',
    imageAlt: 'MS Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'Soundproof Porta Cabin',
    href: '/product/porta-cabins/soundproof-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Acoustic-controlled rooms near noise',
    imageSrc: '/images/products/porta-cabins/children/soundproof-porta-cabin-card.webp',
    imageAlt: 'Soundproof Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'PUF Porta Cabin',
    href: '/product/porta-cabins/puf-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Higher thermal insulation duty',
    imageSrc: '/images/products/porta-cabins/children/puf-porta-cabin-card.webp',
    imageAlt: 'PUF Porta Cabin by SAMAN — exterior view',
  },
  {
    title: 'Porta Cabins',
    href: '/product/porta-cabins',
    category: 'Porta Cabins',
    blurb: 'The standard reference specification and full size range',
    imageSrc: '/images/products/porta-cabins/20x10/saman-porta-cabin-20x10-hero-view.webp',
    imageAlt: 'SAMAN porta cabin exterior, 20x10 ft reference size',
  },
];

/**
 * PC-07 (15 Aug 2026) — the PUF page's OWN Column 3 rail. The approved build
 * prompt (§10 "Related product tabs") names exactly three destinations: MS
 * Porta Cabin, GI Porta Cabin, Fire-Rated Porta Cabin. Card images reused
 * verbatim from `children/` (owner-approved under PC-00 R1a/R16); alts use the
 * hyphen form because this page's own copy is held to zero U+2014.
 */
export const PORTA_CABIN_PUF_RAIL: import('./c16PanelCatalog').RelatedRailItem[] = [
  {
    title: 'MS Porta Cabin',
    href: '/product/porta-cabins/ms-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Heavy industrial duty in a thicker mild-steel build',
    imageSrc: '/images/products/porta-cabins/children/ms-porta-cabin-card.webp',
    imageAlt: 'MS Porta Cabin by SAMAN - exterior view',
  },
  {
    title: 'GI Porta Cabin',
    href: '/product/porta-cabins/gi-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Coastal and high-corrosion sites',
    imageSrc: '/images/products/porta-cabins/children/gi-porta-cabin-card.webp',
    imageAlt: 'GI Porta Cabin by SAMAN - exterior view',
  },
  {
    title: 'Fire-Rated Porta Cabin',
    href: '/product/porta-cabins/fire-rated-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Sites with fire-performance requirements',
    imageSrc: '/images/products/porta-cabins/children/fire-rated-porta-cabin-card.webp',
    imageAlt: 'Fire-Rated Porta Cabin by SAMAN - exterior view',
  },
];

/**
 * PC-09 (15 Aug 2026) — the Knock-Down page's OWN Column 3 rail. The approved
 * build prompt §7 names exactly three destinations: MS Porta Cabin, GI Porta
 * Cabin, Porta Cabin with Toilet. Titles, blurbs and card images reused
 * verbatim from the entries already established elsewhere in this file for
 * these same three products (owner-approved under PC-00 R1a/R16 and the MS/GI
 * rails above), so nothing here is newly authored. Alts use the hyphen form.
 */
export const PORTA_CABIN_KNOCK_DOWN_RAIL: import('./c16PanelCatalog').RelatedRailItem[] = [
  {
    title: 'MS Porta Cabin',
    href: '/product/porta-cabins/ms-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Heavy industrial duty in a thicker mild-steel build',
    imageSrc: '/images/products/porta-cabins/children/ms-porta-cabin-card.webp',
    imageAlt: 'MS Porta Cabin by SAMAN - exterior view',
  },
  {
    title: 'GI Porta Cabin',
    href: '/product/porta-cabins/gi-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Coastal and high-corrosion sites',
    imageSrc: '/images/products/porta-cabins/children/gi-porta-cabin-card.webp',
    imageAlt: 'GI Porta Cabin by SAMAN - exterior view',
  },
  {
    title: 'Porta Cabin with Toilet',
    href: '/product/porta-cabins/porta-cabin-with-toilet',
    category: 'Porta Cabins',
    blurb: 'Cabin plus attached sanitation',
    imageSrc: '/images/products/porta-cabins/children/porta-cabin-with-toilet-card.webp',
    imageAlt: 'Porta Cabin with Toilet by SAMAN - exterior view',
  },
];

/**
 * PC-02 (14 Aug 2026) — the GI page's OWN Column 3 rail. The approved GI build ticket
 * (section 4, "Column 3 related tabs") names exactly three destinations: the Porta
 * Cabins hub, the MS Porta Cabin and the PUF Porta Cabin, with no prices. So this page
 * does NOT show the full-cluster strip that `orderPortaCabinStrip` builds for its
 * siblings.
 */
// The two sibling rows. Titles, blurbs and card images are reused VERBATIM from
// PORTA_CABIN_HUB_RAIL above (owner-approved under PC-00 R1a/R16), so nothing here is
// authored. The one edit is punctuation: the hub's alts carry a U+2014 em dash, which
// acceptance criterion 11.3 bans from this page's rendered output, so the em dash is
// normalised to a comma exactly as the repo's own `rewriteC04VisiblePunctuation`
// already does elsewhere. No word changes.
const PORTA_CABIN_GI_SIBLINGS: import('./c16PanelCatalog').RelatedRailItem[] = [
  {
    title: 'MS Porta Cabin',
    href: '/product/porta-cabins/ms-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Heavy industrial duty in a thicker mild-steel build',
    imageSrc: '/images/products/porta-cabins/children/ms-porta-cabin-card.webp',
    imageAlt: 'MS Porta Cabin by SAMAN, exterior view',
  },
  {
    title: 'PUF Porta Cabin',
    href: '/product/porta-cabins/puf-porta-cabin',
    category: 'Porta Cabins',
    blurb: 'Higher thermal insulation duty',
    imageSrc: '/images/products/porta-cabins/children/puf-porta-cabin-card.webp',
    imageAlt: 'PUF Porta Cabin by SAMAN, exterior view',
  },
];

/**
 * Builds the GI page's three-item rail. The hub row is taken from the LIVE
 * platform-derived rail so its title, blurb and image come from the hub's own product
 * record rather than being written here; the two sibling rows are the approved static
 * entries above. If the hub row is missing from the live list the rail degrades to the
 * two siblings rather than inventing a hub card.
 */
export function buildPortaCabinGiRail<T extends { href: string }>(
  built: T[],
  hrefToSlug: (item: T) => string
): Array<T | import('./c16PanelCatalog').RelatedRailItem> {
  const hubRow = built.find((item) => hrefToSlug(item) === PORTA_CABIN_HUB_SLUG);
  return [...(hubRow ? [hubRow] : []), ...PORTA_CABIN_GI_SIBLINGS];
}

/**
 * PC-01 — "You may also like" lists the cluster's other nine configuration children
 * (the hub rail minus this page itself), reusing the hub's exact R16 card images and
 * blurbs. Navigation component: no prices on cards. Used by the MS page; left exactly
 * as PC-01 shipped it so that page's rendered alts stay byte-identical.
 */
export const PORTA_CABIN_SIBLING_YMAL = (slug: string) =>
  PORTA_CABIN_HUB_RAIL.filter((item) => slugFromProductHref(item.href) !== slug);

/**
 * PC-02 — the same nine children for the GI page, with the card ALTS normalised on the
 * way out: the hub's R16 alts carry a U+2014 em dash ("… by SAMAN — exterior view"),
 * which acceptance criterion 11.3 bans from this page's rendered output. The
 * substitution is exactly the repo's own `rewriteC04VisiblePunctuation` transform (em
 * dash to comma) and changes no word. It is a SEPARATE export rather than a change to
 * the function above, so the hub's and the MS page's rendered alts are untouched.
 */
/**
 * PC-03 (15 Aug 2026) - the double-story page's OWN Column 3 rail. Build prompt v2
 * section 9 names exactly three related tabs: MS Porta Cabin, Porta Cabin with Toilet
 * and Skid-Mounted Porta Cabin. Titles, hrefs, blurbs and card images are taken
 * VERBATIM from PORTA_CABIN_HUB_RAIL above, so nothing here is authored. Alts are
 * routed through the same em-dash normalisation the GI page uses, because CLAUDE.md
 * bans U+2014 from alt text; the hub's own array is not modified.
 */
const PORTA_CABIN_DS_RAIL_SLUGS = [
  'ms-porta-cabin',
  'porta-cabin-with-toilet',
  'skid-mounted-porta-cabin',
] as const;

export const PORTA_CABIN_DS_RAIL: import('./c16PanelCatalog').RelatedRailItem[] =
  PORTA_CABIN_DS_RAIL_SLUGS.map((wanted) => {
    const item = PORTA_CABIN_HUB_RAIL.find((row) => slugFromProductHref(row.href) === wanted);
    if (!item) throw new Error(`PC-03 rail: no hub-rail row for ${wanted}`);
    return item.imageAlt && item.imageAlt.includes('—')
      ? { ...item, imageAlt: item.imageAlt.replace(/\s*—\s*/g, ', ') }
      : item;
  });

/**
 * PC-08 (15 Aug 2026) - the skid-mounted page's OWN Column 3 rail. Build prompt v1
 * section 2 (assembly map, hero column 3) names exactly three related tabs: MS
 * Porta Cabin, Knock-Down Porta Cabin and Double Story (G+1) Porta Cabin. Titles,
 * hrefs, blurbs and card images are taken VERBATIM from PORTA_CABIN_HUB_RAIL above
 * (both card images already exist under `children/`, confirmed before wiring), so
 * nothing here is authored. Knock-down-porta-cabin is not yet built and will 404
 * until its own ticket lands; that follows the same precedent PC-03's rail set for
 * this very skid-mounted page before this ticket existed. Alts are routed through
 * the same em-dash normalisation as the DS rail, because this page's own copy is
 * held to zero U+2014.
 */
const PORTA_CABIN_SKID_RAIL_SLUGS = [
  'ms-porta-cabin',
  'knock-down-porta-cabin',
  'double-story-porta-cabin',
] as const;

export const PORTA_CABIN_SKID_RAIL: import('./c16PanelCatalog').RelatedRailItem[] =
  PORTA_CABIN_SKID_RAIL_SLUGS.map((wanted) => {
    const item = PORTA_CABIN_HUB_RAIL.find((row) => slugFromProductHref(row.href) === wanted);
    if (!item) throw new Error(`PC-08 rail: no hub-rail row for ${wanted}`);
    return item.imageAlt && item.imageAlt.includes('—')
      ? { ...item, imageAlt: item.imageAlt.replace(/\s*—\s*/g, ', ') }
      : item;
  });

export const PORTA_CABIN_SIBLING_YMAL_NO_EM_DASH = (slug: string) =>
  PORTA_CABIN_SIBLING_YMAL(slug).map((item) =>
    item.imageAlt && item.imageAlt.includes('—')
      ? { ...item, imageAlt: item.imageAlt.replace(/\s*—\s*/g, ', ') }
      : item
  );

/**
 * Canonical cluster order. Taken from the internal-linking matrix v2's own S4 table,
 * which is the cluster's canonical listing in the ruling document.
 */
export const PORTA_CABIN_CLUSTER_SLUGS: readonly string[] = [
  'ms-porta-cabin',
  'steel-porta-cabin',
  'luxury-porta-cabin',
  'mini-porta-cabin',
  'portacabin-office',
  'porta-cabin-shop',
  'porta-cabin-with-toilet',
  'low-cost-porta-cabin',
];

/** 301'd slugs — never railed. */
export const PORTA_CABIN_REDIRECTED_SLUGS: readonly string[] = [
  'toilet-porta-cabins',
  'buy-porta-cabins',
  'small-portacabin',
  'porta-cabin-office',
  'prefabricated-porta-cabin',
];

export const isPortaCabinStripSlug = (slug: string): boolean =>
  PORTA_CABIN_CLUSTER_SLUGS.includes(slug);

const C01_HUB_RETURN_ANCHORS: Record<string, string> = {
  'low-cost-porta-cabin': 'the full cabin range and its standard specification',
  'luxury-porta-cabin': 'our complete range of factory-built cabins',
  'steel-porta-cabin': 'the standard cabin build',
  'porta-cabin-with-toilet': 'the standard cabin without sanitary provision',
  'porta-cabin-shop': 'see how the base cabin is specified',
  'mini-porta-cabin': 'all nine standard cabin sizes',
  'portacabin-office': 'the wider cabin range',
  'ms-porta-cabin': 'the standard reference specification',
};

export const c01HubReturnAnchorForSlug = (slug: string): string | null =>
  C01_HUB_RETURN_ANCHORS[slug] || null;

/** Full rail for a subpage: hub first, then every sibling in canonical order (self excluded). */
export const portaCabinStripOrder = (slug: string): string[] => {
  if (!isPortaCabinStripSlug(slug)) return [];
  return [
    PORTA_CABIN_HUB_SLUG,
    ...PORTA_CABIN_CLUSTER_SLUGS.filter(
      (s) => s !== slug && !PORTA_CABIN_REDIRECTED_SLUGS.includes(s)
    ),
  ];
};

/**
 * Reorder/pare an already-built rail to the matrix. Items are matched by the slug
 * embedded in their href, so this works with whatever shape the caller built.
 *
 * Anything not named by the matrix is dropped — the strip is exactly hub + 3.
 * A named sibling that is missing from `items` is skipped rather than substituted,
 * and reported by `missingPortaCabinStripSlugs` so a gap is visible, never silently
 * back-filled with an unrelated product.
 */
export function orderPortaCabinStrip<T>(
  slug: string,
  items: readonly T[],
  slugOf: (item: T) => string
): T[] {
  const order = portaCabinStripOrder(slug);
  if (order.length === 0) return [...items];
  const bySlug = new Map<string, T>();
  for (const item of items) {
    const s = slugOf(item);
    if (s && !bySlug.has(s)) bySlug.set(s, item);
  }
  return order.map((s) => bySlug.get(s)).filter((v): v is T => v !== undefined);
}

/** Matrix slugs that were requested but absent from the supplied rail items. */
export function missingPortaCabinStripSlugs<T>(
  slug: string,
  items: readonly T[],
  slugOf: (item: T) => string
): string[] {
  const present = new Set(items.map(slugOf).filter(Boolean));
  return portaCabinStripOrder(slug).filter((s) => !present.has(s));
}

/** Extract the product slug from a rail href like /product/porta-cabins/ms-porta-cabin. */
export function slugFromProductHref(href: string): string {
  if (!href) return '';
  const clean = href.split('?')[0].split('#')[0].replace(/\/+$/, '');
  const parts = clean.split('/').filter(Boolean);
  if (parts[0] !== 'product') return '';
  // /product/{category} (hub) or /product/{category}/{slug}
  return parts.length >= 3 ? parts[2] : parts[1] || '';
}
