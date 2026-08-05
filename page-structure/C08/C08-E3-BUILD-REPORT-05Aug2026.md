# C-08 E3 BUILD REPORT — six routes to publish-ready

**Ticket** C08-E3 · **Date** 05 Aug 2026 · **Branch** `agent/c08-e2-contact-images-spec-20260805`
**Commit** `a65e5d97` · **Preview** `http://localhost:3340/product/container-houses/prefabricated-container-house`

Build only. Not merged, not deployed. PR #110, #111, #114 and the calculator branch untouched.

---

## 0 · HEADLINE — what is done, what is blocked

| Step | State |
|---|---|
| A · implement the 60-row alt manifest | **BLOCKED — the source file does not exist.** 60 assets wired, all alts EMPTY. Both gates FAIL. |
| B · 120 new 16:9 Info assets | **DONE.** 120/120, all gates pass, every crop reviewed by eye. |
| C · Info layout, 4 above the spec block | **PARTIAL.** Zero below spec on all six. The count of four is met on 2 of 6; the other four lack the body copy to space four images. |
| D · page-six 30-row spec table | **BUILT at 27 rows. L16 Gate 1 FAILS at 70.4%.** Wording NOT adjusted. Gate 2 passes. |
| E · page-six quotation price | **DONE.** Zero rupee figures. Six sizes with areas, no figures. |

Three things need your ruling before this can publish. They are in section 7.

---

## 1 · STEP A — the manifest does not exist

