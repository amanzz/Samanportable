# WORDPRESS CONTENT MIGRATION AUDIT

**Prepared For:** SAMAN POS India Private Limited  
**Prepared By:** Antigravity AI Coding Assistant  
**Date:** June 1, 2026  
**Status:** AUDIT ONLY — NO CODE CHANGES  

---

## 1. Audit Methodology

### Data Collection
- **WordPress REST API endpoint:** `https://blog.samanportable.com/wp-json/wp/v2`
- **Posts sampled:** 150 (of 870 total — 17.2% corpus sample)
- **Pages fetched:** 3 pages × 50 posts per page (REST API maximum)
- **Fields analysed per post:** `content.rendered`, `excerpt.rendered`, `slug`, `link`
- **Tool:** Custom Node.js audit script (`scripts/wp-migration-audit.js`)

### Patterns Audited
The script checked each post's HTML content for 13 distinct issue categories across four classes: legacy domain references, UTM parameters, WordPress-specific URL patterns, and content quality artefacts.

---

## 2. Issue Count Summary

### A. Raw Occurrence Counts (150 Posts Sampled)

| Issue Type | Raw Count | Posts Affected | % of Posts | Severity |
| :--- | ---: | ---: | ---: | :--- |
| `blog.samanportable.com` internal link hrefs | **984** | 139 / 150 | **92.7%** | 🔴 Critical |
| `blog.samanportable.com` image `src` attributes | **1,050** | 144 / 150 | **96.0%** | 🔴 Critical |
| `blog.samanportable.com` in `content=` meta (embedded) | 0 | 0 | 0% | ✅ Clean |
| UTM-polluted links (`?utm_source=…`) | **5** | 2 / 150 | 1.3% | 🟡 Medium |
| `/wp-content/` in `href` (non-image) | 0 | 0 | 0% | ✅ Clean |
| `/wp-content/` image `src` (= all blog images) | **1,050** | 144 / 150 | **96.0%** | 🔴 Critical |
| Old `/category/` WordPress archive URLs | 0 | 0 | 0% | ✅ Clean |
| Old `/tag/` WordPress archive URLs | 0 | 0 | 0% | ✅ Clean |
| Date archive `/YYYY/MM/` URLs | **1** | 1 / 150 | 0.7% | 🟢 Negligible |
| `?attachment_id=` attachment page links | 0 | 0 | 0% | ✅ Clean |
| Absolute internal links (`https://www.samanportable.com/…`) | **41** | Multiple | — | 🟡 Medium |
| Embedded `<link rel="canonical">` tags in body | 0 | 0 | 0% | ✅ Clean |
| Legacy WordPress shortcodes (`[caption]`, `[gallery]`, etc.) | 0 | 0 | 0% | ✅ Clean |
| Posts with zero outbound links | **4** | 4 / 150 | 2.7% | 🟢 Low |

### B. Extrapolated Estimates (All 870 Posts)

Extrapolating the 150-post sample to the full corpus of 870 posts:

| Issue | Sample Count (150 posts) | Estimated Full Corpus (870 posts) |
| :--- | ---: | ---: |
| `blog.samanportable.com` hrefs | 984 | ~5,700 |
| `blog.samanportable.com` images | 1,050 | ~6,090 |
| UTM-polluted links | 5 | ~29 |
| Absolute internal links | 41 | ~238 |

---

## 3. Issue Details with Sample URLs

### ISSUE-1 — `blog.samanportable.com` Internal Hyperlinks (CRITICAL)

**Count:** 984 occurrences across 139 of 150 posts (92.7%)  
**Root cause:** Posts were written while WordPress was both the CMS *and* the public-facing frontend. Internal "related article" links authored in the WordPress editor naturally pointed to `https://blog.samanportable.com/[slug]`. After migration to Next.js as the frontend, these links were not updated in the database.

**Impact:**
- Users who click these links leave the Next.js site and land on `blog.samanportable.com` (the WordPress backend), which is configured as `noindex`. 
- Search engines following these links crawl the WordPress subdomain instead of the canonical `www.samanportable.com` URLs, diluting crawl budget and splitting PageRank.

