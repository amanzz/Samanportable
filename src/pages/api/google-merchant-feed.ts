import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProductsForFeed } from '@/lib/staticContent';
import { generateGoogleMerchantXml, MERCHANT_BASE_URL } from '@/lib/merchantFeed';
import { getAllVariantFeedItems } from '@/lib/feedSources';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // T26: shared source — keeps this byte-identical to the .xml twin.
  const variantItems = getAllVariantFeedItems();
  const xmlFeed = generateGoogleMerchantXml(getAllProductsForFeed(), MERCHANT_BASE_URL, variantItems);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  return res.status(200).send(xmlFeed);
}
