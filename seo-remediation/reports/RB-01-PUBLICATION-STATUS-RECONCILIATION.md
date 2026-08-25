# RB-01 publication-status reconciliation

Date: 2026-08-25
Branch: `seo/rb-01-publication-status`
Starting head: `8245b89a`
Deployment performed: **No**
Final New Approved architecture: **Unchanged**

## Outcome

RB-01 authorizes and this change implements the publication-status reconciliation for exactly two already-live Container Offices pages:

- `/product/container-offices/multi-story-container-office`
- `/product/container-offices/flat-pack-container-office`

Both move from the planned-release fixture to the approved-production fixture. Both join the product and product-image sitemap inputs. No page content, facts, assets, redirects, template behavior, navigation logic, or final-plan topology changed.

The planned-release count moves from the 45-path audit baseline to 43. The built release candidate returns 404 for all 43 and exposes none through page sitemaps, image sitemaps, rendered links, or JSON-LD. Live production currently returns 404 for 42; Expandable Container Office is an unauthorized live/planned contradiction and remains an RB-01 blocker because this task explicitly prohibits changing the status of any remaining planned page.

## Authorized page verification

| Gate | Multi-Story Container Office | Flat-Pack Container Office |
|---|---|---|
| Live response | 200, no redirect | 200, no redirect |
| Canonical | Exact self-canonical | Exact self-canonical |
| Robots | `index, follow` | `index, follow` |
| H1 | One: `Multi-Story Container Office: Six Approved G+1 Sizes` | One: `Flat-Pack Container Office: Six Sizes, 80 to 800 Sq Ft` |
| Title uniqueness | Unique across 128 live commercial URLs checked | Unique across 128 live commercial URLs checked |
| Meta-description uniqueness | Unique across the same set | Unique across the same set |
| Source publication record | `publish`; canonical permalink and Container Offices category | `publish`; canonical permalink and Container Offices category |
| Approved content control | CO-06 control verifier: 155/155 | CO-07 locked copy/hash verifier: 383/383 |
| Content/specification package | Complete rendered description, six sizes, specifications and technical PDF | Complete locked copy pack, six sizes, specifications and technical PDF |
| Live assets | 58 rendered image/PDF targets checked; 0 redirect/error responses | 55 rendered image/PDF targets checked; 0 redirect/error responses |
| Schema | Valid Product JSON-LD; prohibited rating/review claims absent | Valid Product JSON-LD; prohibited rating/review/FAQ claims absent |
| Hub to child | Container Offices hub contains one direct link | Container Offices hub contains one direct link |
| Child to hub | Seven direct links to the hub | Five direct links to the hub |
| Alternate owner/redirect conflict | No redirect source/destination rule or alternate page owner found | No redirect source/destination rule or alternate page owner found |
| Generated page sitemap | Included exactly once | Included exactly once |
| Generated product-image sitemap | Included with 69 image associations | Included with 69 image associations |

The same CO-06 and CO-07 controls passed against the locally built release artifact, not only the live pages. No substantive copy was written or altered during RB-01.

## Planned-release fixture after reconciliation

| Check | Built release candidate | Live production observation |
|---|---:|---:|
| Planned paths | 43 | 43 evaluated |
| Direct 404 | 43 | 42 |
| Direct 200 | 0 | 1: `/product/container-offices/expandable-container-office` |
| Page-sitemap membership | 0 | 0 |
| Product-image sitemap membership | 0 | 0 |
| Rendered link occurrences from page-sitemap URLs | 0 | 0 across 375 live sitemap pages |
| JSON-LD URL occurrences from page-sitemap URLs | 0 | 0 across 375 live sitemap pages |
| Approved-production overlap | 0 | Not applicable to repository fixture |
| Published product records in this integration base | 0 | Expandable is deployed from a later production state not present on this base |

The final New Approved page set and family ownership did not change. Only the lifecycle classification of the two RB-01-authorized pages changed.

