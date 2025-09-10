export const siteConfig = {
  name: 'Saman Portable Office Solutions',
  description: 'Premium portable cabins, container offices, and prefab solutions in Bangalore. Quality, durability, and innovation in portable construction.',
  url: 'https://www.samanportable.com',
  ogImage: 'https://www.samanportable.com/og-image.svg',
  links: {
    twitter: 'https://twitter.com/samanportable',
    github: 'https://github.com/samanportable',
  },
  contact: {
    phone: '+91-XXXXXXXXXX',
    email: 'info@samanportable.com',
    address: 'Bangalore, Karnataka, India',
  },
};

export const defaultSEO = {
  titleTemplate: '%s | Saman Portable Office Solutions',
  defaultTitle: 'Saman Portable Office Solutions - Premium Portable Cabins & Container Offices in Bangalore',
  description: siteConfig.description,
  canonical: siteConfig.url,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    handle: '@samanportable',
    site: '@samanportable',
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
    title: 'Premium Portable Cabins & Container Offices in Bangalore',
    description: 'Leading provider of portable cabins, container offices, and prefab solutions in Bangalore. Quality, durability, and innovation in portable construction.',
    canonical: `${siteConfig.url}/`,
  },
  about: {
    title: 'About Us - Leading Portable Office Solutions Provider',
    description: 'Learn about Saman Portable Office Solutions - your trusted partner for portable cabins, container offices, and prefab solutions in Bangalore.',
    canonical: `${siteConfig.url}/about-us`,
  },
  contact: {
    title: 'Contact Us - Get Portable Office Solutions Quote',
    description: 'Contact Saman Portable Office Solutions for quotes on portable cabins, container offices, and prefab solutions in Bangalore.',
    canonical: `${siteConfig.url}/contact`,
  },
  gallery: {
    title: 'Portfolio Gallery - Our Portable Office Projects',
    description: 'Explore our portfolio of portable cabins, container offices, and prefab solutions projects across Bangalore and Karnataka.',
    canonical: `${siteConfig.url}/gallery`,
  },
  products: {
    title: 'Portable Office Products & Solutions',
    description: 'Browse our complete range of portable cabins, container offices, and prefab solutions. Quality products for all your portable construction needs.',
    canonical: `${siteConfig.url}/product`,
  },
  blog: {
    title: 'Portable Office Industry Insights & News',
    description: 'Stay updated with the latest news, insights, and trends in portable cabins, container offices, and prefab construction industry.',
    canonical: `${siteConfig.url}/blog`,
  },
  rental: {
    title: 'Portable Office Rental Services in Bangalore',
    description: 'Rent portable cabins, container offices, and prefab solutions in Bangalore. Flexible rental terms and competitive pricing.',
    canonical: `${siteConfig.url}/rental-services`,
  },
};
