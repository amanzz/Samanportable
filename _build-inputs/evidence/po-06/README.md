# PO-06 Portable Construction Site Cabin — Template Conformance Gate artefacts

Route: `/product/portable-office/construction-site-cabin`
Branch: `feature/po06-construction-site-cabin-20260906`, cut from `origin/static-migration` at `3c538299`.
Design lock: `https://www.samanportable.com/product/porta-cabins`

The route **404s on the pristine baseline and returns 200 on this branch** — measured
side by side on two local servers at the same moment (baseline `:4107`, branch `:4106`).

## The two commands for SAMAN

```
npm run build
npx next start -p 4106
```

Then open `http://127.0.0.1:4106/product/portable-office/construction-site-cabin`.

There is no hosted preview: the repo carries no Vercel config and no deployment
integration. Nothing here is deployed.

## Artefacts

| # | File | What it shows |
|---|---|---|
| 1 | `01-structural-diff.txt` | Component tree vs the design lock. 18 shared components, both pages, identical order, zero delta beyond content. |
| 2 | `02-component-order.txt` | The eleven canonical blocks in rendered order; the five Description-tab frames; zero images between Section 2 and Section 3; Section 3 headings 6×H3 / 0×H2. |
| 3 | `03-preview-desktop-1440.jpg`, `03-preview-mobile-390.jpg`, `03-designlock-desktop-1440.jpg`, `03-designlock-mobile-390.jpg` | Full-page screenshots, preview and live design lock, desktop 1440 and mobile 390. |
| 4 | `04-prop-audit.txt` | Every prop passed to every shared component, side by side with the design lock. Zero behaviour-prop differences. |
| 5 | `05-dom-checks.txt` | DOM checks on the fetched preview HTML, each forbidden-string check measured against the live design lock's own count. |
| 6 | `06-verify_po06-output.txt` | Full `verify_po06.py` output: 445 PASS, 3 FAIL. |
| 6 | `06-lighthouse-mobile-preview.json`, `06-lighthouse-mobile-designlock.json`, `06-lighthouse-mobile-summary.txt` | Lighthouse mobile, both pages. |
| 7 | `07-image-measurements.txt` | File, width, height and KB for all 50 published images, plus the fidelity spot-check. |
| 8 | `08-validators-baseline-vs-branch.txt` | Every repo validator at the pristine baseline and on this branch, side by side. |
| 9 | `09-shared-chrome-findings.txt` | The three `verify_po06.py` checks that no page-level change can satisfy, traced to their shared source lines. |
| — | `preview.html`, `designlock.html` | The exact fetched HTML the checks above were run against. |
| — | `10-description-images-render.txt` | Proof the five Description-tab frames load and paint (they are `loading="lazy"`, which made an earlier naive measurement read them as 0×0). |

## Result in one line

`verify_po06.py`: **445 checks pass, 3 fail** — and all three are strings published by
shared components this ticket is forbidden to edit, two of which the porta-cabins design
lock itself renders. See artefact 9. Everything the page itself owns passes.
