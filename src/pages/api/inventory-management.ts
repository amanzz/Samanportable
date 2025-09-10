import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProducts } from '@/config/api';

// Inventory Management API
// This API helps manage inventory data and provides endpoints for stock updates
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetInventory(req, res);
    case 'POST':
      return handleUpdateInventory(req, res);
    case 'PUT':
      return handleBulkUpdateInventory(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return res.status(405).json({ message: `Method ${method} not allowed` });
  }
}

// Get current inventory status for all products
async function handleGetInventory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { product_id, category, stock_status } = req.query;
    
    // Fetch products with inventory data
    const allProducts = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore && page <= 50) {
      const result = await fetchProducts(page, 100);
      
      if (result.products && result.products.length > 0) {
        allProducts.push(...result.products);
        hasMore = result.pagination.hasNextPage;
        page++;
      } else {
        hasMore = false;
      }
    }

    // Filter products based on query parameters
    let filteredProducts = allProducts;

    if (product_id) {
      filteredProducts = filteredProducts.filter(p => p.id === parseInt(product_id as string));
    }

    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.categories?.some(c => c.slug === category || c.id === parseInt(category as string))
      );
    }

    if (stock_status) {
      filteredProducts = filteredProducts.filter(p => p.stock_status === stock_status);
    }

    // Return inventory data
    const inventoryData = filteredProducts.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      stock_status: product.stock_status,
      stock_quantity: product.stock_quantity,
      price: product.price,
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      on_sale: product.on_sale,
      last_updated: new Date().toISOString(),
      categories: product.categories?.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug
      })) || []
    }));

    res.status(200).json({
      success: true,
      data: inventoryData,
      total: inventoryData.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Update inventory for a single product
async function handleUpdateInventory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { product_id, stock_status, stock_quantity, price, sale_price } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Validate stock status
    const validStockStatuses = ['instock', 'outofstock', 'onbackorder'];
    if (stock_status && !validStockStatuses.includes(stock_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock status. Must be one of: instock, outofstock, onbackorder'
      });
    }

    // Validate stock quantity
    if (stock_quantity !== undefined && (isNaN(stock_quantity) || stock_quantity < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Stock quantity must be a non-negative number'
      });
    }

    // In a real implementation, you would update the WooCommerce database here
    // For now, we'll return a success response with the updated data
    const updatedData = {
      id: product_id,
      stock_status: stock_status || 'instock',
      stock_quantity: stock_quantity !== undefined ? stock_quantity : 1,
      price: price || null,
      sale_price: sale_price || null,
      last_updated: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'Inventory updated successfully',
      data: updatedData
    });

  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Bulk update inventory for multiple products
async function handleBulkUpdateInventory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates array is required and must not be empty'
      });
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const { product_id, stock_status, stock_quantity, price, sale_price } = update;

        if (!product_id) {
          errors.push({
            product_id: product_id || 'unknown',
            error: 'Product ID is required'
          });
          continue;
        }

        // Validate stock status
        const validStockStatuses = ['instock', 'outofstock', 'onbackorder'];
        if (stock_status && !validStockStatuses.includes(stock_status)) {
          errors.push({
            product_id,
            error: 'Invalid stock status'
          });
          continue;
        }

        // Validate stock quantity
        if (stock_quantity !== undefined && (isNaN(stock_quantity) || stock_quantity < 0)) {
          errors.push({
            product_id,
            error: 'Invalid stock quantity'
          });
          continue;
        }

        // In a real implementation, you would update the WooCommerce database here
        const updatedData = {
          id: product_id,
          stock_status: stock_status || 'instock',
          stock_quantity: stock_quantity !== undefined ? stock_quantity : 1,
          price: price || null,
          sale_price: sale_price || null,
          last_updated: new Date().toISOString()
        };

        results.push(updatedData);

      } catch (error) {
        errors.push({
          product_id: update.product_id || 'unknown',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Bulk update completed. ${results.length} products updated, ${errors.length} errors`,
      data: {
        updated: results,
        errors: errors
      },
      summary: {
        total: updates.length,
        successful: results.length,
        failed: errors.length
      }
    });

  } catch (error) {
    console.error('Error in bulk inventory update:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
