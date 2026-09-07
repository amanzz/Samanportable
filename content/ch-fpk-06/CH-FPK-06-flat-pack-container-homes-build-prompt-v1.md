# CH-FPK-06 · Flat-Pack Container Homes · Build Prompt v1

> **APPLICATION: Claude Code.**
> **SESSION: NEW session. Do not continue an existing one.**
> **Branch: `static-migration`. Do not commit to `main`.**

---

## 0. What you are doing

Build `https://www.samanportable.com/product/container-houses/flat-pack-container-homes`, a **new page**
(currently 404), to the locked porta-cabins page shape, using the copy and assets supplied below.

**You author nothing.** No copy, no layout, no facts, no headings, no alt text, no prices. Every string
comes from the copy JSON, read verbatim. Every image comes from the asset map. If something you need is
not in those two files, **stop and report it. Do not fill the gap and do not invent a component or an
opt-in prop to satisfy this prompt.** If this prompt asks for something the repo does not have, the
prompt is wrong, not the repo.

## 1. Files

All five are in
`D:\Project-shekhar\all-product-images\Hub page (Container Houses)\Flat-Pack-Container-Homes\_build-inputs\`

| File | Use |
|---|---|
| `CH-FPK-06-flat-pack-container-homes-copy-v1.json` | Every string, keyed by slot. Never retype a string from it. |
| `CH-FPK-06-flat-pack-container-homes-asset-map-v1.json` | Every image slot, source path, public path, width, height, weight, loading and alt text. Build instructions live here, never in the copy pack. |
| `CH-FPK-06-flat-pack-container-homes-draft-v1.md` | The draft, the research log, the right-to-exist record and the claim ledger. Reference only. |
| `CH-FPK-06-flat-pack-container-homes-build-prompt-v1.md` | This file. |
| `verify_chfpk06.py` | The verifier. 799 checks. Must print `RESULT: PASS` before you deploy. |

Images live under
`D:\Project-shekhar\all-product-images\Hub page (Container Houses)\Flat-Pack-Container-Homes\`.

## 2. DESIGN LOCK

> `https://www.samanportable.com/product/porta-cabins` is the design. It is already built and correct.
> No agent authors layout. The build imports the existing production components and passes different
> content. **Only four things may differ between two pages: copy strings, images and alt text,
> variant/size data rows and prices, internal-link destinations and anchors. Anything else differing
> means the build is wrong.**

Eleven blocks, in this order:

1. Three-column hero. Column 1 the decision panel, whose five facts render through per-variant `FEATURE_CELLS` and change with the size selector, never a hand-authored table. Column 2 the gallery, six slides per size. Column 3 the Explore the Range panel.
2. Contact / location bar (shared)
3. Size selector tabs via `usePremiumSizeTabs`
4. Price display for the selected size
5. H2 `Explore the Range`
6. Section 2 `RightToExist`, which renders **two** blocks: the top block, then a split card directly below it
7. The Section 2 media pairing. **There is no separate media-band component and this page has no media band.** The six long-description images belong inside the Description tab.
8. Section 3 `SizeApplicationsExplorer`, two columns, image left and text right
9. Section 4 calculator, untouched
10. `You may also like`, current cluster only, 200s only
11. Section 5 Product Details, four tabs

Tokens `#1a3c2e`, `#2d7a3f`, `#f0f7f2`, never restyled per page. **An empty slot renders nothing**, never
a fallback string: grep the build for `available on request`, `coming soon`, `contact us for details` and
report zero hits. **No 1:1 image before the calculator. No U+2014 anywhere in body copy.**

Prefer existing props before anything else: `showSectionDividers`, `usePremiumSizeTabs`,
`explorerPanelHeadingAsH2`, `paragraph2`, `bodyParagraphs`, `copyInPanel`, `FEATURE_CELLS`. The only
sanctioned change to a shared component is an opt-in prop defaulting to `false`.

## 3. Size set

Six sizes, in this order: **10x10, 20x8, 20x10, 30x10, 40x10, 40x12.**

