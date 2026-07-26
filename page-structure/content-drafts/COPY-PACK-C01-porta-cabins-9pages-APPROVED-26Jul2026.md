# CODEX PROMPT — EVENT B: C-01 CONTENT BUILD
<!-- Runs in PARALLEL with Event A (redirects). This session touches NO redirect, sitemap or routing file. -->
<!-- PASTE THIS ENTIRE FILE INTO CODEX. Nothing above or outside it is needed. -->

You are executing the complete C-01 Porta Cabins cluster event for samanportable.com on branch `static-migration`. Work in a **fresh worktree off `origin/static-migration`**. The main clone is never a baseline.

You build and validate. **You decide nothing.** Any gap, ambiguity, missing asset or conflict between this packet and what you find in the repo → **STOP and report to Fable 5.** Do not improvise, do not substitute, do not "fix" copy.

## 0 · SCOPE — the cluster is 9 pages

| # | URL |
|---|---|
| hub | `/product/porta-cabins` |
| 1 | `/product/porta-cabins/low-cost-porta-cabin` |
| 2 | `/product/porta-cabins/luxury-porta-cabin` |
| 3 | `/product/porta-cabins/steel-porta-cabin` |
| 4 | `/product/porta-cabins/porta-cabin-with-toilet` |
| 5 | `/product/porta-cabins/porta-cabin-shop` |
| 6 | `/product/porta-cabins/mini-porta-cabin` |
| 7 | `/product/porta-cabins/portacabin-office` |
| 8 | `/product/porta-cabins/ms-porta-cabin` |

**No other porta cabin page receives content work.** If you find a page not on this list, it is retired — see §5.

## 1 · HARD PROHIBITIONS (breaking any of these fails the event)

1. **L3 SEO Lock.** Do not alter the URL, `<title>`, `<h1>`, meta description, or the first 100 words of body copy on any of the 9 pages. Not one character.
2. **Do not invent any specification value.** Every value you publish must come byte-exact from the approved specification workbook or from this packet. No paraphrase, no rounding, no unit conversion.
3. **Do not edit any copy in this packet.** Titles, bodies, headings and use-case chips are character-counted and validated. Changing them breaks the acceptance gates.
4. **Do not touch** existing schema, reviews, FAQs, images, or the global nav and footer in this event.
5. **Do not merge.** Preview, report, stop.

## 2 · WHAT TO BUILD ON EACH OF THE 9 PAGES

### 2.1 Right-to-exist block — NEW section, all 9 pages
Placement: **immediately after the first section**, below the price and CTA band, above the specification table.
Structure: H2 → platform sentence → three-sentence body → comparison line.
Sibling product names in the third sentence and in the comparison line are **contextual links** to that sibling's URL. Anchor text is exactly the words shown — do not extend or shorten the anchor.
Copy is in §7 of this packet. Verbatim.

### 2.2 §H Size & Applications Explorer
Use the **existing component from the porta-cabins hub**. No new UI, no new library, no restyle. Tab image is that size's exterior hero from the existing image set, lazy-loaded. CTA label `Get Quote`. Structural fill rule inherited from L13 REV 2.1.

| Page | Tabs | Status |
|---|---|---|
| low-cost-porta-cabin | 9 | copy already delivered (Drop 1) |
| luxury-porta-cabin | 9 | copy already delivered (Drop 1) |
| mini-porta-cabin | **4** | §8 of this packet |
| ms-porta-cabin | 9 | §8 |
| steel-porta-cabin | 9 | §8 |
| porta-cabin-shop | 9 | §9 |
| porta-cabin-with-toilet | 9 | §9 |
| portacabin-office | 9 | §9 |

**mini-porta-cabin carries exactly 4 tabs** — 10×10, 20×8, 20×10, 20×12. It absorbs the retired small-portacabin. Its `offerCount` becomes 4. Every other page keeps 9.

### 2.3 Specification table — apply the assigned configuration
Extract byte-exact values from `SAMAN_MASTER_64_Products_Detailed_Technical_Specs_9_Sizes_Report-with-price-PR.xlsx`. Where an assignment splits an approved OR-alternative, take the stated half verbatim.

| Page | Assigned configuration |
|---|---|
| hub | Reference standard — unchanged |
| low-cost-porta-cabin | Value grade: 0.8–1.0 mm exterior, 1.2 mm roof, 6 mm lining, 18 mm BWP ply, 1.5 mm vinyl, 25 mm glass wool |
| luxury-porta-cabin | Premium: 1.25–1.6 mm exterior, 1.6 mm roof, 12 mm ply + laminate + HPL, 12.5 mm gypsum, 19 mm marine ply, 5–6 mm SPC |
| mini-porta-cabin | Value grade, compact band; 12 mm heatlon wall insulation |
| ms-porta-cabin | Heavy industrial, **fixed position** — take `8–10 mm fibre-cement board`, `24 mm cement board`, `2–3 mm commercial PVC/epoxy`, single-leaf industrial door |
| steel-porta-cabin | Heavy relocation — take `0.50 mm pre-painted metal liner`, `heavy MS floor plate`, `3 mm chequered plate`, double-leaf MS door, upgraded lifting lugs |
| porta-cabin-shop | Retail: 8–12 mm ply/HPL, 4 mm ACP or decorative ceiling, 3–4 mm LVT, service glazing with lockable counter opening |
| porta-cabin-with-toilet | Wet-area: 10–12 mm fibre-cement, 18–24 mm cement board + membrane, 2.5–3 mm anti-skid vinyl, sealed joints |
| portacabin-office | **Upgraded office grade** — office layout with workstations, storage, optional partition; upgraded lining and flooring, office-grade glazing. **NOT premium: no gypsum ceiling, no HPL feature panels, no SPC floor.** Those stay with Luxury. |

**These 6 rows must be BYTE-IDENTICAL on all 9 pages:** Welding & fabrication · Fasteners & sealing · Grills / mosquito mesh · Electrical wiring · Electrical protection · Warranty.
**These 3 rows use only the 7 approved wordings:** Lifting / handling · Painting / coating · Quality checks.

### 2.4 PDF specification download — all 9 pages
Button in the **first section**, beside the primary enquiry CTA, secondary/outline style. Label exactly: `Download Specification PDF`.
Path: `/specs/<slug>-technical-specification.pdf` — **one PDF per page, never shared.**
Generate by script from the specification workbook + the approved price matrix. Contents in order: letterhead with canonical company facts · product name and canonical URL · that page's own 30-row specification table with differing rows marked · that page's own price ladder ex-GST and incl-GST at 18% · the warranty sentence verbatim · delivery and quotation turnaround · certifications · the four contact numbers and two emails · generation date. Max 400 KB. Not in the sitemap.
Visual template: the two existing files `saman-porta-cabin-specifications.pdf` and `saman-low-cost-porta-cabin-specifications.pdf`. Regenerate all nine from one script so nothing can drift.

### 2.5 Supporting-keyword section on portacabin-office
Because `porta-cabin-office` redirects here, this page now owns both word forms. Add one H3 section, copy in §10. This is **not** an L3 zone edit — it goes in the body, below the specification table.

## 3 · INTERNAL LINKING — exact anchors, no substitutions

**Rules:** no page links out using its own primary keyword · every subpage links back to the hub with a different anchor · at most one exact-match anchor per page and only hub-to-subpage · 2–4 internal links per subpage, 5–15 on the hub · no links in the first paragraph · **no link to Portable Cabin, Portable Office or Security Cabins from any C-01 page in this event.**

