import { homepageFaqs } from '@/data/homepageFaqs';

export interface ProductSchema {
  name: string;
  description: string;
  image: string;
  price?: string;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  category?: string;
  brand?: string;
  sku?: string;
  url: string;
}

export interface BlogPostSchema {
  title: string;
  description: string;
  image: string;
  author: string;
  authorUrl?: string;
  datePublished: string;
  dateModified: string;
  url: string;
  category?: string;
}

export const generateProductSchema = (product: ProductSchema) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.priceCurrency || 'INR',
        availability: product.availability || 'InStock',
        url: product.url,
      },
    }),
    ...(product.category && { category: product.category }),
    ...(product.brand && { brand: { '@type': 'Brand', name: product.brand } }),
    ...(product.sku && { sku: product.sku }),
  };
};

export const generateBlogPostSchema = (post: BlogPostSchema) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    author: post.author === 'Saman Portable' ? {
      '@id': 'https://www.samanportable.com/#organization'
    } : {
      '@type': 'Person',
      name: post.author,
      ...(post.authorUrl && { url: post.authorUrl }),
    },
    publisher: {
      '@id': 'https://www.samanportable.com/#organization',
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
    ...(post.category && { articleSection: post.category }),
  };
};

export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.samanportable.com/#organization',
    name: 'Saman Portable',
    legalName: 'SAMAN POS India Private Limited',
    url: 'https://www.samanportable.com',
    logo: 'https://www.samanportable.com/saman-logo.svg',
    foundingDate: '2009',
    description:
      'ISO 9001:2015 certified manufacturer of portable cabins, container offices, security cabins and prefab structures. Manufacturing in Bengaluru and Greater Noida. Delivering across India since 2009. Over 500+ projects delivered.',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-80886-85440',
        contactType: 'Sales',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Kannada'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+91-87960-39938',
        contactType: 'Sales',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sy No 34/2, near India Oil Petrol Pump, Gopasandra',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560099',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.facebook.com/p/SAMAN-Portable-Office-Solutions-is-leading-manufacturer-of-Porta-Cabins-100067811252556/',
      'https://x.com/Saman_Portable',
      'https://www.instagram.com/pos_containerhomes/',
      'https://in.pinterest.com/samanportablecabins/',
    ],
    // Organization-level return policy for Google Merchant Center "Return window"
    // and "Return cost" detection. Mirrors /refund-and-return-policy exactly:
    // 7-day window, return transport paid by the customer, full refund.
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'IN',
      returnPolicyCountry: 'IN',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 7,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
      refundType: 'https://schema.org/FullRefund',
      merchantReturnLink: 'https://www.samanportable.com/refund-and-return-policy',
    },
  };
};

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

export const getLocalBusinessSchemaBengaluru = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.samanportable.com/#localbusiness-bengaluru',
  parentOrganization: { '@id': 'https://www.samanportable.com/#organization' },
  name: 'Saman Portable — Bengaluru',
  description:
    'ISO 9001:2015 certified manufacturer of portable cabins, container offices, security cabins, labour colonies and prefab structures. Serving all of India since 2009. Manufacturing in Bengaluru and Greater Noida.',
  url: 'https://www.samanportable.com',
  logo: 'https://www.samanportable.com/saman-logo.svg',
  image: 'https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp',
  foundingDate: '2009',
  priceRange: '₹₹',
  telephone: ['+918088685440', '+918861622859'],
  email: 'sales@samanportable.com',
  address: {
    '@type': 'PostalAddress',
    name: 'Manufacturing Unit 1 — Bengaluru',
    streetAddress: 'Sy No 34/2, near India Oil Petrol Pump, Gopasandra',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560099',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '12.8509',
    longitude: '77.7291',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '20:00',
    },
  ],
  areaServed: [
    'Karnataka',
    'Tamil Nadu',
    'Andhra Pradesh',
    'Telangana',
    'Kerala',
    'Maharashtra',
    'Goa',
    'Gujarat',
    'Rajasthan',
    'Delhi NCR',
    'Uttar Pradesh',
    'Haryana',
    'Punjab',
    'West Bengal',
    'Odisha',
    'Madhya Pradesh',
    'Jharkhand',
    'Bihar',
    'Assam',
    'Himachal Pradesh',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Portable Cabin & Prefab Structure Products',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Porta Cabin', description: 'Quality-tested steel-frame portable cabins from Rs 1,45,000' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Container Office', description: '20ft and 40ft container offices from Rs 2,25,000' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Security Cabin', description: 'FRP and MS steel security cabins and guard rooms' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Labour Colony', description: 'Modular labour accommodation and bunk house units' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Container Cafe', description: 'Custom container cafes and food kiosks' } },
    ],
  },
});

