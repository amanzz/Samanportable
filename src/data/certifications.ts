// Certifications, registrations and manufacturer-proof data for SAMAN POS India Pvt. Ltd.
// Single source of truth for the About certifications section, the home trust strip and
// the product manufacturer strip. Every value below is taken verbatim from a real
// certificate/registration document on file — no invented numbers, dates or claims.
//
// publicPdf === true  -> a public-safe PDF exists in /public/certifications and may be linked.
// publicPdf === false -> document is summary-card-only (raw PDF withheld or not yet supplied).
//
// Public-link decisions (owner-reviewed 2026-06-15):
//  - Udyam print (msme.pdf): owner explicitly chose to publish the full print as-is after
//    being warned it exposes bank account number, PAN and turnover. Linked publicly.
//    RECOMMENDED before deploy: swap in a redacted Udyam PDF (bank/PAN/turnover blacked out).
//  - ZED Bronze: owner supplied bronze-zed.pdf on 2026-06-15 -> now published publicly.

export type CredentialCategory = 'quality' | 'environment' | 'safety' | 'government' | 'tax' | 'governance';

export interface Credential {
  key: string;
  /** Short, buyer-facing certificate / registration name. */
  name: string;
  /** One-line scope shown under the name. */
  scope: string;
  /** Issuing authority. */
  issuer: string;
  /** Certificate / registration number, only where safe to show publicly. */
  number?: string;
  /** Validity end where the document states one. */
  validUntil?: string;
  /** One plain-English buyer benefit line. */
  benefit: string;
  category: CredentialCategory;
  /** Public PDF filename inside /certifications, when allowed. */
  pdf?: string;
  publicPdf: boolean;
}

// The two verified GST registrations of SAMAN POS India Private Limited, taken verbatim from
// the GST certificates on file. Declared here as the single source: the CERTIFICATIONS entries
// below, the header GST badge and the footer regional cards all read these — so a GSTIN can
// never drift between surfaces. Never edit a character without the certificate in hand.
export const GSTIN_KARNATAKA = '29ABBCS7101B1ZR';
export const GSTIN_UTTAR_PRADESH = '09ABBCS7101B1ZT';

/** GSTINs paired with the state that issued them, in header/footer display order. */
export const GST_REGISTRATIONS: ReadonlyArray<{ state: string; gstin: string }> = [
  { state: 'Karnataka', gstin: GSTIN_KARNATAKA },
  { state: 'Uttar Pradesh', gstin: GSTIN_UTTAR_PRADESH },
];

