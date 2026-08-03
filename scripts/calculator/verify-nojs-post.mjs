/**
 * Native POST with JavaScript disabled must succeed.
 *
 * The calculator's server-rendered form used to post `fullName` and `mobile`
 * while /api/enquiry requires `firstName`, `lastName` and `phone`, so a native
 * submit returned HTTP 400 "Missing required fields" and the enquiry was lost.
 * The enhancer papered over it only when JavaScript ran.
 *
 * This test renders the real SSR form, parses the fields a browser would
 * actually submit, and posts them through the real /api/enquiry validation.
 *
 * NO TEST ENQUIRY REACHES A REAL RECIPIENT. The handler's outbound side —
 * mailer and Zoho CRM — is replaced by a stub before the module is loaded, so
 * nothing leaves the process. The stub records what it was handed, which lets
 * the test also assert that a real lead payload was assembled rather than an
 * empty one.
 *
 * Run: node scripts/calculator/verify-nojs-post.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Module from 'node:module';
import jitiPkg from 'jiti';

const SRC = path.join(process.cwd(), 'src');

// ---------------------------------------------------------------------------
// Stub the outbound edges BEFORE the handler is resolved.
//
// jiti resolves and reads modules from disk itself, ahead of Module._load, so
// an in-memory stub object is never consulted. The stubs are therefore written
// as real CommonJS files in a throwaway temp directory, and the `@/lib/mailer`
// and `@/lib/zohoCrm` specifiers are redirected to them at resolution time.
// Each records its calls to a JSON file so the test can assert a real lead was
// assembled rather than an empty one.
// ---------------------------------------------------------------------------
const stubDir = fs.mkdtempSync(path.join(os.tmpdir(), 'saman-nojs-stub-'));
const ledgerPath = path.join(stubDir, 'ledger.json');
fs.writeFileSync(ledgerPath, JSON.stringify({ mail: [], crm: [] }));

const ledgerLiteral = JSON.stringify(ledgerPath);
fs.writeFileSync(path.join(stubDir, 'mailer.cjs'), `
const fs = require('fs');
const LEDGER = ${ledgerLiteral};
function record(kind, args) {
  const l = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
  l[kind].push(args.map((a) => (typeof a === 'object' ? Object.keys(a || {}) : String(a))));
  fs.writeFileSync(LEDGER, JSON.stringify(l));
}
exports.sendToAllRecipients = async (...args) => { record('mail', args); return { success: true, stubbed: true }; };
exports.formatFormDataForEmail = (data) => JSON.stringify(data);
`);
fs.writeFileSync(path.join(stubDir, 'zohoCrm.cjs'), `
const fs = require('fs');
const LEDGER = ${ledgerLiteral};
exports.upsertLabourColonyLead = async (...args) => {
  const l = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
  l.crm.push(args.map((a) => (typeof a === 'object' ? Object.keys(a || {}) : String(a))));
  fs.writeFileSync(LEDGER, JSON.stringify(l));
  return { success: true, stubbed: true };
};
`);

const REDIRECTS = {
  '@/lib/mailer': path.join(stubDir, 'mailer.cjs'),
  '@/lib/zohoCrm': path.join(stubDir, 'zohoCrm.cjs'),
};

const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === 'string' && REDIRECTS[request]) return REDIRECTS[request];
  if (typeof request === 'string' && request.startsWith('@/')) {
    request = path.join(SRC, request.slice(2));
  }
  return resolveFilename.call(this, request, ...rest);
};

const readLedger = () => JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

/**
 * Hard network cutoff.
 *
 * The handler does not route every outbound call through a library — it POSTs
 * to a Zoho public form endpoint with a bare `fetch`, so stubbing @/lib/zohoCrm
 * is not enough. The first run of this test made a genuine request to
 * forms.zohopublic.com and got back a 409.
 *
 * global.fetch is therefore replaced outright. Any attempt to leave the process
 * is recorded and answered locally; nothing reaches the network. If a future
 * change adds another outbound call, it lands here and is reported rather than
 * silently escaping.
 */
const blockedRequests = [];
global.fetch = async (url, init) => {
  blockedRequests.push({ url: String(url), method: init?.method || 'GET' });
  return {
    ok: true,
    status: 200,
    statusText: 'OK (blocked by test stub)',
    json: async () => ({ stubbed: true }),
    text: async () => 'stubbed',
  };
};

const jiti = (jitiPkg.default || jitiPkg)(path.join(process.cwd(), 'noop.js'), { esmResolve: true });
const { renderCabinCalculatorSSR } = jiti('./src/lib/cabinCalculatorSSR.ts');
const handlerModule = jiti('./src/pages/api/enquiry.ts');
const handler = handlerModule.default || handlerModule;

