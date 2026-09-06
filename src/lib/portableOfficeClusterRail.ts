// PO-CLUSTER-02 (6 Sep 2026) — "Explore the Range" for the Portable Office cluster.
//
// DEFECT: every Portable Office page carried its OWN hand-authored `relatedTiles`
// array in its product JSON, so each page's panel was frozen at whatever was live on
// its build date. A sibling that went live later was never picked up by the pages
// built before it. Measured on production 6 Sep 2026: the laboratory page showed 6
// tiles where the cluster had 8 live siblings, the readymade page showed 3, and the
// executive page railed `/product/portable-office/portable-office-container`, which is
// NOT one of the approved paths in `src/data/seo/commercialArchitecture.json`.
//
// FIX: one derived list, exactly as portaCabinClusterRail.ts (C01, 15 Aug 2026) and
// labourColonyClusterRail.ts (LC-07, 17 Aug 2026) already do for their clusters. Every
// cluster page now resolves the same set: hub first, then every live sibling in
// canonical order, self excluded. A new cluster page needs NO rail code — add its slug
// to PORTABLE_OFFICE_RAIL_ORDER below and every sibling picks it up on the next build.
//
// Nothing here is invented. The six cards that were already published are copied
// VERBATIM from the shipped `relatedTiles` arrays. The four cards for pages that no
// sibling had ever railed (laboratory, construction site, control room, conference)
// follow the cluster's own established template exactly:
//   title    = the product's `productName`
//   category = "Portable Office"          (every published tile in this cluster)
//   blurb    = "Explore " + title
//   imageAlt = title + " <W> x <H> ft exterior render"   (ASCII x, per published alts)
//   imageSrc = that product's OWN default-variant front exterior image
// No product is ever represented by another product's image, and no card is padded or
// duplicated to fill a slot: a slug with no card is skipped so a gap stays visible.
//
// SCOPE: this module decides only WHICH tiles appear and in WHAT ORDER. It authors no
// price, size or specification, and the shared RelatedProductRail component is untouched.

import type { RelatedRailItem } from './c16PanelCatalog';

export const PORTABLE_OFFICE_HUB_SLUG = 'portable-office';
export const PORTABLE_OFFICE_HUB_HREF = '/product/portable-office';

/** The hub card that leads every subpage rail. Copied verbatim from the shipped tiles. */
const PORTABLE_OFFICE_HUB_CARD: RelatedRailItem = {
  title: 'Portable Office Cabin',
  href: PORTABLE_OFFICE_HUB_HREF,
  category: 'Portable Office',
  blurb: 'Explore Portable Office Cabin',
  imageSrc: '/images/products/portable-office/20x10/portable-office-20x10-front-angle.webp',
  imageAlt: 'Portable Office Cabin 20 x 10 ft exterior render',
};

type PortableOfficeRailEntry = {
  slug: string;
  /**
   * Gates rendering. A card is NEVER rendered for a URL that 404s, so turning a page
   * on after it deploys is a one-word change here and nowhere else.
   *
   * All nine below verified 200 on production on 6 Sep 2026, and all nine are in
   * `approvedProductionPaths` in src/data/seo/commercialArchitecture.json.
   */
  live: boolean;
  card: RelatedRailItem;
};

/**
 * The nine approved cluster children, in canonical order.
 *
 * Order preserves what is already live: the first five are in the sequence the shipped
 * panels used, so no existing tile moves. The four pages that no sibling had ever
 * railed are appended in release order (PO-05, PO-06, PO-07, PO-08), so this hotfix
 * only ADDS tiles to the end of each panel.
 *
 * Deliberately absent, and never to be added: `portable-office-container` and
 * `modern-office-cabin`. Neither is in `approvedProductionPaths`, and the executive
 * page was railing the former until this ticket removed it.
 */
