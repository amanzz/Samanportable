# PC-05 Fire-Rated Porta Cabin — Self-Contained Copy Pack v3

**Page ID:** PC-05 · **Canonical:** `https://www.samanportable.com/product/porta-cabins/fire-rated-porta-cabin`
**Source draft:** `PC-05-fire-rated-porta-cabin-draft-v1.md` (SAMAN Claude Project) · **Issued:** 14 August 2026
**Owner approval:** `DRAFT APPROVED` received in writing 14 Aug 2026.
**Supersedes copy pack v2, which supersedes v1. Both are withdrawn.**

**v3 changes (SAMAN instruction, 14 Aug 2026):** Section 2 was built as a plain card. The **split card with gallery CTA is a mandatory cluster design** (standing rule 16, ruled at PC-00 v1.4) and v2 failed to supply its sub-copy, so the builder correctly reported a GAP rather than inventing it. v3 adds the three split-card fields and lifts `S2_P2` to the top of the 800-900 band.

| Field | v2 | v3 |
|---|---|---|
| `S2_P1` | 473 | 473 (unchanged) |
| `S2_P2` | 382 | 415 (rewritten, documentation sentence added) |
| Section 2 body total | 857 | 890 (limit 800-900) |
| `SPLIT_CARD_H3` | absent | 48 |
| `SPLIT_CARD_BODY` | absent | 336 |
| `SPLIT_CARD_CTA` | absent | 27 |
| Visible chars in Section 2 | 857 | **1,301** |

**Changed checksums: `S2_P2` only.** Three fields are new. Every other field in this pack is byte-identical to v2 and its checksum is unchanged. The pack now carries **27 fields**.

**Split card rendering.** Use the same Section-2 split card component the PC-00 hub uses: image left, `SPLIT_CARD_H3` as the card heading, `SPLIT_CARD_BODY` as the card text, `SPLIT_CARD_CTA` as the link label with a trailing arrow supplied by the component, not by the copy. The CTA destination is **the same project-gallery URL the hub's Section-2 card already links to**: read it from the hub component, do not invent a URL. Card image: `fire-rated-porta-cabin-20x10-tan-side.webp` (gallery slot 16), which is already produced.

**Truth constraint on this card.** It deliberately does **not** claim the gallery shows completed fire-rated projects, because no such evidence exists in the approved sources. It claims shared chassis, factory process and quality checks, which the specification supports. Do not retitle, reword or "tighten" it.

## Variant section shapes (standing rule 13)

| Variant | Shape | Structure |
|---|---|---|
| V1 10x10 | A | H2 + two paragraphs |
| V2 20x8 | A | H2 + two paragraphs |
| V3 20x10 | A | H2 + two paragraphs |
| V4 20x12 | A | H2 + two paragraphs |
| V5 40x10 | B | H2 + one paragraph + 4 bullets (`V5_BULLETS`, one per line) |
| V6 40x12 | B | H2 + one paragraph + 4 bullets (`V6_BULLETS`, one per line) |

Shape A bodies contain a blank line between the two paragraphs: render as two `<p>` elements. Bullet fields are newline-separated: render as a `<ul>` of `<li>`. Bullets are approved copy and sit outside the 400-500 character prose count.

## Why this file exists (standing rule 9)

Claude Code and other build agents **cannot read the SAMAN Claude Project knowledge base**. A ticket that cites a project doc path as the copy source is unbuildable: the checksums have nothing to verify against. This file therefore carries every approved field verbatim and must be **committed into the repository** before the build starts. This failure halted PC-02 and PC-04; it does not happen again.

## Rules for the builder

1. Copy is **verbatim**. Do not rewrite, shorten, "improve", re-punctuate or re-case any character.
2. Verify each field against its SHA-256 below **after** pasting it into the codebase. Any mismatch is a STOP.
3. **No em dash (U+2014) anywhere.** En dash (U+2013) only between digits. Grep the built output.
4. If any field appears to conflict with the repository, **STOP and report**. Do not patch silently.

---

## 1. Copy fields (verbatim)

### H1

**Length:** 52 characters · **SHA-256:** `5235a7a7f7601c6823a7c4ef0ddc1fe80372d0f0b248b9de9ac845ad0b3522c5`

```text
Fire-Rated Porta Cabin Built on Certified Assemblies
```
### META_TITLE

**Length:** 55 characters · **SHA-256:** `2330ec677e4371d2b0fd527a94e25d6a9ab3897f701be5935a63b4602cc4cfa0`

```text
Fire-Rated Porta Cabin: Tested, Certified Build | SAMAN
```
### META_DESC

**Length:** 156 characters · **SHA-256:** `3976aa3cfac515269f6d11d0da770e09fc304df7806682d32be5c48637e8ba0b`

```text
Fire-rated porta cabin on a heavy MS frame: mineral-wool envelope, tested fire doors, six sizes from Rs 1,78,250 ex-GST. Rating follows your tested systems.
```
### HERO_P1

**Length:** 374 characters · **SHA-256:** `dd9861900848e4add178bb7ab113471b4d88d9104382fce2fac79596c386d7eb`

```text
The SAMAN fire-rated porta cabin serves projects where the fire strategy, not the budget sheet, selects the cabin. We build it on a heavy MS frame and specify the envelope around certified fire-resilient assemblies: 75-100 mm mineral-wool sandwich panels, fire-grade internal linings, a non-combustible floor build and tested fire-door sets where your project requires them.
```
### HERO_P2

**Length:** 358 characters · **SHA-256:** `f208dc7fe74d387dd470014cf5f11e95734ff1de76c57d5909ee413b2238bb4b`

```text
We do not print a blanket 60 or 120 minute rating, because a real rating belongs to the exact tested wall, roof, door and penetration system your project specifies. Share your required fire criteria and we quote the matching certified build. Six factory-built sizes run from 10x10 ft to 40x12 ft, priced from Rs 1,78,250 ex-GST as derived planning estimates.
```
### S2_H2

**Length:** 58 characters · **SHA-256:** `f5a3ffa303764bcd1a3925f523e7bc6989ad979379e860a7b2ded838fc5f0735`

```text
When Your Project Fire Strategy Demands a Fire-Rated Cabin
```
### S2_P1