// ---------------------------------------------------------------------------
// Parse the SSR form exactly as a browser with JavaScript disabled would:
// every named input, select and textarea inside the calculator form, taking
// checked radios/checkboxes only.
// ---------------------------------------------------------------------------
function fieldsFromForm(html) {
  const formStart = html.indexOf('<form');
  const formEnd = html.indexOf('</form>', formStart);
  const form = html.slice(formStart, formEnd);
  const body = {};

  for (const tag of form.matchAll(/<input\b([^>]*)>/g)) {
    const attrs = tag[1];
    const name = /\bname="([^"]*)"/.exec(attrs)?.[1];
    if (!name) continue;
    const type = (/\btype="([^"]*)"/.exec(attrs)?.[1] || 'text').toLowerCase();
    const value = /\bvalue="([^"]*)"/.exec(attrs)?.[1] ?? '';
    if (type === 'radio' || type === 'checkbox') {
      if (/\bchecked\b/.test(attrs)) body[name] = decode(value);
      continue;
    }
    if (type === 'submit' || type === 'button') continue;
    body[name] = decode(value);
  }
  for (const tag of form.matchAll(/<textarea\b([^>]*)>([\s\S]*?)<\/textarea>/g)) {
    const name = /\bname="([^"]*)"/.exec(tag[1])?.[1];
    if (name) body[name] = decode(tag[2]);
  }
  return body;
}

const decode = (v) =>
  String(v).replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function mockRes() {
  const res = { statusCode: null, body: null, headers: {} };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (payload) => { res.body = payload; return res; };
  res.setHeader = (k, v) => { res.headers[k] = v; return res; };
  res.redirect = (code, location) => { res.statusCode = code; res.headers.Location = location; return res; };
  res.end = () => res;
  return res;
}

// ---------------------------------------------------------------------------
const html = renderCabinCalculatorSSR({ pageUrl: '/cabin-cost-calculator' });
const body = fieldsFromForm(html);

console.log('NATIVE POST WITH JAVASCRIPT DISABLED\n');
console.log('Fields the SSR form would submit:');
for (const key of Object.keys(body).sort()) {
  const shown = String(body[key]).length > 48 ? `${String(body[key]).slice(0, 45)}...` : String(body[key]);
  console.log(`  ${key.padEnd(18)} ${shown === '' ? '(empty)' : shown}`);
}

const diffs = [];

// The three names /api/enquiry validates on must be present as field names.
for (const required of ['firstName', 'lastName', 'phone', 'email', 'message']) {
  if (!(required in body)) diffs.push(`SSR form has no "${required}" field; /api/enquiry requires it`);
}
for (const gone of ['fullName', 'mobile']) {
  if (gone in body) diffs.push(`SSR form still posts "${gone}"; /api/enquiry does not accept it`);
}

// A real submitter fills the contact fields; everything else is as rendered.
const submitted = {
  ...body,
  firstName: 'Test',
  lastName: 'Submitter',
  phone: '9876543210',
  email: 'nojs-test@example.invalid',
};

const res = mockRes();
await handler({ method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: submitted }, res);

console.log(`\nPOST /api/enquiry -> ${res.statusCode}`);
console.log(`  response: ${JSON.stringify(res.body)}`);
const sent = readLedger();
console.log(`  stubbed mail sends: ${sent.mail.length}  stubbed CRM upserts: ${sent.crm.length}`);
console.log(`  outbound requests intercepted: ${blockedRequests.length}`);
for (const r of blockedRequests) console.log(`    BLOCKED ${r.method} ${r.url.slice(0, 88)}`);

const ok = res.statusCode >= 200 && res.statusCode < 400;
if (!ok) diffs.push(`native POST returned ${res.statusCode}: ${JSON.stringify(res.body)}`);
if (sent.mail.length === 0) diffs.push('handler assembled no lead; the mail stub was never called');
// Nothing may reach a real host. Everything must have hit the local stub.
for (const r of blockedRequests) {
  if (!/^https?:\/\/(localhost|127\.0\.0\.1)/.test(r.url)) {
    console.log(`  note: ${r.method} ${new URL(r.url).host} was intercepted, not sent`);
  }
}
fs.rmSync(stubDir, { recursive: true, force: true });

console.log('\n' + '='.repeat(70));
if (diffs.length) {
  console.log(`NO-JS POST: FAIL — ${diffs.length}`);
  for (const d of diffs) console.log(`  - ${d}`);
  process.exit(1);
}
console.log('NO-JS POST: PASS — native submit succeeds, nothing left the process');
