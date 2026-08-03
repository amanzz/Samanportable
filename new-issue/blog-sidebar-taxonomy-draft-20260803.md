# Blog Sidebar Taxonomy — Implementation Specification

**Date:** 03 August 2026 · **Revision 2 — owner decisions applied**
**Status:** ✅ **IMPLEMENTATION-READY** — pending only Q5 (see §14) and a pre-build count recheck
**Production baseline:** commit `9df1956d4e2e133b2193df458b62198077bf5271`, build `tAowzYr113MhqELgzUyvQ`
**Scope:** `src/pages/blog.tsx` + `src/lib/staticContent.ts` only
**Nothing in this document has been implemented.** No code modified, committed, pushed or deployed.

---

## 1. Executive summary

Three defects are fixed together, because fixing any one alone leaves a broken surface:

1. **Sidebar truth.** Replace six hardcoded categories (five holding *zero* posts, the sixth
   showing a wrong count) with six real, data-derived categories in an approved business order.
2. **Invalid-category honesty.** `/blog?category=case-studies` currently returns **HTTP 200
   showing all 360 articles** under a "Case Studies" heading. Unknown or zero-post categories
   must return a genuine **404**.
3. **Tag removal.** Delete the tag block: 1,106 distinct tags across 360 posts, all five
   displayed counts false, two displayed tags nonexistent, and `?tag=` performs no filtering.

**These three are interlocked.** Introducing the 404 rule while the sidebar still links to five
zero-post categories would create five broken internal links on all 88 listing pages. The
sidebar must become data-derived **in the same change**.

**No new copy is required.** All eleven real categories already have approved `CATEGORY_SEO`
and `CATEGORY_INTRO` entries. The single approved label override (`Labour Colony`) is specified
in §6.

---

## 2. Owner decisions applied (revision 2)

| Decision | Ruling |
| --- | --- |
| Threshold | ≥ 10 published posts, genuine customer meaning, count from the rendered collection |
| Maximum displayed | 8 |
| Order | Controlled business-priority list; new qualifiers append by post-count descending |
| `labor-colony` label | Display **`Labour Colony`**; slug stays `labor-colony` — intentional and approved |
| Counts | Include **all currently rendered published posts**, including those whose destination later redirects |
| Excluded | `uncategorized`, anything < 10 posts, zero-post, invented, or absent from the real dataset |
| 1–9 post categories | Remain directly accessible, filtered, self-canonical — but **not** in the sidebar |
| Invalid category | Genuine **404**. No unfiltered fallback, no canonicalisation to `/blog`, no guessed redirects |
| Tags | **Option B** — remove the visible section entirely |
| Legacy `?tag=` | 200 + normal listing + `noindex,follow` + canonical `/blog`; no `tag=` in pagination; no misleading heading/count; **no** redirect, **no** 404 |
| Predicate alignment | Approved — shared predicate, no hardcoded counts |

---

## 3. Verified data inventory

Source: the **same collection the listing paginates** — `src/data/wp-export/posts/` (282) +
`src/data/wp-export/redirected-posts/` (78) = **360 posts, all `status: "publish"`**.

Counts computed under **both** predicates — `getBlogCategories()`'s terms-only, and the
listing's `postMatchesCategory()` (terms **+** `class_list`) — **agree exactly for all eleven
categories**, confirming the numbers below are safe to display.

