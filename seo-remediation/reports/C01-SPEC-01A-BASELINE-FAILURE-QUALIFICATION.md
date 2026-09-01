# C01-SPEC-01A baseline failure qualification

Date: 27 August 2026

Candidate branch: `seo/c01-spec-owner-override-prerequisite`

Base commit: `3e5d3ee9b8980cd5cc92d86c2ae8bcd62f4bc101`

Candidate pre-commit HEAD: `3e5d3ee9b8980cd5cc92d86c2ae8bcd62f4bc101`

Production comparison: `origin/static-migration` at `3346a532306c52932aeb2d813591bf95cb37716b`

Final verdict: `READY_TO_RESUME_PC01_V27_WITH_KNOWN_BASELINE_DEBT`

## Qualification outcome

Both mandated legacy C01 failures are `BASELINE_EQUIVALENT_KNOWN_FAILURE` results. The clean approved base and override candidate produce the same exit code, stdout, stderr, assertion, failing row or PDF, expected and actual evidence, and first relevant stack frame after normalizing only the absolute worktree prefix. The candidate introduces no additional failure.

The override files are not imported, read, or referenced by either legacy validator. The validator scripts and every input involved in the failures are byte-identical between the base and candidate. These failures are therefore separate production debt and are not regressions caused by the provenance-safe override.

Required debt classification:

`SEPARATE C01 VALIDATOR/PDF RECONCILIATION REQUIRED BEFORE PRODUCTION`

Production deployment remains prohibited.

## Protected candidate state

Before baseline qualification:

- Branch: `seo/c01-spec-owner-override-prerequisite`
- HEAD: `3e5d3ee9b8980cd5cc92d86c2ae8bcd62f4bc101`
- Generated C01 SHA-256: `3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099`
- Package lock changes: none
- Reset, clean, stash, discard, merge, rebase, push, PR, and deployment actions: none

The pre-qualification candidate contained exactly these authorized files:

- `src/data/products/c01-specification-overrides.json`
- `src/lib/c01SpecificationOverrides.js`
- `src/lib/specsShippingTabs.ts`
- `scripts/validate-c01-specification-overrides.mjs`
- `package.json`
- `seo-remediation/reports/C01-SPEC-01-PROVENANCE-SAFE-OVERRIDE.md`

This qualification adds only this second report and a report-only status update to the first report.

## Clean baseline worktree

A separate detached worktree was created at:

`D:\C-Drive-Archive\Website Code\Samanportable-main\saman-c01-spec-baseline-qualification`

It is detached and clean at `3e5d3ee9b8980cd5cc92d86c2ae8bcd62f4bc101`. No baseline file was modified. Both trees used the same operating system, shell, system Python installation, Python site packages, Node installation, npm installation, inherited environment, and command arguments. No per-tree environment override was used. The two failing commands invoke only the shared system Python environment and repository files; they do not require worktree-local Node dependencies.

Environment:

| Item | Value |
|---|---|
| Operating system | Microsoft Windows 11 Home Single Language, 64-bit, version 10.0.26200, build 26200 |
| PowerShell | 5.1.26100.9168 |
| Python | Python 3.14.5 |
| Python executable | `C:\Python314\python.exe` |
| Node | v24.16.0 |
| npm | 11.13.0 |

The only working-directory difference was the required worktree root. It is normalized below as `<WORKTREE>`.

## Validator comparison

| Validator | Base result | Candidate result | Comparison | Classification |
|---|---|---|---|---|
| `scripts/validate-c01-copy-gates.py` | Exit 1; `AssertionError: Electrical protection` at line 118 | Exit 1; `AssertionError: Electrical protection` at line 118 | Same command, stdout, stderr, assertion, component, expected count, actual data, and stack frame; no added failure | `BASELINE_EQUIVALENT_KNOWN_FAILURE` |
| `scripts/validate-c01-pdfs.py` | Exit 1; price assertion at line 85 for `porta-cabins` PDF | Exit 1; price assertion at line 85 for `porta-cabins` PDF | Same command, empty stdout, stderr, PDF, first variant, expected price, actual PDF price, and stack frame; no added failure | `BASELINE_EQUIVALENT_KNOWN_FAILURE` |