export const PORTABLE_OFFICE_RAIL_ORDER: readonly PortableOfficeRailEntry[] = [
  {
    slug: 'readymade-office-cabin',
    live: true,
    card: {
      title: 'Readymade Office Cabin',
      href: '/product/portable-office/readymade-office-cabin',
      category: 'Portable Office',
      blurb: 'Explore Readymade Office Cabin',
      imageSrc: '/images/products/readymade-office-cabin/20x10/readymade-office-cabin-20x10-front.webp',
      imageAlt: 'Readymade Office Cabin 20 x 10 ft exterior render',
    },
  },
  {
    slug: 'prefabricated-office-cabins',
    live: true,
    card: {
      title: 'Prefabricated Office Cabins',
      href: '/product/portable-office/prefabricated-office-cabins',
      category: 'Portable Office',
      blurb: 'Explore Prefabricated Office Cabins',
      imageSrc: '/images/products/prefabricated-office-cabins/20x10/prefabricated-office-cabin-20x10-front-angle.webp',
      imageAlt: 'Prefabricated Office Cabins 20 x 10 ft exterior render',
    },
  },
  {
    slug: 'small-office-cabin',
    live: true,
    card: {
      title: 'Small Office Cabin',
      href: '/product/portable-office/small-office-cabin',
      category: 'Portable Office',
      blurb: 'Explore Small Office Cabin',
      imageSrc: '/images/products/small-office-cabin/10x10/small-office-cabin-10x10-front-angle.webp',
      imageAlt: 'Small Office Cabin 10 x 10 ft exterior render',
    },
  },
  {
    slug: 'portable-weighbridge-office',
    live: true,
    card: {
      title: 'Portable Weighbridge Office',
      href: '/product/portable-office/portable-weighbridge-office',
      category: 'Portable Office',
      blurb: 'Explore Portable Weighbridge Office',
      imageSrc: '/images/products/portable-weighbridge-office/20x10/portable-weighbridge-office-20x10-yard-exterior-wall-a-entry.webp',
      imageAlt: 'Portable Weighbridge Office 20 x 10 ft exterior render',
    },
  },
  {
    slug: 'executive-portable-office',
    live: true,
    card: {
      title: 'Executive Portable Office',
      href: '/product/portable-office/executive-portable-office',
      category: 'Portable Office',
      blurb: 'Explore Executive Portable Office',
      imageSrc: '/images/products/executive-portable-office/gallery/20x10/executive-portable-office-20x10-front-centred-door.webp',
      imageAlt: 'Executive Portable Office 20 x 10 ft exterior render',
    },
  },
  // The four below were live but had never appeared in any sibling's panel — the
  // defect SAMAN raised. Cards built on the template above from each product's own
  // JSON (`productName`, `defaultVariant`, that variant's front exterior image).
  {
    slug: 'portable-mobile-laboratory',
    live: true,
    card: {
      title: 'Portable Mobile Laboratory',
      href: '/product/portable-office/portable-mobile-laboratory',
      category: 'Portable Office',
      blurb: 'Explore Portable Mobile Laboratory',
      imageSrc: '/images/products/portable-mobile-laboratory/20x10/portable-mobile-laboratory-20x10-front-window-door-window.webp',
      imageAlt: 'Portable Mobile Laboratory 20 x 10 ft exterior render',
    },
  },
  {
    slug: 'construction-site-cabin',
    live: true,
    card: {
      title: 'Portable Construction Site Cabin',
      href: '/product/portable-office/construction-site-cabin',
      category: 'Portable Office',
      blurb: 'Explore Portable Construction Site Cabin',
      imageSrc: '/images/products/construction-site-cabin/20x10/construction-site-cabin-20x10-front-exterior.webp',
      imageAlt: 'Portable Construction Site Cabin 20 x 10 ft exterior render',
    },
  },
  {
    slug: 'portable-control-room',
    live: true,
    card: {
      title: 'Portable Control Room',
      href: '/product/portable-office/portable-control-room',
      category: 'Portable Office',
      blurb: 'Explore Portable Control Room',
      imageSrc: '/images/products/portable-control-room/10x10/portable-control-room-10x10-door-wall-exterior.webp',
      imageAlt: 'Portable Control Room 10 x 10 ft exterior render',
    },
  },
  {
    slug: 'portable-conference-cabin',
    live: true,
    card: {
      title: 'Portable Conference Cabin',
      href: '/product/portable-office/portable-conference-cabin',
      category: 'Portable Office',
      blurb: 'Explore Portable Conference Cabin',
      imageSrc: '/images/products/portable-conference-cabin/20x10/portable-conference-cabin-20x10-wall-a-front-exterior.webp',
      imageAlt: 'Portable Conference Cabin 20 x 10 ft exterior render',
    },
  },
];

/** True for the nine approved cluster children, live or not. */
export const isPortableOfficeRailSlug = (slug: string): boolean =>
  PORTABLE_OFFICE_RAIL_ORDER.some((entry) => entry.slug === slug);

/** Every live sibling in canonical order, `slug` itself excluded. */
const liveSiblings = (slug: string): RelatedRailItem[] =>
  PORTABLE_OFFICE_RAIL_ORDER.filter((entry) => entry.live && entry.slug !== slug).map(
    (entry) => entry.card
  );

/**
 * The rail a cluster SUBPAGE renders: the hub, then every live sibling in canonical
 * order, self excluded. Nine tiles on every subpage as of 6 Sep 2026.
 */
export const portableOfficeSubpageRail = (slug: string): RelatedRailItem[] => [
  PORTABLE_OFFICE_HUB_CARD,
  ...liveSiblings(slug),
];

/**
 * The rail the HUB renders: every live child, no hub card (that would link the page to
 * itself). Nine tiles as of 6 Sep 2026.
 */
export const portableOfficeHubRail = (): RelatedRailItem[] =>
  liveSiblings(PORTABLE_OFFICE_HUB_SLUG);
