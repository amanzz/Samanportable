import { buildMerchantProducts } from './merchantFeed';

type ProductLike = Parameters<typeof buildMerchantProducts>[0][number];

export const LOCAL_INVENTORY_HEADERS = ['id', 'store_code', 'availability', 'quantity', 'price'] as const;
export const LOCAL_INVENTORY_STORE_CODES = ['SA201617', '11523617060201819870'] as const;
export const LOCAL_INVENTORY_DEFAULT_AVAILABILITY = 'on_display_to_order';
export const LOCAL_INVENTORY_ALLOWED_AVAILABILITY = [
  'in_stock',
  'limited_availability',
  'on_display_to_order',
  'out_of_stock',
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

function tsvEscape(value: string | number): string {
  return String(value)
    .replace(/\t/g, ' ')
    .replace(/\r?\n/g, ' ')
    .trim();
}

export function buildLocalInventoryRows(products: ProductLike[]): LocalInventoryRow[] {
  const { items } = buildMerchantProducts(products);
  const rows: LocalInventoryRow[] = [];

  for (const item of items) {
    for (const store_code of LOCAL_INVENTORY_STORE_CODES) {
      rows.push({
        id: item.id,
        store_code,
        availability: LOCAL_INVENTORY_DEFAULT_AVAILABILITY,
        quantity: '',
        price: item.price,
      });
    }
  }

  return rows;
}

export function generateGoogleLocalInventoryTsv(products: ProductLike[]): string {
  const lines = [
    LOCAL_INVENTORY_HEADERS.join('\t'),
    ...buildLocalInventoryRows(products).map((row) =>
      LOCAL_INVENTORY_HEADERS.map((header) => tsvEscape(row[header])).join('\t')
    ),
  ];

  return `${lines.join('\n')}\n`;
}
