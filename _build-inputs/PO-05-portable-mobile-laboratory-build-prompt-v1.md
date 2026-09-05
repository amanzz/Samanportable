# CLAUDE CODE BUILD PROMPT - PO-05 Portable Mobile Laboratory (paste whole file)

**SESSION: NEW Claude Code session. Do not continue an existing one. Do not run this in the same session as the PO-04 Executive Portable Office build or the PO-CLUSTER-01 cannibalisation ticket.**

You are building one page of samanportable.com in the Next.js repository: `https://www.samanportable.com/product/portable-office/portable-mobile-laboratory` (new page, returns 404 today). Work in the repo on a branch cut from `origin/static-migration`; open the PR against `static-migration`. Do not deploy. SAMAN deploys after approving the preview.

## Inputs (read all four before touching code; do not retype any copy)

All five are in `D:\Project-shekhar\all-product-images\Hub (Portable Office Cabin)\portable-mobile-laboratory\_build-inputs\`:

1. `PO-05-portable-mobile-laboratory-copy-v1.json` - every string the page renders, keyed by slot. This is the only source of copy. Read it with a JSON parser and wire it in; never paste strings by hand.
2. `PO-05-portable-mobile-laboratory-asset-map-v1.json` - every image slot, its source file in the approved package, its output path, the WebP settings, the loading rules and the two files that are held out by SAMAN's ruling.
3. `PO-05-portable-mobile-laboratory-draft-v1.md` - the human-readable draft with the research log, the uniqueness measurement and the claim ledger. Use it to understand intent; the JSON is what you build from.
4. `verify_po05.py` - the acceptance test. The build is not done until it prints `RESULT: PASS` against the preview URL.

Approved asset package: `D:\Project-shekhar\all-product-images\Hub (Portable Office Cabin)\portable-mobile-laboratory\`. **Note:** the URL register expects an `approved-website-assets-v<latest>` subfolder. It does not exist. The package sits flat at the folder root and there is only one version of it (manifest 1.0, ruleset 2026-08-23, GA approval record USER-APPROVED-GA dated 23 August 2026). Read from the folder root. This is settled; do not stop and report it.

## DESIGN LOCK

`https://www.samanportable.com/product/porta-cabins` is the design. It is already built and correct. You do not author layout. You import the production components the porta-cabins route uses and pass this page's content. Only four things may differ between the porta-cabins page and this page: copy strings, images and alt text, variant/size data rows and prices, and internal-link destinations and anchors. Anything else that differs means the build is wrong.

Canonical block order, eleven blocks: 1 three-column hero, 2 contact/location bar, 3 size selector tabs (`usePremiumSizeTabs`), 4 price display for the selected size, 5 H2 `Explore the Range` panel, 6 Section 2 `RightToExist` with its split card, 7 media/finished-work band, 8 Section 3 `SizeApplicationsExplorer`, 9 Section 4 calculator, 10 `You may also like`, 11 Section 5 `Product Details` four-tab strip (Description/Info, Specifications/Specs, Shipping/Ship, Reviews - there is no Info tab, do not add one).

Design tokens `#1a3c2e`, `#2d7a3f`, `#f0f7f2`; never restyle. The only sanctioned change to a shared component is an opt-in prop defaulting to false; prefer existing props first (`showSectionDividers`, `usePremiumSizeTabs`, `explorerPanelHeadingAsH2`, `paragraph2`, `bodyParagraphs`, `copyInPanel`, `FEATURE_CELLS`). An empty slot renders nothing, never fallback text. No 1:1 image anywhere except the hero gallery.

## Three SAMAN rulings that are already made. Apply them; do not re-raise them.

1. **Right to exist.** SEO research found no available head term for this page and an intent mismatch on `mobile laboratory` (in India that phrase returns lab vehicles). SAMAN ruled on 5 September 2026: build the page on the specification and the price band. The page carries **no Portable Office head phrase** in its title, H1 or H2s and must not become a claimant on `portable office cabin`, `small office cabin` or `readymade office cabin`. The single anchor `Portable Office Cabin range` points at the hub, which is the direction ticket PO-CLUSTER-01 requires.
2. **10x10 exteriors held out.** `10x10/02-mobile-laboratory-10x10-rear-angle` and `10x10/03-mobile-laboratory-10x10-side-elevation` render the body at roughly 12 to 14 ft against a GA that fixes 10 ft 0 in square. They are not published. **The 10x10 gallery ships four slides, not six. That is deliberate. Do not pad it, do not substitute another size's image, and do not stop and report it.** The 10x10 exterior schedule is carried by its GA board in Section 3.
3. **Wall B window drift accepted.** On 20x8, 20x10 and 20x12 the second Wall B window sits inboard of its scheduled 14.5 to 18.5 ft position. Opening counts on every published exterior match the GA. SAMAN accepted these frames as supplied on 5 September 2026.