export const CERTIFICATIONS: Credential[] = [
  {
    key: 'iso-9001',
    name: 'ISO 9001:2015',
    scope: 'Quality Management System',
    issuer: 'Royal Assessments Pvt. Ltd. (EGAC / IAF accredited)',
    number: 'E20250218645',
    validUntil: '12 Feb 2028',
    benefit: 'Independently audited quality control across design, fabrication and finishing.',
    category: 'quality',
    pdf: 'saman-pos-iso-9001-2015-quality-management-certificate.pdf',
    publicPdf: true,
  },
  {
    key: 'iso-14001',
    name: 'ISO 14001:2015',
    scope: 'Environmental Management System',
    issuer: 'Royal Assessments Pvt. Ltd. (EGAC / IAF accredited)',
    number: 'E20250218646',
    validUntil: '12 Feb 2028',
    benefit: 'Environmental controls built into how every unit is manufactured.',
    category: 'environment',
    pdf: 'saman-pos-iso-14001-2015-environmental-management-certificate.pdf',
    publicPdf: true,
  },
  {
    key: 'iso-45001',
    name: 'ISO 45001:2018',
    scope: 'Occupational Health & Safety Management System',
    issuer: 'Royal Assessments Pvt. Ltd. (EGAC / IAF accredited)',
    number: 'E20250218647',
    validUntil: '12 Feb 2028',
    benefit: 'Worker health and safety managed to an international standard.',
    category: 'safety',
    pdf: 'saman-pos-iso-45001-2018-health-safety-certificate.pdf',
    publicPdf: true,
  },
  {
    key: 'nsic',
    name: 'NSIC Government Purchase Enlistment',
    scope: 'NSIC-enlisted OEM supplier (Single Point Registration)',
    issuer: 'National Small Industries Corporation (Government of India)',
    number: 'NSIC/GP/BAN/2024/0055207',
    validUntil: '23 Mar 2027',
    benefit: 'Enlisted as an OEM supplier eligible for government store purchase.',
    category: 'government',
    pdf: 'saman-pos-nsic-government-purchase-enlistment.pdf',
    publicPdf: true,
  },
  {
    key: 'udyam',
    name: 'Udyam Registration',
    scope: 'Government-registered manufacturing (MSME) enterprise',
    issuer: 'Ministry of Micro, Small & Medium Enterprises, Government of India',
    number: 'UDYAM-KR-03-0172770',
    benefit: 'Officially registered manufacturer under the MSME framework.',
    category: 'government',
    // Owner-approved 2026-06-15 to publish the full print. NOTE: raw print still shows
    // bank account / PAN / turnover — recommend a redacted replacement before deploy.
    pdf: 'saman-pos-udyam-registration-certificate.pdf',
    publicPdf: true,
  },
  {
    key: 'zed-bronze',
    name: 'ZED Bronze',
    scope: 'MSME Sustainable (Zero Defect Zero Effect) Certification',
    issuer: 'Quality Council of India · Ministry of MSME',
    benefit: 'Recognised for quality and sustainable manufacturing practices.',
    category: 'government',
    // Owner supplied bronze-zed.pdf on 2026-06-15 -> published.
    pdf: 'saman-pos-zed-bronze-msme-certificate.pdf',
    publicPdf: true,
  },
  {
    key: 'startup-india',
    name: 'Startup India Recognition',
    scope: 'DPIIT-recognised company',
    issuer: 'Dept. for Promotion of Industry & Internal Trade (DPIIT)',
    number: 'DIPP56005',
    benefit: 'Government-recognised company under the Startup India initiative.',
    category: 'government',
    pdf: 'saman-pos-startup-india-recognition-certificate.pdf',
    publicPdf: true,
  },
  {
    key: 'gst-karnataka',
    name: 'GST — Karnataka',
    scope: 'Bengaluru manufacturing unit (560099)',
    issuer: 'Goods & Services Tax, Government of India',
    number: GSTIN_KARNATAKA,
    benefit: 'A GST-registered business at our Bengaluru factory.',
    category: 'tax',
    pdf: 'saman-pos-gst-karnataka-certificate.pdf',
    publicPdf: true,
  },
  {
    key: 'gst-up',
    name: 'GST — Uttar Pradesh',
    scope: 'Greater Noida manufacturing unit (201308)',
    issuer: 'Goods & Services Tax, Government of India',
    number: GSTIN_UTTAR_PRADESH,
    benefit: 'A GST-registered business at our Greater Noida factory.',
    category: 'tax',
    pdf: 'saman-pos-gst-uttar-pradesh-greater-noida-certificate.pdf',
    publicPdf: true,
  },
  {
    key: 'cvc-integrity',
    name: 'Integrity Pledge',
    scope: 'Business ethics & governance',
    issuer: 'Central Vigilance Commission',
    benefit: 'A public commitment to ethical, corruption-free business conduct.',
    category: 'governance',
    pdf: 'saman-pos-cvc-integrity-pledge.pdf',
    publicPdf: true,
  },
];

/** Credentials shown as the main proof grid (everything except the governance pledge). */
export const PROOF_CREDENTIALS = CERTIFICATIONS.filter((c) => c.category !== 'governance');

/** Governance / ethics items, shown separately and lower-key on the About page. */
export const GOVERNANCE_CREDENTIALS = CERTIFICATIONS.filter((c) => c.category === 'governance');

/** Compact label list for the homepage trust strip. */
export const HOME_TRUST_CHIPS: string[] = [
  'ISO 9001:2015 certified',
  'NSIC-enlisted OEM supplier',
  'Udyam registered',
  'ZED Bronze',
  'GST registered',
];

/** One-line manufacturer proof used on product pages. */
export const PRODUCT_TRUST_LINE =
  'Built by a verified manufacturer: ISO 9001:2015 certified, Udyam registered, NSIC-enlisted, GST registered.';
