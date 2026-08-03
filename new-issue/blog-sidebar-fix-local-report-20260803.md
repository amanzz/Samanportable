# Blog Sidebar Real Taxonomy — Local Build & Verification Report

**Date:** 03 August 2026
**Status:** ✅ **ALL VERIFICATION PASSED — local commit created, not pushed**
**Branch:** `fix/blog-sidebar-real-taxonomy`
**Worktree:** `C:\Users\Saman Pos\Desktop\Website Code\Samanportable-main\saman-sidebar-build`
**Base commit:** `9df1956d4e2e133b2193df458b62198077bf5271` (= `origin/static-migration`, = verified production)

Nothing pushed, no PR, no merge, no deploy. No Cloudflare or Merchant Center action.

---

## 1. Base commit

`origin/static-migration` was fetched immediately before the worktree was created:

```
origin/static-migration = 9df1956d4e2e133b2193df458b62198077bf5271
```

**Identical to the verified production commit** — it had not moved beyond `9df1956d`, so no
new commits needed conflict assessment.

---

## 2. Root causes fixed

| # | Root cause | Fix |
| --- | --- | --- |
| 1 | Sidebar categories were a **hardcoded literal array** with invented counts. Five of six slugs had **zero** posts; the sixth (`prefab-buildings`) showed count 1 against a real 2 | Derived from `getBlogCategories()` with a ≥10 threshold, approved priority order and a max of 8 |
| 2 | Sidebar tags were a **hardcoded literal array**. All five counts false; `bangalore` and `construction` **do not exist** in the dataset; `?tag=` performs no filtering | Popular Tags block, `tags` prop and all `?tag=` internal links removed |
| 3 | A category matching **no post silently fell through to the unfiltered collection** — `/blog?category=case-studies` returned 200 rendering all 360 articles under a "Case Studies" heading | Zero-match category now returns a genuine `notFound: true` |
| 4 | Category counting used **two different predicates** — `getBlogCategories()` read only `wp:term`, the listing also read `class_list`. Under the new 404 rule any divergence would emit internal links to a 404 | Single exported `postMatchesCategory()` used by both |

**These four shipped as one atomic commit.** Introducing #3 without #1 would have created five
broken internal links on every listing page.

---

## 3. Files changed

```
 src/lib/staticContent.ts |  48 ++++++++++---
 src/pages/blog.tsx       | 174 ++++++++++++++++++++++++++++-------------------
 2 files changed, 142 insertions(+), 80 deletions(-)
```

**Exactly the two expected production source files.** No other file was required.

### Protected files — verified unchanged (0 diff lines each)

`src/lib/blogPagination.ts` · `src/components/UnifiedSEO.tsx` ·
`src/components/ProductStructuredData.tsx` · `public/robots.txt` · `next.config.js` ·
`src/pages/blog/search.tsx` · `src/pages/[slug].tsx` · all of `public/` (sitemaps)

### Q5 honoured — approved copy preserved

The five now-unreachable `CATEGORY_SEO` / `CATEGORY_INTRO` entries (`case-studies`,
`company-updates`, `industry-news`, `portable-construction`, `tips-guides`) were **not edited,
removed or rewritten**. Diff lines touching those keys: **0**. Diff lines touching any
`title:`/`meta:` copy: **0**.

### Note on a fourth consumer discovered during implementation

`src/lib/blogHubLink.ts` also calls `getBlogCategories()`. It was inspected and **not
modified**: it produces `/product/{hub}` links, not `/blog?category=` links, so it is not a
category-link surface and is unaffected by the 404 rule. It does, however, document a
dependency on `getBlogCategories()` being ordered *count desc, then name asc* to select a
post's primary owning hub — **that ordering was deliberately left untouched.** Sidebar ordering
is applied separately in `blog.tsx`.

---

## 4. Re-derived category inventory (pre-build recheck)

Recomputed from the current dataset with the shared predicate immediately before implementation.
Collection: `posts/` + `redirected-posts/` = **360 posts**.

| Slug | Count | Expected | Match |
| --- | ---: | ---: | --- |
| `portable-buildings` | 134 | 134 | ✅ |
| `container-offices` | 81 | 81 | ✅ |
| `porta-cabins` | 60 | 60 | ✅ |
| `prefab-solutions` | 38 | 38 | ✅ |
| `uncategorized` | 15 | — | excluded by rule |
| `labor-colony` | 11 | 11 | ✅ |
| `container-cafe` | 10 | 10 | ✅ |
| `design-customization` | 2 | — | below threshold |
| `prefab-buildings` | 2 | — | below threshold |
| `electronic-city` | 1 | — | below threshold |
| `industrial-shed` | 1 | — | below threshold |

