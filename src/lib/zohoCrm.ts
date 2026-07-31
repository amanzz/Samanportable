type LeadInput = Record<string, unknown>;

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

  const accountsUrl = (process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.in').replace(/\/$/, '');
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

/** Direct, duplicate-safe CRM upsert. Returns false when credentials are unavailable or CRM rejects the record. */
export async function upsertLabourColonyLead(input: LeadInput): Promise<boolean> {
  const token = await accessToken();
  if (!token) return false;

  const fullName = text(input.firstName, 160);
  const projectLocation = text(input.projectLocation, 160);
  const source = text(input.marketingPlatform, 40) === 'Google Ads' ? 'Google Ads' : 'Website';
  const person = splitName(fullName);
  const regional = regionalOwner(projectLocation);

  const record: Record<string, unknown> = {
    ...person,
    ...regional,
    Company: text(input.companyName, 160),
    Email: text(input.email, 160),
    Phone: text(input.phone, 24),
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
      `Industry / Project Type: ${text(input.industry, 120)}`,
      `Requirement Details: ${text(input.message, 1800)}`,
      `Landing Page: ${text(input.landingPage || input.pageUrl, 500)}`,
      `First Landing Page: ${text(input.firstLandingPage, 500)}`,
      `GBRAID: ${text(input.gbraid, 180)}`,
      `WBRAID: ${text(input.wbraid, 180)}`,
      `Match Type: ${text(input.matchtype, 40)} | Device: ${text(input.device, 40)} | Network: ${text(input.network, 40)}`,
    ].join('\n'),
  };
  Object.keys(record).forEach((key) => {
    if (record[key] === '' || record[key] === undefined) delete record[key];
  });

  const apiDomain = (process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.in').replace(/\/$/, '');
  const response = await fetch(`${apiDomain}/crm/v8/Leads/upsert`, {
    method: 'POST',
    headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [record], duplicate_check_fields: ['Email'], trigger: ['workflow'] }),
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result?.data?.[0]?.status === 'success';
}
