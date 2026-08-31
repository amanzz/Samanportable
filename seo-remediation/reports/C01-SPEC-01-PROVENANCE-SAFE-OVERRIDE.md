# C01-SPEC-01 provenance-safe PC-01 specification override

Date: 27 August 2026

Branch: `seo/c01-spec-owner-override-prerequisite`

Approved base: `3e5d3ee9b8980cd5cc92d86c2ae8bcd62f4bc101`

Production comparison: `origin/static-migration` at `3346a532306c52932aeb2d813591bf95cb37716b`

Final verdict after C01-SPEC-01A qualification: `READY_TO_RESUME_PC01_V27_WITH_KNOWN_BASELINE_DEBT`

## Outcome

The narrow PC-01 runtime override is implemented and passes its dedicated data, fail-closed, build, architecture, publication, crawl, and browser checks. It changes only the rendered `porta-cabins` value for `Fasteners & sealing`. The generated artifact remains byte-identical, its provenance metadata remains truthful, the five named sibling entries remain unchanged, and no URL, canonical, sitemap, product fact, price, FAQ, GA asset, freight rule, temporary gate, or crosswalk changed.

The initial task withheld its conditional local commit because two mandated existing C01 validators fail on the unchanged approved base:

1. `validate-c01-copy-gates.py` fails at the existing `Electrical protection` hard-common assertion. The current generated data has grown beyond the original nine-page generator output and contains later product-specific values, while the unchanged validator evaluates every current product entry.
2. `validate-c01-pdfs.py` fails at an existing price-text assertion. The current product price data and the unchanged generated PDFs no longer agree for at least one row.

Follow-up C01-SPEC-01A ran the same commands in a clean detached base worktree and this candidate. It proved both failures identical after normalizing only the worktree prefix, including exit codes, stdout, stderr, assertion lines, first stack frames, failing row/PDF, and expected/actual evidence. They are now classified as `BASELINE_EQUIVALENT_KNOWN_FAILURE` and separate production debt. The controlled workbook is also unavailable, so the generator cannot be safely rerun. No validator was weakened, skipped, changed into a warning, or repaired outside this task's authorization.

## Base and work protection

- The production comparison ref remains exactly `3346a532306c52932aeb2d813591bf95cb37716b`. The stop-on-production-delta gate did not trigger.
- The isolated worktree was created from `3e5d3ee9b8980cd5cc92d86c2ae8bcd62f4bc101` at `D:\C-Drive-Archive\Website Code\Samanportable-main\saman-c01-spec-owner-override`.
- The original `seo/pc01-porta-cabins-local-preview` worktree remains at the approved base with only its original three untracked PC-01 reports.
- The report-only `seo/pc01-v27-final-owner-facts-preview` worktree remains clean at `6ffecaa4c5de9b6302f2081cf764e754b613293f`.
- No production delta affects this prerequisite. No merge, rebase, push, PR, or deployment was performed.

## Controlled workbook recovery search

Exact filename searched:

`SAMAN_MASTER_64_Products_Detailed_Technical_Specs_9_Sizes_Report-with-price-PR.xlsx`

Expected MD5:

`2bb681dff71ae744ea4d44418a09476a`

Read-only direct searches covered the accessible user and project areas under `C:\Users\Saman Pos`, `D:\C-Drive-Archive`, `D:\Client-data`, `D:\Project-shekhar`, `D:\SAMAN Product Content Recovery`, `D:\SAMAN-ARCHIVE`, `D:\SAMAN-KEEP-FOREVER`, and `D:\_REVIEW-BEFORE-DELETE`. Archive inspection covered 89 ZIP files and two TAR.GZ packages. Git inspection covered all refs, reachable objects, filename-history references, Git LFS listings, and the retained repository bundle.

No candidate file was found. Therefore there is no candidate path, byte size, or candidate MD5 to report, and no near-match workbook was used. Git history contains only textual references to the exact filename in commits `6ffecaa4`, `cdce5d80`, `9104de1b`, and `f60b2d6d`; it does not contain the workbook object.

