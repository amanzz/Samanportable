# PO-06 Portable Construction Site Cabin - draft v1

URL: `https://www.samanportable.com/product/portable-office/construction-site-cabin` (404 today; new build)  
Cluster: portable-office (PO-00 hub plus nine subpages)  
Approved package: `approved-website-assets-v1`, ruleset 1.0.3, knowledge freeze 22 Aug 2026  
Written: 6 September 2026

---

## 0. SAMAN rulings taken this session

1. **Price basis Rs 1,450/sq ft at 200 sq ft** - the wall ledger, the six GA boards and the 13-page technical PDF. The folder workbook (edited 24 Aug) carries Rs 1,350 and is the outlier; it is not used for price. GA boards therefore need no re-render.
2. **Gallery running order 3 exteriors + 3 interiors**, file order 01-06, as sanctioned for PO-04. The package supplies only three exteriors per size.
3. **Section 2 split card takes `02-long-description-16x9/03-site-cabin-20x10-site-exterior.png`** - a photograph, not a GA board. The Description tab therefore carries five images, not six.
4. **Description images 05 and 06 re-derived as true 16:9** from their approved 1:1 masters. Written to `02-long-description-16x9/_repaired-16x9-v1/`; proof sheet at `_build-inputs/PO-06-16x9-repair-proof-sheet.png`. The pillared originals are not referenced by the asset map.

## 1. Stage 1 - asset audit

**Inventory.** 36 square gallery PNGs at 1254 x 1254 (six per size), six GA boards as SVG + PNG + PDF + preview, six 16:9 long-description PNGs at 1920 x 1080, two technical diagrams as SVG + PNG, one 13-page priced technical PDF, eight contact sheets, an image-SEO CSV, a wall ledger and visibility matrix, four validation reports, SHA256SUMS and the priced workbook.

**GA conformance.** Every exterior and interior was checked against the wall-opening ledger, size by size, from the eight contact sheets, with four exteriors re-checked at full resolution (30x10 slides 01 and 03, 40x10 slide 01, 20x10 slide 01). Every image matches the schedule the visibility matrix declares for it: door and window counts, which wall each opening sits on, roof family per size (20 x 8 ft one-way, the other five centred-ridge) and the staged desk count. **No geometry deviation found.** The package's own `ga-family-validation-report.json` reports PASS on all eight checks and this audit agrees with it.

**Defects found and their resolution.**

| # | Finding | Evidence | Resolution |
|---|---|---|---|
| 1 | Price conflict inside the folder | workbook base Rs 1,350 (mtime 24 Aug 10:57 UTC) vs ledger, six GA boards and technical PDF base Rs 1,450 (22 Aug) | SAMAN ruled Rs 1,450. Recorded above. |
| 2 | `02-long-description-16x9/05` and `/06` are not 16:9 | 1080 x 1080 sharp centre with 420 px blurred pillars each side, measured by column edge-energy | Re-derived as true 16:9 from the approved 1:1 masters; SAMAN approved the proof sheet |
| 3 | Alt text repeats within each size | `construction-site-cabin-image-seo-metadata.csv`: slides 01 and 02 of 10x10 carry identical alt | Claude authored 50 unique alts; the CSV alt column is unused. Alt text is Claude's call under section 8. |
| 4 | `Deep_Technical_Details` rows 47-70 cycle ten differentiators 2.4 times | 24 rows, 10 distinct subjects, generated prose with no figures | Not used as a copy source. Group B is written from the GA boards and the ledger instead. Cosmetic; no ticket raised. |
| 5 | Gallery supplies 3 exteriors, not 4 | file naming and every contact sheet | SAMAN sanctioned 3 + 3 |

**Not cropped, not touched:** no GA board is cropped at any size; gallery squares are 1:1 into a 1:1 slot and are downscaled only.

## 2. Stage 2 - SEO research log

**The page ranks for nothing today and neither does its cluster.** Ahrefs Site Explorer organic keywords for the prefix `samanportable.com/product/portable-office` returns an empty set for India on 5 Sep 2026. The target URL returns 404.

**Where the demand actually is.** `construction site cabin` is 10/mo in India (300 global) and `construction site office cabin` is 10/mo. The commercial volume sits one phrase across:

| Term | India volume | Global | CPC |
|---|---|---|---|
| portable site office | 100 | 450 | $10 |
| site office cabins | 90 | 250 | - |
| site office cabin | 50 | 400 | $20 |
| portable site office cabin | 50 | 100 | $30 |
| construction site office | 50 | 900 | $15 |
| modular prefabricated site office | 50 | - | - |
| prefab site office | 40 | 150 | $20 |
| prefabricated site office | 30 | 100 | $20 |
| construction site office design | 30 | 50 | - |

**Primary term: `site office cabin`.** Highest commercial intent in the set (`portable site office cabin` carries the $30 CPC), and it is the phrase the H1, the first Description H2 and the FAQ block are written around. Secondaries used naturally: portable site office, construction site office, prefab / prefabricated site office, site office cabins, construction site cabin.

**Intent split, and why the first Description section exists.** The India SERP for `site office cabin` is IndiaMART `Office Containers` at #1 with a `Portable Site Office Cabin` sitelink, then DR-0 manufacturer product pages (portableofficecabins.com, nobleinfra.in, comfortcabins.in `office-container`, epackpolymers.com), plus a shopping block. Half the SERP is answering with containers and half with cabins. The first Description section separates the two and hands container intent to the page that owns it.

**People Also Ask on that SERP:** What is office cabin? / What size is a site cabin? / What are porta cabins? / Is Porta cabin a temporary structure? Answered by Description sections 1, 2 and 4 and by FAQs 1 and 2.

**Cannibalisation controls.**

- `site office container` (150/mo) and `container site office` (70/mo) are served by `/product/container-offices/shipping-container-office` at #6 and #5. This page must not compete for them. No size, heading, bullet or alt on this page uses container framing, and the one place the word appears is the disambiguation link out to that page.
- `/product/prefabricated-houses/prefab-site-office` returns 200 today and carries 24 GSC clicks and 1,534 impressions over three months for site-office intent. The approved redirect map already designates it: 301 to this URL once this page is live. **That 301 is SAMAN's call and is the single highest-value action attached to this launch.**
- Sibling boundaries respected: `small-office-cabin` owns 48-240 sq ft compact rooms (this page starts at 100 sq ft and says so), `readymade-office-cabin` owns `office cabin`, `executive-portable-office` owns the client-facing frontage and manager room framing, `portable-weighbridge-office` owns deck-side operation.

