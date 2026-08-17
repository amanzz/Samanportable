/**
 * C-08 E3 Step C — place the 16:9 Info images inside the Description panel.
 *
 * The rules the ticket sets are positional, not stylistic:
 *   · every Info image sits INSIDE the Info/Description panel;
 *   · they are spread THROUGH the body copy, not stacked at one end;
 *   · two images never sit adjacent with no copy between them;
 *   · all of them render ABOVE the specification block.
 *
 * The last rule needs no work here and cannot be broken by this function: the
 * Description tab panel is emitted before the Specifications panel in ProductTabs,
 * so anything injected into the description HTML is above the spec block in
 * document order. The first three are what this module enforces.
 *
 * Lazy-loading is likewise not decided here — OptimizedContent marks EVERY
 * content image `loading="lazy"`, which is stricter than "everything below the
 * first" and matches CLAUDE.md's rule that only the first hero is prioritised.
 */

export interface InfoImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional exact H2 text whose complete section this image follows. When
      absent, the established even-distribution algorithm remains unchanged. */
  afterSectionHeading?: string;
}

/**
 * Top-level block elements we are willing to insert between.
 *
 * BLOCK_RE is a REGEX LITERAL, deliberately, and must stay one. Written as
 * `new RegExp(\`<(${'${BLOCK_TAGS.join("|")}'})\\b[^>]*>\`, 'i')` the production
 * minifier constant-folds the template into a double-quoted string and emits
 * `"...\\\b..."`, where `\b` is no longer a word boundary but a literal
 * BACKSPACE (U+0008). The pattern then matches nothing, splitTopLevelBlocks
 * returns a single block, injectInfoImages bails on its `< 2` guard, and every
 * Info image silently vanishes in `next build` while working perfectly in
 * `next dev`. A literal cannot be folded, so it cannot be corrupted.
 *
 * Keep this list and the literal in sync by hand; the fixtures assert both.
 */
const BLOCK_TAGS = ['p', 'ul', 'ol', 'table', 'blockquote', 'figure', 'h2', 'h3', 'h4', 'div'];
const BLOCK_RE = /<(p|ul|ol|table|blockquote|figure|h2|h3|h4|div)\b[^>]*>/i;

/**
 * Split HTML into top-level blocks, tracking nesting so a closing tag inside a
 * block (a <p> within a <div>, a <td> within a <table>) never splits it.
 */
export function splitTopLevelBlocks(html: string): string[] {
  const blocks: string[] = [];
  let rest = html;
  while (rest.length) {
    const open = rest.match(BLOCK_RE);
    if (!open || open.index === undefined) {
      if (rest.trim()) blocks.push(rest);
      break;
    }
    if (open.index > 0) {
      const lead = rest.slice(0, open.index);
      if (lead.trim()) blocks.push(lead);
      rest = rest.slice(open.index);
      continue;
    }
    const tag = open[1].toLowerCase();
    // Plain concatenation, not a template literal: `tag` is a runtime value so
    // this one cannot be constant-folded today, but the escapes are kept in
    // single-quoted fragments so it stays immune if that ever changes.
    const scan = new RegExp('<' + tag + '\\b[^>]*>|</' + tag + '\\s*>', 'gi');
    scan.lastIndex = 0;
    let depth = 0;
    let end = -1;
    let m: RegExpExecArray | null;
    while ((m = scan.exec(rest)) !== null) {
      depth += m[0].startsWith('</') ? -1 : 1;
      if (depth === 0) {
        end = m.index + m[0].length;
        break;
      }
    }
    if (end === -1) {
      blocks.push(rest);
      break;
    }
    blocks.push(rest.slice(0, end));
    rest = rest.slice(end);
  }
  return blocks;
}

/**
 * Is this block a paragraph of COPY, as opposed to a picture?
 *
 * A block counts as copy only if it carries visible text AND contains no image.
 * The distinction matters because the approved description on some routes already
 * contains its own images — page six ships four inside a WordPress caption
 * wrapper (`<div class="wp-caption"><img>…<p>caption</p></div>`). Such a block
 * has text in it, so a naive "has text" test would call it copy and happily place
 * an injected image directly against it, producing exactly the adjacent pair the
 * E4 gate forbids.
 */
export function isCopyBlock(block: string): boolean {
  if (/<img\b/i.test(block)) return false;
  // A PARAGRAPH, not merely a block with words in it. A heading is text too, and
  // the looser test let an image land between an FAQ question and its answer on
  // page six — the image split the pair. Requiring <p> on both sides also keeps
  // an image from being wedged between a heading and the section it introduces.
  if (!/^\s*<p\b/i.test(block)) return false;
  const text = block.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim();
  return text.length > 0;
}

