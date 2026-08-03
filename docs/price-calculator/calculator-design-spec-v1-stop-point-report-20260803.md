# CALCULATOR DESIGN SPEC v1 — STOP-POINT REPORT

Date: 2026-08-03 · Agent: Claude Code · For: Fable 5 / SAMAN
Status: **HALTED at both Part 8 stop points. Nothing built. No files modified.**

---

## 0 · SUMMARY

Both Part 8 stop points are reached, and both are answered with workbook and code
evidence below. In addition, a defect larger than anything in Part 1 was found while
assembling the Part 2 evidence and is reported in section 5: **16 of the 19 non-colony
product routes price the cabin differently from the price the same page publishes.**
That is a Part 6 violation and it blocks Phase 1.

A third blocker is procedural: there is no approved content draft for the calculator,
and the spec requires authored sentences. See section 7.

---

## 1 · P0 DEFECTS — ALL FOUR CONFIRMED (static verification)

### 1.1 Sticky header does not update — CONFIRMED

`public/scripts/cabin-cost-calculator.js` writes to exactly one summary node:

```
248:    setText(root, '[data-mobile-estimate]', quoteOnly ? 'On request' : INR.format(total));
```

`[data-summary-product]`, `[data-summary-size]`, `[data-summary-ex]` and
`[data-summary-incl]` are rendered once by the server (`cabinCalculatorSSR.ts:1319`)
and never touched by the enhancer. The header is static text after first paint.

### 1.2 All steps visible — CONFIRMED

`cabinCalculatorSSR.ts:1281` `const visibleSteps = embedded ? stepDefinitions.slice(1) : stepDefinitions;`
`cabinCalculatorSSR.ts:1307` `const renderedSections = embedded ? allSections.slice(1) : allSections;`

All sections render as siblings. Step count today: **9 standalone, 8 embedded**
(embedded drops the product step). Nothing hides the inactive steps.

### 1.3 No-JS POST is broken — CONFIRMED

SSR form fields (`cabinCalculatorSSR.ts:1304`): `fullName`, `mobile`, `email`.
API guard (`src/pages/api/enquiry.ts:22`):

```
if (!firstName || !email || !phone || !message || (!isLabourColony && !lastName)) {
  return res.status(400).json({ message: 'Missing required fields' });
}
```

A native submit sends no `firstName`, no `lastName`, no `phone` → HTTP 400. Confirmed
by field comparison; fix belongs at the form as the spec directs.

### 1.4 Emoji — CONFIRMED, 22 occurrences

| File | Emoji chars |
|---|---|
| `src/lib/cabinCalculatorSSR.ts` | 20 (19 in `PRODUCT_ICON`, line 167–187; 1 fallback `🏭` at line 1144) |
| `src/pages/cabin-cost-calculator.tsx` | 2 |
| `public/scripts/cabin-cost-calculator.js` | 0 |

### 1.5 Locked product name — CONFIRMED, and worse than reported

Full 23-route table in section 4. Fable 5 reported one wrong name. There are **seven**.

---

## 2 · STOP POINT A · PART 2 HUB CANDIDATE TABLE

Selection rule applied: hub pages only, approved price ladder required, nine steps
must be meaningful. **I have not chosen the twelve. Fable 5 selects.**

Ladder evidence: `src/data/products/*.json` (`variants[].priceExGst`), which is the
same data the product pages publish. "Lowest published price" is the smallest
`priceExGst` in that hub's own ladder, ex-GST.

