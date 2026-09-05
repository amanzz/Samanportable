/**
 * Route-owned published price ladders.
 *
 * Binding ruling (Fable 5, 03 Aug 2026):
 *
 *   The calculator on a route reads that route's own published ladder and
 *   nothing else. A route with no ladder of its own does not inherit a rate
 *   from a parent, a sibling or a reference row. It renders in quote mode with
 *   no number.
 *
 * Before this file existed the calculator priced from eight hard-coded
 * `referenceRate` constants shared across nineteen routes, so a subpage was
 * priced at its parent's rate. Sixteen of nineteen routes showed a figure the
 * same page contradicted, by as much as ₹1,20,000.
 *
 * Each entry below is the ladder that route's own page publishes, read from the
 * same JSON the page renders from. There is no formula here and no fallback.
 */
import portaCabins from '@/data/products/porta-cabins.json';
import msPortaCabin from '@/data/products/ms-porta-cabin.json';
import giPortaCabin from '@/data/products/gi-porta-cabin.json';
import soundproofPortaCabin from '@/data/products/soundproof-porta-cabin.json';
import fireRatedPortaCabin from '@/data/products/fire-rated-porta-cabin.json';
import pufPortaCabin from '@/data/products/puf-porta-cabin.json';
import doubleStoryPortaCabin from '@/data/products/double-story-porta-cabin.json';
import skidMountedPortaCabin from '@/data/products/skid-mounted-porta-cabin.json';
import knockDownPortaCabin from '@/data/products/knock-down-porta-cabin.json';
import portaCabinShop from '@/data/products/porta-cabin-shop.json';
import laborColony from '@/data/products/labor-colony.json';
import laborHutments from '@/data/products/labor-hutments.json';
import accommodationContainer from '@/data/products/accommodation-container.json';
import oilFieldCamp from '@/data/products/oil-field-camp.json';
import ablutionBlock from '@/data/products/ablution-block.json';
import portaCabinWithToilet from '@/data/products/porta-cabin-with-toilet.json';
import portableOffice from '@/data/products/portable-office.json';
import modernOfficeCabin from '@/data/products/modern-office-cabin.json';
import portableOfficeContainer from '@/data/products/portable-office-container.json';
import prefabricatedOfficeCabins from '@/data/products/prefabricated-office-cabins.json';
import readymadeOfficeCabin from '@/data/products/readymade-office-cabin.json';
import smallOfficeCabin from '@/data/products/small-office-cabin.json';
import executivePortableOffice from '@/data/products/executive-portable-office.json';
import containerOfficesJson from '@/data/products/container-offices.json';
import containerOfficeCabinJson from '@/data/products/container-office-cabin.json';
import containerMarketingOffice from '@/data/products/container-marketing-office.json';
import flatPackContainerOffice from '@/data/products/flat-pack-container-office.json';
import multiStoryContainerOffice from '@/data/products/multi-story-container-office.json';
import expandableContainerOffice from '@/data/products/expandable-container-office.json';
import bessContainerJson from '@/data/products/bess-container.json';
import shippingContainerOfficeJson from '@/data/products/shipping-container-office.json';
import siteOfficeContainer from '@/data/products/site-office-container.json';
import containerizedDataCenter from '@/data/products/containerized-data-center.json';
// C-05 container cafe cluster, added in CALC-L4 (09 Aug 2026). Each of the six
// routes publishes its own six-row ladder on its own page; these read that JSON
// and nothing else, so the cluster follows the same route-owns-its-ladder rule
// as everything above. The four distinct price points here are real, not a
// shared reference row: 20x10 is ₹4,00,000 on container-restaurant, ₹3,70,000
// on the hub, ₹3,20,000 on food-truck-containers and ₹2,70,000 on
// modular-container-cafe.
import containerCafe from '@/data/products/container-cafe.json';
import containerCoffeeShop from '@/data/products/container-coffee-shop.json';
import containerHotel from '@/data/products/container-hotel.json';
import containerRestaurant from '@/data/products/container-restaurant.json';
import foodTruckContainers from '@/data/products/food-truck-containers.json';
import modularContainerCafe from '@/data/products/modular-container-cafe.json';

export interface LadderRow {
  sizeSlug: string;
  label: string;
  areaSqft: number;
  length: number | null;
  width: number | null;
  priceExGst: number;
}

