# Internal Broken Links 4xx Untracked JSON Approval Packet - 2026-07-02

## Scope

Manual approval review for these four untracked city JSON files required by the scoped internal broken links / HTTP 4xx fix:

- `src/data/wp-export/posts/container-office-in-guntur.json`
- `src/data/wp-export/posts/container-office-in-puducherry.json`
- `src/data/wp-export/posts/container-office-in-kozhikode.json`
- `src/data/wp-export/posts/container-office-in-thrissur.json`

No files were staged, committed, pushed, or deployed during this review.

## Current Git Status Summary

Command run:

```powershell
git status --short
```

Summary from the current worktree:

- Modified tracked files: 269
- Untracked files/folders: 263
- Relevant scoped paths currently visible:
  - `M next.config.js`
  - `?? reports/internal-broken-links-4xx-commit-20260702.md`
  - `?? reports/internal-broken-links-4xx-final-safety-review-20260702.md`
  - `?? reports/internal-broken-links-4xx-fix-20260702.md`
  - `?? src/data/wp-export/posts/container-office-in-guntur.json`
  - `?? src/data/wp-export/posts/container-office-in-kozhikode.json`
  - `?? src/data/wp-export/posts/container-office-in-puducherry.json`
  - `?? src/data/wp-export/posts/container-office-in-thrissur.json`

The worktree remains heavily dirty. Do not stage the full worktree.

## Tracking And Ignore Status

Commands run:

```powershell
git check-ignore -v src/data/wp-export/posts/container-office-in-guntur.json src/data/wp-export/posts/container-office-in-puducherry.json src/data/wp-export/posts/container-office-in-kozhikode.json src/data/wp-export/posts/container-office-in-thrissur.json
git ls-files src/data/wp-export/posts/container-office-in-guntur.json src/data/wp-export/posts/container-office-in-puducherry.json src/data/wp-export/posts/container-office-in-kozhikode.json src/data/wp-export/posts/container-office-in-thrissur.json
```

Results:

- `git check-ignore -v`: no ignore rules matched these four files.
- `git ls-files`: no output for these four files.

| File | Exists | Tracked | Ignored | Status |
|---|---:|---:|---:|---|
| `src/data/wp-export/posts/container-office-in-guntur.json` | yes | no | no | untracked |
| `src/data/wp-export/posts/container-office-in-puducherry.json` | yes | no | no | untracked |
| `src/data/wp-export/posts/container-office-in-kozhikode.json` | yes | no | no | untracked |
| `src/data/wp-export/posts/container-office-in-thrissur.json` | yes | no | no | untracked |

## Per-File Approval Table

| File | Slug | Title / H1 | Canonical | Main product links | Old root href present? | Replacement link present? | Size | Review notes |
|---|---|---|---|---|---:|---:|---:|---|
| `src/data/wp-export/posts/container-office-in-guntur.json` | `container-office-in-guntur` | Title: `Container Office in Guntur`; H1: none in JSON content | Rank Math canonical: `https://www.samanportable.com/container-office-in-guntur` | `https://www.samanportable.com/product/container-offices`; `https://www.samanportable.com/product/container-offices/site-office-container` | no | yes | ~13.4 KB | JSON parsed successfully. City signals found in title, slug, and content. No placeholder terms found. No obvious malformed, empty, or wrong-city content found by automated review. |
| `src/data/wp-export/posts/container-office-in-puducherry.json` | `container-office-in-puducherry` | Title: `Container Office in Puducherry`; H1: none in JSON content | Rank Math canonical: `https://www.samanportable.com/container-office-in-puducherry` | `https://www.samanportable.com/product/container-offices`; `https://www.samanportable.com/product/container-offices/modular-container-office` | no | yes | ~13.4 KB | JSON parsed successfully. City signals found in title, slug, and content. No placeholder terms found. No obvious malformed, empty, or wrong-city content found by automated review. |
| `src/data/wp-export/posts/container-office-in-kozhikode.json` | `container-office-in-kozhikode` | Title: `Container Office in Kozhikode`; H1: none in JSON content | Rank Math canonical: `https://www.samanportable.com/container-office-in-kozhikode` | `https://www.samanportable.com/product/container-offices`; `https://www.samanportable.com/product/container-offices/container-office-cabin` | no | yes | ~13.5 KB | JSON parsed successfully. City signals found in title, slug, and content. No placeholder terms found. No obvious malformed, empty, or wrong-city content found by automated review. |
| `src/data/wp-export/posts/container-office-in-thrissur.json` | `container-office-in-thrissur` | Title: `Container Office in Thrissur`; H1: none in JSON content | Rank Math canonical: `https://www.samanportable.com/container-office-in-thrissur` | `https://www.samanportable.com/product/container-offices`; `https://www.samanportable.com/product/container-offices/prefabricated-container-office` | no | yes | ~13.3 KB | JSON parsed successfully. City signals found in title, slug, and content. No placeholder terms found. No obvious malformed, empty, or wrong-city content found by automated review. |