| # | Hub route | Live? | Approved ladder | Lowest published (ex-GST) | Steps meaningful | Qualifies |
|---|---|---|---|---|---|---|
| 1 | `/product/porta-cabins` | yes | yes — `porta-cabins.json`, 9 sizes | ₹1,37,500 | all 9 | **YES** |
| 2 | `/product/portable-cabin` | yes, 11 routes | yes — `portable-cabin.json`, 9 sizes | ₹1,37,500 | all 9 | **YES** |
| 3 | `/product/portable-office` | yes | yes — `portable-office.json`, 9 sizes | ₹1,48,500 | all 9 | **YES** |
| 4 | `/product/container-offices` | yes | yes — `container-offices.json`, 9 sizes | ₹1,59,500 | all 9 | **YES** |
| 5 | `/product/labor-colony` | yes | yes — `labor-colony.json`, 6 blocks | ₹19,44,000 | **3 of 9** — see note A | **NO** |
| 6 | `/product/container-houses` | yes, 14 routes | **no** — synthetic ×1.15 uplift, note B | n/a | all 9 | **NO** |
| 7 | `/product/container-cafe` | yes, 15 routes | **no** — no ladder JSON exists | n/a | all 9 | **NO** |
| 8 | `/product/security-cabins` | yes, 6 routes | **no** — no ladder JSON exists | n/a | all 9 | **NO** |
| 9 | `/product/portable-toilet` | yes, 7 routes | **no** — no hub ladder JSON exists | n/a | all 9 | **NO** |
| 10 | `/product/prefabricated-houses` | yes, 7 routes | **no** — no ladder JSON exists | n/a | all 9 | **NO** |
| 11 | `/product/industrial-sheds` | yes, 9 routes | **no** — no ladder JSON exists | n/a | partial | **NO** |
| 12 | `/product/prefab-buildings` | yes, 10 routes | **no** — no ladder JSON exists | n/a | partial | **NO** |
| 13 | `/product/peb-constructions` | yes, 12 routes | **no** — no ladder JSON exists | n/a | partial | **NO** |
| 14 | `/product/pre-engineered-buildings` | yes, 8 routes | **no** — no ladder JSON exists | n/a | partial | **NO** |

Panel and sheet categories (`puf-panel`, `pir-panel`, `rockwool-panel`, `eps-panel`,
`glass-wool-panel`, `sandwich-panel`, `roofing-sheet`, `wall-sheet`) are excluded: they
are not cabins and the nine steps are meaningless for them.

**Note A — labour-colony.** `computeCalculatorEstimate` wraps steps 3–7 in
`if (!colony) { … }` (`cabinCalculatorSSR.ts:1094–1115`). For colony products the
structure, interior, doors, windows, PUF-thickness, rooms and height deltas are all
skipped, and electrical and add-ons are pushed to `'quotation'` with a null price
(lines 1116–1117). Only size-as-block, delivery and quotation actually price. Five of
the nine steps are decorative for this hub.

**Note B — container-houses.** `calculatorRates.ts:64–70` derives every container-home
price as `containerOffices` or `shippingContainerOffices` × 1.15 (× 1.2 for luxury).
That is a code-side uplift with no published ladder and no workbook row behind it.

### What this table means

The cap of twelve is not the binding constraint. **Only four hubs qualify.** Adding
labour-colony on a relaxed step-meaningfulness test makes five. To reach twelve, either
eight new hub ladders must be approved and published, or the "hub pages only" rule must
be relaxed — and relaxing it re-imports the hub-versus-subpage confusion the rule exists
to remove.

Recommendation for Fable 5's ruling: ship the product step with the four qualifying hubs
and drop the "twelve" target, rather than pad the list with hubs that have no price.

---

## 3 · STOP POINT B · PART 3, STEP 3 STRUCTURE — EVIDENCE

Current code (`cabinCalculatorSSR.ts:189–194`), deltas are **rupees per sq ft**, applied
as `structureRate × area × quantity` at line 1098:

| Option | Delta | On a 20×10 (200 sq ft) |
|---|---|---|
| MS frame + insulated panel | ₹0 | ₹0 |
| GI-coated frame | ₹45/sq ft | ₹9,000 |
| Heavier structural frame | ₹60/sq ft | ₹12,000 |
| Container-form Corten build | ₹75/sq ft | ₹15,000 |

Search scope: all 16 specification workbooks under
`Best-UX-UI/all-product-images-technical-specifications/`, 200+ sheets, full cell scan.

### Corten — REMOVE. Confirmed.

**Zero hits for `corten` or `cor-ten` in any workbook, any sheet, any cell.**

Sheet 44 (`44 Container Restaurant`) row 5 reads: *"factory-fabricated MS corrugated
container-style cabin … 150×75×5 mm MS C-channel or engineered built-up base"*. Rows
14–21 are all mild steel.

`Sources and Notes` row 8 is explicit and binding:

> "Container office and cafe products are not converted used ISO shipping containers."

Sheet 38 row 55: *"New factory-built MS construction recreates shipping-container styling
without using a used ISO shell."*

The workbook does not merely omit Corten — it affirmatively denies the platform. Ruling
upheld.

### GI-coated frame — REMOVE. Confirmed.

`Porta_Cabin_Frame_Material_and_Dimensions_Thickness_Options.xlsx` — the frame workbook —
has **zero** GI or galvanized hits across all 4 sheets.

43 GI/galvanized hits exist elsewhere, and every one is a non-structural item:

