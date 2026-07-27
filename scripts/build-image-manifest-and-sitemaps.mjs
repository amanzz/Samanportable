import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const requestedBaseUrl = process.env.IMAGE_MANIFEST_BASE_URL;
const port = Number(process.env.IMAGE_MANIFEST_PORT || 3197);
const localBaseUrl = requestedBaseUrl || `http://127.0.0.1:${port}`;
let server = null;

const runNode = (script, argumentsList = []) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [path.join(root, script), ...argumentsList], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });
  child.once('error', reject);
  child.once('exit', code => {
    if (code === 0) resolve();
    else reject(new Error(`${script} exited with code ${code}`));
  });
});

const waitForServer = async () => {
  let lastError = null;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(localBaseUrl, {
        redirect: 'manual',
        signal: AbortSignal.timeout(2_000),
      });
      if (response.status > 0) {
        if (response.body) await response.body.cancel();
        return;
      }
    } catch (error) {
      lastError = error;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Built Next.js server did not become ready: ${lastError?.message || 'timeout'}`);
};

const stopServer = async () => {
  if (!server || server.killed) return;
  server.kill('SIGTERM');
  await Promise.race([
    new Promise(resolve => server.once('exit', resolve)),
    new Promise(resolve => setTimeout(resolve, 5_000)),
  ]);
  if (!server.killed) server.kill('SIGKILL');
};

try {
  if (!requestedBaseUrl) {
    const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
    server = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], {
      cwd: root,
      env: { ...process.env, NODE_ENV: 'production' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    server.stdout.on('data', chunk => process.stdout.write(`[image-manifest server] ${chunk}`));
    server.stderr.on('data', chunk => process.stderr.write(`[image-manifest server] ${chunk}`));
    server.once('exit', code => {
      if (code && code !== 0) {
        process.stderr.write(`Built Next.js server exited early with code ${code}\n`);
      }
    });
    await waitForServer();
  }

  await runNode('scripts/collect-image-manifest.mjs', [
    `--base-url=${localBaseUrl}`,
    '--output=public/image-manifest.json',
  ]);
  await runNode('scripts/generate-segmented-sitemaps.mjs');
} finally {
  await stopServer();
}