`C08-PREFAB-CONTAINER-HOUSE-ALT-MANIFEST-60-05Aug2026.xlsx` is not on `D:\`, not on the
Desktop, not in Downloads, not in Documents, not anywhere in the repo. A full search by name
and by `*ALT*MANIFEST*` returns only the C-04 manifest and the C-08 **180**-row manifest of
02 Aug.

The C08-E2 agent had already reached this same wall. Its intake report records
`wiredToRoute: 0` and `altStatus: "pending-fable-5-manifest"` on all 60 assets. It produced
the assets correctly — 36 at 900×900, 24 at 1200×675, every file under 120 KiB — and stopped
rather than ship empty alts.

On your instruction I have wired all 60 with `alt=""`.

- **GATE · 60/60 alts byte-identical to column H — FAIL.** 0 of 60 present. There is no
  column H to copy.
- **GATE · zero empty alts remaining on this route — FAIL.** 11 empty alts render: 6 gallery
  images for the active size, the 4 Info images, and 1 pre-existing.

Everything else is in place, so dropping the xlsx becomes a data-only change. The alt strings
land in `src/data/products/prefabricated-container-house.json` and
`page-structure/C08/c08-e3-step-b-16x9-intake-report.json`. No further code work.

**I did not author a single alt string.**

---

## 2 · STEP B — 120 new 16:9 Info assets

All gates pass.

| Gate | Result |
|---|---|
| 4 × 6 = 24 per route, 120 across the five | **120** — 24 on each of the five |
| Zero source file used twice on the same route | **PASS** — each of the 10 sources per size used exactly once: 6 gallery + 4 Info |
| Every output under 120 KiB | **PASS** — largest is 122,680 bytes = 119.8 KiB |
| Output dimensions 1200×675 | **PASS** — 120/120 |

**Method.** Sources are 1254×1254, so a 16:9 band is 1254×705 with 549 rows of vertical
travel. A fixed centre crop decapitates units whose base sits low in the frame. I placed the
band from a long-horizontal-edge detector — a roof line and a base line each run most of the
frame width, whereas foliage is high-frequency but incoherent across a row — and then
**reviewed all 120 outputs on five per-route contact sheets**. 25 frames were overruled by eye
and pinned in `page-structure/C08/c08-e3-step-b-visual-crop-offsets.json`. Every one was a
frame where the detector had pinned the band at an end of its travel and cut off the roof or
the base.

**One source anomaly.** `shipping-container-homes / 20x10 / E04`, named `rear-right-angle`, is
an interior photograph, not a rear elevation. The crop retains the complete interior subject.
The source is mislabelled; the derivative is not.

### Source views selected for each 16:9 slot, per size, per route

This is what you need to write the alt manifests. Order is render order.

| Route | Size | Info slots — source token and view |
|---|---|---|

| container-houses | 20x8 | E02 front-left-angle · E04 rear-right-angle · E05 end-dominant · I04 bathroom-reverse |
| container-houses | 20x10 | E03 long-side-elevation · E04 rear-right-angle · E06 elevated-three-quarter · I02 semi-kitchen-dining |
| container-houses | 20x12 | E02 front-left-angle · E03 long-side-elevation · E05 end-dominant · I03 bedroom-view |
| container-houses | 40x8 | E02 front-left-angle · E04 rear-right-angle · E06 elevated-three-quarter · I04 bathroom-reverse |
| container-houses | 40x10 | E03 long-side-elevation · E04 rear-right-angle · E05 end-dominant · I02 semi-kitchen-dining |
| container-houses | 40x12 | E02 front-left-angle · E05 end-dominant · E06 elevated-three-quarter · I03 bedroom-view |
| prefab-container-homes | 20x8 | E02 front-left-angle · E04 rear-right-angle · E05 end-dominant · I04 bathroom-reverse |
| prefab-container-homes | 20x10 | E03 long-side-elevation · E04 rear-right-angle · E06 elevated-three-quarter · I02 semi-kitchen-dining |
| prefab-container-homes | 20x12 | E02 front-left-angle · E03 long-side-elevation · E05 end-dominant · I03 bedroom-view |
| prefab-container-homes | 40x8 | E02 front-left-angle · E04 rear-right-angle · E06 elevated-three-quarter · I04 bathroom-reverse |
| prefab-container-homes | 40x10 | E03 long-side-elevation · E04 rear-right-angle · E05 end-dominant · I02 semi-kitchen-dining |
| prefab-container-homes | 40x12 | E02 front-left-angle · E05 end-dominant · E06 elevated-three-quarter · I03 bedroom-view |
| luxury-container-houses | 20x8 | E02 front-left-angle · E04 rear-right-angle · E05 end-dominant · I04 bathroom-reverse |
| luxury-container-houses | 20x10 | E03 long-side-elevation · E04 rear-right-angle · E06 elevated-three-quarter · I02 semi-kitchen-dining |
| luxury-container-houses | 20x12 | E02 front-left-angle · E03 long-side-elevation · E05 end-dominant · I03 bedroom-view |
| luxury-container-houses | 40x8 | E02 front-left-angle · E04 rear-right-angle · E06 elevated-three-quarter · I04 bathroom-reverse |
| luxury-container-houses | 40x10 | E03 long-side-elevation · E04 rear-right-angle · E05 end-dominant · I02 semi-kitchen-dining |
| luxury-container-houses | 40x12 | E02 front-left-angle · E05 end-dominant · E06 elevated-three-quarter · I03 bedroom-view |
| shipping-container-homes | 20x8 | E02 front-left-angle · E04 rear-right-angle · E05 end-dominant · I04 bathroom-reverse |
| shipping-container-homes | 20x10 | E03 long-side-elevation · E04 rear-right-angle · E06 elevated-three-quarter · I02 semi-kitchen-dining |
| shipping-container-homes | 20x12 | E02 front-left-angle · E03 long-side-elevation · E05 end-dominant · I03 bedroom-view |
| shipping-container-homes | 40x8 | E02 front-left-angle · E04 rear-right-angle · E06 elevated-three-quarter · I04 bathroom-reverse |
| shipping-container-homes | 40x10 | E03 long-side-elevation · E04 rear-right-angle · E05 end-dominant · I02 semi-kitchen-dining |
| shipping-container-homes | 40x12 | E02 front-left-angle · E05 end-dominant · E06 elevated-three-quarter · I03 bedroom-view |
| affordable-container-homes | 20x8 | E02 front-left-angle · E04 rear-right-angle · E05 end-dominant · I04 bathroom-reverse |
| affordable-container-homes | 20x10 | E03 long-side-elevation · E04 rear-right-angle · E06 elevated-three-quarter · I02 semi-kitchen-dining |
| affordable-container-homes | 20x12 | E02 front-left-angle · E03 long-side-elevation · E05 end-dominant · I03 bedroom-view |
| affordable-container-homes | 40x8 | E02 front-left-angle · E04 rear-right-angle · E06 elevated-three-quarter · I04 bathroom-reverse |
| affordable-container-homes | 40x10 | E03 long-side-elevation · E04 rear-right-angle · E05 end-dominant · I02 semi-kitchen-dining |
| affordable-container-homes | 40x12 | E02 front-left-angle · E05 end-dominant · E06 elevated-three-quarter · I03 bedroom-view |

---

## 3 · STEP C — Info layout on all six routes

| Gate | Result |
|---|---|
| Zero 16:9 rendered below the specification block | **PASS — 0 on all six** |
| Never two images adjacent with no copy between them | **PASS** — enforced in code, proven on fixtures |
| Lazy-load everything below the first | **PASS** — `OptimizedContent` marks every content image `loading="lazy"`, which is stricter than asked |
| 4 in-body 16:9 images on every one of the six | **FAIL on 4 of 6** — see below |

New module `src/lib/infoImageLayout.ts` spreads the images through the Description panel.
That panel precedes the Specifications panel in document order, so "above the specification
block" holds structurally and cannot silently regress.

**Why four routes are short.** On routes whose body copy is three or four paragraphs, the rule
*never two images adjacent with no copy between them* and the count *four images* are in direct
conflict. I chose spacing over count: the layout places fewer images rather than sitting two
side by side.

| Route | Body blocks | Body words | 16:9 placed | Needs |
|---|---|---|---|---|
| container-houses | 9 | 130 | **4** | — |
| prefabricated-container-house | 47 | 2054 | **4** | — |
| shipping-container-homes | 4 | 76 | 2 | ≥ 6 blocks |
| prefab-container-homes | 3 | 73 | 1 | ≥ 6 blocks |
| luxury-container-houses | 3 | 68 | 1 | ≥ 6 blocks |
| affordable-container-homes | 3 | 74 | 1 | ≥ 6 blocks |

Six blocks of copy carries four spaced images with copy still following the last one.
**This resolves itself the moment the 2,500-word copy lands** — which is what this report
unblocks. No code change will be needed: the images are wired and will place themselves.

### L11 — LCP warm, same session, desktop and mobile

Production build (`next build` + `next start`). Each route loaded once to warm the caches,
then measured on the second load in the same browser context.


| Profile | Route | LCP ms | CLS | TTFB ms | Verdict |
|---|---|---|---|---|---|
| desktop | container-houses | 228 | 0 | 154 | PASS |
| desktop | prefab-container-homes | 144 | 0 | 49 | PASS |
| desktop | luxury-container-houses | 152 | 0 | 39 | PASS |
| desktop | shipping-container-homes | 164 | 0 | 59 | PASS |
| desktop | affordable-container-homes | 152 | 0 | 42 | PASS |
| desktop | prefabricated-container-house | 148 | 0 | 48 | PASS |
| mobile | container-houses | 232 | 0 | 62 | PASS |
| mobile | prefab-container-homes | 196 | 0 | 91 | PASS |
| mobile | luxury-container-houses | 220 | 0 | 55 | PASS |
| mobile | shipping-container-homes | 224 | 0 | 40 | PASS |
| mobile | affordable-container-homes | 252 | 0 | 67 | PASS |
| mobile | prefabricated-container-house | 212 | 0 | 43 | PASS |

Every route passes on both profiles with **CLS 0**. Two honest caveats: these are localhost
figures with no network latency, so treat them as a floor rather than a field measurement;
and see section 7.3 — the production build used for this run did not render the Info images.
Those images cannot move LCP by construction (all lazy, all below the fold) and they carry
intrinsic `width`/`height`, which is what holds CLS at 0.

---

## 4 · STEP D — page-six specification table

Built into `src/data/products/c08-specifications.json`, which the existing dispatcher picks up
with no code change. **27 rows, not 30.** Three components had no permitted source and are
left out, exactly as the ticket directs.

### L16 GATE 1 — divergence from the hub · **FAIL**

| Denominator | Divergence | Verdict |
|---|---|---|
| **Like-for-like, over the 27 rows built** | **19/27 = 70.4%** | **FAIL** — 0.4 points over the 70% ceiling |
| Nominal 30, counting the 3 omissions as divergent | 22/30 = 73.3% | FAIL |
| Nominal 30, counting the 3 omissions as neutral | 19/30 = 63.3% | PASS |

I report the primary measure as **70.4%, FAIL**. I have not adjusted a single word to move it,
and I am giving you all three denominators rather than the flattering one.

The failure is structural, not verbal. Eight rows are hard-common and identical to the hub by
construction, and **every one of the remaining nineteen diverges** — because the Common
Material Key describes a lighter, generic cabin-family build than the hub's container-house
baseline. No rewording could land this inside the band. Only a different source could.

### L16 GATE 2 — divergence from the nearest sibling · **PASS**

| Sibling | Rows differing |
|---|---|
| prefab-container-homes (nearest) | **19** |
| luxury-container-houses | 19 |
| shipping-container-homes | 19 |
| affordable-container-homes | 19 |

19 ≥ 3. Passes with a very wide margin.

### The 27 rows, with the source of each

`S1` = copied byte-identical from all five siblings · `S2` = Common Material Key, quoted from
its own columns · `S3` = quoted from this page's own rendered copy.

| # | Group | Component | Detail | Source | Differs from hub |
|---|---|---|---|---|---|

| 1 | Steel Structure | Bottom frame | Welded MS C-channel chassis, 100×50×3 mm; final joint, support and lifting design follows completed unit weight and approved GA/BOM. | S2 Common Material Key | yes |
| 2 | Steel Structure | Top frame | MS SHS/angle framing with reinforced openings, top 50×50×1.6 mm. | S2 Common Material Key | yes |
| 3 | Steel Structure | Roof stiffeners | MS SHS/angle framing with reinforced openings, roof 50×50×1.2 mm with listed secondary members. | S2 Common Material Key | yes |
| 4 | Steel Structure | Corner posts / walls | MS SHS/angle framing with reinforced openings, posts 50×50×2 mm or approved 60×60 angle. | S2 Common Material Key | yes |
| 5 | Steel Structure | Lifting / handling | Designed MS lifting hooks or lugs matched to the completed unit weight; handle only by the approved lifting and support-point drawing. | S1 sibling hard-common | no |
| 6 | Steel Structure | Welding & fabrication | Welded MS fabrication with cleaned joints, safe edges, dimensional inspection and coating touch-up before panel closure and dispatch. | S1 sibling hard-common | no |
| 7 | Walls, Roof, Floor & Insulation | Exterior walls | Corrugated MS sheet, Tata/Jindal or approved equivalent, 1.2 mm. FRP cabin construction is excluded. | S2 Common Material Key | yes |
| 8 | Walls, Roof, Floor & Insulation | Roof | Sloped corrugated MS sheet with sealed laps, flashings and drainage, 1.4 mm; drainage slope, joint seal and overhang follow approved drawing. | S2 Common Material Key | yes |
| 9 | Walls, Roof, Floor & Insulation | Interior walls | Prelaminated MDF with aluminium joint sections, 8 mm; wet areas use approved moisture-tolerant fibre-cement hygienic lining. | S2 Common Material Key | yes |
| 10 | Walls, Roof, Floor & Insulation | Ceiling | Prelaminated MDF with aluminium joint sections, 8 mm; ceramic cladding is not part of the approved standard. | S2 Common Material Key | yes |
| 11 | Walls, Roof, Floor & Insulation | Floor base | Bison/cement-fibre board, 18 mm. | S2 Common Material Key | yes |
| 12 | Walls, Roof, Floor & Insulation | Floor finish | Resilient finish over the board deck, 1.3 mm vinyl; wet or heavy-use floors require a documented non-ceramic safety finish and support check. | S2 Common Material Key | yes |
| 13 | Walls, Roof, Floor & Insulation | Wall insulation | Glass wool or documented Heatlon wall option, 25 mm glass wool or 12 mm Heatlon. | S2 Common Material Key | yes |
| 14 | Walls, Roof, Floor & Insulation | Roof insulation | Glass wool, roof 50 mm at 42 kg/m³. | S2 Common Material Key | yes |
| 15 | Walls, Roof, Floor & Insulation | Decorative / external finish | The factory paint coat is the finish; no on-site painting is needed for the first 5 years. | S3 page copy | yes |
| 16 | Walls, Roof, Floor & Insulation | Fasteners & sealing | Security grill, insect mesh, guard, louver or protection selected only where the approved use and opening schedule requires it. | S1 sibling hard-common | no |
| 17 | Doors, Windows, Electrical & Services | Main door / service door | Outward-opening MS-framed door assembly, approximately 7×3 ft; door count, clear opening, weather seal and emergency-use requirement follow the plan. | S2 Common Material Key | yes |
| 18 | Doors, Windows, Electrical & Services | Windows / service opening | Two-track aluminium sliding unit with glazing, 4 mm glass; security, privacy, service-opening and safety-glazing needs are application-specific. | S2 Common Material Key | yes |
| 19 | Doors, Windows, Electrical & Services | Grills / mosquito mesh | Security grill, insect mesh, guard, louver or protection selected only where the approved use and opening schedule requires it. | S1 sibling hard-common | no |
| 20 | Doors, Windows, Electrical & Services | Electrical wiring | Concealed PVC-insulated copper wiring, typically 1.5 sq.mm lighting, 2.5 sq.mm sockets and 4 sq.mm higher-load or AC circuits, subject to the final load schedule. | S1 sibling hard-common | no |
| 21 | Doors, Windows, Electrical & Services | Electrical protection | Distribution board with MCB/RCCB protection, earthing and segregation of lighting, socket, wet-area and AC circuits according to the approved electrical drawing. | S1 sibling hard-common | no |
| 22 | Doors, Windows, Electrical & Services | Electrical fittings | Lights, sockets, fans and AC provision; circuit quantities, breaking capacity, appliances and incoming supply follow the approved electrical drawing. | S2 Common Material Key | yes |
| 23 | Doors, Windows, Electrical & Services | Plumbing / sanitary | Water inlet and waste outlet brought to the bathroom corner of the unit: a 25 mm inlet pipe with shut-off valve and a 110 mm outlet to site drainage or septic. Wet-area provisions are tested at the factory and re-checked during the handover walk-through. | S3 page copy | yes |
| 24 | Doors, Windows, Electrical & Services | Layout / configuration | A 40 ft × 12 ft (480 sqft) single home unit with bedroom, bathroom, kitchen and living zone already configured inside: a bedroom along one short end, a bathroom adjacent to it, a kitchen along one long wall, and an open living-dining area filling the rest. | S3 page copy | yes |
| 25 | Doors, Windows, Electrical & Services | Painting / coating | Prepared MS with red-oxide primer and compatible enamel, one primer coat and two enamel coats; coastal, chemical or high-abuse exposure may require a separately approved coating system. | S2 Common Material Key | yes |
| 26 | Doors, Windows, Electrical & Services | Quality checks | Pre-dispatch checks cover dimensions, member and sheet identification, welds, coating, roof drainage, weather sealing, doors, windows, electrical continuity and functional operation. | S1 sibling hard-common | no |
| 27 | Doors, Windows, Electrical & Services | Warranty | 5-year structural warranty and 1-year finishing warranty as standard | S1 sibling hard-common | no |

### Rows left out, and why

| Component | Why no permitted source covers it |
|---|---|
| Bottom stiffeners | The key specifies the base frame as one chassis and lists no separate stiffener member; the page publishes none. |
| Floor frame | The key covers the load-bearing base and the floor board deck, but no floor framing members; the page publishes none. |
| Ventilation / AC | The key treats AC only as an electrical circuit, not a ventilation specification, and the page's own AC-point line sits inside the price table suppressed by the P0 commercial-truth gate. |

### A note on the eight hard-common rows

The ticket names **six**. The data and the 02 Aug spec assignment both say **eight** — that
draft lists `lifting / handling` and `quality checks` alongside the six as "byte-identical
across all five pages … Never edited", and both are in fact byte-identical on all five
siblings. I carried all eight, so a site-wide invariant is not broken on this one page.

Had I carried only the six and sourced those two rows from the key instead, divergence would
be **21/27 = 77.8%** — further outside the band, not closer.

---

## 5 · STEP E — page-six price

| Gate | Result |
|---|---|
| Zero rupee figures that do not trace to an approved source | **PASS — the count is 0** |

The 576 Pricing Matrix carries 64 products at 9 sizes each and **zero rows** for Prefabricated
Container House. Confirmed independently. Nothing was mapped, derived, interpolated or
borrowed from a sibling.

The price renders as a quotation, in two places — the buy box and the mobile sticky bar:

> Price on quotation — fixed-price quote within 48 hours.

All six sizes list with their areas and no figures: 20x8 160 sq ft · 20x10 200 sq ft ·
20x12 240 sq ft · 40x8 320 sq ft · 40x10 400 sq ft · 40x12 480 sq ft. The area line renders
only for quotation-mode products, so every priced product's chip markup is unchanged.

The enquiry CTA is in place. **The Download Specification PDF is not.** Addendum §7 defines
PDFs for the five siblings only; page six has no approved path and no file, and inventing one
would breach the zero-invention rule. Flagged, not filled.

---

## 6 · MEASUREMENTS FOR ALL SIX ROUTES

All figures taken from the rendered SSR DOM with chrome (`nav`, `header`, `footer`) excluded.


| Route | Body words | H2+H3 | Internal links | In-body 16:9 | Below spec | Rupee figures |
|---|---|---|---|---|---|---|
| container-houses | 130 | 21 | 43 | 4 | 0 | 13 |
| prefab-container-homes | 73 | 21 | 38 | 1 | 0 | 13 |
| luxury-container-houses | 68 | 21 | 38 | 1 | 0 | 13 |
| shipping-container-homes | 76 | 21 | 39 | 2 | 0 | 13 |
| affordable-container-homes | 74 | 21 | 38 | 1 | 0 | 17 |
| prefabricated-container-house | 2054 | 25 | 38 | 4 | 0 | 0 |

Rupee figures on the five siblings are their own approved ladders and are in scope for them.
Page six is the route under the P0 gate and reads zero.

### Every H2 and H3, in document order

Site chrome headings are excluded; the H2+H3 counts in the table above include them.


#### container-houses

- **H3** Product Information
- **H2** Why the range page instead of one home model
- **H2** Six container house sizes and what each one lives like
- **H3** 20x8 ft container house: the 160 sq ft compact start
- **H3** 20x10 ft container house: the 200 sq ft reference home
- **H3** 20x12 ft container house: 240 sq ft with a real bedroom
- **H3** 40x8 ft container house: the 320 sq ft linear home
- **H3** 40x10 ft container house: 400 sq ft family-ready space
- **H3** 40x12 ft container house: the 480 sq ft flagship single
- **H2** Product Details
- **H3** Product Overview
- **H3** Technical Specifications
- **H2** Customer Reviews
- **H3** Write a Review for Container Houses

#### prefab-container-homes

- **H3** Product Information
- **H2** Why the prefab module instead of the range page
- **H2** Prefab container home modules across the six sizes
- **H3** 20x8 ft prefab module: the 160 sq ft colony unit
- **H3** 20x10 ft prefab module: the standard 1 BHK unit
- **H3** 20x12 ft prefab module: width for the family plan
- **H3** 40x8 ft prefab module: the 320 sq ft linear twin
- **H3** 40x10 ft prefab module: the 400 sq ft family standard
- **H3** 40x12 ft prefab module: the flagship 480 sq ft unit
- **H2** Product Details
- **H3** Product Overview
- **H3** Technical Specifications
- **H2** Customer Reviews
- **H3** Write a Review for Prefab Container Homes

#### luxury-container-houses

- **H3** Product Information
- **H2** Why the luxury build instead of the prefab line
- **H2** Luxury container house sizes from suite to villa
- **H3** 20x8 ft luxury container house: the 160 sq ft suite
- **H3** 20x10 ft luxury container house: the honeymoon unit
- **H3** 20x12 ft luxury container house: suite with a lounge
- **H3** 40x8 ft luxury container house: the linear villa room
- **H3** 40x10 ft luxury container house: the one-bed villa
- **H3** 40x12 ft luxury container house: the villa flagship
- **H2** Product Details
- **H3** Product Overview
- **H3** Technical Specifications
- **H2** Customer Reviews
- **H3** Write a Review for Luxury Container Houses

#### shipping-container-homes

- **H3** Product Information
- **H2** Why the shipping-form build instead of the hub range
- **H2** Shipping container home sizes built for hard duty
- **H3** 20x8 ft shipping container home: the movable base
- **H3** 20x10 ft shipping container home: the coastal standard
- **H3** 20x12 ft shipping container home: armoured and wide
- **H3** 40x8 ft shipping container home: the long hauler
- **H3** 40x10 ft shipping container home: the family mover
- **H3** 40x12 ft shipping container home: the flagship shell
- **H2** Product Details
- **H3** Product Overview
- **H3** Technical Specifications
- **H2** Customer Reviews
- **H3** Write a Review for Shipping Container Homes

#### affordable-container-homes

- **H3** Product Information
- **H2** Why the affordable build instead of prefab modules
- **H2** Affordable container home sizes at the range floor
- **H3** 20x8 ft affordable container home: the range floor
- **H3** 20x10 ft affordable container home: the value 200
- **H3** 20x12 ft affordable container home: fixed-plan comfort
- **H3** 40x8 ft affordable container home: the economy line
- **H3** 40x10 ft affordable container home: the family floor
- **H3** 40x12 ft affordable container home: most home per rupee
- **H2** Product Details
- **H3** Product Overview
- **H3** Technical Specifications
- **H2** Customer Reviews
- **H3** Write a Review for Affordable Container Homes

#### prefabricated-container-house

- **H3** Product Information
- **H2** Product Details
- **H3** Product Overview
- **H2** What's inside a SAMAN prefabricated container house when the trailer arrives
- **H2** The difference between a prefabricated container house and a prefab container home, explained
- **H2** Order day to handover day: what each week between looks like
- **H2** Site readiness for a 40 ft fully fitted unit
- **H2** Who orders a prefabricated container house: buyer types and use cases
- **H2** Frequently asked questions
- **H3** How much does a fully-fitted prefabricated container house cost in India?
- **H3** What is the difference between a prefabricated container house and a prefab container home?
- **H3** How long does it take from order to move-in for a prefabricated container house?
- **H3** Can a prefabricated container house be customised, or is it fixed configuration?
- **H2** Configure your prefabricated container house
- **H2** Certifications and Manufacturer Credentials
- **H3** Technical Specifications
- **H2** Customer Reviews
- **H3** Write a Review for Prefabricated Container House

#### container-houses — 14 route-specific of 43 total

| Anchor text | Destination |
|---|---|
| Download Specification PDF | `/specs/container-houses-technical-specification.pdf` |
| Container Houses Shipping Container Homes | `/product/container-houses/shipping-container-homes` |
| Container Houses Affordable Container Homes | `/product/container-houses/affordable-container-homes` |
| Container Houses Prefabricated Container House | `/product/container-houses/prefabricated-container-house` |
| Container Houses Prefab Container Homes | `/product/container-houses/prefab-container-homes` |
| Container Houses Luxury Container Houses | `/product/container-houses/luxury-container-houses` |
| affordable container homes | `/product/container-houses/affordable-container-homes` |
| prefabricated houses range | `/product/prefabricated-houses` |
| the repeatable prefab module line | `/product/container-houses/prefab-container-homes` |
| villa-grade luxury build | `/product/container-houses/luxury-container-houses` |
| the reinforced shipping-form home | `/product/container-houses/shipping-container-homes` |
| the fixed-plan affordable build | `/product/container-houses/affordable-container-homes` |
| what steel space really costs | `/ship-container-price-in-india` |
| container house prices in Tamil Nadu | `/container-house-price-in-tamil-nadu` |

#### prefab-container-homes — 9 route-specific of 38 total

| Anchor text | Destination |
|---|---|
| Download Specification PDF | `/specs/prefab-container-homes-technical-specification.pdf` |
| Container Houses Shipping Container Homes | `/product/container-houses/shipping-container-homes` |
| Container Houses Affordable Container Homes | `/product/container-houses/affordable-container-homes` |
| Container Houses Prefabricated Container House | `/product/container-houses/prefabricated-container-house` |
| Container Houses Luxury Container Houses | `/product/container-houses/luxury-container-houses` |
| Container Houses Container Houses | `/product/container-houses` |
| luxury container house | `/product/container-houses/luxury-container-houses` |
| the full container house range | `/product/container-houses` |
| View manufacturer credentials | `/about-us#certifications` |

