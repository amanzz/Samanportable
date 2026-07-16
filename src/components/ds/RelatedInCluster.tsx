/**
 * SHIKHAR C2 — "More {cluster} pages" sibling-mesh module.
 *
 * Server-rendered lateral interlinking between same-cluster city/local pages. Pure
 * presentational: the caller (getServerSideProps → clusterSiblings) has already resolved
 * the cluster boundary, excluded redirects/editorial, ordered and capped the list at 6,
 * and supplied verbatim titles. This component never touches slugs or cluster logic.
 *
 * No "use client": the anchors are real SSR `<a href>` (next/link emits them server-side),
 * crawlable and clickable with JavaScript disabled. Every slot has a reserved height, so
 * the module adds 0.000 CLS.
 */
import Link from 'next/link';
import styles from './RelatedInCluster.module.css';

export interface ClusterSiblingLink {
  title: string;
  url: string;
}

export interface RelatedInClusterProps {
  /** Verbatim heading, e.g. "More Porta Cabin pages". */
  heading: string;
  /** Ordered siblings (already capped at 6 by the caller). */
  items: ClusterSiblingLink[];
}

export function RelatedInCluster({ heading, items }: RelatedInClusterProps) {
  // Suppression is the caller's job; this guard only prevents an empty container.
  if (!items || items.length === 0) return null;

  return (
    <nav data-ds-root="" className={styles.wrap} aria-label={heading}>
      <p className={styles.heading}>{heading}</p>
      <ul className={styles.grid}>
        {items.map((it) => (
          <li className={styles.cell} key={it.url}>
            <Link href={it.url} className={styles.link}>
              <span className={styles.label}>{it.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default RelatedInCluster;