### Hub → subpage anchors (each used exactly once on the hub)
`low cost porta cabin` · `luxury porta cabin` · `steel porta cabin built for repeat relocation` · `porta cabin with toilet` · `porta cabin shop` · `mini porta cabin for compact sites` · `portacabin office` · `MS porta cabin`

### Subpage → hub anchors (all different, none exact-match)
| Page | Anchor |
|---|---|
| low-cost-porta-cabin | `the full cabin range and its standard specification` |
| luxury-porta-cabin | `our complete range of factory-built cabins` |
| steel-porta-cabin | `the standard cabin build` |
| porta-cabin-with-toilet | `the standard cabin without sanitary provision` |
| porta-cabin-shop | `see how the base cabin is specified` |
| mini-porta-cabin | `all nine standard cabin sizes` |
| portacabin-office | `the wider cabin range` |
| ms-porta-cabin | `the standard reference specification` |

### Sideways links — exactly those named in each right-to-exist block, and no others
The comparison line and the third sentence already name the siblings. **Those are the only sideways links added.** Two cross-cluster links are permitted, both already inside their sentence: shop → container cafe hub, and with-toilet → portable toilet hub.

## 4 · SCHEMA
`ProductGroup` + one `Offer` per published size. `offerCount` = 9 on every page **except mini-porta-cabin, where it is 4.** Prices ex-GST, INR, from the approved matrix. Standard SKUs get `MerchantReturnFiniteReturnWindow`, 7 days, `ReturnByMail`, `ReturnShippingFees`, country IN; custom SKUs get `MerchantReturnNotPermitted` with the defect remedy in visible copy. No other schema change in this event.

## 5 · FILE OWNERSHIP — hard boundary with Event A

Event A (the redirect and retirement session) is running at the same time in its own worktree. **You must not touch any of these — they belong to Event A:** the redirects/routing config, `next-sitemap.config.js`, any sitemap file, and the source files of retired pages. If a task appears to require one of them, STOP and report. You own only page components, copy, specification data, PDF generation and the internal links listed in §3 — all of which point exclusively at the 9 surviving pages, so no link you write can collide with Event A's work.

## 6 · ACCEPTANCE — report every line with its measured value

1. Specification divergence versus the hub, printed per page as `n/30 = x%`. **Every subpage ≥ 40% and ≤ 70%.** Any page outside the band → STOP.
2. All 6 hard-common rows byte-identical across all 9 pages.
3. Zero published specification values absent from the approved workbook.
4. Right-to-exist block present on all 9, character counts inside their bands, three sentences, siblings linked.
5. **Zero 7-word sequences shared between any two right-to-exist blocks site-wide**, and zero between any two §H bodies.
6. §H tab counts: 4 on mini, 9 on the other seven subpages.
7. Nine PDFs exist; each is page-specific; every price in each PDF matches its page byte-for-byte; warranty sentence identical across all nine.
8. `offerCount` 4 on mini, 9 elsewhere; every Offer price traced to the approved matrix.
9. Every internal link you added resolves 200 in one hop to one of the 9 surviving pages. Redirect verification belongs to Event A.
10. L3 zones unchanged — diff proves zero change to URL, title, H1, meta and first 100 words on all 9 pages.
11. Visual regression at 360/768/1024/1440 — layout unchanged except where content was added.
12. TypeScript clean, production build clean, CWV no-regress against the lockfile.
13. Sitemap untouched by this session — confirm zero diff on sitemap and routing files.

Then: preview, full report to Fable 5, **STOP**. After merge, reset the main clone to `origin/static-migration`.

---

# ═══ CONTENT — VERBATIM ═══

## 7 · RIGHT-TO-EXIST BLOCKS — all 9 pages

### /product/porta-cabins
**H2 (30c):** `Why choose a SAMAN porta cabin`

**Platform sentence:** `Newly fabricated at our own works from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container.`

**Body (426c, 3 sentences):**
> Every porta cabin here is newly fabricated at our own works from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container. The reference build carries a 1.2 mm corrugated exterior, a 1.4 mm roof, 8 mm pre-laminated interior lining and an 18 mm Bison floor panel, in nine standard sizes. The range then splits by grade, size band and fit-out; the eight pages below cover each configuration in full.

**Comparison line (108c):** `Not sure which grade fits? Compare the value line, the upgraded office build and the heavy industrial build.`

### /product/porta-cabins/low-cost-porta-cabin
**H2 (35c):** `Why choose the Low Cost Porta Cabin`

**Platform sentence:** `Newly fabricated at our own works from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container.`

**Body (409c, 3 sentences):**
> The value grade of our newly fabricated porta cabin, built on the identical welded MS frame and offered across all nine standard sizes. It specifies a 0.8–1.0 mm corrugated exterior, 6 mm pre-laminated lining and 1.5 mm vinyl over an 18 mm BWP plywood floor, saving on finish and never on structure. Choose it when the cabin serves your own team; move to the Luxury Porta Cabin when clients will walk into it.

**Comparison line (108c):** `Only need a compact footprint? The Mini Porta Cabin covers the four smallest sizes at this same value grade.`

### /product/porta-cabins/luxury-porta-cabin
**H2 (33c):** `Why choose the Luxury Porta Cabin`

**Platform sentence:** `Newly fabricated at our own works from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container.`

**Body (399c, 3 sentences):**
> The premium grade of the same newly fabricated cabin, specified for reception areas and client-facing rooms. It carries a 1.25–1.6 mm exterior, 12 mm plywood lining with laminate and HPL feature panels, a 12.5 mm gypsum ceiling and 5–6 mm SPC flooring over marine ply. Choose it where the room is seen by customers; the Portacabin Office covers working offices at upgraded rather than premium grade.

**Comparison line (107c):** `Want this finish without a desk layout? This page keeps the open room; office fit-outs sit one grade below.`

### /product/porta-cabins/mini-porta-cabin
**H2 (31c):** `Why choose the Mini Porta Cabin`

**Platform sentence:** `Newly fabricated at our own works from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container.`

**Body (411c, 3 sentences):**
> The compact end of our newly fabricated range, covering the four smallest sizes from a one-person duty post to a four-person room. It keeps the value specification — a 0.8–1.0 mm exterior with 6 mm lining — and adds a second window and separate socket circuit once the cabin passes 200 sq ft. Choose it for gate posts, kiosks and small teams; the Low Cost Porta Cabin carries the same grade in the larger sizes.

**Comparison line (110c):** `Need a fitted workspace rather than a duty room? The Portacabin Office adds workstations, storage and glazing.`

### /product/porta-cabins/ms-porta-cabin
**H2 (35c):** `Why choose the MS Porta Cabin build`

**Platform sentence:** `Newly fabricated at our own works from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container.`

**Body (409c, 3 sentences):**
> The heavy industrial grade of our newly fabricated cabin, specified for plants, workshops and hostile environments. It carries a 1.6 mm exterior and roof, 8–10 mm fibre-cement lining, a 24 mm cement board floor and 2–3 mm commercial PVC or epoxy finish behind a single-leaf industrial door. Choose it for a fixed industrial position; the Steel Porta Cabin covers units that are lifted and re-sited repeatedly.

**Comparison line (111c):** `Housing an office rather than a workshop? The Portacabin Office trades industrial lining for a working fit-out.`

### /product/porta-cabins/steel-porta-cabin
**H2 (32c):** `Why choose the Steel Porta Cabin`

**Platform sentence:** `Newly fabricated at our own works from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container.`

