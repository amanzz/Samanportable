# CH-FPK-06 · Flat-Pack Container Homes · build record

Route: `/product/container-houses/flat-pack-container-homes` (new; 404 before this branch)
Branch: `feature/ch-fpk-06-flat-pack-container-homes-20260906`, cut from `origin/static-migration` at `ed6808f2`.

Everything on this page is read from the two signed inputs in this folder — the copy JSON
and the asset map. Nothing was authored, with the one exception recorded as gap 1.

## Verifier

```
python content/ch-fpk-06/verify_chfpk06.py <served page.html>
```

**799 checks run, 792 pass, 7 fail. `RESULT: FAIL`.**

The verifier was NOT edited and the build was NOT deployed. Per build prompt section 12
("If PASS is not reachable, stop and report the failing assert with its line number"),
the seven failures and their line numbers are below. None of them is a defect in this
page's content, markup or assets: three are shared surfaces this same prompt orders left
untouched, three are a limitation in how the verifier walks JSON-LD, and one is
unreachable at the asset map's own image paths.

Full output: `evidence/07-verifier-output.txt`.

### Failure 1-2 — lines 185-187, `FORBIDDEN_FACTS`: "working days", "7 to 21"

Both hits are shared chrome, and both are surfaces this build prompt explicitly protects:

| # | Surface | Text | Governing instruction |
|---|---|---|---|
| 1 | Section 4 calculator, step 9 | "Delivery in 7 to 21 working days." | §2 block 9: "Section 4 calculator, untouched" |
| 2 | Shipping tab, `buildShippingHtml()` | "…in 7–21 working days" | §8: "the shared freight component **exactly as** the live porta-cabins page renders it" |

Measured on the same server, same build:

```
porta-cabins (the design lock)     "working days" x5   "7 to 21" x5
prefab-container-homes (PR #200)   "working days" x2   "7 to 21" x4
flat-pack-container-homes (this)   "working days" x2   "7 to 21" x2
```

This page publishes **fewer** occurrences than either, and adds none of its own: the pack's
five `FEATURE_CELLS` replace the standard Size/Material/**Delivery**/Coverage/Brand set
outright, so this route renders no Delivery cell at all.

The conflict is inside the prompt, not in the build: §13 item 4 bans a lead time anywhere
on the page, while §2 and §8 order the two components that publish one to be used as-is.
§8's own instruction for this situation — "if that is not clean, **stop and report** rather
than editing the shared component" — is what has been done. Removing either would change
`/product/porta-cabins` and every other product route.

### Failure 3-5 — line 216-217, structured data: `Product`, `AggregateOffer`, `BreadcrumbList`

All three ARE emitted, correctly and exactly as §9 specifies. The verifier does not find
them because it only descends into a `@graph` array:

```python
for n in (node.get("@graph", [node]) if isinstance(node, dict) else []):
```

The site's shared `ProductStructuredData` component emits the ItemPage form instead, with
`Product` under `mainEntity` and `BreadcrumbList` under `breadcrumb`. What the page
actually serves:

```
ItemPage
 └ mainEntity  → Product
     ├ brand   → Brand
     └ offers  → AggregateOffer   priceCurrency INR
                                  lowPrice     207000
                                  highPrice    812160
                                  offerCount   6
                  └ offers[0..5] → Offer + PriceSpecification (valueAddedTaxIncluded false)
 └ breadcrumb  → BreadcrumbList → ListItem x3
(second blob)   FAQPage → Question x8 → Answer
```

That is `ItemPage`, `Product` with `AggregateOffer` (INR, ex-GST, low 207000, high 812160,
offerCount 6), `BreadcrumbList`, `FAQPage`, **and nothing else** — §9 satisfied, including
`aggregateRating` absent and the self-referencing canonical present (both asserted and
passing). Emitting a `@graph` instead would be a change to the shared component that moves
the JSON-LD shape of every product page on the site.

Fix belongs in the verifier: walk `mainEntity`, `offers` and `breadcrumb` as well as
`@graph`.

### Failure 6 — line 257, `sh["public_path"] in raw` (Section 2 split card)

The card renders, in the right place, with the right image and the pack's alt text. It is
the URL form that defeats a substring test:

