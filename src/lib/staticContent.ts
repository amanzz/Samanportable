// Static content layer — reads the exported WordPress content from
// src/data/wp-export/ instead of calling the WordPress/WooCommerce API.
//
// SERVER-SIDE ONLY (uses fs). Pages must load this via `await import()` inside
// getServerSideProps/getStaticProps; API routes may import it normally.
//
// Every function mirrors the signature AND return shape of its src/config/api.ts
// counterpart so call sites swap with a one-line change and render identically.
// Content is returned AS-IS from the exported files — no rewriting, no cleanup.
//
// The ONLY WordPress connection left in the system is the scheduled reviews pull
// (scripts/pull-approved-reviews.mjs), which refreshes the files this layer reads.
import fs from 'fs';
import path from 'path';
import {
  parseRankMathHeadHtml,
  type LightweightProduct,
  type WooCommerceProduct,
  type ProductReview,
  type ProductFilters,
  type PaginationInfo,
  type ProductsResponse,
  type RankMathSEOData,
  type ProductCategoryDetail,
  type BlogPost,
} from '@/config/api';

const EXPORT_DIR = path.join(process.cwd(), 'src', 'data', 'wp-export');

// Slugs are lowercase-hyphenated; reject anything else so a crafted URL can
// never read outside the export folders.
const SAFE_SLUG = /^[a-z0-9-]+$/;

function readJson(file: string): any | null {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return null;
  }
}

function emptyPagination(page: number, perPage: number): PaginationInfo {
  return {
    currentPage: page,
    totalPages: 0,
    totalProducts: 0,
    perPage,
    hasNextPage: false,
    hasPrevPage: false,
  };
}

function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.ceil(items.length / perPage);
  return {
    slice: items.slice((page - 1) * perPage, (page - 1) * perPage + perPage),
    pagination: {
      currentPage: page,
      totalPages,
      perPage,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    } as PaginationInfo,
  };
}

function headToSeo(raw: any): RankMathSEOData | null {
  const head = raw?._rank_math_head;
  if (!head || !head.success || !head.head) return null;
  return parseRankMathHeadHtml(head.head);
}

// ─── posts ───────────────────────────────────────────────────────────────────

// Light index (slug + date) built once; full post JSON is read per request.
let postIndex: Array<{ slug: string; date: string }> | null = null;

function getPostIndex(): Array<{ slug: string; date: string }> {
  if (postIndex) return postIndex;
  const dir = path.join(EXPORT_DIR, 'posts');
  const entries: Array<{ slug: string; date: string }> = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const post = readJson(path.join(dir, f));
    if (post?.slug) entries.push({ slug: post.slug, date: post.date || '' });
  }
  // Newest first — same order the WordPress posts API returned.
  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  postIndex = entries;
  return entries;
}

function readPostFile(slug: string): any | null {
  if (!SAFE_SLUG.test(slug)) return null;
  return readJson(path.join(EXPORT_DIR, 'posts', `${slug}.json`));
}

// Mirrors api.fetchBlogPost: post object, or null when it genuinely doesn't exist.
export async function fetchBlogPost(slug: string): Promise<any | null> {
  const post = readPostFile(slug);
  if (!post) return null;
  const { _rank_math_head, ...rest } = post;
  return rest;
}

// Mirrors api.fetchBlogPostRankMathSEO.
export async function fetchBlogPostRankMathSEO(slug: string): Promise<RankMathSEOData | null> {
  return headToSeo(readPostFile(slug));
}

// Mirrors api.fetchBlogPosts (newest first + pagination).
export async function fetchBlogPosts(
  page = 1,
  perPage = 6
): Promise<{ posts: BlogPost[]; pagination: PaginationInfo }> {
  const index = getPostIndex();
  const { slice, pagination } = paginate(index, page, perPage);
  const posts = slice
    .map((entry) => readPostFile(entry.slug))
    .filter(Boolean)
    .map(({ _rank_math_head, ...rest }: any) => rest);
  return {
    posts: posts as BlogPost[],
    pagination: { ...pagination, totalPosts: index.length },
  };
}

