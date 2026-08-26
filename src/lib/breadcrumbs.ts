/**
 * SHIKHAR C1 — single source of truth for every page's breadcrumb trail.
 *
 * The whole point of this module: the VISIBLE breadcrumb and the BreadcrumbList
 * JSON-LD must be byte-for-byte the same nodes, in the same order, on every page.
 * Both are projected from ONE `Crumb[]` array built here, so they cannot drift:
 *   · crumbsToDsItems()  → the visible <Breadcrumb> component (relative hrefs)
 *   · crumbsToJsonLd()   → the BreadcrumbList itemListElement (absolute item URLs)
 *
 * Parent resolution is derived from EXISTING classification only — never guessed:
 *   · Products     → Home › Products › {Cluster} › {Product}  (mirrors the
 *                    ProductStructuredData BreadcrumbList that was already correct).
 *   · Local/city   → Home › {Cluster hub} › {Page}.  A post is "local" when its slug
 *                    matches one of the curated city-landing families below — the same
 *                    families schema.ts uses for Service nodes (CITY_SERVICE_CLUSTERS),
 *                    PLUS the singular `container-office-in-` twin of the already-curated
 *                    `container-office-in-{city}` allowlist (audit REPORT §3.1/#2). The
 *                    porta-cabin-in-/container-office-in- families fully subsume the
 *                    92-slug CITY_PAGE_SCHEMA_SLUGS allowlist, so nothing regresses.
 *   · Editorial    → Home › Blog › {Post}.  Any post that is not a local landing.
 *                    Genuine editorial is NEVER forced under a product cluster.
 *
 * A slug that matches a local family with NO resolvable hub is returned as null here
 * and must be treated as editorial + REPORTED (never guessed). Today that set is empty.
 */

export const SITE_ORIGIN = 'https://www.samanportable.com';

export interface Crumb {
  /** Visible label + JSON-LD `name`. */
  name: string;
  /** Site-relative path. Used as the visible href and absolutised for JSON-LD `item`. */
  path: string;
}

/** DS <Breadcrumb> item shape (label + optional href; last item is unlinked). */
export interface BreadcrumbDsItem {
  label: string;
  href?: string;
}

/** BreadcrumbList ListItem source shape consumed by the schema builders. */
export interface BreadcrumbJsonLdItem {
  name: string;
  url: string;
}

/**
 * Cluster hub display names — verbatim from src/data/wp-export/categories/*.json
 * (`name` field), so the breadcrumb hub node reads identically to the hub page itself.
 */
const HUB_NAMES: Readonly<Record<string, string>> = Object.freeze({
  'container-cafe': 'Container Cafe',
  'container-houses': 'Container Houses',
  'container-offices': 'Container Offices',
  'industrial-sheds': 'Industrial Sheds',
  'labor-colony': 'Labor Colony',
  'peb-constructions': 'PEB Constructions',
  'porta-cabins': 'Porta Cabins',
  'portable-cabin': 'Portable Cabin',
  'portable-office': 'Portable Office',
  'portable-toilet': 'Portable Toilet',
  'pre-engineered-buildings': 'Pre-Engineered Buildings',
  'prefab-buildings': 'Prefab Buildings',
  'prefabricated-houses': 'Prefabricated Houses',
  'security-cabins': 'Security Cabins',
});

/**
 * Local city-landing slug families → owning cluster hub slug. Order matters: the
 * most specific prefix must precede its shorter variant so the right hub wins.
 * `null` = the family is local but its cluster hub is not 1:1 resolvable → the caller
 * treats the page as editorial and REPORTS it (never guesses a parent).
 *
 * This mirrors schema.ts CITY_SERVICE_CLUSTERS (kept in lockstep), with one addition
 * the Service classifier omits: the singular `container-office-in-` family, the twin
 * of the curated container-office-in-{city} allowlist (audit REPORT #2).
 */
