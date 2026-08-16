import fs from 'node:fs';
const report = JSON.parse(fs.readFileSync('scripts/p1-link-audit-report.json', 'utf8'));
const seen = new Set();
const urls = [];
for (const r of report) for (const l of r.allLinks) {
  const abs = l.href.startsWith('http') ? l.href : 'https://www.samanportable.com' + l.href;
  if (!seen.has(abs)) { seen.add(abs); urls.push(abs); }
}
console.log(`Checking ${urls.length} unique link targets against production...\n`);
for (const u of urls.sort()) {
  let status = 'ERR', loc = '';
  try {
    const res = await fetch(u, { method: 'HEAD', redirect: 'manual' });
    status = res.status;
    loc = res.headers.get('location') || '';
  } catch (e) { status = 'ERR ' + e.message; }
  console.log(`  ${status}${loc ? ' -> ' + loc : ''}\t${u}`);
}