**Internal links chosen on Ahrefs evidence.**

- `SAMAN portable office cabin range` -> `/product/portable-office` (section2.p1)
- `the SAMAN site office container` -> `/product/container-offices/shipping-container-office` (description_tab section 1 paragraph 3)
- `small office cabin page` -> `/product/portable-office/small-office-cabin` (description_tab section 4 last paragraph)
- `labour colony` -> `/product/labor-colony` (description_tab section 6 last paragraph)
- `portable toilet` -> `/product/portable-toilet` (description_tab section 6 last paragraph)

Rationale: the hub is the cluster parent and publishes the comparison table; `shipping-container-office` is the strongest container-intent page on the domain (132 traffic, #3 for `container office price`) and takes the intent this page must not hold; `small-office-cabin` takes the sub-100 sq ft query; `labor-colony` (#3 for `labour colony`, 900/mo) and `portable-toilet` are the two adjacent site-setup purchases and are the natural onward step for a buyer already specifying a site compound.

**Follow-up recommendation, not part of this build.** `readymade-office-cabin` (84 organic traffic, #3 for `office cabin` at 2,100/mo) and the hub are the two strongest pages in the cluster. A contextual inbound link from each to this page, once it is live, is the cheapest ranking lever available. It touches other routes, so it needs its own ticket.

## 3. Google policy gates

- **Right to exist: PASS.** Independent demand (nine distinct site-office terms with volume, none owned by a sibling), a materially separate buyer task (specifying a relocatable office for an active building site), a distinct configuration (grilled windows on all six sizes, raised threshold, marked lifting lugs, two-door 30 x 10, partitioned 40 x 10) and original decision value (the desk-count-versus-aisle-width choice, and why the 20 x 8 ft stages fewer desks than the smaller 10 x 10 ft) that would clutter the hub.
- **Doorway: PASS.** Sizes are in-page selectors, not URLs. No city page, no synonym page. This is not the hub with a noun swapped: the openings, desk counts, roof families, colours and prices are its own.
- **Duplicate: PASS.** Self-referencing canonical; one intent; every internal link points at a canonical; the one legacy URL in scope is redirected in one hop to this page, not to the home page.
- **Scaled content: PASS.** Worst-case 8-word shingle uniqueness against the five live siblings and the hub is **99.26%** (vs `prefabricated-office-cabins`; next worst 99.30% vs `portable-weighbridge-office`), measured over product-specific narrative and Groups A, B, C and E with the platform-common Group D excluded. 4,852 shingles over 5,030 words. The 50% floor is cleared by a wide margin.

## 4. Copy, measured

| Slot | Gate | Measured |
|---|---|---|
| Meta title | 55-60 | 57 |
| H1 | 50-60, exactly one | 53 |
| Meta description | 150-160 | 156 |
| Hero short description | 700-800 | 762 |
| Section 2 H2 | 55-70 | 67 |
| Section 2 two paragraphs | 800-900 combined | 883 |
| Split card H3 | 35-65 | 43 |
| Split card paragraphs | 150-220 each | 185, 184 |
| Section 3 H2 | 50-60 | 51 |
| Section 3 intro | 100-140 | 104 |
| Section 3 10x10 H3 / paragraph / bullets | 50-62 / 400-500 / 5-6 | 53 / 495 / 6 |
| Section 3 20x8 H3 / paragraph / bullets | 50-62 / 400-500 / 5-6 | 52 / 465 / 6 |
| Section 3 20x10 H3 / paragraph / bullets | 50-62 / 400-500 / 5-6 | 54 / 459 / 6 |
| Section 3 20x12 H3 / paragraph / bullets | 50-62 / 400-500 / 5-6 | 51 / 455 / 6 |
| Section 3 30x10 H3 / paragraph / bullets | 50-62 / 400-500 / 5-6 | 53 / 471 / 6 |
| Section 3 40x10 H3 / paragraph / bullets | 50-62 / 400-500 / 5-6 | 54 / 481 / 6 |
| You may also like intro | under 90 | 47 |
| Description tab prose | 2,000-3,000 words | 2096 |
| Description tab H2s | 40-60 each | 53-56 across 7 |
| Description tab bullet blocks | exactly 1 | 1 |
| Description tab tables | 0 or 1 | 1 |
| Description tab images | 6, reduced to 5 by SAMAN ruling | 5 |
| FAQs | 6-8, answers 100-300 | 8, answers 135-202 |
| Specifications narrative | 2 or 3 paragraphs | 3 |
| Specification groups | A-E | 5 |
| Alt text | unique, every slot | 50 slots, 50 unique |

## 5. Block-by-block copy

### Block 1-4. Hero, contact bar, size tabs, price

**Meta title:** Site Office Cabin for Construction Sites, 6 Sizes | SAMAN  
**H1:** Portable Construction Site Cabin: Six Site-Duty Sizes  
**Meta description:** Site office cabin for construction sites in six sizes, 100 to 400 sq ft, from Rs 1,66,750 ex-GST. Grilled windows, marked lifting lugs, GA drawing per size.

**Hero short description**

A portable construction site cabin is the site office that stands inside the hoarding line, not in a business park. SAMAN builds it as one welded steel module in six approved sizes from 10 × 10 ft to 40 × 10 ft, 100 to 400 sq ft, published from Rs 1,66,750 ex-GST. Every size carries grilled sliding windows, an outward-opening steel door on the front wall and lifting lugs marked on the shell so the crane picks the unit up the same way on every move. The 30 × 10 ft plan puts a door at each end of the front wall so nobody walks past the drawing table to reach a desk. The 40 × 10 ft arrives with a 10 × 10 ft manager room already partitioned. Choose by the wall-opening schedule and the staged desk count, both fixed on the GA drawing for the size you select.

**Size selector, prices and FEATURE_CELLS** (default selected size: 20 x 10 ft)

| Size | Area | Rate/sq ft | Ex-GST | Incl. 18% GST | Roof | Openings | Desks staged | Application |
|---|---|---|---|---|---|---|---|---|
| 10 × 10 × 8.5 ft | 100 sq ft | Rs 1,667.50 | Rs 1,66,750 | Rs 1,96,765 | Centred-ridge two-way slope | 1 door, 3 windows | 4 | Gate or batching-plant engineer's room |
| 20 × 8 × 8.5 ft | 160 sq ft | Rs 1,595.00 | Rs 2,55,200 | Rs 3,01,136 | One-way slope | 1 door, 6 windows | 3 | Narrow access inside the hoarding line |
| 20 × 10 × 8.5 ft | 200 sq ft | Rs 1,450.00 | Rs 2,90,000 | Rs 3,42,200 | Centred-ridge two-way slope | 1 door, 6 windows | 5 | Main contractor's standard site office |
| 20 × 12 × 8.5 ft | 240 sq ft | Rs 1,392.00 | Rs 3,34,080 | Rs 3,94,214 | Centred-ridge two-way slope | 1 door, 6 windows | 5 | Site office with a drawing-table aisle |
| 30 × 10 × 8.5 ft | 300 sq ft | Rs 1,392.00 | Rs 4,17,600 | Rs 4,92,768 | Centred-ridge two-way slope | 2 doors, 8 windows | 8 | Two-door site office for a full team |
| 40 × 10 × 8.5 ft | 400 sq ft | Rs 1,377.50 | Rs 5,51,000 | Rs 6,50,180 | Centred-ridge two-way slope | 2 doors plus 1 internal, 10 windows | 12 plus manager room | Site office with a partitioned manager room |

Gallery: six slides per size, three exteriors then three interiors, file order 01-06.

### Block 5. Explore the Range

Derived, hub first, current page excluded, 200s only at build time:

1. Portable Office Cabin - `/product/portable-office`
2. Readymade Office Cabin - `/product/portable-office/readymade-office-cabin`
3. Prefabricated Office Cabins - `/product/portable-office/prefabricated-office-cabins`
4. Portable Weighbridge Office - `/product/portable-office/portable-weighbridge-office`
5. Executive Portable Office - `/product/portable-office/executive-portable-office`
6. Small Office Cabin - `/product/portable-office/small-office-cabin`
7. Portable Mobile Laboratory - `/product/portable-office/portable-mobile-laboratory`
8. Portable Control Room - `/product/portable-office/portable-control-room`
9. Portable Conference Cabin - `/product/portable-office/portable-conference-cabin`

Never render: `/product/portable-office/modern-office-cabin`, `/product/portable-office/portable-office-container`.

### Block 6. Section 2 (RightToExist) and its split card

**H2:** Why a construction site needs a site-duty cabin, not a spare office

An office cabin that has only ever stood on a paved yard meets a building site badly. The threshold takes boot mud and tool traffic, the windows sit where a scaffold pipe or a stack of shuttering will lean, and nobody marked where the crane may lift it. This page is the site-duty build of the SAMAN portable office cabin range: the same welded steel module, specified around the mud-facing doorstep, the protected grill panel, the tool-traffic deck and the marked lifting lug.

Six approved sizes cover a whole project, from a 100 sq ft engineer's room at the gate to a 400 sq ft office with a partitioned manager room. Each is drawing-controlled: the wall-opening schedule, the staged desk count and the roof family are fixed on the GA drawing before production, so the room approved on paper is the room craned in. Prices are published ex-GST, with 18 per cent GST shown separately.

Contextual link: `SAMAN portable office cabin range` -> `/product/portable-office`, inside paragraph 1.  
CTA: Compare the six site cabin sizes

**Split card** - 16:9 image LEFT: `02-long-description-16x9/03-site-cabin-20x10-site-exterior.png`

**H3:** The 20 × 10 ft is the reference site office

At 200 sq ft the 20 × 10 ft stages five desks, two along the front wall and three along the rear, with a clear aisle between the runs and a 4 ft sliding window over every desk position.

It is the size most main contractors order first: it holds the site engineer, the planner and the document controller in one room while the drawing table still keeps a wall of its own.

CTA: See the 20 × 10 ft plan

### Block 8. Section 3 (SizeApplicationsExplorer)

**H2:** The six approved site cabin sizes, 100 to 400 sq ft  
**Intro:** Sizes run in folder order. Each carries its own GA drawing, wall-opening schedule and staged desk count.  
Size headings render as **H3** (project instructions section 11, 6 Sep 2026). GA board on the LEFT, text on the right.

#### 10 × 10 ft Site Cabin: 100 sq ft Engineer's Gate Room

The smallest approved site cabin is a square 100 sq ft room with the door centred on the front wall and a 4 ft window on each of the other three walls, so daylight arrives from three sides and no desk faces a blank sheet. Four desk positions are staged around the perimeter, two on the rear wall and one on each side wall, leaving the centre of the floor clear for a visitor to stand at a drawing spread on the desk. It goes in at the gate, at the batching plant, or beside a single tower crane.

- 100 sq ft, 10 × 10 × 8.5 ft, centred-ridge two-way roof
- One 3 ft outward-opening door, centred on the front wall
- Three 4 ft sliding windows, one each on the rear, left and right walls
- 4 staged desks: 2 on the rear wall, 1 on each side wall
- Deep Oxford Blue shell with a Warm Ivory interior lining
- Rs 1,66,750 ex-GST, Rs 1,96,765 with 18 per cent GST

#### 20 × 8 ft Site Cabin: 160 sq ft Narrow-Access Office

An 8 ft width is what fits when the hoarding line, a service trench or a boundary wall leaves no room to swing a 10 ft module into place. The 20 × 8 ft answers that with the only one-way sloping roof in the range, so run-off leaves on a single side and there is no ridge to clear under a low crane pass. Three desks sit in one run along the rear wall and the door lands in the middle of the front wall, between two windows, keeping the whole aisle on the door side.

- 160 sq ft, 20 × 8 × 8.5 ft, one-way sloping roof
- Only size in the range without a centred ridge
- Six 4 ft windows: two front, two rear, one on each 8 ft end wall
- 3 staged desks in a single run on the rear wall
- Graphite Charcoal shell with a Champagne Cream interior lining
- Rs 2,55,200 ex-GST, Rs 3,01,136 with 18 per cent GST

#### 20 × 10 ft Site Cabin: 200 sq ft Five-Desk Site Office

This is the reference size and the one the price rule is built around, at Rs 1,450 per sq ft before any band adjustment. Two hundred square feet stages five desks in two runs, two on the front wall and three on the rear, with a clear aisle down the middle wide enough to pass a rolled drawing without turning sideways. Six 4 ft windows put daylight over every desk position and one on each end wall, and the single door sits centrally on the 20 ft front wall.

- 200 sq ft, 20 × 10 × 8.5 ft, centred-ridge two-way roof
- Reference size: Rs 1,450 per sq ft with no band adjustment
- One 3 ft door centred on the 20 ft front wall, between two windows
- 5 staged desks: 2 on the front wall, 3 on the rear
- Deep Bottle Green shell with a Light Greige interior lining
- Rs 2,90,000 ex-GST, Rs 3,42,200 with 18 per cent GST

#### 20 × 12 ft Site Cabin: 240 sq ft Drawing-Table Room

Same 20 ft length, same five desks, two more feet of width. Those two feet are what a drawing table needs: at 12 ft the aisle between the desk runs still takes a full-size sheet laid flat with people standing on both sides of it. The end walls grow to 12 ft and each carries a 4 ft window centred in the wall rather than pushed to one side. Contractors who hold their weekly progress meeting in the site office order this width rather than the 20 × 10 ft.

- 240 sq ft, 20 × 12 × 8.5 ft, centred-ridge two-way roof
- Widest 20 ft plan; two extra feet of aisle over the 20 × 10 ft
- 4 ft window centred on each 12 ft end wall
- 5 staged desks in the same two-run layout as the 20 × 10 ft
- Burgundy Wine shell with a Porcelain Sage interior lining
- Rs 3,34,080 ex-GST, Rs 3,94,214 with 18 per cent GST

#### 30 × 10 ft Site Cabin: 300 sq ft Two-Door Site Office

The 30 × 10 ft is the first plan with two external doors, one near each end of the 30 ft front wall, and that is the whole point of it. Eight desks are staged in this room, three on the front wall and five on the rear, and with a single door the far desks would only be reachable by walking the length of the aisle past everyone else. Two doors split the traffic and give the room a second way out. Eight 4 ft windows carry the daylight, four of them along the rear wall.

- 300 sq ft, 30 × 10 × 8.5 ft, centred-ridge two-way roof
- Two 3 ft external doors, near each end of the 30 ft front wall
- Eight 4 ft windows: two front, four rear, one on each end wall
- 8 staged desks: 3 on the front wall, 5 on the rear
- Slate Blue-Grey shell with a Pale Sand interior lining
- Rs 4,17,600 ex-GST, Rs 4,92,768 with 18 per cent GST

#### 40 × 10 ft Site Cabin: 400 sq ft Manager and Team Plan

The largest approved size is the only one that arrives partitioned. A full-height partition 10 ft in from one end wall creates a 10 × 10 ft manager room with its own window and its own 3 ft internal door, and leaves a 30 × 10 ft common office staging twelve desks. Two external doors on the 40 ft front wall serve the common office at both ends. Ten windows are scheduled across the four walls, one of them belonging to the manager room and reached only through the partition door.

- 400 sq ft, 40 × 10 × 8.5 ft, centred-ridge two-way roof
- Only size delivered with a partition already built in
- 10 × 10 ft manager room with one window and a 3 ft internal door
- 12 staged desks in the common office: 5 front, 7 rear
- Two 3 ft external doors on the 40 ft front wall; ten windows in all
- Rs 5,51,000 ex-GST, Rs 6,50,180 with 18 per cent GST

### Block 10. You may also like

Intro: Other cabins in the SAMAN portable office range. Portable Office cluster only; render 200s only.

### Block 11. Product Details

#### Description tab

##### Site office cabin or site office container? Start here

Two different products answer the phrase site office, and buyers land on both with the same question. One is a steel-framed cabin built from scratch on a welded chassis, delivered in the size the drawing says and in a colour chosen for the job. The other is a used ISO shipping container cut and lined into an office, fixed at container dimensions because that is what the box already is. This page is the first of those.

The difference matters on a construction site more than anywhere else. A cabin is built to a wall-opening schedule, so the door lands where the site access is and the windows land over the desks rather than wherever the container corrugation allowed. Widths are not tied to 8 ft: this range runs 8, 10 and 12 ft wide, and the 12 ft width exists specifically so a drawing table has an aisle. A cabin is also lighter for its floor area, which matters when the only crane free to place it is the one already erecting the structure.

If the container form is what you actually want, whether for the stack strength, the lock-up security or the look, that is a separate approved product and it has its own page: the SAMAN site office container. Nothing on this page is a container conversion, and no size here is derived from a shipping container.

`[IMAGE desc_01]` `description/construction-site-cabin-10x10-on-site-exterior.webp` - alt: 10 × 10 ft construction site cabin inside the hoarding line of an active project, structure rising behind

##### Who works in a site cabin, and where it actually stands

The people this cabin is specified for are the ones whose day is spent between the room and the works: the site engineer, the project or contracts manager, the planner, the safety officer, the store or document controller, and the labour supervisor who comes in with muddy boots and leaves again in four minutes. None of them treat the room as an office in the ordinary sense. The door opens perhaps two hundred times a day, drawings are laid flat rather than filed, and half the furniture is only there because something has to hold the site register.

Where it stands is just as particular. A site cabin sits inside the hoarding line on ground that was a field or a demolition slab a month ago, usually on a temporary plinth or on packed rubble rather than a foundation. It is close enough to the works to see them and far enough back to be outside the crane drop zone, which means it will be moved at least once as the structure comes out of the ground and the site layout changes. Access is a haul road, not a service yard: the delivery trailer needs turning room and the crane needs a marked pick-up point on the shell.

Because the unit moves, everything about it is specified for repeat lifting rather than for one placement. That is the single largest difference between this build and a cabin that will spend its whole life on a paved compound, and it is why the lifting lug positions are painted onto the shell rather than left for the rigger to work out.

##### What site duty changes about the shell and the openings

The shell is the same welded steel platform SAMAN uses across the cabin families: a 100 × 50 × 3 mm MS C-channel base chassis, 50 × 50 mm hollow-section top and wall framing with reinforced openings, 1.2 mm corrugated MS external walls and a 1.4 mm corrugated MS roof with sealed laps and flashings. Walls are 100 mm thick. Inside, 8 mm prelaminated MDF lining with aluminium joint sections runs to an 18 mm cement-fibre floor board finished in 1.3 mm vinyl. Roof insulation is 50 mm glass wool at 42 kg per cubic metre; walls take 25 mm glass wool or the documented 12 mm Heatlon option.

What site duty changes is where things sit and how they are protected. Every window in the range is a 4 ft two-track aluminium sliding unit with 4 mm glass, and every one of them carries a fixed protective grill on the outside. That grill is not a security afterthought; it is what stops a length of pipe or a bundle of shuttering ply leaning against the glass. The door is a single outward-opening MS-framed leaf, roughly 7 × 3 ft, set in the front wall and raised clear of the mud line so the threshold sheds boot dirt outward instead of collecting it.

Electrical work is concealed copper wiring on typical 1.5, 2.5 and 4 sq mm circuits with a distribution board carrying isolation, MCB and RCCB protection plus earthing, segregated between lighting, sockets and the air-conditioning provision. The provision is a point and a circuit; the unit itself is quoted separately. Corrosion protection is prepared MS with red-oxide primer and two enamel coats, and each of the six sizes ships in its own approved exterior colour so a fleet on one site can be told apart at a distance.

`[IMAGE desc_02]` `description/construction-site-cabin-20x8-interior-desk-run.webp` - alt: Interior of a 20 × 8 ft site office cabin, three desks in one run under the rear windows

##### Choosing between 100, 160, 200, 240, 300 and 400 sq ft

Size on a construction site is decided by two numbers that have nothing to do with floor area: how many people need a desk of their own, and how wide the aisle has to be for the biggest drawing that gets opened in the room. Work those two out and the size chooses itself, because the desk count is staged on the GA drawing rather than left to the buyer.

*Approved sizes, staged desks and published prices*

| Size | Area | Staged desks | External doors | Windows | Price ex-GST | Price incl. 18% GST |
|---|---|---|---|---|---|---|
| 10 × 10 × 8.5 ft | 100 sq ft | 4 | 1 | 3 | Rs 1,66,750 | Rs 1,96,765 |
| 20 × 8 × 8.5 ft | 160 sq ft | 3 | 1 | 6 | Rs 2,55,200 | Rs 3,01,136 |
| 20 × 10 × 8.5 ft | 200 sq ft | 5 | 1 | 6 | Rs 2,90,000 | Rs 3,42,200 |
| 20 × 12 × 8.5 ft | 240 sq ft | 5 | 1 | 6 | Rs 3,34,080 | Rs 3,94,214 |
| 30 × 10 × 8.5 ft | 300 sq ft | 8 | 2 | 8 | Rs 4,17,600 | Rs 4,92,768 |
| 40 × 10 × 8.5 ft | 400 sq ft | 12 plus manager room | 2 | 10 | Rs 5,51,000 | Rs 6,50,180 |

Read the table by the desk column first. The 20 × 8 ft stages fewer desks than the smaller 10 × 10 ft, which looks wrong until you see why: at 8 ft wide only one desk run fits, so its three desks sit in a single line on the rear wall, while the square 10 × 10 ft puts four desks around three walls. The 20 × 8 ft is not bought for capacity, it is bought because a 10 ft module will not physically go where it has to go.

The step from 20 × 10 ft to 20 × 12 ft buys no extra desks at all. Both stage five. The two feet buy aisle, and the buyers who pay for them are the ones who hold the weekly progress meeting standing around a drawing in the site office rather than in a separate meeting room. If your drawings live rolled up in a tube, the 20 × 10 ft is the better value; if they live open on a table, the 20 × 12 ft is the size to order.

`[IMAGE desc_03]` `description/construction-site-cabin-20x12-interior-wide-aisle.webp` - alt: Interior of a 20 × 12 ft site cabin, five desks and the wider central aisle on the 12 ft width

Below 100 sq ft this page stops. A gate room, a single-supervisor cabin or a security post at 48 to 80 sq ft is a different product and is priced on the small office cabin page. Above 400 sq ft the price rule continues in published bands to 900 sq ft, and beyond that the size is quoted manually rather than listed.

##### The two-door 30 × 10 and the partitioned 40 × 10 plan

The two largest sizes are the only ones that change the plan rather than just the dimensions, and both changes exist for the same reason: at eight desks and above, a single door stops working.

On the 30 × 10 ft, eight desks are staged three along the front wall and five along the rear. With one central door, anyone reaching the far end walks the full length of the aisle past six colleagues, and the room has one way out. The approved plan puts a 3 ft door near each end of the 30 ft front wall instead, which splits the traffic, lets the far desks be reached directly, and means the drawing table can be placed mid-wall without becoming a corridor. Four of its eight windows run along the rear wall, one over each pair of desks.

`[IMAGE desc_04]` `description/construction-site-cabin-30x10-interior-eight-desks.webp` - alt: Interior of a 30 × 10 ft site cabin, eight desks staged in two runs along the long walls

The 40 × 10 ft is the only size in the range delivered with a partition already built. A full-height partition 10 ft in from one end wall creates a 10 × 10 ft manager room with its own 4 ft window and its own 3 ft internal door, opening off the common office. What is left is a 30 × 10 ft open office staging twelve desks, five on the front wall and seven on the rear, served by two external doors on the 40 ft front wall. Ten windows are scheduled in total, one of which belongs to the manager room.

That partition is worth ordering rather than adding later for one practical reason: a site manager takes calls and holds conversations that the room should not hear, and a partition built into the module on the shop floor is straight, lined on both faces and finished to the same standard as the shell. A partition put in on site after delivery is a carpentry job on a floor that is already in use.

`[IMAGE desc_05]` `description/construction-site-cabin-40x10-manager-room.webp` - alt: The partitioned 10 × 10 ft manager room in the 40 × 10 ft site cabin, window, desk and internal door

##### What the published price covers and what is quoted apart

Every price on this page is the finished cabin shell as described: chassis, framing, external envelope, roof, insulation, internal lining, floor, the scheduled doors and windows with their grills, the internal electrical installation with its distribution board, the paint system, and the lifting provision. It is quoted ex-GST, with 18 per cent GST shown separately against every size, and it is the same price whether the unit goes to a metro site or a district town.

What is not in it is everything that is site-specific, because pricing it blind would either overcharge the buyer or under-specify the job:

- Furniture, including the desks the layout is staged for
- Air conditioning units; the page price includes the point and circuit only
- Telecom, data cabling and any networking equipment
- Generators, incoming supply, and connection to the site distribution board
- Foundation, plinth, levelling and rough-ground packing
- Access stairs, landings and handrails
- Water, drainage and any sanitary fit-out

Freight is published separately by trailer size and distance band on the shipping tab, with delivery free within Bangalore city and across Delhi NCR including Ghaziabad, Gurugram, Faridabad, Noida and Greater Noida. Crane hire at the receiving end is arranged by the site, since the crane that lands the cabin is almost always one already on hire to the project.

Two things commonly bought alongside a site cabin sit on their own pages rather than being folded into this one. Workforce accommodation is priced as a labour colony, and standalone sanitation is priced as a portable toilet. Ordering them together is normal; pricing them together is not, because the quantities never scale the same way.

##### Common questions about construction site office cabins

**What size site office cabin do I need on a construction site?**

Count the people who need a desk of their own. Four fits the 100 sq ft 10 × 10 ft, five the 200 sq ft 20 × 10 ft, eight the 300 sq ft 30 × 10 ft, and twelve plus a manager room the 400 sq ft 40 × 10 ft.

**Is a portable site cabin a temporary structure?**

It is a relocatable one. The cabin is a welded steel module built to be lifted and moved repeatedly, with marked lifting points, rather than a permanent building fixed to a foundation.

**Are the prices on this page inclusive of GST?**

No. Every price is published ex-GST, and the figure including 18 per cent GST is shown alongside it for each of the six approved sizes.

**Does the price include delivery to the site?**

No. Freight is charged by trailer size and distance band and is published on the shipping tab. Delivery is free within Bangalore city and across Delhi NCR.

**Can the door and window positions be changed?**

The positions on this page are the approved schedule and are fixed on the GA drawing for each size. Any change is a drawing revision and is priced through a quotation, not selected on the page.

**Why do the windows have grills on the outside?**

The grill protects the glass from what leans against a site cabin: scaffold tube, shuttering ply and reinforcement. Every window in all six sizes carries one as standard.

**Is air conditioning included in the cabin price?**

No. The price covers the electrical point and circuit provision for an air conditioner. The unit itself, and its installation, are quoted separately.

**How is the cabin lifted and placed on site?**

By crane, using the lifting lugs designed into the chassis and marked on the shell. The site provides the crane and a level, compacted bearing or temporary plinth for it to sit on.

#### Specifications tab

Three things on this page decide which size a site buys, and none of them is the floor area. The first is the wall-opening schedule: how many doors, where they land on which wall, and how many 4 ft windows the size carries. The second is the staged desk count, which is fixed on the GA drawing and is why the 20 × 8 ft stages fewer desks than the smaller 10 × 10 ft. The third is the roof family, because the 20 × 8 ft is the only size in this range with a one-way slope instead of a centred ridge.

Everything in Group D is common to the SAMAN cabin platform and is the same on a site cabin as on any other cabin-family product: the chassis section, the sheet gauges, the lining and floor build-up, the insulation and the paint system. Nothing in Group D is specified for construction sites in particular. Groups B, C and E are the ones that are: the protected grill on every window, the raised threshold, the marked lifting points, the per-size opening schedule and the scope boundary.

Prices in Group A are the finished shell ex-GST on the approved band rule, with the 18 per cent GST figure shown alongside. They follow the folder's published band table from a reference rate of Rs 1,450 per sq ft at 200 sq ft, adjusted upward for smaller areas and downward for larger ones. Structural adequacy for a given placement, the final load schedule and the lifting design follow the approved shop drawings and the completed unit weight, not this page.

##### Group A. Approved sizes and published prices

| Size | Area | Rate per sq ft | Price ex-GST | Price incl. 18% GST |
|---|---|---|---|---|
| 10 × 10 × 8.5 ft | 100 sq ft | Rs 1,667.5 | Rs 1,66,750 | Rs 1,96,765 |
| 20 × 8 × 8.5 ft | 160 sq ft | Rs 1,595 | Rs 2,55,200 | Rs 3,01,136 |
| 20 × 10 × 8.5 ft | 200 sq ft | Rs 1,450 | Rs 2,90,000 | Rs 3,42,200 |
| 20 × 12 × 8.5 ft | 240 sq ft | Rs 1,392 | Rs 3,34,080 | Rs 3,94,214 |
| 30 × 10 × 8.5 ft | 300 sq ft | Rs 1,392 | Rs 4,17,600 | Rs 4,92,768 |
| 40 × 10 × 8.5 ft | 400 sq ft | Rs 1,377.5 | Rs 5,51,000 | Rs 6,50,180 |

*Prices are the finished cabin shell ex-GST on the approved band rule from a reference rate of Rs 1,450 per sq ft at 200 sq ft. Freight, crane and the Group E exclusions are additional.*

##### Group B. Site-duty build

| Item | Approved standard | Note |
|---|---|---|
| Roof family, 20 × 8 ft | One-way sloping corrugated MS roof | Run-off leaves on one side; no ridge to clear |
| Roof family, all other sizes | Centred-ridge two-way sloping corrugated MS roof | Non-ISO profile; not a container roof |
| Nominal height | 8.5 ft | Same on all six approved sizes |
| Wall thickness | 100 mm | Framed wall build-up, not a container wall |
| Window protection | Fixed external grill on every window | Standard on all six sizes; guards glass against leaning material |
| Door threshold | Raised clear of the mud line, outward-opening leaf | Sheds boot dirt and tool traffic outward |
| Lifting provision | Designed lifting lugs, positions marked on the shell | Repeat crane moves; final lifting design follows unit weight |
| Bearing | Level compacted bearing or temporary plinth | Packing and levelling are a site scope, not supplied |
| Exterior colour | One approved colour per size | 10 × 10 Deep Oxford Blue, 20 × 8 Graphite Charcoal, 20 × 10 Deep Bottle Green, 20 × 12 Burgundy Wine, 30 × 10 Slate Blue-Grey, 40 × 10 Muted Teal |
| Interior lining colour | One approved colour per size | 10 × 10 Warm Ivory, 20 × 8 Champagne Cream, 20 × 10 Light Greige, 20 × 12 Porcelain Sage, 30 × 10 Pale Sand, 40 × 10 Soft Clay Greige |

*Group B is specific to the Portable Construction Site Cabin. Roof family and colour are fixed per size on the GA drawing.*

##### Group C. Wall-opening schedule and staged layout by size

| Size | Wall | Openings (position measured along the wall) | Staged desks |
|---|---|---|---|
| 10 × 10 × 8.5 ft | Wall A (front, 10 ft) | 1 door, 3 ft wide, centred at 3.5-6.5 ft | 0 desks |
| 10 × 10 × 8.5 ft | Wall B (rear, 10 ft) | 1 window, 4 ft, at 3-7 ft | 2 desks |
| 10 × 10 × 8.5 ft | Wall C (left, 10 ft) | 1 window, 4 ft, at 3-7 ft | 1 desk |
| 10 × 10 × 8.5 ft | Wall D (right, 10 ft) | 1 window, 4 ft, at 3-7 ft | 1 desk |
| 20 × 8 × 8.5 ft | Wall A (front, 20 ft) | Window 1.5-5.5 ft, door 8.5-11.5 ft, window 14.5-18.5 ft | 0 desks |
| 20 × 8 × 8.5 ft | Wall B (rear, 20 ft) | Windows at 1.5-5.5 ft and 14.5-18.5 ft | 3 desks |
| 20 × 8 × 8.5 ft | Walls C and D (8 ft ends) | 1 window each, 4 ft, at 2-6 ft | 0 desks |
| 20 × 10 × 8.5 ft | Wall A (front, 20 ft) | Window 1.5-5.5 ft, door 8.5-11.5 ft, window 14.5-18.5 ft | 2 desks |
| 20 × 10 × 8.5 ft | Wall B (rear, 20 ft) | Windows at 1.5-5.5 ft and 14.5-18.5 ft | 3 desks |
| 20 × 10 × 8.5 ft | Walls C and D (10 ft ends) | 1 window each, 4 ft, at 3-7 ft | 0 desks |
| 20 × 12 × 8.5 ft | Wall A (front, 20 ft) | Window 1.5-5.5 ft, door 8.5-11.5 ft, window 14.5-18.5 ft | 2 desks |
| 20 × 12 × 8.5 ft | Wall B (rear, 20 ft) | Windows at 1.5-5.5 ft and 14.5-18.5 ft | 3 desks |
| 20 × 12 × 8.5 ft | Walls C and D (12 ft ends) | 1 window each, 4 ft, centred at 4-8 ft | 0 desks |
| 30 × 10 × 8.5 ft | Wall A (front, 30 ft) | Door 1.5-4.5 ft, window 8-12 ft, window 18-22 ft, door 25.5-28.5 ft | 3 desks |
| 30 × 10 × 8.5 ft | Wall B (rear, 30 ft) | Windows at 1.5-5.5, 8.5-12.5, 17.5-21.5 and 24.5-28.5 ft | 5 desks |
| 30 × 10 × 8.5 ft | Walls C and D (10 ft ends) | 1 window each, 4 ft, at 3-7 ft | 0 desks |
| 40 × 10 × 8.5 ft | Wall A (front, 40 ft) | Window 3-7 ft, door 11.5-14.5 ft, window 18-22 ft, window 28-32 ft, door 35.5-38.5 ft | 5 desks |
| 40 × 10 × 8.5 ft | Wall B (rear, 40 ft) | Windows at 3-7, 11.5-15.5, 18.5-22.5, 27.5-31.5 and 34.5-38.5 ft | 7 desks |
| 40 × 10 × 8.5 ft | Wall C (manager end, 10 ft) | 1 window, 4 ft, at 3-7 ft | 0 desks |
| 40 × 10 × 8.5 ft | Wall D (common office end, 10 ft) | 1 window, 4 ft, at 3-7 ft | 0 desks |
| 40 × 10 × 8.5 ft | Partition, 10 ft from End C | 1 internal door, 3 ft, at 0.5-3.5 ft | Divides the 10 × 10 ft manager room from the 30 × 10 ft common office |

*Wall A is the designated front wall on every size. Opening positions are measured along the wall from the left-hand corner and are fixed on the GA drawing before production.*

##### Group D. Platform-common material key

| Component / system | Approved standard | Typical size / thickness |
|---|---|---|
| Primary base frame | Welded MS C-channel chassis | 100 × 50 × 3 mm |
| Upper, wall and roof frame | MS SHS / angle framing with reinforced openings | Top 50 × 50 × 1.6 mm; roof 50 × 50 × 1.2 mm; posts 50 × 50 × 2 mm or approved 60 × 60 angle |
| External walls | Corrugated MS sheet, Tata / Jindal or approved equivalent | 1.2 mm |
| Roof | Sloped corrugated MS sheet with sealed laps, flashings and drainage | 1.4 mm |
| Internal wall and ceiling | Prelaminated MDF with aluminium joint sections | 8 mm |
| Floor system | Cement-fibre board plus resilient finish | 18 mm board with 1.3 mm vinyl |
| Thermal insulation | Glass wool, or the documented Heatlon wall option | Roof 50 mm at 42 kg/m3; wall 25 mm glass wool or 12 mm Heatlon |
| Main door | Outward-opening MS-framed door assembly | Approximately 7 × 3 ft |
| Windows | Two-track aluminium sliding unit with glazing | 4 mm glass |
| Electrical | Concealed copper wiring with DB, MCB, RCCB and earthing | Typical 1.5 / 2.5 / 4 sq mm circuits |
| Corrosion protection | Prepared MS with red-oxide primer and compatible enamel | One primer coat and two enamel coats |
| Handling and QA | Designed lifting hooks and lugs, sealing and pre-dispatch inspection | Completed-unit specific |

*Group D is the SAMAN cabin-platform material key and is common to the Porta Cabin, Portable Cabin, Portable Office, Prefabricated House and Security Cabin families. Technical substitutions require an approved BOM and quotation.*

##### Group E. Scope boundary

| Item | In the published price | Note |
|---|---|---|
| Cabin shell, framing, envelope, roof, insulation, lining and floor | Included | As Groups B and D |
| Scheduled doors and windows with grills | Included | Per the Group C schedule for the selected size |
| Internal electrical installation, DB with MCB/RCCB and earthing | Included | Circuit quantities follow the approved electrical drawing |
| Air-conditioning point and circuit | Included | The AC unit itself is not |
| Paint system and lifting provision | Included | Red-oxide primer and two enamel coats |
| Furniture, including the desks the layout stages | Quoted separately |  |
| Air-conditioning units, telecom, data cabling and networking | Quoted separately |  |
| Generator, incoming supply and connection to site distribution | Quoted separately |  |
| Foundation, plinth, levelling and rough-ground packing | Site scope |  |
| Access stairs, landings and handrails | Quoted separately |  |
| Water, drainage and sanitary fit-out | Quoted separately |  |
| Freight and crane at the receiving end | Freight published on the shipping tab; crane by site |  |

*Engineering, approved shop drawings, final load schedules and signed quotation govern. No structural adequacy, code, lifting or certification claim is made on this page.*

Then the two technical diagrams from `03-technical-diagrams-16x9/`, then the PDF link: Download technical specification (PDF).

#### Shipping tab

The shared freight component exactly as the porta-cabins page renders it: both trailer tables, eighteen distance bands each, both zone city tables, the two free-delivery lines (Bangalore city; Delhi NCR including Ghaziabad, Gurugram, Faridabad, Noida and Greater Noida), the ODC note and the tentative-price disclaimer. No schema, no promises.

#### Reviews tab

`No verified reviews yet.` No Review or AggregateRating markup.

### Structured data

ItemPage, Product with AggregateOffer (INR, ex-GST basis, low Rs 1,66,750, high Rs 5,51,000, offerCount 6), BreadcrumbList, FAQPage with the eight questions above byte-identical. Nothing else.

## 6. Claim ledger

Every product fact on this page and where it comes from. Sources: **F-LEDGER** folder wall ledger and visibility matrix; **F-GA** the six GA specification boards; **F-BOOK** folder workbook `Scope_And_Assumptions` and `Price_Dashboard` (structure and boundary only, not price); **F-INDEX** folder DELIVERY-INDEX locked decisions; **M-KEY** master workbook `Common Material Key`; **TPL** shared site template.

| Claim | Source |
|---|---|
| Six approved sizes: 10x10, 20x8, 20x10, 20x12, 30x10, 40x10, all 8.5 ft nominal height | F-BOOK, F-GA |
| Areas 100, 160, 200, 240, 300, 400 sq ft | F-BOOK |
| Prices Rs 1,66,750 / 2,55,200 / 2,90,000 / 3,34,080 / 4,17,600 / 5,51,000 ex-GST | F-LEDGER, F-GA, technical PDF (SAMAN ruling 6 Sep 2026) |
| GST 18 per cent shown separately | F-BOOK |
| Band rule from Rs 1,450/sq ft at 200 sq ft; bands to 900 sq ft, manual quotation above | F-BOOK price rule, F-LEDGER rate column |
| 20 x 8 ft is the only one-way sloping roof; the other five are centred-ridge two-way | F-LEDGER, F-GA, F-INDEX |
| Wall thickness 100 mm | F-GA (board subtitle, all six) |
| Door count, window count and exact opening positions per wall, all six sizes | F-LEDGER walls block, F-GA ordered wall-opening ledger |
| Every window 4 ft wide; every door 3 ft wide | F-LEDGER opening spans |
| Staged desks 4 / 3 / 5 / 5 / 8 / 12 | F-LEDGER workstations, F-GA approved schedule |
| 30 x 10 ft has two external doors on Wall A | F-LEDGER, F-GA |
| 30 x 10 ft is the approved standard 8-workstation layout, 3 on Wall A and 5 on Wall B | F-INDEX locked decision, F-LEDGER |
| 40 x 10 ft has a partition 10 ft from End C forming a 10 x 10 ft manager room with one window and a 3 ft internal door | F-LEDGER wall P, F-GA |
| 40 x 10 ft stages 12 desks in the common office | F-LEDGER, F-GA |
| Exterior and interior colour per size | F-LEDGER exterior/interior blocks, F-GA subtitles |
| Chassis 100 x 50 x 3 mm MS C-channel; frame 50 x 50 mm sections; walls 1.2 mm; roof 1.4 mm; lining 8 mm MDF; floor 18 mm board + 1.3 mm vinyl; roof insulation 50 mm at 42 kg/m3; wall 25 mm glass wool or 12 mm Heatlon; door approx 7 x 3 ft; windows 4 mm glass two-track aluminium; wiring 1.5 / 2.5 / 4 sq mm with DB, MCB, RCCB and earthing; red-oxide primer plus two enamel coats | M-KEY |
| Protective grill on every window | F-GA elevations, F-LEDGER opening protection; visible on all 36 gallery exteriors |
| Designed lifting lugs with marked positions | M-KEY handling row, F-BOOK differentiated control 02 'lifting lug paint mark' |
| Raised threshold shedding outward | F-BOOK differentiated control 01 'mud-facing doorstep' |
| Scope boundary: furniture, AC, telecoms, generator, foundation, stairs, railings and site services separate unless quoted | F-BOOK product boundary, F-INDEX |
| Free delivery within Bangalore city and across Delhi NCR; freight by trailer size and distance band | TPL shared freight component and the approved shipping master |
| Buyer roles and operating environment | F-BOOK Deep_Technical_Details rows 4 and 5 |

**Not published anywhere on this page, because no source carries it:** delivery lead time, warranty period, quote-response time, support hours, on-site maintenance, spare-parts availability, installation timeline, load capacity, structural adequacy, fire or code compliance, any certification.

## 7. What SAMAN must still decide

1. **The 301 from `/product/prefabricated-houses/prefab-site-office` to this URL**, on the day this page goes live. Designated in the approved redirect map; 24 GSC clicks and 1,534 impressions over three months. Not in the build prompt until SAMAN approves it.
2. **Inbound internal links** from `readymade-office-cabin` and the hub to this page. Touches other routes, so it needs its own ticket.
