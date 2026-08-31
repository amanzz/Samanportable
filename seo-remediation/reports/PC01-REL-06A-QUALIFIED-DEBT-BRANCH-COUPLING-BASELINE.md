# PC01-REL-06A qualified-debt branch-coupling baseline

Date: 2026-08-31

## Checkpoints before modification

- Safe source worktree: `C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\worktrees\pc01-performance-remediation`
- Safe source branch: `seo/pc01-performance-remediation`
- Safe source HEAD / Candidate B: `c04737f28895ef5296d1ab63e8fd98762fad4557`
- Safe source status: clean
- Isolated worktree: `C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\worktrees\pc01-qualified-debt-validator-portability`
- Isolated branch: `seo/pc01-qualified-debt-validator-portability`
- Isolated starting HEAD: `c04737f28895ef5296d1ab63e8fd98762fad4557`
- Production ref: `origin/static-migration`
- Production commit: `3346a532306c52932aeb2d813591bf95cb37716b`
- Qualified-debt checkpoint: `e2fe1fcccffcc93b9cb3c21d2569738d83074c0c`
- Qualified-debt checkpoint tree: `c298f08137e31892116f4ee774ffbfadb265fd25`
- Qualified-debt checkpoint subject: `chore(validation): qualify legacy C01 debt for PC-01 release`

Git ancestry checks established that the qualified-debt, maintained-PDF, keyword-ownership, and Phase-A checkpoints are ancestors of Candidate B. The configured performance backup ref contains Candidate B and that ancestry.

## Exact branch coupling

The schema-v1 manifest field was:

`recoveredSource.branch = seo/pc01-qualified-c01-debt-active-pdf`

`validateManifest()` treated the field as immutable live policy through:

`assert.equal(manifest.recoveredSource?.branch, KNOWN.branch, 'release branch changed')`

`verifyGitState()` then treated it as a required current checkout through:

`assert.equal(branch.stdout.trim(), manifest.recoveredSource.branch, 'unexpected branch')`

The mutation test suite called `validateManifest(manifest)`, so it preserved the field/value assumption, but it did not exercise `verifyGitState()` or any alternate branch, detached-HEAD, merge, or non-ancestor checkout.

## Candidate B failure

Command:

`node scripts/validate-pc01-qualified-c01-debt.mjs`

Exit code: `1`

Exact controlling error:

```text
AssertionError [ERR_ASSERTION]: unexpected branch
+ actual - expected
+ 'seo/pc01-qualified-debt-validator-portability'
- 'seo/pc01-qualified-c01-debt-active-pdf'
    at verifyGitState (.../scripts/validate-pc01-qualified-c01-debt.mjs:300:10)
```

The isolated branch starts at the exact Candidate B commit, so this reproduces the stopped REL-06 failure without changing Candidate B.

## Substantive controls otherwise pass

A direct invocation of every exported substantive control, omitting only `verifyGitState()`'s branch equality, exited `0` from the clean Candidate B source worktree and established:

- manifest policy and owner decisions: PASS;
- all three pinned artifact hashes: PASS;
- exact legacy exit/failure row/stdout/stderr signatures: PASS;
- known Electrical-protection distinct-value count: `13`;
- dedicated specification-override validator: PASS;
- effective PC-01 rows: `30/30`;
- protected siblings: `5/5`;
- rendered PC-01 rows: `30`;
- second post-validation artifact rehash/no-write control: PASS.

The existing mutation suite also exited `0` with `PASS (10/10)`, rejecting generated-C01, legacy-validator, approved-copy-pack, expected-failure, additional-failure, specification-override, other-row, sibling, owner-decision, and false-resolution mutations.

Pinned legacy signatures remained:

- stdout SHA-256: `1c59583f67845b7a486310e884b78c904e6aed17af181d5ad3959ea76988a13b`
- stderr SHA-256: `e0296b5315561f83805445e19c0d7e71a62cdb2189de1e62a880da12b69a228b`

Conclusion: current branch-name equality is the isolated portability defect. No substantive debt qualification control needs weakening.
