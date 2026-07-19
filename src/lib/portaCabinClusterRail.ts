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
// Redirected slugs (toilet-porta-cabins, portacabin-office) must never appear: they
// 301 away, so railing them would send users through a redirect.
//
// This module only decides WHICH siblings appear and in WHAT ORDER. The rail items
// themselves (title, image, blurb, price) keep coming from the live product data, so
// no copy is authored here.

export const PORTA_CABIN_HUB_SLUG = 'porta-cabins';

/**
 * Canonical cluster order. Taken from the internal-linking matrix v2's own S4 table,
 * which is the cluster's canonical listing in the ruling document.
 */
export const PORTA_CABIN_CLUSTER_SLUGS: readonly string[] = [
  'ms-porta-cabin',
  'steel-porta-cabin',
  'luxury-porta-cabin',
  'buy-porta-cabins',
  'mini-porta-cabin',
  'small-portacabin',
  'porta-cabin-office',
  'porta-cabin-shop',
  'porta-cabin-with-toilet',
  'prefabricated-porta-cabin',
  'low-cost-porta-cabin',
];

/** 301'd slugs — never railed. */
export const PORTA_CABIN_REDIRECTED_SLUGS: readonly string[] = [
  'toilet-porta-cabins',
  'portacabin-office',
];

export const isPortaCabinStripSlug = (slug: string): boolean =>
  PORTA_CABIN_CLUSTER_SLUGS.includes(slug);

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