type RawVariant = {
  sizeSlug?: string;
  label?: string;
  dims?: string;
  areaSqft?: number;
  priceExGst?: number;
};

/** `20x10` and `40x12` are the only shapes the cabin ladders use. */
function dimsFromSizeSlug(sizeSlug: string): { length: number; width: number } | null {
  const match = String(sizeSlug).match(/(\d+(?:\.\d+)?)\s*(?:ft)?\s*[x×]\s*(\d+(?:\.\d+)?)/i);
  return match ? { length: Number(match[1]), width: Number(match[2]) } : null;
}

function toRows(source: { variants?: RawVariant[] }): LadderRow[] {
  return (source.variants || [])
    .filter((variant) => typeof variant.priceExGst === 'number' && variant.priceExGst > 0)
    .map((variant) => {
      const sizeSlug = variant.sizeSlug || '';
      const dims = dimsFromSizeSlug(sizeSlug) || dimsFromSizeSlug(variant.dims || '');
      return {
        sizeSlug,
        label: variant.label || variant.dims || sizeSlug,
        areaSqft: variant.areaSqft || 0,
        length: dims?.length ?? null,
        width: dims?.width ?? null,
        priceExGst: variant.priceExGst as number,
      };
    });
}

/**
 * Container House cluster — stored, never recomputed.
 *
 * Ruled by Fable 5 on 03 Aug 2026: "Store them as ladder data. Do not recompute
 * them at runtime." These six values per ladder are live on five C-08 pages and
 * in five PDFs, derived on 02 Aug from SAMAN's approved container-office rates
 * (hub = container-office rate +15%; luxury +3% on the hub; affordable −3%).
 *
 * Source of truth: src/data/products/{slug}.json on
 * `origin/agent/c08-container-houses-build-20260802`, which is NOT yet merged
 * into static-migration. The values are transcribed here so the calculator does
 * not depend on that branch landing first.
 *
 * Why storing matters, concretely: the previous runtime expression
 *   Math.round(priceExGst / areaSqft * 1.15) * areaSqft
 * happens to reproduce all six published figures today, but only because
 * 1450 × 1.15 evaluates to 1667.4999999999998 in binary floating point rather
 * than 1667.5. Had it landed on the tie, Math.round would have returned 1668
 * and the 20×10 row would have published ₹3,33,600 against ₹3,33,400 on the
 * page. A published price must not depend on which side of a tie a float lands.
 */
const CONTAINER_HOUSE_SIZES: ReadonlyArray<{ sizeSlug: string; label: string; areaSqft: number }> = [
  { sizeSlug: '20x8', label: '20x8 ft', areaSqft: 160 },
  { sizeSlug: '20x10', label: '20x10 ft', areaSqft: 200 },
  { sizeSlug: '20x12', label: '20x12 ft', areaSqft: 240 },
  { sizeSlug: '40x8', label: '40x8 ft', areaSqft: 320 },
  { sizeSlug: '40x10', label: '40x10 ft', areaSqft: 400 },
  { sizeSlug: '40x12', label: '40x12 ft', areaSqft: 480 },
];

const CONTAINER_HOUSE_PRICES: Record<string, readonly number[]> = {
  'container-houses': [293440, 333400, 384240, 501440, 626800, 736320],
  'prefab-container-homes': [259520, 295000, 339840, 443520, 554400, 651360],
  'shipping-container-homes': [364320, 414000, 476880, 622720, 778400, 913920],
  'affordable-container-homes': [252960, 287600, 331200, 432320, 540400, 634560],
  'luxury-container-houses': [380160, 432000, 497760, 649600, 812000, 953760],
};

function containerHouseLadder(key: string): LadderRow[] {
  const prices = CONTAINER_HOUSE_PRICES[key];
  return CONTAINER_HOUSE_SIZES.map((size, index) => {
    const dims = dimsFromSizeSlug(size.sizeSlug)!;
    return {
      sizeSlug: size.sizeSlug,
      label: size.label,
      areaSqft: size.areaSqft,
      length: dims.length,
      width: dims.width,
      priceExGst: prices[index],
    };
  });
}

/**
 * Keyed by the product JSON slug that the route's own page publishes from —
 * which is the route's last path segment for a subpage, and the category for a
 * hub. Colony routes are absent by design: they are priced from a block ladder
 * selected by index, not by length × width, and already read their own data.
 */
