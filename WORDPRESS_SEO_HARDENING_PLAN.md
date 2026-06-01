# WORDPRESS SEO HARDENING — IMPLEMENTATION PLAN

**Prepared For:** SAMAN POS India Private Limited  
**Prepared By:** Antigravity AI Coding Assistant  
**Date:** June 1, 2026  
**Basis:** `WORDPRESS_SUBDOMAIN_SEO_AUDIT.md`  
**Status:** PLAN ONLY — NO CHANGES MADE

---

## Scope

This plan covers **four changes made entirely inside the WordPress admin panel and Rank Math plugin settings**. No code is touched. No `.htaccess` is modified. No redirects are deployed. The changes are:

| # | Change | Tool | Risk |
| :--- | :--- | :--- | :---: |
| 1 | Add canonical URL pattern pointing to `www.samanportable.com` for all posts | Rank Math → Titles & Meta | 🟢 Low |
| 2 | Correct Organisation schema `@id` from `blog.` to `www.` | Rank Math → Local SEO | 🟢 Low |
| 3 | Disable Rank Math sitemap generation | Rank Math → Sitemap | 🟢 Low |
| 4 | Verify noindex coverage across all page types | Rank Math → Titles & Meta (read-only audit) | 🟢 None |

**Total estimated time:** 20–30 minutes in WordPress admin.  
**Rollback time:** 5 minutes (settings revert only — no database or file restoration required).

---

## Prerequisites

Before any changes, perform these preparatory steps:

### Pre-flight Checklist

- [ ] Log in to `https://blog.samanportable.com/wp-admin`
- [ ] Confirm Rank Math is the active SEO plugin (not Yoast or All-in-One SEO)
- [ ] Confirm Rank Math version ≥ 1.0.200 (supports canonical URL overrides in Titles & Meta)
- [ ] Take a **full-page screenshot** of each Rank Math settings page before changing it (rollback reference)
- [ ] Note the current `robots.txt` content (copy to a text file for rollback reference)
- [ ] Open a second browser tab to `https://blog.samanportable.com/porta-cabins-in-jp-nagar/` (validation target — keep open throughout)

> [!CAUTION]
> Do not skip the screenshot step. Rank Math does not version-control settings. If a setting is accidentally changed, the only rollback is manual reversion to the screenshot values.

---

## Change 1 — Canonical URL for All WordPress Posts

### Problem

Live audit confirmed: **zero posts have a `<link rel="canonical">` tag**. Google sees 870 pages at `blog.samanportable.com/[slug]` and 870 identical pages at `www.samanportable.com/[slug]` with no signal indicating which is canonical. Even with `noindex` on the blog subdomain, no PageRank consolidation signal flows to the `www.` versions.

### Goal

Every post on `blog.samanportable.com/[slug]` should emit:
```html
<link rel="canonical" href="https://www.samanportable.com/[slug]/" />
```

This tells Google: "The authoritative version of this content lives at `www.samanportable.com`. Assign all link equity there."

---

### 1.1 — Set the Global Canonical Pattern for Posts

**Navigation path in WordPress Admin:**

```
Rank Math → Titles & Meta → Posts
```

**Exact steps:**

1. From WordPress admin sidebar: click **Rank Math** → **Titles & Meta**
2. Click the **Posts** tab (it may say "Posts" or show a document icon — it is the first content-type tab after "Global")
3. Scroll down to the section labelled **"Advanced"** or **"Robots Meta"** — it may require clicking an "Advanced" expand button
4. Locate the field labelled **"Canonical URL"**

> [!IMPORTANT]
> In Rank Math Pro, the canonical URL field for post types is located under:  
> **Rank Math → Titles & Meta → Posts → (scroll to bottom) → Advanced → Canonical URL**  
> In Rank Math Free, it is under:  
> **Rank Math → Titles & Meta → Posts → Custom Canonical URL**  
> The field may be empty by default — that is the current state (explaining why no canonical tag appears in the HTML).

5. Set the **Canonical URL** field to:

```
https://www.samanportable.com/%postname%/
```

