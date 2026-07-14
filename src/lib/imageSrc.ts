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
 * T12 restores the built-in optimizer for LOCAL images while guaranteeing the optimizer
 * never server-fetches a remote host again. Every local image is a root-relative path
 * ("/hero-image/…"); every remote one is absolute ("https://blog.samanportable.com/…").
 * So: absolute URL => `unoptimized`, i.e. the browser fetches it directly, exactly as it
 * does today. This covers Hostinger and every other remote host (storage.googleapis.com,
 * gravatar, placeholder hosts) without enumerating them.
 *
 * Consequence, recorded deliberately: product/hub images are Hostinger-hosted, so they
 * stay unoptimized and gain no LCP benefit here. Unlocking that requires rehosting them
 * locally or behind a CDN (follow-up ticket), NOT pointing the optimizer at Hostinger.
 */
export function isRemoteImageSrc(src: unknown): boolean {
  return typeof src === 'string' && /^(https?:)?\/\//i.test(src.trim());
}
