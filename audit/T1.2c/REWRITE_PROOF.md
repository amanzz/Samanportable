# T1.2c Rewrite Proof

## Summary

- Changed source files checked: 290
- Static hrefs rewritten: 429
- Byte-transform check: PASS (0 failures)
- Remaining mapped static `/product-category/*` hrefs in changed source files: 0

## Rewritten Slug Distribution

| Slug | Count |
| --- | --- |
| container-cafe | 11 |
| container-houses | 9 |
| container-offices | 79 |
| industrial-sheds | 9 |
| labor-colony | 35 |
| peb-constructions | 5 |
| porta-cabins | 122 |
| portable-cabin | 101 |
| portable-office | 35 |
| portable-toilet | 3 |
| pre-engineered-buildings | 1 |
| prefab-buildings | 5 |
| prefabricated-houses | 11 |
| puf-panel | 1 |
| sandwich-panel | 2 |

## 10-File Byte-Diff Sample

Each sampled file passes the all-file byte-transform check: applying only the mapped href path replacement to HEAD reproduces the working-tree file byte-for-byte.

| File | Changed hrefs | Path token changes | Anchor/surrounding bytes |
| --- | --- | --- | --- |
| src/data/wp-export/posts/10-foot-shipping-container-office-perfect-fit-for-small-spaces.json | 4 | /product-category/container-offices -> /product/container-offices | PASS |
| src/data/wp-export/posts/18-benefits-of-luxury-portable-cabin.json | 2 | /product-category/container-houses -> /product/container-houses; /product-category/portable-cabin -> /product/portable-cabin | PASS |
| src/data/wp-export/posts/container-cafes-in-central-delhi.json | 1 | /product-category/container-cafe -> /product/container-cafe | PASS |
| src/data/wp-export/posts/labour-colonies-in-central-delhi.json | 3 | /product-category/labor-colony -> /product/labor-colony | PASS |
| src/data/wp-export/posts/portable-cabin-price-in-bangalore.json | 6 | /product-category/container-houses -> /product/container-houses; /product-category/portable-cabin -> /product/portable-cabin | PASS |
| src/data/wp-export/posts/portacabins-for-sale-in-frazer-town-2.json | 6 | /product-category/porta-cabins -> /product/porta-cabins; /product-category/portable-office -> /product/portable-office; /product-category/prefabricated-houses -> /product/prefabricated-houses; /product-category/portable-cabin -> /product/portable-cabin | PASS |
| src/data/wp-export/posts/portable-toilets-in-bangalore.json | 3 | /product-category/portable-toilet -> /product/portable-toilet | PASS |
| src/components/product-puf/ProductInfoBox.tsx | 1 | /product-category/puf-panel -> /product/puf-panel | PASS |
| src/components/product-sandwich/SandwichInfoBox.tsx | 2 | /product-category/sandwich-panel -> /product/sandwich-panel | PASS |
| src/pages/product/roofing-sheet/metal-roofing-sheet.tsx | 1 | /product-category/industrial-sheds -> /product/industrial-sheds | PASS |

## Grep Proof

- Static mapped old hrefs remaining in the 290 changed source files: 0

_None._

## Dynamic Cases Left Untouched

| File | Line | Template href still present | File changed by Part B |
| --- | --- | --- | --- |
| src/pages/product/[category]/[slug].tsx | 662 | yes | no |
| src/pages/product/[category]/index.tsx | 747 | yes | no |

## 5-Page Rendered DOM Diff Sample

Post body DOM was compared before/after with href values normalized, plus visible text stripped from HTML. All sampled visible content and surrounding markup are identical apart from href destinations.

| Page | Changed hrefs | Visible text unchanged | DOM with hrefs normalized |
| --- | --- | --- | --- |
| /20ft-container-office | 1 | PASS | PASS |
| /container-cafes-in-central-delhi | 1 | PASS | PASS |
| /labour-colonies-in-central-delhi | 3 | PASS | PASS |
| /portable-cabin-price-in-bangalore | 6 | PASS | PASS |
| /portable-toilets-in-bangalore | 3 | PASS | PASS |

## Build Validation

- `npm run type-check`: exit 0 (`tsc --noEmit`).
- `.\node_modules\.bin\next.cmd build`: exit 0. Warnings only: existing React hook lint warnings in `src/pages/portable-cabin-price-calculator.tsx` and Browserslist/caniuse freshness notices.
