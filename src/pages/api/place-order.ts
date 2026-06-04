import { NextApiRequest, NextApiResponse } from 'next';
import { sendToAllRecipients, formatFormDataForEmail } from '@/lib/mailer';
import { EMAIL_TEMPLATES, COMPANY_INFO } from '@/config/emails';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      cartItems,
      billing,
      shipping,
      paymentMethod,
      notes,
      subtotal,
      tax,
      shippingCost,
      total,
      userId
    } = req.body;

    // Validate required fields
    if (!cartItems || !billing || !shipping || !paymentMethod || !userId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        error: 'Cart items, billing, shipping, payment method, and user ID are required'
      });
    }

    // Use the WooCommerce base URL from next.config.js
    const wcBaseUrl = (process.env.WORDPRESS_API_URL || 'https://blog.samanportable.com/wp-json') + '/wc/v3';
    // Server-side WooCommerce WRITE credentials from env (creating an order needs write scope).
    const consumerKey = process.env.WORDPRESS_REVIEW_WRITE_KEY || '';
    const consumerSecret = process.env.WORDPRESS_REVIEW_WRITE_SECRET || '';

    // Prepare order data for WooCommerce
    const orderData = {
      customer_id: userId,
      payment_method: paymentMethod,
      payment_method_title: paymentMethod,
      set_paid: false, // Set to true if payment is confirmed
      billing: {
        first_name: billing.firstName,
        last_name: billing.lastName,
        company: billing.company || '',
        address_1: billing.address,
        city: billing.city,
        state: billing.state,
        postcode: billing.zipCode,
        country: billing.country,
        email: billing.email,
        phone: billing.phone
      },
      shipping: {
        first_name: shipping.firstName,
        last_name: shipping.lastName,
        company: '',
        address_1: shipping.address,
        city: shipping.city,
        state: shipping.state,
        postcode: shipping.zipCode,
        country: shipping.country
      },
      line_items: cartItems.map((item: any) => ({
        product_id: item.id,
        quantity: item.quantity,
        name: item.name,
        price: item.price.toString(),
        total: (item.price * item.quantity).toString()
      })),
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Flat Rate',
          total: shippingCost.toString()
        }
      ],
      fee_lines: [
        {
          name: 'GST (18%)',
          total: tax.toString()
        }
      ],
      meta_data: [
        {
          key: '_order_notes',
          value: notes || ''
        },
        {
          key: '_order_source',
          value: 'Next.js Frontend'
        }
      ],
      status: 'pending' // Can be: pending, processing, completed, etc.
    };

    // Authenticate with consumer_key/secret as query-string params — the same method
    // the working read routes use (consistent, proxy/header-independent auth).
    const authParams = new URLSearchParams({ consumer_key: consumerKey, consumer_secret: consumerSecret });
    const response = await fetch(`${wcBaseUrl}/orders?${authParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WooCommerce API Error:', response.status, errorText);
      
      if (response.status === 400) {
        return res.status(400).json({ 
          message: 'Invalid order data',
          error: 'Please check your order information and try again'
        });
      } else if (response.status === 401) {
        return res.status(401).json({ 
          message: 'Unauthorized access to WooCommerce API',
          error: 'Authentication failed'
        });
      } else {
        throw new Error(`WordPress API error: ${response.status} - ${errorText}`);
      }
    }

    const createdOrder = await response.json();
    
    console.log('Order created successfully:', createdOrder.id);

    // Send order notification email
    try {
      const orderData = {
        'Order ID': createdOrder.id,
        'Order Number': createdOrder.number,
        'Order Status': createdOrder.status,
        'Order Total': `₹${createdOrder.total}`,
        'Order Date': new Date(createdOrder.date_created).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata'
        }),
        'Payment Method': createdOrder.payment_method_title,
        'Customer Name': `${billing.firstName} ${billing.lastName}`,
        'Customer Email': billing.email,
        'Customer Phone': billing.phone,
        'Customer Company': billing.company || 'Not specified',
        'Billing Address': `${billing.address}, ${billing.city}, ${billing.state} ${billing.zipCode}, ${billing.country}`,
        'Shipping Address': `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zipCode}, ${shipping.country}`,
        'Items Ordered': cartItems.map((item: any) => `${item.name} x${item.quantity} - ₹${item.price}`).join(', '),
        'Subtotal': `₹${subtotal}`,
        'Tax (GST)': `₹${tax}`,
        'Shipping Cost': `₹${shippingCost}`,
        'Total Amount': `₹${total}`,
        'Notes': notes || 'No notes provided'
      };

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New Order Placed</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #0A3D2A 0%, #1a5f3a 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px;">New Order Placed!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Order #${createdOrder.number}</p>
              </div>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #0A3D2A;">
                <h2 style="color: #0A3D2A; margin-top: 0;">Order Details</h2>
                ${formatFormDataForEmail(orderData)}
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404;">
                  <strong>Order Status:</strong> ${createdOrder.status.toUpperCase()}
                </p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #28a745;">
                <p style="margin: 0; color: #155724;">
                  <strong>Action Required:</strong> Process this order and update the customer on the status.
                </p>
              </div>
              
              <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
                <p>This email was sent from the order system on ${COMPANY_INFO.website}</p>
                <p>Company: ${COMPANY_INFO.name} | Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const textContent = `
New Order Placed - Samanportable

Order Details:
${Object.entries(orderData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Order Status: ${createdOrder.status.toUpperCase()}
Action Required: Process this order and update the customer on the status.

This email was sent from the order system on ${COMPANY_INFO.website}
Company: ${COMPANY_INFO.name} | Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone}
      `;

      await sendToAllRecipients({
        subject: EMAIL_TEMPLATES.ORDER_PLACED.subject,
        html: htmlContent,
        text: textContent,
        replyTo: billing.email
      });

      console.log('Order notification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send order notification email:', emailError);
      // Don't fail the order creation if email fails
    }

    // Return success response with order details
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: createdOrder.id,
        orderNumber: createdOrder.number,
        status: createdOrder.status,
        total: createdOrder.total,
        dateCreated: createdOrder.date_created,
        paymentMethod: createdOrder.payment_method_title,
        billing: createdOrder.billing,
        shipping: createdOrder.shipping,
        lineItems: createdOrder.line_items
      }
    });

  } catch (error) {
    console.error('Place Order API Error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return res.status(500).json({
          message: 'Failed to connect to WordPress API',
          error: 'Network error or WordPress site unavailable',
        });
      }
      return res.status(500).json({
        message: 'Failed to place order',
        error: error.message,
      });
    }
    
    return res.status(500).json({
      message: 'Failed to place order',
      error: 'Unknown error occurred',
    });
  }
}
