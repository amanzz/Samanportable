# SCH-02 Shipping Container Homes - CONTENT MAP v1
### Every slot mapped to its copy, its Ahrefs target and its asset

Canonical: `https://www.samanportable.com/product/container-houses/shipping-container-homes`
Date: 6 September 2026 | Ahrefs data pulled 6 September 2026, India, Site Explorer exact + prefix mode
Copy source: `SCH-02-shipping-container-homes-copy-v1.json` | Asset source: `SCH-02-shipping-container-homes-asset-map-v1.json`

---

## PART A - KEYWORD OWNERSHIP (the rule the build must not break)

### A1. Terms THIS page owns and targets

| Term | India vol | KD | Position today | Where it is served on the page |
|---|---:|---:|---:|---|
| shipping container house | 150 | 1 | not ranking | **PRIMARY.** Meta title, H1, Section 2 H2, Description section 1 |
| shipping container home | 50-60 | 2 | 3 | Hero short description, Description section 1 and 2 |
| shipping container homes | 10 | 0 | 3 | H1 plural, breadcrumb, Section 3 H2 |
| container homes for sale | 150 | 0 | **4** | **Defend.** Hero decision panel, price display, Section 3 bullets |
| container house manufacturers in india | 70 | 0 | **3** | **Defend.** Description sections 2 and 7, credentials strip |
| container house price in bangalore | 40 | 0 | **3** | **Defend.** Price display, Description section 5, contact bar |
| custom containers | 40 | 0 | 10 | Description section 3 (opening schedule, cut-outs on the drawing) |
| shipping container home cost / costs | 20 + 10 | - | 3 | Description section 5, FAQ 3 |
| inside shipping container homes | 20 | 0 | 6 | **Gallery interior slides 05 and 06**, Description section 2 |
| container room for sale | 20 | 0 | 3 | Section 3 20x8 and 20x10 panels |
| shipping container homes india | 10 | 0 | 3 | Meta description, Description section 1 |
| storage container homes | 10 | 0 | 9 | Description section 1 (disambiguation paragraph) |
| shipping container home plans / floor plans / designs | 10 each | 1-2 | not ranking | **The six Section 3 drawings.** This is what the drawings are for. |
| 20 ft / 40 foot shipping container home plans | 10 | 0 | not ranking | Section 3 H3s carry the foot length in each heading |
| converted shipping container home | 0 (30 global) | - | - | Description sections 1 and 2 |

### A2. Terms this page must NOT target (owned elsewhere in the cluster)

| Term | Vol | Owner today | Rule for this build |
|---|---:|---|---|
| container house | 15,000 | hub, #12 | Never as an H1, H2 or anchor. May appear in prose once, in the disambiguation paragraph only. |
| container house price | 2,700 | hub, #2 | Not a heading, not an anchor. |
| container homes | 2,700 | prefab-container-homes, #21 | Not a heading. |
| low cost container house | 800 | hub, #4 | Absent. No "low cost" or "cheap" framing anywhere. |
| container home | 700 | prefab-container-homes, #2 | Not a heading. |
| container room | 700 | hub, #14 | **Absent.** Its own Ahrefs parent topic and a hub opportunity. Do not chase it here. |
| container house design | 700 | prefab-container-homes, #7 | Absent. |
| 2 bhk container house price in india | 500 | hub, #6 | Absent. The live PAA question on this is left to the hub. |
| container house price in india | 400 | prefab-container-homes, #1 | Absent. |
| container house in bangalore | 400 | prefab-container-homes, #2 | Absent. Only the *shipping* Bangalore variant is used. |
| container home cost | 30 | hub, #3 | **Removed from this page.** Currently double-served (hub #3, this page #6). |

### A3. SERP facts that shaped the copy

- SERP for the primary term is split three ways: overseas architectural inspiration, new-built container-form prefab, and Indian buyers wanting a price and a manufacturer. **Description section 1 resolves this split** by separating a genuine cargo-shell conversion from a container-shaped new build and naming `prefab-container-homes` as the other page.
- #1 is `dir.indiamart.com/impcat/container-homes.html` (DR 87). Organic competitors are weak: akasheng.com DR 0, technocap.in DR 4.
- Three live People Also Ask questions. Two are answered verbatim in the FAQ block: *How much will a container house cost?* (FAQ 3) and *Is a container house legal in India?* (FAQ 2). The third, *2 BHK container house cost in Bangalore*, is a hub question and is deliberately not answered here.
- Parent topic of the primary term is `container house`, which the hub owns. This page therefore targets the **conversion** intent, never the generic container-house intent.

