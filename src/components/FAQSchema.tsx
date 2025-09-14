import React from 'react';
import Head from 'next/head';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQ[];
  productTitle?: string;
  url?: string;
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs, productTitle, url }) => {
  if (!faqs || faqs.length === 0) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, '') // Remove HTML tags for schema
      }
    }))
  };

  // If product title is provided, also add Product FAQ schema
  const productFAQSchema = productTitle ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productTitle,
    "url": url,
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, '')
      }
    }))
  } : null;

  return (
    <Head>
      {/* FAQ Page Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      
      {/* Product FAQ Schema (if product title provided) */}
      {productFAQSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productFAQSchema)
          }}
        />
      )}
    </Head>
  );
};

export default FAQSchema;