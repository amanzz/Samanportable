import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProductsForFeed } from '@/lib/staticContent';
import { generateGoogleMerchantXml } from '@/lib/merchantFeed';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const xmlFeed = generateGoogleMerchantXml(getAllProductsForFeed());

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  return res.status(200).send(xmlFeed);
}
