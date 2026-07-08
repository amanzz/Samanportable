import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProducts } from '@/lib/staticContent';
import type { ProductFilters } from '@/config/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { page = '1', per_page = '20', category, search, min_price, max_price, on_sale, stock_status, orderby, order } = req.query;

    const filters: ProductFilters = {};

    if (category) {
      filters.category = category as string;
    }

    if (search) {
      filters.search = search as string;
    }

    if (min_price) {
      filters.min_price = parseFloat(min_price as string);
    }

    if (max_price) {
      filters.max_price = parseFloat(max_price as string);
    }

    if (on_sale === 'true') {
      filters.on_sale = true;
    }

    if (stock_status) {
      filters.stock_status = stock_status as 'instock' | 'outofstock' | 'onbackorder';
    }

    if (orderby) {
      filters.orderby = orderby as 'date' | 'price' | 'title' | 'popularity' | 'rating';
    }

    if (order) {
      filters.order = order as 'asc' | 'desc';
    }

    const result = await fetchProducts(parseInt(page as string), parseInt(per_page as string), filters);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
