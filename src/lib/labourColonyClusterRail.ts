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
    imageSrc: '/images/products/labor-sheds/20x10/labour-shed-20x10-front-left-exterior.webp',
    imageAlt: 'Labor Sheds by SAMAN Portable, exterior view',
  },
  {
    title: 'Labour Hutments',
    href: '/product/labor-colony/labor-hutments',
    category: 'Labour Colony',
    // LC-01 (17 Aug 2026) — blurb and image updated to match the rewritten page:
    // the old colony-block six-size ladder (60x24-gplus1 etc.) is withdrawn from
    // this route, so the image this card pointed to no longer exists. New blurb
    // is this sibling's own approved opener, first sentence only, same
    // convention as the other two cards.
    blurb: 'A labour hutment is one small sleeping unit, built complete in the factory and set down on its own plinth.',
    imageSrc: '/images/products/labor-hutments/10x10/labor-hutments-10x10-front-right-three-quarter.webp',
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

// LC-02 (16 Aug 2026) — the labor-sheds page's own Column 3 rail (build prompt
// v1 s4 row 3): Labour Colony (hub), Labour Hutments, Prefab Labour Camps, in
// that order, self excluded. The live page's rail was missing the hub link
// entirely and showed the two siblings in the opposite order — a real defect
// this rewrite fixes, scoped to this one page only (mirrors the PC-09
// knock-down-porta-cabin precedent: a dedicated rail constant, gated by slug
// in [slug].tsx, rather than touching the generic derived-rail path every
// other labor-colony page still uses). Images and blurbs are each
// destination's own already-approved asset/opener first sentence, reused
// verbatim from LABOR_COLONY_HUB_RAIL and labor-colony.json — no new copy.
export const LABOR_SHEDS_RAIL: RelatedRailItem[] = [
  {
    title: 'Labour Colony',
    href: '/product/labor-colony',
    category: 'Labour Colony',
    blurb: 'A labour colony is a whole worker housing site.',
    imageSrc: '/images/products/labor-colony/60x24-gplus1/labour-colony-60x24-gplus1-front-three-quarter.webp',
    imageAlt: 'Two-storey labour colony block with cream panels, grey steel frame and railed walkways on both levels',
  },
  {
    title: 'Labour Hutments',
    href: '/product/labor-colony/labor-hutments',
    category: 'Labour Colony',
    // Merge note (17 Aug 2026) — reused LC-01's own rewritten blurb/image
    // (LABOR_COLONY_HUB_RAIL above) rather than the pre-LC-01 pair this
    // entry was authored against, which pointed at the retired six-size
    // ladder's now-removed image.
    blurb: 'A labour hutment is one small sleeping unit, built complete in the factory and set down on its own plinth.',
    imageSrc: '/images/products/labor-hutments/10x10/labor-hutments-10x10-front-right-three-quarter.webp',
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

// LC-01 (17 Aug 2026) - the hutments page's own Column 3 rail. Build prompt v1
// section 4, hero column 3: exactly three tabs, in this order: Labour Sheds,
// Labour Colony, Prefab Labour Camps. Title, href and image come from each
// sibling's own live product data; blurb is that sibling's own already-approved
// opener, first sentence(s) only, so no new copy is authored here.
export const LABOR_HUTMENTS_RAIL: RelatedRailItem[] = [
  {
    title: 'Labour Sheds',
    href: '/product/labor-colony/labor-sheds',
    category: 'Labour Colony',
    blurb: 'A labour shed is the open-hall version of SAMAN worker housing: one clear sleeping hall per floor with central aisles, built as a light portal-frame steel building with PPGI cladding and high-level ventilation.',
    imageSrc: '/images/products/labor-sheds/20x10/labour-shed-20x10-front-left-exterior.webp',
    imageAlt: 'Labor Sheds by SAMAN Portable, exterior view',
  },
  {
    title: 'Labour Colony',
    href: '/product/labor-colony',
    category: 'Labour Colony',
    blurb: 'A labour colony is a whole worker housing site. It is not one building.',
    imageSrc: '/images/products/labor-colony/60x24-gplus1/labor-colony-60x24-gplus1-front-right-hero.webp',
    imageAlt: 'Labour Colony by SAMAN Portable, worker housing site',
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

// LC-06 (17 Aug 2026) - the canteen page's own Column 3 rail (build prompt v1
// s4): Prefab Labour Camps, Labour Sheds, Labour Colony, in that exact order.
// Oil Field Camp, Accommodation Container and Multi-Toilet Ablution Block are
// explicitly excluded (all three 404, unpublished). Title, href, image and
// blurb reused verbatim from the entries already established above for these
// same three destinations - no new copy authored here.
export const PREFAB_SITE_CANTEEN_RAIL: RelatedRailItem[] = [
  {
    title: 'Prefab Labour Camps',
    href: '/product/labor-colony/prefab-labor-camps',
    category: 'Labour Colony',
    blurb: 'A prefab labour camp is the relocatable build in the SAMAN worker housing family: bolted light-steel panels on pedestal footings, with repeatable door and window modules and plug-and-play electrical blocks, so the same camp dismantles and re-erects at the next project.',
    imageSrc: '/images/products/prefab-labor-camps/60x24-gplus1/prefab-labor-camps-60x24-gplus1-front-right-hero.webp',
    imageAlt: 'Prefab Labor Camps by SAMAN Portable, exterior view',
  },
  {
    title: 'Labour Sheds',
    href: '/product/labor-colony/labor-sheds',
    category: 'Labour Colony',
    blurb: 'A labour shed is the open-hall version of SAMAN worker housing: one clear sleeping hall per floor with central aisles, built as a light portal-frame steel building with PPGI cladding and high-level ventilation.',
    imageSrc: '/images/products/labor-sheds/20x10/labour-shed-20x10-front-left-exterior.webp',
    imageAlt: 'Labor Sheds by SAMAN Portable, exterior view',
  },
  {
    title: 'Labour Colony',
    href: '/product/labor-colony',
    category: 'Labour Colony',
    blurb: 'A labour colony is a whole worker housing site. It is not one building.',
    imageSrc: '/images/products/labor-colony/60x24-gplus1/labor-colony-60x24-gplus1-front-right-hero.webp',
    imageAlt: 'Labour Colony by SAMAN Portable, worker housing site',
  },
];

// LC-03 (17 Aug 2026) — the oil-field-camp page's own Column 3 rail (build
// prompt v1 s2, Column 3): Prefab Labor Camps, Labour Colony, Labor Sheds, in
// that order, self excluded. Title, href and image come from each sibling's
// own live product data; blurb is that sibling's own already-approved
// opener, first sentence only, so no new copy is authored here.
export const OIL_FIELD_CAMP_RAIL: RelatedRailItem[] = [
  {
    title: 'Prefab Labor Camps',
    href: '/product/labor-colony/prefab-labor-camps',
    category: 'Labour Colony',
    blurb: 'A prefab labour camp is the relocatable build in the SAMAN worker housing family: bolted light-steel panels on pedestal footings, with repeatable door and window modules and plug-and-play electrical blocks, so the same camp dismantles and re-erects at the next project.',
    imageSrc: '/images/products/prefab-labor-camps/60x24-gplus1/prefab-labor-camps-60x24-gplus1-front-right-hero.webp',
    imageAlt: 'Prefab Labor Camps by SAMAN Portable, exterior view',
  },
  {
    title: 'Labour Colony',
    href: '/product/labor-colony',
    category: 'Labour Colony',
    blurb: 'A labour colony is a whole worker housing site. It is not one building.',
    imageSrc: '/images/products/labor-colony/60x24-gplus1/labor-colony-60x24-gplus1-front-right-hero.webp',
    imageAlt: 'Labour Colony by SAMAN Portable, worker housing site',
  },
  {
    title: 'Labor Sheds',
    href: '/product/labor-colony/labor-sheds',
    category: 'Labour Colony',
    blurb: 'A labour shed is one undivided sleeping hall under a single roof.',
    imageSrc: '/images/products/labor-sheds/20x10/labour-shed-20x10-front-left-exterior.webp',
    imageAlt: 'Labor Sheds by SAMAN Portable, exterior view',
  },
];
