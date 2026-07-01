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

/**
 * Generic WebPage node for static pages (gallery, policy pages) that otherwise
 * carry no meaningful schema. Links to the site Organization/WebSite by @id —
 * no duplicate Organization node. Safe, additive: no Product/Service/Review.
 */
export const generateWebPageSchema = (params: { url: string; name: string; description?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${params.url}#webpage`,
  url: params.url,
  name: params.name,
  ...(params.description ? { description: params.description } : {}),
  isPartOf: { '@id': 'https://www.samanportable.com/#website' },
  publisher: { '@id': 'https://www.samanportable.com/#organization' },
  inLanguage: 'en-IN',
});

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
    latitude: '12.851009',
    longitude: '77.729225',
  },
  identifier: [
    { '@type': 'PropertyValue', name: 'GSTIN', value: '29ABBCS7101B1ZR' },
    { '@type': 'PropertyValue', name: 'ISO 9001:2015', value: 'E20250218645' },
    { '@type': 'PropertyValue', name: 'ISO 14001:2015', value: 'E20250218646' },
    { '@type': 'PropertyValue', name: 'ISO 45001:2018', value: 'E20250218647' },
    { '@type': 'PropertyValue', name: 'NSIC', value: 'NSIC/GP/BAN/2024/0055207' },
    { '@type': 'PropertyValue', name: 'DPIIT', value: 'DIPP56005' },
  ],
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
    latitude: '28.552251',
    longitude: '77.439618',
  },
  identifier: [
    { '@type': 'PropertyValue', name: 'GSTIN', value: '09ABBCS7101B1ZT' },
    { '@type': 'PropertyValue', name: 'ISO 9001:2015', value: 'E20250218645' },
    { '@type': 'PropertyValue', name: 'ISO 14001:2015', value: 'E20250218646' },
    { '@type': 'PropertyValue', name: 'ISO 45001:2018', value: 'E20250218647' },
    { '@type': 'PropertyValue', name: 'NSIC', value: 'NSIC/GP/BAN/2024/0055207' },
    { '@type': 'PropertyValue', name: 'DPIIT', value: 'DIPP56005' },
  ],
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

const withoutHomepageCommercialFields = (schema: Record<string, unknown>) => {
  const { hasOfferCatalog, priceRange, ...schemaWithoutCommercialFields } = schema;
  return schemaWithoutCommercialFields;
};

export const getHomepageLocalBusinessGraphSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    withoutHomepageCommercialFields(getLocalBusinessSchemaBengaluru()),
    withoutHomepageCommercialFields(getLocalBusinessSchemaGreaterNoida()),
  ],
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

const faqSchemaFromItems = (items: FAQItem[]): object => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

