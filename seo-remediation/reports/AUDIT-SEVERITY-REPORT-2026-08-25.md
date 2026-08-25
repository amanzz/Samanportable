# SAMAN SEO audit severity report

Updated: 2026-08-25  
Production base: `origin/static-migration` at `82d0730e`  
Architecture authority: final New Approved plan, unchanged

## Classification correction

SEO-001 is **PLANNED RELEASE BACKLOG**, not a P0 production-defect count. The accepted 2026-08-24 baseline contained 45 approved `New` URLs that were intentionally unpublished, absent from sitemaps and internal links, outside the repository allowlist, and without published product data.

The production base has since changed: Multi-Story Container Office and Flat-Pack Container Office now have publish-status records and live HTTP 200 pages. They remain in the locked 45-path plan fixture, so the original cohort is no longer uniformly unpublished. This is a release-governance conflict, not authority to remove the pages, change the plan, or silently redefine the cohort. Strict release validation remains failed until the owner reconciles those two post-audit publications.

The remaining planned URLs must stay 404 and disconnected. No sitemap, image sitemap, navigation, rail, schema, feed, internal link, placeholder, or unrelated redirect is allowed before the full family/page publication gate passes.

## Active findings

| ID | Severity/class | Current state | Release effect |
|---|---|---|---|
| SEO-001 | PLANNED RELEASE BACKLOG | 45-path baseline retained; two paths were published after the audit | **BLOCKING reconciliation**; do not unpublish or change architecture without owner ruling |
| SEO-002 | P0 | 63 live 200/indexable commercial URLs remain in current product and image sitemaps; row-level register complete | Temporary exact-path containment is isolated on `seo/remediation-temporary-63-gating`; permanent dispositions remain owner-only |
| SEO-003 | P0 | Tiny Container Homes still lacks its approved differentiated owner page | WAITING_CLAUDE and owner publication approval |
| SEO-005 | P0 | False global flat-freight Offer schema removed; known ₹3,000 render/schema phrases normalized | Source-record rewrite and shared visible Shipping-panel replacement remain WAITING_CLAUDE/OWNER facts |
| SEO-006 | P1 | Six verified approved pages added to sitemap inputs; Accommodation Container held because its source record is `draft` | **BLOCKING owner publication-state reconciliation** for the seventh page |
| SEO-007 | P1 | 375/386 audited bad-link occurrences covered by 17 verified shared mappings | Remaining 11 Tiny Container Homes links are content/release gated |
| SEO-008 | P1 | Retired Portable Cabin shared links point directly to the approved Porta Cabins destinations | Targeted recrawl pending |
| SEO-011 | P1 | Seven Container House legacy sources now point directly to their verified final destinations | Build and HTTP redirect verification pending |
| SEO-013 | P1 | No performance change included in the initial release candidate | Shared ProductTabs reduction is coupled to new customer-facing freight copy and is WAITING_CLAUDE; profiling remains open |
| SEO-014 | P1 | Four shared forms expose POST actions; review form exposes named native controls | Browser/no-JS QA pending; no real lead submission is authorized without staging delivery approval |

## Release classification

Current result: **NOT READY FOR PRODUCTION DEPLOYMENT**.

The implementation branch is intentionally conservative. It does not include the temporary 63-URL containment commit, does not publish planned pages, does not change Accommodation Container from draft, and does not introduce unapproved customer-facing Shipping-tab copy.