**Body (400c, 3 sentences):**
> The heavy relocation build of our newly fabricated cabin, made for units that are lifted, moved and stacked repeatedly. It takes the 1.6 mm exterior with a 0.50 mm pre-painted metal liner, a heavy MS floor plate with 3 mm chequered plate finish, double-leaf MS doors and upgraded lifting lugs. Choose it where the cabin moves between sites; the MS Porta Cabin suits a unit that stays in one position.

**Comparison line (111c):** `Need a lighter cabin that stays on one site? The Porta Cabins hub carries the standard reference specification.`

### /product/porta-cabins/porta-cabin-shop
**H2 (31c):** `Why choose the Porta Cabin Shop`

**Platform sentence:** `Newly fabricated at our own works from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container.`

**Body (421c, 3 sentences):**
> The retail configuration of our newly fabricated cabin, planned around a front service counter with staff preparation and storage behind it. It carries 8–12 mm plywood with laminate or 6–8 mm HPL panels, a 4 mm ACP or decorative ceiling, 3–4 mm LVT flooring and large service glazing with a lockable counter opening. Choose it when customers are served at the cabin; the Portacabin Office covers staff-only working space.

**Comparison line (109c):** `Selling food or drink rather than goods? The container cafe range is planned around kitchen services instead.`

### /product/porta-cabins/porta-cabin-with-toilet
**H2 (38c):** `Why choose the Porta Cabin with Toilet`

**Platform sentence:** `Newly fabricated at our own works from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container.`

**Body (430c, 3 sentences):**
> A working cabin with its own attached toilet in one newly fabricated unit — one delivery, one base, one drainage connection, no separate sanitary block. The wet zone uses 10–12 mm moisture-tolerant fibre-cement lining, an 18–24 mm cement board deck with waterproof membrane, and 2.5–3 mm anti-skid safety vinyl with sealed joints. Choose it wherever staff work and need facilities on the spot rather than at the far end of a site.

**Comparison line (113c):** `Need a standalone sanitary unit with no working space? The portable toilet range is sized by model, not by cabin.`

### /product/porta-cabins/portacabin-office
**H2 (32c):** `Why choose the Portacabin Office`

**Platform sentence:** `Newly fabricated at our own works from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container.`

**Body (408c, 3 sentences):**
> The office configuration of our newly fabricated cabin — workstations, storage and an optional manager partition. Upgraded lining and flooring sit under office-grade glazing, with power and data drawn to your furniture plan and none of the gypsum ceiling or HPL panelling of the premium build. Choose it for any working office; at ₹1,450 per square foot it sits between the plain cabin and the premium build.

**Comparison line (113c):** `Room will be seen by clients? The Luxury Porta Cabin adds the gypsum ceiling, feature panelling and SPC flooring.`

## 8 · §H COPY — mini (4 tabs) · MS (9) · steel (9)

### /product/porta-cabins/mini-porta-cabin *(4 tabs — absorbs small-portacabin)*
**H2 (54c):** `Explore every Mini Porta Cabin size and where it works`

**Guidance line (121c):** `Four compact sizes, from a one-person duty post to a four-person room. Larger sizes are on the Low Cost Porta Cabin page.`

#### Tab 1 — 10×10 ft
**Title (42c):** `10×10 ft — the single-occupancy duty cabin`

**Body (577c):**
> One hundred square feet built for one person on duty, and the smallest unit we fabricate. The value specification runs throughout: a 0.8–1.0 mm corrugated exterior over the same welded MS frame, 6 mm pre-laminated lining, 12 mm heatlon insulation and an 18 mm BWP plywood floor under 1.5 mm vinyl. One sliding window and a single lighting and socket circuit are sized for one occupant, which is why it costs less to run than any other cabin here. Gate posts, watchman points and weighbridge kiosks take this size more than any other, and it lifts onto a pickup without a crane.

**Uses:** ✓ Gate and entry posts ✓ Watchman duty points ✓ Weighbridge kiosks ✓ Single-person stores

**Stats:** `10×10×8.5 ft · 100 sq ft · ₹1,32,000 + GST · ₹1,320/sq ft`

#### Tab 2 — 20×8 ft
**Title (43c):** `20×8 ft — the narrow-body single-duty cabin`

**Body (553c):**
> The same single-occupancy build stretched to 160 square feet on a slim eight-foot body, made to sit tight against a boundary wall, hoarding or gate structure where depth simply is not available. The occupant gets a desk run along the long wall with the register, keys and monitor within reach from one chair. Slimness is also why contractors choose it: transport needs no escort and no permit, and two or three units can be placed in a row along a site boundary without losing usable ground. Value specification throughout, identical frame and warranty.

**Uses:** ✓ Boundary-line duty rooms ✓ Gate control points ✓ Key and register rooms ✓ Narrow-plot postings

**Stats:** `20×8×8.5 ft · 160 sq ft · ₹2,11,200 + GST · ₹1,320/sq ft`

#### Tab 3 — 20×10 ft
**Title (50c):** `20×10 ft — the smallest room a real team can share`

**Body (549c):**
> Two hundred square feet at the value rate, and the point at which this cabin stops being a duty post and becomes a working room. Two to four people sit with desks along both long walls and still keep a walking route between them. A second window opposite the first lets the room cross-light and cross-ventilate, and a separate socket circuit means a printer or kettle never shares the lighting supply. Most site teams arrive at this size after discovering that a one-person cabin cannot hold their paperwork, a visitor chair and a tea point at once.

**Uses:** ✓ Two to four person site rooms ✓ Compact survey offices ✓ Store plus desk rooms ✓ Shift handover rooms

**Stats:** `20×10×8.5 ft · 200 sq ft · ₹2,40,000 + GST · ₹1,200/sq ft`

#### Tab 4 — 20×12 ft
**Title (43c):** `20×12 ft — two extra feet buy a second zone`

**Body (537c):**
> Two hundred and forty square feet, and the least expensive way in our whole range to give a compact team a genuine second zone. Those two extra feet of width absorb a records wall, a small meeting table or a supervisor corner without lengthening the unit or complicating its transport. Four people work here without anyone shifting a chair to let another pass. Teams that hold a short daily meeting but cannot justify a 30 ft cabin land here more often than on any other compact option, and the ₹36,480 step up buys that corner outright.

**Uses:** ✓ Four-person site rooms ✓ Records and billing corners ✓ Daily meeting spaces ✓ Supervisor plus staff rooms

**Stats:** `20×12×8.5 ft · 240 sq ft · ₹2,76,480 + GST · ₹1,152/sq ft`

### /product/porta-cabins/ms-porta-cabin
**H2 (57c):** `Explore every MS Porta Cabin size and its industrial uses`

**Guidance line (146c):** `Nine sizes in the heavy industrial build — fibre-cement lining, cement board floor, single-leaf industrial door, for cabins that stay in position.`

#### Tab 1 — 10×10 ft
**Title (46c):** `10×10 ft — the heavy-duty compact control room`

**Body (596c):**
> One hundred square feet built to industrial grade rather than office grade: a 1.6 mm corrugated exterior and roof, 8–10 mm fibre-cement lining, a 24 mm cement board floor and a 2–3 mm commercial PVC or epoxy finish that takes boots, trolleys and wash-down without marking. A single-leaf industrial door with a heavy lockset closes it. Plants use this size for panel rooms, dispatch control and QC points where the cabin is bolted into position and stays there. It costs more than an office cabin per square foot because the lining and floor are specified for plant conditions, not for appearance.

**Uses:** ✓ Panel and control rooms ✓ Dispatch control points ✓ QC and sampling rooms ✓ Plant gate offices

**Stats:** `10×10×8.5 ft · 100 sq ft · ₹1,98,000 + GST · ₹1,980/sq ft`

