# CODEX PROMPT: C-03 EVENT G, BUILD THE HUB AND READYMADE
<!-- PASTE INTO A NEW CODEX SESSION. Fresh worktree off origin/static-migration, which now includes Event F merge 9c9ab0d3. -->

You build and validate. **You decide nothing.** Any gap, ambiguity or conflict → **STOP and report to Fable 5.**

## 0 · WHY THIS IS ONE SESSION AND NOT SIX

SAMAN asked whether the six C-03 page builds can run in parallel. **They cannot, and the reason is mechanical.** All six pages write into the same three shared files: `section-h-datasets.json`, `specs-tab-dataset.json` and `rightToExistEntries.tsx`. Six worktrees editing the same three files produces six merge conflicts.

So C-03 content is **one session, pages added incrementally**. Packs 3 to 6 arrive as Event H and append to this same branch. Parallelism belongs across clusters, not across pages inside one.

## 1 · HARD GATE 1: WRITE THE DRAFTS FIRST

Your AGENTS.md requires an approved draft under `page-structure/content-drafts/`. **Create these two files from the verbatim content in this prompt before building anything:**

- `page-structure/content-drafts/C03-COPY-PACK-1-portable-office-hub-28Jul2026.md`
- `page-structure/content-drafts/C03-COPY-PACK-2-readymade-office-cabin-28Jul2026.md`

Every string below is **L4 verbatim**. Character counts are gate-checked. Changing one word breaks an acceptance gate.

## 2 · WHAT EXISTS ALREADY, AND WHAT DOES NOT

Per your own Event F inventory: `portable-office` **already has** variant JSON and an explorer dataset. `readymade-office-cabin` **has neither**. Neither has a specs entry or a right-to-exist entry.

**Report the existing `src/data/products/portable-office.json` before you touch it**, in full. I am replacing its `variants` array and I need to see what else it carries so nothing is lost.

## 3 · VARIANT JSON

`hsn` is marked `__COPY_FROM_EXISTING_portable-office.json__` in both files below. **Take the real value from the existing hub file and use it in both. If that file has no `hsn`, STOP and report** rather than choosing one.

`images` is deliberately `[]` with `imagesPending: true`. Your schema report confirms an empty array renders the existing placeholder. **Images land in a later event once the manifest exists. Do not invent image entries**, since `VariantImage` requires real `width` and `height` with no fallback.

`hasProductVideo` is absent on both. Leave it absent. L18 forbids estimated `VideoObject` values.

