# C-05 · REDIRECT REPAIR + LEGACY PRICE P0 — VALIDATION REPORT
**Date:** 08 Aug 2026
**Worktree:** `C:/tmp/saman-c05-redirect-price-20260808`
**Branch:** `agent/c05-redirect-legacy-price-20260808` (off `origin/static-migration` @ `a996515b`)
**Authority:** `OPUS5-RULING-C05-HUB-OWNERSHIP-AND-LEGACY-MAP-08Aug2026.md`, events 2 and 3

## PR structure — TWO parts, ONE PR

**PR #117 — https://github.com/amanzz/Samanportable/pull/117 — contains Part 1 only.**

Part 2 is not in any PR because **it produced zero code changes**. Every one of the nine
routes hit a stop condition written into the ticket's own gates before any edit was
authorised. There is nothing to open a second PR against. Details in Part 2 below.

Not merged. Not deployed.

---

# PART 1 · REDIRECT REPAIR — COMPLETE

Six destination strings changed across two files. Destination strings only; no reformat,
no reorder, no dedupe.

## G1 · Pre-change destination, post-change destination, and live status of every new destination

Status measured **before** the edit, against production, on 08 Aug 2026.

| # | Source | File | Destination BEFORE | Destination AFTER | New dest. live status | Hops |
|---|---|---|---|---|---|---|
| 1 | `/project/container-cafe` | next.config.js:867 | `/product-category/container-cafe` | `/product/container-cafe` | **200** | 0 |
| 2 | `/project/container-cafe-india` | next.config.js:862 | `/product-category/container-cafe` | `/product/container-cafe` | **200** | 0 |
| 3 | `/project/container-cafes` | next.config.js:1412 | `/product-category/container-cafe` | `/product/container-cafe` | **200** | 0 |
| 4 | `/project/container-cafes-in-bangalore` | next.config.js:1407 | `/product-category/container-cafe` | `/product/container-cafe` | **200** | 0 |
| 5 | `/project/container-hotel-for-sale` | next.config.js:1422 | `/product-category/container-houses` | `/product/container-cafe/container-hotel` | **200** | 0 |
| 6 | `/container-cafes-in-central-delhi-2` | next.config.js:348 | `/container-cafes-in-central-delhi` | *(unchanged)* | **200** | 0 |
| 7 | `/restaurant-food-containers` | redirects-from-csv.js:320 | `/product/container-houses` | `/product/container-cafe/container-restaurant` | **200** | 0 |

`/product-category/container-cafe` was additionally measured: **200, 0 hops.** It is not
redirected and stays live. It is simply no longer a redirect destination.

No destination was substituted. No line was stopped.

## G2 · Diff line count

**6 destination strings changed across 2 files. 12 diff lines: 6 removals, 6 additions.**
`git diff --stat`: `next.config.js | 10 +++++-----`, `redirects-from-csv.js | 2 +-`.

**Discrepancy against the ticket, reported not silently reconciled:** the ticket's G2 says
"exactly 7 destination strings". The ticket's own table row 6 is marked *(unchanged, listed
so it is not touched by mistake)*. Changing it would contradict the table. The measured diff
is therefore **6**, and row 6 was verified untouched rather than edited to reach 7.

Every changed line is a `destination:` string. No `source:`, no `permanent:`, no formatting.

## G3 · No redirect chain

Each new destination is a direct 200 with **0 redirect hops**, measured live before the edit
(table above). Checked against the merged post-edit config as well:

| Destination | Exact-source rules matching it | Pattern rules matching it |
|---|---|---|
| `/product/container-cafe` | 0 | 0 |
| `/product/container-cafe/container-hotel` | 0 | 0 |
| `/product/container-cafe/container-restaurant` | 0 | 0 |

No rule in the merged config has a source beginning `/product/container-cafe`. Two
independent probes — live HTTP and static config analysis — agree.

## G4 · Total redirect entry count unchanged

| File | Before | After | Ticket expected |
|---|---|---|---|
| `next.config.js` (`source:` tokens) | **431** | **431** | 431 ✓ |
| `redirects-from-csv.js` (`source:` tokens) | **572** | **572** | 572 ✓ |
| Merged runtime list via `redirects()` | **961** | **961** | — |

