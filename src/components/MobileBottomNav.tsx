import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Home, ShoppingBag, ShoppingCart, X, Package, Menu } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface RelatedProduct {
  id: number;
  title: string;
  slug: string;
  categorySlug: string;
  image: string;
  price: string;
  rating: number;
  category: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  isActive: boolean;
  badge?: number | null;
  onClick?: () => void;
}

interface MobileBottomNavProps {
  relatedProducts?: RelatedProduct[];
}

const MobileBottomNav = ({ relatedProducts = [] }: MobileBottomNavProps) => {
  const router = useRouter();
  const { state: cartState } = useCart();
  const { itemCount } = cartState;
  const [showSidebar, setShowSidebar] = useState(false);
  

  
  // Check if we're on a product details page or product category page
  const isProductDetailsPage = router.asPath.match(/^\/product\/[^\/]+\/[^\/]+$/) !== null;
  const isProductCategoryPage = router.asPath.match(/^\/product\/[^\/]+$/) !== null;
  const shouldShowSidebar = (isProductDetailsPage || isProductCategoryPage) && relatedProducts.length > 0;

  const navItems: NavItem[] = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      isActive: router.pathname === '/'
    },
    {
      name: 'Shop',
      href: '/product',
      icon: ShoppingBag,
      isActive: router.pathname.startsWith('/product')
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: ShoppingCart,
      isActive: router.pathname === '/cart',
      badge: itemCount > 0 ? itemCount : null
    }
  ];

  // Add sidebar button on product details pages and product category pages
  if (shouldShowSidebar) {
    navItems.push({
      name: 'Sidebar',
      href: '#',
      icon: Menu,
      isActive: false,
      badge: relatedProducts.length > 0 ? relatedProducts.length : null,
      onClick: () => setShowSidebar(true)
    });
  }
  
  // Always show sidebar button on product pages, even if no related products
  if ((isProductDetailsPage || isProductCategoryPage) && !shouldShowSidebar) {
    navItems.push({
      name: 'Sidebar',
      href: '#',
      icon: Menu,
      isActive: false,
      badge: null,
      onClick: () => setShowSidebar(true)
    });
  }
  


  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg mobile-bottom-nav">

        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={item.onClick || (() => router.push(item.href))}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all duration-300 relative min-w-0 flex-1 group",
                  item.isActive
                    ? "text-primary bg-primary/10 nav-item-active"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                )}
              >
                <div className="relative">
                  <Icon 
                    className={cn(
                      "w-5 h-5 transition-all duration-300 group-hover:scale-110",
                      item.isActive ? "text-primary" : "text-gray-600"
                    )} 
                  />
                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold cart-badge shadow-lg">
                      {item.badge > 99 ? '99+' : item.badge}
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium mt-0.5 transition-all duration-300 truncate max-w-full",
                  item.isActive ? "text-primary" : "text-gray-600"
                )}>
                  {item.name}
                </span>
                {/* Active indicator */}
                {item.isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
        {/* Safe area for devices with home indicator */}
        <div className="mobile-bottom-nav-safe-area" />
      </div>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Related Products</h3>
                  <p className="text-xs text-gray-500">{relatedProducts.length} products in same category</p>
                </div>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Products List */}
            <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
              {relatedProducts.length > 0 ? (
                <div className="p-4 space-y-3">
                  {relatedProducts.map((product) => (
                    <div key={product.id} className="group">
                      <Link 
                        href={`/product/${product.categorySlug || 'default'}/${product.slug}`}
                        className="block p-3 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-gray-50 transition-all duration-200"
                        onClick={() => setShowSidebar(false)}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Product Image */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <Image 
                              src={product.image || '/placeholder.svg'}
                              alt={product.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                              {product.title}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {product.category}
                              </span>
                              <span className="text-sm font-semibold text-primary">
                                {product.price === 'Contact for pricing' 
                                  ? 'Contact for pricing' 
                                  : `₹${product.price}`
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No related products available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBottomNav;

