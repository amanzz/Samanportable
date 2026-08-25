# RB-01C publication-gate implementation

- Date: 2026-08-25
- Branch: `seo/rb-01c-publication-gate`
- Required base: `92a7d90743721f1390faff4402c973258ec94e5d`
- Deployment performed: **No**
- Final New Approved architecture: **Unchanged**
- Release totals: **61 approved/live, 43 planned/unpublished**

## Outcome

RB-01C implements the three owner-approved lifecycle decisions and a shared public publication gate:

1. Accommodation Container remains `draft` and is now planned/unpublished. Its production route returns 404, and public discovery and schema are absent.
2. Expandable Container Office is promoted to `publish` and approved/live. Its route returns 200 with its unchanged approved content and assets, self-canonical/indexable metadata, Product and Breadcrumb schema, both sitemap surfaces, and purposeful family links.
3. Expandable Container House remains planned/unpublished and returns 404.

The shared public resolver now requires a publish-status record and, for URLs governed by the New Approved lifecycle fixture, approved-production membership with no planned-release membership. Direct product, description, SEO and schema lookups use this decision. Draft preview remains available only on a loopback host in a non-production runtime. It cannot be enabled for an ordinary production request by an environment flag.

No substantive page copy, freight facts, forms, performance code, redirect dispositions, or 63-URL blanket controls were changed. No deployment was performed.

## Approved owner decisions

| Page | Owner decision | Implemented release state |
|---|---|---|
| `/product/labor-colony/accommodation-container` | Keep draft/unpublished | Source remains `draft`; moved from approved production to planned release; public 404 |
| `/product/container-offices/expandable-container-office` | Approved live | Source changed from `draft` to `publish`; moved from planned release to approved production; public 200 |
| `/product/container-houses/expandable-container-house` | Keep planned/unpublished | Remains planned with no source product; public 404 |

The two lifecycle moves offset each other. The validated fixture remains 61 approved/live and 43 planned/unpublished. No URL, family ownership, page intent, or final-plan topology changed.

## Before and after states

### Accommodation Container

| Signal | Before at required base | RB-01C release candidate |
|---|---|---|
| Source record | `draft`, `catalog_visibility: hidden` | Unchanged |
| Lifecycle fixture | Approved production | Planned release |
| Public route | 200 through unrestricted direct lookup | 404, no redirect |
| Robots/canonical | `index, follow`, self-canonical | No public product document |
| Product/image sitemaps | Absent | Absent |
| Incoming discovery | Four rendered Labour Colony rail links | Zero links across 380 sitemap pages |
| Structured data | Public ItemPage/Product and FAQ output | No public Product output |
| Release allowlist | Included | Excluded |

The page package and future approved URL are preserved. No placeholder, noindex-only public 200, or sibling redirect was introduced.

### Expandable Container Office

| Signal | Before at deployed ref `4fcb0d08` | RB-01C release candidate |
|---|---|---|
| Source record | `draft`, visible | `publish`, visible |
| Lifecycle fixture | Planned release | Approved production |
| Public route | Live 200 despite planned/draft state | 200, no redirect |
| Robots/canonical | `index, follow`, self-canonical | Preserved and verified |
| Title/meta/H1 | Complete and unique | Unchanged; unique title/meta and exactly one H1 verified |
| Structured data | Product only | One Product plus one BreadcrumbList, matched to visible content |
| Product/image sitemaps | Absent | Included in both |
| Hub discovery | Missing | Container Offices hub link with `Expandable Container Office` child-specific text |
| Child-to-hub | Present | Preserved |
| Primary image/assets | Complete CO-08 package | Primary image 200; all CO-08 build checks passed |

The approved CO-08 copy pack, product facts, variants, prices, images, drawings and PDF were imported unchanged from the deployment-matching source history. The page remains a separate Container Offices product intent and was not merged with a sibling or Expandable Container House.

### Expandable Container House

| Signal | Before | RB-01C release candidate |
|---|---|---|
| Source record | None | None |
| Lifecycle fixture | Planned release | Planned release |
| Public route | 404 | 404, no redirect |
| Product/image sitemaps | Absent | Absent |
| Incoming discovery/schema | Absent | Absent across the built crawl |
| Release allowlist | Excluded | Excluded |

