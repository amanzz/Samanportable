import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, Tag, ArrowRight, Clock } from 'lucide-react';
import { fetchBlogPosts } from '@/config/api';
import { pageSEO, siteConfig } from '@/config/seo';
import BlogImage from '@/components/BlogImage';
import { decodeHtmlEntities } from '@/lib/utils';

import { BlogPost as ApiBlogPost } from '@/config/api';
type BlogPost = ApiBlogPost;

// Reading time computed server-side (matches the previous in-component getReadingTime logic:
// 200 wpm). Computing it here lets us strip the full `content.rendered` from the returned props
// so large post bodies are no longer serialized into __NEXT_DATA__ (Large HTML fix).
function computeReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = (content || '').replace(/<[^>]*>/g, '').split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Listing only needs card data + a precomputed reading-time number (not the full body).
type BlogCardPost = BlogPost & { readingTime: number };

interface BlogProps {
  posts: BlogCardPost[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
  categories: Array<{ id: number; name: string; slug: string; count: number }>;
  tags: Array<{ id: number; name: string; slug: string; count: number }>;
}

export const getServerSideProps: GetServerSideProps<BlogProps> = async ({ query }) => {
  try {
    const page = parseInt(query.page as string) || 1;
    const category = query.category as string;
    const tag = query.tag as string;
    const search = query.search as string;
    
    console.log('Blog getServerSideProps: Starting to fetch blog posts...');
    
    // Fetch blog posts with pagination - reduced to 10 posts per page for better performance
    const result = await fetchBlogPosts(page, 10);
    
    console.log('Blog getServerSideProps: Result:', {
      postsCount: result.posts?.length || 0,
      pagination: result.pagination
    });
    
    // In a real implementation, you would fetch categories and tags from WordPress
    const categories = [
      { id: 1, name: 'Portable Construction', slug: 'portable-construction', count: 15 },
      { id: 2, name: 'Industry News', slug: 'industry-news', count: 8 },
      { id: 3, name: 'Case Studies', slug: 'case-studies', count: 12 },
      { id: 4, name: 'Tips & Guides', slug: 'tips-guides', count: 20 },
      { id: 5, name: 'Company Updates', slug: 'company-updates', count: 6 }
    ];
    
    const tags = [
      { id: 1, name: 'Porta Cabins', slug: 'porta-cabins', count: 25 },
      { id: 2, name: 'Container Offices', slug: 'container-offices', count: 18 },
      { id: 3, name: 'Prefab Solutions', slug: 'prefab-solutions', count: 22 },
      { id: 4, name: 'Bangalore', slug: 'bangalore', count: 30 },
      { id: 5, name: 'Construction', slug: 'construction', count: 35 }
    ];

    // Compute reading time from the full content, then strip `content.rendered` so the large
    // post bodies are NOT serialized into __NEXT_DATA__. All other card fields (title, excerpt,
    // date, slug, _embedded featured media / term / author) are preserved unchanged.
    const lightPosts: BlogCardPost[] = (result.posts || []).map((post: BlogPost) => ({
      ...post,
      readingTime: computeReadingTime(post?.content?.rendered || ''),
      content: { ...(post.content || {}), rendered: '' },
    }));

    const props = {
      posts: lightPosts,
      totalPages: result.pagination.totalPages,
      currentPage: result.pagination.currentPage,
      totalPosts: result.pagination.totalPosts || 0,
      categories,
      tags,
    };

    console.log('Blog getServerSideProps: Returning props with', props.posts.length, 'posts');

    return { props };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        posts: [],
        totalPages: 1,
        currentPage: 1,
        totalPosts: 0,
        categories: [],
        tags: [],
      },
    };
  }
};

