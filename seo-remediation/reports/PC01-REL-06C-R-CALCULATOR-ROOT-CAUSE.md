# PC01 REL-06C-R Calculator Root Cause

Date: 2026-09-01
Checkpoint inspected: `0c07115b3a8c935471aab089a4b3e90400c88407`

This report was completed before calculator code was edited.

## Complete PC-01 path

- Route: `src/pages/product/[category]/index.tsx` resolves `/product/porta-cabins`, reads `src/data/products/porta-cabins.json`, renders the maintained visible price ladder, and supplies `productId: porta-cabin` plus `ladderKey: porta-cabins` to the calculator boundary.
- Performance wrapper: `src/components/DeferredCabinCalculator.tsx` defers only markup/runtime loading. It passes the same `productId` and `ladderKey` into `renderCabinCalculatorSSR`; it did not change the price source.
- Server renderer and calculation: `src/lib/cabinCalculatorSSR.ts` normalizes the configuration, renders the calculator, and calls `computeCalculatorEstimate`.
- Maintained route ladder: `src/lib/calculatorLadders.ts` already defines `ROUTE_LADDERS['porta-cabins'] = toRows(portaCabins)`, so the published six-row ladder is already derived from the same maintained product JSON.
- Obsolete calculator base source: `calculateBase` in `src/lib/cabinCalculatorSSR.ts` ignores that route ladder after the quote-mode check and calls `baseCabinRate` from `src/lib/baseCabinRateCard.ts`.
- Browser calculation: `public/scripts/cabin-cost-calculator.js` independently calls its own `baseCabinRate` implementation from serialized area-card data, again ignoring the rendered route ladder for the base.
- Size mapping: calculator length and width inputs select a size by dimensions; the maintained ladder already exposes exact `length`, `width`, and `priceExGst` fields through `calculatorLadders.ts` and the rendered published-price rows.
- Default selections: sloped roof, base MS frame/build, standard interior/ceiling/floor, 50 mm PUF, one included steel door, two 3×3 ft uPVC sliding windows, no electrical quantities, no add-ons, no insulation, no installation, and zero distance.
- Hidden default adjustment: the server skips the first standard steel door but charges both default windows at ₹5,490 each. The browser repeats the same window charge. The result is a silent ₹10,980 default paid-option adjustment.
- Adjustment sources: component deltas come from `src/lib/calculatorComponentRates.ts`; window/door and freight rates come from `src/lib/calculatorRates.ts`. These values are not the cause and are protected from change.
- GST: `GST_RATE` is imported from `src/lib/taxRates.ts` through `calculatorRates.ts`; both engines calculate `Math.round(totalExGst * 0.18)`.
- Freight: server and browser use the existing `RATE_CARD.freight` arrays, free-zone rules, distance bands, and 40 ft delta. Default `Other` plus zero distance adds no freight.
- Installation: remains a separately identified quotation-only line when explicitly selected.
- Downloadable estimate: `src/pages/api/cabin-estimate-pdf.ts` normalizes the posted configuration and recomputes through the same server `computeCalculatorEstimate` before `src/lib/cabinEstimateDocument.ts` renders the PDF.

## Before-state matrix

All values are ex-GST unless the column says otherwise. Default freight is zero.

| Size | Published ex-GST | Published incl-GST | Calculator base | Default paid options | Default pre-freight subtotal | Default freight | GST | Displayed ex-GST | Displayed incl-GST |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 10x10 | 143750 | 169625 | 110000 | 10980 | 120980 | 0 | 21776 | 120980 | 142756 |
| 20x8 | 220000 | 259600 | 168000 | 10980 | 178980 | 0 | 32216 | 178980 | 211196 |
| 20x10 | 250000 | 295000 | 200000 | 10980 | 210980 | 0 | 37976 | 210980 | 248956 |
| 20x12 | 288000 | 339840 | 240000 | 10980 | 250980 | 0 | 45176 | 250980 | 296156 |
| 30x10 | 360000 | 424800 | 300000 | 10980 | 310980 | 0 | 55976 | 310980 | 366956 |
| 40x10 | 475000 | 560500 | 400000 | 10980 | 410980 | 0 | 73976 | 410980 | 484956 |

For every row, the base source is `baseCabinRate(length, width)` rather than `ROUTE_LADDERS['porta-cabins'][selectedSize].priceExGst`. The two charged lines are `Window 1: uPVC Sliding 3x3 ft` and `Window 2: uPVC Sliding 3x3 ft`, ₹5,490 each.

## Blast radius

The shared calculator renderer/runtime is consumed by:

- `/product/porta-cabins` through `DeferredCabinCalculator`;
- ordinary category hubs through `LegacyEmbeddedCalculator`;
- product child routes through `src/pages/product/[category]/[slug].tsx`;
- `/cabin-cost-calculator`;
- `/product/container-offices/site-office-container`;
- `ProductCalculatorLayoutFallback`;
- `/api/cabin-estimate-pdf` and `cabinEstimateDocument`.

The safe correction is therefore a route-authority condition scoped to `ladderKey === 'porta-cabins'`. PC-01 exact published variants use the maintained ladder row; unmatched/custom PC-01 dimensions do not use an area approximation. All other route keys continue through their existing calculator behavior byte-for-byte. Default-window inclusion is likewise scoped to the PC-01 route authority and exact unchanged default-window values; a changed/added window continues to use the existing authorized rate.

## Exact cause

An older two-price doctrine deliberately replaced route-ladder base pricing with a bare-cabin area card in both server and browser. The later owner decision supersedes that doctrine for PC-01 only. The maintained ladder was still present and correctly passed through the deferred wrapper, but it was used only to decide quote mode and to render the published table, not to calculate the base. Separately, the two default windows describe the published standard configuration but were treated as paid openings. These two behaviors create all six parity failures.
