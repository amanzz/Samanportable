import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import QuoteFormPopup from './QuoteFormPopup';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Check, Tag, Star } from 'lucide-react';
import { formatPriceWithCurrency } from '@/lib/utils';
import OptimizedCategoryImage from './OptimizedCategoryImage';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price?: string | number;
    regular_price?: string;
    sale_price?: string;
    on_sale?: boolean;
    featured_image?: string;
    category?: string;
    category_slug?: string;
    stock_status?: string;
    average_rating?: string;
    rating_count?: number;
    categories?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
    images?: Array<{
      src: string;
      alt?: string;
    }>;
  };
  priority?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  priority = false, 
  variant = 'default' 
}) => {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { addItem, isInCart } = useCart();
  const isProductInCart = isInCart(product.id);

  // Get the correct product URL based on WordPress data
  const getProductUrl = () => {
    // If product has categories from WordPress API, use the first category
    if (product.categories && product.categories.length > 0) {
      const category = product.categories[0];
      return `/product/${category.slug}/${product.slug}`;
    }
    
    // For lightweight products, use category from the data
    if (product.category_slug) {
      return `/product/${product.category_slug}/${product.slug}`;
    }
    
    // Fallback
    const fallbackMap: Record<string, string> = {
      '10x10 Porta Cabin': 'porta-cabins/10x10-porta-cabin',
      '20x8 Container Office': 'container-offices/20x8-container-office',
      '30x10 Porta Cabin': 'porta-cabins/30x10-porta-cabin',
      '40x10 Porta Cabin': 'porta-cabins/40x10-porta-cabin'
    };
    
    const fallbackSlug = fallbackMap[product.name];
    if (fallbackSlug) {
      return `/product/${fallbackSlug}`;
    }
    
    // Default fallback
    return `/product/uncategorized/${product.slug}`;
  };

  const productUrl = getProductUrl();

  // Format product data for cart
  const getCartItemData = () => {
    return {
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) || 0 : product.price || 0,
      image: product.featured_image || product.images?.[0]?.src || '/placeholder.svg',
      category: product.categories?.[0]?.name || product.category || 'Uncategorized',
      slug: product.slug,
    };
  };

  // Format price display
  const formatPrice = (price: string | number | undefined) => {
    if (!price) return '₹0';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  // Check if product is on sale
  const isOnSale = product.on_sale || (product.sale_price && product.sale_price !== product.price);
  const currentPrice = product.sale_price || product.price;
  const originalPrice = product.regular_price || product.price;

  // Check stock status
  const isInStock = product.stock_status === 'instock' || !product.stock_status;

  // Get category name
  const categoryName = product.categories?.[0]?.name || product.category || 'Uncategorized';

  // Rating display
  const rating = product.average_rating ? parseFloat(product.average_rating) : 0;
  const ratingCount = product.rating_count || 0;

  const discountPercentage = product.sale_price && originalPrice 
    ? Math.round(((parseFloat(originalPrice as string) - parseFloat(product.sale_price)) / parseFloat(originalPrice as string)) * 100)
    : 0;

  return (
    <>
      <div className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group ${
        variant === 'compact' ? 'max-w-sm' : variant === 'featured' ? 'max-w-md' : ''
      }`}>
        {/* Product Image Container */}
        <div className={`relative overflow-hidden ${
          variant === 'compact' ? 'aspect-square' : 'aspect-[4/3]'
        }`}>
          {/* Loading skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
          )}
          
          {/* Product Image */}
          <OptimizedCategoryImage
            src={product.featured_image || product.images?.[0]?.src || '/placeholder.svg'}
            alt={product.images?.[0]?.alt || product.name}
            className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-500"
            priority={priority}
            width={400}
            height={300}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges removed as requested */}

          {/* Category tag moved into card content */}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Link href={productUrl}>
                <Button size="sm" variant="secondary" className="bg-white text-gray-800 hover:bg-gray-100">
                  Quick View
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <div className={`${variant === 'compact' ? 'p-3' : 'p-4'}`}>
          {/* Category Tag (inside card) */}
          <div className={`${variant === 'compact' ? 'mb-1' : 'mb-2'}`}>
            <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-md">
              {categoryName}
            </span>
          </div>
          {/* Product Title */}
          <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors ${
            variant === 'compact' ? 'text-sm' : 'text-lg'
          }`}>
            {product.name}
          </h3>

          {/* Rating */}
          {rating > 0 && variant !== 'compact' && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                ({ratingCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className={`${variant === 'compact' ? 'mb-2' : 'mb-4'}`}>
            {isOnSale ? (
              <div className="flex items-center gap-2">
                <span className={`font-bold text-red-600 ${
                  variant === 'compact' ? 'text-sm' : 'text-xl'
                }`}>
                  {formatPrice(currentPrice)}
                </span>
                <span className={`text-gray-500 line-through ${
                  variant === 'compact' ? 'text-xs' : 'text-sm'
                }`}>
                  {formatPrice(originalPrice)}
                </span>
                {discountPercentage > 0 && variant !== 'compact' && (
                  <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
            ) : (
              <span className={`font-bold text-gray-900 ${
                variant === 'compact' ? 'text-sm' : 'text-xl'
              }`}>
                {formatPrice(currentPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href={productUrl} className="flex-1">
              <Button 
                variant="outline" 
                className={`w-full border-gray-300 hover:border-emerald-500 hover:text-emerald-600 ${
                  variant === 'compact' ? 'text-xs py-1' : ''
                }`}
              >
                View Details
              </Button>
            </Link>
            
            {isProductInCart ? (
              <Button 
                disabled 
                className={`flex-1 bg-emerald-500 text-white ${
                  variant === 'compact' ? 'text-xs py-1' : ''
                }`}
              >
                <Check className={`${variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
                In Cart
              </Button>
            ) : (
              <Button 
                onClick={() => addItem(getCartItemData())}
                className={`flex-1 bg-emerald-600 hover:bg-emerald-700 text-white ${
                  variant === 'compact' ? 'text-xs py-1' : ''
                }`}
                disabled={!isInStock}
              >
                <ShoppingCart className={`${variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
                Add to Cart
              </Button>
            )}
          </div>

          {/* Quote Button */}
          {variant !== 'compact' && (
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              onClick={() => setIsQuoteFormOpen(true)}
            >
              <Tag className="w-4 h-4 mr-2" />
              Get Quote
            </Button>
          )}
        </div>
      </div>
      
      {/* Quote Form Popup */}
      <QuoteFormPopup
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
        productName={product.name}
      />
    </>
  );
};

export default ProductCard;

