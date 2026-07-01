# SEO Phase 2 Container Cafe Internal Link Fix - 2026-07-01

Status: PASS

Branch: `fix/seo-phase2-container-cafe-internal-links-20260701`  
Base: `origin/static-migration` at `65cc840`  
Implementation worktree: `C:\tmp\saman-container-cafe-links-20260701`

## Files Changed

- `src/pages/[slug].tsx`
- `reports/link-issues/SEO_PHASE_2_CONTAINER_CAFE_INTERNAL_LINK_FIX_20260701.md`

Build regenerated `public/sitemap.xml` locally, but it is not part of this fix and must not be staged.

## Implementation Method

Added a small slug-scoped, data-driven related-location module in `src/pages/[slug].tsx`:

- Module title: `Related Container Cafe Locations in NCR`
- Renders only for the 9 approved Container cafe NCR slugs.
- Renders after the main article/body content and before the generic article footer.
- Does not edit page body JSON content.
- Does not change existing headings, paragraphs, metadata, schema, canonical, hreflang, sitemap, redirects, robots, or URL slugs.
- Does not add footer/sitewide links.
- Does not touch CWV, HSTS, llms.txt, SEMrush bot, or content optimization work.

## Why This Module Is Safe

- It is controlled by an explicit allowlist map keyed by slug.
- It shows only on the approved Container cafe NCR pages.
- Each page gets 4 links: 3 same-cluster city/location links and 1 relevant container cafe hub/product link.
- The module filters out self-links.
- Anchor text is varied and natural for Indian buyers searching for container cafe, cafe container, modular cafe and NCR outlet setup options.
- Product/category hub links are limited to `/product/container-cafe` or `/product-category/container-cafe` only.
- No unrelated product cluster links were added.

## URLs Fixed

All 9 approved pages were fixed. Each had the before issue: one internal link + crawl depth 14.

| URL | Before issue | Links added |
| --- | --- | --- |
| `/container-cafes-in-central-delhi` | one internal link + depth 14 | `/container-cafes-in-east-delhi`, `/container-cafes-in-south-delhi`, `/container-cafes-in-west-delhi`, `/product/container-cafe` |
| `/container-cafes-in-east-delhi` | one internal link + depth 14 | `/container-cafes-in-central-delhi`, `/container-cafes-in-noida`, `/container-cafes-in-ghaziabad`, `/product-category/container-cafe` |
| `/container-cafes-in-faridabad` | one internal link + depth 14 | `/container-cafes-in-south-delhi`, `/container-cafes-in-gurgaon`, `/container-cafes-in-greater-noida`, `/product/container-cafe` |
| `/container-cafes-in-ghaziabad` | one internal link + depth 14 | `/container-cafes-in-east-delhi`, `/container-cafes-in-noida`, `/container-cafes-in-greater-noida`, `/product-category/container-cafe` |
| `/container-cafes-in-greater-noida` | one internal link + depth 14 | `/container-cafes-in-noida`, `/container-cafes-in-ghaziabad`, `/container-cafes-in-faridabad`, `/product/container-cafe` |
| `/container-cafes-in-gurgaon` | one internal link + depth 14 | `/container-cafes-in-south-delhi`, `/container-cafes-in-west-delhi`, `/container-cafes-in-faridabad`, `/product-category/container-cafe` |
| `/container-cafes-in-noida` | one internal link + depth 14 | `/container-cafes-in-greater-noida`, `/container-cafes-in-east-delhi`, `/container-cafes-in-ghaziabad`, `/product/container-cafe` |
| `/container-cafes-in-south-delhi` | one internal link + depth 14 | `/container-cafes-in-faridabad`, `/container-cafes-in-gurgaon`, `/container-cafes-in-central-delhi`, `/product-category/container-cafe` |
| `/container-cafes-in-west-delhi` | one internal link + depth 14 | `/container-cafes-in-gurgaon`, `/container-cafes-in-south-delhi`, `/container-cafes-in-central-delhi`, `/product/container-cafe` |

## Expected SEO Benefit

- Improves crawl paths for 9 high-priority commercial Container cafe NCR pages.
- Reduces reliance on a single inbound internal link per page.
- Creates a cluster-local path between related NCR container cafe location pages.
- Helps distribute relevance from container cafe hub/product pages without using spammy footer links.
- Supports users comparing nearby NCR service areas and container cafe buying options.

## Lint And Build Result

- `npm run lint`: PASS, no ESLint warnings or errors.
- `npm run build`: PASS, compiled successfully and completed `next-sitemap` postbuild.

## Local Verification Result

Local server: `http://localhost:3125`

| URL | 200 | 1 H1 | 1 canonical | hreflang en-IN | hreflang x-default | Module present | Self-links | Module target status |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| `/container-cafes-in-central-delhi` | PASS | PASS | PASS | PASS | PASS | PASS | 0 | all 4 targets 200 |
| `/container-cafes-in-east-delhi` | PASS | PASS | PASS | PASS | PASS | PASS | 0 | all 4 targets 200 |
| `/container-cafes-in-faridabad` | PASS | PASS | PASS | PASS | PASS | PASS | 0 | all 4 targets 200 |
| `/container-cafes-in-ghaziabad` | PASS | PASS | PASS | PASS | PASS | PASS | 0 | all 4 targets 200 |
| `/container-cafes-in-greater-noida` | PASS | PASS | PASS | PASS | PASS | PASS | 0 | all 4 targets 200 |
| `/container-cafes-in-gurgaon` | PASS | PASS | PASS | PASS | PASS | PASS | 0 | all 4 targets 200 |
| `/container-cafes-in-noida` | PASS | PASS | PASS | PASS | PASS | PASS | 0 | all 4 targets 200 |
| `/container-cafes-in-south-delhi` | PASS | PASS | PASS | PASS | PASS | PASS | 0 | all 4 targets 200 |
| `/container-cafes-in-west-delhi` | PASS | PASS | PASS | PASS | PASS | PASS | 0 | all 4 targets 200 |

Additional checks:

- `cdn-cgi/email-protection` count: 0 on all checked pages.
- JSON-LD scripts remain present on all checked pages.
- The module uses normal responsive classes and appears after content; no HTML/class-structure break was found.
- Existing content body JSON files were not edited.
- No skipped pages.

## Skipped Pages

None. All 9 approved pages were included.

## Final Status

PASS. Ready to commit as one isolated Phase 2 internal-link fix. Do not push or deploy in this task.