const FAQ_SCHEMA_OVERRIDES: Record<string, FAQItem[]> = {
  'container-office-in-mangalore': [
    {
      question: "How much does a container office cost in Mangalore?",
      answer: "Price depends on size, insulation, weather/corrosion protection, partitions, electricals and fit-out. A bare 10 ft gate cabin and a fully fitted 40 ft project office sit far apart on cost. We quote to your exact specification — share your requirement for an itemised price.",
    },
    {
      question: "How long does delivery take to Mangalore?",
      answer: "We dispatch from our Bangalore factory, around 350 km away on NH75 via Hassan and the Shiradi ghat, with typical road transit of 3-5 days once the unit is built. We confirm the schedule at order stage based on your site location and access.",
    },
    {
      question: "Are the units suitable for port, refinery and coastal sites?",
      answer: "Yes. We can add extra weather and corrosion protection, galvanised roofing with proper drainage, and the insulation and fit-out your site needs. Tell us the conditions and intended use and we configure the unit accordingly.",
    },
    {
      question: "Can the container office be moved between sites later?",
      answer: "Yes. Container offices are relocatable. If you expect to shift the unit between project sites, tell us at order stage so we specify lifting points and a shell suited to repeated handling.",
    },
  ],
  'container-office-in-mysore': [
    {
      question: "How much does a container office cost in Mysore?",
      answer: "Price depends on size, insulation, partitions, electricals and fit-out. A bare 10 ft security cabin and a fully fitted 40 ft project office sit far apart on cost. We quote to your exact specification — share your requirement for an itemised price.",
    },
    {
      question: "How quickly can you deliver to Mysore?",
      answer: "Mysore is about 145 km from our Bangalore factory, so it is one of our fastest South routes. Typical road transit is 3-5 days once the unit is built, often quicker given the short distance. We confirm the schedule at order stage.",
    },
    {
      question: "Can I visit the factory before ordering?",
      answer: "Yes. Because Mysore is close to our Bangalore plant, you are welcome to see the build and finish quality before you place an order. Contact us to arrange a visit.",
    },
    {
      question: "Can the container office be moved between sites later?",
      answer: "Yes. Container offices are relocatable. If you expect to shift the unit between project sites, tell us at order stage so we specify lifting points and a shell suited to repeated handling.",
    },
  ],
  'container-office-in-madurai': [
    {
      question: "How much does a container office cost in Madurai?",
      answer: "Price depends on size, insulation, partitions, electricals and fit-out. A bare 10 ft gate cabin and a fully fitted 40 ft project office sit far apart on cost. We quote to your exact specification — share your requirement for an itemised price.",
    },
    {
      question: "How long does delivery take to Madurai?",
      answer: "We dispatch from our Bangalore factory, around 440 km away via the Salem–Dindigul corridor, with typical road transit of 3–5 days once the unit is built. We confirm the schedule at order stage based on your site location and access.",
    },
    {
      question: "Do you supply site offices for hospital and institutional construction projects?",
      answer: "Yes. Institutional and medical construction — including the AIIMS / Thoppur belt — is a major source of demand around Madurai. We supply site offices, engineer cabins and security posts, and can relocate units as the project progresses.",
    },
    {
      question: "Can the container office be moved between sites later?",
      answer: "Yes. Container offices are relocatable. If you expect to shift the unit between project sites, tell us at order stage so we specify lifting points and a shell suited to repeated handling.",
    },
  ],
  'container-office-in-surat': [
    {
      question: "How much does a container office cost in Surat?",
      answer: "Price depends on size, insulation, corrosion protection, partitions, electricals and fit-out, plus the long-distance transport. A bare 10 ft gate cabin and a fully fitted 40 ft project office sit far apart on cost. We quote to your exact specification — share your requirement for an itemised price.",
    },
    {
      question: "How long does delivery take to Surat?",
      answer: "Surat is roughly 1,100 km from our Greater Noida factory, so it is a longer haul. We confirm a realistic transit window at order stage based on your site location and access, and dispatch once the unit is built.",
    },
    {
      question: "Are the units suitable for Hazira heavy-industry and coastal sites?",
      answer: "Yes. We can build on a reinforced shell with extra corrosion protection and the insulation and fit-out your site needs for Hazira and the humid coastal belt. Tell us the conditions and intended use and we configure accordingly.",
    },
    {
      question: "Can the container office be moved between sites later?",
      answer: "Yes. Container offices are relocatable. If you expect to shift the unit between project sites, tell us at order stage so we specify lifting points and a shell suited to repeated handling.",
    },
  ],
  'porta-cabin-in-hosur': [
    {
      question: "Can you deliver a porta cabin inside SIPCOT Phase 2 Hosur?",
      answer: "Yes. We deliver to SIPCOT Phase 1 (PIN 635126) and SIPCOT Phase 2 Moranapalli (PIN 635109) and all other Hosur addresses. You will need to arrange a gate pass for our delivery vehicle as per your factory's visitor vehicle procedure. Give us the contact name and gate entry timing in advance and we coordinate directly with your site.",
    },
    {
      question: "How long from order to delivery in Hosur?",
      answer: "Standard sizes with no customisation: 7 to 10 working days to manufacture, then 1 day transit to Hosur. Custom cabins with electrical fit-out, partition, or toilet attachment: 12 to 18 working days manufacture, then 1 day transit. We confirm the exact schedule in writing when you place the order.",
    },
    {
      question: "What size crane is needed to offload at my Hosur site?",
      answer: "A 10 ft × 8 ft cabin weighs approximately 800 to 1,000 kg. A 20 ft × 10 ft fitted cabin can be 2,000 to 2,500 kg. We provide the weight with your delivery note so you can book the right crane. A 5-tonne mobile crane handles most standard sizes. If your site has low overhead cables or a narrow access road, tell us and we plan accordingly.",
    },
    {
      question: "Do you provide erection and installation at the Hosur site?",
      answer: "We provide placement coordination and can guide your crane operator by phone during placement. If you need a SAMAN erection team on-site for levelling, anchor bolt fixing, or commissioning of electrical connections, mention this at enquiry stage. We include it in your quotation as a separate item.",
    },
  ],
  'porta-cabin-in-hubli': [
    {
      question: "Can you deliver porta cabins to Tarihal Industrial Estate and Gokul Road?",
      answer: "Yes. We deliver to Tarihal Industrial Estate (PIN 580026), Gokul Road Industrial Estate (PIN 580030), and all Hubli-Dharwad addresses. Industrial estate deliveries often need advance vehicle entry passes — tell us the estate's entry procedure and contact person when you place the order and we coordinate the delivery vehicle timing directly with your site.",
    },
    {
      question: "Do you also supply to Dharwad, or only Hubli?",
      answer: "We supply to the full Hubli-Dharwad twin-city area and all of Dharwad district. Mention your exact delivery PIN when enquiring so we can accurately quote freight and plan the delivery route. There is no difference in our supply terms between Hubli city and Dharwad locations.",
    },
    {
      question: "How does the cabin perform in Hubli's weather conditions?",
      answer: "Hubli-Dharwad has a semi-arid climate with hot summers and a monsoon season. Our GI sheet roof is treated for anti-corrosion and will not rust under normal monsoon exposure. PUF panel walls provide insulation against heat. For sites with prolonged direct sun exposure, we recommend the double-skin roof option and an AC provision fit-out. The MS frame and base are hot-dip primed and painted — they do not degrade under the Hubli climate for the full service life of the structure.",
    },
    {
      question: "Can you supply 3 to 5 porta cabins for a highway project at multiple Hubli area locations?",
      answer: "Yes. Multi-unit orders for highway and infrastructure projects are planned as a set. We confirm the size and fit-out for each unit, sequence the manufacturing to complete the batch, and dispatch in coordinated deliveries to your different site locations along the NH 48 corridor. Call us with the project scope — number of cabins, sizes, sites — and we plan the production and delivery schedule.",
    },
  ],
  'porta-cabin-in-belgaum': [
    {
      question: "Can you deliver porta cabins to Machhe Industrial Area, Belgaum?",
      answer: "Yes. We deliver to Machhe Industrial Area (PIN 590014) and Udyambag Industrial Area (PIN 590008) and all Belgaum and Belagavi addresses. For industrial estate entries requiring vehicle advance authorisation, provide the gate-pass contact and procedure when placing your order. We coordinate the delivery vehicle timing with your site team so there is no waiting at the estate gate.",
    },
    {
      question: "How long does manufacturing and delivery take from Bangalore to Belgaum?",
      answer: "Standard sizes with no customisation: 7 to 10 working days manufacture, then 5 to 6 days in transit. Custom cabins with electrical, AC provision, partition, or toilet: 12 to 18 working days manufacture, then 5 to 6 days transit. We confirm production start date and expected dispatch date in writing when you place the order — not an estimate, a committed schedule we hold ourselves to.",
    },
    {
      question: "Do you supply to highway project sites between Pune and Belgaum on NH 48?",
      answer: "Yes. We supply to highway and infrastructure project sites along the NH 48 corridor both in Karnataka and into the adjoining Maharashtra belt near Kolhapur. For multi-site projects where you need cabins at several active work fronts along the highway stretch, we plan the manufacturing batch and dispatch sequence so each site receives its cabin on schedule. Call us with the project scope — number of cabins, sizes, site locations — and we build the supply plan.",
    },
    {
      question: "Can you supply documentation for a Belgaum project tender or factory audit?",
      answer: "Yes. We provide ISO certificate copies (9001, 14001, 45001), NSIC registration certificate, DPIIT recognition letter, and GST registration document as part of your order file. If your tender requires a manufacturer's declaration or material compliance statement, request it when placing the order and we include it with your delivery paperwork.",
    },
  ],
  'porta-cabin-in-sonipat': [
    {
      question: "Do you deliver porta cabins to Kundli, Rai, and Barhi?",
      answer: "Yes — Kundli, Rai, Barhi, and construction sites right across Sonipat. The cabin ships from our Greater Noida factory straight up the NH-44 and takes 3–5 days, since Sonipat is one of our closest cities. Delivery is ₹3,000 standard.",
    },
    {
      question: "What does a porta cabin cost in Sonipat?",
      answer: "Marketplace listings run from about ₹45,000 for a small basic unit to over ₹1.9 lakh, with per-sq-ft rates around ₹950–₹1,200 — but the real number depends on size, panel type, fit-out and quantity. We quote against your exact spec rather than publish a fixed price. Call +91 87960 39938 or send an enquiry.",
    },
    {
      question: "What sizes and layouts can I get?",
      answer: "Stock sizes run 8×10, 10×12, 10×20 (the common 20 ft office), 10×30, and 10×40 ft, in single-room, two-room, or full multi-room layouts, with an attached toilet or pantry on request. If you need an odd size, we build to it.",
    },
    {
      question: "Can you supply multiple cabins for an HSIIDC or expressway project?",
      answer: "Yes. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we'll confirm what we can supply and by when.",
    },
    {
      question: "How long from order to delivery in Sonipat?",
      answer: "Transit is 3–5 days once the cabin's built, since Sonipat is a short run up the NH-44. Production time depends on the configuration and where you land in our queue — standard sizes move quicker. We'll give you a firm timeline at enquiry.",
    },
  ],
  'porta-cabin-in-indore': [
    {
      question: 'Do you deliver porta cabins to Pithampur and Sanwer Road?',
      answer: 'Yes — Pithampur, Sanwer Road, Dewas Naka, and construction sites right across Indore. The cabin ships from our Greater Noida factory and takes 3–5 days in transit. Delivery is ₹3,000 standard.',
    },
    {
      question: "How does the cabin hold up in Indore's summer heat?",
      answer: "The 50 mm PUF panels are real insulation, not just a skin, and we'd push you toward a turbo ventilator and false ceiling for any open Pithampur-type plot with no shade. For an office you'll sit in all summer, add an AC provision and pick a light exterior colour. Done that way it stays workable past 40°C; a bare cabin in full sun won't.",
    },
    {
      question: 'What does a porta cabin cost in Indore?',
      answer: "It depends on size, panel type, how much fit-out you want, and quantity. We don't publish a fixed price because every cabin is built to order — call +91 87960 39938 or send an enquiry and we'll quote your exact spec.",
    },
    {
      question: 'Can you supply for an Indore Metro or industrial project?',
      answer: "Yes. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send us the project scope and we'll confirm what we can supply and by when.",
    },
    {
      question: 'How long from order to delivery in Indore?',
      answer: "Transit is 3–5 days once the cabin's built. Production time depends on the configuration and where you land in our queue — standard sizes move quicker. We'll give you a firm timeline at enquiry.",
    },
  ],
  'portable-cabins-in-gurgaon': [
    {
      question: 'How long does delivery of a portable cabin to Gurgaon take?',
      answer: 'Standard portable cabins typically reach Gurgaon sites in 3-5 days once the unit is ready, because we dispatch from our Greater Noida factory in the same NCR region. Custom or fully fitted cabins follow a build-time estimate, commonly around 7-21 working days depending on size, insulation, and fit-out.',
    },
    {
      question: 'What decides the price of a portable cabin in Gurgaon?',
      answer: 'Price depends on the cabin size, panel type and insulation (single-skin versus ~50 mm PUF), fit-out (toilet, partitions, windows, electricals), finish level, and delivery distance to your site. Because we sell direct from the factory on an enquiry basis, send your requirement and we quote it exactly - there is no fixed per-square-foot rate.',
    },
    {
      question: 'Do I need a permit for a portable cabin in Gurgaon?',
      answer: 'Permit rules for temporary structures vary by location and by who owns or governs the site, and may differ inside special zones such as Cyber City or industrial areas like Manesar. A portable cabin is a movable, dry-assembled unit, but you should confirm any temporary-structure approval with your local authority or site owner before installation.',
    },
    {
      question: 'What sizes of portable cabin can I get?',
      answer: 'Cabins are built to your floor plan, from a compact single site office to larger cabin offices, cabins with an attached toilet, and multi-unit layouts for bigger teams. Share your plot dimensions and headcount and we will recommend a layout that fits.',
    },
    {
      question: "Can a portable cabin handle Gurgaon's heat and monsoon?",
      answer: 'Yes. Our cabins use ~50 mm insulated PUF sandwich panels that help keep interiors cooler in summer, with GI roofing built for monsoon rain and a powder-coated IS 2062 steel frame for durability. You can add air-conditioning provision and extra insulation for longer or office deployments.',
    },
    {
      question: 'Can the cabin be relocated if our site changes?',
      answer: 'Yes. A portable cabin is designed to be moved. Single units can usually be lifted and transported as built; larger or multi-unit layouts may need dismantling and reassembly. Tell us the move details and we can advise on the right approach.',
    },
  ],
  'portable-cabins-in-greater-noida': [
    {
      question: 'How quickly can you deliver a portable cabin in Greater Noida?',
      answer: 'Standard cabins are usually delivered within about 3-5 days, since they dispatch from our Greater Noida factory. Installation on a prepared site adds roughly one to three days. Custom or fully fitted cabins need extra build time before dispatch - share your specification and we will confirm a realistic timeline for your site in Alpha, Beta, Gamma, or Knowledge Park.',
    },
    {
      question: 'What decides the price of a portable cabin?',
      answer: 'Price depends on size, panel thickness and insulation, flooring grade, doors and windows, electrical and plumbing fittings, any toilet or partition, the finish you choose, and delivery distance. A bare single-room cabin is much cheaper than a fitted, air-conditioned office cabin of the same size. Send us your requirement and we will give you a clear, itemised quote.',
    },
    {
      question: 'What foundation does a portable cabin need at a factory site?',
      answer: 'Most cabins sit on a simple concrete pad or a steel base frame. For short-term use, a leveled patch of ground with support blocks at load points is often enough. The exact requirement depends on soil, cabin size, and how long it will stay. Our team can assess your site before delivery to confirm the right base.',
    },
    {
      question: "Can a portable cabin handle Greater Noida's summer heat and monsoon?",
      answer: 'Yes. The ~50 mm PUF insulated panels reduce heat transfer in summer, and the sloped GI roof with sealed joints channels monsoon water away. UV-resistant exterior coating limits sun damage on open industrial plots. For very hot zones, you can add AC provision or thicker panels.',
    },
    {
      question: 'What is the warranty and expected life of a SAMAN cabin?',
      answer: 'The warranty is 5 years on the structural frame and base plus 1-2 years on finishing, with a 20-25 year engineered service life for the structure. The galvanised steel frame resists corrosion, and powder-coated members hold up in industrial conditions. With basic maintenance, cabins stay in service for many years.',
    },
  ],
  'portable-cabins-in-faridabad': [
    {
      question: 'How quickly can you deliver a portable cabin in Faridabad?',
      answer: 'Standard cabin configurations typically reach site in 3-5 days across Faridabad, Ballabhgarh and Surajkund, dispatched from our Greater Noida factory. Custom or fitted units take longer to build; we confirm the timeline on your quote.',
    },
    {
      question: 'What decides the price of a portable cabin?',
      answer: 'Size, panel thickness, insulation, internal fit-out (flooring, partitions, attached toilet, electricals) and delivery distance set the price. There is no single fixed rate - share your requirement and we send a written quote.',
    },
    {
      question: 'What site preparation is needed before installation?',
      answer: 'You need a level base - usually a concrete pad or well-compacted ground with drainage. For short-term use, an adjustable foundation can work. Our team gives site-prep guidance before delivery so installation is straightforward.',
    },
    {
      question: 'Are portable cabins suitable during Delhi-NCR construction bans?',
      answer: 'Generally yes. During GRAP restriction windows, wet construction may be limited, but dry-assembly factory-built cabins are usually not barred because they are installed, not cast on site. Confirm current rules with local authorities for your project.',
    },
    {
      question: 'What warranty do you offer?',
      answer: 'Our cabins carry 5 years structural frame and base + 1-2 years finishing + 20-25 years engineered service life. The 20-25 years is the engineered service life of the structure, not a warranty period.',
    },
    {
      question: 'Can a portable cabin be relocated later?',
      answer: 'Yes. A key advantage is mobility - the cabin can be lifted and moved as your project changes. Our team can handle disassembly, transport and reinstallation so the unit stays in good condition after a move.',
    },
  ],
  'porta-cabin-in-noida': [
    {
      question: 'Which factory supplies porta cabins to Noida?',
      answer: 'Your unit ships factory-direct from our Greater Noida facility (Jalpura, 201308) — a short same-region delivery into Noida, with a ₹3,000 default delivery charge and typical transit of 3–5 days.',
    },
    {
      question: 'Is the porta cabin built to a structural standard?',
      answer: 'Yes — every unit is built on an IS 2062 steel frame by an ISO 9001:2015 / 14001:2015 / 45001:2018-certified manufacturer (NSIC-enlisted, DPIIT-recognised).',
    },
  ],
  'porta-cabin-in-jaipur': [
    {
      question: 'Does SAMAN deliver porta cabins to RIICO Sitapura and Mansarovar?',
      answer: 'Yes. We deliver to all RIICO zones in Jaipur — Sitapura, Mansarovar, Vishwakarma, and Bindayaka — and to construction sites anywhere in Jaipur district. Transit from our Greater Noida factory is 3–5 days. Delivery charge is ₹3,000 standard.',
    },
    {
      question: "How does a porta cabin perform in Jaipur's 45°C+ summer heat?",
      answer: 'With the right specification, well. We recommend three additions for all Jaipur orders: a turbo ventilator, an internal false ceiling, and an AC provision (wall-sleeve + power point). A light RAL colour (white or cream) on the outer skin reduces solar heat gain significantly compared to dark colours. A cabin with these additions performs comfortably as a working office even in peak Rajasthan summer. Without them, a bare cabin in direct sun becomes unusable by mid-morning in May.',
    },
    {
      question: 'What is the price of a porta cabin in Jaipur?',
      answer: 'Price depends on size, panel type, fit-out level, and heat-management additions. Call +91 87960 39938 or send an enquiry for a quotation built around your specific site and requirement. We do not publish fixed prices because every cabin is built to order.',
    },
    {
      question: "How does SAMAN's cabin handle Jaipur's dust and the brief monsoon season?",
      answer: 'The MS frame is zinc-phosphate primed before powder coating — this gives it resistance to the dust-and-moisture abrasion cycle common in Rajasthan. Panel joints are factory-sealed before despatch, not site-sealed after arrival. The GI roof has a controlled drainage slope so the July–August monsoon rain runs off cleanly without pooling.',
    },
    {
      question: 'Can I get a porta cabin for a real-estate sales office launch in Jaipur?',
      answer: "Yes. A 10×12 ft or 10×20 ft porta cabin makes an effective temporary sales office — easy to brand, quick to install, and fully removable when the project is done. We can add a canopy, glass-front door, and AC provision to match the presentation standard that Jaipur's real-estate market expects.",
    },
  ],
  'porta-cabin-in-kolkata': [
    {
      question: 'Does SAMAN deliver porta cabins to Howrah, Durgapur, and Haldia?',
      answer: 'Yes. We deliver across West Bengal — Kolkata, Howrah, Salt Lake, New Town Rajarhat, Durgapur, Kalyani, and Haldia. Transit from our Greater Noida factory is 3–5 days to Kolkata. Deliveries to Durgapur and Haldia may take an additional day depending on road conditions. Confirm the freight rate for district deliveries at enquiry stage.',
    },
    {
      question: 'What is the price of a porta cabin in Kolkata?',
      answer: 'Price depends on size, panel type, fit-out level, and any site-specific requirements such as elevated flooring or additional corrosion protection. Call +91 87960 39938 or send an enquiry for an itemised quotation built for your specific site and specification. We do not publish fixed prices because every cabin is built to order.',
    },
    {
      question: 'How does SAMAN handle West Bengal’s high humidity and monsoon conditions in the cabin build?',
      answer: 'Our standard specification includes zinc-phosphate primed and powder-coated MS frames, factory-sealed panel joints, and colour-coated GI roofing with a drainage slope. For sites in coastal or delta regions (Haldia, Diamond Harbour, Kakdwip), we recommend an epoxy primer coat on external surfaces and cement-board panels instead of PUF for sustained moisture resistance. These are confirmed at order stage, not added as afterthoughts.',
    },
    {
      question: 'What GST applies to a porta cabin purchase in West Bengal?',
      answer: 'Porta cabins are classified under HSN 9406 (prefabricated structures) and attract 18% GST. We issue a full tax invoice from SAMAN POS India Pvt Ltd (GST registration 09ABBCS7101B1ZT — Noida). We can provide e-way bill documentation and lorry receipt as required for your site accounts. Confirm documentation requirements when placing your order.',
    },
    {
      question: 'Can SAMAN supply porta cabins for a government infrastructure project in West Bengal?',
      answer: 'Yes. We supply to government contractors and infrastructure project managers. Our NSIC registration (NSIC/GP/BAN/2024/0055207) and DPIIT recognition (DIPP56005) are available for vendor documentation. We can provide ISO certificates, GST registration, PAN, and company incorporation documents as required for government vendor empanelment. Contact us with your project scope and we will confirm what we can supply and on what timeline.',
    },
  ],
  'porta-cabin-in-surat': [
    {
      question: 'Does SAMAN deliver porta cabins to Hazira and Sachin GIDC?',
      answer: 'Yes. We deliver across Surat — Sachin GIDC, Hazira industrial belt, Pandesara, and city construction sites. Transit from our Greater Noida factory is 3–5 days. Delivery charge is ₹3,000 standard.',
    },
    {
      question: "What corrosion protection do you provide for Surat's coastal Hazira sites?",
      answer: 'For Hazira and any site within about 5 km of the coast, we add an epoxy primer coat on external surfaces before the powder coat, and recommend cement-board panels over standard PUF. The MS frame is IS 2062 Grade A, zinc-phosphate primed in all cases. This resists the salt-air corrosion cycle better than a standard cabin.',
    },
    {
      question: 'What is the price of a porta cabin in Surat?',
      answer: 'Price depends on size, panel type, corrosion spec, and fit-out level. Call +91 87960 39938 or send an enquiry for a quotation built for your site and specification. We do not publish fixed prices because every cabin is built to order.',
    },
    {
      question: 'How long does delivery from the factory to Surat take?',
      answer: '3–5 days from our Greater Noida factory via the NH-48 corridor, after production is complete. Production lead time depends on your configuration and the order queue — confirm at enquiry. Standard sizes move faster.',
    },
    {
      question: 'Can SAMAN supply porta cabins for a Hazira plant project or government contract?',
      answer: 'Yes. We supply to industrial contractors and project managers. Our NSIC (NSIC/GP/BAN/2024/0055207) and DPIIT (DIPP56005) recognition, ISO certificates, GST registration, and incorporation documents are available for vendor empanelment. Share your project scope and we will confirm supply capacity and timeline.',
    },
  ],
  'porta-cabin-in-nashik': [
    {
      question: 'Does SAMAN deliver porta cabins to Satpur and Ambad MIDC?',
      answer: "Yes. We deliver to Nashik's industrial zones — Satpur MIDC, Ambad MIDC — and to construction and processing sites across the Nashik region. Transit from our Greater Noida factory is 3–5 days. Delivery charge is ₹3,000 standard.",
    },
    {
      question: 'What is the price of a porta cabin in Nashik?',
      answer: 'Price depends on size, panel type, fit-out level, and any site additions such as a raised plinth or AC provision. Call +91 87960 39938 or send an enquiry for a quotation built for your site and specification. We do not publish fixed prices because every cabin is built to order.',
    },
    {
      question: "How does a SAMAN porta cabin handle Nashik's monsoon?",
      answer: 'Panel joints are factory-sealed before despatch, and the GI roof has a controlled drainage slope so rain runs off cleanly without pooling. For low-lying or monsoon-exposed sites we recommend a raised RCC plinth to keep the floor above ground water. The MS frame is zinc-phosphate primed and powder-coated to resist rust through wet seasons.',
    },
    {
      question: 'Can SAMAN supply porta cabins for a food-processing or precision manufacturing site in Nashik?',
      answer: "Yes. We build clean, factory-finished cabins suitable for QC rooms, supervisor offices, and inspection points at food-processing and auto-component sites. Specifications such as sealed joints, proper flooring, and electrical provisions are confirmed at order stage to suit your site's requirements.",
    },
    {
      question: 'How long does delivery from the factory to Nashik take?',
      answer: '3–5 days from our Greater Noida factory via the NH-48 corridor, after production is complete. Production lead time depends on your configuration and the order queue — confirm at enquiry. Standard sizes move faster.',
    },
  ],
  'porta-cabin-in-vadodara': [
    {
      question: 'Does SAMAN deliver porta cabins to Nandesari, Makarpura, and Savli GIDC?',
      answer: "Yes. We deliver across Vadodara's industrial zones — Nandesari GIDC, Makarpura GIDC, and the Savli/Manjusar belt — and to construction sites across the Vadodara region. Transit from our Greater Noida factory is 3–5 days. Delivery charge is ₹3,000 standard.",
    },
    {
      question: "What corrosion protection do you provide for Vadodara's chemical GIDC sites?",
      answer: 'For Nandesari and other chemical-belt sites we add an epoxy primer coat on external surfaces before the powder coat, and recommend cement-board panels over standard PUF. The MS frame is IS 2062 Grade A, zinc-phosphate primed in all cases. This gives better resistance to chemical-zone air over long service life.',
    },
    {
      question: 'What is the price of a porta cabin in Vadodara?',
      answer: 'Price depends on size, panel type, corrosion spec, and fit-out level. Call +91 87960 39938 or send an enquiry for a quotation built for your site and specification. We do not publish fixed prices because every cabin is built to order.',
    },
    {
      question: 'Can SAMAN supply porta cabins for a petrochemical shutdown or government project in Vadodara?',
      answer: 'Yes. We supply industrial contractors, petrochemical project managers, and government contractors. Our NSIC (NSIC/GP/BAN/2024/0055207) and DPIIT (DIPP56005) recognition, ISO certificates, GST registration, and incorporation documents are available for vendor empanelment. Share your project scope and we will confirm supply capacity and timeline.',
    },
    {
      question: 'How long does delivery from the factory to Vadodara take?',
      answer: '3–5 days from our Greater Noida factory via the NH-48 corridor, after production is complete. Production lead time depends on your configuration and the order queue — confirm at enquiry. Standard sizes move faster.',
    },
  ],
  'porta-cabin-in-nagpur': [
    {
      question: 'Does SAMAN deliver porta cabins to MIHAN, Butibori, and Hingna MIDC?',
      answer: 'Yes. We deliver to all Nagpur industrial zones — MIHAN, Butibori MIDC, Hingna MIDC — and to construction sites across the Nagpur region. Transit from our Greater Noida factory is 3–5 days. Delivery charge is ₹3,000 standard.',
    },
    {
      question: "How does a porta cabin handle Nagpur's extreme summer heat?",
      answer: 'The 50 mm PUF sandwich panels provide genuine thermal insulation, and we recommend a turbo ventilator plus an internal false ceiling on all Nagpur orders. For a working office used through summer, add an AC provision (wall-sleeve + power point). A light exterior colour reduces solar heat gain. With these, the cabin stays usable even above 44°C; a bare cabin in direct sun does not.',
    },
    {
      question: 'What is the price of a porta cabin in Nagpur?',
      answer: 'Price depends on size, panel type, heat-management additions, and fit-out level. Call +91 87960 39938 or send an enquiry for a quotation built for your site and specification. We do not publish fixed prices because every cabin is built to order.',
    },
    {
      question: 'Can SAMAN supply porta cabins for a MIHAN, Samruddhi Mahamarg, or government project?',
      answer: 'Yes. We supply industrial contractors, infrastructure project managers, and government contractors. Our NSIC (NSIC/GP/BAN/2024/0055207) and DPIIT (DIPP56005) recognition, ISO certificates, GST registration, and incorporation documents are available for vendor empanelment. Share your project scope and we will confirm supply capacity and timeline.',
    },
    {
      question: 'How long does delivery from the factory to Nagpur take?',
      answer: '3–5 days from our Greater Noida factory via the NH-44 corridor, after production is complete. Production lead time depends on your configuration and the order queue — confirm at enquiry. Standard sizes move faster.',
    },
  ],
  'porta-cabin-in-patna': [
    {
      question: 'Does SAMAN deliver porta cabins to Bihta, Patliputra, and Fatuha?',
      answer: 'Yes. We deliver across Patna — Patliputra Industrial Area, Bihta, and Fatuha — and to construction sites across the Patna region. Transit from our Greater Noida factory is 3–5 days. Delivery charge is ₹3,000 standard.',
    },
    {
      question: 'How does a SAMAN porta cabin handle Patna’s monsoon and flood-prone sites?',
      answer: 'Panel joints are factory-sealed and the GI roof has a controlled drainage slope so rain runs off cleanly. For low-lying and flood-prone Patna sites we recommend a raised RCC plinth or elevated flooring on MS joists to keep the floor above waterlogging. The MS frame is zinc-phosphate primed and powder-coated to resist rust through Bihar’s long wet season.',
    },
    {
      question: 'What is the price of a porta cabin in Patna?',
      answer: 'Price depends on size, panel type, fit-out level, and site additions such as a raised plinth. Call +91 87960 39938 or send an enquiry for a quotation built for your site and specification. We do not publish fixed prices because every cabin is built to order.',
    },
    {
      question: 'Can SAMAN supply porta cabins for a Patna bridge, metro, or government infrastructure project?',
      answer: 'Yes. We supply infrastructure project managers and government contractors. Our NSIC (NSIC/GP/BAN/2024/0055207) and DPIIT (DIPP56005) recognition, ISO certificates, GST registration, and incorporation documents are available for vendor empanelment. Share your project scope and we will confirm supply capacity and timeline.',
    },
    {
      question: 'How long does delivery from the factory to Patna take?',
      answer: '3–5 days from our Greater Noida factory via the Purvanchal / NH-19 corridor, after production is complete. Production lead time depends on your configuration and the order queue — confirm at enquiry. Standard sizes move faster.',
    },
  ],
  'porta-cabin-in-rajkot': [
    {
      question: 'Does SAMAN deliver porta cabins to Aji, Metoda, and Shapar GIDC?',
      answer: 'Yes. We deliver across Rajkot’s industrial zones — Aji GIDC, Metoda/Lodhika GIDC, and Shapar-Veraval — and to construction sites across the Rajkot region. Transit from our Greater Noida factory is 3–5 days. Delivery charge is ₹3,000 standard.',
    },
    {
      question: 'How does a porta cabin handle Rajkot’s heat and dust?',
      answer: 'The 50 mm PUF panels insulate against the heat, and we fit sealed louvre or sliding windows and doors to keep dust out — important in foundry and engineering environments. The powder-coat frame finish resists Rajkot’s dry abrasive dust. We recommend a turbo ventilator and false ceiling, and an AC provision for any working office used through summer.',
    },
    {
      question: 'What is the price of a porta cabin in Rajkot?',
      answer: 'Price depends on size, panel type, fit-out level, and heat-and-dust additions such as sealed windows and ventilation. Call +91 87960 39938 or send an enquiry for a quotation built for your site and specification. We do not publish fixed prices because every cabin is built to order.',
    },
    {
      question: 'Can SAMAN supply porta cabins for a foundry or engineering site in Rajkot?',
      answer: 'Yes. We build robust, sealed cabins suitable for plant gate security, supervisor offices, and QC rooms at Rajkot’s casting, forging, and machine-tool units. Dust-sealing, durable coatings, and electrical provisions are confirmed at order stage to suit your site’s conditions.',
    },
    {
      question: 'How long does delivery from the factory to Rajkot take?',
      answer: '3–5 days from our Greater Noida factory via the NH-48 corridor, after production is complete. Production lead time depends on your configuration and the order queue — confirm at enquiry. Standard sizes move faster.',
    },
  ],
  'porta-cabin-in-bhubaneswar': [
    {
      question: 'Does SAMAN deliver porta cabins to Mancheswar, Chandaka, and Cuttack?',
      answer: 'Yes. We deliver across Bhubaneswar — Mancheswar Industrial Estate, Chandaka Industrial Estate, Infocity — and to Cuttack and Khordha-region construction sites. Transit from our Greater Noida factory is 4–5 days. Delivery charge is ₹3,000 standard; confirm exact freight for Cuttack/Paradip-side sites at order stage.',
    },
    {
      question: 'How does a SAMAN porta cabin handle coastal Odisha’s humidity and winds?',
      answer: 'We add an epoxy primer coat before powder coat for coastal-proximity sites and recommend cement-board panels for sustained humidity. The frame is anchor-bolted to an RCC plinth for stability in strong seasonal winds, and we provide the anchor-bolt pattern and load data so your plinth is prepared correctly. We do not claim cyclone-proofing — we provide proper corrosion protection and secure anchoring suited to the coastal environment.',
    },
    {
      question: 'What is the price of a porta cabin in Bhubaneswar?',
      answer: 'Price depends on size, panel type, coastal corrosion spec, and fit-out level. Call +91 87960 39938 or send an enquiry for a quotation built for your site and specification. We do not publish fixed prices because every cabin is built to order.',
    },
    {
      question: 'Can SAMAN supply porta cabins for an IT campus or government project in Bhubaneswar?',
      answer: 'Yes. We supply IT-campus contractors, infrastructure project managers, and government contractors. Our NSIC (NSIC/GP/BAN/2024/0055207) and DPIIT (DIPP56005) recognition, ISO certificates, GST registration, and incorporation documents are available for vendor empanelment. Share your project scope and we will confirm supply capacity and timeline.',
    },
    {
      question: 'How long does delivery from the factory to Bhubaneswar take?',
      answer: '4–5 days from our Greater Noida factory via the NH-19 / NH-16 corridor, after production is complete. Bhubaneswar is farther east than most of our North-dispatch cities, so allow the upper end of the range. Production lead time depends on your configuration and the order queue — confirm at enquiry.',
    },
  ],
  'porta-cabin-in-raipur': [
    {
      question: 'Do you deliver porta cabins to Urla and Siltara?',
      answer: 'Yes — Urla, Siltara, the Bhilai steel belt, and construction sites across the Raipur region. The cabin ships from our Greater Noida factory and takes 4–5 days in transit, since Raipur is a longer haul. Delivery is ₹3,000 standard.',
    },
    {
      question: 'Will the cabin hold up in a dusty, high-heat steel-belt plant?',
      answer: 'That’s what it’s built for. The frame is IS 2062 steel, zinc-phosphate primed and powder-coated, and for a dusty sponge-iron or rolling-mill yard we can spec a heavier anti-rust coating and seal the windows and doors to keep plant dust out. The 50 mm PUF panels handle the heat. Tell us the plant conditions and we’ll match the spec.',
    },
    {
      question: 'What does a porta cabin cost in Raipur?',
      answer: 'It depends on size, panel type, coating spec, fit-out and quantity. We quote against your exact spec rather than publish a fixed price — call +91 87960 39938 or send an enquiry.',
    },
    {
      question: 'Can you supply multiple cabins for a Siltara or Bhilai plant project?',
      answer: 'Yes — multi-cabin plant orders are routine for us. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we’ll confirm capacity and timeline.',
    },
    {
      question: 'How long from order to delivery in Raipur?',
      answer: 'Transit is 4–5 days once the cabin’s built, since Raipur is farther southeast than our central-India cities. Production time depends on the configuration and your place in the queue — standard sizes move faster. We’ll confirm a firm timeline at enquiry.',
    },
  ],
  'porta-cabin-in-ranchi': [
    {
      question: 'Do you deliver porta cabins to Namkum, HEC, and Tatisilwai?',
      answer: 'Yes — Namkum Industrial Area, the HEC/Dhurwa area, Tatisilwai, and project sites across the Ranchi region. The cabin ships from our Greater Noida factory and takes 4–5 days in transit, since Ranchi is a longer haul. Delivery is ₹3,000 standard.',
    },
    {
      question: "How does the cabin handle Ranchi's monsoon and sloping sites?",
      answer: "The GI roof is pitched steep with factory-sealed joints to throw off the highland rain, and the frame is anchor-bolted to an RCC plinth so it stays level on rocky or sloping ground. For wet sites we'll recommend a raised plinth. The 50 mm PUF panels handle the temperature swings between summer and the monsoon.",
    },
    {
      question: 'What does a porta cabin cost in Ranchi?',
      answer: 'It depends on size, panel type, any site additions like a raised plinth, fit-out and quantity. We quote against your exact spec rather than publish a fixed price — call +91 87960 39938 or send an enquiry.',
    },
    {
      question: 'Can you supply for an HEC or government project in Ranchi?',
      answer: "Yes. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we'll confirm capacity and timeline.",
    },
    {
      question: 'How long from order to delivery in Ranchi?',
      answer: "Transit is 4–5 days once the cabin's built, since Ranchi is well east of our central-India cities. Production time depends on the configuration and your place in the queue — standard sizes move faster. We'll confirm a firm timeline at enquiry.",
    },
  ],
  'porta-cabin-in-bhopal': [
    {
      question: "Do you deliver porta cabins to Govindpura and Mandideep?",
      answer: "Yes — Govindpura, Mandideep, Bagroda, and construction sites across Bhopal. The cabin ships from our Greater Noida factory and takes 3–5 days in transit. Delivery is ₹3,000 standard.",
    },
    {
      question: "How does the cabin cope with Bhopal's summer heat?",
      answer: "The 50 mm PUF panels do real insulation work, and for any open plot without shade we'd add a turbo ventilator and false ceiling. For an office you'll use all summer, put in an AC provision and choose a light exterior colour. Built that way it stays usable past 42°C — a plain cabin in full sun won't.",
    },
    {
      question: "What does a porta cabin cost in Bhopal?",
      answer: "You'll see roughly ₹1,200 a square foot quoted on marketplaces, but the real number depends on size, panel type, fit-out and quantity. We quote against your exact spec rather than publish a fixed price — call +91 87960 39938 or send an enquiry.",
    },
    {
      question: "Can you supply for a Bhopal Smart City or industrial project?",
      answer: "Yes. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we'll confirm what we can supply and the timeline.",
    },
    {
      question: "How long from order to delivery in Bhopal?",
      answer: "Transit is 3–5 days once the cabin's built. Production time depends on the configuration and your place in the queue — standard sizes move faster. We'll give you a firm timeline at enquiry.",
    },
  ],
  'porta-cabin-in-guwahati': [
    {
      question: 'Do you deliver porta cabins all the way to Guwahati?',
      answer: 'Yes — Bamunimaidan, Amingaon, Changsari, and project sites across the Guwahati region. The cabin ships from our Greater Noida factory up the NH-27 corridor and takes 4–6 days, since it’s a long route. Delivery is ₹3,000 standard and we’ll confirm exact freight for your site given the distance.',
    },
    {
      question: 'Is the cabin built for Assam’s rain and humidity?',
      answer: 'Yes, and that’s built in before it leaves the factory. The frame is IS 2062 steel, zinc-phosphate primed and powder-coated against the humidity; the panel joints and roof are factory-sealed and the roof pitched steep for heavy monsoon. On floodplain or low-lying sites we recommend a raised RCC plinth or elevated MS-joist flooring to keep the floor above water.',
    },
    {
      question: 'What does a porta cabin cost in Guwahati?',
      answer: 'It depends on size, panel type, site additions, fit-out, and the freight for the long route. We quote against your exact spec and confirm Guwahati freight rather than publish a fixed price — call +91 87960 39938 or send an enquiry.',
    },
    {
      question: 'Can you supply for an NE logistics, oil, or government project in Guwahati?',
      answer: 'Yes. We supply contractors and project managers across the Northeast, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we’ll confirm capacity, freight, and timeline.',
    },
    {
      question: 'How long does delivery to Guwahati take?',
      answer: '4–6 days in transit once the cabin’s built, given the distance up the NH-27 corridor. We plan for the upper end and tell you straight rather than promise a date we can’t hold. Production time depends on the configuration and your place in the queue — we’ll confirm a firm timeline at enquiry.',
    },
  ],
  'porta-cabin-in-dehradun': [
    {
      question: 'Do you deliver porta cabins to Selaqui and Mohabbewala?',
      answer: "Yes — Selaqui, Mohabbewala, Patel Nagar, and construction sites across the Dehradun region. The cabin ships from our Greater Noida factory and takes 3–5 days, since Dehradun is one of our closer cities. Delivery is ₹3,000 standard.",
    },
    {
      question: 'Is the cabin built for a Dehradun winter and monsoon?',
      answer: "Yes. The 50 mm PUF panels insulate against the cold, and for hill-foot sites we can add extra roof and wall insulation for the winter. The GI roof is pitched steep with sealed joints for the heavy monsoon, and the frame is anchor-bolted to an RCC plinth for sloping ground. Tell us the site and we'll match the spec.",
    },
    {
      question: 'What does a porta cabin cost in Dehradun?',
      answer: 'It depends on size, panel type, climate additions like extra insulation, fit-out and quantity. We quote against your exact spec rather than publish a fixed price — call +91 87960 39938 or send an enquiry.',
    },
    {
      question: 'Can you deliver to a hill site above Dehradun?',
      answer: "In most cases yes, but it depends on road access — a flatbed truck needs a road it can physically reach the site on, and very tight or steep hill roads may limit the cabin size we can deliver in one piece. Tell us the exact location and we'll confirm what the access will take before you order.",
    },
    {
      question: 'How long from order to delivery in Dehradun?',
      answer: "Transit is 3–5 days once the cabin's built, since Dehradun is a shorter run for us. Production time depends on the configuration and your place in the queue — standard sizes move faster. We'll confirm a firm timeline at enquiry.",
    },
  ],
  'porta-cabin-in-gwalior': [
    {
      question: 'Do you deliver porta cabins to Malanpur and Banmore?',
      answer: 'Yes — Malanpur, Banmore, the Maharajpura/Gwalior city belt, and construction sites across the Gwalior region. The cabin ships from our Greater Noida factory and takes 3–5 days, since Gwalior is one of our closer cities. Delivery is ₹3,000 standard.',
    },
    {
      question: "How does the cabin handle Gwalior's heat and dust?",
      answer: 'The 50 mm PUF panels insulate against the heat, and we fit sealed louvre or sliding windows and doors to keep the dry Chambal dust out. The powder-coat frame finish resists the dust too. For an open plot with no shade, add a turbo ventilator and false ceiling, and an AC provision for any working office.',
    },
    {
      question: 'What does a porta cabin cost in Gwalior?',
      answer: 'It depends on size, panel type, the heat-and-dust additions you need, fit-out and quantity. We quote against your exact spec rather than publish a fixed price — call +91 87960 39938 or send an enquiry.',
    },
    {
      question: 'Can you supply for a Gwalior smart-city or industrial project?',
      answer: "Yes. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we'll confirm capacity and timeline.",
    },
    {
      question: 'How long from order to delivery in Gwalior?',
      answer: "Transit is 3–5 days once the cabin's built, since Gwalior is a shorter run for us down the Yamuna Expressway. Production time depends on the configuration and your place in the queue — standard sizes move faster. We'll confirm a firm timeline at enquiry.",
    },
  ],
  'porta-cabin-in-durgapur': [
    {
      question: "Do you deliver porta cabins to the Durgapur Steel Plant belt?",
      answer: "Yes — the DSP belt, the Heavy Engineering / V.K. Nagar area, City Centre, and project sites across the Durgapur region. The cabin ships from our Greater Noida factory and takes 4–6 days in transit, since Durgapur is a longer haul. Delivery is ₹3,000 standard.",
    },
    {
      question: "Will the cabin hold up in a dusty, high-heat steel-belt plant?",
      answer: "That's what it's built for. The frame is IS 2062 steel, zinc-phosphate primed and powder-coated, and for a dusty steel-yard posting we can spec a heavier anti-rust coating and seal the windows and doors to keep plant dust out. The 50 mm PUF panels handle the heat. Tell us the plant conditions and we'll match the spec.",
    },
    {
      question: "What does a porta cabin cost in Durgapur?",
      answer: "Marketplace listings run from about ₹50,000 to over ₹2.1 lakh, around ₹1,200 a square foot — but the real number depends on size, panel type, coating spec, fit-out and quantity. We quote against your exact spec rather than publish a fixed price. Call +91 87960 39938 or send an enquiry.",
    },
    {
      question: "Can you supply multiple cabins for a DSP or DHEP project?",
      answer: "Yes — multi-cabin plant orders are routine for us. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we'll confirm capacity, freight, and timeline.",
    },
    {
      question: "How long does delivery to Durgapur take?",
      answer: "Transit is 4–6 days once the cabin's built, since Durgapur is well east of our NCR cities. We plan for the upper end and tell you straight rather than promise a date we can't hold. Production time depends on the configuration and your place in the queue — we'll confirm a firm timeline at enquiry.",
    },
  ],
  'porta-cabin-in-manesar': [
    {
      question: 'Do you deliver porta cabins to IMT Manesar?',
      answer: "Yes — IMT Manesar (all sectors), the Kasan and Naharpur belt, and construction sites across Manesar. The cabin ships from our Greater Noida factory and takes 3–5 days, since Manesar is a short run on the Gurgaon belt. Delivery is ₹3,000 standard.",
    },
    {
      question: 'What does a porta cabin cost in Manesar?',
      answer: "Marketplace listings run from about ₹38,000 for a small basic unit to over ₹2 lakh, with per-sq-ft rates around ₹870 — but the real number depends on size, panel type, fit-out and quantity. We quote against your exact spec rather than publish a fixed price. Call +91 87960 39938 or send an enquiry.",
    },
    {
      question: 'What sizes and layouts can I get?',
      answer: "Stock sizes run 8×10, 10×12, 10×20 (the common 20 ft office), 10×30, and 10×40 ft, in single-room, two-room, or full multi-room layouts, with an attached toilet or pantry on request. Need an odd size? We build to it.",
    },
    {
      question: 'Can you supply multiple cabins for an IMT plant project?',
      answer: "Yes. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we'll confirm what we can supply and by when.",
    },
    {
      question: 'How long from order to delivery in Manesar?',
      answer: "Transit is 3–5 days once the cabin's built, since Manesar is a short run on the Gurgaon belt. Production time depends on the configuration and your place in the queue — standard sizes move quicker. We'll give you a firm timeline at enquiry.",
    },
  ],
  'porta-cabin-in-panipat': [
    {
      question: "Do you deliver porta cabins to the HUDA sectors and Refinery Road?",
      answer: "Yes — the HUDA/HSIIDC sectors, the Refinery Road belt, and construction sites across Panipat. The cabin ships from our Greater Noida factory up the NH-44 and takes 3–5 days, since Panipat is one of our closer cities. Delivery is ₹3,000 standard.",
    },
    {
      question: "What does a porta cabin cost in Panipat?",
      answer: "Marketplace listings run from about ₹50,000 for a small basic unit to over ₹2.1 lakh — but the real number depends on size, panel type, fit-out and quantity. We quote against your exact spec rather than publish a fixed price. Call +91 87960 39938 or send an enquiry.",
    },
    {
      question: "What sizes and layouts can I get?",
      answer: "Stock sizes run 8×10, 10×12, 10×20 (the common 20 ft office), 10×30, and 10×40 ft, in single-room, two-room, or full multi-room layouts, with an attached toilet or pantry on request. Need an odd size? We build to it.",
    },
    {
      question: "Can you supply multiple cabins for a refinery or HSIIDC project?",
      answer: "Yes. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we'll confirm what we can supply and by when.",
    },
    {
      question: "How long from order to delivery in Panipat?",
      answer: "Transit is 3–5 days once the cabin's built, since Panipat is a short run up the NH-44. Production time depends on the configuration and your place in the queue — standard sizes move quicker. We'll give you a firm timeline at enquiry.",
    },
  ],
  'porta-cabin-in-rourkela': [
    {
      question: "Do you deliver porta cabins to the RSP belt and Kalunga?",
      answer: "Yes — the Rourkela Steel Plant belt, the Kalunga Industrial Estate, the RSP sector township, and project sites across Rourkela. The cabin ships from our Greater Noida factory and takes 4–6 days in transit, since Rourkela is a longer haul. Delivery is ₹3,000 standard.",
    },
    {
      question: "Will the cabin hold up in a dusty Kalunga steel-belt plot?",
      answer: "That's what it's built for. The frame is IS 2062 steel, zinc-phosphate primed and powder-coated, and for a dusty sponge-iron or steel-yard posting we can spec a heavier anti-rust coating and seal the windows and doors to keep plant dust out. The 50 mm PUF panels handle the heat. Tell us the plant conditions and we'll match the spec.",
    },
    {
      question: "What does a porta cabin cost in Rourkela?",
      answer: "Marketplace listings run around ₹825–₹1,200 a square foot, with finished units up past ₹1.9 lakh — but the real number depends on size, panel type, coating spec, fit-out and quantity. We quote against your exact spec rather than publish a fixed price. Call +91 87960 39938 or send an enquiry.",
    },
    {
      question: "Can you supply multiple cabins for an RSP or Kalunga plant project?",
      answer: "Yes — multi-cabin plant orders are routine for us. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we'll confirm capacity, freight, and timeline.",
    },
    {
      question: "How long does delivery to Rourkela take?",
      answer: "Transit is 4–6 days once the cabin's built, since Rourkela is well east of our NCR cities. We plan for the upper end and tell you straight rather than promise a date we can't hold. Production time depends on the configuration and your place in the queue — we'll confirm a firm timeline at enquiry.",
    },
  ],
  'porta-cabin-in-bhiwadi': [
    {
      question: "Do you deliver porta cabins to RIICO, Khushkhera, and Chopanki?",
      answer: "Yes — RIICO Bhiwadi, Khushkhera, Chopanki, and construction sites across the Bhiwadi belt. The cabin ships from our Greater Noida factory and takes 3–5 days, since Bhiwadi is a short run. Delivery is ₹3,000 standard.",
    },
    {
      question: "What does a porta cabin cost in Bhiwadi?",
      answer: "Marketplace listings run around ₹780–₹1,250 a square foot, with finished units from about ₹2.5 lakh — but the real number depends on size, panel type, fit-out and quantity. We quote against your exact spec rather than publish a fixed price. Call +91 87960 39938 or send an enquiry.",
    },
    {
      question: "What sizes and layouts can I get?",
      answer: "Stock sizes run 8×10, 10×12, 10×20 (the common 20 ft office), 10×30, and 10×40 ft, in single-room, two-room, or full multi-room layouts, with an attached toilet or pantry on request. Need an odd size? We build to it.",
    },
    {
      question: "Can you supply multiple cabins for a RIICO plant project?",
      answer: "Yes. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we'll confirm what we can supply and by when.",
    },
    {
      question: "How long from order to delivery in Bhiwadi?",
      answer: "Transit is 3–5 days once the cabin's built, since Bhiwadi is a short run from Greater Noida. Production time depends on the configuration and your place in the queue — standard sizes move quicker. We'll give you a firm timeline at enquiry.",
    },
  ],
  'porta-cabin-in-jamshedpur': [
    {
      question: "Do you deliver porta cabins to Adityapur and the AIADA belt?",
      answer: "Yes — Adityapur AIADA, the Gamharia industrial phases, the Tata Steel works belt, and project sites across Jamshedpur. The cabin ships from our Greater Noida factory and takes 4–6 days in transit, since Jamshedpur is a longer haul. Delivery is ₹3,000 standard.",
    },
    {
      question: "Will the cabin hold up in a dusty AIADA steel-belt plot?",
      answer: "That's what it's built for. The frame is IS 2062 steel, zinc-phosphate primed and powder-coated, and for a dusty steel-yard posting we can spec a heavier anti-rust coating and seal the windows and doors to keep plant dust out. The 50 mm PUF panels handle the heat. Tell us the plant conditions and we'll match the spec.",
    },
    {
      question: "What does a porta cabin cost in Jamshedpur?",
      answer: "Marketplace listings run from about ₹1.36 lakh to over ₹2.45 lakh, around ₹800 a square foot — but the real number depends on size, panel type, coating spec, fit-out and quantity. We quote against your exact spec rather than publish a fixed price. Call +91 87960 39938 or send an enquiry.",
    },
    {
      question: "Can you supply multiple cabins for a Tata Steel or AIADA vendor project?",
      answer: "Yes — multi-cabin plant orders are routine for us. We supply contractors and project managers, and our NSIC, DPIIT, ISO certificates, GST registration and incorporation papers are ready for vendor empanelment. Send the project scope and we'll confirm capacity, freight, and timeline.",
    },
    {
      question: "How long does delivery to Jamshedpur take?",
      answer: "Transit is 4–6 days once the cabin's built, since Jamshedpur is well east of our NCR cities. We plan for the upper end and tell you straight rather than promise a date we can't hold. Production time depends on the configuration and your place in the queue — we'll confirm a firm timeline at enquiry.",
    },
  ],
  'porta-cabin-in-salem': [
    {
      question: "Can you supply porta cabins to the SIPCOT Mecheri industrial estate?",
      answer: "Yes. We deliver to SIPCOT Mecheri (PIN 636453) and all industrial estate addresses in Salem district. If your unit requires vehicle entry authorisation, share the contact details and gate procedure when placing the order. We coordinate the delivery vehicle arrival with your site team.",
    },
    {
      question: "How should I prepare my Salem site for cabin delivery and placement?",
      answer: "Clear and level a footprint slightly larger than the cabin size. Confirm overhead clearance — no low power lines or cables above the placement zone. Book a crane or JCB rated for the cabin weight (we provide this with the delivery note). Arrange gate-pass for our delivery vehicle if your site is inside an industrial estate. Installation takes 2 to 3 hours once the crane is on-site.",
    },
    {
      question: "Salem gets very hot in summer. Will the cabin be comfortable to work in?",
      answer: "A standard 40mm PUF panel cabin provides meaningful thermal insulation. For direct-sun sites in Salem's peak summer (April to June), we recommend the insulation upgrade plus AC provision. A 1.5-tonne AC unit paired with an insulated cabin and a false ceiling will maintain a workable temperature even at 40°C outside.",
    },
    {
      question: "Can you supply multiple porta cabins for a large Salem project?",
      answer: "Yes. We handle multi-unit orders for labour colonies, site office clusters, and permanent installations. Multi-unit orders are planned as a set — cabin sizes, layout, spacing, and shared services (power, water) — and dispatched in coordinated batches. Call us with the project scope and we plan the supply schedule.",
    },
  ],
  'porta-cabin-in-tumkur': [
    {
      question: "Can you deliver a porta cabin to KIADB Hirehalli Industrial Area, Tumkur, within 2 weeks of my order?",
      answer: "For a standard size with no custom fit-out — 10 ft × 8 ft or 20 ft × 8 ft with a door and window only — manufacture takes 7 to 10 working days and transit to Hirehalli (PIN 572168) is 1 to 2 days. Total: 8 to 12 working days from order confirmation. Yes, 2 weeks is achievable for standard cabins. Custom fit-out with electrical, AC, and toilet takes 11 to 17 working days total. Tell us your deadline when you call — we confirm whether it is achievable honestly, not optimistically.",
    },
    {
      question: "What base does my Tumkur site need for the cabin to sit on?",
      answer: "A levelled, hard, compacted surface. Compacted murrum, paver block, or existing concrete slab all work for temporary or semi-permanent placement. The cabin does not need a poured RCC foundation unless you are installing it permanently, in which case we include anchor bolt fixing plates in the base frame and provide the bolt pattern drawing. For KIADB plot installations where the cabin is part of a long-term factory setup, we recommend the anchor bolt option.",
    },
    {
      question: "Do you supply porta cabins to warehouse and logistics sites near Tumkur on NH 48?",
      answer: "Yes. We supply to logistics parks, warehouse campuses, and e-commerce fulfilment centres along the NH 48 Tumkur belt. Security cabins at compound gates, supervisor offices inside the warehouse, and labour rest rooms are the standard requirements for these sites. We can supply multiple units in a coordinated dispatch if your project needs cabins at several locations.",
    },
    {
      question: "Can we visit your factory in Bangalore before placing the order?",
      answer: "Yes. Our manufacturing facility is at Gopasandra, Sarjapura Hubli Road, Bangalore 560099 — approximately 65 km from Tumkur. You are welcome to visit and inspect a cabin in progress or a completed unit before placing your order. Call +91 88616 22859 to arrange the visit in advance so we can schedule time with our production team.",
    },
  ],
  'porta-cabin-in-tirupur': [
    {
      question: "Can you supply porta cabins for a garment factory construction site in Tirupur with fast delivery?",
      answer: "Yes. For a standard 10 ft × 8 ft or 20 ft × 8 ft cabin with no custom fit-out, manufacture takes 7 to 10 working days and transit to Tirupur is 4 to 5 days. Total from order to delivery: 11 to 15 working days. For custom fit-out with electrical, insulation upgrade, AC provision, and toilet: 14 to 20 working days total. If your construction start date is fixed, call us with the date and we confirm whether it is achievable from our current production queue.",
    },
    {
      question: "Will a standard porta cabin handle Tirupur's summer heat comfortably?",
      answer: "A standard 40mm PUF panel cabin with heat-reflective GI roof and upper louvre vents provides meaningful thermal protection. For sites with all-day direct western sun exposure — common on open garment factory construction sites — we recommend the 60mm PUF upgrade plus AC provision. A 1.5-tonne split AC in an upgraded PUF cabin maintains a workable internal temperature even at 39 to 40°C outside. Specify the upgrade at enquiry stage — it cannot be added after manufacturing begins.",
    },
    {
      question: "Can you supply the security cabin with a counter ledge for a garment compound gate in Tirupur?",
      answer: "Yes. A fixed MS flat-bar counter ledge below the sliding window is a standard add-on for garment factory security cabins. Specify it when enquiring and we include it in the manufacturing plan. The counter is sized to the window width and welded to the cabin frame — not bolted on as an afterthought.",
    },
    {
      question: "Do you supply vendor documentation for garment buyer compliance audits in Tirupur?",
      answer: "Yes. If your factory audit requires vendor certification for any cabins installed on your compound, we supply ISO certificate copies (9001, 14001, 45001), NSIC registration, DPIIT recognition letter, and GST registration document. Request the documentation file when placing your order and we include it with your delivery paperwork.",
    },
  ],
  'porta-cabin-in-aurangabad': [
    {
      question: "Can you deliver porta cabins to MIDC Waluj, Aurangabad, from your Greater Noida factory?",
      answer: "Yes. We dispatch from our Greater Noida facility (PIN 201308) and deliver to MIDC Waluj (PIN 431136), MIDC Chikalthana (PIN 431006), MIDC Shendra, and all Aurangabad addresses. Transit is 4 to 6 days by road. For MIDC Waluj heavy-vehicle entries, share the entry authorisation procedure and contact when placing your order — we coordinate the delivery vehicle clearance with your site team.",
    },
    {
      question: "How long does manufacturing and delivery take from Greater Noida to Aurangabad?",
      answer: "Standard cabins without custom fit-out: 7 to 10 working days manufacture, then 4 to 6 days transit. Fully custom cabins with electrical, AC provision, partition, and toilet: 12 to 18 working days manufacture, then 4 to 6 days transit. We confirm both dates in writing when you place the order. For MIDC procurement, we can provide a formal delivery commitment letter on company letterhead on request.",
    },
    {
      question: "Do you supply vendor documentation for auto sector quality audits at MIDC Waluj, Aurangabad?",
      answer: "Yes. We supply ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 certificate copies, NSIC registration certificate (NSIC/GP/BAN/2024/0055207), DPIIT recognition (DIPP56005), and GST registration (09ABBCS7101B1ZT) as part of your order documentation file. If your Bajaj or Tier-1 auto supplier audit requires a manufacturer's quality declaration or material compliance statement, request it at order stage and we include it with your delivery paperwork.",
    },
    {
      question: "Can you supply 4 to 6 porta cabins for a large factory construction project at MIDC Shendra, Aurangabad?",
      answer: "Yes. Multi-unit orders for large construction projects are planned as a manufacturing batch. We confirm the size and fit-out for each unit, sequence production so all units complete in one batch, and dispatch in a coordinated delivery. For DMIC-node projects at Shendra where the construction schedule is formal and phased, we can align our dispatch dates to your project timeline. Call with the project scope and we build the supply plan.",
    },
  ],
  'container-office-in-bangalore': [
    {
      question: "What is the price of a container office in Bangalore?",
      answer: "Price depends on size, whether it is a converted shipping container or a new steel-frame build, and the fit-out level. A basic 20 ft unit costs less than a 40 ft fully-fitted office with AC, partition, and toilet. Because we manufacture and dispatch from within Bangalore, freight is lower than from out-of-state suppliers. Call +91 88616 22859 with your requirement for a written quotation with full cost breakup within 24 hours.",
    },
    {
      question: "How quickly can SAMAN deliver a container office in Bangalore?",
      answer: "Standard sizes are typically ready in 7–12 working days from order confirmation. Since our factory is in Gopasandra (560099), transit to any Bangalore address — Peenya, Bommasandra, Electronic City, Whitefield — is same-day once dispatched. Custom fit-out with AC, partition, and toilet adds a few working days to production.",
    },
    {
      question: "Can I visit your factory before ordering?",
      answer: "Yes. Our manufacturing facility is at Gopasandra, Sarjapura Hubli Road, Bangalore 560099. You are welcome to inspect a container office in progress or a completed unit before placing your order. Call +91 88616 22859 to schedule a visit with our production team.",
    },
    {
      question: "Do you deliver container offices to Peenya and Electronic City industrial areas?",
      answer: "Yes. We deliver across all Bangalore industrial zones including Peenya (560058), Bommasandra (560099), Electronic City (560100), and Whitefield / EPIP (560066), plus construction sites anywhere a crane or forklift can place the unit. For industrial estate deliveries needing a gate pass, share the entry procedure when you order.",
    },
  ],
  'container-office-in-chennai': [
    {
      question: "What is the price of a container office in Chennai?",
      answer: "Price depends on size, whether it is a converted shipping container or a new steel-frame build, the insulation and AC fit-out, and any partition or toilet additions. A basic 20 ft unit costs less than a 40 ft fully-fitted office. Freight from our Bangalore factory to Chennai is added as a separate line. Call +91 88616 22859 with your requirement for a written quotation with full breakup within 24 hours.",
    },
    {
      question: "Can you deliver a container office to Oragadam or Sriperumbudur auto plants?",
      answer: "Yes. We deliver to the Oragadam SIPCOT corridor (PIN 603204), Sriperumbudur (602105), Ambattur (600058), Guindy (600032), and all Chennai industrial and construction addresses. For auto plant and SIPCOT estate deliveries needing gate-pass authorisation, share the entry procedure when you order and we coordinate the delivery vehicle with your site.",
    },
    {
      question: "How long does delivery take from Bangalore to Chennai?",
      answer: "Standard sizes are typically ready in 7–12 working days from order confirmation, with transit to Chennai of 4–5 days. Custom fit-out with AC, partition, and toilet adds a few working days to production. We confirm the dispatch and delivery dates in writing when you order.",
    },
    {
      question: "Are your container offices suitable for Chennai's hot, humid coastal climate?",
      answer: "Yes. We use PUF or rock wool insulation as standard and apply anti-corrosion treatment to the steel. For coastal and direct-sun sites we recommend upgraded insulation, a heat-reflective over-roof, and AC provision. This keeps the interior workable through Chennai summers and protects the structure against humidity and salt air over its service life.",
    },
  ],
  'container-office-in-hyderabad': [
    {
      question: "What is the price of a container office in Hyderabad?",
      answer: "Price depends on size, whether it is a converted shipping container or a new steel-frame build, the insulation and AC fit-out, and any partition or toilet additions. A basic 20 ft unit costs less than a 40 ft fully-fitted office. Freight from our Bangalore factory to Hyderabad is added as a separate line. Call +91 88616 22859 with your requirement for a written quotation with full breakup within 24 hours.",
    },
    {
      question: "Can you deliver a container office to pharma plants in Jeedimetla or Patancheru?",
      answer: "Yes. We deliver to Jeedimetla (PIN 500055), the Patancheru and Bollaram pharma belt (502319 / 502325), the Genome Valley cluster, the Gachibowli IT corridor (500032), and all Hyderabad industrial and construction addresses. For pharma plant and industrial estate deliveries needing gate-pass or controlled-entry authorisation, share the procedure when you order and we coordinate the delivery vehicle with your site.",
    },
    {
      question: "How long does delivery take from Bangalore to Hyderabad?",
      answer: "Standard sizes are typically ready in 7–12 working days from order confirmation, with transit to Hyderabad of 4–5 days. Custom fit-out with AC, partition, and toilet adds a few working days to production. We confirm dispatch and delivery dates in writing when you order.",
    },
    {
      question: "Do you provide documentation for a pharma facility audit?",
      answer: "Yes. We supply ISO certificate copies (9001, 14001, 45001), NSIC registration, DPIIT recognition, and GST registration as part of your order file. If your facility audit or GMP documentation requires a manufacturer's declaration for installed cabins, request it at order stage and we include it with the delivery paperwork.",
    },
  ],
  'container-office-in-kochi': [
    {
      question: "How much does a container office cost in Kochi?",
      answer: "Price depends on size, insulation, weather-sealing, partitions, electricals and fit-out. A bare 10 ft gate cabin and a fully fitted 40 ft project office sit far apart on cost. We quote to your exact specification - share your requirement for an itemised price.",
    },
    {
      question: "How long does delivery take to Kochi?",
      answer: "We dispatch from our Bangalore factory, roughly 550 km away, with typical road transit of 3-5 days once the unit is built. We confirm the schedule at order stage based on your site location and access.",
    },
    {
      question: "Are the units built for Kochi's monsoon and coastal conditions?",
      answer: "Yes. We use galvanised roofing with proper drainage slope, sealed openings and added weather protection for salt air and heavy rain. Tell us the site conditions and we configure the unit accordingly.",
    },
    {
      question: "Can the container office be moved between sites later?",
      answer: "Yes. Container offices are relocatable. If you expect to shift the unit between project sites, tell us at order stage so we specify lifting points and a shell suited to repeated handling.",
    },
  ],
  'container-office-in-mumbai': [
    {
      question: "What is the price of a container office in Mumbai?",
      answer: "Price depends on size, whether it is a converted shipping container or a new steel-frame build, the insulation and coastal anti-corrosion level, and any partition or toilet additions. A basic 20 ft unit costs less than a 40 ft fully-fitted office. Freight from our Greater Noida factory to Mumbai is added as a separate transparent line. Call +91 87960 39938 for a written quotation with full breakup within 24 hours.",
    },
    {
      question: "Mumbai is far from your factory — why order from SAMAN instead of a local supplier?",
      answer: "Most container offices sold locally in Mumbai are resold by dealers or assembled by fabricators with no quality certification, no warranty, and no traceability on the steel. SAMAN builds every unit under ISO 9001:2015 quality management, with a 5-year structural warranty and a 20-25 year engineered service life. For a unit that must last years through Mumbai's monsoon and coastal humidity, certified build quality and real documentation justify the 4-6 day transit. We are upfront about the lead time so you can plan around it.",
    },
    {
      question: "Can you deliver a container office to MIDC Andheri, Taloja, or the Bhiwandi belt?",
      answer: "Yes. We deliver to MIDC Andheri (PIN 400069), Wagle Estate Thane (400604), Taloja MIDC (410208), the Bhiwandi logistics belt (421308), and all Mumbai Metropolitan Region addresses. For MIDC estate deliveries needing gate-pass authorisation, share the entry procedure when you order and we coordinate the delivery vehicle with your site.",
    },
    {
      question: "Are your container offices treated for Mumbai's coastal climate?",
      answer: "Yes. We apply anti-corrosion treatment to the steel as standard and, for Mumbai, strongly recommend the upgraded coastal treatment plus monsoon-grade roof sealing. PUF or rock wool insulation keeps the interior workable through humid summers. These protections are specified before manufacturing so the unit arrives ready for the coastal environment and lasts its full service life.",
    },
  ],
  'container-office-in-delhi': [
    {
      question: "What is the price of a container office in Delhi?",
      answer: "Price depends on size, whether it is a converted shipping container or a new steel-frame build, the insulation and AC fit-out, and any partition or toilet additions. A basic 20 ft unit costs less than a 40 ft fully-fitted office. Because our factory is in Greater Noida, next to the NCR, freight to Delhi is lower than from distant suppliers. Call +91 87960 39938 for a written quotation with full breakup within 24 hours.",
    },
    {
      question: "Can you deliver a container office to Okhla, Bawana, or Narela industrial areas?",
      answer: "Yes. We deliver to Okhla (PIN 110020), Bawana (110039), Narela (110040), Mayapuri (110064), and all Delhi industrial, construction, and government project addresses. For industrial estate or government site deliveries needing gate-pass or entry authorisation, share the procedure when you order and we coordinate the delivery vehicle with your site.",
    },
    {
      question: "How quickly can you deliver to Delhi from your Greater Noida factory?",
      answer: "Standard sizes are typically ready in 7–12 working days from order confirmation. Because our factory is only 40 to 50 km from most of Delhi, transit is usually same-day once dispatched. Custom fit-out with AC, partition, and toilet adds a few working days to production.",
    },
    {
      question: "Do you supply container offices for PWD and government civil projects in Delhi?",
      answer: "Yes. We supply deployable site offices and security cabins for government, PWD, and municipal civil projects across Delhi. We provide the vendor documentation — ISO certificates, NSIC registration, DPIIT recognition, GST papers — needed for a tender or procurement file. Mention the documentation requirement when you place the order.",
    },
  ],
  'container-office-in-jaipur': [
    {
      question: "What is the price of a container office in Jaipur?",
      answer: "Price depends on size, whether it is a converted shipping container or a new steel-frame build, the insulation and AC fit-out, and any partition or toilet additions. A compact 10 ft or 20 ft unit is an economical option for an MSME office. Freight from our Greater Noida factory is added as a separate transparent line. Call +91 87960 39938 for a written quotation with full breakup within 24 hours.",
    },
    {
      question: "Can you deliver a container office to Sitapura or VKI RIICO areas?",
      answer: "Yes. We deliver to Sitapura Industrial Area (PIN 302022), Vishwakarma Industrial Area / VKI (302013), the surrounding RIICO estates, and all Jaipur industrial and construction addresses. For RIICO estate deliveries needing gate-pass authorisation, share the entry procedure when you order and we coordinate the delivery vehicle with your site.",
    },
    {
      question: "Is a container office a good option for a small RIICO plot without space for construction?",
      answer: "Yes — that is exactly where it fits best. A container office needs no foundation or civil construction for temporary or semi-permanent use; a levelled hard surface is enough. It arrives as a finished, lockable office and can be placed in a single delivery on a compact plot. When the unit is no longer needed in that spot, it can be relocated by crane. For an MSME avoiding the cost and delay of building, it is the efficient choice.",
    },
    {
      question: "Do you provide documentation for MSME registration or a vendor audit?",
      answer: "Yes. We supply ISO certificate copies (9001, 14001, 45001), NSIC registration, DPIIT recognition, and GST registration with your order file. These are useful for MSME and tender documentation. If your audit requires a manufacturer's declaration for the installed cabin, request it at order stage and we include it with the delivery paperwork.",
    },
  ],
  'container-office-in-pune': [
    {
      question: "What is the price of a container office in Pune?",
      answer: "Price depends on size, whether it is a converted shipping container or a new steel-frame build, the insulation and AC fit-out, and any partition or toilet additions. A basic 20 ft unit costs less than a 40 ft fully-fitted office. Freight from our Greater Noida factory to Pune is added as a separate transparent line. Call +91 87960 39938 for a written quotation with full breakup within 24 hours.",
    },
    {
      question: "Can you deliver a container office to Chakan or Ranjangaon MIDC?",
      answer: "Yes. We deliver to Chakan MIDC (PIN 410501), Talegaon MIDC, Ranjangaon MIDC, Pimpri-Chinchwad, and all Pune industrial and construction addresses. For MIDC estate deliveries needing gate-pass authorisation, share the entry procedure when you order and we coordinate the delivery vehicle with your site.",
    },
    {
      question: "Pune is far from your factory — how do you manage delivery?",
      answer: "Pune is about 1,400 km from our Greater Noida factory, with road transit of several days. We are upfront about this and plan the dispatch around your project schedule, so the unit arrives when you need it on-site rather than as a surprise. The cabin is fully built and fitted before dispatch — nothing is assembled at your site. For a unit that must last years on a MIDC plot, certified build quality and real documentation justify the planned lead time.",
    },
    {
      question: "Do you provide documentation for an auto-sector vendor audit in Pune?",
      answer: "Yes. We supply ISO certificate copies (9001, 14001, 45001), NSIC registration, DPIIT recognition, and GST registration as part of your order file. If your Tier-1 supplier or plant audit requires a manufacturer's declaration for installed cabins, request it at order stage and we include it with the delivery paperwork.",
    },
  ],
  'container-office-in-lucknow': [
    {
      question: "What is the price of a container office in Lucknow?",
      answer: "Price depends on size, whether it is a converted shipping container or a new steel-frame build, the insulation and AC fit-out, and any partition or toilet additions. A basic 20 ft unit costs less than a 40 ft fully-fitted office. Because Lucknow is within the north India belt, freight from our Greater Noida factory is reasonable and quoted as a separate line. Call +91 87960 39938 for a written quotation with full breakup within 24 hours.",
    },
    {
      question: "Can you deliver a container office to the Amausi or Nadarganj UPSIDA area?",
      answer: "Yes. We deliver to the Amausi / Nadarganj Industrial Area (PIN 226008), the Sarojini Nagar UPSIDA estate, the Kanpur Road logistics corridor, and all Lucknow industrial, construction, and government project addresses. For UPSIDA estate or government site deliveries needing gate-pass or entry authorisation, share the procedure when you order and we coordinate the delivery vehicle with your site.",
    },
    {
      question: "Do you supply container offices for government and UPSIDA projects in Lucknow?",
      answer: "Yes. We supply deployable site offices and security cabins for government, PWD, UPSIDA, and infrastructure projects across Lucknow. We provide the vendor documentation — ISO certificates, NSIC registration, DPIIT recognition, GST papers — that a tender or procurement file requires. Mention the documentation requirement when you place the order so we include it with the delivery paperwork.",
    },
    {
      question: "How quickly can you deliver to Lucknow from your Greater Noida factory?",
      answer: "Standard sizes are typically ready in 7–12 working days from order confirmation. Lucknow is within the north India delivery belt from our Greater Noida factory, so transit is short relative to far-zone cities. Custom fit-out with AC, partition, and toilet adds a few working days to production. We confirm the dispatch and delivery dates in writing when you order.",
    },
  ],
  'container-office-in-kolkata': [
    {
      question: "What is the price of a container office in Kolkata?",
      answer: "Price depends on size, whether it is a converted shipping container or a new steel-frame build, the monsoon-sealing and anti-corrosion level, the AC fit-out, and any partition or toilet additions. A basic 20 ft unit costs less than a 40 ft fully-fitted office. Freight from our Greater Noida factory is added as a separate transparent line. Call +91 87960 39938 for a written quotation with full breakup within 24 hours.",
    },
    {
      question: "Can you deliver a container office to the Taratala belt or Kolkata Port area?",
      answer: "Yes. We deliver to the Taratala industrial corridor (PIN 700088), the Kolkata Port and Haldia dock area, the Dankuni logistics belt, the Howrah industrial zone, and all Kolkata addresses. For port and dock deliveries needing gate-pass or security authorisation, share the entry procedure when you order and we coordinate the delivery vehicle with your site.",
    },
    {
      question: "Will the container office hold up through the Kolkata monsoon?",
      answer: "Yes. We seal the roof overlaps, treat the door and window seals, and offer a sloped over-roof to shed heavy rain — specified as standard for Kolkata-bound units. We also apply upgraded anti-corrosion treatment for the humid, river-side environment. The unit stays dry and structurally sound through the Bengal monsoon, and the steel is protected against humidity over its full service life.",
    },
    {
      question: "Do you supply container offices for port and warehouse operations in Kolkata?",
      answer: "Yes. We supply dispatch supervisor cabins, gate security posts, and yard offices for port, dock, and warehouse operators across Kolkata, Haldia, and Dankuni. For operations that reconfigure their yard, the units are movable by crane or forklift. We can supply multiple units in a coordinated dispatch for a large logistics site.",
    },
  ],
  'container-office-in-ahmedabad': [
    {
      question: "What is the price of a container office in Ahmedabad?",
      answer: "Price depends on size, whether it is a converted shipping container or a new steel-frame build, the insulation and heat-protection level, the AC fit-out, and any partition or toilet additions. A basic 20 ft unit costs less than a 40 ft fully-fitted office. Freight from our Greater Noida factory is added as a separate transparent line. Call +91 87960 39938 for a written quotation with full breakup within 24 hours.",
    },
    {
      question: "Can you deliver a container office to Vatva or Sanand GIDC?",
      answer: "Yes. We deliver to Vatva GIDC (PIN 382445), Naroda GIDC, Sanand (382110), Changodar, and all Ahmedabad industrial and construction addresses. For GIDC estate deliveries needing gate-pass authorisation, share the entry procedure when you order and we coordinate the delivery vehicle with your site.",
    },
    {
      question: "Will the container office stay workable in Ahmedabad's summer heat?",
      answer: "Yes — if it is built for it, which ours are. We use upgraded PUF or rock wool insulation and a heat-reflective over-roof as standard for Ahmedabad-bound units, which cuts radiant heat gain significantly. Paired with AC provision and a false ceiling, the office stays workable even through a Gujarat April afternoon. We specify the heat protection before manufacturing so the unit arrives ready for the climate.",
    },
    {
      question: "Do you provide documentation for a GIDC or pharma vendor audit?",
      answer: "Yes. We supply ISO certificate copies (9001, 14001, 45001), NSIC registration, DPIIT recognition, and GST registration as part of your order file. If your facility audit requires a manufacturer's declaration for installed cabins, request it at order stage and we include it with the delivery paperwork.",
    },
  ],
  'container-office-in-visakhapatnam': [
    {
      question: "How much does a container office cost in Visakhapatnam?",
      answer: "Price depends on size, insulation, corrosion protection, partitions, electricals and fit-out, plus the long-distance transport. A bare 10 ft gate cabin and a fully fitted 40 ft project office sit far apart on cost. We quote to your exact specification — share your requirement for an itemised price.",
    },
    {
      question: "How long does delivery take to Visakhapatnam?",
      answer: "Vizag is roughly 1,000 km from our Bangalore factory, so it is a longer haul than our nearer South cities. We confirm a realistic transit window at order stage based on your site location and access, and dispatch once the unit is built.",
    },
    {
      question: "Are the units suitable for steel-plant, shipyard and coastal sites?",
      answer: "Yes. We can build on a reinforced shell with extra corrosion protection and the insulation and fit-out your site needs. Tell us the conditions and intended use and we configure the unit accordingly.",
    },
    {
      question: "Can the container office be moved between sites later?",
      answer: "Yes. Container offices are relocatable. If you expect to shift the unit between project sites, tell us at order stage so we specify lifting points and a shell suited to repeated handling.",
    },
  ],
  'container-office-in-vijayawada': [
    {
      question: "How much does a container office cost in Vijayawada?",
      answer: "Price depends on size, insulation, partitions, electricals and fit-out. A bare 10 ft gate cabin and a fully fitted 40 ft project office sit far apart on cost. We quote to your exact specification — share your requirement for an itemised price.",
    },
    {
      question: "How long does delivery take to Vijayawada?",
      answer: "We dispatch from our Bangalore factory, around 760 km away on NH44, with typical road transit of 3–5 days once the unit is built. We confirm the schedule at order stage based on your site location and access.",
    },
    {
      question: "Do you supply container offices for Amaravati capital-region construction sites?",
      answer: "Yes. The Mangalagiri–Tadepalli–Amaravati corridor is one of our main areas of demand around Vijayawada. We supply site offices, engineer cabins and security posts, and can relocate units as the project moves.",
    },
    {
      question: "Can the container office be moved between sites later?",
      answer: "Yes. Container offices are relocatable. If you expect to shift the unit between project sites, tell us at order stage so we specify lifting points and a shell suited to repeated handling.",
    },
  ],
  'container-office-in-coimbatore': [
    {
      question: "How much does a container office cost in Coimbatore?",
      answer: "Price depends on size, insulation, partitions, electricals and fit-out. A bare 10 ft security cabin and a fully fitted 40 ft project office sit far apart on cost. We quote to your exact specification — share your requirement for an itemised price.",
    },
    {
      question: "How long does delivery take to Coimbatore?",
      answer: "We dispatch from our Bangalore factory, roughly 360 km away, with typical road transit of 3–5 days once the unit is built. We confirm the schedule at order stage based on your site location and access.",
    },
    {
      question: "Are the units suitable for foundry and dusty shop-floor conditions?",
      answer: "Yes. We can dust-seal openings, add insulation and AC provision, and finish the unit for hot, dusty environments common in Coimbatore’s foundry and fabrication belts. Specify the conditions and we configure accordingly.",
    },
    {
      question: "Can I move the container office between sites later?",
      answer: "Yes. Container offices are relocatable. If you expect to shift the unit between project sites, tell us at order stage so we specify lifting points and a shell suited to repeated handling.",
    },
  ],
};

