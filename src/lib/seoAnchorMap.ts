/**
 * SEO Anchor Text Mapping — Implementation #4
 * Maps WooCommerce category slugs to locked primary-keyword anchor text
 * and cluster hub URLs. No WordPress changes required.
 */

export interface SeoAnchorEntry {
  anchorText: string;
  hubUrl: string;
}

export const SEO_ANCHOR_MAP: Record<string, SeoAnchorEntry> = {
  'porta-cabins': { anchorText: 'Porta Cabin', hubUrl: '/product/porta-cabins' },
  'portable-cabin': { anchorText: 'Portable Cabin', hubUrl: '/product/portable-cabin' },
  'container-offices': { anchorText: 'Container Office', hubUrl: '/product/container-offices' },
  'container-cafe': { anchorText: 'Container Cafe', hubUrl: '/product/container-cafe' },
  'labor-colony': { anchorText: 'Labour Colony', hubUrl: '/product/labor-colony' },
  'portable-office': { anchorText: 'Portable Office Cabin', hubUrl: '/product/portable-office' },
  'container-houses': { anchorText: 'Container House', hubUrl: '/product/container-houses' },
  'security-cabins': { anchorText: 'Security Cabin', hubUrl: '/product/security-cabins' },
  'portable-toilet': { anchorText: 'Portable Toilet', hubUrl: '/product/portable-toilet' },
  'industrial-sheds': { anchorText: 'Industrial Shed', hubUrl: '/product/industrial-sheds' },
  'peb-constructions': { anchorText: 'PEB Construction', hubUrl: '/product/peb-constructions' },
  'pre-engineered-buildings': { anchorText: 'Pre-Engineered Building', hubUrl: '/product/pre-engineered-buildings' },
  'prefab-buildings': { anchorText: 'Prefab Building', hubUrl: '/product/prefab-buildings' },
  'prefabricated-houses': { anchorText: 'Prefabricated House', hubUrl: '/product/prefabricated-houses' },
};

/**
 * Returns the locked SEO anchor text for a category slug.
 * Falls back to empty string so callers can use their own fallback.
 */
export function getSeoAnchorText(categorySlug: string): string {
  return SEO_ANCHOR_MAP[categorySlug]?.anchorText || '';
}

/**
 * Returns the cluster hub URL for a category slug.
 * Falls back to `/product` if slug is unknown.
 */
export function getHubUrl(categorySlug: string): string {
  return SEO_ANCHOR_MAP[categorySlug]?.hubUrl || '/product';
}
