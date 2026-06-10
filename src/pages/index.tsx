import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Head from 'next/head';

// Import Layout component
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { generateOrganizationSchema, getWebSiteSchema, getHomepageFAQSchema } from '@/lib/schema';
import { pageSEO, siteConfig } from '@/config/seo';

// Dynamic imports for below-the-fold sections to improve LCP
const TrustBar = dynamic(() => import('@/components/TrustBar'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-24 bg-[#F5F7FA] animate-pulse" />
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

const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
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

const ModularSolutionsSEO = dynamic(() => import('@/components/ModularSolutionsSEO'), {
  ssr: true,
  loading: () => <div className="w-full h-64 bg-gray-50 animate-pulse" />,
});

const FAQSection = dynamic(() => import('@/components/FAQSection'), {
  ssr: true,
  loading: () => <div className="w-full h-96 bg-gray-50 animate-pulse" />,
});

const CTAStrip = dynamic(() => import('@/components/CTAStrip'), {
  ssr: true,
  loading: () => <div className="w-full h-48 bg-[#0A3D2A] animate-pulse" />,
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

    const lightweightBlogPosts: LightweightBlogPost[] = (blogPostsResponse.posts || [])
      // Filter out doorway posts (slugs containing 'for-sale-in-')
      .filter((post: any) => !post.slug?.includes('for-sale-in-'))
      // Limit to 3 posts on homepage
      .slice(0, 3)
      .map((post: any) => ({
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

const HomePage = ({ featuredProducts, recentBlogPosts }: HomePageProps) => {
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
        structuredData={generateOrganizationSchema()}
      />

      <main>
        {/* 1. Hero Section - Critical for LCP */}
        <HeroSection />

        {/* 2. Trust Bar ★ NEW */}
        <TrustBar />

        {/* 3. Products Section (6 cards) */}
        <ServicesSection />

        {/* 4. Specs Table ★ NEW */}
        <SpecsTable />

        {/* 5. Clients Section ★ NEW (replaces TestimonialsSection) */}
        <ClientsSection />

        {/* 6. Why Choose Us (includes Process Steps) */}
        <WhyChooseUs />

        {/* 7. Stats Bar */}
        <StatsSection />

        {/* 8. Our Work in Action */}
        <section className="py-16 md:py-32 bg-[#F8FAF9] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A3D2A]/5 text-[#0A3D2A] font-bold text-xs uppercase tracking-widest mb-6 border border-[#0A3D2A]/10"
              >
                Project Showcase
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
              >
                Real Projects, <span className="text-[#0A3D2A]">Proven Quality</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
              >
                A curated selection of our high-performance modular installations across India&apos;s industrial landscapes.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {[
                { src: "/Prefab solutions/work/portable-cabin-labour-colony-setup.webp", alt: "Portable cabin labour colony setup for construction site in India", label: "Infrastructure", title: "Mega Labour Colony" },
                { src: "/Prefab solutions/work/saman-portable-modular-office-cabin.webp", alt: "Saman Portable modular office cabin with custom finish", label: "Corporate", title: "Premium Modular Office" },
                { src: "/Prefab solutions/work/saman-prefab-container-office-unit.webp", alt: "Saman prefab container office unit installed at industrial site", label: "Industrial", title: "Smart Site HQ" },
                { src: "/Prefab solutions/work/portable-cabin-site-office-bangalore.webp", alt: "Portable cabin site office installed in Bangalore by Saman Portable", label: "Civil", title: "Bangalore Metro Unit" },
                { src: "/Prefab solutions/work/container-office-exterior-india.webp", alt: "Modern container office exterior for industrial use in India", label: "Retail", title: "Custom Container Hub" },
                { src: "/Prefab solutions/work/prefab-cabin-installation-worksite.webp", alt: "Prefab cabin installation at construction worksite by Saman Portable", label: "Process", title: "Rapid Deployment" },
              ].map((image, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-white shadow-2xl shadow-gray-200/50 border border-gray-100"
                >
                  <div className="relative h-80 w-full overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-6 left-6">
                      <span className="text-[10px] font-black text-white bg-[#0A3D2A] px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl">
                        {image.label}
                      </span>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <h3 className="text-xl font-bold text-white mb-1">{image.title}</h3>
                      <p className="text-white/60 text-sm font-light">Precision manufactured in 7–21 days</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-20"
            >
              <Link
                href="/gallery"
                className="inline-flex items-center gap-3 bg-[#0A3D2A] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-[#0A3D2A]/20 transition-all hover:scale-105 active:scale-95 group"
              >
                Explore Full Portfolio
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 9. Product Showcase (WordPress products) */}
        {featuredProducts.length > 0 && <ProductShowcase featuredProducts={featuredProducts} />}

        {/* 10. Industries / Modular Solutions SEO */}
        <ModularSolutionsSEO />

        {/* 11. Blog Feed */}
        {recentBlogPosts.length > 0 && <BlogShowcase posts={recentBlogPosts} />}

        {/* 12. FAQ Section ★ NEW */}
        <FAQSection />

        {/* 13. CTA Strip ★ NEW */}
        <CTAStrip />

        {/* 14. Scroll to Top */}
        <ScrollToTop />
      </main>
    </Layout>
  );
};

export default HomePage;