Programmatic normalized-output comparison also passed. For the copy gate, base and candidate stdout share SHA-256 `21b759f6f3cb1c25aee3bc27c3c732b7f72d5f652c2881e4432847406d5462d8`, and stderr shares `dbbe63b7239015fbb529773456bbdf2a7ffccb2af313ae639b454ec46fd2632c`. For the PDF gate, both stdout values are empty with SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`, and stderr shares `70081bf7a1b5c145f2c1e5bf11e6900920a002e6e13f70fce22ae41e21832949`.

### Copy-gate command

```text
python scripts/validate-c01-copy-gates.py --draft page-structure/content-drafts/COPY-PACK-C01-porta-cabins-9pages-APPROVED-26Jul2026.md
```

Base exit code: `1`

Candidate exit code: `1`

Normalized base stdout:

```text
porta-cabins: body 426c / 3 sentences; comparison 108c
low-cost-porta-cabin: body 409c / 3 sentences; comparison 108c
luxury-porta-cabin: body 399c / 3 sentences; comparison 107c
mini-porta-cabin: body 411c / 3 sentences; comparison 110c
ms-porta-cabin: body 409c / 3 sentences; comparison 111c
steel-porta-cabin: body 400c / 3 sentences; comparison 111c
porta-cabin-shop: body 421c / 3 sentences; comparison 109c
porta-cabin-with-toilet: body 430c / 3 sentences; comparison 113c
portacabin-office: body 408c / 3 sentences; comparison 113c
Right-to-exist shared 7-word sequences: 0
low-cost-porta-cabin: §H tabs 9
luxury-porta-cabin: §H tabs 9
mini-porta-cabin: §H tabs 4
ms-porta-cabin: §H tabs 9
steel-porta-cabin: §H tabs 9
porta-cabin-shop: §H tabs 9
porta-cabin-with-toilet: §H tabs 9
portacabin-office: §H tabs 9
Section H shared 7-word sequences: 0
```

Normalized candidate stdout: byte-for-byte identical to the normalized base stdout above.

Normalized base stderr:

```text
Traceback (most recent call last):
  File "<WORKTREE>\scripts\validate-c01-copy-gates.py", line 123, in <module>
    main()
    ~~~~^^
  File "<WORKTREE>\scripts\validate-c01-copy-gates.py", line 118, in main
    assert len(values) == 1, component
           ^^^^^^^^^^^^^^^^
