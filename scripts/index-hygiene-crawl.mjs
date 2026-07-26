import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const base = (process.env.CRAWL_BASE || 'http://127.0.0.1:3111').replace(/\/$/, '');
const label = process.argv[2] || 'crawl';
const root = process.cwd();
const origin = 'https://www.samanportable.com';
const normalizePath = value => {
  try {
    const url = new URL(value, origin);
    if (!['www.samanportable.com', 'samanportable.com', '127.0.0.1', 'localhost'].includes(url.hostname)) return null;
    let pathname = decodeURI(url.pathname).replace(/\/+/g, '/');
    if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '');
    return pathname;
  } catch { return null; }
};
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const decode = value => value
  .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const visible = html => decode(html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
  .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ').trim());
const jsonLd = html => [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => {
    try { return JSON.stringify(JSON.parse(match[1])); } catch { return match[1].replace(/\s+/g, ' ').trim(); }
  }).sort().join('\n');
const attr = (html, regex) => {
  const match = regex.exec(html);
  return match ? decode(match[1].trim()) : '';
};

function sitemapPaths() {
  const files = fs.readdirSync(path.join(root, 'public'))
    .filter(file => /^sitemap.*\.xml$/.test(file));
  const paths = new Set();
  for (const file of files) {
    const xml = fs.readFileSync(path.join(root, 'public', file), 'utf8');
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const pathname = normalizePath(decode(match[1]));
      if (pathname && !pathname.endsWith('.xml')) paths.add(pathname);
    }
  }
  return [...paths].sort();
}

const sitemap = sitemapPaths();
const queue = [...new Set(['/', ...sitemap])];
const queued = new Set(queue);
const pages = {};
const edges = [];
for (let cursor = 0; cursor < queue.length && cursor < 1400; cursor++) {
  const pathname = queue[cursor];
  let response;
  try {
    response = await fetch(`${base}${pathname}`, { redirect: 'manual', headers: { 'user-agent': 'SAMAN-Index-Hygiene-Audit/1.0' } });
  } catch (error) {
    pages[pathname] = { status: 0, error: error.message };
    continue;
  }
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('text/html') ? await response.text() : '';
  const canonical = attr(body, /<link\b[^>]*rel=["'][^"']*\bcanonical\b[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i) ||
    attr(body, /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["'][^"']*\bcanonical\b[^"']*["'][^>]*>/i);
  const robots = attr(body, /<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const title = attr(body, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const outgoing = [];
  for (const match of body.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi)) {
    const target = normalizePath(decode(match[1]));
    if (!target) continue;
    outgoing.push(target);
    edges.push({ source: pathname, target });
    if (!queued.has(target) && !/\.(?:pdf|webp|png|jpe?g|gif|svg|xml|txt|json|zip)$/i.test(target)) {
      queued.add(target);
      queue.push(target);
    }
  }
  const text = visible(body);
  pages[pathname] = {
    status: response.status,
    location: response.headers.get('location') || '',
    contentType,
    title,
    canonical,
    robots,
    noindex: /\bnoindex\b/i.test(robots),
    soft404: response.status === 200 && (/\b(?:page not found|404 error|nothing found)\b/i.test(`${title} ${text.slice(0, 800)}`)),
    visibleTextHash: hash(text),
    jsonLdHash: hash(jsonLd(body)),
    outgoing: [...new Set(outgoing)].sort(),
  };
}
const issueStatuses = new Set([301, 302, 303, 307, 308, 401, 404, 410]);
const linkIssues = edges.filter(edge => issueStatuses.has(pages[edge.target]?.status));
const priority = linkIssues.filter(edge => !/^\/(?:blog\?page=|_next|api\/)/.test(edge.source));
const sitemapIssues = sitemap.flatMap(pathname => {
  const page = pages[pathname];
  const problems = [];
  if (!page || page.status !== 200) problems.push(`status-${page?.status ?? 'missing'}`);
  if (page?.noindex) problems.push('noindex');
  const canonicalPath = page?.canonical ? normalizePath(page.canonical) : null;
  if (page?.status === 200 && canonicalPath !== pathname) problems.push(`canonical-${canonicalPath || 'missing'}`);
  return problems.length ? [{ pathname, problems }] : [];
});
const statusCounts = {};
for (const page of Object.values(pages)) statusCounts[page.status] = (statusCounts[page.status] || 0) + 1;
const result = {
  label,
  base,
  generatedAt: new Date().toISOString(),
  summary: {
    crawled: Object.keys(pages).length,
    statusCounts,
    noindex: Object.values(pages).filter(page => page.noindex).length,
    soft404: Object.values(pages).filter(page => page.soft404).length,
    sitemapUrls: sitemap.length,
    sitemapIssues: sitemapIssues.length,
    internalLinkIssues: linkIssues.length,
    priorityInternalLinkIssues: priority.length,
    html200MissingCanonical: Object.values(pages).filter(page => page.status === 200 && page.contentType?.includes('text/html') && !page.canonical).length,
  },
  sitemap,
  sitemapIssues,
  linkIssues,
  priorityLinkIssues: priority,
  pages,
};
const outDir = path.join(root, 'audit', 'index-hygiene');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `${label}-crawl.json`), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result.summary, null, 2));
