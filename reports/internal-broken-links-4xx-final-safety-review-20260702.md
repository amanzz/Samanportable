# Internal Broken Links / 4xx Final Safety Review - 2026-07-02

## Current git status summary

`git status --short` was run at the start of this review. The worktree is heavily dirty and not safe to stage or deploy as a whole.

High-level status:

- Many tracked files are modified before/around this fix, including `next.config.js`, `public/sitemap.xml`, `tsconfig.tsbuildinfo`, many `src/data/wp-export/**` JSON files, `src/pages/[slug].tsx`, `src/lib/schema.ts`, `src/lib/mailer.ts`, and other source/report files.
- Many untracked generated/verification folders exist, including `.next-*` verification folders.
- Many untracked report/research files and GBP image assets exist.
- The four source city post JSON files for this fix are untracked:
  - `src/data/wp-export/posts/container-office-in-guntur.json`
  - `src/data/wp-export/posts/container-office-in-puducherry.json`
  - `src/data/wp-export/posts/container-office-in-kozhikode.json`
  - `src/data/wp-export/posts/container-office-in-thrissur.json`
- Existing fix report is untracked:
  - `reports/internal-broken-links-4xx-fix-20260702.md`
- This final review report is new:
  - `reports/internal-broken-links-4xx-final-safety-review-20260702.md`

## Files confirmed as part of this scoped fix

Code/data/config files logically required for the broken-link fix:

- `next.config.js` - only the four root-level redirect lines added for this task are in scope.
- `src/data/wp-export/posts/container-office-in-guntur.json` - link replacement for `/site-office-container`.
- `src/data/wp-export/posts/container-office-in-puducherry.json` - link replacement for `/modular-container-office`.
- `src/data/wp-export/posts/container-office-in-kozhikode.json` - link replacement for `/container-office-cabin`.
- `src/data/wp-export/posts/container-office-in-thrissur.json` - link replacement for `/prefabricated-container-office`.

Report files related to this task:

- `reports/internal-broken-links-4xx-fix-20260702.md`
- `reports/internal-broken-links-4xx-final-safety-review-20260702.md`

Important isolation caveat:

- `git diff -- next.config.js` contains unrelated pre-existing changes in addition to the four redirect lines:
  - `NEXT_DIST_DIR` / `distDir` environment change near the top of the file.
  - `/product/portable-toilet/portable-toilet-cabi` redirect elsewhere in the file.
- Therefore, staging the whole `next.config.js` file is not isolated to this fix unless those unrelated hunks are intentionally included.
- The four city post JSON files are currently untracked, so staging them as whole files includes the entire page files, not only the URL replacements. That may be acceptable only if those full page files were already approved for inclusion.

## Files unrelated and not safe to stage

Do not stage or deploy the entire dirty worktree. All paths outside the scoped list above are unrelated to this broken-link fix.

Not safe to stage as part of this fix includes:

- `public/sitemap.xml`
- `tsconfig.tsbuildinfo`
- `.gitignore`
- `reports/link-issues/SEO_PHASE_1_FIX_REPORT_20260701.md`
- `src/components/ScrollToTop.tsx`
- `src/lib/mailer.ts`
- `src/lib/schema.ts`
- `src/pages/[slug].tsx`
- `src/data/wp-export/categories/container-offices.json`
- `src/data/wp-export/categories/portable-cabin.json`
- `src/data/wp-export/categories/portable-office.json`
- Other modified `src/data/wp-export/posts/*.json` and `src/data/wp-export/products/*.json` files not listed in the scoped fix section.
- Untracked `.next-*` verification folders.
- Untracked `SAMAN_C3_Batch*.md` research files.
- Untracked `public/gbp-posts/*.webp` assets not directly required by this four-link fix.
- Untracked reports unrelated to this exact fix.
- Untracked `zoho-automation/`.
- Other untracked city-page JSON files under `src/data/wp-export/posts/` not listed in the scoped fix section.

## Redirect mapping confirmed

`next.config.js` contains exactly four root-level redirect sources for the old broken URLs:

