import { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '@/config/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.headers;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Fetch orders from WooCommerce
    const ordersResponse = await fetch(
      `${API_CONFIG.WC_BASE_URL}/orders?consumer_key=${API_CONFIG.WC_CONSUMER_KEY}&consumer_secret=${API_CONFIG.WC_CONSUMER_SECRET}&per_page=100&status=completed,processing`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!ordersResponse.ok) {
      return res.status(ordersResponse.status).json({ 
        message: 'Failed to fetch orders' 
      });
    }

    const orders = await ordersResponse.json();

    // Transform orders to include product images
    const transformedOrders = await Promise.all(
      orders.map(async (order: any) => {
        try {
          const transformedOrder = {
            id: order.id,
            number: order.number,
            status: order.status,
            date_created: order.date_created,
            total: order.total,
            currency: order.currency,
            line_items: await Promise.all(
              order.line_items.map(async (item: any) => {
                try {
                  const productId = item.product_id;
                  
                  // Fetch product details to get image
                  const productResponse = await fetch(
                    `${API_CONFIG.WC_BASE_URL}/products/${productId}?consumer_key=${API_CONFIG.WC_CONSUMER_KEY}&consumer_secret=${API_CONFIG.WC_CONSUMER_SECRET}`,
                    {
                      next: { revalidate: 3600 }, // Cache for 1 hour
                    }
                  );

                  let productImage = '/placeholder.svg';
                  
                  if (productResponse.ok) {
                    const product = await productResponse.json();
                    productImage = product.images?.[0]?.src || '/placeholder.svg';
                  }

                  return {
                    id: item.id,
                    name: item.name,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    total: item.total,
                    price: item.price,
                    image: productImage,
                  };
                } catch (error) {
                  return {
                    id: item.id,
                    name: item.name,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    total: item.total,
                    price: item.price,
                    image: '/placeholder.svg',
                  };
                }
              })
            ),
            billing: order.billing,
            shipping: order.shipping,
          };

          return transformedOrder;
        } catch (error) {
          return null;
        }
      })
    );

    // Filter out any null orders
    const validOrders = transformedOrders.filter(order => order !== null);

    res.status(200).json({ orders: validOrders });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
