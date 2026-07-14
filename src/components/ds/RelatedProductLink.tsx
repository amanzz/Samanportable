/**
 * SHIKHAR T8.2 — Related-product module.
 *
 * The single contextual link that routes a blog post's topical authority into its
 * owning commercial hub. Rendered ONCE per post, AFTER the article content — never
 * inside the body copy, so the indexed article text and first-100-words are untouched.
 *
 * The anchor is a real SSR `<a href>` (next/link emits the href server-side), so it is
 * crawlable and clickable with JavaScript disabled.
 *
 * Copy is fixed by the T8.2 packet and must not be reworded here.
 */
import Link from 'next/link';
import styles from './RelatedProductLink.module.css';

export interface RelatedProductLinkProps {
  /** The hub's display name, e.g. 'Porta Cabins'. */
  hubName: string;
  /** Site-relative hub path, e.g. '/product/porta-cabins'. */
  hubPath: string;
}

export function RelatedProductLink({ hubName, hubPath }: RelatedProductLinkProps) {
  return (
    <aside data-ds-root="" className={styles.card} aria-label="Related product">
      <span className={styles.eyebrow}>RELATED PRODUCT</span>
      <p className={styles.line}>
        {`Looking for ${hubName}? See SAMAN's full range, specs and pricing.`}
      </p>
      <Link href={hubPath} className={styles.cta}>
        {`Explore ${hubName} →`}
      </Link>
    </aside>
  );
}

export default RelatedProductLink;