```json
{
  "portable-office": {
    "productSlug": "portable-office",
    "productName": "Portable Office Cabin",
    "variantAxis": "size",
    "defaultVariant": "20x10",
    "hsn": "__COPY_FROM_EXISTING_portable-office.json__",
    "gstPercent": 18,
    "applicationsDataset": "portable-office",
    "emitAggregateOffer": true,
    "variants": [
      {
        "sizeSlug": "10x10",
        "label": "10×10 ft",
        "dims": "10×10×8.5 ft",
        "areaSqft": 100,
        "priceExGst": 148500,
        "priceInclGst": 175230,
        "useCase": "Gate and plot offices",
        "sku": "S64-28-SZ-01",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "20x8",
        "label": "20×8 ft",
        "dims": "20×8×8.5 ft",
        "areaSqft": 160,
        "priceExGst": 237600,
        "priceInclGst": 280368,
        "useCase": "Boundary-line offices",
        "sku": "S64-28-SZ-08",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "20x10",
        "label": "20×10 ft",
        "dims": "20×10×8.5 ft",
        "areaSqft": 200,
        "priceExGst": 270000,
        "priceInclGst": 318600,
        "useCase": "Four-desk site offices",
        "sku": "S64-28-SZ-02",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "20x12",
        "label": "20×12 ft",
        "dims": "20×12×8.5 ft",
        "areaSqft": 240,
        "priceExGst": 311040,
        "priceInclGst": 367027,
        "useCase": "Visitor and vendor corners",
        "sku": "S64-28-SZ-06",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "30x10",
        "label": "30×10 ft",
        "dims": "30×10×8.5 ft",
        "areaSqft": 300,
        "priceExGst": 388800,
        "priceInclGst": 458784,
        "useCase": "Office with secure store",
        "sku": "S64-28-SZ-03",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "40x8",
        "label": "40×8 ft",
        "dims": "40×8×8.5 ft",
        "areaSqft": 320,
        "priceExGst": 406080,
        "priceInclGst": 479174,
        "useCase": "Compound-edge offices",
        "sku": "S64-28-SZ-09",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "40x10",
        "label": "40×10 ft",
        "dims": "40×10×8.5 ft",
        "areaSqft": 400,
        "priceExGst": 507600,
        "priceInclGst": 598968,
        "useCase": "Full project offices",
        "sku": "S64-28-SZ-04",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "20x20",
        "label": "20×20 ft",
        "dims": "20×20×8.5 ft",
        "areaSqft": 400,
        "priceExGst": 507600,
        "priceInclGst": 598968,
        "useCase": "Project control rooms",
        "sku": "S64-28-SZ-05",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "40x12",
        "label": "40×12 ft",
        "dims": "40×12×8.5 ft",
        "areaSqft": 480,
        "priceExGst": 596160,
        "priceInclGst": 703469,
        "useCase": "Largest single offices",
        "sku": "S64-28-SZ-07",
        "images": [],
        "imagesPending": true
      }
    ]
  },
  "readymade-office-cabin": {
    "productSlug": "readymade-office-cabin",
    "productName": "Readymade Office Cabin",
    "variantAxis": "size",
    "defaultVariant": "20x10",
    "hsn": "__COPY_FROM_EXISTING_portable-office.json__",
    "gstPercent": 18,
    "applicationsDataset": "readymade-office-cabin",
    "emitAggregateOffer": true,
    "variants": [
      {
        "sizeSlug": "10x10",
        "label": "10×10 ft",
        "dims": "10×10×8.5 ft",
        "areaSqft": 100,
        "priceExGst": 141100,
        "priceInclGst": 166498,
        "useCase": "Gate and weighbridge posts",
        "sku": "S64-29-SZ-01",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "20x8",
        "label": "20×8 ft",
        "dims": "20×8×8.5 ft",
        "areaSqft": 160,
        "priceExGst": 225760,
        "priceInclGst": 266397,
        "useCase": "Difficult approach roads",
        "sku": "S64-29-SZ-08",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "20x10",
        "label": "20×10 ft",
        "dims": "20×10×8.5 ft",
        "areaSqft": 200,
        "priceExGst": 256400,
        "priceInclGst": 302552,
        "useCase": "Most-held stock size",
        "sku": "S64-29-SZ-02",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "20x12",
        "label": "20×12 ft",
        "dims": "20×12×8.5 ft",
        "areaSqft": 240,
        "priceExGst": 295440,
        "priceInclGst": 348619,
        "useCase": "Vendor handling corners",
        "sku": "S64-29-SZ-06",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "30x10",
        "label": "30×10 ft",
        "dims": "30×10×8.5 ft",
        "areaSqft": 300,
        "priceExGst": 369300,
        "priceInclGst": 435774,
        "useCase": "Secure store included",
        "sku": "S64-29-SZ-03",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "40x8",
        "label": "40×8 ft",
        "dims": "40×8×8.5 ft",
        "areaSqft": 320,
        "priceExGst": 385920,
        "priceInclGst": 455386,
        "useCase": "Compound edges and corridors",
        "sku": "S64-29-SZ-09",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "40x10",
        "label": "40×10 ft",
        "dims": "40×10×8.5 ft",
        "areaSqft": 400,
        "priceExGst": 482400,
        "priceInclGst": 569232,
        "useCase": "Reception plus open desks",
        "sku": "S64-29-SZ-04",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "20x20",
        "label": "20×20 ft",
        "dims": "20×20×8.5 ft",
        "areaSqft": 400,
        "priceExGst": 482400,
        "priceInclGst": 569232,
        "useCase": "Planning and control rooms",
        "sku": "S64-29-SZ-05",
        "images": [],
        "imagesPending": true
      },
      {
        "sizeSlug": "40x12",
        "label": "40×12 ft",
        "dims": "40×12×8.5 ft",
        "areaSqft": 480,
        "priceExGst": 566400,
        "priceInclGst": 668352,
        "useCase": "Twelve to fifteen staff",
        "sku": "S64-29-SZ-07",
        "images": [],
        "imagesPending": true
      }
    ]
  }
}
```

## 4 · EXPLORER DATASETS

