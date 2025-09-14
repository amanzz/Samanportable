# JWT Authentication Setup for Saman Portable Website

This document explains how to set up JWT authentication between your Next.js frontend and WordPress backend.

## Prerequisites

1. WordPress website with JWT Authentication plugin installed
2. Admin access to WordPress
3. Next.js project with the cart and authentication components

## WordPress Setup

### 1. Install JWT Authentication Plugin

1. Go to your WordPress admin panel
2. Navigate to Plugins > Add New
3. Search for "JWT Authentication for WP-API"
4. Install and activate the plugin

### 2. Configure JWT Settings

1. Go to Settings > JWT Authentication
2. Set your JWT Secret (use a strong, random string)
3. Set JWT Expiration time (recommended: 7 days)
4. Save settings

### 3. Get Admin Credentials

You'll need your WordPress admin username and password for user registration.

## Environment Variables

Create a `.env.local` file in your Next.js project root with the following variables:

```env
# WordPress Configuration
WORDPRESS_URL=https://blog.samanportable.com
WORDPRESS_ADMIN_USERNAME=your_admin_username
WORDPRESS_ADMIN_PASSWORD=your_admin_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_from_wordpress
JWT_EXPIRATION=7d
```

## Features Implemented

### 1. User Authentication
- **Login**: Users can log in with username/password
- **Registration**: New users can create accounts
- **JWT Tokens**: Secure authentication using JWT

### 2. Shopping Cart
- **Add to Cart**: Products can be added to cart
- **Cart Management**: View, update quantities, remove items
- **Persistent Storage**: Cart data saved in localStorage

### 3. Checkout Process
- **Cart Review**: Users can review cart items
- **Authentication Required**: Must be logged in to checkout
- **Order Placement**: Complete checkout process

## How It Works

### 1. Authentication Flow
1. User enters credentials in login modal
2. Next.js sends request to WordPress JWT endpoint
3. WordPress validates credentials and returns JWT token
4. Token is stored in localStorage and used for authenticated requests

### 2. Cart Flow
1. User clicks "Add to Cart" on product pages
2. Item is added to cart context (React state + localStorage)
3. Cart icon shows item count
4. User can view cart and proceed to checkout

### 3. Checkout Flow
1. User reviews cart items
2. If not logged in, login modal appears
3. After login, user fills shipping information
4. Order is placed and confirmation shown

## API Endpoints

The following API endpoints are implemented:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/auth/validate` - Token validation

## Security Features

- JWT tokens for secure authentication
- Password hashing (handled by WordPress)
- Secure API endpoints with proper validation
- Environment variables for sensitive data

## Testing

1. Start your Next.js development server
2. Try adding products to cart
3. Test login/registration
4. Test checkout process
5. Verify cart persistence across page reloads

## Troubleshooting

### Common Issues

1. **JWT Plugin Not Working**
   - Ensure plugin is activated
   - Check JWT secret is set
   - Verify WordPress REST API is enabled

2. **Authentication Fails**
   - Check environment variables
   - Verify WordPress admin credentials
   - Check browser console for errors

3. **Cart Not Working**
   - Ensure CartContext is properly wrapped
   - Check localStorage permissions
   - Verify product data structure

### Debug Steps

1. Check browser console for errors
2. Verify API endpoints are accessible
3. Test WordPress JWT endpoint directly
4. Check environment variables are loaded

## Next Steps

1. **Payment Integration**: Add payment gateway (Razorpay, Stripe)
2. **Order Management**: Create order tracking system
3. **Email Notifications**: Send order confirmations
4. **Admin Panel**: Create admin interface for order management
5. **Inventory Management**: Track product stock levels

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review WordPress error logs
3. Check Next.js console for errors
4. Verify all environment variables are set correctly