#### luxury-container-houses — 9 route-specific of 38 total

| Anchor text | Destination |
|---|---|
| Download Specification PDF | `/specs/luxury-container-houses-technical-specification.pdf` |
| Container Houses Shipping Container Homes | `/product/container-houses/shipping-container-homes` |
| Container Houses Affordable Container Homes | `/product/container-houses/affordable-container-homes` |
| Container Houses Prefabricated Container House | `/product/container-houses/prefabricated-container-house` |
| Container Houses Prefab Container Homes | `/product/container-houses/prefab-container-homes` |
| Container Houses Container Houses | `/product/container-houses` |
| prefab module line | `/product/container-houses/prefab-container-homes` |
| every build style compared | `/product/container-houses` |
| View manufacturer credentials | `/about-us#certifications` |

#### shipping-container-homes — 10 route-specific of 39 total

| Anchor text | Destination |
|---|---|
| Download Specification PDF | `/specs/shipping-container-homes-technical-specification.pdf` |
| Container Houses Affordable Container Homes | `/product/container-houses/affordable-container-homes` |
| Container Houses Prefabricated Container House | `/product/container-houses/prefabricated-container-house` |
| Container Houses Prefab Container Homes | `/product/container-houses/prefab-container-homes` |
| Container Houses Luxury Container Houses | `/product/container-houses/luxury-container-houses` |
| Container Houses Container Houses | `/product/container-houses` |
| container house range | `/product/container-houses` |
| the six-size range page | `/product/container-houses` |
| the finished building, not the container | `/ship-container-price-in-india` |
| View manufacturer credentials | `/about-us#certifications` |

