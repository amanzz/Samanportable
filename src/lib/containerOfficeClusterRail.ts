const CONTAINER_OFFICE_HUB_SLUG = 'container-offices';
const CONTAINER_MARKETING_OFFICE_SLUG = 'container-marketing-office';

const CONTAINER_OFFICE_KEEP_SLUGS: readonly string[] = [
  'container-office-cabin',
  'shipping-container-office',
  'site-office-container',
  'flat-pack-container-office',
  'multi-story-container-office',
  'containerized-data-center',
  'bess-container',
  'container-marketing-office',
];

type Slugged = { slug?: string };
type RailItem = import('./c16PanelCatalog').RelatedRailItem;

export const CONTAINER_OFFICE_TILE_TITLES: Readonly<Record<string, string>> = {
  'shipping-container-office': 'Shipping Container Office',
};

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
 * The hub lists every active cluster child; each child lists the hub plus its
 * active siblings.
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
  if (process.env.NODE_ENV !== 'production') {
    const missing = order.filter((slug) => !bySlug.has(slug));
    if (missing.length) {
      console.warn(`[containerOfficeClusterRail] no product record for: ${missing.join(', ')}`);
    }
  }
  return order
    .map((slug) => {
      const product = bySlug.get(slug);
      const title = CONTAINER_OFFICE_TILE_TITLES[slug];
      if (!product || !title || !('name' in product)) {
        return product;
      }
      return { ...product, name: title } as T;
    })
    .filter((product): product is T => product !== undefined);
}

export function orderContainerOfficeYmal<T extends Slugged>(currentSlug: string, products: readonly T[]): T[] {
  const order = CONTAINER_OFFICE_YMAL_ORDER.filter((slug) => slug !== currentSlug);
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  if (process.env.NODE_ENV !== 'production') {
    const missing = order.filter((slug) => !bySlug.has(slug));
    if (missing.length) {
      console.warn(`[containerOfficeClusterRail] no product record for: ${missing.join(', ')}`);
    }
  }
  return order
    .map((slug) => bySlug.get(slug))
    .filter((product): product is T => product !== undefined);
}

export function containerOfficeYmalItems(currentSlug: string, items: readonly RailItem[]): RailItem[] {
  const blurbs: Record<string, string> = {
    'container-offices': 'Compare standard container office configurations',
    'container-office-cabin': 'Panel-built office cabin for fixed site use',
    'site-office-container': 'Purpose-built site office container for project teams',
    'shipping-container-office': 'Built inside a corrugated ISO freight shell',
    'flat-pack-container-office': 'Ships as panels and bolts together on site',
    'multi-story-container-office': 'Stacked office block with external stair access',
    'containerized-data-center': 'Enclosure shell for IT racks, power and cooling',
    'bess-container': 'Enclosure shell for battery energy storage',
    'container-marketing-office': 'Customer-facing sales and display office',
  };
  return orderContainerOfficeYmal(currentSlug, items.map((item) => ({
    ...item,
    slug: item.href.split('/').filter(Boolean).pop(),
  }))).map(({ slug, ...item }) => ({
    ...item,
    ...(slug && CONTAINER_OFFICE_TILE_TITLES[slug] ? { title: CONTAINER_OFFICE_TILE_TITLES[slug] } : {}),
    category: 'Container Offices',
    ...(slug && blurbs[slug] ? { blurb: blurbs[slug] } : {}),
  }));
}