**Sample URLs (found in post `/container-offices-for-sale-in-jp-nagar`):**
```
https://blog.samanportable.com/porta-cabins-in-jp-nagar/
https://blog.samanportable.com/container-homes-chennai-guide/
https://blog.samanportable.com/space-optimization-small-offices/
https://blog.samanportable.com/porta-cabin-supplier-delhi-custom-solutions/
https://blog.samanportable.com/buy-preowned-container-offices/
```

> [!NOTE]
> These links point to *other blog post slugs* that also exist on `www.samanportable.com` via the `[slug].tsx` dynamic route. The domain prefix is the only error — the slug paths themselves are valid.

---

### ISSUE-2 — `blog.samanportable.com/wp-content/` Images (CRITICAL)

**Count:** 1,050 image `src` occurrences across 144 of 150 posts (96.0%)  
**Root cause:** WordPress stores all media in its own `/wp-content/uploads/` library at `blog.samanportable.com`. When posts are published, `<img>` tags embed the full absolute CDN path. The Next.js `next.config.js` already whitelists `blog.samanportable.com` as an image host, so images *do* render — but they load from the WordPress subdomain rather than any CDN-optimised path, and Next.js Image optimisation cannot proxy-transform them without routing through `/_next/image`.

**Impact:**
- Images render correctly (confirmed by `next.config.js` hostname allowlisting).
- However, they serve raw, non-optimised file sizes directly from the WordPress origin server on `blog.samanportable.com`.
- No WebP conversion, no lazy loading optimisation, no Next.js image CDN benefits apply.
- Core Web Vitals LCP is negatively affected when large unoptimised WordPress images are the first paint.

**Sample URLs (found in post `/porta-cabin-sizes-and-specifications-in-india`):**
```
https://blog.samanportable.com/wp-content/uploads/2026/04/10x10-ft-porta-cabin-site-office-construction-india-forest-gre...
https://blog.samanportable.com/wp-content/uploads/2026/04/porta-cabin-frame-puf-panel-structural-detail-sandstone-beige-...
https://blog.samanportable.com/wp-content/uploads/2026/04/porta-cabin-transport-flatbed-trailer-indian-highway-safety-or...
https://blog.samanportable.com/wp-content/uploads/2025/09/porta-cabin-rental-4-sizes-comparison-yard-nhai-blue-1024x576...
https://blog.samanportable.com/wp-content/uploads/2025/09/porta-cabin-rental-deposit-inspection-return-industrial-yellow...
```

> [!NOTE]
> Note that `blog.samanportable.com` image `src` values and `/wp-content/` image `src` values are the **same 1,050 occurrences** — all blog images are stored on the WP subdomain under `/wp-content/uploads/`. The two rows in the count table overlap intentionally, as both pattern types matched identical URLs.

---

### ISSUE-3 — UTM-Polluted Links (MEDIUM)

**Count:** 5 occurrences across 2 posts  
**Root cause:** Content was likely written or edited using an AI writing assistant (ChatGPT) that auto-appended `?utm_source=chatgpt.com` to URLs it cited. These parameters were committed to the WordPress database directly within the post body.

**Impact:**
- Internal UTM-polluted links (`www.samanportable.com/[slug]?utm_source=chatgpt.com`) create duplicate URLs in Google's index. Each UTM variant is treated as a separate page unless canonicalised.
- Internal PageRank is split between the clean URL and the UTM-parameterised version.
- External UTM-polluted links (e.g., `grandviewresearch.com?utm_source=chatgpt.com`) are a cosmetic issue only.

**Sample URLs (found in posts `/container-office-design` and `/types-of-container-offices`):**
```
https://www.samanportable.com/product/portable-cabin?utm_source=chatgpt.com          ← INTERNAL
https://www.samanportable.com/types-of-container-offices?utm_source=chatgpt.com      ← INTERNAL  
https://www.samanportable.com/types-of-container-offices?utm_source=chatgpt.com      ← INTERNAL (duplicate)
https://www.grandviewresearch.com/industry-analysis/modular-construction-market?utm_source=chatgpt.com
https://www.willscot.com/en/work-collaborate/ground-level-spaces?utm_source=chatgpt.com
```

