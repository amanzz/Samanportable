import type { ProductId } from './cabinCalculatorSSR';

type CategorySlug = string;
type ProductSlug = string;

export interface EmbeddedCalculatorProduct {
  category: string;
  slug?: string;
  /**
   * Absent on a NO-PREFILL mount. The wizard opens as the general cabin
   * calculator and claims to price nothing on that page.
   */
  productId?: ProductId;
  /**
   * false = the page sells a component or material, so the calculator carries
   * no product, no ladder and no entry band naming the product.
   */
  prefill: boolean;
  /**
   * Product JSON slug whose published ladder this route renders. The calculator
   * prices from this and nothing else, so a subpage can never show its parent's
   * price. The last path segment for a subpage, the category for a hub.
   */
  ladderKey: string;
}

export function makeCalculatorPageUrl(category: CategorySlug, slug?: ProductSlug): string {
  if (slug) {
    return `/product/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`;
  }
  return `/product/${encodeURIComponent(category)}`;
}

const NORMALIZED_PORTA_SLUG_TO_PRODUCT: Record<string, ProductId> = {
  'porta-cabin': 'porta-cabin',
  'steel-porta-cabin': 'porta-cabin',
  'small-portacabin': 'porta-cabin',
  'portacabin-office': 'office-cabin',
  'portable-shop-cabin': 'portable-cabin',
  // A shop cabin under /product/porta-cabins/ is a Porta Cabin. This entry
  // previously said 'portable-cabin', which rendered the wrong half of the
  // Porta Cabin / Portable Cabin pair on that route.
  'porta-cabin-shop': 'porta-cabin',
  'porta-cabin-office': 'office-cabin',
  'porta-cabin-with-toilet': 'toilet-cabin',
  'portable-cabin-with-toilet': 'toilet-cabin',
  'readymade-office-cabin': 'office-cabin',
  'portable-office-cabin': 'office-cabin',
  'portable-office': 'office-cabin',
  'portable-office-container': 'site-office',
};

/**
 * A route publishes its own ladder from its own product JSON: the subpage slug
 * where there is one, otherwise the category. Never a parent's or sibling's.
 */
function ladderKeyFor(category: string, slug?: string): string {
  return normalise(slug || category);
}

function normalise(value: string): string {
  return decodeURIComponent(value).toLowerCase().trim();
}

function resolveForPortaCabins(category: string, slug?: string): ProductId {
  const target = normalise(slug || category);

  // An explicit mapping always wins over substring guessing. Previously this
  // ran last, so `portable-shop-cabin` and friends never reached it.
  const mapped = slug ? NORMALIZED_PORTA_SLUG_TO_PRODUCT[normalise(slug)] : undefined;
  if (mapped) return mapped;

  if (target.includes('office')) return 'office-cabin';
  if (target.includes('security')) return 'security-cabin';
  if (target.includes('toilet')) return 'toilet-cabin';
  if (target.includes('accommodation') || target.includes('worker') || target.includes('staff')) return 'accommodation-cabin';

  // Anything under /product/porta-cabins/ IS a Porta Cabin. The old fall-through
  // returned 'portable-cabin' here, so seven Porta Cabin routes rendered the
  // locked name "Portable Cabin" — the highest-risk term pair on this site.
  return 'porta-cabin';
}

function resolveForLaborColony(category: string, slug?: string): ProductId {
  const target = normalise(slug || category);
  if (target.includes('accommodation-container')) return 'accommodation-cabin';
  if (target.includes('labor-shed') || target.includes('labour-shed') || target.includes('sheds')) return 'labor-sheds';
  if (target.includes('labor-hut') || target.includes('labor-hutment') || target.includes('hutment')) return 'labor-hutments';
  if (target.includes('prefab-labor-camp') || target.includes('prefab-labour-camp') || target.includes('prefab-camp')) return 'prefab-labor-camps';
  return 'labour-colony';
}

function resolveForContainerHouses(category: string, slug?: string): ProductId {
  const target = normalise(slug || category);
  if (target.includes('prefab-container-home')) return 'prefab-container-homes';
  if (target.includes('affordable-container-home')) return 'affordable-container-homes';
  if (target.includes('shipping-container-home')) return 'shipping-container-homes';
  if (target.includes('luxury-container-house')) return 'luxury-container-houses';
  return 'container-houses';
}

function resolveForContainerOffices(category: string, slug?: string): ProductId {
  const target = normalise(slug || category);
  if (target.includes('site-office') || target.includes('portable-office-container')) return 'site-office';
  if (target.includes('prefab-container-homes') || target.includes('prefab-container-home')) return 'prefab-container-homes';
  if (target.includes('affordable-container-home')) return 'affordable-container-homes';
  if (target.includes('shipping-container-home')) return 'shipping-container-homes';
  if (target.includes('luxury-container-house') || target.includes('luxury-container-houses')) return 'luxury-container-houses';
  if (target.includes('container-house') || target.includes('container-homes')) return 'container-houses';
  return 'container-office';
}


