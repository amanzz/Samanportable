# CH-PFB-04 · Prefab Container Homes · Build Prompt v1

> **APPLICATION: Claude Code.**
> **SESSION: NEW session. Do not continue an existing one.**
> **Branch: `static-migration`. Do not commit to `main`.**

---

## 0. What you are doing

Rewrite `https://www.samanportable.com/product/container-houses/prefab-container-homes` to the locked porta-cabins
page shape, using the copy and assets supplied below. The page already exists and is live; this is a full rewrite of
its content, not a new route.

**You author nothing.** No copy, no layout, no facts, no headings, no alt text, no prices. Every string comes from
`CH-PFB-04-prefab-container-homes-copy-v1.json`, read verbatim. Every image comes from
`CH-PFB-04-prefab-container-homes-asset-map-v1.json`. If something you need is not in those two files, **stop and
report it**. Do not fill the gap.

## 1. Files

All five are in
`D:\Project-shekhar\all-product-images\Hub page (Container Houses)\prefab-container-homes\_build-inputs\`

| File | Use |
|---|---|
| `CH-PFB-04-prefab-container-homes-copy-v1.json` | Every string, keyed by slot. Never retype a string from it. |
| `CH-PFB-04-prefab-container-homes-asset-map-v1.json` | Every image slot, source path, output path, settings, alt text. |
| `CH-PFB-04-prefab-container-homes-build-prompt-v1.md` | This file. |
| `CH-PFB-04-prefab-container-homes-draft-v1.md` | Reference only. The JSON wins on any disagreement. |
| `verify_ch_pfb_04.py` | The verifier. Must print `RESULT: PASS` before you deploy. |

**The web-ready images are already encoded.** They are in
`D:\Project-shekhar\all-product-images\Hub page (Container Houses)\prefab-container-homes\_web-assets\`
in three folders, `gallery\`, `ga\` and `wide\`. Copy them into `public/` under
`/images/products/container-houses/prefab-container-homes/` keeping the same three folders. **Do not re-encode them and
do not put any source PNG into `public/`.**

The 3D general arrangement master PNGs and their editable SVGs are in `01 GA Drawings\` in the same page folder. They
are the print masters. They do not go into `public/`.

## 2. Design lock — non-negotiable

`https://www.samanportable.com/product/porta-cabins` is the design. **Import the production components that route
already uses and pass different content.** Do not author layout. Do not fork a component. The only sanctioned change to
a shared component is an opt-in prop defaulting to `false`.

Eleven blocks, in this order:

1. Three-column hero — column 1 decision panel with `FEATURE_CELLS` that change with the size selector; column 2 gallery, six slides per size; column 3 Explore the Range panel
2. Contact / location bar (shared)
3. Size selector tabs via `usePremiumSizeTabs`
4. Price display for the selected size
5. H2 `Explore the Range`
6. Section 2 `RightToExist` — top block plus a split card with a 16:9 image on the left
7. Media / finished-work band
8. Section 3 `SizeApplicationsExplorer` — the 3D general arrangement sheet on the left, text on the right, per size
9. Section 4 calculator — untouched; only the `ROUTE_LADDERS` entry reads this page's prices
10. `You may also like` — current cluster only, 200s only
11. Section 5 Product Details — four tabs: Description, Specifications, Shipping, Reviews. **There is no Info tab.**

Tokens `#1a3c2e`, `#2d7a3f`, `#f0f7f2`. An empty slot renders nothing, never fallback text. No 1:1 image before the
calculator. The Shipping tab is the shared freight component exactly as porta-cabins renders it, including the two
free-delivery lines. **No U+2014 anywhere in body copy.**

## 3. Size set and prices

Six sizes, in this order: **20x8, 20x10, 20x12, 40x8, 40x10, 40x12.** Approved by SAMAN on 6 September 2026 as
Option B. Do not add 10x10 or 30x10.

