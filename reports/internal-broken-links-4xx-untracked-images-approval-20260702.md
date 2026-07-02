# Internal Broken Links 4xx Untracked Images Approval Packet - 2026-07-02

## Scope

Manual approval review for the 20 untracked `public/gbp-posts/*.webp` assets referenced by these four untracked JSON page files:

- `src/data/wp-export/posts/container-office-in-guntur.json`
- `src/data/wp-export/posts/container-office-in-puducherry.json`
- `src/data/wp-export/posts/container-office-in-kozhikode.json`
- `src/data/wp-export/posts/container-office-in-thrissur.json`

No files were staged, committed, pushed, deployed, or modified except this requested report.

## Current Git Status Summary

Command run:

```powershell
git status --short
```

Summary at review time:

- Modified tracked files: 269
- Untracked files/folders: 264
- Relevant image paths were all shown as `?? public/gbp-posts/...`
- Relevant JSON paths were all shown as `?? src/data/wp-export/posts/...`

The worktree remains heavily dirty. Do not stage the full worktree.

## Image References Extracted

Command used to extract image references from only the four JSON files:

```powershell
$jsonFiles = @(
  'src/data/wp-export/posts/container-office-in-guntur.json',
  'src/data/wp-export/posts/container-office-in-puducherry.json',
  'src/data/wp-export/posts/container-office-in-kozhikode.json',
  'src/data/wp-export/posts/container-office-in-thrissur.json'
)
```

Actual count:

- Total image references: 20
- Unique image assets: 20
- Five images per city JSON file

Extracted paths:

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

## Per-Image Approval Table

| Image path | Referenced by | Git status | Size | Dimensions | Integrity | Relevance review |
|---|---|---:|---:|---:|---|---|
| `public/gbp-posts/container-office-guntur-amaravati-construction-office.webp` | `container-office-in-guntur.json` | untracked | 110.7 KB | 1200x675 | ok | Relevant container/site-office image; filename aligns with Guntur/Amaravati page context. |
| `public/gbp-posts/container-office-guntur-autonagar-workshop-site.webp` | `container-office-in-guntur.json` | untracked | 109.1 KB | 1200x675 | ok | Relevant container office at a worksite; filename aligns with Guntur Autonagar context. |
| `public/gbp-posts/container-office-guntur-dispatch-bangalore.webp` | `container-office-in-guntur.json` | untracked | 102.0 KB | 1200x675 | ok | Relevant container office/factory dispatch style image; filename aligns with delivery from Bangalore. |
| `public/gbp-posts/container-office-guntur-gate-security-cabin.webp` | `container-office-in-guntur.json` | untracked | 106.7 KB | 1200x675 | ok | Relevant small gate/security cabin image; filename aligns with page section. |
| `public/gbp-posts/container-office-guntur-industrial-estate-admin-cabin.webp` | `container-office-in-guntur.json` | untracked | 99.8 KB | 1200x675 | ok | Relevant admin cabin image; filename aligns with industrial estate context. |
| `public/gbp-posts/container-office-puducherry-auto-unit-admin-cabin.webp` | `container-office-in-puducherry.json` | untracked | 118.0 KB | 1200x675 | ok | Relevant industrial/admin cabin image; filename aligns with Puducherry auto-unit context. |
| `public/gbp-posts/container-office-puducherry-dispatch-bangalore.webp` | `container-office-in-puducherry.json` | untracked | 118.5 KB | 1200x675 | ok | Relevant transport/dispatch image; filename aligns with Bangalore dispatch context. |
| `public/gbp-posts/container-office-puducherry-pipdic-estate-site.webp` | `container-office-in-puducherry.json` | untracked | 114.6 KB | 1200x675 | ok | Relevant site/industrial estate cabin image; filename aligns with PIPDIC context. |
| `public/gbp-posts/container-office-puducherry-project-site-cabin.webp` | `container-office-in-puducherry.json` | untracked | 118.6 KB | 1200x675 | ok | Relevant construction/project site cabin image; filename aligns with page context. |
| `public/gbp-posts/container-office-puducherry-qc-supervisor-office.webp` | `container-office-in-puducherry.json` | untracked | 112.2 KB | 1200x675 | ok | Relevant supervisor/QC office image; filename aligns with page context. |
| `public/gbp-posts/container-office-kozhikode-commercial-admin-cabin.webp` | `container-office-in-kozhikode.json` | untracked | 88.8 KB | 1200x675 | ok | Relevant commercial/admin cabin image; filename aligns with Kozhikode page context. |
| `public/gbp-posts/container-office-kozhikode-construction-site-cabin.webp` | `container-office-in-kozhikode.json` | untracked | 117.2 KB | 1200x675 | ok | Relevant construction site cabin image; filename aligns with page context. |
| `public/gbp-posts/container-office-kozhikode-dispatch-bangalore.webp` | `container-office-in-kozhikode.json` | untracked | 116.4 KB | 1200x675 | ok | Relevant dispatch/transport image; filename aligns with Bangalore dispatch context. |
| `public/gbp-posts/container-office-kozhikode-dispatch-office.webp` | `container-office-in-kozhikode.json` | untracked | 111.3 KB | 1200x675 | ok | Relevant dispatch office/cabin image; filename aligns with page context. |
| `public/gbp-posts/container-office-kozhikode-timber-yard-site.webp` | `container-office-in-kozhikode.json` | untracked | 110.5 KB | 1200x675 | ok | Relevant container/site-office image; filename aligns with timber-yard page context. |
| `public/gbp-posts/container-office-thrissur-commercial-office-cabin.webp` | `container-office-in-thrissur.json` | untracked | 114.6 KB | 1200x675 | ok | Relevant commercial office cabin image; filename aligns with Thrissur page context. |
| `public/gbp-posts/container-office-thrissur-construction-site-cabin.webp` | `container-office-in-thrissur.json` | untracked | 112.6 KB | 1200x675 | ok | Relevant construction site cabin image; filename aligns with page context. |
| `public/gbp-posts/container-office-thrissur-dispatch-bangalore.webp` | `container-office-in-thrissur.json` | untracked | 93.4 KB | 1200x675 | ok | Relevant dispatch/container office image; filename aligns with Bangalore dispatch context. |
| `public/gbp-posts/container-office-thrissur-industrial-admin-cabin.webp` | `container-office-in-thrissur.json` | untracked | 86.8 KB | 1200x675 | ok | Relevant industrial/admin cabin image; filename aligns with page context. |
| `public/gbp-posts/container-office-thrissur-kinfra-park-site.webp` | `container-office-in-thrissur.json` | untracked | 112.2 KB | 1200x675 | ok | Relevant container office at a site; filename aligns with Kinfra park context. |

