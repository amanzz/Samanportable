# PC01-REL-04 Porta Cabin keyword ownership and internal links

Date: 2026-08-30

## Final result

`/product/porta-cabins` is the unambiguous broad commercial owner for the Porta Cabin and Portable Cabin phrase family. The ten approved specialist children retain subtype intent, the retained price guide uses informational intent, and location links remain location-qualified. The final rendered crawl found no ownership violations.

No implementation branch was pushed. No PR, merge or deployment was created.

## Checkpoint and protected backup

| Control | Verified result |
| --- | --- |
| Source worktree | `C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\worktrees\pc01-maintained-pdf-pipeline` |
| Source branch | `seo/pc01-maintained-pdf-pipeline` |
| Source checkpoint | `2ccd8f5a06f6c873b4c4596f245200f1cef709be` |
| Parent qualified-debt commit | `e2fe1fcccffcc93b9cb3c21d2569738d83074c0c` |
| PDF-pipeline commit | `911eb198c0f6cea70c72897029e3fc0c154ce837` |
| Source worktree after backup | clean |
| Secret audit since parent | PASS; 11 expected changed paths, zero sensitive-path or credential-pattern findings; no values printed |
| Backup ref | `backup/seo-recovery-20260830/pc01-maintained-pdf-pipeline` |
| Fetched backup commit | `2ccd8f5a06f6c873b4c4596f245200f1cef709be` |
| Source and backup tree | `f3064ea8e2525cfc43036c2cd504ff072a0efb60` |
| Complete ancestry from parent | PASS |
| Active PDF SHA-256 | `9d67076407aefab9cb43370696e2a8a32985d8ec2e49ea577df08e8b9192ca96` |
| Production ref | `origin/static-migration` at `3346a532306c52932aeb2d813591bf95cb37716b`, unchanged |
| Non-production `main` ref | `origin/main` at `9188cab7e415569b85f2dddf750992cdeb5abc62`, unchanged |

Only the exact protected checkpoint was pushed to the backup ref. The implementation branch was not pushed.

## Isolated implementation

- Worktree: `C:\Users\Saman Pos\Desktop\SAMAN-SESSION-RECOVERY-2026-08-28\worktrees\pc01-keyword-ownership-remediation`
- Branch: `seo/pc01-keyword-ownership-remediation`
- Base: `2ccd8f5a06f6c873b4c4596f245200f1cef709be`
- Phase A: `7978c79a2a1c020e9dd1c69a7011591b7f94d896` - `fix(seo): route broad Porta Cabin anchors to approved owner`
- Phase B: `b9ba911a8ec2316059f9102efef85c61da2569a2` - `fix(seo): strengthen contextual Porta Cabin ownership`

The required v2.7 files `08-internal-link-map.md`, `11-codex-implementation-map.md` and `19-final-owner-decisions.md` were not present in the recovery directory, Git history, Desktop archives or attachments. `RECOVERY-MANIFEST.md` independently records that the authoritative package did not survive. No stale package rule was restored; the explicit PC01-REL-04 contract, approved architecture, current source and rendered output controlled the work.

## Audit-versus-current anchor matrix

Both crawls used successful production builds of the respective commits and all 321 page-sitemap URLs. The baseline evidence is `porta-cabin-anchor-baseline.csv`; final evidence is `porta-cabin-anchor-final.csv`.

| Rendered measure | Baseline | Final | Delta |
| --- | ---: | ---: | ---: |
| Sitemap pages | 321 | 321 | 0 |
| Relevant anchor occurrences | 6,688 | 6,366 | -322 |
| Distinct surface/anchor/href groups | 450 | 444 | -6 |
| Broad owner links to `/product/porta-cabins` | 784 | 792 | +8 |
| Retired `/product/portable-cabin` links | 0 | 0 | 0 |
| Approved specialist-child links | 251 | 242 | -9 |
| Retained price-guide links | 330 | 8 | -322 |
| Location-page links | 2,421 | 2,421 | 0 |
| Product-category archive nominations | 0 | 0 | 0 |
| Gated or unapproved nominations | 0 | 0 | 0 |
| Contextual occurrences | 1,299 | 1,293 | -6 |
| Header occurrences | 2,227 | 2,227 | 0 |
| Footer occurrences | 3,162 | 2,846 | -316 |
| Repeated or sitewide occurrences | 5,624 | 5,318 | -306 |

