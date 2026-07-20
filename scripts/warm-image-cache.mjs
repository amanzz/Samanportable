#!/usr/bin/env node
/**
 * IMG-WARM-1 - post-deploy image cache warmer (SOP v1.2 step 13)
 *
 * Every deploy wipes DigitalOcean's optimized-image cache, so the first real
 * visitor pays the full /_next/image optimization cost. This script crawls the
 * sitemap, harvests every image URL (including each srcset width), and GETs
 * them all, warming the origin's optimized cache and the Cloudflare edge before
 * any human arrives.
 *
 * IMG-WARM-1 addendum: warm LCP/above-fold hero images first. For each page,
 * the priority pass collects <link rel="preload" as="image"> candidates and
 * the first in-body <img> candidate, warms those URLs across all pages first,
 * then warms the remaining full-crawl image set.
 *
 * Read-only: issues GET requests against the public site and nothing else.
 *
 *   node scripts/warm-image-cache.mjs
 *   SITE_URL=https://staging.example.com node scripts/warm-image-cache.mjs
 *
 * Env:
 *   SITE_URL                  target origin (default https://www.samanportable.com)
 *   WARM_CONCURRENCY          full-pass parallel requests (default 8)
 *   WARM_PRIORITY_CONCURRENCY hero/preload requests (default max(24, WARM_CONCURRENCY))
 *   WARM_PAGE_LIMIT           cap pages crawled, 0 = all (default 0)
 */

const SITE_URL = (process.env.SITE_URL || 'https://www.samanportable.com').replace(/\/+$/, '');
const CONCURRENCY = Number(process.env.WARM_CONCURRENCY || 8);
const PRIORITY_CONCURRENCY = Number(process.env.WARM_PRIORITY_CONCURRENCY || Math.max(24, CONCURRENCY));
const PAGE_LIMIT = Number(process.env.WARM_PAGE_LIMIT || 0);
const RETRIES = 2;
const REQUEST_TIMEOUT_MS = 30_000;
const UA = 'saman-image-cache-warmer/1.0 (+https://www.samanportable.com)';

const log = (...a) => console.log(...a);