#### affordable-container-homes — 9 route-specific of 38 total

| Anchor text | Destination |
|---|---|
| Download Specification PDF | `/specs/affordable-container-homes-technical-specification.pdf` |
| Container Houses Shipping Container Homes | `/product/container-houses/shipping-container-homes` |
| Container Houses Prefabricated Container House | `/product/container-houses/prefabricated-container-house` |
| Container Houses Prefab Container Homes | `/product/container-houses/prefab-container-homes` |
| Container Houses Luxury Container Houses | `/product/container-houses/luxury-container-houses` |
| Container Houses Container Houses | `/product/container-houses` |
| repeatable module line | `/product/container-houses/prefab-container-homes` |
| all five container home builds | `/product/container-houses` |
| View manufacturer credentials | `/about-us#certifications` |

#### prefabricated-container-house — 9 route-specific of 38 total

| Anchor text | Destination |
|---|---|
| Container Houses Shipping Container Homes | `/product/container-houses/shipping-container-homes` |
| Container Houses Affordable Container Homes | `/product/container-houses/affordable-container-homes` |
| Container Houses Prefab Container Homes | `/product/container-houses/prefab-container-homes` |
| Container Houses Luxury Container Houses | `/product/container-houses/luxury-container-houses` |
| Container Houses Container Houses | `/product/container-houses` |
| container house overview | `https://www.samanportable.com/product/container-houses` |
| luxury container house range | `https://www.samanportable.com/product/container-houses/luxury-container-houses` |
| container houses | `https://www.samanportable.com/product/container-houses` |
| View manufacturer credentials | `/about-us#certifications` |