Add both keys to `src/data/products/section-h-datasets.json`. The hub key already exists; **replace it entirely with the block below and report the old value first.**

```json
{
  "portable-office": {
    "h2": "Every portable office cabin size, and who each one suits",
    "guidanceLine": "Team figures come from standard workstation planning. Your approved drawing sets the final layout.",
    "10x10": {
      "h2": "10x10 ft, the single-desk cabin that starts a site",
      "intro": "One duty desk, a light point, a fan point and a socket pair, positioned in the factory before the cabin is loaded. At 100 square feet this is the smallest office we build as a complete unit, and its weight lets most plots place it without a crane. Gate posts, weighbridge rooms and supervisor points are where it earns its keep. Because the fit-out is preplanned rather than drawn per order, a second unit ordered months later arrives matching the first, which matters on sites that grow one cabin at a time.",
      "h3": "Uses",
      "applications": [
        "Gate and plot offices",
        "Weighbridge duty rooms",
        "Supervisor points",
        "Staged site growth"
      ]
    },
    "20x8": {
      "h2": "20x8 ft, the slim run that fits a boundary line",
      "intro": "Eight feet of depth against twenty of length, shaped for compound walls and roadside plots where a squarer body simply will not sit. Two desks line up along the long wall, each with its own socket pair, and the door lands at one end so neither position is disturbed by people coming and going. The narrow body travels on a standard trailer without permits, which is the reason most buyers choose this shape rather than the extra area of a 20x10. Approach roads decide it more often than floor space does.",
      "h3": "Uses",
      "applications": [
        "Boundary-line offices",
        "Roadside plot offices",
        "Toll and yard points",
        "Restricted approach roads"
      ]
    },
    "20x10": {
      "h2": "20x10 ft, the size most buyers actually mean",
      "intro": "Two hundred square feet is the reference size for this whole range, and the rate every other size is measured against. Four desks work without crowding, the switchboard and light rows sit where hundreds of previous dispatches have proved they should, and the fan points follow the same tested layout. Quotation to placement is quickest here because nothing needs deciding. Contractors who need an office working this month rather than next quarter start at this size, and a large share of repeat orders never move away from it.",
      "h3": "Uses",
      "applications": [
        "Four-desk site offices",
        "Fast project starts",
        "Repeat standard orders",
        "Rate benchmark size"
      ]
    },
    "20x12": {
      "h2": "20x12 ft, the width that buys a place to sit down",
      "intro": "Two extra feet of width buy a discussion corner rather than another desk: a small table and chairs beside the working positions, so vendors, drivers and visiting engineers are dealt with while the desks carry on. A socket pair lands at that corner in the factory, which means a printer or a charging point is live on day one instead of waiting for a site electrician. Everything else follows the standard build, so the step up from 20x10 buys floor and a planned corner, not a redesign or a longer lead time.",
      "h3": "Uses",
      "applications": [
        "Visitor and vendor corners",
        "Driver briefing points",
        "Engineer visit rooms",
        "Client-facing site offices"
      ]
    },
    "30x10": {
      "h2": "30x10 ft, the first size with a real store",
      "intro": "Three hundred square feet is where storage stops competing with people for floor. The rear third takes a partition and a lockable door, so instruments, drawings and consumables get a secure home while five or six staff work the front. The partition line is one of the few choices a buyer makes, picked from preset positions so the electrical layout stays factory-standard. Sites running an office and a separate store container consolidate into a single delivery, one placement and one power connection, which usually pays for the size step on its own.",
      "h3": "Uses",
      "applications": [
        "Office with secure store",
        "Instrument and drawing rooms",
        "Five to six desk teams",
        "Consolidating two units"
      ]
    },
    "40x8": {
      "h2": "40x8 ft, the long run built for leftover land",
      "intro": "Forty feet of frontage on eight of depth, built for compound edges, pipeline corridors and the strips of ground a project has left over rather than the ground it would have chosen. Seven or eight staff sit in a working line with socket pairs repeating at desk intervals. Despite the length it stays one factory-sealed body on one preplanned loom, so commissioning is a single connection at the switchboard rather than a joining exercise. Where a boundary wall is the only free land available, this shape turns that margin into an office.",
      "h3": "Uses",
      "applications": [
        "Compound-edge offices",
        "Pipeline corridors",
        "Seven-desk work lines",
        "Narrow residual plots"
      ]
    },
    "40x10": {
      "h2": "40x10 ft, three working zones inside one body",
      "intro": "A four-hundred-square-foot floor delivered as one body, dividing naturally into a reception end, an open desk run and a manager or records zone at the far end. Ten staff work it without pressure. The preplanned circuits repeat their tested pattern across all three zones, so the electrical fit-out that normally occupies a site electrician for a week is finished before the cabin is loaded. Projects with a two or three year horizon choose this length because it absorbs team growth without a second unit and a second placement.",
      "h3": "Uses",
      "applications": [
        "Full project offices",
        "Ten-desk deployments",
        "Reception-led layouts",
        "Multi-year site bases"
      ]
    },
    "20x20": {
      "h2": "20x20 ft, a square floor from two halves",
      "intro": "The same four hundred square feet as the 40x10, delivered as two factory-matched halves and joined on site into one square room. Desks cluster centrally or run along two walls, and the joint carries a sealed floor strip so the finished floor reads as one surface rather than two. Both halves ship with mirrored electrical sets that pair at the join, which keeps the preplanned promise intact across a two-piece build. Teams that plan and meet in the same room they work in choose the square over the long plan.",
      "h3": "Uses",
      "applications": [
        "Project control rooms",
        "Training and induction",
        "Central desk clusters",
        "Square or corner plots"
      ]
    },
    "40x12": {
      "h2": "40x12 ft, the largest single body we deliver",
      "intro": "At 480 sq ft this is the biggest office that still arrives in one piece, and the lowest rate per square foot in the range. The extra width allows a central aisle serving desks on both sides, so twelve to fifteen people move without turning sideways past chairs. Light rows, fan points, socket pairs and the switchboard all arrive tested, with a dedicated AC run where the order calls for one. Anything larger becomes a joined layout quoted against your drawing, and most site teams never reach that point.",
      "h3": "Uses",
      "applications": [
        "Largest single offices",
        "Twelve to fifteen staff",
        "Aisle-served desk plans",
        "Lowest rate per sq ft"
      ]
    }
  },
  "readymade-office-cabin": {
    "h2": "What arrives fitted in each Readymade Office Cabin size",
    "guidanceLine": "Stock-held sizes dispatch in 1 to 2 working days. Ask which are on the floor today.",
    "10x10": {
      "h2": "10x10 ft, one desk, nothing left to decide",
      "intro": "Our smallest finished unit leaves the floor with a duty desk position, one lighting point, one fan outlet and a pair of 6A sockets already wired and tested. Nobody specifies anything: the inclusion list is fixed, which is exactly why the cabin can be built ahead of an order rather than after one. Weight stays low enough for placement without lifting plant on most ground. Buyers taking one for a gate post or a weighbridge room usually want it inside the week, and a finished unit is the only way that timescale is met.",
      "h3": "Uses",
      "applications": [
        "Gate and weighbridge posts",
        "Same-week requirements",
        "Single duty positions",
        "No-specification orders"
      ]
    },
    "20x8": {
      "h2": "20x8 ft, two fitted positions in a narrow body",
      "intro": "Eight feet of depth keeps this inside trailer width without permits, and both desk positions arrive pre-wired down the long wall rather than being marked out after delivery. Door at the end, sockets at each position, switchboard where it always sits. Because none of that varies between units, we finish them before anyone asks for one. Sites with a difficult approach road choose the shape first and the fit-out second, and here the fit-out was settled, wired and tested long before the enquiry ever arrived.",
      "h3": "Uses",
      "applications": [
        "Difficult approach roads",
        "Two-position offices",
        "Compound boundary lines",
        "Permit-free transport"
      ]
    },
    "20x10": {
      "h2": "20x10 ft, the size we most often hold ready",
      "intro": "This is the finished unit we keep on the floor most consistently, simply because it is what most buyers ask for. Four working positions, lighting circuits, fan outlets and sockets all commissioned and tested before loading. The gap between placing an advance and having staff working inside is counted in days rather than weeks. Nothing about it is bespoke, and that is the whole point: a fixed inclusion list is what allows a cabin to exist before its buyer does, and to be handed over on the spot to whoever needs it.",
      "h3": "Uses",
      "applications": [
        "Most-held stock size",
        "Advance to occupancy in days",
        "Four working positions",
        "Urgent replacements"
      ]
    },
    "20x12": {
      "h2": "20x12 ft, a fitted corner as well as desks",
      "intro": "The extra width arrives finished as a seating corner rather than as bare floor: table space, chairs and a socket pair already positioned for a printer or a charging point. Vendors and drivers are handled there instead of at somebody's desk. As with every size on this page the corner position is fixed rather than drawn per order, so the unit can be completed and tested in advance. Buyers stepping up from the smaller body are paying for a finished corner rather than for a longer lead time and a fresh drawing.",
      "h3": "Uses",
      "applications": [
        "Vendor handling corners",
        "Printer and charge points",
        "Visitor-facing site offices",
        "Finished, not drawn"
      ]
    },
    "30x10": {
      "h2": "30x10 ft, office and lockable store, both finished",
      "intro": "Three hundred square feet arriving with the rear partition already built and its lock already fitted, so instruments and consumables have somewhere secure on the day of placement rather than the week after. Five or six positions work the front section, each pre-wired. The partition sits on a preset line, which keeps the electrical layout standard and keeps the unit buildable ahead of demand. Sites that would otherwise take an office and a separate store settle this with one delivery and one connection.",
      "h3": "Uses",
      "applications": [
        "Secure store included",
        "Instrument holding",
        "Five to six positions",
        "One delivery, not two"
      ]
    },
    "40x8": {
      "h2": "40x8 ft, a long finished run for a narrow strip",
      "intro": "Forty feet of working line on eight of depth, wired end to end before dispatch, with sockets repeating at every position along the long wall. Seven or eight staff work it. Length does not mean assembly here: it arrives as one sealed body on one tested loom, so bringing it live is a single connection rather than a joining job. Where a compound edge or a service corridor is the only ground a project has spare, this shape turns that leftover strip into a working office with no site electrical work required at all.",
      "h3": "Uses",
      "applications": [
        "Compound edges and corridors",
        "Seven to eight positions",
        "One-connection handover",
        "No site electrical work"
      ]
    },
    "40x10": {
      "h2": "40x10 ft, three finished zones, one body",
      "intro": "Reception, open desks and a manager or records end, every one of them commissioned before the unit leaves us. Ten staff occupy it comfortably. The tested circuit pattern repeats across all three zones, which is why a fit-out that normally occupies an electrician for a week is simply absent from your programme. Projects running two or three years take this length because it holds a growing team without a second placement, and because a finished body starts earning its keep from the day it is set down rather than weeks later.",
      "h3": "Uses",
      "applications": [
        "Reception plus open desks",
        "Ten-staff occupancy",
        "Multi-year site bases",
        "Programme with no fit-out"
      ]
    },
    "20x20": {
      "h2": "20x20 ft, a square room from two finished halves",
      "intro": "Two factory-completed halves brought together on site as a single square room of four hundred square feet, each half wired and tested separately and designed to pair at the meeting line. The floor strip seals so the room reads as one surface. Mirrored electrical sets on either side keep the fixed-inclusion promise intact even though the unit travels in two pieces. Teams that plan, meet and work in the same room take the square rather than the long plan, and on this page they take it already finished and fully tested.",
      "h3": "Uses",
      "applications": [
        "Planning and control rooms",
        "Training and induction",
        "Two pieces, one room",
        "Mirrored fitted halves"
      ]
    },
    "40x12": {
      "h2": "40x12 ft, our largest single finished unit",
      "intro": "This is the largest body we complete in a single piece, 480 square feet of it, and it carries the lowest rate anywhere on this page. A middle walkway serves desks along both walls, so a team of twelve to fifteen has room to pass without shifting furniture. Lighting circuits, fan outlets, sockets, the switchboard and a dedicated air-conditioning run are all commissioned before loading. Above this size a layout is quoted from your drawing and made to order, so the finished-in-advance advantage ends right here.",
      "h3": "Uses",
      "applications": [
        "Twelve to fifteen staff",
        "Walkway-served desks",
        "Lowest rate on this page",
        "Largest finished body"
      ]
    }
  }
}
```

