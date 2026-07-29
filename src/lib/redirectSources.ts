// Server-side only. Mirrors next-sitemap.config.js getRedirectSources(): the set of
// literal redirect SOURCE paths (CSV baseline + next.config.js manual redirects), so a
// feed surface can structurally exclude any URL the live site 301-redirects — exactly as
// the sitemap does. Added by C01 (Fable 5 ruling, 24 Jul 2026) so no Merchant feed item
// can ever land on a redirecting URL again, regardless of which product configs exist.
//
// Loaded at request time on the Node server. The root config files are pulled through a
// runtime require resolved from process.cwd() (never bundled by webpack), and everything
// is wrapped in try/catch + memoised, so a config change can never crash feed generation —
// the CSV baseline still applies even if next.config.js fails to load.
import path from 'path';

// True Node require, resolved at runtime and hidden from webpack's static analysis so the
// root config (and its 572-entry CSV) is never pulled into any client/page bundle.
// eslint-disable-next-line no-eval
const nodeRequire: NodeRequire = eval('require');

/** Normalize a path for comparison: ensure a leading slash, drop trailing slash. */
export function normalizeRedirectPath(p: unknown): string {
  if (typeof p !== 'string') return '';
  let s = p.trim();
  if (!s) return '';
  if (!s.startsWith('/')) s = '/' + s;
  if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
  return s;
}

/** WooCommerce category-placeholder products: /product/{a}/{a} where a === a. */
export function isDuplicateProductSegment(pathname: string): boolean {
  const m = /^\/product\/([^/]+)\/([^/]+)$/.exec(pathname);
  return !!m && m[1] === m[2];
}

/** Collect literal redirect SOURCE paths only (never destinations or patterns). */
function collectRedirectSources(list: unknown, set: Set<string>): void {
  if (!Array.isArray(list)) return;
  for (const entry of list) {
    if (!entry || typeof entry.source !== 'string') continue;
    // Skip conditional (host/cookie/header) and wildcard/param redirects — they are not
    // concrete URLs and must never be treated as feed landing paths.
    if (entry.has || entry.missing) continue;
    if (entry.source.includes(':') || entry.source.includes('*')) continue;
    // A slash-only redirect canonicalizes an alternate spelling of the same page.
    // The feed emits the non-slash winner, so never exclude that winner after the
    // normalizer drops the slash from the redirect source.
    if (entry.source.length > 1 && entry.source.endsWith('/')) continue;
    const norm = normalizeRedirectPath(entry.source);
    if (norm) set.add(norm);
  }
}

// Build the redirect-source set once (promise-memoised so concurrent feed requests share
// a single build).
let redirectSourcePromise: Promise<Set<string>> | null = null;

/** The set of literal redirect SOURCE paths (CSV baseline + next.config manual redirects). */
export function getRedirectSourceSet(): Promise<Set<string>> {
  if (redirectSourcePromise) return redirectSourcePromise;
  redirectSourcePromise = (async () => {
    const set = new Set<string>();
    // Baseline: the bulk CSV redirects (always available via sync require).
    try {
      const csvRedirects = nodeRequire(path.join(process.cwd(), 'redirects-from-csv.js'));
      collectRedirectSources(csvRedirects, set);
    } catch (err) {
      console.warn('[merchant-feed] Skipped CSV redirects:', err instanceof Error ? err.message : err);
    }
    // Additive: manual redirects from next.config.js (this also re-includes the CSV, which
    // the Set de-duplicates). Wrapped so a future config change can never crash the feed.
    try {
      const nextConfig = nodeRequire(path.join(process.cwd(), 'next.config.js'));
      if (nextConfig && typeof nextConfig.redirects === 'function') {
        collectRedirectSources(await nextConfig.redirects(), set);
      }
    } catch (err) {
      console.warn('[merchant-feed] Skipped next.config redirects:', err instanceof Error ? err.message : err);
    }
    return set;
  })();
  return redirectSourcePromise;
}

/** True when a feed link's path must be excluded because the site redirects it. */
export function isRedirectingPath(pathname: string, redirectSources: Set<string>): boolean {
  const norm = normalizeRedirectPath(pathname);
  if (!norm) return false;
  return redirectSources.has(norm) || isDuplicateProductSegment(norm);
}