/**
 * THE CLASSIFICATION RULE — CALC-L7 §2.1, ruled 09 Aug 2026. ONE definition
 * site: the runtime resolver below and the G29 coverage gate both read it, so
 * the table a reviewer checks and the behaviour a customer meets cannot drift.
 *
 *   PREFILL     an enclosed structure the wizard can configure: floor area,
 *               walls, a door, and the capacity to carry electricals and
 *               fittings. Cabins, offices, bunkhouses, cafes, homes, toilets,
 *               sheds, PEB and pre-engineered buildings.
 *
 *   NO PREFILL  a component or material sold by area or by length, where "how
 *               many rooms" is not a question the buyer can answer. Panels,
 *               roofing and wall sheets. The wizard opens as the general cabin
 *               calculator, prints no figure attributed to that page's product,
 *               and carries no entry band naming it.
 *
 * Applied PER ROUTE, never per cluster: a cluster holds both kinds.
 *
 * TIE-BREAKER: when a slug names BOTH, the STRUCTURE governs. The material is
 * what the thing is made from; the structure is what is sold. `puf-panel-house`
 * is a house, `puf-panel` is a panel.
 *
 * "structure" is deliberately NOT a material word. A first cut included it and
 * put peb-steel-structure and three siblings in the no-prefill class. A
 * pre-engineered steel structure is an enclosed building, not a component.
 */
const MATERIAL_CLUSTERS = new Set([
  'eps-panel', 'glass-wool-panel', 'pir-panel', 'puf-panel', 'rockwool-panel',
  'sandwich-panel', 'wall-sheet', 'roofing-sheet',
]);
const UNVERIFIED_PRODUCT_ID_CLUSTERS = new Set([
  'industrial-sheds', 'peb-constructions', 'portable-toilet',
  'pre-engineered-buildings', 'prefab-buildings', 'prefabricated-houses',
]);
const STRUCTURE_WORDS = /(house|home|cabin|office|room|shed|building|toilet|colony|camp|hutment|bunk|warehouse|shop|cafe|store)/;
const MATERIAL_WORDS = /(panel|sheet|profile|coil|insulation)/;

export function classifyCalculatorRoute(category: string, slug?: string): { prefill: boolean; why: string } {
  const cluster = normalise(category);
  const key = normalise(slug || category);
  const inMaterialCluster = MATERIAL_CLUSTERS.has(cluster);
  const looksStructural = STRUCTURE_WORDS.test(key);
  const looksMaterial = MATERIAL_WORDS.test(key);

  // Ruling 09 Aug 2026: these six clusters, plus puf-panel-house below, have
  // no verified identity in the calculator's closed ProductId set. They still
  // mount the general calculator, but it attributes no figure to the page.
  if (UNVERIFIED_PRODUCT_ID_CLUSTERS.has(cluster)) {
    return { prefill: false, why: 'calculator product identity not yet verified' };
  }
  if (cluster === 'puf-panel' && key === 'puf-panel-house') {
    return { prefill: false, why: 'calculator product identity not yet verified' };
  }

  if (inMaterialCluster) {
    if (looksStructural && !looksMaterial) return { prefill: true, why: 'enclosed structure inside a material cluster' };
    if (looksStructural && looksMaterial) return { prefill: true, why: 'names both; the structure governs the material' };
    return { prefill: false, why: 'material sold by area or length' };
  }
  if (looksMaterial && !looksStructural) return { prefill: false, why: 'material named outside a material cluster' };
  return { prefill: true, why: 'enclosed structure the wizard can configure' };
}

