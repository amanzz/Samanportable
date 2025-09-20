import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import SEO from '@/components/SEO';

// Import Layout component
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { generateOrganizationSchema } from '@/lib/schema';
import { pageSEO, siteConfig } from '@/config/seo';

// Dynamic imports for below-the-fold sections to improve LCP
const ServicesSection = dynamic(() => import('@/components/ServicesSection'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
  ),
});

const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
  ),
});

const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  ssr: false, // Defer testimonials to avoid blocking LCP
  loading: () => (
    <div className="w-full h-64 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
  ),
});

const StatsSection = dynamic(() => import('@/components/StatsSection'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-32 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
  ),
});

const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), {
  ssr: false, // Defer scroll-to-top button
  loading: () => null,
});

// Lightweight product interface for homepage
interface LightweightProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price: string;
  on_sale: boolean;
  featured_image: string;
  category: string;
}

interface LightweightBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featured_image: string;
}

interface HomePageProps {
  featuredProducts: LightweightProduct[];
  recentBlogPosts: LightweightBlogPost[];
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    // Import API functions dynamically to reduce initial bundle
    const { fetchBlogPosts, testWooCommerceConnection, testWordPressAccessibility } = await import('@/config/api');
    
    // Test WordPress site accessibility first
    const wordpressAccessible = await testWordPressAccessibility();
    
    // Test WooCommerce API connection first
    const apiConnected = await testWooCommerceConnection();

    // Fetch recent blog posts server-side with caching
    const blogPostsResponse = await fetchBlogPosts(1, 2);

    const lightweightBlogPosts: LightweightBlogPost[] = (blogPostsResponse.posts || []).map(post => ({
      id: post.id,
      title: post.title?.rendered || '',
      slug: post.slug,
      excerpt: post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
      date: post.date,
      featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    }));

    return {
      props: {
        featuredProducts: [],
        recentBlogPosts: lightweightBlogPosts,
      },
    };
  } catch (error) {
    console.error('Error fetching data for home page:', error);
    return {
      props: {
        featuredProducts: [],
        recentBlogPosts: [],
      },
    };
  }
};

const HomePage = ({ recentBlogPosts }: HomePageProps) => {
  return (
    <Layout>
      <SEO
        title={pageSEO.home.title}
        description={pageSEO.home.description}
        canonical={pageSEO.home.canonical}
        keywords={pageSEO.home.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
        openGraph={{
          title: pageSEO.home.title,
          description: pageSEO.home.description,
          image: '/og-image.svg',
          url: pageSEO.home.canonical,
        }}
      >
        {/* Structured Data - Preloaded for better performance */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema())
          }}
        />
      </SEO>
      
      <main>
        {/* Hero Section - Critical for LCP */}
        <HeroSection />
        
        {/* Below-the-fold sections - Dynamically loaded */}
        <ServicesSection />
        <WhyChooseUs />
        <StatsSection />
        <TestimonialsSection />
        <ScrollToTop />
      </main>
    </Layout>
  );
};

export default HomePage;

