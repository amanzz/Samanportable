/**
 * SHIKHAR T12 — image optimizer guard.
 *
 * The Next image optimizer resizes/reformats images by fetching them SERVER-SIDE.
 * On 2026-06-12 that server-side fetch of blog.samanportable.com (Hostinger) failed
 * with ECONNRESET in TLSWrap and every blog-hosted image returned 500. The emergency
 * fix was a custom `loaderFile` that returned src untouched — but registering any
 * loaderFile disables /_next/image for EVERY source, so all local /public images lost
 * optimization too (no resize, no srcset, no format negotiation) purely as collateral.
 *
 * T12 restores the built-in optimizer for LOCAL raster images and keeps everything else
 * off it entirely. Two classes bypass the optimizer:
 *
 *  1. REMOTE images (absolute URL). Local images are root-relative ("/hero-image/…");
 *     every remote one is absolute ("https://blog.samanportable.com/…"). Marking these
 *     `unoptimized` means the BROWSER fetches them directly, so the optimizer never
 *     server-fetches Hostinger and the 2026-06-12 outage path is unreachable. T12
 *     hardening additionally removed every remote host from `images.remotePatterns`, so
 *     even a hand-crafted /_next/image?url=<remote> is now rejected (400) by construction.
 *
 *  2. SVG. `dangerouslyAllowSVG` is now false (T12 hardening), so the optimizer refuses
 *     SVG sources. Every SVG — the logo, and the /placeholder.svg fallback used across
 *     product/category cards — must therefore bypass it and render as a plain <img>.
 *
 * Consequence, recorded deliberately: product/hub images are Hostinger-hosted, so they
 * stay unoptimized and gain no LCP benefit here. Unlocking that requires rehosting them
 * locally or behind a CDN (follow-up ticket), NOT pointing the optimizer at Hostinger.
 */
export function isRemoteImageSrc(src: unknown): boolean {
  return typeof src === 'string' && /^(https?:)?\/\//i.test(src.trim());
}

export function isSvgSrc(src: unknown): boolean {
  return typeof src === 'string' && /\.svg(\?|#|$)/i.test(src.trim());
}

/**
 * True for pre-optimized local product photography under /images/products/**.webp.
 *
 * These are the size-set WebP files (~70 KB, already correct dimensions) shipped in
 * /public. Routing them through /_next/image is redundant work: the origin re-encodes an
 * already-optimal WebP on the first request for each (w,q) variant, and Cloudflare does not
 * cache /_next/image (every response is cf-cache-status: MISS), so the first paint of every
 * product/size image pays a multi-second optimizer TTFB. Served directly, the file is a
 * plain /images/**.webp GET — CDN-cacheable by extension (HIT) and fast on first paint.
 *
 * Scope is deliberately narrow: ONLY /images/products/**.webp. Every other local raster
 * keeps the built-in optimizer, exactly per T12.
 *
 * ACCEPTED TRADE-OFF: an unoptimized next/image emits no srcset, so a thumbnail serves the
 * full ~70 KB WebP instead of a resized variant. Outweighed by static-file CDN caching and
 * the removal of the optimizer TTFB. Explicit width/height are kept at every call site so
 * there is no CLS, and the hero stays priority/fetchpriority=high so its preload points at
 * the direct static WebP.
 */
export function isPreOptimizedLocalImage(src: unknown): boolean {
  return typeof src === 'string'
    && src.startsWith('/images/products/')
    && src.endsWith('.webp');
}

/**
 * True when `src` must NOT go through /_next/image: any remote host (the optimizer must
 * never server-fetch one), any SVG (the optimizer rejects SVG with dangerouslyAllowSVG
 * off), or a pre-optimized local product WebP (/images/products/**.webp — redundant to
 * re-optimize; see isPreOptimizedLocalImage). Pass to next/image as
 * `unoptimized={shouldBypassOptimizer(src)}`.
 */
export function shouldBypassOptimizer(src: unknown): boolean {
  return isRemoteImageSrc(src) || isSvgSrc(src) || isPreOptimizedLocalImage(src);
}
