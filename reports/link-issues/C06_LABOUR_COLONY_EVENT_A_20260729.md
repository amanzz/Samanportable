# C-06 Labour Colony — Event A retirement and redirects

Date: 2026-07-29
Branch: `fix/c06-labour-colony-event-a-20260729`
Worktree: `C:\tmp\saman-c06-labour-colony-event-a-20260729`
Base: `origin/static-migration` at `e4abb76485e861d128da88070000c1664c75aa1c`

## Outcome

The C-06 retirement and redirect change is built and validated in the isolated worktree. It has not been committed, pushed, merged, or deployed.

All nine ruled source URLs return a single-hop HTTP 301 in the built local preview. Each final production-form destination returns HTTP 200. Six retired product records and the retired category record are preserved byte-for-byte under non-routable archive directories and are absent from the active route tree, listings, related-product rails, sitemaps, Merchant feed, and both local-inventory feed routes.

The four winner records and their page components were not edited.

## Winner gate: before and after

The required pre-write production check passed on 2026-07-29:

| Winner | Production before | Canonical before | Built preview after | Canonical after |
|---|---:|---|---:|---|
| `/product/labor-colony` | 200 | self | 200 | self |
| `/product/labor-colony/labor-sheds` | 200 | self | 200 | self |
| `/product/labor-colony/labor-hutments` | 200 | self | 200 | self |
| `/product/labor-colony/prefab-labor-camps` | 200 | self | 200 | self |

“After” means the validated local production build. Production was not changed because deployment was outside this event.

## Redirect hop table

| Source | Final destination | Preview source status | Destination status | Hops |
|---|---|---:|---:|---:|
| `/product/labor-colony/` | `/product/labor-colony` | 301 | 200 | 1 |
| `/product/labor-colony/prefab-labor-sheds` | `/product/labor-colony/labor-sheds` | 301 | 200 | 1 |
| `/product/labor-colony/prefab-labor-hutments` | `/product/labor-colony/labor-hutments` | 301 | 200 | 1 |
| `/product/labor-colony/labor-camps` | `/product/labor-colony/prefab-labor-camps` | 301 | 200 | 1 |
| `/product/labor-colony/labor-accommodations` | `/product/labor-colony` | 301 | 200 | 1 |
| `/product/labor-colony/labor-cottages` | `/product/labor-colony` | 301 | 200 | 1 |
| `/product/labor-colony/labor-shelters` | `/product/labor-colony` | 301 | 200 | 1 |
| `/product/labor-colony/prefab-labour-colony` | `/product/labor-colony` | 301 | 200 | 1 |
| `/product-category/labor-colony` | `/product/labor-colony` | 301 | 200 | 1 |

The redirect audit found no literal redirect chains in the site-wide configuration. It also verified the expected status and destination for all nine rules.

Four pre-existing redirects were re-pointed from the retiring category URL directly to the winner hub:

- `/project/bunkhouse-for-rent`
- `/project/bunkhouse-for-sale`
- `/project/portable-bunkhouse`
- `/project/prefab-labour-colony-in-bangalore`

## Trailing-slash convention and enumeration

The site convention found in both the repository and the production sitemap is no trailing slash. At verification time, production already returned 308 from `/product/labor-colony/` to `/product/labor-colony`; the event replaces that behavior in the built preview with the ruled single-hop 301. Winner slash variants likewise normalize to their unslashed canonical forms.

The remaining prefix URLs discovered outside the listed sources and four winners were enumerated without changing them:

| Enumerated URL | Production status on 2026-07-29 | Action |
|---|---:|---|
| `/product/labor-colony/labor-colony` | 410 | None |
| `/product/labor-colony/labor-colony/` | 308 to the unslashed 410 URL | None |
| `/product-category/labor-colony/` | 308 to `/product-category/labor-colony` | None |

No additional prefix URL was present in the production sitemap or repository route-record inventory.

## Record retirement and git counts

Seven records were moved out of routable source directories:

- 6 product records: `labor-accommodations`, `labor-camps`, `labor-cottages`, `labor-shelters`, `prefab-labor-hutments`, and `prefab-labor-sheds`
- 1 category record: `labor-colony`

The six product sources are now under `src/data/wp-export/redirected-products/`. The category source is under `src/data/wp-export/redirected-categories/`. Blob-hash comparisons against the base revision passed for all seven moves, proving byte-for-byte preservation.

Active `src/data/wp-export/products/` now contains only these Labour Colony products:

- `labor-colony`
- `labor-sheds`
- `labor-hutments`
- `prefab-labor-camps`

The active category directory contains no `labor-colony` record. A listing-level retirement denylist prevents the archived sources from re-entering listings, related rails, or feeds.

## Internal links

The pre-change routable-content scan found 21 href occurrences resolving to retired URLs:

| Form | Before | After |
|---|---:|---:|
| Absolute hrefs | 21 | 0 |
| Relative hrefs | 0 | 0 |
| Total | 21 | 0 |

The built-site crawl inspected 51,850 internal anchor occurrences across 419 unique internal paths. It found:

