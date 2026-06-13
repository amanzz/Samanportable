import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import QuoteFormPopup from './QuoteFormPopup';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Check, Tag, Star, Phone } from 'lucide-react';
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
      <div className={`bg-white rounded-2xl overflow-hidden shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_25px_-5px_rgba(10,61,42,0.1)] transition-all duration-500 border border-gray-100 group ${
        variant === 'compact' ? 'max-w-sm' : variant === 'featured' ? 'max-w-md' : ''
      }`}>
        {/* Product Image Container */}
        <div className={`relative overflow-hidden ${
          variant === 'compact' ? 'aspect-square' : 'aspect-[4/3]'
        }`}>
          {/* Loading skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
          )}
          
          {/* Product Image */}
          <OptimizedCategoryImage
            src={product.featured_image || product.images?.[0]?.src || '/placeholder.svg'}
            alt={product.images?.[0]?.alt || product.name}
            className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
            priority={priority}
            width={400}
            height={300}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
            <Link href={productUrl}>
              <Button size="sm" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 py-2 rounded-xl shadow-xl transition-all">
                View Details
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Content */}
        <div className={`${variant === 'compact' ? 'p-4' : 'p-6'}`}>
          {/* Category Tag (inside card) */}
          <div className={`${variant === 'compact' ? 'mb-2' : 'mb-3'}`}>
            <span className="inline-block bg-[#0A3D2A]/5 text-[#0A3D2A] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-[#0A3D2A]/10">
              {categoryName}
            </span>
          </div>
          {/* Product Title */}
          <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0A3D2A] transition-colors leading-tight ${
            variant === 'compact' ? 'text-base' : 'text-xl'
          }`}>
            {product.name}
          </h3>

          {/* Rating */}
          {rating > 0 && variant !== 'compact' && (
            <div className="flex items-center gap-1.5 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                ({ratingCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className={`${variant === 'compact' ? 'mb-4' : 'mb-6'}`}>
            {isOnSale ? (
              <div className="flex items-center gap-3">
                <span className={`font-black text-[#0A3D2A] ${
                  variant === 'compact' ? 'text-lg' : 'text-2xl'
                }`}>
                  {formatPrice(currentPrice)}
                </span>
                <span className={`text-gray-500 line-through font-medium ${
                  variant === 'compact' ? 'text-xs' : 'text-sm'
                }`}>
                  {formatPrice(originalPrice)}
                </span>
              </div>
            ) : (
              <span className={`font-black text-gray-900 ${
                variant === 'compact' ? 'text-lg' : 'text-2xl'
              }`}>
                {formatPrice(currentPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <Button 
              onClick={() => setIsQuoteFormOpen(true)}
              className={`w-full bg-[#0A3D2A] hover:bg-[#082F20] text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-[#0A3D2A]/10 ${
                variant === 'compact' ? 'text-sm' : ''
              }`}
            >
              <Tag className="w-4 h-4 mr-2" />
              Request Quote
            </Button>
            
            <div className="flex gap-2">
              <Link href={productUrl} className="flex-1">
                <Button 
                  variant="outline" 
                  className={`w-full border-gray-200 text-gray-600 font-bold h-11 rounded-xl hover:bg-gray-50 hover:text-[#0A3D2A] hover:border-[#0A3D2A]/20 transition-all ${
                    variant === 'compact' ? 'text-xs' : 'text-sm'
                  }`}
                >
                  Specs
                </Button>
              </Link>
              
              {/* Cart removed (enquiry-only business): direct Call button instead */}
              <Button
                asChild
                className={`flex-1 border border-[#0A3D2A]/20 bg-transparent text-[#0A3D2A] hover:bg-[#0A3D2A] hover:text-white font-bold h-11 rounded-xl transition-all ${
                  variant === 'compact' ? 'text-xs' : 'text-sm'
                }`}
              >
                <a href="tel:+916200909435">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </a>
              </Button>
            </div>
          </div>
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

