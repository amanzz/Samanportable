import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Head from 'next/head';

// Import Layout component
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { dsCssVariables } from '@/components/ds/tokens';
import { generateOrganizationSchema, getWebSiteSchema, getHomepageFAQSchema, getHomepageLocalBusinessGraphSchema } from '@/lib/schema';
import { pageSEO, siteConfig } from '@/config/seo';

// Dynamic imports for below-the-fold sections to improve LCP
const CalculatorStrip = dynamic(() => import('@/components/CalculatorStrip'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-48 bg-[var(--ds-surface-inverse)] animate-pulse" />
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

// T6.18 — category grid replaces the SpecsTable slot (SpecsTable.tsx stays on disk,
// no longer mounted). Kept SSR so the tile <a> links are crawlable in the HTML.
const CategoryGrid = dynamic(() => import('@/components/CategoryGrid'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-96 bg-white animate-pulse" />
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
  loading: () => <div className="w-full h-48 bg-[var(--ds-surface-inverse)] animate-pulse" />,
});

const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), {
  ssr: false, // Defer scroll-to-top button
  loading: () => null,
});

// T6: the homepage no longer renders the product grid or blog feed (they live on
// /product and /blog), so no product/blog data is fetched here. ISR retained.
// T6.18: read the real per-category product counts from the WooCommerce export at
// BUILD TIME (never hardcoded) so the category grid chips stay in sync with the data.
export const getStaticProps: GetStaticProps = async () => {
  const fs = await import('fs');
  const path = await import('path');
  const dir = path.join(process.cwd(), 'src/data/wp-export/categories');
  const categoryCounts: Record<string, number> = {};
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    try {
      const cat = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      if (cat && typeof cat.slug === 'string' && typeof cat.count === 'number') {
        categoryCounts[cat.slug] = cat.count;
      }
    } catch {
      // skip unreadable/malformed category files
    }
  }
  return {
    props: { categoryCounts },
    revalidate: 3600,
  };
};

const HomePage = ({ categoryCounts }: { categoryCounts: Record<string, number> }) => {
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

      <main data-ds-root="">
        {/* T6.21: the homepage renders under Layout (not PageShell), so the DS
            token custom properties are otherwise never emitted here and every
            var(--ds-*) used by the token-remediated homepage sections resolved
            to nothing (dark sections went transparent → white-on-white). Inject
            the same [data-ds-root] variable block PageShell uses, scoped to the
            homepage main only. Generated from tokens.ts — the single source of
            truth for hex — so components stay hex-free. */}
        <style dangerouslySetInnerHTML={{ __html: `[data-ds-root]{${dsCssVariables()}}` }} />

        {/* 1. Hero Section - Critical for LCP */}
        <HeroSection />
        <div className="homepage-below-fold">

        {/* 1b. Certifications & Recognition (T6.16) — directly after hero */}
        <HomepageCertifications />

        {/* 2. Calculator Strip (T6 §2) — full-width price-transparency band under hero */}
        <CalculatorStrip />

        {/* 2b. Most In Demand — popular sizes showcase (T6.1), between calculator and cards */}
        <PopularSizes />

        {/* 3. Six category cards (T2.2) */}
        <ServicesSection />

        {/* 4. Product category grid (T6.18) — replaces the old specs section */}
        <CategoryGrid counts={categoryCounts} />

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
        </div>
      </main>
    </Layout>
  );
};

export default HomePage;
