# STG-01B Structured-Data Prerequisite

Date: 2026-08-26

Branch: `seo/stg-01b-schema-prerequisite`

Starting checkpoint: `82494c30d23709eba4a808a6bd1fda8af287ba55`

Reconciled production base: `3346a532306c52932aeb2d813591bf95cb37716b`

Production deployment: **not performed**

Remote branch / pull request: **not created**

## Final verdict

**READY_TO_RESUME_STG_01**

The seven STG-01A structured-data blockers are resolved on the requested local prerequisite branch. All 61 approved pages now render exactly one Product and one BreadcrumbList in server output; the seven affected pages retain exactly one of each after browser hydration. Architecture, publication, rail, sitemap, redirect, internal-link, form-contract, image, TypeScript, lint and production-build gates pass. No production deployment, merge, push, PR, content rewrite, rail change, architecture change or permanent 63-row disposition was performed.

## Exact resolved URLs

Missing Product before STG-01B:

1. `/product/labor-colony/labor-sheds`
2. `/product/labor-colony/prefab-site-canteen`
3. `/product/rockwool-panel`
4. `/product/security-cabins/frp-security-cabin`

Missing BreadcrumbList before STG-01B:

1. `/product/container-offices/site-office-container`
2. `/product/container-offices/flat-pack-container-office`
3. `/product/container-offices/multi-story-container-office`

The pre-change page qualification and evidence matrix is `seo-remediation/reports/STG-01B-SCHEMA-FAILURE-MATRIX.md`.

## Before / after JSON-LD

| Page | Before | After | Root cause | Resolution |
|---|---|---|---|---|
| Labour Sheds | `ItemPage` + `BreadcrumbList`; no Product | One `ItemPage` containing one Product and one BreadcrumbList | `PAGE_SPECIFIC_OVERRIDE` + `SHARED_TEMPLATE_CONDITION` | Approved semantic Product opt-in; approved British-spelling product name supplied to the shared adapter; no Offer/availability/rating/review |
| Prefab Site Canteen | `ItemPage` + `BreadcrumbList`; no Product | One `ItemPage` containing one Product and one BreadcrumbList | `INVALID_SCHEMA_SUPPRESSION` | Removed the one-page Product suppression; retained the visible approved AggregateOffer; omitted unsupported availability/rating/review |
| Rockwool Panel | `ProductGroup` + `BreadcrumbList` + `FAQPage`; no Product | One Product + one BreadcrumbList + one FAQPage | `SPECIALIZED_ROUTE_BYPASS` | Corrected the existing specialized panel adapter to Product, added canonical URL, removed ProductGroup-only fields and unsupported availability |
| FRP Security Cabin | `ItemPage` + `BreadcrumbList` + `FAQPage`; no Product | One `ItemPage` containing one Product and one BreadcrumbList, plus FAQPage | `SHARED_TEMPLATE_CONDITION` | Approved semantic Product opt-in; no unsupported Offer/availability/rating/review |
| Site Office Container | Product only | One Product + one BreadcrumbList | `PAGE_SPECIFIC_OVERRIDE` | Shared `productOnly` output now emits the shared breadcrumb entity exactly once |
| Flat-Pack Container Office | Product only | One Product + one BreadcrumbList | `PAGE_SPECIFIC_OVERRIDE` | Shared `productOnly` output now emits the shared breadcrumb entity exactly once |
| Multi-Story Container Office | Product only | One Product + one BreadcrumbList | `PAGE_SPECIFIC_OVERRIDE` | Shared `productOnly` output now emits the shared breadcrumb entity exactly once |

## Product field sources and fact parity

| Page | Name | URL | Description | Images | Brand / manufacturer | Offer decision |
|---|---|---|---|---|---|---|
| Labour Sheds | Approved visible label `Labour Sheds`, matching the H1 intent and breadcrumb | Shared canonical path derivation | Existing approved page meta/summary data | Existing approved variant gallery | Existing shared SAMAN brand/manufacturer data | Omitted. The approved page exposes indicative rates but no per-size schema ladder; no availability emitted |
| Prefab Site Canteen | Approved product record and visible label | Shared canonical path derivation | Existing approved page meta/summary data | Existing approved variant gallery | Existing shared SAMAN brand/manufacturer data | Existing six-size visible INR ladder retained as AggregateOffer; availability omitted |
| Rockwool Panel | Existing specialized adapter and visible product name | Explicit self-canonical URL | Existing visible `SHORT_DESCRIPTION` | Existing visible `GALLERY_IMAGES` | Existing SAMAN organization references | Existing visible INR AggregateOffer retained; availability omitted |
| FRP Security Cabin | Approved product record and exact visible H1 | Shared canonical path derivation | Existing approved page meta/export data | Existing approved product gallery | Existing shared SAMAN brand/manufacturer data | Omitted because no unambiguous approved Offer belongs in this repair; no availability emitted |