| Slug | Display label | Posts | Live / redirected | Pages @10 | Sidebar | Reason |
| --- | --- | ---: | --- | ---: | --- | --- |
| `labor-colony` | **Labour Colony** ⚠️override | **11** | 11 / 0 | 2 | ✅ #1 | Distinct B2B segment; all posts live |
| `porta-cabins` | Porta Cabins | **60** | 57 / 3 | 6 | ✅ #2 | Flagship product topic |
| `container-offices` | Container Offices | **81** | 81 / 0 | 9 | ✅ #3 | Core product line; all posts live |
| `portable-buildings` | Portable Buildings | **134** | 89 / 45 | 14 | ✅ #4 | Largest real collection |
| `prefab-solutions` | Prefab Solutions | **38** | 12 / 26 | 4 | ✅ #5 | Real volume; see §13 R3 |
| `container-cafe` | Container Cafe | **10** | 10 / 0 | 1 | ✅ #6 | Exactly one full page |
| `uncategorized` | — | 15 | 12 / 3 | 2 | ❌ | Clears threshold but carries no customer meaning |
| `design-customization` | — | 2 | 2 / 0 | 1 | ❌ | Below threshold — stays accessible + self-canonical |
| `prefab-buildings` | — | 2 | 1 / 1 | 1 | ❌ | Below threshold — the only real category shown today, count also wrong (shows 1) |
| `industrial-shed` | — | 1 | 1 / 0 | 1 | ❌ | Below threshold |
| `electronic-city` | — | 1 | 1 / 0 | 1 | ❌ | Below threshold |

**Zero-post categories displayed today — all become 404 under §7:**
`portable-construction` (shows 15), `industry-news` (8), `case-studies` (12),
`tips-guides` (20), `company-updates` (6). **Real count for every one: 0.**

*Also:* 6 posts carry no category; 1 post sits in two categories.

> **⚠️ Reconfirm all counts immediately before implementation** — content changes. Run the
> verification script in §11.1 and compare against this table. Any mismatch means this document
> is stale and the numbers must be re-derived, not assumed.

### Redirected-post note

`prefab-solutions` is 68% redirected posts (26 of 38) and `portable-buildings` 34% (45 of 134).
Per the owner ruling, counts include them, because the category page itself renders them — a
live-only count would contradict the listing's own "of N articles" line on the same page.

> **Separate future task — redirected-blog cleanup.** Removing redirected posts from blog
> listings is out of scope here and **must not** be attempted piecemeal. It requires the
> listing collection, the pagination model and the sidebar counts to change **together in one
> commit**, plus a fresh crawl: dropping 78 posts would move `/blog` from 36 pages to ~29 and
> shrink several category paginations, invalidating currently-indexed pagination URLs. Doing it
> in isolation would recreate the exact crawler defect just repaired.

---

## 4. Exact data flow

```
src/data/wp-export/posts/*.json          ─┐
src/data/wp-export/redirected-posts/*.json ┘
                    │
                    ▼
        getPostIndex()  (staticContent.ts)          360 entries, newest first
                    │
        ┌───────────┴────────────────────────────────┐
        ▼                                            ▼
 fetchBlogPosts(page, perPage)              getBlogCategories()
        │                                            │
        │                              ┌──── postMatchesCategory() ────┐
        │                              │   SHARED PREDICATE (§10)      │
        │                              └───────────────┬───────────────┘
        ▼                                              ▼
 blog.tsx getServerSideProps                  [{ slug, name, count }]
        │                                              │
        ├── category active? ──▶ filter by postMatchesCategory()
        │        │
        │        ├── 0 matches ──▶ return { notFound: true }   ◀── §7
        │        └── ≥1 match  ──▶ computeBlogPagination(matching.length, 10, page)
        │
        ├── no category ───────▶ computeBlogPagination(360, 10, page)
        │
        ├── page > totalPages ─▶ return { notFound: true }     (unchanged, verified live)
        │
        ▼
   props: { posts, pagination, sidebarCategories, activeCategory,
            seoCanonical, seoNoindex, seoTitle, seoDescription, seoCategoryIntro }
            ── NOTE: `tags` prop REMOVED entirely
        │
        ▼
   Server-rendered HTML  ──▶  sidebar <a href> links + verified pagination controls
```

**Invariant:** the number beside a sidebar label and the number of results its page renders are
produced by the same predicate over the same collection. They cannot drift.

---

## 5. Sidebar filtering and ordering — pseudocode