## Generated base artifact

File: `src/data/products/c01-specifications.json`

| Control | Before | After |
|---|---:|---:|
| SHA-256 | `3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099` | `3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099` |
| Byte size | 233,799 | 233,799 |
| `sourceWorkbook` | Exact controlled filename | Unchanged |
| `sourceWorkbookMd5` | `2bb681dff71ae744ea4d44418a09476a` | Unchanged |
| `rowCount` | 30 | 30 |

`hardCommonRows` remains:

```text
Electrical protection
Electrical wiring
Fasteners & sealing
Grills / mosquito mesh
Warranty
Welding & fabrication
```

`divergenceProof` remains byte-identical:

```json
{
  "low-cost-porta-cabin": { "hubRows": 10, "hubPercent": 33.3, "nearestSibling": "mini-porta-cabin", "siblingRows": 3 },
  "luxury-porta-cabin": { "hubRows": 10, "hubPercent": 33.3, "nearestSibling": "portacabin-office", "siblingRows": 3 },
  "mini-porta-cabin": { "hubRows": 11, "hubPercent": 36.7, "nearestSibling": "low-cost-porta-cabin", "siblingRows": 3 },
  "ms-porta-cabin": { "hubRows": 10, "hubPercent": 33.3, "nearestSibling": "steel-porta-cabin", "siblingRows": 5 },
  "steel-porta-cabin": { "hubRows": 10, "hubPercent": 33.3, "nearestSibling": "ms-porta-cabin", "siblingRows": 5 },
  "porta-cabin-shop": { "hubRows": 13, "hubPercent": 43.3, "nearestSibling": "porta-cabin-with-toilet", "siblingRows": 14 },
  "porta-cabin-with-toilet": { "hubRows": 14, "hubPercent": 46.7, "nearestSibling": "porta-cabin-shop", "siblingRows": 14 },
  "portacabin-office": { "hubRows": 13, "hubPercent": 43.3, "nearestSibling": "luxury-porta-cabin", "siblingRows": 3 }
}
```

The base `Fasteners & sealing` value remains exactly:

> Security grill, insect mesh, guard, louver or protection selected only where the approved use and opening schedule requires it.

The base row occurs exactly once with that same value for `porta-cabins` and each named sibling: `low-cost-porta-cabin`, `luxury-porta-cabin`, `mini-porta-cabin`, `portacabin-office`, and `steel-porta-cabin`.

## Override mechanism and registry

No established runtime specification-override registry or effective-data accessor existed. The only public runtime import of the generated C01 dataset was in `src/lib/specsShippingTabs.ts`. Other direct references are generators, validators, or one-time data scripts and are intentionally not runtime consumers.

The new registry contains exactly one entry:

```json
{
  "id": "PC01-FASTENERS-SEALING-2026-08-27",
  "productSlug": "porta-cabins",
  "rowLabel": "Fasteners & sealing",
  "expectedSourceWorkbook": "SAMAN_MASTER_64_Products_Detailed_Technical_Specs_9_Sizes_Report-with-price-PR.xlsx",
  "expectedSourceWorkbookMd5": "2bb681dff71ae744ea4d44418a09476a",
  "expectedBaseDetail": "Security grill, insect mesh, guard, louver or protection selected only where the approved use and opening schedule requires it.",
  "replacementDetail": "Approved self-tapping fasteners at floor-board and panel fixings, with welded joints cleaned before panel closure. Weather sealing and roof drainage are verified at pre-dispatch inspection.",
  "authorityType": "OWNER_APPROVED_CORRECTION",
  "authorityDecision": "Fasteners = A",
  "authorityPackage": "PC-01 content package v2.7",
  "reason": "The generated Fasteners & sealing row incorrectly duplicates the Grills / mosquito mesh row.",
  "scope": "PC-01 runtime/rendered specification only",
  "siblingPolicy": "DO_NOT_CHANGE",
  "sunsetCondition": "Remove this override after the controlled workbook is recovered, corrected and regenerated with an equivalent approved PC-01 value."
}
```

