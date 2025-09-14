# Short Description Table Parsing

## Overview

This feature automatically parses the WordPress short description content to extract table data and display it in the product detail pages. Instead of showing hardcoded dummy data, the system now fetches and displays the actual content from your WordPress website.

## How It Works

### 1. WordPress Short Description Format

The system expects your WordPress product short descriptions to contain HTML tables with the following structure:

```html
<table>
  <tr>
    <td>Material Specifications</td>
    <td>Plans And Layout</td>
  </tr>
  <tr>
    <td>Size</td>
    <td>90'X36'X14"</td>
  </tr>
  <tr>
    <td>Materials</td>
    <td>Steel & Wood</td>
  </tr>
  <tr>
    <td>Brand</td>
    <td>SAMAN Portable</td>
  </tr>
</table>
```

### 2. Parsing Function

The `parseShortDescriptionTableSSR` function in `src/lib/utils.ts` extracts the following fields:
- **Material Specifications**: Plans And Layout
- **Size**: 90'X36'X14"
- **Materials**: Steel & Wood  
- **Brand**: SAMAN Portable

### 3. Implementation

The parsing is implemented in `src/pages/product/[category]/[slug].tsx`:

```typescript
// Parse short description table data
const shortDescriptionData = useMemo(() => {
  return parseShortDescriptionTableSSR(product.short_description || '');
}, [product.short_description]);
```

### 4. Display

The table now displays dynamic content:

```tsx
<td className="px-3 py-2 text-muted-foreground text-sm break-words">
  {shortDescriptionData.materialSpecifications || 'Plans And Layout'}
</td>
```

## Benefits

1. **Dynamic Content**: Changes in WordPress automatically reflect on the Next.js frontend
2. **No Hardcoded Data**: Eliminates the need to manually update frontend code
3. **Consistent Design**: Maintains the same table design and styling
4. **Fallback Support**: Shows default values if WordPress data is missing

## How to Update Content

1. **In WordPress Admin**:
   - Go to Products → Edit Product
   - Update the "Product short description" field
   - Modify the table content as needed
   - Save the product

2. **Automatic Update**:
   - The Next.js website will automatically fetch the updated content
   - Changes appear within 5 minutes (cache duration)
   - No frontend code changes required

## Supported Fields

The system currently supports these table fields:
- Material Specifications
- Size  
- Materials
- Brand

## Fallback Values

If WordPress data is missing, the system shows these default values:
- Material Specifications: "Plans And Layout"
- Size: "30'X10'X8.6""
- Materials: "Steel & Wood"
- Brand: "SAMAN Portable"

## Technical Details

- **Server-Side Rendering**: Uses regex-based parsing for SSR compatibility
- **Client-Side**: Uses DOM parsing for better accuracy when available
- **Error Handling**: Graceful fallback if parsing fails
- **Performance**: Cached for 5 minutes to reduce API calls

## Testing

The parsing functionality has been tested and is working correctly. It successfully extracts table data from WordPress short descriptions and displays it in the product detail pages.

## Example Output

When the WordPress short description contains:
```html
<table>
  <tr>
    <td>Size</td>
    <td>10'X20'X14'</td>
  </tr>
  <tr>
    <td>Materials</td>
    <td>Steel & Puff Panel</td>
  </tr>
  <tr>
    <td>Brand</td>
    <td>SAMAN Portable</td>
  </tr>
</table>
```

The system will display:
- **Size**: 10'X20'X14'
- **Materials**: Steel & Puff Panel
- **Brand**: SAMAN Portable
