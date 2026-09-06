// CH-CLUSTER-01 T3 (6 Sep 2026) — "Explore the Range" for the Container Houses cluster.
//
// DEFECT the ticket names: a page's panel must not be frozen at that page's build
// date. Every other cluster already resolves its panel from a checked-in list
// (portaCabinClusterRail.ts C01 15 Aug 2026, labourColonyClusterRail.ts LC-07
// 17 Aug 2026, portableOfficeClusterRail.ts PO-CLUSTER-02 6 Sep 2026). Container
// Houses did not: its hub and its three subpages fell through to the WooCommerce
// related-products list, which happened to be correct when measured on production on
// 6 Sep 2026 but is not derived from the approved register and would not pick up a
// sibling published later. expandable-container-house is next into this cluster.
//
// FIX: one derived list, keyed to the eight approved Container Houses paths in
// SAMAN-105-approved-urls.txt (identical to the container-houses entries in
// src/data/seo/commercialArchitecture.json). Every LIVE sibling in canonical order,
// self excluded, hub appended on a subpage. A page that does not return 200 is not
// rendered, and no slot is ever padded by repeating a tile: a short list stays short.
// Publishing a new cluster page is then a one-word change here (live: false -> true)
// and every sibling panel picks it up on the next build.
//
// NOTHING VISIBLE CHANGES on the four pages that are live today. Every card field is
// copied verbatim from the panel production was already serving on 6 Sep 2026:
//   title    = the product name shown on the shipped card
//   category = "Container Houses"      (every shipped tile in this cluster)
//   imageSrc = that product's OWN 20x8 front-right hero image, as shipped
//   imageAlt = deliberately left undefined, exactly as shipped — RelatedProductRail
//              renders "Explore range card for ${imageAlt || title}", and the live
//              alts read "Explore range card for <title>", so the shipped cards
//              carry no imageAlt of their own.
//   blurb    = "Explore <title>", the portable-office cluster's template. The rail
//              card does not render blurb at all, so this is metadata only.
// No product is ever represented by another product's image.
//
// SCOPE: this module decides only WHICH tiles appear and in WHAT ORDER. It authors no
// price, size or specification, and the shared RelatedProductRail component is untouched.

import type { RelatedRailItem } from './c16PanelCatalog';

export const CONTAINER_HOUSE_HUB_SLUG = 'container-houses';
export const CONTAINER_HOUSE_HUB_HREF = '/product/container-houses';

/** The hub card. Copied verbatim from the tile the subpages already ship. */
const CONTAINER_HOUSE_HUB_CARD: RelatedRailItem = {
  title: 'Container Houses',
  href: CONTAINER_HOUSE_HUB_HREF,
  category: 'Container Houses',
  blurb: 'Explore Container Houses',
  imageSrc: '/images/products/container-houses/20x8/container-houses-20x8-front-right-hero.webp',
};

type ContainerHouseRailEntry = {
  slug: string;
  /**
   * Gates rendering. A card is NEVER rendered for a URL that does not return 200.
   *
   * Measured against production on 6 Sep 2026, over the eight approved
   * /product/container-houses* paths:
   *   200 — shipping-container-homes, prefab-container-homes, luxury-container-houses
   *   404 — container-farmhouse, expandable-container-house, flat-pack-container-homes
   *   301 — tiny-container-homes (to shipping-container-homes). It is an APPROVED path
   *         that is currently redirected away, which contradicts the standing rule that
   *         no page inside the approved 105 is ever redirected out. Reported with this
   *         ticket rather than changed here: un-redirecting it means building the page.
   *         Either way it is not 200, so it is not railed.
   */
  live: boolean;
  card: RelatedRailItem;
};

/**
 * The seven approved cluster children, in canonical order.
 *
 * Order preserves exactly what production served on 6 Sep 2026, so no existing tile
 * moves: the hub rendered shipping, prefab, luxury, and each subpage rendered the same
 * sequence with itself removed and the hub appended. The four not-yet-live children are
 * listed after them in the approved register's own alphabetical order, so a page turning
 * on only ever APPENDS a tile.
 */