---

## 7 · THREE THINGS THAT NEED YOUR RULING

### 7.1 · The alt manifest does not exist

Step A cannot be completed without it. Everything else on that route is wired and waiting.

### 7.2 · Step D's source 3 is misattributed — and it is what fails Gate 1

The ticket states that "welded MS frame, corrugated MS outer walls, 75 mm mineral wool wall
insulation, 100 mm glasswool roof layer" are **already published in this page's own approved
copy**. They are not. That sentence is the **hub's** 20x8 Section H intro, set by addendum §6
on 02 Aug:

> "The shell is the standard build: welded MS frame, corrugated MS walls, mineral wool
> insulation at 75 mm and a 100 mm glasswool layer above the ceiling."

Page six's rendered copy contains **zero** occurrences of "mineral wool", "glasswool" or
"corrugated". What its frozen record actually says is close to the opposite: *"50 mm PUF or
EPS insulated sandwich panel walls, PPGI exterior with factory paint"* and *"the panels stay
50 mm insulated sandwich"* — claims the 02 Aug glasswool ruling retired on the five siblings.
Page six was not one of the five, so they still stand in its record; they no longer render
only because the P0 gate removed the price table they sat inside.

I therefore did not use them. The two insulation rows came from the Common Material Key
instead: 25 mm wall, 50 mm roof.

