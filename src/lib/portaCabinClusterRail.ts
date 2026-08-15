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

// ---------------------------------------------------------------------------
// C01 "Explore the Range" rail consistency (15 Aug 2026) - DRIFT CORRECTION.
//
// SAMAN reported that the left-hand rail showed a different, apparently arbitrary
// set of products on every subpage, so a buyer landing on a subpage could not see
// the range. Cause: PORTA_CABIN_CLUSTER_SLUGS below is a stale WooCommerce-era list
// that names NONE of the rebuilt cluster pages, so isPortaCabinStripSlug() returned
// false for them and the shared full-cluster machinery never ran. Each page was then
// given its own hand-authored three-item rail (PORTA_CABIN_MS_RAIL,
// PORTA_CABIN_FIRE_RATED_RAIL, PORTA_CABIN_WITH_TOILET_RAIL, PORTA_CABIN_PUF_RAIL,
// PORTA_CABIN_DS_RAIL, PORTA_CABIN_SKID_RAIL and buildPortaCabinGiRail), authored one
// page at a time and never reconciled. Those seven constants are deleted here.
//
// This RESTORES RULING v2.1 at the top of this file (SAMAN veto, 18 Jul 2026): every
// subpage's rail shows the FULL cluster, hub first, then all sibling subpages in
// canonical order, self excluded. It invents no policy. The same ruling settles the
// SEO question: rail entries are NAVIGATION, exempt from the exact-match anchor cap.
// In-body editorial links, in Section 2 and the Description tab, are UNCHANGED.
//
// The hub's own rail (PORTA_CABIN_HUB_RAIL, consumed by /product/[category]/index.tsx)
// is deliberately NOT touched: "The flagship's own rail is untouched."
//
// Nothing here is authored. Every child card is looked up in PORTA_CABIN_HUB_RAIL by
// slug, so titles, blurbs, images and alts are the R16 strings already approved. The
// hub card is the "Porta Cabins Range" card moved verbatim out of the deleted
// PORTA_CABIN_WITH_TOILET_RAIL - it is the only hub card in this file carrying a
// purpose-built 640x360 image from the cluster's own `children/` folder.
// ---------------------------------------------------------------------------

/**
 * The one em-dash-to-comma transform this file already applied inline in
 * PORTA_CABIN_DS_RAIL, PORTA_CABIN_SKID_RAIL and PORTA_CABIN_SIBLING_YMAL_NO_EM_DASH.
 * The hub rail's R16 alts carry a U+2014, which CLAUDE.md bans from built output on
 * every page rebuilt in this cluster, so subpage rails route their alts through it.
 * Punctuation only: no word changes, and PORTA_CABIN_HUB_RAIL itself is not modified.
 */
const normaliseRailAlt = <T extends import('./c16PanelCatalog').RelatedRailItem>(item: T): T =>
  item.imageAlt && item.imageAlt.includes('—')
    ? { ...item, imageAlt: item.imageAlt.replace(/\s*—\s*/g, ', ') }
    : item;

/** The hub card that leads every subpage rail. Moved verbatim from PC-04's rail. */
const PORTA_CABIN_RAIL_HUB_CARD: import('./c16PanelCatalog').RelatedRailItem = {
  title: 'Porta Cabins Range',
  href: '/product/porta-cabins',
  category: 'Porta Cabins',
  blurb: 'Compare every cabin configuration and the full ladder',
  imageSrc: '/images/products/porta-cabins/children/porta-cabins-range-card.webp',
  imageAlt: 'Porta Cabins Range by SAMAN - exterior view',
};

/**
 * The ten approved children, in approved-plan order. `live` gates rendering: a card is
 * never rendered for a URL that 404s, so turning a page on after it deploys is a
 * one-word change here and nowhere else.
 *
 * Live status verified by request on 15 Aug 2026: all ten slugs below return 200.
 * knock-down-porta-cabin was the one exception until PC-09 deployed later the same
 * day; the flag was flipped after re-confirming 200, not on the assumption it shipped.
 *
 * The five legacy cluster slugs in PORTA_CABIN_CLUSTER_SLUGS below (steel-, luxury-,
 * mini-, low-cost-porta-cabin and portacabin-office) are deliberately absent: they are
 * redirect-slated under the site-wide ruling of 14 Aug 2026 and are not in the 106-page
 * approved plan, and this file's own rule is that a redirect-slated slug is never
 * railed. Reported to SAMAN as decision A; adding them is a five-line change here.
 */
