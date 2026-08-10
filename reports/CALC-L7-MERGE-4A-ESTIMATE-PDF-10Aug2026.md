# CALC-L7 Merge 4a: estimate PDF

Date: 10 Aug 2026

Branch: `agent/calc-l7-merge4a-pdf-20260810`

Base: `static-migration` at `585888371bdecb2bdbd8eed141609e5d551cd0e0`

## Outcome

The calculator download now returns a server-generated, one-page estimate PDF instead of printing the product page. The endpoint recomputes the submitted configuration with Engine A's exported `computeCalculatorEstimate` function, and the retained document contains only the ruled configuration, itemisation, totals, validity copy, warranty, delivery/quotation line, four contacts and generation date.

The no-prefill commercial-truth line is present below the on-page total and immediately below the PDF configuration block on no-prefill hosts. It is absent on prefill hosts. A restored design still names its saved product while retaining the no-prefill host disclosure.

## Implementation

- `src/pages/api/cabin-estimate-pdf.ts` is the PDF endpoint. It imports `computeCalculatorEstimate`, `normaliseCalculatorConfig` and `getCalculatorProductName` directly from `src/lib/cabinCalculatorSSR.ts`.
- `src/lib/cabinEstimateDocument.ts` generates the PDF with PDFKit's self-contained server bundle and selects exactly one D-state from the computed transport and installation lines.
- `src/lib/cabinEstimateCopy.ts` contains the L4-locked validity, disclosure, warranty, turnaround and contact copy.
- `public/scripts/cabin-cost-calculator.js` posts the current form configuration to the endpoint and downloads the returned attachment. `window.print()` is no longer used.
- Estimate lines now expose document-only quantity and unit-rate metadata from the same estimator result. Screen labels and totals are unchanged.
- The existing storage key remains `saman-cabin-calculator-v9`. The default product and restore trigger remain unchanged.

## Cross-product finding

The calculator uses one same-origin localStorage key on all 123 calculator routes. Save stores the whole design, including `productId`; Restore explicitly reads that key and applies it on the current route. Navigation alone does not restore a design.

The production example on `/product/portable-toilet` did not require a restore to show Porta Cabin. That route is one of the 71 ruled no-prefill routes, so it intentionally opens the general calculator on Engine A's internal `porta-cabin` default. The mechanism is correct, but without disclosure it created the commercial-truth risk described in the ruling.

Blast radius:

- Any of the 123 routes can restore a design explicitly saved on another route.
- All 71 no-prefill routes open the general calculator and now show the 77-character disclosure in the estimate band and PDF.
- A saved Porta Cabin design restored on `/product/portable-toilet` retains `Product: Porta Cabin` in the PDF and retains the no-prefill host disclosure.
- Selecting a product explicitly changes the retained-document mode to that selected product. Start over returns to the host route's original mode.

## Gate results

### G1 to G3: three route documents, totals and size

| Scenario | Route/state | Screen ex-GST | PDF ex-GST | GST | Inclusive | PDF size | Pages |
|---|---|---:|---:|---:|---:|---:|---:|
| Prefill configured | `/product/porta-cabins`, Porta Cabin 30 x 10 ft, D1 | INR 3,10,980 | INR 3,10,980 | INR 55,976 | INR 3,66,956 | 3.24 KB | 1 |
| No-prefill | `/product/portable-toilet`, general 20 x 10 ft, 150 km, installation on, D2 | INR 2,38,480 | INR 2,38,480 | INR 42,926 | INR 2,81,406 | 3.52 KB | 1 |
| Restored cross-product | Porta Cabin 30 x 10 ft restored on `/product/portable-toilet`, 150 km, installation off, D3 | INR 3,43,480 | INR 3,43,480 | INR 61,826 | INR 4,05,306 | 3.48 KB | 1 |

The extra D4 document is 3.34 KB and one page. All four are below 400 KB by more than 396 KB.

For each numeric document, `GST = round(total ex-GST x 0.18)` and `inclusive = total ex-GST + GST`. The itemised numeric lines sum to the ex-GST total:

- D1: 3,00,000 + 5,490 + 5,490 = 3,10,980.
- D2: 2,00,000 + 5,490 + 5,490 + 27,500 = 2,38,480; installation is explicitly confirmed in quotation and contributes no invented number.
- D3: 3,00,000 + 5,490 + 5,490 + 32,500 = 3,43,480.
- D4: 2,00,000 + 5,490 + 5,490 = 2,10,980; installation is explicitly confirmed in quotation.

