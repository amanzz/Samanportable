# CLAUDE CODE BUILD PROMPT - PO-06 Portable Construction Site Cabin

**This prompt goes into Claude Code, in a NEW session. Paste the whole file.**

You are building one page of samanportable.com in the Next.js repository:
`https://www.samanportable.com/product/portable-office/construction-site-cabin` - a **new page that returns 404 today**.
Work on a branch cut from `origin/static-migration`; open the PR against `static-migration`. Do not deploy. SAMAN deploys after approving the local preview.

## Inputs (read all four before touching code; do not retype any copy)

All four are in `D:\Project-shekhar\all-product-images\Hub (Portable Office Cabin)\construction-site-cabin\_build-inputs\`:

1. `PO-06-construction-site-cabin-copy-v1.json` - every string the page renders, keyed by slot. This is the only source of copy. Read it with a JSON parser and wire it in; never paste strings by hand.
2. `PO-06-construction-site-cabin-asset-map-v1.json` - every image slot, its source file in the approved package, its output path, the WebP settings and the loading rules.
3. `PO-06-construction-site-cabin-draft-v1.md` - the human-readable draft with the research log and the claim ledger. Use it to understand intent; the JSON is what you build from.
4. `verify_po06.py` - the acceptance test. The build is not done until it prints `RESULT: PASS`.

Approved asset package: `...\construction-site-cabin\approved-website-assets-v1\`. There is no v2 or v3; do not look for one.

## DESIGN LOCK

`https://www.samanportable.com/product/porta-cabins` is the design. It is already built and correct. You do not author layout. You import the production components the porta-cabins route uses and pass this page's content. Only four things may differ between the porta-cabins page and this page: copy strings, images and alt text, variant/size data rows and prices, and internal-link destinations and anchors. Anything else that differs means the build is wrong. Canonical block order, eleven blocks: 1 three-column hero, 2 contact/location bar, 3 size selector tabs (`usePremiumSizeTabs`), 4 price display for the selected size, 5 H2 `Explore the Range` panel, 6 Section 2 `RightToExist` with its split card, 7 the Section 2 media pairing (no separate media-band component exists), 8 Section 3 `SizeApplicationsExplorer`, 9 Section 4 calculator, 10 `You may also like`, 11 Section 5 `Product Details` four-tab strip with responsive dual labels: Description/Info, Specifications/Specs, Shipping/Ship, Reviews. The second word of each pair is the small-screen label and must differ from the first; `DescriptionDescription` is a defect. There is no fifth tab called Info: do not add a tab, and do not remove the word. Design tokens `#1a3c2e`, `#2d7a3f`, `#f0f7f2`; never restyle. The only sanctioned change to a shared component is an opt-in prop defaulting to false; prefer existing props first (`showSectionDividers`, `usePremiumSizeTabs`, `explorerPanelHeadingAsH2`, `paragraph2`, `bodyParagraphs`, `copyInPanel`, `FEATURE_CELLS`). An empty slot renders nothing, never fallback text. No 1:1 image before the calculator.

**If this prompt asks for something the repo does not have, the prompt is wrong, not the repo. Stop and report the conflict rather than inventing a component or a prop to satisfy the prompt.**

## Corrections in force (project instructions section 11, 6 Sep 2026) - these override the older templates

- **Section 3 size headings render as H3.** PO-01 to PO-04 render them as H2 through `CLUSTER_DESIGN_SLUGS`; that is drift. Do not add this route to that set. `copy.section3.heading_level` is `"h3"`.
- **Section 3 bullets wire into `applicationsContent.panels[].applications`.** There is no hashed field called `SECTION3_<size>_BULLETS`; that name came from the retired SOC-01 template. Read them from `copy.section3.sizes[].applications`.
- **The long-description images belong INSIDE the Description tab.** Section 2 carries exactly one image, its split card. Do not build a media band between Section 2 and Section 3, and do not add a component or prop to create one.
- **`sha256_of_copy` is not used and no verifier checks it.** Do not compute or assert it.

## Rulings specific to PO-06 (SAMAN, 6 September 2026)