```ts
// ── src/lib/blogSidebarCategories.ts  (or inline in blog.tsx — implementer's choice)

const MIN_POSTS_FOR_SIDEBAR = 10;   // one full page at pageSize 10
const MAX_SIDEBAR_CATEGORIES = 8;

// Approved business-priority order. Slugs only — labels come from data (§6).
const CATEGORY_PRIORITY: readonly string[] = [
  'labor-colony',        // displayed as "Labour Colony"
  'porta-cabins',
  'container-offices',
  'portable-buildings',
  'prefab-solutions',
  'container-cafe',
];

// Slugs never shown even when they clear the threshold.
const SIDEBAR_EXCLUDED: ReadonlySet<string> = new Set(['uncategorized']);

function buildSidebarCategories(all: BlogCategory[]): SidebarCategory[] {
  const eligible = all.filter(c =>
    c.count >= MIN_POSTS_FOR_SIDEBAR && !SIDEBAR_EXCLUDED.has(c.slug)
  );

  const ranked = [...eligible].sort((a, b) => {
    const ia = CATEGORY_PRIORITY.indexOf(a.slug);
    const ib = CATEGORY_PRIORITY.indexOf(b.slug);
    if (ia !== -1 && ib !== -1) return ia - ib;        // both listed → approved order
    if (ia !== -1) return -1;                          // listed beats unlisted
    if (ib !== -1) return 1;
    return b.count - a.count || a.slug.localeCompare(b.slug); // unlisted → count desc, stable
  });

  return ranked.slice(0, MAX_SIDEBAR_CATEGORIES).map(c => ({
    slug:  c.slug,
    label: displayLabel(c),                            // §6
    count: c.count,
    href:  `/blog?category=${encodeURIComponent(c.slug)}`,
  }));
}
```

**Expected output today — exactly six entries, in this order:**

| # | Label | Count | href |
| --- | --- | ---: | --- |
| 1 | Labour Colony | 11 | `/blog?category=labor-colony` |
| 2 | Porta Cabins | 60 | `/blog?category=porta-cabins` |
| 3 | Container Offices | 81 | `/blog?category=container-offices` |
| 4 | Portable Buildings | 134 | `/blog?category=portable-buildings` |
| 5 | Prefab Solutions | 38 | `/blog?category=prefab-solutions` |
| 6 | Container Cafe | 10 | `/blog?category=container-cafe` |

**Fallback:** if `buildSidebarCategories()` returns an empty array (data-layer failure), render
**no category block and no heading**. Never fall back to a hardcoded list — that is the present
defect. A zero-post category cannot appear, because the list is derived from posts.

---

## 6. Label handling and the `labor-colony` override

```ts
// Approved visible-label overrides. Slug and URL are NEVER changed by this map.
// `labor-colony` → "Labour Colony" is an intentional, owner-approved divergence:
// the stored WordPress term name uses US spelling, while the already-approved
// CATEGORY_SEO title and CATEGORY_INTRO paragraph for this slug use UK "Labour".
// Displaying "Labour Colony" makes the sidebar consistent with the page it opens.
const CATEGORY_LABEL_OVERRIDES: Readonly<Record<string, string>> = {
  'labor-colony': 'Labour Colony',
};

function displayLabel(category: BlogCategory): string {
  return CATEGORY_LABEL_OVERRIDES[category.slug]
      ?? decodeHtmlEntities(category.name);
}
```

**Rules:**
* The URL stays `/blog?category=labor-colony`. The slug must not change anywhere — not in the
  sidebar href, `CATEGORY_SEO`, `CATEGORY_INTRO`, canonical URLs or pagination hrefs.
* `decodeHtmlEntities()` is **mandatory** for all non-overridden labels — `design-customization`
  is stored as `"Design &amp; Customization"` and would otherwise render the raw entity.
  `/blog/search` already does this at `search.tsx:93`; the hub must match.
* No other label may be hand-written. Any further override requires a Claude Senior draft.

---

## 7. Invalid-category 404 logic

### Current behaviour (verified live, unacceptable)

```
/blog?category=case-studies    → 200, noindex, canonical=/blog, "Showing 10 of 360"
```

The full unfiltered blog served under a heading promising Case Studies.

### Required behaviour

