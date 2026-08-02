import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const lockedExport = path.join(sourceRoot, 'data', 'wp-export');
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json']);
const headingKeys = new Set(['title', 'heading', 'headline', 'name', 'label', 'h1', 'h2', 'h3']);

const cp1252 = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
  [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
  [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
  [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
  [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f],
]);
const marker = /\u00c3|\u00c2|\u00e2(?=\u20ac|\u201a|\u201d)|\ufffd/gu;
const score = value => value.match(marker)?.length || 0;

function byteFor(character) {
  const point = character.codePointAt(0);
  return point <= 0xff ? point : cp1252.get(point) ?? null;
}

function decodeCandidate(value) {
  const bytes = [];
  for (const character of value) {
    const byte = byteFor(character);
    if (byte === null) return null;
    bytes.push(byte);
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bytes));
  } catch {
    return null;
  }
}

function repairMojibake(value) {
  let output = value;
  for (let pass = 0; pass < 4 && score(output) > 0; pass += 1) {
    let next = '';
    for (let cursor = 0; cursor < output.length;) {
      const character = output[cursor];
      if (!'\u00c3\u00c2\u00e2'.includes(character)) {
        next += character;
        cursor += 1;
        continue;
      }
      let best = null;
      for (let length = 2; length <= Math.min(output.length - cursor, 18); length += 1) {
        const candidate = output.slice(cursor, cursor + length);
        const decoded = decodeCandidate(candidate);
        if (decoded === null || decoded.includes('\ufffd')) continue;
        const improvement = score(candidate) - score(decoded);
        if (improvement > 0 && (!best || improvement > best.improvement ||
          (improvement === best.improvement && length > best.length))) {
          best = { decoded, improvement, length };
        }
      }
      if (best) {
        next += best.decoded;
        cursor += best.length;
      } else {
        next += character;
        cursor += 1;
      }
    }
    if (next === output) break;
    output = next;
  }
  return output.replace(/\u00c2(?=\s|\u00a0|â‚¹|Â£|â‚¬)/g, '');
}

