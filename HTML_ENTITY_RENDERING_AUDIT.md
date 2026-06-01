# WordPress HTML Entity Rendering Audit Report

**Date:** June 1, 2026  
**Subject:** Audit of Raw WordPress HTML Entities Rendering on Next.js Frontend  
**Status:** Completed  
**Auditor:** Antigravity (Advanced Agentic AI Engineer, Google DeepMind)

---

## 1. Executive Summary & Root Cause Analysis

WordPress REST API encodes all special typographic and punctuation characters (like curly quotes, en dashes, ampersands, ellipses) into standard HTML character entities (such as `&#8217;` for `’` or `&#8211;` for `–`) before returning them in the JSON payload (e.g. `title.rendered` and `excerpt.rendered`).

When Next.js renders these fields in the React frontend:
1. **React JSX Interpolation escaping:** JSX treats strings inside curly braces (like `{post.title.rendered}`) as plain text and automatically escapes characters like `&` to `&amp;` to mitigate cross-site scripting (XSS) attacks. Because of this, the ampersand in the entity `&#8217;` gets escaped, and the browser displays the literal text `Porta Cabins on Rent in India: A 2026 Buyer&#8217;s Guide...` instead of a curly quote.
2. **HTML Tag Attribute limitations:** We cannot use HTML-rendering solutions like `dangerouslySetInnerHTML` for metadata tags (like `<title>` or `<meta name="description" content="..." />`), image alt tags (`alt={post.title.rendered}`), share dialog titles, or breadcrumb spans. These fields require pure, decoded string data.

### Root Cause:
React JSX does not decode HTML entities inside standard string interpolation, and we lack a server-side compatible, browserless entity decoder to cleanly sanitize these titles and excerpts before using them in React code, metadata, or attribute bindings.

---

## 2. Examples of Impacted HTML Entities

The following common WordPress-generated entities are currently displayed as raw text instead of their correct typographic glyphs:

| Entity (Decimal) | Entity (Named) | Intended Glyphs | Context/Meaning |
| :---: | :---: | :---: | :--- |
| `&#8217;` | `&rsquo;` | **’** | Curly apostrophe / single right quote (e.g. `Buyer’s`) |
| `&#8216;` | `&lsquo;` | **‘** | Curly left single quote |
| `&#8220;` | `&ldquo;` | **“** | Left curly double quote |
| `&#8221;` | `&rdquo;` | **”** | Right curly double quote |
| `&#8211;` | `&ndash;` | **–** | En dash (e.g. between sizes/costs) |
| `&#8212;` | `&mdash;` | **—** | Em dash |
| `&amp;` / `&#38;` | `&amp;` | **&** | Ampersand symbol |
| `&quot;` / `&#34;` | `&quot;` | **"** | Double straight quote |
| `&#8230;` | `&hellip;` | **…** | Ellipsis (e.g. at the end of post excerpts) |
| `&nbsp;` / `&#160;` | `&nbsp;` | **[Space]** | Non-breaking space |

---

## 3. Files & Locations Impacted

A comprehensive audit identified **3 files** and **20 distinct locations** where WordPress entity titles and excerpts are rendered raw.

### File 1: `src/pages/[slug].tsx` (Blog Detail Page) — 16 Locations Affected
* **Inside `getServerSideProps` (Metadata Fallbacks):**
  * Lines 85, 102: Fallback `<title>` metadata tag contains undecoded `post.title.rendered`.
  * Lines 86, 103: Fallback description metadata tag contains undecoded `post.excerpt.rendered`.
  * Lines 88, 105: `og:title` Open Graph tag contains undecoded `post.title.rendered`.
  * Lines 89, 106: `og:description` Open Graph description contains undecoded `post.excerpt.rendered`.
  * Lines 92, 109: `twitter:title` tag contains undecoded `post.title.rendered`.
  * Lines 93, 110: `twitter:description` tag contains undecoded `post.excerpt.rendered`.
