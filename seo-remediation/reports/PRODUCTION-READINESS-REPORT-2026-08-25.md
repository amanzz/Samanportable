# SAMAN Portable SEO Remediation — Production Readiness Report

**Assessment date:** 2026-08-25  
**Release verdict:** **NOT READY**  
**Production deployment performed:** **No**

## Release candidates and scope separation

| Scope | Branch | Assessed head | Purpose |
|---|---|---:|---|
| Initial remediation integration | `seo/remediation-production-base-integration` | `814b420d` | Production-base fixes and evidence; intentionally excludes temporary containment of the 63 unapproved URLs |
| Reversible 63-URL containment | `seo/remediation-temporary-63-gating` | `2ca0eaa8` | Exact-path noindex/schema/sitemap/discovery containment for the 63 URLs, kept separate from the initial integration branch |

Both worktrees were clean at assessment time. The original dirty `feature/llms-txt` worktree remains preserved and was not used as the integration base.

## Audit classification correction

`SEO-001` is classified as:

> **PLANNED RELEASE BACKLOG — 45 approved new pages not yet published**

It is not classified as a P0 production-defect set. The final New Approved architecture was not modified.

The release rules are encoded as validation fixtures:

- planned paths must remain absent from page and image sitemaps until publication;
- no placeholder pages are generated;
- no unrelated sibling redirects are introduced;
- publication remains gated on differentiated approved content and verified facts/assets;
- a released page must satisfy the 200, canonical, robots, title/H1, content, schema, sitemap, and purposeful-link requirements.

## Completed remediation

### Production-base integration

- Confirmed `origin/static-migration` at `82d0730e` as the production base.
- Preserved and integrated the 14 production product records that were missing from the prior feature branch.
- Flattened the seven audited Container House redirect chains to one-hop final destinations.
- Repointed verified internal links away from redirects/errors.
- Removed the false global flat-freight `shippingDetails` offer from product schema.
- Added render/schema normalization for the exact known false flat-freight phrases without replacing unapproved buyer-facing source copy.
- Added native POST fallbacks for contact, enquiry, quote, and review forms.
- Added six verified approved live pages to the product and image sitemaps:
  - BESS Container
  - Containerized Data Center
  - Container Marketing Office
  - Oil Field Camp
  - Prefab Site Canteen
  - Ablution Block
- Kept Accommodation Container out of sitemaps because the live/source publication state is contradictory.
- Added the exact 63-row disposition register without making permanent keep/consolidate/retire decisions.

### Internal-link remediation evidence

The original retained audit contained 386 internal redirect/error occurrences.

- 375 audited occurrences were repointed through the initial shared-link remediation.
- Retired `/product/portable-cabin` discovery was then removed from:
  - the shared product hero preset;
  - blog content-cluster mappings;
  - the category-to-hub map;
  - local/editorial breadcrumb resolution;
  - product variant HTML at the render boundary.
- The 11 Tiny Container Homes occurrences remain an owner/content decision and are not treated as a permanent redirect decision. Their commercial page is contained on the reversible 63-URL branch.

Fresh crawl of the contained, indexable build:

| Metric | Result |
|---|---:|
| Sitemap pages crawled | 318 |
| Rendered internal edges checked | 32,514 |
| Unique internal targets checked | 382 |
| Redirect/error edges | **0** |
| Affected source pages | **0** |
| Redirect edges | **0** |
| Error edges | **0** |

This zero result applies to the contained discoverable set. It does not convert the held Tiny Container Homes source-content decision into a permanent disposition.

## Temporary containment of the 63 URLs

The containment exists only on `seo/remediation-temporary-63-gating`.

Validated behavior:

- exactly 63 paths in the fixture;
- no approved/planned overlap;
- all 63 local routes return HTTP 200;
- all 63 return `X-Robots-Tag: noindex, follow`;
- dynamic pages also emit `meta robots=noindex, follow`;
- Product and FAQ schema are suppressed on gated paths;
- the 63 paths are absent from page and product-image sitemaps;
- the 63 paths are filtered from product listings, rails, header, footer, and category discovery;
- no permanent disposition was applied.

The initial integration branch intentionally does not include this containment and must not be represented as containing it.

## Sitemap status