No placeholder, content reuse, or redirect to Expandable Container Office was introduced.

## Draft-lookup defect and correction

### Root cause

`src/pages/product/[category]/[slug].tsx` called `fetchLightweightProduct`, `fetchProductDescription` and `fetchProductRankMathSEO`. All three eventually called `findProductBySlug` in `src/lib/staticContent.ts`. That function searched every raw export record without evaluating `status`, planned-release membership, or release authorization. Listing queries separately filtered publish status, so a draft could be absent from listings and sitemaps while still rendering directly as an indexable 200 with schema.

Two dedicated roofing-sheet pages bypassed the generic dynamic resolver entirely, so correcting only `findProductBySlug` would still have left those draft records public.

### Shared correction

- `isProductPubliclyRenderable` is the common public lifecycle decision.
- A record with an explicit non-publish status always fails closed.
- A New Approved fixture URL renders only if it is in `approvedProductionPaths` and not in `plannedReleasePaths`.
- Legacy publish-status records outside the architecture fixture remain unchanged, so RB-01C does not become a blanket 63-URL disposition.
- Direct product, description and SEO/schema helpers use the gated lookup by default.
- The dynamic route applies the same decision before assembling public props.
- The two dedicated roofing routes apply the same draft decision and now return public 404 while their source records remain draft.
- Preview access is limited to loopback requests in a non-production runtime. Production always rejects drafts independently of sitemap membership.

## All draft records tested

The required base contains three draft records. The deployed reference contains four because it adds the draft CO-08 record. No other non-publish product record was found in either inventory.

| Product and canonical URL | Source file | Source status | Approved-plan status before RB-01C | Before public behavior | Before sitemap/link/schema/release state | Expected and verified after fix |
|---|---|---|---|---|---|---|
| Accommodation Container, `/product/labor-colony/accommodation-container` | `src/data/wp-export/products/accommodation-container.json` | `draft` on both refs | Approved production | 200/indexable | Page/image sitemaps absent; four rail links; Product schema present; release allowlisted | Still `draft`; planned; public 404; no redirect, public Product schema, sitemap entry, incoming link or release authorization |
| Metal Roofing Sheet, `/product/roofing-sheet/metal-roofing-sheet` | `src/data/wp-export/products/metal-roofing-sheet.json` | `draft` on both refs | Outside approved/planned fixture | 200/indexable | Product/image sitemap input and Roofing Sheet hub discovery present; Product schema present; not release allowlisted | Still `draft`; public 404; removed from public sitemap input and hub discovery; no Product schema; not release allowlisted |
| PVC & uPVC Roofing Sheet, `/product/roofing-sheet/pvc-roofing-sheet` | `src/data/wp-export/products/pvc-roofing-sheet.json` | `draft` on both refs | Outside approved/planned fixture | 200/indexable | Product/image sitemap input and Roofing Sheet hub discovery present; Product schema present; not release allowlisted | Still `draft`; public 404; removed from public sitemap input and hub discovery; no Product schema; not release allowlisted |
| Expandable Container Office, `/product/container-offices/expandable-container-office` | `src/data/wp-export/products/expandable-container-office.json` | Absent at base; `draft` on deployed ref | Planned release | Deployed 200/indexable | Both sitemaps and incoming links absent; Product schema present; not release allowlisted | Changed to `publish` under explicit owner approval; approved/live; public 200 with Product/Breadcrumb schema, both sitemaps, family links and release authorization |

The current candidate therefore retains three draft records, all of which return 404. All 61 approved records/routes return 200, so the shared correction did not hide an approved published page. Metal and PVC source status and content remain untouched; their public exclusion is the direct consequence of the approved rule that no draft record may resolve publicly, not a permanent 63-URL disposition.

## Status, allowlist, sitemap, link and schema changes

### Status and release fixture

- Changed only Expandable Container Office from `draft` to `publish`.
- Preserved Accommodation, Metal Roofing Sheet and PVC Roofing Sheet as `draft`.
- Exchanged Accommodation and Expandable Container Office between the two lifecycle cohorts.
- Preserved Expandable Container House in planned release.
- Preserved the 61/43 architecture totals.

