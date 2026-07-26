import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = process.cwd();
const apply = process.argv.includes('--apply');
const require = createRequire(import.meta.url);
const config = require(path.join(root, 'next.config.js'));
const entries = await config.redirects();
const norm = value => {
  try {
    const pathname = new URL(value, 'https://www.samanportable.com').pathname;
    return pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
  } catch { return ''; }
};
const map = new Map();
for (const entry of entries) {
  if (!entry || entry.has || entry.missing || typeof entry.source !== 'string' ||
      entry.source.includes(':') || entry.source.includes('*')) continue;
  map.set(norm(entry.source), norm(entry.destination));
}
const terminal = source => {
  const seen = new Set();
  let current = source;
  while (map.has(current) && !seen.has(current)) {
    seen.add(current);
    current = map.get(current);
  }
  return current;
};
const changes = [];
const extensions = new Set(['.json', '.tsx', '.ts', '.jsx', '.js', '.md', '.mdx']);
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    const relative = path.relative(root, full).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      if (relative.includes('src/data/wp-export/redirected-')) continue;
      walk(full);
    } else if (extensions.has(path.extname(entry.name))) {
      let sourceText = fs.readFileSync(full, 'utf8');
      let count = 0;
      const replaced = sourceText.replace(
        /href\s*=\s*(?:\\?["']|{\s*["'`])((?:https?:\/\/(?:www\.)?samanportable\.com)?)(\/[^"'`\\?#\s<>}]+)(?:\\?["']|["'`]\s*})/gi,
        (whole, host, href) => {
          const source = norm(href);
          if (!map.has(source)) return whole;
          const destination = terminal(source);
          if (!destination || destination === source || destination === '/410') return whole;
          count += 1;
          changes.push({ file: relative, source, destination });
          return whole.replace(`${host}${href}`, `${host}${destination}`);
        }
      );
      if (count && apply) fs.writeFileSync(full, replaced);
    }
  }
};
walk(path.join(root, 'src'));
const result = {
  mode: apply ? 'apply' : 'check',
  replacements: changes.length,
  files: new Set(changes.map(change => change.file)).size,
  changes,
};
const reportDir = path.join(root, 'audit', 'index-hygiene');
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, `internal-link-repair-${result.mode}.json`),
  `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ mode: result.mode, replacements: result.replacements, files: result.files }, null, 2));
if (!apply && changes.length) process.exitCode = 1;
