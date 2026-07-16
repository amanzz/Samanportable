/**
 * SHIKHAR C2 — sibling mesh helper (server-only).
 *
 * Builds the "More {cluster} pages" candidate set for a live city/local post: up to 6
 * same-cluster siblings, deterministically ordered, boundary-safe.
 *
 * BOUNDARY LAW: cluster membership is decided ONLY by resolvePostCluster (the single
 * C1/C2 resolver). There is deliberately NO substring / prefix / `.includes('cabin')`
 * matching in this file — a grep for fuzzy cluster logic must come back empty.
 *
 * Reads the export files (fetchBlogPost / getAllPostSlugs) and next.config, so it is
 * imported ONLY from getServerSideProps — never into a client bundle.
 */
import { resolvePostCluster, getPostRegionToken } from './breadcrumbs';
import { getAllPostSlugs, fetchBlogPost } from './staticContent';
import { decodeHtmlEntities } from './utils';

export interface ClusterSiblingItem {
  /** The sibling page's real title, rendered verbatim as the anchor text. */
  title: string;
  /** Site-relative URL, e.g. '/porta-cabin-in-hyderabad'. */
  url: string;
}

export interface ClusterSiblingResult {
  /** Verbatim heading: "More {DISPLAY} pages". */
  heading: string;
  items: ClusterSiblingItem[];
}

/** Render the module only when at least this many siblings exist; hard cap on links. */
const MIN_SIBLINGS = 4;
const MAX_SIBLINGS = 6;

/**
 * SHIKHAR C2 (G6 fix) — redirect-exclusion set, DERIVED from the SAME redirect definition
 * next.config.js consumes, never hand-listed. `next.config.redirects()` assembles every
 * rule the site actually serves: the generated CSV (redirects-from-csv.js), the
 * product-canonical dedupes, AND the inline city-page rules. The for-sale / locality
 * redirects that would otherwise leak into the mesh live ONLY in those inline rules —
 * they are NOT in redirects-from-csv.js — so redirects() (not the CSV alone) is the true
 * single source: editing ANY redirect, CSV or inline, updates the mesh exclusion with no
 * code edit here.
 *
 * Computed once and memoised (redirects() is async). If the source yields nothing it
 * could not be read → throw so it surfaces to Fable 5, never silently link a redirect and
 * never fall back to a manual list.
 */
let redirectExclusionPromise: Promise<ReadonlySet<string>> | null = null;

/** Normalise a redirect `source` to a bare slug: strip slashes + decodeURIComponent. */
function normalizeRedirectSource(source: string): string {
  return decodeURIComponent(String(source || '').trim().replace(/^\/+/, '').replace(/\/+$/, ''));
}

function getRedirectExclusionSet(): Promise<ReadonlySet<string>> {
  if (!redirectExclusionPromise) {
    redirectExclusionPromise = (async () => {
      const mod: any = await import('../../next.config.js');
      const cfg: any = mod?.default ?? mod;
      const rules: Array<{ source?: unknown }> =
        typeof cfg?.redirects === 'function' ? await cfg.redirects() : [];
      const set = new Set<string>();
      for (const rule of rules) {
        if (rule && typeof rule.source === 'string') {
          set.add(normalizeRedirectSource(rule.source));
        }
      }
      if (set.size === 0) {
        throw new Error(
          'C2 mesh: redirect source (next.config.redirects) produced 0 entries — STOP, report to Fable 5.',
        );
      }
      return set;
    })();
  }
  return redirectExclusionPromise;
}

/**
 * Cluster hub slug → mesh heading display name. VERBATIM from the C2 ticket. A cluster
 * that reaches the mesh (≥4 siblings) but is absent here is a spec gap — we throw so it
 * surfaces to Fable 5 rather than inventing a name (ticket rule).
 */
const CLUSTER_DISPLAY: Readonly<Record<string, string>> = Object.freeze({
  'porta-cabins': 'Porta Cabin',
  'portable-cabin': 'Portable Cabin',
  'portable-office': 'Portable Office',
  'portable-toilet': 'Portable Toilet',
  'container-cafe': 'Container Cafe',
  'container-offices': 'Container Office',
  'labor-colony': 'Labour Colony',
  'peb-constructions': 'Pre-Engineered Building',
  'pre-engineered-buildings': 'Pre-Engineered Building',
  'prefab-buildings': 'Prefab Building',
  'prefabricated-houses': 'Prefab House',
  'security-cabins': 'Security Cabin',
});

/** The owning cluster hub slug for a slug, or null when editorial/unresolved. */
function clusterOf(slug: string): string | null {
  const r = resolvePostCluster(slug);
  return r.kind === 'local' && r.hub ? r.hub.slug : null;
}

/**
 * Ordered same-cluster siblings for the current page (≤6), or null when the module must
 * not render (editorial page, or fewer than 4 live siblings).
 */
export async function getClusterSiblings(currentSlug: string): Promise<ClusterSiblingResult | null> {
  const cluster = clusterOf(currentSlug);
  if (!cluster) return null;

  // Candidate pool = every LIVE (not redirected), non-editorial, same-cluster page,
  // including the current page (needed to locate its ring position). Live-ness is
  // getAllPostSlugs() (existing export files, no 404s) minus the derived redirect set.
  const redirected = await getRedirectExclusionSet();
  const pool = getAllPostSlugs().filter(
    (s) => !redirected.has(s) && clusterOf(s) === cluster,
  );
  const siblingCount = pool.length - 1; // exclude self
  if (siblingCount < MIN_SIBLINGS) return null;

  const display = CLUSTER_DISPLAY[cluster];
  if (!display) {
    // A cluster reached the mesh with no ticket display name — never invent one.
    throw new Error(`C2 mesh: no clusterDisplayName for cluster "${cluster}" — STOP, report to Fable 5.`);
  }

  // Ordering. (1) region-first: same captured-locality token as the current page.
  const region = getPostRegionToken(currentSlug);
  const sorted = [...pool].sort(); // stable ascending ring, includes self
  const regionFirst = region
    ? sorted.filter((s) => s !== currentSlug && getPostRegionToken(s) === region)
    : [];

  // (2) rotating window: start immediately AFTER the current page's own ring position,
  // walk forward wrapping around, skipping self.
  const selfIdx = sorted.indexOf(currentSlug);
  const ring: string[] = [];
  for (let i = 1; i <= sorted.length; i++) {
    const s = sorted[(selfIdx + i) % sorted.length];
    if (s !== currentSlug) ring.push(s);
  }

  // Merge (1) then (2), de-duplicate, keep order.
  const ordered: string[] = [];
  const seen = new Set<string>();
  for (const s of [...regionFirst, ...ring]) {
    if (!seen.has(s)) {
      seen.add(s);
      ordered.push(s);
    }
  }

  // Resolve real titles for the anchors, in order, until 6 are collected. A sibling with
  // no resolvable title is skipped (never a bare-keyword or templated anchor).
  const items: ClusterSiblingItem[] = [];
  for (const slug of ordered) {
    if (items.length >= MAX_SIBLINGS) break;
    const post = await fetchBlogPost(slug);
    const raw = post?.title?.rendered;
    if (!raw) continue;
    items.push({ title: decodeHtmlEntities(raw), url: `/${slug}` });
  }

  if (items.length < MIN_SIBLINGS) return null;
  return { heading: `More ${display} pages`, items };
}