const LOCAL_FAMILIES: ReadonlyArray<readonly [RegExp, string | null]> = [
  [/^(?:portable-office-cabin-manufacturers-in-|portable-office-cabins-manufacturers-in-)(.+)$/i, 'portable-office'],
  [/^(?:portable-office-cabins-in-)(.+)$/i, 'portable-office'],
  [/^(?:portable-cabins-in-)(.+)$/i, 'porta-cabins'],
  [/^(?:porta-cabins-in-|porta-cabin-in-|portacabins-for-sale-in-|affordable-porta-cabins-in-)(.+)$/i, 'porta-cabins'],
  [/^(?:container-cafes-in-|container-cafe-in-)(.+)$/i, 'container-cafe'],
  [/^(?:container-offices-for-sale-in-)(.+)$/i, 'container-offices'],
  [/^(?:container-offices-in-|container-office-in-)(.+)$/i, 'container-offices'],
  [/^(?:container-houses-in-|container-house-in-)(.+)$/i, 'container-houses'],
  // SHIKHAR C2 — singular `labour-colony-in-{city}` / `labor-colony-in-{city}` are the
  // same local family as the plural forms (parser fix, C2 ticket Part 1).
  [/^(?:labour-colonies-in-|labor-colonies-in-|labour-colony-in-|labor-colony-in-)(.+)$/i, 'labor-colony'],
  [/^(?:portable-toilets-in-)(.+)$/i, 'portable-toilet'],
  [/^(?:pre-engineered-buildings-in-|peb-structures-in-|peb-buildings-in-)(.+)$/i, 'pre-engineered-buildings'],
  [/^(?:prefab-buildings-in-)(.+)$/i, 'prefab-buildings'],
  [/^(?:prefabricated-houses-in-|prefab-houses-in-)(.+)$/i, 'prefabricated-houses'],
  [/^(?:industrial-sheds-in-|industrial-shed-in-)(.+)$/i, 'industrial-sheds'],
  [/^(?:prefabricated-warehouse-manufacturer-in-|prefabricated-warehouses-in-)(.+)$/i, 'industrial-sheds'],
  // Local family with no 1:1 hub — deliberately unresolved (report, never guess).
  [/^(?:prefabricated-structures-in-)(.+)$/i, null],
];

/** Captured "area" tokens that are not real locations (so not a local landing page). */
const NON_LOCATION_AREAS = new Set(['construction']);

export type PostBreadcrumbKind = 'local' | 'editorial' | 'unresolved';

export interface PostClusterResolution {
  kind: PostBreadcrumbKind;
  /** Present only when kind === 'local'. */
  hub?: { slug: string; name: string; path: string };
}

/**
 * SHIKHAR C2 — explicit slug→cluster overrides, consulted FIRST inside
 * resolvePostCluster. These slugs carry unambiguous single-cluster intent the
 * slug-family parser cannot see (they are not `{cluster}-in-{city}` landing slugs),
 * so they otherwise resolved to null. Owner-approved (C2 ticket Part 1). Once resolved
 * they gain the C1 breadcrumb, the up-link module and mesh eligibility automatically —
 * they are never special-cased anywhere else. Keys must be lowercase.
 */
const CLUSTER_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  'discount-mobile-office-units': 'portable-office',
  'low-cost-modular-office-solutions': 'portable-office',
  'portable-classroom-for-sale-2': 'prefab-buildings',
  'prefab-homes-mumbai': 'prefabricated-houses',
  'temporary-garden-shed': 'prefab-buildings',
  'top-rated-portable-cabin-supplier-delhi': 'porta-cabins',
});

/**
 * Classify a post slug as local (with its cluster hub), editorial, or unresolved
 * (looks local but no hub can be resolved — caller reports it, renders editorial).
 */
export function resolvePostCluster(slug: string): PostClusterResolution {
  const s = (slug || '').toLowerCase();
  // C2: explicit overrides win over the family parser.
  const overrideHub = CLUSTER_OVERRIDES[s];
  if (overrideHub) {
    const name = HUB_NAMES[overrideHub];
    if (name) return { kind: 'local', hub: { slug: overrideHub, name, path: `/product/${overrideHub}` } };
  }
  for (const [re, hubSlug] of LOCAL_FAMILIES) {
    const m = s.match(re);
    if (!m) continue;
    const captured = (m[1] || '').toLowerCase();
    if (captured && NON_LOCATION_AREAS.has(captured)) return { kind: 'editorial' };
    if (!hubSlug) return { kind: 'unresolved' };
    const name = HUB_NAMES[hubSlug];
    if (!name) return { kind: 'unresolved' };
    return { kind: 'local', hub: { slug: hubSlug, name, path: `/product/${hubSlug}` } };
  }
  return { kind: 'editorial' };
}

