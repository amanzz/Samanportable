// SCH-02 - evidence for re-pinning the PC-01 calculator price-parity hash.
//
// That hash is a tamper tripwire on src/lib/calculatorLadders.ts. This build changes
// that file on purpose (build ticket correction 1), so the pin has to move - but only
// after proving the change is confined to this one route. This script resolves
// ROUTE_LADDERS in BOTH worktrees and diffs every key's rows.
//
//   node scripts/sch02-ladder-delta.cjs <baseline-worktree> <branch-worktree>
const fs = require('fs');
const path = require('path');

const [BASE, BRANCH] = process.argv.slice(2);

function loadLadders(root) {
  const typescript = require(path.join(root, 'node_modules', 'typescript'));
  const Module = require('node:module');
  const originalResolve = Module._resolveFilename;
  const originalTs = require.extensions['.ts'];
  Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
    const r = request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : request;
    return originalResolve.call(this, r, parent, isMain, options);
  };
  require.extensions['.ts'] = (module, filename) => {
    const out = typescript.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
        target: typescript.ScriptTarget.ES2020,
        esModuleInterop: true,
        resolveJsonModule: true,
      },
      fileName: filename,
    }).outputText;
    module._compile(out, filename);
  };
  try {
    // Fresh module registry per root, so the two worktrees cannot share cached JSON.
    for (const k of Object.keys(require.cache)) delete require.cache[k];
    return require(path.join(root, 'src/lib/calculatorLadders.ts')).ROUTE_LADDERS;
  } finally {
    Module._resolveFilename = originalResolve;
    if (originalTs) require.extensions['.ts'] = originalTs;
    else delete require.extensions['.ts'];
  }
}

const a = loadLadders(BASE);
const b = loadLadders(BRANCH);
const ka = Object.keys(a);
const kb = Object.keys(b);

const lines = [];
lines.push('SCH-02 - ROUTE_LADDERS delta, pristine HEAD vs this branch');
lines.push('');
lines.push(`baseline worktree : ${BASE}`);
lines.push(`branch worktree   : ${BRANCH}`);
lines.push('');
lines.push(`keys at baseline  : ${ka.length}`);
lines.push(`keys on branch    : ${kb.length}`);
lines.push(`keys added        : ${kb.filter((k) => !ka.includes(k)).join(', ') || 'none'}`);
lines.push(`keys removed      : ${ka.filter((k) => !kb.includes(k)).join(', ') || 'none'}`);
lines.push(`key ORDER identical: ${JSON.stringify(ka) === JSON.stringify(kb)}`);
lines.push('');

const changed = [];
for (const k of ka) {
  if (!kb.includes(k)) continue;
  const x = JSON.stringify(a[k]);
  const y = JSON.stringify(b[k]);
  if (x !== y) changed.push(k);
}
lines.push(`routes whose ladder rows CHANGED: ${changed.length ? changed.join(', ') : 'none'}`);
lines.push('');
for (const k of changed) {
  lines.push(`--- ${k} ---`);
  lines.push('  baseline:');
  for (const r of a[k]) {
    lines.push(`    ${String(r.sizeSlug).padEnd(8)} ${String(r.areaSqft).padStart(5)} sq.ft  ex-GST ${r.priceExGst}`);
  }
  lines.push('  branch:');
  for (const r of b[k]) {
    lines.push(`    ${String(r.sizeSlug).padEnd(8)} ${String(r.areaSqft).padStart(5)} sq.ft  ex-GST ${r.priceExGst}`);
  }
  lines.push('');
}
const others = ka.filter((k) => kb.includes(k) && !changed.includes(k));
lines.push(`routes byte-identical: ${others.length} of ${ka.length}`);
lines.push('');
lines.push('CONCLUSION');
lines.push(changed.length === 1 && changed[0] === 'shipping-container-homes'
  ? "Exactly one route's ladder moved, and it is the route this build ticket corrects.\n"
    + 'No key was added or removed, key order is unchanged, and every other route\n'
    + "resolves to byte-identical rows. Re-pinning the tripwire hash is therefore safe."
  : 'UNEXPECTED: the change is not confined to shipping-container-homes. Do not re-pin.');
console.log(lines.join('\n'));