#### Tab 2 — 20×8 ft
**Title (45c):** `20×8 ft — the narrow industrial in-line cabin`

**Body (553c):**
> A 160 square foot industrial cabin on a narrow body, made to fit between plant structures or against a boundary where depth is unavailable. The fibre-cement lining resists heat, moisture and impact far better than a laminated board, which matters when the cabin sits close to running equipment. Three staff work in line with the door set to the safe side on the approved drawing. Its narrow width also keeps it clear of crane paths and vehicle routes inside a working plant, and it moves on a standard trailer without escort when a line is reconfigured.

**Uses:** ✓ Between-structure plant rooms ✓ Boundary-line control points ✓ Line-side supervisor rooms ✓ Narrow-access plant offices

**Stats:** `20×8×8.5 ft · 160 sq ft · ₹3,16,800 + GST · ₹1,980/sq ft`

#### Tab 3 — 20×10 ft
**Title (41c):** `20×10 ft — the industrial reference cabin`

**Body (537c):**
> The industrial build's reference size, and the one plants order most. It seats four to six, and its specification is chosen for a room that takes daily punishment: 1.6 mm sheet outside, fibre-cement inside, 50–75 mm mineral wool in the walls and a cement board floor that will not soften if water stands on it. Compare it against the 20×10 office cabin at ₹1,350 per square foot — the ₹450 difference buys lining and flooring rated for plant conditions, and it is the correct choice wherever the room opens directly onto a working floor.

**Uses:** ✓ Plant supervisor offices ✓ Maintenance crew rooms ✓ Shift offices on the floor ✓ Stores and issue counters

**Stats:** `20×10×8.5 ft · 200 sq ft · ₹3,60,000 + GST · ₹1,800/sq ft`

#### Tab 4 — 20×12 ft
**Title (46c):** `20×12 ft — industrial floor with a second zone`

**Body (587c):**
> Two hundred and forty square feet, wide enough to separate a working area from a records or briefing corner while keeping the whole room to industrial specification. Maintenance teams use the extra width for a bench and tool board along one wall, which a 10 ft width cannot take without blocking movement. Where the partition falls is settled on your approved drawing ahead of fabrication, so the split matches how the shift actually operates. Everything in the room — lining, ceiling, floor and door — remains the heavy build; the extra width does not dilute the specification anywhere.

**Uses:** ✓ Maintenance rooms with benches ✓ Briefing plus work zones ✓ Tool and record rooms ✓ Two-zone plant offices

**Stats:** `20×12×8.5 ft · 240 sq ft · ₹4,14,720 + GST · ₹1,728/sq ft`

#### Tab 5 — 30×10 ft
**Title (40c):** `30×10 ft — the two-room industrial cabin`

**Body (517c):**
> Three hundred square feet on a single trailer, long enough to partition cleanly into a working floor and a separate closed room for six to eight staff. Plants specify this size when a shift office also needs an enclosed space for meetings, testing or a locked store. Each zone is wired on its own lighting circuit, so work in one never depends on the other staying lit or quiet, and the fibre-cement lining and cement board floor continue throughout — the inner room is not downgraded to office finishes to save cost.

**Uses:** ✓ Shift offices with meeting rooms ✓ Testing and sample rooms ✓ Locked store plus office ✓ Contractor plant offices

**Stats:** `30×10×8.5 ft · 300 sq ft · ₹5,18,400 + GST · ₹1,728/sq ft`

#### Tab 6 — 40×8 ft
**Title (44c):** `40×8 ft — the long industrial corridor cabin`

**Body (510c):**
> A 320 sq ft cabin on the eight-foot body, built for plants and linear projects whose facilities run along a wall, a conveyor line or a site boundary. Nine staff can sit end to end, and repeated cabins butt together into a tidy run. Windows fall between working positions so every seat gets daylight without a glare line across the benches. At ₹1,692 per square foot this is the cheapest way to seat a full row of people in the industrial build, and the cabin still lifts and re-sites when a line is rearranged.

**Uses:** ✓ Conveyor-side offices ✓ Linear plant facilities ✓ In-line crew rooms ✓ Boundary-run industrial cabins

**Stats:** `40×8×8.5 ft · 320 sq ft · ₹5,41,440 + GST · ₹1,692/sq ft`

#### Tab 7 — 20×20 ft
**Title (49c):** `20×20 ft — a square floor in the industrial build`

**Body (561c):**
> Four hundred square feet in a square rather than a corridor, which changes how the room can be used: a central table works, desks face each other, and a training or briefing group fits without anyone sitting behind a pillar of desks. It arrives as two joined modules positioned on your prepared base. Plants choose the square over the 40×10 when the room is used for gatherings rather than individual work. The industrial specification runs unchanged across both modules, including the floor joint, which is sealed and finished to the same standard as the rest.

**Uses:** ✓ Training and briefing rooms ✓ Central-table meeting rooms ✓ Large shift offices ✓ Contractor coordination rooms

**Stats:** `20×20×8.5 ft · 400 sq ft · ₹6,76,800 + GST · ₹1,692/sq ft`

#### Tab 8 — 40×10 ft
**Title (41c):** `40×10 ft — the long industrial office run`

**Body (606c):**
> Four hundred square feet in a single long run, the industrial build's answer to a full site office. It divides into three areas — an open working floor, one enclosed room and a lockable store — while still travelling as a single unit onto a single base. Ten to twelve people work here daily. Plants and infrastructure contractors use it as a permanent site headquarters, and the heavy lining and cement board floor mean it survives several projects rather than one. Internal wall positions are agreed at drawing stage, so they land where the work actually needs them rather than where a template puts them.

**Uses:** ✓ Site headquarters ✓ Three-zone plant offices ✓ Long-run crew facilities ✓ Multi-project cabins

**Stats:** `40×10×8.5 ft · 400 sq ft · ₹6,76,800 + GST · ₹1,692/sq ft`

#### Tab 9 — 40×12 ft
**Title (45c):** `40×12 ft — the largest single industrial unit`

**Body (504c):**
> Four hundred and eighty square feet, and the largest cabin we deliver in one piece. It holds a team of twelve to fifteen, and the extra width over the 40×10 lets a corridor run alongside enclosed rooms instead of cutting through them — the difference between a large cabin and a genuine building. Its rate of ₹1,656 is the lowest anywhere on the industrial ladder, so cost per head is the best available. Larger requirements are met by joining units, detailed at quotation stage against your base layout.

**Uses:** ✓ Large plant headquarters ✓ Corridor-plan offices ✓ Multi-room shift facilities ✓ Twelve to fifteen person teams

**Stats:** `40×12×8.5 ft · 480 sq ft · ₹7,94,880 + GST · ₹1,656/sq ft`

### /product/porta-cabins/steel-porta-cabin
**H2 (60c):** `Explore every Steel Porta Cabin size and its relocation uses`

**Guidance line (154c):** `Nine sizes in the heavy relocation build — metal liner, MS floor plate, chequered plate finish, upgraded lifting lugs, for cabins that move between sites.`

#### Tab 1 — 10×10 ft
**Title (46c):** `10×10 ft — the compact cabin built to be moved`

**Body (524c):**
> One hundred square feet specified for a cabin that will be craned on and off a trailer many times over its life. A 0.50 mm pre-painted metal liner replaces board lining so nothing delaminates in transit, the floor is a heavy MS plate finished in 3 mm chequered plate, and the lifting lugs are designed and certified against the completed unit weight rather than added afterwards. Contractors who move a gate office between three sites a year buy this build instead of a lighter cabin and stop replacing it every second move.

