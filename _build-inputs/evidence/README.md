# PO-05 Portable Mobile Laboratory — Template Conformance Gate artefacts

Re-issued 6 Sep 2026 after **`PO-05-PACK-AMENDMENT-APPLIED-6sep2026.md`**, which withdrew
the pack's 16:9 claim for Section 3 and replaced the verifier's self-contradicting
`no 'Info' tab label` assert. Supersedes the PO-05-R2 issue of this folder.

Preview URL used for every artefact: `http://127.0.0.1:3157/product/portable-office/portable-mobile-laboratory`
(local `next start` of the final twice-merged production build — **not** 3105, which still had the
previous session's stale server bound to it and would have served the old build).
Design lock: `/product/porta-cabins`, measured from the SAME local build.

## What the amendment changed, and what this build did

| # | change | status |
|---|---|---|
| 1 | `no 'Info' tab label` withdrawn, replaced by three positive tab-pair checks | no build change needed — already satisfied |
| 2 | Section 3 is **4:3**, not 16:9 | the six photographs re-encoded as centred 4:3 crops |
| 3 | `ga_board_note` moved out of the copy pack into `asset_map.ga_boards.placement_note` | pack resynced; it was never rendered |

Copy sha `8f18fe0a…` verified: it is the sha256 of the copy JSON with its own
`sha256_of_copy` key removed, `sort_keys=True`, `ensure_ascii=False`.

## Gate results

| gate | artefact | result |
|---|---|---|
| 1 | `01-structural-diff.txt` | PASS — zero component-tree delta against the design lock |
| 2 | `02-component-order.txt` | PASS — eleven canonical blocks in order; 6 images in the Description tab, 0 between Section 2 and Section 3 |
| 3 | `03-{preview,designlock}-{desktop-1440,mobile-390}.jpg` | re-captured, full page, lazy images forced eager before the shutter |
| 4 | `04-prop-audit.txt` | PASS — 0 behaviour props differ; `fullMobileLabels` not opted into |
| 5 | `05-dom-checks.txt` | PASS — including `DescriptionInfo`, `SpecificationsSpecs`, `ShippingShip` |
| 6 | `06-verify_po05-output.txt` | **355 PASS / 0 FAIL — `RESULT: PASS`** |
| 6 | `06-lighthouse-mobile-summary.txt` | re-run against a purpose-built baseline; see that file |
| — | `07-image-measurements.txt` | 55 outputs, every one inside 80–120 KB |
| — | `11-section3-crop-proof-sheet-v2.png` | the amendment's own proof sheet for the 4:3 crops |

`RESULT: PASS` is now reachable and reached. Both blockers were pack defects and both
were fixed at source; the acceptance test was never edited by this build.

## Section 3, measured in the page

The panel computes `aspect-ratio: 4 / 3`, `object-fit: cover`, rendered **533×399** CSS px
— matching the amendment's own measurement of 535×401 on the live lock. The files are
1254×940, so `cover` crops them no further and every unit stays whole in frame.

## One deviation from the pack, carried forward deliberately

The amended pack asks for Section 3 at **1600×1200**. Every source master is natively
**1254×1254**, and the encoder never upscales, so these ship **1254×940**. This is the
same deviation, for the same reason, that the already-accepted Section 2 card carries
(declared 1600, ships 1254×705). At a rendered 533×399 the file still covers the box at
better than 2× DPR. Recorded in `07-image-measurements.txt`.

## Reproduce

    npm run build && npx next start -p 3157
    python scripts/po05-conformance-gate.py \
      http://127.0.0.1:3157/product/portable-office/portable-mobile-laboratory \
      http://127.0.0.1:3157/product/porta-cabins
    python _build-inputs/verify_po05.py \
      http://127.0.0.1:3157/product/portable-office/portable-mobile-laboratory \
      _build-inputs/PO-05-portable-mobile-laboratory-copy-v1.json \
      _build-inputs/PO-05-portable-mobile-laboratory-asset-map-v1.json public