export function resolveEmbeddedCalculatorProduct(
  category: CategorySlug,
  slug?: ProductSlug
): EmbeddedCalculatorProduct | null {
  const c = normalise(category);

  // `portable-cabin` (singular) is the live category slug and carries eleven
  // routes. The old test used the plural only, so none of them got a calculator.
  if (c === 'porta-cabins' || c === 'porta-cabin') {
    return {
      category,
      slug,
      prefill: true,
      productId: resolveForPortaCabins(category, slug),
      ladderKey: ladderKeyFor(category, slug),
    };
  }

  if (c === 'portable-cabin' || c === 'portable-cabins') {
    const mapped = slug ? NORMALIZED_PORTA_SLUG_TO_PRODUCT[normalise(slug)] : undefined;
    const target = normalise(slug || category);
    const productId: ProductId = mapped
      || (target.includes('office') ? 'office-cabin'
        : target.includes('security') ? 'security-cabin'
          : target.includes('toilet') ? 'toilet-cabin'
            : 'portable-cabin');
    return { category, slug,
      prefill: true, productId, ladderKey: ladderKeyFor(category, slug) };
  }

  if (c === 'portable-office') {
    // The slug map is consulted first. `portable-office-container` maps to
    // 'site-office'; the old unconditional 'office-cabin' short-circuited past
    // it, so that route locked to the wrong product name.
    const mapped = slug ? NORMALIZED_PORTA_SLUG_TO_PRODUCT[normalise(slug)] : undefined;
    return {
      category,
      slug,
      prefill: true,
      productId: mapped || 'office-cabin',
      ladderKey: ladderKeyFor(category, slug),
    };
  }

  // Ruled 03 Aug 2026: the hub /product/container-houses carries a calculator
  // on its own six-size ladder. Its subpages each lock to themselves and price
  // from their own ladder where they publish one; the rest render quote mode.
  // Only Container House is in the product list — the four sibling house
  // products are subpages and are excluded from it under the hubs-only rule.
  if (c === 'container-houses' || c === 'container-house') {
    return {
      category,
      slug,
      prefill: true,
      productId: resolveForContainerHouses(category, slug),
      ladderKey: ladderKeyFor(category, slug),
    };
  }

  if (c === 'container-offices') {
    return {
      category,
      slug,
      prefill: true,
      productId: resolveForContainerOffices(category, slug),
      ladderKey: ladderKeyFor(category, slug),
    };
  }

  // C-05 container cafe cluster — the hub plus its five subpages. SAMAN named
  // /product/container-cafe in CALC-L4 (09 Aug 2026).
  //
  // None of the six publishes a price ladder, so getRouteLadder() returns null
  // for every one of them and all six render the existing no-ladder
  // "Design your {product}" behaviour that already ships on fifteen routes.
  // That is deliberate: no rate is invented to make a route work, and with no
  // figure rendered there is nothing that can contradict the page's own ladder.
  // Each route still locks to its OWN ladderKey, so the day one of these pages
  // publishes a ladder it prices from that and never from a sibling's.
  //
  // The 'container-cafe' product id and its approved name already exist in
  // PRODUCTS; no new product copy is written here.
  if (c === 'container-cafe') {
    return {
      category,
      slug,
      prefill: true,
      productId: 'container-cafe',
      ladderKey: ladderKeyFor(category, slug),
    };
  }

  // Labour Colony was excluded on 03 Aug 2026 because five of the nine steps
  // were dead for a colony block. CALC-L7 SUPERSEDES that exclusion by SAMAN's
  // own instruction: the calculator goes on every product page.
  //
  // These four route through resolveForLaborColony rather than the generic
  // classifier below, because the wizard ALREADY prices colonies - isColonyProduct
  // and colonyLadder in cabinCalculatorSSR read a per-variant colony ladder. That
  // code was unreachable while this branch returned null.
  //
  // Routing them generically instead would have left them with no ProductId, and
  // verify-route-price-identity caught exactly that: all four pages publish real
  // prices (Rs 38,88,000 and up) while the calculator beside them rendered quote
  // mode, contradicting the page in the same direction the C-05 six did.
  if (c === 'labor-colony' || c === 'c06' || c === 'labour-colony') {
    return {
      category,
      slug,
      prefill: true,
      productId: resolveForLaborColony(category, slug),
      ladderKey: ladderKeyFor(category, slug),
    };
  }


  // Security Cabins has no published ladder, so it prices on drawing. That is a
  // reason for the calculator to render in quote mode, not a reason for the
  // route to be the only one of twelve with no calculator section at all - on a
  // site where the other eleven have one, its absence reads as an oversight.
  if (c === 'security-cabins' || c === 'security-cabin') {
    return { category, slug,
      prefill: true, productId: 'security-cabin', ladderKey: ladderKeyFor(category, slug) };
  }

  /**
   * CALC-L7 §2.1 — every remaining product route. Before this, the resolver
   * fell through to `return null` and 75 of 123 routes carried no calculator.
   *
   * NO NEW COPY IS WRITTEN HERE. A prefilled route renders the approved product
   * name the page already publishes, read by the caller from that route's own
   * record; a no-prefill route renders no product name at all. The old blocker
   * was that these routes have no ProductId — the answer is that a no-prefill
   * mount does not need one, and a prefilled mount reuses the page's own name.
   */
  const klass = classifyCalculatorRoute(category, slug);
  return {
    category,
    slug,
    prefill: klass.prefill,
    // Undefined on a no-prefill mount: the wizard opens general, exactly as at
    // /cabin-cost-calculator, and attributes nothing to this page's product.
    productId: undefined,
    ladderKey: klass.prefill ? ladderKeyFor(category, slug) : '',
  };
}
