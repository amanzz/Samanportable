// LC-07 fix v3 (17 Aug 2026) - SAMAN ruling: the Explore the Range panel shows
// the current page's own cluster and nothing else. No cross-cluster tiles.
// Supersedes the eight hand-authored per-page rail constants this file used
// to hold (LABOR_COLONY_HUB_RAIL, LABOR_SHEDS_RAIL, LABOR_HUTMENTS_RAIL,
// PREFAB_SITE_CANTEEN_RAIL, OIL_FIELD_CAMP_RAIL, ABLUTION_BLOCK_RAIL) - those
// drifted out of sync with each other (different curated sets, one page
// reusing a sibling's list, one page falling through to a generic derived
// list that showed the whole catalogue) because each was authored by hand,
// once, per page. One derived rail now serves all eight pages: same ordered
// list, current page filtered out, so by construction no panel can drift
// from another or link to itself.
//
// Title, href, image and imageAlt for every entry are each destination's own
// live product data (first-variant hero, same pattern already in use
// elsewhere on the site) - no new copy authored here. Tile labels use the
// Indian "labour" spelling per the 17 Aug 2026 ruling even on pages whose
// slug/productName field uses the American "labor" spelling (labor-hutments,
// prefab-labor-camps) - that combination is correct, not a defect.
import type { RelatedRailItem } from './c16PanelCatalog';

type LabourColonyClusterPage = RelatedRailItem & { slug: string };

// Approved-plan order, hub first. This ordering is the single source of
// truth for every published page's panel - each page's own tile is filtered out
// at render time, so the remaining published siblings stay in this order.
const LABOUR_COLONY_CLUSTER_PAGES: LabourColonyClusterPage[] = [
  {
    slug: 'labor-colony',
    title: 'Labour Colony',
    href: '/product/labor-colony',
    category: 'Labour Colony',
    blurb: 'A labour colony is a whole worker housing site.',
    imageSrc: '/images/products/labor-colony/60x24-gplus1/labour-colony-60x24-gplus1-front-three-quarter.webp',
    imageAlt: 'Two-storey labour colony block with cream panels, grey steel frame and railed walkways on both levels',
  },
  {
    slug: 'labor-hutments',
    title: 'Labour Hutments',
    href: '/product/labor-colony/labor-hutments',
    category: 'Labour Colony',
    blurb: 'A labour hutment is one small sleeping unit, built complete in the factory and set down on its own plinth.',
    imageSrc: '/images/products/labor-hutments/10x10/labor-hutments-10x10-front-elevation.webp',
    imageAlt: 'Front elevation of a 10x10 ft single-storey labour hutment, ivory wall panels with charcoal steel trim.',
  },
  {
    slug: 'labor-sheds',
    title: 'Labour Sheds',
    href: '/product/labor-colony/labor-sheds',
    category: 'Labour Colony',
    blurb: 'A labour shed is one undivided sleeping hall under a single roof.',
    imageSrc: '/images/products/labor-sheds/20x10/labour-shed-20x10-front-left-exterior.webp',
    imageAlt: '20x10 ft labour shed in ivory white cladding, front-left view, with a continuous louvre band under the eaves',
  },
  {
    slug: 'oil-field-camp',
    title: 'Oil Field Camp',
    href: '/product/labor-colony/oil-field-camp',
    category: 'Labour Colony',
    blurb: 'An oil field camp module houses a drilling or well-site crew on a location that will not stay put.',
    imageSrc: '/images/products/oil-field-camp/20x10/oil-field-camp-20x10-front-left-hero.webp',
    imageAlt: '20x10 ft oil field camp module in Oyster White, front left view, steel skid base and entrance steps',
  },
  {
    slug: 'prefab-labor-camps',
    title: 'Prefab Labour Camps',
    href: '/product/labor-colony/prefab-labor-camps',
    category: 'Labour Colony',
    blurb: 'A prefab labour camp is the relocatable build in the SAMAN worker housing family: bolted light-steel panels on pedestal footings, with repeatable door and window modules and plug-and-play electrical blocks, so the same camp dismantles and re-erects at the next project.',
    imageSrc: '/images/products/prefab-labor-camps/60x24-gplus1/prefab-labor-camps-60x24-gplus1-front-right-hero.webp',
    imageAlt: 'Prefab labour camp, 60x24 ft G+1, from the front right corner, both floors on a 60 ft footprint of the bolted panel camp build in view.',
  },
  {
    slug: 'prefab-site-canteen',
    title: 'Prefab Site Canteen',
    href: '/product/labor-colony/prefab-site-canteen',
    category: 'Labour Colony',
    blurb: 'A prefab site canteen from SAMAN is the building your workforce eats in, not the kitchen business that feeds them.',
    imageSrc: '/images/products/prefab-site-canteen/20x10/canteen-20x10-01-front-elevation.webp',
    imageAlt: 'Bone white prefab site canteen with roof exhaust cowl on a compacted site',
  },
  {
    slug: 'ablution-block',
    title: 'Multi-Toilet Ablution Block',
    href: '/product/labor-colony/ablution-block',
    category: 'Labour Colony',
    blurb: 'A multi-toilet ablution block is one wet-service building that serves a whole camp from a single plumbing manifold.',
    imageSrc: '/images/products/ablution-block/12x10/ablution-block-12x10-ft-cornflower-blue-exterior-front-left-hero.webp',
    imageAlt: 'Cornflower Blue 12x10 ft ablution block, front left three-quarter view, white trim and high-level privacy louvres',
  },
];

const LABOUR_COLONY_CLUSTER_SLUGS = new Set(LABOUR_COLONY_CLUSTER_PAGES.map((p) => p.slug));

/** True for the published C05 hub and child slugs exposed through this rail. */
export const isLabourColonyClusterSlug = (slug: string): boolean =>
  LABOUR_COLONY_CLUSTER_SLUGS.has(slug);

/**
 * The Explore the Range panel for any Labour Colony cluster page: every one
 * of the published pages, hub first, in approved-plan order, with the current
 * page filtered out. Same list for all call sites - a page
 * cannot drift from its siblings or link to itself.
 */
export const getLabourColonyClusterRail = (currentSlug: string): RelatedRailItem[] =>
  LABOUR_COLONY_CLUSTER_PAGES.filter((p) => p.slug !== currentSlug).map(
    ({ slug: _slug, ...item }) => item
  );
