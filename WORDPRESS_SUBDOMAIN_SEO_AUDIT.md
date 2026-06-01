# WORDPRESS SUBDOMAIN SEO AUDIT

**Prepared For:** SAMAN POS India Private Limited  
**Prepared By:** Antigravity AI Coding Assistant  
**Date:** June 1, 2026  
**Target:** `https://blog.samanportable.com`  
**Method:** Live HTTP HEAD requests, HTML body scraping, sitemap inspection  
**Status:** AUDIT ONLY — NO CODE CHANGES

---

## 1. Evidence Summary Table

All tests performed with live HTTP requests. Results are reproducible.

| Check | URL / Pattern | Finding | Verdict |
| :--- | :--- | :--- | :---: |
| **robots.txt** | `/robots.txt` | Exists, HTTP 200. Contains `Disallow: /wp-admin/`. No `Disallow: /` globally. Points to sitemap index. | ⚠️ Partial |
| **X-Robots-Tag header** | All pages tested | **Absent** from all HTTP response headers | ❌ Missing |
| **Homepage meta robots** | `/` | `<meta name="robots" content="nofollow, noindex"/>` | ✅ noindex |
| **Single post meta robots** | `/porta-cabins-in-jp-nagar/` | `<meta name="robots" content="nofollow, noindex"/>` | ✅ noindex |
| **Single post meta robots** | `/container-offices-for-sale-in-jp-nagar/` | `<meta name="robots" content="nofollow, noindex"/>` | ✅ noindex |
| **Canonical tag on post** | `/porta-cabins-in-jp-nagar/` | **None found** | ❌ Missing |
| **Canonical tag on post** | `/container-offices-for-sale-in-jp-nagar/` | **None found** | ❌ Missing |
| **Category archive meta robots** | `/category/portable-construction/` | `<meta name="robots" content="nofollow, noindex"/>` | ✅ noindex |
| **Tag archive meta robots** | `/tag/porta-cabin/` | `<meta name="robots" content="nofollow, noindex"/>` | ✅ noindex |
| **Search results meta robots** | `/?s=porta+cabin` | `<meta name="robots" content="nofollow, noindex"/>` | ✅ noindex |
| **sitemap_index.xml** | `/sitemap_index.xml` | HTTP 200. Contains 8 sub-sitemaps including posts, products, categories, local. | ⚠️ Active & public |
| **post-sitemap1.xml** | `/post-sitemap1.xml` | HTTP 200. Lists `blog.samanportable.com/` URLs publicly. | ⚠️ Active & public |
| **product-sitemap.xml** | `/product-sitemap.xml` | Returns 404 page (noindex). WooCommerce products not served at this URL. | ✅ Not accessible |
| **category-sitemap.xml** | `/category-sitemap.xml` | Returns 404 page (noindex). Category sitemaps not accessible. | ✅ Not accessible |
| **RSS Feed** | `/feed/` | HTTP 200. Publicly accessible, no noindex. | ⚠️ Active |
| **Google Search Console** | Homepage `<head>` | GSC verification tag present: `Xth_NCvfs3VcgZhzvB6iusI0z45LAP0_YtztrkfniCw` | ⚠️ GSC verified |
| **Organization schema @id** | Homepage JSON-LD | `"@id": "https://blog.samanportable.com/#organization"` | ❌ Wrong domain |

---

## 2. Detailed Findings Per Check

### 2.1 — robots.txt

**URL:** `https://blog.samanportable.com/robots.txt`  
**HTTP Status:** `200 OK`

```
User-agent: *
Disallow: /wp-content/uploads/wc-logs/
Disallow: /wp-content/uploads/woocommerce_transient_files/
Disallow: /wp-content/uploads/woocommerce_uploads/
Disallow: /*?add-to-cart=
Disallow: /*?*add-to-cart=
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://blog.samanportable.com/sitemap_index.xml
```

**Analysis:**
- There is **no `Disallow: /` rule**. The robots.txt does not block crawlers from visiting any post, page, or archive URL.
- The `Sitemap:` directive **actively invites** crawlers to discover and index all listed URLs.
- While individual pages carry `noindex` meta tags, the robots.txt actively invites crawlers in — creating a contradiction.
- WooCommerce transient files and upload logs are correctly blocked.

---

### 2.2 — X-Robots-Tag Response Header