AssertionError: Electrical protection
```

Normalized candidate stderr: byte-for-byte identical to the normalized base stderr above.

Assertion qualification:

- Failing row label: `Electrical protection`
- Assertion: `assert len(values) == 1, component`
- Expected distinct-value count: `1`
- Actual distinct-value count: `13`
- Product scope evaluated by the unchanged validator: all 19 current entries in `c01-specifications.json`
- A single failing product is not reported because the assertion evaluates the set across all entries.
- The complete slug/value map is identical between base and candidate.
- Surfaced failures: one, because the script stops at its first failing assertion.

### PDF-gate command

```text
python scripts/validate-c01-pdfs.py
```

Base exit code: `1`

Candidate exit code: `1`

Base stdout: empty

Candidate stdout: empty

Normalized base stderr:

```text
Traceback (most recent call last):
  File "<WORKTREE>\scripts\validate-c01-pdfs.py", line 104, in <module>
    main()
    ~~~~^^
  File "<WORKTREE>\scripts\validate-c01-pdfs.py", line 85, in main
    assert f"₹{indian(price['priceExGst'])}" in text
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError
```

Normalized candidate stderr: byte-for-byte identical to the normalized base stderr above.

First-failure qualification from a read-only diagnostic that follows the validator's iteration order:

- Product slug: `porta-cabins`
- PDF: `public/specs/porta-cabins-technical-specification.pdf`
- Variant: index 0, `sizeSlug` `10x10`, `10x10x8.5 ft`
- Expected current product-data text: `₹1,43,750`
- Actual generated-PDF ex-GST text for that row: `₹1,37,500`
- The actual PDF also contains `₹1,375` per sq ft and `₹1,62,250` incl. GST for that row.
- The read-only diagnostic counts 25 current-price assertions missing across the unchanged generated PDF set in both trees.
- Surfaced failures from the validator itself: one, because it stops on the first assertion.

No expected value, actual value, product slug, row label, PDF filename, assertion text, or exit code was normalized.

## Byte-identity and dependency proof

| File/input | SHA-256 in base and candidate |
|---|---|
| `scripts/validate-c01-copy-gates.py` | `3cd4cd1323d5cd1974f098b4a063ddadcb38ad0ae84a8590aa7c228e965eb60d` |
| `scripts/validate-c01-pdfs.py` | `b139bc99e89fcce023ec6a0d5365e8278278d6cec8669e5a3caf13373a2ca7d0` |
| Approved C01 draft | `22fed88951b15cd7b9f7d861dc1c4efd2f544e2fb1f66567d00d6e401522b132` |
| `section-h-datasets.json` | `0f85ff8514a1b307a625b31dfef07eb4ac7a669ddeeb7dd7d590d29a99abde3a` |
| `c01-specifications.json` | `3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099` |
| `porta-cabins.json` | `acfaffe39517b944770f5bd14f1e2cca5a918d515f08a2353296beec6f28fb32` |
| `porta-cabins-technical-specification.pdf` | `acf96b87d2d8e6b3ce7531c8c3503be756621c2936cb7bc7930a7ced3327d824` |

The complete `public/specs` directories compare with zero content differences. Repository search returns no reference from either legacy validator to:

- `c01-specification-overrides.json`
- `c01SpecificationOverrides.js`
- `getEffectiveC01SpecificationEntry`
- any specification-override API

The copy gate reads the approved draft, Section H data, and generated C01 JSON directly. The PDF gate reads the generated C01 JSON, current product JSON records, and generated PDFs directly. The override is a separate runtime-rendering layer and cannot affect either legacy assertion.

## Override and regression validation

| Check | Result |
|---|---|
| Dedicated override validator | PASS |
| Registry schema and unique IDs/keys | PASS |
| Exact PC-01 target and replacement | PASS |
| Base-detail mismatch simulation | PASS: fails closed with `STALE_OR_INVALID_SPECIFICATION_OVERRIDE` |
| Workbook-MD5 mismatch simulation | PASS: fails closed with `STALE_OR_INVALID_SPECIFICATION_OVERRIDE` |
| Duplicate-override simulation | PASS: fails closed with `STALE_OR_INVALID_SPECIFICATION_OVERRIDE` |
| Generated C01 identity | PASS: SHA-256 `3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099` |
| Other PC-01 rows | PASS: 29/29 unchanged, row order preserved |
| Named sibling entries | PASS: 5/5 data-for-data unchanged |
| TypeScript | PASS |
| Lint | PASS with five unchanged warnings, unsuppressed |
| Production build and postbuild | PASS |
| Commercial architecture release | PASS: 61 approved/live, 43 planned/unpublished |
| Temporary gating | PASS: 63 exact controls unchanged |
| Publication gate | PASS: 61 approved, 43 planned, 63 temporary routes |
| Gated-link crosswalk | PASS: 138 occurrences to 42 targets unchanged |
| Canonical/indexability | PASS: zero conflicts |
| Sitemap/XML | PASS: nine XML files parse; zero `undefined` or `null` locations; generated contents repository-equivalent |
| Internal-link crawl | PASS: 31,838 occurrences, 338 unique targets, zero redirect/error edges |
| Complete-crawl exit | Expected nonzero for only the two existing roofing redirects to held draft 404 destinations |
| Browser QA at 390 px | PASS: 30 rows, one corrected Fasteners row, unchanged Grills row, no overflow, zero console warnings/errors |
| Browser QA at 1440 px | PASS: 30 rows, one corrected Fasteners row, unchanged Grills row, no overflow, zero console warnings/errors |

Existing warnings remain visible:

- Four `react-hooks/exhaustive-deps` warnings for existing missing `product?.name` dependencies.
- One existing raw `<img>` warning in `src/pages/product/[category]/[slug].tsx`.
- The existing build warning for more than 1,000 custom routes.
- The two existing complete-crawl roofing redirect-to-draft observations.

## Protected-scope and SEO boundary audit

The final application diff changes only the owner-approved override registry, its fail-closed helper, the narrow Specifications-tab data boundary, the dedicated validator, and the package command. No product copy, URL, title, meta description, heading, FAQ, internal link, schema, price, freight fact, GA asset, PDF, sitemap source, generated sitemap content, route, redirect, architecture fixture, form, or performance component changed.

Final SEO change audit:

- Page/topic: PC-01 Porta Cabins specification correction
- Correct cluster: Porta Cabins
- Page type: existing main product category page
- Search intent and buyer type: unchanged
- Incremental audit score: 100/100 for scope and boundary safety; this is not a reapproval of unrelated existing page copy
- Cannibalization risk introduced by this diff: low, because no keyword, heading, meta, URL, or internal-link surface changed
- Product-boundary safety: pass; the corrected technical row remains within PC-01 only
- Internal-link safety: pass; zero link changes
- E-E-A-T effect: the correction replaces a duplicated, mislabeled technical value with the exact owner-approved specification while retaining explicit provenance controls
- Final change decision: publish-ready at the implementation level, but production remains blocked by the separately recorded validator/PDF reconciliation debt

## Risk and production restriction

The runtime override is suitable for a local checkpoint because its own validations are green and the two failing legacy validators are proven base-equivalent. This qualification does not make the old failures acceptable for production. The expanded generated C01 data, the validator's original hard-common scope, current price data, and generated PDFs still require a separate, owner-authorized reconciliation.

Do not deploy this checkpoint. Do not push, merge, create a PR, modify the old validators, regenerate from a near-match workbook, or begin wider PC-01 v2.7 work as part of this qualification.

## Rollback

After the local checkpoint commit, roll back with `git revert <checkpoint-commit>` on a clean branch. Re-run the dedicated override validator, TypeScript, production build, publication gate, sitemap/XML checks, and PC-01 browser check. Do not use a destructive reset and do not alter the detached baseline worktree.

## Final verdict

`READY_TO_RESUME_PC01_V27_WITH_KNOWN_BASELINE_DEBT`

The provenance-safe override may be committed locally. PC-01 v2.7 local preview work may resume in a later task. The two legacy validator failures remain production blockers.
