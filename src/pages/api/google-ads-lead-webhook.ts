import type { NextApiRequest, NextApiResponse } from 'next';
import { upsertLabourColonyLead } from '@/lib/zohoCrm';

type GoogleLeadColumn = {
  column_id?: unknown;
  column_name?: unknown;
  string_value?: unknown;
};

type GoogleLeadPayload = {
  lead_id?: unknown;
  user_column_data?: unknown;
  api_version?: unknown;
  form_id?: unknown;
  campaign_id?: unknown;
  google_key?: unknown;
  is_test?: unknown;
  gcl_id?: unknown;
  adgroup_id?: unknown;
  creative_id?: unknown;
  lead_stage?: unknown;
  lead_submit_time?: unknown;
  lead_source?: unknown;
};

function stringValue(value: unknown, max = 500): string {
  if (typeof value === 'string') return value.trim().slice(0, max);
  if (typeof value === 'number' || typeof value === 'bigint') return String(value).slice(0, max);
  return '';
}

function booleanValue(value: unknown): boolean {
  return value === true || stringValue(value).toLowerCase() === 'true';
}

function normaliseQuestion(value: unknown): string {
  return stringValue(value, 500).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function columnsFrom(payload: GoogleLeadPayload): {
  byId: Record<string, string>;
  byName: Record<string, string>;
} {
  const byId: Record<string, string> = {};
  const byName: Record<string, string> = {};
  const columns = Array.isArray(payload.user_column_data)
    ? payload.user_column_data as GoogleLeadColumn[]
    : [];

  for (const column of columns) {
    if (!column || typeof column !== 'object') continue;
    const id = stringValue(column.column_id, 120).toUpperCase();
    const name = normaliseQuestion(column.column_name);
    const value = stringValue(column.string_value, 2000);
    if (id && value) byId[id] = value;
    if (name && value) byName[name] = value;
  }

  return { byId, byName };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const configuredKey = process.env.GOOGLE_ADS_LEAD_WEBHOOK_KEY;
  if (!configuredKey) {
    return res.status(503).json({ message: 'Webhook is not configured' });
  }

  const payload = (req.body && typeof req.body === 'object' ? req.body : {}) as GoogleLeadPayload;
  if (stringValue(payload.google_key, 200) !== configuredKey) {
    return res.status(401).json({ message: 'Invalid webhook key' });
  }

  const { byId, byName } = columnsFrom(payload);
  const fullName = byId.FULL_NAME || [byId.FIRST_NAME, byId.LAST_NAME].filter(Boolean).join(' ');
  const email = byId.WORK_EMAIL || byId.EMAIL;
  const phone = byId.PHONE_NUMBER || byId.WORK_PHONE;
  const industry = byId.CATEGORY
    || byName['which category does your project fall into']
    || byId.JOB_INDUSTRY;
  const isTest = booleanValue(payload.is_test);

  if (!fullName || !email || !phone) {
    return res.status(422).json({ message: 'Required Google lead fields are missing' });
  }

  const accepted = await upsertLabourColonyLead({
    firstName: isTest ? `Google Ads Test - ${fullName}` : fullName,
    email,
    phone,
    companyName: byId.COMPANY_NAME,
    jobTitle: byId.JOB_TITLE,
    projectLocation: byId.CITY || byId.PREFERRED_LOCATION || byId.REGION,
    industry,
    message: 'Submitted through the Google Ads native Labour Colony lead form.',
    isLabourColony: true,
    marketingPlatform: 'Google Ads',
    leadSource: 'Google Ads',
    gclid: stringValue(payload.gcl_id, 180),
    campaignid: stringValue(payload.campaign_id, 40),
    adgroupid: stringValue(payload.adgroup_id, 40),
    creative: stringValue(payload.creative_id, 40),
    googleLeadId: stringValue(payload.lead_id, 180),
    googleFormId: stringValue(payload.form_id, 40),
    googleLeadStage: stringValue(payload.lead_stage, 80),
    googleLeadSubmitTime: stringValue(payload.lead_submit_time, 80),
    googleLeadSource: stringValue(payload.lead_source, 80),
    phoneVerified: byId.PHONE_NUMBER_VERIFIED || 'Required by Google Ads form',
    isTest: String(isTest),
    pageUrl: 'Google Ads native lead form',
    landingPage: 'Google Ads native lead form',
  });

  if (!accepted) {
    return res.status(503).json({ message: 'Zoho CRM did not accept the lead' });
  }

  // Google requires an HTTP 200 with an empty JSON object for successful delivery.
  return res.status(200).json({});
}