`src/lib/c01SpecificationOverrides.js` is the controlled effective-data boundary. It imports the immutable generated base, validates every provenance and authority control, copies the selected entry and rows, and replaces only the exact matching detail. It throws `STALE_OR_INVALID_SPECIFICATION_OVERRIDE` if the registry, source filename, source MD5, base text, target, row count, override count, or authority controls differ.

`getProductTabsHtml()` in `src/lib/specsShippingTabs.ts` is the single public Specifications-tab boundary. It now obtains the C01 entry through `getEffectiveC01SpecificationEntry(pageSlug)` before passing it to the unchanged HTML renderer. There is no arbitrary HTML replacement and no layout rewrite.

Provenance remains truthful because the generated JSON and its source fields are untouched. The correction is stored separately with its owner authority, expected base fingerprint, exact scope, and sunset condition. The generator, `validate_specs()`, `hardCommonRows`, source-MD5 validation, divergence proof, PDFs, feeds, and sibling source records are unchanged.

## Rendered before and after proof

| Surface | Before/base | Effective/rendered |
|---|---|---|
| PC-01 `Fasteners & sealing` | Security grill, insect mesh, guard, louver or protection selected only where the approved use and opening schedule requires it. | Approved self-tapping fasteners at floor-board and panel fixings, with welded joints cleaned before panel closure. Weather sealing and roof drainage are verified at pre-dispatch inspection. |
| PC-01 `Grills / mosquito mesh` | Security grill, insect mesh, guard, louver or protection selected only where the approved use and opening schedule requires it. | Unchanged |
| Other PC-01 rows | 29 base rows | 29/29 data-for-data unchanged, with order preserved |
| Five named sibling entries | Generated base entries | 5/5 data-for-data unchanged |

Browser verification against the production build at `/product/porta-cabins` found exactly 30 rendered specification rows, exactly one `Fasteners & sealing` row, the exact approved replacement, the unchanged Grills row, and no missing or duplicate row. At 390 px and 1440 px, the corrected row was visible, the page had no horizontal overflow, and the browser console contained zero warnings or errors. No hydration mismatch was observed.

The dedicated validator also compares effective siblings and all other PC-01 rows to the imported base, then rechecks the generated file hash. This proves that the accessor does not mutate the imported JSON.

## Validation results

| Check | Result |
|---|---|
| Production comparison gate | PASS: `origin/static-migration` remains `3346a532306c52932aeb2d813591bf95cb37716b` |
| Dedicated override validator | PASS: schema, unique IDs/keys, exact target, exact replacement, 30-row order, 29 untouched rows, 5 untouched siblings, byte identity, and three fail-closed simulations |
| Simulated stale base detail | PASS: rejected with `STALE_OR_INVALID_SPECIFICATION_OVERRIDE` |
| Simulated source MD5 mismatch | PASS: rejected with `STALE_OR_INVALID_SPECIFICATION_OVERRIDE` |
| Simulated duplicate override | PASS: rejected with `STALE_OR_INVALID_SPECIFICATION_OVERRIDE` |
| Generated artifact SHA-256 | PASS: unchanged before and after all builds and checks |
| Existing generator execution | NOT RUN: exact MD5-controlled workbook is unavailable; generator and all validation logic remain unchanged |
| Existing C01 copy gate | FAIL on unchanged base: `AssertionError: Electrical protection` |
| Existing C01 PDF gate | FAIL on unchanged base: existing price-text assertion |
| TypeScript | PASS |
| Lint | PASS with five pre-existing warnings, unsuppressed |
| Production build and postbuild | PASS |
| Commercial architecture strict | PASS: 61 approved/live and 43 planned/unpublished |
| Temporary commercial gating | PASS: 63 exact controls unchanged |
| Publication gate | PASS: 61 approved, 43 planned, 63 temporary routes, 138 incoming gated-link occurrences to 42 targets |
| Canonical/indexability | PASS through the publication fixture; all 61 approved routes direct 200 and all 43 planned routes true 404 |
| Sitemap generation | PASS: 356 candidates, 321 indexable pages; generated contents normalize to the committed baseline |
| XML validation | PASS: all 9 sitemap XML files parse; zero `undefined` or `null` locations |
| Internal-link crawl | PASS: 31,838 occurrences, 338 unique targets, zero redirect/error edges |
| Complete local crawl | Expected nonzero base condition: two known roofing legacy 301 destinations are held draft 404; no new chain or internal edge |
| Redirect rule validation | Zero duplicate sources, zero chains, zero non-permanent explicit rules; two pre-existing normalizer loop observations remain visible |
| PC-01 rendered Specifications | PASS at default, 390 px, and 1440 px; exact replacement, 30 rows, unchanged order and Grills row, no console error or overflow |
| Application diff gate | PASS for implemented scope; only the registry, helper, narrow consumer wiring, validator, package command, and this report differ |