export const getLocalBusinessSchemaGreaterNoida = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.samanportable.com/#localbusiness-greater-noida',
  parentOrganization: { '@id': 'https://www.samanportable.com/#organization' },
  name: 'Saman Portable — Greater Noida',
  description:
    'ISO 9001:2015 certified manufacturer of portable cabins, container offices, security cabins, labour colonies and prefab structures. Serving all of India since 2009. Manufacturing in Bengaluru and Greater Noida.',
  url: 'https://www.samanportable.com',
  logo: 'https://www.samanportable.com/saman-logo.svg',
  image: 'https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp',
  foundingDate: '2009',
  priceRange: '₹₹',
  telephone: ['+918796039938', '+919708989937'],
  email: 'ncr@samanportable.com',
  address: {
    '@type': 'PostalAddress',
    name: 'Manufacturing Unit 2 — Greater Noida',
    streetAddress: 'Khata No 226, Vill-Jalpura, Bisrakh Rd, Dadri',
    addressLocality: 'Greater Noida',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201308',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '28.5521',
    longitude: '77.4347',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '20:00',
    },
  ],
  areaServed: [
    'Karnataka',
    'Tamil Nadu',
    'Andhra Pradesh',
    'Telangana',
    'Kerala',
    'Maharashtra',
    'Goa',
    'Gujarat',
    'Rajasthan',
    'Delhi NCR',
    'Uttar Pradesh',
    'Haryana',
    'Punjab',
    'West Bengal',
    'Odisha',
    'Madhya Pradesh',
    'Jharkhand',
    'Bihar',
    'Assam',
    'Himachal Pradesh',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Portable Cabin & Prefab Structure Products',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Porta Cabin', description: 'Quality-tested steel-frame portable cabins from Rs 1,45,000' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Container Office', description: '20ft and 40ft container offices from Rs 2,25,000' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Security Cabin', description: 'FRP and MS steel security cabins and guard rooms' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Labour Colony', description: 'Modular labour accommodation and bunk house units' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Container Cafe', description: 'Custom container cafes and food kiosks' } },
    ],
  },
});

export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.samanportable.com/#website',
  name: 'Saman Portable',
  url: 'https://www.samanportable.com',
  publisher: { '@id': 'https://www.samanportable.com/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.samanportable.com/product?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
});

// Built from the SAME array that renders the visible <FAQSection /> on the homepage,
// so the structured data always matches the on-page content (Google FAQ-policy requirement).
export const getHomepageFAQSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://www.samanportable.com/#faqpage',
  mainEntity: homepageFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      // Strip any HTML so the schema carries clean text matching the rendered answer.
      text: faq.answer.replace(/<[^>]*>/g, ''),
    },
  })),
});

export const getAboutPageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://www.samanportable.com/about-us#aboutpage',
  name: 'About SAMAN Portable | India’s Trusted Modular Construction Leader',
  description:
    'Founded in 2009 and incorporated as SAMAN POS India Private Limited in 2019. Over 15 years of portable cabin, container office and prefab structure manufacturing across India.',
  url: 'https://www.samanportable.com/about-us',
  isPartOf: { '@id': 'https://www.samanportable.com/#website' },
  about: { '@id': 'https://www.samanportable.com/#organization' },
  mainEntity: { '@id': 'https://www.samanportable.com/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
      { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://www.samanportable.com/about-us' },
    ],
  },
});

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Extracts FAQ data from raw HTML content and generates an FAQPage schema.
 * Supports Rank Math FAQ blocks, Yoast FAQ blocks, and manual FAQ patterns (Q/A headings/paragraphs).
 */