export const CONTAINER_HOUSE_RAIL_ORDER: readonly ContainerHouseRailEntry[] = [
  {
    slug: 'shipping-container-homes',
    live: true,
    card: {
      title: 'Shipping Container Homes',
      href: '/product/container-houses/shipping-container-homes',
      category: 'Container Houses',
      blurb: 'Explore Shipping Container Homes',
      imageSrc: '/images/products/shipping-container-homes/20x8/shipping-container-homes-20x8-front-right-hero.webp',
    },
  },
  {
    slug: 'prefab-container-homes',
    live: true,
    card: {
      title: 'Prefab Container Homes',
      href: '/product/container-houses/prefab-container-homes',
      category: 'Container Houses',
      blurb: 'Explore Prefab Container Homes',
      imageSrc: '/images/products/prefab-container-homes/20x8/prefab-container-homes-20x8-front-right-hero.webp',
    },
  },
  {
    slug: 'luxury-container-houses',
    live: true,
    card: {
      title: 'Luxury Container Houses',
      href: '/product/container-houses/luxury-container-houses',
      category: 'Container Houses',
      blurb: 'Explore Luxury Container Houses',
      imageSrc: '/images/products/luxury-container-houses/20x8/luxury-container-houses-20x8-front-right-hero.webp',
    },
  },
  // Approved but not yet built (404 on 6 Sep 2026). Card fields are provisional and
  // MUST be confirmed against the page's own published images when it goes live; the
  // live: false gate is what keeps them out of the DOM until then.
  {
    slug: 'container-farmhouse',
    live: false,
    card: {
      title: 'Container Farmhouse',
      href: '/product/container-houses/container-farmhouse',
      category: 'Container Houses',
      blurb: 'Explore Container Farmhouse',
      imageSrc: '/images/products/container-farmhouse/20x8/container-farmhouse-20x8-front-right-hero.webp',
    },
  },
  {
    slug: 'expandable-container-house',
    live: false,
    card: {
      title: 'Expandable Container House',
      href: '/product/container-houses/expandable-container-house',
      category: 'Container Houses',
      blurb: 'Explore Expandable Container House',
      imageSrc: '/images/products/expandable-container-house/20x8/expandable-container-house-20x8-front-right-hero.webp',
    },
  },
  {
    slug: 'flat-pack-container-homes',
    live: false,
    card: {
      title: 'Flat Pack Container Homes',
      href: '/product/container-houses/flat-pack-container-homes',
      category: 'Container Houses',
      blurb: 'Explore Flat Pack Container Homes',
      imageSrc: '/images/products/flat-pack-container-homes/20x8/flat-pack-container-homes-20x8-front-right-hero.webp',
    },
  },
  {
    slug: 'tiny-container-homes',
    live: false,
    card: {
      title: 'Tiny Container Homes',
      href: '/product/container-houses/tiny-container-homes',
      category: 'Container Houses',
      blurb: 'Explore Tiny Container Homes',
      imageSrc: '/images/products/tiny-container-homes/20x8/tiny-container-homes-20x8-front-right-hero.webp',
    },
  },
];

/** True for the seven approved cluster children, live or not. */
export const isContainerHouseRailSlug = (slug: string): boolean =>
  CONTAINER_HOUSE_RAIL_ORDER.some((entry) => entry.slug === slug);

/** Every live sibling in canonical order, slug itself excluded. Never padded. */
const liveSiblings = (slug: string): RelatedRailItem[] =>
  CONTAINER_HOUSE_RAIL_ORDER.filter((entry) => entry.live && entry.slug !== slug).map(
    (entry) => entry.card
  );

/**
 * The rail a cluster SUBPAGE renders: the hub, then every live sibling in canonical
 * order, self excluded. Three tiles on every subpage as of 6 Sep 2026.
 *
 * Hub FIRST, matching portaCabinSubpageRail and portableOfficeSubpageRail, and matching
 * the relatedTiles array CH-PFB-04 shipped for prefab-container-homes (PR #200, 6 Sep
 * 2026) when it rewrote that page onto the design lock. An earlier draft of this module
 * put the hub last, copying the legacy WooCommerce order the two un-rewritten pages were
 * still serving; the design lock is the order that wins.
 */
export const containerHouseSubpageRail = (slug: string): RelatedRailItem[] => [
  CONTAINER_HOUSE_HUB_CARD,
  ...liveSiblings(slug),
];

/**
 * The rail the HUB renders: every live child, no hub card (that would link the page to
 * itself). Three tiles as of 6 Sep 2026.
 */
export const containerHouseHubRail = (): RelatedRailItem[] =>
  liveSiblings(CONTAINER_HOUSE_HUB_SLUG);
