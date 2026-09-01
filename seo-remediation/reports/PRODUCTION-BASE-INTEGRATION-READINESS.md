# Production-base integration readiness

Assessment completed: 2026-08-26 IST

Controlled branch: `seo/remediation-production-base-integration`

Integrated lineage before the final checkpoint: `fde109cb`; this report is stored in the final reviewed checkpoint commit

Production deployment performed: no

## Verdict

**Conditionally ready for staging verification only. Not ready for production promotion.**

The production base, all 14 feature-missing product records, the RB-01C lifecycle decisions, the planned-release gate, and the reversible 63-path controls are integrated. Build and strict release validation pass. Staging is still required for form delivery and post-deployment crawler evidence. The combined crawl also exposes 138 internal links to 42 temporarily gated 200/noindex targets; these remain an owner-disposition blocker and were not silently rewritten.

## Production base and integration method

| Item | Result |
|---|---|
| Production/release branch | `origin/static-migration` |
| Current production commit | `4fcb0d089404ecc966d343df89bdd74ecd8ddf44`, merge of CO-08 |
| Earlier base confirmed to contain the 14 records | `82d0730e1dd9af7a9959525176d5f2ab95494fc2` |
| Incomplete feature checkout | `feature/llms-txt` at `296082c64db2332d9bfb4d0febcd192a34463d59` |
| Integration branch | `seo/remediation-production-base-integration` |
| Safety ref | `backup/seo-remediation-production-integration-pre-20260825` at `8245b89a` in the isolated repository |
| Method | Fast-forward to reviewed RB-01C, reviewed three-way merge of production, reviewed three-way merge of temporary 63-path controls, then a validation/report checkpoint |
| History compatibility | Pass: current production and temporary-gating tips are both ancestors of the integrated head |
| Source worktree impact | None. Managed permissions denied source `.git` writes, so integration used `tmp/seo-integration-worktree` with metadata at `tmp/seo-integration-repo-meta`. |

### Conflicts resolved

1. Production merge: two CO-08 add/add conflicts.
   - Preserved all production facts, variants, prices, images, drawings, PDF, and content assets.
   - Preserved owner-approved RB-01C `publish` status for Expandable Container Office.
   - Preserved RB-01C standard Product plus Breadcrumb schema behavior instead of restoring the deployed `productOnly` override.
2. Temporary-gating merge: `package.json`, image-manifest collector, sitemap generator, `staticContent`, and two generated product sitemap files.
   - Composed both lifecycle gates.
   - Kept product-category archives out of commercial sitemaps.
   - Regenerated XML from source instead of hand-merging generated artifacts.
3. Combined validation found eight dedicated/static gated templates bypassing the shared schema component.
   - Added data-driven suppression for their Product, FAQ, and breadcrumb JSON-LD only.
   - No visible copy or product fact changed.

## Fourteen production records preserved

All 14 authoritative `src/data/wp-export/products` blobs match production commit `4fcb0d08` exactly.

| Record | Source file | Status |
|---|---|---|
| BESS Container | `bess-container.json` | `publish`, exact production blob |
| Containerized Data Center | `containerized-data-center.json` | `publish`, exact production blob |
| Container Marketing Office | `container-marketing-office.json` | `publish`, exact production blob |
| Multi-Toilet Ablution Block | `ablution-block.json` | `publish`, exact production blob |
| Accommodation Container | `accommodation-container.json` | `draft`, exact production blob and publicly gated |
| Oil Field Camp | `oil-field-camp.json` | `publish`, exact production blob |
| Prefab Site Canteen | `prefab-site-canteen.json` | `publish`, exact production blob |
| Double Story Porta Cabin | `double-story-porta-cabin.json` | `publish`, exact production blob |
| Fire-Rated Porta Cabin | `fire-rated-porta-cabin.json` | `publish`, exact production blob |
| GI Porta Cabin | `gi-porta-cabin.json` | `publish`, exact production blob |
| Knock-Down Porta Cabin | `knock-down-porta-cabin.json` | `publish`, exact production blob |
| PUF Porta Cabin | `puf-porta-cabin.json` | `publish`, exact production blob |
| Skid-Mounted Porta Cabin | `skid-mounted-porta-cabin.json` | `publish`, exact production blob |
| Soundproof Porta Cabin | `soundproof-porta-cabin.json` | `publish`, exact production blob |

No approved published record was deleted or recreated manually.

## Architecture, sitemap, and redirect totals