**Length:** 473 characters · **SHA-256:** `b0c7236aa464b866bf7e493d6586d0a518011224a01e1dbfc42f7bda3bb750c9`

```text
Choose this configuration when a contract, fire consultant or statutory audit asks the cabin to meet stated fire criteria. That demand appears on refinery and plant sites, in warehouses holding combustible goods, near fuel or chemical storage, and in EPC and government tenders that specify cabin fire performance. A standard MS porta cabin shares the same heavy steel platform, but its conventional panels and ordinary glazing are never specified against a fire criterion.
```
### S2_P2

**Length:** 415 characters · **SHA-256:** `68a8c3d160e9487e1e5ea31091284425aaee97d0d864bba40ff5abfc0b8ff60c`

```text
With the fire-rated build, you state the required performance and we specify mineral-wool assemblies, fire-grade linings, rated door sets and fire-stopped penetrations to match. The supporting documentation is listed in your quotation, so the file you hand a fire officer traces every claim to a source. Send your fire criteria, size and site location through our contact page for a fixed quotation within 48 hours.
```
### SPLIT_CARD_H3

**Length:** 48 characters · **SHA-256:** `3ddf6c10874dce3b7e5efbdb48bae5fbb05a81271cb770450a43dd4f4840995c`

```text
See the build quality behind the fire-rated spec
```
### SPLIT_CARD_BODY

**Length:** 336 characters · **SHA-256:** `245079bcdb958e0f0065df45048e70b35af79c6f7b2816f29fcb4d589885e979`

```text
The fire-rated configuration sits on the same chassis, factory process and quality checks as every other SAMAN porta cabin. Browse completed projects from our Bengaluru and Greater Noida units to judge steelwork, openings and finish on real deliveries. Then bring your fire criteria to the quotation, where the tested systems are named.
```
### SPLIT_CARD_CTA

**Length:** 27 characters · **SHA-256:** `4c88bfdeb3b24ebc2e2e58f63f1441abbf54f6b86f84dbffc60f4f7955176592`

```text
Explore the project gallery
```
### V1_H2

**Length:** 54 characters · **SHA-256:** `dec5e92fe47424acd3f6a2b41a96206cc8297be0f0752b28f212f513eb840805`

```text
10x10 ft Fire-Rated Porta Cabin: Compact Permit Office
```
### V1_BODY

**Length:** 435 characters · **SHA-256:** `9980f3872f365154259e646e3d4d8cbbc3ff7b5233d2759f6336e608c75bcb2b`

```text
The 100 sq ft unit suits a single controlled room: a hot-work permit desk, a gate documentation point or a marshal station near fuel storage. One rated door set covers the only opening, which keeps the certified build simple and the documentation short.

The cabin moves on a standard truck and fits tight plot corners beside existing structures. Its planning price of Rs 1,78,250 ex-GST is the smallest entry on the fire-rated ladder.
```
### V2_H2

**Length:** 54 characters · **SHA-256:** `c217662e7bbcca09f2a001b348106ea65c8320bb68d050840c610566eb363d1c`

```text
20x8 ft Fire-Rated Porta Cabin: Narrow Transport Build
```
### V2_BODY

**Length:** 458 characters · **SHA-256:** `3f779b2dbac62fc9c64ae303295a584dd707cccbf984a7eb8f79a9cfab5bbee8`

```text
At 160 sq ft, the 8 ft width is the practical advantage: the cabin rides a standard trailer without over-dimensional formalities on most routes. Sites with narrow access roads, congested gates or width limits usually land on this size.

The long wall takes a desk zone at one end and records or storage at the other, with the rated door between them. The planning price is Rs 2,72,800 ex-GST, on the same certified-assembly specification as every other size.
```
### V3_H2

**Length:** 54 characters · **SHA-256:** `73094458987adf35d18fb5934642d0e6c20331995223bf7e4d13250f246fae15`

```text
20x10 ft Fire-Rated Porta Cabin: Reference Site Office
```
### V3_BODY

**Length:** 449 characters · **SHA-256:** `a058a64965c199ed90e700668b734fb81396a40f574c8ecd765297b76fdd0aff`

```text
This 200 sq ft size is the reference configuration for the whole product. The authoritative rate of Rs 1,550 per sq ft is set here, so its Rs 3,10,000 ex-GST price anchors the six-size ladder.

The floor plan carries two desks comfortably, or one office zone plus a records area behind a partition. If you are comparing fire-rated quotes across suppliers, use this size to compare like for like: same area, same reference rate, same stated criteria.
```
### V4_H2

**Length:** 52 characters · **SHA-256:** `9a417bae9806485343f1047793725c9965ba83614f3094445fcec0cc967814b9`

```text
20x12 ft Fire-Rated Porta Cabin: Wide Meeting Layout
```
### V4_BODY

**Length:** 465 characters · **SHA-256:** `444de0a6f631dc3c9a6260821717a18585687b79ab83ff4f9fdced6cc48e25f0`

```text
The extra 2 ft of width changes how the room works. Its 240 sq ft seats a toolbox-talk or induction table alongside working desks, which matters where permits and briefings happen in the same room.

The wider span uses the engineered top-frame and roof-support sections from the approved specification. Note that 12 ft wide loads travel as over-dimensional cargo, so route charges are confirmed with your delivery location. The planning price is Rs 3,57,120 ex-GST.
```
### V5_H2

**Length:** 54 characters · **SHA-256:** `5a7b6793bab4ebea1ca2d341288566b5c9a96639808394ef258fb5847c53a361`

```text
40x10 ft Fire-Rated Porta Cabin: Multi-Room Site Block
```
### V5_BODY

**Length:** 413 characters · **SHA-256:** `3c13c5dfbf6dec5f43982b1f1065d10af6030a27ab348d004c0688a24df53a20`

```text
With 400 sq ft on one chassis, this size takes partitioned layouts under a single protected envelope. Compartment boundaries, door positions and exits follow your approved layout drawing, and every opening that sits in a rated wall is specified as part of the certified build rather than cut in afterwards. Freight moves on the 40 ft trailer band of the published ladder. The planning price is Rs 5,89,000 ex-GST.
```
### V6_H2

**Length:** 52 characters · **SHA-256:** `a7f0e2022c21e69b6d4a2e3fa0d4993d95b3f305ef79016a7751bcfdef55b41c`

