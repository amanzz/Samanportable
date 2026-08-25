# SAMAN SEO audit severity report

Updated: 2026-08-25  
Production base: `origin/static-migration` at `82d0730e`  
Architecture authority: final New Approved plan, unchanged

## Classification correction

SEO-001 is **PLANNED RELEASE BACKLOG**, not a P0 production-defect count. The accepted 2026-08-24 baseline contained 45 approved `New` URLs that were intentionally unpublished, absent from sitemaps and internal links, outside the repository allowlist, and without published product data.

The production base has since changed. Multi-Story Container Office and Flat-Pack Container Office have publish-status records, complete approved page packages, direct live HTTP 200 responses, and verified bidirectional Container Offices hub links. RB-01 authorizes reconciling those two released pages without changing the final New Approved architecture, reducing the planned fixture from 45 to 43 and increasing the approved-production fixture from 59 to 61.

A fresh 2026-08-25 live check found that Expandable Container Office also returns HTTP 200 while it remains in the planned fixture. RB-01 explicitly prohibits changing the publication status of remaining planned pages, so Expandable Container Office remains a separate publication-status blocker. After the authorized two-page reconciliation, the 43-path planned set contains 42 verified 404 paths and this one live contradiction.

The remaining planned URLs must stay 404 and disconnected. No sitemap, image sitemap, navigation, rail, schema, feed, internal link, placeholder, or unrelated redirect is allowed before the full family/page publication gate passes.

## Active findings

| ID | Severity/class | Current state | Release effect |
|---|---|---|---|
| SEO-001 | PLANNED RELEASE BACKLOG | 45-path audit baseline; RB-01 authorizes two releases, leaving 43 planned records: 42 verified 404 and Expandable Container Office live at 200 | **BLOCKING** only on the unauthorized remaining live/planned contradiction; do not change its status under RB-01 |
| SEO-002 | P0 | 63 live 200/indexable commercial URLs remain in current product and image sitemaps; row-level register complete | Temporary exact-path containment is isolated on `seo/remediation-temporary-63-gating`; permanent dispositions remain owner-only |
| SEO-003 | P0 | Tiny Container Homes still lacks its approved differentiated owner page | WAITING_CLAUDE and owner publication approval |
| SEO-005 | P0 | False global flat-freight Offer schema removed; known ₹3,000 render/schema phrases normalized | Source-record rewrite and shared visible Shipping-panel replacement remain WAITING_CLAUDE/OWNER facts |
| SEO-006 | P1 | Six verified approved pages added to sitemap inputs; Accommodation Container held because its source record is `draft` | **BLOCKING owner publication-state reconciliation** for the seventh page |
| SEO-007 | P1 | 375/386 audited occurrences were repointed; the held Tiny page is contained separately; the contained 318-page recrawl found 0 redirect/error edges across 32,514 rendered links | Remaining 11 Tiny source-content links still require the owner/content decision before a permanent disposition |
| SEO-008 | P1 | Retired Portable Cabin hero, cluster, breadcrumb and variant-content links resolve directly to the approved Porta Cabins hub | **Verified** by full contained recrawl: 0 redirect/error edges |
| SEO-011 | P1 | Seven Container House legacy sources point directly to their verified final destinations | **Verified** locally as one-hop permanent redirects |
| SEO-013 | P1 | No performance change included in the initial release candidate | Shared ProductTabs reduction is coupled to new customer-facing freight copy and is WAITING_CLAUDE; profiling remains open |
| SEO-014 | P1 | Four shared forms expose POST actions; local SSR/browser checks passed and review/quote controls have native names | Staging delivery remains required; no production lead was submitted |

## Release classification

Current result: **NOT READY FOR PRODUCTION DEPLOYMENT**.

The implementation branch is intentionally conservative. It does not include the temporary 63-URL containment commit, does not publish any page, does not change Accommodation Container from draft, does not change the remaining planned-page statuses, and does not introduce unapproved customer-facing Shipping-tab copy.