* **Inside `BlogPostPage` Component:**
  * Line 456, 457: Share button handler details (`title` and `text` for `navigator.share`) contain undecoded titles and excerpts.
  * Line 477, 478: `<UnifiedSEO>` fallback properties use raw titles and excerpts.
  * Line 507: The Breadcrumb span prints raw WordPress entities: `{post.title.rendered}`.
  * Line 525: The main `<h1>` header prints raw entities: `{post.title.rendered}`.
  * Line 571: The featured article `<Image>` alt text uses raw entities: `alt={post.title.rendered}`.

### File 2: `src/pages/blog.tsx` (Blog Listing Page) — 3 Locations Affected
* **Inside `Blog` Component:**
  * Line 290: Blog grid title link prints raw entities: `{post.title.rendered}`.
  * Line 296: Truncated excerpt prints raw entities: `{truncateExcerpt(post.excerpt.rendered)}`.
  * Line 105: The `truncateExcerpt` utility strips HTML tags but fails to decode entity strings.

### File 3: `src/components/BlogImage.tsx` (Blog Image Grid Component) — 1 Location Affected
* **Inside `BlogImage` Component:**
  * Line 19: The `imageAlt` fallback attribute is bound to raw entities: `alt={post.title.rendered}`.

---

## 4. Recommended Fix

To address the issue safely and permanently, we should avoid adding dangerous markup parsers like `dangerouslySetInnerHTML` for titles and metadata. Instead, we recommend creating a robust, server-safe (browserless) decoding helper inside our utility files.

### Step 1: Create a Browserless Decoding Helper
We will add `decodeHtmlEntities` inside `src/lib/utils.ts` (or `src/utils/contentUtils.ts`):

```typescript
/**
 * Browserless utility to decode common HTML character entities (named & numeric) 
 * into standard Unicode characters. Safe for both SSR and client-side execution.
 */
export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  
  const namedEntities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    rsquo: '’',
    lsquo: '‘',
    rdquo: '”',
    ldquo: '“',
    ndash: '–',
    mdash: '—',
    hellip: '…',
    middot: '·',
    nbsp: ' '
  };

  return str.replace(/&(#(?:\d+|x[a-fA-F0-9]+)|[a-zA-Z]+);/g, (match, entity) => {
    if (entity.startsWith('#')) {
      const code = entity.startsWith('#x')
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10);
      return !isNaN(code) ? String.fromCharCode(code) : match;
    }
    return namedEntities[entity.toLowerCase()] || match;
  });
}
```

### Step 2: Apply the Helper across Audited Locations
We will import this helper and wrap the raw WP fields across all affected locations:

* **In `[slug].tsx` (Metadata & Component):**
  ```typescript
  title: decodeHtmlEntities(post.title.rendered)
  description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '')).substring(0, 160)
  ```
  ```tsx
  <h1 className="...">{decodeHtmlEntities(post.title.rendered)}</h1>
  ```
* **In `blog.tsx`:**
  ```tsx
  <Link href={`/${post.slug}`}>{decodeHtmlEntities(post.title.rendered)}</Link>
  ```
  And update `truncateExcerpt` to decode entities:
  ```typescript
  const truncateExcerpt = (excerpt: string, maxLength: number = 150) => {
    const stripped = decodeHtmlEntities(excerpt.replace(/<[^>]*>/g, ''));
    if (stripped.length <= maxLength) return stripped;
    return stripped.substring(0, maxLength) + '…';
  };
  ```
* **In `BlogImage.tsx`:**
  ```typescript
  const imageAlt = hasFeaturedMedia 
    ? decodeHtmlEntities(post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered)
    : decodeHtmlEntities(post.title.rendered);
  ```

This browser-safe solution ensures perfect typography on browser titles, meta descriptions, image alts, breadcrumbs, search engine snippets, and in-page headings with zero impact on rendering performance or XSS security constraints.
