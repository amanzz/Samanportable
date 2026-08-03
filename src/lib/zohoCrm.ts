type LeadInput = Record<string, unknown>;

type ZohoSearchResult = {
  ok: boolean;
  id?: string;
};

const SOUTH_MARKERS = [
  'andhra pradesh', 'telangana', 'karnataka', 'kerala', 'tamil nadu',
  'puducherry', 'pondicherry', 'goa', 'bengaluru', 'bangalore', 'chennai',
  'hyderabad', 'kochi', 'coimbatore', 'mysuru', 'mysore',
];

function text(value: unknown, max = 255): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function splitName(fullName: string): { First_Name?: string; Last_Name: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return { Last_Name: parts[0] || 'Website Lead' };
  return { First_Name: parts.slice(0, -1).join(' '), Last_Name: parts[parts.length - 1] };
}

function regionalOwner(location: string) {
  const isSouth = SOUTH_MARKERS.some((marker) => location.toLowerCase().includes(marker));
  return {
    Region: isSouth ? 'South India' : 'North India',
    Owner: {
      id: isSouth
        ? (process.env.ZOHO_SOUTH_OWNER_ID || '5751650000000413001')
        : (process.env.ZOHO_NORTH_OWNER_ID || '5751650000001950001'),
    },
  };
}

async function accessToken(): Promise<string | null> {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const accountsUrl = (process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com').replace(/\/$/, '');
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  });
  const response = await fetch(`${accountsUrl}/oauth/v2/token`, { method: 'POST', body: params });
  if (!response.ok) return null;
  const result = await response.json();
  return typeof result.access_token === 'string' ? result.access_token : null;
}

async function findLead(
  token: string,
  apiDomain: string,
  field: 'email' | 'phone',
  value: string,
): Promise<ZohoSearchResult> {
  if (!value) return { ok: true };

  const params = new URLSearchParams({ [field]: value });
  const response = await fetch(`${apiDomain}/crm/v8/Leads/search?${params.toString()}`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });

  if (response.status === 204) return { ok: true };
  if (!response.ok) return { ok: false };

  const result = await response.json();
  const id = result?.data?.[0]?.id;
  return typeof id === 'string' ? { ok: true, id } : { ok: true };
}

async function writeLead(
  token: string,
  apiDomain: string,
  record: Record<string, unknown>,
  existingId?: string,
): Promise<boolean> {
  const url = existingId
    ? `${apiDomain}/crm/v8/Leads/${encodeURIComponent(existingId)}`
    : `${apiDomain}/crm/v8/Leads`;
  const response = await fetch(url, {
    method: existingId ? 'PUT' : 'POST',
    headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [record], trigger: ['workflow'] }),
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result?.data?.[0]?.status === 'success';
}

