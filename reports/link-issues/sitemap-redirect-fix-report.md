# Sitemap Redirect Fix Report

Date: 2026-07-10

## Summary

- Input CSV: `reports/link-issues/www.samanportable.com_wrong_pages_found_in_sitemap_20260710.csv`
- CSV rows reviewed: 91
- Unique redirecting sitemap URLs reviewed: 91
- Final generated sitemap URLs on the original fix branch: 461
- Final generated sitemap URLs on current production branch `static-migration`: 491
- Redirect URLs from the CSV remaining in sitemap: 0
- Duplicate sitemap URLs: 0
- Duplicate trailing-slash variants: 0
- Malformed/non-www/non-HTTPS sitemap URLs: 0
- Routes repaired: 0
- Unresolved URLs: 0

## Root Cause

The affected URLs came from the static WordPress/WooCommerce export used by `next-sitemap.config.js`. Those source exports still contain legacy post slugs and hub-product URLs that the application intentionally redirects. The checked-in sitemap had not been regenerated cleanly after the redirect-aware filtering rules were in place, and `next-sitemap` was also auto-discovering non-page utility routes.

## Fix Applied

- Kept the existing redirect-aware sitemap source behavior in `next-sitemap.config.js`:
  - Reads literal redirect sources from `redirects-from-csv.js`.
  - Reads manual redirects from `next.config.js`.
  - Filters `/product/{slug}/{slug}` duplicate product URLs structurally.
  - Emits hub products as `/product/{slug}` instead of `/product/{slug}/{slug}`.
- Added sitemap exclusions for non-indexable/non-page outputs:
  - `/google-merchant-feed.xml`
  - `/feeds/*`
  - `/estimate-print`
- Regenerated `public/sitemap.xml` through `next-sitemap`.

## Replacement And Removal Counts

- Product duplicate entries normalized/replaced with the shorter canonical product URL: 14
- Redirect-source entries removed because their final destinations are already present in the sitemap: 77
- New destination entries added: 0
- Routes repaired: 0

All 91 final destinations already resolve to generated sitemap URLs, so the redirected source URLs were removed without creating duplicate destination entries.

## Before And After

- Issue report baseline: 91 redirected URLs were reported in sitemap.
- Repository sitemap at the start of this run: 4 of those 91 were still present after prior local filtering work.
- Final generated sitemap on the original fix branch: 461 URLs, 0 of the 91 redirect-source URLs, 0 duplicates.
- Final generated sitemap on current production branch `static-migration`: 491 URLs, 0 of the 91 redirect-source URLs, 0 duplicates.
- Production branch note: `static-migration` already contains 30 newer indexable pages beyond the original fix branch, including panel product/category pages and newer city pages. These were not redirect sources and were retained.

## Verification

- `npm run type-check`: passed.
- `npm run lint`: passed with existing warnings in `src/pages/portable-cabin-price-calculator.tsx` for React hook dependencies.
- `npm run build`: passed. `postbuild` ran `next-sitemap` successfully.
- `next-sitemap` output:
  - Original fix branch collected 154 product URLs and 348 post URLs from static export.
  - Current production branch collected 167 product URLs and 360 post URLs from static export.
  - Excluded 77 redirecting URLs from `additionalPaths`.
  - Generated one sitemap at `https://www.samanportable.com/sitemap.xml`.
- Local production server verification:
  - Original fix branch check covered all 461 sitemap URLs with redirects disabled.
  - Current production branch check covered all 491 sitemap URLs with redirects disabled.
  - All checked URLs returned HTTP 200 directly.
  - All checked URLs were HTML pages.
  - All checked URLs were indexable.
  - All checked URLs had self-referencing canonicals matching the final `https://www.samanportable.com` URL.
  - `/sitemap.xml` returned HTTP 200 as valid XML.

## Detailed URL Findings