Note on the 572: the file exports **571** live array entries. The 572nd `source:` token is
the JSDoc type annotation on line 12 (`@type {Array<{source:string, ...}>}`). Both counts are
identical before and after; reported so the figure is not misread later.

All six entries stay `permanent: true`. Both files parse. All six were resolved at runtime
through `next.config.js`'s `redirects()` and returned the intended destinations.

---

# PART 2 · LEGACY PRICE P0 — STOPPED ON ALL NINE ROUTES, NO EDITS MADE

Part 2 is not partially built. Every route hit a stop condition that the ticket itself
defines, and three of those conditions are structural — they are properties of the template,
not of any one route, so no route could be completed while they hold.

## The four blockers

### B1 · G8 stops 8 of 9 routes outright — a price sits inside the first 100 words

G8: *"if a price sits inside the first 100 words, report it and stop that route rather than
editing the locked region."* These legacy pages **lead with the price**. Measured position of
the first rupee figure in the rendered description:

| Route | Tier | First ₹ figure at word | Figure | G8 |
|---|---|---|---|---|
| `restaurant-food-containers` | 2b | **25** | ₹7,65,000 | **STOP** |
| `portable-cafe-container` | 2b | **33** | ₹32,55,000 | **STOP** |
| `shipping-container-restaurant` | 2b | **43** | ₹11,85,000 | **STOP** |
| `shipping-container-cafe` | 2a | **50** | ₹28,50,000 | **STOP** |
| `mobile-container-cafe` | 2a | **54** | ₹2,35,000 | **STOP** |
| `mobile-cafe` | 2b | **62** | ₹2,25,555 | **STOP** |
| `mobile-restaurants` | 2b | **63** | ₹11,25,000 | **STOP** |
| `pop-up-restaurants` | 2b | **72** | ₹2,85,000 | **STOP** |
| `shipping-container-hotel` | 2b | none in first 100 | — | see below |

**Both 2a routes stop on G8.** The two figures the ticket wanted corrected to SSOT sit at
word 50 and word 54 — inside the locked region. The correction cannot be made under this
event's authority.

`shipping-container-hotel` is clean in body copy, but its hero price region renders
**₹8,25,000** (from the WooCommerce `price` field `"825000"`) immediately after the H1 and
opener — comfortably inside the first 100 *rendered page* words. Under the page-level reading
of G8 it stops too; under the body-copy-only reading it is the one route that survives G8.
**This ambiguity needs Opus 5's ruling** — it is the difference between 8 stops and 9.

### B2 · No quote-only display path exists on this template (2b explicit STOP)

The ticket says to reuse the Labour Colony quote-only precedent and *"if no quote-only display
path exists on this template, STOP and report what the template does instead. Do not invent a UI."*

**What I found.** A quote-only path does exist in the codebase — but on a different template:

- `src/components/product-variant-hero/PortaCabinVariantHero.tsx:831-840` renders
  `data.gatedPriceLabel` when `priceExGst == null`.
- The only product using it is `src/data/products/prefabricated-container-house.json:323`:
  `"gatedPriceLabel": "Price on quotation — fixed-price quote within 48 hours."`
  That is exactly the quotation line + 48-hour commitment the ticket describes.

**Why the nine routes cannot reach it.** That component only renders when the route has a
`src/data/products/{slug}.json` variant file. **None of the nine has one** — verified for all
nine. They all render through the generic `src/pages/product/[category]/[slug].tsx`.

**What the generic template does instead.** At `[slug].tsx:847`, the entire price block is
wrapped in `{!suppressLegacyCommercialSurfaces && (...)}`. When suppression is on, the price
region renders **nothing at all** — no quotation line, no 48-hour commitment, no placeholder.
The price simply disappears from the hero card.

Reaching the quote-only display for these seven routes would require authoring nine new
variant JSON files (copy, specs, images, `gatedPriceLabel`) — a page rebuild requiring an
approved draft under HARD GATE 1 — or adding a new UI branch to the generic template, which
is the "invent a UI" the ticket forbids. **Stopped as instructed.**

### B3 · The existing suppression mechanism breaks G10 on 6 of 9 routes