- panel skins — *"Pre-Painted Galvanized Iron Sheet on both sides"* (PUF panel workbook)
- cladding — *"0.45 mm corrugated galvanized colour coated sheet"*
- ceiling framework — *"Use GI framework; moisture/fire grade as needed"*
- fasteners — *"stainless/galvanized fasteners where suitable"*
- floor supports — *"50×50×2.5 mm galvanized/painted floor supports"*

Not one row offers a GI-coated **structural frame** as a purchasable alternative, and no
row carries a price delta for one. Ruling upheld.

### Heavier frame — REMOVE. Gauge exists; price delta does not.

The spec's test: *"survives only if the workbook carries the gauge **and** an approved
price delta."*

**Gauge: carried.** `Thickness Ladder` sheet, Bottom Frame column:

| Level | Bottom frame | Cost Effect column |
|---|---|---|
| Lower Thickness | 100×50×3 mm | Lowest |
| Common Standard | 100×50×3 mm | Standard |
| Higher Standard | 125×75×4 or 150×75×5 mm | Medium-high |
| Heavy Thickness | 150×75×5 mm | High |
| Premium Custom | 150×75×5 mm | Premium |

**Price delta: not carried.** "Cost Effect" is qualitative text — Lowest / Standard /
Medium-high / High / Premium. It is not a number and cannot be converted to one.

The only sheet with price columns is `Costing Sheet 20x10`, and it is an empty input
template:

- `Price / sq.ft.` — **blank in all 55 rows**
- `Estimated Base Price` — **blank in all 55 rows**
- `Status` — **"Pending" in all 55 rows**
- Sheet header row 3: *"Enter the price per sq.ft.; the estimated base value calculates
  automatically for 200 sq.ft."*

The workbook carries no approved price for anything, so it cannot carry an approved
delta for a heavier frame. The ₹60/sq ft in the code has no source. Heavier frame fails
the spec's own two-part test.

### Consequence — Step 3 stops being a choice

One option survives: the newly fabricated MS structural frame with insulated panel
construction, sourced from sheet 01 rows 14–19, carrying the approved disclosure that it
is newly fabricated and not a converted shipping container.

Per the ruling, Step 3 becomes a stated-standard disclosure, and the step count drops:

| | Today | After |
|---|---|---|
| Standalone `/cabin-cost-calculator` | 9 | **8** |
| Embedded on a product page | 8 | **7** |

Note this changes the spec's own wording in Part 7 gate 2 ("all eight present in raw
HTML") to seven embedded.

Container-derived construction remains available as a quotation branch carrying no
number, exactly as Part 3 directs.

---

## 4 · GATE 5 · LOCKED PRODUCT NAME ON ALL 23 ROUTES

Derived from `resolveEmbeddedCalculatorProduct()` in `cabinCalculatorEmbedRoutes.ts`
applied to the 140 product URLs in `public/sitemap-products.xml`. Exactly 23 routes
render the calculator, matching the spec's count.

| # | Route | Locked name rendered | Correct? |
|---|---|---|---|
| 1 | `/product/porta-cabins` | Portable Cabin | **WRONG** → Porta Cabin |
| 2 | `/product/porta-cabins/low-cost-porta-cabin` | Portable Cabin | **WRONG** → Porta Cabin |
| 3 | `/product/porta-cabins/luxury-porta-cabin` | Portable Cabin | **WRONG** → Porta Cabin |
| 4 | `/product/porta-cabins/mini-porta-cabin` | Portable Cabin | **WRONG** → Porta Cabin |
| 5 | `/product/porta-cabins/ms-porta-cabin` | Portable Cabin | **WRONG** → Porta Cabin |
| 6 | `/product/porta-cabins/porta-cabin-shop` | Portable Cabin | **WRONG** → Porta Cabin |
| 7 | `/product/porta-cabins/steel-porta-cabin` | Porta Cabin | ok |
| 8 | `/product/porta-cabins/porta-cabin-with-toilet` | Toilet Cabin | ok |
| 9 | `/product/porta-cabins/portacabin-office` | Office Cabin | ok |
| 10 | `/product/portable-office` | Office Cabin | ok |
| 11 | `/product/portable-office/modern-office-cabin` | Office Cabin | ok |
| 12 | `/product/portable-office/portable-office-container` | Office Cabin | **WRONG** → Site Office |
| 13 | `/product/portable-office/prefabricated-office-cabins` | Office Cabin | ok |
| 14 | `/product/portable-office/readymade-office-cabin` | Office Cabin | ok |
| 15 | `/product/portable-office/small-office-cabin` | Office Cabin | ok |
| 16 | `/product/container-offices` | Container Office | ok |
| 17 | `/product/container-offices/container-office-cabin` | Container Office | ok |
| 18 | `/product/container-offices/shipping-container-office` | Container Office | ok |
| 19 | `/product/container-offices/site-office-container` | Site Office | ok |
| 20 | `/product/labor-colony` | Labour Colony | ok |
| 21 | `/product/labor-colony/labor-sheds` | Labour Sheds | ok |
| 22 | `/product/labor-colony/labor-hutments` | Labour Hutments | ok |
| 23 | `/product/labor-colony/prefab-labor-camps` | Prefab Labour Camps | ok |