## Build steps

### Step 0 - Baseline
Record the porta-cabins route file, its product JSON, its gallery manifest and its `ROUTE_LADDERS` entry, which you will clone for this new route. Save `git show` of each under `_build-inputs/baseline/` in the repo branch, not in D:.

### Step 1 - Metadata and hero (blocks 1-4)
- Title, H1, meta description, canonical, breadcrumb from `copy.meta`. The title uses U+2502 `│` as the separator; that is the house style, leave it.
- Six variants from `copy.hero.variants` in that order; default selected size `copy.hero.default_size` (`20x10`, the price-rule reference size). Price display: ex-GST primary, `incl. 18% GST` alongside, per-sq-ft rate as the porta-cabins page shows it. "From" price everywhere = `copy.hero.from_price_ex_gst` (₹2,30,000).
- `FEATURE_CELLS` per variant from `copy.hero.variants[].feature_cells`. The five cells on this page are **Size, Roof, Openings, Benching, Cleaning aisle** - not the office-cabin set. Fixed cells (Material, Delivery, Coverage, Brand) from `copy.hero.fixed_cells`. Trust line, SKU line, credentials strip: whatever the shared hero component renders; do not edit them.
- Short description from `copy.hero.short_description`.
- `Download technical specification (PDF)` links to the PDF copied per `asset_map.spec_pdf`.
- Gallery: six slides per size, **four for 10x10** (ruling 2). Order and output names per `asset_map.gallery_new`; alt from `copy.alt_text.gallery_new` keyed by output file name.

### Step 2 - Explore the Range (block 5)
Derived, not hand-authored: hub first, then the cluster siblings in `copy.explore_range.order`, current page excluded, no duplicates, no cross-cluster tiles. Render only destinations returning 200 at build time. The five URLs in `pending_until_200` appear automatically as they go live. **Never render the two URLs in `never_list`** (`modern-office-cabin`, `portable-office-container`); neither is one of the approved 105. If the shared component picks either up from a sitemap or category query, that is a defect: report it and scope the query.

### Step 3 - Section 2 (block 6)
H2, two paragraphs, the contextual link placed inside paragraph 1 on the phrase given in `copy.section2.link.anchor`, CTA. Split card directly below: 16:9 image LEFT from `asset_map.section2_card` (the 20x10 GA board, native 16:9, never cropped), H3 plus two paragraphs plus CTA on the right from `copy.section2.split_card`. Card CTA scrolls to the Section 3 anchor.

### Step 4 - Media band (block 7)
Six 16:9 workflow frames in size order from `asset_map.media_band`, alt from `copy.alt_text.media_band`. Lazy.

### Step 5 - Section 3 (block 8)
H2 and intro from `copy.section3`. Six size sections in the given order, each: GA board WebP on the LEFT (per `asset_map.ga_boards`, lazy, alt from `copy.alt_text.ga_boards`), H3 plus one paragraph plus bullets on the RIGHT from `copy.section3.sizes[]`. Bullets ship as hashed fields `SECTION3_<size>_BULLETS`. Never point at a `-preview.png` file, never at the `.svg`, and never crop a GA board.

### Step 6 - Calculator (block 9)
Untouched. The one action: add the `ROUTE_LADDERS` entry in `calculatorLadders.ts` for this route, reading the six prices from this page's product JSON via `toRows(...)`. Set the product JSON prices to `copy.hero.variants[].price_ex_gst`. Do not touch calculator content, labels, formulas or styling.

### Step 7 - You may also like (block 10)
Cluster-scoped set for the Portable Office cluster only, intro from `copy.ymal.intro`, render only 200s. Add a cluster-scoped constant and pass it in; do not edit the shared YMAL constants.