There is a built suppression path — `PENDING_APPROVED_LADDER_SLUGS` in `[slug].tsx:80`
(currently one member, `prefabricated-container-house`). Adding the seven slugs would be the
obvious reuse, and it correctly handles the surfaces G5 cares about: `removeMonetaryHtml` on
the description, `removeMonetarySentencesDeep` on the Rank Math head, deletion of
`price`/`regular_price`/`sale_price`/`price_html`/`priceDisplay`/`priceSubline` from props,
deletion of `short_description`, and `suppressProductEntity` on the schema.

**But it cannot be used here.** `removeMonetaryHeadingSections`
(`src/lib/monetaryText.ts:101-119`) deletes a money-bearing heading **and every child section
under it** until the next heading of same-or-higher level. Measured effect:

| Route | Headings before | Headings after | Body chars lost | G10 |
|---|---|---|---|---|
| `mobile-restaurants` | 43 | 38 | 4,571 | **FAIL** |
| `restaurant-food-containers` | 16 | 14 | 5,105 | **FAIL** |
| `shipping-container-restaurant` | 16 | 14 | 2,222 | **FAIL** |
| `shipping-container-cafe` | 12 | 10 | 2,879 | **FAIL** |
| `mobile-container-cafe` | 18 | 17 | 2,389 | **FAIL** |
| `portable-cafe-container` | 21 | 20 | 2,287 | **FAIL** |
| `mobile-cafe` | 20 | 20 | 1,384 | pass |
| `pop-up-restaurants` | 13 | 13 | 3,146 | pass |
| `shipping-container-hotel` | 49 | 49 | 790 | pass |

G10 requires the heading outline unchanged on all nine. The only built mechanism changes it
on six. **Direct conflict between the ticket's G10 and the only non-invented implementation.**

### B4 · The 2a display format does not exist on this template

2a requires: *"Display ex-GST primary, incl-GST muted, GST 18%. No sale/regular construction,
no strikethrough."*

The generic template (`[slug].tsx:847-863`) renders a single price followed by the literal
caption **"Inclusive of all taxes"** — and when `on_sale && sale_price` is set it renders the
sale/regular pair **with a strikethrough** on the regular price, which 2a forbids. The
ex-GST-primary / incl-GST-muted split exists only in `PortaCabinVariantHero.tsx:835-838`,
which these routes cannot reach (B2).

All nine routes currently carry a `sale_price` distinct from `regular_price` (e.g.
`mobile-container-cafe` price `235000.00` / regular `255000.00`), so the banned construction
is live data, not a hypothetical.

## G5 · Occurrences of the nine listed figures — measured, not cleared

No edits were made, so these are the **current** counts. `_rank_math_head` is populated on all
nine (9,478–14,849 chars) and was scanned; `meta_data` includes
`rank_math_schema_WooCommerceProduct`, also scanned.

| Route | `price` field (renders in hero) | Listed figures in body | In `short_description` | In `_rank_math_head` | In `meta_data` |
|---|---|---|---|---|---|
| `mobile-container-cafe` | ₹2,35,000 | ₹2,35,000 ×4 | ₹2,35,000 ×1 | 0 | ₹2,35,000 ×1 |
| `shipping-container-cafe` | ₹28,50,000 | ₹28,50,000 ×7 | ₹28,50,000 ×1 | 0 | ₹28,50,000 ×2 |
| `restaurant-food-containers` | ₹7,65,000 | ₹7,65,000 ×7 | ₹7,65,000 ×2 | 0 | ₹7,65,000 ×2 |
| `mobile-cafe` | ₹2,25,555 | ₹2,25,555 ×4, ₹2,35,000 ×1 | ₹2,25,555 ×2 | 0 | ₹2,25,555 ×1 |
| `mobile-restaurants` | ₹11,25,000 | ₹11,25,000 ×5, ₹11,85,000, ₹2,85,000, ₹2,35,000, ₹2,25,555 | ₹11,25,000 ×2 | 0 | ₹11,25,000 ×1 |
| `shipping-container-restaurant` | ₹11,85,000 | ₹11,85,000 ×6 | ₹11,85,000 ×1 | 0 | ₹11,85,000 ×1 |
| `portable-cafe-container` | ₹32,55,000 | ₹32,55,000 ×7 | ₹32,55,000 ×1 | 0 | ₹32,55,000 ×3 |
| `shipping-container-hotel` | **₹8,25,000** | none | none | 0 | none |
| `pop-up-restaurants` | ₹2,85,000 | ₹2,85,000 ×5, ₹2,25,555 ×2, ₹2,35,000, ₹11,25,000 | ₹2,85,000 ×1 | 0 | ₹2,85,000, ₹2,25,555 |