**Ruled by SAMAN on 6 September 2026:** map the assets and images to the pages as they are, which is the
source workbook ladder on sheet `06 Flat-Pack Container Homes`. This supersedes the Option B ladder for
this page. All six render folders are used, in area order. Do not substitute the hub's ladder here.

## 4. Prices, block 4 and the calculator

From `copy.sizes`. Rate basis Rs 1,800 per sq.ft at the 200 sq.ft reference, area-band adjusted, erected
built-up area, ex-GST unless shown, 18% GST where shown.

| Size | Area | Rate/sq.ft | Ex-GST | Incl. GST |
|---|---:|---:|---:|---:|
| 10x10 | 100 | Rs 2,070 | Rs 2,07,000 | Rs 2,44,260 |
| 20x8 | 160 | Rs 1,980 | Rs 3,16,800 | Rs 3,73,824 |
| 20x10 | 200 | Rs 1,800 | Rs 3,60,000 | Rs 4,24,800 |
| 30x10 | 300 | Rs 1,728 | Rs 5,18,400 | Rs 6,11,712 |
| 40x10 | 400 | Rs 1,710 | Rs 6,84,000 | Rs 8,07,120 |
| 40x12 | 480 | Rs 1,692 | Rs 8,12,160 | Rs 9,58,349 |

The one calculator action is the `ROUTE_LADDERS` entry in `calculatorLadders.ts` for
`/product/container-houses/flat-pack-container-homes`, read from this page's own product JSON via
`toRows(...)`. **Do not modify the calculator component itself.**

## 5. Images

Follow the asset map exactly. Every path, width, height, `loading` and `alt` is in it. **All 55 web
assets already sit between 80 and 120 KB. Copy them; do not re-encode from a PNG master.** Source PNGs
never reach `public/`.

- **Hero gallery**, six slides per size, 1:1 WebP, in the design-lock running order: **four exteriors
  then two interiors.** Widths were reduced per slot (800 to 1254 px) to land in the weight band at
  quality 62 or better, per the 6 September 2026 measured lesson; the width for each slot is on the slot.
- **Section 2 split card**, the page's **only** Section 2 image: 16:9, `object-fit: fill`, a **photoreal
  render, never a 2D board**.
- **Section 3 left panel**: **4:3 with `object-fit: cover`**, measured on the live lock. The asset is the
  489:374 kit board **padded symmetrically to exact 4:3 on the board ground, never cropped**, so the
  cover box clips nothing and the dimension text survives. File suffix `-4x3.webp`.
- **Description tab**: the **six long-description 16:9 images sit inside this tab**, one after each of
  Description sections 1 to 6, per `after_description_section_index` in the asset map. A Description tab
  with no images does not match the lock.
- **Specifications tab**: **all six kit boards** at 489:374, below the tables. **Never cropped at any
  size for any reason.**
- **Technical PDF: none exists for this product.** `shared.technical_pdf` is `null`. Render no link, and
  do not point at another product's PDF.
- **Loading**: slide 1 of the default size `eager` with `fetchpriority="high"` and a matching `preload`
  link carrying the same `imagesrcset`; every other image `lazy`. Explicit `width` and `height` on every
  image. Boards are always below the fold.
- Alt text is in the asset map. Do not write your own. Filenames are SEO-locked. Do not rename.
- **Do not reference `m1-`, `m2-` or `m3-` wide images.** They belonged to the withdrawn media band.

## 6. Section 3 bullets

Section 3 size headings render as **H3**, which is what the design lock does. Do not copy the H2 drift in
`CLUSTER_DESIGN_SLUGS` from PO-01 to PO-04. **Bullets wire into `applicationsContent.panels[].applications`.**
`SECTION3_<size>_BULLETS` names nothing in this repo; ignore it if you see it anywhere.

## 7. Explore the Range panel

`copy.explore_panel` carries the rule and the candidate list. **Resolve the set at build time** from the
Container Houses approved list: hub first, then every sibling in approved-plan row order, current page
excluded, no duplicates, **no padding a slot by repeating a tile**, no cross-cluster tiles ever, and every
destination confirmed 200 at build time. A frozen or padded set is a defect.