**Variable explanation:**
- `%postname%` — Rank Math dynamic variable that inserts the post's slug (e.g., `porta-cabins-in-jp-nagar`)
- The trailing `/` matches the WordPress permalink structure (confirmed: posts already resolve with trailing slash)

6. Click **Save Changes** at the bottom of the page

**Expected output after saving (on any post page):**
```html
<link rel="canonical" href="https://www.samanportable.com/porta-cabins-in-jp-nagar/" />
```

---

### 1.2 — Set the Global Canonical Pattern for Pages

WordPress "Pages" (static pages like `/about/`, `/contact/`) may also exist on the subdomain. Apply the same canonical pattern.

**Navigation path:**

```
Rank Math → Titles & Meta → Pages
```

**Exact steps:**

1. Click **Pages** tab in Titles & Meta
2. Locate **Canonical URL** field under Advanced section
3. Set to:

```
https://www.samanportable.com/%pagename%/
```

4. Click **Save Changes**

---

### 1.3 — Verify No Per-Post Canonical Overrides Exist

Individual posts can have per-post canonical URL overrides set in the Rank Math meta box inside the post editor. The global pattern set in step 1.1 is the default, but per-post overrides take priority.

**How to check (sample verification, not exhaustive):**

1. Navigate to **Posts → All Posts** in WordPress admin
2. Open the two known high-traffic posts in separate tabs:
   - `porta-cabins-in-jp-nagar` (edit this post)
   - `container-offices-for-sale-in-jp-nagar` (edit this post)
3. In each post editor, scroll down to the **Rank Math** meta box (below the editor)
4. Click the **Advanced** tab inside the Rank Math meta box
5. Check the **"Custom Canonical URL"** field — it should be **empty** (empty = uses the global pattern set in 1.1)
6. If any post has a hardcoded canonical URL pointing to `blog.samanportable.com/[slug]`, **clear that field** so it inherits the global pattern

> [!NOTE]
> You do not need to edit all 870 posts individually. The global pattern in 1.1 applies to all posts where the per-post override field is empty. Only posts with an explicit per-post canonical override need individual attention.

---

## Change 2 — Organisation Schema `@id` Correction

### Problem

Live audit found the WordPress homepage JSON-LD emits:

```json
{
  "@type": "Organization",
  "@id": "https://blog.samanportable.com/#organization",
  "url": "https://blog.samanportable.com/",
  "name": "SAMAN Portable Office Solutions India Private Limited"
}
```

The Next.js frontend (`www.samanportable.com`) emits its own Organization entity with `@id: "https://www.samanportable.com/#organization"`. Google sees two different `@id` values for the same business — preventing Knowledge Graph consolidation.

### Goal

The WordPress subdomain Organisation schema should use `www.samanportable.com` as its base URL, making its `@id` identical to the one emitted by the Next.js frontend:

```json
{
  "@type": "Organization",
  "@id": "https://www.samanportable.com/#organization",
  "url": "https://www.samanportable.com/"
}
```

---

### 2.1 — Update the Site Address (URL) in WordPress Settings

Rank Math derives the schema `@id` and `url` from WordPress's own **Site Address (URL)** setting. This is the primary field to change.

> [!WARNING]
> WordPress has **two** URL fields: "WordPress Address (URL)" and "Site Address (URL)". They are different.
> - **WordPress Address (URL)** = where WordPress core files are installed. **Do NOT change this.** Changing it can break the admin login.
> - **Site Address (URL)** = the public-facing URL Google and users see. **This is the one to change.**

**Navigation path:**

```
Settings → General
```

**Exact steps:**

1. From WordPress admin sidebar: click **Settings** → **General**
2. Locate the field **"WordPress Address (URL)"** — note its current value (`https://blog.samanportable.com`) but **do not change it**
3. Locate the field **"Site Address (URL)"** — it currently shows `https://blog.samanportable.com`
4. Change **Site Address (URL)** only to:

```
https://www.samanportable.com
```

5. Scroll to the bottom and click **Save Changes**
6. WordPress will confirm the change with a success notice