The occurrence reduction is intentional: 316 repeated Footer guide links were removed and six redundant guide-body links were unwrapped. The remaining eight guide links are informationally qualified. Nine generic/non-MS steel anchors moved from the MS child to the broad hub, preserving only explicit MS or mild-steel child intent.

## Repetition sources and corrections

| Maintained source/module | Baseline behavior | Current behavior |
| --- | --- | --- |
| `src/components/Footer.tsx` | `Porta Cabin Price Guide` repeated on 316 Footer-rendering pages | repeated guide entry removed; correct broad-owner and qualified local links retained |
| `src/lib/staticContent.ts` | raw maintained HTML could preserve guide duplication, broad links to the wrong product, and generic steel links to the MS child | shared fail-closed ownership normalization routes broad intent to the hub, preserves explicit subtype intent, and retains only the guide CTA |
| `src/pages/blog.tsx` | two local cards exposed an unqualified `Read More` accessible anchor | existing post title is included for location-qualified accessible intent; visible design is unchanged |
| `src/lib/portaCabinClusterRail.ts` | three card titles included non-approved qualifiers | all ten hub links use their exact approved subtype names |
| `src/components/ds/RelatedProductLink.tsx` and `src/pages/[slug].tsx` | default `Explore Porta Cabins` CTA | guide-only opt-in label is `Explore the Porta Cabins range`; every other caller is unchanged |
| `src/components/product-variant-hero/rightToExistEntries.tsx` | existing informational hub-to-guide link used lowercase initial text | retained once as `Porta Cabin price guide` |

No product content record, title, H1, price, specification, FAQ, schema fact, URL, redirect, sitemap source, image, PDF, form, performance component or publication control was rewritten.

## Destination and relationship results

- Broad commercial intent points directly to `/product/porta-cabins`.
- Rendered internal hrefs to `/product/portable-cabin`: zero.
- Broad anchors to redirect, 404, 410, archive, planned, draft, gated or unapproved destinations: zero.
- All ten approved children return direct 200, are self-canonical and `index, follow`.
- The hub links each child with its exact subtype name: Double Story, Fire-Rated, GI, Knock-Down, MS, Shop, with Toilet, PUF, Skid-Mounted and Soundproof.
- Child rails omit self-links, use subtype labels for siblings and preserve a purposeful approved return-to-range link where the maintained layout supports it.
- The retained guide returns direct 200, is self-canonical and `index, follow`.
- The guide has one purposeful main-content link to the hub labeled `Explore the Porta Cabins range`.
- The hub has one main-content informational link to the guide labeled `Porta Cabin price guide`.
- Location destinations retain location-qualified anchors.
- Informational blog category/tag links remain taxonomy navigation and do not nominate a commercial owner.

## Ownership validator and mutations

`scripts/validate-pc01-keyword-ownership.mjs` crawled all 321 sitemap pages and passed all 15 ownership conditions. Final result: 6,366 relevant occurrences, 444 groups and zero findings. The validator also proved its source bytes were unchanged by validation.

`scripts/test-pc01-keyword-ownership.mjs` rejected 11/11 mutations: retired owner, broad-to-child, commercial guide anchor, unqualified local anchor, archive nomination, missing child return, wrong child slug, child self-link, gated link, redirecting child and validator-source mutation.

## Complete regression

