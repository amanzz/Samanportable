# T12 — Mobile CWV (LCP + CLS) Audit — Part A findings

**Date:** 14 Jul 2026 · **Agent:** Claude Code · **Ticket:** SHIKHAR T12 (Track C)
**Branch:** `feat/shikhar-T12-mobile-cwv` off `origin/static-migration` @ `189d60cc`
**Status:** READ-ONLY audit. No source file changed. This audit file is the only artifact.

---

## HEADLINE — two of the packet's premises do not survive measurement

The packet's Part B fix plan is built on two suspected causes. Measured against the **live
production site**, one is wrong and the other is only half right.

| Packet premise | Measured reality | Verdict |
|---|---|---|
| Mobile **CLS ~4.2** on blog article pages, caused by article-body images with no reserved dimensions | **CLS = 0.000** on every page type measured, including the two worst-case posts whose images have *no* width/height at all. Lighthouse reports **zero shifting elements**. | **DOES NOT REPRODUCE** |
| Mobile **LCP ~5.4s** site-wide, caused by the image-optimizer bypass | LCP is genuinely bad (3.6–6.7s). But the bypass only explains it on **homepage / hub / product**, where the LCP element is an image. On **blog + city pages the LCP element is the `<h1>` TEXT**, and LCP == FCP — images are not on that critical path at all. | **HALF RIGHT** |

**Consequence:** the CLS workstream in Part B has no defect to fix, and an image-only fix will
**not** move blog/city LCP — the exact 360 pages the packet is most concerned about. Fix scope
needs to be re-cut before any code is written. See **A4**.

I recommend not writing a single line of the planned CLS fix until Fable 5 rules on this.

---

## A1 — Image architecture

### A1.1 — Is `next/image` used, or raw `<img>`?

Both, split by surface:

| Surface | Renderer | Goes through `next/image`? |
|---|---|---|
| Homepage hero | `HeroSection.tsx` → `next/image` (`fill`, `priority`) | Yes |
| Homepage cards / services | `ServicesSection.tsx`, `PopularSizes.tsx` | Yes |
| Product hub + product pages | `ProductCard.tsx` → `OptimizedCategoryImage`; `product.tsx` → `OptimizedImage`, `OptimizedProductImage` | Yes |
| Blog listing (`/blog`, `/blog/search`) | `BlogImage.tsx` | Yes |
| Blog article **featured image** | `src/pages/[slug].tsx:969` → `next/image` | Yes |
| Blog article **body images** | `OptimizedContent.tsx` → rewritten to **raw `<img>`** | **No — bypasses `next/image` entirely** |
| City pages | same `[slug].tsx` template as blog | mixed (as above) |

Counts: `next/image` imported in **39** files, **58** `<Image>` usages; **32** raw `<img>` in `src/`.

