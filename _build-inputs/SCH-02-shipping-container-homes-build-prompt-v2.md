# BUILD TICKET SCH-02 - Shipping Container Homes (v2, supersedes v1)

**Application: Claude Code. Session: NEW session.**
**Branch off `static-migration`. You build. You do not author copy, layout or facts.**

---

## 0. Inputs

All five files are in
`D:\Project-shekhar\all-product-images\Hub page (Container Houses)\shipping-container-homes\_build-inputs\`

| File | What it is | How to treat it |
|---|---|---|
| `SCH-02-shipping-container-homes-copy-v1.json` | Every string that renders, keyed by slot | **Read every string from here. Never retype one.** |
| `SCH-02-shipping-container-homes-content-map-v1.md` | Slot map: which copy, which keyword, which asset, in which block | **Read this before you write a line.** It is the wiring diagram. |
| `SCH-02-shipping-container-homes-asset-map-v1.json` | 49 image slots, each with its prebuilt WebP and alt text | Copy the files it names. Do not re-encode. |
| `SCH-02-shipping-container-homes-draft-v1.md` | Human-readable draft, research log, claim ledger | Reference only. The JSON wins. |
| `verify_sch02.py` | The verifier | Must print `RESULT: PASS` |

Image package:
`D:\Project-shekhar\all-product-images\Hub page (Container Houses)\shipping-container-homes\approved-website-assets-v1\`

Target URL: `https://www.samanportable.com/product/container-houses/shipping-container-homes`
It is one of the 105 approved URLs and it is already live. **This is a rewrite in place, not a new route.**

---

## 1. DESIGN LOCK (verbatim, non-negotiable)

`https://www.samanportable.com/product/porta-cabins` is the design for every product page. It is built and correct. Nobody authors layout; the build imports the production components the porta-cabins route uses and passes different content. Only four things may differ between any two product pages: copy strings, images and alt text, variant/size data rows and prices, internal-link destinations and anchors. Anything else that differs is a defect.

