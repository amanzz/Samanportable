# SAMAN Portable SEO remediation progress

Updated: 2026-08-25 IST

Controlled branch: `seo/remediation-production-base-integration`

Current production base integrated: `origin/static-migration` at `4fcb0d089404ecc966d343df89bdd74ecd8ddf44`

Deployment: not performed

## Release state

| Area | State | Evidence / next gate |
|---|---|---|
| Production-base integration | Complete in isolated controlled repository | Production commit and temporary-gating branch are both ancestors of the integrated head. |
| Fourteen missing production records | Preserved | All 14 `wp-export` product blobs match production `4fcb0d08` exactly. |
| New Approved architecture | Preserved | Strict validator: 61 approved/live, 43 planned/unpublished. |
| Planned-release gate | Pass | 43/43 return 404; zero page/image sitemap membership. |
| Temporary 63-path control | Pass with link-review blocker | 60 return 200/noindex-follow; 3 stricter exclusions; zero sitemap/schema discovery. The crawl still finds 138 links to 42 gated targets. |
| Approved routes | Pass | 61/61 direct HTTP 200; no approved redirect source observed. |
| Internal redirect/error links | Pass on indexed crawl | 31,793 occurrences, 333 unique targets, zero redirect/error targets. |
| Redirect chains | Pass | 0 literal chains; two known checker false-positive loops reported separately. |
| Forms | Source/SSR contract pass | Four POST actions and named controls preserved; delivery requires staging. |
| Build and generated discovery | Pass | Build succeeds; 321 indexed sitemap URLs; 0 planned, gated, product-category, or undefined locs. |
| Production deployment | Prohibited | Stop at staging-readiness assessment. |

## Master remediation register

| ID | Classification / priority | Current state | Next action |
|---|---|---|---|
| SEO-001 | Planned release backlog | Architecture baseline was 45 new pages; two approved releases and the later owner decisions produce the validated 61/43 lifecycle fixture without changing page architecture. | Keep all 43 unpublished paths at 404 until the full publication gate passes. |
| SEO-002 | P0 governance | Exact 63-path temporary containment integrated; no permanent dispositions applied. | Owner reviews the row register; do not bulk redirect, publish, or retire. |
| SEO-003 | P0 | Tiny Container Homes remains unpublished and content/fact gated. Eleven audited source-content occurrences remain held in prior evidence; the current indexed crawl has no redirect/error edge to that URL. | Wait for Claude-approved differentiated content and verified owner facts/assets. |
| SEO-005 | P0 | False flat freight schema removed and known rendering normalized. | Verify approved freight facts and visible copy on staging; no invented freight claim. |
| SEO-006 | P1 | Approved sitemap additions preserved; all approved routes validated. | Re-crawl staging and confirm page/image sitemap uptake. |
| SEO-007 | P1 | 375 audited occurrences repointed; local indexed crawl has zero redirect/error targets. | Post-deployment verification; keep disposition-dependent gated links open. |
| SEO-008 | P1 | Retired Portable Cabin discovery links point directly to the approved hub. | Staging crawl verification. |
| SEO-011 | P1 | Seven audited redirect chains flattened; current literal chain count 0. | Verify the exact Ahrefs AH-007 URL after deployment. |
| SEO-013 | P1 | Existing DOM work preserved; product templates remain 581 to 583 kB first-load JS. | Dedicated performance work remains separate; do not start under this stop point. |
| SEO-014 | P1 | Shared form POST actions and names preserved. | Staging-only delivery test with approved test identity. |

## Ahrefs screenshot baseline

The complete row-level classification is in `reports/AHREFS-BASELINE-2026-08-24.md`. No AH item has been remediated in this integration task.

| ID | Count | Classification | Related audit | Current status |
|---|---:|---|---|---|
| AH-001 | 25 | Review item | SEO-002 | URL export required; intentional noindex must be separated from defects. |
| AH-002 | 3 | Post-deployment verification | SEO-006/007 | Re-crawl after integration deployment to staging. |
| AH-003 | 85 | Post-deployment verification | SEO-007/008 | Local indexed crawl has zero redirect/error targets. |
| AH-004 | 15 | Review item | SEO-006/007 | One inlink is not automatically defective. |
| AH-005 | 31 | Intentional condition pending review | SEO-011/008 | Validate correct one-hop legacy redirects. |
| AH-006 | 2 | Intentional condition | SEO-011 | Direct HTTP-to-HTTPS is acceptable. |
| AH-007 | 1 | Post-deployment verification | SEO-011 | Local literal chain count is zero. |
| AH-008 | 1 | Confirmed defect pending URL | Unmapped | Obtain URL export. |
| AH-009 | 98 | Review item | Unmapped content cohort | No content rewrite authorized. |
| AH-010 | 1 | Review item | Unmapped content cohort | No content rewrite authorized. |
| AH-011 | 1 | Review item | Unmapped content cohort | No title rewrite authorized. |
| AH-012 | 42 | Review item | Unmapped | Google title rewrites are not automatic defects. |
| AH-013 | 5 | Confirmed defect pending URL | Unmapped social metadata | Obtain URL export. |
| AH-014 | 1 | Confirmed defect pending URL | Unmapped canonical/social metadata | Obtain URL export. |
| AH-015 | 7 | Confirmed defect pending URL | Unmapped social metadata | Obtain URL export. |
| AH-016 | 77 | Post-deployment verification | SEO-013 | Performance work not started. |
| AH-017 | 8 | Review item | SEO-013 | Obtain exact image URLs before recompression. |
| AH-018 | 1 | Confirmed defect pending URL | Unmapped image defect | Obtain page and image URL. |
| AH-019 | 19 | Review item | Unmapped image/accessibility | Separate decorative empty alt from missing informative alt. |
| AH-020 | 375 | Intentional condition / verification | SEO-006 | Ordinary plus image sitemap overlap is allowed. |

## Stop point

No production deployment, AH remediation, content rewrite, planned-page publication, or permanent 63-row disposition is authorized from this register.
