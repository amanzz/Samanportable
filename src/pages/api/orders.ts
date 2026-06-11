import { NextApiRequest, NextApiResponse } from 'next';

// DISABLED in the static migration (owner-approved, Phase 2).
// SAMAN is an enquiry-only business: the cart/checkout/WooCommerce-order path
// was removed so the visitor-facing site has zero WordPress dependency.
// Buyers use the Call button (tel:+916200909435) or the Send Enquiry form (Zoho).
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(410).json({
    error: 'Online ordering is disabled. Please call +91 62009 09435 or use the enquiry form.',
  });
}
