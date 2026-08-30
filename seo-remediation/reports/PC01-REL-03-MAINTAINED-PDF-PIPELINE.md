# PC01-REL-03 maintained PDF pipeline

## Checkpoint and remote safety

The recovered source checkpoint was verified on `seo/pc01-qualified-c01-debt-active-pdf` at `e2fe1fcccffcc93b9cb3c21d2569738d83074c0c`, descended from recovered ancestor `74ce8bc7e11363be9253d25d582b5347a78b143d`. The source worktree was clean and the original active PDF SHA-256 was `8c3759070a811eb62ae97ff9260d6bf21709d2324fa13187e73b13593a7ae853`.

The checkpoint secret audit found no credential paths or credential content in its six-file delta. The exact checkpoint was pushed without force only to `backup/seo-recovery-20260830/pc01-qualified-c01-debt-active-pdf`. The fetched remote backup resolved to `e2fe1fcccffcc93b9cb3c21d2569738d83074c0c`, and its tree matched the local `c298f08137e31892116f4ee774ffbfadb265fd25` tree.

The work ran in the isolated branch `seo/pc01-maintained-pdf-pipeline` at:

`C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\worktrees\pc01-maintained-pdf-pipeline`

The pipeline branch was not pushed. `origin/static-migration` remains `3346a532306c52932aeb2d813591bf95cb37716b`; `origin/main` remains `9188cab7e415569b85f2dddf750992cdeb5abc62`. No PR, merge or deployment was created.

## Old PDF evidence

The protected before-state archive remained at SHA-256 `8c3759070a811eb62ae97ff9260d6bf21709d2324fa13187e73b13593a7ae853`. A separate design-reference evidence set contains 13 PNG renders at 200 DPI, a contact sheet, extracted text, metadata, a page-size register and a content inventory:

`C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\evidence\PC01-PDF-PIPELINE-DESIGN-REFERENCE`

The old binary was used only for useful visual continuity, never as factual authority.

## Maintained pipeline

The selected technology is a noninteractive ReportLab 5 pipeline with a small Node source adapter and pypdf validation. The generator performs no network access. It uses only repository inputs, pinned Python package versions, ReportLab-bundled Bitstream Vera fonts, fixed metadata and invariant PDF output.

Tracked pipeline files:

- `page-structure/pdf-sources/pc01-porta-cabins-v1.json`
- `page-structure/pdf-templates/pc01_porta_cabins_technical_specification/layout.py`
- `page-structure/pdf-templates/pc01_porta_cabins_technical_specification/README.md`
- `page-structure/pdf-templates/pc01_porta_cabins_technical_specification/requirements.txt`
- `scripts/export-pc01-pdf-source.mjs`
- `scripts/generate-pc01-technical-pdf.py`
- `scripts/validate-pc01-active-pdf.py`
- `scripts/test-pc01-active-pdf.py`
- `package.json`

Commands:

- `npm run generate:pc01-pdf`
- `npm run validate:pc01-pdf`
- `npm run test:pc01-pdf`

The source/template/generator/validator/test separation and README update procedure make the active binary reproducible from a clean clone after installing the pinned runtime. The generator supports a temporary `--output` path, and the validator supports a temporary `--pdf` path so source changes can be proven before the active binary is replaced.

## Source-of-truth mapping

| Output | Authority consumed by generator |
| --- | --- |
| Six sizes, dimensions, areas, prices and 18% GST | `src/data/products/porta-cabins.json` variants |
| Occupancy | `porta-cabins.json` variant capacity |
| Approximate completed weights | Approved weight statements in `porta-cabins.json` description content |
| Active PDF href | `porta-cabins.json` `specPdfHref` |
| Six GA asset paths | `porta-cabins.json` `explorerImageTemplate` |
| Thirty technical rows | `getEffectiveC01SpecificationEntry('porta-cabins')` |
| Revision, status, canonical, controlled scope and commercial boundary | Versioned PC-01 PDF manifest |
| Layout only | ReportLab template module |

The adapter imports `src/lib/c01SpecificationOverrides.js` and calls the same `getEffectiveC01SpecificationEntry()` boundary as the Specifications tab. It does not read generated C01 JSON as the final specification and does not duplicate the approved Fasteners override in the template. Export fails closed if the active href, row count, six-variant order, occupancy, weight statement, GST value, GA map or GA files change unexpectedly.

## Deterministic build proof

Two builds in unrelated operating-system temporary directories produced identical bytes:

- run 1 SHA-256: `9d67076407aefab9cb43370696e2a8a32985d8ec2e49ea577df08e8b9192ca96`
- run 2 SHA-256: `9d67076407aefab9cb43370696e2a8a32985d8ec2e49ea577df08e8b9192ca96`

ReportLab invariant mode normalized creation date, modification date and document ID. Metadata dates are fixed at `D:20000101000000+00'00'`; there is no changing build timestamp. Ordering and fonts are fixed. The observed pinned PDF runtime was ReportLab 5.0.0, Pillow 12.2.0 and pypdf 6.14.2.

## Commits and PDF replacement

Phase A pipeline commit:

`911eb198c0f6cea70c72897029e3fc0c154ce837 feat(pdf): add reproducible Porta Cabins PDF pipeline`

The active PDF remained at the old hash throughout Phase A.

Phase B generated-PDF commit subject:

`fix(pdf): regenerate active Porta Cabins technical specification`

