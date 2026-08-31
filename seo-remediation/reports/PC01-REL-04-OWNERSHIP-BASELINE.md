# PC01-REL-04 Porta Cabin ownership baseline

Date: 2026-08-30

## Checkpoint and method

- Branch: `seo/pc01-keyword-ownership-remediation`
- Baseline commit: `2ccd8f5a06f6c873b4c4596f245200f1cef709be`
- Parent PDF-pipeline worktree remained clean.
- Production-equivalent baseline: successful Next.js production build and postbuild at the baseline commit.
- Crawl origin: the production build of the identical checkpoint, served at `http://127.0.0.1:3211`.
- Crawl set: all 321 URLs in the four page sitemaps.
- Active PDF SHA-256: `9d67076407aefab9cb43370696e2a8a32985d8ec2e49ea577df08e8b9192ca96`.
- Evidence matrix: `seo-remediation/reports/evidence/PC01-REL-04/porta-cabin-anchor-baseline.csv`.

The crawl records every rendered internal anchor whose visible text contains the Porta Cabin or Portable Cabin phrase family, or whose target contains a corresponding Porta Cabin path. Each row records its rendered source page, maintained source/module, anchor, href, direct HTTP result, final path, canonical, robots state, surface, repetition classification, target class and intent verdict.

## Recovered-package evidence gap

The requested v2.7 files `08-internal-link-map.md`, `11-codex-implementation-map.md` and `19-final-owner-decisions.md` are absent from the recovery directory, every available Git ref/history path, the Desktop archives and the Codex attachments. `RECOVERY-MANIFEST.md` independently records that the authoritative `SAMAN-SEO-CONTENT-FINAL-AUTHORITATIVE-2026-08-28` package did not survive. No policy was reconstructed from stale drafts. Current rendered evidence and the explicit PC01-REL-04 rules control this remediation.

## Baseline counts

| Measure | Count |
| --- | ---: |
| Sitemap pages crawled | 321 |
| Relevant rendered anchor occurrences | 6,688 |
| Distinct surface/anchor/href groups | 450 |
| Broad anchors to `/product/porta-cabins` | 784 |
| Links to retired `/product/portable-cabin` | 0 |
| Links to ten approved children | 251 |
| Links to the retained price guide | 330 |
| Links to Porta Cabin local pages | 2,421 |
| Links to product-category archives | 0 |
| Links to the 63 temporary/gated set | 0 |
| Contextual occurrences | 1,299 |
| Header occurrences | 2,227 |
| Footer occurrences | 3,162 |
| Repeated/sitewide occurrences | 5,624 |

Repeated/sitewide is an occurrence property and overlaps the surface counts. A contextual group rendered on more than ten sources is classified as repeated.

## Destination policy confirmation

- `/product/porta-cabins`: direct 200, self-canonical, `index, follow`.
- `/product/portable-cabin`: zero rendered href occurrences.
- `/porta-cabin-price-a-complete-guide-2025`: direct 200, self-canonical, `index, follow`; retention is unambiguous under the current approved non-product policy.
- All ten approved child URLs: direct 200, self-canonical, `index, follow`.
- No relevant anchor nominated a product-category archive or one of the 63 temporary/gated paths.
- No relevant target returned a redirect, 404 or 410.

## Repetition sources

The maintained shared sources, rather than generated page records, create the large repeated totals:

| Maintained source | Rendered link | Baseline repetition |
| --- | --- | ---: |
| `src/components/Header.tsx` | `Porta Cabin` to the hub | 318 |
| `src/components/Footer.tsx` | `Porta Cabin` to the hub | 318 |
| `src/components/Footer.tsx` | `Porta Cabin Price Guide` to the guide | 316 |
| `src/components/Footer.tsx` | eight informational/local resource labels | 316 each where the Footer renders |
| `src/pages/[slug].tsx` | category chip `Porta Cabins` to `/blog?category=porta-cabins` | 47 |
| `src/components/ds/RelatedProductLink.tsx` | `Explore Porta Cabins` to the hub | 88 |

The Header and Footer hub anchors correctly nominate the broad owner. The Footer guide anchor is informationally qualified but duplicates the hub's existing contextual guide relationship on every Footer-rendering page. The location-resource labels are location-qualified and retain useful local intent. Blog category chips are informational taxonomy navigation, not commercial owner links.

## Pre-change findings

| Finding | Count | Current source/behavior | Required disposition |
| --- | ---: | --- | --- |
| Hub-to-guide links rendered on PC-01 | 2 | contextual Section 2 link plus repeated Footer link | remove the repeated Footer occurrence; retain one contextual informational link |
| Contextual guide-to-hub links on the guide | 7 | six body links plus the maintained related-product CTA | unwrap the six body links; retain one purposeful CTA |
| Bare `porta cabin price` links to guide | 6 | six location posts | route the commercial price anchors to the hub |
| Broad `porta cabin range` to Portable Office | 1 | Small Office Cabin content | route to the Porta Cabins hub |
| Non-MS/unspecific steel anchors to MS child | 9 | product/post content after retired-link normalization | route broad/general steel wording to the hub; preserve explicit MS/mild-steel intent |
| Unqualified `Read More` anchors to local pages | 2 | Blog listing cards for Bareilly and Ludhiana | qualify the anchor's accessible text with its existing post title |
| Product-category archive nominations | 0 | none | preserve zero |
| Temporary/gated nominations | 0 | none | preserve zero |
| Retired-hub nominations | 0 | runtime normalization already removes them | preserve zero |

The pre-change validator correctly fails conditions 2, 5, 6, 7, 8, 12 and 13. It passes the retired-owner, archive, gated, hub-child presence, child-hub return, self-link, related-surface and no-source-mutation conditions.

## Baseline verdict

`REMEDIATION_REQUIRED`