export function getAllPostSlugs(): string[] {
  return getPostIndex().map((p) => p.slug);
}

// ─── products ────────────────────────────────────────────────────────────────

let productsCache: any[] | null = null;

function getAllProductsRaw(): any[] {
  if (productsCache) return productsCache;
  const dir = path.join(EXPORT_DIR, 'products');
  const items: any[] = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const p = readJson(path.join(dir, f));
    if (p?.slug) items.push(p);
  }
  // Newest first — WooCommerce's default product list order (orderby=date desc).
  items.sort((a, b) =>
    (a.date_created || '') < (b.date_created || '') ? 1 : (a.date_created || '') > (b.date_created || '') ? -1 : 0
  );
  productsCache = items;
  return items;
}

// Buyer-visible listings only contain published products (the one legit draft is
// excluded from listings; its old URL is already 308-redirected in next.config).
function getPublishedProducts(): any[] {
  return getAllProductsRaw().filter((p) => !p.status || p.status === 'publish');
}

function findProductBySlug(slug: string): any | null {
  if (!SAFE_SLUG.test(slug)) return null;
  return getAllProductsRaw().find((p) => p.slug === slug) || null;
}

// Same field subset that api.fetchProducts requested via _fields.
function toFeedProduct(p: any): WooCommerceProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    regular_price: p.regular_price,
    sale_price: p.sale_price,
    on_sale: p.on_sale,
    images: p.images || [],
    short_description: p.short_description || '',
    stock_status: p.stock_status,
    stock_quantity: p.stock_quantity ?? null,
    average_rating: p.average_rating,
    rating_count: p.rating_count,
    categories: p.categories || [],
    weight: p.weight || '',
    dimensions: p.dimensions || { length: '', width: '', height: '' },
  } as unknown as WooCommerceProduct;
}

function toLightweight(p: any, categoryName?: string, categorySlug?: string): LightweightProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    regular_price: p.regular_price,
    sale_price: p.sale_price,
    on_sale: p.on_sale,
    featured_image: p.images?.[0]?.src || '/placeholder.svg',
    category: categoryName || p.categories?.[0]?.name || 'Uncategorized',
    category_slug: categorySlug || p.categories?.[0]?.slug || 'uncategorized',
    short_description: p.short_description,
    stock_status: p.stock_status,
    average_rating: p.average_rating,
    rating_count: p.rating_count,
    sku: p.sku || '',
  };
}