```html
src="/_next/image?url=%2Fimages%2Fflat-pack-container-homes%2Fwide%2Fs2-flat-pack-container-home-20x10-residential-setting-wide.webp&w=1920&q=75"
```

`RightToExist.tsx` renders the card through `next/image` with
`unoptimized={shouldBypassOptimizer(card.imageSrc)}`, and `isPreOptimizedLocalImage()` in
`src/lib/imageSrc.ts` returns true only for `/images/products/**.webp`. The asset map paths
this pack at `/images/flat-pack-container-homes/...`, so the optimizer percent-encodes the
path and the literal string never appears.

The other 54 assets pass the same style of assert only because they are carried in
`__NEXT_DATA__` as product-record props. The split card is defined in
`rightToExistEntries.tsx`, which is component code, so it has no props copy.

Two ways to make it reachable, both needing SAMAN because both change a signed input:

1. **Re-path the pack under `/images/products/container-houses/flat-pack-container-homes/`**
   (matching `prefab-container-homes`) and update `public_path` in the asset map. This is
   the recommended fix — it also removes the optimizer LCP cost measured in
   `evidence/06-mobile-cwv.txt`, gap 3 below.
2. Amend the assert to accept the encoded form.

### Failure 7 — line 292-293, `RETIRED`: `affordable-container-homes`

Two hits, both in the Section 4 calculator's shared product chooser:

```html
<input type="radio" name="productId" value="affordable-container-homes" …>
```

`prefab-container-homes`, merged yesterday as PR #200, carries the same two hits from the
same component. This page links to no retired URL: its Explore panel, its "You may also
like" and its Description tab all resolve to the four approved Container Houses
destinations only. Removing the radio would edit the calculator, which §2 block 9 forbids.

## Gaps in the signed inputs

### Gap 1 — the pack supplies no labels for the buy-box FEATURE_CELLS

`copy.hero.feature_cells` gives five bare facts per size, e.g.
`"100 sq.ft erected built-up area"`. The design-lock cell is a `{label, value}` pair
(small-caps label above a bold value) and the pack states no labels.

Rather than author five labels, the label slot is left empty and the approved fact is the
value, so the cell renders the pack's words and nothing else — the same "an empty slot
renders nothing" rule §2 states. All thirty facts render and all thirty verifier
`feature_cell` assertions pass. Visually this is a five-cell grid of bold facts with no
label line; see `evidence/03-screenshot-flatpack-desktop-1440.png`.

**Needs SAMAN**: either approve the label-less rendering, or supply five labels.

### Gap 2 — alt text repeats "ft"

Every gallery, board and Section 3 alt in the asset map reads e.g.
`"20x10 ft ft flat-pack container home, …"` — a doubled "ft". §5 says "Alt text is in the
asset map. Do not write your own", so it ships verbatim. 48 alt strings are affected.
**Needs SAMAN**: a corrected asset map.

### Gap 3 — the asset map's public paths sit outside the optimizer-bypass prefix

See failure 6 and `evidence/06-mobile-cwv.txt`. Consequence measured: LCP 4312 ms median
against 3460 ms on the local design lock (and 5176 ms on live porta-cabins), CLS 0.0000 and
TBT within noise on all three.

### Gap 4 — the calculator names this route "Container House"

`resolveEmbeddedCalculatorProduct` maps this slug to the cluster default `ProductId`
`'container-houses'`, so the wizard shows that product name. **Pricing is correct**: the
ladder key is `normalise(slug)` = `flat-pack-container-homes`, which resolves to the new
`ROUTE_LADDERS` entry read from this page's own product JSON, so the calculator prices from
this page's published ladder and not the hub's. Giving it its own `ProductId` would need a
new entry in the `ProductId` union, `CATALOG` (name + subtitle) and `calculatorCopy`, i.e.
authored calculator catalogue copy the pack does not supply — and §4 limits this build to
the `ROUTE_LADDERS` entry.

## Build prompt items answered

- **§7, PO-CLUSTER-02** — **this page does NOT reproduce it.** Measured in a real browser
  at 1440x1200: all four Explore tile images report `complete: true` with `naturalWidth`
  900 / 1254 / 900 / 900.