### G4 and G11: locked validity copy

| Line | Characters | Evidence document |
|---|---:|---|
| A | 104 | All four |
| B | 96 | All four |
| C | 154 | All four |
| D1 | 68 | `d1-prefill-porta-cabin-30x10.pdf` |
| D2 | 85 | `d2-no-prefill-general-20x10.pdf` |
| D3 | 98 | `d3-cross-product-porta-cabin-30x10.pdf` |
| D4 | 98 | `d4-install-only-porta-cabin-20x10.pdf` |

Text extraction asserts exactly one of D1 to D4 in each PDF. The four final PDF pages were rendered at 2x and visually inspected. No validity period is present.

### G5: itemisation

The base is explicitly labelled `Base cabin <size>`. The two default uPVC windows appear separately with quantity 1, rate INR 5,490 per item and amount INR 5,490. Numeric transport is itemised with quantity, rate and amount. Installation has quantity 1 and `Confirmed in quotation` for rate and amount, so no value is invented.

### G6: one estimator

`src/pages/api/cabin-estimate-pdf.ts` imports and calls `computeCalculatorEstimate` from `src/lib/cabinCalculatorSSR.ts`, the estimator the page server render uses. The endpoint also applies the exported normaliser before computation. No second PDF pricing formula exists.

### G7: product provenance

Browser evidence shows the restored state on `/product/portable-toilet` as `documentProductMode=selected`, `Product=Porta Cabin`, disclosure present, distance 150 km and installation off. The matching PDF names Porta Cabin and does not name Portable Toilet.

### G8: copy and prohibited content

Text extraction across all four PDFs passed:

- zero em dashes;
- retired number `+91 62009 09435` absent;
- canonical warranty sentence byte-exact after normalising PDF line wrapping;
- all four current contacts present;
- no navigation, site header/footer, interface screenshot or product-page furniture.

### G9: build and non-regression

- Node 22 `tsc --noEmit`: exit 0.
- Node 22 `next build`: exit 0; `/api/cabin-estimate-pdf` is present in the route table. Six existing `react-hooks/exhaustive-deps` warnings remain outside this diff.
- Node 22 postbuild: exit 0; 452 pages, 417 indexable pages, sitemap total 452.
- Final production server endpoint: HTTP 200, `application/pdf`, descriptive `Content-Disposition`, 3,565-byte restored-design PDF.
- Real-browser production-build smoke: exactly one calculator on one prefill and one no-prefill route; `/api/enquiry` action retained; PDF control enabled; Step 2 number fields visible at 44 px high with their values; no-prefill disclosure present; prefill disclosure absent.

### G10: protected boundaries

`git diff --name-only -- page-structure src/data/wp-export src/data/products` returned no paths.

### G12: no-prefill disclosure

- No-prefill band: exact 77-character line present directly below the total at 1440 and 390.
- No-prefill PDF: exact line present immediately below the configuration block.
- Prefill band and PDF: line absent.
- Restored product on no-prefill host: product name and disclosure both present.

The required line changes header layout. At 1440, the measured calculator header is 177.1 px on the no-prefill state versus 155.5 px on the matching prefill state, a 21.6 px increase; the disclosure itself measures 16 px high. At 390 it renders at 12.8 px with 17.28 px line height and the header measures 415.4 px. This movement is reported and no compensating restyle was added.

## Evidence

Final PDFs are under `output/pdf/calc-L7-merge4a/`.

Rendered PDF pages and route screenshots are under `reports/calc-L7-merge4a/`:

- `d1-prefill-porta-cabin-30x10-page-1.png`
- `d2-no-prefill-general-20x10-page-1.png`
- `d3-cross-product-porta-cabin-30x10-page-1.png`
- `d4-install-only-porta-cabin-20x10-page-1.png`
- `prefill-band-1440.png`
- `no-prefill-band-1440.png`
- `no-prefill-band-390.png`
- `no-prefill-d2-band-1440.png`
- `restored-cross-product-d3-1440.png`

Poppler was unavailable and its non-admin Chocolatey install was denied by machine permissions. PyMuPDF, already installed, rendered every final page for visual inspection; pdfplumber independently extracted and verified the text.

## Stop condition

This PR is build-only against `static-migration`. It does not merge or deploy. It stops for SAMAN's written word.
