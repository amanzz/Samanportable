# SEO template fixes — local verification report (2026-08-02)

## Scope and input status

This phase is local-only. Nothing was deployed, no Google Merchant Center fetch was triggered, and no product URL, page design, price, review, contact detail, Zoho form, GTM, GA4, or conversion-tracking configuration was intentionally changed.

The repository was clean at the start (`git status --short` returned no entries). The requested `new-issue` directory and its six dated 20260802 source CSV files were not present anywhere in the repository or its parent workspace. Older exports exist under `reports/`, but they are not substitutes for the missing dated files. Therefore:

- the six source CSVs could not be modified (they were absent);
- the confirmed counts and groupings below come from the owner-provided audit summary;
- the requested independent parse/grouping of all 291 current ratio URLs could not be completed and remains the only evidence blocker.

Reported ratio grouping from the supplied summary: 81 filtered/paginated blog URLs, 123 product-detail URLs, and 87 remaining URLs across the homepage, product listing, and other shared templates.

## Root causes and fixes

### 1. Broken `/cdn-cgi/l/email-protection` links, 404, and nofollow warnings

Root cause: Cloudflare Email Address Obfuscation rewrites valid origin email addresses and `mailto:` anchors at the edge, creating `/cdn-cgi/l/email-protection` links and injecting `email-decode.min.js`. This is one transformation defect repeated across shared header/footer output, not hundreds of application routes.

Repository findings:

- shared email surfaces are in `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/ds/ZoneContactCard.tsx`, `src/components/product/ProductZoneCtas.tsx`, `src/components/chatbot/ChatbotPanel.tsx`, and `src/pages/contact.tsx`;
- source templates already render valid `mailto:sales@samanportable.com` and `mailto:ncr@samanportable.com` anchors;
- a complete source/build scan found no `/cdn-cgi/l/email-protection`, `__cf_email__`, or `email-decode.min.js` occurrence;
- representative built pages contain 4–6 valid `mailto:` links and zero Cloudflare protection links.

No application route, redirect, or client-side replacement was added. A code-level `email_off` wrapper is unnecessary if the zone setting is disabled, and wrapping only selected components would leave plain-text email surfaces vulnerable to the same edge rewrite.

Required production action: during the separately authorized deployment, turn **Email Address Obfuscation off** for `www.samanportable.com` in Cloudflare Security Settings / Scrape Shield, or apply a hostname configuration rule with `email_obfuscation: false`. Cloudflare documents both the global setting and the supported `<!--email_off-->...<!--/email_off-->` exception: <https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/>.

### 2. Invalid Product structured data

Root cause reproduced locally: `ProductStructuredData.tsx` emitted a `ProductGroup` with nine `hasVariant` Product nodes. The affected price ladders were represented in a way that left all nine child Products without `offers`, `aggregateRating`, or `review`, exactly matching the audit's nine errors per page. The related-product cards themselves did not emit Product JSON-LD or Product microdata.

Template fix:

- emit one primary `Product` entity for each product-detail page;
- represent the visible, approved variant price ladder as one `AggregateOffer` on that Product;
- derive `lowPrice`, `highPrice`, `offerCount`, INR currency, images, SKU, description, brand, and availability from the existing catalog/variant data;
- omit availability when the catalog status is unknown instead of defaulting to `InStock`;
- omit Product entirely when no real offer/rating/review evidence exists;
- remove fabricated fallback description, fallback category, placeholder schema image, and rolling `priceValidUntil`;
- retain real aggregate ratings/reviews only when supplied by the same product/review data rendered on the page;
- keep related-product cards as ordinary links (no standalone Product entities);
- keep JSON-LD server-rendered in the initial HTML.

JSON-LD results:

| URL | Product entities before | Incomplete before | Product entities after | Incomplete after | Offer after |
| --- | ---: | ---: | ---: | ---: | --- |
| `/product/portable-cabin` | 9 | 9 | 1 | 0 | AggregateOffer INR 137,500–552,000 (9 offers) |
| `/product/portable-cabin/portable-cabin-with-toilet` | 9 | 9 | 1 | 0 | AggregateOffer INR 165,000–662,400 (9 offers) |
| `/product/portable-cabin/portable-shop-cabin` | 9 | 9 | 1 | 0 | AggregateOffer INR 225,000–639,500 (9 offers) |

Every JSON-LD script on the representative pages parsed successfully as JSON. The offer price ranges were also present in visible server-rendered page text.

### 3. `/blog?category=prefab-solutions&page=2` crawl warning

Findings:

- the listing already used `getServerSideProps`; it did not depend on `useSearchParams`, a client click, or a Suspense boundary;
- valid category/page parameters produced server-rendered cards and real anchors;
- valid canonical construction already retained meaningful parameters in stable `category` then `page` order;
- invalid/out-of-range pages returned a blank/noindexed HTTP 200 fallback;
- category post objects serialized unused WordPress export fields, making `__NEXT_DATA__` 121,014 bytes on the reported page and increasing crawler work;
- the visible next-page message still used an obsolete 20-post calculation and showed `Next -2 articles available` on page 2.

Template fix:

- project blog cards to only the fields the SSR listing renders (title, excerpt, date, slug, featured image, author, terms, and calculated reading time);
- return Next `notFound` for invalid or out-of-range page numbers and for server/data failures instead of an empty 200;
- use one shared 10-post page-size constant for fetching and the visible next-page count.

