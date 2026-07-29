import { buildMerchantProducts, MerchantProduct } from './merchantFeed';
import containerCafeCategory from '@/data/wp-export/categories/container-cafe.json';
import containerHousesCategory from '@/data/wp-export/categories/container-houses.json';
import containerOfficesCategory from '@/data/wp-export/categories/container-offices.json';
import epsPanelCategory from '@/data/wp-export/categories/eps-panel.json';
import glassWoolPanelCategory from '@/data/wp-export/categories/glass-wool-panel.json';
import industrialShedsCategory from '@/data/wp-export/categories/industrial-sheds.json';
// C06: the buyer-facing category archive is retired, but its stable id/slug still
// classify the four surviving labour-colony products for local availability.
import laborColonyCategory from '@/data/wp-export/redirected-categories/labor-colony.json';
import pebConstructionsCategory from '@/data/wp-export/categories/peb-constructions.json';
import pirPanelCategory from '@/data/wp-export/categories/pir-panel.json';
import portaCabinsCategory from '@/data/wp-export/categories/porta-cabins.json';
import portableCabinCategory from '@/data/wp-export/categories/portable-cabin.json';
import portableToiletCategory from '@/data/wp-export/categories/portable-toilet.json';
import preEngineeredBuildingsCategory from '@/data/wp-export/categories/pre-engineered-buildings.json';
import prefabBuildingsCategory from '@/data/wp-export/categories/prefab-buildings.json';
import prefabricatedHousesCategory from '@/data/wp-export/categories/prefabricated-houses.json';
import pufPanelCategory from '@/data/wp-export/categories/puf-panel.json';
import rockwoolPanelCategory from '@/data/wp-export/categories/rockwool-panel.json';
import roofingSheetsCategory from '@/data/wp-export/categories/roofing-sheets.json';
import securityCabinsCategory from '@/data/wp-export/categories/security-cabins.json';

type ProductLike = Parameters<typeof buildMerchantProducts>[0][number];

export const LOCAL_INVENTORY_HEADERS = ['id', 'store_code', 'availability', 'quantity', 'price'] as const;
export const LOCAL_INVENTORY_STORE_CODES = ['SA201617', '11523617060201819870'] as const;
export const LOCAL_INVENTORY_ALLOWED_AVAILABILITY = [
  'in_stock',
  'on_display_to_order',
] as const;

export type LocalInventoryStoreCode = (typeof LOCAL_INVENTORY_STORE_CODES)[number];
export type LocalInventoryAvailability = (typeof LOCAL_INVENTORY_ALLOWED_AVAILABILITY)[number];

export type LocalInventoryRow = {
  id: string;
  store_code: LocalInventoryStoreCode;
  availability: LocalInventoryAvailability;
  quantity: string;
  price: string;
};

type CategoryLike = {
  id?: number | string;
  name?: string;
  slug?: string;
  parent?: number | string;
  path?: string;
  parentPath?: string;
};

type ProductWithCategories = ProductLike & {
  categories?: CategoryLike[];
  category_slug?: string;
  category_name?: string;
};

type InventoryCategory = Required<Pick<CategoryLike, 'id' | 'name' | 'slug'>> & {
  parent: number | string;
};

const ALL_LOCAL_INVENTORY_CATEGORIES = [
  containerCafeCategory,
  containerHousesCategory,
  containerOfficesCategory,
  epsPanelCategory,
  glassWoolPanelCategory,
  industrialShedsCategory,
  laborColonyCategory,
  pebConstructionsCategory,
  pirPanelCategory,
  portaCabinsCategory,
  portableCabinCategory,
  portableToiletCategory,
  preEngineeredBuildingsCategory,
  prefabBuildingsCategory,
  prefabricatedHousesCategory,
  pufPanelCategory,
  rockwoolPanelCategory,
  roofingSheetsCategory,
  securityCabinsCategory,
] as InventoryCategory[];

