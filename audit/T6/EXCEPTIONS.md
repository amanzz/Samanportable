# T6 — Exceptions Register

Append-only. Each entry records a deliberate departure from the standing "do not retire a
published, indexable URL" rule, with the evidence that justified it. Never rewrite or
remove a prior entry.

---

## T1.2 — /product-category/* archives retired by 301 (21 URLs)

- **Date:** 12 Jul 2026 · **Amended:** 13 Jul 2026 (14 URLs → 21)
- **Ticket:** SHIKHAR T1.2 — /product-category → /product 301 Consolidation
- **Build packet:** `page-structure/content-drafts/T1.2_ProductCategory_301_Consolidation_Draft_v1_12Jul2026.md`
- **Owner approval:** SAMAN, 12 Jul 2026 ("Approved") — recorded in the build packet.
- **Amendment authority:** Fable 5, 13 Jul 2026 — the 7 panel/roofing archives below.
- **Raised by:** Fable 5 (L3 exception)

### Exception
21 published URLs are being retired by permanent redirect. The first 14 are the set named
in the original build packet; the last 7 were added by the 13 Jul 2026 amendment, after the
build found that the category export carries 21 slugs, not 14. Without explicit rules those
7 would have fallen to the catch-all and landed on the generic `/product` listing rather
than their own canonical hub.

| Retired URL | 301 destination | Source |
| --- | --- | --- |
| /product-category/container-cafe | /product/container-cafe | packet |
| /product-category/container-houses | /product/container-houses | packet |
| /product-category/container-offices | /product/container-offices | packet |
| /product-category/industrial-sheds | /product/industrial-sheds | packet |
| /product-category/labor-colony | /product/labor-colony | packet |
| /product-category/peb-constructions | /product/peb-constructions | packet |
| /product-category/porta-cabins | /product/porta-cabins | packet |
| /product-category/portable-cabin | /product/portable-cabin | packet |
| /product-category/portable-office | /product/portable-office | packet |
| /product-category/portable-toilet | /product/portable-toilet | packet |
| /product-category/pre-engineered-buildings | /product/pre-engineered-buildings | packet |
| /product-category/prefab-buildings | /product/prefab-buildings | packet |
| /product-category/prefabricated-houses | /product/prefabricated-houses | packet |
| /product-category/security-cabins | /product/security-cabins | packet |
| /product-category/eps-panel | /product/eps-panel | amendment |
| /product-category/glass-wool-panel | /product/glass-wool-panel | amendment |
| /product-category/pir-panel | /product/pir-panel | amendment |
| /product-category/puf-panel | /product/puf-panel | amendment |
| /product-category/rockwool-panel | /product/rockwool-panel | amendment |
| /product-category/roofing-sheets | /product/roofing-sheet | amendment |
| /product-category/sandwich-panel | /product/sandwich-panel | amendment |

Note the roofing rule: the category slug is plural (`roofing-sheets`) but the canonical hub
is singular (`/product/roofing-sheet`). `/product/roofing-sheets` is a 404 and must never be
used as a destination.

Every one of the 21 destinations was verified to return HTTP 200 on the branch build before
the rule was written. A catch-all (`/product-category/:slug*` → `/product`) sits below the
21 exact rules so no stray archive URL can 404.

### Evidence
`/audit/T1.1/PRODUCT-CATEGORY-AUDIT.md` — all 14 packet URLs were live, indexable,
self-canonical and present in the sitemap, with roughly 540 internal referrers. They were
textbook cannibalization of the canonical `/product/*` cluster hubs: two indexable pages
competing for one topic. The 7 amendment URLs are the same duplication pattern on the newer
panel and roofing clusters.

### Justification
Consolidates the internal link equity from ~540 referrers, plus any external equity held by
the 21 duplicate archives, into the canonical hubs. Result: one page per cluster, sitemap
noise removed, and breadcrumb schema that now matches the canonical tree.

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

---

## T1.2d — City-page BreadcrumbList item URLs corrected to canonical /product hubs

- **Date:** 14 Jul 2026
- **Ticket:** SHIKHAR T1.2d — Redirect-Straggler Cleanup
- **Build packet:** `content-drafts/T1.2d_Redirect_Straggler_Cleanup_Packet_14Jul2026.md`
- **Authority:** Fable 5 amendment, 14 Jul 2026.

### Exception
T1.2d: city-page BreadcrumbList item URLs corrected from redirecting
`/product-category/*` to canonical `/product/*` (schema-truth / G6; breadcrumb names
unchanged); authorized by Fable 5 as part of the redirect-consolidation arc.

This is a live JSON-LD change on an L3-locked surface, hence this entry. Emitted by
`getCityPageGraph` from `src/pages/[slug].tsx` for every slug in
`CITY_PAGE_SCHEMA_SLUGS`:

| Breadcrumb name | Before | After |
| --- | --- | --- |
| Container Offices | /product-category/container-offices | /product/container-offices |
| Porta Cabins | /product-category/porta-cabins | /product/porta-cabins |

Both slugs are identity-mapped in `src/lib/categoryHubMap.ts`. The breadcrumb `name`
values, the third (page) crumb, and every other schema field are unchanged. No visible
copy, heading or meta changed on any city page — verified by a rendered DOM diff showing
byte-identical visible text.

### Justification
The breadcrumb was naming a URL that 301-redirects, so the schema described a page that
no longer resolves at that address. Google is explicit that structured-data URLs must be
canonical. This makes the city-page breadcrumb trail agree with the canonical /product
tree established by T1.2.
