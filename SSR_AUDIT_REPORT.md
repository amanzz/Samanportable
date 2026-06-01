# Next.js SSR Crawlability & SEO Audit Report

**Date:** June 1, 2026  
**Client:** SAMAN Portable  
**Status:** Complete  
**Auditor:** Antigravity (Advanced Agentic AI Engineer, Google DeepMind)

---

## Executive Summary

A full crawlability and Search Engine Optimization (SEO) audit has been performed on the Next.js (Pages Router) codebase of the SAMAN Portable web application. The audit focused on verifying whether key page content, headings, internal links, schemas, and FAQ sections are fully present in the raw server-rendered HTML source code before client-side JavaScript hydration.

### Key Finding
While core landing pages (Homepage, About, Contact, Product Hub, Category Hubs) are successfully rendered server-side and offer excellent search engine visibility, there are **two critical SSR crawlability issues** that directly impact organic rankings:

1. **Blog Detail Pages (`src/pages/[slug].tsx`)**: The entire post body content, categories list, and share modules are wrapped inside client-only rendering blocks (`{isClient && ...}`). As a result, **crawlers see a completely empty body** in the initial server response. This is a severe threat to organic search discovery.
2. **Product Detail & Hub Pages (`src/pages/product/[category]/[slug].tsx` and `/index.tsx`)**: The main description, technical specs, features, and visual FAQs are housed inside the `ProductTabs` component, which is imported dynamically with `ssr: false`. Because of this, **Googlebot sees only an empty skeleton placeholder** instead of rich product descriptions. Additionally, this creates a high risk of search penalties because the FAQ schema is fully visible in the `<head>` but the corresponding visual text content is hidden from the DOM.

---

## 1. SSR Crawlability Status Matrix

The following table summarizes the crawlability of key pages based on a direct inspection of their raw server-side rendered (SSR) outputs:

| Page Type | Route File | H1 in Source | Body Content in Source | Internal Links in Source | FAQ Content in Source | Schema in Source | SSR Crawlability Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Homepage** | `src/pages/index.tsx` | **YES** | **YES** | **YES** | **YES** | **YES** | 🟢 **Excellent** (Fully SSR pre-rendered) |
| **About Us** | `src/pages/about-us.tsx` | **YES** | **YES** | **YES** | N/A | **YES** | 🟢 **Excellent** (Fully SSR pre-rendered) |
| **Contact** | `src/pages/contact.tsx` | **YES** | **YES** | **YES** | **YES** | **YES** | 🟢 **Excellent** (Fully SSR pre-rendered) |
| **Product Hub** | `src/pages/product.tsx` | **YES** | **YES** | **YES** | N/A | **YES** | 🟢 **Excellent** (Fully SSR pre-rendered) |
| **Category Pages** | `src/pages/product-category/[slug].tsx` | **YES** | **YES** | **YES** | N/A | **YES** | 🟢 **Excellent** (Fully SSR pre-rendered) |
| **Rental Hub** | `src/pages/rental-services.tsx` | **YES** | **YES** | **YES** | N/A | **YES** | 🟢 **Excellent** (Fully SSR pre-rendered) |
| **Rental Details** | `src/pages/container-rent-services/[slug].tsx` | **YES** | **YES** | **YES** | N/A | **YES** | 🟢 **Excellent** (Fully SSR pre-rendered) |
| **Blog Listing** | `src/pages/blog.tsx` | **YES** | **YES** | **YES** | N/A | **YES** | 🟢 **Excellent** (Fully SSR pre-rendered) |
| **Blog Details** | `src/pages/[slug].tsx` | **YES** | ❌ **NO** | ❌ **NO** | N/A | **YES** | 🔴 **CRITICAL** (Main body content invisible) |
| **Product Details** | `src/pages/product/[category]/[slug].tsx` | **YES** | ⚠️ **PARTIAL** | ⚠️ **PARTIAL** | ❌ **NO** | **YES** | 🟡 **HIGH CONCERN** (Descriptions & Specs invisible) |
| **Product Cat Hub**| `src/pages/product/[category]/index.tsx` | **YES** | ⚠️ **PARTIAL** | ⚠️ **PARTIAL** | ❌ **NO** | **YES** | 🟡 **HIGH CONCERN** (Descriptions & Specs invisible) |

---

## 2. Hydration & Client-Side Rendering Violations

Below is the identification of components and patterns causing critical SEO-rich content to appear only after client-side hydration:

### A. Dynamic Imports disabling SSR (`ssr: false`)
To improve initial load metrics (LCP/TBT), several heavy components were deferred to the client side. However, this has inadvertently stripped core search content:
* **`ProductTabs` (`ssr: false`)**: 
  * *Files impacted:* `src/pages/product/[category]/[slug].tsx` (Line 38) and `src/pages/product/[category]/index.tsx` (Line 44).
  * *SEO Impact:* Disables SSR for the entire product description tab, detailed specifications table, custom highlights list, and visual product FAQs.