export const ROUTE_LADDERS: Readonly<Record<string, LadderRow[]>> = {
  'porta-cabins': toRows(portaCabins),
  // Phase 1 Porta Cabin consolidation (SAMAN approval, 15 Aug 2026): seven
  // route-only ladder keys removed together with the redirects that retire their
  // routes - low-cost, luxury, mini, portacabin-office, steel, and the Portable
  // Cabin toilet and shop pages. Nothing else reads them; the approved successors
  // (ms-porta-cabin, porta-cabin-with-toilet, porta-cabin-shop) keep their own
  // entries. Removing them earlier would have dropped still-live pages into quote
  // mode, which is why they were held back from the calculator patch.
  'ms-porta-cabin': toRows(msPortaCabin),
  // PC-02: derived from the GI product JSON's own six variants, so the calc-entry
  // banner price and the published ladder cannot drift (Calculator Standing Rule 3).
  'gi-porta-cabin': toRows(giPortaCabin),
  // PC-06 v1.2 addendum (15 Aug 2026) — standing rule, now in CLAUDE.md: a page
  // that publishes a price ladder gets a ROUTE_LADDERS entry derived from its
  // own product JSON, same pattern as GI, so the calculator and the page
  // cannot drift apart.
  'soundproof-porta-cabin': toRows(soundproofPortaCabin),
  // CALC parity patch (SAMAN ruling, 15 Aug 2026). Both pages publish a six-row
  // ladder but had no entry here, so getRouteLadder returned null and the
  // calculator rendered "Price on request" under a published price table. Same
  // standing rule as GI and Soundproof: read the page's own product JSON so the
  // calculator and the published ladder cannot drift. The two ladders carry
  // different size sets (fire-rated has 40x12 and no 30x10; PUF the reverse) -
  // toRows()/dimsFromSizeSlug() are generic parsers, so neither needs handling.
  'fire-rated-porta-cabin': toRows(fireRatedPortaCabin),
  'puf-porta-cabin': toRows(pufPortaCabin),
  // PC-03: derived from the double-story product JSON's own six variants, so the
  // calc-entry banner price and the published ladder cannot drift. This is the
  // standard entry every page gets (SAMAN ruling, 15 Aug 2026); no other calculator
  // logic, step or formula is touched and the banner is never hardcoded.
  'double-story-porta-cabin': toRows(doubleStoryPortaCabin),
  // PC-08 (15 Aug 2026): same standing rule, derived from the skid-mounted
  // product JSON's own six variants so the calc-entry banner price and the
  // published ladder cannot drift.
  'skid-mounted-porta-cabin': toRows(skidMountedPortaCabin),
  // PC-09 (15 Aug 2026): same standing rule. This page's ladder carries 40x12
  // and does not carry 20x12 (build prompt v1 §5) - toRows()/dimsFromSizeSlug()
  // are generic regex parsers with no hardcoded cluster size set, verified
  // before wiring, so the odd shape needs no special handling here.
  'knock-down-porta-cabin': toRows(knockDownPortaCabin),
  'porta-cabin-shop': toRows(portaCabinShop),
  // LC-00 (16 Aug 2026) — build prompt v1 section 8: one ROUTE_LADDERS entry,
  // read from this route's own product JSON. Six sizes, prices unchanged from
  // what is already live.
  'labor-colony': toRows(laborColony),
  // LC-01 (17 Aug 2026) — build prompt v1 section 4: one ROUTE_LADDERS entry,
  // read from this route's own product JSON. Six single-unit sizes, prices
  // unchanged from the ladder this rewrite publishes.
  'labor-hutments': toRows(laborHutments),
  // LC-05 v3 (17 Aug 2026): derived from accommodation-container.json so the
  // calculator, price table and entry banner follow the page ladder.
  'accommodation-container': toRows(accommodationContainer),
  // LC-03 (17 Aug 2026) — build prompt v1 section 10: one ROUTE_LADDERS entry,
  // read from this route's own product JSON, using the shell price ladder as
  // the base (priceExGst/priceInclGst on each variant are the shell figures).
  'oil-field-camp': toRows(oilFieldCamp),
  // LC-07 (17 Aug 2026) — build prompt v1.1 section 8: one ROUTE_LADDERS
  // entry, read from this route's own product JSON. From-price banner
  // derives and must read Rs 2,10,000 ex-GST (the 12x10 ft shell price).
  'ablution-block': toRows(ablutionBlock),
  'porta-cabin-with-toilet': toRows(portaCabinWithToilet),
  'portable-office': toRows(portableOffice),
  'modern-office-cabin': toRows(modernOfficeCabin),
  'portable-office-container': toRows(portableOfficeContainer),
  'prefabricated-office-cabins': toRows(prefabricatedOfficeCabins),
  'readymade-office-cabin': toRows(readymadeOfficeCabin),
  'small-office-cabin': toRows(smallOfficeCabin),
  // PO-04 (5 Sep 2026) - one ROUTE_LADDERS entry for the new route, read from this
  // page's own product JSON via toRows(...), so the calculator follows the six
  // published ex-GST prices with no calculator content, label, formula or styling
  // change. From-price derives as the 10x10 at Rs 2,23,388 ex-GST.
  'executive-portable-office': toRows(executivePortableOffice),
  'container-offices': toRows(containerOfficesJson),
  'container-office-cabin': toRows(containerOfficeCabinJson),
  'container-marketing-office': toRows(containerMarketingOffice),
  'flat-pack-container-office': toRows(flatPackContainerOffice),
  'multi-story-container-office': toRows(multiStoryContainerOffice),
  // CO-08: the calculator reads the exact six published rows from this page's
  // own product JSON. No calculator formula, control or shared copy changes.
  'expandable-container-office': toRows(expandableContainerOffice),
  // CO-03: read the BESS enclosure shell ladder from this route's own product JSON.
  'bess-container': toRows(bessContainerJson),
  'shipping-container-office': toRows(shippingContainerOfficeJson),
  'site-office-container': toRows(siteOfficeContainer),
  'containerized-data-center': toRows(containerizedDataCenter),
  // 'portable-cabin' removed with its product-list entry (SAMAN ruling, 15 Aug
  // 2026). The Portable Cabin cluster retires into /product/porta-cabins, so the
  // retired terminology must not survive as a separate calculator product with a
  // price of its own. Deliberately NOT remapped to the porta-cabins ladder: that
  // would reinstate the inherited-rate pattern the 03 Aug 2026 binding ruling
  // removed. This entry and PRODUCTS in cabinCalculatorSSR.ts move together.
  'container-cafe': toRows(containerCafe),
  'container-coffee-shop': toRows(containerCoffeeShop),
  'container-hotel': toRows(containerHotel),
  'container-restaurant': toRows(containerRestaurant),
  'food-truck-containers': toRows(foodTruckContainers),
  'modular-container-cafe': toRows(modularContainerCafe),
  'container-houses': containerHouseLadder('container-houses'),
  'prefab-container-homes': containerHouseLadder('prefab-container-homes'),
  'shipping-container-homes': containerHouseLadder('shipping-container-homes'),
  'affordable-container-homes': containerHouseLadder('affordable-container-homes'),
  'luxury-container-houses': containerHouseLadder('luxury-container-houses'),
};