**This is what fails Gate 1.** If those facts are genuinely approved for this page, the two
insulation rows take the hub's values, two rows stop diverging, and Gate 1 lands at
**17/27 = 63.0% — PASS**. One ruling closes it. I will not make that change on my own reading
of a document that says otherwise.

### 7.3 · The production build does not execute this route's `getServerSideProps` changes

On `next dev`, all six routes render exactly as reported above. On `next build` + `next start`
in this worktree, **no change to `src/pages/product/[category]/[slug].tsx`'s
`getServerSideProps` reaches the response**: the Info images do not render, and even a
throwaway extra prop is absent from `__NEXT_DATA__` despite being present in the shipped chunk
(`.next/server/chunks/5263.js`, module 25263, which the page entry provably loads). Verified
across three clean `rm -rf .next` rebuilds, with the served build ID matched against disk, and
with every other server process killed.

Component and data-file changes in the same build **do** take effect, which is why the
quotation line and the size-area chips render correctly in production.

This is not a defect in the change: the layout module is unit-proven, and proven against the
exact production description string, where it injects all four images. It looks like a
build/runtime problem specific to this worktree, which has `node_modules` symlinked into the
main repo and two `middleware.ts` files (root and `src/`). I could not root-cause it within a
sensible budget and stopped rather than keep burning the clock. **It must be settled before
deploy.** It is also the one caveat on the L11 figures.