> [!IMPORTANT]
> After saving, WordPress may redirect you to the login page or display a blank screen for a moment. This is normal. Log back in at `https://blog.samanportable.com/wp-admin` (the admin URL does not change — only the public site URL changed).

**Effect on Rank Math schema output:**

Rank Math reads the `home_url()` WordPress function, which returns the Site Address (URL). After this change, all `@id` values and `url` properties in JSON-LD schema will automatically update from `blog.samanportable.com` to `www.samanportable.com` on the next page load — no further Rank Math settings need changing for schema.

---

### 2.2 — Force Rank Math to Regenerate Schema Cache

Rank Math may cache the schema output. After saving the Site Address in 2.1:

**Navigation path:**

```
Rank Math → Status & Tools → Database Tools
```

**Exact steps:**

1. Click **Rank Math** → **Status & Tools**
2. Click the **Database Tools** tab
3. Locate the **"Flush Rank Math Cache"** button (may also be labelled "Flush Cache" or "Clear Cache")
4. Click it and confirm any prompt
5. After the cache flush completes, navigate to a post page in a new incognito window and inspect the JSON-LD to confirm the `@id` now reads `https://www.samanportable.com/#organization`

---

### 2.3 — Verify Rank Math Knowledge Graph / Local SEO Settings

Rank Math Pro includes a "Local SEO" module with explicit `@id` and `url` overrides for the Organisation entity. These override the global Site Address setting if set.

**Navigation path:**

```
Rank Math → Titles & Meta → Local SEO  
  (may also appear as: Rank Math → General Settings → Local SEO)
```

**Exact steps:**

1. Navigate to this screen
2. Locate the **"Company/Person URL"** field (sometimes labelled "Website URL" or "Business URL")
3. If it currently reads `https://blog.samanportable.com`, update it to:

```
https://www.samanportable.com
```

4. Locate the **"Logo URL"** field — if it references `https://blog.samanportable.com/wp-content/uploads/...`, leave it as-is (image files must remain at the blog subdomain — they cannot be served from `www.`)
5. Click **Save Changes**

---

## Change 3 — Disable Rank Math Sitemap Generation

### Problem

The live audit found `blog.samanportable.com/sitemap_index.xml` returns HTTP `200 OK` and lists 8 active sub-sitemaps covering all 870 posts. The `robots.txt` contains a `Sitemap:` directive pointing crawlers to this index. This causes Google to actively crawl all `blog.samanportable.com` URLs, wasting crawl budget from `www.samanportable.com`.

A `noindex` domain should not broadcast a sitemap — the sitemap serves no purpose since Google will not index the pages, but it does consume crawl budget.

### Goal

- `https://blog.samanportable.com/sitemap_index.xml` → returns 404 or 301
- `https://blog.samanportable.com/robots.txt` → no longer contains a `Sitemap:` directive

---

### 3.1 — Disable All Sitemaps in Rank Math

**Navigation path:**

```
Rank Math → Sitemap Settings
```

**Exact steps:**

1. Click **Rank Math** → **Sitemap Settings** from the admin sidebar
2. At the top of the page, locate the toggle or checkbox labelled **"Sitemap"** or **"Enable Sitemap"**
3. **Turn this toggle OFF** (disable sitemap generation entirely)
4. Click **Save Changes**

**Effect:**
- `sitemap_index.xml` will return a 404
- All sub-sitemaps (`post-sitemap1.xml`, `post-sitemap2.xml`, etc.) will return 404
- Rank Math will **automatically remove** the `Sitemap: https://blog.samanportable.com/sitemap_index.xml` line from `robots.txt`

> [!NOTE]
> Rank Math auto-manages the `Sitemap:` directive in `robots.txt` when the sitemap toggle is on. Disabling the sitemap in Rank Math also removes the `Sitemap:` line from `robots.txt` without any manual `robots.txt` editing required. This is the only robots.txt change needed — no `Disallow:` rules are added per scope.

---

### 3.2 — Remove Sitemap URL from Google Search Console

After disabling the sitemap, remove the submitted sitemap URL from Google Search Console to prevent GSC from reporting errors for missing sitemap files.

