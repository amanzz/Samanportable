import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
  User
} from 'lucide-react';
import { formatPriceWithCurrency } from '@/lib/utils';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
  total: string;
  image: string | null;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  dateCreated: string;
  total: string;
  currency: string;
  items: OrderItem[];
  billing: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  paymentMethod: string;
  notes: string;
}

const MyOrders = () => {
  const { isAuthenticated, user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 seconds
      });
      
      if (!token) {
        setError('Authentication token is missing. Please login again.');
        setLoading(false);
        return;
      }
      
      const fetchPromise = fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();
    }
  }, [isAuthenticated, token, fetchOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <Head>
          <title>My Orders - Saman Portable Office Solutions</title>
          <meta name="description" content="View your order history and track your portable office solutions." />
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Please Login to View Orders
            </h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to view your order history.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/">Go to Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>My Orders - Saman Portable Office Solutions</title>
        <meta name="description" content="View your order history and track your portable office solutions." />
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
              <span className="text-foreground font-medium px-2 py-1 bg-muted/30 rounded">My Orders</span>
            </div>

            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    My Orders
                  </h1>
                  <p className="text-muted-foreground">
                    Track your order history and current shipments
                  </p>
                </div>
              </div>
              
              {/* Welcome Message */}
              {user && orders && orders.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    🎉 Welcome back, <span className="font-medium">
                      {user.firstName || user.lastName || user.email}
                    </span>! 
                    You have {orders.length} order{orders.length === 1 ? '' : 's'} in your history.
                  </p>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="bg-card rounded-lg shadow-card p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Welcome back, {user?.firstName || user?.username || 'User'} {user?.lastName || ''}
                  </h2>
                  <p className="text-muted-foreground">{user?.email || 'Email not available'}</p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your orders...</p>
                <Button 
                  onClick={() => {
                    setLoading(false);
                    setError('Loading timed out. Please try again.');
                  }} 
                  variant="outline" 
                  className="mt-4"
                >
                  Cancel Loading
                </Button>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <AlertCircle className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Error Loading Orders
                </h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={fetchOrders}>Try Again</Button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  No Orders Found
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {orders === null ? 
                    'Unable to load your orders at the moment. Please try again later.' :
                    'You haven\'t placed any orders yet. Start shopping for portable office solutions!'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={fetchOrders} variant="outline">
                    Try Again
                  </Button>
                  <Button asChild size="lg">
                    <Link href="/product">
                      Browse Products
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      {/* Order Header */}
                      <div className="bg-muted/50 p-6 border-b">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Order #{order.orderNumber}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(order.dateCreated)}
                            </div>
                            <div className="font-semibold text-lg">
                              {formatPriceWithCurrency(parseFloat(order.total))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <div className="space-y-4 mb-6">
                          {order.items.map((item, index) => (
                            <div key={`${order.id}-${index}`} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {item.image ? (
                                  <>
                                    <Image 
                                      src={item.image} 
                                      alt={item.name}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const placeholder = target.nextElementSibling as HTMLElement;
                                        if (placeholder) placeholder.classList.remove('hidden');
                                      }}
                                    />
                                    <span className="hidden text-muted-foreground text-lg font-bold bg-primary/10 w-full h-full flex items-center justify-center rounded-lg">
                                      {item.name.charAt(0).toUpperCase()}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-muted-foreground text-lg font-bold bg-primary/10 w-full h-full flex items-center justify-center rounded-lg">
                                    {item.name.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground mb-1">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity} × {formatPriceWithCurrency(Number(item.price) || 0)}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-foreground">
                                  {formatPriceWithCurrency(Number(item.total) || (Number(item.price) * item.quantity) || 0)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Billing Information */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Billing Address
                            </h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>{order.billing.firstName} {order.billing.lastName}</p>
                              <p>{order.billing.address}</p>
                              <p>{order.billing.city}, {order.billing.state} {order.billing.postcode}</p>
                              <p>{order.billing.country}</p>
                              <p>{order.billing.email}</p>
                              <p>{order.billing.phone}</p>
                            </div>
                          </div>

                          {/* Shipping Information */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Truck className="w-4 h-4" />
                              Shipping Address
                            </h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>{order.shipping.firstName} {order.shipping.lastName}</p>
                              <p>{order.shipping.address}</p>
                              <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postcode}</p>
                              <p>{order.shipping.country}</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment & Notes */}
                        <div className="mt-6 pt-6 border-t border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payment Method
                              </h4>
                              <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                            </div>
                            {order.notes && (
                              <div>
                                <h4 className="font-semibold text-foreground mb-3">Order Notes</h4>
                                <p className="text-sm text-muted-foreground">{order.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
                          {order.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              Download Invoice
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                      {orders.length === 0 ? 'No Orders Found' : 'No Orders Yet'}
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      {orders.length === 0 
                        ? 'Unable to load your orders at the moment. Please try again later.'
                        : 'You haven\'t placed any orders yet. Start shopping to see your orders here!'
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={fetchOrders} variant="outline">
                        Refresh Orders
                      </Button>
                      {orders.length === 0 && (
                        <Button asChild>
                          <Link href="/product">
                            Browse Products
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Bottom spacing */}
      <div className="h-16"></div>
    </Layout>
  );
};

export default MyOrders;

