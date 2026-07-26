# CODEX PROMPT — EVENT A: C-01 REDIRECTS & RETIREMENT
<!-- PASTE THIS ENTIRE FILE INTO A SEPARATE CODEX SESSION. Runs in PARALLEL with Event B (content build). -->

You are executing the C-01 Porta Cabins **retirement and redirect** event for samanportable.com on branch `static-migration`. Work in a **fresh worktree off `origin/static-migration`**, separate from any other running event. The main clone is never a baseline.

You build and validate. **You decide nothing.** Any URL not listed here, any ambiguity, any redirect that cannot be made single-hop → **STOP and report to Fable 5.** Do not add, remove or re-target a redirect on your own judgement.

## 0 · FILE OWNERSHIP — hard boundary with Event B

Event B (the C-01 content build) is running at the same time in its own worktree. **You own:** the redirects and routing configuration, `next-sitemap.config.js`, sitemap files, and the source files of retired pages.
**You must NOT touch:** any page component, copy, specification table, PDF, or schema block on the 9 surviving pages. Those belong to Event B. If a task appears to require one, STOP and report.

The 9 surviving pages — every redirect below lands on one of these, and none of them is edited by you:
`/product/porta-cabins` · `/low-cost-porta-cabin` · `/luxury-porta-cabin` · `/steel-porta-cabin` · `/porta-cabin-with-toilet` · `/porta-cabin-shop` · `/mini-porta-cabin` · `/portacabin-office` · `/ms-porta-cabin`

## 1 · REDIRECTS — 27 URLs, single-hop 301, no chains

### 1.1 The five cluster consolidations (ruled 24 Jul, unchanged)
| From | To |
|---|---|
| `/product/porta-cabins/buy-porta-cabins` | `/product/porta-cabins` |
| `/product/porta-cabins/prefabricated-porta-cabin` | `/product/porta-cabins` |
| `/product/porta-cabins/porta-cabin-office` | `/product/porta-cabins/portacabin-office` |
| `/product/porta-cabins/small-portacabin` | `/product/porta-cabins/mini-porta-cabin` |
| `/product/porta-cabins/toilet-porta-cabins` | `/product/porta-cabins/porta-cabin-with-toilet` |

### 1.2 Stray legacy `/product/<slug>` paths — note the corrected targets
| From | To |
|---|---|
| `/product/luxury-porta-cabin` | `/product/porta-cabins/luxury-porta-cabin` |
| `/product/low-cost-porta-cabin` | `/product/porta-cabins/low-cost-porta-cabin` |
| `/product/steel-porta-cabin` | `/product/porta-cabins/steel-porta-cabin` |
| `/product/porta-cabin-shop` | `/product/porta-cabins/porta-cabin-shop` |
| **`/product/buy-porta-cabins`** | **`/product/porta-cabins`** *(hub — its subpage is also retiring)* |
| **`/product/porta-cabin-office`** | **`/product/porta-cabins/portacabin-office`** |
| **`/product/prefabricated-porta-cabin`** | **`/product/porta-cabins`** *(hub)* |

### 1.3 Singular-path orphan, self-slug, cross-cluster stray, category
| From | To |
|---|---|
| `/product/porta-cabin/ms-porta-cabin` | `/product/porta-cabins/ms-porta-cabin` |
| `/product/porta-cabins/porta-cabins` | `/product/porta-cabins` |
| `/product/porta-cabin-house` | `/product/prefabricated-houses/porta-cabin-house` |
| `/product-category/porta-cabins` | `/product/porta-cabins` |

Also enumerate **every** remaining `/product/porta-cabin/<slug>` singular-path URL and redirect each to its plural canonical. Report the full list.

### 1.4 Price-blog consolidation → `/porta-cabin-cost`
`/porta-cabin-price-a-complete-guide-2025` · `/porta-cabin-price-a-complete-guide-2024` · `/porta-cabin-cost-per-square-foot` · `/porta-cabin-price-in-india` · `/porta-cabin-costs-2024-guide` · `/porta-cabin-office-price` · `/porta-cabins-under-4-lakhs` · `/porta-cabins-under-5-lakhs` · `/porta-cabins-under-6-lakhs`

**KEEP, do not touch:** `/porta-cabin-price-in-delhi` · `/porta-cabins-under-1-lakh` · `/porta-cabins-under-2-lakhs` · `/porta-cabins-under-3-lakhs` · both terrace pages.

### 1.5 Redirect hygiene
Single hop only. Repair any existing redirect that now lands on a retired URL so it points at the final winner. Repair every internal link that resolves to a retired URL. Remove retired URLs from the sitemap. Delete orphaned source files and archive them byte-for-byte in a non-routable location, exactly as in the index-hygiene event.

## 2 · ACCEPTANCE — report every line with its measured value

1. All 27 listed redirects exist and resolve in **exactly one hop** to a live 200 URL. Print a hop-count table.
2. **Zero redirect chains anywhere on the site.** Any pre-existing redirect that now lands on a retired URL is re-pointed at the final winner — list every one you repaired.
3. Zero internal links site-wide resolve through a redirect or an error. Report the count before and after.
4. Every retired source file is deleted from the routable tree and archived byte-for-byte in a non-routable location. Report file count and line count from git, not from an estimate.
5. Sitemap contains only live 200 canonicals. Report URL count before and after, and the per-segment breakdown.
6. The full enumeration of `/product/porta-cabin/<slug>` singular-path URLs found, with each one's redirect target.
7. Live 200 path count before and after, with any change explained URL by URL.
8. **Zero visible-text and zero JSON-LD changes on the 9 surviving pages** — this event must be invisible on every page that stays. Prove it with a content-layer diff.
9. TypeScript clean, production build clean.

Then: preview, full report to Fable 5, **STOP**. Do not merge.

## 3 · MERGE ORDER — do not merge before Event B

Both events preview independently. **Event B (content) merges first, Event A (redirects) second, on the same day.** Reason: `porta-cabin-office` folds into `portacabin-office`, and `small-portacabin` folds into `mini-porta-cabin` — the absorbing pages should already carry their new sections and their corrected size sets when redirected traffic starts arriving. Report ready, then wait for the go-ahead.

After both merge, reset the main clone to `origin/static-migration`.

## 4 · POST-MERGE, SEARCH CONSOLE (report when done)

Submit the single segmented sitemap and remove every previously submitted sitemap. Then open Validate Fix one report at a time, in this order: Not found (404) → Redirect error → Soft 404 → Excluded by noindex. Do not open them simultaneously.
