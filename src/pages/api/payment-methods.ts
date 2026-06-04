import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Use the WooCommerce base URL from next.config.js
    const wcBaseUrl = (process.env.WORDPRESS_API_URL || 'https://blog.samanportable.com/wp-json') + '/wc/v3';
    // Server-side WooCommerce WRITE credentials from env (payment gateways need an authenticated key).
    const consumerKey = process.env.WORDPRESS_REVIEW_WRITE_KEY || '';
    const consumerSecret = process.env.WORDPRESS_REVIEW_WRITE_SECRET || '';

    // Authenticate with consumer_key/secret as query-string params — the same method
    // the working read routes use. Avoids relying on the Authorization (Basic) header
    // being preserved end-to-end through the proxy/origin.
    const authParams = new URLSearchParams({ consumer_key: consumerKey, consumer_secret: consumerSecret });
    const response = await fetch(`${wcBaseUrl}/payment_gateways?${authParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).json({ message: 'Unauthorized access to WooCommerce API' });
      } else if (response.status === 404) {
        return res.status(404).json({ message: 'WooCommerce API endpoint not found' });
      } else {
        const errorText = await response.text();
        throw new Error(`WordPress API error: ${response.status} - ${errorText}`);
      }
    }

    const paymentGateways = await response.json();
    
    // Filter only enabled payment gateways
    const enabledGateways = paymentGateways.filter((gateway: any) => gateway.enabled);
    
    // Transform to match our frontend needs
    const transformedGateways = enabledGateways.map((gateway: any) => ({
      id: gateway.id,
      title: gateway.title,
      description: gateway.description,
      methodTitle: gateway.method_title,
      enabled: gateway.enabled,
      methodDescription: gateway.method_description,
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(200).json(transformedGateways);
  } catch (error) {
    console.error('Payment methods API Error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return res.status(500).json({
          message: 'Failed to connect to WordPress API',
          error: 'Network error or WordPress site unavailable',
        });
      }
      return res.status(500).json({
        message: 'Failed to fetch payment methods',
        error: error.message,
      });
    }
    
    return res.status(500).json({
      message: 'Failed to fetch payment methods',
      error: 'Unknown error occurred',
    });
  }
}