## 5 · RIGHT TO EXIST

Add both entries to the registry Event F generalised. Presence of an entry is now the only eligibility condition.

```json
{
  "portable-office": {
    "heading": "Why the range page and not a single cabin",
    "body": "This page carries the whole portable office cabin range so a buyer can compare nine sizes on one screen before choosing a configuration. Every unit here is newly fabricated on an MS frame in Bengaluru or Greater Noida, insulated, fitted and tested before dispatch, and delivered in 7 to 21 working days. Pick the size first on this page, then the configuration on the page that matches how you buy.",
    "comparison": "Need it from ready stock rather than built to order? The Readymade Office Cabin dispatches from the floor."
  },
  "readymade-office-cabin": {
    "heading": "Why choose Readymade over building to order",
    "body": "Every cabin on this page carries one fixed inclusion list, which is what allows us to finish units before anyone orders them rather than after. Sizes we are holding dispatch within 1 to 2 working days of advance; the rest are built to that same list on a 7 to 21 working day lead time. Choose this when the date matters more than the specification.",
    "comparison": "Want a specified finish instead of a fixed one? The Modern Office Cabin is drawn to your brief, not held on the floor."
  }
}
```

## 6 · L3 CHANGE ON THE HUB ONLY

Authorised by SAMAN, 28 Jul 2026. `readymade-office-cabin` L3 fields are in its draft and also change.