## Old Broken Link Search Result

Command run inside only the four files:

```powershell
rg -n -F -e 'href=\"https://www.samanportable.com/site-office-container\"' -e 'href=\"/site-office-container\"' -e 'href=\"https://www.samanportable.com/modular-container-office\"' -e 'href=\"/modular-container-office\"' -e 'href=\"https://www.samanportable.com/prefabricated-container-office\"' -e 'href=\"/prefabricated-container-office\"' -e 'href=\"https://www.samanportable.com/container-office-cabin\"' -e 'href=\"/container-office-cabin\"' -- src/data/wp-export/posts/container-office-in-guntur.json src/data/wp-export/posts/container-office-in-puducherry.json src/data/wp-export/posts/container-office-in-kozhikode.json src/data/wp-export/posts/container-office-in-thrissur.json
```

Result: no matches.

Note: a broad slug search does find the same slug strings inside the corrected product URLs, for example `/product/container-offices/site-office-container`. Those are not the old root-level broken hrefs.

## Replacement Link Confirmation

Command run inside only the four files:

```powershell
rg -n -o -F -e 'https://www.samanportable.com/product/container-offices/site-office-container' -e 'https://www.samanportable.com/product/container-offices/modular-container-office' -e 'https://www.samanportable.com/product/container-offices/prefabricated-container-office' -e 'https://www.samanportable.com/product/container-offices/container-office-cabin' -- src/data/wp-export/posts/container-office-in-guntur.json src/data/wp-export/posts/container-office-in-puducherry.json src/data/wp-export/posts/container-office-in-kozhikode.json src/data/wp-export/posts/container-office-in-thrissur.json
```

Results:

- `src/data/wp-export/posts/container-office-in-guntur.json`: `https://www.samanportable.com/product/container-offices/site-office-container`
- `src/data/wp-export/posts/container-office-in-puducherry.json`: `https://www.samanportable.com/product/container-offices/modular-container-office`
- `src/data/wp-export/posts/container-office-in-kozhikode.json`: `https://www.samanportable.com/product/container-offices/container-office-cabin`
- `src/data/wp-export/posts/container-office-in-thrissur.json`: `https://www.samanportable.com/product/container-offices/prefabricated-container-office`

Product JSON backing files are tracked and exist:

- `src/data/wp-export/products/site-office-container.json`
- `src/data/wp-export/products/modular-container-office.json`
- `src/data/wp-export/products/prefabricated-container-office.json`
- `src/data/wp-export/products/container-office-cabin.json`

Local product routes also returned `200`:

- `/product/container-offices/site-office-container`
- `/product/container-offices/modular-container-office`
- `/product/container-offices/prefabricated-container-office`
- `/product/container-offices/container-office-cabin`

## JSON Validity Result

Command run:

```powershell
Get-Content -LiteralPath <file> -Raw | ConvertFrom-Json
```

Results:

- `OK src/data/wp-export/posts/container-office-in-guntur.json`
- `OK src/data/wp-export/posts/container-office-in-puducherry.json`
- `OK src/data/wp-export/posts/container-office-in-kozhikode.json`
- `OK src/data/wp-export/posts/container-office-in-thrissur.json`

## Similar Tracked File Structure Comparison

Tracked comparison file used:

- `src/data/wp-export/posts/container-office-in-kochi.json`

Baseline:

- Slug: `container-office-in-kochi`
- Title: `Container Office in Kochi`
- Top-level keys: `id`, `date`, `date_gmt`, `guid`, `modified`, `modified_gmt`, `slug`, `status`, `type`, `link`, `title`, `content`, `excerpt`, `author`, `featured_media`, `comment_status`, `ping_status`, `sticky`, `template`, `format`, `meta`, `categories`, `tags`, `class_list`, `_links`, `_embedded`, `_rank_math_head`
- Nested structures checked: `title.rendered`, `content.rendered/protected`, `excerpt.rendered/protected`, `meta.footnotes`

Comparison result:

- All four untracked files use the same top-level key set as the tracked Kochi page.
- All four match the checked nested structures for `title`, `content`, `excerpt`, and `meta`.
- No missing or extra top-level keys were found against the tracked comparison file.

## Local Page Check

Local server check:

```powershell
npm start -- -p 3113
```

Temporary server was started on port `3113`, checked with `curl.exe`, and then stopped.

Source page results:

| Path | Status | Old root href count |
|---|---:|---:|
| `/container-office-in-guntur` | 200 | 0 |
| `/container-office-in-puducherry` | 200 | 0 |
| `/container-office-in-kozhikode` | 200 | 0 |
| `/container-office-in-thrissur` | 200 | 0 |

Product route results:

| Path | Status |
|---|---:|
| `/product/container-offices/site-office-container` | 200 |
| `/product/container-offices/modular-container-office` | 200 |
| `/product/container-offices/prefabricated-container-office` | 200 |
| `/product/container-offices/container-office-cabin` | 200 |

No full build was run for this manual approval review.

## Risks Found

1. These four files are untracked full JSON pages, not small tracked diffs. They must not be added automatically without owner approval.
2. The four JSON pages reference 20 image assets under `public/gbp-posts/`. Those asset files exist locally but are also untracked. If the JSON files are committed without the referenced images already present in the deployed environment, the four pages can deploy as `200` pages with broken images.
3. Prior commit safety rules explicitly said not to stage GBP assets. Therefore, adding the four JSON files alone is only safe if the owner accepts the image-asset risk or separately approves an image-asset plan.
4. The broader worktree is still heavily dirty. Do not deploy the entire current worktree.

Referenced untracked image assets:

- `public/gbp-posts/container-office-guntur-amaravati-construction-office.webp`
- `public/gbp-posts/container-office-guntur-autonagar-workshop-site.webp`
- `public/gbp-posts/container-office-guntur-dispatch-bangalore.webp`
- `public/gbp-posts/container-office-guntur-gate-security-cabin.webp`
- `public/gbp-posts/container-office-guntur-industrial-estate-admin-cabin.webp`
- `public/gbp-posts/container-office-puducherry-auto-unit-admin-cabin.webp`
- `public/gbp-posts/container-office-puducherry-dispatch-bangalore.webp`
- `public/gbp-posts/container-office-puducherry-pipdic-estate-site.webp`
- `public/gbp-posts/container-office-puducherry-project-site-cabin.webp`
- `public/gbp-posts/container-office-puducherry-qc-supervisor-office.webp`
- `public/gbp-posts/container-office-kozhikode-commercial-admin-cabin.webp`
- `public/gbp-posts/container-office-kozhikode-construction-site-cabin.webp`
- `public/gbp-posts/container-office-kozhikode-dispatch-bangalore.webp`
- `public/gbp-posts/container-office-kozhikode-dispatch-office.webp`
- `public/gbp-posts/container-office-kozhikode-timber-yard-site.webp`
- `public/gbp-posts/container-office-thrissur-commercial-office-cabin.webp`
- `public/gbp-posts/container-office-thrissur-construction-site-cabin.webp`
- `public/gbp-posts/container-office-thrissur-dispatch-bangalore.webp`
- `public/gbp-posts/container-office-thrissur-industrial-admin-cabin.webp`
- `public/gbp-posts/container-office-thrissur-kinfra-park-site.webp`

## Owner Decision Needed

Decision required: APPROVE adding these four untracked JSON files, or DO NOT APPROVE.

Recommended decision state: needs owner decision.

The files are valid JSON, structurally consistent with a tracked container-office city page, free of the old root-level broken hrefs, and link to valid product destinations. However, because they are full untracked pages and reference untracked image assets, they should not be staged or committed until the owner explicitly approves the full-page additions and decides how to handle the image assets.

## Exact Next Prompt Recommendation After Approval

If the owner approves adding the four JSON files, use this prompt:

```text
Approved: add the four untracked city JSON files for the scoped internal broken links / HTTP 4xx fix. Create the isolated commit by staging only:
- the four approved city JSON files
- only the four intended redirect lines/hunk in next.config.js
- the scoped internal-broken-links reports

Do not use git add .
Do not stage unrelated dirty files.
Do not stage GBP image assets unless I separately approve those assets.
Run npm run type-check, npm run lint, and npm run build before committing.
Commit message: fix: redirect broken container office internal links
Do not push or deploy.
```

If the owner does not approve, do not stage or commit the four JSON files. Rework the scoped fix without adding these untracked pages, or obtain separate approval for the needed page and image assets.

## Final Recommendation

Approval packet result: needs owner decision.

Safe to commit automatically: no.

Safe to commit later by selecting only scoped files: yes, only after owner approval for the four full JSON files and with careful hunk staging for `next.config.js`.

Safe to deploy entire current worktree: no.