**PRE-BUILD RECHECK: ALL EXPECTED COUNTS MATCH.** No count is hardcoded anywhere in the
shipped code — every number is computed at request time.

---

## 5. Sidebar order and counts — as rendered

| # | Label | Count | href |
| --- | --- | ---: | --- |
| 1 | **Labour Colony** | 11 | `/blog?category=labor-colony` |
| 2 | Porta Cabins | 60 | `/blog?category=porta-cabins` |
| 3 | Container Offices | 81 | `/blog?category=container-offices` |
| 4 | Portable Buildings | 134 | `/blog?category=portable-buildings` |
| 5 | Prefab Solutions | 38 | `/blog?category=prefab-solutions` |
| 6 | Container Cafe | 10 | `/blog?category=container-cafe` |

* Total entries: **6** — matches the approved controlled order exactly.
* `Labour Colony` label with slug `labor-colony` preserved, as approved.
* Popular Tags block present: **False**. Any `?tag=` link: **False**.
* All 6 rows are real crawlable `<a href>` elements; no `onclick`-only navigation.

---

## 6. Category 200 / 404 results

`totalArticles` is the figure the page itself renders — it matches the sidebar count exactly for
every displayed category, and **no category returns 360** (the old unfiltered-fallback signature).

| URL | HTTP | Articles | Sidebar | Expected |
| --- | --- | ---: | --- | --- |
| `/blog?category=labor-colony` | **200** | 11 | shown | 200 ✅ |
| `/blog?category=porta-cabins` | **200** | 60 | shown | 200 ✅ |
| `/blog?category=container-offices` | **200** | 81 | shown | 200 ✅ |
| `/blog?category=portable-buildings` | **200** | 134 | shown | 200 ✅ |
| `/blog?category=prefab-solutions` | **200** | 38 | shown | 200 ✅ |
| `/blog?category=container-cafe` | **200** | 10 | shown | 200 ✅ |
| `/blog?category=uncategorized` | **200** | 15 | **not shown** | 200 ✅ |
| `/blog?category=prefab-buildings` | **200** | 2 | **not shown** | 200 ✅ |
| `/blog?category=design-customization` | **200** | 2 | **not shown** | 200 ✅ |
| `/blog?category=industrial-shed` | **200** | 1 | **not shown** | 200 ✅ |
| `/blog?category=electronic-city` | **200** | 1 | **not shown** | 200 ✅ |
| `/blog?category=case-studies` | **404** | — | removed | 404 ✅ |
| `/blog?category=industry-news` | **404** | — | removed | 404 ✅ |
| `/blog?category=company-updates` | **404** | — | removed | 404 ✅ |
| `/blog?category=tips-guides` | **404** | — | removed | 404 ✅ |
| `/blog?category=portable-construction` | **404** | — | removed | 404 ✅ |
| `/blog?category=does-not-exist` | **404** | — | unknown | 404 ✅ |

Category canonicals remain self-referencing:
`/blog?category=labor-colony` → `https://www.samanportable.com/blog?category=labor-colony`
`/blog?category=portable-buildings` → `https://www.samanportable.com/blog?category=portable-buildings`

---

## 7. Legacy `?tag=` metadata results

| URL | HTTP | robots | canonical | Articles | `?tag=` links |
| --- | --- | --- | --- | ---: | ---: |
| `/blog?tag=bangalore` | **200** | `noindex, follow` | `…/blog` | 360 | 0 |
| `/blog?tag=construction` | **200** | `noindex, follow` | `…/blog` | 360 | 0 |
| `/blog?tag=porta-cabins` | **200** | `noindex, follow` | `…/blog` | 360 | 0 |
| `/blog?tag=prefab-solutions` | **200** | `noindex, follow` | `…/blog` | 360 | 0 |

Every requirement met: 200, normal unfiltered listing, `noindex,follow`, canonical `/blog`, no
redirect, no 404, no `tag=` in any pagination href.

### No tag heading or count is rendered — proven with a unique probe

`/blog?tag=zzz-unique-probe-9x` (a value appearing nowhere in site content):

* `Popular Tags` heading: **0** · `tagged` text: **0**
* Title: `Portable Office Industry Insights & News` — the standard hub title, no tag name
* **Visible-text occurrences of the tag value: 0** (after stripping script/style and tags)

