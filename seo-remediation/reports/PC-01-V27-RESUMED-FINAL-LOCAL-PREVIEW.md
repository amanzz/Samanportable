# PC-01 v2.7 resumed final local preview

Date: 27 August 2026

Final verdict: `READY_FOR_OWNER_FINAL_LOCAL_PREVIEW_WITH_KNOWN_BASELINE_DEBT`

This is a production-equivalent local preview checkpoint only. Nothing was pushed, merged, submitted to a real form destination, or deployed.

## Control state

| Control | Verified state |
|---|---|
| Base checkpoint | `63d3d433dd10ae5c325d5cadf1f79017b3cf2f40` |
| Branch | `seo/pc01-v27-resumed-final-preview` |
| Production comparison | `origin/static-migration` at `3346a532306c52932aeb2d813591bf95cb37716b` |
| Content package | PC-01 Porta Cabins hub v2.7 |
| Phase-A commit | `75b9b95b23c26c04184d1e8f40cdede0ccd41a99` - `content(seo): finalize approved porta cabins facts and FAQs` |
| Phase-B commit | This report's commit - `fix(calculator): align 40 ft freight bands with approved table` |
| Preview | `http://localhost:3017/product/porta-cabins` |

The production comparison remained exact. No production-delta merge or rebase was required. The worktree was created from the provenance-safe checkpoint, and the two requested commits remain separate.

## Authorized implementation

Active rows implemented in Phase A:

`CX-A01`, `CX-A02`, `CX-A03`, `CX-A05`, `CX-A06`, `CX-A07`, `CX-A08`, `CX-A09`, `CX-A10`, `CX-A11`, `CX-A13`, `CX-A14`, `CX-A15`, `CX-A16`, `CX-A18`, `CX-A19`, `CX-A19b`, `CX-A20`, `CX-A21`, `CX-A22`.

`CX-A17` remains `SATISFIED_BY_CHECKPOINT_63d3d433`. The generated C01 specification JSON remained byte-identical at SHA-256 `3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099`. The dedicated override validator passed, the approved PC-01 Fasteners & sealing replacement remained effective, all other 29 PC-01 rows retained their order and content, and all five named sibling records remained unchanged.

`CX-D03` was implemented separately in Phase B.

### Final files changed from the checkpoint

Application files:

- `src/data/products/porta-cabins.json`
- `src/data/products/porta-cabins-applications.json`
- `src/lib/calculatorRates.ts`
- `src/lib/cabinCalculatorSSR.ts`

Evidence files:

- `seo-remediation/reports/PC-01-V27-RESUMED-FINAL-LOCAL-PREVIEW.md`
- `seo-remediation/reports/evidence/PC-01-V27/pc-01-v27-porta-cabins-390x844.png`
- `seo-remediation/reports/evidence/PC-01-V27/pc-01-v27-porta-cabins-1440x900.png`

`src/components/product-variant-hero/rightToExistEntries.tsx` already contained the final v2.7 value and was not changed artificially. No generated C01 data, override implementation, GA artwork, sibling product, route, redirect, canonical, sitemap input, architecture fixture, form, or performance source changed. Build-generated sitemap timestamp noise was restored; there is no sitemap diff.

## Content and data results

### Occupancy

Owner decision B is implemented for all six size records. Each frozen numeric range now uses `Recommended occupancy`, with ranges unchanged: 2-3, 3-4, 4-6, 5-7, 6-8, and 8-10 people. Existing prose now distinguishes the GA board's sample furniture/seating arrangement from recommended occupancy. No component or layout was added.

### Approximate completed unit weight

The owner-approved completed-unit values are present: approximately 1.5, 2.4, 3.0, 3.6, 4.5, and 6.0 tonnes for 10x10, 20x8, 20x10, 20x12, 30x10, and 40x10 respectively. The copy states that actual completed unit weight can vary with approved configuration, fit-out, and optional equipment. It explicitly does not characterize these figures as lifting, floor-load, roof-load, or structural-load capacities.

### GA text and artwork

