/**
 * SHIKHAR T8.2 — blog post → owning product-hub mapping.
 *
 * One post resolves to AT MOST ONE hub. Everything here is derived from data that
 * already ships: the post's own `wp:term` category terms (the same source
 * `getBlogCategories()` reads) and `CATEGORY_HUB_MAP` (the single source of truth for
 * category-slug → /product hub). No taxonomy is invented here.
 *
 * IMPORTANT — the two taxonomies are NOT the same set. The blog's 11 category slugs
 * overlap the product-category slugs only partially; only these five are hub-owning:
 *
 *   container-offices · porta-cabins · labor-colony · container-cafe · prefab-buildings
 *
 * The rest (portable-buildings, prefab-solutions, design-customization,
 * electronic-city, industrial-shed, uncategorized) have NO entry in CATEGORY_HUB_MAP
 * and therefore NO owning hub. Those posts get NO module — we do not guess a hub, and
 * we deliberately do NOT fall back to `categoryHref()`, whose /product-category/{slug}
 * fallback is a redirect path, not a canonical hub. Never force a link.
 *
 * Do not "fix" this by adding blog slugs to CATEGORY_HUB_MAP: mapping
 * portable-buildings → portable-cabin (or prefab-solutions → prefab-buildings) is a
 * content/taxonomy decision that crosses a cluster boundary and needs an owner-approved
 * draft, not a build-time assumption.
 */
import { CATEGORY_HUB_MAP } from './categoryHubMap';
import { getBlogCategories, getProductCategoryName } from './staticContent';

export type BlogHubLink = {
  /** Canonical hub slug, e.g. 'porta-cabins'. */
  hubSlug: string;
  /** The hub's own display name, from the product-category data, e.g. 'Porta Cabins'. */
  hubName: string;
  /** Site-relative hub path, e.g. '/product/porta-cabins'. */
  hubPath: string;
};

/** Category slugs on a post, from the embedded WP terms. Empty for uncategorized. */
function postCategorySlugs(post: any): string[] {
  const terms: any[] = post?._embedded?.['wp:term']?.[0] || [];
  return terms
    .filter((t) => t?.taxonomy === 'category' && t?.slug)
    .map((t) => t.slug as string);
}

/**
 * The post's PRIMARY owning hub, or null when it has none.
 *
 * Primary = the post's highest-real-count category that actually owns a hub.
 * `getBlogCategories()` is already sorted by real count desc, then name asc, so
 * scanning it in order and taking the first match IS "highest count, alphabetical
 * tiebreak" — the shipped ordering is reused rather than a second comparator invented.
 */
export function getPostHubLink(post: any): BlogHubLink | null {
  const slugs = new Set(postCategorySlugs(post));
  if (slugs.size === 0) return null; // uncategorized → no module

  for (const category of getBlogCategories()) {
    if (!slugs.has(category.slug)) continue;

    const hubSlug = CATEGORY_HUB_MAP[category.slug];
    if (!hubSlug) continue; // this category owns no hub — keep looking

    const hubName = getProductCategoryName(hubSlug);
    if (!hubName) continue; // no hub data → no display name → no module (never invent one)

    return { hubSlug, hubName, hubPath: `/product/${hubSlug}` };
  }

  return null; // no category on this post owns a hub → no module
}

/**
 * Every cluster the blog library actually covers AND that owns a product hub — the
 * entity set behind the /blog `Blog.about` array. Same derivation as above, so a
 * cluster can never appear here unless real posts feed it and its hub exists.
 */
export function getBlogHubClusters(): BlogHubLink[] {
  const clusters: BlogHubLink[] = [];

  for (const category of getBlogCategories()) {
    const hubSlug = CATEGORY_HUB_MAP[category.slug];
    if (!hubSlug) continue;

    const hubName = getProductCategoryName(hubSlug);
    if (!hubName) continue;

    if (clusters.some((c) => c.hubSlug === hubSlug)) continue; // one entry per hub
    clusters.push({ hubSlug, hubName, hubPath: `/product/${hubSlug}` });
  }

  return clusters;
}
