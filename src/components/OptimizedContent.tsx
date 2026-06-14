import React from 'react';
import Image from 'next/image';
import parse, { Element, HTMLReactParserOptions } from 'html-react-parser';

interface OptimizedContentProps {
  content: string;
  className?: string;
}

/**
 * Renders HTML content (WordPress product/blog bodies) and swaps <img> tags for
 * Next.js <Image> for lazy-loading + sizing.
 *
 * IMPORTANT — why this uses html-react-parser instead of dangerouslySetInnerHTML:
 * The previous version replaced <img> with placeholder <div>s and then string-SPLIT
 * the HTML on those placeholders, feeding each fragment to its own
 * `dangerouslySetInnerHTML`. WordPress wraps images in `<div class="wp-caption">…</div>`,
 * so the split fell *inside* an open <div>, producing an UNBALANCED fragment (an
 * unclosed <div>). The browser silently re-balances that markup on parse, so the live
 * DOM no longer matched the server-rendered string and React threw
 * "Hydration failed — the initial UI does not match what was rendered on the server"
 * on every product and blog page.
 *
 * Parsing to a real React element tree (no split, no fragment-level
 * dangerouslySetInnerHTML) makes the server and client trees identical, fixing the
 * hydration mismatch. The <Image> wrapper markup is kept identical to the old version
 * so the visible layout is unchanged; the wrapper is a block-level <span> (phrasing
 * content) so it stays valid HTML wherever an <img> legally appeared.
 */
export const OptimizedContent: React.FC<OptimizedContentProps> = ({
  content,
  className = 'prose prose-lg max-w-none',
}) => {
  if (!content) {
    return (
      <div className={className}>
        <p className="text-center text-muted-foreground py-12">No content available.</p>
      </div>
    );
  }

  // Safe string-level cleanups (unchanged from the previous version): strip scripts,
  // styles, link/meta tags, and rewrite blog.samanportable.com links to www. These do
  // not affect HTML balance.
  const cleanContent = content
    .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(
      /href="https:\/\/blog\.samanportable\.com\/([^"]*)"/g,
      'href="https://www.samanportable.com/$1"'
    );

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'img') {
        const a = domNode.attribs || {};
        const src = a.src || '';
        if (!src.trim()) return undefined; // leave malformed/empty <img> as-is

        const alt = a.alt || 'Image';
        const width = a.width ? parseInt(a.width, 10) || 1600 : 1600;
        const height = a.height ? parseInt(a.height, 10) || 1000 : 1000;
        const title = a.title || undefined;

        // Same wrapper markup/classes as the previous version (so layout is unchanged),
        // but a block-level <span> instead of a <div> so it is valid HTML inside any
        // parent an <img> can appear in (e.g. <p>), avoiding any new nesting mismatch.
        return (
          <span className="block relative w-full my-4 sm:my-6 md:my-8 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-6xl mx-auto lg:max-w-5xl md:max-w-4xl sm:max-w-full px-2 sm:px-0">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              title={title}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 95vw, (max-width: 1024px) 90vw, (max-width: 1280px) 85vw, 1600px"
              style={{ width: '100%', height: 'auto', maxWidth: '100%', minHeight: '200px' }}
            />
          </span>
        );
      }
      return undefined;
    },
  };

  return <div className={className}>{parse(cleanContent, options)}</div>;
};

export default OptimizedContent;
