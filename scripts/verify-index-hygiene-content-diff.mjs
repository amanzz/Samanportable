import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = process.cwd();
const reportDir = path.join(root, 'audit', 'index-hygiene');
const before = JSON.parse(fs.readFileSync(path.join(reportDir, 'baseline-crawl.json'), 'utf8'));
const after = JSON.parse(fs.readFileSync(path.join(reportDir, 'final-crawl.json'), 'utf8'));
const require = createRequire(import.meta.url);
const config = require(path.join(root, 'next.config.js'));
const redirectEntries = await config.redirects();
const norm = value => {
  try {
    const pathname = new URL(value, 'https://www.samanportable.com').pathname;
    return pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
  } catch { return ''; }
};
const redirectMap = new Map(redirectEntries
  .filter(entry => entry && !entry.has && !entry.missing && typeof entry.source === 'string' &&
    !entry.source.includes(':') && !entry.source.includes('*'))
  .map(entry => [norm(entry.source), norm(entry.destination)]));
const terminal = source => {
  const selfSlug = /^\/product\/([^/]+)\/\1$/.exec(source);
  if (selfSlug) return `/product/${selfSlug[1]}`;
  let current = source;
  const seen = new Set();
  while (redirectMap.has(current) && !seen.has(current)) {
    seen.add(current);
    current = redirectMap.get(current);
  }
  return current;
};

const before200 = Object.entries(before.pages).filter(([, page]) => page.status === 200);
const after200 = new Set(Object.entries(after.pages).filter(([, page]) => page.status === 200).map(([pathname]) => pathname));
const lostLive200 = before200.map(([pathname]) => pathname).filter(pathname => !after200.has(pathname));
const visibleTextChanges = [];
const jsonLdChanges = [];
const invalidLinkChanges = [];
const approvedLinkChanges = [];
for (const [pathname, oldPage] of before200) {
  const newPage = after.pages[pathname];
  if (!newPage || newPage.status !== 200) continue;
  if (oldPage.visibleTextHash !== newPage.visibleTextHash) visibleTextChanges.push(pathname);
  if (oldPage.jsonLdHash !== newPage.jsonLdHash) jsonLdChanges.push(pathname);
  const oldLinks = new Set(oldPage.outgoing || []);
  const newLinks = new Set(newPage.outgoing || []);
  const removed = [...oldLinks].filter(link => !newLinks.has(link));
  const added = [...newLinks].filter(link => !oldLinks.has(link));
  for (const source of removed) {
    const destination = terminal(source);
    if ((redirectMap.has(source) || /^\/product\/([^/]+)\/\1$/.test(source)) && newLinks.has(destination)) {
      approvedLinkChanges.push({ pathname, source, destination });
    } else {
      invalidLinkChanges.push({ pathname, removed: source, added });
    }
  }
  for (const destination of added) {
    if (!removed.some(source =>
      (redirectMap.has(source) || /^\/product\/([^/]+)\/\1$/.test(source)) &&
      terminal(source) === destination)) {
      invalidLinkChanges.push({ pathname, added: destination, removed });
    }
  }
}
const result = {
  baselineLive200: before200.length,
  finalLive200: after200.size,
  lostLive200,
  visibleTextChanges,
  jsonLdChanges,
  approvedLinkChanges,
  invalidLinkChanges,
  clean: lostLive200.length === 0 && visibleTextChanges.length === 0 &&
    jsonLdChanges.length === 0 && invalidLinkChanges.length === 0,
};
fs.writeFileSync(path.join(reportDir, 'content-layer-diff.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({
  baselineLive200: result.baselineLive200,
  finalLive200: result.finalLive200,
  lostLive200: result.lostLive200.length,
  visibleTextChanges: result.visibleTextChanges.length,
  jsonLdChanges: result.jsonLdChanges.length,
  approvedLinkChanges: result.approvedLinkChanges.length,
  invalidLinkChanges: result.invalidLinkChanges.length,
  clean: result.clean,
}, null, 2));
if (!result.clean) process.exitCode = 1;