**Test against:** `/`, `/porta-cabins-in-jp-nagar/`, `/container-offices-for-sale-in-jp-nagar/`

```
HTTP/2 200
x-powered-by: PHP/8.4.19
platform: hostinger
[... no X-Robots-Tag header present ...]
```

**Finding:** The `X-Robots-Tag` HTTP response header is **completely absent** on all tested URLs.

**Why this matters:** `X-Robots-Tag` is the **only** mechanism that blocks indexing of non-HTML resources (e.g., PDFs, images served from `/wp-content/`). Its absence means:
- The WordPress admin cannot use response-level blocking independent of page content.
- No server-level failsafe exists if the meta robots tag is accidentally removed from a template.

---

### 2.3 — Individual Post Pages (Blog Posts)

**Test:** Two posts tested:
1. `https://blog.samanportable.com/porta-cabins-in-jp-nagar/`
2. `https://blog.samanportable.com/container-offices-for-sale-in-jp-nagar/`

**Both return:**
```html
<meta name="robots" content="nofollow, noindex"/>
```

**No canonical tag present on either post.** The `<link rel="canonical">` element is completely absent from the `<head>`. This means there is **no canonical pointing to `www.samanportable.com`** either — Google has no signal telling it that the canonical version of these posts lives elsewhere.

---

### 2.4 — Category Archives

**Test:** `https://blog.samanportable.com/category/portable-construction/`

```html
<meta name="robots" content="nofollow, noindex"/>
```

**Finding:** Category archive pages carry `noindex`. Google should not index them.

---

### 2.5 — Tag Archives

**Test:** `https://blog.samanportable.com/tag/porta-cabin/`

```html
<meta name="robots" content="nofollow, noindex"/>
```

**Finding:** Tag archive pages carry `noindex`. Google should not index them.

---

### 2.6 — WordPress Search Results Pages

**Test:** `https://blog.samanportable.com/?s=porta+cabin`

```html
<meta name="robots" content="nofollow, noindex"/>
```

**Finding:** Search result pages carry `noindex`. Google should not index them.

---

### 2.7 — Sitemap Status

**`sitemap_index.xml`** (`HTTP 200`, publicly accessible):
```xml
<sitemapindex>
  <sitemap>
    <loc>https://blog.samanportable.com/post-sitemap1.xml</loc>
    <lastmod>2026-06-01T10:22:33+00:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://blog.samanportable.com/post-sitemap2.xml</loc> ...
  </sitemap>
  <sitemap>
    <loc>https://blog.samanportable.com/post-sitemap3.xml</loc> ...
  </sitemap>
  <sitemap>
    <loc>https://blog.samanportable.com/post-sitemap4.xml</loc> ...
  </sitemap>
  <sitemap>
    <loc>https://blog.samanportable.com/post-sitemap5.xml</loc> ...
  </sitemap>
  <sitemap>
    <loc>https://blog.samanportable.com/product-sitemap.xml</loc> ...
  </sitemap>
  <sitemap>
    <loc>https://blog.samanportable.com/category-sitemap.xml</loc> ...
  </sitemap>
  <sitemap>
    <loc>https://blog.samanportable.com/local-sitemap.xml</loc> ...
  </sitemap>
</sitemapindex>
<!-- XML Sitemap generated by Rank Math SEO Plugin -->
```

**`post-sitemap1.xml`** (`HTTP 200`): Lists `blog.samanportable.com/` blog post URLs with full metadata. Publicly accessible.

**`product-sitemap.xml`**: Returns a 404 page with `noindex,nofollow` — WooCommerce products inaccessible.

**`category-sitemap.xml`**: Returns a 404 page with `noindex,nofollow` — categories inaccessible.

> [!IMPORTANT]
> The sitemap is active, publicly accessible, and submitted via `robots.txt`. Even though individual pages are `noindex`, Google's crawler actively crawls sitemaps to discover URLs and assign crawl budget. This means Google's crawler is **actively visiting** all 870 blog post URLs on `blog.samanportable.com` — it simply does not serve them in search results.

---

### 2.8 — RSS Feed

**URL:** `https://blog.samanportable.com/feed/`  
**HTTP Status:** `200 OK`  
**Content-Type:** `application/rss+xml`  
**No noindex meta or X-Robots-Tag on feed.**