Eleven blocks in this order: 1 three-column hero (column 1 decision panel with `FEATURE_CELLS` that change with the size selector; column 2 gallery, six slides per size; column 3 Explore the Range panel); 2 contact/location bar; 3 size selector tabs (`usePremiumSizeTabs`); 4 price display for the selected size; 5 H2 `Explore the Range`; 6 Section 2 `RightToExist` (top block plus a split card with a 16:9 image on the left); 7 media/finished-work band; 8 Section 3 `SizeApplicationsExplorer` (image on the left, text on the right, per size); 9 Section 4 calculator (untouched; only the `ROUTE_LADDERS` entry reads the page's prices); 10 `You may also like` (current cluster only, 200s only); 11 Section 5 `Product Details` four tabs: Description/Info, Specifications/Specs, Shipping/Ship, Reviews. There is no Info tab.

Tokens `#1a3c2e`, `#2d7a3f`, `#f0f7f2`. An empty slot renders nothing, never fallback text. No 1:1 image before the calculator. The only sanctioned change to a shared component is an opt-in prop defaulting to false. The Shipping tab is the shared freight component exactly as the porta-cabins page renders it, including the two free-delivery lines. No U+2014 anywhere in body copy.

---

## 2. Five corrections this build must make to the live page

Each is required, not optional. The verifier asserts all five.

1. **Prices.** The live page publishes Rs 3,64,320 to Rs 9,13,920 ex-GST. Those figures are in no source. The approved ladder is in `copy-v1.json` under `variants` and is repeated in section 5 below. Replace all six, and update the `ROUTE_LADDERS` entry in `calculatorLadders.ts` from the page's own product JSON via `toRows(...)`.
2. **Warranty.** The live page publishes a 5-year structural warranty. The approved figure is **10 years structural, 1 year finishing extendable to 2**. Correct it here and wherever the shared product JSON feeds it.
3. **Product positioning.** The live page sells a "reinforced MS shell built for relocation and coastal duty". That has no source. It is removed. The sourced differentiator is the genuine cargo-shell conversion, already written into `copy-v1.json`.
4. **Quote-response promise.** Delete `Custom quote target: 48 business hours`. No quote-response time is published without a source.
5. **Explore the Range.** The live panel carries three tiles frozen at its build date. Resolve the set at build time from the approved list in section 4: hub first, this page excluded, no duplicates, no cross-cluster tiles, every destination confirmed 200 at build time. Never pad a slot by repeating a tile.

---

## 3. Keyword ownership - the SEO rules you must not break

Part A of the content map is the full table. These are the four rules that show up as build decisions:

- **One H1 only**, exactly `copy.h1`. The primary term is `shipping container house` / `shipping container homes`.
- **Forbidden anchor text anywhere on this page:** `container house`, `container house price`, `container home`, `container homes`, `container room`, `container house design`, `low cost container house`. Those anchors belong to the hub and to `prefab-container-homes`, and using them here re-opens a cannibalisation the copy was written to close.
- **Section 2 carries exactly one contextual internal link**, to `/product/container-houses/prefab-container-homes`, anchor `prefab container homes`. Do not add a second contextual link to Section 2.
- **Sizes are in-page selectors, never URLs.** No `?size=` route, no `/20x10` path, no size-specific canonical. That is the doorway gate.

---

## 4. Approved Container Houses set

Hub `/product/container-houses`, then: `container-farmhouse`, `expandable-container-house`, `flat-pack-container-homes`, `luxury-container-houses`, `prefab-container-homes`, `shipping-container-homes` (this page, excluded from its own panels), `tiny-container-homes`.

Render only entries returning 200 at build time.

**Do not link to, and assert zero occurrences of:** `prebuilt-container-homes`, `prefabricated-container-home`, `prefabricated-container-house`, `modern-container-home`, `affordable-container-homes`, `/product-category/container-houses`. None is inside the approved 8. A component that picks one up from a sitemap or category query is a defect, not a data problem.

---

## 5. Variant and price data

| Size | Built-up | Carpet | Rate/sq.ft | Ex-GST | Incl. 18% GST |
|---|---:|---:|---:|---:|---:|
| 20x8x8.5 ft | 160 sq.ft | 146 sq.ft | 1,760 | 2,81,600 | 3,32,288 |
| 20x10x8.5 ft | 200 sq.ft | 185 sq.ft | 1,600 | 3,20,000 | 3,77,600 |
| 20x12x8.5 ft | 240 sq.ft | 224 sq.ft | 1,536 | 3,68,640 | 4,34,995 |
| 40x8x8.5 ft | 320 sq.ft | 296 sq.ft | 1,520 | 4,86,400 | 5,73,952 |
| 40x10x8.5 ft | 400 sq.ft | 375 sq.ft | 1,520 | 6,08,000 | 7,17,440 |
| 40x12x8.5 ft | 480 sq.ft | 454 sq.ft | 1,504 | 7,21,920 | 8,51,866 |

Prices display ex-GST with the incl-GST figure alongside, exactly as porta-cabins renders it. AggregateOffer takes the ex-GST basis: `lowPrice` 281600, `highPrice` 721920, `priceCurrency` INR.

---

## 6. Images

Read `asset-map-v1.json`. Every slot names a `prebuilt_webp`. **Copy the file. Do not re-encode it.** A second lossy pass costs quality for nothing, and re-encoding is how a stale picture ships.

| Group | Count | Px | Where |
|---|---:|---|---|
| `01-gallery-webp` | 36 | 1254 x 1254 | Hero column 2, six per size, slot order 01 to 06 |
| `02-section3-drawings` | 6 | 1920 x 1440 | Section 3 left panel, one per size |
| `03-section2-split-card` | 1 | 1920 x 1080 | Section 2 split card |
| `04-description-images` | 6 | 1920 x 1080 | **Inside the Description tab**, one per size, in the section order given in the content map |

All 49 are WebP and measured between 80 and 120 KB. The verifier asserts the band.

- **The six Section 3 drawings are authored at exactly 4:3 for the 4:3 cover panel. Never crop them at any size for any reason.** A cropped drawing loses dimension text.
- Section 2 takes the realistic render, never a drawing.
- Source PNG and SVG masters stay in the package as archival. **Nothing but WebP reaches `public/`.**

Loading: the six images of the selected size eager with `fetchpriority="high"` on slide 1 only; the other thirty lazy; explicit `width` and `height` on every `img`; a preload link for slide 1 of the default size carrying the same `imagesrcset`. Section 3 drawings and description images lazy.

---

## 7. Structured data

ItemPage, Product with AggregateOffer (INR, ex-GST basis), BreadcrumbList, FAQPage with the eight questions **byte-identical** to the Description tab. Nothing else. No rating schema, because there are no verified reviews.

---

## 8. Template Conformance Gate - six artefacts, all required

1. Structural diff against the porta-cabins route, zero delta outside the four permitted differences.
2. Component-order assertion listing the eleven blocks in order.
3. Full-page desktop and mobile screenshots.
4. Prop audit: every prop passed to every shared component, plus confirmation that no shared component was modified beyond an opt-in prop defaulting to false.
5. DOM checks: exactly one H1; no empty headings; no empty or duplicate alt; no U+2014; all four tab panels present in the fetched HTML; zero hits for `available on request`, `coming soon`, `contact us for details`, `TBD`, `placeholder`; zero hits for the six forbidden URLs in section 4 and the forbidden anchors in section 3.
6. Mobile Core Web Vitals against the live equivalent.

"Checks passed" or a green count is not evidence. Open the artefact and verify the rendered page or the diff.

---

## 9. Build, verify, deploy

The repo has no Vercel config and no deployment integration, so there is no hosted preview. Run a local production build:

```
npm run build
npx next start -p 3210
```

Run `verify_sch02.py`, the DOM checks and Lighthouse against
`http://127.0.0.1:3210/product/container-houses/shipping-container-homes`.
Leave the server running and give SAMAN the two commands to reproduce.

Five validators fail identically at pristine `static-migration` HEAD from stale pinned constants. Stash your changes and re-run at HEAD before reporting any validator failure, and report only failures your own branch introduced.

**When `verify_sch02.py` prints `RESULT: PASS`, merge and deploy. Do not stop for approval.** SAMAN reviews the live URL, not a localhost preview. Run the post-deploy checks against production and report the live URL.

If PASS is not reachable, stop and report the failing assert with its line number instead of deploying.

If this ticket asks for something the repo does not have, the ticket is wrong, not the repo. Stop and report the conflict. Do not invent a component or an opt-in prop to satisfy it.
