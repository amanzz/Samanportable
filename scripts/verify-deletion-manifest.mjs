import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'audit', 'index-hygiene', 'applied-source-inventory.json'), 'utf8'));
const retiredByPath = new Map(inventory.retired.files.map(item => [
  `src/data/wp-export/${item.kind}/${item.file}`, item,
]));
const output = execFileSync('git', [
  'diff', '--no-renames', '--numstat', '--diff-filter=D', 'origin/static-migration',
], { cwd: root, encoding: 'utf8' }).trim();
const deleted = output ? output.split(/\r?\n/).map(line => {
  const [added, removed, file] = line.split('\t');
  return { file, lines: Number(removed), added: Number(added) };
}) : [];
const groups = { orphanedRedirectSource: [], straySelfSlug: [], other: [] };
const integrityFailures = [];
for (const item of deleted) {
  const retired = retiredByPath.get(item.file);
  if (retired) {
    const archivePath = path.join(root, 'src', 'data', 'wp-export', retired.archive, retired.file);
    const originContent = execFileSync('git', ['show', `origin/static-migration:${item.file}`], {
      cwd: root, encoding: 'utf8', maxBuffer: 50 * 1024 * 1024,
    });
    const archiveContent = fs.readFileSync(archivePath, 'utf8');
    if (originContent.replace(/\r\n/g, '\n') !== archiveContent.replace(/\r\n/g, '\n')) {
      integrityFailures.push(item.file);
    }
    groups.orphanedRedirectSource.push({ ...item, destination: retired.destination });
  } else if (/^src\/data\/wp-export\/products\/(.+)\.json$/.test(item.file)) {
    groups.straySelfSlug.push(item);
  } else {
    groups.other.push(item);
  }
}
const sum = items => items.reduce((total, item) => total + item.lines, 0);
const result = {
  totalFiles: deleted.length,
  totalDeletedLines: sum(deleted),
  groups,
  totals: {
    orphanedRedirectSource: { files: groups.orphanedRedirectSource.length, lines: sum(groups.orphanedRedirectSource) },
    straySelfSlug: { files: groups.straySelfSlug.length, lines: sum(groups.straySelfSlug) },
    other: { files: groups.other.length, lines: sum(groups.other) },
  },
  archivedCopiesByteEquivalent: integrityFailures.length === 0,
  integrityFailures,
  pass: groups.other.length === 0 && integrityFailures.length === 0 &&
    deleted.length === retiredByPath.size,
};
const reportDir = path.join(root, 'audit', 'index-hygiene');
fs.writeFileSync(path.join(reportDir, 'deletion-manifest.json'), `${JSON.stringify(result, null, 2)}\n`);
const lines = [
  '# Index-hygiene deletion manifest',
  '',
  `Total: ${result.totalFiles} files, ${result.totalDeletedLines.toLocaleString('en-US')} deleted lines.`,
  '',
  '## Orphaned 301-source pages',
  '',
  ...groups.orphanedRedirectSource.map(item => `- ${item.file} — ${item.lines} lines → ${item.destination}`),
  '',
  `Subtotal: ${result.totals.orphanedRedirectSource.files} files, ${result.totals.orphanedRedirectSource.lines.toLocaleString('en-US')} lines.`,
  '',
  '## Stray self-slug files',
  '',
  ...(groups.straySelfSlug.length ? groups.straySelfSlug.map(item => `- ${item.file} — ${item.lines} lines`) : ['None. Synthetic `/product/X/X` routes are 410; their live `/product/X` source records remain.']),
  '',
  `Subtotal: ${result.totals.straySelfSlug.files} files, ${result.totals.straySelfSlug.lines.toLocaleString('en-US')} lines.`,
  '',
  '## Other',
  '',
  ...(groups.other.length ? groups.other.map(item => `- ${item.file} — ${item.lines} lines`) : ['None.']),
  '',
  `Subtotal: ${result.totals.other.files} files, ${result.totals.other.lines.toLocaleString('en-US')} lines.`,
  '',
  `Gate: ${result.pass ? 'PASS' : 'FAIL'}. Archived copies byte-equivalent: ${result.archivedCopiesByteEquivalent}.`,
  '',
];
fs.writeFileSync(path.join(reportDir, 'deletion-manifest.md'), lines.join('\n'));
console.log(JSON.stringify({
  totalFiles: result.totalFiles,
  totalDeletedLines: result.totalDeletedLines,
  totals: result.totals,
  archivedCopiesByteEquivalent: result.archivedCopiesByteEquivalent,
  pass: result.pass,
}, null, 2));
if (!result.pass) process.exitCode = 1;
