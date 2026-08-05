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

// Byte-exact G1 src/alt pairs from the approved 180-asset C-08 manifest, also
// recorded in each product's 20x8 variant JSON. No replacement alt is authored.
const C08_RELATED_G1_IMAGES: Record<string, { src: string; alt: string }> = {
  'container-houses': {
    src: '/images/products/container-houses/20x8/container-houses-20x8-front-right-hero.webp',
    alt: 'Front-right hero view of a 20x8 ft container house, white steel cladding, on a paved court in a hillside garden',
  },
  'prefab-container-homes': {
    src: '/images/products/prefab-container-homes/20x8/prefab-container-homes-20x8-front-right-hero.webp',
    alt: 'Front-right hero view of a 20x8 ft prefab container home, pale silver-grey cladding, on a clipped formal lawn with a paved grid court',
  },
  'luxury-container-houses': {
    src: '/images/products/luxury-container-houses/20x8/luxury-container-houses-20x8-front-right-hero.webp',
    alt: 'Front-right hero view of a 20x8 ft luxury container house, white cladding with a dark plinth, on red laterite ground among coastal palms',
  },
  'shipping-container-homes': {
    src: '/images/products/shipping-container-homes/20x8/shipping-container-homes-20x8-front-right-hero.webp',
    alt: 'Front-right hero view of a 20x8 ft shipping container home, dark green cladding, on a coastal hillside above the sea',
  },
  'affordable-container-homes': {
    src: '/images/products/affordable-container-homes/20x8/affordable-container-homes-20x8-front-right-hero.webp',
    alt: 'Front-right hero view of a 20x8 ft affordable container home, light grey cladding, on grass at the edge of an orchard',
  },
};

const C08_DELETED_LEGACY_RAIL_IMAGES = new Set([
  '/images/product-heroes/container-houses/container-houses-with-modern-interior-design.webp',
  '/images/product-heroes/container-houses/prefab-container-home-blue-porch-hero-saman.webp',
  '/images/product-heroes/container-houses/luxury-container-house-rear-corner-single-window.webp',
  '/images/product-heroes/container-houses/turquoise-shipping-container-house-view.webp',
  '/images/product-heroes/container-houses/affordable-container-home-with-balcony.webp',
]);

export function resolveC08RelatedImage(product: WooCommerceProduct) {
  const firstImage = product.images?.[0];
  const fallback = C08_RELATED_G1_IMAGES[product.slug];
  if (!fallback || (firstImage?.src && !C08_DELETED_LEGACY_RAIL_IMAGES.has(firstImage.src))) {
    return firstImage;
  }
  return {
    ...(firstImage || { id: 0 }),
    src: fallback.src,
    alt: fallback.alt,
  };
}

/** The C-08 related rail does not render price or short-description copy. Remove
 * those frozen catalog fields from hydration so retired ladders and claims do not
 * survive in the built DOM. The one ruled thumbnail-alt correction uses the
 * page's approved H1 verbatim. */
export function sanitizeC08RelatedProductSummary(product: WooCommerceProduct): WooCommerceProduct {
  const image = resolveC08RelatedImage(product);
  return {
    ...product,
    price: '',
    short_description: '',
    images: image ? [image] : [],
  };
}