The five unsuppressed lint/build warnings are the four existing missing `product?.name` hook dependencies in the two price-calculator product templates and the existing raw `<img>` warning in `src/pages/product/[category]/[slug].tsx`. The build also retains the existing warning that custom routes exceed 1,000.

## Protected-scope proof

The forbidden-file diff gate is empty for the generated C01 JSON, generator, existing copy validator, product records, architecture fixtures, temporary-gating data, structured-data component, redirect configuration, and generated public sitemap contents. Therefore:

- no sibling specification source row changed;
- no URL, canonical, route, redirect, sitemap source, or architecture fixture changed;
- no price, FAQ, calculator, GA asset, product description, schema, form, performance component, or freight rule changed;
- all 63 temporary URL controls remain unchanged;
- all 138 gated-link crosswalk occurrences remain unchanged;
- no wider PC-01 v2.7 Phase A or Phase B work began.

## Files changed

Application scope:

- `src/data/products/c01-specification-overrides.json`
- `src/lib/c01SpecificationOverrides.js`
- `src/lib/specsShippingTabs.ts`
- `scripts/validate-c01-specification-overrides.mjs`
- `package.json`

Report:

- `seo-remediation/reports/C01-SPEC-01-PROVENANCE-SAFE-OVERRIDE.md`

## Risks and required follow-up

- The fail-closed accessor intentionally throws if the generated base or registry no longer matches the approved provenance contract. A future regeneration must resolve or remove the override before release.
- The controlled workbook remains unavailable. It must not be replaced with a near-match.
- The unchanged copy and PDF validators expose repository drift that predates this branch. Their failures require a separately authorized reconciliation of the expanded C01 dataset, hard-common scope, current product prices, and generated PDFs. This task does not authorize that work.
- The current Node 24/npm 11 environment is newer than the repository's declared Node 22/npm 10 engines. Build and validation passed despite the install warning; no dependency or lockfile change was made.

## Sunset and removal procedure

1. Recover the exact controlled workbook and verify MD5 `2bb681dff71ae744ea4d44418a09476a` before opening it as a source.
2. Apply the owner-approved PC-01 correction to the controlled source under a separately approved data event.
3. Run the unchanged generator and all original generator/copy/PDF validators successfully.
4. Confirm the regenerated PC-01 row is equivalent to the approved replacement and sibling rows remain authorized.
5. Remove the registry entry. If no override remains, remove the helper, restore the direct C01 accessor wiring, remove the dedicated command/script, and rebuild.
6. Re-run the complete validation and browser matrix before release.

## Rollback

The C01-SPEC-01A checkpoint contains this report, its qualification report, and only the authorized implementation files. Roll it back with `git revert <checkpoint-commit>` on a clean branch, then rerun the build, publication gate, and rendered-specification checks. Do not use a destructive reset.

## Final verdict

`READY_TO_RESUME_PC01_V27_WITH_KNOWN_BASELINE_DEBT`

The override mechanism is technically sound and provenance-safe. C01-SPEC-01A proves that the two legacy failures are unchanged baseline debt, so the local checkpoint is authorized. They remain production blockers and must be reconciled separately before deployment.
