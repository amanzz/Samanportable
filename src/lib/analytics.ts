// Analytics helpers for SAMAN Portable (Next.js frontend) — GTM-WCT5SSR model.
//
// GA4, page_views, and click events are configured INSIDE the GTM-WCT5SSR container
// (loaded in _document.tsx). There is NO direct GA4/gtag in the frontend code.
//
// The only thing code needs to do is push a `contact_form_submit` event to the GTM
// dataLayer on CONFIRMED form success — because the forms submit via background fetch
// (no page reload), which GTM's form-submit trigger cannot reliably detect. A GTM
// Custom Event trigger named `contact_form_submit` then fires the GA4 event tag.
//
// Privacy rules (do NOT change without review):
//  - NEVER push personal data: no names, phone numbers, email addresses, GST numbers,
//    or message/field text. Only safe, non-identifying values (form type, region,
//    coarse page/product type, page path) are allowed.

type DLParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/** Push a GTM dataLayer event safely. Strips empty/undefined params. No-op on server. */
export function pushDataLayer(eventName: string, params: DLParams = {}): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  const clean: DLParams = {};
  for (const key in params) {
    const v = params[key];
    if (v !== undefined && v !== null && v !== '') clean[key] = v;
  }
  window.dataLayer.push({ event: eventName, ...clean });
}

/** Map a pathname to a coarse, non-identifying page/product type. */
export function pageType(path: string): string {
  if (!path) return 'other';
  const p = path.split('?')[0].split('#')[0];
  if (p === '/') return 'home';
  if (p.startsWith('/product-category/')) return 'product_category';
  if (p === '/product') return 'product_listing';
  if (p.startsWith('/product/')) return 'product';
  if (p.startsWith('/container-rent-services')) return 'rental';
  if (['/contact', '/about-us', '/gallery', '/blog', '/cart', '/checkout'].includes(p)) {
    return p.slice(1);
  }
  if (/^\/[^/]+\/?$/.test(p)) return 'blog_or_local';
  return 'other';
}

/** Trim/normalise a categorical value (e.g. product select, region). Never used for free-text inputs. */
export function safeText(s?: string | null, max = 40): string | undefined {
  if (!s) return undefined;
  const t = s.replace(/\s+/g, ' ').trim();
  return t ? t.slice(0, max) : undefined;
}

/** Current pathname (client only), without query/hash. */
export function currentPath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname || '';
}
