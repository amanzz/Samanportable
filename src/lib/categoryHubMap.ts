/**
 * Legacy WooCommerce category slug → canonical /product hub slug.
 *
 * SHIKHAR T1.2d. Transcribed from the /product-category redirect rules in
 * next.config.js — this map must stay in lockstep with them, so each entry below
 * cites the config line it came from. Do not re-derive these by guessing: the
 * mapping is NOT the identity. Three category slugs differ from their hub slug,
 * and a naive `/product/${slug}` would 404 on them:
 *
 *   roofing-sheets    → roofing-sheet     (/product/roofing-sheets is a 404)
 *   portable-toilets  → portable-toilet
 *   container-house   → container-houses
 *
 * Every distinct primaryCategory.slug present in src/data/wp-export/products is
 * covered here. Callers must still fall back to /product-category/{slug} for an
 * unmapped slug — the redirect catch-all handles it, so a new or unexpected
 * category degrades to a working redirect rather than a broken link.
 */
export const CATEGORY_HUB_MAP: Readonly<Record<string, string>> = Object.freeze({
  // Pre-existing phantom-category rules, above the T1.2 block (flattened to hubs by T1.2b).
  'portable-toilets': 'portable-toilet', // next.config.js:208-209
  'container-house': 'container-houses', // next.config.js:216-217

  // T1.2 — the 14 archives named in the original build packet.
  'container-cafe': 'container-cafe', // next.config.js:226
  'container-houses': 'container-houses', // next.config.js:227
  'container-offices': 'container-offices', // next.config.js:228
  'industrial-sheds': 'industrial-sheds', // next.config.js:229
  'labor-colony': 'labor-colony', // next.config.js:230
  'peb-constructions': 'peb-constructions', // next.config.js:231
  'porta-cabins': 'porta-cabins', // next.config.js:232
  'portable-cabin': 'porta-cabins', // retired hub redirects to canonical category
  'portable-office': 'portable-office', // next.config.js:234
  'portable-toilet': 'portable-toilet', // next.config.js:235
  'pre-engineered-buildings': 'pre-engineered-buildings', // next.config.js:236
  'prefab-buildings': 'prefab-buildings', // next.config.js:237
  'prefabricated-houses': 'prefabricated-houses', // next.config.js:238
  'security-cabins': 'security-cabins', // next.config.js:239

  // T1.2 amendment — the 7 panel/roofing archives.
  'eps-panel': 'eps-panel', // next.config.js:244
  'glass-wool-panel': 'glass-wool-panel', // next.config.js:245
  'pir-panel': 'pir-panel', // next.config.js:246
  'puf-panel': 'puf-panel', // next.config.js:247
  'rockwool-panel': 'rockwool-panel', // next.config.js:248
  'roofing-sheets': 'roofing-sheet', // next.config.js:249  ← non-identity
  'sandwich-panel': 'sandwich-panel', // next.config.js:250
});

/**
 * Canonical href for a product category. Returns the /product hub when the slug is
 * known, and the legacy /product-category path otherwise (which the redirect
 * catch-all resolves) so an unmapped slug can never produce a dead link.
 */
export function categoryHref(slug: string): string {
  const hub = CATEGORY_HUB_MAP[slug];
  return hub ? `/product/${hub}` : `/product-category/${slug}`;
}