| Size | Area | Rate/sq.ft | Ex-GST | Incl. 18% GST |
|---|---:|---:|---:|---:|
| 20x8 ft | 160 sq.ft | 1,787.50 | 2,86,000 | 3,37,480 |
| 20x10 ft | 200 sq.ft | 1,625.00 | 3,25,000 | 3,83,500 |
| 20x12 ft | 240 sq.ft | 1,560.00 | 3,74,400 | 4,41,792 |
| 40x8 ft | 320 sq.ft | 1,543.75 | 4,94,000 | 5,82,920 |
| 40x10 ft | 400 sq.ft | 1,543.75 | 6,17,500 | 7,28,650 |
| 40x12 ft | 480 sq.ft | 1,527.50 | 7,33,200 | 8,65,176 |

**These prices differ from the ones live on the page today.** The live page publishes a 200 sq.ft base of Rs 1,475/sq.ft;
the approved workbook base is Rs 1,625/sq.ft. The table above is the workbook. **Do not deploy the new prices until
SAMAN has confirmed them in writing.** If the confirmation has not arrived when you build, build the page and hold the
deploy, and say so in your report.

Update the `ROUTE_LADDERS` entry for this route to the ex-GST column. Change nothing else in the calculator.

## 4. Warranty correction — do this in the same release

The live page publishes a **5-year structural warranty**. SAMAN confirmed on 6 September 2026 that the structural
warranty is **10 years**. Every occurrence of the 5-year figure on this route must become 10 years. Finishing warranty
stays 1 year extendable to 2.

`shipping-container-homes` and `luxury-container-houses` publish the same wrong 5-year figure. **They are out of scope
for this build. Report them; do not edit them here.**

## 5. Images

46 slots, all listed in the asset map with source, output, settings and alt text.

- **Gallery**, 36 files: six 1:1 slides per size at 1254 x 1254 WebP, in the order given in the asset map.
- **Section 3**, 6 files: one 3D general arrangement sheet per size, 1800 x 1377 WebP, aspect 489:374.
- **Section 2 split card**, 1 file: `wide/prefab-container-homes-20x10-wide-elevated-three-quarter.webp`, 1600 x 900.
  This is a **realistic render, not a drawing**, on SAMAN's instruction of 6 September 2026.
- **Media band**, 3 files: the 40x10, 40x12 and 20x8 wide crops, 1600 x 900.

Alt text is in the asset map. Do not write your own. Do not crop, rotate or re-order anything.

**Known deviation to report, not to fix:** 21 of the 36 gallery files exceed the 120 KB ceiling, between 121 KB and
315 KB. The source renders carry dense planted backgrounds that WebP cannot compress into the 80-120 KB band at
1254 px without visible loss on the product itself. Quality was floored at q72 to hold image quality. This is
SAMAN's call, recorded in the Stage 1 report.

## 6. Internal links

- Section 2 paragraph 1 carries exactly one contextual link, to `/product/container-houses`, anchor
  `container house range page`.
- Explore the Range panel and You may also like: `/product/container-houses`,
  `/product/container-houses/shipping-container-homes`, `/product/container-houses/luxury-container-houses`.
  **Live 200s only.** Do not link flat-pack, expandable, tiny or farmhouse; those routes are not built.
- Description section 8 mentions flat-pack, expandable and labour colony **in prose without links**, because two of
  those three routes do not exist yet. Do not add links there.

## 7. Structured data

ItemPage, Product with AggregateOffer (`priceCurrency` INR, `lowPrice` 286000, `highPrice` 733200, `offerCount` 6,
ex-GST basis), BreadcrumbList, FAQPage. The FAQPage answers must be **byte-identical** to the seven answers rendered in
the Description tab. Nothing else. No rating schema: there are no verified reviews.

## 8. Empty slots

- `specifications.diagrams` — the approved folder holds no technical diagrams. Render nothing.
- `specifications.technical_pdf` — no technical specification PDF exists for this page. Render nothing, no fallback link.

## 9. What to return

1. The preview URL.
2. `verify_ch_pfb_04.py` output ending `RESULT: PASS`.
3. The six Template Conformance Gate artefacts.
4. A PR against `static-migration`.
5. A one-screen report listing: the price hold status, the 5-to-10-year warranty change made on this route, the two
   sibling routes still publishing 5 years, and the 21 gallery files over the byte ceiling.

Do not deploy. SAMAN opens the preview, checks the facts and deploys.
