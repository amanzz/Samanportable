import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchLightweightProductsByCategory, shouldShowDraftsInListings } from '@/lib/staticContent';

// Server-side proxy for the product-category page's CLIENT-SIDE pagination/filter
// fetches. The browser must NOT call WooCommerce directly — that previously dragged
// the WooCommerce consumer key/secret (referenced by the fetch helpers) into the
// client bundle. The browser now calls this same-origin route; the WooCommerce key
// stays server-side (env) and is never sent to or exposed in the browser.
//
// Returns only public product/pagination data — no credentials, no key values.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slug = typeof req.query.slug === 'string' ? req.query.slug.trim() : '';
  if (!slug) {
    return res.status(400).json({ error: 'Missing category slug' });
  }

  const pageNum = parseInt(String(req.query.page ?? '1'), 10);
  const perPageNum = parseInt(String(req.query.perPage ?? '20'), 10);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
  const perPage = Number.isFinite(perPageNum) && perPageNum > 0 ? Math.min(perPageNum, 50) : 20;

  try {
    const result = await fetchLightweightProductsByCategory(slug, page, perPage, {
      includeDrafts: shouldShowDraftsInListings(req.headers.host),
    });
    // This route feeds ONLY the category archive's client-side pagination, and a
    // category archive publishes no price (Fable 5 ruling, 03 Aug 2026). The price
    // fields and the price-carrying short_description are dropped so paging to page 2
    // cannot reintroduce a number the server-rendered page deliberately omits.
    const products = result.products.map((product) => {
      const {
        price,
        regular_price,
        sale_price,
        price_html,
        on_sale,
        priceDisplay,
        priceSubline,
        short_description,
        ...rest
      } = product as typeof product & {
        price_html?: string;
        priceDisplay?: string;
        priceSubline?: string;
      };
      return rest;
    });
    // Short cache; this is public catalog data.
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ ...result, products });
  } catch (error) {
    // Never leak internals/keys; log message only (helper already avoids logging URLs).
    console.error('products-by-category route failed:', error instanceof Error ? error.message : 'unknown error');
    return res.status(502).json({ error: 'Failed to fetch products' });
  }
}
