# T6 — Exceptions Register

Append-only. Each entry records a deliberate departure from the standing "do not retire a
published, indexable URL" rule, with the evidence that justified it. Never rewrite or
remove a prior entry.

---

## T1.2 — /product-category/* archives retired by 301 (14 URLs)

- **Date:** 12 Jul 2026
- **Ticket:** SHIKHAR T1.2 — /product-category → /product 301 Consolidation
- **Build packet:** `page-structure/content-drafts/T1.2_ProductCategory_301_Consolidation_Draft_v1_12Jul2026.md`
- **Owner approval:** SAMAN, 12 Jul 2026 ("Approved") — recorded in the build packet.
- **Raised by:** Fable 5 (L3 exception)

### Exception
14 published URLs are being retired by permanent redirect:

| Retired URL | 301 destination |
| --- | --- |
| /product-category/container-cafe | /product/container-cafe |
| /product-category/container-houses | /product/container-houses |
| /product-category/container-offices | /product/container-offices |
| /product-category/industrial-sheds | /product/industrial-sheds |
| /product-category/labor-colony | /product/labor-colony |
| /product-category/peb-constructions | /product/peb-constructions |
| /product-category/porta-cabins | /product/porta-cabins |
| /product-category/portable-cabin | /product/portable-cabin |
| /product-category/portable-office | /product/portable-office |
| /product-category/portable-toilet | /product/portable-toilet |
| /product-category/pre-engineered-buildings | /product/pre-engineered-buildings |
| /product-category/prefab-buildings | /product/prefab-buildings |
| /product-category/prefabricated-houses | /product/prefabricated-houses |
| /product-category/security-cabins | /product/security-cabins |

A catch-all (`/product-category/:slug*` → `/product`) sits below the 14 exact rules so no
stray archive URL can 404.

### Evidence
`/audit/T1.1/PRODUCT-CATEGORY-AUDIT.md` — all 14 were live, indexable, self-canonical and
present in the sitemap, with roughly 540 internal referrers. They were textbook
cannibalization of the canonical `/product/*` cluster hubs: two indexable pages competing
for one topic.

### Justification
Consolidates the internal link equity from ~540 referrers, plus any external equity held by
the 14 duplicate archives, into the canonical hubs. Result: one page per cluster, sitemap
noise removed, and breadcrumb schema that now matches the canonical tree.
