import gating from '@/data/seo/unapprovedCommercialGating.json';
import { getCanonicalProductPath } from '@/lib/productCanonicalPaths';

const normalizePath = (value: string): string => {
  const path = value.trim().split(/[?#]/, 1)[0] || '/';
  return path === '/' ? path : `/${path.replace(/^\/+|\/+$/g, '')}`;
};

export const TEMPORARILY_GATED_COMMERCIAL_PATHS = new Set(
  gating.paths.map(normalizePath)
);

export function isTemporarilyGatedCommercialPath(path: string): boolean {
  return TEMPORARILY_GATED_COMMERCIAL_PATHS.has(normalizePath(path));
}

export function isTemporarilyGatedCommercialProduct(product: {
  slug?: string;
  category_slug?: string;
  categories?: Array<{ slug?: string }>;
}): boolean {
  return isTemporarilyGatedCommercialPath(getCanonicalProductPath(product));
}