| Metric | Result |
|---|---:|
| Approved/live architecture paths | 61 |
| Planned/unpublished architecture paths | 43 |
| Approved routes returning direct 200 | 61/61 |
| Planned routes returning 404 | 43/43 |
| Temporary paths | 63 |
| Temporary 200/noindex-follow paths | 60 |
| Stricter temporary exclusions | 3: two draft 404s and one product-category archive excluded from input |
| Canonical sitemap candidates after temporary exclusion | 356 |
| Indexed page sitemap URLs | 321 |
| Product sitemap URLs | 72 |
| Location sitemap URLs | 190 |
| Project sitemap URLs | 1 |
| Editorial sitemap URLs | 58 |
| Image sitemap page associations | 4,179 |
| Unique sitemap images | 3,220 |
| Planned URLs in page/image sitemaps | 0 |
| Temporary URLs in page/image sitemaps | 0 |
| Product-category archive locs | 0 |
| Undefined sitemap/image locs | 0 |
| Configured redirect rules from `redirects()` | 1,005 |
| Literal redirect chains | 0 |
| Duplicate redirect sources | 0 |
| Non-permanent explicit redirect rules | 0 |
| Approved URLs observed as redirect sources | 0; all 61 return direct 200 |

The general redirect checker prints two non-chain loop warnings: trailing-slash normalization for `/product/labor-colony/` and the generic `/:path+/` normalizer. Targeted C-06 validation reports zero relevant chains and the running approved-route fixture confirms direct 200 behavior. These warnings are reported, not suppressed.

## Validation results

| Validation | Result |
|---|---|
| `validate:commercial-architecture:release` | Pass: 61 approved, 43 planned, one retained planned draft record |
| Approved/planned route fixture | Pass: 61 direct 200; 43 true 404 |
| Temporary commercial gate | Pass: 63 exact paths, zero approved/planned overlap, three stricter exclusions preserved |
| Temporary runtime fixture | Pass: 63 checked; sitemap and Product-schema exclusions pass |
| TypeScript | Pass |
| Lint | Pass with four hook warnings and one separate raw-image warning |
| Production build | Pass |
| Sitemap generation | Pass: 356 candidates, 321 indexed |
| XML validation | Pass: all nine sitemap XML files parse |
| Redirect validation | Pass for chains/duplicates/permanence; two known normalizer loop warnings remain |
| Canonical/indexability | Pass through 61 approved and 43 planned fixture checks |
| Indexed internal-link crawl | Pass: 31,793 occurrences, 333 unique targets, zero redirect/error targets |
| Temporary-target link inventory | Open: 138 occurrences to 42 gated targets |
| Form contracts | Pass in source/SSR: four POST actions and named controls; delivery not tested |
| Image manifest | Pass: JSON parses, 356 pages, 5,606 entries |
| Image locations | Pass: zero `undefined`; CO-08 primary/assets validated by RB-01C controls |

### Pre-existing warnings

Four price-calculator/product-category hook warnings are unchanged:

1. `site-office-container.tsx:480`, missing `product?.name` dependency.
2. `site-office-container.tsx:499`, missing `product?.name` dependency.
3. `src/pages/product/[category]/index.tsx:593`, missing `product?.name` dependency.
4. `src/pages/product/[category]/index.tsx:612`, missing `product?.name` dependency.

Separate warnings:

- one raw `<img>` warning at `src/pages/product/[category]/[slug].tsx:281`;
- build warning for more than 1,000 custom routes: 1,008 reported by Next build, while `redirects()` returns 1,005 rules plus six headers and two rewrites;
- commercial product templates remain about 581 to 583 kB first-load JavaScript.

## Changed-file inventory and categories

### Reports and tracking

- `seo-remediation/progress.md`
- `seo-remediation/reports/AHREFS-BASELINE-2026-08-24.md`
- `seo-remediation/reports/AUDIT-SEVERITY-REPORT-2026-08-25.md`
- `seo-remediation/reports/CURRENT-CHANGE-RISK-CLASSIFICATION.md`
- `seo-remediation/reports/CURRENT-REMEDIATION-CHECKPOINT.md`
- `seo-remediation/reports/IMPLEMENTATION-BACKLOG-2026-08-25.md`
- `seo-remediation/reports/PRODUCTION-BASE-IDENTIFICATION.md`
- `seo-remediation/reports/PRODUCTION-BASE-INTEGRATION-READINESS.md`
- `seo-remediation/reports/PRODUCTION-READINESS-REPORT-2026-08-25.md`
- `seo-remediation/reports/RB-01-PUBLICATION-STATUS-RECONCILIATION.md`
- `seo-remediation/reports/RB-01C-PUBLICATION-GATE-IMPLEMENTATION.md`
- `seo-remediation/reports/UNAPPROVED-COMMERCIAL-URL-DISPOSITION.csv`
- `seo-remediation/reports/UNAPPROVED-COMMERCIAL-URL-DISPOSITION.md`

### Sitemap and discovery

- `public/sitemap-products.xml`
- `public/sitemap-images-products.xml`
- `scripts/collect-image-manifest.mjs`
- `scripts/generate-segmented-sitemaps.mjs`
- `src/lib/sitemapCanonicalPaths.json`
- `src/pages/api/dynamic-sitemap.xml.ts`
- `src/components/CategoryGrid.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/data/seo/unapprovedCommercialGating.json`
- `src/lib/unapprovedCommercialGating.ts`