### Sitemaps and image manifest

- Added Expandable Container Office to the canonical sitemap input.
- Removed draft Metal Roofing Sheet and PVC Roofing Sheet from that input.
- Accommodation and Expandable Container House remain absent.
- Regenerated `public/sitemap-products.xml` and `public/sitemap-images-products.xml`.
- Postbuild collected 415 canonical candidates, retained 380 indexable pages after 35 existing redirect-source exclusions, and emitted 131 product, 190 location, one project and 58 editorial URLs.
- The image sitemap contains 5,560 page/image associations and 3,958 unique images across 380 pages. Expandable Container Office and its valid primary image are present.

### Internal links

- Added Expandable Container Office to the Container Offices family rail. The rendered hub anchor includes the exact child name.
- Preserved the Office page's natural links back to `/product/container-offices`.
- Removed Accommodation from the Labour Colony family rail.
- Removed the two draft roofing-sheet links from the Roofing Sheet hub.
- The built crawl checked 41,881 internal-link occurrences and 351 unique internal targets. No target returned a redirect or error, and no incoming link to a planned or draft route was found.

### Structured data

- Enabled the standard ItemPage/Product/Breadcrumb output for Expandable Container Office by removing its product-only override.
- Verified exactly one Product and one BreadcrumbList for the published Office page, including a valid 200 primary image.
- Draft and planned routes return 404 before product props are assembled and emit no public Product schema.
- No content facts, offers, ratings or review claims were added or rewritten.

## Automated regression coverage

`scripts/validate-rb01c-publication-gate.mjs`, exposed as `npm run validate:publication-gate`, proves all 13 required conditions against a running production build:

1. Accommodation returns 404 while draft.
2. Accommodation is absent from product and image sitemaps.
3. Accommodation emits no public Product schema.
4. Expandable Container Office returns 200 without redirect.
5. The Office page is self-canonical, index/follow, uniquely titled/described and has exactly one H1.
6. The Office page appears in product and image sitemaps and has a valid primary image.
7. The Container Offices hub links to it with child-specific anchor text, and the child links back.
8. Expandable Container House returns 404.
9. Expandable Container House is absent from sitemaps and public discovery.
10. Every current draft record returns 404 and emits no Product schema through direct lookup.
11. All 61 approved routes return 200.
12. Temporary 63-URL branch ancestry and its three implementation files are absent.
13. All rendered sitemap-page internal targets return direct 200, so no new internal redirect/error link or redirect chain is introduced.

## Validation results

| Validation | Result |
|---|---|
| Required base and branch isolation | Pass: worktree started at exact `92a7d907`; temporary 63 branch is not an ancestor |
| `npm run validate:commercial-architecture:release` | Pass: 61 approved, 43 planned, one retained planned draft record |
| Planned-release fixture | Pass: 43/43 return 404 with no redirect |
| Approved-live fixture | Pass: 61/61 return 200 with no redirect |
| Direct draft-route regression | Pass: Accommodation, Metal and PVC return 404 with no Product schema |
| `npm run type-check -- --pretty false` | Pass |
| `npm run lint` / build lint stage | Pass with five unchanged warnings, reported below |
| `npm run build` | Pass; optimized production build and postbuild generation complete |
| Sitemap generation | Pass: 415 candidates, 380 indexable URLs, 35 existing redirect exclusions |
| XML validation | Pass: all nine `public/sitemap*.xml` files parsed as XML; no `undefined` output |
| Publication-gate crawl | Pass: 380 sitemap pages, 41,881 internal link occurrences, 351 unique targets, zero redirect/error targets |
| Canonical/indexability | Pass for approved Office; all planned/draft routes are real 404s |
| Structured data | Pass: Office Product/Breadcrumb present and parseable; draft Product schema absent |
| Image manifest and image sitemap | Pass: manifest JSON parsed; Office present; primary image 200; planned/draft URLs absent from image sitemap |
| CO-08 locked copy validator | Pass: all measured metadata, content, readability, zero-dash, image and specification gates |
| CO-08 built-output verifier | Pass: 63 rendered images and all copy, asset, price, canonical, link and no-rating checks |