**Steps (performed in Google Search Console — not WordPress admin):**

1. Open [Google Search Console](https://search.google.com/search-console) and select the `blog.samanportable.com` property
2. Navigate to **Sitemaps** in the left sidebar
3. Locate `https://blog.samanportable.com/sitemap_index.xml` in the submitted sitemaps list
4. Click the three-dot menu next to it → **Remove**
5. Confirm removal

> [!NOTE]
> GSC sitemap removal only removes the URL from GSC's dashboard — it does not affect crawling or indexing. It is a housekeeping step to eliminate confusing error reports after the sitemap is disabled.

---

## Change 4 — Verify Existing noindex Coverage (Read-Only Audit)

This step is a verification pass only — no settings are changed unless a gap is found. All page types were confirmed `noindex` by the live audit, but this step documents the exact Rank Math settings responsible so they can be monitored.

---

### 4.1 — Verify noindex on Posts

**Navigation path:**

```
Rank Math → Titles & Meta → Posts → Robots Meta
```

**What to verify:**

- The **"Robots Meta"** setting for Posts type must show **"No Index"** checked/enabled
- It must NOT show "Index" (without "No Index" checked, posts will become indexable)

**Current confirmed state (from live audit):**  
`<meta name="robots" content="nofollow, noindex"/>` — ✅ Correct

**Expected Rank Math setting:** `No Index = ON`, `No Follow = ON`

---

### 4.2 — Verify noindex on Pages

**Navigation path:**

```
Rank Math → Titles & Meta → Pages → Robots Meta
```

**What to verify:** Same as 4.1 — `No Index = ON`, `No Follow = ON`

> [!NOTE]
> WordPress "Pages" are the static pages (About, Contact, etc.) hosted on the subdomain — not blog posts. Verify these are also noindex.

---

### 4.3 — Verify noindex on Category Archives

**Navigation path:**

```
Rank Math → Titles & Meta → Categories → Robots Meta
```

**What to verify:** `No Index = ON`

**Current confirmed state (from live audit):**  
`<meta name="robots" content="nofollow, noindex"/>` on `/category/portable-construction/` — ✅ Correct

---

### 4.4 — Verify noindex on Tag Archives

**Navigation path:**

```
Rank Math → Titles & Meta → Tags → Robots Meta
```

**What to verify:** `No Index = ON`

**Current confirmed state (from live audit):**  
`<meta name="robots" content="nofollow, noindex"/>` on `/tag/porta-cabin/` — ✅ Correct

---

### 4.5 — Verify noindex on Search Results

**Navigation path:**

```
Rank Math → Titles & Meta → Search Results → Robots Meta
  (may appear as: Rank Math → Titles & Meta → WP Types → Search Results)
```

**What to verify:** `No Index = ON`

**Current confirmed state (from live audit):**  
`<meta name="robots" content="nofollow, noindex"/>` on `/?s=porta+cabin` — ✅ Correct

---

### 4.6 — Verify noindex on Author Archives

Author archive pages (`/author/[name]/`) were not tested in the original audit. These can expose duplicate content if indexable.

**Navigation path:**

```
Rank Math → Titles & Meta → Author Archives → Robots Meta
```

**What to verify:** `No Index = ON`

> [!IMPORTANT]
> If this setting shows `No Index = OFF` (not confirmed by the audit), turn it ON and save. Author archive pages would otherwise list all posts by an author and be fully indexable — a significant duplicate content exposure.

---

### 4.7 — Verify noindex on Date Archives

Date archive pages (`/2025/09/`, `/2025/`, etc.) were not tested in the original audit.

**Navigation path:**

```
Rank Math → Titles & Meta → Date Archives → Robots Meta
```

**What to verify:** `No Index = ON`

> [!IMPORTANT]
> If this setting shows `No Index = OFF`, turn it ON and save. WordPress date archives list all posts published in a given month/year — fully indexable by default, creating significant duplicate content.

---

### 4.8 — Verify noindex on WordPress Homepage (Blog Index)

**Navigation path:**

```
Rank Math → Titles & Meta → Homepage → Robots Meta
```

**Current confirmed state (from live audit):**  
`<meta name="robots" content="nofollow, noindex"/>` on `https://blog.samanportable.com/` — ✅ Correct

**What to verify:** `No Index = ON`

---

## Rollback Plan

No file system or database structural changes are made by this plan. All changes are WordPress plugin settings stored in the `wp_options` database table under the `rank_math_*` key prefix. Rollback requires only reverting settings to their previous values.

### Rollback Trigger Criteria

Rollback should be triggered if **any** of the following are observed after implementation:

| Symptom | Likely Cause | Severity |
| :--- | :--- | :---: |
| WordPress admin login fails or redirects to a blank page | Site Address (URL) was set incorrectly | 🔴 Critical |
| Next.js site (`www.samanportable.com`) stops loading blog posts | Not caused by these changes (Next.js reads WP REST API, not Site Address) | N/A |
| `/wp-json/` returns 0 results or 403 errors | Not caused by these changes (REST API is independent of Site Address) | N/A |
| Rank Math per-post meta boxes show wrong canonical URLs | Global canonical pattern needs correction | 🟡 Medium |
| Google Search Console reports spike in canonical errors | Expected short-term; wait 48 hours before rollback | 🟡 Medium |

### Rollback Procedure

#### Rollback Step 1 — Revert Site Address (URL)

```
Settings → General → Site Address (URL)
```

Change back to `https://blog.samanportable.com` and click Save Changes.

#### Rollback Step 2 — Clear Canonical URL Pattern for Posts

```
Rank Math → Titles & Meta → Posts → Advanced → Canonical URL
```

Clear the field (make it empty) and click Save Changes. This removes the canonical tag from all posts.

#### Rollback Step 3 — Re-enable Sitemap

```
Rank Math → Sitemap Settings → Enable Sitemap toggle → ON
```

Click Save Changes. The sitemap_index.xml will regenerate within seconds.

#### Rollback Step 4 — Re-add Sitemap to Google Search Console

1. Open Google Search Console → `blog.samanportable.com` property → Sitemaps
2. Submit: `https://blog.samanportable.com/sitemap_index.xml`

#### Rollback Step 5 — Flush Rank Math Cache

```
Rank Math → Status & Tools → Database Tools → Flush Cache
```

---

## Validation Checklist

Run these checks **after completing all four changes**. All curl commands can be run from any terminal.

### V1 — Canonical Tag on Posts

Verify that two live posts now emit the correct canonical tag:

```bash
# Test post 1
curl -s https://blog.samanportable.com/porta-cabins-in-jp-nagar/ \
  | grep -o '<link[^>]*rel="canonical"[^>]*>'

# Expected output:
# <link rel="canonical" href="https://www.samanportable.com/porta-cabins-in-jp-nagar/"/>

# Test post 2
curl -s https://blog.samanportable.com/container-offices-for-sale-in-jp-nagar/ \
  | grep -o '<link[^>]*rel="canonical"[^>]*>'

# Expected output:
# <link rel="canonical" href="https://www.samanportable.com/container-offices-for-sale-in-jp-nagar/"/>
```

✅ **Pass:** canonical href contains `www.samanportable.com`  
❌ **Fail:** canonical tag absent, or contains `blog.samanportable.com`

---

### V2 — Organisation Schema `@id`

Verify the homepage JSON-LD uses `www.samanportable.com` as the organisation `@id`:

```bash
curl -s https://blog.samanportable.com/ \
  | python3 -c "
import sys, json, re
html = sys.stdin.read()
schemas = re.findall(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', html, re.S)
for s in schemas:
    try:
        data = json.loads(s)
        graph = data.get('@graph', [data])
        for node in graph:
            if node.get('@type') == 'Organization':
                print('Organization @id:', node.get('@id'))
                print('Organization url:', node.get('url'))
    except: pass
"

# Expected output:
# Organization @id: https://www.samanportable.com/#organization
# Organization url: https://www.samanportable.com/
```

✅ **Pass:** `@id` contains `www.samanportable.com`  
❌ **Fail:** `@id` still contains `blog.samanportable.com`

---

### V3 — noindex Still Active on Posts

Verify that adding a canonical tag did not accidentally remove the `noindex` directive:

```bash
curl -s https://blog.samanportable.com/porta-cabins-in-jp-nagar/ \
  | grep -o '<meta[^>]*name="robots"[^>]*>'

# Expected output:
# <meta name="robots" content="nofollow, noindex"/>
```

✅ **Pass:** noindex still present  
❌ **Fail:** robots tag absent or changed to `index`

---

### V4 — Sitemap Disabled

Verify the sitemap index returns 404:

```bash
curl -sI https://blog.samanportable.com/sitemap_index.xml | head -3

# Expected output:
# HTTP/2 404

# Also verify robots.txt no longer has Sitemap: directive:
curl -s https://blog.samanportable.com/robots.txt

# Expected output: no line starting with "Sitemap:"
```

✅ **Pass:** `sitemap_index.xml` returns 404; `robots.txt` has no `Sitemap:` line  
❌ **Fail:** sitemap still returns 200; robots.txt still references sitemap

---

### V5 — noindex on Archives (Post-Change)

Verify that category, tag, and search archives remain noindex after all changes:

```bash
# Category archive
curl -s https://blog.samanportable.com/category/portable-construction/ \
  | grep -o '<meta[^>]*name="robots"[^>]*>'
# Expected: <meta name="robots" content="nofollow, noindex"/>

# Tag archive  
curl -s https://blog.samanportable.com/tag/porta-cabin/ \
  | grep -o '<meta[^>]*name="robots"[^>]*>'
# Expected: <meta name="robots" content="nofollow, noindex"/>

# Search results
curl -s "https://blog.samanportable.com/?s=porta+cabin" \
  | grep -o '<meta[^>]*name="robots"[^>]*>'
# Expected: <meta name="robots" content="nofollow, noindex"/>
```

✅ **Pass:** all three return `noindex`  
❌ **Fail:** any one returns `index` without `noindex`

---

### V6 — WordPress REST API Still Functional

Verify the Next.js data source is unaffected by the Site Address change (Change 2.1):

```bash
# This must still return HTTP 200 with JSON data
curl -sI https://blog.samanportable.com/wp-json/wp/v2/posts?per_page=1 \
  | head -3

# Expected output:
# HTTP/2 200
# content-type: application/json; charset=UTF-8

# Also verify the Next.js frontend still loads a blog post
curl -sI https://www.samanportable.com/porta-cabins-in-jp-nagar/ | head -3
# Expected: HTTP/2 200
```

✅ **Pass:** both return `200 OK`  
❌ **Fail:** REST API returns 301 or 403 (Site Address change broke something — rollback 2.1)

---

## Expected SEO Outcomes

After all four changes are implemented and validated:

| Signal | Before | After |
| :--- | :--- | :--- |
| Canonical tag on blog posts | Absent | `https://www.samanportable.com/[slug]/` |
| Organisation schema `@id` | `blog.samanportable.com/#organization` | `www.samanportable.com/#organization` |
| Sitemap active on noindex domain | Yes (8 sub-sitemaps, 870 URLs) | No (404) |
| `Sitemap:` in robots.txt | `Sitemap: https://blog.samanportable.com/sitemap_index.xml` | Removed |
| noindex on posts | ✅ Active | ✅ Still active |
| noindex on categories | ✅ Active | ✅ Still active |
| noindex on tags | ✅ Active | ✅ Still active |
| noindex on search results | ✅ Active | ✅ Still active |
| Google crawl budget waste | ~870 URLs crawled at blog subdomain | Reduced (no sitemap broadcast) |
| Knowledge Graph entity clarity | Two competing `@id` values | One canonical `@id` at `www.` |

> [!NOTE]
> Google will take **2–6 weeks** to process canonical signals for all 870 posts and re-associate crawl equity with `www.samanportable.com`. This is normal. The effects will appear in Google Search Console's Coverage report as a decline in `blog.samanportable.com` crawl activity.
