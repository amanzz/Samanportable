// EMERGENCY BYPASS (2026-06-12): production->Hostinger TLS handshakes are
// reset (ECONNRESET in TLSWrap), so the optimizer's server-side fetch of
// blog-hosted images fails and every such image returns 500. Blog images
// are therefore served by their ORIGINAL URL (the browser fetches Hostinger
// directly - the proven goldfish rendering path). All other sources keep
// the default optimizer URL, byte-identical format. Revert this commit to
// restore full optimization once the Hostinger-side block is lifted.
export default function imageLoader({ src, width, quality }) {
  if (src.startsWith('https://blog.samanportable.com/')) {
    return src;
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