The value appears exactly once in raw HTML, inside `<script id="__NEXT_DATA__">` as
`"query":{"tag":"zzz-unique-probe-9x"}`. That is Next.js's standard serialisation of the request
query, present on every SSR page regardless of this change — **not** a rendered heading or count.
The same blob shows `"listingQuery":{"category":null,"tag":null}`, confirming tag is not carried
into pagination.

*Method note:* an earlier check that grepped case-insensitively for `Bangalore` returned 2 hits.
That was a false positive from the test itself — plain `/blog` returns the same 2 hits from post
titles and the footer address. The unique-probe test above isolates the tag value properly.

---

## 8. Full crawl results

```
crawledPages: 78 | statuses: {"200": 78} | pagination links: 577 | problems: 0
pagination hrefs containing tag=: 0
non-positive "Next N articles":   0
```

**Zero broken links. Zero category links returning 404. Zero internal `?tag=` links.**
Every valid pagination link returns 200.

### Crawl-surface change fully accounted for (88 → 78)

Exactly **10** URLs left the crawl, **0** were newly added, and **no real category lost any
coverage**:

| Removed URL | Reason |
| --- | --- |
| `/blog?category=portable-construction` | zero posts → now 404 |
| `/blog?category=industry-news` | zero posts → now 404 |
| `/blog?category=case-studies` | zero posts → now 404 |
| `/blog?category=tips-guides` | zero posts → now 404 |
| `/blog?category=company-updates` | zero posts → now 404 |
| `/blog?tag=porta-cabins` | tag link removed |
| `/blog?tag=container-offices` | tag link removed |
| `/blog?tag=prefab-solutions` | tag link removed |
| `/blog?tag=bangalore` | tag link removed (tag never existed) |
| `/blog?tag=construction` | tag link removed (tag never existed) |

Per-category page coverage, live vs. now — **identical for every real category**:

| Category | Live (88) | Now (78) | Δ |
| --- | ---: | ---: | --- |
| (no category — `/blog` pagination) | 41 | 36 | −5 (the five tag URLs) |
| `portable-buildings` | 14 | 14 | same |
| `container-offices` | 9 | 9 | same |
| `porta-cabins` | 6 | 6 | same |
| `prefab-solutions` | 4 | 4 | same |
| `labor-colony` | 2 | 2 | same |
| `uncategorized` | 2 | 2 | same |
| `container-cafe` | 1 | 1 | same |
| `design-customization` / `prefab-buildings` / `industrial-shed` / `electronic-city` | 1 each | 1 each | same |
| five zero-post categories | 1 each | **0** | −5 |

---

## 9. Pagination regression — PR #113 model intact

| Source page | HTTP | Links to invalid target? | Target HTTP | Disabled Next | Load More |
| --- | --- | --- | --- | --- | --- |
| `/blog?page=36` | 200 | **No** | 404 | 1 | 0 |
| `/blog?category=container-offices&page=9` | 200 | **No** | 404 | 1 | 0 |
| `/blog?category=labor-colony&page=2` | 200 | **No** | 404 | 1 | 0 |
| `/blog?category=porta-cabins&page=6` | 200 | **No** | 404 | 1 | 0 |
| `/blog?category=portable-buildings&page=14` | 200 | **No** | 404 | 1 | 0 |
| `/blog?category=prefab-solutions&page=4` | 200 | **No** | 404 | 1 | 0 |
| `/blog?category=uncategorized&page=2` | 200 | **No** | 404 | 1 | 0 |

Structural control markup:

```
/blog                              PLAIN  <- Previous  (NO ANCHOR)
                                   LINK   1 2 3 4 5 … 36 | Next -> /blog?page=2
/blog?page=18                      LINK   <- Previous /blog?page=17 … Next -> /blog?page=19
/blog?page=36                      LINK   <- Previous /blog?page=35 … 36
                                   PLAIN  Next ->      (NO ANCHOR)
/blog?category=labor-colony&page=2 LINK   <- Previous /blog?category=labor-colony
                                   LINK   2           /blog?category=labor-colony&amp;page=2
                                   PLAIN  Next ->      (NO ANCHOR)
```

* No final page contains a crawlable Next anchor ✅
* Disabled Previous/Next are non-link buttons ✅
* Numbered pagination clamped to `totalPages` ✅
* Load More absent on final pages ✅
* No "Next −2 articles" — 0 non-positive values ✅
* No pagination URL contains `tag=` ✅
* Out-of-range pages remain 404 ✅
* Category filter preserved across pagination URLs ✅

---

## 10. Structured-data & regression results