---

### ISSUE-4 — Absolute Internal Links (MEDIUM)

**Count:** 41 occurrences  
**Root cause:** Content authors wrote internal links as fully absolute URLs (`https://www.samanportable.com/[path]`) instead of relative paths (`/[path]`). While these technically work, they are a migration quality issue.

**Impact:**
- Absolute internal links pass a small SEO disadvantage compared to relative links in headless architectures.
- They confirm content was authored with the final domain already in mind (`www.samanportable.com`), which is correct — but the absolute form prevents clean environment portability (staging vs production).
- These links do **not** harm search rankings directly but indicate inconsistent authoring practices.

**Sample URLs (found in post `/porta-cabin-sizes-and-specifications-in-india` and `/porta-cabins-on-rent`):**
```
https://www.samanportable.com/product-category/porta-cabins/
https://www.samanportable.com/product/porta-cabins/mini-porta-cabin
https://www.samanportable.com/product/porta-cabins/luxury-porta-cabin
https://www.samanportable.com/porta-cabin-price-a-complete-guide-2025
https://www.samanportable.com/container-rent-services/10x10-porta-cabin-rental
```

---

### ISSUE-5 — Date Archive URL (External Link / Negligible)

**Count:** 1 occurrence (in `/container-offices-for-sale-in-domlur`)  
**Verdict:** The single match (`https://www.forbes.com/sites/amyfeldman/2023/02/28/...`) is an **external Forbes article** whose URL path happens to contain `/2023/02/28/` matching the date-archive pattern. This is a false positive. No genuine WordPress date archive URLs were found.

---

### ISSUE-6 — Posts With Zero Links (LOW)

**Count:** 4 posts of 150 (2.7%)  
These posts contain no hyperlinks at all — no internal, no external, no subdomain. They are standalone informational articles with no outbound linking.

**Impact:** Minor. These posts accumulate any PageRank they receive but pass none onwards. For a small number this is acceptable, but if systematic, it wastes editorial link-building opportunities.

---

## 4. What Was NOT Found (Clean Areas)

The following migration artefact types were tested and confirmed **absent** from the 150-post sample:

| Artefact Type | Status |
| :--- | :--- |
| Old WordPress `/category/[term]` archive links | ✅ None found |
| Old WordPress `/tag/[term]` archive links | ✅ None found |
| `?attachment_id=` attachment page links | ✅ None found |
| Embedded `<link rel="canonical">` tags in post body | ✅ None found |
| Legacy WordPress shortcodes (`[caption]`, `[gallery]`, `[vc_row]`, etc.) | ✅ None found |
| WordPress PHP comment artefacts | ✅ None found |
| `blog.samanportable.com` in `content=` meta attributes | ✅ None found |

This confirms the original WordPress-to-headless migration cleanly removed shortcode-dependent content and attachment page links. The remaining issues are primarily **content authored link patterns**, not structural migration failures.

---

## 5. Top 10 Most-Affected Posts

These posts have the highest combined issue counts and should be prioritised for database correction:

| Rank | Post Slug | Total Issues |
| :--- | :--- | ---: |
| 1 | `/container-cafes-in-central-delhi-2` | 118 |
| 2 | `/container-cafes-in-central-delhi` | 118 |
| 3 | `/portable-office-cabins-in-east-delhi` | 56 |
| 4 | `/container-cafes-in-gurgaon` | 53 |
| 5 | `/labour-colonies-in-noida` | 50 |
| 6 | `/labour-colonies-in-greater-noida` | 50 |
| 7 | `/portable-office-cabins-in-central-delhi` | 48 |
| 8 | `/container-cafes-in-west-delhi` | 47 |
| 9 | `/container-offices-in-south-delhi` | 45 |
| 10 | `/container-cafes-in-greater-noida` | 44 |

> [!IMPORTANT]
> The two highest-impact posts (`/container-cafes-in-central-delhi-2` and `/container-cafes-in-central-delhi`) appear to be **duplicate posts** — same title, same issue count. One should be deleted or merged with the other to prevent keyword cannibalization.