**Finding:** The RSS feed is publicly live and returns full post content. Feed readers and crawlers that subscribe to this feed will receive blog content from the subdomain, not `www.samanportable.com`. This is a minor but unresolved legacy artefact.

---

### 2.9 — Organisation Schema Domain Conflict

The homepage JSON-LD schema (emitted by Rank Math) declares the Organization `@id` using the **WordPress subdomain**:

```json
{
  "@type": "Organization",
  "@id": "https://blog.samanportable.com/#organization",
  "url": "https://blog.samanportable.com/",
  ...
}
```

Meanwhile, the **Next.js frontend** (`www.samanportable.com`) emits its own Organization entity, likely with `@id: "https://www.samanportable.com/#organization"`.

**Finding:** Google's Knowledge Graph sees two distinct Organisation entities for the same business — one anchored at `blog.samanportable.com` and one at `www.samanportable.com`. This creates **schema entity ambiguity** and prevents Google from confidently consolidating these into a single business Knowledge Panel entry.

---

### 2.10 — Google Search Console Verification

The homepage `<head>` contains:
```html
<meta name="google-site-verification" content="Xth_NCvfs3VcgZhzvB6iusI0z45LAP0_YtztrkfniCw" />
```

**Finding:** `blog.samanportable.com` is actively verified in Google Search Console. This means Google is sending **Coverage reports, Index Coverage data, and crawl alerts** for the WordPress subdomain separately from `www.samanportable.com`. The site owner has an active Google relationship with this domain — which is important context for the redirect decision.

---

## 3. Direct Answers to Audit Questions

### Is the subdomain noindex?

**Partially yes — but imperfectly implemented.**

All pages tested carry `<meta name="robots" content="nofollow, noindex"/>` at the HTML level. However:
- The `robots.txt` has **no `Disallow: /`** rule — crawlers are invited in via sitemap.
- There is **no `X-Robots-Tag` HTTP header** — no server-level enforcement.
- Individual pages must set `noindex` correctly — any misconfiguration in Rank Math or WordPress settings would instantly expose content.

Google's policy on `noindex`: when a page has `noindex`, Google will **not index it** but **will still crawl it** — consuming crawl budget from the canonical `www.samanportable.com`.

---

### Can Google index blog.samanportable.com URLs?

**In practice: No — but only because of HTML-level meta tags.**  
Google is not prevented at the robots.txt level, and will continue visiting these URLs. The `noindex` tag tells it not to serve them in results, but Google can and does continue to crawl and store the content internally.

---

### Are category archives indexable?

**No.** Live test confirmed `<meta name="robots" content="nofollow, noindex"/>` on `/category/portable-construction/`.

---

### Are tag archives indexable?

**No.** Live test confirmed `<meta name="robots" content="nofollow, noindex"/>` on `/tag/porta-cabin/`.

---

### Are search result pages indexable?

**No.** Live test confirmed `<meta name="robots" content="nofollow, noindex"/>` on `/?s=porta+cabin`.

---

### Any duplicate content risk with www.samanportable.com?

**Yes — three layers of duplicate content risk remain:**

| Layer | Risk | Severity |
| :--- | :--- | :---: |
| **Post content** | 870 blog posts exist at both `blog.samanportable.com/[slug]` and `www.samanportable.com/[slug]`. The blog subdomain has `noindex`, but **no canonical tag** pointing to `www.`. Google can only respect `noindex` — it has no canonical signal to assign authority to `www.`. | 🟠 Medium |
| **Schema entity duplication** | Organisation `@id` at `blog.` conflicts with `@id` at `www.`. Two identities for one business in Google's Knowledge Graph. | 🟡 Medium |
| **Active sitemap on noindex domain** | The sitemap actively broadcasts all 870 URLs to crawlers while the pages themselves say `noindex`. This wastes crawl budget from `www.samanportable.com`. | 🟡 Medium |
| **RSS feed** | Feed content accessible without noindex, providing an alternate syndication path for the subdomain content. | 🟢 Low |

---

## 4. Recommendation

### Option A — Keep Accessible + Maintain noindex

**What it means:** Leave `blog.samanportable.com` running as-is with Rank Math's `noindex` on all pages.

**Pros:**
- WordPress REST API continues working with no risk of redirect loops.
- No `.htaccess` changes required.
- All existing editorial tooling (WordPress admin, preview links) continues functioning.

