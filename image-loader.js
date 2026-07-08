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
