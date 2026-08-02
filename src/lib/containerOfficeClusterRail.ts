const CONTAINER_OFFICE_HUB_SLUG = 'container-offices';

const CONTAINER_OFFICE_KEEP_SLUGS: readonly string[] = [
  'container-office-cabin',
  'shipping-container-office',
  'site-office-container',
];

type Slugged = { slug?: string };

/**
 * C-04's ruled rail order: the hub has three keep-list children; each child has
 * the hub plus its two siblings.
 */
export function orderContainerOfficeRail<T extends Slugged>(currentSlug: string, products: readonly T[]): T[] {
  const order = currentSlug === CONTAINER_OFFICE_HUB_SLUG
    ? CONTAINER_OFFICE_KEEP_SLUGS
    : [
        CONTAINER_OFFICE_HUB_SLUG,
        ...CONTAINER_OFFICE_KEEP_SLUGS.filter((slug) => slug !== currentSlug),
      ];
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  return order.map((slug) => bySlug.get(slug)).filter((product): product is T => product !== undefined);
}