```text
40x12 ft Fire-Rated Porta Cabin: Largest Tender Size
```
### V6_BODY

**Length:** 427 characters · **SHA-256:** `d6dfe98487b040440393110261ef9bc8e43c8058f288c92cdc623f89e6a90b85`

```text
The 480 sq ft flagship matches the 40x12 ft cabin format that appears in government e-marketplace specifications, which makes it the usual pick for tender-driven procurement. The width supports control-room and document-room layouts served by a central corridor. It ships as over-dimensional cargo, so the route is confirmed before dispatch. The planning price is Rs 6,99,360 ex-GST, the top of the published fire-rated ladder.
```
### V5_BULLETS

**Length:** 236 characters · **SHA-256:** `64c29ecbd57dc8c9ec90f68782b533c6a6163ab5ef0862379aef3cc996681a82`

```text
Separate engineer, document and meeting rooms behind rated partitions
Corridor or open-plan circulation, fixed at drawing stage
Additional rated door sets quoted per opening
Detector and alarm interfaces positioned to your fire strategy
```
### V6_BULLETS

**Length:** 256 characters · **SHA-256:** `074cb5cb4328d7862cfc9b327dee7c2079863c8a8f21f7844b56c8a732bae85d`

```text
Control room, document room and meeting space in one delivered unit
Central corridor with a rated door to each compartment
Documentation pack assembled from the tested systems actually quoted
Over-dimensional movement: route confirmed at order, not assumed
```
### DESCRIPTION_TAB

**Length:** 14986 characters · **SHA-256:** `9b2bc3e71139fb353a6d7026d4d7a90a7b90b70dcc8a4e749e90395fe1d9d8f8`