**Seven wrong, not one.**

Root cause for rows 1–6: `resolveForPortaCabins()` falls through to `return 'portable-cabin'`
(line 49) for any porta-cabins slug not in `NORMALIZED_PORTA_SLUG_TO_PRODUCT`. Only
`steel-porta-cabin` and `small-portacabin` are in that map, so every other Porta Cabin
page renders the highest-risk wrong term on this site.

Root cause for row 12: the `portable-office` category short-circuits to `office-cabin`
(line 89) before the slug map — which does contain
`'portable-office-container': 'site-office'` — is ever consulted.

### Coverage gaps found while building this table

| Category | Routes | Calculator? | Note |
|---|---|---|---|
| `portable-cabin` | 11 | **no** | Resolver tests `portable-cabins` (plural); the live category is singular |
| `container-houses` | 14 | **no** | `PRODUCTS` defines 5 container-home entries that no route can reach |
| `container-cafe` | 15 | **no** | `PRODUCTS` defines `container-cafe`; unreachable |
| `security-cabins` | 6 | **no** | `PRODUCTS` defines `security-cabin`; unreachable |
| `portable-toilet` | 7 | **no** | `PRODUCTS` defines `toilet-cabin`; reachable only via a porta-cabins subpage |

Eight of the 19 products in the product step have no route that can lock to them.

---

## 5 · UNREPORTED P0 · 16 OF 19 ROUTES CONTRADICT THEIR OWN PUBLISHED PRICE

This was not in the spec. It is larger than anything in Part 1 and it violates Part 6.

The calculator prices from a per-product `referenceRate` constant
(`cabinCalculatorSSR.ts:145–165`) run through `calculateAreaBandBase()`. There are 8
reference rates for 19 routes, so subpages inherit their parent bucket's rate instead of
their own ladder. `publishedPrice()` (line 1061) looks up `productPriceRows()`, which for
a `referenceRate` product returns the **calculated** figure (line 1210) — so the "ladder
lookup" never reads the subpage's own published JSON.

Comparison at the 10×10 ft / 100 sq ft row, ex-GST:

| Route | Page publishes | Calculator shows | |
|---|---|---|---|
| `/product/porta-cabins` | ₹1,37,500 | ₹1,37,500 | ok |
| `/product/porta-cabins/low-cost-porta-cabin` | ₹1,32,000 | ₹1,37,500 | **+₹5,500** |
| `/product/porta-cabins/luxury-porta-cabin` | ₹2,03,500 | ₹1,37,500 | **−₹66,000** |
| `/product/porta-cabins/mini-porta-cabin` | ₹1,32,000 | ₹1,37,500 | **+₹5,500** |
| `/product/porta-cabins/ms-porta-cabin` | ₹1,98,000 | ₹1,37,500 | **−₹60,500** |
| `/product/porta-cabins/porta-cabin-shop` | ₹1,54,000 | ₹1,37,500 | **−₹16,500** |
| `/product/porta-cabins/porta-cabin-with-toilet` | ₹1,65,000 | price on request | **published price suppressed** |
| `/product/porta-cabins/portacabin-office` | ₹1,59,500 | ₹1,48,500 | **−₹11,000** |
| `/product/porta-cabins/steel-porta-cabin` | ₹1,98,000 | ₹1,37,500 | **−₹60,500** |
| `/product/portable-office` | ₹1,48,500 | ₹1,48,500 | ok |
| `/product/portable-office/modern-office-cabin` | ₹1,55,900 | ₹1,48,500 | **−₹7,400** |
| `/product/portable-office/portable-office-container` | ₹1,51,500 | ₹1,48,500 | **−₹3,000** |
| `/product/portable-office/prefabricated-office-cabins` | ₹1,45,500 | ₹1,48,500 | **+₹3,000** |
| `/product/portable-office/readymade-office-cabin` | ₹1,41,100 | ₹1,48,500 | **+₹7,400** |
| `/product/portable-office/small-office-cabin` | ₹1,44,000 | ₹1,48,500 | **+₹4,500** |
| `/product/container-offices` | ₹1,59,500 | ₹1,98,000 | **+₹38,500** |
| `/product/container-offices/container-office-cabin` | ₹1,37,500 | ₹1,98,000 | **+₹60,500** |
| `/product/container-offices/shipping-container-office` | ₹1,98,000 | ₹1,98,000 | ok |
| `/product/container-offices/site-office-container` | ₹1,48,500 | ₹1,59,500 | **+₹11,000** |

