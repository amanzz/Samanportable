const CONTAINER_OFFICE_HUB_SLUG = 'container-offices';
const CONTAINER_MARKETING_OFFICE_SLUG = 'container-marketing-office';

const CONTAINER_OFFICE_KEEP_SLUGS: readonly string[] = [
  'container-office-cabin',
  'shipping-container-office',
  'site-office-container',
];

type Slugged = { slug?: string };
type RailItem = import('./c16PanelCatalog').RelatedRailItem;

const CONTAINER_OFFICE_YMAL_ORDER: readonly string[] = [
  'container-offices',
  'container-office-cabin',
  'site-office-container',
  'bess-container',
  'containerized-data-center',
  'container-marketing-office',
  'multi-story-container-office',
  'flat-pack-container-office',
  'expandable-container-office',
  'shipping-container-office',
];

/**
 * C-04's ruled rail order: the hub has three keep-list children; each child has
 * the hub plus its two siblings.
 */
export function orderContainerOfficeRail<T extends Slugged>(currentSlug: string, products: readonly T[]): T[] {
  const order =
    currentSlug === CONTAINER_OFFICE_HUB_SLUG || currentSlug === CONTAINER_MARKETING_OFFICE_SLUG
      ? CONTAINER_OFFICE_KEEP_SLUGS
      : [
          CONTAINER_OFFICE_HUB_SLUG,
          ...CONTAINER_OFFICE_KEEP_SLUGS.filter((slug) => slug !== currentSlug),
        ];
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  return order.map((slug) => bySlug.get(slug)).filter((product): product is T => product !== undefined);
}

export function orderContainerOfficeYmal<T extends Slugged>(currentSlug: string, products: readonly T[]): T[] {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  return CONTAINER_OFFICE_YMAL_ORDER
    .filter((slug) => slug !== currentSlug)
    .map((slug) => bySlug.get(slug))
    .filter((product): product is T => product !== undefined);
}

export function containerOfficeYmalItems(currentSlug: string, items: readonly RailItem[]): RailItem[] {
  const blurbs: Record<string, string> = {
    'container-offices': 'Compare standard container office configurations',
    'container-office-cabin': 'Panel-built office cabin for fixed site use',
    'site-office-container': 'Purpose-built site office container for project teams',
  };
  return orderContainerOfficeYmal(currentSlug, items.map((item) => ({
    ...item,
    slug: item.href.split('/').filter(Boolean).pop(),
  }))).map(({ slug, ...item }) => ({
    ...item,
    category: 'Container Offices',
    ...(slug && blurbs[slug] ? { blurb: blurbs[slug] } : {}),
  }));
}
