# STG-01A production-delta reconciliation

Date: 2026-08-26

Branch: `seo/stg-01a-reviewed-production-delta`

Latest production base: `3346a532306c52932aeb2d813591bf95cb37716b`

Validated integration: `60b494b7cfce92d920787a326f03ae2a1ff43ed3`

Recommendation: **BLOCKED**

## Executive result

The validated SEO integration was replayed from the latest production base and the only content conflict, `src/lib/containerOfficeClusterRail.ts`, was manually reconciled under the STG-01A ownership rules. All eight latest-production children remain, Expandable Container Office is added exactly once, and the shared publication and exact temporary-gating filters remain intact.

Architecture, publication, route, canonical, rail, build, sitemap, XML, redirect, image, form-contract and internal-crawl checks pass. A stricter rendered structured-data presence check found seven approved pages with missing required schema nodes, including missing Breadcrumb schema on three retained Container Office children. This is byte/history-equivalent to the validated integration outside the rail and therefore is not a reconciliation regression, but the instruction requires all validation to pass before remote review. The branch is preserved locally and is not pushed; no draft PR is created.

## Latest production-base verification

- `git fetch origin --prune` completed in the clean clone.
- `origin/static-migration` remained exactly `3346a532306c52932aeb2d813591bf95cb37716b`.
- The clean clone had no uncommitted files before replay.
- The reviewed branch was created directly from `3346a532`, not from the prior base or original feature checkout.
- The original dirty checkout was not readied, reset, cleaned, stashed, switched or modified.

## Production delta and conflict cause

The complete `4fcb0d08` to `3346a532` production delta contains one changed file:

| File | Production change |
|---|---|
| `src/lib/containerOfficeClusterRail.ts` | Expanded the primary Container Offices rail from three children to eight; retained production ordering, missing-record diagnostics, the specific Shipping Container Office tile label, and expanded YMAL blurbs. |

The validated `60b494b7` tree changed the same keep list by adding `expandable-container-office` to the earlier three-child version. Git correctly raised one content conflict in that array. No other file conflicted.

## Three-version rail matrix

Full evidence: `seo-remediation/reports/STG-01A-CONTAINER-OFFICE-RAIL-MATRIX.md`.

| Child | Old base primary rail | Latest production primary rail | Validated integration primary rail | Final decision |
|---|---:|---:|---:|---|
| Container Office Cabin | Yes | Yes | Yes | `KEEP_PRODUCTION_CHILD` |
| Shipping Container Office | Yes | Yes | Yes | `KEEP_PRODUCTION_CHILD` |
| Site Office Container | Yes | Yes | Yes | `KEEP_PRODUCTION_CHILD` |
| Flat-Pack Container Office | No | Yes | No | `KEEP_PRODUCTION_CHILD` |
| Multi-Story Container Office | No | Yes | No | `KEEP_PRODUCTION_CHILD` |
| Containerized Data Center | No | Yes | No | `KEEP_PRODUCTION_CHILD` |
| BESS Container | No | Yes | No | `KEEP_PRODUCTION_CHILD` |
| Container Marketing Office | No | Yes | No | `KEEP_PRODUCTION_CHILD` |
| Expandable Container Office | No | No | Yes | `ADD_EXPANDABLE_CONTAINER_OFFICE` |

Every row is in the approved Container Offices family and approved-production fixture, has a source record with `publish` status, is absent from the planned fixture and temporary 63-path gate, returns direct 200, and is self-canonical/indexable. No row required an exclusion or `REVIEW_REQUIRED` rail disposition.

## Exact rail resolution

Latest production was the structural starting point. Relative to `3346a532`, the resolved rail file has exactly one semantic source change: one `expandable-container-office` entry appended to the primary keep list.

Preserved from latest production:

- all eight active approved children;
- production order/grouping;
- missing-record development diagnostics;
- Shipping Container Office's specific tile label;
- all expanded YMAL descriptions and ordering.

Preserved from the validated integration:

- Expandable Container Office as approved/live and present exactly once;
- shared published-status and approved/planned lifecycle enforcement;
- exact temporary 63-path listing/discovery filtering;
- redirect-source exclusion before rail ordering;
- approved direct-link behavior.

No alias, redirect, product-category archive, planned child, draft child, gated child or duplicate child was introduced. The generated product-image sitemap gained 29 associations for images now rendered through the expanded approved rail; its page count remains 72.

