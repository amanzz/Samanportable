import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProductsForFeed } from '@/lib/staticContent';
import { generateGoogleLocalInventoryTsv } from '@/lib/localInventoryFeed';
import { getAllVariantFeedItems } from '@/lib/feedSources';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // T26 — UNIFIED with /feeds/google-local-inventory.tsv. This route previously
    // omitted the variant items entirely, so it published 18 fewer rows than its twin.
    // Passing the shared source makes the two surfaces byte-identical; it only ADDS
    // the rows that were missing here, so nothing an existing consumer reads is lost.
    const tsvFeed = generateGoogleLocalInventoryTsv(getAllProductsForFeed(), getAllVariantFeedItems());

    res.setHeader('Content-Type', 'text/tab-separated-values; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(tsvFeed);
  } catch (error) {
    console.error('Error generating Google local inventory feed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