export function getRouteLadder(ladderKey: string | null | undefined): LadderRow[] | null {
  if (!ladderKey) return null;
  const ladder = ROUTE_LADDERS[ladderKey];
  return ladder && ladder.length ? ladder : null;
}

/** Exact published price for a size on this route's ladder, or null. */
export function ladderPriceFor(
  ladderKey: string | null | undefined,
  length: number,
  width: number
): number | null {
  const ladder = getRouteLadder(ladderKey);
  if (!ladder) return null;
  const row = ladder.find(
    (item) =>
      (item.length === length && item.width === width) ||
      (item.length === width && item.width === length)
  );
  return row?.priceExGst ?? null;
}

/**
 * Rate for a size this route does not publish, taken from this route's own
 * ladder — never from a parent, sibling or reference row. The 200 sq ft row is
 * the anchor where the route publishes one, otherwise its smallest row.
 */
export function ladderAnchorRate(ladderKey: string | null | undefined): number | null {
  const ladder = getRouteLadder(ladderKey);
  if (!ladder) return null;
  const anchor =
    ladder.find((row) => row.areaSqft === 200) ||
    [...ladder].sort((a, b) => a.areaSqft - b.areaSqft)[0];
  return anchor && anchor.areaSqft > 0 ? anchor.priceExGst / anchor.areaSqft : null;
}