**16 mismatched, 3 correct.** The error runs both ways — up to ₹66,000 under the
published price on `luxury-porta-cabin`, and ₹60,500 over it on `container-office-cabin`.

Worth noting: the existing `V9_FORMULA_VERIFICATION = { ladders: 38, rows: 342,
mismatches: 0 }` in `calculatorRates.ts:87` and the "15 of 15 at zero difference" parity
audit both pass, because both check the formula against the three ladders the formula was
derived from. Neither checks a route against the price its own page publishes. The audit
that passes is not the audit that matters.

Fix direction (not built): resolve each route to its own product JSON and read
`variants[].priceExGst` directly, so a published size is a lookup and never a
recalculation — which is what Part 6 already requires.

---

## 6 · REPOSITORY STATE — NEEDS A RULING

| Item | State |
|---|---|
| Current branch | `static-migration-work` |
| PR #110 branch | `feature/social-media-seo-foundation-20260802` |
| PR #110 title | "Port v9 cabin cost calculator with verified pricing" |

The calculator work in the working tree is **untracked and uncommitted**, and is well
ahead of what PR #110 contains:

| File | On PR #110 | In working tree |
|---|---|---|
| `src/lib/cabinCalculatorSSR.ts` | 604 lines | 1321 lines |
| `public/scripts/cabin-cost-calculator.js` | 370 lines | 393 lines |
| `src/lib/cabinCalculatorEmbedRoutes.ts` | absent | 110 lines |

Every line number and finding in this report refers to the **working tree**, which is the
newer code. Before any build starts, someone must rule on whether this work is committed
to the PR #110 branch or to a new branch off it. I have changed nothing and committed
nothing.

---

## 7 · CONTENT GATE — HALT REQUIRED UNDER CLAUDE.md

CLAUDE.md hard gates 1 and 4 are unambiguous:

> "Never write page content sentences yourself — not a heading, not a FAQ answer, not a
> button label, not a placeholder."
> "If ANY element is missing from the draft … HALT and ask. Never fill a gap with a
> default."

The spec requires authored copy that no approved draft supplies. `page-structure/content-drafts/`
contains no calculator draft. Missing and required before Phase 1 can be built:

1. The step heading for each of the 7 or 8 surviving steps.
2. The one sentence of plain-language help per step (Part 5). The nine strings currently
   in `STEP_GUIDANCE` (lines 196–206) were written by code, not drafted.
3. The Step 3 stated-standard disclosure wording, including the approved
   newly-fabricated / not-a-converted-container line.
4. Button labels — Back, Start over, Next, and the primary CTA.
5. The closed-bar label on product pages (Part 5).
6. The estimate-panel headings and fine print.
7. The wording of the quotation branch for container-derived construction.

I have not written any of these and will not. Gate 9 — confirming no label or heading is
copied from the competitor — cannot be signed by me either way until the draft exists,
because the strings do not yet exist to compare.

---

## 8 · WHAT I NEED FROM FABLE 5 / SAMAN

1. **Part 2** — select the product-step list from section 2. Only four hubs qualify.
   Confirm whether to ship four, or to relax a rule, and which.
2. **Part 3** — confirm the Step 3 collapse to a stated-standard disclosure, and the
   resulting 8 standalone / 7 embedded step count.
3. **Section 5** — rule on the 16 price mismatches. My reading is that this must be
   fixed before Phase 1 layout work, because Phase 1 renders these numbers into a new
   design and would harden the error.
4. **Section 4** — confirm the correct locked name for the six porta-cabins routes and
   for `portable-office-container`, and rule on the five uncovered categories.
5. **Section 6** — rule on the branch.
6. **Section 7** — commission the Claude Senior content draft.

Nothing built. No files modified. No preview URLs, because there is nothing new to
preview. PR #110 untouched and unmerged.
