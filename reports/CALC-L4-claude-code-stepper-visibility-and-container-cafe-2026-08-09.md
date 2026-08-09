# CALC-L4 — stepper visibility, the calculator on the container cafe, and the layout proposal

**Date** 09 Aug 2026 · **Agent** Claude Code · **Worktree** `C:\tmp\shikhar-calc-L4-20260809`
**Branch** `agent/calc-l4-stepper-visibility-20260809` off `origin/static-migration` @ `2c8aa23b`
**Commits** `c297df74` (item 1, P0) · `cd3e0937` (item 2 pilot)
**Baseline for before/after** `C:\tmp\shikhar-calc-L4-baseline`, detached at `2c8aa23b`
**Nothing is merged and nothing is deployed.** Codex deploys, on SAMAN's typed word.

---

## The short version

| Item | State |
|---|---|
| 1 · stepper value invisible | **Fixed and verified.** Cause was NOT colour. Ships on its own. |
| 1b · second defect found | **Fixed.** Step 9's estimate card rendered at 1.03:1. SAMAN never screenshotted it. |
| 2 · calculator on container cafe | **Shipped in the pilot.** 42 → 48 routes, each on its own published ladder. |
| 2b · the other 75 routes | **HALTED**, and I need your word. Reason below — it is a CLAUDE.md hard gate, not reluctance. |
| 3 · blank space / button move | **Pictures only, as instructed.** Measured, mocked up, not shipped. One honest caveat. |

---

## ITEM 1 — the number was never mis-coloured. It was clipped out of existence.

### The hypothesis in the ticket is refuted, with numbers

The ticket asked me to test first whether the value was an `<input>` inheriting the browser's
default black on `--calc-inset #121C31` at roughly 1.3:1.

**Refuted.** On live production, at 1440:

- value colour `#EAF0F7` on `#121C31` — **14.81:1**
- **0 of 72** numeric controls anywhere in the wizard measured below 4.5:1

The colour was never the problem. A contrast-only gate would have passed this defect.

### The measured cause: a specificity loss that costs the value its box

| rule | specificity | source order | declares |
|---|---|---|---|
| `.cabin-calculator-ssr .calc-step input[type="number"]` | **(0,3,1)** | 2157 | `padding: 6px 10px`, `font-size: 13px` |
| `.cabin-calculator-ssr .ec-stepper input` | (0,2,1) | 2243 | `padding: 0`, `font-size: 12px`, `width: 34px` |
| `.cabin-calculator-ssr .ec-stepper input` | (0,2,1) | 2272 | `width: 30px`, `font-size: 11px` |

The density rule outranks the stepper rule on specificity, so it wins both padding *and* font size.
With `box-sizing: border-box` that leaves:

```
30px box − 10px padding-left − 10px padding-right − 2px borders = 8px content box
"0" at the 13px the same rule imposes                            = 8.1px needed
```

**8px of room for an 8.1px glyph.** The digit is clipped to nothing. Not dimmed — absent.

**Why step 7 was fine and step 6 was not:** step 7 has an escape hatch nobody gave step 6 —
`@media(min-width:1024px) .cabin-calculator-ssr #calculator-step-7 > .quantity-row input` is
**(1,2,1)** and outranks the density rule by an id. The wall-percentage controls escaped a third
way, via `.socket-nudge input { width: 44px }` — whose own comment reads *"needs room for three
digits without clipping."* **This exact cause has been worked around locally once before.**

**Scope: desktop only (≥1024px).** At 390 the mobile rule's 46px width already yields 24px of
content, so the defect never appeared on a phone. SAMAN's screenshots are a desktop or a wide tablet.

### Two independent probes, and the run that failed on its own disagreement

Per CALC-L1's false positive, visibility was decided two ways that must agree: the DOM value, and
glyph-coloured pixels painted inside the control. **The first run failed with 1 disagreement** — a
±0.5px fit tolerance called an 8px box holding an 8.1px glyph a fit while the pixel probe read zero
ink. The tolerance was wrong, not the pixels. It is now strict, and the runs agree.

