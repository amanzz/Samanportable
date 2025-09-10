# 🛍️ Next.js WooCommerce Product System with Pagination & Filters

This implementation provides a complete, production-ready product listing system for your Next.js WooCommerce website with:

- ✅ **Server-side pagination** (20 products per page)
- ✅ **Advanced filtering** (category, price, search, stock status, etc.)
- ✅ **Real-time search** with debouncing
- ✅ **Responsive design** (grid/list view modes)
- ✅ **SEO optimized** with SSR support
- ✅ **Client-side navigation** for smooth UX
- ✅ **TypeScript support** with full type safety

## 🚀 Features

### Pagination
- Shows 20 products per page (configurable)
- Smart page navigation with ellipsis for large page counts
- URL-based pagination for bookmarking and sharing
- Automatic page reset when filters change

### Filters
- **Search**: Real-time product search with 500ms debouncing
- **Category**: Filter by WooCommerce product categories
- **Price Range**: Slider-based min/max price filtering
- **Stock Status**: In stock, out of stock, on backorder
- **Sale Items**: Show only products on sale
- **Sorting**: Multiple sort options (date, price, name, rating, popularity)

### View Modes
- **Grid View**: Traditional card-based layout
- **List View**: Horizontal layout with more product details

### Performance
- **SSR**: Initial page load with server-side rendering
- **CSR**: Smooth client-side navigation after first load
- **API Optimization**: Never fetches all products at once
- **Caching**: 5-minute cache for products, 1-hour for categories

## 📁 File Structure

```
nextjs-migration/
├── src/
│   ├── components/
│   │   ├── ui/                    # UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   └── slider.tsx
│   │   ├── Pagination.tsx         # Pagination component
│   │   ├── ProductFilters.tsx     # Filter sidebar
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── api/
│   │   │   └── products.ts        # API route for client-side fetching
│   │   ├── product.tsx            # Main products page
│   │   └── _app.tsx
│   ├── config/
│   │   └── api.ts                 # Enhanced API functions
│   └── lib/
│       └── utils.ts               # Utility functions
├── package.json
└── README-PRODUCTS.md
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

All required dependencies are already in your `package.json`:

```bash
npm install
# or
yarn install
```

### 2. Environment Configuration

Ensure your `.env.local` file has the correct WooCommerce credentials:

```env
# WordPress and WooCommerce API Configuration
WP_BASE_URL=https://blog.samanportable.com/wp-json/wp/v2
WC_BASE_URL=https://blog.samanportable.com/wp-json/wc/v3
WC_CONSUMER_KEY=ck_8649e855e2c557f0a545b674bd5fb1eacc32ad59
WC_CONSUMER_SECRET=cs_d9b9536ff84a86871d7877481225b939cd4bacb2
BLOG_API_ENDPOINT=https://blog.samanportable.com/wp-json/wp/v2
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000/product` to see your products page.

## 🔧 Configuration

### Pagination Settings

Edit `src/config/api.ts` to change pagination defaults:

```typescript
export const API_CONFIG = {
  // ... other config
  DEFAULT_PER_PAGE: 20, // Change this to show more/fewer products per page
  // ... other config
};
```

### Cache Settings

Adjust cache duration in the same file:

```typescript
export const API_CONFIG = {
  // ... other config
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes for products
  // ... other config
};
```

## 📱 Usage Examples

### Basic Product Listing

```typescript
// Fetch first page of products
const products = await fetchProducts(1, 20);

// Fetch products with filters
const filteredProducts = await fetchProducts(1, 20, {
  category: 'portable-cabins',
  min_price: 25000,
  max_price: 100000,
  on_sale: true,
  orderby: 'price',
  order: 'asc'
});
```

### Category-Based Filtering

```typescript
// Fetch products by category with pagination
const categoryProducts = await fetchProductsByCategory(
  'portable-cabins', 
  1, 
  20,
  { min_price: 25000 } // Additional filters
);
```

## 🌐 API Endpoints

### WooCommerce REST API

The system uses these WooCommerce endpoints:

- **Products**: `/wp-json/wc/v3/products`
- **Categories**: `/wp-json/wc/v3/products/categories`
- **Attributes**: `/wp-json/wc/v3/products/attributes`

### Query Parameters

All WooCommerce standard parameters are supported:

- `page`: Page number (default: 1)
- `per_page`: Products per page (default: 20)
- `category`: Category ID or slug
- `search`: Search term
- `min_price`: Minimum price
- `max_price`: Maximum price
- `on_sale`: Show only sale items
- `stock_status`: instock, outofstock, onbackorder
- `orderby`: date, price, title, popularity, rating
- `order`: asc, desc

## 🎨 Customization

### Styling

The components use Tailwind CSS classes. Customize by modifying:

- **Product Cards**: Edit the JSX in `src/pages/product.tsx`
- **Filters**: Modify `src/components/ProductFilters.tsx`
- **Pagination**: Update `src/components/Pagination.tsx`

### Adding New Filters

1. Add the filter to the `ProductFilters` interface in `src/config/api.ts`
2. Update the `fetchProducts` function to handle the new parameter
3. Add the UI control in `src/components/ProductFilters.tsx`
4. Update the API route in `src/pages/api/products.ts`

### Example: Adding a "Brand" Filter

```typescript
// 1. Update interface
export interface ProductFilters {
  // ... existing filters
  brand?: string;
}