export const DISPLAY_TO_ORDER_CATEGORY_ROOTS = [
  {
    id: pebConstructionsCategory.id,
    name: pebConstructionsCategory.name,
    slug: pebConstructionsCategory.slug,
    parent: pebConstructionsCategory.parent,
    parentPath: pebConstructionsCategory.slug,
    aliases: ['peb-constructions'],
  },
  {
    id: industrialShedsCategory.id,
    name: industrialShedsCategory.name,
    slug: industrialShedsCategory.slug,
    parent: industrialShedsCategory.parent,
    parentPath: industrialShedsCategory.slug,
    aliases: ['industrial-sheds'],
  },
  {
    id: preEngineeredBuildingsCategory.id,
    name: preEngineeredBuildingsCategory.name,
    slug: preEngineeredBuildingsCategory.slug,
    parent: preEngineeredBuildingsCategory.parent,
    parentPath: preEngineeredBuildingsCategory.slug,
    aliases: ['pre-engineered-buildings', 'pre-engineered-building'],
  },
  {
    id: laborColonyCategory.id,
    name: laborColonyCategory.name,
    slug: laborColonyCategory.slug,
    parent: laborColonyCategory.parent,
    parentPath: laborColonyCategory.slug,
    aliases: ['labor-colony', 'labour-colony'],
  },
  {
    id: prefabBuildingsCategory.id,
    name: prefabBuildingsCategory.name,
    slug: prefabBuildingsCategory.slug,
    parent: prefabBuildingsCategory.parent,
    parentPath: prefabBuildingsCategory.slug,
    aliases: ['prefab-buildings', 'prefab-building'],
  },
] as const;

const CATEGORY_BY_ID = new Map(
  ALL_LOCAL_INVENTORY_CATEGORIES.map((category) => [String(category.id), category])
);
const CATEGORY_BY_NORMALIZED_SLUG = new Map(
  ALL_LOCAL_INVENTORY_CATEGORIES.map((category) => [normalizeCategoryToken(category.slug), category])
);

const DISPLAY_TO_ORDER_ROOT_IDS = new Set(DISPLAY_TO_ORDER_CATEGORY_ROOTS.map((root) => String(root.id)));
const DISPLAY_TO_ORDER_ROOT_TOKENS = new Set(
  DISPLAY_TO_ORDER_CATEGORY_ROOTS.flatMap((root) => [
    normalizeCategoryToken(root.name),
    normalizeCategoryToken(root.slug),
    ...root.aliases.map(normalizeCategoryToken),
  ])
);
const DISPLAY_TO_ORDER_ROOT_PATHS = new Set(
  DISPLAY_TO_ORDER_CATEGORY_ROOTS.flatMap((root) => [
    normalizeCategoryPath(root.slug),
    normalizeCategoryPath(root.parentPath),
    ...root.aliases.map(normalizeCategoryPath),
  ])
);

export function normalizeCategoryToken(value: string | number | undefined | null): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeCategoryPath(value: string | number | undefined | null): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\\]+/g, '/')
    .replace(/[_\s]+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/-+/g, '-')
    .replace(/^\/|\/$/g, '');
}

function resolveKnownCategory(category: CategoryLike): CategoryLike {
  const byId = category.id !== undefined ? CATEGORY_BY_ID.get(String(category.id)) : undefined;
  if (byId) return { ...byId, ...category };

  const slugToken = normalizeCategoryToken(category.slug);
  const bySlug = slugToken ? CATEGORY_BY_NORMALIZED_SLUG.get(slugToken) : undefined;
  return bySlug ? { ...bySlug, ...category } : category;
}

function categoryMatchesDisplayToOrderRoot(category: CategoryLike): boolean {
  const categoryId = category.id !== undefined ? String(category.id) : '';
  if (categoryId && DISPLAY_TO_ORDER_ROOT_IDS.has(categoryId)) return true;

  const tokens = [
    normalizeCategoryToken(category.slug),
    normalizeCategoryToken(category.name),
    normalizeCategoryToken(category.parentPath),
  ].filter(Boolean);

  if (tokens.some((token) => DISPLAY_TO_ORDER_ROOT_TOKENS.has(token))) return true;

  const paths = [
    normalizeCategoryPath(category.path),
    normalizeCategoryPath(category.parentPath),
  ].filter(Boolean);

  return paths.some((path) =>
    Array.from(DISPLAY_TO_ORDER_ROOT_PATHS).some((rootPath) => path === rootPath || path.startsWith(`${rootPath}/`))
  );
}