### G1 — nine-step enumeration (18 sections = 9 steps + 9 title anchors; all nine covered)

| step | heading | controls | family | before → after fix |
|---|---|---|---|---|
| 1 | Choose your product | 0 | — | — |
| 2 | Set the size | 5 | plain | fine both (378px content) |
| 3 | Frame and wall | 0 | — | — |
| 4 | Choose the interior | 0 | — | — |
| 5 | Add doors and windows | 16 | plain | fine both (82px content) |
| 6 | **Add electrical fittings** | **14** | **ec-stepper** | **8px → 28px content. 14 clipped → 0** |
| 6 | Add electrical fittings | 4 | socket-nudge | fine both (22px content) |
| 7 | Add furniture and fittings | 32 | ec-stepper | fine both (20px content) |
| 8 | Delivery and taxes | 1 | plain | fine both (788px content) |
| 9 | Get your quotation | 0 | — | — |

**Answer to "the third screen", whichever screen you meant:** the enumeration covered all nine.
Exactly one step was affected — step 6 — and separately step 9's estimate card (below).

|  | live (before) | local build (after) |
|---|---|---|
| numeric controls | 72 | 72 |
| value does not fit its box | **14** | **0** |
| paints zero glyph pixels | **14** | **0** |
| cannot hold two digits | 14 | 0 |
| probe disagreements | 0 | 0 |

### Visual proof

`reports/calc-L4/evidence/` in the worktree — 4× magnification.

- `BEFORE-live-step6-card1-1440.png` — LED panel light: an **empty box** between `−` and `+`
- `AFTER-fix-step6-card1-twodigit-1440.png` — the same control reading **12**, same box size

### The fix — one cause, one component, three co-located declarations

Matched `[type="number"]` on the three `.ec-stepper input` rules so they reach (0,3,1) and win on
source order. Content box **8px → 28px**, font **13px → the designed 11px**, box **unchanged at
30×24** so nothing moves. The palette was not touched — it was never wrong.

---

## ITEM 1b — a second live defect the enumeration found, which you did not report

**Step 9 renders a second estimate card inside the form, and it is unreadable.**

`.cabin-calculator-ssr .calculator-grid > .estimate-card` carries the dark background, but step 9's
card lives at `#calculator-step-9 > .estimate-card` and is **not** a `.calculator-grid` child. It
therefore kept `.estimate-card{background:var(--bg-panel)}` — and `--bg-panel` is **`#f0f7f2`,
light mint left over from the retired light/green palette**.

Measured on live production, at **both** 1440 and 390:

| element | measured |
|---|---|
| "Live estimate" heading | **1.05:1** |
| "Floor area" / "200 sq ft" | **1.03:1** |
| **"₹2,10,980" — the total itself** | **2.04:1** (amber on mint) |
| "₹2,48,956 incl. 18% GST" | 1.04:1 |

Screenshot: `reports/calc-L4/steps/live-1440-step9.png` — the pale block mid-form is that card.

This is the *same structural mistake* as item 1: an override scoped to one container, leaving a
sibling instance on the retired palette. Fixed by giving `.cabin-calculator-ssr .estimate-card` the
dark background — **background only, no padding**, so nothing moves.

**Note it was 1.03:1 through sixteen gates on the quotation step**, where the price lives.

---

## ITEM 1c — the new gate (G5), proven rather than asserted

`scripts/calculator/verify-control-value-legibility.mjs` — **143 lines**.

Checks **contrast AND fit**, on control **values** not labels. The fit half is the point: this
defect sat at 14.81:1, so *the gate the ticket specified would not have caught the defect it was
written for.* I built both.

Two methodology corrections made after the first version produced false positives:

1. **No force-revealing hidden nodes.** The first version un-hid everything and reported an estimate
   card nobody can see in that state. It now walks the nine steps through the wizard's own step
   navigation. *A gate that fails on unreachable states gets switched off.*
2. **FIT applies to `<input>` only.** A `<select>` truncates visibly rather than painting nothing;
   those are reported as **warnings**, not build failures.

**Proof — run against a real broken build, not a synthetic one:**

| target | result |
|---|---|
| **live production (unfixed)** | **exit 1 — 28 violations**: 14 FIT at step 6, 14 CONTRAST at step 9 |
| **this build (fixed)** | **exit 0 — PASS** |

Same 2203 nodes, same 54 reachable states, both runs.

**Declared baseline, not a silent cap.** 6 findings are accepted and printed on every run:
`<legend>` at `--sd-text-2` measures **3.88:1** against `--sd-card`. Fixing it means raising
`--sd-text-2`, which repaints every secondary label on the module — a palette change I will not
bundle into a P0. **Needs your ruling.**

**Warnings, also needing your ruling:** 8 window-type `<select>`s truncate — *"uPVC Sliding · ₹610
per sq ft"* needs 147.9px in an 82px box, so the price is cut off mid-string.

## G4 — worked examples, exact to the rupee

| control | interaction | rate × qty | estimate moved | |
|---|---|---|---|---|
| LED panel light | 3 × `+`, field reads **3** | ₹1,250 × 3 = **₹3,750** | ₹2,10,980 → ₹2,14,730 = ₹3,750 | **EXACT** |
| Tube light | 3 × `+`, field reads **3** | ₹900 × 3 = **₹2,700** | ₹2,10,980 → ₹2,13,680 = ₹2,700 | **EXACT** |
| External / entrance light | 3 × `+`, field reads **3** | ₹1,200 × 3 = **₹3,600** | ₹2,10,980 → ₹2,14,580 = ₹3,600 | **EXACT** |

## G6 — CLS and touch targets

- **CLS 0** across 24 real clicks (0→12 and back). Control box stayed **30×24 throughout** — one
  size, so the box never resized.
- Raw figure counting input-adjacent shifts: 0.00089, from the estimate list growing a line. Real
  user input excludes these; **I report both rather than only the flattering one.** An earlier run
  reported 0.00089 as CLS because `element.click()` leaves `hadRecentInput` false — a measurement
  artifact, now corrected to real mouse clicks.
- **Touch targets at 390: 28 visible stepper buttons, all 44×44, none under 44px.** (120 buttons in
  inactive steps measure 0×0; counting them once produced a bogus "120 under 44px".)

---

## ITEM 2 — the calculator on the container cafe, and where I stopped

### G7 — the mechanism, from the files on disk

`resolveEmbeddedCalculatorProduct` is a chain of category tests ending in `return null`.
`container-cafe` matched no branch, so it fell through — that is the whole reason those six pages
had no calculator. Of **123** product routes in `public/sitemap-products.xml`, **42** had one
(27 priced, 15 no-ladder) and **81** did not.

### The pilot — shipped, 42 → 48

All six now carry it and **each prices from its own published ladder**, read from the same product
JSON the page renders from:

| route | 20×10 published |
|---|---|
| `/product/container-cafe` | ₹3,70,000 |
| `/product/container-cafe/container-coffee-shop` | ₹3,70,000 |
| `/product/container-cafe/container-hotel` | ₹3,70,000 |
| `/product/container-cafe/container-restaurant` | **₹4,00,000** |
| `/product/container-cafe/food-truck-containers` | **₹3,20,000** |
| `/product/container-cafe/modular-container-cafe` | **₹2,70,000** |

Four distinct price points — no sibling's rate borrowed, nothing invented.