// Mirrors api.fetchProducts (category/search/price/orderby filters).
export async function fetchProducts(
  page = 1,
  perPage = 12,
  filters: ProductFilters = {}
): Promise<ProductsResponse> {
  let items = getPublishedProducts();

  if (filters.category) {
    const wanted = String(filters.category);
    items = items.filter((p) =>
      (p.categories || []).some((c: any) => c.slug === wanted || String(c.id) === wanted)
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter((p) => (p.name || '').toLowerCase().includes(q));
  }
  if (filters.min_price !== undefined) {
    items = items.filter((p) => parseFloat(p.price || '0') >= filters.min_price!);
  }
  if (filters.max_price !== undefined) {
    items = items.filter((p) => parseFloat(p.price || '0') <= filters.max_price!);
  }
  if (filters.on_sale) {
    items = items.filter((p) => p.on_sale);
  }
  if (filters.stock_status) {
    items = items.filter((p) => p.stock_status === filters.stock_status);
  }
  if (filters.orderby) {
    const dir = filters.order === 'asc' ? 1 : -1;
    const key = filters.orderby;
    items = [...items].sort((a, b) => {
      if (key === 'price') return (parseFloat(a.price || '0') - parseFloat(b.price || '0')) * dir;
      if (key === 'title') return a.name.localeCompare(b.name) * dir;
      if (key === 'rating') return (parseFloat(a.average_rating || '0') - parseFloat(b.average_rating || '0')) * dir;
      // date / popularity → keep date order
      return ((a.date_created || '') < (b.date_created || '') ? -1 : 1) * dir;
    });
  }

  const { slice, pagination } = paginate(items, page, perPage);
  return {
    products: slice.map(toFeedProduct),
    pagination: { ...pagination, totalProducts: items.length },
  };
}

// Mirrors api.fetchLightweightProduct: product or null (genuinely absent → 404 ok).
export async function fetchLightweightProduct(slug: string): Promise<LightweightProduct | null> {
  const p = findProductBySlug(slug);
  return p ? toLightweight(p) : null;
}

// Mirrors api.fetchProductDescription.
export async function fetchProductDescription(
  slug: string
): Promise<{ description: string; images: Array<{ src: string; alt: string }> } | null> {
  const p = findProductBySlug(slug);
  if (!p) return null;
  return { description: p.description || '', images: p.images || [] };
}

// Mirrors api.fetchProductRankMathSEO. Accepts "category/slug" or a bare slug —
// the LAST path segment identifies the product file.
export async function fetchProductRankMathSEO(categorySlug: string): Promise<RankMathSEOData | null> {
  const parts = String(categorySlug).split('/').filter(Boolean);
  const slug = parts[parts.length - 1] || '';
  return headToSeo(findProductBySlug(slug));
}

// Mirrors api.fetchProductReviews: approved-only, latest first, capped, non-fatal.
export async function fetchProductReviews(productId: number, perPage = 5): Promise<ProductReview[]> {
  if (!productId || productId <= 0) return [];
  const file = path.join(EXPORT_DIR, 'reviews', `product-${productId}.json`);
  const reviews = readJson(file);
  if (!Array.isArray(reviews)) return [];
  return reviews
    .filter(
      (r: any) =>
        r &&
        (r.status === 'approved' || r.status === undefined) &&
        typeof r.rating === 'number' &&
        r.rating > 0 &&
        typeof r.review === 'string' &&
        r.review.trim().length > 0
    )
    .sort((a: any, b: any) => ((a.date_created || '') < (b.date_created || '') ? 1 : -1))
    .slice(0, Math.max(1, Math.min(perPage, 10)))
    .map((r: any) => ({
      id: r.id,
      product_id: r.product_id,
      reviewer: (r.reviewer && String(r.reviewer).trim()) || 'Anonymous',
      rating: r.rating,
      review: r.review,
      date_created: r.date_created || '',
      verified: Boolean(r.verified),
      status: r.status,
    }));
}

// ─── categories ──────────────────────────────────────────────────────────────

let categoriesCache: any[] | null = null;

function getAllCategoriesRaw(): any[] {
  if (categoriesCache) return categoriesCache;
  const dir = path.join(EXPORT_DIR, 'categories');
  const items: any[] = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const c = readJson(path.join(dir, f));
    if (c?.slug) items.push(c);
  }
  items.sort((a, b) => a.name.localeCompare(b.name)); // WooCommerce default: name asc
  categoriesCache = items;
  return items;
}

// Mirrors api.fetchProductCategories (_fields=id,name,slug,count).
export async function fetchProductCategories(): Promise<any[]> {
  return getAllCategoriesRaw().map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c.count }));
}

// Mirrors api.fetchProductCategoryBySlug.
export async function fetchProductCategoryBySlug(slug: string): Promise<ProductCategoryDetail | null> {
  if (!SAFE_SLUG.test(slug)) return null;
  const c = getAllCategoriesRaw().find((x) => x.slug === slug);
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    extraDescription: '', // category meta_data is not part of the WC category object
    count: c.count || 0,
    image: c.image || null,
  };
}

// Mirrors api.fetchCategoryRankMathSEO.
export async function fetchCategoryRankMathSEO(categorySlug: string): Promise<RankMathSEOData | null> {
  if (!SAFE_SLUG.test(categorySlug)) return null;
  const c = getAllCategoriesRaw().find((x) => x.slug === categorySlug);
  return headToSeo(c);
}

// Mirrors api.fetchProductAttributes — derived from the exported products
// (only one product carries attributes; the rest are spec-in-description).
export async function fetchProductAttributes(): Promise<any[]> {
  const seen = new Map<string, { id: number; name: string; options: string[] }>();
  for (const p of getPublishedProducts()) {
    for (const a of p.attributes || []) {
      if (!a?.name) continue;
      const cur = seen.get(a.name) || { id: a.id || 0, name: a.name, options: [] };
      cur.options = Array.from(new Set([...cur.options, ...(a.options || [])]));
      seen.set(a.name, cur);
    }
  }
  return Array.from(seen.values());
}