* **`QuoteForm` (`ssr: false`)**:
  * *Files impacted:* `src/components/HeroSection.tsx` (Line 10).
  * *SEO Impact:* Acceptable. Contact forms are interactive elements and do not require indexing.

### B. Client-Only Wrapper Guards (`{isClient && ...}`)
* **Blog Post Detail Page (`src/pages/[slug].tsx` - Line 608)**:
  * *Code:* `{isClient && (<div className="mb-10"><OptimizedContent content={post.content.rendered} ... /></div>)}`
  * *SEO Impact:* The entire body content (the core value proposition for search engines crawling blog posts) is completely hidden behind the client-side `isClient` guard. Googlebot gets a response of `0 bytes` for the article's text, which severely penalizes crawlability.
* **Blog Post Categories (`src/pages/[slug].tsx` - Line 585)**:
  * *Code:* `{isClient && post._embedded?.['wp:term']?.[0] && ...}`
  * *SEO Impact:* Internal category linking tags are hidden from bots in the initial render, cutting off internal link juice propagation.

### C. Client-Side Data Fetching (`fetch` inside `useEffect`)
* **Category Dropdown Menu (`src/components/CategoryMenu.tsx`)**:
  * *Code:* `fetch('/api/categories')` inside `useEffect` (Line 38).
  * *SEO Impact:* The dynamic dropdown list of "All Product Categories" is loaded client-side. The initial HTML displays `"Loading categories..."`.
  * *Mitigation:* This has **low negative impact** because the header menu statically maps and renders the 14 core landing page links (`mainCategories`) into the initial HTML structure. The crawlers can still find the page paths.

---

## 3. Crawler Visibility Assessment (What Google Can See)

Googlebot and other modern search spiders (Bing, DuckDuckGo) execute a two-pass crawling mechanism. First, they analyze the fast, raw server-rendered HTML. Later, when rendering resources become available, they execute the JavaScript. If your content is client-only, Google is forced to wait for the rendering pass, delaying indexing and significantly weakening rankings.

Here is the exact assessment of what search crawlers can currently see:

### 🟢 Fully Visible to Spiders:
* **Hero Titles and H1 Elements:** All pages correctly output their primary `H1` tags in the initial SSR response.
* **Metadata & Canonicals:** Head tags, page descriptions, open graph cards, and canonical tags are fully pre-rendered through the `<UnifiedSEO />` utility.
* **Core Schemas:** Structured JSON-LD data for the `WebSite`, `FAQPage`, and `Organization` are pre-rendered correctly. 
* **Global Navigation Links:** Standard header lists and static category routes are present as `Link` anchors in the raw HTML.
* **Footer Links:** Popular keyword resources, company links, and branch addresses are pre-rendered statically and carry strong internal link weight.
* **Homepage FAQ Content:** The static homepage FAQs are fully pre-rendered and crawlable.

### 🔴 Invisible to Spiders in Initial Pass:
* **Individual Blog Content:** 100% of the blog article body content is invisible during the initial crawler pass.
* **Detailed Product Descriptions:** The detailed rich-text description pulled from WordPress is invisible.
* **Product Technical Specifications:** The specification tables detailing dimensions, material weight, and insulation grades are invisible.
* **Product-Specific Visual FAQs:** While the JSON-LD FAQ schema *is* injected in the `<head>` server-side, the visual text content is hidden within the `ProductTabs` component. 
  
  > [!WARNING]
  > **Google Policy Mismatch Risk:** Injected FAQ schema in the `<head>` must match visual text content in the DOM. Having FAQ schema in the header when the page is blank of visual FAQ text during crawling is flagged as **mismatched structured data**, which can lead to manual actions or search penalty flags.

---

## 4. Architectural Fix Plan

To fix these issues, we recommend implementing the following targeted architectural changes (do **not** apply them yet, as per client instructions):

### Fix 1: Restore Server-Rendering for Blog Post Body
In `src/pages/[slug].tsx`, remove the `{isClient && ...}` guard wrapping `<OptimizedContent />` and the categories list. `OptimizedContent` is fully compatible with server-side rendering because it does not use browser-only APIs.

### Fix 2: Enable SSR for ProductTabs or Extract Description
In `src/pages/product/[category]/[slug].tsx` and `/index.tsx`, change `ProductTabs` to be imported statically, or toggle `ssr: true` in the dynamic import. 
```tsx
const ProductTabs = dynamic(() => import('../../../components/ProductTabs'), {
  ssr: true // Enable server-side rendering
});
```
If hydration mismatch warning occurs due to differences in WordPress-formatted HTML and React hydration output, we should wrap the description rendering with a lightweight utility or utilize `suppressHydrationWarning` on specific tags, rather than completely turning off SSR for the entire component.

---

**Report Delivered successfully. Waiting for developer review and confirmation before proceeding with implementation of fixes.**