No aggregateRating, review, ratingValue, reviewCount, fake SKU, MPN, GTIN, priceValidUntil, shippingDetails, return policy, warranty, delivery promise or freight value was introduced on the four repaired Product pages. Existing genuine SKUs, where the shared adapter already sources them from approved product records, were not modified. The removed flat ₹3,000 freight value was not reintroduced.

## Breadcrumb hierarchy

The same shared breadcrumb array drives visible UI and JSON-LD on the three corrected Container Office pages:

1. Home — `https://www.samanportable.com/`
2. Container Offices — `https://www.samanportable.com/product/container-offices`
3. Exact approved child — the current page’s self-canonical URL

Each target returns direct HTTP 200. Positions are sequential 1–3. No `/product`, product-category, legacy, redirected, planned, draft or gated URL appears in these trails.

## Duplicate and hydration checks

- Server-rendered output: all 61 approved pages checked; exactly 61 Product and 61 BreadcrumbList entities in total.
- Affected server-rendered output: seven pages; zero JSON-LD parse errors, zero duplicate Product entities, zero duplicate BreadcrumbList entities.
- Hydrated Chrome DOM: seven pages at `document.readyState=complete`; each has exactly one Product and one BreadcrumbList.
- Hydrated Rockwool DOM: zero ProductGroup entities.
- Hydrated visible breadcrumb labels on all three Container Office pages exactly match the required three-node hierarchy.
- Browser console: zero warnings/errors during the seven-page hydration run.
- Schema Product images: 84 URLs checked, all direct image responses.

## Automated regression coverage

`npm run validate:stg01b-structured-data -- --base-url=http://127.0.0.1:3210` verifies:

- exact Product count, canonical URL, approved name/H1 agreement, descriptions, supported brand/manufacturer and image responses for the four Product repairs;
- absence of unsupported rating/review, availability, freight/shipping, return-policy, warranty and identifier fields;
- preservation of approved visible-price offers only on Prefab Site Canteen and Rockwool Panel;
- exact BreadcrumbList count and three-node hierarchy for the three Container Office repairs;
- direct 200/no-redirect breadcrumb targets;
- all 61 approved pages have one Product and one BreadcrumbList and parseable JSON-LD;
- architecture remains 61 approved / 43 planned;
- product data, rail, architecture, gating and freight source files remain unchanged from `82494c30`;
- Rockwool changed only inside its existing Product schema adapter.

The connected-browser test separately verifies post-hydration entity counts and visible breadcrumb parity. The existing publication and Container Office rail validators cover the broader lifecycle/rail assertions, including planned/draft 404 behavior, temporary controls, nine direct children, and Expandable Container Office exactly once.

## Validation results

| Validation | Result |
|---|---|
| Production base fetch / ancestry | Pass: `origin/static-migration` remains `3346a532`; candidate starts at `82494c30` |
| `validate:commercial-architecture:release` | Pass: 61 approved live, 43 planned release, one retained planned draft record |
| `validate:temporary-commercial-gating` | Pass: 63 exact paths, zero approved/planned overlap, three stricter exclusions |
| `validate:publication-gate` | Pass: 61 approved direct 200; 43 planned true 404; three draft records 404; 63 temporary paths checked |
| Container Office rail | Pass: nine unique children, required order retained, Expandable exactly once, all direct/self-canonical/index/follow, no planned/draft/gated/archive child |
| STG-01B structured data | Pass: 61 approved pages checked; zero missing/duplicate Product or BreadcrumbList entities; zero parse errors |
| Schema fact parity | Pass for names, URLs, descriptions, images, supported brand/manufacturer, supported INR offers and breadcrumb labels/URLs |
| Hydrated browser DOM | Pass: seven complete documents; one Product and one BreadcrumbList each; zero console warning/error |
| TypeScript | Pass |
| Lint | Pass with the five pre-existing warnings listed below |
| Production build | Pass |
| Sitemap/image generation | Pass: 356 candidates, 321 indexable |
| Sitemap segments | 72 product, 190 location, 1 project, 58 editorial |
| XML validation | Pass: nine XML files; zero `undefined`, planned, gated or product-category page locations |
| Image sitemaps | Pass: 4,208 page/image associations, 3,220 unique images |
| Image manifest | Pass: schema v1, 356 pages, 5,606 entries, 321 indexable pages |
| Image responses | Pass: 1,478 locally rendered/indexable manifest images plus 84 Product-schema images returned direct image responses |
| Redirects | Pass: 1,005 rules, zero duplicates, zero literal chains, zero non-permanent rules, zero approved sources |
| Canonical/indexability | Pass through publication, rail and schema fixtures |
| Indexed internal-link crawl | Pass: 321 sitemap pages, 31,838 occurrences, 338 unique targets, zero redirect/error edges |
| Temporary-target inventory | Preserved open item: 138 occurrences to 42 temporarily gated targets |
| Form contracts | Pass: four source POST actions/named controls; Quote POST contract rendered on `/contact`; delivery not exercised |
| Protected-change guard | Pass: no product data, rail, architecture, gating, substantive page copy, price or freight source change |