Note the standing site-wide defect PO-CLUSTER-02: Explore tiles currently fail to load across the site
(`naturalWidth` 0) although every file returns 200, likely an IntersectionObserver bound to the page
viewport while the panel sits in the hero's own scroll container. **Do not attempt to fix it in this
build.** Report whether this page reproduces it.

## 8. Tabs

Four tabs with **responsive dual labels, and the two words differ**: Description/Info,
Specifications/Specs, Shipping/Ship, Reviews. A flattened scrape must read `DescriptionInfo`.
`DescriptionDescription` means the small-screen label was wrongly set to the long one. **"There is no Info
tab" means do not add a fifth tab; it never meant remove the word.**

**Shipping** is the shared freight component exactly as the live porta-cabins page renders it: two trailer
tables (20 ft and 40 ft), eighteen distance bands each from 100 to 1,000 km, both zone city tables, the
ODC note and the tentative-price disclaimer. A generic "Shipping & Delivery" panel with no freight figures
is a regression. **The live shared component omits the two free-delivery lines** (free within Bangalore
city, and across Delhi NCR including Ghaziabad, Gurugram, Faridabad, Noida and Greater Noida), which
understates the offer. Add them behind an opt-in prop defaulting to `false`, or, if that is not clean,
**stop and report rather than editing the shared component.**

**Reviews**: no verified reviews exist. Render `No verified reviews yet.` and emit no `aggregateRating`.

## 9. Structured data

`ItemPage`, `Product` with `AggregateOffer` (INR, ex-GST basis, low 207000, high 812160, offerCount 6),
`BreadcrumbList`, `FAQPage`. **Nothing else.** The eight FAQ answers in the schema must be byte-identical
to the eight in the Description tab. Self-referencing canonical.

## 10. Internal links

`You may also like` links only to these four, and only if they return 200:
`/product/container-houses`, `/product/container-houses/prefab-container-homes`,
`/product/container-houses/shipping-container-homes`, `/product/container-houses/luxury-container-houses`.
Add a **cluster-scoped set and pass it in**; never edit the shared YMAL constants.

Section 2 carries **exactly one** contextual internal link, to
`/product/container-houses/prefab-container-homes`.

The Description tab carries the links in the copy JSON, including one to `/product/container-offices`.
That link is deliberate: it sends flat-pack **office and site-cabin** intent out of this cluster, which is
what keeps this page off the doorway line. Do not remove it.

**Do not link to any of these, they are being retired:** `prebuilt-container-homes`,
`prefabricated-container-home`, `prefabricated-container-house`, `affordable-container-homes`,
`inexpensive-container-homes`, `modern-container-home`. **Do not create the redirects in this build.**

## 11. One correction to make while you are in the codebase

`/product/container-houses/prefab-container-homes` and `/product/container-houses/shipping-container-homes`
both publish a **5-year** structural warranty. SAMAN confirmed on 6 September 2026 that it is **10 years**.
Correct that string on both pages. **Change nothing else on them.** If the CH-HUB build already did this,
confirm and move on.

## 12. Verify, then deploy. Do not stop for approval.

```
python verify_chfpk06.py <preview-url-or-rendered-html>
```

799 checks: every copy string verbatim on the page, every hard character and word count, the tokens, the
four responsive tab label pairs, the six price rows, the schema types, FAQ byte identity, the absence of
`aggregateRating`, every asset file's existence, ratio, weight band, loading attribute and alt text, the
absence of a media band, the six Description-tab images, the six Specifications-tab boards, the single
bullet block and single table in the Description tab, the 2,000 to 3,000 word count, the empty-slot
fallback phrases, the retired-URL block list, the unsourced-fact and unsourced-figure patterns, the
Explore panel rules, the self-referencing canonical and the absence of U+2014.

It must print `RESULT: PASS`. **Do not deploy on a FAIL and do not edit the verifier to make it pass.**
If PASS is not reachable, stop and report the failing assert with its line number.

Also produce the six **Template Conformance Gate** artefacts:

1. Structural diff against the porta-cabins route, zero delta outside the four permitted differences
2. Component-order assertion listing the eleven blocks
3. Full-page desktop and mobile screenshots
4. Prop audit
5. DOM checks: one H1, no empty headings, no empty or duplicate alt, no U+2014
6. Mobile Core Web Vitals against the live porta-cabins equivalent

**"Checks passed" or a green count is not evidence. Open the artefact.**

**On `RESULT: PASS`, merge and deploy.** SAMAN reviews the live URL, not a localhost preview. Run the
post-deploy checks against production. Return the live URL, the verifier output, the six gate artefacts
and the PR against `static-migration`.

Before you issue anything downstream, grep the assembled ticket for `^\[[A-Z]`; only `[IMAGE …]` markers
may survive and the ticket must say what to do with them.

## 13. Open items you must not resolve yourself

1. **Render-to-size mapping.** The six render folders are named 10x8, 20x8, 20x10, 20x16, 40x8 and 40x16.
   Only 20x8 and 20x10 match the published ladder. Galleries are mapped in area order and ship as
   supplied, per SAMAN's instruction to use the images as they are.
2. **Four renders excluded as size-inconsistent** and used in no slot: `01-10x8-ft/05` (long body on a
   short unit), `02-20x8-ft/05` (reads as two joined modules), `06-40x16-ft/02` and `/05` (single module
   on a twin-module size). For 40x12 the second gallery slot uses `04-exterior-rear-left` instead. Do not
   substitute them back in.
3. **Group D materials.** Project Instructions §4.2 sends Group D to the master workbook's
   `Common Material Key`. That sheet's own scope line covers the Porta Cabin, Portable Cabin, Portable
   Office, Prefabricated House and Security Cabin families, and it specifies 1.2 mm corrugated MS walls,
   a 1.4 mm sloped roof and glass wool, all of which contradict the flat-pack 50 mm panel envelope. Group
   D is built from the thirteen Platform Common rows on the flat-pack sheet itself.
4. **Not published anywhere on this page**, because no source exists for this product: lead time,
   finishing warranty term, service life, reassembly cycle count, crate count, pack weights, pack volume,
   internal clear dimensions, wall, roof and floor build-up thicknesses, opening counts as fact, and any
   fire, thermal, acoustic, load or certification rating. **Do not add any of them.** The verifier fails
   the build if a figure for one of them appears.
5. **Opening positions on the drawings are indicative** and labelled as such on every sheet. No approved
   panel-grid opening schedule exists for this product yet.
6. **The GA board archive rule** in `06-ga-board-system\templates\README.md` forbids "fake 3D" on a GA
   board. SAMAN's instruction for this page is explicitly for 3D drawings. These sheets are measured
   axonometric with real dimension callouts, which satisfies both, but the archive rule needs amending or
   an exception recorded. Not yours to resolve.
7. **Ahrefs was unavailable** during Stage 2 (87 API units against a 129-unit minimum call). SEO decisions
   were taken on the GSC 16-month export, the live India SERP and the live sibling pages. Re-check in
   Ahrefs once units are restored. This does not block the build.

## 14. Superseded files to delete before you build

These were written by an earlier pass and are now wrong. The asset map does not reference any of them,
but leaving them beside the current files invites a stale pick-up. Delete them from
`D:\Project-shekhar\all-product-images\Hub page (Container Houses)\Flat-Pack-Container-Homes\`:

- `02 Long Description Images\m1-flat-pack-container-home-40x10-long-side-wide.webp`
- `02 Long Description Images\m2-flat-pack-container-home-40x12-twin-module-front-wide.webp`
- `02 Long Description Images\m3-flat-pack-container-home-20x8-front-left-wide.webp`
- In every `size-*` folder, the five old-naming slides, which the new running order replaced:
  `02-*-full-front-exterior.webp`, `03-*-residential-setting-exterior.webp`,
  `04-*-living-space-interior.webp`, `05-*-kitchen-dining-interior.webp`, `06-*-bedroom-interior.webp`

Thirty-three files in total. **Do not delete anything else in the folder**, and in particular leave the
source render PNGs and the workbook untouched.
