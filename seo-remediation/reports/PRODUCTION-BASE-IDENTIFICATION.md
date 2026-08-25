# Production Base Identification

## Superseding integration update, 2026-08-26 IST

- Exact production/release branch: `origin/static-migration`.
- Exact current production commit integrated: `4fcb0d089404ecc966d343df89bdd74ecd8ddf44`, `Merge pull request #179 from amanzz/feature/co-08-expandable-container-office`.
- Earlier confirmed base containing all 14 feature-missing records: `82d0730e1dd9af7a9959525176d5f2ab95494fc2`.
- Controlled branch: `seo/remediation-production-base-integration`.
- Integration method: fast-forward to the reviewed RB-01C descendant, followed by reviewed three-way merges of current production and the reversible temporary 63-path branch.
- History compatibility: current production commit and `seo/remediation-temporary-63-gating` are both ancestors of the integrated head. The original `feature/llms-txt` checkout remains divergent and untouched.
- Preservation result: all 14 `src/data/wp-export/products/*` blobs listed below match production commit `4fcb0d08` exactly. CO-08 production assets/facts were preserved; only the owner-approved RB-01C lifecycle/schema decisions were retained during its two-file conflict resolution.
- Environment constraint: the managed workspace denied writes to the source repository `.git`. The controlled branch was completed in `tmp/seo-integration-worktree` with Git metadata in `tmp/seo-integration-repo-meta`. No source checkout ref or working file was altered.

The original identification below is retained as historical evidence of the first production-base decision. Where it names `82d0730e` as the release head, this superseding section is authoritative.

Updated: 2026-08-25 (IST)

## Base decision

- Production/release branch: `static-migration`
- Integration base: `origin/static-migration` at `82d0730e1dd9af7a9959525176d5f2ab95494fc2`
- Base commit time: 2026-08-25 13:07:09 +05:30
- Base subject: `Merge pull request #178 from amanzz/feature/co-07-flat-pack-container-office`
- Integration branch: `seo/remediation-production-base-integration`
- Integration worktree: `C:\Users\Saman Pos\Desktop\Website Code\Samanportable-main\saman-remediation-production-integration`

The live application does not expose a Git SHA. It does expose Next build `EFAkA9a_E6D26Iagg5NvZ`, and the live Multi-Story and Flat-Pack Container Office pages match the latest `static-migration` tree. Commit `82d0730e` and its PR-head parent `bb4b0352` have the same tree (`3b4395a239d9af68145ad0f882bf0ae329faa873`); the release branch head is therefore the unambiguous reversible integration base even though the runtime cannot distinguish those two identical trees by SHA.

## History compatibility

- Incomplete feature checkout: `feature/llms-txt` at `296082c64db2332d9bfb4d0febcd192a34463d59`
- Merge base with production: `27e1a945f9608d4fd94799520ead6f0f6f9b7865`
- Neither branch tip is an ancestor of the other.
- The two trees differ across 5,219 files: 465,961 insertions and 12,728 deletions, including 651 `src` files and 4,039 `public` files.

Because the remediation is uncommitted and the branches have diverged substantially, neither a whole-branch merge nor file-level copying is safe. The selected method is controlled hunk application on a new production-base worktree, followed by small reviewed commits. Product JSON, media, route metadata and newer production templates are preserved in place.

## Fourteen records missing from the feature checkout

All fourteen exist on the production base and are absent from the incomplete feature checkout. They will be preserved by leaving their records, related imports, assets and metadata untouched.

| Record/page | Production file path | Production URL | Approved-plan status | Feature checkout | Required preservation action |
|---|---|---|---|---|---|
| BESS Container | `src/data/wp-export/products/bess-container.json` | `/product/container-offices/bess-container` | Approved, published | Absent | Preserve production record/assets/imports; validate 200 and sitemap output |
| Containerized Data Center | `src/data/wp-export/products/containerized-data-center.json` | `/product/container-offices/containerized-data-center` | Approved, published | Absent | Preserve production record/assets/imports; validate 200 and sitemap output |
| Container Marketing Office | `src/data/wp-export/products/container-marketing-office.json` | `/product/container-offices/container-marketing-office` | Approved, published | Absent | Preserve production record/assets/imports; validate 200 and sitemap output |
| Multi-Toilet Ablution Block | `src/data/wp-export/products/ablution-block.json` | `/product/labor-colony/ablution-block` | Approved, published | Absent | Preserve production record/assets/imports; validate 200 and sitemap output |
| Accommodation Container | `src/data/wp-export/products/accommodation-container.json` | `/product/labor-colony/accommodation-container` | Approved; status conflict | Absent | Preserve `draft`; do not publish silently; block release pending owner decision |
| Oil Field Camp | `src/data/wp-export/products/oil-field-camp.json` | `/product/labor-colony/oil-field-camp` | Approved, published | Absent | Preserve production record/assets/imports; validate 200 and sitemap output |
| Prefab Site Canteen | `src/data/wp-export/products/prefab-site-canteen.json` | `/product/labor-colony/prefab-site-canteen` | Approved, published | Absent | Preserve production record/assets/imports; validate 200 and sitemap output |
| Double Story Porta Cabin | `src/data/wp-export/products/double-story-porta-cabin.json` | `/product/porta-cabins/double-story-porta-cabin` | Approved, published | Absent | Preserve production record/assets/imports; validate no regression |
| Fire-Rated Porta Cabin | `src/data/wp-export/products/fire-rated-porta-cabin.json` | `/product/porta-cabins/fire-rated-porta-cabin` | Approved, published | Absent | Preserve production record/assets/imports; validate no regression |
| GI Porta Cabin | `src/data/wp-export/products/gi-porta-cabin.json` | `/product/porta-cabins/gi-porta-cabin` | Approved, published | Absent | Preserve production record/assets/imports; validate no regression |
| Knock-Down Porta Cabin | `src/data/wp-export/products/knock-down-porta-cabin.json` | `/product/porta-cabins/knock-down-porta-cabin` | Approved, published | Absent | Preserve production record/assets/imports; validate no regression |
| PUF Porta Cabin | `src/data/wp-export/products/puf-porta-cabin.json` | `/product/porta-cabins/puf-porta-cabin` | Approved, published | Absent | Preserve production record/assets/imports; validate no regression |
| Skid-Mounted Porta Cabin | `src/data/wp-export/products/skid-mounted-porta-cabin.json` | `/product/porta-cabins/skid-mounted-porta-cabin` | Approved, published | Absent | Preserve production record/assets/imports; validate no regression |
| Soundproof Porta Cabin | `src/data/wp-export/products/soundproof-porta-cabin.json` | `/product/porta-cabins/soundproof-porta-cabin` | Approved, published | Absent | Preserve production record/assets/imports; validate no regression |

## Newly detected production-base conflict

The accepted 2026-08-24 backlog evidence contains 45 URLs that returned 404. The current production base now contains published product records for Multi-Story Container Office and Flat-Pack Container Office, and both live URLs return HTTP 200. It also contains a `publish` record for Prefab Steel House although that URL still returns 404.

No record will be deleted, downgraded or silently unpublished during integration. The strict release gate must report this conflict, and readiness remains blocked until the owner reconciles the 45-page hold instruction with these newer production merges.