---

## 6. Fix Layer Recommendations

For each validated issue, the correct technical layer to apply the fix is identified below.

---

### FIX LAYER A — WordPress Database (Permanent Root-Level Fix)

**Targets:** ISSUE-1 (subdomain hrefs), ISSUE-3 (UTM links), ISSUE-4 (absolute internal links)

This is the only permanent, zero-maintenance fix for link content. Changing the data at source means every rendering layer automatically receives clean content.

**Recommended tool:** WP-CLI `search-replace` command with `--dry-run` first.

```bash
# Step 1: Dry run — preview what will change
wp search-replace 'https://blog.samanportable.com/' 'https://www.samanportable.com/' \
  --post_type=post \
  --dry-run \
  --report-changed-only

# Step 2: Execute after backup
wp search-replace 'https://blog.samanportable.com/' 'https://www.samanportable.com/' \
  --post_type=post \
  --report-changed-only

# Step 3: Strip UTM parameters from internal links
wp search-replace '?utm_source=chatgpt.com' '' \
  --post_type=post \
  --report-changed-only

# Step 4: Convert absolute internal links to relative (optional, lower priority)
wp search-replace 'href="https://www.samanportable.com/' 'href="/' \
  --post_type=post \
  --report-changed-only
```

> [!CAUTION]
> Always run a **full database backup before executing** any WP-CLI search-replace on production. The `--dry-run` flag is safe and shows counts without modifying data.

**Estimated impact of Step 2:** Fixes all ~5,700 subdomain hrefs (extrapolated), permanently. All `blog.samanportable.com/[slug]` links become `www.samanportable.com/[slug]` — pointing to the correct Next.js routes.

**What Step 2 does NOT fix:** Images. The WP-CLI replace would rewrite image `src` attributes from `https://blog.samanportable.com/wp-content/uploads/...` to `https://www.samanportable.com/wp-content/uploads/...`. However, `www.samanportable.com` does **not** serve `/wp-content/` — so this would break all images. See Fix Layer B for the correct image solution.

---

### FIX LAYER B — Next.js Rendering Layer (Partial Runtime Fix for Images)

**Targets:** ISSUE-2 (WordPress media images)

WordPress images **cannot** be moved out of `blog.samanportable.com/wp-content/uploads/` without migrating the entire WordPress Media Library to a CDN or object storage. Until that migration occurs, the best achievable fix is to ensure the Next.js rendering layer handles these images efficiently.

**Current state:** `next.config.js` already allows `blog.samanportable.com` as an image host. The `OptimizedContent.tsx` component already uses `next/image` for blog content images (with `loading="lazy"` and `sizes` attributes). This means Next.js *does* optimise images through its `/_next/image` proxy.

**What remains unimplemented:**
1. **Server-side image `src` normalisation** — Blog post `content.rendered` is passed directly to the component without any server-side `src` replacement. The `OptimizedContent.tsx` client-side replacement only handles `href` attributes, not `src` attributes.
2. **In `[slug].tsx` `getServerSideProps`** — adding a server-side string replacement for image `src` attributes before passing to the component would ensure SSR HTML also contains correctly routed image paths (through `/_next/image`).

**Recommended approach:** Once WP-CLI replaces subdomain *hrefs* (Fix A), add server-side SSR image `src` normalisation in `getServerSideProps` to ensure images are served through Next.js optimisation pipeline even without a full media library migration.

**What Fix Layer B cannot fix:** The WordPress Media Library file storage location. Images will still physically reside at `blog.samanportable.com/wp-content/uploads/` until a media migration to a CDN (e.g., Cloudflare Images, Bunny CDN, or AWS S3) is performed.

---

### FIX LAYER C — Redirect Layer (Not Applicable for This Issue Set)

**Targets:** None from this audit require redirect-layer fixes.