---

## PART B - SLOT MAP, BLOCK BY BLOCK

### Block 0 - Head

| Slot | Copy key | Copy | Serves |
|---|---|---|---|
| `<title>` | `meta.title` | Shipping Container House India: 6 Sizes & Price | SAMAN | primary term + india + price modifier, 55 chars, SAMAN once |
| meta description | `meta.description` | 156 chars | primary term, `shipping container homes india`, price entry point |
| canonical | `canonical` | self-referencing | duplicate gate |
| H1 (one only) | `h1` | Shipping Container Homes Built From Real Cargo Shells | primary plural + the differentiator |

### Block 1 - Three-column hero

| Column | Slot | Copy key | Asset | Serves |
|---|---|---|---|---|
| 1 | short description | `hero.short_description` (770 chars) | - | `shipping container home`, `converted shipping container home`, buyer-task framing |
| 1 | five feature cells per size | `hero.feature_cells.<size>` | - | `container homes for sale` (area + price at a glance) |
| 2 | gallery slide 01 | - | `01-gallery-webp/...-01-front-right-hero.webp` | primary term, entrance door visible |
| 2 | gallery slide 02 | - | `...-02-front-left-angle.webp` | second exterior angle |
| 2 | gallery slide 03 | - | `...-03-long-side-elevation.webp` | `20 ft` / `40 foot` length evidence |
| 2 | gallery slide 04 | - | `...-04-elevated-three-quarter.webp` | site context |
| 2 | gallery slide 05 | - | `...-05-interior-entry-living-hall.webp` | **`inside shipping container homes`** |
| 2 | gallery slide 06 | - | `...-06-interior-kitchen-dining.webp` | **`inside shipping container homes`** |
| 3 | Explore the Range panel | resolved at build time | - | cluster equity, approved siblings only |

Six slides per size, 36 files. Slide 1 of the default size is eager with `fetchpriority="high"` and a preload carrying the same `imagesrcset`; the other thirty lazy.

### Block 2 - Contact / location bar
Shared template. Greater Noida (North) and Bengaluru (South) both named. Serves `container house price in bangalore` and `container house manufacturers in india`.

### Block 3 - Size selector tabs
`usePremiumSizeTabs`. Six tabs from `variants`: 20x8, 20x10, 20x12, 40x8, 40x10, 40x12, all x 8.5 ft. **Sizes are in-page selectors, never URLs** (doorway gate).

### Block 4 - Price display

| Size | Rate/sq.ft | Ex-GST | Incl. 18% GST | Copy key |
|---|---:|---:|---:|---|
| 20x8x8.5 (160 sq.ft) | 1,760 | 2,81,600 | 3,32,288 | `variants[0]` |
| 20x10x8.5 (200 sq.ft) | 1,600 | 3,20,000 | 3,77,600 | `variants[1]` |
| 20x12x8.5 (240 sq.ft) | 1,536 | 3,68,640 | 4,34,995 | `variants[2]` |
| 40x8x8.5 (320 sq.ft) | 1,520 | 4,86,400 | 5,73,952 | `variants[3]` |
| 40x10x8.5 (400 sq.ft) | 1,520 | 6,08,000 | 7,17,440 | `variants[4]` |
| 40x12x8.5 (480 sq.ft) | 1,504 | 7,21,920 | 8,51,866 | `variants[5]` |

Serves `shipping container home cost`, `container homes for sale`, `container house price in bangalore`. **Feeds `ROUTE_LADDERS` and the AggregateOffer.**

### Block 5 - H2 `Explore the Range`
Shared string. No keyword role.

### Block 6 - Section 2 RightToExist

| Slot | Copy key | Chars | Asset | Serves |
|---|---|---:|---|---|
| H2 | `section2.h2` | 59 | - | the conversion-vs-new-build distinction; carries `container-shaped cabin` contrast |
| Paragraph 1 | `section2.paragraphs[0]` | - | - | `converted shipping container home`, right-to-exist evidence |
| Paragraph 2 | `section2.paragraphs[1]` | - | - | `custom containers` (opening schedule), one internal link |
| Combined | | 909 | | gate 800-900 met at 909 after trim; see note |
| Internal link | in paragraph 2 | - | - | -> `/product/container-houses/prefab-container-homes`, anchor **"prefab container homes"** only |
| CTA | `section2.cta` | - | - | Get a size and price for your site |
| Card H3 | `section2.card.h3` | 44 | - | joined modules |
| Card para 1 | `section2.card.paragraphs[0]` | 198 | - | 40 ft and joined-module decision |
| Card para 2 | `section2.card.paragraphs[1]` | 211 | - | roof valleys, monsoon drainage |
| **Card image (16:9)** | - | - | `03-section2-split-card/shipping-container-home-joined-modules-hero-16x9.webp` | **realistic render, never a drawing** - shows two joined 40 ft cargo shells |

