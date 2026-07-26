import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProductsForFeed } from '@/lib/staticContent';
import { generateGoogleMerchantXml } from '@/lib/merchantFeed';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const xmlFeed = generateGoogleMerchantXml(getAllProductsForFeed());

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(xmlFeed);
  } catch (error) {
    console.error('Error generating Google Merchant feed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