**A mistake worth recording.** My first cut shipped these six in no-ladder "Design your {product}"
mode, reasoning that `ROUTE_LADDERS` had no entry for them. **`verify-route-price-identity` caught
it:** the six *pages* publish prices, so a quote-mode calculator sitting beside a page reading
₹3,70,000 contradicts it in the other direction. Registering the ladders is what makes them agree.

That gate's `NO_LADDER` list was a hand-written array; it went stale the moment the data changed. It
is now **derived from the ladder table**.

### G8 — `verify-route-price-identity`

```
RESULT: 48 of 48 routes still publish exactly what their page publishes.
        5 of 5 container-house ladders exact to the rupee.
        3 of 3 no-ladder products in quote mode with no number.
EXIT=0
```

### G9 — warm LCP, five runs, median (mobile 390, 4× CPU throttle, identical conditions)

Before = a **local build of `origin/static-migration`**, after = this build. Same machine, same
throttling — the only comparison that means anything.

| route | before | after |
|---|---|---|
| `/product/container-cafe` | 756ms | 608ms |
| `…/container-restaurant` | 604ms | 660ms |
| `…/food-truck-containers` | 396ms | 620ms |
| `…/container-hotel` | 388ms | 772ms |
| `…/modular-container-cafe` | 688ms | 448ms |
| `…/container-coffee-shop` | 644ms | 352ms |
| **worst median** | **756ms** | **772ms** |

All six far inside 2,500ms. **Stated plainly: run-to-run spread within a single route reached
several hundred ms, so the per-route deltas are inside the noise.** The defensible claim is the
worst case moved 756 → 772ms and nothing approached the budget — not that any individual route got
faster or slower.

### 2b — the remaining 75 routes. I stopped, and this needs your word.

Your ruling was *every* product route, and I am not arguing with it. I stopped on a hard gate:

**None of the 75 has a `ProductId`.** Giving them one means writing a product `name` and `subtitle`
for twelve families — PEB constructions, prefab buildings, industrial sheds, pre-engineered
buildings, PUF panel, portable toilet, prefabricated houses, roofing sheet, EPS / glass wool / PIR /
rockwool panel. **Those strings render on the page.** No approved draft in
`page-structure/content-drafts/` contains them. CLAUDE.md HARD GATE 1 and the zero-invention rule
forbid me writing them.

**A second thing you should weigh, separately.** For panels and roofing sheets the nine-step wizard
asks length × width × rooms × doors × windows × electrical fittings. Those products are sold by the
square foot of panel, not as cabins. The constraint you set — never invent a rate — is satisfied,
because they would render no number. But an instrument that asks a panel buyer how many rooms he
wants is wrong in a way the no-rate rule does not cover, and I would rather say so than ship 75 of
them quietly.

**Also flagged:** `/product/labor-colony` and its three subpages are excluded by an explicit ruling
of 03 Aug 2026 (five of nine steps are dead for a colony block). CALC-L4's "every product route"
contradicts that ruling. **I have not overridden a prior ruling of yours on my own authority.**

**What I need:** either the approved names and subtitles, or your word on a specific pattern for
these families. Say which and I will build it.

---

## ITEM 3 — blank space and the button section. **Pictures only. Nothing shipped.**