```text
Fire safety requirements reach site cabins later than they reach buildings, but they do reach them. A permit office beside a tank farm will face the question one day. So will a document room inside a process plant, or a site office in a warehouse full of combustible stock. A fire consultant will ask what the cabin actually does in a fire. This page explains how SAMAN answers that question: with a specific build, published planning prices and honest scope.

## What Fire-Rated Actually Means on a Porta Cabin

A fire rating is not a property of a material name. It belongs to a complete tested assembly. That means a specific wall build-up, a specific door set in a specific frame, and a specific sealed penetration, each supported by test evidence for that exact construction. A supplier who prints 60 minutes or 120 minutes on a website, without naming the tested system, is quoting a number without a certificate.

SAMAN takes the opposite position. Your project states the required fire-resistance period and reaction-to-fire criteria. Those usually come from its fire strategy, consultant or tender specification. We then specify the wall, roof, ceiling, door and penetration systems whose test evidence matches those criteria. Your quotation lists that documentation item by item. The cabin is sold as fire-rated only when the tested systems behind it are confirmed for your order.

This approach costs us easy marketing lines. In return, you get a cabin whose paperwork survives an audit. Factory fire officers, EPC document controllers and procurement teams can file the quotation, the material certificates and the test evidence together, and every claim in that file traces to a source.

## Where This Configuration Earns Its Premium

The fire-rated build costs more than a standard steel cabin of the same size, and the premium buys specific things. It buys a non-combustible envelope instead of a conventional one. It buys door sets that are tested products rather than fabricated gates. It buys penetrations that are sealed systems rather than open cut-outs. Buyers who need those things usually know it already, because a consultant or a tender clause has told them.

Typical placements include hot-work permit offices near fuel and chemical storage, control and document rooms inside process plants, site offices in high-value warehouses, and cabins procured under tender clauses that state fire criteria. If none of that describes your site, a standard cabin serves you better and costs less. We would rather route you to the right product than sell you the wrong premium.

## How SAMAN Builds the Fire-Rated Configuration

The build starts from the same heavy MS platform that carries our industrial porta cabins. The envelope, linings, openings and services then change around fire performance. Nineteen of the thirty technical line items in this product's specification are unique to the fire-rated configuration.

### Structure

The chassis uses a heavy MS primary frame with a 150x75x5 mm C-channel reference section. Secondary support comes from 100x50x3 mm channels and engineered cross-members. Corner posts are 60x60x3 mm SHS with reinforced rated openings. The 80x40x3 mm top frame carries protected connection zones, so wall and ceiling junctions stay continuous where the tested system needs them to be. Every unit gets engineered lifting points. Qualified fabricators weld or bolt the structural connections to approved shop drawings.

### Envelope and linings

Exterior walls use 75-100 mm mineral-wool sandwich panels with 0.5-0.8 mm pre-coated GI or GL facings. The roof is a mineral-wool roof panel or a tested non-combustible roof build, with insulation continuity maintained across joints. Inside, walls take 12.5 mm fire-grade gypsum, calcium-silicate or fibre-cement layers as the certified system requires. The ceiling assembly stays continuous where partitions meet it. Stone and mineral wool is the insulation family throughout. Where your project specifies that level, we use an A1-class product; ROCKWOOL publishes Euroclass A1 reaction-to-fire data for its Safe n Silent Pro range.

Foam-core panels tell you why this matters. PUF and EPS cores insulate well and cost less, and they serve our other cabin configurations honestly. Their fire behaviour, however, depends entirely on density, facings and the tested assembly. A fire-focused specification starts from non-combustible stone wool instead.

### Floor

The floor build avoids combustible board as the default. A steel floor grid carries 18-24 mm cement-bonded board or an engineered cementitious deck. The finish is a commercial resilient or epoxy system, chosen from documented low-flame-spread options where the project requires them. The adhesive and skirting follow the same documentation rule as the finish, because a floor system is only as good as its weakest documented layer.

### Doors, windows and openings

The main door is a tested fire-door assembly: certified leaf, frame and hardware with a self-closer and seals as required. Its rating matches your project fire strategy, not a catalogue default. Windows are the honest difficulty in any fire-rated cabin, and we say so plainly. Standard aluminium windows with ordinary glass are not fire-rated. Rated walls therefore either omit glazing or use a certified fire-rated glazing system where one is permitted. Grills, mosquito mesh and louvers appear only where the approved opening schedule allows them.

### Services and penetrations

Electrical work follows the platform standard. Concealed or protected copper wiring runs on a 1.5, 2.5 and 4 sq mm starting schedule, with final sizing by load. A distribution board provides MCB and RCCB protection with earthing. LED lights, modular switches, 6A and 16A sockets and fan or AC provision are coordinated on the drawing. What changes in the fire-rated build is everything that passes through a rated boundary. Ventilation and AC penetrations take tested dampers or fire-stopping where the strategy requires them. Cables, pipes and conduits pass through tested penetration seals rather than open cut-outs.

![Terracotta fire-rated porta cabin exterior with signboard](fire-rated-porta-cabin-terracotta-exterior-signboard.webp)
![Fire-door assembly with self-closer and bulkhead light](fire-rated-porta-cabin-fire-door-self-closer-detail.webp)

## Six Sizes and Published Planning Prices

The fire-rated ladder runs its own six sizes. It drops the 30x10 ft entry used by some sibling products and adds 40x12 ft, the format that appears in government e-marketplace cabin specifications. All prices derive from the authoritative input rate of Rs 1,550 per sq ft at the 20x10 ft reference. A published area-band adjustment then applies: smaller cabins price above the reference rate and larger cabins below it.

| Size (ft) | Area (sq ft) | Price ex-GST | Price incl. 18% GST |
|---|---|---|---|
| 10x10x8.5 | 100 | Rs 1,78,250 | Rs 2,10,335 |
| 20x8x8.5 | 160 | Rs 2,72,800 | Rs 3,21,904 |
| 20x10x8.5 | 200 | Rs 3,10,000 | Rs 3,65,800 |
| 20x12x8.5 | 240 | Rs 3,57,120 | Rs 4,21,402 |
| 40x10x8.5 | 400 | Rs 5,89,000 | Rs 6,95,020 |
| 40x12x8.5 | 480 | Rs 6,99,360 | Rs 8,25,245 |

Treat every figure as a derived planning estimate. The final price follows the tested fire systems your project specifies. A 90-minute door schedule and a basic protected build sit at different points of the cost curve, and only your stated criteria decide which one you are buying. Interior fit-out, optional add-ons, transport, installation, foundations and project-specific engineering or tests are excluded unless your quotation states otherwise.

![Long side elevation of fire-rated porta cabin at the factory yard](fire-rated-porta-cabin-long-side-elevation-factory-yard.webp)

## Scope You Can Verify Before You Sign

Fire-rated procurement fails most often on assumed scope. We publish the boundaries instead. The table below uses the same split as our quotations.

| Scope class | What it covers |
|---|---|
| STANDARD | Heavy MS frame, mineral-wool envelope, fire-grade internal linings, non-combustible floor build, one tested fire-door set, platform electrical package, pre-dispatch QA |
| OPTIONAL | Certified fire-rated glazing systems, additional rated door sets, AC units, furniture packages, extended finishing warranty |
| CUSTOM | Compartment layout, rated partition positions, detector, extinguisher and alarm interfaces, signage to your fire strategy, project-specified rating documentation |
| EXCLUDED | Interior fit-out beyond standard, transport and installation, foundations, statutory approvals, detection and suppression systems themselves, project engineering and site tests |

Detection and suppression deserve one honest sentence. Detectors, extinguishers and alarm systems belong to your project's fire strategy and its licensed contractors. We provide the layout provisions, brackets and interfaces the strategy calls for. We never present a cabin shell as a substitute for those systems.

## What to Put in Your RFQ

A fire-rated enquiry moves fastest when it arrives with the facts a specifier needs. Include these points and the quotation comes back precise instead of provisional:

- The required fire-resistance period and criteria, and who stated them (consultant, tender, factory officer)
- Cabin size from the six-size ladder, plus your room layout if partitions are needed
- Door and window schedule, marking which openings sit in rated walls
- Site location and access notes for freight and placement
- Electrical load points and AC requirement
- Required delivery date

If the rating requirement is still undefined, say so. We will quote the base fire-resilient build and mark the rating-dependent items as options. That keeps your budget honest while the fire strategy catches up, and nothing gets bought twice.

![Finished interior with laminate walls, AC unit and exhaust fan](fire-rated-porta-cabin-finished-interior-ac-exhaust.webp)

## Delivery, Site Readiness and Freight

Standard production runs 7-21 working days from confirmed order. A fixed-price quotation reaches you within 48 hours of a complete enquiry. Cabins ship complete from our Bengaluru and Greater Noida units. Freight follows the published trailer ladder: a 20 ft open trailer starts at Rs 25,000-30,000 for the 100-150 km band, and a 40 ft trailer at Rs 30,000-35,000, with each further 50 km band adding roughly Rs 5,000. Delivery inside Bengaluru city is free. So is delivery across Delhi NCR, including Ghaziabad, Gurugram, Faridabad, Noida and Greater Noida. The 12 ft wide sizes move as over-dimensional cargo, and their route charges are confirmed once the delivery location and order are fixed. Transport charges may shift slightly with route and vehicle return.

Your site needs a level, load-bearing base, clear crane access for placement and a power point for hook-up. Engineered foundations and statutory sign-off, where a project requires them, remain in your scope. We state that in the quotation rather than discovering it at delivery, because surprises at the gate cost both sides money.

![Crane lifting a fire-rated porta cabin into position](fire-rated-porta-cabin-crane-lifting-placement.webp)
![Fire-rated porta cabin loaded on a multi-axle trailer](fire-rated-porta-cabin-trailer-transport.webp)

## Quality Checks, Warranty and Support

Every cabin passes a pre-dispatch inspection before it leaves the factory. The checks cover dimensions, member and panel identification, connections, coating, roof integrity and functional tests of doors, windows and electrical circuits. SAMAN POS India Private Limited operates ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018 certified management systems. The company has delivered 500+ projects across 15+ states from its two manufacturing units.

The commercial warranty reads the same on every SAMAN page because it comes from one controlled source: 5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation. Relocation damage and site modifications sit outside warranty scope. For certified fire assemblies, the final quotation governs warranty terms.

Service life is a separate number from warranty, and we keep the two apart deliberately. A well-maintained steel cabin of this class delivers 20-25 years of service under proper use and maintenance. That figure describes expected life, not a warranty period. Maintenance itself stays simple: keep drainage paths clear, touch up coating damage early, and have any repair that touches a rated wall, door or seal carried out to the same documented system it came with.

Relocation is part of this product's value. Engineered lifting points are standard, and the cabin moves by crane and trailer as one unit. After any relocation, inspect door seals, panel joints and penetration seals before the cabin returns to duty, because the certified build only protects a room when its assemblies sit as tested. Relocation damage sits outside warranty scope, so plan the lift with competent riggers.

One boundary note helps some buyers. If your requirement leans toward acoustic performance rather than fire criteria, the same mineral-wool family serves a different specification in our soundproof porta cabin. Genuinely mixed requirements are best resolved in one engineering conversation. For standard configurations and the full size range, start from the porta cabins range and compare against your site needs.

## Frequently Asked Questions

**What fire rating does the cabin carry?**
The rating your project specifies. We build to certified assemblies whose test evidence matches your stated fire-resistance period and criteria, and the quotation lists that documentation. We do not publish a blanket minutes figure, because no honest manufacturer can rate a cabin before knowing the required systems.

**Is the cabin fireproof?**
No cabin is. Fireproof is a marketing word; tested assemblies resist fire for defined periods under defined conditions. If a supplier offers you a fireproof cabin, ask for the test report and watch the claim change.

**Can I add windows wherever I want?**
In non-rated walls, yes, from the standard window schedule. In rated walls, glazing is either omitted or supplied as a certified fire-rated glazing system where permitted. An ordinary aluminium window would defeat the wall it sits in.

**Do you supply fire detectors and extinguishers?**
Those systems belong to your project's fire strategy and its licensed contractors. We build in the provisions, brackets and interfaces your layout calls for, and we hand over a cabin ready to receive them.

**How fast can one reach my site?**
Production runs 7-21 working days after order confirmation, plus freight time by the published trailer bands. Quotation turnaround is 48 hours from a complete enquiry. The 12 ft wide sizes add route confirmation time for over-dimensional movement.

```
### SPEC_NARRATIVE