**Cons:**
- `noindex` is a **soft signal** — relies entirely on Rank Math correctly configuring every page type. A single Rank Math setting change, plugin conflict, or WordPress update could accidentally flip all 870 posts to `index`.
- No canonical tags exist → no cross-domain PageRank consolidation signals.
- Active sitemap on a noindex domain wastes Google's crawl budget.
- Organisation schema conflict persists.
- RSS feed broadcasts content without noindex.

**Verdict:** ⚠️ **Insufficient as a standalone strategy.** The current `noindex` implementation relies on a single plugin (Rank Math) as the sole protection layer with no fallback at the robots.txt or server level.

---

### Option B — Add Wildcard Redirect (blog.* → www.*)

**What it means:** Redirect all non-API traffic from `blog.samanportable.com/*` to `https://www.samanportable.com/*`.

**Pros:**
- Eliminates all duplicate content risk permanently — the subdomain cannot serve content at all.
- Consolidates all crawl budget, link equity, and user sessions to `www.samanportable.com`.
- Permanently resolves all 984 subdomain href links discovered in the content audit.
- No dependence on Rank Math remaining correctly configured.

**Cons:**
- **High implementation risk** if API exclusions are misconfigured — Next.js would lose its WordPress data source.
- WordPress Admin (`wp-admin`) and editorial previews would stop working unless carefully excluded.
- Google Search Console property for `blog.samanportable.com` would need cleanup.

**Verdict:** ✅ **Correct long-term goal — but requires careful `.htaccess` implementation with API exclusions.**

---

### ✅ Option C — Recommended: Combination of Both (Hardened noindex + Planned Redirect)

**The correct approach is a two-phase strategy:**

#### Phase 1 — Immediate: Harden the noindex (No redirect risk)

Implement defense-in-depth at the `robots.txt` level **without touching redirects**:

1. **Add `Disallow: /` to `robots.txt`** (with API exclusion):
   ```
   User-agent: *
   Disallow: /
   Allow: /wp-json/
   Allow: /wp-admin/admin-ajax.php
   ```
   This prevents Google from crawling the subdomain entirely, stopping crawl budget waste.

2. **Add canonical tags to WordPress posts** pointing to `www.samanportable.com`. In Rank Math settings → Titles & Meta → Posts → Canonical URL → set to `https://www.samanportable.com/%postname%/`. This gives Google the correct signal to consolidate PageRank.

3. **Disable the WordPress sitemap** (in Rank Math → Sitemap → Disable all sitemaps). A noindex domain should not actively broadcast sitemap URLs to Google Search Console.

4. **Fix the Organisation schema `@id`** in Rank Math → Titles & Meta → Local SEO → change site URL to `https://www.samanportable.com` so the `@id` matches the canonical frontend.

#### Phase 2 — Planned: Wildcard Redirect (when ready)

Once the WordPress backup process is confirmed and the `.htaccess` exclusions are validated in a staging environment, deploy the wildcard redirect as documented in `WORDPRESS_MIGRATION_FIX_REPORT.md`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/wp-json/ [NC]
RewriteCond %{REQUEST_URI} !^/wp-admin/ [NC]
RewriteCond %{REQUEST_URI} !^/wp-content/ [NC]
RewriteCond %{REQUEST_URI} !^/wp-login\.php [NC]
RewriteCond %{REQUEST_URI} !^/xmlrpc\.php [NC]
RewriteRule ^(.*)$ https://www.samanportable.com/$1 [R=301,L]
```

**Phase 1 eliminates all risk while Phase 2 is being prepared. Both together eliminate duplicate content risk completely.**

---

## 5. Priority Action Summary

| Priority | Action | Layer | Risk |
| :--- | :--- | :--- | :---: |
| **P1** | Add `Disallow: /` + `Allow: /wp-json/` to `robots.txt` | WordPress admin | 🟢 Low |
| **P2** | Set canonical URLs in Rank Math to point to `www.samanportable.com` | Rank Math settings | 🟢 Low |
| **P3** | Disable Rank Math sitemap on blog subdomain | Rank Math settings | 🟢 Low |
| **P4** | Fix Organisation schema `@id` to use `www.samanportable.com` | Rank Math settings | 🟢 Low |
| **P5** | Deploy `.htaccess` wildcard redirect with API exclusions | Hostinger server | 🟡 Medium |
| **P6** | Update GSC property after redirect is live | Google Search Console | 🟢 Low |