### Block 7 - Media / finished-work band
Shared component. No page-specific asset added.

### Block 8 - Section 3 SizeApplicationsExplorer

H2 `section3.h2` (56 chars) - serves `shipping container home plans`, `shipping container home floor plans`.
Intro `section3.intro` (126 chars).

| Panel | H3 | Para | Bullets | **Left-panel asset (4:3)** |
|---|---|---:|---:|---|
| 20x8 | the single-box conversion for a compact plot | 483 | 6 | `...-20x8-8-5-3d-cutaway-general-view-v1.webp` |
| 20x10 | the size the price ladder is set from | 404 | 6 | `...-20x10-...webp` |
| 20x12 | separate shower and W.C. inside 20 feet | 461 | 6 | `...-20x12-...webp` |
| 40x8 | the long single box with two external doors | 455 | 6 | `...-40x8-...webp` |
| 40x10 | adds a study without losing the bedroom | 494 | 6 | `...-40x10-...webp` |
| 40x12 | two bedrooms and the largest published plan | 459 | 6 | `...-40x12-...webp` |

Every H3 carries the foot length, which is what serves `20 ft shipping container home` and `40 foot shipping container home plans`. Every bullet carries an approved figure or a fit decision. **The six drawings are the page's answer to the `plans` / `floor plans` / `designs` query family**, which is the one part of the primary term's SERP that SAMAN currently has nothing for.

### Block 9 - Section 4 calculator
Untouched. Only the `ROUTE_LADDERS` entry reads this page's prices, via `toRows(...)` from the page's own product JSON.

### Block 10 - You may also like
`you_may_also_like.intro` (77 chars). Current cluster only, 200s only. Passes equity to the six approved siblings.

### Block 11 - Product Details, four tabs

#### Tab 1 Description - 9 sections, 2,029 words of prose plus 8 FAQs

| # | H2 | Chars | Serves | Asset |
|---:|---|---:|---|---|
| 1 | What counts as a shipping container home on this page | 53 | **intent disambiguation** - primary term, `storage container homes`, `converted shipping container home` | `04-description-images/...-20x8-...-end-view-16x9.webp` |
| 2 | How a cargo shell becomes a house you can live in | 49 | `inside shipping container homes`, `container house manufacturers in india` | `...-20x10-...` |
| 3 | What cutting an opening does to a container wall | 48 | `custom containers` | `...-20x12-...` |
| 4 | Heat, condensation and rain noise inside a steel box | 52 | informational depth, E-E-A-T | `...-40x8-...` |
| 5 | What the published price covers, and what it does not | 53 | `shipping container home cost`, `container house price in bangalore`; **the one bullet block** lives here | `...-40x10-...` |
| 6 | Foundations, transport and what to check on arrival | 51 | transport, over-dimensional widths, coating exposure | `...-40x12-...` |
| 7 | Where this page ends and the rest of the range begins | 53 | **cluster boundary**, cannibalisation control | - |
| 8 | Warranty, service life and the maintenance needed | 49 | trust signals | - |
| 9 | Questions buyers ask before ordering a conversion | 49 | FAQ container | - |

Exactly one bullet block (section 5, the exclusions list). Zero tables. Six 16:9 images, one per size, **rendered inside this tab**, not as a band above Section 3.

| FAQ | Question | Chars | Source |
|---:|---|---:|---|
| 1 | Is this made from an actual shipping container? | 246 | product-intent disambiguation |
| 2 | Is a container house legal in India? | 268 | **live PAA** |
| 3 | How much does a container house cost? | 228 | **live PAA** |
| 4 | Can I add a window after delivery? | 209 | `custom containers`, workbook Windows line |
| 5 | Can it be relocated later? | 266 | workbook Layout line |
| 6 | Does the container get hot inside? | 291 | workbook insulation lines |
| 7 | What is the delivery time? | 145 | SAMAN confirmation |
| 8 | Can two containers be joined? | 255 | workbook Layout / Plumbing lines |

