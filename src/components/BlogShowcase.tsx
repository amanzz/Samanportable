import React, { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LightweightBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featured_image: string;
}

interface BlogShowcaseProps {
  posts: LightweightBlogPost[];
}

const BlogShowcase: React.FC<BlogShowcaseProps> = ({ posts }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-[#F8FAF9] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A3D2A]/10 text-[#0A3D2A] font-semibold text-sm mb-4">
              <BookOpen className="w-4 h-4" />
              Buyer&apos;s Resource
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Guides, Prices &amp; Industry Insights
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Practical guides on portable cabin types, prices and specs — written by our technical team for buyers who want to know exactly what they&apos;re getting.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              onClick={scrollPrev}
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-gray-200 hover:border-[#0A3D2A] hover:text-[#0A3D2A] transition-colors"
              aria-label="Previous post"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={scrollNext}
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-gray-200 hover:border-[#0A3D2A] hover:text-[#0A3D2A] transition-colors"
              aria-label="Next post"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A3D2A] hover:text-[#145C41] transition-colors ml-2"
            >
              All posts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-5">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-5 min-w-0"
              >
                <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={post.featured_image || '/placeholder-blog.jpg'}
                      alt={`${post.title} — Saman Portable Blog`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-xs font-semibold text-white bg-[#0A3D2A] px-2.5 py-1 rounded-full">
                        {post.date}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#0A3D2A] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <div
                      className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                    <Link
                      href={`/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A3D2A] hover:text-[#145C41] transition-colors mt-auto"
                    >
                      Read guide <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile "View all" */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A3D2A] hover:text-[#145C41] transition-colors"
          >
            View all posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogShowcase;
