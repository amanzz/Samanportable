import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const lighthouseDir = path.join(root, '.qa/lighthouse');
const output = path.join(root, 'seo-remediation/reports/STG-01C-PERFORMANCE-BASELINE.md');

const groups = [
  { label: 'Homepage', route: '/', files: ['home-1.json', 'home-2.json', 'home-3.json'], buildJs: '191 kB' },
  { label: 'Porta Cabins hub', route: '/product/porta-cabins', files: ['porta-cabins-1.json', 'porta-cabins-2.json', 'porta-cabins-3.json'], buildJs: '581 kB' },
  { label: 'Container Offices hub', route: '/product/container-offices', files: ['container-offices-1.json', 'container-offices-2.json', 'container-offices-3.json'], buildJs: '581 kB' },
  { label: 'Portable Office hub', route: '/product/portable-office', files: ['portable-office-1.json', 'portable-office-2.json', 'portable-office-3.json'], buildJs: '581 kB' },
  { label: 'Expandable Container Office detail', route: '/product/container-offices/expandable-container-office', files: ['detail-1.json', 'detail-2.json', 'detail-3.json'], buildJs: '583 kB' },
];

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function bytes(value) {
  if (!Number.isFinite(value)) return 'n/a';
  return `${(value / 1024).toFixed(0)} KiB`;
}

function ms(value) {
  if (!Number.isFinite(value)) return 'n/a';
  return value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`;
}

function auditNumber(lhr, id, fallback = 0) {
  return Number(lhr.audits[id]?.numericValue ?? fallback);
}

function resourceSize(lhr, type) {
  return Number(lhr.audits['resource-summary']?.details?.items?.find((item) => item.resourceType === type)?.transferSize || 0);
}

function imageSavings(lhr) {
  return (lhr.audits['image-delivery-insight']?.details?.items || []).reduce((sum, item) => sum + Number(item.wastedBytes || 0), 0);
}

function thirdParty(lhr) {
  const items = lhr.audits['third-parties-insight']?.details?.items || [];
  return {
    bytes: items.reduce((sum, item) => sum + Number(item.transferSize || 0), 0),
    mainThread: items.reduce((sum, item) => sum + Number(item.mainThreadTime || 0), 0),
    entities: items.map((item) => item.entity).filter(Boolean),
  };
}

function lcpNode(lhr) {
  const item = lhr.audits['lcp-breakdown-insight']?.details?.items?.find((entry) => entry.type === 'node');
  return item?.nodeLabel || item?.snippet || 'Not exposed by Lighthouse';
}

function largestAsset(lhr) {
  const item = lhr.audits['total-byte-weight']?.details?.items?.[0];
  return item ? { url: item.url, bytes: Number(item.totalBytes || 0) } : { url: 'Not exposed by Lighthouse', bytes: 0 };
}

function extract(lhr) {
  const longTasks = lhr.audits['long-tasks']?.details?.items || [];
  const third = thirdParty(lhr);
  return {
    score: Math.round(Number(lhr.categories.performance.score) * 100),
    fcp: auditNumber(lhr, 'first-contentful-paint'),
    lcp: auditNumber(lhr, 'largest-contentful-paint'),
    tbt: auditNumber(lhr, 'total-blocking-time'),
    cls: auditNumber(lhr, 'cumulative-layout-shift'),
    speedIndex: auditNumber(lhr, 'speed-index'),
    transfer: resourceSize(lhr, 'total'),
    jsTransfer: resourceSize(lhr, 'script'),
    domNodes: auditNumber(lhr, 'dom-size-insight'),
    mainThread: auditNumber(lhr, 'mainthread-work-breakdown'),
    longTaskCount: longTasks.length,
    longTaskTime: longTasks.reduce((sum, item) => sum + Number(item.duration || 0), 0),
    imageSavings: imageSavings(lhr),
    unusedJs: Number(lhr.audits['unused-javascript']?.details?.overallSavingsBytes || lhr.audits['unused-javascript']?.numericValue || 0),
    thirdPartyBytes: third.bytes,
    thirdPartyMainThread: third.mainThread,
    thirdPartyEntities: third.entities,
    lcpNode: lcpNode(lhr),
    largestAsset: largestAsset(lhr),
  };
}

function medianRunByLcp(runs) {
  return [...runs].sort((a, b) => a.lcp - b.lcp)[Math.floor(runs.length / 2)];
}

const summaries = groups.map((group) => {
  const runs = group.files.map((file) => extract(JSON.parse(fs.readFileSync(path.join(lighthouseDir, file), 'utf8'))));
  const representative = medianRunByLcp(runs);
  const med = Object.fromEntries([
    'score', 'fcp', 'lcp', 'tbt', 'cls', 'speedIndex', 'transfer', 'jsTransfer', 'domNodes', 'mainThread',
    'longTaskCount', 'longTaskTime', 'imageSavings', 'unusedJs', 'thirdPartyBytes', 'thirdPartyMainThread',
  ].map((key) => [key, median(runs.map((run) => run[key]))]));
  return { ...group, runs, med, representative };
});

const tableRows = summaries.map(({ label, route, buildJs, med }) =>
  `| ${label} | \`${route}\` | ${med.score} | ${ms(med.fcp)} | ${ms(med.lcp)} | ${ms(med.tbt)} | ${med.cls.toFixed(3)} | ${ms(med.speedIndex)} | ${bytes(med.transfer)} | ${bytes(med.jsTransfer)} / ${buildJs} | ${Math.round(med.domNodes)} | ${ms(med.mainThread)} | ${Math.round(med.longTaskCount)} / ${ms(med.longTaskTime)} |`
).join('\n');