// 2. Update fetchProducts function
if (filters.brand) {
  params.append('attribute', `pa_brand=${filters.brand}`);
}

// 3. Add UI control in ProductFilters.tsx
// 4. Update API route
```

## 🚀 Performance Tips

### 1. Optimize Images

Ensure your WooCommerce products have optimized images:

```typescript
// Use Next.js Image component for better performance
import Image from 'next/image';

<Image
  src={product.images[0].src}
  alt={product.name}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 2. Implement Virtual Scrolling

For very large product catalogs (1000+ products), consider virtual scrolling:

```bash
npm install react-window
```

### 3. Add Product Caching

Implement Redis or similar for product caching:

```typescript
// Example with Redis
import Redis from 'ioredis';

const redis = new Redis();
const cacheKey = `products:${page}:${JSON.stringify(filters)}`;

let products = await redis.get(cacheKey);
if (!products) {
  products = await fetchProducts(page, perPage, filters);
  await redis.setex(cacheKey, 300, JSON.stringify(products)); // 5 min cache
}
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Products Not Loading

- Check WooCommerce API credentials in `.env.local`
- Verify API endpoints are accessible
- Check browser console for errors

#### 2. Filters Not Working

- Ensure WooCommerce attributes are properly configured
- Check API response for filter parameters
- Verify category slugs exist

#### 3. Pagination Issues

- Check `X-WP-Total` and `X-WP-TotalPages` headers in API response
- Verify page parameter is being passed correctly

#### 4. Performance Issues

- Reduce `per_page` value
- Implement product caching
- Use image optimization
- Consider lazy loading for product images

### Debug Mode

Enable debug logging by adding to your environment:

```env
DEBUG=true
NODE_ENV=development
```

## 📊 Monitoring & Analytics

### Track User Behavior

```typescript
// Example: Track filter usage
const trackFilterUsage = (filters: ProductFilters) => {
  gtag('event', 'filter_products', {
    event_category: 'Ecommerce',
    event_label: Object.keys(filters).join(','),
    value: Object.keys(filters).length
  });
};
```

### Performance Metrics

Monitor these key metrics:

- **Time to First Byte (TTFB)**: Server response time
- **First Contentful Paint (FCP)**: First content appears
- **Largest Contentful Paint (LCP)**: Main content loads
- **Cumulative Layout Shift (CLS)**: Visual stability

## 🔐 Security Considerations

### API Security

- WooCommerce consumer keys are sensitive - keep them secure
- Consider implementing rate limiting
- Validate all filter parameters
- Sanitize search inputs

### Data Validation

```typescript
// Example: Validate price filters
const validatePriceFilter = (price: string) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 1000000;
};
```

## 📈 Future Enhancements

### Planned Features

- [ ] **Wishlist functionality**
- [ ] **Product comparison**
- [ ] **Advanced filtering with faceted search**
- [ ] **Product recommendations**
- [ ] **Bulk actions** (add multiple to cart)
- [ ] **Export functionality** (CSV, PDF)

### Integration Opportunities

- **Analytics**: Google Analytics, Mixpanel
- **Search**: Algolia, Elasticsearch
- **CDN**: Cloudflare, AWS CloudFront
- **Caching**: Redis, Memcached
- **Monitoring**: Sentry, LogRocket

## 🤝 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review WooCommerce REST API documentation
3. Check Next.js documentation for routing issues
4. Verify your WooCommerce setup and permissions

## 📝 License

This implementation is part of your SAMAN Portable Office Solutions project.

---

**Happy coding! 🚀**

Your Next.js WooCommerce product system is now ready with full pagination, filtering, and a professional user experience.
