# SAMAN SEO remediation implementation backlog

Updated: 2026-08-25  
Architecture lock: do not modify the final New Approved plan

## Controlled implementation history

| Order | Commit/branch | Scope | State |
|---:|---|---|---|
| 1 | `8cf41032` | Production-base report, architecture fixture and release validator | Complete; strict gate intentionally fails on current governance conflicts |
| 2 | `d45a8b65` | Seven direct redirects and evidence-backed retired-link rewrites | Complete; verification pending |
| 3 | `d5b42880` | Remove false global flat-freight schema and normalize known false render/schema phrases | Complete; source-copy rewrite remains gated |
| 4 | `e6f9ce66` | Native POST fallbacks and named review controls | Complete; browser/staging QA pending |
| 5 | `0035dad5` | Exact 63-row disposition CSV/MD | Complete; all permanent decisions pending owner review |
| 6 | `d1e5d201` | Add six verified live approved pages to sitemap inputs | Complete; Accommodation Container held as draft |
| 7 | `8b372cf1` | Refresh generated product and image sitemap artifacts | Complete |
| 8 | `dcafaf8e`, `e18a874e`, `5ab8882e`, `814b420d` | Remove retired Portable Cabin discovery from hero, cluster, breadcrumb and variant-content rendering | Complete; contained full recrawl found zero redirect/error edges |
| 9 | `seo/remediation-temporary-63-gating` at `2ca0eaa8` | Reversible exact-63 noindex/schema/discovery/sitemap containment | Validated and separate from the initial integration release candidate |
| 10 | RB-01 publication reconciliation | Move only verified Multi-Story and Flat-Pack pages from planned to approved-production and regenerate safe sitemap artifacts | Complete and validated; no deployment performed |

## Immediate queue

| Priority | Workstream | Entry gate | Required evidence/state |
|---:|---|---|---|
| 1 | Reconcile Multi-Story and Flat-Pack post-audit publication | RB-01 authorization plus completed page-package and live verification | **Complete:** 61 approved/43 planned; both included in product/image sitemaps with verified direct links |
| 2 | Reconcile Expandable Container Office live/planned mismatch | Separate OWNER publication ruling; RB-01 prohibits changing remaining planned statuses | Until reconciled, retain its planned classification and treat the live HTTP 200 response as a release blocker |
| 3 | Reconcile Accommodation Container draft/live mismatch | OWNER explicitly approves `publish` or directs route containment | Only a publish-status, HTTP 200, self-canonical, index/follow page may enter product/image sitemaps |
| 4 | Decide the 63 URLs row by row | Traffic, conversions, Ahrefs/backlinks, anchors, content quality, business value and same-intent overlap reviewed | OWNER selects KEEP, continued NOINDEX, same-intent 301, or 410 for each row; no bulk inference |
| 5 | Tiny Container Homes | Claude-approved differentiated content plus verified facts/assets | Own HTTP 200 page, approved schema and purposeful links; then resolve the held 11 links |
| 6 | Freight/source-copy cleanup | OWNER freight fact register and Claude-approved replacement copy | Visible copy and JSON-LD agree; forbidden retired flat-freight claims absent from rendered output |
| 7 | ProductTabs/template performance | Claude-approved compact visible panel or owner approval to remove unsupported claims | Mobile profiling shows reduced DOM/TBT/JS without loss of crawlable content, accessibility or conversion behavior |
| 8 | Form delivery QA | Approved staging CRM/email/WhatsApp pipeline and test identity | Native/no-JS semantics, validation, analytics and downstream delivery pass without creating production leads |
| 9 | Release validation | Items 1-3 reconciled; initial vs containment release choice explicit | Type-check, lint, production build, XML/image validation, internal-link crawl, redirect checks, mobile/browser console checks and strict architecture gate pass |

## SEO-001 publication gate

After the authorized Multi-Story and Flat-Pack reconciliation, the planned backlog count is 43. Forty-two paths are verified 404 and disconnected. Expandable Container Office remains in the planned set under RB-01 but is currently live at HTTP 200, so it fails this gate and requires a separate owner ruling.

Each unreleased planned page must remain 404 and disconnected until all items pass in one family release:

- Claude-approved differentiated content and unique intent
- verified product facts, prices/claims where used, and approved assets
- HTTP 200, self-canonical and `index,follow`
- unique approved title and H1
- valid visible-data-matched schema
- product and image sitemap membership
- purposeful hub-to-child and child-to-hub links

No thin placeholder, unrelated sibling redirect, premature discovery signal, or architecture modification is permitted.
