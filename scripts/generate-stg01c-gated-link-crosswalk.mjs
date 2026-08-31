import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseUrl = (
  process.argv.find((value) => value.startsWith('--base-url='))?.slice('--base-url='.length)
  || 'http://127.0.0.1:3210'
).replace(/\/$/, '');
const publicOrigin = 'https://www.samanportable.com';
const expectedOccurrences = 138;
const expectedTargets = 42;

const architecture = JSON.parse(fs.readFileSync(path.join(root, 'src/data/seo/commercialArchitecture.json'), 'utf8'));
const gating = JSON.parse(fs.readFileSync(path.join(root, 'src/data/seo/unapprovedCommercialGating.json'), 'utf8'));
const approved = new Set(architecture.approvedProductionPaths);
const gated = new Set(gating.paths);

function decodeEntities(value) {
  return String(value || '')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function stripHtml(value) {
  return decodeEntities(String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function meta(html, name) {
  const first = new RegExp(`<meta\\b[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i').exec(html);
  const second = new RegExp(`<meta\\b[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`, 'i').exec(html);
  return decodeEntities(first?.[1] || second?.[1] || '');
}

function title(html) {
  return stripHtml(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] || '');
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }
  const headers = rows.shift();
  return rows.filter((values) => values.some(Boolean)).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function normalizePath(href) {
  try {
    const url = new URL(decodeEntities(href), publicOrigin);
    if (url.origin !== publicOrigin) return null;
    return url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : '/';
  } catch {
    return null;
  }
}

function anchorOccurrences(html) {
  const cleaned = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '');
  const tokenPattern = /<\/?([a-z0-9:-]+)\b([^>]*)>/gi;
  const stack = [];
  const anchors = [];
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  let match;
  while ((match = tokenPattern.exec(cleaned))) {
    const full = match[0];
    const tag = match[1].toLowerCase();
    const attrs = match[2] || '';
    const closing = full.startsWith('</');
    if (closing) {
      const index = stack.map((item) => item.tag).lastIndexOf(tag);
      if (index >= 0) stack.splice(index);
      continue;
    }
    if (tag === 'a') {
      const href = /\bhref=["']([^"']+)["']/i.exec(attrs)?.[1];
      const pathname = href ? normalizePath(href) : null;
      if (pathname && gated.has(pathname)) {
        const closeIndex = cleaned.toLowerCase().indexOf('</a>', tokenPattern.lastIndex);
        const body = closeIndex >= 0 ? cleaned.slice(tokenPattern.lastIndex, closeIndex) : '';
        anchors.push({ pathname, anchorText: stripHtml(body), attrs, ancestors: [...stack] });
      }
    }
    if (!voidTags.has(tag) && !full.endsWith('/>')) stack.push({ tag, attrs });
  }
  return anchors;
}

function classifyLink(anchor) {
  const context = `${anchor.attrs} ${anchor.ancestors.map(({ tag, attrs }) => `${tag} ${attrs}`).join(' ')}`.toLowerCase();
  const ancestorTags = new Set(anchor.ancestors.map(({ tag }) => tag));
  if (ancestorTags.has('footer') || /\bfooter\b/.test(context)) {
    return { component: 'Rendered <footer>; shared Footer template', linkType: 'footer', generation: 'template-generated' };
  }
  if (ancestorTags.has('nav') || /\b(header|navigation|navbar|nav-menu|menu-item)\b/.test(context)) {
    return { component: 'Rendered navigation/header; shared Header template', linkType: 'navigation', generation: 'template-generated' };
  }
  if (/\b(related|recommend|you-may|ymal|product-rail|rail-item|similar-products)\b/.test(context)) {
    return { component: 'Rendered related-product rail; shared commercial template', linkType: 'rail', generation: 'template-generated' };
  }
  if (/\b(card|product-grid|category-grid|product-tile|grid-cols|group\/card)\b/.test(context)) {
    return { component: 'Rendered product card/grid; shared listing or commercial template', linkType: 'card', generation: 'template-generated' };
  }
  if (ancestorTags.has('article') || /\b(prose|entry-content|long-description|description|content-body)\b/.test(context)) {
    return { component: 'Rendered main/article content location', linkType: 'contextual', generation: 'contextual' };
  }
  return { component: 'Rendered main content; shared commercial template', linkType: 'shared-template', generation: 'template-generated' };
}

function familyOf(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'product-category') return parts[1] || 'product-category';
  if (parts[0] === 'product') return parts[1] || 'product';
  return parts[0] || 'homepage';
}

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function markdownTable(map, heading, limit = Infinity) {
  const rows = [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit);
  return [`### ${heading}`, '', '| Value | Occurrences |', '|---|---:|', ...rows.map(([key, count]) => `| ${String(key).replaceAll('|', '\\|')} | ${count} |`), ''].join('\n');
}

function sitemapPaths() {
  const files = ['sitemap-products.xml', 'sitemap-locations.xml', 'sitemap-projects.xml', 'sitemap-editorial.xml'];
  return [...new Set(files.flatMap((filename) => {
    const xml = fs.readFileSync(path.join(root, 'public', filename), 'utf8');
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((entry) => new URL(decodeEntities(entry[1])).pathname.replace(/\/$/, '') || '/');
  }))];
}

async function mapConcurrent(values, concurrency, callback) {
  const output = new Array(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      output[index] = await callback(values[index], index);
    }
  }));
  return output;
}

async function request(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, { redirect: 'manual', headers: { 'user-agent': 'SAMAN-STG01C-Crosswalk/1.0' } });
  const html = (response.headers.get('content-type') || '').includes('text/html') ? await response.text() : '';
  if (!html && response.body) await response.body.cancel();
  return { pathname, status: response.status, xRobots: response.headers.get('x-robots-tag') || '', html };
}

async function main() {
  const dispositionRows = parseCsv(fs.readFileSync(path.join(root, 'seo-remediation/reports/UNAPPROVED-COMMERCIAL-URL-DISPOSITION.csv'), 'utf8'));
  const dispositionByPath = new Map(dispositionRows.map((row) => [new URL(row.url).pathname.replace(/\/$/, ''), row]));
  const pages = await mapConcurrent(sitemapPaths(), 16, request);
  const destinationPaths = new Set();
  const rawOccurrences = [];
  for (const page of pages) {
    const pageTitle = title(page.html);
    for (const anchor of anchorOccurrences(page.html)) {
      destinationPaths.add(anchor.pathname);
      rawOccurrences.push({ page, pageTitle, anchor, classification: classifyLink(anchor) });
    }
  }
  const destinations = await mapConcurrent([...destinationPaths], 12, request);
  const destinationByPath = new Map(destinations.map((entry) => [entry.pathname, entry]));
  const rows = rawOccurrences.map(({ page, pageTitle, anchor, classification }, index) => {
    const destination = destinationByPath.get(anchor.pathname);
    const disposition = dispositionByPath.get(anchor.pathname) || {};
    const robots = `${meta(destination.html, 'robots')} ${destination.xRobots}`.toLowerCase().replace(/\s+/g, ' ').trim();
    const currentStatus = destination.status === 200 && robots.includes('noindex')
      ? 'TEMPORARY_200_NOINDEX_FOLLOW'
      : destination.status === 404
        ? 'TEMPORARY_EXACT_404_EXCLUSION'
        : `UNEXPECTED_HTTP_${destination.status}`;
    const implementationRisk = classification.linkType === 'navigation' || classification.linkType === 'footer'
      ? 'HIGH_SHARED_SURFACE'
      : classification.generation === 'template-generated'
        ? 'MEDIUM_SHARED_TEMPLATE'
        : 'MEDIUM_CONTEXTUAL_JUDGMENT';
    return {
      occurrence_id: `STG01C-LINK-${String(index + 1).padStart(3, '0')}`,
      source_url: `${publicOrigin}${page.pathname}`,
      source_page_title: pageTitle,
      source_page_approved_indexable_status: approved.has(page.pathname) ? 'APPROVED_LIVE_INDEXABLE' : 'OTHER_SITEMAP_INDEXABLE',
      destination_gated_url: `${publicOrigin}${anchor.pathname}`,
      destination_page_title: title(destination.html) || disposition.current_title || '(404 page)',
      anchor_text: anchor.anchorText || '(image/unnamed anchor)',
      component_data_source_or_content_location: classification.component,
      link_type: classification.linkType,
      generation_context: classification.generation,
      relevant_product_family: familyOf(anchor.pathname),
      current_destination_status: currentStatus,
      closest_approved_url: disposition.closest_approved_page || 'OWNER_MAPPING_REQUIRED',
      current_permanent_disposition_status: disposition.disposition_status || 'PENDING_OWNER_REVIEW',
      likely_future_action: 'OWNER_DECISION_REQUIRED',
      implementation_risk: implementationRisk,
    };
  });

  if (rows.length !== expectedOccurrences || destinationPaths.size !== expectedTargets) {
    throw new Error(`Crosswalk count mismatch: ${rows.length}/${expectedOccurrences} occurrences and ${destinationPaths.size}/${expectedTargets} targets`);
  }

  const headers = Object.keys(rows[0]);
  const csv = `${headers.join(',')}\n${rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')).join('\n')}\n`;
  const componentCounts = new Map();
  const destinationCounts = new Map();
  const familyCounts = new Map();
  const typeCounts = new Map();
  const generationCounts = new Map();
  rows.forEach((row) => {
    increment(componentCounts, row.component_data_source_or_content_location);
    increment(destinationCounts, new URL(row.destination_gated_url).pathname);
    increment(familyCounts, row.relevant_product_family);
    increment(typeCounts, row.link_type);
    increment(generationCounts, row.generation_context);
  });
  const markdown = [
    '# STG-01C Gated-Link Crosswalk',
    '',
    `Generated from the local production-equivalent runtime at \`${baseUrl}\`. This is occurrence-level evidence for the unresolved links; it does not authorize or implement a link or URL disposition.`,
    '',
    '## Control totals',
    '',
    `- Occurrences: **${rows.length}**`,
    `- Unique gated destinations: **${destinationPaths.size}**`,
    `- Sitemap/indexable source pages crawled: **${pages.length}**`,
    `- Permanent disposition: **pending owner review for every row**`,
    `- Link modifications made: **zero**`,
    '',
    markdownTable(componentCounts, 'By source component/content location'),
    markdownTable(destinationCounts, 'By destination (top incoming counts)', 42),
    markdownTable(familyCounts, 'By product family'),
    markdownTable(typeCounts, 'By link type'),
    markdownTable(generationCounts, 'Contextual versus template-generated'),
    '## Interpretation',
    '',
    'Every destination remains under the reversible temporary gate. `OWNER_DECISION_REQUIRED` is deliberately retained as the likely future action because STG-01C does not authorize KEEP, 301, retirement, differentiation, or repointing decisions. The CSV is the authoritative occurrence-level register.',
    '',
    'Component/content-location values are evidence-based runtime classifications from each anchor and its rendered ancestors. They identify the affected surface without claiming a permanent source-code owner before the disposition decision.',
    '',
  ].join('\n');

  const reportDir = path.join(root, 'seo-remediation/reports');
  fs.writeFileSync(path.join(reportDir, 'STG-01C-GATED-LINK-CROSSWALK.csv'), csv, 'utf8');
  fs.writeFileSync(path.join(reportDir, 'STG-01C-GATED-LINK-CROSSWALK.md'), markdown, 'utf8');
  console.log(JSON.stringify({ pages: pages.length, occurrences: rows.length, targets: destinationPaths.size, linkTypes: Object.fromEntries(typeCounts), generation: Object.fromEntries(generationCounts) }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