Two findings worth the owner's attention:

1. **₹8,25,000 appears nowhere in visible copy on any of the nine.** It exists only as the
   `price` field `"825000"` on `shipping-container-hotel`, which the hero renders as
   ₹8,25,000. G5 would have been unsatisfiable by body-copy editing alone.
2. **`_rank_math_head` carries no rupee figures on any of the nine.** The Rank Math drift risk
   G5 warns about is real for the schema in `meta_data`, but the pre-rendered head is clean.

### Superseded figures the G5 list does not cover

Removing only the nine listed figures would leave these in place — all of them superseded
prices or comparisons against superseded prices, so the L15 breach would survive the fix:

| Route | Uncovered figures still live |
|---|---|
| `restaurant-food-containers` | ₹7,95,000 ×2, ₹15,55,000 ×2, ₹7,90,000 |
| `shipping-container-cafe` | ₹8,50,000 ×3 (plus ×2 in meta_data, ×1 short_desc) |
| `mobile-restaurants` | ₹11,95,000 ×2, ₹15,55,000, ₹4,55,000 |
| `portable-cafe-container` | ₹35,66,000 ×2, ₹33,25,000 |
| `pop-up-restaurants` | ₹2,95,000 ×3, ₹4,55,000 |
| `mobile-cafe` | ₹2,65,000 ×2 |
| `mobile-container-cafe` | ₹2,55,000 |

**Needs a ruling:** is the instruction "remove the price figure" scoped to the nine listed
figures, or to every superseded figure on the page? I did not extend scope on my own judgement.

## G6 · The two corrected figures as rendered

**Not applicable — no correction was made.** Both 2a routes stopped on G8 (B1): the figures
to be corrected sit at word 50 and word 54, inside the locked first-100-word region, and B4
means the required ex-GST/incl-GST display does not exist on this template.

For the record, the intended targets were `mobile-container-cafe` ₹2,35,000 → **₹2,78,100**
(incl-GST ₹3,28,158) and `shipping-container-cafe` ₹28,50,000 → **₹3,77,400**
(incl-GST ₹4,45,332). Flagging one thing for Opus 5: the `shipping-container-cafe` correction
moves the headline figure **down by 87%** (₹28,50,000 → ₹3,77,400). The page's whole
comparison structure is built on the ₹28,50,000 figure being the top of a three-tier ladder
above a ₹8,50,000 entry point. After the correction the "showcase" would sit **below** the
entry point it is contrasted with. That reads as a possible row mismatch against the
20x10x8.5 ft Price Matrix row rather than a like-for-like replacement — the 25×20 multi-unit
showcase is ~500 sq ft, not a 20x10 unit. **Worth confirming before anyone applies it.**

## G7 · Orphaned sentences found under 2c — verbatim, with route

These are sentences that **reason from** the figure — comparisons, differentials, "what ₹X
covers" headings. Per 2c each one stops its route. Copy is Opus 5's and Fable 5's; I have not
rewritten a single one.

**`restaurant-food-containers`**
1. "The SAMAN build at ₹7,65,000 (regular ₹7,95,000) is a 20'×10'×9' factory-fitted unit configured around commercial cooking — food-grade stainless steel cooking wall, exhaust hood opening sized for commercial extraction, LPG inlet, commercial-rated electrical, and zero dining floor."
2. *(H2)* "Inside the 20×10×9 ft Build at ₹7,65,000 — Cooking Wall, Exhaust, and Commercial Electrical"
3. *(H2)* "What ₹7,65,000 Includes — and What Your Kitchen Equipment Budget Covers Separately"
4. "If yes, the 40-ft build at ₹15,55,000 is the right buy."
5. "If no — if the kitchen is feeding delivery riders, a separate dining venue, multiple outlets, or a catering operation that serves elsewhere — this 20-ft kitchen-only build at ₹7,65,000 is the right buy."
6. **"You save ₹7,90,000 by not paying for dining fitout that no customer will ever sit in."** — a pure differential; it is arithmetically meaningless once either figure moves.
7. "The full container restaurant build is the opposite: a 40-ft unit at ₹15,55,000 with kitchen plus dining floor for 16 to 24 covers, customer-facing wall finish, and optional in-unit restroom."

