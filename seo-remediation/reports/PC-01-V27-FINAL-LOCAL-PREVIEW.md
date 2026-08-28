# PC-01 v2.7 Final Local Preview

## Verdict

`BLOCKED_FASTENER_PROVENANCE`

The mandatory CX-A17 provenance gate failed before implementation. No PC-01 content, FAQ, specification, calculator, route, redirect, sitemap, form, performance, image, PDF, or deployment change was made.

## Repository control

- Production comparison ref: `origin/static-migration`
- Production comparison commit after fetch: `3346a532306c52932aeb2d813591bf95cb37716b`
- Expected production comparison commit: `3346a532306c52932aeb2d813591bf95cb37716b`
- Approved local preview base: `3e5d3ee9b8980cd5cc92d86c2ae8bcd62f4bc101`
- Isolated branch: `seo/pc01-v27-final-owner-facts-preview`
- Isolated worktree: `D:\C-Drive-Archive\Website Code\Samanportable-main\saman-pc01-v27-preview`
- Original owner-review worktree preserved without edits.
- Preserved untracked reports in the original worktree:
  - `seo-remediation/reports/PC-01-OWNER-FACT-VERIFICATION-SHEET.md`
  - `seo-remediation/reports/PC-01-OWNER-PREVIEW-APPROVAL.md`
  - `seo-remediation/reports/PC-01-PRODUCTION-GATE.md`

The production ref did not advance beyond the approved comparison commit, so no production-delta blocker was raised.

## Package control

- Package version: `2.7`
- External authorization received: local implementation and preview only
- Production deployment approval: false
- Final decisions confirmed: Occupancy B, Fasteners A, Rental B, GA artwork unchanged
- Controlling precedence applied: `19-final-owner-decisions.md`, then the current v2.7 FAQ source and implementation map, then `18-owner-fact-closure.md`
- Superseded instructions to keep nine FAQs and hold CX-A11 were not treated as active.
- Intended active scope: 21 rows across six files, with eight visible/schema-identical FAQs and no held rows.

## Blocking evidence

### Generated-artifact provenance

`src/data/products/c01-specifications.json` declares:

- `sourceWorkbook`: `SAMAN_MASTER_64_Products_Detailed_Technical_Specs_9_Sizes_Report-with-price-PR.xlsx`
- `sourceWorkbookMd5`: `2bb681dff71ae744ea4d44418a09476a`
- `rowCount`: `30`
- `hardCommonRows` includes `Fasteners & sealing`
- `divergenceProof` is generated alongside the product records

`scripts/generate-c01-content-assets.py` is the active generator. It:

1. requires the source workbook;
2. validates its exact byte count and MD5;
3. generates `c01-specifications.json`;
4. writes the provenance fields and divergence proof;
5. rejects any hard-common row whose value is not identical across the generator's product set.

The named workbook was not found under `D:\C-Drive-Archive\Website Code\Samanportable-main`, so the approved correction cannot be applied at the maintained source and regenerated without obtaining the controlled workbook.

### Enforced hard-common equality

Both of these executable checks enforce equality for `Fasteners & sealing`:

- `scripts/generate-c01-content-assets.py` in `validate_specs()`
- `scripts/validate-c01-copy-gates.py`

The requested PC-01-only replacement would intentionally make the hub row differ from the five sibling duplicate rows. That directly conflicts with the current executable hard-common rule. The owner explicitly prohibited widening this task to those sibling products.

### Why no direct JSON edit was made

A direct edit of only `products['porta-cabins'].specifications[17].detail` would:

- drift from the named controlled workbook;
- leave the stored workbook MD5 asserting provenance that no longer matches the generated content;
- violate the generator and validator's hard-common rule;
- require either weakening validation or changing sibling records, neither of which is authorized.

The approved replacement wording was therefore not inserted.

## Implementation status

- Phase A: not started
- Required Phase A commit `content(seo): finalize approved porta cabins facts and FAQs`: not created
- Phase B: not started
- Required Phase B commit `fix(calculator): align 40 ft freight bands with approved table`: not created
- Price ladder: unchanged
- GA images: byte-identical and untouched
- FAQ set: unchanged from the approved preview base
- Calculator freight data and caption: unchanged
- Fastener row and all sibling product records: unchanged
- Changed application files: zero
- Changed evidence files: this report only

## Validation and preview status

The mandatory pre-implementation provenance inspection failed, so downstream validation and visual-preview work was not run. Reporting any of those checks as passing would misstate the state of the branch.

- TypeScript, lint, build, schema, sitemap, canonical, internal-link, image-manifest, form-contract, and calculator-route validation: not run after v2.7 changes because no v2.7 changes were made
- 360x800, 390x844, 768x1024, and 1440x900 visual checks: not run
- 390 px and 1440 px screenshots: not created
- Local production-equivalent preview: not started
- Form rendering/submission: not exercised
- Production deployment, push, PR, and merge: not performed

## Required unblock

Provide a controlled integration path that satisfies both conditions without widening PC-01 scope:

1. Make the exact source workbook available and update its `01 Porta Cabins` row 34 through the maintained generation workflow, with its resulting provenance values reviewed; and
2. revise the generator and validator contract through a separately approved technical change so `Fasteners & sealing` may be product-specific, or provide an approved source-level mechanism that preserves the required PC-01-only divergence without weakening unrelated validation.

Do not change the five sibling records merely to satisfy the current hard-common assertion.

## Open production blockers preserved

- Shared trust-strip warranty conflict
- Service-life evidence
- Certificate and GST-registration evidence
- Approved public specification PDF/version decision
- Delivery record evidence
- Working-hours evidence
- Legal-entity evidence
- Factory-ownership evidence
- Returns terms
- Full inclusion/exclusion scope
- Sandbox and production release authorization
- Performance remediation
- Broad internal-link ownership cleanup
- Permanent dispositions for the 63 temporarily gated URLs
- Two roofing redirects

## Rollback

No application rollback is required because no application file changed. This isolated branch can be retained for the controlled provenance fix. The original owner-review checkout and its three untracked reports remain untouched.

## Preview recommendation

Do not present a v2.7 final local preview and do not deploy. Resolve the CX-A17 maintained-source and hard-common-contract conflict first, then restart from commit `3e5d3ee9b8980cd5cc92d86c2ae8bcd62f4bc101` or from this report-only branch.
