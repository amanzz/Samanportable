# Google Local Inventory Feed Validation - 2026-07-09

## Summary
- Public route: /feeds/google-local-inventory.tsv
- Scheduled fetch URL after deployment: https://www.samanportable.com/feeds/google-local-inventory.tsv
- Primary Merchant feed products: 163
- Local inventory rows: 326
- Store rows per product: 2
- Store codes: SA201617, 11523617060201819870
- Default availability: on_display_to_order
- Quantity policy: blank for on_display_to_order
- Price source: same normalized item price as primary Merchant feed
- Supplemental source safety: Source ID 10673171443 is not used for this local inventory feed

## Generated Files
- reports/google-local-inventory.tsv
- reports/google-local-inventory-validation-2026-07-09.md

## Validation
- 0 validation errors

## Warnings
- Skipped 2 published product(s) because the primary Merchant feed excludes them: 990018 (tax_exclusive_price_not_merchant_safe); 900010 (missing_visible_price)

## Stop Point
No deployment, Merchant Center upload, Google API call, WooCommerce setting change, or Source ID 10673171443 change was performed.