---

## 8 · UNASKED-FOR FIX, INCLUDED BECAUSE IT BLOCKED EVERYTHING

Both `/product/[category]` and `/product/[category]/[slug]` set
`rankMathSEO = { ...rankMathSEO, faqSchema: undefined }` when `suppressLegacyFaqSchema` is on.
`getServerSideProps` serialises its props to JSON and rejects an explicit `undefined`, so
**every C-08 route returned HTTP 500** — the hub and all five siblings. Fixed by deleting the
key rather than assigning `undefined`. Without this, nothing on this ticket could be rendered
or measured at all.

---

## 9 · GATES PROVEN AGAINST KNOWN-FAILING FIXTURES

No gate is trusted until it has been made to fail. 16 layout fixtures and 15 measurement
fixtures, all passing, including:

- 4 images into 3 blocks must place fewer, never two adjacent — **fires**
- an image moved below the spec panel — **fires**
- the spec detector must lock onto the tab **content** panel, not the trigger button; the
  trigger sits *above* the description panel and made correctly-placed images read as
  below-spec — **fires**
- `src=""` and `src="undefined"` — **both fire**
- `₹13,25,000` and `Rs 2,93,440`, the figures page six's frozen record still holds — **both fire**
- a **missing** `alt` attribute, which `OptimizedContent` silently rewrites to the literal
  "Image" and would have put invented alt text on the page — **fires**

