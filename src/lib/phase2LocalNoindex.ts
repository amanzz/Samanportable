/**
 * Phase 2 local doorway cleanup: pages kept live but removed from the index.
 *
 * Owner ruling, 15 Aug 2026. Each slug below answers a real local question, so
 * redirecting it would throw away usable content, but each is too thin or too
 * templated to compete in organic search against the eleven approved Porta Cabin
 * pages. `noindex, follow` is the middle answer: the page stays reachable and
 * keeps passing authority through its outbound links, and it stops competing.
 *
 * Two rules that go with this list, both handled in the same commit:
 *   - Every slug here is removed from sitemapCanonicalPaths.json. A sitemap must
 *     never advertise a noindex URL.
 *   - Internal links to these pages are deliberately LEFT in place. They still
 *     help a buyer reach the page; only the index entry is withdrawn.
 *
 * Never enforce this with robots.txt. A blocked URL cannot be crawled, so Google
 * never sees the noindex tag and the page can stay indexed indefinitely.
 *
 * Selection evidence is in outputs/porta-cabin-redirect-plan-2026-08-15/, section
 * 06 of the Phase 2 audit: location-mention density, nearest-sibling similarity,
 * word count and click history per slug. None of these pages has ever earned a
 * click. Pages that ARE earning were excluded from this list by rule, whatever
 * their other signals said.
 */
export const PHASE2_LOCAL_NOINDEX_SLUGS: ReadonlySet<string> = new Set([
  // Bangalore city and locality
  'best-porta-cabins-in-bangalore',
  'porta-cabins-in-rt-nagar',
  'porta-cabins-in-vijayanagar',
  'porta-cabins-in-yelahanka',
  'portable-cabins-in-frazer-town',
  'portable-cabins-in-mg-road',
  'portacabins-for-sale-in-bannerghatta-road',
  'portacabins-for-sale-in-frazer-town-2',
  'portacabins-for-sale-in-whitefield',
  // Delhi NCR
  'portable-cabins-in-central-delhi',
  'portable-cabins-in-greater-noida',
  'portable-cabins-in-south-delhi',
  // Other cities
  'porta-cabin-in-coimbatore',
  'porta-cabin-in-kochi',
  'porta-cabin-in-lucknow',
  'porta-cabin-in-mangalore',
  'porta-cabin-in-mysore',
  'porta-cabin-in-vijayawada',
  'porta-cabin-in-visakhapatnam',
]);

/** True when this route must render `noindex, follow`. Accepts a slug or a path. */
export function isPhase2NoindexSlug(slugOrPath: string | null | undefined): boolean {
  if (!slugOrPath) return false;
  return PHASE2_LOCAL_NOINDEX_SLUGS.has(String(slugOrPath).replace(/^\//, ''));
}