function words(value) {
  return value.match(/[\p{L}\p{N}₹]+(?:[’'./-][\p{L}\p{N}]+)*/gu) || [];
}

function capitalizeStart(value) {
  return value.replace(/^(\s*(?:<[^>]+>\s*)*)([a-z])/, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`);
}

function replacementForSingle(before, after, heading) {
  if (heading || /<h[1-6]\b[^>]*>[^<]*$/i.test(before)) return ': ';
  const segment = after.split(/[.!?]|<\/(?:p|li|td|th|div|section)>/i, 1)[0];
  const segmentWords = words(segment);
  const explanation =
    /(?:include|includes|included|offers|covers|means|are|is|was|were|as follows|you receive|available)\s*$/i.test(before) ||
    /^\s*(?:including|such as|namely|for example|from\b|the following\b)/i.test(segment);
  if (explanation) return ': ';

  const cue = /(?:points?|range|cabins?|scale|homes?|units?|facilities|page|card|specification|price|scope|clearance|order|steel)\s*$/i.test(before);
  const list = (segment.match(/,/g) || []).length >= 2 && !/\b(?:is|are|was|were|has|have|had|will|would|can|could|should|must|does|do)\b/i.test(segment);
  if (cue || list || /^\s*[₹\d]/u.test(segment)) return ': ';

  const conjunction = /^\s*(?:and|but|or|so|yet|which|who|that|while|because|if|when)\b/i.test(segment);
  const independentSubject = /^\s*(?:this|these|those|it|we|you|they|he|she|a|an|the|saman|buyers|customers|production|transit|delivery|price|prices|each|every|our)\b/i.test(segment) ||
    /^\s*[A-Z][\p{L}-]+\s/u.test(segment);
  const finiteVerb = /\b(?:is|are|was|were|has|have|had|will|would|can|could|should|must|does|do|ships|takes|depends|gives|provides|keeps|moves|means|makes|starts|stays|suits|handles|comes|runs|uses|allows|avoids|attracts|includes)\b/i.test(segment);
  const imperative = /^\s*(?:share|call|tell|confirm|choose|use|send|put|allow|add|ask|buy|contact|get)\b/i.test(segment);
  if (segmentWords.length > 8 && !conjunction && (finiteVerb || independentSubject || imperative)) return '. ';

  return ', ';
}

function normaliseDashes(value, heading) {
  const original = value;
  let output = value.replace(/(?<=\d)\s*\u2014\s*(?=\d)/g, ' to ');
  output = output.replace(/\s*\u2014\s*([^\u2014.!?]+?)\s*\u2014\s*/g, ', $1, ');
  while (output.includes('\u2014')) {
    const index = output.indexOf('\u2014');
    const before = output.slice(0, index).replace(/\s+$/, '');
    const after = output.slice(index + 1).replace(/^\s+/, '');
    const replacement = replacementForSingle(before, after, heading);
    output = `${before}${replacement}${replacement === '. ' ? capitalizeStart(after) : after}`;
  }
  return output === original ? output : output.replace(/\s+([,;:.!?])/g, '$1');
}

function isParserSentinel(node) {
  const parent = node.parent;
  if (!parent || !ts.isCallExpression(parent)) return false;
  const expression = parent.expression;
  if (ts.isPropertyAccessExpression(expression)) {
    return /^(?:split|join|includes|startsWith|endsWith|indexOf)$/.test(expression.name.text);
  }
  return ts.isIdentifier(expression) && /^(?:extractBetween)$/.test(expression.text);
}

function propertyName(node) {
  const parent = node.parent;
  if (!parent || (!ts.isPropertyAssignment(parent) && !ts.isPropertyDeclaration(parent))) return '';
  return parent.name?.getText().replace(/^['\"]|['\"]$/g, '').toLowerCase() || '';
}

function isHeading(node) {
  if (headingKeys.has(propertyName(node))) return true;
  let parent = node.parent;
  while (parent && (ts.isJsxExpression(parent) || ts.isJsxElement(parent))) {
    if (ts.isJsxElement(parent) && /^h[1-6]$/i.test(parent.openingElement.tagName.getText())) return true;
    parent = parent.parent;
  }
  return false;
}

function listFiles(directory) {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (absolute === lockedExport) continue;
    if (entry.isDirectory()) result.push(...listFiles(absolute));
    else if (extensions.has(path.extname(entry.name).toLowerCase())) result.push(absolute);
  }
  return result;
}

const changed = [];
for (const file of listFiles(sourceRoot)) {
  const before = fs.readFileSync(file, 'utf8');
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX
    : file.endsWith('.jsx') ? ts.ScriptKind.JSX
      : file.endsWith('.json') ? ts.ScriptKind.JSON
        : ts.ScriptKind.TS;
  const source = ts.createSourceFile(file, before, ts.ScriptTarget.Latest, true, kind);
  const edits = [];
  const visit = node => {
    const candidate = ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node) || ts.isJsxText(node);
    if (candidate && !isParserSentinel(node)) {
      let start = node.getStart(source);
      const end = node.end;
      const raw = before.slice(start, end);
      const after = normaliseDashes(repairMojibake(raw), isHeading(node));
      if (ts.isJsxText(node) && /^[,;:.!?]/.test(after)) {
        const leadingTrivia = before.slice(node.pos, start);
        if (/^[ \t]+$/.test(leadingTrivia)) start = node.pos;
      }
      if (after !== raw) edits.push({ start, end, after });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (!edits.length) continue;
  let after = before;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    after = `${after.slice(0, edit.start)}${edit.after}${after.slice(edit.end)}`;
  }
  fs.writeFileSync(file, after, 'utf8');
  changed.push(path.relative(root, file).replace(/\\/g, '/'));
}

process.stdout.write(`${JSON.stringify({ changedFileCount: changed.length, changed }, null, 2)}\n`);
