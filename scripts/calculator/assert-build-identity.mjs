/**
 * Assert the server on the port is the build you just made.
 *
 * Why this exists: a stale `next start` from an earlier build kept port 3120
 * while the new one died with EADDRINUSE. `curl` still answered 200, so several
 * browser gates ran green against the OLD server. Worse, `public/` is served
 * from disk at request time while pages come from `.next`, so a client-side fix
 * appeared live while the compiled server-side fix did not — which reads as a
 * code fault and is not one. An HTTP 200 proves something is listening. It
 * proves nothing about what.
 *
 * The check: the running server's build id must equal the one in .next/BUILD_ID
 * on disk. Next stamps every page with its build id, so this compares the build
 * you just made against the build actually answering requests.
 *
 * Run:    node scripts/calculator/assert-build-identity.mjs [url]
 * Import: import { assertBuildIdentity } from './assert-build-identity.mjs'
 * Exit:   0 when they match, 1 otherwise.
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';

const DEFAULT_URL = process.env.CALCULATOR_BASE_URL || 'http://127.0.0.1:3120';

/**
 * node:http rather than fetch. Node 24's fetch keeps an undici agent alive past
 * the last await and tears it down during exit, which on Windows aborts the
 * process with `!(handle->flags & UV_HANDLE_CLOSING)` and an exit code of 127 —
 * after the check has already printed "ok". A gate that passes and then exits
 * 127 fails its caller for no reason, which is exactly the class of false
 * signal this file exists to remove.
 */
function get(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const request = client.get(url, { headers: { 'cache-control': 'no-cache' } }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, body }));
    });
    request.on('error', reject);
    request.setTimeout(15000, () => { request.destroy(new Error('timed out after 15s')); });
  });
}

/**
 * The probe is the HOMEPAGE, not the calculator.
 *
 * The calculator page sets `unstable_runtimeJS: false`, which is deliberate —
 * it ships no framework JavaScript — and that strips both __NEXT_DATA__ and the
 * _buildManifest asset link, so there is no build id to read on the very page
 * these gates exercise. Probing it reports "could not read a build id" and
 * looks like a stale server when nothing is wrong. Any page with runtime JS
 * answers the question, and the answer is about the server, not the page.
 */
export async function assertBuildIdentity(baseUrl = DEFAULT_URL, probePath = '/') {
  const buildIdFile = path.join(process.cwd(), '.next', 'BUILD_ID');
  if (!fs.existsSync(buildIdFile)) {
    return { ok: false, reason: 'no .next/BUILD_ID on disk — nothing has been built here' };
  }
  const onDisk = fs.readFileSync(buildIdFile, 'utf8').trim();

  let html;
  try {
    const response = await get(baseUrl + probePath);
    if (response.status < 200 || response.status >= 300) {
      return { ok: false, reason: `${probePath} answered HTTP ${response.status}`, onDisk };
    }
    html = response.body;
  } catch (error) {
    return { ok: false, reason: `nothing answered at ${baseUrl}: ${error.message}`, onDisk };
  }

  // Next embeds the build id in __NEXT_DATA__ and in every static asset path.
  const fromData = html.match(/"buildId"\s*:\s*"([^"]+)"/)?.[1];
  const fromAsset = html.match(/\/_next\/static\/([^/]+)\/_buildManifest\.js/)?.[1];
  const served = fromData || fromAsset || null;
  if (!served) {
    return { ok: false, reason: 'could not read a build id from the served page', onDisk };
  }
  if (served !== onDisk) {
    return {
      ok: false,
      reason: 'the server answering this port is NOT the build on disk — almost certainly a stale `next start` holding the port',
      onDisk,
      served,
    };
  }
  return { ok: true, onDisk, served };
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('assert-build-identity.mjs')) {
  const url = process.argv[2] || DEFAULT_URL;
  const result = await assertBuildIdentity(url);
  if (result.ok) {
    console.log(`BUILD IDENTITY: ok — ${url} is serving build ${result.served}`);
    process.exit(0);
  }
  console.error(`BUILD IDENTITY: FAIL — ${result.reason}`);
  if (result.onDisk) console.error(`  on disk: ${result.onDisk}`);
  if (result.served) console.error(`  served : ${result.served}`);
  console.error('  Kill the process holding the port by PID, restart, and confirm no EADDRINUSE.');
  process.exit(1);
}
