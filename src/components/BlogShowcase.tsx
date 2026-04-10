import React, { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
            '(min-width: 1024px)': { slidesToScroll: 3 }
        }
    });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (posts.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Insights</h2>
                        <p className="text-xl text-gray-600">News and updates from the world of modular construction</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <Button onClick={scrollPrev} variant="outline" size="icon" className="rounded-full w-10 h-10 border-gray-300 hover:border-[#0A3D2A] hover:text-[#0A3D2A]" aria-label="Previous slide">
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Button onClick={scrollNext} variant="outline" size="icon" className="rounded-full w-10 h-10 border-gray-300 hover:border-[#0A3D2A] hover:text-[#0A3D2A]" aria-label="Next slide">
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                        <Link href="/blog" className="hidden md:flex items-center text-[#0A3D2A] font-semibold hover:text-[#145C41] ml-4">
                            View all posts <span className="ml-2">→</span>
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-6 pb-4">
                        {posts.map((post) => (
                            <div key={post.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-6 min-w-0">
                                <article className="group cursor-pointer h-full flex flex-col">
                                    <div className="relative h-64 mb-6 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <Image
                                            src={post.featured_image || '/placeholder-blog.jpg'}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <span className="text-sm font-medium bg-[#0A3D2A] px-3 py-1 rounded-full mb-2 inline-block">
                                                Blog
                                            </span>
                                            <div className="text-sm opacity-90">{post.date}</div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0A3D2A] transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <div
                                        className="text-gray-600 line-clamp-2 mb-4 flex-grow"
                                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                                    />
                                    <Link href={`/${post.slug}`} className="inline-flex items-center text-[#0A3D2A] font-medium hover:underline mt-auto">
                                        Read more <span className="ml-1">→</span>
                                    </Link>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/blog" className="inline-flex items-center text-[#0A3D2A] font-semibold hover:text-[#145C41]">
                        View all posts <span className="ml-2">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogShowcase;