| Case | Result |
| --- | --- |
| Real category, ≥ 1 post | Correctly filtered listing, 200, self-canonical |
| Real category, 1–9 posts | Same — accessible and self-canonical, just absent from the sidebar |
| Unknown category slug | **Genuine 404** |
| Known slug with 0 posts | **Genuine 404** |
| Valid category, page > totalPages | **Genuine 404** (unchanged, already verified live) |

No unfiltered fallback. No canonicalisation of an invalid category to `/blog`. No guessed
redirects to a "similar" category.

### Implementation

```ts
// getServerSideProps — replaces the current silent-fallback block
if (cleanCategory) {
  const allPosts = (await fetchBlogPosts(1, 10000)).posts;
  const matchingPosts = allPosts.filter(p => postMatchesCategory(p, cleanCategory));

  // A category filter that matches nothing is a missing resource, not an empty listing.
  // Never fall through to the unfiltered collection.
  if (matchingPosts.length === 0) {
    return { notFound: true };
  }

  const filtered = paginatePosts(matchingPosts, page, postsPerPage);
  pagePosts  = filtered.posts;
  pagination = filtered.pagination;
}

// Existing out-of-range guard stays exactly as verified in production:
if (page > pagination.totalPages || (page > 1 && pagePosts.length === 0)) {
  return { notFound: true };
}
```

### Consequential simplifications

Once an active category is guaranteed to have posts, `categoryHasMatchingPosts` /
`hasMatchingCategoryPosts` are always `true` when `cleanCategory` is set. Therefore:

* **Delete** the now-unreachable branch
  `else if (cleanCategory) { seoNoindex = true; seoRouteBehavior = 'unknown category filter canonicalized to blog hub'; }`
  — it is precisely the "canonicalise an invalid category to `/blog`" behaviour the owner
  prohibited.
* `activeCategory` becomes `cleanCategory ?? null` (no `hasMatchingCategoryPosts` gate).
* Category canonical logic is otherwise **unchanged**: self-canonical
  `/blog?category={slug}` and `&page=N` for valid pages ≥ 2.

### 🔴 Safety-critical interaction — no broken internal links

With the 404 rule live, **any internal link to a category with zero matching posts becomes a
broken internal link.** Three surfaces link to `/blog?category=`:

| Surface | Source of slugs | Safe? |
| --- | --- | --- |
| `blog.tsx` sidebar | `getBlogCategories()` after this change | ✅ only after the hardcoded list is removed **in the same commit** |
| `blog/search.tsx:92` pills | `getBlogCategories()` already | ✅ — every returned category has ≥ 1 post |
| `[slug].tsx:1002` badges | the post's own embedded terms | ✅ — the post itself guarantees ≥ 1 post |

This is why **§10's predicate alignment is safety-critical, not merely defensive.** If
`getBlogCategories()` were ever to list a category that `postMatchesCategory()` cannot match,
both the sidebar and the search pills would emit links to a 404. Today the two predicates agree
exactly for all eleven categories, so no such link exists — alignment guarantees it stays that
way.

---

## 8. Legacy `?tag=` metadata logic

### Removals from `src/pages/blog.tsx`

* the hardcoded `tags` array in `getServerSideProps` (currently ~lines 255–261);
* `tags` from the `BlogProps` interface, the returned props and the component signature;
* the entire "Popular Tags" sidebar block (currently ~lines 556–569) — its `<h3>`, wrapper
  `<div>`, the tag `<Link>` list and the `border-t` divider above it;
* the now-unused `Tag` icon import, if nothing else in the file uses it.

### Retained behaviour for legacy URLs

```ts
// `tag` is still parsed so its presence can be detected, but it NEVER filters the
// collection and NEVER reaches a URL. Tag pages render the normal blog listing.
if (cleanTag) {
  seoNoindex       = true;                    // → <meta name="robots" content="noindex, follow">
  seoCanonical     = blogCanonicalBase;       // → https://www.samanportable.com/blog
  hreflangSelf     = blogCanonicalBase;
  seoRouteBehavior = 'legacy tag parameter — normal listing, noindex,follow, canonical to blog hub';
  // Titles/descriptions stay the default blog-hub values.
  // No tag name, tag heading or tag count is rendered anywhere.
}
```

