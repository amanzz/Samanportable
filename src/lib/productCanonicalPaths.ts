import customProductCanonicalPaths from './customProductCanonicalPaths.json';

type ProductLike = {
  slug?: string;
  category_slug?: string;
  categories?: Array<{ slug?: string }>;
};

type CustomCanonicalEntry = {
  slug: string;
  categorySlug: string;
  canonicalPath: string;
};

const customCanonicalBySlug = new Map(
  (customProductCanonicalPaths as CustomCanonicalEntry[]).map((entry) => [entry.slug, entry.canonicalPath])
);

export function getCustomProductCanonicalPath(slug: string | undefined | null): string | null {
  if (!slug) return null;
  return customCanonicalBySlug.get(slug) || null;
}

export function getCanonicalProductPath(product: ProductLike): string {
  const slug = product.slug || '';
  const customPath = getCustomProductCanonicalPath(slug);
  if (customPath) return customPath;

  const categorySlug = product.category_slug || product.categories?.[0]?.slug || 'uncategorized';
  return slug === categorySlug ? `/product/${categorySlug}` : `/product/${categorySlug}/${slug}`;
}
