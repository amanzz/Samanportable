# Google Local Inventory Feed Setup Instructions

## Feed URL
- Public route after deployment: `/feeds/google-local-inventory.tsv`
- Scheduled fetch URL: `https://www.samanportable.com/feeds/google-local-inventory.tsv`
- Feed format: TSV
- Headers: `id`, `store_code`, `availability`, `quantity`, `price`

## Merchant Center Safety
- This feed is separate from Source ID `10673171443`.
- Do not delete, rename, repurpose, or modify Source ID `10673171443`.
- Source ID `10673171443` must remain only for optimized titles, descriptions, product types, and custom labels.
- Merchant Center should create a new `Local product inventory` data source for this feed.
- Do not use a supplemental product data source for local inventory.
- Do not manually edit stock in Merchant Center after this feed is connected.

## Store Codes
- Bangalore: `SA201617`
- Greater Noida: `11523617060201819870`

Before using the two-store feed, confirm the Greater Noida store code is active, verified, and linked in Merchant Center.

## Inventory Policy
- All products default to `on_display_to_order`.
- Quantity is blank for `on_display_to_order`.
- Do not invent quantity.
- Use `in_stock` and quantity only when SAMAN confirms real ready stock.
- Prices come from the same normalized source as the primary Google Merchant product feed.
- Prices are formatted as INR, for example `285000.00 INR`.

## WooCommerce Sync Check
- WooCommerce Google Listings & Ads sync must be manually checked before final Merchant Center setup.
- Confirm whether WooCommerce controls product data, price, stock, or local inventory in Merchant Center.
- Avoid manual Merchant Center stock edits if WooCommerce/plugin sync is active.

## Local Validation
Run:

```bash
npm run validate:local-inventory
```

Expected generated review files:
- `reports/google-local-inventory.tsv`
- `reports/google-local-inventory-validation-YYYY-MM-DD.md`

## Stop Point
Creating the route and validation files does not deploy the feed or connect Merchant Center. Deployment and Merchant Center setup require separate approval.