### Step 8 - Product Details (block 11)
- **Description tab:** render `copy.description_tab.sections` in order: H2, then items in order (`p` paragraph, `bullet` items as one list, `table` as one table, `faq` as question plus answer). There is exactly one bullet list and exactly one table in this tab. **No images of any kind in this tab.** Internal links: wrap the anchors in `copy.links.internal` with their hrefs, once each, where the phrase occurs.
- **Specifications tab:** three narrative paragraphs from `copy.specifications_tab.narrative`, then Groups A to E as grouped tables with the exact headers and rows (same grouped-table design as the porta-cabins Specs tab), each group's note under its table. Then the two diagrams from `asset_map.spec_diagrams` with alts from `copy.alt_text`. Then the PDF link.
- **Shipping tab:** the same shared freight component the live porta-cabins page renders (both trailer tables, eighteen bands each, both zone city tables, the two free-delivery lines, ODC note, tentative-price disclaimer). A generic "Shipping & Delivery" panel with no figures is a regression. No `shippingDetails` schema.
- **Reviews tab:** same tab and form; empty state text from `copy.reviews_tab.empty_state`; no Review or AggregateRating markup.
- **Structured data:** ItemPage, Product with AggregateOffer (low ₹2,30,000, high ₹7,60,000, INR, ex-GST basis), BreadcrumbList, FAQPage whose questions and answers are byte-identical to `copy.faq_schema`. Nothing else.

### Step 9 - Images
Follow `asset_map.rules` exactly. Every image a browser fetches is WebP and lands between 80 and 120 KB.
- **Re-encode from the PNG masters in `<size>/_master/`, not from the supplied full-size WebP files** - those run 88 to 236 KB and most are outside the band.
- Gallery 1:1 at 1254 px starting q86; GA boards at 1800 px starting q88 (downscale proportionally only; open each output and confirm the dimension text is still legible); Section 2 card at 1600 px q90; media band at 1600 px q90; diagrams at 1600 px q90. Crop nothing; adjust quality first, then width, and re-measure.
- Source PNGs are never copied into `public/`.
- Loading: the images of the selected size eager with `fetchpriority="high"` on slide 1 only; every other size lazy; explicit `width` and `height` on every `<img>`; a `<link rel="preload">` for slide 1 of the default size (20x10) carrying the same `imagesrcset`; GA boards, media band and diagrams lazy.
- Produce a measurement table (file, width, height, KB) for every output and include it in the PR.

### Step 10 - Redirects
None. No legacy URL redirects to this page; the SAMAN-105 redirect map contains no laboratory entry. Add the new URL to the sitemap.

### Step 11 - Do NOT do
- Do not touch any other route, shared constant, shipping component, calculator or design token.
- Do not add a warranty period, a lead time guarantee, a load or capacity figure, a thermal or acoustic performance figure, a certification, an accreditation, an installation promise, a rating or a testimonial. No source in the package carries one. The verifier fails the build if `NABL`, `accredited laboratory`, `fume hood included`, `ISO corner casting`, `GMP compliant`, `validated laboratory` or `turnkey laboratory` appears anywhere.
- Do not describe this product as a vehicle, a lab on wheels, or a mobile van.

## Template Conformance Gate (all six, with artefacts, before the PR)

1. Structural diff against the porta-cabins route: component tree in identical order with zero delta other than content props. Attach the diff.
2. Component-order assertion listing the eleven blocks in rendered order. Attach the output.
3. Full-page screenshots, desktop 1440 px and mobile 390 px, of the preview and of the live porta-cabins page side by side. Attach.
4. Prop audit: every prop passed to every shared component, showing no prop other than the four permitted content kinds differs from the porta-cabins route. Attach.
5. DOM checks on the preview HTML: exactly one H1; no empty heading; no empty or duplicate alt; no U+2014 in body text; all four tab panels present in the fetched HTML; grep for `coming soon|available on request|contact us for details|placeholder|TBD` returns zero hits (normalise `-`, `–` and ` to ` between digits before grepping).
6. `python verify_po05.py <preview-url> PO-05-portable-mobile-laboratory-copy-v1.json PO-05-portable-mobile-laboratory-asset-map-v1.json <repo>/public` prints `RESULT: PASS`. Attach the full output. Also run mobile Lighthouse on the preview and on the live porta-cabins page and attach both.

"Checks passed" is not evidence. Attach the artefacts. Return the preview URL, the PR link and the six artefacts. If anything in the inputs is ambiguous or contradicts the repo, stop and report the exact conflict; do not improvise. The three rulings above are not ambiguities.