**Length:** 581 characters · **SHA-256:** `f0f7fca83175941972cb5b50ab2b60cc9c09b2a3a0868167a33bf16c63872762`

```text
The two tables below reproduce the approved specification for this configuration: nineteen product-specific lines and eleven platform-common lines. Read them as a compliance tool. Table 1 tells your structural reviewer what carries the loads and what the envelope is made of. Table 2 tells your fire consultant how linings, openings and service penetrations are treated, and where scope passes from SAMAN to your project. Items marked as project-specified stay flexible until your fire criteria fix them. The quotation then records the exact tested systems selected for your order.
```
---

## 2. Checksum table (verification source)

| Field | Length | SHA-256 |
|---|---|---|
| H1 | 52 | `5235a7a7f7601c6823a7c4ef0ddc1fe80372d0f0b248b9de9ac845ad0b3522c5` |
| META_TITLE | 55 | `2330ec677e4371d2b0fd527a94e25d6a9ab3897f701be5935a63b4602cc4cfa0` |
| META_DESC | 156 | `3976aa3cfac515269f6d11d0da770e09fc304df7806682d32be5c48637e8ba0b` |
| HERO_P1 | 374 | `dd9861900848e4add178bb7ab113471b4d88d9104382fce2fac79596c386d7eb` |
| HERO_P2 | 358 | `f208dc7fe74d387dd470014cf5f11e95734ff1de76c57d5909ee413b2238bb4b` |
| S2_H2 | 58 | `f5a3ffa303764bcd1a3925f523e7bc6989ad979379e860a7b2ded838fc5f0735` |
| S2_P1 | 473 | `b0c7236aa464b866bf7e493d6586d0a518011224a01e1dbfc42f7bda3bb750c9` |
| S2_P2 | 415 | `68a8c3d160e9487e1e5ea31091284425aaee97d0d864bba40ff5abfc0b8ff60c` |
| SPLIT_CARD_H3 | 48 | `3ddf6c10874dce3b7e5efbdb48bae5fbb05a81271cb770450a43dd4f4840995c` |
| SPLIT_CARD_BODY | 336 | `245079bcdb958e0f0065df45048e70b35af79c6f7b2816f29fcb4d589885e979` |
| SPLIT_CARD_CTA | 27 | `4c88bfdeb3b24ebc2e2e58f63f1441abbf54f6b86f84dbffc60f4f7955176592` |
| V1_H2 | 54 | `dec5e92fe47424acd3f6a2b41a96206cc8297be0f0752b28f212f513eb840805` |
| V1_BODY | 435 | `9980f3872f365154259e646e3d4d8cbbc3ff7b5233d2759f6336e608c75bcb2b` |
| V2_H2 | 54 | `c217662e7bbcca09f2a001b348106ea65c8320bb68d050840c610566eb363d1c` |
| V2_BODY | 458 | `3f779b2dbac62fc9c64ae303295a584dd707cccbf984a7eb8f79a9cfab5bbee8` |
| V3_H2 | 54 | `73094458987adf35d18fb5934642d0e6c20331995223bf7e4d13250f246fae15` |
| V3_BODY | 449 | `a058a64965c199ed90e700668b734fb81396a40f574c8ecd765297b76fdd0aff` |
| V4_H2 | 52 | `9a417bae9806485343f1047793725c9965ba83614f3094445fcec0cc967814b9` |
| V4_BODY | 465 | `444de0a6f631dc3c9a6260821717a18585687b79ab83ff4f9fdced6cc48e25f0` |
| V5_H2 | 54 | `5a7b6793bab4ebea1ca2d341288566b5c9a96639808394ef258fb5847c53a361` |
| V5_BODY | 413 | `3c13c5dfbf6dec5f43982b1f1065d10af6030a27ab348d004c0688a24df53a20` |
| V6_H2 | 52 | `a7f0e2022c21e69b6d4a2e3fa0d4993d95b3f305ef79016a7751bcfdef55b41c` |
| V6_BODY | 427 | `d6dfe98487b040440393110261ef9bc8e43c8058f288c92cdc623f89e6a90b85` |
| V5_BULLETS | 236 | `64c29ecbd57dc8c9ec90f68782b533c6a6163ab5ef0862379aef3cc996681a82` |
| V6_BULLETS | 256 | `074cb5cb4328d7862cfc9b327dee7c2079863c8a8f21f7844b56c8a732bae85d` |
| DESCRIPTION_TAB | 14986 | `9b2bc3e71139fb353a6d7026d4d7a90a7b90b70dcc8a4e749e90395fe1d9d8f8` |
| SPEC_NARRATIVE | 581 | `f0f7fca83175941972cb5b50ab2b60cc9c09b2a3a0868167a33bf16c63872762` |

