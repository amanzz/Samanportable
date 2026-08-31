import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseUrl = (
  process.argv.find((value) => value.startsWith('--base-url='))?.slice('--base-url='.length)
  || process.env.CONTAINER_OFFICE_RAIL_BASE_URL
  || 'http://127.0.0.1:3210'
).replace(/\/$/, '');
const siteOrigin = 'https://www.samanportable.com';
const hubPath = '/product/container-offices';
const expectedSlugs = [
  'container-office-cabin',
  'shipping-container-office',
  'site-office-container',
  'flat-pack-container-office',
  'multi-story-container-office',
  'containerized-data-center',
  'bess-container',
  'container-marketing-office',
  'expandable-container-office',
];
const explicitLabels = new Map([
  ['shipping-container-office', 'Shipping Container Office'],
]);
const architecture = JSON.parse(fs.readFileSync(path.join(root, 'src/data/seo/commercialArchitecture.json'), 'utf8'));
const gating = JSON.parse(fs.readFileSync(path.join(root, 'src/data/seo/unapprovedCommercialGating.json'), 'utf8'));
const railSource = fs.readFileSync(path.join(root, 'src/lib/containerOfficeClusterRail.ts'), 'utf8');
const approved = new Set(architecture.approvedProductionPaths);
const planned = new Set(architecture.plannedReleasePaths);
const gated = new Set(gating.paths);
const failures = [];

function fail(message) {
  failures.push(message);
}

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

function normalizePath(value) {
  const pathname = new URL(decodeEntities(value), siteOrigin).pathname;
  return pathname === '/' ? pathname : pathname.replace(/\/$/, '');
}

function meta(html, name) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const tag = tags.find((candidate) => new RegExp(`\\bname=["']${name}["']`, 'i').test(candidate));
  return decodeEntities(/\bcontent=["']([^"']*)["']/i.exec(tag || '')?.[1] || '');
}

function canonical(html) {
  const tags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  const tag = tags.find((candidate) => /\brel=["'][^"']*\bcanonical\b[^"']*["']/i.test(candidate));
  return decodeEntities(/\bhref=["']([^"']*)["']/i.exec(tag || '')?.[1] || '');
}

function anchors(html) {
  return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({
    href: normalizePath(match[1]),
    text: stripHtml(match[2]),
  }));
}

async function request(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    redirect: 'manual',
    headers: { 'user-agent': 'SAMAN-STG-01A-Container-Office-Rail/1.0' },
  });
  const contentType = response.headers.get('content-type') || '';
  const html = contentType.includes('text/html') ? await response.text() : '';
  if (!html && response.body) await response.body.cancel();
  return {
    pathname,
    status: response.status,
    location: response.headers.get('location'),
    xRobots: response.headers.get('x-robots-tag') || '',
    html,
  };
}

const keepBlock = /const CONTAINER_OFFICE_KEEP_SLUGS:[\s\S]*?=\s*\[([\s\S]*?)\];/.exec(railSource)?.[1] || '';
const sourceSlugs = [...keepBlock.matchAll(/'([^']+)'/g)].map((match) => match[1]);
if (sourceSlugs.length !== expectedSlugs.length || sourceSlugs.some((slug, index) => slug !== expectedSlugs[index])) {
  fail(`primary rail order differs: ${JSON.stringify(sourceSlugs)}`);
}
for (const slug of expectedSlugs) {
  const count = sourceSlugs.filter((candidate) => candidate === slug).length;
  if (count !== 1) fail(`${slug} appears ${count} times in the primary rail order`);
}
if (new Set(sourceSlugs).size !== sourceSlugs.length) fail('primary rail contains duplicate child slugs');

const products = new Map();
for (const slug of expectedSlugs) {
  const pathname = `${hubPath}/${slug}`;
  const recordPath = path.join(root, 'src/data/wp-export/products', `${slug}.json`);
  if (!fs.existsSync(recordPath)) {
    fail(`${pathname} has no source product record`);
    continue;
  }
  const product = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  products.set(slug, product);
  const categories = new Set([
    product.category_slug,
    ...(product.categories || []).map((category) => category.slug),
  ].filter(Boolean));
  if (!categories.has('container-offices')) fail(`${pathname} is outside the Container Offices family`);
  if (product.status !== 'publish') fail(`${pathname} source status is ${product.status || 'missing'}`);
  if (!approved.has(pathname)) fail(`${pathname} is absent from the approved-production fixture`);
  if (planned.has(pathname)) fail(`${pathname} belongs to the planned-release fixture`);
  if (gated.has(pathname)) fail(`${pathname} belongs to the temporary 63-path gate`);
}
if (sourceSlugs.some((slug) => slug === 'product-category')) fail('primary rail contains a product-category archive');

const hub = await request(hubPath);
if (hub.status !== 200 || hub.location) fail(`hub returned ${hub.status}${hub.location ? ` -> ${hub.location}` : ''}`);
const hubAnchors = anchors(hub.html);
if (hubAnchors.some((anchor) => anchor.href.startsWith('/product-category/'))) {
  fail('Container Offices hub links to a product-category archive');
}

const runtime = [];
for (const slug of expectedSlugs) {
  const pathname = `${hubPath}/${slug}`;
  const page = await request(pathname);
  const robots = `${meta(page.html, 'robots')} ${page.xRobots}`.toLowerCase().replace(/\s+/g, ' ');
  const expectedCanonical = `${siteOrigin}${pathname}`;
  if (page.status !== 200 || page.location) fail(`${pathname} returned ${page.status}${page.location ? ` -> ${page.location}` : ''}`);
  if (canonical(page.html) !== expectedCanonical) fail(`${pathname} canonical is ${canonical(page.html) || 'missing'}`);
  if (!robots.includes('index') || !robots.includes('follow') || robots.includes('noindex')) {
    fail(`${pathname} robots is ${robots || 'missing'}`);
  }
  const expectedLabel = explicitLabels.get(slug) || products.get(slug)?.name || '';
  const childAnchors = hubAnchors.filter((anchor) => anchor.href === pathname);
  if (!childAnchors.length) fail(`hub does not link to ${pathname}`);
  if (!childAnchors.some((anchor) => anchor.text.includes(expectedLabel))) {
    fail(`hub link to ${pathname} lacks child-specific label ${JSON.stringify(expectedLabel)}`);
  }
  if (!anchors(page.html).some((anchor) => anchor.href === hubPath)) fail(`${pathname} does not link back to the hub`);
  runtime.push({ pathname, status: page.status, canonical: canonical(page.html), robots: meta(page.html, 'robots'), label: expectedLabel });
}

if (failures.length) {
  console.error('Container Office rail validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Container Office rail validation passed.');
console.log(JSON.stringify({ hub: hubPath, children: runtime, primaryRailChildCount: sourceSlugs.length }, null, 2));