### Remaining live/planned blocker

`/product/container-offices/expandable-container-office` returned direct HTTP 200 in the live check. It remains absent from both live sitemaps and no incoming rendered link or JSON-LD reference was found across the live sitemap crawl. Nevertheless, a planned page must return 404. RB-01 does not authorize reclassifying, publishing, unpublishing, redirecting, or otherwise changing this page, so a separate owner ruling is required.

## Accommodation Container classification

Classification: **D — ACCIDENTALLY_EXPOSED_DRAFT**

Evidence:

- Live route returns 200 with no redirect, an exact self-canonical, `index, follow`, one H1, complete-looking content, 22 direct image/PDF targets with zero response failures, and parseable ItemPage/FAQPage JSON-LD.
- The authoritative product record remains `status: "draft"`, `catalog_visibility: "hidden"`, with empty legacy description and image fields.
- No explicit repository owner approval changes that source record to `publish`.
- It remains excluded from the generated product and product-image sitemaps.
- The Labour Colony hub, Labour Hutments, and Labour Sheds each link to it through the shared Labour Colony rail despite the draft record.

### Direct-exposure code path

1. `src/pages/product/[category]/[slug].tsx` calls `staticContent.fetchLightweightProduct(slug)` for a direct product URL.
2. `src/lib/staticContent.ts` resolves the slug through `findProductBySlug`, which searches all raw records without a publication-status filter.
3. `fetchLightweightProduct` returns that record without checking `status`.
4. Listing queries use `getPublishedProducts()` and do filter status, so the inconsistency is specific to direct lookup and separately maintained discovery structures such as `src/lib/labourColonyClusterRail.ts`.

No Accommodation source status, sitemap membership, route behavior, or shared publication logic changed in RB-01.

### Minimal correction proposed, not implemented

Pending an owner decision to keep the record as draft, the narrowest immediate correction is an exact Accommodation guard at the direct product resolver/GSSP boundary plus removal of its exact shared-rail entry, returning 404 outside an explicit localhost preview. A generalized status-aware resolver is cleaner long term but has a wider regression surface and is outside RB-01.

Regression risk: other legacy records may rely on direct lookup despite non-publish status. Before generalizing, enumerate every non-publish record against the approved-production fixture, verify preview requirements, and regression-test category listings, direct routes, structured data, rails, calculators, and sitemaps. If the owner instead approves publication, change the authoritative record first and rerun the full publication gate before adding sitemap membership.

## Tiny Container Homes

Status: **WAITING_CLAUDE_AND_OWNER_FACTS**

Tiny Container Homes remains a separate approved page intent and must not be permanently merged with Shipping Container Homes. RB-01 does not publish the page and does not change its existing redirect. `next.config.js` is unchanged.

Future publication requires an approved page package containing:

- a precise product definition;
- a differentiated boundary from Shipping Container Homes;
- verified available sizes;
- verified studio and 1-BHK use/configuration facts;
- the verified construction system;
- verified included services;
- an approved price basis;
- explicit transport and site-work exclusions;
- approved real product images;
- an approved drawing and technical PDF.

After those inputs are available, the page must pass the full 200, self-canonical, index/follow, unique title/H1, approved content, valid visible-data-matched schema, product/image sitemap, and purposeful bidirectional-link gate.

## Sitemap reconciliation

- Added the two authorized product paths to `src/lib/sitemapCanonicalPaths.json`.
- Regenerated `public/sitemap-products.xml` and `public/sitemap-images-products.xml`.
- Included 69 validated image associations for each authorized page.
- Removed `/product-category/container-offices` and `/product-category/wall-sheets` from commercial page and image sitemap output.
- All nine sitemap XML files parse successfully.
- No sitemap contains `undefined`.
- Accommodation and all 43 planned paths remain absent from page and image sitemaps.

## 63-URL containment isolation