## Existing warnings retained

These were reported and not hidden or suppressed:

1. `site-office-container.tsx:481` — missing `product?.name` Hook dependency.
2. `site-office-container.tsx:500` — missing `product?.name` Hook dependency.
3. `src/pages/product/[category]/index.tsx:593` — missing `product?.name` Hook dependency.
4. `src/pages/product/[category]/index.tsx:612` — missing `product?.name` Hook dependency.
5. `src/pages/product/[category]/[slug].tsx:281` — raw `<img>` warning.
6. Next build custom-route warning: six headers, two rewrites and 1,008 normalized redirect routes; `redirects()` returns 1,005 rules.
7. Commercial product templates remain approximately 579–584 kB first-load JavaScript.
8. The redirect diagnostic continues to print two known non-chain normalizer loop reports: `/product/labor-colony/` and `/:path+/`; targeted literal-chain checks are zero.

## Files changed in STG-01B

1. `package.json`
2. `scripts/validate-stg01b-structured-data.mjs`
3. `seo-remediation/reports/STG-01B-SCHEMA-FAILURE-MATRIX.md`
4. `seo-remediation/reports/STG-01B-STRUCTURED-DATA-PREREQUISITE.md`
5. `src/components/ProductStructuredData.tsx`
6. `src/lib/breadcrumbs.ts`
7. `src/lib/panelSchemaOffers.ts`
8. `src/pages/product/[category]/[slug].tsx`
9. `src/pages/product/container-offices/site-office-container.tsx`
10. `src/pages/product/rockwool-panel/index.tsx`

Generated sitemap XML and the ignored image manifest were rebuilt and validated; no tracked generated sitemap file differs from the starting checkpoint.

## SEO intent, boundary and publishing safety audit

- Page type: all seven are approved product-detail pages.
- Correct clusters: Labour Sheds and Prefab Site Canteen remain in Labor Colony; FRP Security Cabin remains in Security Cabins; the three office children remain in Container Offices; Rockwool remains the insulated-panel product detail.
- Search intent and keyword ownership: unchanged. No title, H1, meta, body, FAQ, rail label or internal anchor was rewritten.
- Cannibalization risk introduced by this change: low; no new URL, content target, redirect, link, or competing intent was created.
- Product-boundary safety: passed; each schema name follows the existing visible/approved product identity.
- E-E-A-T and fact safety: passed for this technical delta; only existing approved visible/business data is emitted, and unsupported facts are omitted.
- Internal-link safety: passed; rail and crawl results are unchanged and direct.
- Technical audit score for this schema-only change: 100/100. This is not a new content approval or authorization to deploy production.

## Remaining risks and blockers

1. The 138 links to 42 temporarily gated targets still await the external 63-row disposition review. No permanent decision was made.
2. Form delivery, analytics and downstream CRM/email/webhook behavior still require authorized staging tests with an approved test identity.
3. The retained audit evidence still records 11 Tiny Container Homes source-content links; no link or architecture decision was made here.
4. AH-001 through AH-020 remain post-deployment/staging review items; no Ahrefs issue remediation began.
5. Existing Hook, raw-image, custom-route and commercial-template bundle/performance warnings remain open.
6. No production deployment or production-branch merge is authorized by this prerequisite.

## Rollback

Before any remote publication, abandon or delete only local branch `seo/stg-01b-schema-prerequisite`; the reconciled STG-01A branch, `static-migration`, and the original dirty feature checkout remain unaffected.

After a future remote publication, revert the single commit `fix(seo): restore approved product and breadcrumb schema` on a new review branch, rebuild, regenerate sitemap/image artifacts, and rerun architecture, publication, rail, structured-data, XML, redirect, canonical, internal-link, form-contract and image checks. Do not use a destructive reset and do not clean the original feature checkout.
