import type { ReactNode } from 'react';
import type { DsImage } from './types';
import styles from './BlogPostLayout.module.css';

export interface BlogAuthor {
  name: string;
  role?: string;
  avatar?: DsImage;
}

export interface BlogPostLayoutProps {
  title: string;
  subtitle?: string;
  author: BlogAuthor;
  /** e.g. "12 Jun 2026" — caller-supplied. */
  publishedLabel?: string;
  /** e.g. "6 min read". */
  readingTime?: string;
  /** Breadcrumb slot (typically a <Breadcrumb />). */
  breadcrumb?: ReactNode;
  /** Table-of-contents slot, rendered sticky beside the body on desktop. */
  toc?: ReactNode;
  /** Article body (rich content). */
  children: ReactNode;
  /** Related-products slot below the body. */
  relatedProducts?: ReactNode;
  /** CTA slot at the foot of the article. */
  cta?: ReactNode;
  className?: string;
}

/**
 * BlogPostLayout — composition scaffold for blog posts: breadcrumb, title
 * block, author box, optional sticky TOC, body, related-products, and CTA
 * slots. Purely structural — supplies zero copy. Server component.
 */
export function BlogPostLayout({
  title,
  subtitle,
  author,
  publishedLabel,
  readingTime,
  breadcrumb,
  toc,
  children,
  relatedProducts,
  cta,
  className,
}: BlogPostLayoutProps) {
  return (
    <article className={[styles.post, className].filter(Boolean).join(' ')}>
      {breadcrumb && <div className={styles.breadcrumb}>{breadcrumb}</div>}

      <header className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <div className={styles.author}>
          {author.avatar && (
            <span className={styles.avatar}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={author.avatar.src} alt={author.avatar.alt} width={author.avatar.width} height={author.avatar.height} className={styles.avatarImg} />
            </span>
          )}
          <span className={styles.authorMeta}>
            <span className={styles.authorName}>{author.name}</span>
            <span className={styles.authorSub}>
              {[author.role, publishedLabel, readingTime].filter(Boolean).join(' · ')}
            </span>
          </span>
        </div>
      </header>

      <div className={toc ? styles.gridWithToc : styles.grid}>
        {toc && <aside className={styles.toc}>{toc}</aside>}
        <div className={styles.body}>{children}</div>
      </div>

      {relatedProducts && <section className={styles.related}>{relatedProducts}</section>}
      {cta && <section className={styles.cta}>{cta}</section>}
    </article>
  );
}

export default BlogPostLayout;
