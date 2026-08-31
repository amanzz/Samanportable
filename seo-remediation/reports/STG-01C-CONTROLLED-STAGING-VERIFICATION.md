# STG-01C Controlled Staging Verification

## Final verdict

**BLOCKED_TEST_DESTINATION_REQUIRED**

This is a **LOCAL_PRODUCTION_EQUIVALENT_ONLY** verification, not remote staging. No established preview deployment exists, and the four form families point at production-side destinations rather than isolated test sinks. No form was submitted. The candidate is not approved for production or release review.

Independent release blockers also remain: two legacy roofing-sheet redirect sources terminate at draft 404 pages; one rendered Containerized Data Center description image returns 404 locally and on the live asset URL; exact 360/390 browser viewport proof was not possible with the available browser surface; and the unresolved 138-link/42-target temporary cohort remains owner-pending. None was fixed in STG-01C.

## Remote production-head verification

| Control | Result |
|---|---|
| Reconciled production base | `3346a532306c52932aeb2d813591bf95cb37716b` |
| Fetched `origin/static-migration` | `3346a532306c52932aeb2d813591bf95cb37716b` |
| Advanced since STG-01A reconciliation | No |
| Material-delta review required | No |
| Validated STG-01B base | `a15eebdc9097f1a30b40574587f2c945fab01319` |
| Compatible history / merge base | Yes; merge base is the unchanged production commit |

No production change was merged or resolved during STG-01C.

## Controlled branch and draft PR

