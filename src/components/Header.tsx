import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail, ChevronDown, Building2, Container, User, LogOut, Package, ShoppingCart } from 'lucide-react';
import EnquiryDialog from './EnquiryDialog';
import { useEnquiryDialog } from '@/hooks/useEnquiryDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import LoginModal from '@/components/LoginModal';
import QuoteFormTrigger from './QuoteFormTrigger';
import { cn } from '@/lib/utils';

// Optimized navigation link with prefetching
const NavLink = ({ href, children, className, ...props }: any) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  
  return (
    <Link
      href={href}
      className={cn(
        'relative px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-primary group',
        isActive ? 'text-primary' : 'text-muted-foreground',
        className
      )}
      // Prefetching is now automatic in Next.js 13+
      {...props}
    >
      {children}
      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
      )}
      {/* Hover effect */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary/50 transition-all duration-200 group-hover:w-full" />
    </Link>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const enquiryDialog = useEnquiryDialog();
  const { user, logout } = useAuth();
  const { state: cartState } = useCart();
  const { itemCount } = cartState;

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Products', href: '/product' },
    { name: 'Rental Services', href: '/rental-services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const rentalServicesItems = [
    {
      category: 'Porta Cabin Rentals',
      items: [
        { name: '40×10 Porta Cabin', href: '/container-rent-services/40x10-porta-cabin-rental', icon: Building2 },
        { name: '30×10 Porta Cabin', href: '/container-rent-services/30x10-porta-cabin-rental', icon: Building2 },
        { name: '20×10 Porta Cabin', href: '/container-rent-services/20x10-porta-cabin-rental', icon: Building2 },
        { name: '10×10 Porta Cabin', href: '/container-rent-services/10x10-porta-cabin-rental', icon: Building2 },
      ]
    },
    {
      category: 'Container Office Rentals',
      items: [
        { name: '40×8 Container Office', href: '/container-rent-services/40x8-container-office-rental', icon: Container },
        { name: '30×8 Container Office', href: '/container-rent-services/30x8-container-office-rental', icon: Container },
        { name: '20×8 Container Office', href: '/container-rent-services/20x8-container-office-rental', icon: Container },
        { name: '10×8 Container Office', href: '/container-rent-services/10x8-container-office-rental', icon: Container },
      ]
    }
  ];

  return (
    <>
      {/* Main Header */}
      <header className="bg-white shadow-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center hover:opacity-90 transition-opacity duration-200">
                <Image 
                  src="/saman-logo.svg"
                  alt="SAMAN Portable Logo"
                  width={200}
                  height={100}
                  className="h-12 w-auto object-contain"
                  priority
                  unoptimized
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 justify-center flex-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="flex items-center group">
                  <NavLink
                    href={item.href}
                    className="text-foreground hover:text-primary font-medium transition-colors relative group text-base whitespace-nowrap"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </NavLink>
                  
                  {item.name === 'Rental Services' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 hover:text-primary transition-colors focus:outline-none">
                        <ChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80 bg-white text-gray-900 shadow-lg rounded-md mt-2 z-50 p-2 border border-gray-100">
                        {rentalServicesItems.map((category, categoryIndex) => (
                          <div key={categoryIndex} className="mb-4 last:mb-0">
                            <h3 className="font-semibold text-primary px-3 py-2 text-sm uppercase tracking-wide">
                              {category.category}
                            </h3>
                            <div className="space-y-1">
                              {category.items.map((item, itemIndex) => (
                                <DropdownMenuItem key={itemIndex} className="cursor-pointer p-0 focus:bg-transparent">
                                  <Link 
                                    href={item.href}
                                    className="flex items-center px-3 py-2 hover:bg-primary hover:text-white w-full text-left transition-colors rounded-md group"
                                  >
                                    <item.icon className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-white" />
                                    {item.name}
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-3 mt-3">
                          <Link 
                            href="/rental-services"
                            className="flex items-center px-3 py-2 hover:bg-primary hover:text-white w-full text-left transition-colors rounded-md font-medium"
                          >
                            View All Rental Services
                          </Link>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                      <User className="w-6 h-6 text-gray-700" />
                      <ChevronDown className="w-4 h-4 text-gray-700" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white text-gray-900 shadow-lg rounded-md mt-2 z-50">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <DropdownMenuItem className="cursor-pointer p-0">
                      <Link 
                        href="/my-orders"
                        className="flex items-center px-3 py-2 hover:bg-primary hover:text-white w-full text-left transition-colors rounded-md"
                      >
                        <Package className="w-4 h-4 mr-3 text-muted-foreground" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="cursor-pointer px-3 py-2 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowLoginModal(true)}
                >
                  <User className="w-6 h-6 text-gray-700" />
                </div>
              )}
              
              {/* Cart Icon */}
              <Link href="/cart" className="relative cursor-pointer hover:opacity-80 transition-opacity" aria-label="Shopping Cart">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              <QuoteFormTrigger variant="default" size="lg">
                Get Quote
              </QuoteFormTrigger>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">
              <Link href="/cart" className="relative cursor-pointer hover:opacity-80 transition-opacity" aria-label="Shopping Cart">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                className="p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-white flex-shrink-0">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <Image 
                      src="/saman-logo.svg"
                      alt="SAMAN Portable Logo"
                      width={200}
                      height={100}
                      className="h-8 w-auto object-contain"
                      priority
                      unoptimized
                    />
              </Link>
              <button
                className="p-2"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>
            
            {/* Scrollable menu content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.name}
                      href={item.href}
                      className="block text-foreground hover:text-primary font-medium transition-colors text-base py-2 px-2 rounded-md hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                      {item.name === 'Cart' && itemCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {itemCount}
                        </span>
                      )}
                    </NavLink>
                  ))}
                  
                  {/* Mobile Rental Services */}
                  <div className="border-t pt-3 mt-3">
                    <h3 className="font-semibold text-primary mb-2 text-sm uppercase tracking-wide px-2">
                      Rental Services
                    </h3>
                    {rentalServicesItems.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="mb-3 last:mb-0">
                        <h4 className="font-medium text-gray-700 mb-1 px-2 text-sm">
                          {category.category}
                        </h4>
                        <div className="space-y-1 pl-4">
                          {category.items.map((item, itemIndex) => (
                            <Link
                              key={itemIndex}
                              href={item.href}
                              className="block text-foreground hover:text-primary font-medium transition-colors text-sm py-1 px-2 rounded-md hover:bg-gray-50"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Link
                      href="/rental-services"
                      className="block text-primary hover:text-primary/80 font-medium transition-colors mt-2 px-2 py-2 rounded-md hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View All Rental Services
                    </Link>
                  </div>

                  <div className="pt-3 border-t">
                    {user ? (
                      <div className="space-y-3">
                        <div className="px-3 py-2 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        <Link
                          href="/my-orders"
                          className="block text-foreground hover:text-primary font-medium transition-colors px-3 text-sm py-2 rounded-md hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Package className="w-4 h-4 inline mr-2" />
                          My Orders
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-red-600 hover:text-red-700" 
                          onClick={() => { logout(); setIsMenuOpen(false); }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                    )}
                    <Button variant="default" size="sm" className="w-full mt-3" onClick={() => { enquiryDialog.openDialog(); setIsMenuOpen(false); }}>
                      Get Quote
                    </Button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}
      </header>
      <EnquiryDialog isOpen={enquiryDialog.isOpen} onClose={enquiryDialog.closeDialog} />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default Header;