| Redirecting source | Group | Final destination | Sitemap action |
| --- | --- | --- | --- |
| /product/pre-engineered-buildings/pre-engineered-buildings | product duplicate | https://www.samanportable.com/product/pre-engineered-buildings | destination retained; source excluded |
| /container-offices-for-sale-in-bannerghatta-road | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /portable-cabins-in-sarjapur-road | location | https://www.samanportable.com/porta-cabins-in-sarjapur-road | destination retained; source excluded |
| /portable-cabins-in-anekal | location | https://www.samanportable.com/porta-cabins-in-anekal | destination retained; source excluded |
| /portable-cabins-in-ulsoor | location | https://www.samanportable.com/porta-cabins-in-ulsoor | destination retained; source excluded |
| /portacabins-for-sale-in-kr-puram | location | https://www.samanportable.com/portable-cabins-in-kr-puram | destination retained; source excluded |
| /portable-cabins-in-kengeri | location | https://www.samanportable.com/porta-cabins-in-kengeri | destination retained; source excluded |
| /container-offices-for-sale-in-magadi-road | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /porta-cabins-in-frazer | location | https://www.samanportable.com/portable-cabins-in-frazer-town | destination retained; source excluded |
| /competitive-prices-for-preloved-office-modules | legacy/other | https://www.samanportable.com/second-hand-container-office | destination retained; source excluded |
| /product/container-offices/container-offices | product duplicate | https://www.samanportable.com/product/container-offices | destination retained; source excluded |
| /portable-classrooms-2 | legacy/other | https://www.samanportable.com/portable-classroom-for-sale-2 | destination retained; source excluded |
| /container-offices-for-sale-in-bellandur | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /portable-cabins-in-jp-nagar | location | https://www.samanportable.com/porta-cabins-in-jp-nagar | destination retained; source excluded |
| /container-offices-for-sale-in-domlur | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /affordable-porta-cabins-in-hosur | legacy/other | https://www.samanportable.com/portable-cabins-in-hosur | destination retained; source excluded |
| /portable-cabins-in-btm-layout | location | https://www.samanportable.com/porta-cabins-in-btm-layout | destination retained; source excluded |
| /small-portable-buildings-solutions | legacy/other | https://www.samanportable.com/product-category/prefab-buildings | destination retained; source excluded |
| /temporary-sheds-guide-2024 | legacy/other | https://www.samanportable.com/portable-sheds-complete-guide-2024 | destination retained; source excluded |
| /portable-cabins-in-rt-nagar | location | https://www.samanportable.com/porta-cabins-in-rt-nagar | destination retained; source excluded |
| /product/container-houses/container-houses | product duplicate | https://www.samanportable.com/product/container-houses | destination retained; source excluded |
| /portacabins-for-sale-in-shivajinagar | location | https://www.samanportable.com/portable-cabins-in-shivajinagar | destination retained; source excluded |
| /portable-classrooms | legacy/other | https://www.samanportable.com/portable-classroom-for-sale-2 | destination retained; source excluded |
| /product/portable-office/portable-office | product duplicate | https://www.samanportable.com/product/portable-office | destination retained; source excluded |
| /portacabins-for-sale-in-hennur | location | https://www.samanportable.com/portable-cabins-in-hennur | destination retained; source excluded |
| /container-offices-for-sale-in-kengeri | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /product/industrial-sheds/industrial-sheds | product duplicate | https://www.samanportable.com/product/industrial-sheds | destination retained; source excluded |
| /portable-cabins-in-noida | location | https://www.samanportable.com/porta-cabin-in-noida | destination retained; source excluded |
| /container-offices-in-north-delhi | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /product/container-cafe/container-cafe | product duplicate | https://www.samanportable.com/product/container-cafe | destination retained; source excluded |
| /portable-cabins-in-rajajinagar | location | https://www.samanportable.com/porta-cabins-in-rajajinagar | destination retained; source excluded |
| /portable-cabins-in-whitefield | location | https://www.samanportable.com/portacabins-for-sale-in-whitefield | destination retained; source excluded |
| /container-offices-for-sale-in-kr-puram | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /container-offices-for-sale-in-shivajinagar | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /prefabricated-office-buildings | legacy/other | https://www.samanportable.com/product-category/portable-office | destination retained; source excluded |
| /small-cabin-designs | legacy/other | https://www.samanportable.com/product-category/porta-cabins | destination retained; source excluded |
| /portacabins-for-sale-in-indiranagar | location | https://www.samanportable.com/portable-cabins-in-indiranagar | destination retained; source excluded |
| /portable-cabins-in-banashankari | location | https://www.samanportable.com/porta-cabins-in-banashankari | destination retained; source excluded |
| /portable-cabins-in-marathahalli | location | https://www.samanportable.com/porta-cabins-in-marathahalli | destination retained; source excluded |
| /container-offices-for-sale-in-nagarbhavi | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /portable-cabins-in-domlur | location | https://www.samanportable.com/porta-cabins-in-domlur | destination retained; source excluded |
| /product/portable-cabin/portable-cabin | product duplicate | https://www.samanportable.com/product/portable-cabin | destination retained; source excluded |
| /product/portable-toilet/portable-toilet | product duplicate | https://www.samanportable.com/product/portable-toilet | destination retained; source excluded |
| /car-portable-garage | legacy/other | https://www.samanportable.com/portable-car-shed | destination retained; source excluded |
| /container-offices-for-sale-in-frazer-town | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /portable-cabins-in-hsr-layout | location | https://www.samanportable.com/porta-cabins-in-hsr-layout | destination retained; source excluded |
| /container-offices-for-sale-in-marathahalli | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /container-offices-for-sale-in-banashankari | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /container-offices-for-sale-in-rajajinagar | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /portable-cabins-in-hebbal | location | https://www.samanportable.com/porta-cabins-in-hebbal | destination retained; source excluded |
| /container-offices-for-sale-in-electronic-city | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /container-offices-in-east-delhi | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /porta-cabins-in-bellandur | location | https://www.samanportable.com/portable-cabins-in-bellandur | destination retained; source excluded |
| /product/porta-cabins/porta-cabins | product duplicate | https://www.samanportable.com/product/porta-cabins | destination retained; source excluded |
| /rise-of-prefab-office-and-structures-in-2024 | legacy/other | https://www.samanportable.com/product-category/prefab-buildings | destination retained; source excluded |
| /container-offices-for-sale-in-whitefield | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /container-offices-for-sale-in-koramangala | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /used-portacabins-for-sale | legacy/other | https://www.samanportable.com/product-category/porta-cabins | destination retained; source excluded |
| /container-offices-for-sale-in-ulsoor | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /container-offices-for-sale-in-yelahanka | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /portable-cabins-in-electronic-city | location | https://www.samanportable.com/porta-cabins-in-electronic-city | destination retained; source excluded |
| /container-offices-for-sale-in-rt-nagar | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /container-offices-for-sale-in-malleshwaram | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /portacabins-for-sale-in-hoskote | location | https://www.samanportable.com/portable-cabins-in-hoskote | destination retained; source excluded |
| /container-offices-for-sale-in-hsr-layout | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /portable-cabins-in-vijayanagar | location | https://www.samanportable.com/porta-cabins-in-vijayanagar | destination retained; source excluded |
| /container-offices-in-ghaziabad | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /product/labor-colony/labor-colony | product duplicate | https://www.samanportable.com/product/labor-colony | destination retained; source excluded |
| /container-offices-for-sale-in-btm-layout | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /product/security-cabins/security-cabins | product duplicate | https://www.samanportable.com/product/security-cabins | destination retained; source excluded |
| /portable-cabins-in-bannerghatta-road | location | https://www.samanportable.com/portacabins-for-sale-in-bannerghatta-road | destination retained; source excluded |
| /container-offices-for-sale-in-jigani | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /product/prefab-buildings/prefab-buildings | product duplicate | https://www.samanportable.com/product/prefab-buildings | destination retained; source excluded |
| /portable-cabins-in-malleshwaram | location | https://www.samanportable.com/porta-cabins-in-malleshwaram | destination retained; source excluded |
| /portable-cabins-in-jigani | location | https://www.samanportable.com/porta-cabins-in-jigani | destination retained; source excluded |
| /product/prefabricated-houses/prefabricated-houses | product duplicate | https://www.samanportable.com/product/prefabricated-houses | destination retained; source excluded |
| /product/peb-constructions/peb-constructions | product duplicate | https://www.samanportable.com/product/peb-constructions | destination retained; source excluded |
| /portable-cabins-in-yelahanka | location | https://www.samanportable.com/porta-cabins-in-yelahanka | destination retained; source excluded |
| /top-rated-recycled-office-structures | legacy/other | https://www.samanportable.com/second-hand-container-office | destination retained; source excluded |
| /portable-cabins-in-nagarbhavi | location | https://www.samanportable.com/porta-cabins-in-nagarbhavi | destination retained; source excluded |
| /container-offices-for-sale-in-hennur | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /6-reasons-benefits-2-buy-portable-building | legacy/other | https://www.samanportable.com/product-category/prefab-buildings | destination retained; source excluded |
| /container-offices-for-sale-in-hebbal | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /portable-cabins-in-koramangala | location | https://www.samanportable.com/porta-cabins-in-koramangala | destination retained; source excluded |
| /portable-classroom-for-sale | legacy/other | https://www.samanportable.com/portable-classroom-for-sale-2 | destination retained; source excluded |
| /portable-cabins-in-jayanagar | location | https://www.samanportable.com/porta-cabins-in-jayanagar | destination retained; source excluded |
| /portable-cabins-in-bommasandra | location | https://www.samanportable.com/portacabins-for-sale-in-bommasandra | destination retained; source excluded |
| /porta-cabins-in-peenya-f | location | https://www.samanportable.com/portable-cabins-in-peenya | destination retained; source excluded |
| /container-offices-for-sale-in-anekal | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
| /portacabins-for-sale-in-magadi-road | location | https://www.samanportable.com/portable-cabins-in-magadi-road | destination retained; source excluded |
| /container-offices-for-sale-in-sarjapur-road | location | https://www.samanportable.com/product-category/container-offices | destination retained; source excluded |