---

## 3. Hero gallery alts (36 slots, six per size)

Per-size galleries only: each size shows images from its own folder. Alts describe **visible facts only**. No alt claims fire performance, a rating, or a certificate. If a source file does not match its alt on opening, **report it, do not invent a replacement**.

| # | Size | Source file | Output file | Alt text |
|---|---|---|---|---|
| 1 | 10x10 | fire-rated-modular-cabin-10x10-green-exterior.png | fire-rated-porta-cabin-10x10-tan-green-exterior.webp | 10x10 ft porta cabin with tan and green corrugated walls, central door and two windows |
| 2 | 10x10 | fire-rated-porta-cabin-10x10-two-tone-exterior.png | fire-rated-porta-cabin-10x10-two-tone-exterior.webp | Light blue and green 10x10 ft porta cabin at a factory yard, corner view |
| 3 | 10x10 | fire-rated-site-office-10x10-olive-green.png | fire-rated-porta-cabin-10x10-olive-green-front.webp | Olive green 10x10 ft porta cabin, front elevation with central door and two windows |
| 4 | 10x10 | fireproof-porta-cabin-10x10-dark-grey.png **(RENAME)** | fire-rated-porta-cabin-10x10-dark-grey.webp | Dark grey 10x10 ft porta cabin with door and windows, three-quarter view |
| 5 | 10x10 | fire-rated-cabin-10x10-interior-layout.png | fire-rated-porta-cabin-10x10-interior-desk-door.webp | 10x10 ft cabin interior with desk, chairs and white panelled walls |
| 6 | 10x10 | fire-resistant-porta-cabin-10x10-interior-desk.png | fire-rated-porta-cabin-10x10-interior-workdesk.webp | Office desk and chairs inside a 10x10 ft cabin with window view |
| 7 | 20x8 | fire-rated-porta-cabin-20x8-two-tone-green.jpg | fire-rated-porta-cabin-20x8-cream-green-side.webp | Cream and green 20x8 ft porta cabin, long side with central door |
| 8 | 20x8 | fire-resistant-modular-cabin-20x8-front-elevation.jpg | fire-rated-porta-cabin-20x8-end-elevation.webp | White and grey 20x8 ft cabin end elevation with single window |
| 9 | 20x8 | fireproof-portable-building-20x8-blue-exterior.jpg **(RENAME)** | fire-rated-porta-cabin-20x8-blue-exterior.webp | Blue 20x8 ft porta cabin with two windows beside a waterside plot |
| 10 | 20x8 | fireproof-portable-office-20x8-green-exterior.jpg **(RENAME)** | fire-rated-porta-cabin-20x8-green-exterior.webp | Green 20x8 ft porta cabin, three-quarter view on a landscaped campus |
| 11 | 20x8 | fire-rated-porta-cabin-20x8-interior-workspace.jpg | fire-rated-porta-cabin-20x8-interior-workspace.webp | Narrow 20x8 ft cabin interior with desks along both walls |
| 12 | 20x8 | fire-rated-site-office-20x8-interior-hallway.jpg | fire-rated-porta-cabin-20x8-interior-ac-view.webp | 20x8 ft cabin interior with desk, chairs and AC unit at the far wall |
| 13 | 20x10 | fire-rated-modular-office-20x10-blue-exterior.jpg | fire-rated-porta-cabin-20x10-blue-front.webp | Blue and grey 20x10 ft porta cabin, front elevation with central door |
| 14 | 20x10 | fire-rated-porta-cabin-20x10-dark-grey-exterior.jpg | fire-rated-porta-cabin-20x10-dark-grey-corner.webp | Dark grey 20x10 ft porta cabin, corner view at a paved yard |
| 15 | 20x10 | fire-rated-porta-cabin-20x10-red-exterior.jpg | fire-rated-porta-cabin-20x10-red-corner.webp | Red 20x10 ft porta cabin with door and two windows, corner view |
| 16 | 20x10 | fire-rated-site-office-20x10-tan-exterior.jpg | fire-rated-porta-cabin-20x10-tan-side.webp | Tan 20x10 ft porta cabin on open ground, side elevation |
| 17 | 20x10 | fire-resistant-porta-cabin-20x10-interior-workspace.jpg | fire-rated-porta-cabin-20x10-interior-desks.webp | 20x10 ft cabin interior with desk, two chairs and side door |
| 18 | 20x10 | prefab-fire-rated-cabin-20x10-interior-layout.jpg | fire-rated-porta-cabin-20x10-interior-layout.webp | Wood-floored 20x10 ft cabin interior with desks and corridor view |
| 19 | 20x12 | fire-rated-modular-office-20x12-yellow-grey.jpg | fire-rated-porta-cabin-20x12-yellow-grey.webp | Yellow and grey 20x12 ft porta cabin beside an office building |
| 20 | 20x12 | fire-rated-porta-cabin-20x12-light-green.jpg | fire-rated-porta-cabin-20x12-light-green-corner.webp | Light green 20x12 ft porta cabin, corner view on a concrete apron |
| 21 | 20x12 | fire-rated-porta-cabin-20x12-white-exterior.jpg | fire-rated-porta-cabin-20x12-white-side.webp | White 20x12 ft porta cabin with grilled windows, side view |
| 22 | 20x12 | fire-rated-site-office-20x12-dark-grey-exterior.jpg | fire-rated-porta-cabin-20x12-dark-grey-side.webp | Dark grey 20x12 ft porta cabin outside a glass-fronted building |
| 23 | 20x12 | fire-resistant-porta-cabin-20x12-interior-desks.jpg | fire-rated-porta-cabin-20x12-interior-desks.webp | 20x12 ft cabin interior with desks, sideboard and pale green walls |
| 24 | 20x12 | prefab-fire-rated-cabin-20x12-interior-layout.jpg | fire-rated-porta-cabin-20x12-interior-layout.webp | 20x12 ft cabin interior with corner desk and storage cabinet |
| 25 | 40x10 | fire-rated-site-office-40x10-two-tone-green.jpg | fire-rated-porta-cabin-40x10-two-tone-green.webp | Two-tone green 40x10 ft porta cabin with a row of windows on a gravel yard |
| 26 | 40x10 | fire-resistant-modular-cabin-40x10-green-landscape.jpg | fire-rated-porta-cabin-40x10-dark-green-side.webp | Dark green 40x10 ft porta cabin in landscaped surroundings, long side view |
| 27 | 40x10 | prefab-fire-rated-cabin-40x10-yellow-exterior.jpg | fire-rated-porta-cabin-40x10-yellow-side.webp | Yellow 40x10 ft porta cabin, long side elevation with grilled windows |
| 28 | 40x10 | prefab-fireproof-cabin-40x10-tan-exterior.jpg **(RENAME)** | fire-rated-porta-cabin-40x10-tan-exterior.webp | Tan 40x10 ft porta cabin with door and window row |
| 29 | 40x10 | fire-rated-porta-cabin-40x10-interior-workspace.jpg | fire-rated-porta-cabin-40x10-interior-workspace.webp | Open-plan 40x10 ft cabin interior with workstations and window rows |
| 30 | 40x10 | fire-resistant-porta-cabin-40x10-interior-desks.jpg | fire-rated-porta-cabin-40x10-interior-corridor.webp | Corridor view of 40x10 ft cabin interior with desks and green doors |
| 31 | 40x12 | fire-rated-modular-office-40x12-red-exterior.jpg | fire-rated-porta-cabin-40x12-red-front.webp | Red 40x12 ft porta cabin, long front elevation with five windows |
| 32 | 40x12 | fire-rated-porta-cabin-40x12-blue-grey-exterior.jpg | fire-rated-porta-cabin-40x12-blue-grey.webp | Blue and grey 40x12 ft porta cabin, three-quarter view |
| 33 | 40x12 | fire-rated-porta-cabin-40x12-green-yellow-exterior.jpg | fire-rated-porta-cabin-40x12-green-yellow.webp | Green and yellow 40x12 ft porta cabin on a paved campus |
| 34 | 40x12 | fire-rated-site-office-40x12-light-green-exterior.jpg | fire-rated-porta-cabin-40x12-light-green.webp | Light green 40x12 ft porta cabin beside a concrete wall |
| 35 | 40x12 | fire-resistant-porta-cabin-40x12-interior-workstations.jpg | fire-rated-porta-cabin-40x12-interior-workstations.webp | Row of workstations inside a 40x12 ft cabin with window line |
| 36 | 40x12 | prefab-fire-rated-cabin-40x12-interior-layout.jpg | fire-rated-porta-cabin-40x12-interior-layout.webp | 40x12 ft cabin interior with desks, monitors and wood-look floor |

