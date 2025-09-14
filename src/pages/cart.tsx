import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, CreditCard, Shield, LogIn, Package } from 'lucide-react';
import { formatPriceWithCurrency } from '@/lib/utils';

const Cart = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { items, total, itemCount } = state;

  const tax = total * 0.18; // 18% GST
  const shipping = total > 100000 ? 0 : 5000; // Free shipping above 1L
  const grandTotal = total + tax + shipping;

  const applyCoupon = () => {
    // In a real implementation, this would apply a coupon code
  };

  return (
    <Layout>
      <Head>
        <title>Shopping Cart - Saman Portable Office Solutions</title>
        <meta name="description" content="Review your cart items and proceed to checkout for portable office solutions." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen pb-16">
        <main>
          <div className="max-w-7xl mx-auto container-padding">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8 pt-6">
              <Link href="/" className="hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/50">
                Home
              </Link>
              <span className="text-muted-foreground/60">/</span>
              <span className="text-foreground font-medium px-2 py-1 bg-muted/30 rounded">Shopping Cart</span>
            </div>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Shopping Cart
              </h1>
              <p className="text-muted-foreground">
                Review your items and proceed to checkout
              </p>
            </div>

            {items.length === 0 ? (
              /* Empty Cart */
              <div className="text-center py-16">
                <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Looks like you haven&apos;t added any portable office solutions to your cart yet.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/product">
                      Browse Products
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              /* Cart Content */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-lg shadow-card">
                    <div className="p-6 border-b border-border">
                      <h2 className="text-xl font-semibold text-foreground">
                        Cart Items ({items.length})
                      </h2>
                    </div>
                    
                    <div className="divide-y divide-border">
                      {items.map((item) => (
                        <div key={item.id} className="p-6">
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {item.image && item.image !== '/placeholder.svg' ? (
                                <Image 
                                  src={item.image} 
                                  alt={item.name}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://via.placeholder.com/96x96/3B82F6/FFFFFF?text=${encodeURIComponent(item.name.charAt(0))}`;
                                  }}
                                />
                              ) : (
                                <span className="text-muted-foreground text-xs">{item.name.charAt(0)}</span>
                              )}
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-semibold text-foreground mb-1">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {item.category}
                                  </p>
                                  {item.dimensions && (
                                    <p className="text-xs text-muted-foreground">
                                      Dimensions: {item.dimensions}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              {/* Price and Quantity */}
                              <div className="flex items-center justify-between">
                                <div className="text-lg font-semibold text-primary">
                                  {formatPriceWithCurrency(item.price)}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  
                                  <span className="w-12 text-center text-sm font-medium">
                                    {item.quantity}
                                  </span>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Item Total */}
                              <div className="text-right mt-2">
                                <span className="text-sm text-muted-foreground">
                                  Total: {formatPriceWithCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Continue Shopping */}
                  <div className="mt-6">
                    <Button variant="outline" asChild>
                      <Link href="/product">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-lg shadow-card p-6 sticky top-4">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Order Summary
                    </h2>
                    
                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                        <span>{formatPriceWithCurrency(total)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Tax (GST 18%)</span>
                        <span>{formatPriceWithCurrency(tax)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? 'text-green-600' : ''}>
                          {shipping === 0 ? 'Free' : formatPriceWithCurrency(shipping)}
                        </span>
                      </div>
                      
                      {shipping > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Free shipping on orders above ₹1,00,000
                        </div>
                      )}
                      
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>{formatPriceWithCurrency(grandTotal)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Coupon Code */}
                    <div className="mb-6">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Coupon code"
                          className="flex-1"
                        />
                        <Button variant="outline" size="sm" onClick={applyCoupon}>
                          Apply
                        </Button>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => {
                        if (!isAuthenticated) {
                          setShowLoginModal(true);
                        } else {
                          // Redirect to checkout
                          window.location.href = '/checkout';
                        }
                      }}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                    </Button>

                    {/* Security & Trust */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Shield className="w-4 h-4" />
                        <span>Secure checkout</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Truck className="w-4 h-4" />
                        <span>Free delivery on orders above ₹1L</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Multiple payment options</span>
                      </div>
                      {isAuthenticated && (
                        <div className="pt-3 border-t">
                          <Link 
                            href="/my-orders" 
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <Package className="w-4 h-4" />
                            View My Orders
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}


          </div>
        </main>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          // Redirect to checkout after successful login
          window.location.href = '/checkout';
        }}
      />
    </Layout>
  );
};

export default Cart;

