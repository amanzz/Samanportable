# T1.1 Part B — /product-category/* Duplicate / Cannibalization Audit (READ-ONLY)

**Ticket:** SHIKHAR T1.1 · **Branch:** `feat/shikhar-T1-header-redesign` · **Date:** 2026-07-12
**Method:** local production build (`npm run start`) of the branch head; HTTP/`<title>`/canonical/robots
read from the served HTML; sitemap presence from `public/sitemap.xml`; internal-referrer counts from
`grep -rn "/product-category/{slug}" src/` (source-level, includes in-content links in wp-export
JSON + schema/config). **No site file was modified by this audit.**

## Headline finding
All 14 `/product-category/{slug}` routes are **live (200), `index, follow`, self-canonical, and in the
sitemap** — i.e. each is an independently indexable URL that duplicates its canonical `/product/{slug}`
hub. **None canonicalizes to `/product/{slug}`.** Both URL families are therefore competing for the same
queries (textbook duplicate/cannibalization), and the `/product-category/*` pages carry substantial
internal-link equity (blog posts + city pages + product breadcrumb schema), so they are almost certainly
indexed. This is the pattern the program exists to eliminate; Fable 5 to rule on redirect/canonical/noindex
strategy (own ticket).

## Table

| # | `/product-category/{slug}` | HTTP | `<title>` | Canonical in HTML | robots | In sitemap? | Canonicalizes to `/product/{slug}`? | Internal referrers (count · from where) |
|---|---|---|---|---|---|---|---|---|
| 1 | container-cafe | 200 | Container Cafe Designs & Price List \| Custom – SAMAN | `…/product-category/container-cafe` (self) | index, follow | Yes | **No** | 33 · api.ts canonical-config + categorySchemas.ts + ~30 café blog/city wp-export JSON |
| 2 | container-houses | 200 | Container House Types & Prices │ Custom Builds India | `…/product-category/container-houses` (self) | index, follow | Yes | **No** | 25 · categorySchemas.ts + ~24 container-home blog JSON |
| 3 | container-offices | 200 | Container Office Types & Range — Pre-Built \| SAMAN | `…/product-category/container-offices` (self) | index, follow | Yes | **No** | 96 · api.ts + categorySchemas.ts + `[slug].tsx` + homepage.json + ~90 container-office city/blog JSON |
| 4 | industrial-sheds | 200 | Industrial Shed Manufacturer India – 9 Types │ SAMAN | `…/product-category/industrial-sheds` (self) | index, follow | Yes | **No** | 18 · categorySchemas.ts + ~17 shed/warehouse blog JSON |
| 5 | labor-colony | 200 | Labor Colony Products │ Modular Worker Housing │ SAMAN | `…/product-category/labor-colony` (self) | index, follow | Yes | **No** | 18 · categorySchemas.ts + ~17 labour-colony city/blog JSON |
| 6 | peb-constructions | 200 | PEB Construction Company in India │ Custom & Turnkey \| SAMAN | `…/product-category/peb-constructions` (self) | index, follow | Yes | **No** | 21 · categorySchemas.ts + ~20 PEB blog JSON |
| 7 | porta-cabins | 200 | Porta Cabin Price List & Types in India \| SAMAN Portable | `…/product-category/porta-cabins` (self) | index, follow | Yes | **No** | 125 · api.ts + categorySchemas.ts + `[slug].tsx` + homepage.json + ~120 porta-cabin city/blog JSON |
| 8 | portable-cabin | 200 | Portable Cabin Products: Custom Types & Price List │ SAMAN | `…/product-category/portable-cabin` (self) | index, follow | Yes | **No** | 74 · categorySchemas.ts + ~73 portable-cabin city/blog JSON |
| 9 | portable-office | 200 | Portable Office Cabin Price List & Types — Custom │ SAMAN | `…/product-category/portable-office` (self) | index, follow | Yes | **No** | 42 · categorySchemas.ts + ~41 portable-office city/blog JSON |
| 10 | portable-toilet | 200 | Portable Toilet Manufacturer India — 7 Custom Types | `…/product-category/portable-toilet` (self) | index, follow | Yes | **No** | 15 · categorySchemas.ts + ~14 toilet-cabin blog JSON |
| 11 | pre-engineered-buildings | 200 | Pre-Engineered Building Supplier in India – Custom PEB \| SAMAN | `…/product-category/pre-engineered-buildings` (self) | index, follow | Yes | **No** | 14 · categorySchemas.ts + ~13 PEB blog JSON |
| 12 | prefab-buildings | 200 | Prefabricated Building Manufacturers in India \| SAMAN | `…/product-category/prefab-buildings` (self) | index, follow | Yes | **No** | 20 · categorySchemas.ts + ~19 prefab-building blog JSON |
| 13 | prefabricated-houses | 200 | Prefabricated House Manufacturer in India │ Pre-Built \| SAMAN | `…/product-category/prefabricated-houses` (self) | index, follow | Yes | **No** | 25 · categorySchemas.ts + ~24 prefab-house blog JSON |
| 14 | security-cabins | 200 | Security Cabin Manufacturer in India │ Custom-Built │ SAMAN | `…/product-category/security-cabins` (self) | index, follow | Yes | **No** | 14 · api.ts + categorySchemas.ts + ~12 security-cabin blog JSON |

## Notes
- **Canonical:** every route's `<link rel="canonical">` points to **itself** (`/product-category/{slug}`),
  not to the canonical hub `/product/{slug}`. Combined with `robots: index, follow`, all 14 are fully
  indexable duplicates of the `/product/{slug}` hubs.
- **Sitemap:** all 14 are listed in `public/sitemap.xml` (the sitemap also lists panel-category archives —
  `eps-panel`, `glass-wool-panel`, `pir-panel`, `puf-panel`, `rockwool-panel`, `roofing-sheets`,
  `sandwich-panel` — outside this ticket's 14-row scope).
- **Site-wide breadcrumb referrer:** `src/components/ProductStructuredData.tsx:212` emits
  `${baseUrl}/product-category/${category.slug}` inside every product page's BreadcrumbList JSON-LD, so
  each product page also points a structured-data link at its `/product-category/*` archive
  (additional cannibalization signal not counted in the per-row source counts above).
- **Referrer counts** are source-reference occurrences (`grep -rn`) across `src/`, dominated by in-content
  links inside wp-export blog/city-page JSON plus `categorySchemas.ts` and `src/config/api.ts` canonical
  config. They indicate real, crawlable internal equity flowing to these duplicate URLs.
- **`/api/categories`:** its sole runtime caller (`CategoryMenu.tsx`) was deleted in T1.1 Part A; the route
  `src/pages/api/categories.ts` now has **zero callers** (retained per ticket; Fable 5 decides in T10).

_No redirect/canonical/noindex change was made. This file is data only._