All eight are **byte-identical** in the FAQPage schema.

#### Tab 2 Specifications

Three narrative paragraphs (`specifications_tab.narrative`), then five grouped tables:

| Group | Content | Unique to this page? |
|---|---|---|
| A | Sizes, areas, rates, ex-GST and incl-GST prices, six rows | Yes |
| B | Product-specific build, 17 lines from workbook sheet `02 Shipping Container Homes` | **Yes - 100% unique vs all 7 siblings** |
| C | Opening schedule and staged layout by size, Wall A / Wall B / End C / End D | **Yes** |
| D | Platform-common material key, 13 lines | No, shared by design |
| E | Scope boundary and exclusions | **Yes** |

Diagrams below the tables: the same six 3D cutaway drawings. Then the technical PDF link.

#### Tab 3 Shipping
Shared freight component exactly as porta-cabins renders it, both free-delivery lines. No schema, no promises.

#### Tab 4 Reviews
`No verified reviews yet.` No rating schema.

---

## PART C - INTERNAL LINKS (exact targets and anchors)

| From | To | Anchor | Why |
|---|---|---|---|
| Section 2 paragraph 2 | `/product/container-houses/prefab-container-homes` | prefab container homes | Sends the new-built-shell intent to its owner. **The only contextual link in Section 2**, per the lock. |
| Explore the Range | hub + approved siblings, 200s only | product names | Cluster equity |
| You may also like | current cluster only, 200s only | product names | Cluster equity |
| Breadcrumb | `/product` > `/product/container-houses` > this page | - | BreadcrumbList |

**Forbidden link targets:** `prebuilt-container-homes`, `prefabricated-container-home`, `modern-container-home`, `prefabricated-container-house`, `affordable-container-homes`, `/product-category/container-houses`. None are inside the approved 8. A component that picks one up from a sitemap or category query is a defect.

**Forbidden anchor text anywhere on this page:** `container house`, `container house price`, `container home`, `container room`, `low cost container house`. Those anchors belong to the hub and to `prefab-container-homes`.

---

## PART D - ASSET LEDGER (49 browser-fetched files, all 80-120 KB)

| Group | Files | Px | Slot | Crop rule |
|---|---:|---|---|---|
| `01-gallery-webp` | 36 | 1254 x 1254 | Hero column 2, six per size | Masters already 1:1, no crop |
| `02-section3-drawings` | 6 | 1920 x 1440 | Section 3 left panel, 4:3 cover | **Never crop. Authored at 4:3.** |
| `03-section2-split-card` | 1 | 1920 x 1080 | Section 2 card, 16:9 | Centred crop, unit verified not clipped |
| `04-description-images` | 6 | 1920 x 1080 | Inside the Description tab | Centred crop, unit verified not clipped |

Also in the package, **not** for the browser: 6 PNG masters (2400 x 1800), 6 SVG, `gen_drawings.py`, `README.md`, `asset-bytes-report.json`.

Unused source renders: E04 `rear-right-angle` (all six sizes) and E05 `end-dominant` for the gallery. E05 feeds the description images. **20x10 E04 (file 194) is an interior bedroom image mis-named as an exterior** - no shipped slot uses it.

---

## PART E - WHAT THIS MAP CHANGES ON THE LIVE PAGE

| # | Live today | After this build | Ahrefs consequence |
|---|---|---|---|
| 1 | Prices Rs 3,64,320 to Rs 9,13,920 ex-GST, no source | Rs 2,81,600 to Rs 7,21,920 | `shipping container home cost` and `container homes for sale` become answerable and correct |
| 2 | 5-year structural warranty | 10 years | Trust signal, no keyword effect |
| 3 | "Reinforced MS shell for relocation and coastal duty", no source | Genuine cargo-shell conversion | **Right-to-exist against `prefab-container-homes` becomes real instead of invented** |
| 4 | "Custom quote target: 48 business hours" | Removed | Policy gate |
| 5 | Explore the Range frozen at 3 tiles | Resolved at build time, approved 8 only | Cluster equity stops leaking |
| 6 | No plans, floor plans or drawings anywhere | Six 3D cutaway drawings | **Opens the `shipping container home plans / floor plans / designs` family, which SAMAN serves with nothing today** |
| 7 | Generic `container home cost` targeting | Removed | Ends the hub #3 vs page #6 double-serve |