Files: `D:\Project-shekhar\reports\calc-L4-09Aug\` — `before-{1440,1920,390}-step{1..9}.png`,
`item3-BEFORE/AFTER-*.png`, `blank-space-measurements.json`, `item3-mockup-summary.json`.

### 1 · The blank space, named by the element that owns it

**Owner: `.cabin-calculator-ssr .step-card`** — the empty tail below the last painted child.

| viewport | empty tail, every step | empty sidebar column below the estimate card |
|---|---|---|
| 1440 | **173–187px** | **30px (step 3) → 2,104px (step 5)**; step 6 = **553px** |
| 1920 | **173–187px — identical to 1440** | identical to 1440 |
| 390 | 218–232px (step 9: **563px**) | n/a, single column |

**1440 and 1920 render identically.** The grid is capped at 1216px (852px card + 340px sidebar), so
a wider monitor adds page margin, not module. Worth knowing before anyone tunes for 1920.

The larger void is **the sidebar column below the estimate card** — 553px on step 6, 2,104px on
step 5. That is the empty region beside the content, and I believe it is what you mean.

### 2 · The button section

Back and Next, at the **bottom of the step card**: y≈**1,631px** at 1440 step 6, against a 900px
fold. Your reading in the ticket was right about where they are.

### 3 · The proposal, and one honest caveat

Dock Back / Next into the empty sidebar column, sticky under the estimate card. At 390 there is no
second column, so a sticky footer bar instead.

| | before | after (mockup) | doc height | shift from the move |
|---|---|---|---|---|
| 1440 / 1920 | bottom of panel | sticky in the column | **unchanged** | **0** |
| 390 | y≈2,976px | sticky footer, y≈777px | **unchanged** | **0** |

**The caveat, because you should rule on the real gain and not a flattering one.** I tested whether
Back/Next are actually on screen at four scroll positions through step 6:

- **before: on screen at 3 of 4** positions
- **after: 4 of 4**

**The desktop gain is real but modest** — the buttons are already reachable once you are into the
step; they are only missing near the top. **The mobile gain is large** (2,976px → always visible).
If you want one of the two, mobile is where the value is.

**One further disclosure:** my first desktop mockup made it *worse* — appending to the grid created
a third grid item that auto-placed on a new row and pushed the buttons 116px further down. The
corrected mockup puts the sidebar and the nav in one shared column. The pictures in the folder are
from the corrected run.

**Nothing here is committed. Your call.**

---

## Gates

| | result |
|---|---|
| G1 nine-step enumeration | **PASS** — 9 steps, 72 controls, before and after tabulated |
| G2 measured cause per invisible control | **PASS** — hypothesis **refuted** with hex + ratios; real cause named |
| G3 one code path per cause | **PASS** — 3 lib files. `sitemap-images-products.xml` is postbuild output |
| G4 three worked examples | **PASS** — exact to the rupee |
| G5 new gate catches a broken build | **PASS** — exit 1 vs live, exit 0 vs fixed |
| G6 zero CLS, 44px targets | **PASS** — CLS 0; 28 visible buttons all 44×44 |
| G7 route count before/after | **PASS** — 42 → 48; 75 not extended, listed, reason given |
| G8 route price identity | **PASS** — 48 of 48 |
| G9 LCP before/after | **PASS** — worst median 756 → 772ms; noise disclosed |
| G10 non-regression | **PARTIAL** — routes 200/404 confirmed, Security Cabin quote mode confirmed. **Enquiry submit and CTA reveal not driven** |
| G11 tsc / build / postbuild | **PASS** — tsc 0, build 0, postbuild 0 |
| G12 no page-structure / wp-export | **PASS** — zero changes |

**Two pre-existing gate failures, confirmed on the untouched baseline, not mine:**
`verify-ux-static.mjs` (exit 1, empty diffs) and `verify-rate-card-diff.mjs`
(*"Tube Light = 999 — v2 states 350"*). Identical output and exit codes at `2c8aa23b`.

**G10 is honestly partial.** I confirmed the routes and quote mode but did not drive an enquiry
submission or the CTA reveal end to end. Say the word and I will.

---

## What I need from you

1. **Item 1 + 1b can ship now.** Two commits, item 1 isolated so it merges alone.
2. **The other 75 routes** — approved names/subtitles, or a ruling on the pattern. Plus the
   labour-colony contradiction with the 03 Aug ruling.
3. **Item 3** — look at the pictures. Mobile is the real win; desktop is modest.
4. **Two things I found and did not fix:** `<legend>` at 3.88:1 site-wide on the module, and 8
   window-type selects truncating their price.

No PR is open and no preview is deployed — say the word and I will open it.