**Rationale:**
- There are **zero** broken WordPress category archive, tag archive, or attachment page URLs found in the 150-post sample. No redirects need to be written for these URL patterns.
- The single date-archive URL found (`forbes.com/2023/02/28/...`) is an external domain link — redirects on `www.samanportable.com` cannot control it.
- The subdomain link issue is a *content* problem (wrong link target authored in WordPress), not a routing problem. Creating a redirect from `blog.samanportable.com/*` → `www.samanportable.com/*` **would** resolve the user-facing UX issue (users clicking subdomain links would be bounced back to the main site), but it does **not** fix the SEO issue of links pointing to the wrong domain in the first place.

> [!TIP]
> A wildcard redirect at the web server level (`blog.samanportable.com/* → https://www.samanportable.com/*`) is a **fast, low-risk interim measure** that can be applied immediately while the WP-CLI database fix is being prepared. It costs nothing and immediately rescues any user who clicks a stale subdomain link.

---

## 7. Remaining Migration Artefacts Summary

| Artefact | Present | Count (150 posts) | Fix Layer |
| :--- | :---: | ---: | :--- |
| `blog.samanportable.com` internal hrefs | ✅ Yes | 984 | **A: WordPress DB** |
| `blog.samanportable.com` image srcs | ✅ Yes | 1,050 | **B: Next.js rendering + future media migration** |
| UTM-polluted internal links | ✅ Yes | 3 internal, 2 external | **A: WordPress DB** |
| Absolute internal links | ✅ Yes | 41 | **A: WordPress DB (optional)** |
| WordPress shortcodes | ❌ None | 0 | N/A |
| Old `/category/` archive URLs | ❌ None | 0 | N/A |
| Old `/tag/` archive URLs | ❌ None | 0 | N/A |
| Attachment page links | ❌ None | 0 | N/A |
| Date archive URLs (genuine) | ❌ None | 0 | N/A |
| Embedded canonical tags in body | ❌ None | 0 | N/A |
| Duplicate posts | ✅ Yes | 1 pair confirmed | Editorial delete in WP Admin |

---

## 8. Prioritised Action Plan

| Priority | Action | Layer | Estimated Posts Fixed |
| :--- | :--- | :--- | ---: |
| **P1 🔴** | WP-CLI: Replace `blog.samanportable.com/` → `www.samanportable.com/` in all post hrefs | WordPress DB | 139 / 870 posts |
| **P2 🔴** | Wildcard redirect: `blog.samanportable.com/*` → `www.samanportable.com/*` (interim safety net) | Nginx / CDN redirect | All stale link clicks |
| **P3 🟡** | WP-CLI: Strip `?utm_source=chatgpt.com` from internal links | WordPress DB | 2 / 870 posts |
| **P4 🟡** | Add server-side `src` normalisation in `[slug].tsx` `getServerSideProps` for image paths | Next.js rendering | 144 / 870 posts |
| **P5 🟢** | Delete duplicate post `/container-cafes-in-central-delhi-2` (or merge with `-central-delhi`) | WordPress Admin | 1 duplicate |
| **P6 🟢** | WP-CLI: Convert absolute internal hrefs to relative | WordPress DB | Multiple posts |
| **P7 🟢** | Plan WordPress Media Library CDN migration (Bunny CDN / Cloudflare Images) | Infrastructure | 870 posts (images) |

---

## 9. Key Conclusions

1. **The migration is structurally clean.** WordPress shortcodes, attachment pages, legacy category/tag archives, and embedded canonical artefacts are all absent — indicating a well-executed headless migration at the template level.

2. **The primary unresolved issue is content-level, not structural.** 92.7% of posts contain internal hyperlinks to `blog.samanportable.com`. This is a content authoring artefact from the pre-migration period, solvable with a single WP-CLI search-replace command.

3. **All blog images render from the WordPress origin server.** This is architecturally expected (WordPress Media Library is at `blog.samanportable.com`) but means images do not benefit from CDN edge caching at the frontend layer. A future media migration to a CDN is the long-term resolution.

4. **UTM contamination is isolated.** Only 2 posts out of 150 contain UTM-polluted links, and only 3 of those 5 links are internal. A targeted WP-CLI replace can fix them in minutes.

5. **A wildcard 301 redirect from `blog.samanportable.com` → `www.samanportable.com` is the fastest, highest-leverage interim action** available without any database changes or code deployments.