**Rename rule:** four source files carry a `fireproof` token in the filename. `fireproof` is a banned absolute in SAMAN copy. Rename on output exactly as the table states. The token must not survive in any filename, alt, caption, path or commit message.

**Do not** use `fireproof-portable-office-20x10-front-elevation.jpg`, `prefab-fireproof-cabin-20x10-green-black-trim.jpg`, `fireproof-portable-building-20x12-interior-workspace.jpg`, `fireproof-portable-office-20x12-two-tone-front.jpg`, `fireproof-portable-building-40x10-white-red.jpg`, `fireproof-portable-office-40x10-interior-hall.jpg`, `fireproof-portable-building-40x12-interior-hallway.jpg`, `fireproof-portable-office-40x12-dark-grey-end-view.jpg`, `prefab-fireproof-cabin-40x12-tan-exterior.jpg`, `prefab-fireproof-cabin-10x10-white-exterior.png`, `prefab-fireproof-office-10x10-interior-workspace.png`, `prefab-fireproof-cabin-20x8-white-exterior.jpg`, `prefab-fireproof-cabin-20x12-tan-green-exterior.jpg`, `fire-rated-portable-office-10x10-wood-finish.png`, `fire-resistant-portable-office-10x10-interior.png`, `fire-rated-modular-office-20x8-interior-desks.jpg`, `prefab-fire-rated-cabin-20x8-interior-view.jpg`, `fire-resistant-porta-cabin-20x8-orange-base.jpg`, `fire-resistant-modular-cabin-20x10-interior-lounge.jpg`, `fireproof-portable-building-20x10-interior-hallway.jpg`, `fire-resistant-modular-cabin-20x12-interior-hall.jpg`, `fire-rated-modular-office-40x10-interior-layout.jpg`, `fire-rated-porta-cabin-40x10-blue-exterior.jpg`, `fire-resistant-modular-cabin-40x12-interior-office.jpg` in the galleries. They stay in the repository, unused. (`fire-rated-porta-cabin-40x10-blue-exterior.jpg` is excluded specifically because it is an **end elevation**, not the long side its filename implies.)

---

## 3-A. Section 3 explorer images (6 slots, one per size) — NEW IN v3

Resolves the builder's GAP 2. v2 declared 42 slots with no explorer allocation, so the builder reused gallery slot 1 per size to avoid firing the unapproved placeholder literal. That was the right call from bad inputs. Each size folder holds 10 files and the gallery uses 6, so **six unused files are allocated here**. Total slots are now **48 (36 gallery + 6 explorer + 6 Description)**, all hash-unique. No reuse anywhere.

| Size | Source file | Output file | Alt text |
|---|---|---|---|
| 10x10 | fire-rated-portable-office-10x10-wood-finish.png | fire-rated-porta-cabin-10x10-yellow-dark-exterior.webp | Yellow and dark grey 10x10 ft porta cabin, three-quarter view on a paved apron |
| 20x8 | fire-resistant-porta-cabin-20x8-orange-base.jpg | fire-rated-porta-cabin-20x8-orange-base-side.webp | Cream 20x8 ft porta cabin with orange base band, long side elevation |
| 20x10 | prefab-fireproof-cabin-20x10-green-black-trim.jpg **(RENAME)** | fire-rated-porta-cabin-20x10-green-grey-dockside.webp | Green and grey 20x10 ft porta cabin at a dockside yard |
| 20x12 | prefab-fireproof-cabin-20x12-tan-green-exterior.jpg **(RENAME)** | fire-rated-porta-cabin-20x12-tan-green-exterior.webp | Tan and green 20x12 ft porta cabin on open ground |
| 40x10 | fireproof-portable-building-40x10-white-red.jpg **(RENAME)** | fire-rated-porta-cabin-40x10-white-red-side.webp | White 40x10 ft porta cabin with dark red base band, long side elevation |
| 40x12 | prefab-fireproof-cabin-40x12-tan-exterior.jpg **(RENAME)** | fire-rated-porta-cabin-40x12-tan-window-row.webp | Tan 40x12 ft porta cabin with a row of windows, industrial backdrop |

