// T25 — S4 related-strip order for the porta cabin cluster.
//
// Source of truth: D:\Project-shekhar\T25-internal-linking-matrix-v2.md (LOCKED,
// Fable 5, 18 Jul 2026), which supersedes each copy pack's §F strip order.
//
// Matrix rules relevant here:
//  - the hub is ALWAYS first, followed by exactly the three siblings listed, in
//    that order (rule: "strip = hub + 3 siblings");
//  - strip chips are navigation, so exact product names are correct there and do
//    NOT count toward the cluster's exact-match anchor cap;
//  - "Portable Cabin" is BANNED from this cluster's related items.
//
// This module only decides WHICH siblings appear and in WHAT ORDER. The rail
// items themselves (title, image, blurb, price) keep coming from the live product
// data, so no copy is authored here.

export const PORTA_CABIN_HUB_SLUG = 'porta-cabins';

/** slug -> the exactly-three sibling slugs that follow the hub, in matrix order. */
export const PORTA_CABIN_STRIP_MATRIX: Record<string, readonly [string, string, string]> = {
  'ms-porta-cabin': ['steel-porta-cabin', 'low-cost-porta-cabin', 'prefabricated-porta-cabin'],
  'steel-porta-cabin': ['ms-porta-cabin', 'porta-cabin-with-toilet', 'porta-cabin-shop'],
  'luxury-porta-cabin': ['porta-cabin-office', 'porta-cabin-with-toilet', 'buy-porta-cabins'],
  'buy-porta-cabins': ['low-cost-porta-cabin', 'luxury-porta-cabin', 'prefabricated-porta-cabin'],
  'mini-porta-cabin': ['small-portacabin', 'porta-cabin-shop', 'buy-porta-cabins'],
  'small-portacabin': ['mini-porta-cabin', 'porta-cabin-office', 'low-cost-porta-cabin'],
  'porta-cabin-office': ['luxury-porta-cabin', 'porta-cabin-with-toilet', 'small-portacabin'],
  'porta-cabin-shop': ['porta-cabin-office', 'buy-porta-cabins', 'mini-porta-cabin'],
  'porta-cabin-with-toilet': ['porta-cabin-shop', 'ms-porta-cabin', 'luxury-porta-cabin'],
  'prefabricated-porta-cabin': ['ms-porta-cabin', 'mini-porta-cabin', 'steel-porta-cabin'],
  'low-cost-porta-cabin': ['buy-porta-cabins', 'small-portacabin', 'prefabricated-porta-cabin'],
};

export const isPortaCabinStripSlug = (slug: string): boolean =>
  Object.prototype.hasOwnProperty.call(PORTA_CABIN_STRIP_MATRIX, slug);

/** The full ordered strip for a slug: hub first, then its three matrix siblings. */
export const portaCabinStripOrder = (slug: string): string[] => {
  const siblings = PORTA_CABIN_STRIP_MATRIX[slug];
  return siblings ? [PORTA_CABIN_HUB_SLUG, ...siblings] : [];
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
