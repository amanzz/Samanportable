import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import Link from 'next/link';
import { Calendar, ArrowRight, Clock, Search } from 'lucide-react';
import { siteConfig } from '@/config/seo';
import BlogImage from '@/components/BlogImage';
import { decodeHtmlEntities } from '@/lib/utils';
import { dsCssVariables } from '@/components/ds/tokens';

import { BlogPost as ApiBlogPost } from '@/config/api';
type BlogPost = ApiBlogPost;

// Same plain-text excerpt treatment the hub grid uses — no dangerouslySetInnerHTML.
function plainExcerpt(html: string, maxLength = 140): string {
  const text = decodeHtmlEntities((html || '').replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?–—-]+$/, '');
  return `${trimmed}…`;
}

type BlogCardPost = BlogPost & { readingTime: number; excerptText: string };

const RESULT_LIMIT = 50;

interface SearchProps {
  query: string;
  posts: BlogCardPost[];
  totalMatches: number;
  totalPosts: number;
  categories: Array<{ id: number; name: string; slug: string; count: number }>;
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async ({ query }) => {
  const rawQuery = Array.isArray(query.q) ? query.q[0] : query.q;
  const q = (rawQuery || '').trim();

  const { searchPostsByTitle, getBlogCategories, getBlogPostCount, computeReadTime } = await import(
    '@/lib/staticContent'
  );

  // `totalMatches` is the REAL number of posts whose title matches; `posts` is the
  // newest RESULT_LIMIT of them. The results line therefore states a true count even
  // when the render is capped.
  const { posts, total } = await searchPostsByTitle(q, RESULT_LIMIT);

  const lightPosts: BlogCardPost[] = posts.map((post: BlogPost) => ({
    ...post,
    readingTime: computeReadTime(post?.content?.rendered || ''),
    excerptText: plainExcerpt(post?.excerpt?.rendered || ''),
    content: { ...(post.content || {}), rendered: '' },
    excerpt: { ...(post.excerpt || {}), rendered: '' },
  }));

  return {
    props: {
      query: q,
      posts: lightPosts,
      totalMatches: total,
      totalPosts: getBlogPostCount(),
      categories: getBlogCategories(),
    },
  };
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const pillClass =
  'inline-flex items-center whitespace-nowrap rounded-full border border-[var(--ds-border)] bg-[var(--ds-surface)] px-3.5 py-1.5 text-sm font-medium text-[var(--ds-color-forest)] transition-colors hover:border-[var(--ds-color-forest)] hover:bg-[var(--ds-color-mist)]';

const BlogSearch = ({ query, posts, totalMatches, totalPosts, categories }: SearchProps) => {
  const hasQuery = query.length > 0;

  // Category pills — identical to the hub row. On /blog/search no pill is "active",
  // so every one (including All articles) renders in the inactive style.
  const pills = (
    <nav aria-label="Blog categories" className="mb-8">
      <ul className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0">
        <li className="shrink-0">
          <Link href="/blog" className={pillClass}>
            All articles ({totalPosts})
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id} className="shrink-0">
            <Link href={`/blog?category=${category.slug}`} className={pillClass}>
              {decodeHtmlEntities(category.name)} ({category.count})
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <Layout>
      {/* Search is a pure UX surface: noindex,follow ALWAYS (with and without q), never
          in the sitemap. Zero crawl noise, zero index bloat. */}
      <UnifiedSEO
        fallbackTitle="Search — SAMAN Portable Blog"
        fallbackDescription="Search SAMAN Portable's library of prefab and portable cabin guides by title."
        canonical={`${siteConfig.url}/blog/search`}
        fallbackCanonical={`${siteConfig.url}/blog/search`}
        fallbackOgImage={siteConfig.ogImage}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
        noindex
      />

      <div data-ds-root="" className="min-h-screen bg-[var(--ds-surface)]">
        <style dangerouslySetInnerHTML={{ __html: `[data-ds-root]{${dsCssVariables()}}` }} />

        <main>
          <section className="border-b border-[var(--ds-border)] bg-[var(--ds-color-mist)]">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex items-center gap-1.5 text-xs text-[var(--ds-text-secondary)]">
                  <li>
                    <Link href="/" className="transition-colors hover:text-[var(--ds-color-forest)]">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-[var(--ds-border-strong)]">
                    ›
                  </li>
                  <li>
                    <Link href="/blog" className="transition-colors hover:text-[var(--ds-color-forest)]">
                      Blog
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-[var(--ds-border-strong)]">
                    ›
                  </li>
                  <li aria-current="page" className="font-medium text-[var(--ds-color-forest)]">
                    Search
                  </li>
                </ol>
              </nav>

              <h1 className="text-3xl font-bold tracking-tight text-[var(--ds-color-forest)] md:text-4xl">
                Search — SAMAN Portable Blog
              </h1>

              {/* Plain GET form — works with JS disabled. */}
              <form action="/blog/search" method="get" role="search" className="mt-6 flex max-w-xl gap-2">
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  aria-label="Search guides"
                  placeholder={`Search ${totalPosts} guides…`}
                  className="h-11 w-full rounded-lg border border-[var(--ds-border)] bg-[var(--ds-surface)] px-4 text-sm text-[var(--ds-text-primary)] outline-none transition-colors placeholder:text-[var(--ds-text-secondary)] focus:border-[var(--ds-color-forest)]"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-[var(--ds-color-forest)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--ds-color-leaf)]"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search
                </button>
              </form>
            </div>
          </section>

          <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* No query → form + pills only. No results section, no error. */}
              {!hasQuery && pills}

              {hasQuery && totalMatches === 0 && (
                <>
                  <p className="mb-8 text-base text-[var(--ds-text-secondary)]">
                    No guides match “{query}”. Try a shorter word, or browse by category below.
                  </p>
                  {pills}
                </>
              )}

              {hasQuery && totalMatches > 0 && (
                <>
                  {/* The count is always the REAL match total. When it exceeds the render cap,
                      the line says so explicitly (owner-authorized copy, 13 Jul 2026) rather
                      than passing 50 off as the total. */}
                  <p className="mb-8 text-base text-[var(--ds-text-secondary)]">
                    {totalMatches > RESULT_LIMIT ? (
                      <>
                        Showing the {RESULT_LIMIT} most recent of {totalMatches} guides matching “{query}”
                      </>
                    ) : (
                      <>
                        {totalMatches} guides match “{query}”
                      </>
                    )}
                  </p>
                  {pills}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {posts.map((post, index) => (
                      <article
                        key={post.id}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-surface)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--ds-color-forest)] hover:shadow-md"
                      >
                        <div className="relative aspect-video overflow-hidden bg-[var(--ds-color-mist)]">
                          <BlogImage post={post} index={index} className="h-full w-full" />
                        </div>

                        <div className="flex flex-grow flex-col p-5">
                          <div className="mb-3 flex items-center gap-4 text-xs text-[var(--ds-text-secondary)]">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDate(post.date)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {post.readingTime} min read
                            </span>
                          </div>

                          <h2 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-[var(--ds-text-primary)]">
                            <Link
                              href={`/${post.slug}`}
                              className="transition-colors hover:text-[var(--ds-color-forest)]"
                            >
                              {decodeHtmlEntities(post.title.rendered)}
                            </Link>
                          </h2>

                          <p className="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-[var(--ds-text-secondary)]">
                            {post.excerptText}
                          </p>

                          <Link
                            href={`/${post.slug}`}
                            className="mt-auto inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--ds-color-leaf)] transition-colors hover:text-[var(--ds-color-forest)]"
                          >
                            Read article
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default BlogSearch;
