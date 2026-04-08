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
        url: 'https://www.samanportable.com/logo.png',
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
    name: 'Saman Portable Office Solutions',
    url: 'https://www.samanportable.com',
    logo: 'https://www.samanportable.com/logo.png',
    description: 'Premium portable cabins, container offices, and prefab solutions in Bangalore',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://twitter.com/samanportable',
      'https://facebook.com/samanportable',
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
  "name": "SAMAN Portable Office Solutions",
  "url": "https://www.samanportable.com",
  "logo": "https://www.samanportable.com/saman-logo.svg",
  "telephone": [
    "+91 88616 22859",
    "+91 80886 85440",
    "+91 8796039938",
    "+91 9708989937"
  ],
  "email": [
    "sales@samanportable.com",
    "ncr@samanportable.com"
  ],
  "address": [
    {
      "@type": "PostalAddress",
      "streetAddress": "I, Sy No 34/2, near India Oil petrol pump, Gopasandra, Bengaluru, Karnataka 560099",
      "addressCountry": "IN"
    },
    {
      "@type": "PostalAddress",
      "streetAddress": "Khata No 226, Vill-Jalpura, Bisrakh Rd, Jalpura, Dadri, Greater Noida, Uttar Pradesh 201308",
      "addressCountry": "IN"
    }
  ]
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
