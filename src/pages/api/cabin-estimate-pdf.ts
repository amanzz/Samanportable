import type { NextApiRequest, NextApiResponse } from 'next';

import {
  computeCalculatorEstimate,
  getCalculatorProductName,
  normaliseCalculatorConfig,
} from '@/lib/cabinCalculatorSSR';
import {
  buildCabinEstimatePdf,
  cabinEstimateFilename,
  type DocumentProductMode,
} from '@/lib/cabinEstimateDocument';

type Body = {
  configuration?: unknown;
  documentProductMode?: unknown;
  showGeneralDisclosure?: unknown;
};

function bodyObject(value: unknown): Body {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Body;
  if (typeof value !== 'string') return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Body : {};
  } catch {
    return {};
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = bodyObject(req.body);
  if (!body.configuration || typeof body.configuration !== 'object' || Array.isArray(body.configuration)) {
    return res.status(400).json({ error: 'Invalid estimate configuration' });
  }
  if (body.documentProductMode !== 'selected' && body.documentProductMode !== 'general') {
    return res.status(400).json({ error: 'Invalid document product mode' });
  }
  if (typeof body.showGeneralDisclosure !== 'boolean') {
    return res.status(400).json({ error: 'Invalid disclosure state' });
  }

  try {
    const config = normaliseCalculatorConfig(body.configuration);
    const estimate = computeCalculatorEstimate(config);
    const productName = getCalculatorProductName(config.productId);
    const generatedAt = new Date();
    const input = {
      config,
      estimate,
      productName,
      documentProductMode: body.documentProductMode as DocumentProductMode,
      showGeneralDisclosure: body.showGeneralDisclosure,
      generatedAt,
    };
    const pdf = await buildCabinEstimatePdf(input);
    const filename = cabinEstimateFilename(input);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', String(pdf.length));
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('Unable to generate cabin estimate PDF', error);
    return res.status(400).json({ error: 'Unable to generate estimate document' });
  }
}
