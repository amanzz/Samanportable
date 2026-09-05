# PO-05 Portable Mobile Laboratory — Template Conformance Gate artefacts

Preview URL used for every artefact: `http://localhost:3105/product/portable-office/portable-mobile-laboratory`
(local `next start` of this branch's production build).
Design lock: `/product/porta-cabins`, measured both from the SAME local build and from production.

| gate | artefact | result |
|---|---|---|
| 1 | `01-structural-diff.txt` | PASS — 17 shared components, identical order, zero delta |
| 2 | `02-component-order.txt` | PASS — all eleven canonical blocks, in order; 0 images in the Description tab |
| 3 | `03-preview-{desktop-1440,mobile-390}.jpg`, `03-designlock-{desktop-1440,mobile-390}.jpg` | full-page, lazy images forced to load; no horizontal overflow at either viewport on either page |
| 4 | `04-prop-audit.txt` | PASS — 0 behaviour props differ; every difference is one of the four permitted content kinds |
| 5 | `05-dom-checks.txt` | PASS — 17 checks |
| 6 | `06-verify_po05-output.txt` | **RESULT: PASS**, 317 checks, 0 failures |
| 6 | `06-lighthouse-mobile-summary.txt` + the four `*.json.gz` reports | see the artefact: no measurable difference from the design lock on this harness |
| — | `07-image-measurements.txt` | 49 outputs, every one 80–120 KB, nothing cropped |
| — | `08-validators-baseline-vs-branch.txt` | no new validator failure vs pristine `3c538299`; two pre-existing failure lines repaired |

Raw HTML the DOM checks ran against: `preview.html`, `porta-cabins-local.html.gz`.
Lighthouse reports are gzipped (`gunzip -k 06-lighthouse-mobile-preview.json.gz`).

Reproduce:

    npm run build && npx next start -p 3105
    python scripts/po05-conformance-gate.py \
      http://localhost:3105/product/portable-office/portable-mobile-laboratory \
      http://localhost:3105/product/porta-cabins
    python _build-inputs/verify_po05.py \
      http://localhost:3105/product/portable-office/portable-mobile-laboratory \
      content/po-05/PO-05-portable-mobile-laboratory-copy-v1.json \
      content/po-05/PO-05-portable-mobile-laboratory-asset-map-v1.json public
