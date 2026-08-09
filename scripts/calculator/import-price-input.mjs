/**
 * Import SAMAN's price-input workbook whole, into a committed JSON authority.
 *
 * Source: R1-SAMAN-Calculator-Price-Input-05Aug2026- PR.xlsx (05 Aug, 16:32).
 * The 10:03 copy of the same day is superseded and must never be read.
 *
 * The workbook's READ ME and PENDING REGISTER tabs still read as a blank
 * request. That prose was written before SAMAN filled the file and was never
 * updated. THE CELLS GOVERN; both tabs are ignored here by design.
 *
 * Every rate the calculator applies must trace to a row in the emitted JSON,
 * which carries the sheet and row it came from so any figure can be walked
 * back to a cell.
 *
 * Usage: node scripts/calculator/import-price-input.mjs "<path to xlsx>"
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fromRoot } from './common.mjs';

const source = process.argv[2];
if (!source || !fs.existsSync(source)) {
  throw new Error('Pass the absolute path to the R1 price-input workbook.');
}

/**
 * Codes SAMAN is still confirming. They carry a number in the workbook, so the
 * risk of wiring one by accident is live — they are marked here at import so a
 * hold can never be lost between the spreadsheet and the estimate.
 */
const HOLD = new Set([
  'BASE-00', 'PAN-01', 'COUNTER-01', 'KITCHEN-01',
  'EL-11', 'QT-01', 'HT-01', 'PT-02', 'IN-01',
  'DR-01', 'WN-01',
]);

/** Tabs that carry rates. READ ME and PENDING REGISTER are prose and excluded. */
const RATE_SHEETS = {
  '1 Interior Finishes': 'interior',
  '2 Doors and Windows': 'openings',
  '3 Electrical': 'electrical',
  '4 Fit-Out Components': 'fitout',
  '5 Other Charges': 'other',
};

const python = ['C:\\Python314\\python.exe', 'python3', 'python'].find((p) => {
  try { execFileSync(p, ['-c', 'import openpyxl'], { stdio: 'ignore' }); return true; }
  catch { return false; }
});
if (!python) throw new Error('No python with openpyxl available.');

const script = `
import openpyxl, json, sys
p = sys.argv[1]
wb = openpyxl.load_workbook(p, read_only=True, data_only=True)
out = {}
for name in wb.sheetnames:
    ws = wb[name]
    rows = []
    for r, row in enumerate(ws.iter_rows(values_only=True), 1):
        rows.append([None if c is None else (c if isinstance(c,(int,float)) else str(c).strip()) for c in row])
    out[name] = rows
print(json.dumps(out))
`;
const raw = JSON.parse(execFileSync(python, ['-c', script, source], {
  encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
}));

const stat = fs.statSync(source);
const imported = {
  source: {
    file: path.basename(source),
    modified: stat.mtime.toISOString(),
    bytes: stat.size,
    note: 'READ ME and PENDING REGISTER are stale prose and are not imported. The cells govern.',
  },
  holdList: [...HOLD].sort(),
  rates: {},
};

/**
 * A rate is a bare number, nothing else.
 *
 * The workbook mixes real numbers (tabs 1, 3, 5) with numeric strings (tab 4)
 * and with prose that merely contains a digit. "50/ sqft" is a unit SAMAN has
 * not settled and "2 percentage" is an unfinished sentence; both are on the
 * hold list, and coercing either into a figure would put an unapproved number
 * on a quotation.
 */
function numericRate(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^\d[\d,]*(\.\d+)?$/.test(trimmed)) return null;
  return Number(trimmed.replaceAll(',', ''));
}

/** Finds the header row, then reads every code row beneath it. */
for (const [sheet, group] of Object.entries(RATE_SHEETS)) {
  const rows = raw[sheet];
  if (!rows) continue;
  // Tab 4 heads its key column "Component Code", not "Code".
  const headerIndex = rows.findIndex((r) =>
    r.some((c) => typeof c === 'string' && /^(component\s+)?code$/i.test(c)));
  if (headerIndex < 0) continue;
  const header = rows[headerIndex].map((c) => (c == null ? '' : String(c)));
  const rateCol = header.findIndex((c) => /rate/i.test(c));
  const labelCol = header.findIndex((c) => /shown to buyer|item|option|^component$/i.test(c));
  const specCol = header.findIndex((c) => /specification|what it covers/i.test(c));
  const groupCol = header.findIndex((c) => /^group$|^step$/i.test(c));

  const list = [];
  for (let i = headerIndex + 1; i < rows.length; i += 1) {
    const row = rows[i];
    const code = row[0];
    if (!code || typeof code !== 'string' || !/^[A-Z]+-\d+$/.test(code)) continue;
    const value = rateCol >= 0 ? row[rateCol] : null;
    list.push({
      code,
      sheet,
      row: i + 1,
      group: groupCol >= 0 ? row[groupCol] : null,
      label: labelCol >= 0 ? row[labelCol] : null,
      specification: specCol >= 0 ? row[specCol] : null,
      // Tab 4 stores its rates as text, so a numeric STRING counts. But the
      // parse is strict: "50/ sqft" and "2 percentage" are not rates and must
      // never become 50 and 2. "Included" and "SOURCED" are not rates either.
      rate: numericRate(value),
      rawValue: value === null || value === undefined ? null : String(value),
      hold: HOLD.has(code),
    });
  }
  imported.rates[group] = list;
}

const target = fromRoot('src', 'data', 'calculator', 'price-input-05Aug2026.json');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, `${JSON.stringify(imported, null, 2)}\n`);

const pad = (s, n) => String(s).padEnd(n);
console.log(`imported from ${imported.source.file}`);
console.log(`  modified ${imported.source.modified}  ${imported.source.bytes} bytes\n`);
console.log(pad('GROUP', 14) + pad('ROWS', 7) + pad('PRICED', 9) + pad('ON HOLD', 10) + 'NOT A NUMBER');
for (const [group, list] of Object.entries(imported.rates)) {
  const priced = list.filter((r) => r.rate !== null && !r.hold).length;
  const held = list.filter((r) => r.hold).length;
  const nonNumeric = list.filter((r) => r.rate === null && !r.hold).length;
  console.log(pad(group, 14) + pad(list.length, 7) + pad(priced, 9) + pad(held, 10) + nonNumeric);
}
console.log(`\nwritten to ${path.relative(fromRoot(), target)}`);