## Architecture and lifecycle results

| Check | Result |
|---|---|
| Approved/live fixture | Pass: 61 |
| Planned/unpublished fixture | Pass: 43 |
| Draft records | Pass: 3; all public 404 |
| Approved routes | Pass: 61/61 direct 200 |
| Planned routes | Pass: 43/43 true 404, no redirect |
| Temporary 63-path gate | Pass: 63 exact paths, zero approved/planned overlap |
| Temporary runtime behavior | Pass: 60 direct 200/noindex-follow plus 3 stricter 404 exclusions |
| Gated schema/sitemap behavior | Pass: Product schema suppressed where required; all gated paths absent from both sitemap surfaces |

## Container Office rail validation

`npm run validate:container-office-rail -- --base-url=http://127.0.0.1:3210` passed:

- nine unique primary children in reviewed order;
- every destination direct 200 with no redirect;
- every destination self-canonical and `index, follow`;
- no planned, draft, temporarily gated, unapproved or product-category destination;
- all children belong to the approved Container Offices family;
- Expandable, Multi-Story and Flat-Pack each occur exactly once;
- child-specific hub labels are present;
- every included child links back to `/product/container-offices`;
- no rail destination introduces a redirect/error target.

## Full validation results

| Validation | Result |
|---|---|
| `validate:commercial-architecture:release` | Pass: 61 approved, 43 planned, one retained planned draft record |
| `validate:publication-gate` | Pass |
| `validate:temporary-commercial-gating` | Pass: 63 exact paths, no approved/planned overlap, three stricter exclusions |
| TypeScript | Pass |
| Lint | Pass with the four existing Hook warnings and one raw-image warning |
| Production build | Pass |
| Sitemap/image-manifest generation | Pass: 356 candidates, 321 indexable |
| XML validation | Pass: nine sitemap XML files parse and contain no `undefined` location |
| Redirect validation | Pass: 1,005 configured rules, zero duplicates, zero chains, zero non-permanent rules; two known normalizer loop reports retained |
| Canonical/indexability | Pass through the 61 approved and 43 planned runtime fixture plus all nine rail children |
| Image manifest | Pass: schema v1, 356 pages, 5,606 entries, zero `undefined` entries |
| Form contracts | Pass: four source POST actions/named controls; Quote form SSR contract confirmed on `/contact`; delivery not exercised |
| Indexed internal-link crawl | Pass: 321 pages, 31,841 occurrences, 338 unique targets, zero redirect/error edges |
| Temporary-target link inventory | Unchanged open item: 138 occurrences to 42 gated targets |
| Rail-specific validation | Pass: nine approved children and all 14 required assertions |
| Strict structured-data presence | **Fail/blocker:** valid JSON-LD syntax everywhere, but seven approved pages lack required Product or Breadcrumb nodes |

### Structured-data blocker

All 61 approved pages emitted parseable JSON-LD and no Product schema URL mismatched its approved canonical. However:

Missing Product schema:

- `/product/labor-colony/labor-sheds`
- `/product/labor-colony/prefab-site-canteen`
- `/product/rockwool-panel`
- `/product/security-cabins/frp-security-cabin`

Missing Breadcrumb schema:

- `/product/container-offices/site-office-container`
- `/product/container-offices/flat-pack-container-office`
- `/product/container-offices/multi-story-container-office`

All nine Container Office rail children have one Product node; six have one Breadcrumb node and the three listed above have none. No schema or affected template file differs between the candidate and `60b494b7`; the reconciliation-specific diff is limited to the rail, its generated image-sitemap consequence, the validator, package script and reports. The gap is therefore pre-existing, but it prevents the required all-green status. It was not fixed because STG-01A authorizes rail reconciliation only.

## Sitemaps, crawl and build totals

| Metric | Result |
|---|---:|
| Product page sitemap | 72 |
| Location page sitemap | 190 |
| Project page sitemap | 1 |
| Editorial page sitemap | 58 |
| Indexed page total | 321 |
| Image sitemap page associations | 4,208 |
| Unique sitemap images | 3,220 |
| Internal link occurrences | 31,841 |
| Unique internal targets | 338 |
| Redirect/error edges in indexable set | 0 |
| Configured redirect rules | 1,005 |
| Literal redirect chains | 0 |