/** GET with timeout. Returns {ok, status, bytes, ms, error}. Never throws. */
async function get(url, { readBody = true } = {}) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'GET', // full GET: HEAD does not trigger Next image optimization
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': UA,
        accept: 'image/avif,image/webp,image/apng,text/html,*/*',
      },
    });
    let bytes = 0;
    let text = '';
    if (readBody) {
      const buf = Buffer.from(await res.arrayBuffer());
      bytes = buf.length;
      text = buf.toString('utf8');
    } else {
      // Drain the body so the origin actually produces and caches the image.
      for await (const chunk of res.body ?? []) bytes += chunk.length;
    }
    return {
      ok: res.ok,
      status: res.status,
      bytes,
      text,
      cf: res.headers.get('cf-cache-status') || '',
      ms: Date.now() - started,
    };
  } catch (err) {
    return { ok: false, status: 0, bytes: 0, text: '', cf: '', ms: Date.now() - started, error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

async function getWithRetry(url, opts) {
  let last;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    last = await get(url, opts);
    // Retry only transport errors and 5xx. A 404 is a real answer, not a blip.
    if (last.ok || (last.status >= 400 && last.status < 500)) return last;
    if (attempt < RETRIES) await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
  }
  return last;
}

/** Run tasks with a fixed worker pool, reporting progress as they land. */
async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const run = async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

function makeImageCollector(pageUrl) {
  const found = new Set();
  const add = (raw) => {
    if (!raw) return;
    const value = decodeEntities(raw.trim());
    if (!value || value.startsWith('data:') || value.startsWith('blob:')) return;
    try {
      const abs = new URL(value, pageUrl);
      if (abs.protocol !== 'http:' && abs.protocol !== 'https:') return;
      found.add(abs.href);
    } catch {
      /* unparseable src - skip */
    }
  };
  return { found, add };
}

/** Pull <loc> values out of a sitemap; follows sitemap-index children. */
async function collectSitemapUrls(sitemapUrl, seen = new Set()) {
  if (seen.has(sitemapUrl)) return [];
  seen.add(sitemapUrl);

  const res = await getWithRetry(sitemapUrl);
  if (!res.ok) {
    throw new Error(`sitemap unreachable: ${sitemapUrl} -> ${res.status || res.error}`);
  }

  const locs = [...res.text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => decodeEntities(m[1]));

  // A <sitemapindex> lists child sitemaps rather than pages; recurse into them.
  if (/<sitemapindex/i.test(res.text)) {
    const nested = [];
    for (const child of locs) nested.push(...(await collectSitemapUrls(child, seen)));
    return nested;
  }
  return locs;
}

function addSrcsetCandidates(rawSrcset, add) {
  if (!rawSrcset) return;
  for (const candidate of rawSrcset.split(',')) add(candidate.trim().split(/\s+/)[0]);
}

function addPreloadImageUrls(html, add) {
  for (const m of html.matchAll(/<link\b[^>]*?\bas\s*=\s*["']image["'][^>]*?>/gi)) {
    const href = /\bhref\s*=\s*["']([^"']+)["']/i.exec(m[0]);
    if (href) add(href[1]);
    // Next.js emits responsive preloads as imagesrcset.
    const set = /\bimagesrcset\s*=\s*["']([^"']+)["']/i.exec(m[0]);
    if (set) addSrcsetCandidates(set[1], add);
  }
}

/** Priority image URLs for one page: preload-as-image candidates plus the first in-body <img>. */
function extractPriorityImageUrls(html, pageUrl) {
  const { found, add } = makeImageCollector(pageUrl);

  addPreloadImageUrls(html, add);

  // Static HTML cannot compute layout, so first <img> is the crawl-time proxy
  // for the above-fold/LCP candidate when no explicit preload is emitted.
  const firstImg = /<img\b[^>]*?>/i.exec(html);
  if (firstImg) {
    const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(firstImg[0]);
    const srcset = /\bsrcset\s*=\s*["']([^"']+)["']/i.exec(firstImg[0]);
    if (src) add(src[1]);
    if (srcset) addSrcsetCandidates(srcset[1], add);
  }

  return found;
}

/** Every image URL referenced by a page: <img src>, srcset, and <source srcset>. */
function extractImageUrls(html, pageUrl) {
  const { found, add } = makeImageCollector(pageUrl);

  // src="..." on <img>, and preloaded hero images (<link rel=preload as=image href>).
  for (const m of html.matchAll(/<img\b[^>]*?\ssrc\s*=\s*["']([^"']+)["']/gi)) add(m[1]);
  addPreloadImageUrls(html, add);
  // srcset on <img> and <source>: warm EVERY width, that's the whole point.
  for (const m of html.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) addSrcsetCandidates(m[1], add);

  return found;
}

async function warmImages(label, targets, concurrency, startedAt) {
  let ok = 0;
  let failed = 0;
  let warmed = 0;
  let bytes = 0;
  const failures = [];
  const timings = [];

  await pool(targets, concurrency, async (url) => {
    const res = await getWithRetry(url, { readBody: false });
    timings.push({ url, ms: res.ms, status: res.status });
    if (res.ok) {
      ok++;
      bytes += res.bytes;
    } else {
      failed++;
      failures.push({ url, status: res.status || res.error });
    }
    if (++warmed % 100 === 0 || warmed === targets.length) {
      log(`  ${label} warmed ${warmed}/${targets.length} - ${ok} ok - ${failed} failed`);
    }
  });

  const tPlus = ((Date.now() - startedAt) / 1000).toFixed(1);
  log(`  ${label} done at T+${tPlus}s - ${ok} ok - ${failed} failed`);
  return { ok, failed, warmed, bytes, failures, timings };
}

async function main() {
  const startedAt = Date.now();
  log(`\n> IMG-WARM-1 - warming image cache for ${SITE_URL}`);
  log(`  concurrency=${CONCURRENCY}  priorityConcurrency=${PRIORITY_CONCURRENCY}  retries=${RETRIES}\n`);

  // 1. Page list from the sitemap. This is the only hard failure.
  let pages;
  try {
    pages = await collectSitemapUrls(`${SITE_URL}/sitemap.xml`);
  } catch (err) {
    console.error(`x FATAL - ${err.message}`);
    process.exit(1);
  }
  pages = [...new Set(pages)];
  if (PAGE_LIMIT > 0 && pages.length > PAGE_LIMIT) {
    log(`  ! WARM_PAGE_LIMIT=${PAGE_LIMIT} - crawling ${PAGE_LIMIT} of ${pages.length} pages (rest skipped)`);
    pages = pages.slice(0, PAGE_LIMIT);
  }
  log(`  sitemap: ${pages.length} pages`);

  // 2. Crawl pages, harvest priority and full image URLs.
  const imageUrls = new Set();
  const priorityImageUrls = new Set();
  let pagesOk = 0;
  let pagesFailed = 0;
  let crawled = 0;
  await pool(pages, CONCURRENCY, async (pageUrl) => {
    const res = await getWithRetry(pageUrl);
    if (res.ok) {
      pagesOk++;
      for (const u of extractPriorityImageUrls(res.text, pageUrl)) priorityImageUrls.add(u);
      for (const u of extractImageUrls(res.text, pageUrl)) imageUrls.add(u);
    } else {
      pagesFailed++;
    }
    if (++crawled % 50 === 0 || crawled === pages.length) {
      log(`  crawled ${crawled}/${pages.length} pages - ${priorityImageUrls.size} priority - ${imageUrls.size} image URLs so far`);
    }
  });

  const priorityTargets = [...priorityImageUrls];
  const fullTargets = [...imageUrls].filter((url) => !priorityImageUrls.has(url));
  log(`\n  unique image URLs: ${imageUrls.size}`);
  log(`  priority hero/preload URLs: ${priorityTargets.length}`);
  log(`  remaining full-pass URLs: ${fullTargets.length}\n`);
  if (priorityTargets.length === 0 && fullTargets.length === 0) {
    log('  nothing to warm.');
    return;
  }

  // 3. Priority pass: LCP/above-fold hero candidates first, with higher concurrency.
  const priority = priorityTargets.length
    ? await warmImages('heroes', priorityTargets, PRIORITY_CONCURRENCY, startedAt)
    : { ok: 0, failed: 0, warmed: 0, bytes: 0, failures: [], timings: [] };

  // 4. Full pass: all remaining image URLs with the normal production-safe pool.
  const full = fullTargets.length
    ? await warmImages('full', fullTargets, CONCURRENCY, startedAt)
    : { ok: 0, failed: 0, warmed: 0, bytes: 0, failures: [], timings: [] };

  // 5. Summary.
  const totalSec = ((Date.now() - startedAt) / 1000).toFixed(1);
  const ok = priority.ok + full.ok;
  const failed = priority.failed + full.failed;
  const bytes = priority.bytes + full.bytes;
  const failures = [...priority.failures, ...full.failures];
  const timings = [...priority.timings, ...full.timings];

  log(`\n${'-'.repeat(64)}`);
  log('  IMG-WARM-1 SUMMARY');
  log(`${'-'.repeat(64)}`);
  log(`  pages crawled        ${pagesOk} ok, ${pagesFailed} failed (${pages.length} in sitemap)`);
  log(`  unique image URLs    ${imageUrls.size}`);
  log(`  priority warmed      ${priority.warmed}`);
  log(`  full warmed          ${full.warmed}`);
  log(`  warmed OK (2xx)      ${ok}`);
  log(`  failed               ${failed}`);
  log(`  transferred          ${(bytes / 1024 / 1024).toFixed(1)} MB`);
  log(`  total time           ${totalSec}s`);

  const slowest = timings.sort((a, b) => b.ms - a.ms).slice(0, 10);
  if (slowest.length) {
    log(`\n  slowest 10 URLs:`);
    for (const t of slowest) log(`    ${String(t.ms).padStart(6)}ms  [${t.status}]  ${t.url}`);
  }
  if (failures.length) {
    log(`\n  failures (first 20):`);
    for (const f of failures.slice(0, 20)) log(`    [${f.status}]  ${f.url}`);
  }
  log('');
  // Individual image 404s are not a deploy failure. Only an unreachable sitemap
  // (handled above) exits non-zero.
}

main().catch((err) => {
  console.error(`x FATAL - ${err.stack || err.message}`);
  process.exit(1);
});