**Verified:** `UnifiedSEO` with `noindex = true` and `nofollow` unset emits exactly
`<meta name="robots" content="noindex, follow">` (`UnifiedSEO.tsx:84–85`, confirmed live on
existing noindex pages). **No component change is needed.**

| Requirement | How it is met |
| --- | --- |
| HTTP 200 | No `notFound` branch for tags |
| Normal blog listing | `cleanTag` never filters the collection |
| `noindex,follow` | `seoNoindex = true` → verified robots output |
| Canonical `/blog` | `seoCanonical = blogCanonicalBase` |
| No `tag=` in pagination | `buildBlogPageHref` already omits it — **do not** uncomment the enabling line |
| No misleading heading/count | Tag block deleted; hub title/description unchanged |
| No redirect, no 404 | No redirect or `notFound` path added |
| Not in sitemap | No sitemap change; verified 0 `?tag=` URLs in `public/` and live `sitemap-editorial.xml` |

**Change of record:** `?tag=` pages currently emit `index, follow` (verified live). This
proposal makes them `noindex, follow` — the only deliberate indexing change in this task.

**Do not implement real tag filtering in this task.** Evidence: 1,106 distinct tags across 360
posts; only 224 posts carry any tag; the most-used tag appears on 13 posts; `bangalore` and
`construction` do not exist at all; displayed counts 25/18/22/30/35 versus real 10/7/1/0/0.
Genuine tag indexes would manufacture ~1,100 thin, near-duplicate listing surfaces.

---

## 9. Expected desktop and mobile behaviour

The sidebar sits in `grid grid-cols-1 lg:grid-cols-4 gap-8`, inside `<div className="lg:col-span-1">`
with an inner `sticky top-4` card.

| Viewport | Behaviour |
| --- | --- |
| **Desktop (lg ≥ 1024px)** | Sidebar is the left column (1 of 4), sticky at `top-4`; articles occupy the right 3 columns. Category list renders 6 rows: label left, count pill right |
| **Mobile / tablet (< 1024px)** | Single column — the sidebar card stacks **above** the article grid. This is existing behaviour and is unchanged; only the block's contents change |

**Expected visual delta:** the "Popular Tags" heading, its 5 pills and the `border-t` divider
disappear. On mobile this **shortens the scroll distance to the first article card** by roughly
one block — a small improvement, since the sidebar already precedes the articles.

**Requirements:**
* Every category entry is a real server-rendered `<a href>` — no `onClick`-only navigation.
* Counts render inside the existing pill markup; no new component or style is introduced.
* The `Categories` heading renders only when ≥ 1 category qualifies.
* No layout-shift regression: the card keeps its existing padding, radius and shadow classes.
* Pagination controls are **untouched** — the verified disabled-button markup must be
  byte-identical.

---

## 10. Data-source alignment (`staticContent.ts`)

**Approved.** `getBlogCategories()` currently counts only `_embedded['wp:term'][0]` entries,
while the listing's `postMatchesCategory()` also matches `class_list` `category-{slug}`.

Today both yield identical counts for all eleven categories, so this fixes no live number — but
under §7's 404 rule, any future divergence becomes a **broken internal link**, not a cosmetic
mismatch.

```ts
// staticContent.ts — export the single predicate used by BOTH the counter and the listing.
export function postMatchesCategory(post: any, categorySlug: string): boolean {
  const terms = post?._embedded?.['wp:term']?.[0] || [];
  return (
    terms.some((t: any) => t?.taxonomy === 'category' && t?.slug === categorySlug) ||
    Boolean(post?.class_list?.includes(`category-${categorySlug}`))
  );
}

// getBlogCategories() must count with the SAME predicate over the SAME collection
// (posts/ + redirected-posts/), so sidebar counts and rendered results cannot drift.
```

**Rules:**
* `blog.tsx` imports the shared predicate instead of defining its own copy.
* No count is hardcoded anywhere.
* Category discovery still needs the term list (for `slug` → `name`); the **count** must use
  the shared predicate.