| Test | Result |
| --- | --- |
| `/product/porta-cabins/luxury-porta-cabin` (rating_count 1) | `Product` ×1, `aggregateRating` **0** — C04 gate intact ✅ |
| `/product/porta-cabins/ms-porta-cabin` (rating_count 3) | `Product` ×1, `aggregateRating` **1** ✅ |
| `/product/puf-panel` | `Product` ×1 ✅ |
| `/product/pir-panel` | `Product` ×1 ✅ |
| Category page `ItemList` | Present, non-empty ✅ |
| Email links | `mailto:sales@samanportable.com`, `mailto:ncr@samanportable.com` ✅ |
| Cloudflare obfuscation markers | **0** ✅ |
| Banned number `+91 62009 09435` | **0** ✅ |
| Sitemap / `robots.txt` / `next.config.js` | Unchanged ✅ |

---

## 11. Text-to-HTML comparison

Identical method both sides: strip `<script>`/`<style>`/`<noscript>`, strip tags, collapse
whitespace, compare UTF-8 bytes. **Before** = live production build `tAowzYr113MhqELgzUyvQ`.

| URL | Before | After | Δ (pp) | Within ±0.15pp |
| --- | ---: | ---: | ---: | --- |
| `/blog` | 4.25% | **4.22%** | −0.03 | ✅ |
| `/blog?page=18` | 4.80% | **4.77%** | −0.03 | ✅ |
| `/blog?page=36` | 4.90% | **4.88%** | −0.02 | ✅ |
| `/blog?category=labor-colony` | 4.85% | **4.83%** | −0.02 | ✅ |
| `/blog?category=portable-buildings&page=14` | 5.14% | **5.11%** | −0.03 | ✅ |

Maximum drop **0.03pp**, well inside the 0.15pp tolerance. HTML shrank ~1,000 bytes per page
(tag block removed); text shrank slightly too (tag labels), leaving the ratio essentially flat.

---

## 12. Build gates

| Gate | Result |
| --- | --- |
| `npm ci` | ✅ clean (948 packages, exit 0) |
| `npm run lint` | ✅ `✔ No ESLint warnings or errors` |
| `npm run type-check` (`tsc --noEmit`) | ✅ zero errors |
| Production build | ✅ `✓ Compiled successfully` → `✓ Generating static pages (40/40)`; `/blog` 5.54 kB / 157 kB (was 5.65 kB) |
| `git diff --check` | ✅ clean |

---

## 13. Desktop / mobile QA

Responsive classes verified **unchanged** in rendered HTML:
`grid grid-cols-1 lg:grid-cols-4 gap-8` · `lg:col-span-1` ·
`bg-card rounded-lg p-6 shadow-card sticky top-4` · `lg:col-span-3` ·
`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`

| Viewport | Behaviour |
| --- | --- |
| **Desktop (lg ≥ 1024px)** | Sidebar is the left column (1 of 4), sticky at `top-4`; articles fill the right 3 columns. Six rows: label left, count pill right |
| **Mobile / tablet (< 1024px)** | Single column; sidebar card stacks above the article grid — DOM order confirmed (Categories heading at offset 41,419; article grid at 43,771) |

* Sticky card retained ✅
* All 6 sidebar rows are `<a href>` ✅ · no `onclick`-only navigation ✅
* Popular Tags block and its `border-t` divider removed → **shorter scroll to the first article
  card on mobile**
* Empty-state: if no category qualifies, the whole card (including the heading) is omitted.
  There is deliberately **no hardcoded fallback list**.

---

## 14. Compliance confirmations

* ✅ **No Cloudflare action.** No setting read, changed or purged; obfuscation confirmed disabled by observation only.
* ✅ **No Merchant Center fetch or synchronization.** No feed requested, validated or modified.
* ✅ No Product schema, GTM, GA4, Zoho, sitemap or `robots.txt` modified.
* ✅ `CATEGORY_SEO` / `CATEGORY_INTRO` untouched (Q5).
* ✅ `blogPagination.ts` and `UnifiedSEO.tsx` untouched.
* ✅ Main working directory untouched — all work in an isolated worktree.
* ✅ Nothing pushed, no PR, no merge, no deploy.

---

## 15. `git diff --stat`

```
 src/lib/staticContent.ts |  48 ++++++++++---
 src/pages/blog.tsx       | 174 ++++++++++++++++++++++++++++-------------------
 2 files changed, 142 insertions(+), 80 deletions(-)
```

---

## 16. Outcome

All acceptance criteria pass. The sidebar now advertises only real collections with real
counts, invalid categories return genuine 404s instead of impersonating the full blog, the
invented tag block is gone, and the PR #113 pagination model is provably intact.

**Safe to prepare a PR.**
