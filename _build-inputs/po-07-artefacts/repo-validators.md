# Repo validator results

## Pass — and moved by this commit

| validator | result |
|---|---|
| `npm run type-check` (`tsc --noEmit`) | **PASS**, 0 errors |
| `npm run build` | **PASS**, compiled successfully; postbuild sitemaps regenerated |
| `validate:commercial-architecture` | **PASS** — *65 approved live paths and 39 planned-release paths* |
| `validate:pc01-calculator-price-parity` | **PASS** after re-pinning the `ladders` hash (see below) |

### The calculator hash re-pin

`ladders` moved `471af3e2…` (PO-06's pin) → `a34b5ba6…`. Evidence it is purely additive,
checked against `origin/static-migration` **after rebasing onto PO-06**:

```
keys before: 41   after: 42
added:   [ 'portable-control-room' ]
removed: []
order of pre-existing keys unchanged: true
```

The whole diff to `src/lib/calculatorLadders.ts` is five added lines — one import, a
three-line comment and one `ROUTE_LADDERS` entry reading this route's own product JSON
via `toRows`. No rate, formula, tax, component price or existing ladder row moved. The
validator's deeper per-variant parity assertions still run and pass.

This route's six ex-GST prices, read from `src/data/products/portable-control-room.json`,
are `201250, 308000, 350000, 403200, 504000, 665000` — identical to
`copy.hero.variants[].price_ex_gst`, so the ladder cannot drift from the buy box.

## Pre-existing baseline failures — NOT caused by this branch

Each was reproduced at commit `9b32dce5` (PO-03, already merged and in this branch's
own history), or fails against pinned constants that are stale by two releases. None is
touched here: silently re-pinning them would mask whatever drift they exist to catch.

| validator | why it is pre-existing |
|---|---|
| `validate:po-family-release` | Fails `readymade-office-cabin: ex-GST ladder` — **identical failure at `9b32dce5`**. That page is not modified by this branch. |
| `validate:temporary-commercial-gating` | Pins `63` gated paths; `unapprovedCommercialGating.json` already holds **62**. **Identical failure at `9b32dce5`.** `git status` confirms the file is untouched here, and `/product/portable-office/portable-control-room` was never in the gated list. |
| `validate:publication-gate` | Expects architecture `62/42` — the state *before* PO-03 and PO-04 merged, which moved it to `63/41`. Also flags `modern-office-cabin` returning 301, unrelated to this page. |
| `validate:stg01b-structured-data` | Expects architecture `62/42` for the same reason, and lists 37 "protected sources changed" including `bess-container.json`, `container-cafe.json`, `porta-cabins.json` and 30+ others this branch never opens. Its snapshot is stale by several releases. |

`plannedReleaseBacklogCurrentCount` was moved `40 → 39` alongside the path, and the
pinned fixture counts moved with it exactly as PO-03 and PO-04 did:

* `scripts/validate-commercial-architecture.js` — `{ approved: 64, planned: 40 }` → `{ approved: 65, planned: 39 }`
* `scripts/generate-segmented-sitemaps.mjs` — `products: 97 → 98`, page total `359 → 360`

Both counters were bumped a second time when this branch was rebased onto PO-06, which
had made the identical +1 moves for `/product/portable-office/construction-site-cabin`.
Both pages ship, so both counters carry both.