**Uses:** ✓ Rotating gate offices ✓ Repeatedly craned cabins ✓ Short-cycle site postings ✓ Hired-out duty cabins

**Stats:** `10×10×8.5 ft · 100 sq ft · ₹1,98,000 + GST · ₹1,980/sq ft`

#### Tab 2 — 20×8 ft
**Title (48c):** `20×8 ft — the narrow cabin for repeat relocation`

**Body (511c):**
> A 160 square foot narrow-bodied unit built for constant movement: metal-lined walls that do not mark when the cabin flexes on a crane, a chequered plate floor that shrugs off loading traffic, and double-leaf MS doors that let a desk and cabinet go in and out without dismantling anything. Its narrow width is what makes repeat moves cheap — the unit travels on a standard trailer with no escort or permit, so relocation costs stay predictable across a rental fleet or a rolling programme of short site postings.

**Uses:** ✓ Rental fleet cabins ✓ Rolling site programmes ✓ Narrow-load relocations ✓ Frequently re-sited offices

**Stats:** `20×8×8.5 ft · 160 sq ft · ₹3,16,800 + GST · ₹1,980/sq ft`

#### Tab 3 — 20×10 ft
**Title (48c):** `20×10 ft — the relocation build's reference size`

**Body (552c):**
> Two hundred square feet and the most-ordered size in the relocation build. Four to six people work in it between moves. Everything vulnerable in transit has been specified out: metal liner instead of board, MS floor plate instead of cement board, chequered plate instead of vinyl, and doors that shut square after the unit has been set down on ground that is not perfectly level. Compare it against the fixed-position industrial cabin at the same rate — identical price, different choices, and the right one depends entirely on whether the cabin moves.

**Uses:** ✓ Rotating site offices ✓ Fleet standard cabins ✓ Multi-project site rooms ✓ Contractor hire units

**Stats:** `20×10×8.5 ft · 200 sq ft · ₹3,60,000 + GST · ₹1,800/sq ft`

#### Tab 4 — 20×12 ft
**Title (45c):** `20×12 ft — extra width that survives the move`

**Body (532c):**
> Two hundred and forty square feet giving a second zone inside a cabin that still relocates cleanly. The wider body is where the relocation build earns its money: a lighter cabin at this width tends to rack slightly on the lift and the internal partition works loose, whereas a welded heavy frame with a plate floor holds its geometry. Contractors who move a two-zone office between sites specify this build after replacing a lighter one. Partition placement is settled at approval stage, and it does not need refitting after a move.

**Uses:** ✓ Two-zone mobile offices ✓ Relocatable meeting corners ✓ Fleet supervisor cabins ✓ Repeat-move site rooms

**Stats:** `20×12×8.5 ft · 240 sq ft · ₹4,14,720 + GST · ₹1,728/sq ft`

#### Tab 5 — 30×10 ft
**Title (42c):** `30×10 ft — the two-room cabin that travels`

**Body (523c):**
> Three hundred square feet partitioned into a working floor and a closed room, built so both survive being lifted. Six to eight people operate from it. Longer units are where lifting design matters most, so the lug positions and the base member layout are engineered to the completed weight and issued as a lifting drawing with the cabin. Handle it only by that drawing. Both zones carry their own lighting circuits and both keep the metal liner and plate floor — nothing is downgraded internally to save weight on the lift.

**Uses:** ✓ Travelling two-room offices ✓ Project-to-project headquarters ✓ Lifting-designed cabins ✓ Rolling contract offices

**Stats:** `30×10×8.5 ft · 300 sq ft · ₹5,18,400 + GST · ₹1,728/sq ft`

#### Tab 6 — 40×8 ft
**Title (45c):** `40×8 ft — the long narrow cabin for site rows`

**Body (513c):**
> Three hundred and twenty square feet on a narrow body, the size infrastructure contractors move most often because road, rail and pipeline work relocates its facilities as the front advances. Seven to nine people sit in line. Repeated units align door-to-door into a row that can be lifted and re-formed at the next chainage without re-planning the layout. The narrow width keeps every move to a standard trailer, which is what makes relocating a row of four cabins a routine cost rather than a project in itself.

**Uses:** ✓ Advancing infrastructure fronts ✓ Pipeline and rail site rows ✓ Repeatable cabin rows ✓ Chainage-following offices

**Stats:** `40×8×8.5 ft · 320 sq ft · ₹5,41,440 + GST · ₹1,692/sq ft`

#### Tab 7 — 20×20 ft
**Title (46c):** `20×20 ft — the square floor in the heavy build`

**Body (579c):**
> Four hundred square feet as a square rather than a corridor, delivered as two joined modules. In the relocation build the joint detail is the whole point: it is engineered to be separated and remade at the next site rather than sealed once, so the room travels as two standard loads and becomes one room again on arrival. Central-table meetings and briefings work here in a way a long narrow cabin cannot support, which is why training-led contractors choose the square. Plate flooring and metal lining continue unbroken across both modules, including over the joint line itself.

**Uses:** ✓ Relocatable briefing rooms ✓ Separable two-module offices ✓ Travelling training rooms ✓ Large mobile site offices

**Stats:** `20×20×8.5 ft · 400 sq ft · ₹6,76,800 + GST · ₹1,692/sq ft`

#### Tab 8 — 40×10 ft
**Title (44c):** `40×10 ft — the long relocatable headquarters`

**Body (510c):**
> Four hundred square feet in one long run, partitioned into an open floor, a closed room and a store, and still designed to be craned as a single unit. Ten to twelve people work here. This is the size that most often outlives the project it was bought for: a lighter 40 ft cabin usually needs repair after its second or third move, whereas the welded heavy frame and plate floor keep this one in service across several sites. Internal zones are set at approval stage and hold their alignment through relocation.

**Uses:** ✓ Multi-project headquarters ✓ Long relocatable offices ✓ Three-zone travelling cabins ✓ Long-life fleet units

**Stats:** `40×10×8.5 ft · 400 sq ft · ₹6,76,800 + GST · ₹1,692/sq ft`

#### Tab 9 — 40×12 ft
**Title (48c):** `40×12 ft — the largest cabin we lift as one unit`

**Body (540c):**
> Four hundred and eighty square feet, the largest single unit we build and the practical limit of what can be craned and transported in one piece. Twelve to fifteen people work in it, with a corridor running past closed rooms rather than through them. At this size the lifting drawing is not a formality: lug positions, base members and the permitted support points are all engineered to the finished weight, and handling outside that drawing is what damages large cabins. At ₹1,656 per square foot it is also the lowest rate on this ladder.

**Uses:** ✓ Largest single-lift cabins ✓ Corridor-plan mobile offices ✓ Fifteen-person site teams ✓ Long-programme headquarters

**Stats:** `40×12×8.5 ft · 480 sq ft · ₹7,94,880 + GST · ₹1,656/sq ft`

## 9 · §H COPY — shop (9) · with-toilet (9) · portacabin-office (9)

### /product/porta-cabins/porta-cabin-shop
**H2 (53c):** `Explore every Porta Cabin Shop size and how it trades`

**Guidance line (108c):** `Nine retail sizes, each planned around a front service counter with staff preparation and storage behind it.`

#### Tab 1 — 10×10 ft
**Title (48c):** `10×10 ft — the compact kiosk that serves a queue`

**Body (567c):**
> Trading from a serving window with a working strip behind it, this is the smallest unit that can retail properly rather than merely store goods. The service glazing carries a lockable counter opening so items pass out without the customer stepping inside, and the HPL panels behind the counter wipe clean at the end of every shift. Ticket booths, recharge points, dairy counters and takeaway windows all operate at this footprint. One person reaches the till, the display and the storage shelf without leaving the window, which is the entire design brief for a kiosk.

