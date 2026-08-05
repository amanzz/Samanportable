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
}

/** Top-level block elements we are willing to insert between. */
const BLOCK_TAGS = ['p', 'ul', 'ol', 'table', 'blockquote', 'figure', 'h2', 'h3', 'h4', 'div'];
const BLOCK_RE = new RegExp(`<(${BLOCK_TAGS.join('|')})\\b[^>]*>`, 'i');

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
    const scan = new RegExp(`<${tag}\\b[^>]*>|</${tag}\\s*>`, 'gi');
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
 * Slots (block indices to insert AFTER) for `count` images across `blockCount`
 * blocks, spread evenly.
 *
 * Two constraints, both structural:
 *   · consecutive slots differ by at least 1, so at least one block of copy
 *     always sits between two images — images are never adjacent;
 *   · the last usable slot is blockCount - 2, so copy always follows the final
 *     image and the panel never ends on a picture.
 *
 * Returns FEWER slots than requested when the copy cannot hold them all rather
 * than bunching images up. Spacing wins over count: a route whose body copy is
 * too short to space its images reports a shortfall instead of breaking the
 * adjacency rule.
 */
export function imageSlots(blockCount: number, count: number): number[] {
  if (count <= 0 || blockCount <= 0) return [];
  const lastUsable = blockCount - 2;
  const slots: number[] = [];
  let previous = -1;
  for (let i = 0; i < count; i += 1) {
    let slot = Math.round(((i + 1) * blockCount) / (count + 1));
    slot = Math.max(slot, previous + 1);
    slot = Math.min(slot, lastUsable);
    if (slot <= previous || slot < 0) return slots;
    slots.push(slot);
    previous = slot;
  }
  return slots;
}

/** Blocks of copy a panel needs before `count` images can be spaced through it. */
export function blocksRequiredFor(count: number): number {
  return count <= 0 ? 0 : count + 2;
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
  const blocks = splitTopLevelBlocks(html);
  if (blocks.length < 2) return html;
  const slots = imageSlots(blocks.length, images.length);
  if (!slots.length) return html;

  const bySlot = new Map<number, string>();
  slots.forEach((slot, i) => bySlot.set(slot, infoImageHtml(images[i])));

  return blocks
    .map((block, i) => (bySlot.has(i) ? block + bySlot.get(i) : block))
    .join('');
}