| Old URL path | Destination | Status |
| --- | --- | --- |
| `/site-office-container` | `https://www.samanportable.com/product/container-offices/site-office-container` | 301 |
| `/modular-container-office` | `https://www.samanportable.com/product/container-offices/modular-container-office` | 301 |
| `/prefabricated-container-office` | `https://www.samanportable.com/product/container-offices/prefabricated-container-office` | 301 |
| `/container-office-cabin` | `https://www.samanportable.com/product/container-offices/container-office-cabin` | 301 |

Existing `/product/...` redirect rules for similar product slugs also remain in `next.config.js`; those were not part of this task.

## Source-page link replacement confirmed

The four source pages no longer contain root-level links to the broken URLs.

| Source page file | Confirmed replacement |
| --- | --- |
| `src/data/wp-export/posts/container-office-in-guntur.json` | `https://www.samanportable.com/product/container-offices/site-office-container` |
| `src/data/wp-export/posts/container-office-in-puducherry.json` | `https://www.samanportable.com/product/container-offices/modular-container-office` |
| `src/data/wp-export/posts/container-office-in-kozhikode.json` | `https://www.samanportable.com/product/container-offices/container-office-cabin` |
| `src/data/wp-export/posts/container-office-in-thrissur.json` | `https://www.samanportable.com/product/container-offices/prefabricated-container-office` |

Product destination existence confirmed:

| Product file | Slug | Category |
| --- | --- | --- |
| `src/data/wp-export/products/site-office-container.json` | `site-office-container` | `container-offices` |
| `src/data/wp-export/products/modular-container-office.json` | `modular-container-office` | `container-offices` |
| `src/data/wp-export/products/container-office-cabin.json` | `container-office-cabin` | `container-offices` |
| `src/data/wp-export/products/prefabricated-container-office.json` | `prefabricated-container-office` | `container-offices` |

## Commands run and results

- `git status --short` - worktree heavily dirty; do not stage/deploy whole tree.
- `Get-Content -LiteralPath reports/internal-broken-links-4xx-fix-20260702.md` - reviewed previous fix report.
- `git diff -- next.config.js` - found the intended four redirect lines plus unrelated pre-existing hunks in the same file.
- `rg -n 'site-office-container|modular-container-office|prefabricated-container-office|container-office-cabin' ...` - inspected scoped config/source/product references.
- Scoped redirect/source/product verification script:
  - Root redirect source count: `4`.
  - Broken root href present in each of the four source JSON files: `False`.
  - Expected replacement URL present in each of the four source JSON files: `True`.
  - All four target product JSON files exist.
- Product JSON category check:
  - All four target products have category `container-offices`.
- `npm run type-check` - passed.
- `npm run lint` - passed with no ESLint warnings or errors.
- `npm run build` - passed; `next-sitemap` postbuild completed and reported 154 product + 342 post URLs collected, 77 redirecting URLs excluded, 433 kept.

## Commit safety

The fix is safe to commit only with scoped selection.

Recommended commit isolation:

- Include the four redirect lines in `next.config.js` via hunk-level staging, not whole-file staging, unless the unrelated `next.config.js` hunks are intentionally included in the same commit.
- Include the four source-page JSON files only if their full untracked page content has already been reviewed/approved. Because they are untracked, Git cannot stage just the URL replacement without first establishing a baseline or creating a manual patch.
- Include the two reports if report tracking is desired.

Not safe:

- `git add .`
- Whole-worktree staging.
- Whole-file staging of `next.config.js` without reviewing unrelated hunks.
- Blind staging of all untracked city pages/assets/reports.

## Deploy safety

The four-link fix itself is valid and build-clean.

It is not safe to deploy the entire current worktree because many unrelated modified and untracked files are present.

## Final recommendation

- Scoped fix correctness: safe.
- Safe to commit by selecting only truly scoped hunks/files: safe with caution.
- Safe to deploy entire current worktree: not safe.
- Final recommendation: safe only after isolating the scoped fix; not safe for whole-worktree deploy.
