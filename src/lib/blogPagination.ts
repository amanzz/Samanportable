/**
 * Single source of truth for blog listing pagination.
 *
 * Every pagination surface on /blog (numbered pages, Previous, Next, Load More,
 * the "N articles available" line, the Go-to-page form and the SSR canonical
 * decisions) must read from ONE model derived from the SAME filtered article
 * collection that is rendered on the page. Deriving `totalPages` anywhere else —
 * or from an unfiltered collection — is what produced links to nonexistent
 * pagination pages (e.g. /blog?category=labor-colony&page=3 from page 2).
 *
 * The model is intentionally data-only so it can be computed in
 * getServerSideProps and serialized into props: the corrected links must exist
 * in the server-rendered HTML, never be patched in by client JavaScript.
 */

export interface BlogPaginationModel {
  /** Number of articles in the ACTIVE filtered collection (post category/tag/search). */
  totalItems: number;
  /** Articles rendered per page. */
  pageSize: number;
  /** The page being rendered. Always >= 1 and, when totalItems > 0, always <= totalPages. */
  currentPage: number;
  /** Math.ceil(totalItems / pageSize). 0 when the filtered collection is empty. */
  totalPages: number;
  /** Zero-based index of the first article on this page (0 when there are none). */
  startIndex: number;
  /** Zero-based EXCLUSIVE index just past the last article on this page. */
  endIndex: number;
  /** Articles that exist after this page. Never negative. */
  remainingItems: number;
  /** True only when currentPage > 1. */
  hasPreviousPage: boolean;
  /** True only when currentPage < totalPages — i.e. page currentPage + 1 holds >= 1 article. */
  hasNextPage: boolean;
}

/**
 * Compute the pagination model from the filtered collection size.
 *
 * `totalItems` MUST be the length of the collection after the active category,
 * tag and search filters have been applied — never the unfiltered total.
 */
export function computeBlogPagination(
  totalItems: number,
  pageSize: number,
  requestedPage: number
): BlogPaginationModel {
  const safeTotalItems = Number.isFinite(totalItems) && totalItems > 0 ? Math.floor(totalItems) : 0;
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 1;
  const totalPages = Math.ceil(safeTotalItems / safePageSize);

  const parsedPage = Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1;
  const currentPage = Math.max(1, parsedPage);

  const startIndex = Math.min((currentPage - 1) * safePageSize, safeTotalItems);
  const endIndex = Math.min(startIndex + safePageSize, safeTotalItems);

  return {
    totalItems: safeTotalItems,
    pageSize: safePageSize,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    remainingItems: Math.max(0, safeTotalItems - endIndex),
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}

/**
 * Query parameters that actually change which articles the listing renders.
 * Only these are carried across pagination links, so tracking/junk parameters
 * are never baked into internal links (which would multiply crawlable variants
 * of the same listing).
 */
export type BlogListingQuery = {
  category?: string | null;
  tag?: string | null;
};

/**
 * Build a pagination href, preserving every active filter parameter.
 *
 * `?page=1` is deliberately omitted so page one keeps a single canonical URL.
 */
export function buildBlogPageHref(pageNumber: number, filters: BlogListingQuery = {}): string {
  const normalizedPage = Math.max(1, Math.floor(Number.isFinite(pageNumber) ? pageNumber : 1));
  const params = new URLSearchParams();

  if (filters.category) params.set('category', filters.category);
  if (filters.tag) params.set('tag', filters.tag);
  if (normalizedPage > 1) params.set('page', String(normalizedPage));

  const queryString = params.toString();
  return queryString ? `/blog?${queryString}` : '/blog';
}

/**
 * Numbered pagination window. Guarantees every returned page number is within
 * 1..totalPages, with no duplicates, so a numbered control can never point past
 * the last real page.
 */
export function buildBlogPageWindow(
  currentPage: number,
  totalPages: number,
  maxVisiblePages = 7
): Array<number | 'gap'> {
  if (totalPages <= 0) return [];
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const numbers = new Set<number>([1, totalPages]);

  if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) numbers.add(i);
  } else if (currentPage >= totalPages - 3) {
    for (let i = totalPages - 4; i <= totalPages; i++) numbers.add(i);
  } else {
    for (let i = currentPage - 1; i <= currentPage + 1; i++) numbers.add(i);
  }

  const sorted = Array.from(numbers)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const out: Array<number | 'gap'> = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) out.push('gap');
    out.push(page);
  });

  return out;
}
