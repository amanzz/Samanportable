import type { ProductId } from './cabinCalculatorSSR';

type CategorySlug = string;
type ProductSlug = string;

export interface EmbeddedCalculatorProduct {
  category: string;
  slug?: string;
  productId: ProductId;
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
  'porta-cabin-shop': 'portable-cabin',
  'porta-cabin-office': 'office-cabin',
  'porta-cabin-with-toilet': 'toilet-cabin',
  'portable-cabin-with-toilet': 'toilet-cabin',
  'readymade-office-cabin': 'office-cabin',
  'portable-office-cabin': 'office-cabin',
  'portable-office': 'office-cabin',
  'portable-office-container': 'site-office',
};

function normalise(value: string): string {
  return decodeURIComponent(value).toLowerCase().trim();
}

function resolveForPortaCabins(category: string, slug?: string): ProductId {
  const target = normalise(slug || category);
  if (target.includes('office')) return 'office-cabin';
  if (target.includes('security')) return 'security-cabin';
  if (target.includes('toilet')) return 'toilet-cabin';
  if (target.includes('accommodation') || target.includes('worker') || target.includes('staff')) return 'accommodation-cabin';
  if (slug) {
    const mapped = NORMALIZED_PORTA_SLUG_TO_PRODUCT[slug];
    if (mapped) return mapped;
  }
  return 'portable-cabin';
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

  if (c === 'porta-cabins' || c === 'porta-cabin' || c === 'portable-cabins') {
    return {
      category,
      slug,
      productId: resolveForPortaCabins(category, slug),
    };
  }

  if (c === 'portable-office') {
    return {
      category,
      slug,
      productId: 'office-cabin',
    };
  }

  if (c === 'container-offices') {
    return {
      category,
      slug,
      productId: resolveForContainerOffices(category, slug),
    };
  }

  if (c === 'labor-colony' || c === 'c06' || c === 'labour-colony') {
    return {
      category,
      slug,
      productId: resolveForLaborColony(category, slug),
    };
  }

  return null;
}
