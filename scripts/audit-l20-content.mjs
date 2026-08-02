import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parseDocument } from 'htmlparser2';

const ROOT = process.cwd();
const BASE_URL = getArg('--base', 'http://127.0.0.1:3208');
const OUTPUT = path.resolve(ROOT, getArg('--out', 'reports/l20-content-audit.json'));
const MODE = getArg('--mode', 'audit');
const CONCURRENCY = Number.parseInt(getArg('--concurrency', '10'), 10);
const CONTENT_SITEMAPS = [
  'public/sitemap-products.xml',
  'public/sitemap-locations.xml',
  'public/sitemap-projects.xml',
  'public/sitemap-editorial.xml',
];

const CATEGORY_KEYS = [
  'seoTitle',
  'metaDescription',
  'h1',
  'otherHeadings',
  'first100Words',
  'bodyProse',
  'tableAndSpecificationData',
  'jsonLdStrings',
  'imageAltText',
  'anchorText',
];

const SAFE_TELLS = [
  ['utilize', /\butilize\b/gi],
  ['utilise', /\butilise\b/gi],
  ['leverage', /\bleverage(?:s|d|ing)?\b/gi],
  ['in order to', /\bin order to\b/gi],
  ['a myriad of', /\ba myriad of\b/gi],
  ['a plethora of', /\ba plethora of\b/gi],
  ['delve into', /\bdelve into\b/gi],
  ['commence', /\bcommence(?:s|d|ment|ments)?\b/gi],
  ['endeavour to', /\bendeavour to\b/gi],
  ['facilitate', /\bfacilitate(?:s|d|ing)?\b/gi],
  ['prior to', /\bprior to\b/gi],
  ['in the event that', /\bin the event that\b/gi],
  ['it is important to note that', /\bit is important to note that\b/gi],
  ['it is worth noting that', /\bit is worth noting that\b/gi],
  ['when it comes to X', /\bwhen it comes to\b/gi],
  ['look no further', /\blook no further\b/gi],
];

