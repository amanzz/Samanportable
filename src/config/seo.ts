export const siteConfig = {
  name: 'Saman Portable',
  description: 'ISO 9001:2015 certified manufacturer of portable cabins, container offices and prefab structures in Bangalore and Delhi NCR. 21-day delivery. Prices from ₹1.45 Lakh. Get a free quote.',
  url: 'https://www.samanportable.com',
  ogImage: 'https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp',
  author: 'Saman Portable Office Solutions',
  publisher: 'Saman Portable Office Solutions',
  keywords: 'portable cabin manufacturer India, container office manufacturer Bangalore, portable cabins Delhi NCR, prefab structures, security cabins, labour colony, container cafe, ISO certified portable cabins, portable cabin price India',
  links: {
    twitter: 'https://twitter.com/samanportable',
    github: 'https://github.com/samanportable',
  },
  contact: {
    phone: '+91 88616 22859',
    email: 'info@samanportable.com',
    address: 'Sy No 34/2, near India Oil Petrol Pump, Gopasandra, Bengaluru, Karnataka 560099',
  },
};

export const defaultSEO = {
  titleTemplate: '%s | Saman Portable',
  defaultTitle: 'Portable Cabin & Container Office Manufacturer in Bangalore, Delhi NCR',
  description: siteConfig.description,
  // canonical: siteConfig.url, // Removed to prevent duplicate canonical tags - handled by UnifiedSEO
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: 'Portable Cabin & Container Office Manufacturer in Bangalore, Delhi NCR',
    description: 'ISO 9001:2015 certified manufacturer of portable cabins, container offices and prefab structures in Bangalore and Delhi NCR. 21-day delivery. Prices from ₹1.45 Lakh. Get a free quote.',
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Saman Portable - Portable Cabin & Container Office Manufacturer in Bangalore, Delhi NCR',
      },
    ],
  },
  twitter: {
    handle: '@Saman_Portable',
    site: '@Saman_Portable',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#0A3D2A',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
    {
      rel: 'apple-touch-icon',
      href: '/logo-192.svg',
    },
  ],
};

export const pageSEO = {
  home: {
    title: 'Portable Cabin & Container Office Manufacturer in Bangalore, Delhi NCR',
    description: 'ISO 9001:2015 certified manufacturer of portable cabins, container offices and prefab structures in Bangalore and Delhi NCR. 21-day delivery. Prices from ₹1.45 Lakh. Get a free quote.',
    canonical: `${siteConfig.url}/`,
    keywords: 'portable cabin manufacturer India, container office manufacturer Bangalore, portable cabins Delhi NCR, prefab structures, security cabins, labour colony, container cafe, ISO certified portable cabins, portable cabin price India',
  },
  about: {
    title: 'About Saman Portable | India\'s Trusted Modular Construction Leader',
    description: 'Discover Saman Portable, India\'s leading name in portable cabins, container offices, and prefab solutions. 15+ years of innovation, quality, and reliability.',
    canonical: `${siteConfig.url}/about-us`,
    keywords: 'about Saman Portable, portable office company, container office manufacturer, prefab solutions provider, Bangalore',
  },
  contact: {
    title: 'Contact SAMAN Portable in Bangalore & Delhi NCR Today',
    description: 'Get in touch with SAMAN Portable for porta cabin rentals, container offices, and prefab structures. Call +91 88616 22859 for instant assistance today.',
    canonical: `${siteConfig.url}/contact`,
    keywords: 'contact portable office, quote container office, portable cabin inquiry, prefab solutions contact, Bangalore, Greater Noida',
  },
  gallery: {
    title: 'Project Gallery | Portable Cabins & Container Offices',
    description: 'Browse real installations of portable cabins, container offices, labor colonies, and prefab structures delivered by Saman Portable.',
    canonical: `${siteConfig.url}/gallery`,
    keywords: 'portable office gallery, container office projects, prefab solutions portfolio, portable cabin images, project installations',
  },
  products: {
    title: 'Portable Office Products & Solutions',
    description: 'Browse our complete range of portable cabins, container offices, and prefab solutions. Quality products for all your portable construction needs.',
    canonical: `${siteConfig.url}/product`,
    keywords: 'portable office products, container office types, prefab solutions catalog, portable cabin models, modular office solutions',
  },
  blog: {
    title: 'Portable Office Industry Insights & News',
    description: 'Stay updated with the latest news, insights, and trends in portable cabins, container offices, and prefab construction industry.',
    canonical: `${siteConfig.url}/blog`,
    keywords: 'portable office blog, container office news, prefab construction insights, portable building trends, modular office articles',
  },
  rental: {
    title: 'Porta Cabin & Container Office Rental Services in Bangalore',
    description: 'Professional porta cabin and container office rentals. 24-48 hour setup, flexible terms, maintenance included. Book your temporary office space today!',
    canonical: `${siteConfig.url}/rental-services`,
    keywords: 'porta cabin rental, container office rent, prefab structure lease, portable cabin hire, temporary office space Bangalore',
  },
  privacyPolicy: {
    title: 'Privacy Policy | Saman Portable Office Solutions',
    description: 'How we collect, use, and protect personal data at Saman Portable, including cookies and contact details.',
    canonical: `${siteConfig.url}/privacy-policy`,
    keywords: 'privacy policy, data protection, personal information, cookies, GDPR',
  },
  deliveryPolicy: {
    title: 'Delivery Policy | Shipping & Timelines',
    description: 'Delivery coverage, timelines, and logistics for portable cabins and container offices. Safe handling and on-site installation.',
    canonical: `${siteConfig.url}/delivery-policy`,
    keywords: 'delivery policy, shipping policy, delivery terms, shipping process, timelines',
  },
  refundPolicy: {
    title: 'Refund & Return Policy | Saman Portable',
    description: 'Conditions for returns, cancellations, and refunds for portable cabins and prefab products, along with process steps.',
    canonical: `${siteConfig.url}/refund-and-return-policy`,
    keywords: 'refund policy, return policy, cancellations, refunds, warranty',
  },
  terms: {
    title: 'Terms & Conditions | Saman Portable Office Solutions',
    description: 'Usage terms, payment, warranties, and liabilities for Saman Portable products and services.',
    canonical: `${siteConfig.url}/terms-and-conditions`,
    keywords: 'terms and conditions, terms of service, usage policy, legal terms',
  },
};