**`shipping-container-cafe`**
1. *(H2)* "The ₹28,50,000 Showcase — What It Includes and What It Does Not"
2. *(H3)* "What is the difference between the ₹8,50,000 entry-point and the ₹28,50,000 showcase?"
3. "The ₹8,50,000 entry price is a single 20-ft factory-fitted with kitchen position, exhaust provision, electrical, and exterior finish — designed for a coffee window or single-product brand with limited seating."
4. "The ₹28,50,000 showcase is two 20-ft containers joined into 500 sq ft, with the same factory-fit standards across both units plus the engineering to join, seal, and align them as one cafe."
5. A three-row configuration table whose price column reads "From ₹8,50,000 / Mid-range — quote on request / ₹28,50,000".

**`portable-cafe-container`**
1. **"At nearly the same price band — ₹32,55,000 here vs ₹33,25,000 for the 25×20 two-storey stacked starter — the question buyers ask is which footprint wins for their plot."** — the entire sentence is the comparison.
2. *(H2)* "₹32,55,000 — What's Inside the Price and What's the Operator's Scope"
3. "The ₹32,55,000 sale price (regular ₹35,66,000) covers SAMAN's manufacturing and delivery scope."
4. "At 30×20 and ₹32,55,000, that is not a realistic plan, and we are not going to pretend it is."
5. "At 30×20 and ₹32,55,000, 'portable' is a build category, not a behaviour."
6. "Is the ₹32,55,000 price negotiable down with a lighter fit-out, or is it a fixed package?"

**`mobile-restaurants`**
1. "The build sits at ₹11,25,000 (sale, regular ₹11,95,000), seats twelve to eighteen covers at table service, and is engineered with corner-lift hardware for repeat redeployment at restaurant scale."
2. *(H2)* "22×12 ft × ₹11,25,000 — What the Build Actually Is at Restaurant Scale"
3. "Two things make a 22×12 mobile restaurant container different from every other mobile F&B build in the SAMAN range — the form factor and the price tier."
4. A **five-row cross-product comparison table** pricing this page against Mobile Cafe (₹2,25,555), Mobile Container Cafe (₹2,35,000), Food Truck Container (₹4,55,000) and Pop-Up (₹2,85,000) — it reasons from four figures that belong to four other routes in this same batch.
5. "The reply covers the mobile restaurant container unit cost (₹11,25,000 sale at current pricing, ₹11,95,000 regular), a worked per-move estimate…"

**`shipping-container-restaurant`**
1. *(H2)* "₹11,85,000 — Where the Money Goes vs a Conventional Restaurant Fit-Out"
2. **"The ₹11,85,000 base price for a 20-ft build splits roughly into four buckets: Container + structural conversion (~35%) …"** — a percentage decomposition of the figure.
3. "…at roughly half the cost of a conventional restaurant fit-out…" — a ratio claim anchored to the figure, in the first 100 words.
4. "A single 20-ft build sits at ₹11,85,000 (GST inclusive) and includes the container, conversion, kitchen, electrical, plumbing, finishes, delivery, and install."

**`pop-up-restaurants`**
1. "The unit currently sells at ₹2,85,000 (regular ₹2,95,000), built around a steel-and-wood frame with kitchen counter, service window, electrical fittings, and a brandable exterior…"
2. "Model 1: Outright purchase at ₹2,85,000 sale (regular ₹2,95,000) + resale after the event arc."
3. A **five-row comparison table** pricing this page against four sibling routes (₹2,25,555 / ₹2,35,000 / ₹4,55,000 / ₹11,25,000).
4. "The build platforms differ too: pop-up is 15×10×9 ft for event-scale F&B at ₹2,85,000; mobile cafe is 10×10×9 ft for circuit-scale coffee or compact F&B at ₹2,25,555."
5. "The quote covers the unit price (₹2,85,000 sale at current pricing, regular ₹2,95,000) plus delivery costed against the actual event geography."