**Uses:** ✓ Ticket and token booths ✓ Recharge and bill counters ✓ Dairy and takeaway windows ✓ Single-operator kiosks

**Stats:** `10×10×8.5 ft · 100 sq ft · ₹1,54,000 + GST · ₹1,540/sq ft`

#### Tab 2 — 20×8 ft
**Title (46c):** `20×8 ft — the long counter on a slim footprint`

**Body (575c):**
> The counter runs along the length here rather than across the end, so three or four customers are served side by side instead of forming a single queue. Slim depth suits a footpath frontage, a mall corridor or a boundary line where anything deeper would block circulation. Behind the counter there is room for a preparation strip and shelving, though not for seating. Retailers who serve quickly and move volume choose this shape over a square one precisely for that reason, and the unit still travels on an ordinary trailer without escort, permit or a night movement window.

**Uses:** ✓ Footpath frontage shops ✓ Mall corridor counters ✓ High-volume serving points ✓ Queue-side retail units

**Stats:** `20×8×8.5 ft · 160 sq ft · ₹2,46,400 + GST · ₹1,540/sq ft`

#### Tab 3 — 20×10 ft
**Title (53c):** `20×10 ft — the reference retail cabin, front to store`

**Body (509c):**
> Most retailers settle here: a front trading zone, a preparation area behind it and a lockable store at the rear, all inside one delivered unit. Two or three staff work a shift comfortably. Decorative ceiling and LVT flooring are specified so the interior photographs well and survives daily footfall, which matters when the cabin is a brand's only physical presence. This is the size that reads as a shop rather than a booth, and it is where most first-time retail buyers begin before they know their volumes.

**Uses:** ✓ Standalone retail shops ✓ Franchise outlets ✓ Service centres ✓ Brand experience points

**Stats:** `20×10×8.5 ft · 200 sq ft · ₹2,80,000 + GST · ₹1,400/sq ft`

#### Tab 4 — 20×12 ft
**Title (54c):** `20×12 ft — trading floor plus a customer standing area`

**Body (504c):**
> Extra width here goes to the customer side rather than the staff side. Shoppers stand inside, look at a display and wait out of the weather instead of queuing on the pavement, and that alone shifts conversion in a way no amount of signage manages. The preparation zone behind the counter keeps its depth unchanged. Retailers selling anything that needs handling before purchase — eyewear, phones, garments, bakery goods — take this width over the narrower option almost every time they buy a second unit.

**Uses:** ✓ Browse-before-buy retail ✓ Display-led outlets ✓ Weather-protected queuing ✓ Bakery and garment shops

**Stats:** `20×12×8.5 ft · 240 sq ft · ₹3,22,560 + GST · ₹1,344/sq ft`

#### Tab 5 — 30×10 ft
**Title (46c):** `30×10 ft — shopfront with a real back-of-house`

**Body (537c):**
> Split front and back, this size gives a genuine back-of-house: stock, staff and preparation sit fully behind a door rather than a curtain. That separation is what allows a unit to hold licensed stock, run a two-shift rota or pass a food-handling inspection without improvising. Four to five staff work here. Where the dividing wall falls is fixed against your stock flow at approval, so it matches how goods actually move through the business instead of following a standard template. Staff and customers stop crossing each other's path.

**Uses:** ✓ Licensed retail outlets ✓ Two-shift trading units ✓ Food-service shopfronts ✓ Stock-heavy retail

**Stats:** `30×10×8.5 ft · 300 sq ft · ₹4,03,200 + GST · ₹1,344/sq ft`

#### Tab 6 — 40×8 ft
**Title (46c):** `40×8 ft — the long parade unit for market rows`

**Body (519c):**
> A run of frontage rather than a deep room, built for market rows, station approaches, campus edges and event grounds. Several trades can work along its length behind separate counter openings, or a single operator can run one continuous display. Repeated units butt together into an unbroken parade with no wasted gaps between them. Slim depth keeps every unit on a standard trailer, so a market operator adds or repositions a shop between seasons without arranging special haulage or road permits for an oversize load.

**Uses:** ✓ Market and mela rows ✓ Station approach retail ✓ Campus-edge units ✓ Multi-counter parades

**Stats:** `40×8×8.5 ft · 320 sq ft · ₹4,21,120 + GST · ₹1,316/sq ft`

#### Tab 7 — 20×20 ft
**Title (49c):** `20×20 ft — the square showroom floor for browsing`

**Body (533c):**
> Square, and delivered as two joined modules, this is the first size that works as a showroom instead of a shop. Customers circulate around central displays rather than moving along a counter, and that single change suits furniture, tiles, two-wheelers and anything else people walk around before buying. Staff work from a desk rather than a serving window. Both modules carry identical decorative finishes, and the floor joint is sealed and levelled so the surface reads as one continuous room rather than two cabins pushed together.

**Uses:** ✓ Showrooms and display floors ✓ Furniture and tile retail ✓ Two-wheeler display units ✓ Walk-around retail

**Stats:** `20×20×8.5 ft · 400 sq ft · ₹5,26,400 + GST · ₹1,316/sq ft`

#### Tab 8 — 40×10 ft
**Title (50c):** `40×10 ft — the full-length retail run, three zones`

**Body (533c):**
> One long line divides naturally into three trading zones — service, display and stockroom — while still arriving as a single unit on a single base. Six to eight staff can work it. Operators running a café counter alongside a retail display, or two related trades under one roof, take this length because each zone gets its own frontage without a wall dividing the business in two. Zone widths follow the way your goods move, agreed before manufacture rather than set to a template, so neither trade ends up squeezed behind the other.

**Uses:** ✓ Dual-trade outlets ✓ Café plus retail counters ✓ Three-zone shopfronts ✓ Larger franchise units

**Stats:** `40×10×8.5 ft · 400 sq ft · ₹5,26,400 + GST · ₹1,316/sq ft`

#### Tab 9 — 40×12 ft
**Title (51c):** `40×12 ft — our largest single-unit shop, aisle plan`

**Body (527c):**
> The largest shop we build as a single piece, and the one size where customers, staff and stock each keep a circulation route of their own. The added width lets a customer aisle pass the counter instead of cutting through the serving area, which separates a busy shop from a blocked one. Its ₹1,288 rate is the lowest we quote on any retail ladder. Anything bigger is achieved by joining units, with that junction detailed at quotation against your actual site layout, your frontage line and the way customers approach the shop.

**Uses:** ✓ Large format retail ✓ Aisle-plan shopfronts ✓ Combined retail and service ✓ Eight-plus staff outlets

**Stats:** `40×12×8.5 ft · 480 sq ft · ₹6,18,240 + GST · ₹1,288/sq ft`

### /product/porta-cabins/porta-cabin-with-toilet
**H2 (57c):** `Explore every Porta Cabin with Toilet size and its layout`

**Guidance line (131c):** `Nine sizes, each with a working room and its own sanitary zone in one delivered unit — one base, one connection, no separate block.`

#### Tab 1 — 10×10 ft
**Title (43c):** `10×10 ft — one working room with its own WC`

**Body (543c):**
> One working position and a fully separated WC cubicle behind a partition, inside the smallest footprint we build. The wet zone is lined in 10–12 mm moisture-tolerant fibre-cement over a cement board deck with a waterproof membrane, finished in anti-skid safety vinyl with sealed joints. None of that is optional: a toilet inside a steel cabin fails within two seasons if it is built like a dry room. Guard posts, remote duty points and isolated single-operator sites take this size when sending staff elsewhere for facilities is not practical.

