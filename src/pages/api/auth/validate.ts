import { NextApiRequest, NextApiResponse } from 'next';

// DISABLED in the static migration (owner-approved, Phase 2).
// SAMAN is an enquiry-only business: the cart/checkout/WooCommerce-order path
// was removed so the visitor-facing site has zero WordPress dependency.
// Buyers use the enquiry form or contact sales directly.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(410).json({
    error: 'Online ordering is disabled. Please use the enquiry form.',
  });
}
