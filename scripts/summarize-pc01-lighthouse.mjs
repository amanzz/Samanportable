import fs from 'node:fs';
import path from 'node:path';

const [root, screenshotLabel = 'capture'] = process.argv.slice(2);
if (!root) {
  throw new Error('Usage: node scripts/summarize-pc01-lighthouse.mjs <evidence-root> [screenshot-label]');
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const readReports = (device) => fs.readdirSync(path.join(root, `lighthouse-${device}`))
  .filter((name) => name.endsWith('.report.json'))
  .sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(root, `lighthouse-${device}`, name), 'utf8')));

const numericValue = (report, id) => report.audits[id]?.numericValue ?? null;

const summarize = (device) => {
  const reports = readReports(device);
  const runs = reports.map((report, index) => ({
    run: index + 1,
    score: Math.round((report.categories.performance.score || 0) * 100),
    fcp: numericValue(report, 'first-contentful-paint'),
    lcp: numericValue(report, 'largest-contentful-paint'),
    speedIndex: numericValue(report, 'speed-index'),
    tbt: numericValue(report, 'total-blocking-time'),
    cls: numericValue(report, 'cumulative-layout-shift'),
    dom: numericValue(report, 'dom-size-insight'),
    mainThread: numericValue(report, 'mainthread-work-breakdown'),
    interactive: numericValue(report, 'interactive'),
    totalBytes: numericValue(report, 'total-byte-weight'),
    resourceSummary: report.audits['resource-summary']?.details?.items || [],
  }));
  const metric = (key) => median(runs.map((run) => run[key]).filter(Number.isFinite));

  return {
    device,
    runs,
    medians: {
      score: metric('score'),
      fcp: metric('fcp'),
      lcp: metric('lcp'),
      speedIndex: metric('speedIndex'),
      tbt: metric('tbt'),
      cls: metric('cls'),
      dom: metric('dom'),
      mainThread: metric('mainThread'),
      interactive: metric('interactive'),
      totalBytes: metric('totalBytes'),
    },
    environment: reports[0].environment,
    configSettings: reports[0].configSettings,
  };
};

const summary = {
  generatedAt: new Date().toISOString(),
  mobile: summarize('mobile'),
  desktop: summarize('desktop'),
};

fs.writeFileSync(path.join(root, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
fs.mkdirSync(path.join(root, 'screenshots'), { recursive: true });

for (const [device, run] of [['mobile', 3], ['desktop', 2]]) {
  const reportPath = path.join(root, `lighthouse-${device}`, `run-${String(run).padStart(2, '0')}.report.json`);
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const data = report.audits['final-screenshot'].details.data;
  fs.writeFileSync(
    path.join(root, 'screenshots', `${device}-${screenshotLabel}.png`),
    Buffer.from(data.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  );
}

console.log(JSON.stringify({ mobile: summary.mobile.medians, desktop: summary.desktop.medians }, null, 2));