| Check | Result |
| --- | --- |
| Production build and postbuild | PASS; 39 static pages, 321 page-sitemap URLs, image manifest regenerated successfully; only the established custom-route warning |
| TypeScript | PASS |
| ESLint | PASS with the five pre-existing warnings only |
| Strict commercial architecture | PASS; 61 approved live, 43 planned/unpublished, one retained draft record |
| Temporary commercial gating | PASS; 63 exact paths and no approved/planned overlap |
| Publication gate | PASS; 61 approved, 43 planned and 63 temporary routes checked; 321 pages and 31,516 internal-link occurrences crawled |
| Gated-link crosswalk | PASS; 138 occurrences to 42 targets, unchanged |
| Complete internal crawl | PASS for PC-01 scope; 321/321 sitemap pages 200, zero bad internal edges, canonical/indexability conflicts, schema errors, broken images, broken PDFs or internal-path exposure |
| Declared redirect baseline | Two redirects to intentionally unpublished roofing drafts still terminate at 404; identical at the untouched checkpoint and outside PC-01 scope |
| Qualified C01 debt | PASS as `QUALIFIED_UNRESOLVED`; exact legacy `Electrical protection` failure, 30/30 effective PC-01 rows and 5/5 protected siblings; 10/10 mutations rejected |
| C01 override | PASS; generated SHA-256 `3a35ec7564c8007640b57313efa50a3420e93df0165fedcf80bcc5a056c37099`, 5/5 siblings unchanged and fail-closed simulations passed |
| Active PDF | PASS; exact approved SHA-256, 11 pages, 6 images, 10,211 text characters |
| PDF mutations and determinism | PASS; 19/19 mutations rejected and two fresh generations reproduced the approved SHA-256 |
| Hub commercial evidence | PASS; six exact interactive ex-GST/incl-GST price pairs, eight visible/schema FAQs, 30 effective specification rows, all six GA boards, maintained PDF, calculator and freight controls preserved |
| Browser, effective 390 x 844 | PASS; no horizontal overflow, one H1, self-canonical/index-follow, ten exact child labels, one guide link, maintained PDF, calculator, 8 FAQ schema questions and all six interactive prices |
| Browser, effective 1440 x 900 | PASS; no horizontal overflow, ten distinct child URLs, one guide link, maintained PDF, calculator and no console errors |
| Production refs and external actions | `static-migration` unchanged; `main` unchanged; PRs 0; merges 0; deployments 0 |

The two declared roofing redirect findings are a byte-for-byte behavioral match to the untouched checkpoint: the final crawl has the same two sources, destinations, status codes and 404 draft endpoints. They were not introduced or changed by PC01-REL-04.

## Exact files changed

Phase A:

- `scripts/validate-pc01-keyword-ownership.mjs`
- `seo-remediation/reports/PC01-REL-04-OWNERSHIP-BASELINE.md`
- `seo-remediation/reports/evidence/PC01-REL-04/porta-cabin-anchor-baseline.csv`
- `src/components/Footer.tsx`
- `src/lib/staticContent.ts`
- `src/pages/blog.tsx`

Phase B:

- `package.json`
- `scripts/test-pc01-keyword-ownership.mjs`
- `seo-remediation/reports/evidence/PC01-REL-04/porta-cabin-anchor-final.csv`
- `src/components/ds/RelatedProductLink.tsx`
- `src/components/product-variant-hero/rightToExistEntries.tsx`
- `src/lib/portaCabinClusterRail.ts`
- `src/pages/[slug].tsx`

Evidence packaging:

- `seo-remediation/reports/PC01-REL-04-KEYWORD-OWNERSHIP-AND-INTERNAL-LINKS.md`

## Rollback

From this isolated branch, revert the implementation in reverse order:

1. `git revert b9ba911a8ec2316059f9102efef85c61da2569a2`
2. `git revert 7978c79a2a1c020e9dd1c69a7011591b7f94d896`

This preserves history and returns the implementation to checkpoint `2ccd8f5a06f6c873b4c4596f245200f1cef709be`. The protected backup ref independently preserves that exact checkpoint. Do not roll back with reset or clean.

## Remaining blockers

None for PC-01 performance remediation. Carry-forward evidence, not blockers for this ticket:

- The workbook-backed C01 legacy `Electrical protection` debt remains deliberately `QUALIFIED_UNRESOLVED` under its protected contract.
- The authoritative v2.7 package did not survive recovery; the evidence gap is recorded and no stale policy was inferred.
- Two pre-existing declared redirects terminate at unpublished roofing drafts; their final behavior exactly matches the untouched checkpoint and is outside PC-01 ownership scope.

## Final verdict

`READY_FOR_PC01_PERFORMANCE_REMEDIATION`