Verification:

- browser UA: 200; Googlebot UA: 200;
- query order variants both return 200;
- canonical: `https://www.samanportable.com/blog?category=prefab-solutions&page=2`;
- 10 server-rendered `<article>` elements;
- page 1/page 2 title overlap: 0;
- previous/next/page-number anchors preserve `category=prefab-solutions` and the correct page;
- page 2 visibly reports `Next 10 articles available`;
- page `999`, `0`, and non-numeric `abc`: 404 for browser and Googlebot UAs.

### 4. Low text-to-HTML ratios

Root causes by shared template:

- filtered blog listings: unused post export properties duplicated in `__NEXT_DATA__`;
- product detail/hub pages: full related-product descriptions were serialized although the UI truncates them to 130 characters;
- homepage and product listing: ratios are dominated by framework markup, rich UI/component markup, inline icon SVG, styles, navigation, and hydration rather than empty/client-only primary content.

Safe fixes:

- compact blog-card server props;
- add one shared related-product projection used by both dynamic product templates;
- preserve visible titles, excerpts, descriptions, specifications, internal links, enquiry CTAs, images, prices, accessibility attributes, and forms;
- do not add filler text or remove content/navigation merely to manipulate the ratio.

Measurement method: UTF-8 bytes of normalized visible text divided by UTF-8 bytes of the complete production HTML response, after excluding script, style, noscript, and SVG blocks from visible text.

| Representative URL | Before HTML | After HTML | Before ratio | After ratio | `__NEXT_DATA__` before → after |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 325,607 | 325,607 | 5.55% | 5.55% | 681 → 681 |
| `/blog` | 155,812 | 145,287 | 3.97% | 4.26% | 18,971 → 8,446 |
| `/blog?category=prefab-solutions&page=2` | 243,517 | 131,419 | 2.65% | 4.92% | 121,014 → 8,916 |
| `/product` | 139,834 | 139,834 | 2.86% | 2.86% | 4,168 → 4,168 |
| `/product/portable-cabin` | 359,980 | 275,250 | 6.23% | 8.15% | 161,702 → 68,163 |
| `/product/portable-cabin/portable-cabin-with-toilet` | 313,092 | 277,744 | 7.99% | 9.01% | 112,731 → 68,971 |
| `/product/portable-cabin/portable-shop-cabin` | 308,173 | 272,966 | 7.06% | 7.97% | 112,731-class baseline → 67,376 |

Remaining ratio warnings: the homepage, product listing, blog listings, and some product pages remain below 10%. Their initial HTML contains meaningful SSR content. Reaching 10% would require removing useful UI/navigation/accessibility markup, replacing the established icon system, or adding filler copy; those changes were intentionally not made. The missing 20260802 ratio CSV also prevents a verified 291-URL aggregate recalculation.

## Files changed

- `src/components/ProductStructuredData.tsx` — one evidence-backed primary Product, AggregateOffer for variants, no incomplete/fabricated fallbacks.
- `src/pages/blog.tsx` — compact SSR props, deterministic 404 handling, shared pagination size/count.
- `src/pages/product/[category]/index.tsx` — shared compact related-product projection.
- `src/pages/product/[category]/[slug].tsx` — shared compact related-product projection.
- `src/lib/relatedProductSummary.ts` — reusable server-prop projection for related cards/rails.
- `new-issue/seo-fix-local-report-20260802.md` — this report.

No audit CSV was deleted, renamed, or edited. The specified six files were absent.

## Commands and results

- `git status --short` — clean baseline before work.
- `rg` scans for Cloudflare paths, email forms, Product JSON-LD/microdata, blog query handling, and shared templates — completed; no Cloudflare protection path in source/build.
- `npm run type-check` — pass (`tsc --noEmit`).
- `npm run lint` — pass (no warnings or errors).
- `npm run build` — pass; optimized Next.js production build and postbuild completed.
- `npm start -- -p 3100` — production preview served locally.
- local HTTP/HTML verification — all JSON-LD parsed; entity/link/ratio results shown above.
- browser QA — desktop and 390 px mobile views checked for homepage, filtered blog, and all three reported product pages; main content, image galleries, responsive navigation, calls, mail links, sticky quote CTAs, and product prices rendered. The Get Quote control opened its enquiry form; the form was not submitted. No tracking/deployment action was taken.
- no test script exists in `package.json`; there was no repository test command to run.
- `git diff --check` — pass.

## `git diff --stat`

```text
 src/components/ProductStructuredData.tsx | 166 ++++++-------------------------
 src/pages/blog.tsx                       |  87 +++++++++++-----
 src/pages/product/[category]/[slug].tsx  |  15 +--
 src/pages/product/[category]/index.tsx   |   6 ++
 4 files changed, 98 insertions(+), 176 deletions(-)
```

`git diff --stat` does not include untracked files. The untracked deliverables are `src/lib/relatedProductSummary.ts` and this report.

## Remaining decisions / blockers

1. The six requested 20260802 CSV files must be restored to `new-issue/` if an exact 291-URL grouping and source-file preservation check is required.
2. On the separately authorized production deployment, Cloudflare Email Address Obfuscation must be disabled for `www.samanportable.com`; otherwise Cloudflare can recreate the reported `/cdn-cgi/l/email-protection` links even though origin HTML is correct.

Stopped after local verification. No deployment was performed.
