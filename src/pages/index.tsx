import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Head from 'next/head';

// Import Layout component
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { generateOrganizationSchema, getWebSiteSchema, getHomepageFAQSchema, getHomepageLocalBusinessGraphSchema } from '@/lib/schema';
import { pageSEO, siteConfig } from '@/config/seo';

// Dynamic imports for below-the-fold sections to improve LCP
const CalculatorStrip = dynamic(() => import('@/components/CalculatorStrip'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-48 bg-[#0A3D2A] animate-pulse" />
  ),
});

const PopularSizes = dynamic(() => import('@/components/PopularSizes'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-96 bg-white animate-pulse" />
  ),
});

const ServicesSection = dynamic(() => import('@/components/ServicesSection'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
  ),
});

const SpecsTable = dynamic(() => import('@/components/SpecsTable'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-96 bg-gray-50 animate-pulse" />
  ),
});

const ClientsSection = dynamic(() => import('@/components/ClientsSection'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-64 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
  ),
});

const HomepageCertifications = dynamic(() => import('@/components/HomepageCertifications'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-96 bg-white animate-pulse" />
  ),
});

const ProcessSteps = dynamic(() => import('@/components/ProcessSteps'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-96 bg-white animate-pulse" />
  ),
});

const FAQSection = dynamic(() => import('@/components/FAQSection'), {
  ssr: true,
  loading: () => <div className="w-full h-96 bg-gray-50 animate-pulse" />,
});

const CTAStrip = dynamic(() => import('@/components/CTAStrip'), {
  ssr: true,
  loading: () => <div className="w-full h-48 bg-[#0A3D2A] animate-pulse" />,
});

const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), {
  ssr: false, // Defer scroll-to-top button
  loading: () => null,
});

// T6: the homepage no longer renders the product grid or blog feed (they live on
// /product and /blog), so no product/blog data is fetched here. ISR retained.
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 3600,
  };
};

const HomePage = () => {
  return (
    <Layout>
      <Head>
        {/* Schema 1: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebSiteSchema()) }}
        />
        {/* Schema 2: FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getHomepageFAQSchema()) }}
        />
        {/* Schema 3: LocalBusiness factory graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getHomepageLocalBusinessGraphSchema()) }}
        />
      </Head>
      <UnifiedSEO
        fallbackTitle="Portable Cabin & Container Office Manufacturer in Bangalore & Delhi NCR"
        fallbackDescription="Saman Portable manufactures portable cabins, container offices, and prefab structures for businesses across India. ISO-certified. Delivering since 2009. Prices from ₹1.45 Lakh. Get a free quote."
        fallbackCanonical="https://www.samanportable.com/"
        fallbackOgTitle="Portable Cabin & Container Office Manufacturer"
        fallbackOgDescription="ISO-certified portable cabin manufacturer in Bangalore and Delhi NCR. Serving all of India since 2009. Prices from ₹1.45 Lakh."
        fallbackOgImage="https://www.samanportable.com/hero-image/saman-portable-office-cabin-bangalore.webp"
        fallbackTwitterDescription="ISO-certified portable cabin manufacturer in Bangalore and Delhi NCR. Serving all of India since 2009. Prices from ₹1.45 Lakh."
        keywords={pageSEO.home.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
        structuredData={[
          generateOrganizationSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            '@id': 'https://www.samanportable.com/#breadcrumb',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
            ],
          },
        ]}
      />

      <main>
        {/* 1. Hero Section - Critical for LCP */}
        <HeroSection />

        {/* 1b. Certifications & Recognition (T6.16) — directly after hero */}
        <HomepageCertifications />

        {/* 2. Calculator Strip (T6 §2) — full-width price-transparency band under hero */}
        <CalculatorStrip />

        {/* 2b. Most In Demand — popular sizes showcase (T6.1), between calculator and cards */}
        <PopularSizes />

        {/* 3. Six category cards (T2.2) */}
        <ServicesSection />

        {/* 4. Specs section */}
        <SpecsTable />

        {/* 5. Clients + testimonials (ClientsSection already merges both) */}
        <ClientsSection />

        {/* 6. Process steps — compressed single-view layout (T6 §6) */}
        <ProcessSteps />

        {/* 7. Top-5 FAQ */}
        <FAQSection />

        {/* 8. CTA block */}
        <CTAStrip />

        {/* Scroll to Top (utility control) */}
        <ScrollToTop />
      </main>
    </Layout>
  );
};

export default HomePage;
