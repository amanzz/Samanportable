# Internal Broken Links / 4xx Commit Attempt - 2026-07-02

## Result

No commit was created.

Safe isolated staging is blocked by the explicit critical rule for untracked full city/page files.

## Commit hash

N/A - commit not created.

## Reason commit was stopped

The scoped fix requires four source-page link replacements, but all four source-page JSON files are currently untracked full files. The task instruction says:

> If any of the four source-page files are untracked full files, do NOT stage or commit them automatically.

Therefore, staging and committing this fix would require manual approval for the full untracked page files before proceeding.

## Exact files needing manual approval before commit

These are required for the source-page link replacement part of the scoped fix, but they are untracked full files:

- `src/data/wp-export/posts/container-office-in-guntur.json`
- `src/data/wp-export/posts/container-office-in-puducherry.json`
- `src/data/wp-export/posts/container-office-in-kozhikode.json`
- `src/data/wp-export/posts/container-office-in-thrissur.json`

## Exact staged files

None.

`git diff --cached --name-only` returned no staged files.

## Files intentionally avoided

Avoided because they are unrelated or unsafe to stage as part of this isolated fix:

- Whole `next.config.js` file, because it contains unrelated hunks:
  - `NEXT_DIST_DIR` / `distDir` change.
  - `/product/portable-toilet/portable-toilet-cabi` redirect.
- `public/sitemap.xml`
- `tsconfig.tsbuildinfo`
- `.gitignore`
- `.next-*` folders and any generated build/cache folders
- `out/`
- `node_modules/`
- `public/gbp-posts/*`
- `public/email/`
- `zoho-automation/`
- Unrelated reports and research files
- Unrelated modified `src/data/wp-export/**` files
- Unrelated source files such as `src/components/ScrollToTop.tsx`, `src/lib/mailer.ts`, `src/lib/schema.ts`, and `src/pages/[slug].tsx`

Avoided until manual approval:

- `reports/internal-broken-links-4xx-fix-20260702.md`
- `reports/internal-broken-links-4xx-final-safety-review-20260702.md`
- The four untracked city source-page files listed above

## Scoped changes verified before stopping

- `next.config.js` contains the intended four redirect lines, but whole-file staging is unsafe because unrelated hunks exist in the same file.
- The four source-page files contain the intended replacement links, but they are untracked full files.
- The reports were read and confirm the same isolation risk.

## Validation command results

Validation commands were not run in this commit attempt because staging was blocked before a staged diff existed.

Per the requested flow, validation should run only after the staged diff is confirmed clean. Since no staged diff was created, no `npm run type-check`, `npm run lint`, or `npm run build` was run in this attempt.

Previous validation from the safety review remains documented in `reports/internal-broken-links-4xx-final-safety-review-20260702.md`, but it does not replace the need to validate again after manual approval and clean staging.

## Whether untracked city/page files were skipped

Yes. All four required city/page JSON files were skipped because they are untracked full files:

- `src/data/wp-export/posts/container-office-in-guntur.json`
- `src/data/wp-export/posts/container-office-in-puducherry.json`
- `src/data/wp-export/posts/container-office-in-kozhikode.json`
- `src/data/wp-export/posts/container-office-in-thrissur.json`

## Final deploy recommendation

Do not deploy the full dirty worktree.

This commit attempt produced no commit. The fix can be committed later only after manual approval to include the required untracked full city/page files, followed by clean staged-diff review and validation.