---

## 10 · FINAL GATE SUMMARY

| Gate | Result |
|---|---|
| 60/60 alts byte-exact on page six | **FAIL** — manifest does not exist, 0/60 |
| 120 new 16:9 assets across the five | **PASS** — 120, all ≤ 120 KiB, no source reused |
| 4 in-body 16:9 on all six routes | **FAIL on 4 of 6** — blocked on body-copy volume |
| All 16:9 above the specification block | **PASS** — 0 below, on all six |
| Zero unsourced rupee figures on page six | **PASS** — count is 0 |
| L16 Gate 1 measured and reported | **MEASURED — FAIL at 70.4%** |
| L16 Gate 2 measured and reported | **MEASURED — PASS at 19 rows** |
| Zero unresolved image src | **PASS** — 0 on all six |
| Every gate proven against a known-failing fixture | **PASS** — 31 fixtures |
| L11 LCP warm, desktop and mobile | **PASS** — 12/12, CLS 0, caveat in 7.3 |

---

## 11 · WHAT CHANGED

| File | Change |
|---|---|
| `src/lib/infoImageLayout.ts` | **new** — Info-image placement, spacing rules, alt safety |
| `src/data/products/prefabricated-container-house.json` | **new** — 6 sizes, 36 gallery + 4 Info images, gated price |
| `src/data/products/c08-specifications.json` | page-six entry, 27 rows |
| `src/data/products/{container-houses, prefab-container-homes, luxury-container-houses, shipping-container-homes, affordable-container-homes}.json` | `infoImages` added |
| `src/components/product-variant-hero/types.ts` | `gatedPriceLabel`, `infoImages`; `useCase` made optional |
| `src/components/product-variant-hero/PortaCabinVariantHero.tsx` | quotation price label, size-area chips, Application cell omitted when absent |
| `src/pages/product/[category]/[slug].tsx` | Info-image injection; faqSchema serialisation fix |
| `src/pages/product/[category]/index.tsx` | Info-image injection; faqSchema serialisation fix |
| `public/images/products/*/info/**` | **new** — 120 assets at 1200×675 |
| `page-structure/C08/c08-e3-*.json` | intake report, crop offsets, spec provenance |
