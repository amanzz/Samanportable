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
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Saman Portable Office Solutions',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.samanportable.com/saman-logo.svg',
      },
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
    name: 'Saman Portable',
    legalName: 'SAMAN Portable Office Solutions',
    url: 'https://www.samanportable.com',
    logo: 'https://www.samanportable.com/saman-logo.svg',
    foundingDate: '2017',
    description: 'ISO 9001:2015 certified manufacturer of portable cabins, container offices, security cabins and prefab structures. Manufacturing in Bengaluru and Greater Noida. Delivering across India since 2017.',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+918861622859',
        contactType: 'Sales',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Kannada'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+918796039938',
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
      'https://www.facebook.com/samanportable',
      'https://www.instagram.com/samanportable',
      'https://in.pinterest.com/samanportablecabins/',
    ],
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

export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Saman Portable",
  "description": "ISO 9001:2015 certified manufacturer of portable cabins, container offices, security cabins, labour colonies and prefab structures. Serving all of India since 2017. Manufacturing in Bengaluru and Greater Noida.",
  "url": "https://www.samanportable.com",
  "logo": "https://www.samanportable.com/saman-logo.svg",
  "image": "https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp",
  "foundingDate": "2017",
  "priceRange": "₹₹",
  "telephone": ["+918861622859", "+918088685440", "+918796039938"],
  "email": "info@samanportable.com",
  "address": [
    {
      "@type": "PostalAddress",
      "name": "Manufacturing Unit 1 — Bengaluru",
      "streetAddress": "Sy No 34/2, near India Oil Petrol Pump, Gopasandra",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560099",
      "addressCountry": "IN"
    },
    {
      "@type": "PostalAddress",
      "name": "Manufacturing Unit 2 — Greater Noida",
      "streetAddress": "Khata No 226, Vill-Jalpura, Bisrakh Rd, Dadri",
      "addressLocality": "Greater Noida",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201308",
      "addressCountry": "IN"
    }
  ],
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "13.0450",
    "longitude": "77.5540"
  },
  "openingHours": "Mo-Sa 09:00-18:00",
  "areaServed": [
    "Karnataka", "Tamil Nadu", "Andhra Pradesh", "Telangana", "Kerala",
    "Maharashtra", "Goa", "Gujarat", "Rajasthan", "Delhi NCR",
    "Uttar Pradesh", "Haryana", "Punjab", "West Bengal", "Odisha",
    "Madhya Pradesh", "Jharkhand", "Bihar", "Assam", "Himachal Pradesh"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Portable Cabin & Prefab Structure Products",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Porta Cabin", "description": "ISI-certified steel-frame portable cabins from Rs 1,45,000" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Container Office", "description": "20ft and 40ft container offices from Rs 2,25,000" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Security Cabin", "description": "FRP and MS steel security cabins and guard rooms" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Labour Colony", "description": "Modular labour accommodation and bunk house units" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Container Cafe", "description": "Custom container cafes and food kiosks" } }
    ]
  }
});

export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Saman Portable",
  "url": "https://www.samanportable.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.samanportable.com/product?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const getHomepageFAQSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does a portable cabin cost in India?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "Prices start at Rs 1,45,000 for a 10x10 ft security cabin. Standard site offices from Rs 2,55,000. Large container offices Rs 3,35,000 to Rs 5,00,000. Per square foot: Rs 900 to Rs 2,500 depending on specification. Saman Portable provides fixed-price quotes within 48 hours." }
    },
    {
      "@type": "Question",
      "name": "How long does delivery and installation take?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "Standard orders are delivered and fully installed within 7–21 days anywhere in India. Includes manufacturing, transport to site, and on-site installation by our team." }
    },
    {
      "@type": "Question",
      "name": "Can portable cabins handle Indian heat, rain and high winds?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "Yes. 50mm PUF insulation reduces interior temperature 8-12 degrees below outside. Galvanised steel roof handles 3000mm annual rainfall. Wind-load certified to 200 km/hr. Installed across Kerala, Rajasthan, coastal Karnataka and high-altitude sites." }
    },
    {
      "@type": "Question",
      "name": "Do you offer portable cabins on rent?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "Yes. Rental from Rs 8,000 per month. Available in Bangalore, Delhi NCR, Hyderabad, Chennai, Pune and Mumbai. Delivery, installation and removal included. Short-term and long-term contracts available." }
    },
    {
      "@type": "Question",
      "name": "What standard sizes are available?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "Standard sizes: 10x10 ft, 10x14 ft, 10x20 ft, 20x10 ft, 30x10 ft, 40x10 ft, 40x12 ft. Custom sizes available without extra delivery time for orders of 1-5 units." }
    },
    {
      "@type": "Question",
      "name": "Are portable cabins permanent or only temporary?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "Both. Portable cabins are relocatable but many clients use them as permanent structures for years. Saman Portable offers a 25-year structural warranty on all manufactured structures." }
    },
    {
      "@type": "Question",
      "name": "Do I need to arrange a crane or civil team for installation?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "No. Our installation team handles everything on-site. You need only a levelled area or concrete pad. No foundation excavation required for standard units." }
    },
    {
      "@type": "Question",
      "name": "Can portable cabins be customised in size, interior and colour?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "Yes. Size, interior layout, electrical configuration, exterior colour and company branding are all customisable. Custom orders of 1-5 units delivered within the standard 21-day timeline." }
    },
    {
      "@type": "Question",
      "name": "What materials are used in Saman Portable structures?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "ISI-certified MS steel frame (1.2-2.0mm), 50mm PUF insulated sandwich panels with 0.50mm PPGI cladding, 18mm cement particle board flooring. EPS, Rockwool and Glasswool insulation available on request." }
    },
    {
      "@type": "Question",
      "name": "Do you deliver and install outside Bangalore?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "Yes, all of India. Manufacturing in Bengaluru (Karnataka) and Greater Noida (UP). Delivers to Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana, Maharashtra, Gujarat, Rajasthan, Delhi NCR, UP, Haryana, Punjab, West Bengal, Odisha and more." }
    },
    {
      "@type": "Question",
      "name": "What is the structural warranty?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "25-year structural warranty on frame and panels from date of installation handover." }
    },
    {
      "@type": "Question",
      "name": "How do I get a quote?",
      "acceptedAnswer": { "@type": "Answer",
        "text": "Fill in the quote form on the website (24-hour response), call +91 88616 22859 (Bangalore) or +91 8796039938 (Delhi NCR), or WhatsApp us for fastest response (2-hour reply on weekdays). Fixed-price quote with layout drawing within 48 hours." }
    }
  ]
});