The last row is load-bearing for the fix plan and is easy to miss: **article body images never
touch `next/image`.** `OptimizedContent` rewrites every WordPress `<img>` into a plain native
`<img>` ([OptimizedContent.tsx:65-89](../../src/components/OptimizedContent.tsx#L65-L89)).

### A1.2 — The optimizer bypass: exact config, and precisely why

**[next.config.js:100-163](../../next.config.js#L100-L163)** — the `images` block. The operative lines:

```js
    formats: ['image/webp'],                       // ← INERT
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],// ← INERT
    imageSizes: [16, 32, 48, 64, 96, 128, 256],    // ← INERT
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimize loading performance - ENHANCED
    loader: 'custom',
    loaderFile: './image-loader.js',               // ← THE BYPASS
    unoptimized: process.env.STAGING_GOOGLE_BLOCK === '1'
```

**[image-loader.js](../../image-loader.js)** — the entire file:

```js
// EMERGENCY BYPASS (2026-06-12): production->Hostinger TLS handshakes are
// reset (ECONNRESET in TLSWrap), so the optimizer's server-side fetch of
// blog-hosted images fails and every such image returned 500. Blog images
// are therefore served by their ORIGINAL URL (the browser fetches Hostinger
// directly - the proven goldfish rendering path).
//
// ALL sources pass through untouched, including local /public images:
// configuring a custom loaderFile DISABLES Next's /_next/image endpoint
// (verified live: optimizer URLs 404 once this loader is active), so
// optimizer URLs must not be emitted for any source. Local files in
// /public are served directly by the app (200, verified).
//
// Revert the commits introducing this file to restore full optimization
// once the Hostinger-side block is lifted.
export default function imageLoader({ src }) {
  return src;
}
```

**WHY the optimizer is bypassed.** On 2026-06-12, the Next optimizer's *server-side* fetch of
blog-hosted images (`blog.samanportable.com`, Hostinger) was failing with `ECONNRESET` in
`TLSWrap`, so every blog image 500'd. The chosen fix was a global custom loader.

**What it does instead: nothing.** `return src` is an identity function. It emits the original
URL verbatim.

**The critical architectural consequence** — and the root of the LCP problem — is stated in the
loader's own comment: registering *any* `loaderFile` **disables the `/_next/image` endpoint for
every source**, not just the remote one that was broken. So a fix scoped to a *remote-origin*
problem silently took **all local `/public` images** down with it.

Verified live, today:

```
GET /_next/image?url=%2Fhero-image%2F…-clean.webp&w=640&q=75   → 404   (optimizer is gone)
GET /hero-image/saman-portable-office-cabin-bangalore-clean.webp → 200  image/webp  81,106 B
```

Net effect of the bypass, site-wide:
- **No resizing** — every device downloads the full intrinsic file. A 1600×900 hero goes to a 412px phone.
- **No `srcset`/responsive selection** — `deviceSizes`/`imageSizes` are dead config.
- **No format negotiation** — `formats: ['image/webp']` is dead; a JPEG stays a JPEG.
- **`quality` props are dead** — every `quality={75}` / `quality={70}` in the codebase is a no-op.

### A1.3 — Are images served in modern formats with responsive `srcset`? Three real samples.

**No `srcset` is emitted anywhere on the site.** Format depends purely on what the file already is.

| # | Real URL | Bytes (measured) | Dimensions | Content-Type | Notes |
|---|---|---|---|---|---|
| 1 | `/hero-image/saman-portable-office-cabin-bangalore-clean.webp` | **81,106 B** | **1600×900** | `image/webp` | Homepage LCP element. Already WebP (hand-optimized), but shipped at 1600px to every phone. |
| 2 | `blog.samanportable.com/…/compact-office-solutions-1024x585.jpeg` | **122,731 B** | **1024×585** | `image/jpeg` | Served as JPEG **even when the browser sends `Accept: image/webp`**. No WebP variant exists. |
| 3 | `blog.samanportable.com/…/cost-effective-office-solutions-1024x585.jpeg` | **76,081 B** | **1024×585** | `image/jpeg` | Same. Article-body image on the measured blog page. |

Lighthouse quantifies the waste this creates:

- Blog article: `properly-sized-images` → **271 KiB** of savings available; `modern-image-formats` → **98 KiB**. One single body image weighs **303 KB** (228 KB of it wasted).
- Homepage: `properly-sized-images` → **187 KiB** of savings available. (`modern-image-formats` **passes** — local images are already WebP; they are simply the wrong *size*.)

Local `/public` images are, on the whole, already hand-optimized (229 referenced images, only 5
over 500 KB). The defect is **dimension**, not format. The 2.1 MB PNGs under
`public/homepage/cards/*.png` are **unreferenced leftovers** — the code points at `.webp` siblings.
They are not shipped and are not a CWV issue (though they are dead weight in the repo).

### A1.4 — Two incidental findings worth recording

**`MobileLCPOptimizer.tsx` is dead code.** It is never imported or mounted anywhere. Worth
knowing before anyone "fixes" it: it contains a `document.body.style.fontFamily` swap inside
`document.fonts.ready.then(...)` that *would* reflow the entire document on mobile and would be a
genuine CLS bomb — but it never runs. **Do not resurrect it.** Recommend deleting it in a
cleanup ticket (out of scope for T12).

**`OptimizedImage` / `OptimizedProductImage` gate image paint behind hydration.** Both render the
image at `opacity-0` until React hydrates *and* `onLoad` fires
([OptimizedImage.tsx:80-82](../../src/components/OptimizedImage.tsx#L80-L82)):

```jsx
className={`${className} transition-opacity duration-200 ${
  imageLoaded ? 'opacity-100' : 'opacity-0'
}`}
```

An image that is invisible until JS runs cannot be an early LCP. `OptimizedImage` additionally
**double-fetches** every image (a `new window.Image()` preload in `useEffect` *plus* the real
`<img>`). `OptimizedProductImage` also sets `contentVisibility: 'auto'` on the image, which lets
the browser skip rendering it. These are LCP anti-patterns on the product surface, independent of
the loader bypass.

---

## A2 — LCP, per page type (MEASURED, not inferred)

Method: Lighthouse 12, mobile preset, against **live production**. I report **both** throttling
modes because they disagree in an important way.

### A2.1 — Simulated throttling (Lighthouse default — this is what produced the packet's "5.4s")

| Page | Score | FCP | **LCP** | CLS | TBT | LCP element | LCP phases |
|---|---|---|---|---|---|---|---|
| Homepage | 54 | 1.2s | **5.1s** | **0** | 1060ms | hero `<img>` | TTFB 637 / Load 0 / **Render 4508** |
| Hub `/product/porta-cabins` | 75 | 1.4s | **6.7s** | **0** | 140ms | product `<img>` | TTFB 661 / **Delay 1307 / Load 1010** / Render 3742 |
| Product `luxury-porta-cabin` | 61 | 1.2s | **5.4s** | **0** | 560ms | product `<img>` | TTFB 631 / Load 151 / **Render 4574** |
| City `porta-cabins-in-hebbal` | 83 | 1.2s | **4.5s** | **0** | 100ms | **`<h1>` TEXT** | TTFB 648 / Load 0 / **Render 3867** |
| Blog `20ft-container-office` | 82 | 1.3s | **4.6s** | **0** | 110ms | **`<h1>` TEXT** | TTFB 660 / Load 0 / **Render 3975** |

This reproduces the packet's ~5.4s. But note the blog page's `observedLargestContentfulPaint` is
**806ms** — the *simulated* 4.6s is Lantern's model, not an observed paint. So I re-ran with real
throttling.

### A2.2 — Real throttling (`--throttling-method=devtools`, Slow 4G + 4× CPU) — the trustworthy numbers

| Page | Score | FCP | **LCP** | CLS | LCP element | LCP phases |
|---|---|---|---|---|---|---|
| Homepage | 74 | 3.8s | **3.8s** | **0** | hero `<img>` | TTFB 98 / Delay 637 / **Load 3038** / Render 61 |
| Blog `20ft-container-office` | 67 | 3.7s | **3.7s** | **0** | **`<h1>` TEXT** | TTFB 139 / Load 0 / **Render 3579** |
| Blog `portable-classroom-for-sale-2` | — | 4.0s | **4.0s** | **0** | — | — |
| Blog `18-benefits-of-luxury-portable-cabin` | — | 3.6s | **3.6s** | **0** | — | — |

### A2.3 — Root cause, one line each

- **Homepage — `Load 3038ms` is the whole story.** The LCP *is* the hero image, and it spends **3.0 seconds downloading**. Render delay is only 61ms. The 1600×900 / 81 KB WebP is shipped intact to a 412px viewport because the optimizer is bypassed — no `srcset`, no resize. **This is the image bypass, directly and measurably causing LCP.** A correctly-sized 640px variant (~20–25 KB) would cut this phase by roughly 3–4×.
- **Hub — same cause, worse.** LCP image shows `Load Delay 1307ms` + `Load Time 1010ms`: the image is both *discovered late* and *oversized*. Bypass again.
- **Product — same cause**, plus the `opacity-0`-until-hydrated gate in `OptimizedProductImage` (A1.4) which prevents the image painting before JS runs.
- **Blog article — NOT an image problem. `FCP == LCP == 3.7s`.** The LCP element is the giant `<h1>` (`text-4xl md:text-6xl lg:text-7xl`). It is server-rendered text that paints the instant the page paints at all. There are **zero render-blocking resources**; the blocker is simply *time-to-first-paint* on Slow 4G, with 35 KB CSS and **540 KB of JS across 27 chunks** competing for bandwidth, on a 4×-throttled CPU. Images are not on this critical path. **Optimizing images will not fix blog LCP.**
- **City page — identical to blog** (same `[slug].tsx` template, same text `<h1>` LCP).

---

## A3 — CLS, per page type

### The reported CLS ~4.2 does not reproduce. Anywhere.

| Page | CLS | Shifting elements |
|---|---|---|
| Homepage | **0** | 0 |
| Hub `/product/porta-cabins` | **0** | 0 |
| Product `luxury-porta-cabin` | **0** | 0 |
| City `porta-cabins-in-hebbal` | **0** | 0 |
| Blog `20ft-container-office` | **0** | 0 |
| Blog `portable-classroom-for-sale-2` *(worst case: 10/10 images unsized)* | **0** | **0** |
| Blog `18-benefits-of-luxury-portable-cabin` *(caption-wrapped images)* | **0** | **0** |

### Why the suspected cause was wrong

The packet suspected "article-body images + figcaptions with no reserved dimensions." I counted
every `<img>` in all 360 exported posts:

```
posts scanned:                    360
posts containing <img>:           277
total <img> in article bodies:   1205
  WITH width+height:             1185   (98.3%)
  MISSING width/height:            20   (1.7%)
posts where EVERY img lacks dims:   2
```

**98.3% of article-body images already carry `width` + `height`.** And `OptimizedContent` already
does the right thing with them — it *preserves* the intrinsic dimensions and pairs them with
`w-full h-auto`, which is exactly the aspect-ratio reservation the packet proposed to add
([OptimizedContent.tsx:73-77](../../src/components/OptimizedContent.tsx#L73-L77)):

```js
const widthMatch  = match.match(/\bwidth="(\d+)"/i);
const heightMatch = match.match(/\bheight="(\d+)"/i);
const dimsAttr = (widthMatch && heightMatch)
  ? ` width="${widthMatch[1]}" height="${heightMatch[1]}"`
  : '';
```

It also already marks the first body image `loading="eager" fetchpriority="high"` and lazy-loads
the rest. **The CLS fix described in the packet is, in substance, already implemented.** Someone
did this work already.

To be adversarial about it, I measured the two posts where *every* image lacks dimensions
(`portable-classrooms`, `portable-classroom-for-sale`) — the strongest possible CLS case on the
site. **Still CLS 0, zero shifting elements.**

Yes: the article HTML does come from the WP export as raw `<img>` tags, and `OptimizedContent`
re-emits them as raw `<img>` (never `next/image`). That is true — it just isn't causing CLS.

### One honest caveat

Lighthouse **does not scroll**. It measures shifts in the initial viewport only. The 20 unsized
images sit below the fold, so a real user scrolling down *could* see a shift as they lazy-load in,
and that would count toward field CLS. So field CLS is probably not *exactly* 0 — but it cannot
plausibly be **4.2**, which would mean content jumping by multiple viewport heights.

**Before any CLS work, I'd want to know where 4.2 came from.** Most likely candidates: measured
against a `next dev` build (dev mode shifts constantly and is not representative), or a misread
axis. Recommend pulling CrUX/GSC field CLS to settle it.

---

## A4 — Proposed fix plan

### Recommendation up front: **split the ticket, and drop the CLS half.**

**T12 = LCP-A (images) only. Delete the CLS workstream. Open T13 for LCP-B (critical path).**

---

### ❌ CLS fix — **recommend NOT DOING**

There is no measured defect. The mechanism the packet asked for is already in the code and
already working. Building it again would be motion without movement, and would touch the article
renderer that every one of the 360 blog pages depends on — real regression risk for zero measured
gain.

*Optional micro-fix, if Fable 5 wants closure:* add an aspect-ratio fallback in `OptimizedContent`
for the 1.7% of images with no dimensions.
**Scope:** 1 file, ~5 lines. **Risk:** very low. **Expected CWV gain:** ~0 in lab; small insurance
for scroll-depth field CLS. I would only take this if field data justifies it.

---

### ✅ LCP-A — restore image optimization (**the real, measured win — recommend for T12**)

**Target:** homepage, hub, product, city — every page where the LCP element is an image.
**Measured upside:** homepage LCP `Load` phase = **3038ms**; 187 KiB of resize waste on homepage,
271 KiB on a blog article. Restoring resize + `srcset` should cut the homepage LCP load phase by
roughly 3–4× and is the single highest-leverage change available.

**The key insight that makes this safe.** The bypass was introduced to solve a **remote-origin**
problem (optimizer server-fetch of Hostinger → `ECONNRESET`). But it was applied **globally**, and
that is what broke all the local `/public` images where the measured LCP cost actually lives.
Crucially, **article-body images already bypass `next/image` entirely** (`OptimizedContent` emits
raw `<img>`), so they never needed the loader at all. The only `next/image` consumers of
blog-origin URLs are the blog **featured image** (`[slug].tsx:969`) and `BlogImage` on the listing.

**Approach:**
1. Remove `loader: 'custom'` + `loaderFile: './image-loader.js'` from `next.config.js` → restores `/_next/image` and reactivates the already-correct `formats` / `deviceSizes` config.
2. Keep Hostinger **out of the optimizer's reach** by marking the two blog-origin `next/image` call sites `unoptimized` — so the optimizer never server-fetches Hostinger and the original ECONNRESET cannot recur. Local images get full optimization back.
3. Add correct `sizes` to the LCP images so mobile stops pulling the 1200px+ variant (this is explicitly required by the **MOBILE CWV LAW** in `CLAUDE.md`).
4. Remove the `opacity-0`-until-hydrated gate and the double-fetch in `OptimizedImage` / `OptimizedProductImage` (A1.4) so product images can paint before hydration.

**Files:** `next.config.js`, `image-loader.js` (delete), `src/pages/[slug].tsx` (featured image),
`src/components/BlogImage.tsx`, `OptimizedImage.tsx`, `OptimizedProductImage.tsx`. Contained.

**Risk & what could regress currently-working pages — flagging honestly:**
- **The ECONNRESET could return.** Step 2 is designed so it structurally cannot (Hostinger is never server-fetched). I also re-tested the Hostinger TLS handshake today: **200, verify OK, 37ms connect** — the original blocker appears to have cleared. **But I tested from this machine, not from the production runtime, and that is the environment that actually failed.** This must be re-verified from production before merge. Do not take my laptop's result as sufficient.
- Restoring `/_next/image` puts image transforms back on the server → first-hit latency and CPU cost on cold cache. `minimumCacheTTL` is already 30 days.
- `dangerouslyAllowSVG: true` is already set; re-enabling the optimizer re-activates that path. Worth a look, but it is pre-existing.
- Staging: the `STAGING_GOOGLE_BLOCK` → `unoptimized` escape hatch must keep working.

**Verification (per packet):** before/after mobile LCP + CLS, 5 Lighthouse runs each, on the same
sampled pages, **using `--throttling-method=devtools`** — the simulated default is what made the
original numbers hard to interpret. Control pages must keep CLS 0 and LCP unchanged-or-better.

---

### ⚠️ LCP-B — blog/city text LCP (**recommend SPLITTING OUT — do not attempt in T12**)

On the 360 blog pages + city pages, **LCP is the `<h1>`, and `LCP == FCP`.** No image fix will move
it. The levers are **540 KB of JS across 27 chunks**, 35 KB CSS, and a 4×-throttled CPU — i.e. the
critical rendering path, not images.

This is a different problem, a different risk profile, and a different skillset from an image
ticket. Folding it into T12 would blur a clean, provable image win into an open-ended JS-budget
project. Candidate levers (for a future ticket, not costed here): trim/split the JS bundle, cut
the `<h1>` from `text-7xl`, reduce the 1862-element homepage DOM.

**Blunt note for expectation-setting:** T12's image fix, done perfectly, will likely show **little
or no LCP improvement on blog article pages** — because images are not what's slow there. If the
acceptance criteria expect a blog-page LCP drop from an image fix, they will fail on a correct
implementation. That needs to be settled before Part B starts.

---

## Answers to the packet's acceptance checklist (Part A)

- [x] A1 — image architecture, exact config/loader quotes, why the optimizer is bypassed, 3 real URLs + bytes + dims.
- [x] A2 — LCP element + timing + one-line root cause for homepage, hub, product, blog, city (measured, both throttling modes).
- [x] A3 — CLS per page type; unsized-image count across all 360 posts (20/1205); confirmed article HTML is raw `<img>` from WP export; **CLS 4.2 does not reproduce**.
- [x] A4 — fix plan, split CLS vs LCP, scope + risk + regression flags, split recommendation.

**Nothing in `src/` was modified. No commits made. PAUSED for Fable 5 / owner ruling on scope.**

---
---

# PART B — FIX (executed after Fable 5 ruling, 14 Jul 2026)

**Ruling applied:** CLS workstream dropped. T12 = image-optimizer restoration for local `/public`
images only. Hostinger-origin images stay off the optimizer. Blog/city text-LCP → T13.
`MobileLCPOptimizer.tsx` left untouched → T10.

## Scope amendment discovered during implementation (owner-approved mid-build)

The ruling assumed **two** blog-origin `next/image` call sites. That is wrong: **product and hub
images are Hostinger-hosted too** (19,730 `blog.samanportable.com` image refs across the product/
category data; the hub and product **LCP images themselves** are Hostinger URLs). So the guard had
to cover **every** call site that can receive a remote URL, not two.

Owner ruled: **"Safe now + rehost later"** — do the safe local-only restore in T12, and open a
follow-up to migrate product images off Hostinger, which is what would actually unlock hub/product
LCP.

**Consequence, stated plainly: hub and product LCP cannot improve in T12.** Their LCP images are
remote and therefore `unoptimized` by design. Only the homepage (local hero/cards/certs) benefits.

## What changed

- `next.config.js` — removed `loader: 'custom'` + `loaderFile: './image-loader.js'`. The existing `formats` / `deviceSizes` / `imageSizes` / `quality` config is now live instead of dead.
- `image-loader.js` — **deleted**.
- `src/lib/imageSrc.ts` — **new**. `isRemoteImageSrc(src)`: absolute URL ⇒ remote. Local images are root-relative, so this cleanly separates them without enumerating hosts.
- **37 `next/image` call sites** across 22 files now pass `unoptimized={isRemoteImageSrc(src)}`. Remote ⇒ browser fetches directly (exactly as today). Local ⇒ optimized from disk.
- 3 call sites (`ds/CategoryCard`, 2× `prefab-solutions`) already carried a bare `unoptimized`; left exactly as-is (no behaviour change, out of scope).

`OptimizedContent`'s article-body raw `<img>` were **not touched** and never route through
`next/image` — confirmed unaffected (Gate 4).

## GATE 1 — `/_next/image` returns a correctly-sized WebP for a local image ✅

Production build (`next build && next start`). Source file: 1600×900, 81,106 B WebP.

```
GET /_next/image?url=%2Fhero-image%2Fsaman-portable-office-cabin-bangalore-clean.webp&w=640&q=75
  → 200  Content-Type: image/webp   640x360    19,464 B    (-76%)
GET …&w=1200 → 200  image/webp     1200x675    45,302 B
RAW (what production serves today) 1600x900    81,106 B
```

Genuinely **downsized in pixels**, not merely recompressed. A phone at `w=640` now downloads
**19 KB instead of 81 KB**. (Baseline build, same probe: `/_next/image` → **404** — the bypass.)

## GATE 2 — no remote/Hostinger URL is ever passed to `next/image` without `unoptimized` ✅

Static audit of every `<Image>` in `src/`: **15** local string-literal srcs (no guard needed),
**37** dynamic srcs **all guarded**, **0** unguarded.

Runtime proof against the production build — counting `/_next/image` URLs in the served HTML:

| Page | optimized (local) | **remote URLs in optimizer** | raw Hostinger `<img>` |
|---|---|---|---|
| Homepage | 31 | **0** | 0 |
| Hub | 0 | **0** | 42 |
| Product | 0 | **0** | 44 |
| Blog article | 0 | **0** | 5 |
| City | 0 | **0** | 3 |

**Zero remote URLs reach the optimizer on any page type.** The optimizer can never server-fetch
Hostinger, so the 2026-06-12 ECONNRESET failure mode is structurally unreachable.

## GATE 3 — before/after mobile LCP (5 runs each, production build, Slow 4G + 4× CPU) ⚠️ partial

Median of 5; both builds compiled and served on the same machine.

| Page | metric | BEFORE | AFTER | delta |
|---|---|---|---|---|
| **Homepage** | **LCP image download** | **1701 ms** | **1223 ms** | **−478 ms (−28%)** |
| Homepage | LCP (total) | 3059 ms | 3154 ms | +95 ms (noise) |
| Homepage | CLS | 0.000 | 0.000 | 0 |
| Hub | LCP | 3238 ms | 3290 ms | +52 ms (noise) |
| Hub | CLS | 0.000 | 0.000 | 0 |
| Product | LCP | 3312 ms | 3587 ms | +274 ms (see below) |
| Product | CLS | 0.000 | 0.000 | 0 |

**The image fix works, and the win is unambiguous — but it does not move end-to-end LCP.**

The homepage LCP-image download time is the one metric that isolates this change, and it is a
clean, non-overlapping win across all 5 runs:

```
imgLoad BEFORE: [1701, 1711, 1694, 1717, 1693]
imgLoad AFTER : [1223, 1217, 1247, 1209, 1235]     ← zero overlap, −28%
```

Total LCP did **not** improve, and I am not going to dress that up. Reason: on the homepage
**LCP has become FCP-bound** (LCP ≈ FCP ≈ 3.1s). The hero image now arrives sooner than the page
can paint, so the saving is absorbed by the critical path — **which is exactly the T13 problem**
(540 KB of JS across 27 chunks + 35 KB CSS). The LCP columns above are pure run-to-run noise
(homepage BEFORE spans 2655–3658 ms).

**Expectation to reset:** T12 delivers a real **payload/bandwidth** win (−76% hero bytes, −28%
image download). It does **not** deliver the headline LCP drop, because after this fix LCP is no
longer image-bound anywhere. **T13 is now the binding constraint on every page type.**

**Product +274 ms is NOT a regression.** The LCP element is the same Hostinger `<img>` in all 10
runs, and the product page's image markup is **byte-identical** to live production (Gate 4). The
`Load Time` spikes (`0 → 2289/2346 ms` in 2 of 5 runs) are cold-fetch variance from the live
Hostinger origin over the internet, not an effect of this change.

## GATE 4 — no regression ✅

Rendered `<img>` src sets, live production (= the BEFORE state) vs this production build:

```
hub      : IDENTICAL image srcs (53 imgs)
product  : IDENTICAL image srcs (46 imgs)
blog     : IDENTICAL image srcs ( 7 imgs)
city     : IDENTICAL image srcs ( 5 imgs)
```

- Blog/city pages **unchanged** (byte-identical image markup); article-body raw `<img>` confirmed unaffected.
- **CLS = 0.000 on all 30 Lighthouse runs**, before and after, all three pages.
- **L3 untouched** — diff contains no title/H1/meta/copy/canonical change. Images and the loader only.
- **tsc: 0 errors. `next build`: exit 0.** Zero raw hex added.

## Deploy risk — READ BEFORE DEPLOYING

The original ECONNRESET happened on the **DigitalOcean production runtime**, and that is the
environment that must confirm the fix. Everything above was verified on a local production build
plus the live site; **I could not reproduce the production runtime's network conditions.**

Gate 2 shows the optimizer is never handed a Hostinger URL, so the old failure path should be
unreachable by construction. But after deploy, **spot-check live**:
1. `/_next/image?url=%2Fhero-image%2F…&w=640` → expect **200 image/webp**, not 404/500.
2. A hub/product page → product images still render (they must still be raw Hostinger `<img>`).
3. Homepage hero renders and is served at the phone-sized variant.

Also note: restoring `/_next/image` puts image transforms back on the server (CPU + cold-cache
first-hit latency; `minimumCacheTTL` is 30 days). And `dangerouslyAllowSVG: true` becomes live
again — pre-existing config, but it was inert while the bypass was in place.

## Follow-ups this ticket did not do

- **T13** — blog/city text-LCP / critical path. Now the binding constraint on *every* page type, including the homepage.
- **T14 (new)** — migrate product images off Hostinger into local `/public` or a CDN. This is the only thing that unlocks hub/product LCP; pointing the optimizer at Hostinger would re-arm the outage.
- **T10** — `MobileLCPOptimizer.tsx` is dead code (left untouched per ruling).