export const extractFAQSchema = (html: string): object | null => {
  if (!html) return null;

  const faqs: FAQItem[] = [];

  // ── Shared FAQ validation (hardening) ──────────────────────────────────
  // Strip tags + decode common HTML entities to clean plain text.
  const clean = (s: string): string =>
    (s || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#0?39;|&apos;/gi, "'")
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ')
      .trim();

  const QUESTION_WORDS = /^(how|what|why|when|where|who|which|is|are|can|could|should|do|does|will)\b/i;
  // Non-question headings frequently mis-captured as questions by the heading scan.
  const SKIP_HEADINGS = /^(conclusion|summary|final thoughts|overview|introduction|contact us|contact|about us|about|cta|get a quote|process|steps|consultation|site assessment|customized design|proposal|installation|handover|support)\b/i;
  const isQuestionShape = (q: string): boolean => q.endsWith('?') || QUESTION_WORDS.test(q);
  // Reject blobs: emails or long phone-like digit runs (real questions have neither).
  const looksLikeBlob = (q: string): boolean => /@/.test(q) || /\d[\d\s().-]{6,}\d/.test(q);

  // Validate a Q/A pair. requireQuestionShape=true for the unreliable heading-scan fallback.
  const keepPair = (qRaw: string, aRaw: string, requireQuestionShape: boolean): FAQItem | null => {
    const question = clean(qRaw);
    const answer = clean(aRaw);
    if (question.length < 10 || question.length > 200) return null;
    if (answer.length < 20) return null;
    if (SKIP_HEADINGS.test(question)) return null;
    if (looksLikeBlob(question)) return null;
    if (requireQuestionShape && !isQuestionShape(question)) return null;
    return { question, answer };
  };

  // 1. Rank Math FAQ Block (extremely common)
  const questionMatches = [...html.matchAll(/<(?:h[1-6]|div|p|strong)[^>]*class="[^"]*rank-math-question[^"]*"[^>]*>([\s\S]*?)<\/(?:h[1-6]|div|p|strong)>/gi)];
  const answerMatches = [...html.matchAll(/<(?:div|p)[^>]*class="[^"]*rank-math-answer[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/gi)];

  if (questionMatches.length > 0 && questionMatches.length === answerMatches.length) {
    for (let i = 0; i < questionMatches.length; i++) {
      const pair = keepPair(questionMatches[i][1], answerMatches[i][1], false);
      if (pair) faqs.push(pair);
    }
  }

  // 2. Gutenberg / Yoast FAQ Blocks
  if (faqs.length === 0) {
    const yoastQMatches = [...html.matchAll(/<(?:strong|class|h[1-6])[^>]*class="[^"]*schema-faq-question[^"]*"[^>]*>([\s\S]*?)<\/(?:strong|class|h[1-6])>/gi)];
    const yoastAMatches = [...html.matchAll(/<(?:div|p)[^>]*class="[^"]*schema-faq-answer[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/gi)];
    if (yoastQMatches.length > 0 && yoastQMatches.length === yoastAMatches.length) {
      for (let i = 0; i < yoastQMatches.length; i++) {
        const pair = keepPair(yoastQMatches[i][1], yoastAMatches[i][1], false);
        if (pair) faqs.push(pair);
      }
    }
  }

  // 3. Manual FAQs: h2/h3/h4/p starting with "Q:" or "Question:" followed by a paragraph starting with "A:" or "Answer:"
  if (faqs.length === 0) {
    const manualRegex = /<(h[2-4]|p)(?:[^>]*)>\s*(?:<strong>)?\s*(?:Q|Question)\s*[:.-]\s*([\s\S]*?)(?:<\/strong>)?\s*<\/\1>\s*<p(?:[^>]*)>\s*(?:<strong>)?\s*(?:A|Answer)\s*[:.-]\s*([\s\S]*?)(?:<\/strong>)?\s*<\/p>/gi;
    const matches = [...html.matchAll(manualRegex)];
    for (const match of matches) {
      const pair = keepPair(match[2], match[3], false);
      if (pair) faqs.push(pair);
    }
  }

  // 4. Content section after an "FAQ" or "Frequently Asked Questions" heading.
  // This heading-scan is unreliable (it can pick up non-question headings and large
  // content blobs), so each candidate must pass the strict keepPair() question check.
  let usedHeadingScan = false;
  if (faqs.length === 0) {
    usedHeadingScan = true;
    const faqSectionIndex = html.toLowerCase().search(/id="[^"]*faq[^"]*"|class="[^"]*faq[^"]*"|h[2-4][^>]*>\s*(?:faq|frequently\s+asked\s+questions)/i);
    if (faqSectionIndex !== -1) {
      const faqSectionHtml = html.substring(faqSectionIndex);
      const headingRegex = /<(h[3-4])(?:[^>]*)>([\s\S]*?)<\/\1>\s*<p(?:[^>]*)>([\s\S]*?)<\/p>/gi;
      const matches = [...faqSectionHtml.matchAll(headingRegex)];
      for (const match of matches) {
        const pair = keepPair(match[2], match[3], true);
        if (pair) faqs.push(pair);
      }
    }
  }

  // Reliable Rank Math/Yoast/manual blocks may emit with >=1 valid pair; the unreliable
  // heading-scan must produce >=2 valid Q&A pairs to emit a FAQPage at all.
  const minRequired = usedHeadingScan ? 2 : 1;
  if (faqs.length < minRequired) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Format raw date string to valid ISO8601 standard with timezone offset (+05:30 for IST)
 */
export const formatISO8601WithOffset = (dateString: string, offset: string = '+05:30'): string => {
  if (!dateString) return '';
  // If date already includes timezone info (ends with Z or has +/-xx:xx offset)
  if (dateString.endsWith('Z') || dateString.match(/[+-]\d{2}:\d{2}$/)) {
    return dateString;
  }
  return `${dateString}${offset}`;
};

/**
 * City/location porta-cabin service landing pages (allowlisted slug prefixes only).
 * Returns a clean `Service` node built from backend post data, or null for any
 * non-allowlisted slug. Never adds Offer/AggregateRating/Review (no price/reviews are
 * shown on these pages). provider reuses the existing Organization @id (no duplicate node).
 */
interface CityServiceCluster {
  prefix: RegExp;
  namePrefix: string;
  serviceType: string;
  // Optional cluster-level enrichments emitted on the Service node for every city
  // page in that cluster. Safe schema.org/Service fields only — never Product/Review/Rating.
  termsOfService?: string;
  offerCatalogName?: string;
  offers?: string[];
}

const CITY_SERVICE_CLUSTERS: CityServiceCluster[] = [
  {
    prefix: /^(?:porta-cabins-in-|porta-cabin-in-|portacabins-for-sale-in-|affordable-porta-cabins-in-)(.+)$/i,
    namePrefix: 'Porta Cabins in',
    serviceType: 'Porta Cabin Supply & Installation',
  },
  {
    prefix: /^(?:container-cafes-in-|container-cafe-in-)(.+)$/i,
    namePrefix: 'Container Cafe in',
    serviceType: 'Container Cafe Manufacturing and Installation',
    termsOfService:
      '5 years structural frame and base; 1–2 years finishing; 20–25 years engineered service life',
    offerCatalogName: 'Container cafe formats',
    offers: [
      'Coffee / takeaway kiosk container cafe',
      'Compact sit-in container cafe',
      'Full kitchen-ready container cafe',
      'Multi-unit / event container cafe',
    ],
  },
];

const AREA_ACRONYMS: Record<string, string> = { ncr: 'NCR', hsr: 'HSR', btm: 'BTM', jp: 'JP', kr: 'KR', orr: 'ORR' };

// Slugs that match the city prefixes but are NOT a location (no Service schema).
const NON_LOCATION_AREAS = new Set(['construction']);

// Optional per-city enrichment for areaServed: approximate district/city centroid
// (lat/lng) + canonical Wikipedia URL (sameAs). Keyed by normalised area name
// (lower-cased). Cities not in the map still emit a valid plain Place (name only).
const CITY_GEO: Record<string, { lat: number; lng: number; sameAs: string }> = {
  'west delhi': { lat: 28.6663, lng: 77.0667, sameAs: 'https://en.wikipedia.org/wiki/West_Delhi_district' },
  'north delhi': { lat: 28.7186, lng: 77.2167, sameAs: 'https://en.wikipedia.org/wiki/North_Delhi_district' },
  'south delhi': { lat: 28.4817, lng: 77.1873, sameAs: 'https://en.wikipedia.org/wiki/South_Delhi_district' },
  'east delhi': { lat: 28.6279, lng: 77.2952, sameAs: 'https://en.wikipedia.org/wiki/East_Delhi_district' },
  'central delhi': { lat: 28.6469, lng: 77.2167, sameAs: 'https://en.wikipedia.org/wiki/Central_Delhi_district' },
  'noida': { lat: 28.5355, lng: 77.3910, sameAs: 'https://en.wikipedia.org/wiki/Noida' },
  'greater noida': { lat: 28.4744, lng: 77.5040, sameAs: 'https://en.wikipedia.org/wiki/Greater_Noida' },
  'ghaziabad': { lat: 28.6692, lng: 77.4538, sameAs: 'https://en.wikipedia.org/wiki/Ghaziabad' },
  'gurgaon': { lat: 28.4595, lng: 77.0266, sameAs: 'https://en.wikipedia.org/wiki/Gurgaon' },
  'faridabad': { lat: 28.4089, lng: 77.3178, sameAs: 'https://en.wikipedia.org/wiki/Faridabad' },
};

const matchCityServiceCluster = (slug: string): { area: string; cluster: CityServiceCluster } | null => {
  for (const cluster of CITY_SERVICE_CLUSTERS) {
    const m = (slug || '').match(cluster.prefix);
    if (!m) continue;
    if (NON_LOCATION_AREAS.has(m[1].toLowerCase())) return null;
    const area = m[1]
      .split('-')
      .filter(Boolean)
      .map(w => AREA_ACRONYMS[w.toLowerCase()] || (w.charAt(0).toUpperCase() + w.slice(1)))
      .join(' ');
    return { area, cluster };
  }
  return null;
};

export const getCityServiceArea = (slug: string): string | null => {
  const matched = matchCityServiceCluster(slug);
  return matched ? matched.area : null;
};

export const getCityServiceSchema = (params: {
  slug: string;
  description?: string;
  image?: string;
  url: string;
}): object | null => {
  const matched = matchCityServiceCluster(params.slug);
  if (!matched) return null;
  const { area, cluster } = matched;
  const description = (params.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
  // areaServed: plain Place by default; enriched with GeoCoordinates + Wikipedia
  // sameAs when the city is present in CITY_GEO. Both are valid on schema.org/Place.
  const geo = CITY_GEO[area.toLowerCase()];
  const areaServedPlace: Record<string, unknown> = { '@type': 'Place', name: area };
  if (geo) {
    areaServedPlace.geo = { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng };
    areaServedPlace.sameAs = geo.sameAs;
  }
  return {
    '@type': 'Service',
    '@id': `${params.url}#service`,
    name: `${cluster.namePrefix} ${area}`,
    serviceType: cluster.serviceType,
    ...(description && { description }),
    provider: { '@id': 'https://www.samanportable.com/#organization' },
    areaServed: areaServedPlace,
    url: params.url,
    ...(params.image && { image: params.image }),
    // Cluster-level enrichments (e.g. container cafe): warranty terms + an INR
    // OfferCatalog of formats. Emitted only when the cluster config defines them.
    ...(cluster.termsOfService && { termsOfService: cluster.termsOfService }),
    ...(cluster.offers && cluster.offers.length > 0 && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: cluster.offerCatalogName || `${cluster.namePrefix} ${area}`,
        itemListElement: cluster.offers.map((offerName) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: offerName },
          priceCurrency: 'INR',
        })),
      },
    }),
    // NOTE: do NOT add `inLanguage` or `isPartOf` here — not valid schema.org/Service
    // properties. Page-level inLanguage/isPartOf live on WebPage/BlogPosting nodes.
  };
};

