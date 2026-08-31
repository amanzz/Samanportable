# PC-01 Controlled Local Preview

Date: 2026-08-27
Verdict: `READY_FOR_OWNER_LOCAL_PREVIEW`

## Control record

| Control | Result |
|---|---|
| Source package | `PC-01-porta-cabins-hub`, version `2.5.1` |
| External approval | `APPROVED_FOR_CODEX_LOCAL_PREVIEW_ONLY`; limited to the ten A1 rows in the approval prompt |
| Branch | `seo/pc01-porta-cabins-local-preview` |
| Exact base | `810582fc9134608ce2796ce0edca67e1cef38eb8` |
| `origin/static-migration` | `3346a532306c52932aeb2d813591bf95cb37716b` (not advanced beyond the known production base) |
| Production deployment | Not authorized and not performed |
| Push / PR / merge | Not performed |
| Form submission | Not performed |

The package's `approved_for_codex: false` and `codex_may_implement: NO` values are its pre-approval snapshot. The external approval prompt is the controlling approval event for this local-preview-only implementation.

## Implemented scope

All and only the ten approved A1 rows were implemented:

| Row | Target | Result |
|---|---|---|
| CX-A01 | Hero opener | Exact PC01-C02 wording applied |
| CX-A02 | `'porta-cabins'.body` | Exact PC01-C12 wording applied |
| CX-A03 | `'porta-cabins'.comparison` | Exact PC01-C13 wording applied; both destinations preserved |
| CX-A05 | Configuration paragraph | Exact PC01-C24d wording applied |
| CX-A06 | Price-section opening sentences | Exact PC01-C24e wording applied |
| CX-A07 | Container Office boundary | Exact PC01-C24f wording applied |
| CX-A08 | Quality paragraph and returns sentence | Exact PC01-C24l wording applied; scope text preserved |
| CX-A09 | Why Buy paragraph | Exact PC01-C24m wording applied |
| CX-A16 | Rate-logic replacement | Exact v2.4 PC01-C24e sentence applied |
| CX-A10 | Meta description | Exact PC01-M02 wording applied |

The five A2 rows `CX-A11`, `CX-A12`, `CX-A13`, `CX-A14`, and `CX-A15` were not implemented. The applications data, delivery/freight content, 20x10 heading, visible FAQs, and `faqSchema` remain unchanged.

## Changed files

Source files:

- `src/data/products/porta-cabins.json`
- `src/components/product-variant-hero/rightToExistEntries.tsx`

Evidence and report files:

- `seo-remediation/reports/PC-01-CONTROLLED-LOCAL-PREVIEW.md`
- `seo-remediation/reports/evidence/PC-01/pc-01-porta-cabins-390px.png`
- `seo-remediation/reports/evidence/PC-01/pc-01-porta-cabins-1440px.png`

Before the evidence/report files were added, Git confirmed that exactly the two authorized source files differed. In `rightToExistEntries.tsx`, every entry outside the `'porta-cabins'` block compared identical to the base.

## Frozen-data results

`PRICE_LADDER_IDENTICAL = TRUE`

| Size | Ex-GST before / after | Incl. GST before / after |
|---|---:|---:|
| 10x10 | 143750 / 143750 | 169625 / 169625 |
| 20x8 | 220000 / 220000 | 259600 / 259600 |
| 20x10 | 250000 / 250000 | 295000 / 295000 |
| 20x12 | 288000 / 288000 | 339840 / 339840 |
| 30x10 | 360000 / 360000 | 424800 / 424800 |
| 40x10 | 475000 / 475000 | 560500 / 560500 |

- Six visible price rows and their order: byte-identical.
- Six price-to-size mappings: data-identical.
- Calculator ladder for PC-01: 6/6 identical to the ex-GST page ladder.
- Merchant feed PC-01 variants: 6/6 identical to the inclusive-GST page ladder.
- AggregateOffer: `lowPrice=143750`, `highPrice=475000`, `offerCount=6`, `priceCurrency=INR`, unchanged.
- GST-labelled visible values, `gstPercent=18`, `hsn=9406`, and currency: unchanged. This preservation is not owner verification of GST/HSN.
- Applications file, calculator ladder source, and merchant-feed source: zero Git diff.
- The machine-readable pre-edit baseline is retained locally at ignored path `.qa/pc01-baseline.json`.

## Content and SEO results

- Exact A1 invariant suite: PASS, 39 checks.
- H1: unchanged, exactly one at runtime.
- SEO title and OG title: unchanged.
- Approved URL: unchanged, HTTP 200 without a redirect.
- Canonical: unchanged and self-referencing at `https://www.samanportable.com/product/porta-cabins`.
- Robots: `index,follow`.
- Meta description: exact PC01-M02 wording.
- OG and Twitter descriptions: mirror the new approved meta description.
- Visible FAQ block: byte-identical from the FAQ heading onward.
- `faqSchema` source data and runtime `FAQPage`: data-identical; all nine FAQs remain.
- Delivery/freight block: byte-identical.
- Withdrawn causal/rate phrases are absent from the new A1 copy.

The final SEO guard found no hub/child ownership change, URL change, keyword-boundary expansion, internal-link expansion, or new unsupported trust claim. The page remains the broad Porta Cabin / Portable Cabin selection hub, with specialist configurations routed to their existing child pages.

