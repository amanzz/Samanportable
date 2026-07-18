import React, { useMemo } from 'react';

interface OptimizedContentProps {
  content: string;
  className?: string;
}

/**
 * Renders WordPress HTML content.
 *
 * IMPORTANT (hydration): the previous implementation replaced each <img> with a
 * placeholder, split the HTML string on those placeholders, and rendered every
 * fragment in its OWN dangerouslySetInnerHTML <div>. WordPress wraps images in
 * caption <div>s (e.g. <div class="wp-caption"><img>…<p>caption</p></div>), so the
 * split cut THROUGH those containers and produced unbalanced fragments — an
 * unclosed <div> in one part and a stray </div> in the next. The browser
 * auto-corrects the server-rendered HTML one way while React rebuilds it another
 * way on the client, which threw "Hydration failed / dangerouslySetInnerHTML did
 * not match" on every product page.
 *
 * Fix: do NOT split. Rewrite <img> tags in place to styled native <img>, then
 * render the whole, balanced content as a SINGLE dangerouslySetInnerHTML. React
 * treats a single innerHTML block as opaque, so server and client agree and there
 * is no hydration mismatch.
 *
 * NOTE (T30): an earlier version of this comment said image optimization was
 * "bypassed site-wide via the custom image loader". That is no longer true — T12
 * removed the custom loaderFile and restored the built-in /_next/image optimizer
 * (see next.config.js). Same-origin content images are therefore optimized here;
 * remote (blog-hosted) ones still cannot be, because remotePatterns is empty by
 * design. See the per-image rules below.
 */
export const OptimizedContent: React.FC<OptimizedContentProps> = ({
  content,
  className = 'prose prose-lg max-w-none',
}) => {
  const processedContent = useMemo(() => {
    if (!content) return '';

    // Strip scripts / styles / link / meta that should never render in the body.
    let cleanContent = content
      .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<meta[^>]*>/gi, '');

    // Rewrite internal blog links from blog.samanportable.com to www.samanportable.com,
    // EXCEPT media asset links under /wp-content/ (uploads). The static www site does not
    // host /wp-content/, so rewriting a click-to-enlarge <a href="blog…/wp-content/…jpg">
    // to www would 404 (Semrush "internal images are broken"). Those media links must stay
    // on the blog origin that actually serves the files. Normal article/page links
    // (e.g. blog…/some-post/) still rewrite to www. The negative lookahead skips wp-content.
    cleanContent = cleanContent.replace(
      /href="https:\/\/blog\.samanportable\.com\/((?!wp-content\/)[^"]*)"/g,
      'href="https://www.samanportable.com/$1"'
    );

    // Rewrite each <img> in place to a balanced, styled native <img>. We keep a safe
    // set of attributes. CWV rules applied here (T30 / T24.1-IMG §5.2):
    //   1. PRESERVE width/height when the source <img> carries them. The display
    //      size is still controlled by `w-full h-auto`; the intrinsic dimensions
    //      only let the browser reserve aspect-ratio space and avoid layout shift
    //      (CLS). Images with no dimensions behave exactly as before.
    //   2. EVERY content image is lazy. The previous rule gave the FIRST content
    //      image `loading="eager" fetchpriority="high"` on the assumption it was the
    //      LCP candidate. On these templates it never is: the real hero (gallery /
    //      featured image) sits ABOVE the content, so this only ever created a
    //      SECOND high-priority image — measured off-screen on both viewports and
    //      competing with the true LCP hero for bandwidth (86 KB /gbp-posts on
    //      /product/porta-cabins, 110 KB blog-hosted on /product/container-offices).
    //      CLAUDE.md MOBILE CWV LAW: priority + fetchpriority=high on the FIRST HERO
    //      ONLY. Nothing here is the first hero, so nothing here is prioritised.
    //   3. Same-origin /gbp-posts/* images are routed through the /_next/image
    //      optimizer, sized to their rendered box (they render ~326 px wide on
    //      mobile, ~720 px on desktop, but shipped the raw 1200 px file). REMOTE
    //      (blog-hosted) images are deliberately NOT rewritten: `remotePatterns` is
    //      intentionally empty (next.config.js T12 hardening) so the optimizer would
    //      reject them with 400 — that is the outage path T12 closed. They stay raw
    //      and simply become lazy, which is where their cost actually was.
    // Full-width (1200) re-encode at q=75. Deliberately a SINGLE src with NO
    // srcset/sizes: adding a `sizes` attribute here changed the images' RENDERED
    // geometry (measured 1067x600 -> 720x405 at a 1024 viewport, i.e. a 1731px
    // shorter page) because the browser used it for intrinsic sizing. Layout must
    // be byte-identical to before, so we keep the original intrinsic dimensions
    // (1200x675) and let the existing `w-full h-auto` CSS govern size exactly as
    // it did. The saving therefore comes purely from the q=75 WebP re-encode
    // (86,828 -> 72,921 bytes, -16%) plus the eager/fetchpriority removal above.
    const GBP_LOCAL_RE = /^(?:https?:\/\/(?:www\.)?samanportable\.com)?(\/gbp-posts\/[^"?#]+)$/i;
    const optimized = (localPath: string) =>
      `/_next/image?url=${encodeURIComponent(localPath)}&amp;w=1200&amp;q=75`;

    cleanContent = cleanContent.replace(
      /<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi,
      (match, _beforeSrc, src) => {
        if (!src || src.trim() === '') return match;
        const altMatch = match.match(/alt="([^"]*?)"/i);
        const alt = altMatch ? altMatch[1] : 'Image';
        const titleMatch = match.match(/title="([^"]*?)"/i);
        const titleAttr = titleMatch ? ` title="${titleMatch[1]}"` : '';
        const widthMatch = match.match(/\bwidth="(\d+)"/i);
        const heightMatch = match.match(/\bheight="(\d+)"/i);
        const dimsAttr = (widthMatch && heightMatch)
          ? ` width="${widthMatch[1]}" height="${heightMatch[1]}"`
          : '';

        // Route same-origin /gbp-posts assets through the image optimizer.
        const gbp = src.match(GBP_LOCAL_RE);
        const srcAttr = gbp ? ` src="${optimized(gbp[1])}"` : ` src="${src}"`;

        return (
          '<img' + srcAttr + ' alt="' + alt + '"' + titleAttr + dimsAttr +
          ' loading="lazy" decoding="async"' +
          ' class="optimized-content-img w-full h-auto rounded-lg shadow-lg my-6 mx-auto" />'
        );
      }
    );

    return cleanContent;
  }, [content]);

  if (!content) {
    return (
      <div className={className}>
        <p className="text-center text-muted-foreground py-12">No content available.</p>
      </div>
    );
  }

  // Single opaque innerHTML — no string splitting, no per-fragment divs, no
  // hydration mismatch.
  return <div className={className} dangerouslySetInnerHTML={{ __html: processedContent }} />;
};

export default OptimizedContent;
