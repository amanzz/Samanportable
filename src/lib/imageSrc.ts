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
 * True when `src` must NOT go through /_next/image: any remote host (the optimizer must
 * never server-fetch one) or any SVG (the optimizer rejects SVG with dangerouslyAllowSVG
 * off). Pass to next/image as `unoptimized={shouldBypassOptimizer(src)}`.
 */
export function shouldBypassOptimizer(src: unknown): boolean {
  return isRemoteImageSrc(src) || isSvgSrc(src);
}