- zero links to retired URLs;
- zero links resolving through a redirect;
- zero internal-link errors.

The four winner source records remain byte-identical. Their ten source href occurrences were rewritten only at the static-content rendering boundary:

| Winner | Retired hrefs in locked source | Retired hrefs rendered | Visible text unchanged |
|---|---:|---:|---|
| Hub | 6 | 0 | Yes |
| Labor Sheds | 2 | 0 | Yes |
| Labor Hutments | 1 | 0 | Yes |
| Prefab Labor Camps | 1 | 0 | Yes |

The ten protected `/labour-colonies-in-*` location pages had zero links to the retired URLs and were not edited.

## Sitemap reconciliation

| Segment | Before | After | Change |
|---|---:|---:|---:|
| Products | 164 | 158 | -6 |
| Locations | 213 | 213 | 0 |
| Projects | 1 | 1 | 0 |
| Editorial | 78 | 78 | 0 |
| Total page URLs | 456 | 450 | -6 |

The product image sitemap likewise changed from 164 to 158 product locations. The generated postbuild manifest reported 450 indexable pages, with zero non-200 pages and zero noindex/canonical-elsewhere pages. All four winners remain present, and all six retired products are absent.

## Price defect reconciliation

No price was changed in this event.

The nine related-product prices are stored in their individual product JSON records. Each exact numeral appears in the record’s price fields and cached Rank Math head payload. The cached head includes price metadata and Product/Offer price structured data; the live product structured-data component also reads the record price.

| Related product | Price | Repository record after retirement | Master status | Merchant before | Local inventory before | After |
|---|---:|---|---|---|---|---|
| Labor Cottages | ₹12,90,000 | `redirected-products/labor-cottages.json` | Unapproved/retired | Present | Present in both store rows | Absent from all feeds/listings |
| Labor Sheds | ₹13,65,000 | `products/labor-sheds.json` | Approved winner | Present | Present | Remains |
| Prefab Labor Sheds | ₹26,40,000 | `redirected-products/prefab-labor-sheds.json` | Unapproved/retired | Present | Present in both store rows | Absent from all feeds/listings |
| Labor Shelters | ₹25,85,000 | `redirected-products/labor-shelters.json` | Unapproved/retired | Present | Present in both store rows | Absent from all feeds/listings |
| Labor Hutments | ₹28,25,000 | `products/labor-hutments.json` | Approved winner | Present | Present | Remains |
| Prefab Labor Hutments | ₹33,35,000 | `redirected-products/prefab-labor-hutments.json` | Unapproved/retired | Present | Present in both store rows | Absent from all feeds/listings |
| Labor Camps | ₹29,65,000 | `redirected-products/labor-camps.json` | Unapproved/retired | Present | Present in both store rows | Absent from all feeds/listings |
| Prefab Labor Camps | ₹35,75,000 | `products/prefab-labor-camps.json` | Approved winner | Present | Present | Remains |
| Labor Accommodations | ₹37,40,000 | `redirected-products/labor-accommodations.json` | Unapproved/retired | Present | Present in both store rows | Absent from all feeds/listings |

Before retirement, each of the six unapproved products appeared in the Merchant feed and produced two local-inventory rows, one for each configured store. The final feed audit found none of the six in the Merchant feed or either local-inventory route.

The related-products data is loaded and transformed by `src/pages/product/[category]/index.tsx`. Its desktop price slider is rendered in that route; the mobile price list is rendered by `src/components/MobileBottomNav.tsx`. `src/components/RelatedProductRail.tsx` renders the related hero cards without prices. Removing the six retired products from listing eligibility removes their cards and price surfaces while leaving the three approved winner products.

Numeral-only searching also found `1365000` under a different product name in non-routable `redirected-products/prefab-labour-colony.json`, in `regular_price`. This was not changed and is flagged to Fable 5.

The archived category description also contains price-band copy for several of these numerals. It remains byte-for-byte preserved in the non-routable archive and is no longer rendered.

## Four-winner content lock

Content-layer comparison against `origin/static-migration` passed for all four winner records:

- 4 of 4 source records are byte-identical;
- no winner page component was edited;
- no specification table, PDF, L3 field, or schema component was edited;
- rendered visible text is unchanged on all four winners;
- source JSON-LD/cached head payloads are unchanged.

The only runtime transformation affecting locked winner content rewrites retired href attributes to the ruled final destinations. Related cards disappear because the underlying retired products are no longer listing-eligible.

## Validation

- `node scripts/audit-c06-redirects.js --assert`: passed
- `node scripts/audit-c06-labour-colony-feeds.js --assert-retired-absent`: passed
- `node scripts/audit-c06-sitemaps-and-links.js --assert`: passed against the built preview
- `npm run type-check`: passed
- `npm run build`: passed, including Next.js lint/type checks, compilation, static generation, and postbuild sitemap validation
- `git diff --check`: passed before the final report was added

The preview server used for HTTP and crawl validation was stopped. Work remains uncommitted and unstaged for Fable 5 review.