| Page | Field | Value |
|---|---|---|
| hub | title | `Portable Office Cabin │ 9 Sizes, Factory-Fitted │ SAMAN` |
| hub | H1 | `Portable Office Cabin` |
| hub | meta | `Portable office cabins built and fitted in our own factory, delivered in 7 to 21 working days. Nine standard sizes, fixed-price quote in 48 hours.` |
| readymade | title | `Readymade Office Cabin │ Ready to Dispatch │ SAMAN` |
| readymade | H1 | `Readymade Office Cabin` |
| readymade | meta | `Readymade office cabins finished, wired and tested before you order. Stock sizes dispatch in 1 to 2 working days. Nine sizes, fixed inclusion list.` |

**First 100 words, hub, verbatim:**

> A portable office cabin is a factory-built, fully fitted workspace that arrives complete and starts working the day it lands. SAMAN builds them in nine standard sizes, from a single-desk 10×10 ft cabin to a 40×12 ft floor for twelve or more staff, with AC provision, false ceiling, partition walls and electrical fittings all in place before dispatch. Delivery runs 7 to 21 working days anywhere in India, and a fixed-price quote comes back within 48 hours. These are newly fabricated MS cabins, not converted shipping containers, and not site sheds you replace inside a year.

**First 100 words, readymade, verbatim:**

