// LC-00 (16 Aug 2026) — the labour colony hub's own Column 3 rail. Build prompt
// v1 section 4.3 names exactly three tabs, in this order: Labour Sheds, Labour
// Hutments, Prefab Labour Camps — not oil field camp, accommodation container,
// prefab site canteen or ablution block, which 404 until built. Title, href and
// image come from each sibling's own live product data; blurb is that sibling's
// own already-approved opener, first sentence only, so no new copy is authored
// here.
import type { RelatedRailItem } from './c16PanelCatalog';

export const LABOR_COLONY_HUB_RAIL: RelatedRailItem[] = [
  {
    title: 'Labour Sheds',
    href: '/product/labor-colony/labor-sheds',
    category: 'Labour Colony',
    blurb: 'A labour shed is the open-hall version of SAMAN worker housing: one clear sleeping hall per floor with central aisles, built as a light portal-frame steel building with PPGI cladding and high-level ventilation.',
    imageSrc: '/images/products/labor-sheds/60x24-gplus1/labor-sheds-60x24-gplus1-front-right-hero.webp',
    imageAlt: 'Labor Sheds by SAMAN Portable, exterior view',
  },
  {
    title: 'Labour Hutments',
    href: '/product/labor-colony/labor-hutments',
    category: 'Labour Colony',
    blurb: 'A labour hutment is the room-based member of the SAMAN worker housing range: a linear block of individual sleeping rooms, each with its own personnel door, aluminium sliding window, fans and a small distribution board.',
    imageSrc: '/images/products/labor-hutments/60x24-gplus1/labor-hutments-60x24-gplus1-front-right-hero.webp',
    imageAlt: 'Labor Hutments by SAMAN Portable, exterior view',
  },
  {
    title: 'Prefab Labour Camps',
    href: '/product/labor-colony/prefab-labor-camps',
    category: 'Labour Colony',
    blurb: 'A prefab labour camp is the relocatable build in the SAMAN worker housing family: bolted light-steel panels on pedestal footings, with repeatable door and window modules and plug-and-play electrical blocks, so the same camp dismantles and re-erects at the next project.',
    imageSrc: '/images/products/prefab-labor-camps/60x24-gplus1/prefab-labor-camps-60x24-gplus1-front-right-hero.webp',
    imageAlt: 'Prefab Labor Camps by SAMAN Portable, exterior view',
  },
];