- 20x12 is `Wide-Aisle Office`; the unsupported partition/private-cabin claim is absent.
- 30x10 is `High-Capacity Office`; the unsupported Two-Zone claim is absent.
- 40x10 describes a 10 ft private manager office plus 30 ft common office; the unsupported reception/meeting-space claim is absent.
- Approved alt counts match the boards.
- All six GA files remain byte-identical to the pre-edit baseline:
  - 10x10: `754e4935036d8f9830cf2a028e95a13b242672daef8fbd34c08e25391a47af8f`
  - 20x10: `0e30e0b496bf19482c47753db5ab1e457817b69f2f92c72001bec0f87ec043a8`
  - 20x12: `73df46ddacffd45110d7d0896e5555679fd8522f73c0d085cf02a70639c80db4`
  - 20x8: `6016083385f80228da40c4da9f2dd4e1e1be1cdac126f6a90f9d0615a6d9c8a4`
  - 30x10: `dbf5657c430f31ad9db2b5464a5d4e12e8d9e59be82fa02fcb2f7d1c4956f85f`
  - 40x10: `1f06d0b5b379d132ef5176b3a1f654df6cf7ca1f2fdb9e5b6b50856bedf0bf4c`

The rasterized `16:9 Website Edition` label remains the documented, non-blocking asset issue. No image was edited, renamed, resized, cropped, replaced, or re-exported.

### FAQ and schema parity

The rent-or-buy FAQ was removed atomically. Final results are eight visible FAQs, eight source-schema entries, eight rendered `FAQPage.mainEntity` entries, and exactly one FAQPage object. The required order is preserved, and every rendered JSON-LD answer is identical to its visible answer. No filler question, rental threshold, review, rating, or `aggregateRating` was introduced.

Rendered schema validation found exactly one Product, one BreadcrumbList, and one FAQPage. The Product AggregateOffer remains `INR`, `lowPrice: 143750`, `highPrice: 475000`, and `offerCount: 6`.

### Price preservation

`PRICE_LADDER_IDENTICAL = TRUE`

| Size | Ex-GST | Incl. 18% GST |
|---|---:|---:|
| 10x10 | 143750 | 169625 |
| 20x8 | 220000 | 259600 |
| 20x10 | 250000 | 295000 |
| 20x12 | 288000 | 339840 |
| 30x10 | 360000 | 424800 |
| 40x10 | 475000 | 560500 |

The source record, visible table, calculator published-price ladder, size mapping, order, Merchant feed, and AggregateOffer values agree. The local Merchant XML emitted the same six inclusive-GST prices for IDs `porta-cabin-10x10` through `porta-cabin-40x10`.

## CX-D03 freight result

The 20 ft array remains unchanged across all 18 bands. The new approved 40 ft array is:

`32500, 37500, 42500, 47500, 52500, 57500, 62500, 67500, 72500, 77500, 82500, 87500, 92500, 97500, 102500, 112500, 117500, 122500`

The only value changes relative to the former 20 ft plus Rs 5,000 calculation are:

| Distance | Final 40 ft ex-GST |
|---|---:|
| 850-900 km | Rs 1,12,500 |
| 900-950 km | Rs 1,17,500 |
| 950-1,000 km | Rs 1,22,500 |

Bands 1-15 remain identical to the old 20 ft plus Rs 5,000 outputs. Bangalore city and Delhi NCR remain free. Under 100 km remains quotation-only. Distance boundaries, trailer selection, ODC logic, GST, installation, product price ladders, and 20 ft values are unchanged.

Both confirmed consumers now read `bands40ft[bandIndex]`: live estimate calculation and rendered freight table. The estimate/PDF endpoint inherits the corrected result through `computeCalculatorEstimate`. The rendered table contains three control rows plus all 18 bands and agrees with the calculator. Its approved caption is present verbatim. No conflicting route-specific 40 ft policy was found.

### Shared freight blast radius

`RATE_CARD.freight` is used by the standalone calculator and the shared calculator on all 61 approved product routes, for 62 routed surfaces total:

- `/cabin-cost-calculator`
- `/product/container-cafe`
- `/product/container-cafe/container-coffee-shop`
- `/product/container-cafe/container-hotel`
- `/product/container-cafe/container-restaurant`
- `/product/container-cafe/food-truck-containers`
- `/product/container-cafe/modular-container-cafe`
- `/product/container-houses`
- `/product/container-houses/luxury-container-houses`
- `/product/container-houses/prefab-container-homes`
- `/product/container-houses/shipping-container-homes`
- `/product/container-offices`
- `/product/container-offices/bess-container`
- `/product/container-offices/containerized-data-center`
- `/product/container-offices/container-marketing-office`
- `/product/container-offices/container-office-cabin`
- `/product/container-offices/expandable-container-office`
- `/product/container-offices/flat-pack-container-office`
- `/product/container-offices/multi-story-container-office`
- `/product/container-offices/shipping-container-office`
- `/product/container-offices/site-office-container`
- `/product/eps-panel`
- `/product/glass-wool-panel`
- `/product/industrial-sheds`
- `/product/industrial-sheds/commercial-sheds`
- `/product/industrial-sheds/prefabricated-warehouses`
- `/product/labor-colony`
- `/product/labor-colony/ablution-block`
- `/product/labor-colony/labor-hutments`
- `/product/labor-colony/labor-sheds`
- `/product/labor-colony/oil-field-camp`
- `/product/labor-colony/prefab-labor-camps`
- `/product/labor-colony/prefab-site-canteen`
- `/product/pir-panel`
- `/product/portable-office`
- `/product/portable-office/prefabricated-office-cabins`
- `/product/portable-office/readymade-office-cabin`
- `/product/portable-office/small-office-cabin`
- `/product/portable-toilet`
- `/product/porta-cabins`
- `/product/porta-cabins/double-story-porta-cabin`
- `/product/porta-cabins/fire-rated-porta-cabin`
- `/product/porta-cabins/gi-porta-cabin`
- `/product/porta-cabins/knock-down-porta-cabin`
- `/product/porta-cabins/ms-porta-cabin`
- `/product/porta-cabins/porta-cabin-shop`
- `/product/porta-cabins/porta-cabin-with-toilet`
- `/product/porta-cabins/puf-porta-cabin`
- `/product/porta-cabins/skid-mounted-porta-cabin`
- `/product/porta-cabins/soundproof-porta-cabin`
- `/product/pre-engineered-buildings`
- `/product/prefab-buildings`
- `/product/prefabricated-houses`
- `/product/prefabricated-houses/porta-cabin-house`
- `/product/prefabricated-houses/prefabricated-bunkhouse`
- `/product/puf-panel`
- `/product/puf-panel/puf-wall-panel`
- `/product/rockwool-panel`
- `/product/roofing-sheet`
- `/product/roofing-sheet/polycarbonate-roofing-sheet`
- `/product/security-cabins`
- `/product/security-cabins/frp-security-cabin`

The automated blast-radius check verified all 18 rows, both free zones, quotation-only handling, rendered-table parity, estimate parity, PDF inheritance, and no unrelated estimate change.

## Technical validation

| Validation | Result |
|---|---|
| Dedicated specification override | Pass; generated SHA-256 unchanged; target effective; five siblings unchanged; all fail-closed simulations pass |
| Commercial architecture release | Pass: 61 approved/live, 43 planned/unpublished, one retained planned draft record |
| Publication gate | Pass: 61 approved direct 200, 43 planned true 404, 63 temporary routes checked |
| Temporary control source | Pass: 63 exact paths, zero approved/planned overlap, three stricter exclusions preserved |
| Gated-link inventory | Unchanged: 138 occurrences to 42 temporarily gated targets |
| Canonical/indexability | Pass: zero crawl conflicts; PC-01 self-canonical and `index, follow` |
| Internal links | Pass: 31,838 occurrences, 338 unique targets, zero redirect/error edges |
| Product child coverage | Pass: no approved child removed; Container Office rail retains nine unique approved children |
| Sitemap/XML | Pass: nine XML files parse, 321 ordinary page locations, zero `undefined`/`null`, zero product-category locations, no source or generated-content diff retained |
| Image manifest/assets | Pass: 356 pages, 5,605 entries; complete crawl checked 1,478 same-site image references with zero failures |
| Schema | Pass: zero parse errors or approved duplicate schema; PC-01 has one Product, one BreadcrumbList, one eight-entry FAQPage |
| TypeScript | Pass |
| Lint | Pass with four existing hook warnings and one existing raw-image advisory |
| Production build/postbuild | Pass; generated sitemap timestamp noise restored |
| Form contract | Safe stub-only native POST contract passes with zero outbound requests; no browser form or real provider destination was submitted |
| Complete local crawl | Expected nonzero only for the two retained roofing redirect-to-draft-404 decisions |

The older `validate:stg01b-structured-data` protected-diff guard exits nonzero because it is intentionally pinned to the pre-PC-01 STG-01B checkpoint and rejects the owner-authorized PC-01 content files and earlier checkpoint changes. Its runtime schema concerns were covered by the publication gate, complete crawl, and direct PC-01 Product/Breadcrumb/FAQ validation, all of which passed. The obsolete guard was not modified or suppressed.