> A readymade office cabin is one we have already built. It is wired, fitted, tested and standing on our floor in Bengaluru or Greater Noida before anyone orders it, which is only possible because every unit carries the same fixed inclusion list rather than a drawing of its own. Sizes we are holding leave within 1 to 2 working days of advance. The rest are built to that identical list on a 7 to 21 working day lead time. Newly fabricated on an MS frame, not a converted shipping container, and never a specification you have to write yourself.

## 7 · ENCODING

`×` is U+00D7 and `│` is U+2502, both raw UTF-8. If either arrives corrupted that is a transport fault: **re-transmit, never adjust the string.** We fixed 353 mojibake occurrences today from exactly this cause.

## 8 · NOT IN THIS EVENT

No specs-tab entries yet: I am writing those against your schema and they follow in Event H. No images. No PDFs. No schema block changes beyond what the variant JSON drives. **No changes to the other four C-03 pages.**

## 9 · ACCEPTANCE

1. Both drafts exist under `page-structure/content-drafts/` and match this prompt byte for byte.
2. Both pages render the variant hero, the explorer and the right-to-exist block. State which layout each page resolved to.
3. All 18 variant rows show the ex-GST price from section 3 and an incl-GST figure at 18%. Print the table you rendered.
4. Character counts asserted in the built output: 9 tab titles per page in 40-65, 9 bodies per page in 500-620, all use-case labels 15-45, RTE body 340-430.
5. Zero em dashes introduced site-wide. Count before and after.
6. Zero pages other than these two changed. Content-layer diff across every live URL, not a sample.
7. The existing hub variant JSON and explorer values, reported before replacement.
8. The real `hsn` value used, and where it came from.
9. TypeScript clean, production build clean, postbuild clean.

Then: preview, report to Fable 5, **STOP**. Do not merge.

**Never merge locally and force-push to `static-migration`.** Never `git clean` against `page-structure/`.