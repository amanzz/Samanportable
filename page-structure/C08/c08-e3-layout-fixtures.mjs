/**
 * Prove the Step C layout gates against fixtures that are KNOWN to fail, so a
 * green gate means something. A gate that has only ever seen passing input is
 * not evidence.
 */
import { splitTopLevelBlocks, imageSlots, injectInfoImages, infoImageHtml }
  from './infoImageLayout.mjs';
import { readFileSync } from 'node:fs';

let failures = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) console.log(`        expected ${JSON.stringify(expected)}\n        actual   ${JSON.stringify(actual)}`);
};

const img = (n) => ({ src: `/i/${n}.webp`, alt: '', width: 1200, height: 675 });
const paras = (n) => Array.from({ length: n }, (_, i) => `<p>copy ${i}</p>`).join('');

/* ---- adjacency: the rule the ticket names explicitly -------------------- */
// KNOWN-FAILING SHAPE: 4 images into 3 blocks. A naive even spread returns
// duplicate/consecutive slots and renders two images with nothing between them.
const tight = injectInfoImages(paras(3), [img(1), img(2), img(3), img(4)]);
check('4 images into 3 blocks: never emits two adjacent <img>',
  /<\/img>?\s*<img|\/><img/.test(tight), false);
check('4 images into 3 blocks: places fewer rather than bunching',
  (tight.match(/<img/g) || []).length, 1);

// KNOWN-FAILING SHAPE: enough blocks, but a spread that would trail the panel.
const trailing = injectInfoImages(paras(6), [img(1), img(2), img(3), img(4)]);
check('panel never ends on an image', /<img[^>]*>\s*$/.test(trailing), false);

/* ---- spacing maths ------------------------------------------------------ */
check('9 blocks / 4 images -> evenly spread, gaps >= 1', imageSlots(9, 4), [2, 4, 5, 7]);
check('3 blocks / 4 images -> only 1 fits', imageSlots(3, 4), [1]);
check('4 blocks / 4 images -> only 2 fit', imageSlots(4, 4), [1, 2]);
check('no blocks -> no slots', imageSlots(0, 4), []);
check('no images -> no slots', imageSlots(9, 0), []);
const wide = imageSlots(40, 4);
check('40 blocks / 4 images -> strictly increasing',
  wide.every((s, i) => i === 0 || s > wide[i - 1]), true);

/* ---- alt: the trap in OptimizedContent ---------------------------------- */
// KNOWN-FAILING SHAPE: an <img> with NO alt attribute. OptimizedContent
// substitutes the literal "Image", which would put invented alt text on a page
// whose manifest has not arrived. An explicit empty alt must always be emitted.
check('emits an explicit empty alt, never a missing one',
  /\balt=""/.test(infoImageHtml(img(1))), true);
check('carries intrinsic dimensions for CLS',
  /width="1200" height="675"/.test(infoImageHtml(img(1))), true);
check('escapes a hostile alt string',
  infoImageHtml({ ...img(1), alt: 'a "b" <c>' }).includes('alt="a &quot;b&quot; &lt;c&gt;"'), true);

/* ---- block splitting ---------------------------------------------------- */
// KNOWN-FAILING SHAPE: a nested block. Splitting on the first </div> would cut
// through the wrapper and produce unbalanced HTML (the hydration bug
// OptimizedContent documents).
check('nested block stays one block',
  splitTopLevelBlocks('<div><p>a</p><p>b</p></div><p>c</p>').length, 2);
check('table is not split by its rows',
  splitTopLevelBlocks('<table><tr><td>a</td></tr></table><p>b</p>').length, 2);
check('injection into a single block is a no-op',
  injectInfoImages('<p>only</p>', [img(1)]), '<p>only</p>');
check('no images is a byte-identical no-op',
  injectInfoImages(paras(9), undefined), paras(9));

/* ---- the escape-folding trap ------------------------------------------- */
// KNOWN-FAILING SHAPE: the block regex written as a template literal is
// constant-folded by the production minifier into a double-quoted string where
//  stops being a word boundary and becomes a literal BACKSPACE (U+0008). The
// pattern then matches nothing, every page collapses to a single block, and the
// Info images vanish in `next build` while `next dev` stays perfect.
const SRC = readFileSync('C:/tmp/saman-c08-e2-20260805/src/lib/infoImageLayout.ts', 'utf8');
check('block regex is a literal, never built from a template string',
  /const BLOCK_RE = \/</.test(SRC), true);
check('block regex still matches a plain tag (word boundary intact)',
  splitTopLevelBlocks('<p>a</p><p>b</p>').length, 2);
// The gate that actually catches it: run the MINIFIED module, because that is
// the only build where the bug appears. An unminified unit test passes happily
// while production silently drops every image.
const { execSync } = await import('node:child_process');
execSync('npx --yes esbuild C:/tmp/saman-c08-e2-20260805/src/lib/infoImageLayout.ts'
  + ' --minify --format=esm --outfile=infoImageLayout.min.mjs --log-level=warning',
  { stdio: 'ignore' });
const min = await import('./infoImageLayout.min.mjs');
check('MINIFIED module still splits blocks (the production-only failure)',
  min.splitTopLevelBlocks('<p>a</p><p>b</p>').length, 2);
check('MINIFIED module still injects all four images',
  (min.injectInfoImages(paras(9), [img(1), img(2), img(3), img(4)]).match(/data-c08-info-image/g) || []).length, 4);

console.log(failures ? `${failures} FIXTURE(S) FAILED` : 'all fixtures pass');
process.exit(failures ? 1 : 0);