## Architecture, sitemap, links, images, schema, and forms

| Gate | Result |
|---|---|
| Commercial architecture strict validator | PASS: 61 approved live paths, 43 planned-release paths |
| Publication gate | PASS: 61/61 approved, 43/43 planned protected |
| Temporary commercial gate | PASS: 63 exact controls unchanged |
| Gated-link occurrences | PASS: 138 unchanged across 42 targets |
| Sitemap crawl | PASS: 321 sitemap pages; no indexability or canonical conflict |
| Sitemap XML | PASS: 9 XML files parsed; zero `undefined` locations |
| Internal-link crawl | PASS: 31,838 occurrences, 338 unique targets, zero links to redirects/errors |
| Planned/draft discovery | PASS: zero sitemap or internal-link exposure |
| Runtime schema | PASS: one Product, one BreadcrumbList, one FAQPage; no aggregateRating or invented reviews |
| Product schema URL | PASS: equals canonical |
| PC-01 images | PASS: 42 source images returned HTTP 200; crawl found zero broken images |
| PDFs | PASS: crawl checked 52 site PDFs with zero failures; the PC-01 PDF control renders |
| Forms | PASS: two POST forms render (`/api/enquiry`, `/api/submit-review`); neither was submitted |

`PROVIDER_SANDBOX_REQUIRED` remains the existing form-delivery blocker and is outside PC-01.

## Build and browser QA

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | PASS |
| Lint | PASS with existing warnings listed below |
| Production build and postbuild | PASS |
| Build image manifest | 356 pages, 321 indexable pages, 5,605 entries |
| 360 px | PASS: no page overflow, clipping, broken image, or table containment issue |
| 390 px | PASS: no page overflow, clipping, broken image, or table containment issue |
| 768 px | PASS: no page overflow, clipping, broken image, or table containment issue |
| 1440 px | PASS: no page overflow, clipping, broken image, or table containment issue |
| Browser console | Zero warnings/errors captured |
| Component order | Existing 34-H2 sequence preserved at all four widths |

The mobile configuration table and six-row price table remain contained in their existing responsive wrappers. Browser checks found no clipped text. Screenshot differences caused only by responsive wrapping were not treated as design defects.

Evidence:

- [390 px screenshot](evidence/PC-01/pc-01-porta-cabins-390px.png)
- [1440 px screenshot](evidence/PC-01/pc-01-porta-cabins-1440px.png)

## Current performance state

No performance implementation was authorized or performed. The existing STG-01C baseline remains the current recorded state for `/product/porta-cabins`: performance score 62, FCP 1.54 s, LCP 9.64 s, TBT 468 ms, CLS 0.015, 2,172 KiB transfer, and 3,815 DOM nodes. Performance remains a separate workstream.

## Existing warnings and unrelated validator observations

These were retained and not suppressed or repaired:

- Lint/build: four existing `react-hooks/exhaustive-deps` warnings in the two price-calculator product templates.
- Lint/build: one existing `@next/next/no-img-element` warning in `src/pages/product/[category]/[slug].tsx`.
- Build: the existing warning that 1,008 redirects make total custom routes exceed 1,000.
- Complete crawl: zero internal redirect/error edges, but the command exits nonzero for two existing roofing redirect sources whose declared destinations are intentionally held 404 drafts.
- Redirect config scanner: zero chains and zero duplicate sources; it also reports two existing literal/pattern self-loop observations (`/product/labor-colony/` and `/:path+/`).
- Global calculator identity script: PC-01 passes 6/6; the script exits nonzero for the unrelated `/product/labor-colony/prefab-site-canteen` ladder state.
- Global merchant validator: PC-01 passes 6/6; the script reports six unrelated catalogue products missing from the feed because of existing image-product conditions.
- Global image-intake switch-on gate reports the existing repository-wide allowlist/intake backlog. The two authorized PC-01 source edits contain no image change, the generated image-manifest files have zero Git diff, and all 42 PC-01 image checks pass.
- The STG-01B checkpoint-protection wrapper rejects the authorized `porta-cabins.json` edit and an older `containerized-data-center.json` delta. The PC-01 runtime schema parser passes all targeted checks, so no structured-data implementation was changed to satisfy that checkpoint-specific guard.

## Remaining owner-fact production blockers

Local preview approval does not clear production deployment. At minimum, the package still requires:

- `OF-01`: product specifications, materials, construction claims, dimensions, and related pricing-basis claims.
- `OF-16`: dimensions, areas, heights, and any derived per-square-foot figures.
- `OF-21`: GST rate and HSN classification.
- `OF-18`: GA-plan counts and drawing-linked claims.
- `OF-03`: freight/free-delivery facts.
- `OF-04`: route/trailer freight ladders.

`OF-02` is closed and is not listed as open. Other fact-register gates for unchanged live content remain governed by package v2.5.1; this preview does not waive them.

## Preview and rollback

Production-equivalent local preview:

`http://localhost:3220/product/porta-cabins`

The URL was verified HTTP 200 and the preview process was left running for owner review. This is not a production deployment.

Rollback after this local commit is created:

1. Stop the local preview process if it is no longer needed.
2. On a clean branch, run `git revert <PC-01-commit>` to create a reversible rollback commit.
3. Re-run the publication gate and production build before any later preview.

Do not reset, merge, push, or deploy as part of rollback without separate authorization.
