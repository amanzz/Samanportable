import React, { useState, useEffect, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Lock, 
  ArrowLeft,
  CheckCircle,
  Package
} from 'lucide-react';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import OrderSuccessMessage from '@/components/OrderSuccessMessage';

interface CheckoutProps {
  cartItems: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export const getServerSideProps: GetServerSideProps<CheckoutProps> = async () => {
  // Return empty props - we'll get cart data from context
  return {
    props: {
      cartItems: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
    },
  };
};

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  methodTitle: string;
  enabled: boolean;
  methodDescription: string;
}

const Checkout = ({ cartItems: dummyCartItems, subtotal: dummySubtotal, tax: dummyTax, shipping: dummyShipping, total: dummyTotal }: CheckoutProps) => {
  const router = useRouter();
  const { user, token } = useAuth();
  const { state: cartState, clearCart } = useCart();
  
  // All hooks must be called FIRST, before any conditional logic
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingCountry: 'India',
    notes: ''
  });
  
  // Use real cart data instead of dummy data
  const cartItems = cartState.items;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 100000 ? 0 : 5000; // Free shipping above 1L
  const total = subtotal + tax + shipping;
  
  // Validate cart items have required properties
  const validCartItems = cartItems.filter(item => 
    item.id && item.name && typeof item.price === 'number' && item.quantity > 0
  );

  // Define fetchPaymentMethods function before using it in useEffect
  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoadingPaymentMethods(true);
      const response = await fetch('/api/payment-methods');
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      setPaymentMethods(data);
      
      // Set first payment method as default if available
      if (data.length > 0) {
        setSelectedPaymentMethod(data[0]);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoadingPaymentMethods(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  // Redirect if cart is empty (this will only run if cart has items)
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems.length, router]);

  // Initialize shipping fields with billing data when sameAsBilling is true
  useEffect(() => {
    if (sameAsBilling) {
      setFormData(prev => ({
        ...prev,
        shippingFirstName: prev.firstName,
        shippingLastName: prev.lastName,
        shippingAddress: prev.address,
        shippingCity: prev.city,
        shippingState: prev.state,
        shippingZipCode: prev.zipCode,
        shippingCountry: prev.country
      }));
    }
  }, [sameAsBilling]);

  // Check if cart is empty AFTER calling all hooks
  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some products to your cart before proceeding to checkout.
          </p>
          <Button asChild>
            <Link href="/product">
              Browse Products
            </Link>
          </Button>
        </div>
      </div>
      </Layout>
    );
  }

  const handlePaymentMethodChange = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    setSelectedPaymentMethod(method || null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If same as billing is checked, update shipping fields
    if (sameAsBilling && name.startsWith('firstName') || name.startsWith('lastName') || name.startsWith('address') || name.startsWith('city') || name.startsWith('state') || name.startsWith('zipCode') || name.startsWith('country')) {
      const shippingField = name.replace(/^/, 'shipping');
      setFormData(prev => ({
        ...prev,
        [shippingField]: value
      }));
    }
  };

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked) {
      // Copy billing data to shipping
      setFormData(prev => ({
        ...prev,
        shippingFirstName: prev.firstName,
        shippingLastName: prev.lastName,
        shippingAddress: prev.address,
        shippingCity: prev.city,
        shippingState: prev.state,
        shippingZipCode: prev.zipCode,
        shippingCountry: prev.country
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (!user || !token) {
      alert('Please login to place an order');
      router.push('/my-orders');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        cartItems: validCartItems, // Use validated cart items
        billing: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        shipping: {
          firstName: formData.shippingFirstName,
          lastName: formData.shippingLastName,
          address: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          zipCode: formData.shippingZipCode,
          country: formData.shippingCountry
        },
        paymentMethod: selectedPaymentMethod.id,
        notes: formData.notes,
        subtotal,
        tax,
        shippingCost: shipping,
        total,
        userId: user.id
      };

      // Send order to WordPress
      const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

             const result = await response.json();
       
       // Clear the cart
       clearCart();
      
      // Set order number for success message
      setPlacedOrderNumber(result.order?.orderNumber || '');
      
             // Show success message
       setShowSuccessMessage(true);
       

       
       // Auto-redirect after 3 seconds
       setTimeout(() => {
         try {
           router.push('/my-orders');
         } catch (redirectError) {
           // Fallback: try window.location
           window.location.href = '/my-orders';
         }
       }, 3000);
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Failed to place order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Checkout - Saman Portable</title>
        <meta name="description" content="Complete your purchase of portable office solutions securely." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen">
        <main>
          <div className="max-w-7xl mx-auto container-padding">
                         {/* Breadcrumb */}
             <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8 pt-6">
               <Link href="/" className="hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/50">
                 Home
               </Link>
               <span className="text-muted-foreground/60">/</span>
               <Link href="/cart" className="hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/50">
                 Cart
               </Link>
               <span className="text-muted-foreground/60">/</span>
               <span className="text-foreground font-medium px-2 py-1 bg-muted/30 rounded">Checkout</span>
             </div>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Checkout
              </h1>
              <p className="text-muted-foreground">
                Complete your purchase securely
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                  {/* Billing Information */}
                  <div className="bg-card rounded-lg shadow-card p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Billing Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="mt-2"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="bg-card rounded-lg shadow-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <input
                        type="checkbox"
                        id="sameAsBilling"
                        checked={sameAsBilling}
                        onChange={(e) => handleSameAsBillingChange(e.target.checked)}
                        className="rounded"
                        aria-label="Shipping address same as billing"
                      />
                      <Label htmlFor="sameAsBilling" className="text-lg font-semibold">
                        Shipping address same as billing
                      </Label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shippingFirstName">First Name *</Label>
                        <Input
                          id="shippingFirstName"
                          name="shippingFirstName"
                          value={formData.shippingFirstName}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          disabled={sameAsBilling}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingLastName">Last Name *</Label>
                        <Input
                          id="shippingLastName"
                          name="shippingLastName"
                          value={formData.shippingLastName}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          disabled={sameAsBilling}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="shippingAddress">Street Address *</Label>
                        <Input
                          id="shippingAddress"
                          name="shippingAddress"
                          value={formData.shippingAddress}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          disabled={sameAsBilling}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingCity">City *</Label>
                        <Input
                          id="shippingCity"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          disabled={sameAsBilling}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingState">State *</Label>
                        <Input
                          id="shippingState"
                          name="shippingState"
                          value={formData.shippingState}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          disabled={sameAsBilling}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingZipCode">ZIP Code *</Label>
                        <Input
                          id="shippingZipCode"
                          name="shippingZipCode"
                          value={formData.shippingZipCode}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          disabled={sameAsBilling}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingCountry">Country *</Label>
                        <Input
                          id="shippingCountry"
                          name="shippingCountry"
                          value={formData.shippingCountry}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          disabled={sameAsBilling}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-card rounded-lg shadow-card p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Payment Information
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="paymentMethod">Payment Method *</Label>
                        <div className="mt-2 space-y-3">
                          {loadingPaymentMethods ? (
                            <div className="text-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                              <p className="text-sm text-muted-foreground">Loading payment methods...</p>
                            </div>
                          ) : paymentMethods.length > 0 ? (
                            paymentMethods.map((method) => (
                              <div key={method.id} className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  id={`payment-${method.id}`}
                                  name="paymentMethod"
                                  value={method.id}
                                  checked={selectedPaymentMethod?.id === method.id}
                                  onChange={() => handlePaymentMethodChange(method.id)}
                                  required
                                  className="rounded"
                                  aria-label={`Select ${method.title} payment method`}
                                />
                                <Label htmlFor={`payment-${method.id}`} className="flex-1 cursor-pointer">
                                  <div className="font-medium">{method.title}</div>
                                  {method.description && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                      {method.description}
                                    </div>
                                  )}
                                </Label>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              No payment methods available
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {selectedPaymentMethod && (
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium mb-2">Selected Payment Method</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedPaymentMethod.description || selectedPaymentMethod.title}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="bg-card rounded-lg shadow-card p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Additional Information
                    </h2>
                    
                                          <div>
                        <Label htmlFor="notes">Order Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Any special requirements or delivery instructions..."
                          rows={4}
                          className="mt-2"
                        />
                      </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                      <Link href="/cart">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Cart
                      </Link>
                    </Button>
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg shadow-card p-6 sticky top-4">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Order Summary
                  </h2>
                  
                                     {/* Cart Items */}
                   <div className="space-y-4 mb-6">
                     {validCartItems.map((item) => (
                       <div key={item.id} className="flex justify-between items-center">
                         <div className="flex-1">
                           <h3 className="font-medium text-foreground">
                             {item.name}
                           </h3>
                           <p className="text-sm text-muted-foreground">
                             {item.category} × {item.quantity}
                           </p>
                         </div>
                         <span className="font-medium">
                           {formatPriceWithCurrency(item.price * item.quantity)}
                         </span>
                       </div>
                     ))}
                   </div>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPriceWithCurrency(subtotal)}</span>
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
                    
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{formatPriceWithCurrency(total)}</span>
                      </div>
                    </div>
                  </div>

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
                    <div className="pt-3 border-t">
                      <Link 
                        href="/my-orders" 
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        View My Orders
                      </Link>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    form="checkout-form"
                    disabled={!selectedPaymentMethod || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Placing Order...
                      </>
                    ) : loadingPaymentMethods ? (
                      'Loading...'
                    ) : (
                      'Place Order'
                    )}
                  </Button>

                  {/* Terms */}
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By placing your order, you agree to our{' '}
                    <Link href="/terms-and-conditions" className="text-primary hover:underline">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy-policy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <section className="mt-16 mb-16">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  Why Choose Saman Portable?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#0A3D2A] rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Secure Payment
                    </h3>
                    <p className="text-muted-foreground">
                      Your payment information is protected with bank-level security
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#0A3D2A] rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Fast Delivery
                    </h3>
                    <p className="text-muted-foreground">
                      Quick installation and setup within 7–21 days
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#0A3D2A] rounded-lg flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Quality Guarantee
                    </h3>
                    <p className="text-muted-foreground">
                      5-Year Structural Warranty + 1-Year Standard Warranty (extendable to 2 years on request)
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      
             {/* Success Message Modal */}
       {showSuccessMessage && (
         <OrderSuccessMessage
           orderNumber={placedOrderNumber}
           onClose={() => setShowSuccessMessage(false)}
           onRedirect={() => {
             try {
               router.push('/my-orders');
             } catch (redirectError) {
               window.location.href = '/my-orders';
             }
           }}
         />
       )}
       
       {/* Immediate Redirect Button (Alternative to waiting 3 seconds) */}
       {showSuccessMessage && (
         <div className="fixed bottom-4 right-4 z-40">
           <Button 
             onClick={() => {
               try {
                 router.push('/my-orders');
               } catch (redirectError) {
                 window.location.href = '/my-orders';
               }
             }}
             className="bg-green-600 hover:bg-green-700 text-white"
           >
             <Package className="w-4 h-4 mr-2" />
             Go to My Orders Now
           </Button>
         </div>
       )}
    </Layout>
  );
};

export default Checkout;