function categoryOrAncestorMatchesDisplayToOrderRoot(category: CategoryLike): boolean {
  const seen = new Set<string>();
  let current: CategoryLike | undefined = resolveKnownCategory(category);

  while (current) {
    if (categoryMatchesDisplayToOrderRoot(current)) return true;

    const parent = current.parent;
    if (parent === undefined || parent === null || String(parent) === '0') return false;

    const parentKey = String(parent);
    if (seen.has(parentKey)) return false;
    seen.add(parentKey);

    current = CATEGORY_BY_ID.get(parentKey);
  }

  return false;
}

export function belongsToDisplayToOrderCategoryTree(product: ProductWithCategories): boolean {
  const assignedCategories: CategoryLike[] = [...(product.categories || [])];
  if (product.category_slug || product.category_name) {
    assignedCategories.push({
      slug: product.category_slug,
      name: product.category_name,
    });
  }

  return assignedCategories.some(categoryOrAncestorMatchesDisplayToOrderRoot);
}

export function getGoogleLocalInventoryAvailability(product: ProductWithCategories): LocalInventoryAvailability {
  return belongsToDisplayToOrderCategoryTree(product) ? 'on_display_to_order' : 'in_stock';
}

function tsvEscape(value: string | number): string {
  return String(value)
    .replace(/\t/g, ' ')
    .replace(/\r?\n/g, ' ')
    .trim();
}

// Feed-only items that have no WooCommerce product behind them — currently the
// nine porta-cabin size variants built by buildPortaCabinVariantItems. The caller
// passes the same array it hands the Merchant feed, so both feeds stay in sync
// off one source (src/data/products/porta-cabins.json).
export type LocalInventoryExtraItem = Pick<MerchantProduct, 'id' | 'price'> &
  Partial<Pick<MerchantProduct, 'item_group_id'>>;

export function buildLocalInventoryRows(
  products: ProductLike[],
  extraItems: LocalInventoryExtraItem[] = []
): LocalInventoryRow[] {
  const { items } = buildMerchantProducts(products);
  const productById = new Map(products.map((product) => [String(product.id || ''), product]));
  const rows: LocalInventoryRow[] = [];
  const seenIds = new Set<string>();

  const pushStoreRows = (id: string, price: string, availability: LocalInventoryAvailability) => {
    if (!id || seenIds.has(id)) return;
    seenIds.add(id);

    for (const store_code of LOCAL_INVENTORY_STORE_CODES) {
      rows.push({
        id,
        store_code,
        availability,
        quantity: '',
        price,
      });
    }
  };

  for (const item of items) {
    const sourceProduct = productById.get(item.id);
    pushStoreRows(item.id, item.price, getGoogleLocalInventoryAvailability(sourceProduct || {}));
  }

  // Variant items carry no category array, so classify them from the category
  // their group id maps to. They then follow the same availability rule as every
  // catalogue product instead of a hardcoded value.
  for (const item of extraItems) {
    pushStoreRows(
      item.id,
      item.price,
      getGoogleLocalInventoryAvailability({ category_slug: item.item_group_id })
    );
  }

  return rows;
}

export function generateGoogleLocalInventoryTsv(
  products: ProductLike[],
  extraItems: LocalInventoryExtraItem[] = []
): string {
  const lines = [
    LOCAL_INVENTORY_HEADERS.join('\t'),
    ...buildLocalInventoryRows(products, extraItems).map((row) =>
      LOCAL_INVENTORY_HEADERS.map((header) => tsvEscape(row[header])).join('\t')
    ),
  ];

  return `${lines.join('\n')}\n`;
}