### Existing warnings retained and not suppressed

The four requested price-calculator React Hook warnings remain visible:

- `src/pages/product/container-offices/site-office-container.tsx:480` missing `product?.name` dependency.
- `src/pages/product/container-offices/site-office-container.tsx:499` missing `product?.name` dependency.
- `src/pages/product/[category]/index.tsx:587` missing `product?.name` dependency.
- `src/pages/product/[category]/index.tsx:606` missing `product?.name` dependency.

One separate pre-existing warning remains at `src/pages/product/[category]/[slug].tsx:280` for a raw `<img>`. The existing custom-route warning also remains at 1,008 redirects, six headers and two rewrites. RB-01C did not suppress or remediate these warnings.

## Files changed

The implementation changes 87 paths, grouped as follows:

- Shared lifecycle and route enforcement: `src/lib/staticContent.ts`, the generic product route, and the two dedicated draft roofing routes.
- Architecture/discovery: `commercialArchitecture.json`, `sitemapCanonicalPaths.json`, the Container Offices and Labour Colony rails, and the Roofing Sheet hub.
- CO-08 unchanged approved implementation package: six control files under `content/co-08`, 56 images under `public/images/products/expandable-container-office`, one technical PDF, product/source data, content module, variant hero types/content, and calculator ladder data.
- Schema/render behavior: `src/data/products/expandable-container-office.json` and the generic product page.
- Validation/build tooling: `package.json`, `scripts/validate-rb01c-publication-gate.mjs`, `scripts/validate-commercial-architecture.js`, `scripts/generate-segmented-sitemaps.mjs`, `scripts/verify-co-08-build.py` and `scripts/design-lock.py`.
- Generated output: `public/sitemap-products.xml` and `public/sitemap-images-products.xml`.
- Evidence: this report.

## Temporary 63-URL containment confirmation

`seo/remediation-temporary-63-gating` is not in this branch's ancestry. These implementation files remain absent:

- `src/data/seo/unapprovedCommercialGating.json`
- `src/lib/unapprovedCommercialGating.ts`
- `scripts/validate-unapproved-commercial-gating.js`

No blanket 63-URL `X-Robots-Tag`, noindex, listing, discovery, schema or sitemap suppression was imported. The gate evaluates publication status for all product records and lifecycle authorization only for the approved/planned architecture fixture. It does not assign permanent dispositions to the 63 unapproved URLs.

## Remaining blockers and risks

- Production is unchanged because RB-01C was not deployed. Until a separately authorized release, the current live draft/planned contradictions remain live.
- Permanent dispositions for the 63 unapproved indexable commercial URLs remain a separate owner-approved workstream.
- Previously identified live-production remediation still needs controlled release/verification where applicable: internal redirect/error links, approved sitemap gaps, redirect chains and retired portable-cabin links. The RB-01C local release-candidate crawl itself has zero internal redirect/error targets.
- Incorrect freight/schema facts, real form-delivery testing and commercial-template performance remediation were explicitly not started.
- Metal and PVC remain source drafts and public 404s under the shared rule, but their permanent product dispositions remain part of the separate unapproved-URL workstream.
- The production bundle still reports approximately 580-583 kB first-load JavaScript for commercial product templates. This pre-existing performance risk is unchanged.
- Local development preview can render drafts on loopback by design. Production runtime cannot enable that behavior.

## Rollback procedure

No production rollback is currently required because nothing was deployed.

To undo the branch before release, discard the branch/worktree or revert the single RB-01C commit. If it is later deployed, revert `fix(seo): enforce approved product publication gate`, rebuild, regenerate sitemaps and image manifest, rerun the publication fixture/crawl, and deploy the reverted artifact. That restores the prior lifecycle fixture, CO-08 source state, rails, draft route behavior and generated sitemap artifacts as one atomic rollback.

## Stop condition

Implementation, automated tests, this report and the requested single commit are the complete RB-01C scope. **Do not deploy.** Do not begin freight-copy remediation, performance work, real form-delivery testing or permanent 63-URL dispositions from this branch.