**Uses:** ✓ Remote guard posts ✓ Single-operator duty points ✓ Isolated site postings ✓ Night-shift stations

**Stats:** `10×10×8.5 ft · 100 sq ft · ₹1,65,000 + GST · ₹1,650/sq ft`

#### Tab 2 — 20×8 ft
**Title (49c):** `20×8 ft — working strip with a cubicle at one end`

**Body (572c):**
> Arranged in line, the WC occupies one end behind its own door while the working area takes up the remainder, which keeps the drainage run short because the wet zone never migrates towards the middle of the cabin. Two people work here. A slim body suits a boundary position where anything wider would eat into usable site, and it simplifies connection since every service terminates at a single corner. Frosted ventilators light the cubicle without offering any sightline from outside the unit, and the door is positioned so the working area is never on view when it opens.

**Uses:** ✓ Boundary-line duty rooms ✓ Two-person site posts ✓ Short-drainage-run sites ✓ Perimeter security points

**Stats:** `20×8×8.5 ft · 160 sq ft · ₹2,64,000 + GST · ₹1,650/sq ft`

#### Tab 3 — 20×10 ft
**Title (49c):** `20×10 ft — the self-contained site office with WC`

**Body (517c):**
> The configuration that made this product: a proper office for four to six staff with a WC and washbasin at one end, so nobody leaves the cabin to use facilities. It is the most-ordered layout in the range by a wide margin. Contractors pick it over an office cabin plus a separate toilet block because it needs one base, one drainage connection and one delivery rather than two of each — and because a locked internal facility stays measurably cleaner than a shared external one that every trade on the site can reach.

**Uses:** ✓ Self-contained site offices ✓ Four to six person teams ✓ Single-connection sites ✓ Contractor project offices

**Stats:** `20×10×8.5 ft · 200 sq ft · ₹3,00,000 + GST · ₹1,500/sq ft`

#### Tab 4 — 20×12 ft
**Title (49c):** `20×12 ft — office, WC and a separate washing area`

**Body (512c):**
> Widening by two feet lets the washbasin move out of the cubicle into an area of its own. That sounds like a detail and is not: one person washes while another uses the WC, which removes the shift-change queue that irritates every six-person team sharing a single door. The working room keeps its full width throughout. Sites running staggered shifts, and any operation whose hygiene rules require washing away from the cubicle, should take this width rather than the narrower plan and settle it at drawing stage.

**Uses:** ✓ Staggered-shift teams ✓ Hygiene-regulated sites ✓ Separate wash areas ✓ Six-person site rooms

**Stats:** `20×12×8.5 ft · 240 sq ft · ₹3,45,600 + GST · ₹1,440/sq ft`

#### Tab 5 — 30×10 ft
**Title (49c):** `30×10 ft — two working zones sharing one facility`

**Body (524c):**
> Divided into three parts — an open working area, a closed room and a sanitary zone — so a site office and a meeting or records room share facilities without either interrupting the other. Six to eight staff use it daily. The wet zone stays at one end throughout rather than being split across the unit, keeping membrane and drainage in a single continuous area. That decision, more than any other, determines whether a cabin toilet is still sound in its fifth year or has quietly rotted the floor beneath the partition line.

**Uses:** ✓ Office plus meeting rooms ✓ Six to eight person sites ✓ Shared-facility layouts ✓ Longer project offices

**Stats:** `30×10×8.5 ft · 300 sq ft · ₹4,32,000 + GST · ₹1,440/sq ft`

#### Tab 6 — 40×8 ft
**Title (56c):** `40×8 ft — the long in-line unit with facilities built in`

**Body (515c):**
> A slim line with the sanitary zone closed off at one end and working positions filling the rest, seating seven to nine staff. Linear projects take this shape because it follows a boundary or a corridor naturally, and because a row of these units gives every working group its own facility instead of one shared block stranded at the far end of a long site. That single arrangement removes the most common complaint raised on road, rail and pipeline projects, and it keeps each drainage run short enough to maintain.

**Uses:** ✓ Road and rail site rows ✓ Pipeline corridor offices ✓ Per-group facilities ✓ Long-boundary sites

**Stats:** `40×8×8.5 ft · 320 sq ft · ₹4,51,200 + GST · ₹1,410/sq ft`

#### Tab 7 — 20×20 ft
**Title (48c):** `20×20 ft — the square unit with a service corner`

**Body (529c):**
> The square puts the service corner in one corner rather than at one end, arriving as two joined modules. That corner position keeps drainage short while leaving three sides of the room clear for desks or a central table, which is the layout best suited to a space used for gatherings as well as daily work. Membrane, lining and floor finish in the wet corner are identical to every other size in this range — the specification never softens simply because a room happened to get larger or because the facility is used less often.

**Uses:** ✓ Meeting-capable site rooms ✓ Corner-service layouts ✓ Training rooms with facilities ✓ Larger shift offices

**Stats:** `20×20×8.5 ft · 400 sq ft · ₹5,64,000 + GST · ₹1,410/sq ft`

#### Tab 8 — 40×10 ft
**Title (54c):** `40×10 ft — a site headquarters with its own facilities`

**Body (546c):**
> One long run holds an open working floor, an enclosed room, storage and a sanitary zone in a single delivered unit for ten to twelve staff. This is the configuration that lets a project operate a complete headquarters off one base and one connection, and it is the practical reason most contractors stop hiring separate toilet blocks once they have used it. Internal positions are tied to your drainage run when the drawing is signed off, so the wet zone lands where your services actually are instead of forcing a new connection across the plot.

**Uses:** ✓ Complete site headquarters ✓ Ten to twelve person teams ✓ Single-connection projects ✓ Long-duration site offices

**Stats:** `40×10×8.5 ft · 400 sq ft · ₹5,64,000 + GST · ₹1,410/sq ft`

#### Tab 9 — 40×12 ft
**Title (57c):** `40×12 ft — our largest self-contained cabin, two cubicles`

**Body (542c):**
> Our largest self-contained unit, and the one plan in which a corridor passes both the enclosed rooms and the sanitary zone instead of running through either. Twelve to fifteen staff work in it. That circulation is exactly what stops a large shared cabin becoming unpleasant by mid-morning. Its ₹1,380 rate is the lowest on this ladder. Two-cubicle arrangements become possible at this size and are specified at quotation against your actual headcount and shift pattern, which is the point at which most large teams stop sharing a single door.

**Uses:** ✓ Largest single-unit offices ✓ Corridor-plan layouts ✓ Two-cubicle configurations ✓ Fifteen-person site teams

**Stats:** `40×12×8.5 ft · 480 sq ft · ₹6,62,400 + GST · ₹1,380/sq ft`

### /product/porta-cabins/portacabin-office
**H2 (59c):** `Explore every Portacabin Office size and its working layout`

**Guidance line (136c):** `Nine sizes in the upgraded office build — workstations, storage and an optional manager or meeting partition, finished above site grade.`

#### Tab 1 — 10×10 ft
**Title (54c):** `10×10 ft — the single-desk office that closes its door`

**Body (509c):**
> Fitted as an office rather than a shelter: one workstation, a storage unit, upgraded lining and flooring, and glazing sized to admit real daylight instead of a slot of it. It suits a project manager who needs a door that shuts, a site accountant handling cash and records, or a consultant posted onto a client's premises. Everything above the frame is specified a grade up from the plain cabin, and that is what makes it a room a client can be shown into without apology rather than a store with a desk in it.

**Uses:** ✓ Project manager rooms ✓ Site accounts offices ✓ Consultant postings ✓ Client-facing single offices

