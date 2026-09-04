/**
 * MT-32 (04 Sep 2026) — the canonical "You may also like" card set for the
 * Container Office family.
 *
 * MT-32 is a separate contract from the "Explore the Range" sibling rail. The
 * sibling rail answers "what else is in this cluster right now" and several
 * Container Office routes deliberately carry a short, hand-authored three- or
 * four-tile version of it in `variantData.relatedTiles`. MT-32 answers a
 * different question — "show the buyer the whole approved range" — and must be
 * the same eight cards everywhere.
 *
 * Four routes (BESS, containerized data center, multi-story, flat-pack) were
 * rendering MT-32 from their short sibling data, so they showed three or four
 * cards instead of eight. This module supplies the approved set directly, which
 * leaves each route's sibling rail untouched.
 *
 * Every field below is taken from the cards these products already publish on
 * the conforming routes (Shipping Container Office, Site Office Container,
 * Container Marketing Office, Expandable Container Office). No image, blurb,
 * title or URL is invented, and no image is borrowed from another product:
 * each card carries that destination's own approved artwork.
 *
 * Expandable Container Office is deliberately absent as a destination and is
 * held for OA-3.
 *
 * Authority: MT-32 owner ruling, 04 Sep 2026.
 */

import type { RelatedRailItem } from './c16PanelCatalog';

type Mt32Card = RelatedRailItem & { slug: string };

/** Canonical MT-32 order. Expandable Container Office is excluded (OA-3). */
const CONTAINER_OFFICE_MT32_CARDS: readonly Mt32Card[] = [
  {
    slug: 'container-offices',
    title: 'Container Offices',
    href: '/product/container-offices',
    category: 'Container Offices',
    blurb: 'Compare standard container office configurations',
    imageSrc: '/images/product-heroes/container-offices/modern-green-container-office-exterior.jpeg',
    imageAlt: 'Container Offices',
  },
  {
    slug: 'container-office-cabin',
    title: 'Container Office Cabin',
    href: '/product/container-offices/container-office-cabin',
    category: 'Container Offices',
    blurb: 'Panel-built office cabin for fixed site use',
    imageSrc: '/images/product-heroes/container-offices/construction-workers-reviewing-plans-on-site.jpeg',
    imageAlt: 'Container Office Cabin',
  },
  {
    slug: 'site-office-container',
    title: 'Site Office Container',
    href: '/product/container-offices/site-office-container',
    category: 'Container Offices',
    blurb: 'Purpose-built site office container for project teams',
    imageSrc: '/images/products/site-office-container/20x8/01-site-office-container-20x8-front-exterior.webp',
    imageAlt: 'Site Office Container',
  },
  {
    slug: 'bess-container',
    title: 'BESS Container',
    href: '/product/container-offices/bess-container',
    category: 'Container Offices',
    blurb: 'Enclosure shell for battery energy storage',
    imageSrc: '/images/products/bess-container/gallery/20ft-standard-exterior.webp',
    imageAlt: 'BESS Container',
  },
  {
    slug: 'containerized-data-center',
    title: 'Containerized Data Center',
    href: '/product/container-offices/containerized-data-center',
    category: 'Container Offices',
    blurb: 'Enclosure shell for IT racks, power and cooling',
    imageSrc: '/images/products/containerized-data-center/containerized-data-center-10ft-edge-main-exterior.webp',
    imageAlt: 'Containerized Data Center',
  },
  {
    slug: 'container-marketing-office',
    title: 'Container Marketing Office',
    href: '/product/container-offices/container-marketing-office',
    category: 'Container Offices',
    blurb: 'Customer-facing sales and display office',
    imageSrc: '/assets/products/container-marketing-office/gallery/20x8/01-container-marketing-20x8-front-exterior.webp',
    imageAlt: 'Container Marketing Office',
  },
  {
    slug: 'multi-story-container-office',
    title: 'Multi-Story Container Office',
    href: '/product/container-offices/multi-story-container-office',
    category: 'Container Offices',
    blurb: 'Stacked office block with external stair access',
    imageSrc: '/images/products/multi-story-container-office/20x8/01-multi-story-office-20x8-front.webp',
    imageAlt: 'Multi-Story Container Office',
  },
  {
    slug: 'flat-pack-container-office',
    title: 'Flat-Pack Container Office',
    href: '/product/container-offices/flat-pack-container-office',
    category: 'Container Offices',
    blurb: 'Ships as panels and bolts together on site',
    imageSrc: '/images/products/flat-pack-container-office/gallery/flat-pack-container-office-10x8-wall-a-exterior.webp',
    imageAlt: 'Flat-Pack Container Office',
  },
  {
    slug: 'shipping-container-office',
    title: 'Shipping Container Office',
    href: '/product/container-offices/shipping-container-office',
    category: 'Container Offices',
    blurb: 'Built inside a corrugated ISO freight shell',
    imageSrc: '/images/products/shipping-container-office/size-20x8/01-shipping-container-office-front-exterior.png',
    imageAlt: 'Shipping Container Office',
  },
];

/** Slugs whose MT-32 rail is served from the canonical set. */
export const CONTAINER_OFFICE_MT32_SLUGS: readonly string[] = [
  'bess-container',
  'containerized-data-center',
  'multi-story-container-office',
  'flat-pack-container-office',
];

/** The canonical set with the current page removed: eight cards on every applicable route. */
export function containerOfficeMt32Items(currentSlug: string): RelatedRailItem[] {
  return CONTAINER_OFFICE_MT32_CARDS.filter((card) => card.slug !== currentSlug).map(
    ({ slug: _slug, ...item }) => item
  );
}

/** True when this route takes its MT-32 rail from the canonical set. */
export function hasContainerOfficeMt32(currentSlug: string): boolean {
  return CONTAINER_OFFICE_MT32_SLUGS.includes(currentSlug);
}

export { CONTAINER_OFFICE_MT32_CARDS };