/**
 * The breadcrumb trail for a blog/local post. `title` is the already-decoded post
 * title. Unresolved-local pages fall back to the editorial trail (and are reported
 * separately) so no page is ever left without a matching visible/JSON-LD breadcrumb.
 */
export function getPostBreadcrumb(slug: string, title: string): Crumb[] {
  const res = resolvePostCluster(slug);
  const leaf: Crumb = { name: title, path: `/${slug}` };
  if (res.kind === 'local' && res.hub) {
    return [{ name: 'Home', path: '/' }, { name: res.hub.name, path: res.hub.path }, leaf];
  }
  return [{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, leaf];
}

/**
 * The breadcrumb trail for a product page.
 *   · subpage → Home › Products › {Cluster} › {Product}
 *   · hub     → Home › Products › {Cluster}          (the hub IS the cluster leaf)
 * `clusterName`/`clusterSlug` come from the product's own primary category, exactly
 * as ProductStructuredData derives its BreadcrumbList — so the two stay identical.
 */
export function getProductBreadcrumb(params: {
  productName: string;
  productSlug: string;
  clusterName: string;
  clusterSlug: string;
  isHub: boolean;
}): Crumb[] {
  const { productName, productSlug, clusterName, clusterSlug, isHub } = params;
  const base: Crumb[] = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/product' },
  ];
  if (isHub) {
    return [...base, { name: clusterName, path: `/product/${clusterSlug}` }];
  }
  return [
    ...base,
    { name: clusterName, path: `/product/${clusterSlug}` },
    { name: productName, path: `/product/${clusterSlug}/${productSlug}` },
  ];
}

/** Project crumbs to the visible DS <Breadcrumb> items (last node unlinked). */
export function crumbsToDsItems(crumbs: Crumb[]): BreadcrumbDsItem[] {
  return crumbs.map((c, i) => ({
    label: c.name,
    ...(i === crumbs.length - 1 ? {} : { href: c.path }),
  }));
}

/** Project crumbs to BreadcrumbList ListItem sources with absolute `item` URLs. */
export function crumbsToJsonLd(crumbs: Crumb[]): BreadcrumbJsonLdItem[] {
  return crumbs.map((c) => ({
    name: c.name,
    url: c.path.startsWith('http') ? c.path : `${SITE_ORIGIN}${c.path}`,
  }));
}

/** The owning cluster hub (name + path) for a post slug via resolvePostCluster. */
export interface ClusterHubLink {
  hubSlug: string;
  hubName: string;
  hubPath: string;
}

/**
 * SHIKHAR C2 — the post's owning cluster hub, or null for editorial/unresolved posts.
 * Same resolver as the breadcrumb, so a page's up-link module and its breadcrumb hub
 * node always agree. Used by [slug].tsx to source the T8.2 up-link module from
 * resolvePostCluster when the category/content resolver (getPostHubLink) has no match.
 */
export function getClusterHubLink(slug: string): ClusterHubLink | null {
  const res = resolvePostCluster(slug);
  if (res.kind === 'local' && res.hub) {
    return { hubSlug: res.hub.slug, hubName: res.hub.name, hubPath: res.hub.path };
  }
  return null;
}

/**
 * SHIKHAR C2 — the region (captured locality) token a slug yields from the SAME
 * local-family parser resolvePostCluster uses, lowercased, or '' when the slug is an
 * override / non-family slug. Used ONLY for deterministic mesh ordering (region-first).
 * Never a cluster signal — cluster resolution is resolvePostCluster's job alone.
 */
export function getPostRegionToken(slug: string): string {
  const s = (slug || '').toLowerCase();
  for (const [re] of LOCAL_FAMILIES) {
    const m = s.match(re);
    if (m) return (m[1] || '').toLowerCase();
  }
  return '';
}
