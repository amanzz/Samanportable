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
 * Fix: do NOT split. Rewrite <img> tags in place to styled native <img> (Next.js
 * image optimization is already bypassed site-wide via the custom image loader, so
 * this is functionally equivalent and avoids the /_next/image endpoint), then
 * render the whole, balanced content as a SINGLE dangerouslySetInnerHTML. React
 * treats a single innerHTML block as opaque, so server and client agree and there
 * is no hydration mismatch.
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

    // Rewrite each <img> in place to a balanced, styled native <img>. We keep the
    // original src (image files are served from the blog origin) and a safe set of
    // attributes; we drop fixed width/height/inline-style so images stay responsive.
    cleanContent = cleanContent.replace(
      /<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi,
      (match, _beforeSrc, src) => {
        if (!src || src.trim() === '') return match;
        const altMatch = match.match(/alt="([^"]*?)"/i);
        const alt = altMatch ? altMatch[1] : 'Image';
        const titleMatch = match.match(/title="([^"]*?)"/i);
        const titleAttr = titleMatch ? ` title="${titleMatch[1]}"` : '';
        return (
          '<img src="' + src + '" alt="' + alt + '"' + titleAttr +
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