The safe integration branch does not contain `seo/remediation-temporary-63-gating` in its ancestry. These containment implementation files and its package validation command are absent:

- `src/data/seo/unapprovedCommercialGating.json`
- `src/lib/unapprovedCommercialGating.ts`
- `scripts/validate-unapproved-commercial-gating.js`

The disposition CSV/MD reports remain present as evidence only; they are not gating code. No containment branch was merged, cherry-picked, or deployed.

## Validation results

| Validation | Result |
|---|---|
| `npm run validate:commercial-architecture` | Pass: 61 approved, 43 planned |
| `npm run validate:commercial-architecture:release` | Expected fail: Accommodation authoritative record remains `draft`; no Multi/Flat conflict remains |
| `npm run type-check` | Pass |
| `npm run lint` | Pass with five pre-existing warnings |
| `npm run build` including postbuild sitemap generation | Pass |
| CO-06 verifier, live and local build | Pass: 155/155 each run |
| CO-07 verifier, live and local build | Pass: 383/383 each run |
| Live title/meta uniqueness crawl | Pass for both pages across 128 URLs |
| Live image/PDF response checks | Pass: 58 Multi-Story plus 55 Flat-Pack per-page target checks, zero redirect/error responses |
| Planned fixture on local build | Pass: 43/43 return 404; zero sitemap/link/schema discovery |
| Planned fixture on live production | Blocked: 42/43 return 404; Expandable returns 200 |
| Full built-site sitemap crawl | Pass: 381/381 pages direct 200 |
| Full built-site internal links | Pass: 42,148 edges, 407 targets, zero redirect/error edges |
| Redirect analysis | Zero redirect chains; two pre-existing normalizer/catch-all loop false positives remain in the legacy checker |
| XML/product-category/undefined checks | Pass: nine well-formed XML files; zero product-category locs; zero `undefined` values |
| 63 containment isolation | Pass: branch not ancestor; containment implementation absent |

Known build warnings remain unchanged: four React Hook dependency warnings, one raw `<img>` warning, and the existing custom-route count warning (1,008 redirects, six headers, two rewrites). Commercial product templates remain approximately 581 kB first-load JavaScript. Performance remediation was not started.

## Files changed

- `src/data/seo/commercialArchitecture.json`
- `src/lib/sitemapCanonicalPaths.json`
- `scripts/validate-commercial-architecture.js`
- `scripts/collect-image-manifest.mjs`
- `scripts/generate-segmented-sitemaps.mjs`
- `public/sitemap-products.xml`
- `public/sitemap-images-products.xml`
- `seo-remediation/reports/AUDIT-SEVERITY-REPORT-2026-08-25.md`
- `seo-remediation/reports/IMPLEMENTATION-BACKLOG-2026-08-25.md`
- `seo-remediation/reports/PRODUCTION-READINESS-REPORT-2026-08-25.md`
- `seo-remediation/reports/RB-01-PUBLICATION-STATUS-RECONCILIATION.md`

## Risks, rollback, and blockers

Risks:

- Live production has moved beyond this integration base for Expandable Container Office; status drift can recur if source publication state, architecture fixture, discovery, and sitemap changes are not released atomically.
- Accommodation remains indexable and internally discoverable while its authoritative source is draft.
- The safe integration still does not contain the 63-URL temporary containment.

Rollback:

- Revert the RB-01 commit to restore the 59/45 fixture and prior generated sitemap artifacts. No content or page implementation rollback is required because RB-01 changes no page content.

Release blockers:

1. Owner ruling for live/planned Expandable Container Office.
2. Owner publication approval or containment direction for Accommodation Container.
3. Explicit release decision for the isolated 63-URL containment/permanent dispositions.

## Stop condition

RB-01 publication corrections are implemented and validated. **Do not deploy yet.** No substantive marketing content was written, Tiny was not published or redirected differently, no forms work was started, and no performance work was started.