* Behaviour-preserving: expected output is identical to today's counts.

---

## 11. Local verification

### 11.1 Pre-build count recheck (mandatory)

Re-derive counts from the export directories and diff against §3. Any mismatch → stop and
re-derive; do not implement against stale numbers.

```
node -e "<count script over posts/ + redirected-posts/ using the shared predicate>"
Expect: portable-buildings 134 · container-offices 81 · porta-cabins 60
        prefab-solutions 38 · uncategorized 15 · labor-colony 11 · container-cafe 10
        design-customization 2 · prefab-buildings 2 · industrial-shed 1 · electronic-city 1
```

### 11.2 Build gates

`npm ci` · `npm run lint` · `npm run type-check` · production build · `git diff --check` — all clean.

### 11.3 Local crawl tests

| # | Test | Expected |
| --- | --- | --- |
| C1 | Crawl from `/blog`, follow every server-rendered anchor | **0 broken links**; no 404 reachable from any internal link |
| C2 | Every sidebar href | 200, filtered listing, "of N" matches the sidebar count exactly |
| C3 | Sidebar entries | Exactly 6, in the §5 order, first label `Labour Colony` |
| C4 | `?tag=` anywhere in HTML across all listing pages | **0 occurrences** |
| C5 | Five zero-post categories (`case-studies`, `tips-guides`, `industry-news`, `company-updates`, `portable-construction`) | **404** each |
| C6 | Unknown slug `/blog?category=does-not-exist` | **404** |
| C7 | Thin categories (`design-customization`, `prefab-buildings`, `industrial-shed`, `electronic-city`) | **200**, filtered, self-canonical, **absent from sidebar** |
| C8 | `/blog?category=uncategorized` | **200**, filtered, self-canonical, **absent from sidebar** |
| C9 | `/blog?tag=porta-cabins` | 200, `noindex, follow`, canonical `/blog`, no tag heading/count |
| C10 | Seven valid final pages | 200, no anchor to their invalid target |
| C11 | Seven invalid targets | genuine **404** |
| C12 | Full pagination crawl | **0 problems**; 0 pagination URLs contain `tag=`; 0 non-positive "Next N articles" |
| C13 | Final pages | Previous/Next disabled as **anchor-free** buttons |
| C14 | `/blog?category=labor-colony` | 200; page uses UK "Labour" copy; **URL slug still `labor-colony`** |

**Crawl-count note:** the current baseline is 88 pages / 657 pagination links. After this change
the five zero-post category pages leave the crawl (they 404) and six real category collections
gain sidebar links from every listing page. **The binding acceptance condition is `problems: 0`,
not a fixed page count.** Record the new totals as the fresh baseline.

### 11.4 Structured-data regression tests

| # | Test | Expected |
| --- | --- | --- |
| S1 | `/product/porta-cabins/luxury-porta-cabin` (rating_count 1) | `Product` ×1, `aggregateRating` **absent** — C04 gate intact |
| S2 | `/product/porta-cabins/ms-porta-cabin` (rating_count 3) | `Product` ×1, `aggregateRating` **present** |
| S3 | `/product/puf-panel`, `/product/pir-panel` | `Product` ×1, unchanged |
| S4 | `/blog` `CollectionPage` + `ItemList` | Present; `numberOfItems` = rendered post count |
| S5 | Category page `ItemList` | Present with ≥ 1 `itemListElement`; never an empty `ItemList` |
| S6 | 404 category pages | No `CollectionPage`/`ItemList` emitted |
| S7 | `BreadcrumbList` on `/blog` | Unchanged |
| S8 | Any `aggregateRating`/`review` added to blog pages | **None** — must remain absent |

### 11.5 Text-to-HTML before/after measurement

**Measured live baseline (03 Aug 2026, build `tAowzYr113MhqELgzUyvQ`):**