*Not orphans:* the FSSAI turnover-threshold sentences on `pop-up-restaurants` (₹12 lakh, ₹20
crore, fee ₹100 / ₹2,000–₹5,000) are **statutory figures, not SAMAN prices**, and the ₹3,000
delivery charge line that appears on six routes is a logistics charge. Neither is in scope,
but `removeMonetaryHtml` would delete both — another reason B3's mechanism is wrong here.

**`mobile-cafe`**
1. "If your operation moves once every couple of years and then settles in, the relocate-occasionally container cafe build at ₹2,35,000 is the right pick instead." — reasons from a *sibling route's* figure.
2. "Neither fits the kiosk-class circuit operator buying at ₹2,25,555."
3. "The quote includes the unit cost (₹2,25,555 sale at current pricing) and a worked per-move-cost estimate based on the actual route, so the operator can model first-year total cost before committing."

**`mobile-container-cafe`**
1. "The SAMAN unit measures 10×10×8 ft (about 100 sq ft of cafe floor), starts at ₹2,35,000, and is meant for operators who plan to move their cafe between 2–4 sites…"
2. *(H2)* "What Drives Mobile Container Cafe Price — Starting ₹2,35,000"
3. "The ₹2,35,000 starting price (currently on sale; regular ₹2,55,000) is the 10×10×8 ft factory-fitted unit."
4. A three-row mobility-format table whose price column reads "₹2,35,000 / Similar range / Higher (chassis + road-licensable build)".

**`shipping-container-hotel`** — no orphaned sentence. Its only rupee figure in body copy is
the ₹3,000 delivery charge. Its short_description carries "Price From Rs 4–6 L per key", which
is a **range, not one of the nine figures**, and is not covered by G5's list.

### Cross-route coupling — the structural point

`mobile-restaurants` and `pop-up-restaurants` each contain a comparison table that prices
**four sibling routes in this same batch**. `mobile-cafe` reasons from `mobile-container-cafe`'s
figure. Editing any one route in isolation desynchronises the others. These nine cannot be
fixed route-by-route; they need one coordinated copy pass from Opus 5 / Fable 5.

## G9 · No CI9 route touched

**Zero diff.** `git diff --stat` for the whole branch is exactly two files: `next.config.js`
and `redirects-from-csv.js`. No file under `src/data/wp-export/products/` was modified, and
`/product/container-cafe` and its five CI9 subpages are untouched in both code and data.

## G10 · Heading outline unchanged

**Unchanged on all nine — because no route was edited.** Measured counts are in B3, which is
also where the conflict lives: the only built suppression mechanism would break this gate on
six of the nine.

---

# WHAT OPUS 5 NEEDS TO RULE ON

1. **G8 scope.** Does "first 100 words" mean the rendered description body, or the rendered
   page including the hero price region? Body-copy reading = 8 stops; page reading = 9. This
   also decides whether the two 2a corrections are permissible at all under this event.
2. **The quote-only path (B2).** The precedent exists but only on the variant-hero template.
   Options: authorise variant JSON files for the seven routes (needs drafts under HARD GATE 1),
   authorise a new quote-only branch on the generic template (currently forbidden as "invent a
   UI"), or accept the price region rendering nothing at all.
3. **G10 vs the suppression engine (B3).** `removeMonetaryHeadingSections` deletes whole
   sections. Either G10 relaxes, or the engine needs a heading-preserving mode, or the copy is
   revised by hand.
4. **2a display format (B4).** Ex-GST-primary / incl-GST-muted does not exist on this
   template, and the live `sale_price` ≠ `regular_price` data triggers the banned strikethrough.
5. **G5 scope.** Nine listed figures only, or every superseded figure? Eleven uncovered
   figures are listed above.
6. **The `shipping-container-cafe` SSOT figure.** ₹28,50,000 → ₹3,77,400 is an 87% reduction
   that inverts the page's own price ladder. Please confirm the Price Matrix row is the right
   one for a ~500 sq ft multi-unit build.
7. **Cross-route coupling.** Two routes price four siblings each. Confirm these nine are
   handled as one coordinated copy pass rather than route-by-route.

No copy was written, no figure invented, no UI invented, no gap filled with a default.
