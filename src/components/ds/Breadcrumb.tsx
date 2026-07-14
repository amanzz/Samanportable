import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: string;
  /** Omit href on the current (last) item. */
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Emit BreadcrumbList JSON-LD (needs absolute URLs for correctness). */
  emitJsonLd?: boolean;
  /** Base origin used to absolutise hrefs in JSON-LD, e.g. https://samanportable.com */
  origin?: string;
  className?: string;
}

/**
 * Breadcrumb — visual trail + optional BreadcrumbList JSON-LD injection.
 * Semantic <nav><ol>; the last item is marked aria-current. Server component.
 */
export function Breadcrumb({ items, emitJsonLd, origin = '', className }: BreadcrumbProps) {
  const jsonLd = emitJsonLd
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((it, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: it.label,
          ...(it.href ? { item: `${origin}${it.href}` } : {}),
        })),
      }
    : null;

  return (
    <nav aria-label="Breadcrumb" className={[styles.nav, className].filter(Boolean).join(' ')}>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <ol className={styles.list}>
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <li className={styles.item} key={`${it.label}-${i}`}>
              {it.href && !isLast ? (
                <a className={styles.link} href={it.href}>{it.label}</a>
              ) : (
                <span className={styles.current} aria-current={isLast ? 'page' : undefined}>{it.label}</span>
              )}
              {!isLast && <span className={styles.sep} aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