const FLAG_TELLS = [
  ["In today's fast-paced", /\bin today['’]s fast-paced\b/gi],
  ['Whether you are X or Y opener', /^\s*whether you (?:are|need|want|run|manage)\b[^.!?]{0,180}\bor\b/gi],
  ['not just X, but Y', /\bnot just\b[^.!?]{0,120}\bbut\b/gi],
  ["isn't merely X, it's Y", /\bisn['’]t merely\b[^.!?]{0,120}\bit['’]s\b/gi],
  ["Let's dive in / Let's explore", /\blet['’]s (?:dive in|explore)\b/gi],
  ['game-changer', /\bgame-changer\b/gi],
  ['cutting-edge', /\bcutting-edge\b/gi],
  ['state-of-the-art', /\bstate-of-the-art\b/gi],
  ['revolutionary / revolutionize', /\brevolution(?:ary|ize|ise|izes|ises|ized|ised|izing|ising)\b/gi],
  ['seamless / seamlessly', /\bseamless(?:ly)?\b/gi],
  ['elevate your', /\belevate your\b/gi],
  ['unlock the potential', /\bunlock the potential\b/gi],
  ['empower', /\bempower(?:s|ed|ing|ment)?\b/gi],
  ['harness', /\bharness(?:es|ed|ing)?\b/gi],
  ['navigate the landscape', /\bnavigate the landscape\b/gi],
  ['in the realm of', /\bin the realm of\b/gi],
  ['a testament to', /\ba testament to\b/gi],
  ['the world of', /\bthe world of\b/gi],
  ['tailored to your needs', /\btailored to your needs\b/gi],
  ['one-stop solution', /\bone-stop solution\b/gi],
  ['Ready to X? Contact us today!', /\bready to\b[^?]{0,100}\?\s*contact us today!/gi],
];

function getArg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replace(/&#([0-9]+);/g, (_, value) => String.fromCodePoint(Number.parseInt(value, 10)));
}

function collapse(value) {
  return decodeEntities(value).replace(/\s+/g, ' ').trim();
}

function countChar(value, character = '\u2014') {
  let count = 0;
  for (const current of String(value || '')) if (current === character) count += 1;
  return count;
}

function wordCount(value) {
  return collapse(value).match(/[\p{L}\p{N}₹]+(?:[’'./-][\p{L}\p{N}]+)*/gu)?.length || 0;
}

function blankCounts() {
  return Object.fromEntries(CATEGORY_KEYS.map(key => [key, 0]));
}

function descendants(node, predicate, output = []) {
  if (!node) return output;
  if (predicate(node)) output.push(node);
  for (const child of node.children || []) descendants(child, predicate, output);
  return output;
}

function firstElement(root, name) {
  return descendants(root, node => node.type === 'tag' && node.name === name)[0] || null;
}

function nodeText(node, { skip = new Set(['script', 'style', 'noscript', 'svg', 'template']) } = {}) {
  if (!node) return '';
  if (node.type === 'text') return node.data || '';
  if (node.type === 'tag' && skip.has(node.name)) return '';
  return (node.children || []).map(child => nodeText(child, { skip })).join(' ');
}

function ancestorNames(ancestors) {
  return ancestors.filter(node => node.type === 'tag').map(node => node.name);
}

function surfaceFor(ancestors, wordsSeen, localText, dashIndex) {
  const names = ancestorNames(ancestors);
  if (names.includes('h1')) return 'h1';
  if (names.some(name => /^h[2-6]$/.test(name))) return 'otherHeadings';
  if (names.includes('td') || names.includes('th') || names.includes('table')) return 'tableAndSpecificationData';
  if (names.includes('a')) return 'anchorText';
  const wordsBeforeDash = wordCount(localText.slice(0, dashIndex));
  return wordsSeen + wordsBeforeDash < 100 ? 'first100Words' : 'bodyProse';
}

function surroundingSentence(value, index = 0) {
  const text = collapse(value);
  if (!text) return '';
  const safeIndex = Math.max(0, Math.min(index, text.length - 1));
  let start = safeIndex;
  let end = safeIndex;
  while (start > 0 && !/[.!?]/.test(text[start - 1])) start -= 1;
  while (end < text.length && !/[.!?]/.test(text[end])) end += 1;
  if (end < text.length) end += 1;
  return text.slice(start, end).trim();
}

function mojibakeMatches(value) {
  const text = String(value || '');
  const matches = [];
  const marker = /\u00c3|\u00c2|\u00e2(?=\u20ac|\u201a)|\ufffd/gu;
  for (const match of text.matchAll(marker)) {
    const start = Math.max(0, match.index - 16);
    const end = Math.min(text.length, match.index + 48);
    matches.push({ marker: match[0], index: match.index, context: collapse(text.slice(start, end)) });
  }
  return matches;
}

function collectTellMatches({ pathname, surface, text, heading = false, output }) {
  const normalized = collapse(text);
  if (!normalized) return;

  for (const [phrase, regex] of SAFE_TELLS) {
    regex.lastIndex = 0;
    for (const match of normalized.matchAll(regex)) {
      if (phrase === 'leverage') {
        const before = normalized.slice(Math.max(0, match.index - 28), match.index);
        if (/\bfinancial\s*$/i.test(before) || /\b(?:a|the|is|as)\s*$/i.test(before)) continue;
      }
      output.safe.push({ phrase, pathname, surface, sentence: surroundingSentence(normalized, match.index), match: match[0] });
    }
  }

  for (const [phrase, regex] of FLAG_TELLS) {
    regex.lastIndex = 0;
    for (const match of normalized.matchAll(regex)) {
      output.flag.push({ phrase, pathname, surface, sentence: surroundingSentence(normalized, match.index), match: match[0] });
    }
  }

  if (heading && /\?\s*$/.test(normalized)) {
    output.flag.push({ phrase: 'rhetorical question as a heading', pathname, surface, sentence: normalized, match: normalized });
  }
  if (/\p{Extended_Pictographic}/u.test(normalized)) {
    for (const match of normalized.matchAll(/\p{Extended_Pictographic}/gu)) {
      output.flag.push({ phrase: 'emoji in body copy', pathname, surface, sentence: surroundingSentence(normalized, match.index), match: match[0] });
    }
  }
}

function inspectRoute(pathname, html, status) {
  const document = parseDocument(html, { decodeEntities: true });
  const counts = blankCounts();
  const occurrences = [];
  const mojibake = [];
  const tells = { safe: [], flag: [] };
  const titleNode = firstElement(document, 'title');
  const title = collapse(nodeText(titleNode));
  counts.seoTitle += countChar(title);
  for (const match of mojibakeMatches(title)) mojibake.push({ surface: 'seoTitle', ...match });
  collectTellMatches({ pathname, surface: 'seoTitle', text: title, output: tells });

  const metas = descendants(document, node => node.type === 'tag' && node.name === 'meta');
  const metaNode = metas.find(node => String(node.attribs?.name || '').toLowerCase() === 'description');
  const metaDescription = collapse(metaNode?.attribs?.content || '');
  counts.metaDescription += countChar(metaDescription);
  for (const match of mojibakeMatches(metaDescription)) mojibake.push({ surface: 'metaDescription', ...match });
  collectTellMatches({ pathname, surface: 'metaDescription', text: metaDescription, output: tells });

  const jsonScripts = descendants(
    document,
    node => node.type === 'script' && String(node.attribs?.type || '').toLowerCase() === 'application/ld+json',
  );
  for (const script of jsonScripts) {
    const raw = (script.children || []).map(child => child.data || '').join('');
    let strings = [raw];
    try {
      const parsed = JSON.parse(raw);
      strings = [];
      const visit = value => {
        if (typeof value === 'string') strings.push(value);
        else if (Array.isArray(value)) value.forEach(visit);
        else if (value && typeof value === 'object') Object.values(value).forEach(visit);
      };
      visit(parsed);
    } catch {}
    for (const value of strings) {
      const dashCount = countChar(value);
      counts.jsonLdStrings += dashCount;
      if (dashCount) occurrences.push({ surface: 'jsonLdStrings', text: collapse(value), count: dashCount });
      for (const match of mojibakeMatches(value)) mojibake.push({ surface: 'jsonLdStrings', ...match });
    }
  }

  const root = firstElement(document, 'main') || firstElement(document, 'body') || document;
  const skipTags = new Set(['script', 'style', 'noscript', 'svg', 'template', 'nav', 'header', 'footer']);
  let wordsSeen = 0;
  const visibleParts = [];
  let h1 = '';
  const headings = [];
  let faqHeadingLevel = null;

  const visit = (node, ancestors = []) => {
    if (node.type === 'tag' && skipTags.has(node.name)) return;
    const nextAncestors = node.type === 'tag' ? [...ancestors, node] : ancestors;

    if (node.type === 'tag' && node.name === 'img') {
      const alt = collapse(node.attribs?.alt || '');
      const dashCount = countChar(alt);
      counts.imageAltText += dashCount;
      if (dashCount) occurrences.push({ surface: 'imageAltText', text: alt, count: dashCount });
      for (const match of mojibakeMatches(alt)) mojibake.push({ surface: 'imageAltText', ...match });
      collectTellMatches({ pathname, surface: 'imageAltText', text: alt, output: tells });
    }

    if (node.type === 'tag' && /^h[1-6]$/.test(node.name)) {
      const text = collapse(nodeText(node));
      const level = Number(node.name.slice(1));
      const startsFaqSection = /\b(?:FAQs?|Frequently Asked Questions)\b/i.test(text);
      const questionHeading = /\?\s*$/.test(text);
      const isFaqQuestion = faqHeadingLevel !== null && level >= faqHeadingLevel && questionHeading;
      if (faqHeadingLevel !== null && level <= faqHeadingLevel && !startsFaqSection && !isFaqQuestion) faqHeadingLevel = null;
      if (node.name === 'h1' && !h1) h1 = text;
      headings.push({ level: node.name, text });
      collectTellMatches({ pathname, surface: node.name === 'h1' ? 'h1' : 'otherHeadings', text, heading: !isFaqQuestion, output: tells });
      if (startsFaqSection) faqHeadingLevel = level;
    }

    if (node.type === 'text') {
      const text = node.data || '';
      if (!collapse(text)) return;
      visibleParts.push(text);
      for (let index = text.indexOf('\u2014'); index >= 0; index = text.indexOf('\u2014', index + 1)) {
        const surface = surfaceFor(ancestors, wordsSeen, text, index);
        counts[surface] += 1;
        occurrences.push({ surface, text: surroundingSentence(text, index), count: 1 });
      }
      const names = ancestorNames(ancestors);
      const surface = names.includes('h1')
        ? 'h1'
        : names.some(name => /^h[2-6]$/.test(name))
          ? 'otherHeadings'
          : names.includes('td') || names.includes('th') || names.includes('table')
            ? 'tableAndSpecificationData'
            : names.includes('a')
              ? 'anchorText'
              : wordsSeen < 100
                ? 'first100Words'
                : 'bodyProse';
      for (const match of mojibakeMatches(text)) mojibake.push({ surface, ...match });
      const reviewContext = ancestors.some(ancestor => {
        const marker = `${ancestor.name || ''} ${ancestor.attribs?.class || ''} ${ancestor.attribs?.id || ''}`;
        return ancestor.name === 'blockquote' || /\b(?:review|testimonial|customer-quote)\b/i.test(marker);
      });
      if (!reviewContext) collectTellMatches({ pathname, surface, text, output: tells });
      wordsSeen += wordCount(text);
    }

    for (const child of node.children || []) visit(child, nextAncestors);
  };
  visit(root);

  const visibleText = collapse(visibleParts.join(' '));
  const transitionCount = (visibleText.match(/\b(?:Moreover|Furthermore|Additionally),/g) || []).length;
  if (transitionCount >= 3) {
    tells.flag.push({
      phrase: 'Moreover/Furthermore/Additionally three-or-more on one page',
      pathname,
      surface: 'bodyProse',
      sentence: `${transitionCount} occurrences on this page`,
      match: String(transitionCount),
    });
  }

  const sentences = visibleText.match(/[^.!?]+[.!?]+/g) || [];
  for (let index = 0; index <= sentences.length - 3; index += 1) {
    const triad = sentences.slice(index, index + 3).map(sentence => collapse(sentence));
    const lengths = triad.map(sentence => wordCount(sentence));
    const openings = triad.map(sentence => (sentence.match(/^[^\p{L}\p{N}]*(\p{L}+)/u)?.[1] || '').toLowerCase());
    const parallelOpening = openings[0] && openings.every(opening => opening === openings[0]);
    if (lengths.every(length => length >= 2 && length <= 14) && parallelOpening) {
      tells.flag.push({
        phrase: 'three-item rhetorical triad in consecutive sentences',
        pathname,
        surface: 'bodyProse',
        sentence: triad.join(' '),
        match: openings[0],
      });
    }
  }

  const first100Words = (visibleText.match(/[\p{L}\p{N}₹]+(?:[’'./-][\p{L}\p{N}]+)*/gu) || []).slice(0, 100).join(' ');
  return {
    pathname,
    status,
    title,
    metaDescription,
    h1,
    first100Words,
    wordCount: wordCount(visibleText),
    emDashCounts: counts,
    emDashTotal: Object.values(counts).reduce((sum, value) => sum + value, 0),
    emDashOccurrences: occurrences,
    mojibake,
    aiTells: tells,
    headings,
  };
}

function routePaths() {
  const routes = new Set(['/']);
  for (const relative of CONTENT_SITEMAPS) {
    const xml = fs.readFileSync(path.join(ROOT, relative), 'utf8');
    for (const match of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)) {
      const url = new URL(decodeEntities(match[1]));
      routes.add(url.pathname || '/');
    }
  }
  return [...routes].sort();
}

async function fetchRoute(pathname) {
  const url = new URL(pathname, BASE_URL);
  const response = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'SAMAN-L20-Audit/1.0' } });
  const html = await response.text();
  return inspectRoute(pathname, html, response.status);
}

async function mapConcurrent(values, limit, mapper) {
  const output = new Array(values.length);
  let cursor = 0;
  async function worker() {
    for (;;) {
      const index = cursor++;
      if (index >= values.length) return;
      try {
        output[index] = await mapper(values[index], index);
      } catch (error) {
        output[index] = { pathname: values[index], status: 0, error: String(error?.stack || error) };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker));
  return output;
}

function listFiles(directory) {
  const output = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...listFiles(absolute));
    else output.push(absolute);
  }
  return output;
}

function sourceInventory() {
  const sourceFiles = listFiles(path.join(ROOT, 'src')).filter(file => /\.(?:[cm]?[jt]sx?|json|html|css|md|txt)$/i.test(file));
  const emDashes = [];
  const mojibake = [];
  for (const file of sourceFiles) {
    const relative = path.relative(ROOT, file).replaceAll('\\', '/');
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      const dashCount = countChar(line);
      if (dashCount) emDashes.push({ file: relative, line: index + 1, count: dashCount, text: collapse(line) });
      for (const match of mojibakeMatches(line)) {
        mojibake.push({ file: relative, line: index + 1, ...match, text: collapse(line) });
      }
    });
  }
  return {
    fileCount: sourceFiles.length,
    emDashTotal: emDashes.reduce((sum, item) => sum + item.count, 0),
    emDashes,
    mojibakeTotal: mojibake.length,
    mojibake,
  };
}

function hashDirectory(directory) {
  const files = listFiles(directory).sort();
  const hash = crypto.createHash('sha256');
  const entries = [];
  for (const file of files) {
    const relative = path.relative(directory, file).replaceAll('\\', '/');
    const contents = fs.readFileSync(file);
    const fileHash = crypto.createHash('sha256').update(contents).digest('hex');
    entries.push({ file: relative, sha256: fileHash, bytes: contents.length });
    hash.update(relative).update('\0').update(contents).update('\0');
  }
  return { fileCount: files.length, sha256: hash.digest('hex'), entries };
}

function summarize(routes) {
  const counts = blankCounts();
  const aiCounts = { safe: {}, flag: {} };
  let emDashTotal = 0;
  let mojibakeTotal = 0;
  for (const route of routes) {
    if (!route || route.error) continue;
    emDashTotal += route.emDashTotal;
    mojibakeTotal += route.mojibake.length;
    for (const key of CATEGORY_KEYS) counts[key] += route.emDashCounts[key];
    for (const kind of ['safe', 'flag']) {
      for (const item of route.aiTells[kind]) aiCounts[kind][item.phrase] = (aiCounts[kind][item.phrase] || 0) + 1;
    }
  }
  return {
    requestedRouteCount: routes.length,
    status200Count: routes.filter(route => route?.status === 200).length,
    failedRoutes: routes.filter(route => route?.status !== 200).map(route => ({ pathname: route?.pathname, status: route?.status, error: route?.error })),
    emDashTotal,
    emDashCounts: counts,
    mojibakeTotal,
    aiTellCounts: aiCounts,
  };
}

async function main() {
  const paths = routePaths();
  const routes = await mapConcurrent(paths, Math.max(1, CONCURRENCY), fetchRoute);
  const result = {
    schemaVersion: 1,
    mode: MODE,
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    gitHead: process.env.GIT_HEAD || null,
    summary: summarize(routes),
    wpExport: hashDirectory(path.join(ROOT, 'src', 'data', 'wp-export')),
    source: sourceInventory(),
    routes,
  };
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({ output: OUTPUT, summary: result.summary, source: { fileCount: result.source.fileCount, emDashTotal: result.source.emDashTotal, mojibakeTotal: result.source.mojibakeTotal }, wpExport: { fileCount: result.wpExport.fileCount, sha256: result.wpExport.sha256 } }, null, 2)}\n`);
}

await main();