| URL | HTML bytes | Text bytes | Ratio |
| --- | ---: | ---: | ---: |
| `/blog` | 145,352 | 6,179 | **4.25%** |
| `/blog?page=18` | 134,952 | 6,474 | **4.80%** |
| `/blog?page=36` | 133,455 | 6,538 | **4.90%** |
| `/blog?category=labor-colony` | 136,778 | 6,639 | **4.85%** |
| `/blog?category=portable-buildings&page=14` | 100,780 | 5,181 | **5.14%** |

Re-measure the **same five URLs** on the local production build with an identical method:
strip `<script>`/`<style>`/`<noscript>`, strip tags, collapse whitespace, compare UTF-8 byte
counts.

**Expected direction:** marginally **positive**. The page loses 5 tag links plus a heading,
wrapper and divider (~700–900 bytes of markup carrying ~40 characters of text) and swaps 6
category links for 6. Text content is roughly flat; markup shrinks slightly.

**Acceptance:** no measured page may *decrease* by more than **0.15 percentage points**. A
larger drop indicates markup was added unintentionally and must be investigated before deploy.

---

## 12. Deployment and rollback acceptance criteria

### Pre-deploy (all must hold)

1. `git diff --stat` shows **only** `src/pages/blog.tsx` and `src/lib/staticContent.ts`.
2. Zero hardcoded category or tag literals remain in `blog.tsx`.
3. Every displayed count equals the count computed by the shared predicate.
4. Sidebar renders exactly 6 entries in the §5 order; first label is `Labour Colony`.
5. No sidebar link resolves to a listing whose total is 360 (the unfiltered-fallback signature).
6. All crawl tests C1–C14 pass.
7. All structured-data tests S1–S8 pass.
8. Text-to-HTML within the §11.5 tolerance.
9. Lint, type-check, production build, `git diff --check` all clean.
10. `blogPagination.ts` **unmodified** — confirm with `git diff --name-only`.

### Post-deploy live verification

11. Seven valid final pages → 200, no anchor to invalid targets.
12. Seven invalid targets → genuine 404.
13. Five zero-post categories → genuine 404.
14. Six sidebar links → 200 with matching counts.
15. `?tag=` → 200, `noindex, follow`, canonical `/blog`.
16. **0** `?tag=` links in live HTML; **0** `tag=` in pagination URLs.
17. Full live crawl → **0 problems**.
18. Product schema, `mailto:sales@`/`mailto:ncr@`, **0** Cloudflare obfuscation markers.
19. Banned number `+91 62009 09435` → **0** occurrences.
20. GTM, GA4, Zoho forms, sitemap, `robots.txt` byte-identical.

### Rollback

* **Trigger:** any of 11–20 failing.
* **Method:** `git revert <sha>` on `static-migration`; DigitalOcean auto-deploys on push — the
  same path used for the pagination fix.
* **Blast radius:** blog sidebar + category-404 behaviour only. No product, schema, feed,
  analytics, form, sitemap or robots surface is touched.
* **Pagination safety:** `blogPagination.ts` is not modified, so a rollback cannot reintroduce
  the crawler defect.
* ⚠️ **Rollback restores the five zero-post sidebar links and the unfiltered-fallback
  behaviour.** It is a return to a known-imperfect state, not to a clean one. If only the 404
  rule misbehaves, prefer a forward fix over reverting the whole change.

---

## 13. Risks

| # | Risk | Likelihood | Mitigation |
| --- | --- | --- | --- |
| R1 | Sidebar still links to a zero-post category when the 404 rule lands → 5 broken links × 88 pages | **High if split across commits** | **Ship both changes in one commit.** C1 + C5 catch it |
| R2 | Predicate divergence makes `getBlogCategories()` list an unmatchable category → sidebar/search links 404 | Low | §10 shared predicate; C2 asserts every sidebar href returns 200 |
| R3 | `prefab-solutions` 68% redirected, `portable-buildings` 34% | Medium | Counts truthful for the rendered listing per owner ruling; redirected-blog cleanup is a separate task (§3) |
| R4 | Five zero-post category URLs move 200 → 404; any external inbound link now errors | Low | Intended. They held no content; all five were `noindex` already |
| R5 | `?tag=` de-indexing removes a URL holding traffic | Low | Approved. Pages showed unfiltered content and already canonicalised to `/blog` |
| R6 | Sidebar edit disturbs the verified pagination block | Low | C10–C13 re-run the full production verification; criterion 10 asserts `blogPagination.ts` untouched |
| R7 | Counts shift between drafting and build | Medium | §11.1 mandatory pre-build recheck |
| R8 | "Labour Colony" label vs `labor-colony` slug confuses future maintainers | Low | Documented in code comment (§6) and here |

