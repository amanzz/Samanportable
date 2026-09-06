# PO-05 Portable Mobile Laboratory — Template Conformance Gate artefacts

Re-issued 6 Sep 2026 for ticket **PO-05-R2 rev 2** (Section 3 photographs, Section 2 card
photograph, tab labels). Supersedes the PO-05-R1 issue of this folder.

Preview URL used for every artefact: `http://localhost:3105/product/portable-office/portable-mobile-laboratory`
(local `next start` of this branch's production build).
Design lock: `/product/porta-cabins`, measured from the SAME local build.

## What R2 changed

| # | change | status |
|---|---|---|
| 1 | Section 3 left column shows a photograph of the unit, not the GA board | done |
| 1 | the six approved GA boards move to the Specifications tab, below the tables and above the two coordination diagrams | done |
| 2 | the Section 2 split card is a photograph, not the GA board | done |
| 3 | the four tab labels render the lock's responsive pair, not the long label twice | done |

## Gate results

| gate | artefact | result |
|---|---|---|
| 1 | `01-structural-diff.txt` | PASS — 17 shared components, identical order, zero delta |
| 2 | `02-component-order.txt` | PASS — all eleven canonical blocks in order; 6 images in the Description tab, 0 between Section 2 and Section 3 |
| 3 | `03-{preview,designlock}-{desktop-1440,mobile-390}.png` | captured, full page, lazy images forced by a tall viewport |
| 4 | `04-prop-audit.txt` | PASS — 0 behaviour props differ; `fullMobileLabels` no longer opted into |
| 5 | `05-dom-checks.txt` | PASS — 22 checks, including the three tab label pairs |
| 6 | `06-verify_po05-output.txt` | **345 PASS / 7 FAIL** — see below; every failure is a pack defect, not a build defect |
| 6 | `06-lighthouse-mobile-summary.txt` + two `.json.gz` | preview 70, design lock 69; CLS 0 on both; TBT better on the preview |
| — | `07-image-measurements.txt` | 55 outputs, every one inside 80–120 KB |
| — | `09-section3-panel-crop-conflict.png` | the evidence behind the Section 3 ratio ruling |
| — | `10-PROPOSED-pack-amendment-section3-ratio.md` | the two pack amendments SAMAN needs to approve |

## Why the verifier does not print RESULT: PASS

Seven checks fail. **All seven are the pack disagreeing with the repo or with itself.**
The acceptance test has not been edited by this build — changing the test to make the
build pass it is not the build's call.

1. **`FAIL no 'Info' tab label`** — `verify_po05.py:103` asserts the page must NOT render
   the word `Info`. R2 change 3 of the same ticket requires it to: "a flattened scrape
   must read `DescriptionInfo`". No build can satisfy both. The page renders the correct
   pair, proved in `05-dom-checks.txt`.
2. **`FAIL Section 3 photo <size> is 16:9`, six times** — the pack asks for a 16:9 file,
   but the shared explorer panel is a fixed `aspect-[4/3]` `object-cover` box, so a 16:9
   file is cropped a second time and both ends of the unit are clipped. The design lock
   feeds this same box a 1:1 file. Per SAMAN's ruling of 6 Sep 2026 the page ships 1:1,
   so the whole unit stays in frame.

Both amendments are written out in `10-PROPOSED-pack-amendment-section3-ratio.md`.

## Known, pre-existing, not introduced here

Horizontal overflow at 390 px. `03-preview-mobile-390.png` and
`03-designlock-mobile-390.png` clip at the right edge in exactly the same way, so it is
site-wide and not a PO-05 regression.

## Reproduce

    npm run build && npx next start -p 3105
    python scripts/po05-conformance-gate.py \
      http://localhost:3105/product/portable-office/portable-mobile-laboratory \
      http://localhost:3105/product/porta-cabins
    python _build-inputs/verify_po05.py \
      http://localhost:3105/product/portable-office/portable-mobile-laboratory \
      _build-inputs/PO-05-portable-mobile-laboratory-copy-v1.json \
      _build-inputs/PO-05-portable-mobile-laboratory-asset-map-v1.json public
