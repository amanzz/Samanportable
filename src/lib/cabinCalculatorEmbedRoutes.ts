import type { ProductId } from './cabinCalculatorSSR';

type CategorySlug = string;
type ProductSlug = string;

export interface EmbeddedCalculatorProduct {
  category: string;
  slug?: string;
  productId: ProductId;
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
  if (target.includes('labor-shed') || target.includes('labour-shed') || target.includes('sheds')) return 'labor-sheds';
  if (target.includes('labor-hut') || target.includes('labor-hutment') || target.includes('hutment')) return 'labor-hutments';
  if (target.includes('prefab-labor-camp') || target.includes('prefab-labour-camp') || target.includes('prefab-camp')) return 'prefab-labor-camps';
  return 'labour-colony';
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
    return { category, slug, productId, ladderKey: ladderKeyFor(category, slug) };
  }

  if (c === 'portable-office') {
    // The slug map is consulted first. `portable-office-container` maps to
    // 'site-office'; the old unconditional 'office-cabin' short-circuited past
    // it, so that route locked to the wrong product name.
    const mapped = slug ? NORMALIZED_PORTA_SLUG_TO_PRODUCT[normalise(slug)] : undefined;
    return {
      category,
      slug,
      productId: mapped || 'office-cabin',
      ladderKey: ladderKeyFor(category, slug),
    };
  }

  if (c === 'container-offices') {
    return {
      category,
      slug,
      productId: resolveForContainerOffices(category, slug),
      ladderKey: ladderKeyFor(category, slug),
    };
  }

  if (c === 'labor-colony' || c === 'c06' || c === 'labour-colony') {
    return {
      category,
      slug,
      productId: resolveForLaborColony(category, slug),
      ladderKey: ladderKeyFor(category, slug),
    };
  }

  return null;
}