The final Phase B commit ID is reported by `git rev-parse HEAD` in the handoff because a commit cannot embed its own stable final ID after this report is attached. The old PDF was replaced only at `public/specs/saman-porta-cabins-technical-specification.pdf`; no other PDF changed.

| State | SHA-256 | Bytes | Pages |
| --- | --- | ---: | ---: |
| Old | `8c3759070a811eb62ae97ff9260d6bf21709d2324fa13187e73b13593a7ae853` | 3,208,446 | 13 |
| New | `9d67076407aefab9cb43370696e2a8a32985d8ec2e49ea577df08e8b9192ca96` | 3,870,545 | 11 |

## Content parity

The validator confirms the fixed revision and canonical URL, six approved sizes, six ex-GST prices, six incl. 18% GST prices, six occupancy ranges, six approximate weights, exactly 30 effective rows, exact Fasteners wording, conservative nonnumeric Warranty wording and all six GA boards. It rejects the inactive PDF path, stale prices/sizes, numeric warranty duration, a stale or duplicated Fasteners value and missing/altered GA evidence. Validation hashes the binary before and after execution and proves it changes no bytes.

All 19 required mutation scenarios failed closed. The generated C01 JSON stayed at `3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099`; the product JSON and override registry did not change. The six GA source bytes did not change. Six page prices, occupancy, weights, eight visible/schema FAQs, calculator behavior and 30 effective page specifications remained unchanged.

Detailed parity and hashes are in:

`C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\evidence\PC01-MAINTAINED-PDF-PIPELINE`

## Visual QA

The final 11 pages were rendered individually at 200 DPI and assembled into a contact sheet. Every page was inspected; the two specification pages were also inspected at original resolution. The A4 landscape layout is consistent, typography is readable, tables are unclipped, repeated header/footer and page numbers are present, text is searchable/selectable, and the six approved GA assets fit within their pages without crop or stretch. No overlap, black square, missing glyph or broken image was observed. The known rasterized `16:9 Website Edition` footer remains unchanged inside each approved source board.

## Complete regression

| Gate | Result |
| --- | --- |
| Qualified C01 debt | PASS in its protected recovered branch: expected legacy exit/assertion retained, 30/30 effective rows, 5/5 siblings |
| C01 specification override | PASS; exact Fasteners boundary and fail-closed simulations |
| PC-01 generator | PASS; active hash reproduced |
| PC-01 active validator | PASS; 11 pages, 6 images, 10,211 extracted characters |
| PC-01 PDF mutation tests | PASS, 19/19 |
| TypeScript | PASS |
| Lint | PASS with the same four hook warnings and one raw-image warning |
| Production build/postbuild | PASS; 39 static pages, 356 sitemap candidates, 321 indexed pages |
| Commercial architecture release | PASS; 61 approved/live and 43 planned/unpublished |
| Publication gate | PASS; 61 approved, 43 planned, 63 gated, 138 gated-link occurrences |
| Temporary commercial controls | PASS; exactly 63 |
| Sitemap/XML | PASS; nine XML files parsed, 321 sitemap pages crawled, zero sitemap issues |
| Canonical/indexability | PASS; 396 HTML routes returned 200, zero soft 404s, zero missing canonicals |
| Internal links | PASS; 31,838 occurrences, 338 unique targets, zero redirect/error edges |
| Image manifest | PASS in production postbuild; 5,605 entries collected and segmented sitemaps generated |
| Browser 390 px | PASS; effective 390 px viewport, no horizontal overflow, exact six interactive price pairs, PDF href, calculator and eight FAQ schema questions |
| Browser 1440 px | PASS; no horizontal overflow, six prices, PDF href, calculator, 8/8 visible/schema FAQs, zero browser console errors |
| Served PDF download | PASS; SHA-256 equals repository PDF |

The standalone repository-wide image-intake allowlist gate retains a pre-existing baseline debt: both the untouched recovered checkpoint and this branch report the identical 5,605 entries, 4,184 allowlist items, 4,246 changed/new entries and 16,658 failures, largely from legacy remote media. This task did not change an image or intake source, and the six PC-01 GA hashes remain exact. The build's image-manifest and sitemap validation passed.

## Changed files and dependencies

The diff from `e2fe1f...` contains only the nine pipeline/command files listed above, the active PC-01 PDF and this report. Product JSON, generated C01 JSON, override data, visible copy, prices, FAQ/schema, calculator, GA assets, images, routes, redirects, sitemap sources, architecture fixtures, forms, internal-link modules, performance components and every other PDF are unchanged.

No `package-lock.json` or JavaScript dependency changed. The Python runtime requirements are pinned in the template directory because ReportLab/Pillow generate the artifact and pypdf validates it. Installation is an environment step; generation and validation themselves are network-independent.

## Rollback and backlog

Rollback in order with non-destructive reverts: first revert the final generated-PDF/report commit, then revert pipeline commit `911eb198c0f6cea70c72897029e3fc0c154ce837`. Rerun the qualified-debt gate in its protected checkpoint worktree, the override validator, TypeScript, lint and production build. The external before-state evidence can be retained.

No sibling PDF was edited. The historical sibling/source-maintenance backlog remains outside this task. Qualified legacy C01 workbook debt remains documented and unresolved, but the active PC-01 PDF now consumes the controlled effective boundary and does not depend on that legacy validator passing. There is no remaining PDF-ownership blocker for PC-01. Performance work was not started and requires its own authorization.

## Final verdict

READY_FOR_PC01_OWNERSHIP_AND_PERFORMANCE_WITH_CURRENT_PDF