Static redirect validation reports 1,005 rules, zero duplicates, zero destination-as-source chains, and zero non-permanent rules. Its two existing pattern interpretations remain visible: `/product/labor-colony/` normalization and the generic `/:path+/` normalizer. The complete crawl confirms the separate known blockers are the legacy metal- and PVC-roofing sources whose one-hop 301 destinations remain held draft 404 pages.

### Known warnings retained

- Four existing `react-hooks/exhaustive-deps` warnings: two in `site-office-container.tsx` and two in `src/pages/product/[category]/index.tsx`, each for `product?.name`.
- One existing raw `<img>` advisory in `src/pages/product/[category]/[slug].tsx`.
- The existing Next.js warning for more than 1,000 custom routes.
- Node 24/npm 11 differ from the repository's declared Node 22/npm 10 engines.
- The dependency install baseline reports 45 audit findings. None was changed or suppressed.

## Qualified legacy C01 debt

Both required validators were run and remain `BASELINE_EQUIVALENT_KNOWN_FAILURE` at the semantic and input level.

| Validator | Current result | Baseline comparison |
|---|---|---|
| `validate-c01-copy-gates.py` | Exit 1 at line 118, `AssertionError: Electrical protection` | Exact normalized stdout and stderr digests match the qualified baseline: `21b759f...` and `dbbe63b...`; no additional failure |
| `validate-c01-pdfs.py` | Exit 1 at line 85 on the same first `porta-cabins` price assertion | Same byte-identical validator and PDF, same source price Rs 1,43,750, same PDF price Rs 1,37,500, and no additional failure |

The current Python runner prints the rupee source literal in the PDF traceback as `\u20b9`, while the retained report rendered the glyph through the earlier console-capture path. That display-only escaping changes the captured stderr digest but does not change the assertion, line, validator, PDF, expected value, actual value, or first failure. Validator SHA-256 remains `b139bc99e89fcce023ec6a0d5365e8278278d6cec8669e5a3caf13373a2ca7d0`; PDF SHA-256 remains `acf96b87d2d8e6b3ce7531c8c3503be756621c2936cb7bc7930a7ced3327d824`.

Required production classification remains:

`SEPARATE C01 VALIDATOR/PDF RECONCILIATION REQUIRED BEFORE PRODUCTION`

## Browser and visual QA

The production build was opened at the verified preview URL and tested at 360x800, 390x844, 768x1024, and 1440x900.

All four viewports passed: no horizontal overflow, one H1, self-canonical, effective `index, follow`, eight visible/schema FAQs, intact selector/cards/price table/calculator/section order, exact freight caption, correct 40 ft tail rows, and no browser console warning or error. Occupancy text wraps acceptably without clipping. The GA artwork is unchanged.

The two specification diagrams in inactive lazy panels do not instantiate browser pixels until their panels are activated; both direct asset requests return HTTP 200 (111,400 and 112,234 bytes), and the complete asset crawl reports zero broken images. No failed asset request was introduced. The complete crawl also checked 52 PDF links with zero failures.

Screenshots:

- `seo-remediation/reports/evidence/PC-01-V27/pc-01-v27-porta-cabins-390x844.png`
- `seo-remediation/reports/evidence/PC-01-V27/pc-01-v27-porta-cabins-1440x900.png`

Verified preview URL: `http://localhost:3017/product/porta-cabins`

## Production blockers preserved

- C01 copy-validator reconciliation.
- Current product-price versus generated-PDF reconciliation.
- PC-01 performance remediation.
- Broad internal-link ownership cleanup.
- Safe form-provider sandbox.
- Two roofing redirect decisions.
- Permanent dispositions for the 63 temporarily gated URLs.
- Remaining trust, legal, and company evidence where still published.

This local preview does not authorize any production deployment.

## Rollback

On a clean branch, revert Phase B first and Phase A second with `git revert <phase-b-commit>` followed by `git revert 75b9b95b23c26c04184d1e8f40cdede0ccd41a99`. Rebuild and rerun the specification override, architecture, publication, temporary-gating, sitemap/XML, schema, link, price, image, and browser checks. Do not use a destructive reset, modify the provenance-safe checkpoint, or change the production comparison branch.

## Final verdict

`READY_FOR_OWNER_FINAL_LOCAL_PREVIEW_WITH_KNOWN_BASELINE_DEBT`
