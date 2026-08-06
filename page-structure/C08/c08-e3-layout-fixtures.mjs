/**
 * Prove the Step C layout gates against fixtures that are KNOWN to fail, so a
 * green gate means something. A gate that has only ever seen passing input is
 * not evidence.
 */
import { splitTopLevelBlocks, imageSlots, injectInfoImages, infoImageHtml, isCopyBlock, imageCapacity }
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
const paraBlocks = (n) => Array.from({ length: n }, (_, i) => `<p>copy ${i}</p>`);

/* ---- adjacency: the rule the ticket names explicitly -------------------- */
// KNOWN-FAILING SHAPE: 4 images into 3 blocks. A naive even spread returns
// duplicate/consecutive slots and renders two images with nothing between them.
const tight = injectInfoImages(paras(3), [img(1), img(2), img(3), img(4)]);
check('4 images into 3 blocks: never emits two adjacent <img>',
  /<\/img>?\s*<img|\/><img/.test(tight), false);
check('4 images into 3 blocks: places fewer rather than bunching',
  (tight.match(/<img/g) || []).length, 2);

// KNOWN-FAILING SHAPE: enough blocks, but a spread that would trail the panel.
const trailing = injectInfoImages(paras(6), [img(1), img(2), img(3), img(4)]);
check('panel never ends on an image', /<img[^>]*>\s*$/.test(trailing), false);

/* ---- spacing maths ------------------------------------------------------ */
check('9 paragraphs / 4 images -> evenly spread', imageSlots(paraBlocks(9), 4), [1, 3, 5, 7]);
check('3 paragraphs / 4 images -> only the 2 legal slots', imageSlots(paraBlocks(3), 4), [0, 1]);
check('4 paragraphs / 4 images -> only the 3 legal slots', imageSlots(paraBlocks(4), 4), [0, 1, 2]);
check('no blocks -> no slots', imageSlots([], 4), []);
check('no images -> no slots', imageSlots(paraBlocks(9), 0), []);
const wide = imageSlots(paraBlocks(40), 4);
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


/* ---- E4 item 2: the HARD adjacency rule --------------------------------- */
// KNOWN-FAILING SHAPE, and the one that actually shipped: the approved copy
// already contains its own images. Page six carries four inside WordPress
// caption wrappers. A "has text" test calls such a block copy and places an
// injected image straight against it — one adjacent pair, no paragraph between.
const wpCaption = '<div class="wp-caption"><img src="/wp.webp" alt="x" /><p>caption</p></div>';
check('a WordPress caption block is NOT copy', isCopyBlock(wpCaption), false);
check('a plain paragraph IS copy', isCopyBlock('<p>real copy</p>'), true);
check('an empty paragraph is NOT copy', isCopyBlock('<p>  </p>'), false);
check('a bare image block is NOT copy', isCopyBlock('<img src="/a.webp" alt="" />'), false);

const mixed = ['<p>a</p>', wpCaption, '<p>b</p>', '<p>c</p>', '<p>d</p>'];
check('no slot touches either side of an existing image',
  imageSlots(mixed, 4), [2, 3]);
const injected = injectInfoImages(mixed.join(''), [img(1), img(2), img(3), img(4)]);
check('mixed copy: places only what the rule allows',
  (injected.match(/data-c08-info-image/g) || []).length, 2);
check('mixed copy: no injected image lands against the existing one',
  /wp\.webp[\s\S]{0,40}data-c08-info-image|data-c08-info-image[^>]*>\s*<div class="wp-caption"/.test(injected), false);

// Every injected image must have a paragraph immediately before AND after.
// Re-split the OUTPUT and walk it: an injected <img> is not a block tag, so it
// comes back as a block of its own, and both neighbours must be copy.
const around = (html) => {
  const blocks = splitTopLevelBlocks(html);
  return blocks.every((b, i) => {
    if (!/data-c08-info-image/.test(b)) return true;
    const before = blocks[i - 1];
    const after = blocks[i + 1];
    return before !== undefined && isCopyBlock(before)
      && after !== undefined && isCopyBlock(after);
  });
};
check('every injected image has copy immediately before and after (9 paras)',
  around(injectInfoImages(paras(9), [img(1), img(2), img(3), img(4)])), true);
check('every injected image has copy immediately before and after (mixed)',
  around(injected), true);
check('imageCapacity reports what the copy can legally hold',
  [imageCapacity(paraBlocks(3)), imageCapacity(paraBlocks(9)), imageCapacity(mixed)], [2, 8, 2]);


// E6: a copy block must be a PARAGRAPH. A heading is text, and the looser test
// let an image land between an FAQ question and its answer on page six.
check('a heading is NOT a copy block', isCopyBlock('<h3>Question?</h3>'), false);
check('an h2 is NOT a copy block', isCopyBlock('<h2>Section</h2>'), false);
const faq = ['<p>lead</p>', '<h3>Q?</h3>', '<p>A.</p>', '<p>more</p>', '<p>tail</p>'];
check('no slot splits a question from its answer', imageSlots(faq, 4), [2, 3]);

console.log(failures ? `${failures} FIXTURE(S) FAILED` : 'all fixtures pass');
process.exit(failures ? 1 : 0);
