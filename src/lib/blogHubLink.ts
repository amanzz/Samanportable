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
 * and therefore no CATEGORY-owned hub. We do not guess one, and we deliberately do
 * NOT fall back to `categoryHref()`, whose /product-category/{slug} fallback is a
 * redirect path, not a canonical hub. Never force a link.
 *
 * Do not "fix" this by adding blog slugs to CATEGORY_HUB_MAP: mapping
 * portable-buildings → portable-cabin (or prefab-solutions → prefab-buildings) is a
 * content/taxonomy decision that crosses a cluster boundary and needs an owner-approved
 * draft, not a build-time assumption. That is exactly why T8.3 resolves those posts
 * from their own CONTENT instead (BLOG_CONTENT_CLUSTER), one post at a time, and
 * leaves the genuinely ambiguous ones module-less rather than mislabelled.
 */
import { BLOG_CONTENT_CLUSTER } from './blogContentCluster';
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
  // No early return for the uncategorized (T8.3): a post with zero category terms
  // still has content, and content is exactly what resolves it below. The loop is
  // already a no-op on an empty set, so falling through costs nothing and lets the
  // 3 term-less posts reach the content fallback instead of silently losing their
  // module.
  const slugs = new Set(postCategorySlugs(post));

  for (const category of getBlogCategories()) {
    if (!slugs.has(category.slug)) continue;

    const hubSlug = CATEGORY_HUB_MAP[category.slug];
    if (!hubSlug) continue; // this category owns no hub — keep looking

    const hubName = getProductCategoryName(hubSlug);
    if (!hubName) continue; // no hub data → no display name → no module (never invent one)

    return { hubSlug, hubName, hubPath: `/product/${hubSlug}` };
  }

  // T8.3 — no category owns a hub, so fall back to the post's CONTENT-derived
  // cluster. Only reached for the 123 posts T8.2 leaves module-less, so the 160
  // category-resolved posts above are byte-identical to before. Absent slug (the
  // 20 with no single-cluster signal) → still null → still no module.
  return getContentHubLink(post?.slug);
}

/**
 * The hub a module-less post's own content resolves to, or null when its content
 * gives no unambiguous single-cluster signal. See blogContentCluster.ts — that map
 * is precision-first, so "absent" means "deliberately not guessed", never "unknown".
 */
function getContentHubLink(slug: unknown): BlogHubLink | null {
  if (typeof slug !== 'string' || !slug) return null;

  const hubSlug = BLOG_CONTENT_CLUSTER[slug];
  if (!hubSlug) return null; // unclassified → no module (never guess)

  const hubName = getProductCategoryName(hubSlug);
  if (!hubName) return null; // no hub data → no display name → no module

  return { hubSlug, hubName, hubPath: `/product/${hubSlug}` };
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
