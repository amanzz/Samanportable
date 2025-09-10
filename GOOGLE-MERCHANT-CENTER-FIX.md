# Google Merchant Center Inventory Data Fix

## Problem Identified
Your Google Merchant Center is showing "Missing inventory data" errors, causing products to have limited visibility. This happens when:

1. **Missing inventory data**: Products don't have corresponding inventory information
2. **Product ID mismatches**: Product IDs between primary data source and inventory data source don't match exactly
3. **Incomplete feed data**: The merchant feed is missing required inventory attributes

## Solutions Implemented

### 1. Enhanced Product Feed (`/api/google-merchant-feed.ts`)
- ✅ Added `stock_quantity` field to product data fetching
- ✅ Added `<g:quantity>` element to XML feed
- ✅ Added `<g:mpn>` (Manufacturer Part Number) using product ID for consistency
- ✅ Changed `identifier_exists` to `true` since we now have MPN
- ✅ Added unit pricing and cost of goods sold data
- ✅ Enhanced inventory tracking attributes

### 2. Separate Inventory Feed (`/api/google-inventory-feed.ts`)
- ✅ Created dedicated inventory feed for real-time stock updates
- ✅ Provides inventory-specific data with shorter cache (5 minutes)
- ✅ Includes quantity, availability, and pricing information
- ✅ Uses consistent product IDs for matching

### 3. Inventory Management API (`/api/inventory-management.ts`)
- ✅ GET endpoint to view current inventory status
- ✅ POST endpoint to update single product inventory
- ✅ PUT endpoint for bulk inventory updates
- ✅ Comprehensive error handling and validation

## How to Fix in Google Merchant Center

### Step 1: Update Your Product Feed
1. Go to Google Merchant Center
2. Navigate to **Products** → **Feeds**
3. Update your primary feed URL to: `https://www.samanportable.com/api/google-merchant-feed`
4. The feed now includes proper inventory data

### Step 2: Add Inventory Feed (Optional but Recommended)
1. In Google Merchant Center, go to **Products** → **Feeds**
2. Click **Add Feed**
3. Choose **Inventory** as feed type
4. Set feed URL to: `https://www.samanportable.com/api/google-inventory-feed`
5. This provides real-time inventory updates

### Step 3: Verify Product IDs Match
The fix ensures product IDs are consistent across:
- Primary product feed (`<g:id>`)
- Inventory feed (`<g:id>`)
- MPN field (`<g:mpn>`)

All use the same WooCommerce product ID for perfect matching.

## Key Changes Made

### API Configuration (`src/config/api.ts`)
```typescript
// Added inventory fields to product fetching
_fields: 'id,name,slug,price,regular_price,sale_price,on_sale,images,short_description,stock_status,stock_quantity,average_rating,rating_count,categories,weight,dimensions'
```

### Merchant Feed Enhancements
```xml
<!-- Added inventory data -->
<g:quantity>1</g:quantity>
<g:mpn>123</g:mpn>
<g:identifier_exists>true</g:identifier_exists>

<!-- Added business data -->
<g:unit_pricing_measure>1 piece</g:unit_pricing_measure>
<g:cost_of_goods_sold>700.00 INR</g:cost_of_goods_sold>
```

## Testing the Fix

### 1. Test Product Feed
```bash
curl https://www.samanportable.com/api/google-merchant-feed
```

### 2. Test Inventory Feed
```bash
curl https://www.samanportable.com/api/google-inventory-feed
```

### 3. Test Inventory Management
```bash
# Get inventory status
curl https://www.samanportable.com/api/inventory-management

# Update single product
curl -X POST https://www.samanportable.com/api/inventory-management \
  -H "Content-Type: application/json" \
  -d '{"product_id": 123, "stock_status": "instock", "stock_quantity": 5}'
```

## Expected Results

After implementing these fixes:

1. ✅ **No more "Missing inventory data" errors**
2. ✅ **Products will have proper visibility in Google Shopping**
3. ✅ **Consistent product ID matching between feeds**
4. ✅ **Real-time inventory updates capability**
5. ✅ **Better product performance in Google Merchant Center**

## Monitoring

### Check Feed Status
1. Go to Google Merchant Center → Products → Feeds
2. Look for green checkmarks indicating successful processing
3. Check for any remaining errors in the "Issues" tab

### Monitor Product Performance
1. Go to Products → All products
2. Check that products show as "Approved" instead of "Limited visibility"
3. Monitor impressions and clicks to ensure visibility is restored

## Additional Recommendations

1. **Regular Feed Updates**: The feeds are cached for 1 hour (main) and 5 minutes (inventory)
2. **Monitor Stock Levels**: Use the inventory management API to keep stock data current
3. **Product Data Quality**: Ensure all products have proper categories, descriptions, and images
4. **Regular Audits**: Check Google Merchant Center weekly for any new issues

## Support

If you continue to see issues after implementing these fixes:

1. Check the Google Merchant Center "Issues" tab for specific error messages
2. Verify that your WooCommerce products have proper stock_status and stock_quantity values
3. Test the feed URLs directly to ensure they're accessible
4. Contact Google Merchant Center support if issues persist

The fixes address the core inventory data requirements that Google Merchant Center needs for proper product visibility and approval.
