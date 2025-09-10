import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import SEO from '@/components/SEO';

// Import Layout component
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { generateOrganizationSchema } from '@/lib/schema';
import { pageSEO } from '@/config/seo';

// Dynamic imports for below-the-fold sections to improve LCP
const ServicesSection = dynamic(() => import('@/components/ServicesSection'), {
  ssr: false, // Defer to avoid blocking LCP
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
  ),
});

const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'), {
  ssr: false, // Defer to avoid blocking LCP
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
  ssr: false, // Defer to avoid blocking LCP
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
  recentBlogPosts: LightweightBlogPost[];
}

// Use static generation for better LCP performance
export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    // Import API functions dynamically to reduce initial bundle
    const { fetchBlogPosts } = await import('@/config/api');

    // Fetch recent blog posts with static generation
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
        recentBlogPosts: lightweightBlogPosts,
      },
      // Revalidate every 5 minutes for fresh content
      revalidate: 300,
    };
  } catch (error) {
    console.error('Error fetching data for home page:', error);
    return {
      props: {
        recentBlogPosts: [],
      },
      revalidate: 60, // Retry in 1 minute on error
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