// Mirrors api.fetchLightweightProductsByCategory — including the "unknown
// category → empty result" behavior the live site has today.
export async function fetchLightweightProductsByCategory(
  categorySlug: string,
  page = 1,
  perPage = 20
): Promise<{ products: LightweightProduct[]; pagination: PaginationInfo }> {
  if (!SAFE_SLUG.test(categorySlug)) {
    return { products: [], pagination: emptyPagination(page, perPage) };
  }
  const category = getAllCategoriesRaw().find((c) => c.slug === categorySlug);
  if (!category) {
    return { products: [], pagination: emptyPagination(page, perPage) };
  }
  const items = getPublishedProducts().filter((p) =>
    (p.categories || []).some((c: any) => c.slug === categorySlug)
  );
  const { slice, pagination } = paginate(items, page, perPage);
  return {
    products: slice.map((p) => toLightweight(p, category.name, categorySlug)),
    pagination: { ...pagination, totalProducts: items.length },
  };
}

// Mirrors api.fetchProductsByCategoryPriority (homepage featured slider and
// /product hub). additionalFilters supports the same fields as fetchProducts.
export async function fetchProductsByCategoryPriority(
  page = 1,
  perPage = 8,
  additionalFilters: Omit<ProductFilters, 'category'> = {}
): Promise<ProductsResponse> {
  const categoryPriority = [
    'portable-cabin',
    'container-offices',
    'porta-cabins',
    'labor-colony',
    'portable-office',
    'container-cafe',
    'industrial-sheds',
  ];
  let all: any[] = [];
  for (const categorySlug of categoryPriority) {
    const category = getAllCategoriesRaw().find((c) => c.slug === categorySlug);
    if (!category) continue;
    const inCat = getPublishedProducts()
      .filter((p) => (p.categories || []).some((c: any) => c.slug === categorySlug))
      .slice(0, 20)
      .map((p) => ({
        ...toFeedProduct(p),
        category_slug: categorySlug,
        category_name: category.name,
      }));
    all = [...all, ...inCat];
  }
  if (additionalFilters.search) {
    const q = additionalFilters.search.toLowerCase();
    all = all.filter((p) => (p.name || '').toLowerCase().includes(q));
  }
  if (additionalFilters.min_price !== undefined) {
    all = all.filter((p) => parseFloat(p.price || '0') >= additionalFilters.min_price!);
  }
  if (additionalFilters.max_price !== undefined) {
    all = all.filter((p) => parseFloat(p.price || '0') <= additionalFilters.max_price!);
  }
  if (additionalFilters.on_sale) {
    all = all.filter((p) => p.on_sale);
  }
  if (additionalFilters.stock_status) {
    all = all.filter((p) => p.stock_status === additionalFilters.stock_status);
  }
  const { slice, pagination } = paginate(all, page, perPage);
  return { products: slice as any, pagination: { ...pagination, totalProducts: all.length } };
}

// Mirrors api.fetchRankMathSEO(url) for the few call sites that pass a full URL.
// Only URLs whose head was exported resolve; anything else returns null and the
// caller's existing fallback SEO takes over (e.g. the /product hub page, which is
// not a WordPress entity and has no exported head).
export async function fetchRankMathSEO(url: string): Promise<RankMathSEOData | null> {
  const parts = String(url).replace(/[?#].*$/, '').split('/').filter(Boolean);
  const last = parts[parts.length - 1] || '';
  if (!SAFE_SLUG.test(last)) return null;
  const post = readPostFile(last);
  if (post) return headToSeo(post);
  const product = findProductBySlug(last);
  if (product) return headToSeo(product);
  const category = getAllCategoriesRaw().find((c) => c.slug === last);
  if (category) return headToSeo(category);
  return null;
}

export function getAllProductsForFeed(): WooCommerceProduct[] {
  return getPublishedProducts().map(toFeedProduct);
}
