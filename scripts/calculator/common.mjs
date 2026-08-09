import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = path.resolve(scriptDirectory, '..', '..');

export function fromRoot(...parts) {
  return path.join(repoRoot, ...parts);
}

export function readText(...parts) {
  return fs.readFileSync(fromRoot(...parts), 'utf8').replaceAll('\r\n', '\n');
}

export function readJson(...parts) {
  return JSON.parse(readText(...parts));
}

export function extractBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing marker: ${startMarker}`);
  const valueStart = start + startMarker.length;
  const end = source.indexOf(endMarker, valueStart);
  if (end < 0) throw new Error(`Missing marker after ${startMarker}: ${endMarker}`);
  return source.slice(valueStart, end).trim();
}

export function inr(value) {
  return `Rs ${Math.round(value).toLocaleString('en-IN')}`;
}

export function failIfDiffs(label, diffs) {
  console.log(`${label} diff:`);
  if (diffs.length === 0) {
    console.log('(empty)');
    return;
  }
  for (const diff of diffs) console.log(`- ${diff}`);
  process.exitCode = 1;
}