**Stats:** `10×10×8.5 ft · 100 sq ft · ₹1,59,500 + GST · ₹1,595/sq ft`

#### Tab 2 — 20×8 ft
**Title (46c):** `20×8 ft — two facing desks along a slim office`

**Body (530c):**
> Two facing workstations with a filing run between them, on a body slim enough for a tight plot or a rooftop position. The upgraded finish matters more at this width than at any other, because a narrow room with basic lining reads as a container while the same room with proper lining and flooring simply reads as small. Storage is planned into the layout before manufacture rather than added afterwards, which is what keeps the walkway between the two desks genuinely usable once the files, printer and equipment have all arrived.

**Uses:** ✓ Two-person project offices ✓ Rooftop office rooms ✓ Tight-plot postings ✓ Paired workstation rooms

**Stats:** `20×8×8.5 ft · 160 sq ft · ₹2,55,200 + GST · ₹1,595/sq ft`

#### Tab 3 — 20×10 ft
**Title (56c):** `20×10 ft — the reference office cabin, four to six desks`

**Body (535c):**
> The most-ordered office configuration we make: four to six workstations, storage along one wall and the option of a partitioned manager's corner. This is the size that answers most searches for a portacabin office, and it sits deliberately between the plain cabin at ₹1,250 and the luxury build at ₹1,850 — office fittings and an upgraded finish, without the gypsum ceilings and feature panelling that a client-reception room needs and a working office simply does not. Most buyers recognise that trade the moment they compare the two.

**Uses:** ✓ Four to six desk offices ✓ Project site offices ✓ Partitioned manager corners ✓ Standard commercial offices

**Stats:** `20×10×8.5 ft · 200 sq ft · ₹2,90,000 + GST · ₹1,450/sq ft`

#### Tab 4 — 20×12 ft
**Title (53c):** `20×12 ft — desks plus a meeting corner that stays put`

**Body (554c):**
> Added width creates a meeting corner that does not cost you a workstation. Four to six people carry on working while a short discussion happens at the table, with nobody moving. Offices hosting visiting consultants, client walk-throughs or weekly reviews take this width and stop borrowing the site canteen for meetings. Power and data points are set to your furniture plan before manufacture, so the table position is properly wired rather than served by a trailing extension lead, and the corner stays a meeting corner instead of drifting into storage.

**Uses:** ✓ Offices with meeting corners ✓ Weekly review rooms ✓ Visiting-consultant offices ✓ Client walk-through spaces

**Stats:** `20×12×8.5 ft · 240 sq ft · ₹3,34,080 + GST · ₹1,392/sq ft`

#### Tab 5 — 30×10 ft
**Title (51c):** `30×10 ft — open office plus a closed manager's room`

**Body (535c):**
> An open working floor plus a fully enclosed manager's or meeting room behind a door, for six to eight staff. That enclosed room changes how the office runs: appraisals, client calls and commercially sensitive conversations stop happening in the corner of a shared space. Each zone carries its own lighting and power circuits. The partition position is agreed from your seating plan ahead of manufacture, so it suits your reporting structure rather than an arbitrary halfway split, and the enclosed room ends up the size the work needs.

**Uses:** ✓ Open plus enclosed offices ✓ Manager and team rooms ✓ Confidential discussion rooms ✓ Eight-person project offices

**Stats:** `30×10×8.5 ft · 300 sq ft · ₹4,17,600 + GST · ₹1,392/sq ft`

#### Tab 6 — 40×8 ft
**Title (46c):** `40×8 ft — the long office run for narrow plots`

**Body (513c):**
> A row of seven to nine workstations with storage set between them, on a slim body that fits a boundary, a rooftop edge or a plot too narrow for a conventional office footprint. Repeated units line up into a coherent office row rather than a scatter of separate cabins. Glazing sits between the working positions so every seat receives daylight without a screen-glare line running the length of the row — a small detail that decides whether staff will actually sit at the far end or quietly crowd towards the door.

**Uses:** ✓ Long-row office layouts ✓ Rooftop office runs ✓ Narrow-plot offices ✓ Seven to nine desk rooms

**Stats:** `40×8×8.5 ft · 320 sq ft · ₹4,36,160 + GST · ₹1,363/sq ft`

#### Tab 7 — 20×20 ft
**Title (55c):** `20×20 ft — the square office floor with clustered desks`

**Body (504c):**
> The square allows a genuine floor plan instead of a corridor of desks: workstation clusters, a meeting table and a reception position coexist without any one of them blocking another. Ten to twelve staff. Delivered as two joined modules, it is the first size at which a portacabin office stops feeling temporary and begins working like a leased floor — which is why companies taking a two or three year site position tend to choose it over anything longer and narrower, even at the same total floor area.

**Uses:** ✓ Clustered workstation floors ✓ Offices with reception ✓ Multi-year site offices ✓ Ten to twelve person teams

**Stats:** `20×20×8.5 ft · 400 sq ft · ₹5,45,200 + GST · ₹1,363/sq ft`

#### Tab 8 — 40×10 ft
**Title (49c):** `40×10 ft — the three-zone office on a single base`

**Body (541c):**
> One long unit divides into an open floor, an enclosed room and a storage or server area, and still lands on a single prepared base. Ten to twelve staff. Companies run it as a full project office for the whole life of a contract, and the upgraded interior is the reason it can be handed over to a client or an auditor without embarrassment. Internal wall positions come from your own seating and equipment plan, settled before manufacture, so the finished layout follows how the team genuinely works rather than a standard three-way division.

**Uses:** ✓ Full project offices ✓ Three-zone layouts ✓ Server and storage zones ✓ Contract-duration offices

**Stats:** `40×10×8.5 ft · 400 sq ft · ₹5,45,200 + GST · ₹1,363/sq ft`

#### Tab 9 — 40×12 ft
**Title (51c):** `40×12 ft — our largest office unit, corridor-served`

**Body (511c):**
> Our biggest office delivered in one piece, and the only size where a corridor serves the enclosed rooms instead of cutting across the working floor. Twelve to fifteen staff. That circulation is what separates a large cabin from an office people are genuinely willing to spend two years inside. Its ₹1,334 rate is the lowest anywhere on this ladder, so cost per desk works out better than in any other office configuration we make, and the plan scales by joining further units rather than by stretching this one.

**Uses:** ✓ Largest single-unit offices ✓ Corridor-served layouts ✓ Fifteen-person teams ✓ Lowest cost per desk

**Stats:** `40×12×8.5 ft · 480 sq ft · ₹6,40,320 + GST · ₹1,334/sq ft`

## 10 · SUPPORTING-KEYWORD SECTION — portacabin-office only

Placement: body, below the specification table. One H3 and one paragraph. Verbatim.

**H3 (44c):** `Porta cabin office or portacabin office?`

**Body (486c):**
> Buyers write it both ways and mean the same thing: a factory-built cabin fitted out as a working office. We build one product for both spellings — the configuration described on this page, with workstations, storage and an optional manager partition, finished a grade above the plain site cabin. If you searched for a porta cabin office and landed here, you are in the right place; the specification, the nine sizes and the prices above are what you were looking for.

---

## 11 · WHAT IS *NOT* IN THIS EVENT

The rewritten `/porta-cabin-cost` guide that absorbs six blog URLs is separate copy and follows in its own drop. Redirect those six now — the destination page already exists and ranks; its rewrite is an improvement, not a prerequisite.

Container Houses, Portable Office and the remaining clusters are unaffected. Their configuration work waits on L17 assignments and, for Container Houses, on images.