export const PORTA_CABIN_RAIL_ORDER: readonly { slug: string; live: boolean }[] = [
  { slug: 'ms-porta-cabin', live: true },
  { slug: 'gi-porta-cabin', live: true },
  { slug: 'double-story-porta-cabin', live: true },
  { slug: 'porta-cabin-with-toilet', live: true },
  { slug: 'fire-rated-porta-cabin', live: true },
  { slug: 'soundproof-porta-cabin', live: true },
  { slug: 'puf-porta-cabin', live: true },
  { slug: 'skid-mounted-porta-cabin', live: true },
  // PC-09 deployed 15 Aug 2026; confirmed 200 by request. Flipped from false.
  { slug: 'knock-down-porta-cabin', live: true },
  { slug: 'porta-cabin-shop', live: true },
];

/** True for the ten approved cluster children, live or not. */
export const isPortaCabinRailSlug = (slug: string): boolean =>
  PORTA_CABIN_RAIL_ORDER.some((entry) => entry.slug === slug);

/**
 * The rail every cluster subpage renders: the hub, then every LIVE sibling in the
 * canonical order above, self excluded. A slug with no row in PORTA_CABIN_HUB_RAIL is
 * skipped rather than substituted, so a gap stays visible and is never back-filled
 * with an unrelated product.
 */
export const portaCabinSubpageRail = (
  slug: string
): import('./c16PanelCatalog').RelatedRailItem[] => [
  PORTA_CABIN_RAIL_HUB_CARD,
  ...PORTA_CABIN_RAIL_ORDER.filter((entry) => entry.live && entry.slug !== slug)
    .map((entry) =>
      PORTA_CABIN_HUB_RAIL.find((row) => slugFromProductHref(row.href) === entry.slug)
    )
    .filter((row): row is import('./c16PanelCatalog').RelatedRailItem => row !== undefined)
    .map(normaliseRailAlt),
];

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
// PC-03 (15 Aug 2026) held PORTA_CABIN_DS_RAIL here, PC-08 (15 Aug 2026) held
// PORTA_CABIN_SKID_RAIL and PC-10 (15 Aug 2026) held PORTA_CABIN_SHOP_RAIL: the
// double-story, skid-mounted and shop pages' own three-item Column 3 rails, each
// named by its own build prompt. All three are deleted by the C01 rail-consistency
// correction above, which restores RULING v2.1's full-cluster rail on every subpage.
// None carried an authored string - each looked its rows up in PORTA_CABIN_HUB_RAIL
// and normalised the alt punctuation, exactly as portaCabinSubpageRail() now does for
// all ten pages at once. PC-08's rail also railed knock-down-porta-cabin before it was
// built; the new `live` flag stops that.
//
// PC-09 held PORTA_CABIN_KNOCK_DOWN_RAIL and PC-10 held PORTA_CABIN_SHOP_RAIL. Both
// landed on static-migration AFTER this correction was written and were folded in on
// merge, taking the count from seven bespoke rails to nine. That is the clearest
// evidence for this ticket: the pattern reproduces itself, because each new build
// copies the last one's bespoke rail. A new cluster page now needs NO rail code at
// all - add its slug to PORTA_CABIN_RAIL_ORDER and every sibling picks it up.

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
  'porta-cabin-shop',
  'porta-cabin-with-toilet',
];

/**
 * 301'd slugs, never railed.
 *
 * Phase 1 (SAMAN approval, 15 Aug 2026) moved five slugs here from the cluster list
 * above: steel, luxury, mini and low-cost, plus portacabin-office. All five now 301,
 * and a rail must never link to a redirect.
 *
 * Known gap, deliberately not closed in this release: the seven newer approved pages
 * (gi, double-story, fire-rated, soundproof, puf, skid-mounted, knock-down) have never
 * been in this rail. Adding them changes what the rail renders on every cluster page,
 * which is a visible content change and belongs to its own ticket with approved anchors.
 */
export const PORTA_CABIN_REDIRECTED_SLUGS: readonly string[] = [
  'toilet-porta-cabins',
  'buy-porta-cabins',
  'small-portacabin',
  'porta-cabin-office',
  'prefabricated-porta-cabin',
  'steel-porta-cabin',
  'luxury-porta-cabin',
  'mini-porta-cabin',
  'portacabin-office',
  'low-cost-porta-cabin',
];

export const isPortaCabinStripSlug = (slug: string): boolean =>
  PORTA_CABIN_CLUSTER_SLUGS.includes(slug);

// Keyed by the slug of the page that renders the anchor. Phase 1 removed the five
// entries whose page now 301s (low-cost, luxury, steel, mini, portacabin-office):
// those keys are unreachable once the redirect is live.
const C01_HUB_RETURN_ANCHORS: Record<string, string> = {
  'porta-cabin-with-toilet': 'the standard cabin without sanitary provision',
  'porta-cabin-shop': 'see how the base cabin is specified',
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