---

## 14. Status of the seven original questions

| # | Question | Status |
| --- | --- | --- |
| Q1 | Should counts include redirected posts? | ✅ **Answered** — include all currently rendered published posts. Redirected-blog cleanup is a separate future task |
| Q2 | Add `noindex` to `?tag=` pages? | ✅ **Answered** — yes, `noindex,follow`, canonical `/blog`, no redirect, no 404 |
| Q3 | `Labor Colony` vs `Labour Colony` | ✅ **Answered** — display `Labour Colony`, keep slug `labor-colony` |
| Q4 | What happens to the four thin categories (1–9 posts)? | ✅ **Answered** — accessible, filtered, self-canonical; excluded from the sidebar |
| Q5 | Delete the five dead `CATEGORY_SEO`/`CATEGORY_INTRO` entries? | ❌ **UNRESOLVED** — see below |
| Q6 | Confirm the threshold and priority order | ✅ **Answered** — ≥ 10 posts, max 8, controlled order supplied |
| Q7 | Should `uncategorized` stay out of the sidebar? | ✅ **Answered** — excluded from display; URL stays live and indexable |

### Q5 — still open

> **Original question, quoted exactly:**
> "**Q5 — Delete the five dead `CATEGORY_SEO` / `CATEGORY_INTRO` entries?** Once unlinked they
> are unreachable but harmless, and they would become useful if those categories are ever
> populated. **Recommend keeping them** (deletion is destruction of approved copy). Owner's
> call."

**Why it remains unresolved:** the owner's revision-2 decisions cover *display* rules
(exclusion, ordering, labels) and instruct "Do not create new SEO descriptions. Reuse existing
approved `CATEGORY_SEO` and `CATEGORY_INTRO` content" — but say nothing about **deleting**
existing entries for `case-studies`, `tips-guides`, `industry-news`, `company-updates` and
`portable-construction`.

**The 404 rule sharpens this.** Those five slugs now return 404, so their `CATEGORY_SEO` and
`CATEGORY_INTRO` entries become permanently unreachable dead code — not merely unlinked.

**Recommendation: keep them.** They are approved copy, cost nothing at runtime (they are plain
object literals, never serialised into `__NEXT_DATA__` unless their key is active), and would
be immediately reusable if those categories are ever populated. Deleting approved copy is
destructive and reversible only via git history.

**Impact if unanswered:** none blocking. The default (keep) is safe and requires no code beyond
what is already specified. The implementer should simply **not touch** those entries.

---

## 15. Pipeline position

Per `CLAUDE.md`:

```
Owner Prompt 0 → Codex PIB → Claude Senior draft → owner approves draft →
Claude Code builds from draft verbatim → owner preview → typed authorization to Codex → deploy
```

| Step | Status |
| --- | --- |
| Owner Prompt 0 | ✅ Present |
| Codex PIB | ⚠️ Not present |
| Claude Senior draft | ✅ **Not required** — no new copy is authored. All labels come from stored term data; the single override `Labour Colony` is owner-approved in writing and reuses the wording already in the approved `CATEGORY_SEO`/`CATEGORY_INTRO` for that slug |
| Owner approval of decisions | ✅ Received (revision 2); Q5 outstanding but non-blocking |
| Claude Code build | ⏸️ Not started — awaiting owner go-ahead |
| Deploy | ⏸️ Codex only, on owner's typed authorization |

---

**Nothing was implemented, modified, committed, pushed, PR'd or deployed. No Cloudflare or
Merchant Center action occurred. All production interaction in this audit was read-only HTTP GET.**