const sampleRows = summaries.flatMap(({ label, runs }) => runs.map((run, index) =>
  `| ${label} | ${index + 1} | ${run.score} | ${ms(run.fcp)} | ${ms(run.lcp)} | ${ms(run.tbt)} | ${run.cls.toFixed(3)} | ${ms(run.speedIndex)} |`
)).join('\n');

const detailSections = summaries.map(({ label, representative, med }) => [
  `### ${label}`,
  '',
  `- LCP element (median-LCP run): ${representative.lcpNode}`,
  `- Largest transferred asset in that run: \`${representative.largestAsset.url}\` (${bytes(representative.largestAsset.bytes)})`,
  `- Median estimated image savings: ${bytes(med.imageSavings)}`,
  `- Median unused JavaScript opportunity: ${bytes(med.unusedJs)}`,
  `- Median third-party/absolute-production-host transfer: ${bytes(med.thirdPartyBytes)}; main-thread time ${ms(med.thirdPartyMainThread)}. Entities observed: ${representative.thirdPartyEntities.join(', ') || 'none'}.`,
  '',
].join('\n')).join('\n');

const markdown = `# STG-01C Performance Baseline

## Scope and method

Measurement only; no optimization was implemented. Lighthouse 13.4.1 ran sequentially against the local production-equivalent Next.js server on loopback, with the mobile form factor, simulated throttling, headless Chrome, and extensions disabled. Each page has three samples; medians are reported. Raw Lighthouse JSON remains in the ignored local \`.qa/lighthouse\` directory and is not committed.

Lighthouse saved all 15 valid JSON reports but emitted a Windows \`EPERM\` warning while deleting each temporary Chrome profile. The saved reports parsed successfully and contain complete performance categories; this cleanup warning is tooling-only and is not hidden.

## Median results

| Page | Route | Score | FCP | LCP | TBT | CLS | Speed Index | Transfer | JS transfer / build first-load JS | DOM nodes | Main thread | Long tasks / duration |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
${tableRows}

The build first-load JavaScript values come from the same successful production build. The Lighthouse JavaScript value is transferred script bytes; the build value is the route's compiled first-load bundle, so the two columns answer different questions.

## All samples

| Page | Sample | Score | FCP | LCP | TBT | CLS | Speed Index |
|---|---:|---:|---:|---:|---:|---:|---:|
${sampleRows}

## LCP, assets, image savings, unused JavaScript and third parties

${detailSections}
## Existing warnings preserved

- Four React Hook dependency warnings: two in \`site-office-container.tsx\` and two in \`product/[category]/index.tsx\`.
- One raw \`<img>\` lint warning in \`product/[category]/[slug].tsx\`.
- Next.js custom-route warning: 1,008 redirects, six headers and two rewrites (1,016 custom routes total).
- Commercial templates remain approximately 579–584 kB first-load JavaScript; the measured hub/detail routes are 581–583 kB.
- Dependency install reported the pre-existing Node/npm engine mismatch and 45 dependency vulnerabilities (3 low, 22 moderate, 19 high, 1 critical). No dependency change was attempted.
- Lighthouse temporary-profile cleanup emitted the Windows \`EPERM\` warning described above.

## Baseline interpretation

The median scores and especially hub/detail LCP values confirm that performance remediation remains open. This report is not a release waiver and does not begin AH-016 or any performance work. Absolute image URLs on the local build can be attributed by Lighthouse to \`samanportable.com\` as a third party even though they are first-party production assets; those rows are retained rather than suppressed.
`;

fs.writeFileSync(output, markdown, 'utf8');
console.log(JSON.stringify(summaries.map(({ label, med }) => ({ label, ...med })), null, 2));