## Tracking, Missing, And Ignore Counts

| Status | Count |
|---|---:|
| Tracked | 0 |
| Untracked | 20 |
| Ignored | 0 |
| Missing | 0 |
| Corrupt by lightweight WebP header check | 0 |
| Empty files | 0 |
| Byte-identical duplicate hash groups | 0 |

## Image Size And Dimension Summary

Lightweight image integrity check:

- Confirmed `RIFF` / `WEBP` signature.
- Parsed WebP dimension chunks.
- Confirmed every referenced file has readable dimensions.
- Computed SHA-256 hashes for duplicate detection.

Results:

- All files are 1200x675.
- Smallest file: 86.8 KB.
- Largest file: 118.6 KB.
- Files over 300 KB: none.
- Empty files: none.
- Corrupt files: none found.
- Byte-identical duplicate files: none found.

## Files Over 300 KB

None.

## Missing Or Broken Local Image References

Search/check performed only against the four JSON files and their extracted `<img src>` values.

Result:

- Missing local references: none.
- Every `/gbp-posts/*.webp` reference resolves to an existing file under `public/gbp-posts/`.

## Usage Elsewhere In The Repo

Search command used for each filename, excluding generated/vendor folders and excluding reports for source usage:

```powershell
rg -l -F --glob '!reports/**' --glob '!node_modules/**' --glob '!out/**' --glob '!**/.next*/**' -- <filename> .
```

Findings:

- Most filenames are referenced only by their matching city JSON file.
- `container-office-guntur-industrial-estate-admin-cabin.webp` is also mentioned in `SAMAN_C3_Batch12_Research_2026-07-02.md`.
- `container-office-kozhikode-dispatch-bangalore.webp` is also mentioned in `SAMAN_C3_Batch12_Research_2026-07-02.md`.
- Including reports, all filenames are also mentioned in `reports/internal-broken-links-4xx-untracked-json-approval-20260702.md`, which is documentation, not live page usage.
- No additional live page/source usage was found outside the city JSON files and the noted research markdown mentions.

## Suspicious Or Duplicate-Looking Content

No missing, corrupt, empty, oversized, or off-topic images were found.

Visual review notes:

- All images show container offices, container cabins, delivery/dispatch, industrial/admin cabins, construction sites, or worksite settings.
- The visual content is relevant to the page themes.
- The image filenames are city-specific, but the images themselves appear to be generic container-office/worksite images rather than independently verifiable city-location photos.
- No byte-identical duplicates were found by SHA-256.
- Possible visual reuse or near-duplicate reuse across city pages was observed:
  - `container-office-guntur-amaravati-construction-office.webp` and `container-office-kozhikode-timber-yard-site.webp`
  - `container-office-guntur-autonagar-workshop-site.webp` and `container-office-thrissur-dispatch-bangalore.webp`
  - `container-office-guntur-industrial-estate-admin-cabin.webp` and `container-office-thrissur-industrial-admin-cabin.webp`

This is not a technical corruption issue, but it is an owner/content-quality decision.

## JSON Plus Images Approval Decision

The four JSON files should not be approved alone if these pages are expected to render without broken local images. They reference these 20 local image assets, and all 20 assets are currently untracked.

Recommended decision state: needs owner decision.

Owner decision needed:

- APPROVE adding four JSON files plus the required 20 image assets, or
- DO NOT APPROVE.

If approved, stage only the exact four JSON files, the exact 20 image assets listed here, the scoped report files, and only the intended `next.config.js` redirect hunk. Do not use `git add .`.

## Final Recommendation

Technically, the image assets are safe from an integrity and broken-file perspective:

- 20/20 exist locally.
- 20/20 are valid WebP files by lightweight header/dimension check.
- 20/20 are under 300 KB.
- 20/20 are untracked and not ignored.
- 0 missing.
- 0 corrupt.
- 0 empty.
- 0 byte-identical duplicate hash groups.

Approval should still be explicit because these are untracked image assets and there is possible visual reuse across city pages.

Safe to approve JSON plus images together automatically: no.

Safe to approve after owner review: yes, if the owner accepts the full-page additions, the 20 image additions, and the visual-reuse risk.

Safe to deploy entire current worktree: no.