The Next build warning reported more than 1,000 custom routes and displayed six headers, two rewrites and 1,008 normalized redirect routes; direct config inspection returned 1,005 configured redirect rules.

## Preserved production records

All 14 previously protected `src/data/wp-export/products` blobs are byte-equivalent to `3346a532` in the candidate:

| Record | Production blob | Candidate blob | Result |
|---|---|---|---|
| BESS Container | `b092a9c9` | `b092a9c9` | Exact |
| Containerized Data Center | `6a80d9b2` | `6a80d9b2` | Exact |
| Container Marketing Office | `744d0f40` | `744d0f40` | Exact |
| Multi-Toilet Ablution Block | `de240f8c` | `de240f8c` | Exact |
| Accommodation Container | `486a94c3` | `486a94c3` | Exact |
| Oil Field Camp | `6fe6f679` | `6fe6f679` | Exact |
| Prefab Site Canteen | `738786c1` | `738786c1` | Exact |
| Double Story Porta Cabin | `74c8ddf2` | `74c8ddf2` | Exact |
| Fire-Rated Porta Cabin | `95ad2866` | `95ad2866` | Exact |
| GI Porta Cabin | `d67a1621` | `d67a1621` | Exact |
| Knock-Down Porta Cabin | `22c9feb0` | `22c9feb0` | Exact |
| PUF Porta Cabin | `6cfa384b` | `6cfa384b` | Exact |
| Skid-Mounted Porta Cabin | `c654859d` | `c654859d` | Exact |
| Soundproof Porta Cabin | `eb98bc2c` | `eb98bc2c` | Exact |

## Production-delta safety review

| Comparison | Result |
|---|---|
| `3346a532` to candidate | 63 files after this report; complete validated integration plus reviewed rail/test/report changes |
| `4fcb0d08` to `3346a532` | One file: `src/lib/containerOfficeClusterRail.ts` |
| `4fcb0d08` to `60b494b7` | 60 files |
| Candidate versus `60b494b7` before this report | Five files: package script, rail, regenerated product-image sitemap, rail validator and rail matrix |
| Latest production rail versus candidate | One source line added: `expandable-container-office`; all latest-production lines retained |
| Newer production records/assets/routes/forms/sitemaps/templates | No production delta outside the rail existed to overwrite; 14 protected records compare byte-for-byte |

## Complete changed-file list (`3346a532` to candidate)

