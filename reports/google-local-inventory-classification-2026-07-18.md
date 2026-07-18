# Google Local Inventory Classification - 2026-07-18

## Files Changed
- src/lib/localInventoryFeed.ts
- scripts/validate-local-inventory-feed.js
- reports/google-local-inventory.tsv
- reports/google-local-inventory-validation-2026-07-18.md
- reports/google-local-inventory-classification-2026-07-18.md

## Previous Logic
The existing generator used one default local inventory availability for every product: `on_display_to_order`.

## Verified Display-to-Order Roots
| id | name | slug | parentPath |
| --- |--- |--- |--- |
| 321 |PEB Constructions |peb-constructions |peb-constructions |
| 300 |Industrial Sheds |industrial-sheds |industrial-sheds |
| 312 |Pre-Engineered Buildings |pre-engineered-buildings |pre-engineered-buildings |
| 289 |Labor Colony |labor-colony |labor-colony |
| 267 |Prefab Buildings |prefab-buildings |prefab-buildings |

## Counts
- Products classified as on_display_to_order: 49
- Products classified as in_stock: 128
- Feed rows: 354
- Unique feed products: 177
- Availability values present: in_stock, on_display_to_order

## on_display_to_order Sample
| id | name | category | ancestry | availability |
| --- |--- |--- |--- |--- |
| 230186 |Prefabricated Industrial Shed |300:industrial-sheds:Industrial Sheds |300:industrial-sheds:Industrial Sheds |on_display_to_order |
| 230172 |Prefab Steel House |300:industrial-sheds:Industrial Sheds |300:industrial-sheds:Industrial Sheds |on_display_to_order |
| 230162 |Prefabricated Warehouse |300:industrial-sheds:Industrial Sheds |300:industrial-sheds:Industrial Sheds |on_display_to_order |
| 230152 |Steel Garden & Outdoor Storage Sheds |300:industrial-sheds:Industrial Sheds |300:industrial-sheds:Industrial Sheds |on_display_to_order |
| 230114 |Portable Sheds |300:industrial-sheds:Industrial Sheds |300:industrial-sheds:Industrial Sheds |on_display_to_order |
| 229932 |Steel Sheds |300:industrial-sheds:Industrial Sheds |300:industrial-sheds:Industrial Sheds |on_display_to_order |
| 229930 |Storage Sheds |300:industrial-sheds:Industrial Sheds |300:industrial-sheds:Industrial Sheds |on_display_to_order |
| 229928 |Commercial Sheds |300:industrial-sheds:Industrial Sheds |300:industrial-sheds:Industrial Sheds |on_display_to_order |
| 229916 |Industrial Sheds |300:industrial-sheds:Industrial Sheds |300:industrial-sheds:Industrial Sheds |on_display_to_order |
| 229689 |Pre-Engineered Building Manufacturer |312:pre-engineered-buildings:Pre-Engineered Buildings |312:pre-engineered-buildings:Pre-Engineered Buildings |on_display_to_order |

## in_stock Sample
| id | name | category | ancestry | availability |
| --- |--- |--- |--- |--- |
| 272776 |Wall Sheet |3951:wall-sheets:Wall Sheets |3951:wall-sheets:Wall Sheets |in_stock |
| 272774 |Polycarbonate Roofing Sheet |3950:roofing-sheets:Roofing Sheets |3950:roofing-sheets:Roofing Sheets |in_stock |
| 990021 |Glass Wool Panel |990119:glass-wool-panel:Glass Wool Panels |990119:glass-wool-panel:Glass Wool Panels |in_stock |
| 272772 |Roofing Sheet |3950:roofing-sheets:Roofing Sheets |3950:roofing-sheets:Roofing Sheets |in_stock |
| 990020 |EPS Panel |990118:eps-panel:EPS Panels |990118:eps-panel:EPS Panels |in_stock |
| 990017 |Rockwool Panel |990117:rockwool-panel:Rockwool Panels |990117:rockwool-panel:Rockwool Panels |in_stock |
| 990008 |Cold Storage PUF Panel |990101:puf-panel:PUF Panels |990101:puf-panel:PUF Panels |in_stock |
| 990016 |PIR Panel |990116:pir-panel:PIR Panels |990116:pir-panel:PIR Panels |in_stock |
| 990005 |PUF Panel House |990101:puf-panel:PUF Panels |990101:puf-panel:PUF Panels |in_stock |
| 990007 |PUF Panel Specification |990101:puf-panel:PUF Panels |990101:puf-panel:PUF Panels |in_stock |

## Test Coverage
- PASS: direct PEB Constructions -> on_display_to_order
- PASS: child of PEB Constructions -> on_display_to_order
- PASS: deep descendant of PEB Constructions by path -> on_display_to_order
- PASS: direct Industrial Sheds -> on_display_to_order
- PASS: nested Industrial Sheds -> on_display_to_order
- PASS: direct Pre-Engineered Buildings -> on_display_to_order
- PASS: nested Pre-Engineered Buildings -> on_display_to_order
- PASS: direct Labor Colony -> on_display_to_order
- PASS: nested Labor Colony -> on_display_to_order
- PASS: direct Prefab Buildings -> on_display_to_order
- PASS: nested Prefab Buildings -> on_display_to_order
- PASS: Portable Cabin outside roots -> in_stock
- PASS: Portable Toilet outside roots -> in_stock
- PASS: Security Cabin outside roots -> in_stock
- PASS: Container Office outside roots -> in_stock
- PASS: Normal + approved category -> on_display_to_order
- PASS: title says building outside roots -> in_stock
- PASS: description says industrial shed outside roots -> in_stock
- PASS: capitalization and separator differences -> on_display_to_order

## Confirmations
- Every feed product has exactly one valid availability value.
- No third availability value exists.
- Only `on_display_to_order` and `in_stock` appear in the feed.
- Product IDs, store codes, prices, and quantity fields are validated against the primary Merchant feed output.
- Products outside the five verified category trees default to `in_stock`.
- Descendant coverage is implemented through category parent ancestry and verified root path matching.
- Products with missing category data are reported as warnings and remain `in_stock`.