The build also regenerated these seven tracked sitemap XML files to their production-equivalent content:

- `public/sitemap.xml`
- `public/sitemap-editorial.xml`
- `public/sitemap-locations.xml`
- `public/sitemap-projects.xml`
- `public/sitemap-images-editorial.xml`
- `public/sitemap-images-locations.xml`
- `public/sitemap-images-projects.xml`

It generated ignored `public/image-manifest.json` for validation.

### Routing and redirects

- `next.config.js`
- `src/middleware.ts`
- `src/pages/product/[category]/[slug].tsx`
- `src/pages/product/[category]/index.tsx`
- `src/pages/product/roofing-sheet.tsx`
- `src/pages/product/roofing-sheet/metal-roofing-sheet.tsx`
- `src/pages/product/roofing-sheet/pvc-roofing-sheet.tsx`

### Internal links

- `src/lib/blogContentCluster.ts`
- `src/lib/breadcrumbs.ts`
- `src/lib/categoryHubMap.ts`
- `src/lib/containerOfficeClusterRail.ts`
- `src/lib/labourColonyClusterRail.ts`
- `src/lib/staticContent.ts`
- `src/components/product-variant-hero/presets.ts`

### Schema and verified data behavior

- `src/components/ProductStructuredData.tsx`
- `src/lib/schema.ts`
- `src/lib/verifiedCommercialFacts.ts`
- `src/data/products/expandable-container-office.json`
- `src/data/wp-export/products/expandable-container-office.json`
- `src/pages/product/puf-panel/cold-storage-puf-panel.tsx`
- `src/pages/product/puf-panel/puf-panel-house.tsx`
- `src/pages/product/puf-panel/puf-panel-price.tsx`
- `src/pages/product/puf-panel/puf-panel-roofing.tsx`
- `src/pages/product/puf-panel/puf-panel-specification.tsx`
- `src/pages/product/puf-panel/puf-sandwich-panel.tsx`
- `src/pages/product/sandwich-panel.tsx`
- `src/pages/product/wall-sheet.tsx`

### Forms

- `src/components/ContactCTA.tsx`
- `src/components/EnquiryDialog.tsx`
- `src/components/QuoteForm.tsx`
- `src/components/ReviewForm.tsx`

### Performance / DOM-preserving implementation

- `src/components/ProductStructuredData.tsx`
- `src/pages/product/[category]/[slug].tsx`

No new content-led ProductTabs rewrite was introduced. The existing schema/DOM reduction is preserved, while customer-facing freight/performance copy remains gated.

### Validation and testing

- `package.json`
- `scripts/validate-commercial-architecture.js`
- `scripts/validate-rb01c-publication-gate.mjs`
- `scripts/validate-unapproved-commercial-gating.js`
- `src/data/seo/commercialArchitecture.json`

## Tiny Container Homes and remaining blockers

The retained audit evidence records 11 Tiny Container Homes source-content link occurrences. The final New Approved plan still owns Tiny Container Homes as a separate future page intent. It remains unpublished and must not be permanently merged into Shipping Container Homes. The current indexed crawl has zero redirect/error target edges, but the 11 audited source occurrences remain held until Claude-approved differentiated content and verified owner facts/assets support publication or a specific link decision.

Remaining blockers:

1. Review 138 rendered links to 42 temporary 200/noindex targets against the 63-row owner register. No permanent change was made.
2. Run form delivery, validation, analytics, and downstream CRM/email/webhook tests on staging with an approved test identity.
3. Obtain the Ahrefs URL export and re-crawl staging for AH-001 through AH-020. Screenshot counts alone cannot close rows.
4. Keep Tiny Container Homes, freight source-copy, and content-led performance changes in their Claude/owner gates.
5. Track, but do not suppress, the hook, raw-image, custom-route, and commercial-template performance warnings.

## Rollback

No production rollback is required because no deployment occurred.

For branch-level rollback without destructive reset:

1. Create a new rollback branch from `backup/seo-remediation-production-integration-pre-20260825` at `8245b89a` in the isolated repository.
2. Do not move or force-update the integration branch.
3. If staging has been deployed, redeploy the prior staging artifact first.
4. To remove only the latest integration work while retaining audit history, revert the final checkpoint commit, then revert merge `fde109cb` with mainline parent 1 and merge `42b468a7` with mainline parent 1 in a new branch; review generated sitemap output before any redeploy.
5. Re-run strict architecture, build, publication, XML, redirect, link, form, and image checks on the rollback candidate.

The original dirty `feature/llms-txt` checkout and its verified external checkpoint remain untouched.

## Staging recommendation

Deploy only to an access-controlled staging environment if the purpose is to verify forms, crawler output, and the temporary-link inventory. Do not promote this candidate to production until the 138 gated-target links have an owner-approved handling decision and staging evidence is attached. Do not begin AH remediation, publish planned pages, or make permanent 63-row dispositions as part of that staging deployment.
