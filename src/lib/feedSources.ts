// T26 — the SINGLE source of variant feed items for every feed surface.
//
// Four routes publish these items:
//   /api/google-merchant-feed          + /google-merchant-feed.xml   (primary)
//   /api/google-inventory-feed         + /feeds/google-local-inventory.tsv (local inventory)
//
// Before T26 each route assembled its own item list, and the two local-inventory
// surfaces drifted apart: the .tsv page passed the variant items while the API route
// did not, so the API silently omitted 9 items (18 rows). Routing all four through
// this one function makes parity structural rather than a convention someone has to
// remember.
//
// SERVER-SIDE ONLY (reads from disk via staticContent).
import { getPortaCabinVariantData, getSubpageVariantData } from '@/lib/staticContent';
import {
  buildAllVariantItems,
  buildC08VariantItems,
  C08_VARIANT_CONFIGS,
  SUBPAGE_VARIANT_CONFIGS,
  MERCHANT_BASE_URL,
  type MerchantProduct,
} from '@/lib/merchantFeed';

/** Flagship's nine variant items + nine for each of the eleven T25 subpages. */
export function getAllVariantFeedItems(baseUrl = MERCHANT_BASE_URL): MerchantProduct[] {
  const items = buildAllVariantItems(
    getPortaCabinVariantData(),
    getSubpageVariantData(SUBPAGE_VARIANT_CONFIGS.map((c) => c.slug)),
    baseUrl
  );
  const c08Data = getSubpageVariantData(C08_VARIANT_CONFIGS.map((c) => c.slug));
  for (const config of C08_VARIANT_CONFIGS) {
    items.push(...buildC08VariantItems(config, c08Data[config.slug], baseUrl));
  }
  return items;
}