1. **Price basis is Rs 1,450 per sq ft at 200 sq ft** - the wall ledger, the six GA boards and the 13-page technical PDF. The folder workbook was edited on 24 August to Rs 1,350 and is the outlier; **do not read prices from the workbook.** The six ex-GST prices are 1,66,750 / 2,55,200 / 2,90,000 / 3,34,080 / 4,17,600 / 5,51,000 and they are in `copy.hero.variants[].price_ex_gst`. The GA boards print these same figures, so the boards need no change and must not be regenerated.
2. **Gallery running order is three exteriors then three interiors**, file order 01-06, per size. This is a sanctioned deviation from the four-exteriors-then-two-interiors rule, the same sanction PO-04 carries. The package supplies only three exteriors per size.
3. **The Section 2 split card takes a photograph, not a GA board**: `02-long-description-16x9/03-site-cabin-20x10-site-exterior.png`. Because that image is now used in Section 2, **the Description tab carries five images, not six.** This is the per-page ruling the copy specification allows.
4. **Description images 05 and 06 were re-derived.** The originals in `02-long-description-16x9/` are a 1080x1080 square dropped into a 1920x1080 frame with 420 px of blurred pillar each side. The asset map points at the repaired true-16:9 masters in `02-long-description-16x9/_repaired-16x9-v1/`. **Never fall back to the pillared originals.**
5. **Alt text comes only from `copy.alt_text`.** The package CSV `construction-site-cabin-image-seo-metadata.csv` repeats one alt per size and would fail the duplicate-alt check. Do not read alt text from it.

## Build steps

### Step 0 - Baseline
Clone the porta-cabins route's equivalents (route file, product JSON, gallery manifest, calculator ladder entry) since this page does not exist yet. Save `git show` of each under `_build-inputs/baseline/` **in the repo branch**, not in `D:\`. There is no `keep_as_is` set: no gallery is retained, because the page is new.

### Step 1 - Metadata and hero (blocks 1-4)
- Title, H1, meta description, canonical and breadcrumb from `copy.meta`.
- Six variants from `copy.hero.variants` in that order. Default selected size is `20x10` (`copy.hero.default_size`).
- Price display: ex-GST primary, `incl. 18% GST` alongside, per-sq-ft rate exactly as the porta-cabins page shows it. "From" price everywhere is `copy.hero.from_price_ex_gst` (1,66,750).
- `FEATURE_CELLS` per variant from `copy.hero.variants[].feature_cells` (Size, Roof, Openings, Desks staged, Application). Fixed cells from `copy.hero.fixed_cells`. Trust line, SKU line and credentials strip: whatever the shared hero renders; do not edit them.
- Short description from `copy.hero.short_description`.
- `Download technical specification (PDF)` links to the PDF copied per `asset_map.spec_pdf`.
- Gallery: six slides per size from `asset_map.gallery_new`, in the listed order, alt from `copy.alt_text.gallery_new` keyed by output file name.

### Step 2 - Explore the Range (block 5)
Derived, not hand-authored: hub first, then the cluster siblings in `copy.explore_range.order`, current page excluded, no duplicates, no cross-cluster tiles. Render only destinations returning 200 at build time - as at 6 Sep 2026 that is the hub, Readymade Office Cabin, Prefabricated Office Cabins, Portable Weighbridge Office, Executive Portable Office and Small Office Cabin; Portable Mobile Laboratory, Portable Control Room and Portable Conference Cabin are still 404 and must not render. Never render either URL in `copy.explore_range.never_list`. If a shared component picks up `modern-office-cabin` or `portable-office-container` from a sitemap or category query, that is a defect: report it and scope the query.

### Step 3 - Section 2 (block 6)
H2, two paragraphs, the contextual link (anchor and href from `copy.section2.link`, placed inside paragraph 1 on the exact phrase given), and the CTA. Split card directly below: the 16:9 image on the LEFT from `asset_map.section2_card` (native 16:9, never cropped), and on the right the H3, two paragraphs and CTA from `copy.section2.split_card`. Card fields ship as their own hashed copy fields as the porta-cabins card does. The card CTA scrolls to the Section 3 anchor.

### Step 4 - Section 3 (block 8)
H2 and intro from `copy.section3`. Six size sections in the given order, each with the GA board WebP on the LEFT (per `asset_map.ga_boards`, lazy, alt from `copy.alt_text.ga_boards`), and on the RIGHT an **H3**, one paragraph and the bullets from `copy.section3.sizes[].applications`, wired through `applicationsContent.panels[].applications`. Never point at a `-preview` file; never crop a GA board at any size for any reason.

### Step 5 - Calculator (block 9)
Untouched. The one action is the `ROUTE_LADDERS` entry in `calculatorLadders.ts` for this route, reading the six prices from this page's product JSON via `toRows(...)`. Set the product JSON prices to `copy.hero.variants[].price_ex_gst`. Do not touch calculator content, labels, formulas or styling.

### Step 6 - You may also like (block 10)
Portable Office cluster only (hub plus its approved subpages), intro from `copy.ymal.intro`, render only 200s. Add a cluster-scoped constant and pass it in; do not edit the shared YMAL constants.