1. `next.config.js`
2. `package.json`
3. `public/sitemap-images-products.xml`
4. `public/sitemap-products.xml`
5. `scripts/collect-image-manifest.mjs`
6. `scripts/generate-segmented-sitemaps.mjs`
7. `scripts/validate-commercial-architecture.js`
8. `scripts/validate-container-office-rail.mjs`
9. `scripts/validate-rb01c-publication-gate.mjs`
10. `scripts/validate-unapproved-commercial-gating.js`
11. `seo-remediation/progress.md`
12. `seo-remediation/reports/AHREFS-BASELINE-2026-08-24.md`
13. `seo-remediation/reports/AUDIT-SEVERITY-REPORT-2026-08-25.md`
14. `seo-remediation/reports/CURRENT-CHANGE-RISK-CLASSIFICATION.md`
15. `seo-remediation/reports/CURRENT-REMEDIATION-CHECKPOINT.md`
16. `seo-remediation/reports/IMPLEMENTATION-BACKLOG-2026-08-25.md`
17. `seo-remediation/reports/PRODUCTION-BASE-IDENTIFICATION.md`
18. `seo-remediation/reports/PRODUCTION-BASE-INTEGRATION-READINESS.md`
19. `seo-remediation/reports/PRODUCTION-READINESS-REPORT-2026-08-25.md`
20. `seo-remediation/reports/RB-01-PUBLICATION-STATUS-RECONCILIATION.md`
21. `seo-remediation/reports/RB-01C-PUBLICATION-GATE-IMPLEMENTATION.md`
22. `seo-remediation/reports/STG-01A-CONTAINER-OFFICE-RAIL-MATRIX.md`
23. `seo-remediation/reports/STG-01A-PRODUCTION-DELTA-RECONCILIATION.md`
24. `seo-remediation/reports/UNAPPROVED-COMMERCIAL-URL-DISPOSITION.csv`
25. `seo-remediation/reports/UNAPPROVED-COMMERCIAL-URL-DISPOSITION.md`
26. `src/components/CategoryGrid.tsx`
27. `src/components/ContactCTA.tsx`
28. `src/components/EnquiryDialog.tsx`
29. `src/components/Footer.tsx`
30. `src/components/Header.tsx`
31. `src/components/ProductStructuredData.tsx`
32. `src/components/QuoteForm.tsx`
33. `src/components/ReviewForm.tsx`
34. `src/components/product-variant-hero/presets.ts`
35. `src/data/products/expandable-container-office.json`
36. `src/data/seo/commercialArchitecture.json`
37. `src/data/seo/unapprovedCommercialGating.json`
38. `src/data/wp-export/products/expandable-container-office.json`
39. `src/lib/blogContentCluster.ts`
40. `src/lib/breadcrumbs.ts`
41. `src/lib/categoryHubMap.ts`
42. `src/lib/containerOfficeClusterRail.ts`
43. `src/lib/labourColonyClusterRail.ts`
44. `src/lib/schema.ts`
45. `src/lib/sitemapCanonicalPaths.json`
46. `src/lib/staticContent.ts`
47. `src/lib/unapprovedCommercialGating.ts`
48. `src/lib/verifiedCommercialFacts.ts`
49. `src/middleware.ts`
50. `src/pages/api/dynamic-sitemap.xml.ts`
51. `src/pages/product/[category]/[slug].tsx`
52. `src/pages/product/[category]/index.tsx`
53. `src/pages/product/puf-panel/cold-storage-puf-panel.tsx`
54. `src/pages/product/puf-panel/puf-panel-house.tsx`
55. `src/pages/product/puf-panel/puf-panel-price.tsx`
56. `src/pages/product/puf-panel/puf-panel-roofing.tsx`
57. `src/pages/product/puf-panel/puf-panel-specification.tsx`
58. `src/pages/product/puf-panel/puf-sandwich-panel.tsx`
59. `src/pages/product/roofing-sheet.tsx`
60. `src/pages/product/roofing-sheet/metal-roofing-sheet.tsx`
61. `src/pages/product/roofing-sheet/pvc-roofing-sheet.tsx`
62. `src/pages/product/sandwich-panel.tsx`
63. `src/pages/product/wall-sheet.tsx`

## Warnings and environment

Existing warnings remain visible:

1. `site-office-container.tsx:480`: missing `product?.name` Hook dependency.
2. `site-office-container.tsx:499`: missing `product?.name` Hook dependency.
3. `src/pages/product/[category]/index.tsx:593`: missing `product?.name` Hook dependency.
4. `src/pages/product/[category]/index.tsx:612`: missing `product?.name` Hook dependency.
5. Raw `<img>` warning at `src/pages/product/[category]/[slug].tsx:281`.
6. More-than-1,000 custom-route build warning.
7. Commercial templates remain approximately 581 to 583 kB first-load JavaScript.

The repository declares Node 22/npm 10. Validation ran under the available Node 24.16.0/npm 11.13.0 and emitted `EBADENGINE`. `npm ci` also reported 45 dependency vulnerabilities (3 low, 22 moderate, 19 high and 1 critical). No dependency audit fix was attempted because it is outside STG-01A.

## Risk assessment

The rail reconciliation itself is low risk and fully evidenced: latest-production behavior is retained and one approved child is added. Publication and internal-link behavior are green. Overall staging-readiness risk remains high enough to block remote review because the strict required structured-data presence gate is not green, and the missing Breadcrumb nodes include two production-added children plus Site Office Container. Form delivery also remains untested, as expected from the earlier readiness report.

## Rollback procedure

Before any remote publication, abandon or delete only the local branch `seo/stg-01a-reviewed-production-delta`; `static-migration` and the original dirty checkout are unaffected. After a future remote push, rollback by reverting the reconciliation merge commit on the review branch, rebuilding, regenerating image and page sitemaps, and re-running architecture, publication, rail, XML, redirect, schema, image, form-contract and internal-crawl checks. Do not reset or clean the original feature checkout.

## Recommendation

**BLOCKED**

Do not push the review branch and do not create the draft PR yet. The next authorized task must decide whether STG-01A may include narrowly scoped Breadcrumb/Product schema fixes for the seven approved pages or whether those fixes must be handled as a separate prerequisite issue. No staging or production deployment is authorized.
