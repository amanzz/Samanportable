# Internal Broken Links / 4xx Fix - 2026-07-02

## CSV files reviewed

- `reports/www.samanportable.com_internal_broken_links_20260702.csv`
- `reports/www.samanportable.com_http_4xx_client_errors_20260702.csv`

## Exact broken URLs found

| Broken URL | HTTP code | Source from internal-links CSV |
| --- | ---: | --- |
| `https://www.samanportable.com/site-office-container` | 404 | `https://www.samanportable.com/container-office-in-guntur` |
| `https://www.samanportable.com/modular-container-office` | 404 | `https://www.samanportable.com/container-office-in-puducherry` |
| `https://www.samanportable.com/container-office-cabin` | 404 | `https://www.samanportable.com/container-office-in-kozhikode` |
| `https://www.samanportable.com/prefabricated-container-office` | 404 | `https://www.samanportable.com/container-office-in-thrissur` |

## Exact source pages fixed

| Source page | Old href | New href |
| --- | --- | --- |
| `/container-office-in-guntur` | `/site-office-container` | `/product/container-offices/site-office-container` |
| `/container-office-in-puducherry` | `/modular-container-office` | `/product/container-offices/modular-container-office` |
| `/container-office-in-kozhikode` | `/container-office-cabin` | `/product/container-offices/container-office-cabin` |
| `/container-office-in-thrissur` | `/prefabricated-container-office` | `/product/container-offices/prefabricated-container-office` |

## Files changed

- `next.config.js` - added four root-level 301 redirects.
- `src/data/wp-export/posts/container-office-in-guntur.json` - replaced the broken site-office-container link.
- `src/data/wp-export/posts/container-office-in-puducherry.json` - replaced the broken modular-container-office link.
- `src/data/wp-export/posts/container-office-in-kozhikode.json` - replaced the broken container-office-cabin link.
- `src/data/wp-export/posts/container-office-in-thrissur.json` - replaced the broken prefabricated-container-office link.
- `reports/internal-broken-links-4xx-fix-20260702.md` - this report.

Note: `next.config.js`, `public/sitemap.xml`, and many other files were already modified before this task started. `npm run build` also ran the repo's `postbuild` sitemap step. No generated build folders were manually edited.

## Final redirect mapping

| Source | Destination | Status |
| --- | --- | --- |
| `/site-office-container` | `https://www.samanportable.com/product/container-offices/site-office-container` | 301 |
| `/modular-container-office` | `https://www.samanportable.com/product/container-offices/modular-container-office` | 301 |
| `/prefabricated-container-office` | `https://www.samanportable.com/product/container-offices/prefabricated-container-office` | 301 |
| `/container-office-cabin` | `https://www.samanportable.com/product/container-offices/container-office-cabin` | 301 |

## Commands run and results

- `git status --short` before changes: dirty worktree already present with many modified and untracked files.
- `Get-Content` on both CSV files: confirmed exactly 4 internal broken link rows and 4 4xx URL rows.
- `rg -n 'site-office-container|modular-container-office|prefabricated-container-office|container-office-cabin' ...`: found the broken hrefs in the four reported source JSON files, existing product pages in `src/data/wp-export/products`, and existing related redirect/schema references.
- Product route verification: confirmed exported product files exist for `site-office-container`, `modular-container-office`, `prefabricated-container-office`, and `container-office-cabin`, all in the `container-offices` category.
- Post-fix bad-link search in `src` and `public`: no live source hrefs remain for the four root-level broken URLs.
- `npm run type-check`: passed.
- `npm run lint`: passed with no ESLint warnings or errors.
- `npm run build`: passed; `next-sitemap` postbuild completed and reported 154 product + 342 post URLs collected.
- Final live-source-only `rg` check in `src` and `public`: no matches for root-level broken hrefs.
- Local server validation on `http://localhost:3110`:
  - `/site-office-container` -> `301` to `https://www.samanportable.com/product/container-offices/site-office-container`
  - `/modular-container-office` -> `301` to `https://www.samanportable.com/product/container-offices/modular-container-office`
  - `/prefabricated-container-office` -> `301` to `https://www.samanportable.com/product/container-offices/prefabricated-container-office`
  - `/container-office-cabin` -> `301` to `https://www.samanportable.com/product/container-offices/container-office-cabin`
  - All four product targets returned `200 OK` locally.
  - `/product/container-offices` returned `200 OK` locally.
  - The four source pages returned `200 OK` locally and did not contain the broken hrefs.
- Temporary local server on port `3110`: stopped after validation.
- Final scoped `git status --short`: `next.config.js` modified; this report untracked; the four edited city post JSON files untracked; `public/sitemap.xml` and `tsconfig.tsbuildinfo` modified from pre-existing/generated validation state.

## Remaining risk

- The worktree was already heavily dirty before this fix, including many unrelated modified and untracked files. This fix is scoped, but a deploy from the full current working tree may include unrelated pending work.
- The four edited city post JSON files are currently untracked in git status, so deployment tooling must include them if these pages are meant to be part of the deployed source.
- `public/sitemap.xml` and `tsconfig.tsbuildinfo` were already modified before the task and may be touched by standard validation commands; neither was manually edited for this fix.

## Deploy recommendation

Safe to deploy this specific broken-link fix after reviewing/staging only the scoped files above. Do not deploy the entire dirty worktree blindly because unrelated pending changes are present.