### Step 7 - Product Details (block 11)
- **Description tab:** render `copy.description_tab.sections` in order - H2, then the items in order (`p` paragraph, `bullet` items as one list, `table` as one table, `faq` as question plus answer, `image` at its position in the item list using the same mechanism the porta-cabins Description tab already uses). There is exactly one bullet list, one table and **five images** in this tab. Do not move the images out of the tab.
- **Specifications tab:** the three narrative paragraphs from `copy.specifications_tab.narrative`, then Groups A to E as grouped tables with the exact headers and rows given, each group's note under its table, in the same grouped-table design the porta-cabins Specs tab uses. Then the two diagrams from `asset_map.spec_diagrams` with alts from `copy.alt_text.spec_diagrams`. Then the PDF link.
- **Shipping tab:** the same shared freight component the live porta-cabins page renders - both trailer tables (20 ft and 40 ft), eighteen distance bands each from 100 to 1,000 km, both zone city tables, **the two free-delivery lines** (Bangalore city; Delhi NCR including Ghaziabad, Gurugram, Faridabad, Noida and Greater Noida), the ODC note and the tentative-price disclaimer. A generic "Shipping & Delivery" panel with no freight figures is a regression. No `shippingDetails` schema.
- **Reviews tab:** same tab and form; empty state from `copy.reviews_tab.empty_state`; no Review or AggregateRating markup.
- **Internal links:** wrap the anchors in `copy.links.internal` with their hrefs, once each, at the location each entry names.
- **Structured data:** ItemPage, Product with AggregateOffer (INR, ex-GST basis, low 166750, high 551000, offerCount 6), BreadcrumbList, and FAQPage whose eight questions and answers are byte-identical to `copy.faq_schema`. Nothing else.

### Step 8 - Images
Follow `asset_map.rules` exactly. Every image a browser fetches is WebP and lands between 80 and 120 KB: gallery 1:1 at 1254 px starting q86; GA boards at 1800 px starting q88, downscaled proportionally only, with the dimension text and the printed price block verified legible by opening the output; the Section 2 card, the five description images and the two diagrams at 1600 px q90. Crop nothing; adjust quality first, then width, and re-measure. Source PNGs are never copied into `public/`.
Loading: the six images of the selected size eager with `fetchpriority="high"` on slide 1 only; the other thirty lazy; explicit `width` and `height` on every `<img>`; a `<link rel="preload">` for slide 1 of the default size (20x10) carrying the same `imagesrcset`; GA boards and description images lazy.
Produce a measurement table (file, width, height, KB) for every output and include it in the PR.

### Step 9 - Redirects
**None in this build.** The 301 from `/product/prefabricated-houses/prefab-site-office` to this URL is designated in the approved redirect map but has not been approved by SAMAN for this ticket. Do not create it, and do not remove that URL from routing or the sitemap.

### Step 10 - Do NOT do
- Do not touch any other route, shared constant, shipping component, calculator or design token.
- Do not add delivery lead times, warranties, quote-response times, installation promises, load or structural claims, certifications, ratings or testimonials beyond what the shared template already renders.
- Do not read prices from `construction-site-cabin-technical-specification-and-price-dashboard.xlsx`.

## Local preview (there is no hosted preview)

The repo has no Vercel config and no deployment integration, so there is no preview URL. Instead:

```
npm run build
npx next start -p 4106
```

Leave the server running and give SAMAN both commands verbatim. Run the verifier, the DOM checks and Lighthouse against `http://127.0.0.1:4106/product/portable-office/construction-site-cabin`.

## Validator baseline

Five repo validators fail identically at pristine `static-migration` HEAD from stale pinned constants. Before reporting any validator failure, stash your changes, re-run at HEAD, and report only the failures your own branch introduced.

## Template Conformance Gate (all six, with artefacts, before the PR)

1. Structural diff against the porta-cabins route: component tree in identical order with zero delta other than content props. Attach the diff.
2. Component-order assertion listing the eleven blocks in rendered order. Attach the output.
3. Full-page screenshots, desktop 1440 px and mobile 390 px, of the local preview and of the live porta-cabins page side by side. Attach.
4. Prop audit: every prop passed to every shared component, showing no prop other than the four permitted content kinds differs from the porta-cabins route. Attach.
5. DOM checks on the fetched preview HTML: exactly one H1; no empty heading; no empty or duplicate alt; no U+2014 in body text; all four tab panels present in the fetched HTML; `Description/Info`, `Specifications/Specs`, `Shipping/Ship`, `Reviews` label pairs correct; grep for `coming soon|available on request|contact us for details|placeholder|TBD|working days` returns zero hits after normalising `-`, `–` and ` to ` between digits.
6. `python verify_po06.py http://127.0.0.1:4106/product/portable-office/construction-site-cabin PO-06-construction-site-cabin-copy-v1.json PO-06-construction-site-cabin-asset-map-v1.json <repo>/public` prints `RESULT: PASS`. Attach the full output. Also run Lighthouse mobile on the local preview and on the live porta-cabins page and attach both.

"Checks passed" is not evidence. Attach the artefacts. Return the two commands, the PR link and the six artefacts. If anything in the inputs is ambiguous or contradicts the repo, stop and report the exact conflict; do not improvise.