| Set | Page sitemap | Product-image sitemap | Result |
|---|---|---|---|
| 45 planned-release paths | 0 included | 0 included | Pass |
| Six verified approved additions | 6 included | 6 included | Pass |
| Accommodation Container | Excluded | Excluded | Held pending publication-state reconciliation |
| 63 unapproved paths, containment branch | 0 included | 0 included | Pass |

All nine generated XML sitemap artifacts were well formed. No `undefined` values were found in sitemap/manifest output.

## Browser and form QA

Read-only local browser checks were completed without form submission:

- approved BESS Container page:
  - correct unique title and H1;
  - self-canonical;
  - `index, follow`;
  - no horizontal overflow at the effective 390 CSS-pixel mobile viewport;
  - clean browser error/warning console;
- gated Portable Office Container sample:
  - `noindex, follow`;
  - no Product or FAQ schema;
  - no horizontal overflow;
  - clean browser error/warning console;
- Contact page:
  - mobile layout had no horizontal overflow;
  - Quote form rendered `method=post`, action `/api/quote-request`, and named controls;
  - clean browser error/warning console.

Source and SSR checks also confirmed native actions for Contact CTA, Enquiry Dialog, and Review form. Actual delivery to production CRM/email/webhook destinations was not tested and requires staging.

## Validation results

### Passing

- TypeScript `tsc --noEmit`
- production build and postbuild sitemap/image generation
- non-strict commercial architecture validation: 59 approved paths and 45 planned paths
- exact temporary gating validation: 63 paths, no approved/planned overlap
- all nine sitemap XML files well formed
- exact 45 planned paths absent from page/image sitemaps
- exact 63 paths absent from page/image sitemaps on containment branch
- six verified approved pages present in both product and image sitemaps
- full contained internal-link crawl: zero redirect/error edges

### Known build warnings

- four existing React Hook dependency warnings;
- one existing raw `<img>` performance warning;
- 1,008 redirects plus six headers and two rewrites exceed Next.js's 1,000 custom-route warning threshold;
- commercial product routes remain large (approximately 581–582 kB first-load JavaScript in the assessed builds).

## Blocking conditions

The strict release gate correctly fails on three publication-state conflicts:

1. `/product/labor-colony/accommodation-container`
   - approved/live path;
   - live route is indexable HTTP 200;
   - source record status is `draft`;
   - held out of sitemaps pending owner reconciliation.
2. `/product/container-offices/multi-story-container-office`
   - remains in the 45 planned-release fixture;
   - production record status is `publish`;
   - live route returns HTTP 200.
3. `/product/container-offices/flat-pack-container-office`
   - remains in the 45 planned-release fixture;
   - production record status is `publish`;
   - live route returns HTTP 200.

Additional release blockers:

- the 63 permanent URL dispositions require owner review; temporary containment is ready but intentionally separate;
- Tiny Container Homes needs the held owner/content decision before its 11 source links can be permanently resolved;
- buyer-visible/source freight claims and the ProductTabs performance rewrite require Claude-approved replacement content;
- form delivery needs staging end-to-end verification;
- the >1,000 route warning and commercial-template bundle/DOM performance require dedicated remediation and measurement.

## Final SEO quality audit

| Gate | Result |
|---|---|
| Planned pages protected from premature discovery/indexing | Pass |
| No thin placeholders created | Pass |
| No unrelated redirects created for planned pages | Pass |
| Approved sitemap additions supported by live 200 evidence | Pass for six; Accommodation held |
| 63-URL permanent architecture preserved for owner review | Pass |
| Temporary containment reversible and isolated | Pass |
| Internal discoverable links free of redirects/errors | Pass on contained 318-page crawl |
| Verified commercial facts complete in visible content | **Fail / waiting for approved content** |
| Forms proven end to end in staging | **Fail / not yet tested** |
| Strict commercial architecture gate | **Fail by design on three conflicts** |
| Commercial-template performance acceptable | **Fail / remediation remains** |

## Release decision

**Do not deploy either branch to production yet.**

The controlled commits are ready for review, and the reversible containment branch is technically validated, but the strict architecture conflicts, owner decisions, approved-content dependencies, staging form verification, and performance work prevent a production-ready verdict.