Four of these carry the `fireproof` token and are renamed on output like the gallery files. The token must not survive anywhere.

## 4. Description tab images (already processed, do not re-encode)

Source folder on the SAMAN device: `images for long description\processed-16x9-webp\`. All six are 1280x720 WebP, 85-118 KB, hash-verified. Place at the marked positions inside `DESCRIPTION_TAB`.

| Output file | KB | SHA-256 (first 12) | Alt | Caption |
|---|---|---|---|---|
| fire-rated-porta-cabin-terracotta-exterior-signboard.webp | 116 | 967c6af6f891 | Terracotta fire-rated porta cabin exterior with signboard | (no caption) |
| fire-rated-porta-cabin-fire-door-self-closer-detail.webp | 96 | 585a15e78073 | Fire-door assembly with self-closer and bulkhead light | Tested fire-door set with self-closer, as fitted where the project requires it |
| fire-rated-porta-cabin-long-side-elevation-factory-yard.webp | 118 | f70d4dc76363 | Long side elevation of fire-rated porta cabin at the factory yard | (no caption) |
| fire-rated-porta-cabin-finished-interior-ac-exhaust.webp | 100 | a6bdb6bd1aeb | Finished interior with laminate walls, AC unit and exhaust fan | Interior finish shown; lining build-up follows the certified system in your order |
| fire-rated-porta-cabin-crane-lifting-placement.webp | 85 | 013c36dac9ff | Crane lifting a fire-rated porta cabin into position | Crane placement shown for illustration; unloading and crane arrangements are confirmed per order, no crane service is promised |
| fire-rated-porta-cabin-trailer-transport.webp | 107 | d575e80912f6 | Fire-rated porta cabin loaded on a multi-axle trailer | Transport shown for illustration; freight follows the published trailer ladder, route confirmed at order |

Captions are **copy**: reproduce them verbatim, same rules as section 1.

---

## 5. FEATURE_CELLS data (per-variant hero table)

The static five-row hero table is **withdrawn for this cluster** by owner ruling. The live `FEATURE_CELLS` component takes these values.

| Variant | Size | Material | Delivery | Coverage | Brand | Application |
|---|---|---|---|---|---|---|
| SZ-01 | 10x10x8.5 ft (100 sq ft) | Heavy MS frame + 75-100 mm mineral wool | 7-21 working days | Pan-India, 15+ states served | SAMAN Portable | Permit and gate documentation office |
| SZ-02 | 20x8x8.5 ft (160 sq ft) | Heavy MS frame + 75-100 mm mineral wool | 7-21 working days | Pan-India, 15+ states served | SAMAN Portable | Narrow-plot office, standard-trailer move |
| SZ-03 | 20x10x8.5 ft (200 sq ft) | Heavy MS frame + 75-100 mm mineral wool | 7-21 working days | Pan-India, 15+ states served | SAMAN Portable | Two-desk site office (reference size) |
| SZ-04 | 20x12x8.5 ft (240 sq ft) | Heavy MS frame + 75-100 mm mineral wool | 7-21 working days | Pan-India, 15+ states served | SAMAN Portable | Office with meeting or induction table |
| SZ-05 | 40x10x8.5 ft (400 sq ft) | Heavy MS frame + 75-100 mm mineral wool | 7-21 working days | Pan-India, 15+ states served | SAMAN Portable | Partitioned multi-room site block |
| SZ-06 | 40x12x8.5 ft (480 sq ft) | Heavy MS frame + 75-100 mm mineral wool | 7-21 working days | Pan-India, 15+ states served | SAMAN Portable | Control and document rooms, tender format |

## 6. Six-size price ladder (page-facing surfaces only)

Source: Revised priced workbook, sheet `06 Fire-Rated Porta Cabin`, PC-FR-06. **Never feed these into the calculator** (Standing Rules PART 1-A).

| Size code | Size | Area sq ft | Ex-GST | Incl. 18% GST |
|---|---|---|---|---|
| SZ-01 | 10x10x8.5 ft | 100 | Rs 1,78,250 | Rs 2,10,335 |
| SZ-02 | 20x8x8.5 ft | 160 | Rs 2,72,800 | Rs 3,21,904 |
| SZ-03 | 20x10x8.5 ft | 200 | Rs 3,10,000 | Rs 3,65,800 |
| SZ-04 | 20x12x8.5 ft | 240 | Rs 3,57,120 | Rs 4,21,402 |
| SZ-05 | 40x10x8.5 ft | 400 | Rs 5,89,000 | Rs 6,95,020 |
| SZ-06 | 40x12x8.5 ft | 480 | Rs 6,99,360 | Rs 8,25,245 |

## 7. Specification tables

Reproduce Tab 2 Table 1 and Table 2 exactly as written in the approved draft (`PC-05-fire-rated-porta-cabin-draft-v1.md`, Section D, Tab 2). Both tables and the `SPEC_NARRATIVE` field in section 1 above are approved copy: verbatim, no reordering, no row merging, classification column retained.

## 8. Internal links

| Source | Anchor | Destination |
|---|---|---|
| Section 2, paragraph 1 | MS porta cabin | /product/porta-cabins/ms-porta-cabin |
| Section 2, paragraph 2 (CTA) | contact page | https://www.samanportable.com/contact |
| Description, boundary note | soundproof porta cabin | /product/porta-cabins/soundproof-porta-cabin |
| Description, closing | porta cabins range | /product/porta-cabins |

Four links, no more. The Section 2 destination is not repeated in the Description. `/product/porta-cabins/soundproof-porta-cabin` returns 404 today: that is accepted in writing under the cluster 404 ruling with a 48-hour post-deploy check. Add no other links, and none to `steel-porta-cabin`, `portable-cabin` or any redirect-slated URL.