/**
 * Generate a complete, interconnected schema graph for a blog post
 */
export const generateUnifiedBlogGraph = (params: {
  postSchema: BlogPostSchema;
  breadcrumbs: Array<{ name: string; url: string }>;
  faqSchema: any | null;
  serviceSchema?: any | null;
}) => {
  const { postSchema, breadcrumbs, faqSchema, serviceSchema } = params;
  const postUrl = postSchema.url;
  
  const webpageId = `${postUrl}#webpage`;
  const blogpostId = `${postUrl}#blogposting`;
  const breadcrumbId = `${postUrl}#breadcrumb`;
  const faqpageId = `${postUrl}#faqpage`;

  const org = generateOrganizationSchema();
  const website = getWebSiteSchema();

  // Create WebPage schema
  const webpage = {
    '@type': 'WebPage',
    '@id': webpageId,
    url: postUrl,
    name: postSchema.title,
    description: postSchema.description,
    isPartOf: { '@id': 'https://www.samanportable.com/#website' },
    publisher: { '@id': 'https://www.samanportable.com/#organization' },
    breadcrumb: { '@id': breadcrumbId },
    inLanguage: 'en-IN',
  };

  // Create BreadcrumbList schema
  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  // Format publication/modification dates with Indian offset (+05:30)
  const datePublishedFormatted = formatISO8601WithOffset(postSchema.datePublished);
  const dateModifiedFormatted = formatISO8601WithOffset(postSchema.dateModified);

  // Create BlogPosting schema
  const blogPosting = {
    '@type': 'BlogPosting',
    '@id': blogpostId,
    isPartOf: { '@id': webpageId },
    mainEntityOfPage: { '@id': webpageId },
    headline: postSchema.title,
    description: postSchema.description,
    image: postSchema.image,
    author: postSchema.author === 'Saman Portable' ? {
      '@id': 'https://www.samanportable.com/#organization'
    } : {
      '@type': 'Person',
      name: postSchema.author,
      ...(postSchema.authorUrl && { url: postSchema.authorUrl })
    },
    publisher: {
      '@id': 'https://www.samanportable.com/#organization',
    },
    datePublished: datePublishedFormatted,
    dateModified: dateModifiedFormatted,
    ...(postSchema.category && { articleSection: postSchema.category }),
    inLanguage: 'en-IN',
  };

  const graph: any[] = [
    {
      ...org,
      '@context': undefined // Strip duplicate contexts inside graph
    },
    {
      ...website,
      '@context': undefined
    },
    webpage,
    breadcrumbList,
    blogPosting
  ];

  if (faqSchema) {
    const faqEntity = {
      ...faqSchema,
      '@context': undefined,
      '@id': faqpageId,
      isPartOf: { '@id': webpageId }
    };
    graph.push(faqEntity);
  }

  // Optional Service node for allowlisted city/location landing pages. Coexists with
  // BlogPosting; provider references the Organization @id already in the graph.
  if (serviceSchema) {
    // `isPartOf` is intentionally NOT added here — it is not a valid property of
    // schema.org/Service. The Service node links to the page via its provider
    // (Organization @id) and its own @id; page-level isPartOf stays on WebPage.
    graph.push({
      ...serviceSchema,
      '@context': undefined,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
};