- **§8, the two free-delivery lines** — **already present in the shared component; no
  opt-in prop was needed.** `buildShippingHtml()` (`specsShippingTabs.ts:402`) already
  renders `Free delivery: within Bangalore city (South zone) · Delhi NCR: Ghaziabad,
  Gurugram, Faridabad, …`. The prompt's premise that the live component omits them is
  incorrect. Nothing was changed.
- **§11, warranty** — `prefab-container-homes` was already corrected to 10 years by CH-PFB-04
  (PR #200); confirmed, nothing to do. `shipping-container-homes` publishes it in two
  places and both are corrected here, and nothing else on that record is touched.
  **This contradicts `CLAUDE.md`**, whose Company-facts block fixes the warranty verbatim
  at "5-year structural warranty and 1-year finishing warranty as standard" and says it
  wins on any contradiction. The fact file is deliberately NOT edited, and other sibling
  records still publish 5 years. Flagged for an owner ruling, exactly as CH-PFB-04 flagged
  it.
  Note also that `feature/sch02-shipping-container-homes-20260906` is an open, locked
  worktree on the same record; if that branch lands first, re-check the two strings.
- **§14, superseded files** — 33 files deleted from the drop folder: the three `m1/m2/m3`
  wide files and, in each of the six `size-*` folders, the five old-naming slides. Each
  target was checked against the asset map first (0 of 33 referenced). The source render
  PNGs, the GA drawings and the workbook are untouched.
- **§12, `^\[[A-Z]` grep** — no downstream ticket is issued by this build, so there is
  nothing to grep. The two signed inputs carry no `[IMAGE …]` markers.
- **C2PA** — every one of the 55 source WebPs carries an appended `C2PA` RIFF chunk of
  5,759 bytes, which put all twelve kit boards at 123-125 KB, above the asset map's own
  declared weights and above the 120 KB band. The chunk is stripped on copy into `public/`
  (image data untouched, never re-encoded); all 55 then land at 86.2-119.8 KB and match the
  asset map's declared KB exactly.

## Template Conformance Gate artefacts

| # | File | Result |
|---|---|---|
| 1 | `evidence/01-structural-diff.txt` | 16 design-lock hooks identical to porta-cabins; 5 differ only in COUNT (YMAL tile count, spec table count, CTA count) — all inside the four permitted content differences |
| 2 | `evidence/02-component-order.txt` | PASS, eleven blocks in order, media band absent |
| 3 | `evidence/03-screenshot-*.png` | desktop 1440 and mobile 390, this page and the design lock; horizontal overflow 0 px at both widths |
| 4 | `evidence/04-prop-audit.txt` | every opt-in, why, and the five deltas from `prefab-container-homes` |
| 5 | `evidence/05-dom-checks.txt` | PASS: one H1, no empty heading, no empty or duplicate alt, width+height on all 33 images, no U+2014 anywhere |
| 6 | `evidence/06-mobile-cwv.txt` | CLS 0.0000 and TBT at parity; LCP +852 ms vs the local lock, -864 ms vs the live lock — cause and fix recorded |
| 7 | `evidence/07-verifier-output.txt` | 799 checks, 792 pass |

## Validators

The full suite was run on this branch and on a **pristine worktree at the branch point
`ed6808f2`**. Pass/fail is identical target for target, and the output text is
byte-identical apart from worktree paths. Every failure is pre-existing:

```
PASS  commercial-architecture   cod16-quotation-wording   c01-specification-overrides
      pc01-calculator-price-parity   pc01-static-faq   enquiry-dialog-a11y   pc01-pdf
FAIL  merchant-feed  local-inventory  publication-gate  temporary-commercial-gating
      container-office-rail  stg01b-structured-data  pc01-qualified-c01-debt
      pc01-performance-measurement-debt  cc01-faq-parity  po-family-pdfs
      po-family-release  pc01-keyword-ownership          (all FAIL at ed6808f2 too)
```

`validate:pc01-calculator-price-parity` passes with the re-pinned `ladders` hash; the
change is one additive `ROUTE_LADDERS` key (49 → 50), no key removed, pre-existing key
order unchanged, evidence in the comment at the pin.

`tsc --noEmit` is clean. `next build` compiles with only the pre-existing lint warnings.
