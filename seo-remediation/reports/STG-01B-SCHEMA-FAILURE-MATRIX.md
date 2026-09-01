# STG-01B Schema Failure Matrix

Date: 2026-08-26

Branch: `seo/stg-01b-schema-prerequisite`

Pre-change commit: `82494c30d23709eba4a808a6bd1fda8af287ba55`

Reconciled production base: `3346a532306c52932aeb2d813591bf95cb37716b`

This matrix was completed before implementation. It combines the exact STG-01A failure list with a fresh check of the current production build at `82494c30`. All seven routes return direct HTTP 200, are self-canonical, and render `index, follow`.

## Exact Product-schema failures

1. `/product/labor-colony/labor-sheds`
2. `/product/labor-colony/prefab-site-canteen`
3. `/product/rockwool-panel`
4. `/product/security-cabins/frp-security-cabin`

All four are verified `PRODUCT DETAIL` pages. Each has one distinct commercial product entity, a product-specific H1 and description, a visible primary product image, and a direct approved canonical. None is a broad family hub, category archive, comparison page, service page, or informational article. `VALIDATOR_EXPECTATION_REVIEW_REQUIRED` therefore does not apply.

## Page-level failure matrix

| URL | Approved page name | Product family | Page type | Existing JSON-LD types | Product? | BreadcrumbList? | Visible product evidence | Commercial fact visibility | Existing breadcrumb UI | Root cause | Proposed correction |
|---|---|---|---|---|---:|---:|---|---|---|---|---|
| `/product/labor-colony/labor-sheds` | Labour Sheds | Labor Colony | PRODUCT DETAIL | `ItemPage`, `BreadcrumbList`, `ListItem` | No | Yes | H1: “Labour Sheds for Site Workers: One Open Sleeping Hall”; substantial approved description; product gallery image returns 200 | Indicative `Rs` rates are visible, but the approved variant ladder deliberately contains null per-size prices; no explicit inventory availability | Home → Products → Labour Colony → Labour Sheds | `PAGE_SPECIFIC_OVERRIDE` plus `SHARED_TEMPLATE_CONDITION`: the pending-ladder gate suppresses Product, and the shared adapter otherwise requires Offer/rating/review evidence | Opt this approved detail page into the shared semantic Product entity; use approved “Labour Sheds” name, canonical URL, approved meta description and product images; emit no Offer, rating, review or availability |
| `/product/labor-colony/prefab-site-canteen` | Prefab Site Canteen | Labor Colony | PRODUCT DETAIL | `ItemPage`, `BreadcrumbList`, `ListItem` | No | Yes | H1: “Prefab Site Canteen: Worker Dining and Serving Blocks”; substantial approved description; primary canteen image returns 200 | Six-size INR/`Rs` ladder is visible, starting at Rs 1,50,000 ex-GST; no explicit inventory availability | Home → Products → Labour Colony → Prefab Site Canteen | `INVALID_SCHEMA_SUPPRESSION`: the dynamic route explicitly passes `suppressProductEntity` for this one approved page despite its complete visible approved ladder | Remove only the invalid Product suppression; retain the shared Product adapter and its approved AggregateOffer derived from the visible six-size ladder; add no rating/review or availability |
| `/product/rockwool-panel` | Rockwool Panel | Insulated Sandwich Panels | PRODUCT DETAIL | `ProductGroup`, `PropertyValue`, `AggregateOffer`, `BreadcrumbList`, `ListItem`, `FAQPage`, `Question`, `Answer` | No | Yes | H1: “Rockwool Panel, Non-Combustible Stone Wool Sandwich Panels”; substantial product/specification description; primary Rockwool image returns 200 | Visible INR prices start at ₹1,290 per sq. mt; no explicit inventory availability | Home → Product → Rockwool Panel | `SPECIALIZED_ROUTE_BYPASS`: the established specialized panel route emits a page-specific `ProductGroup` even though the page represents one Rockwool Panel product offering | Correct the existing page-specific schema adapter to one `Product` with canonical `url`; preserve its visible description, images, brand/manufacturer, properties and AggregateOffer; remove ProductGroup-only fields; add no rating/review or availability |
| `/product/security-cabins/frp-security-cabin` | FRP Security Cabin | Security Cabins | PRODUCT DETAIL | `ItemPage`, `BreadcrumbList`, `ListItem`, `FAQPage`, `Question`, `Answer` | No | Yes | H1: “FRP Security Cabin”; substantial approved description; approved FRP product images are rendered and resolve successfully | Visible price information is present in the product page; the structured-data repair will not infer an Offer from unrelated/uncertain commercial fields; no explicit inventory availability | Home → Products → Security Cabins → FRP Security Cabin | `SHARED_TEMPLATE_CONDITION`: the shared adapter suppresses quote-only/unrated Product nodes when no eligible Offer/rating/review evidence exists | Opt this approved detail page into the shared semantic Product entity using canonical URL, approved product name, approved description and product images; emit no unsupported Offer, rating, review or availability |
| `/product/container-offices/site-office-container` | Site Office Container | Container Offices | PRODUCT DETAIL | `Product`, `Brand`, `AggregateOffer` | Yes | No | Product-specific H1, description and primary image; image returns 200 | Visible INR ladder from Rs 2,37,600 ex-GST; schema preserves its approved AggregateOffer | Home → Products → Container Offices → Site Office Container | `PAGE_SPECIFIC_OVERRIDE`: `schemaOutputMode: productOnly` returns before the shared breadcrumb graph is emitted | Keep the one existing Product; make shared `productOnly` output emit the one shared BreadcrumbList; project visible and JSON-LD trail from one three-node array |
| `/product/container-offices/flat-pack-container-office` | Flat-Pack Container Office | Container Offices | PRODUCT DETAIL | `Product`, `Brand`, `AggregateOffer`, `Offer`, `PriceSpecification` | Yes | No | Product-specific H1, description and primary image; image returns 200 | Visible INR ladder from Rs 1,91,520 ex-GST; schema preserves its approved offers | Home → Products → Container Offices → Flat-Pack Container Office | `PAGE_SPECIFIC_OVERRIDE`: `schemaOutputMode: productOnly` returns before the shared breadcrumb graph is emitted | Keep the one existing Product; make shared `productOnly` output emit the one shared BreadcrumbList; project visible and JSON-LD trail from one three-node array |
| `/product/container-offices/multi-story-container-office` | Multi-Story Container Office | Container Offices | PRODUCT DETAIL | `Product`, `Brand`, `AggregateOffer`, `Offer`, `PriceSpecification` | Yes | No | Product-specific H1, description and primary image; image returns 200 | Visible INR ladder from Rs 4,71,200 ex-GST; schema preserves its approved offers | Home → Products → Container Offices → Multi-Story Container Office | `PAGE_SPECIFIC_OVERRIDE`: `schemaOutputMode: productOnly` returns before the shared breadcrumb graph is emitted | Keep the one existing Product; make shared `productOnly` output emit the one shared BreadcrumbList; project visible and JSON-LD trail from one three-node array |

## Required Container Office breadcrumb correction

The exact required visible and JSON-LD hierarchy on all three affected Container Office pages is:

1. Home — `https://www.samanportable.com/`
2. Container Offices — `https://www.samanportable.com/product/container-offices`
3. Exact approved child — the page’s self-canonical URL

The shared `schemaOutputMode: productOnly` condition is used by exactly these three pages, so one shared output correction can restore BreadcrumbList without changing unrelated product families. The same shared breadcrumb array will drive both UI and JSON-LD; no legacy or product-category URL will be introduced.

## Pre-change fact-parity and safety decision

- JSON-LD parse errors: zero on all seven pages.
- Duplicate Product entities: zero.
- Duplicate BreadcrumbList entities: zero.
- Product-schema eligibility: confirmed for all four missing Product pages.
- Product images tested during the pre-change probe: HTTP 200.
- Unsupported rating/review fields: not authorized and will not be added.
- Unsupported availability, freight, delivery, warranty, GTIN, MPN or fake SKU: not authorized and will not be added.
- Existing verified Offer data will be preserved only where already derived from visibly published approved prices.
- No substantive content, page title/H1, product record, rail, architecture, redirect, canonical, price or freight value will be changed.
