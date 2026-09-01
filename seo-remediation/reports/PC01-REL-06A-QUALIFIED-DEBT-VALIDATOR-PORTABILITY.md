# PC01-REL-06A qualified-debt validator portability

Date: 2026-08-31

Final verdict: `READY_TO_RESUME_PC01_REL_06_INTEGRATION`

## Source and isolated worktree

- Source worktree: `C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\worktrees\pc01-performance-remediation`
- Source branch: `seo/pc01-performance-remediation`
- Source / Candidate B checkpoint: `c04737f28895ef5296d1ab63e8fd98762fad4557`
- Source status before and after REL-06A: clean
- Isolated worktree: `C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\worktrees\pc01-qualified-debt-validator-portability`
- Isolated branch: `seo/pc01-qualified-debt-validator-portability`
- Isolated starting point: Candidate B exactly
- Production comparison: `origin/static-migration` at `3346a532306c52932aeb2d813591bf95cb37716b`
- `origin/main`: `9188cab7e415569b85f2dddf750992cdeb5abc62`

Git ancestry, rather than commit dates, established that the qualified-debt checkpoint `e2fe1fcccffcc93b9cb3c21d2569738d83074c0c`, maintained-PDF checkpoint `2ccd8f5a06f6c873b4c4596f245200f1cef709be`, keyword-ownership checkpoint `4dc9b4e639169b66140416d2237cb71c24fce66e`, and safe Phase-A commit `71fd5b5cd857fe710f19ec29355a34bd116b38ab` are in Candidate B ancestry. The expected Phase-A backup contains Candidate B and that ancestry.

## Original defect and baseline

The schema-v1 manifest recorded `recoveredSource.branch = seo/pc01-qualified-c01-debt-active-pdf`. `validateManifest()` pinned that field and `verifyGitState()` incorrectly compared the current branch to it. Candidate B therefore exited `1` with `AssertionError: unexpected branch`, despite all content, hash, legacy-failure, override, effective-row, sibling, rendering, and no-write controls passing.

The exact pre-change command, failure, code locations, 10/10 original mutation result, and direct substantive-control proof were recorded before implementation in `seo-remediation/reports/PC01-REL-06A-QUALIFIED-DEBT-BRANCH-COUPLING-BASELINE.md`.

## Manifest v2 and historical provenance

The existing manifest was advanced in place from schema version `1` to `2`; no competing manifest was created. It now pins:

- qualification commit: `e2fe1fcccffcc93b9cb3c21d2569738d83074c0c`;
- qualification tree: `c298f08137e31892116f4ee774ffbfadb265fd25`;
- subject: `chore(validation): qualify legacy C01 debt for PC-01 release`;
- ancestry policy: `REQUIRED_ANCESTOR_OF_CURRENT_HEAD`.

The former branch field is retained as `historicalSourceBranch` with `branchSemantics = HISTORICAL_PROVENANCE_ONLY`. The manifest explicitly states that current branch names and detached-HEAD state are not factual or security authorities; the pinned qualification commit/tree, content hashes, expected legacy failure, and owner decisions control validation.

All owner row decisions, controlled-workbook and warranty requirements, artifact hashes, expected legacy failure, specification override, active PDF path, prohibited interpretations, and sunset condition remain semantically unchanged. Debt remains `QUALIFIED_UNRESOLVED`.

## Validator behavior

The validator now:

- validates manifest v2 and the historical-only branch semantics;
- proves the recovered and qualification commits exist;
- verifies both pinned trees and the qualification subject;
- requires `git merge-base --is-ancestor <qualification-commit> HEAD`;
- retains recovered-source ancestry and production-ref checks as additional invariants;
- reports current branch or detached state as evidence only;
- accepts descendants and merge commits without branch-name allowlists;
- preserves generated-C01, legacy-validator, approved-copy-pack, exact legacy failure, owner-decision, override, 30-row, and five-sibling checks;
- snapshots nine validation source inputs and fails if any source byte changes during validation.

The debt cannot be marked resolved without a new approved workbook-backed event.

## Portability and mutation results

The updated suite passed `20/20`.

Positive checkout modes:

1. exact original qualification checkpoint;
2. Candidate B descendant;
3. differently named temporary Candidate B branch;
4. detached HEAD at Candidate B;
5. synthetic two-parent merge containing the qualification checkpoint;
6. branch/detached evidence reporting without outcome authority.

Negative cases rejected:

1. non-ancestor HEAD;
2. wrong qualification commit;
3. wrong qualification tree;
4. generated-C01 hash mutation;
5. legacy-validator hash mutation;
6. approved-copy-pack hash mutation;
7. expected-failure signature mutation;
8. additional legacy failure;
9. owner-row decision mutation;
10. specification-override failure;
11. another effective PC-01 row mutation;
12. protected-sibling mutation;
13. false debt resolution;
14. validator-source/no-write mutation.

The suite used one task-owned temporary shared repository and task-owned worktrees/refs only. All were removed afterward. Protected refs and worktrees were not changed.

## Complete regression

| Control | Result |
|---|---|
| Qualified C01-debt validator | PASS on isolated Candidate B descendant; qualification ancestry/tree/subject exact |
| Portability/mutation suite | PASS `20/20` |
| Specification override | PASS; generated SHA-256 exact; target effective; siblings `5/5` |
| Maintained active PDF | PASS; 11 pages, six images, searchable text |
| PDF mutation/determinism | PASS `19` mutations; deterministic SHA-256 `9d67076407aefab9cb43370696e2a8a32985d8ec2e49ea577df08e8b9192ca96` |
| Keyword ownership | PASS; 321 pages, 6,368 relevant occurrences, zero findings |
| Keyword mutations | PASS `11/11` |
| Deterministic Phase-A evidence | PASS; DOM `3811 -> 1745` (-54.2%), script transfer `650063 -> 355906` bytes (-45.3%), category first-load JS `581 -> 308 kB` (-47.0%) |
| TypeScript | PASS |
| ESLint | PASS with three pre-existing warnings |
| Production build/postbuild | PASS; 39 static pages; category first-load JS 308 kB |
| Strict commercial architecture | PASS; 61 approved/live, 43 planned/unpublished, one retained draft record |
| Publication gate | PASS; 61 approved, 43 planned, 63 temporary routes |
| Temporary commercial controls | PASS; exact 63 paths, zero approved/planned overlap, three stricter exclusions |
| Gated-link inventory | unchanged at 138 occurrences / 42 targets |
| Sitemap/XML | PASS; nine XML files, 321 ordinary locations, zero invalid/null/undefined or product-category nominations |
| Internal-link crawl | PASS; 321 pages, 31,518 occurrences, 338 unique targets, zero redirect/error edges |
| Image manifest | PASS; schema v1, 356 pages, 321 indexable, 5,605 entries |

Lighthouse was not run. No form was submitted. The deterministic evidence check is not a claim that synthetic LCP, TBT, INP, or Core Web Vitals passed; no performance pass is claimed by REL-06A.

## Immutable application state and authorized diff

- Generated C01 SHA-256 remains `3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099`.
- Active PDF SHA-256 remains `9d67076407aefab9cb43370696e2a8a32985d8ec2e49ea577df08e8b9192ca96`.
- Six prices, eight visible/schema FAQs, 30 effective specifications, six GA assets, occupancy, approximate completed weights, calculator/freight data, internal links, and Phase-A performance application files have zero diff from Candidate B.
- Generated C01, PDF, product data, specification override, visible page, routes, redirects, sitemaps, architecture, forms, and application code were not edited.

Exact files in the REL-06A commit:

1. `page-structure/contracts/pc01-c01-qualified-legacy-debt-2026-08-29.json`
2. `scripts/validate-pc01-qualified-c01-debt.mjs`
3. `scripts/test-pc01-qualified-c01-debt.mjs`
4. `seo-remediation/reports/PC01-REL-06A-QUALIFIED-DEBT-BRANCH-COUPLING-BASELINE.md`
5. `seo-remediation/reports/PC01-REL-06A-QUALIFIED-DEBT-VALIDATOR-PORTABILITY.md`

No package command was required.

## Commit, backup, rollback, and no-change proof

- Local commit subject: `fix(validation): allow qualified C01 debt on descendant release branches`
- The local commit is the commit containing this report; its immutable hash is recorded by the verified remote backup and final handoff because a commit cannot contain its own hash.
- Backup ref: `backup/seo-recovery-20260831/pc01-qualified-debt-validator-portability`
- Implementation branch is not pushed; only the backup namespace is authorized.
- Rollback: on a clean descendant branch, revert the single portability commit with `git revert <portability-commit>`, then rerun the qualified-debt validator and suite. Do not reset or alter protected worktrees.

The source performance worktree and official `pc01-v27-resumed-final-preview` recovery worktree remained clean at their exact heads. Legacy/blocked worktree registrations and heads were not modified. After commit the portability worktree is required clean. `origin/static-migration` and `origin/main` remain unchanged. PRs: `0`; production merges: `0`; deployments: `0`; forms submitted: `0`.

`READY_TO_RESUME_PC01_REL_06_INTEGRATION`
