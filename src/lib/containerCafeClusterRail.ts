/**
 * C-05 — related-rail allowlist for the container cafe HUB route.
 *
 * Fable 5 ruling of 08 Aug 2026 (Ruling 3). CI9 (20 Jul, SAMAN-approved) fixed this
 * cluster at six pages: the hub plus five subpages. The `container-cafe` category
 * still holds eight or more legacy children awaiting a separate consolidation
 * event, and the hub's uncapped rail rendered every one of them — so the §5
 * right-to-exist copy ("one of the five pages below") was false on the rendered
 * page, and one legacy child (`portable-cafe-container`, 600 sq ft at
 * Rs 32,55,000) directly contradicted the hub's opening claim.
 *
 * This restricts the rail to exactly the five §9 subpages, in §9 order.
 *
 * SCOPE: the hub route only. It is called from
 * `pages/product/[category]/index.tsx` behind `category === 'container-cafe'`,
 * so the five subpages' own rails (served by `[category]/[slug].tsx`) and every
 * other hub in the site are untouched. This is a route-level restriction, never a
 * component change.
 *
 * The legacy children are NOT deleted or redirected here — their disposition is a
 * separate ruled event. They simply stop being introduced by the cluster's
 * strongest page.
 */
const CONTAINER_CAFE_HUB_SLUG = 'container-cafe';

/** The five §9 subpages, in §9 order. */
const CONTAINER_CAFE_KEEP_SLUGS: readonly string[] = [
  'container-restaurant',
  'food-truck-containers',
  'modular-container-cafe',
  'container-hotel',
  'container-coffee-shop',
];

type Slugged = { slug?: string };

export function restrictContainerCafeRail<T extends Slugged>(
  currentSlug: string,
  products: readonly T[]
): T[] {
  if (currentSlug !== CONTAINER_CAFE_HUB_SLUG) return [...products];
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  return CONTAINER_CAFE_KEEP_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (product): product is T => product !== undefined
  );
}

export { CONTAINER_CAFE_KEEP_SLUGS };