/** Direct, duplicate-safe CRM upsert. Returns false when credentials are unavailable or CRM rejects the record. */
export async function upsertLabourColonyLead(input: LeadInput): Promise<boolean> {
  const token = await accessToken();
  if (!token) return false;

  const fullName = text(input.firstName, 160);
  const projectLocation = text(input.projectLocation, 160);
  const source = text(input.marketingPlatform, 40) === 'Google Ads' ? 'Google Ads' : 'Website';
  const email = text(input.email, 160);
  const phone = text(input.phone, 24);
  const person = splitName(fullName);
  const regional = regionalOwner(projectLocation);

  const record: Record<string, unknown> = {
    ...person,
    ...regional,
    Company: text(input.companyName, 160),
    Email: email,
    Phone: phone,
    Lead_Source: source === 'Google Ads' ? 'Advertisement' : 'Web Download',
    Lead_Status: 'New',
    Product_Interested: 'Prefab Labor Colony',
    implugin__Product_Name: 'Labour Colony',
    Marketing_Platform: source,
    Project_Location: projectLocation,
    Worker_Capacity: Number(text(input.workerCapacity, 8)) || undefined,
    Required_Configuration: text(input.configuration, 30),
    Required_Date: text(input.requiredDate, 10),
    Purchase_or_Rental: text(input.requirementType, 30),
    Lead_Qualification_Status: 'New Ad Lead',
    Google_Click_ID_GCLID: text(input.gclid, 180),
    Google_Ads_Campaign: text(input.utm_campaign || input.campaignid, 255),
    Google_Ads_Ad_Group: text(input.adgroupid, 100),
    Google_Ads_Keyword: text(input.keyword || input.utm_term, 255),
    Google_Ads_Search_Term: text(input.utm_term, 255),
    Google_Ads_Creative: text(input.creative || input.utm_content, 255),
    UTM_Source: text(input.utm_source, 255),
    UTM_Medium: text(input.utm_medium, 255),
    UTM_Campaign: text(input.utm_campaign, 255),
    UTM_Content: text(input.utm_content, 255),
    UTM_Term: text(input.utm_term, 255),
    Description: [
      `Job Title: ${text(input.jobTitle, 120)}`,
      `Industry / Project Type: ${text(input.industry, 120)}`,
      `Requirement Details: ${text(input.message, 1800)}`,
      `Landing Page: ${text(input.landingPage || input.pageUrl, 500)}`,
      `First Landing Page: ${text(input.firstLandingPage, 500)}`,
      `GBRAID: ${text(input.gbraid, 180)}`,
      `WBRAID: ${text(input.wbraid, 180)}`,
      `Google Lead ID: ${text(input.googleLeadId, 180)}`,
      `Google Form ID: ${text(input.googleFormId, 40)}`,
      `Google Lead Stage: ${text(input.googleLeadStage, 80)}`,
      `Google Lead Source: ${text(input.googleLeadSource, 80)}`,
      `Google Lead Submit Time: ${text(input.googleLeadSubmitTime, 80)}`,
      `Phone OTP Verified: ${text(input.phoneVerified, 20)}`,
      `Google Test Lead: ${text(input.isTest, 20)}`,
      `Match Type: ${text(input.matchtype, 40)} | Device: ${text(input.device, 40)} | Network: ${text(input.network, 40)}`,
    ].join('\n'),
  };
  Object.keys(record).forEach((key) => {
    if (record[key] === '' || record[key] === undefined) delete record[key];
  });

  const apiDomain = (process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com').replace(/\/$/, '');

  // Zoho's upsert duplicate rules depend on fields configured as unique in the
  // CRM layout. Search both identifiers explicitly so a changed email or phone
  // does not create a second contact for the same prospect.
  const emailMatch = await findLead(token, apiDomain, 'email', email);
  if (!emailMatch.ok) return false;
  if (emailMatch.id) return writeLead(token, apiDomain, record, emailMatch.id);

  const phoneMatch = await findLead(token, apiDomain, 'phone', phone);
  if (!phoneMatch.ok) return false;
  return writeLead(token, apiDomain, record, phoneMatch.id);
}

/**
 * The single outbound boundary for the Zoho public GetQuoteForm endpoint.
 *
 * Three API handlers used to `fetch` this URL directly. That meant the
 * integration had no single boundary: stubbing this module in a test did not
 * stop the traffic, and on 03 Aug 2026 a test run sent a real lead. Every call
 * now goes through here, so one stub stops all of them.
 *
 * The payload shape is unchanged from what the three handlers built by hand —
 * same seven fields, same names, same order, same encoding.
 */
const PUBLIC_FORM_ENDPOINT =
  'https://forms.zohopublic.com/samanportable1/form/GetQuoteForm/formperma/-RQ6B5h5-oglLK1XIN6BcUhddk3Z4msxkoTE5r7OBok/htmlRecords/submit';

export interface PublicFormLead {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  /** Product or service. Zoho field Dropdown1. */
  category?: string;
  /** Region. Zoho field Dropdown. */
  region?: string;
  /** Free-text context. Zoho field SingleLine. */
  context?: string;
}

/** Exposed for tests so payload shape can be asserted without a network call. */
export function buildPublicFormPayload(lead: PublicFormLead): URLSearchParams {
  const data = new URLSearchParams();
  data.append('Name_First', lead.firstName || '-');
  data.append('Name_Last', lead.lastName || '-');
  data.append('PhoneNumber_countrycode', lead.phone || '');
  data.append('Email', lead.email || '');
  data.append('Dropdown1', lead.category || '-Select-');
  data.append('Dropdown', lead.region || '-Select-');
  data.append('SingleLine', lead.context || '');
  return data;
}

export async function submitPublicFormLead(
  lead: PublicFormLead
): Promise<{ ok: boolean; status: number }> {
  const response = await fetch(PUBLIC_FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: buildPublicFormPayload(lead).toString(),
  });
  return { ok: response.ok, status: response.status };
}