/**
 * Slots (block indices to insert AFTER) for `count` images across `blocks`.
 *
 * THE HARD RULE (E4 item 2): every injected image must have a full paragraph of
 * copy immediately before AND immediately after it. A slot `i` is therefore legal
 * only when `blocks[i]` and `blocks[i + 1]` are both copy blocks. That single
 * condition delivers all of it:
 *   · copy immediately before  — blocks[i];
 *   · copy immediately after   — blocks[i + 1];
 *   · never two images adjacent — between images at slots i < j lies at least
 *     blocks[i + 1], which is copy by the same condition;
 *   · never against an image already in the approved copy — those blocks are not
 *     copy blocks, so neither side of one is ever a legal slot;
 *   · never trailing the panel  — slot i requires blocks[i + 1] to exist.
 *
 * Returns FEWER slots than requested when the copy cannot hold them. Spacing wins
 * over count, always: a route short of paragraphs renders fewer images and the
 * shortfall is reported rather than hidden by bunching images together.
 */
export function imageSlots(blocks: string[], count: number): number[] {
  if (count <= 0 || !blocks.length) return [];
  const copy = blocks.map(isCopyBlock);
  const legal: number[] = [];
  for (let i = 0; i < blocks.length - 1; i += 1) {
    if (copy[i] && copy[i + 1]) legal.push(i);
  }
  if (!legal.length) return [];
  if (count >= legal.length) return legal;

  // Spread the chosen slots evenly through the legal ones. Midpoint sampling
  // (j + 0.5) divides the legal range into `count` equal bands and takes the
  // centre of each, which spaces the images evenly and leaves balanced copy at
  // both ends. Rounding the band EDGES instead bunches them toward the start.
  const chosen: number[] = [];
  let previous = -1;
  for (let j = 0; j < count; j += 1) {
    let pick = Math.floor(((j + 0.5) * legal.length) / count);
    pick = Math.max(pick, previous + 1);
    pick = Math.min(pick, legal.length - 1);
    if (pick <= previous) break;
    chosen.push(legal[pick]);
    previous = pick;
  }
  return chosen;
}

/** How many images a panel's blocks can legally hold under the adjacency rule. */
export function imageCapacity(blocks: string[]): number {
  return imageSlots(blocks, Number.MAX_SAFE_INTEGER).length;
}

const escapeAttr = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * An `alt` attribute is ALWAYS emitted, even when the manifest has not supplied
 * the text yet: OptimizedContent substitutes the literal "Image" for an <img>
 * carrying no alt attribute at all, which would put invented alt text on the
 * page. An explicit empty alt is preserved verbatim.
 */
export function infoImageHtml(image: InfoImage): string {
  return (
    `<img src="${escapeAttr(image.src)}" alt="${escapeAttr(image.alt || '')}"` +
    ` width="${image.width}" height="${image.height}"` +
    ` data-c08-info-image="true" />`
  );
}

/** Inject the Info images into the description HTML at the chosen slots. */
export function injectInfoImages(html: string, images: InfoImage[] | undefined): string {
  if (!html || !images || !images.length) return html;
  // Approved copy may place its own Info images at author-marked slots (C-08
  // pages 1 and 2). When it does, automatic placement must stand down or the
  // page renders two sets — the author's four plus four more.
  if (/data-c08-info-image|<img[^>]+\/info\//i.test(html)) return html;
  const blocks = splitTopLevelBlocks(html);
  if (blocks.length < 2) return html;

  // LC-05 (16 Aug 2026) - explicit, data-owned section placement. This path is
  // opt-in per image; existing datasets omit `afterSectionHeading` and continue
  // through the original evenly-spaced placement below byte-for-byte.
  if (images.some((image) => image.afterSectionHeading)) {
    const insertBefore = new Map<number, string>();
    const append: string[] = [];
    for (const image of images) {
      if (!image.afterSectionHeading) continue;
      const headingIndex = blocks.findIndex((block) => {
        if (!/^\s*<h2\b/i.test(block)) return false;
        const text = block.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
        return text === image.afterSectionHeading;
      });
      if (headingIndex < 0) {
        throw new Error(`Info image section heading not found: ${image.afterSectionHeading}`);
      }
      const nextHeadingIndex = blocks.findIndex((block, index) => index > headingIndex && /^\s*<h2\b/i.test(block));
      const imageHtml = infoImageHtml(image);
      if (nextHeadingIndex < 0) append.push(imageHtml);
      else insertBefore.set(nextHeadingIndex, (insertBefore.get(nextHeadingIndex) || '') + imageHtml);
    }
    return blocks.map((block, index) => (insertBefore.get(index) || '') + block).join('') + append.join('');
  }

  const slots = imageSlots(blocks, images.length);
  if (!slots.length) return html;

  const bySlot = new Map<number, string>();
  slots.forEach((slot, i) => bySlot.set(slot, infoImageHtml(images[i])));

  return blocks
    .map((block, i) => (bySlot.has(i) ? block + bySlot.get(i) : block))
    .join('');
}
