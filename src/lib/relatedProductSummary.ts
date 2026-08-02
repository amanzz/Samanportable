import type { WooCommerceProduct } from '@/config/api';
import { cleanText } from '@/lib/merchantFeed';

/**
 * Keep only the fields rendered by product-page related rails/cards.
 *
 * WooCommerce exports can carry multi-kilobyte descriptions on every related
 * product. Serializing those unused fields into __NEXT_DATA__ duplicates catalog
 * content in the initial HTML and materially inflates every product page.
 */
export function toRelatedProductSummary(product: WooCommerceProduct): WooCommerceProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    short_description: cleanText(product.short_description || product.description || '', 130),
    average_rating: product.average_rating,
    rating_count: product.rating_count,
    categories: (product.categories || []).slice(0, 1).map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    })),
    images: product.images && product.images.length > 0
      ? [{
          id: product.images[0].id,
          src: product.images[0].src,
          alt: product.images[0].alt,
        }]
      : [],
  } as WooCommerceProduct;
}
