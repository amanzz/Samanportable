import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Head from 'next/head';

// Import Layout component
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { generateOrganizationSchema, getLocalBusinessSchema, getWebSiteSchema } from '@/lib/schema';
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

const ProductShowcase = dynamic(() => import('@/components/ProductShowcase'), {
  ssr: true,
  loading: () => <div className="w-full h-96 bg-gray-50 animate-pulse" />,
});

const BlogShowcase = dynamic(() => import('@/components/BlogShowcase'), {
  ssr: true,
  loading: () => <div className="w-full h-96 bg-gray-50 animate-pulse" />,
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
  category_slug: string;
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

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    // Import API functions dynamically to reduce initial bundle
    const { fetchBlogPosts, fetchProductsByCategoryPriority, testWordPressAccessibility, testWordPressAccessibility: testConnect } = await import('@/config/api');

    // Test connection (silently fail if not working to avoid crashing page)
    try {
      await testConnect();
    } catch (e) {
      // ignore
    }

    // Fetch featured products (15 items for slider) from specific categories
    // "Portable Cabin", "Container Offices", "Porta Cabins", "Labor Colony", "Portable Office", "Container Cafe"
    const productsResponse = await fetchProductsByCategoryPriority(1, 15);
    const lightweightProducts: LightweightProduct[] = (productsResponse.products || []).map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.sale_price,
      on_sale: product.on_sale,
      featured_image: product.images[0]?.src || '',
      category: product.category_name || (product.categories && product.categories[0]?.name) || 'Uncategorized',
      category_slug: product.category_slug || (product.categories && product.categories[0]?.slug) || 'uncategorized',
    }));

    // Fetch recent blog posts server-side (12 items for slider)
    const blogPostsResponse = await fetchBlogPosts(1, 12);

    const lightweightBlogPosts: LightweightBlogPost[] = (blogPostsResponse.posts || []).map(post => ({
      id: post.id,
      title: post.title?.rendered || '',
      slug: post.slug,
      excerpt: post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
      date: new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder-blog.jpg',
    }));

    return {
      props: {
        featuredProducts: lightweightProducts,
        recentBlogPosts: lightweightBlogPosts,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching data for home page:', error);
    return {
      props: {
        featuredProducts: [],
        recentBlogPosts: [],
      },
      revalidate: 3600,
    };
  }
};

const ModularSolutionsSEO = dynamic(() => import('@/components/ModularSolutionsSEO'), {
  ssr: true,
  loading: () => <div className="w-full h-64 bg-gray-50 animate-pulse" />,
});

const HomePage = ({ featuredProducts, recentBlogPosts }: HomePageProps) => {
  return (
    <Layout>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebSiteSchema()) }}
        />
      </Head>
      <UnifiedSEO
        fallbackTitle="Portable Cabin & Container Offices in India | Saman Portable"
        fallbackDescription="Buy premium portable cabins, container offices, and prefab buildings from Saman Portable. 21-day delivery, ISO-certified quality, and 25-year warranty assured."
        fallbackCanonical={pageSEO.home.canonical}
        fallbackOgImage="/og-image.svg"
        fallbackOgDescription="Discover premium portable cabins, container offices, and prefab structures in Bangalore."
        fallbackTwitterDescription="Portable cabins and container offices—fast delivery and custom designs."
        keywords={pageSEO.home.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
        structuredData={generateOrganizationSchema()}
      />

      <main>
        {/* Hero Section - Critical for LCP */}
        <HeroSection />

        {/* Below-the-fold sections - Dynamically loaded */}
        <ServicesSection />
        <WhyChooseUs />
        <StatsSection />

        {/* Our Work in Action Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Our Work in Action</h2>
              <p className="text-base md:text-xl text-gray-600">See some of our successful prefab projects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { src: "/Prefab solutions/work/portable-cabin-labour-colony-setup.webp", alt: "Portable cabin labour colony setup for construction projects" },
                { src: "/Prefab solutions/work/saman-portable-modular-office-cabin.webp", alt: "Saman Portable modular office cabin with custom finish" },
                { src: "/Prefab solutions/work/saman-prefab-container-office-unit.webp", alt: "Saman prefab container office unit ready for delivery" },
                { src: "/Prefab solutions/work/portable-cabin-site-office-bangalore.webp", alt: "Portable cabin site office setup in Bangalore by Saman Portable" },
                { src: "/Prefab solutions/work/container-office-exterior-india.webp", alt: "Modern container office exterior for industrial use in India" },
                { src: "/Prefab solutions/work/prefab-cabin-installation-worksite.webp", alt: "Prefab cabin installation at construction worksite by Saman Portable" }
              ].map((image, index) => (
                <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg">
                  <div className="relative h-64 w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {featuredProducts.length > 0 && <ProductShowcase featuredProducts={featuredProducts} />}

        <TestimonialsSection />

        {recentBlogPosts.length > 0 && <BlogShowcase posts={recentBlogPosts} />}
        <ModularSolutionsSEO />
        <ScrollToTop />
      </main>
    </Layout >
  );
};

export default HomePage;