- Branch: `seo/stg-01c-controlled-staging`
- Branch start: exact validated commit `a15eebdc9097f1a30b40574587f2c945fab01319`
- Parent includes the reviewed reconciliation commit `82494c30d23709eba4a808a6bd1fda8af287ba55`.
- Draft PR: [#181 — SEO remediation controlled staging verification — DO NOT MERGE](https://github.com/amanzz/Samanportable/pull/181)
- Base: `static-migration`
- PR state at verification: open, draft, clean merge state, no checks/deployments, not merged.
- Push method: normal upstream push; no force push.
- Original dirty `feature/llms-txt` checkout remained untouched.

The PR description says staging/review only, not approved for production, and records the 61/43 architecture, schema coverage, 63-row temporary treatment, 138/42 link cohort, form-delivery gap, performance gap and merge prohibition.

## Preview/staging discovery

Repository and GitHub inspection found:

- no Vercel, Netlify, Cloudflare Pages, Firebase, Render, Fly or Railway configuration;
- no committed DigitalOcean app specification;
- no GitHub environments, deployment records or repository variables;
- no preview deployment comments, checks or branch preview workflow;
- no staging hostname reference or resolvable conventional staging subdomain;
- a production-only DigitalOcean deployment described outside the repository and a post-deploy cache warmer triggered by pushes to `static-migration`.

No hosting account, DNS record, environment or production deployment was created or changed. The production-equivalent server ran locally from the successful build and is not represented as remote staging.

## Architecture, publication and schema

| Gate | Result |
|---|---|
| Approved architecture | 61 |
| Planned-release architecture | 43 |
| Approved direct HTTP 200 | 61/61 |
| Approved redirects | 0 |
| Approved self-canonical | 61/61 |
| Approved effective index/follow | 61/61; no approved `noindex` or `nofollow` |
| Approved unique H1 count | 61/61 exactly one |
| Approved Product schema | 61/61 exactly one |
| Approved BreadcrumbList schema | 61/61 exactly one |
| Approved JSON-LD parse errors | 0 |
| Approved schema duplicates | 0 |
| Approved page sitemap membership | 61/61 |
| Approved image sitemap page membership | 61/61 |
| Planned public 404 | 43/43 |
| Planned redirects | 0 |
| Planned page/image sitemap exposure | 0 |
| Planned internal-link/discovery exposure | 0 |
| Draft public 404 | 3/3 |
| Draft Product schema / sitemap / discovery | 0 / 0 / 0 |

Product schema name/URL/image generation remains tied to the published product records and canonical resolver. The structured-data gate checked 84 approved schema image references and found zero Product/Breadcrumb parse or duplication errors. No product fact, price, freight fact, content, title, H1, URL or architecture row changed.

## Container Office rail regression

The primary rail passes with nine unique approved/live children. Expandable Container Office, Flat-Pack Container Office and Multi-Story Container Office each appear exactly once. All nine destinations are direct 200, self-canonical and effective index/follow; none is planned, draft, gated or a product-category archive. Child-specific labels remain intact and the children link back to `/product/container-offices`. Rail membership and ordering were not changed.

## Temporary 63-URL control

The exact fixture still contains 63 unique paths with no approved/planned overlap and status `TEMPORARY_OWNER_DISPOSITION_PENDING`.

| Runtime behavior | Count |
|---|---:|
| Exact 200, no redirect, `noindex, follow`, Product/FAQ suppression | 61 |
| Exact draft 404 exclusions | 2 |
| Redirect or 410 | 0 |
| Page/image sitemap exposure | 0 |
| Schema suppression failures | 0 |

The three fixture-level pre-excluded inputs remain the two draft roofing-sheet records plus `/product-category/container-offices`; the category archive still receives the reversible exact 200/noindex containment. This is evidence of current behavior, not approval of a permanent disposition.

## 138-link gated-target crosswalk

The occurrence-level [CSV](STG-01C-GATED-LINK-CROSSWALK.csv) and [summary](STG-01C-GATED-LINK-CROSSWALK.md) contain exactly 138 rows to 42 gated destinations. Every row includes the required source/destination/title/anchor/location/type/family/status/closest-owner/disposition/action/risk fields.

| Dimension | Result |
|---|---|
| Template-generated | 87 |
| Contextual | 51 |
| Product card/grid | 61 |
| Related rail | 20 |
| Shared template | 5 |
| Navigation/header | 1 |
| Permanent disposition | Pending owner review on every row |
| Likely future action | `OWNER_DECISION_REQUIRED` on every row |
| Links changed in STG-01C | 0 |

Top destinations are `/product-category/container-offices` (18), `/product/sandwich-panel` (12), `/product/portable-office/portable-office-container` (11), `/product/peb-constructions` (9) and `/product/puf-panel/puf-panel-roofing` (7).

## Form delivery

Result: **BLOCKED_TEST_DESTINATION_REQUIRED**. Full evidence is in [STG-01C-FORM-DELIVERY-QA.md](STG-01C-FORM-DELIVERY-QA.md).

Contact, Quote and Enquiry can reach the production Zoho lead path, production email recipients and production GTM. Review can create a pending review in production WooCommerce. No staging equivalents are configured. The safe, stubbed native/no-JavaScript contract test passed with zero outbound requests, but actual success/failure delivery, duplicate-click/loading behavior, email, CRM, webhook, analytics and server-log evidence remain untested. No customer/test data was transmitted and no Review was submitted.

## Browser and responsive QA

Fifteen requested routes were exercised across four requested viewport overrides (60 page/viewport combinations): homepage; seven hubs; three Container Office details; one gated page; one planned 404; one draft 404; and the retired Tiny Container Homes redirect.

DOM/hydration results across the 60 combinations:

- zero detected horizontal-overflow cases;
- zero visible H1-count failures;
- zero JSON-LD parse errors;
- zero broken loaded images in the 15-page browser sample;
- zero console warnings/errors or hydration-mismatch messages;
- sampled approved pages retained self-canonical, effective index/follow and one Product/Breadcrumb pair;
- gated sample retained `noindex, follow` with Product suppression;
- planned and draft samples rendered the 404 template with no Product schema;
- retired `/product/container-houses/tiny-container-homes` resolved directly to Shipping Container Homes;
- tables, calculators, native POST forms, galleries, PDF links, rails, breadcrumbs and contact CTAs were present where the relevant template exposes them.

Browser limitation: the isolated in-app browser was unavailable. The connected external Chrome surface injected the user's Ahrefs toolbar and did not honor the requested viewport dimensions as exact CSS-pixel widths because of user/browser scaling. The requested matrix was executed, but it is not accepted as exact 360×800 / 390×844 / 768×1024 / 1440×900 visual proof. Lighthouse used a separate clean headless profile with extensions disabled.

One browser review item remains: Flat-Pack Container Office rendered its page navigation and content but no semantic `<header>` element in all four runs, unlike the other sampled approved pages. No template change was authorized.

## Performance baseline

Full three-sample evidence is in [STG-01C-PERFORMANCE-BASELINE.md](STG-01C-PERFORMANCE-BASELINE.md).

| Page | Median score | Median LCP | Median TBT | Median transfer | DOM nodes |
|---|---:|---:|---:|---:|---:|
| Homepage | 85 | 4.29 s | 94 ms | 519 KiB | 1,788 |
| Porta Cabins hub | 62 | 9.64 s | 468 ms | 2,172 KiB | 3,815 |
| Container Offices hub | 65 | 9.94 s | 786 ms | 4,290 KiB | 3,904 |
| Portable Office hub | 65 | 8.74 s | 382 ms | 1,578 KiB | 3,841 |
| Expandable Container Office detail | 68 | 12.00 s | 297 ms | 4,378 KiB | 3,792 |

This confirms performance remains open. No optimization was implemented.

## Complete grouped crawl

### Group totals

| Group | Requested | Distribution / result |
|---|---:|---|
| A. Approved indexable | 61 | 61×200; zero approved failures |
| B. Temporarily gated | 63 | 61×200/noindex-follow; 2×404 |
| C. Planned | 43 | 43×404 |
| C. Draft | 3 | 3×404 |
| D. Declared redirects | 1,005 | 1,003 literal sources requested: 253×301, 750×308; two dynamic normalizers analyzed statically |
| E. Sitemap technical/editorial | 321 | 321×200, including 260 outside the approved commercial fixture |

### Link, metadata, schema and asset findings

| Check | Result |
|---|---|
| Internal-link occurrences | 31,838 |
| Unique internal targets | 338 |
| Links from sitemap/indexable pages to redirects/errors | 0 |
| Links from sitemap/indexable pages to noindex targets | 873 occurrences / 61 targets |
| Gated subset of noindex links | 138 / 42 |
| Other noindex subset | 735 / 19; 637 occurrences target the intentional noindex price calculator |
| Canonical conflicts | 0 |
| Sitemap/indexability conflicts | 0 |
| JSON-LD parse errors | 0 |
| Approved Product/Breadcrumb duplicates | 0 |
| Same-site rendered images checked | 1,478 |
| Confirmed broken images | 1 |
| PDFs checked / broken | 52 / 0 |
| Missing titles | 0 |
| Missing/multiple H1s | 0 |
| Internal filesystem path exposure | 0 |
| SSR orphan candidates | 44 review candidates |

The confirmed image failure is:

- `/images/products/containerized-data-center/containerized-data-center-description-20ft-high-cube.webp` — referenced by the approved Containerized Data Center description; returns 404 in the local candidate and at the live same-site asset URL. This aligns with the one-underlying-issue AH-018 baseline, but AH remediation was not started.

The crawler initially emitted `/Prefab` as a second failure because it split a valid filename containing a space. The harness was corrected to distinguish `src` from `srcset`; `/Prefab` is excluded as a false positive.

Two legacy redirect sources terminate at draft 404 destinations:

- `/product/roofing-sheets/metal-roofing-sheet` → `/product/roofing-sheet/metal-roofing-sheet` → 404
- `/product/roofing-sheets/pvc-roofing-sheet` → `/product/roofing-sheet/pvc-roofing-sheet` → 404

There are zero destination-as-source chains in the 1,005-rule configuration and no approved URL is a redirect source. The existing static validator separately reports two normalizer-shaped loop warnings (`/product/labor-colony/` trailing-slash normalization and `/:path+/` host/scheme normalization); actual literal-source requests showed no second-hop chain. The two redirect-to-404 edges above are retained as blockers rather than silently classified as chains.

The 44 SSR orphan candidates are review items, not automatic defects: `/cabin-cost-calculator`, five commercial/location pages and 38 editorial pages. Exact paths are preserved in the local crawl evidence; the Ahrefs screenshot baseline supplies only a three-orphan count and no export, so reconciliation requires the external Ahrefs URL list.

## Sitemap, image and redirect totals

- Page sitemap: 321 indexable URLs — products 72, locations 190, projects 1, editorial 58.
- Image sitemap: 321 page entries, 4,208 page/image associations and 3,220 unique images.
- Image manifest: 5,606 entries, zero `undefined`/blank resolved URLs; 4,945 same-site status-200 entries and 661 remote entries without fabricated local status.
- XML: nine generated sitemap XML files parsed successfully; zero parse failures.
- Redirect configuration: 1,005 application rules; 1,003 literal and two dynamic/normalizer rules; zero duplicate literal sources; zero non-permanent rules; zero destination-as-source chains.
- Next.js compiled warning: 1,008 redirects, six headers and two rewrites (1,016 custom routes), retained without suppression.

## Preview privacy and security

Because no remote preview exists, Google indexability and remote access control cannot be asserted for a preview host. The verification artifact was local-only and is not linked from production.

Local candidate checks:

- zero `.map` files under `.next/static`;
- zero client bundles matching common API-key/credential patterns or protected server-variable names;
- audit reports, source fixtures, `.env`, `.git`, `private-data` and an internal filesystem-shaped URL resolve to final 404;
- no client/server secret value was printed or added to a report;
- no internal filesystem path was found in the 321 sitemap page responses;
- five ordinary query attempts (`preview`, `draft`, `status` and preview-data-shaped parameters) did not expose a draft; all stayed 404;
- audit CSV/Markdown files remain repository files, not public website assets.

## Validation ledger

| Validation | Result |
|---|---|
| `npm ci` | Completed; warnings retained |
| Commercial architecture release | Pass: 61/43 |
| Temporary exact gating | Pass: 63, no architecture overlap |
| TypeScript | Pass |
| Lint | Pass with five known warnings |
| Production build/postbuild | Pass |
| Publication gate | Pass: 61/43/63; 31,838 links; 138/42 gated |
| Structured data | Pass: 61 approved, 84 schema images, zero parse/duplicate errors |
| Container Office rail | Pass: nine unique approved children |
| Sitemap generation/XML | Pass |
| Image manifest | Pass with zero undefined locations |
| Full internal-link status crawl | Pass: zero redirect/error edges |
| Exhaustive literal redirect source crawl | 1,003 sources responded 301/308; fail on two 404 destinations |
| Same-site rendered image crawl | Fail on one confirmed description image |
| PDF crawl | Pass: 52/52 |
| Safe native form contract | Pass with stubs and zero outbound traffic |
| Actual form delivery | Blocked; no safe test destination |
| Browser/hydration | DOM checks pass; exact viewport/isolated visual proof incomplete; Flat-Pack semantic-header review item |
| Lighthouse | Baseline captured; performance remains open |
| Security/privacy | Local candidate pass; remote-preview controls not applicable |

## Warnings retained, not hidden

- Four React Hook dependency warnings.
- One raw `<img>` lint warning.
- Next.js custom-route warning.
- Optional `sharp` production image-optimization warning during the exhaustive local asset stress run.
- Node 24/npm 11 do not match the declared Node 22/npm 10 engines.
- `npm ci` reported 45 dependency vulnerabilities: 3 low, 22 moderate, 19 high and 1 critical.
- Lighthouse 13.4.1 saved all reports but emitted Windows `EPERM` warnings while cleaning temporary profiles.
- Two static normalizer-shaped loop warnings, with zero actual literal redirect chains.

No warning was suppressed and no dependency, image, route, hook or performance fix was attempted.

## Remaining blockers and review items

1. No established access-controlled remote preview/staging system exists.
2. Safe test email, CRM, webhook, analytics and WooCommerce destinations are missing.
3. Two legacy roofing-sheet redirects terminate at draft 404 pages.
4. One approved Containerized Data Center description image is broken.
5. Exact requested responsive viewport proof remains environment-limited; Flat-Pack Container Office lacks a semantic header in the available browser evidence.
6. The 138 occurrences to 42 temporarily gated URLs remain unchanged and owner-pending.
7. The other 735 links to 19 noindex targets require intentional-condition review; 637 are the price calculator.
8. Forty-four SSR orphan candidates require reconciliation against the Ahrefs three-URL export.
9. Performance baselines remain below release expectations on hubs/details.
10. AH-001 through AH-020 remain unfixed except for evidence produced by prior authorized remediation.

## Changed files in STG-01C

Only staging verification reports/tests belong in the commit:

1. `scripts/generate-stg01c-complete-crawl.mjs`
2. `scripts/generate-stg01c-gated-link-crosswalk.mjs`
3. `scripts/summarize-stg01c-lighthouse.mjs`
4. `seo-remediation/reports/STG-01C-CONTROLLED-STAGING-VERIFICATION.md`
5. `seo-remediation/reports/STG-01C-FORM-DELIVERY-QA.md`
6. `seo-remediation/reports/STG-01C-GATED-LINK-CROSSWALK.csv`
7. `seo-remediation/reports/STG-01C-GATED-LINK-CROSSWALK.md`
8. `seo-remediation/reports/STG-01C-PERFORMANCE-BASELINE.md`

No product record, commercial architecture, publication fixture, redirect, link, sitemap input, rail, form implementation, freight fact, content or permanent disposition changed.

## Rollback and branch deletion

No production rollback is required because nothing was deployed or merged. To withdraw the review artifact:

1. Close draft PR #181 without merging.
2. Delete remote branch `seo/stg-01c-controlled-staging` only after confirming no reviewer needs it.
3. Switch the clean integration checkout to another branch and delete the local STG-01C branch.
4. If only the verification-report commit must be removed while preserving the branch, revert that commit with a normal `git revert`; do not reset or rewrite shared history.

The original dirty feature checkout and `static-migration` are not part of this rollback.

## Recommendation

Do not deploy production and do not merge PR #181. Provision an established, access-controlled staging target with isolated form destinations, then rerun the blocked delivery and exact responsive checks. The redirect-to-404 and confirmed broken-image findings require separate authorization before remediation. Preserve the 63-row temporary fixture and 138-link register unchanged until owner decisions are approved.