export const getFAQSchemaOverride = (slug: string): object | null => {
  const items = FAQ_SCHEMA_OVERRIDES[slug];
  return items ? faqSchemaFromItems(items) : null;
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
  // National (no city in slug) clusters: areaServed defaults to `areaName` (e.g. India)
  // instead of a captured locality. Used for product-service pages without a location.
  national?: boolean;
  areaName?: string;
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
  // ── Extended local/service clusters (schema-gaps fix) ───────────────────
  // Order is significant: more-specific prefixes precede their shorter variants
  // so the right serviceType wins. All emit a lean Service node (no price/review).
  {
    prefix: /^(?:portable-office-cabins-in-)(.+)$/i,
    namePrefix: 'Portable Office Cabins in',
    serviceType: 'Portable Office Cabin Supplier',
  },
  {
    prefix: /^(?:portable-cabins-in-)(.+)$/i,
    namePrefix: 'Portable Cabins in',
    serviceType: 'Portable Cabin Supplier',
  },
  {
    prefix: /^(?:container-offices-for-sale-in-)(.+)$/i,
    namePrefix: 'Container Offices for Sale in',
    serviceType: 'Container Office for Sale',
  },
  {
    prefix: /^(?:container-offices-in-)(.+)$/i,
    namePrefix: 'Container Offices in',
    serviceType: 'Container Office Supplier',
  },
  {
    prefix: /^(?:labour-colonies-in-|labor-colonies-in-)(.+)$/i,
    namePrefix: 'Labour Colonies in',
    serviceType: 'Labour Colony Manufacturer',
  },
  {
    prefix: /^(?:portable-toilets-in-)(.+)$/i,
    namePrefix: 'Portable Toilets in',
    serviceType: 'Portable Toilet Cabin Supplier',
  },
  {
    prefix: /^(?:pre-engineered-buildings-in-|peb-structures-in-|peb-buildings-in-)(.+)$/i,
    namePrefix: 'Pre-Engineered Buildings in',
    serviceType: 'PEB Structure Manufacturer',
  },
  {
    prefix: /^(?:prefab-buildings-in-)(.+)$/i,
    namePrefix: 'Prefab Buildings in',
    serviceType: 'Prefab Building Manufacturer',
  },
  {
    prefix: /^(?:prefabricated-structures-in-)(.+)$/i,
    namePrefix: 'Prefabricated Structures in',
    serviceType: 'Prefabricated Structure Manufacturer',
  },
  {
    prefix: /^(?:container-house-in-|container-houses-in-)(.+)$/i,
    namePrefix: 'Container Houses in',
    serviceType: 'Container House Manufacturer',
  },
  // Additional clear local-service clusters (owner-approved beyond initial list).
  {
    prefix: /^(?:industrial-sheds-in-|industrial-shed-in-)(.+)$/i,
    namePrefix: 'Industrial Sheds in',
    serviceType: 'Industrial Shed Manufacturer',
  },
  {
    prefix: /^(?:prefabricated-houses-in-|prefab-houses-in-)(.+)$/i,
    namePrefix: 'Prefabricated Houses in',
    serviceType: 'Prefabricated House Manufacturer',
  },
  {
    prefix: /^(?:portable-office-cabin-manufacturers-in-|portable-office-cabins-manufacturers-in-)(.+)$/i,
    namePrefix: 'Portable Office Cabins in',
    serviceType: 'Portable Office Cabin Manufacturer',
  },
  {
    prefix: /^(?:prefabricated-warehouse-manufacturer-in-|prefabricated-warehouses-in-)(.+)$/i,
    namePrefix: 'Prefabricated Warehouses in',
    serviceType: 'Prefabricated Warehouse Manufacturer',
  },
  // National (no city) — exact temporary-shed landing slug only. Informational
  // guide slugs (e.g. temporary-sheds-guide-*) intentionally do NOT match.
  {
    prefix: /^temporary-sheds?$/i,
    namePrefix: 'Temporary Shed Supply',
    serviceType: 'Temporary Shed Supplier',
    national: true,
    areaName: 'India',
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
  // Delhi NCR dispatch-origin geo reuses the Noida-unit coordinates (verbatim from
  // the 'noida' entry above) for cross-page consistency; sameAs points to the NCR
  // region article to match the "Delhi NCR" area name.
  'delhi ncr': { lat: 28.5355, lng: 77.3910, sameAs: 'https://en.wikipedia.org/wiki/National_Capital_Region_(India)' },
  'greater noida': { lat: 28.4744, lng: 77.5040, sameAs: 'https://en.wikipedia.org/wiki/Greater_Noida' },
  'ghaziabad': { lat: 28.6692, lng: 77.4538, sameAs: 'https://en.wikipedia.org/wiki/Ghaziabad' },
  'gurgaon': { lat: 28.4595, lng: 77.0266, sameAs: 'https://en.wikipedia.org/wiki/Gurgaon' },
  'faridabad': { lat: 28.4089, lng: 77.3178, sameAs: 'https://en.wikipedia.org/wiki/Faridabad' },
};

const matchCityServiceCluster = (slug: string): { area: string; cluster: CityServiceCluster } | null => {
  for (const cluster of CITY_SERVICE_CLUSTERS) {
    const m = (slug || '').match(cluster.prefix);
    if (!m) continue;
    // National (no-location) cluster: fixed areaServed, no locality to parse.
    if (cluster.national) {
      return { area: cluster.areaName || 'India', cluster };
    }
    const captured = m[1];
    if (!captured) continue;
    if (NON_LOCATION_AREAS.has(captured.toLowerCase())) return null;
    const area = captured
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

/**
 * City/geo landing-page schema graph — emits EXACTLY THREE nodes:
 *   1. Organization  (no LocalBusiness — SAMAN has no branch in the city; both
 *      factory addresses are listed as PostalAddress entries)
 *   2. BreadcrumbList (Home → Porta Cabins → this city page)
 *   3. FAQPage        (the FAQs rendered on the page; omitted only if none found)
 * No BlogPosting / WebPage / WebSite / Service / Product nodes — this is a
 * deliberately leaner graph than generateUnifiedBlogGraph(), used only for
 * allowlisted city pages (see CITY_PAGE_SCHEMA_SLUGS in [slug].tsx). Injected
 * the same way as every other page: as the UnifiedSEO `structuredData` prop.
 */
export const getCityPageGraph = (params: {
  url: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  faqSchema: any | null;
  contactTelephone?: string | string[];
}) => {
  const { url, breadcrumbs, faqSchema, contactTelephone = '+91 88616 22859' } = params;

  const organization = {
    '@type': 'Organization',
    '@id': 'https://www.samanportable.com/#organization',
    name: 'SAMAN POS India Pvt Ltd',
    legalName: 'SAMAN POS India Private Limited',
    url: 'https://www.samanportable.com',
    logo: 'https://www.samanportable.com/saman-logo.svg',
    foundingDate: '2009',
    description:
      'Direct manufacturer of steel porta cabins, container offices, security cabins and prefab structures, serving India since 2009. Certified to ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018; NSIC government-purchase enlisted, DPIIT-recognised startup and Udyam registered.',
    identifier: [
      { '@type': 'PropertyValue', name: 'ISO 9001:2015', value: 'E20250218645' },
      { '@type': 'PropertyValue', name: 'ISO 14001:2015', value: 'E20250218646' },
      { '@type': 'PropertyValue', name: 'ISO 45001:2018', value: 'E20250218647' },
      { '@type': 'PropertyValue', name: 'NSIC', value: 'NSIC/GP/BAN/2024/0055207' },
      { '@type': 'PropertyValue', name: 'DPIIT', value: 'DIPP56005' },
      { '@type': 'PropertyValue', name: 'GST North', value: '09ABBCS7101B1ZT' },
      { '@type': 'PropertyValue', name: 'GST South', value: '29ABBCS7101B1ZR' },
      { '@type': 'PropertyValue', name: 'Udyam', value: 'UDYAM-KR-03-0172770' },
    ],
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Gopasandra',
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        postalCode: '560099',
        addressCountry: 'IN',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Vill Jalpura, Tehsil Dadri, Gautam Budh Nagar',
        addressLocality: 'Greater Noida',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201308',
        addressCountry: 'IN',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contactTelephone,
      contactType: 'sales',
      areaServed: 'IN',
    },
  };

  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  const graph: any[] = [organization, breadcrumbList];

  if (faqSchema) {
    graph.push({
      ...faqSchema,
      '@context': undefined,
      '@id': `${url}#faqpage`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
};
