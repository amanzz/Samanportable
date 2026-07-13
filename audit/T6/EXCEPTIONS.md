# SEO-Lock Exceptions Register

**Branch:** `feat/shikhar-T8-blog` · **Base:** `origin/static-migration` @ `5d52d052`

> Note: this register is created fresh on the T8 branch. The T6/T7 exception entries
> (homepage first-100-words, `/container-office-in-moradabad`, `/product/sandwich-panel`,
> `src/lib/schema.ts` offer price) live on the homepage/header branches and are unaffected
> by T8. Merge order will reconcile the two registers.

---

## T8.1 — `/blog` H1 change
**Ruling:** L3 EXCEPTION — **granted by Fable 5** in the T8 build packet
(`page-structure/content-drafts/T8_Blog_Optimization_Draft_v1_13Jul2026.md`, §B3).

The blog hub's H1 was changed:

- **Before:** `Our Blog`
- **After:** `Prefab & Portable Cabin Insights`

**Rationale (per the packet):** the old H1 `Our Blog` carries **zero keyword signal** on an
indexable hub page. The replacement is keyword-bearing and matches the page's actual subject.
The change was explicitly authorised in the packet, which grants the L3 exception and directs
that it be recorded here.

**What did NOT change (L3 intact):**
- `<title>` and meta description of `/blog` — **unchanged** (`pageSEO.blog` values used as-is).
- All `CATEGORY_SEO` titles/metas and all `CATEGORY_INTRO` paragraphs — **byte-identical**
  to base (verified by string diff against `origin/static-migration:src/pages/blog.tsx`).
- The category self-canonical strategy — unchanged.

**Related T8 SEO change (not an L3 exception, recorded for the audit trail):** in-range
paginated pages (`/blog?page=N`, N ≥ 2) are now **self-canonical and indexable**, with the
title suffixed ` — Page {N}` (meta description unchanged). Out-of-range pages remain
`noindex` + canonical to the hub. This recovers crawl depth to the deep legacy posts while
avoiding duplicate-title flags.