const Blog = ({ posts, totalPages, currentPage, totalPosts, categories, tags }: BlogProps) => {
  // Debug logging
  console.log('Blog component rendered with:', { posts, totalPages, currentPage, totalPosts, categories, tags });
  
  // Debug embedded data structure
  if (posts && posts.length > 0) {
    console.log('First post _embedded data:', posts[0]._embedded);
    console.log('First post featured_media:', posts[0].featured_media);
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateExcerpt = (excerpt: string, maxLength: number = 150) => {
    const stripped = decodeHtmlEntities(excerpt.replace(/<[^>]*>/g, ''));
    if (stripped.length <= maxLength) return stripped;
    return stripped.substring(0, maxLength) + '...';
  };

  const blogHubStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": "https://www.samanportable.com/blog#collectionpage",
      "url": "https://www.samanportable.com/blog",
      "name": "Saman Portable Blog | Modular Construction Insights",
      "description": "Stay updated with the latest news, tips, and insights about portable construction at Saman Portable.",
      "isPartOf": { "@id": "https://www.samanportable.com/#website" },
      "about": { "@id": "https://www.samanportable.com/#organization" },
      "mainEntity": { "@id": "https://www.samanportable.com/blog#itemlist" }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://www.samanportable.com/blog#itemlist",
      "name": "Saman Portable Blog Posts",
      "numberOfItems": posts.length,
      "itemListOrder": "https://schema.org/ItemListUnordered",
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": decodeHtmlEntities(post.title?.rendered || ''),
        "url": `https://www.samanportable.com/${post.slug}`
      }))
    }
  ];

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={pageSEO.blog.title}
        fallbackDescription={pageSEO.blog.description}
        fallbackCanonical={pageSEO.blog.canonical}
        fallbackOgImage="/blog-hero.jpg"
        keywords={pageSEO.blog.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
        structuredData={blogHubStructuredData}
      />

      <div className="min-h-screen">
        <main>
          {/* Hero Section */}
          <section className="hero-gradient min-h-[50vh] flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div className="max-w-7xl mx-auto container-padding relative z-20 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 hero-text-shadow">
                Our Blog
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Stay updated with the latest news, tips, and insights about portable construction
              </p>
              
              {/* Loading Indicator */}
              {(!posts || posts.length === 0) && (
                <div className="mt-8">
                  <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white text-sm font-medium">Loading blog posts...</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Search and Filters */}
          <section className="section-padding bg-background border-b">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search articles..."
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Tag className="w-4 h-4 mr-2" />
                    All Categories
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="section-padding bg-background">
            <div className="max-w-7xl mx-auto container-padding">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-lg p-6 shadow-card sticky top-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/blog?category=${category.slug}`}
                          className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <span>{category.name}</span>
                          <span className="bg-muted px-2 py-1 rounded-full text-xs">
                            {category.count}
                          </span>
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-border mt-6 pt-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Popular Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 10).map((tag) => (
                          <Link
                            key={tag.id}
                            href={`/blog?tag=${tag.slug}`}
                            className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                          >
                            {tag.name}
                          </Link>
                        ))}
                      </div>
                    </div>


                  </div>
                </div>

                {/* Blog Posts */}
                <div className="lg:col-span-3">
                  {/* Enhanced Results Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-green-900 mb-1">
                          📚 Blog Articles
                        </h2>
                        <p className="text-green-700 text-sm">
                          {posts && posts.length > 0 ? (
                            <>
                              Showing <span className="font-semibold">{posts.length}</span> of <span className="font-semibold">{totalPosts}</span> articles 
                              • Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                            </>
                          ) : (
                            'No articles available at the moment'
                          )}
                        </p>
                        {totalPosts > 100 && (
                          <p className="text-green-600 text-xs mt-1">
                            💡 Use the pagination below or &quot;Go to Page&quot; to navigate through all {totalPosts} articles
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{totalPosts}</div>
                        <div className="text-xs text-green-500">Total Articles</div>
                      </div>
                    </div>
                  </div>

                  {/* Blog Posts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {posts && posts.length > 0 ? (
                      posts.map((post) => (
                        <article key={post.id} className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 group">
                          {/* Featured Image */}
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            <BlogImage 
                              post={post} 
                              index={posts.indexOf(post)} 
                              className="w-full h-full"
                            />
                            
                            {/* Category Badge */}
                            {post._embedded?.['wp:term']?.[0]?.[0] && (
                              <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                {post._embedded['wp:term'][0][0].name}
                              </div>
                            )}
                          </div>
                          
                          {/* Post Content */}
                          <div className="p-4">
                            {/* Meta Information */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(post.date)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {post.readingTime} min read
                              </div>
                            </div>
                            
                            {/* Title */}
                            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              <Link href={`/${post.slug}`} className="hover:text-primary transition-colors">
                                {decodeHtmlEntities(post.title.rendered)}
                              </Link>
                            </h3>
                            
                            {/* Excerpt */}
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                              {truncateExcerpt(post.excerpt.rendered)}
                            </p>
                            
                            {/* Author */}
                            {post._embedded?.author?.[0] && (
                              <div className="flex items-center mb-4">
                                <div className="w-6 h-6 bg-muted rounded-full mr-2 flex items-center justify-center">
                                  <User className="w-3 h-3 text-muted-foreground" />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {post._embedded.author[0].name}
                                </span>
                              </div>
                            )}
                            
                            {/* Read More */}
                            <Link href={`/${post.slug}`}>
                              <Button variant="outline" size="sm" className="w-full group">
                                Read More
                                <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📝</span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          No blog posts available
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          We&apos;re working on creating great content for you. Please check back soon!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Load More Option */}
                  {currentPage < totalPages && (
                    <div className="text-center mt-8 mb-6">
                      <Link href={`/blog?page=${currentPage + 1}`}>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="px-8 py-3 text-lg font-medium hover:bg-[#0A3D2A]/10 hover:border-[#0A3D2A]/30 transition-all duration-300"
                        >
                          📖 Load More Articles
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-2">
                        Next {Math.min(20, totalPosts - (currentPage * 20))} articles available
                      </p>
                    </div>
                  )}

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center mt-12">
                      <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        <Link href={`/blog?page=${currentPage - 1}`}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={currentPage === 1}
                            className="flex items-center gap-2"
                          >
                            ← Previous
                          </Button>
                        </Link>
                        
                        {/* Page Numbers - Smart pagination for large numbers */}
                        {(() => {
                          const pages = [];
                          const maxVisiblePages = 7;
                          
                          if (totalPages <= maxVisiblePages) {
                            // Show all pages if total is small
                            for (let i = 1; i <= totalPages; i++) {
                              pages.push(
                                <Link key={i} href={`/blog?page=${i}`}>
                                  <Button
                                    variant={currentPage === i ? "default" : "outline"}
                                    size="sm"
                                    className="w-10 h-10 p-0"
                                  >
                                    {i}
                                  </Button>
                                </Link>
                              );
                            }
                          } else {
                            // Smart pagination for large numbers
                            if (currentPage <= 4) {
                              // Show first 5 pages + ... + last page
                              for (let i = 1; i <= 5; i++) {
                                pages.push(
                                  <Link key={i} href={`/blog?page=${i}`}>
                                    <Button
                                      variant={currentPage === i ? "default" : "outline"}
                                      size="sm"
                                      className="w-10 h-10 p-0"
                                    >
                                      {i}
                                    </Button>
                                  </Link>
                                );
                              }
                              pages.push(<span key="dots1" className="px-2 text-muted-foreground">...</span>);
                              pages.push(
                                <Link key={totalPages} href={`/blog?page=${totalPages}`}>
                                  <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                                    {totalPages}
                                  </Button>
                                </Link>
                              );
                            } else if (currentPage >= totalPages - 3) {
                              // Show first page + ... + last 5 pages
                              pages.push(
                                <Link key={1} href={`/blog?page=1`}>
                                  <Button variant="outline" size="sm" className="w-10 h-10 p-0">1</Button>
                                </Link>
                              );
                              pages.push(<span key="dots2" className="px-2 text-muted-foreground">...</span>);
                              for (let i = totalPages - 4; i <= totalPages; i++) {
                                pages.push(
                                  <Link key={i} href={`/blog?page=${i}`}>
                                    <Button
                                      variant={currentPage === i ? "default" : "outline"}
                                      size="sm"
                                      className="w-10 h-10 p-0"
                                    >
                                      {i}
                                    </Button>
                                  </Link>
                                );
                              }
                            } else {
                              // Show first + ... + current-1, current, current+1 + ... + last
                              pages.push(
                                <Link key={1} href={`/blog?page=1`}>
                                  <Button variant="outline" size="sm" className="w-10 h-10 p-0">1</Button>
                                </Link>
                              );
                              pages.push(<span key="dots3" className="px-2 text-muted-foreground">...</span>);
                              for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                                pages.push(
                                  <Link key={i} href={`/blog?page=${i}`}>
                                    <Button
                                      variant={currentPage === i ? "default" : "outline"}
                                      size="sm"
                                      className="w-10 h-10 p-0"
                                    >
                                      {i}
                                    </Button>
                                  </Link>
                                );
                              }
                              pages.push(<span key="dots4" className="px-2 text-muted-foreground">...</span>);
                              pages.push(
                                <Link key={totalPages} href={`/blog?page=${totalPages}`}>
                                  <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                                    {totalPages}
                                  </Button>
                                </Link>
                              );
                            }
                          }
                          
                          return pages;
                        })()}
                        
                        {/* Next Button */}
                        <Link href={`/blog?page=${currentPage + 1}`}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2"
                          >
                            Next →
                          </Button>
                        </Link>
                      </div>
                      
                      {/* Page Info */}
                      <div className="ml-6 text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages} • {totalPosts} total articles
                      </div>
                      
                      {/* Quick Jump to Page */}
                      <div className="ml-6 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Go to:</span>
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const page = formData.get('page') as string;
                            if (page && parseInt(page) >= 1 && parseInt(page) <= totalPages) {
                              window.location.href = `/blog?page=${page}`;
                            }
                          }}
                          className="flex items-center gap-2"
                        >
                          <Input
                            name="page"
                            type="number"
                            min="1"
                            max={totalPages}
                            placeholder="Page #"
                            className="w-20 h-8 text-center"
                            defaultValue={currentPage}
                          />
                          <Button type="submit" size="sm" variant="outline" className="h-8 px-3">
                            Go
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* No Posts Message */}
                  {posts.length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No articles found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search criteria or browse our categories.
                      </p>
                      <Button asChild>
                        <Link href="/blog">
                          View All Articles
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>


        </main>
      </div>
    </Layout>
  );
};

export default Blog;

