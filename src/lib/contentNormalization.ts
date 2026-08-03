/**
 * L20 site-wide copy normalisation.
 *
 * WordPress export files are immutable. This module repairs their buyer-facing
 * strings at the static-content boundary so punctuation and encoding defects
 * cannot return when the export is refreshed.
 */

export type CopyContext = 'heading' | 'prose' | 'alt' | 'table' | 'review' | 'schema';

type NormaliseOptions = {
  context?: CopyContext;
  phase3?: boolean;
  phase3bSource?: string;
};

const CP1252_SPECIAL = new Map<number, number>([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
  [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
  [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
  [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
  [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f],
]);

const MOJIBAKE_MARKER = /\u00c3|\u00c2|\u00e2(?=\u20ac|\u201a|\u201d)|\ufffd/gu;
const URL_KEYS = new Set([
  'url', 'link', 'slug', 'href', 'src', 'source_url', 'canonical', 'guid', '@id',
  'contenturl', 'sameas', 'identifier', 'date', 'date_created', 'date_modified',
]);
const HEADING_KEYS = new Set([
  'title', 'name', 'headline', 'question', 'label', 'og_title', 'twitter_title',
]);
const ALT_KEYS = new Set(['alt', 'alt_text', 'caption', 'imagealt']);

function mojibakeScore(value: string): number {
  return value.match(MOJIBAKE_MARKER)?.length || 0;
}

function cp1252Byte(character: string): number | null {
  const codePoint = character.codePointAt(0)!;
  // C1 controls can survive a double decode (for example U+009D). Treat
  // them as their original bytes so the next pass can recover the character.
  if (codePoint <= 0xff) return codePoint;
  return CP1252_SPECIAL.get(codePoint) ?? null;
}

function decodeCandidate(value: string): string | null {
  const bytes: number[] = [];
  for (const character of value) {
    const byte = cp1252Byte(character);
    if (byte === null) return null;
    bytes.push(byte);
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bytes));
  } catch {
    return null;
  }
}

function repairMojibakePass(value: string): string {
  let output = '';
  let cursor = 0;
  while (cursor < value.length) {
    const character = value[cursor];
    if (character !== '\u00c3' && character !== '\u00c2' && character !== '\u00e2') {
      output += character;
      cursor += 1;
      continue;
    }

    let best: { length: number; decoded: string; improvement: number } | null = null;
    const maximum = Math.min(value.length - cursor, 18);
    for (let length = 2; length <= maximum; length += 1) {
      const candidate = value.slice(cursor, cursor + length);
      const decoded = decodeCandidate(candidate);
      if (decoded === null || decoded.includes('\ufffd')) continue;
      const improvement = mojibakeScore(candidate) - mojibakeScore(decoded);
      if (improvement <= 0) continue;
      if (!best || improvement > best.improvement || (improvement === best.improvement && length > best.length)) {
        best = { length, decoded, improvement };
      }
    }

    if (best) {
      output += best.decoded;
      cursor += best.length;
    } else {
      output += character;
      cursor += 1;
    }
  }
  return output;
}

export function repairMojibake(value: string): string {
  let repaired = String(value || '');
  for (let pass = 0; pass < 4 && mojibakeScore(repaired) > 0; pass += 1) {
    const next = repairMojibakePass(repaired);
    if (next === repaired) break;
    repaired = next;
  }
  return repaired.replace(/\u00c2(?=\s|\u00a0|₹|£|€)/g, '');
}

function caseAware(match: string, lowerReplacement: string): string {
  if (match === match.toUpperCase()) return lowerReplacement.toUpperCase();
  if (match[0] === match[0].toUpperCase()) {
    return `${lowerReplacement[0].toUpperCase()}${lowerReplacement.slice(1)}`;
  }
  return lowerReplacement;
}

function applyPhase3Swaps(value: string): string {
  let text = value;
  text = text.replace(/\butili[sz]e\b/gi, match => caseAware(match, 'use'));
  text = text.replace(/\bin order to\b/gi, match => caseAware(match, 'to'));
  text = text.replace(/\ba (?:myriad|plethora) of\b/gi, match => caseAware(match, 'many'));
  text = text.replace(/\bdelve into\b/gi, match => caseAware(match, 'examine'));
  text = text.replace(/\bcommence\b/gi, match => caseAware(match, 'start'));
  text = text.replace(/\bendeavour to\b/gi, match => caseAware(match, 'aim to'));
  text = text.replace(/\bfacilitate\b/gi, match => caseAware(match, 'help'));
  text = text.replace(/\bprior to\b/gi, match => caseAware(match, 'before'));
  text = text.replace(/\bin the event that\b/gi, match => caseAware(match, 'if'));
  text = text.replace(/\bwhen it comes to\b/gi, match => caseAware(match, 'for'));
  text = text.replace(
    /\bit is (?:important to note|worth noting) that\s+([a-z])/gi,
    (_, next: string) => next.toUpperCase(),
  );

  text = text.replace(/\bleverage(?:s|d|ing)?\b/gi, (match, offset, source) => {
    const before = String(source).slice(Math.max(0, offset - 28), offset);
    if (/\bfinancial\s*$/i.test(before) || /\b(?:a|the|is|as)\s*$/i.test(before)) return match;
    const lower = match.toLowerCase();
    const replacement = lower.endsWith('ing') ? 'using' : lower.endsWith('d') ? 'used' : lower.endsWith('s') ? 'uses' : 'use';
    return caseAware(match, replacement);
  });

  // Fable 5 ruling A2: preserve the noun needed by the following reference.
  text = text.replace(
    /\blook no further than porta cabins!\s*/gi,
    'A porta cabin answers all three needs at once. ',
  );
  text = text.replace(/(?:^|(?<=[.!?]\s))[^.!?]*\blook no further\b[^.!?]*[.!?](?:\s+|$)/gi, '');
  return text;
}

const APPROVED_HEADING_REPLACEMENTS = new Map<string, string>([
  ['Enjoyed this article?', 'More on this topic'],
  ['Still have questions?', 'Questions we are asked most'],
  ['Ready to Get Started?', 'Start your order'],
  ['Ready to Work With Us?', 'Work with SAMAN'],
  ['Looking to Buy Instead?', 'Buying instead of renting'],
  ['Looking to Buy Instead of Rent?', 'Buying instead of renting'],
  ['Why Choose Saman Portable?', 'Why buyers choose SAMAN'],
  ['Why Choose Saman Portable for Your Cabin Needs?', 'Why buyers choose SAMAN'],
]);

const APPROVED_PHRASE_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  [
    "In today's fast-paced world, the demand for versatile and efficient solutions for workspace management has never been greater.",
    'Demand for flexible workspace has risen sharply as projects move faster and sites change more often.',
  ],
  [
    "The ability to adapt quickly is a key advantage in today's fast-paced work environments.",
    'Being able to reconfigure a space in days rather than months is the practical advantage.',
  ],
  [
    'Luxury portable cabins have revolutionized the way businesses think about workspace solutions.',
    'Luxury portable cabins have changed what businesses expect from a temporary workspace.',
  ],
  [
    'The world of container homes is diverse, with various types available to suit different needs and preferences.',
    'Container homes come in several types, each suited to a different need and budget.',
  ],
  [
    'This can be particularly beneficial for buyers seeking a one-stop solution for their container home acquisition.',
    'This suits buyers who would rather deal with one supplier from drawing to delivery.',
  ],
  [
    'To find detailed pricing and designs tailored to your needs, visit our porta cabin product page.',
    'For current pricing and the size ladder, see our porta cabin product page.',
  ],
  [
    'Modular designs have revolutionized the commercial sector',
    'Modular designs have changed how commercial buildings are procured',
  ],
  [
    'The architecture of pre-engineered buildings in Bangalore is a testament to the limitless possibilities offered by this construction technique.',
    'Pre-engineered buildings in Bangalore show how far the technique now stretches in span, height and finish.',
  ],
  [
    '(PEBs) are a game-changer in construction, offering top-notch strength and flexibility.',
    '(PEBs) changed how large spans are built, combining high strength with design flexibility.',
  ],
  [
    'The Portacabin Office is a game-changer for businesses seeking flexibility.',
    'The Portacabin Office suits businesses that need to move or resize a workspace quickly.',
  ],
  [
    'Our guide dives into the world of portable cabin solutions.',
    'This guide covers portable cabin options, sizes and prices in Bangalore.',
  ],
  [
    'The world of portable cabins is changing fast.',
    'Portable cabin design and pricing are changing fast.',
  ],
  [
    'The world of portable solutions is growing fast.',
    'Demand for portable buildings is growing fast.',
  ],
  [
    'The world of garden storage has changed a lot in recent years.',
    'Garden storage has changed a lot in recent years.',
  ],
  [
    'not just a sales address, but a service-vehicle dispatch radius that holds the line on warranty SLAs.',
    'a service-vehicle dispatch radius that holds the line on warranty response times, not merely a sales address.',
  ],
  [
    'We aim to make products that are not just good but also make our users happy.',
    'We aim to make products that work well and that our customers are glad they bought.',
  ],
  [
    'It makes sure portable cabins are not just useful but also safe and healthy for people.',
    'It makes sure portable cabins are useful, and safe and healthy to occupy.',
  ],
  [
    'This makes them not just useful but also energy-saving.',
    'This makes them useful and energy-saving.',
  ],
  [
    'are not just a convenience but a necessity for successful outcomes at outdoor events.',
    'are a necessity at outdoor events, not merely a convenience.',
  ],
  [
    'are not just a convenience but a necessity for successful outdoor events.',
    'are a necessity at outdoor events, not merely a convenience.',
  ],
  [
    "Customization ensures container offices meet not just today's needs but tomorrow's challenges.",
    "Customisation lets a container office meet today's requirement and adapt to the next one.",
  ],
  [
    'ideal for homes, offices, and storage with seamless delivery options.',
    'ideal for homes, offices and storage, with delivery across RT Nagar.',
  ],
];

const APPROVED_SOURCE_BY_PHRASE = new Map<string, string>([
  [APPROVED_PHRASE_REPLACEMENTS[0][0], 'posts/18-benefits-of-luxury-portable-cabin.json'],
  [APPROVED_PHRASE_REPLACEMENTS[1][0], 'posts/18-benefits-of-luxury-portable-cabin.json'],
  [APPROVED_PHRASE_REPLACEMENTS[2][0], 'posts/18-benefits-of-luxury-portable-cabin.json'],
  [APPROVED_PHRASE_REPLACEMENTS[3][0], 'posts/container-house-price-in-tamil-nadu.json'],
  [APPROVED_PHRASE_REPLACEMENTS[4][0], 'posts/container-house-price-in-tamil-nadu.json'],
  [APPROVED_PHRASE_REPLACEMENTS[5][0], 'posts/container-houses-cost-guide-2024.json'],
  [APPROVED_PHRASE_REPLACEMENTS[6][0], 'posts/pre-engineered-buildings-in-bangalore.json'],
  [APPROVED_PHRASE_REPLACEMENTS[7][0], 'posts/pre-engineered-buildings-in-bangalore.json'],
  [APPROVED_PHRASE_REPLACEMENTS[8][0], 'products/pre-engineered-structures.json'],
  [APPROVED_PHRASE_REPLACEMENTS[9][0], 'products/portacabin-office.json'],
  [APPROVED_PHRASE_REPLACEMENTS[10][0], 'posts/portable-cabin-price-in-bangalore.json'],
  [APPROVED_PHRASE_REPLACEMENTS[11][0], 'posts/portable-cabins-in-kr-puram.json'],
  [APPROVED_PHRASE_REPLACEMENTS[12][0], 'posts/portable-cabins-in-peenya.json'],
  [APPROVED_PHRASE_REPLACEMENTS[13][0], 'posts/temporary-garden-shed.json'],
  [APPROVED_PHRASE_REPLACEMENTS[14][0], 'posts/porta-cabins-in-domlur.json'],
  [APPROVED_PHRASE_REPLACEMENTS[15][0], 'posts/portable-cabins-in-frazer-town.json'],
  [APPROVED_PHRASE_REPLACEMENTS[16][0], 'posts/portable-cabins-in-hennur.json'],
  [APPROVED_PHRASE_REPLACEMENTS[17][0], 'posts/portacabins-for-sale-in-frazer-town-2.json'],
  [APPROVED_PHRASE_REPLACEMENTS[18][0], 'posts/portable-toilets-in-bangalore.json'],
  [APPROVED_PHRASE_REPLACEMENTS[19][0], 'posts/portable-toilets-in-bangalore.json'],
  [APPROVED_PHRASE_REPLACEMENTS[20][0], 'posts/types-of-container-offices.json'],
  [APPROVED_PHRASE_REPLACEMENTS[21][0], 'posts/porta-cabins-in-rt-nagar.json'],
]);

const EMOJI_SEQUENCE = /(?:[\p{Regional_Indicator}]{2}|[#*0-9]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?)*)[ \t]?/gu;

function applyApprovedPhase3bSwaps(value: string, context: CopyContext, source = ''): string {
  // Fable 5 protected every review quotation and every image alt/title string.
  if (context === 'review' || context === 'alt') return value;

  let text = value;
  const normalizedSource = source.replace(/\\/g, '/');
  if (context === 'heading') {
    for (const [before, after] of APPROVED_HEADING_REPLACEMENTS) text = text.split(before).join(after);
  }
  for (const [before, after] of APPROVED_PHRASE_REPLACEMENTS) {
    const requiredSource = APPROVED_SOURCE_BY_PHRASE.get(before);
    if (!requiredSource || normalizedSource.endsWith(requiredSource)) text = text.split(before).join(after);
  }
  if (normalizedSource.endsWith('posts/18-benefits-of-luxury-portable-cabin.json')) {
    text = text.replace(
      /In today(?:'|’|&#0*8217;|&#x0*2019;)s fast-paced world, the demand for versatile and efficient solutions for workspace management has never been greater\./gi,
      'Demand for flexible workspace has risen sharply as projects move faster and sites change more often.',
    ).replace(
      /The ability to adapt quickly is a key advantage in today(?:'|’|&#0*8217;|&#x0*2019;)s fast-paced work environments\./gi,
      'Being able to reconfigure a space in days rather than months is the practical advantage.',
    );
  }
  if (normalizedSource.endsWith('posts/types-of-container-offices.json')) {
    text = text.replace(
      /Customization ensures container offices meet not just today(?:'|’|&#0*8217;|&#x0*2019;)s needs but tomorrow(?:'|’|&#0*8217;|&#x0*2019;)s challenges\./gi,
      "Customisation lets a container office meet today's requirement and adapt to the next one.",
    );
  }
  if (/posts\/container-houses-cost-guide-2024\.json$/i.test(normalizedSource)) {
    text = text.replace(/\brevolutionizing\b/gi, 'changing');
  }
  return text.replace(EMOJI_SEQUENCE, '');
}

function normaliseEmDashes(value: string, context: CopyContext): string {
  let text = value.replace(/(?<=\d)\s*\u2014\s*(?=\d)/g, ' to ');
  if (!text.includes('\u2014')) return text;

  const headingLike = context === 'heading' || (context === 'alt' && !/[.!?]/.test(text));
  if (headingLike) return text.replace(/\s*\u2014\s*/g, ': ');

  // Paired parenthetical dashes are always commas under L20 Rule B.
  text = text.replace(/\s*\u2014\s*([^\u2014.!?]+?)\s*\u2014\s*/g, ', $1, ');

  while (text.includes('\u2014')) {
    const index = text.indexOf('\u2014');
    const before = text.slice(0, index).replace(/\s+$/, '');
    const after = text.slice(index + 1).replace(/^\s+/, '');
    const segment = after.split(/[.!?]|<\/(?:p|li|td|th|div|section)>/i, 1)[0];
    const segmentWords = segment.match(/[\p{L}\p{N}₹]+(?:[’'./-][\p{L}\p{N}]+)*/gu) || [];
    const explanation =
      /(?:include|includes|included|offers|covers|means|are|is|was|were|as follows|you receive|available)\s*$/i.test(before) ||
      /^\s*(?:including|such as|namely|for example|from\b|the following\b)/i.test(segment);
    const conjunction = /^\s*(?:and|but|or|so|yet|which|who|that|while|because|if|when)\b/i.test(segment);
    const independentSubject = /^\s*(?:this|these|those|it|we|you|they|he|she|a|an|the|saman|buyers|customers|production|transit|delivery|price|prices|each|every|our)\b/i.test(segment) ||
      /^\s*[A-Z][\p{L}-]+\s/u.test(segment);
    const finiteVerb = /\b(?:is|are|was|were|has|have|had|will|would|can|could|should|must|does|do|ships|takes|depends|gives|provides|keeps|moves|means|makes|starts|stays|suits|handles|comes|runs|uses|allows|avoids|attracts|includes)\b/i.test(segment);
    const imperative = /^\s*(?:share|call|tell|confirm|choose|use|send|put|allow|add|ask|buy|contact|get)\b/i.test(segment);
    const cue = /(?:points?|range|cabins?|scale|homes?|units?|facilities|page|card|specification|price|scope|clearance|order|steel)\s*$/i.test(before);
    const list = (segment.match(/,/g) || []).length >= 2 && !finiteVerb;
    let replacement = ', ';
    if (explanation || cue || list || /^\s*[₹\d]/u.test(segment)) replacement = ': ';
    else if (segmentWords.length > 8 && !conjunction && (finiteVerb || independentSubject || imperative)) replacement = '. ';
    const adjustedAfter = replacement === '. '
      ? after.replace(/^(\s*(?:<[^>]+>\s*)*)([a-z])/, (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`)
      : after;
    text = `${before}${replacement}${adjustedAfter}`;
  }
  return text;
}

export function normaliseCopy(value: string, options: NormaliseOptions = {}): string {
  const context = options.context || 'prose';
  const phase3 = options.phase3 ?? (context !== 'table' && context !== 'review');
  let text = repairMojibake(String(value || '')).replace(
    /&(?:mdash|#0*8212|#x0*2014);/gi,
    '\u2014',
  );
  // Fable 5 ruling A1: the seven Rule G comparison placeholders must be
  // explicit for screen readers.
  if (context === 'table' && /^\s*\u2014\s*$/.test(text)) return 'Not covered';
  text = normaliseEmDashes(text, context);
  if (phase3) text = applyPhase3Swaps(text);
  text = applyApprovedPhase3bSwaps(text, context, options.phase3bSource);
  return text
    .replace(/[ \t]+([,;:.!?])/g, '$1')
    .replace(/([.!?])\s*,\s*/g, '$1 ');
}

function normaliseJsonLdValue(value: unknown, key = ''): unknown {
  if (typeof value === 'string') {
    const lowerKey = key.toLowerCase();
    if (URL_KEYS.has(lowerKey) || /^(?:https?:|tel:|mailto:|\/)/i.test(value)) return value;
    const review = /review|testimonial/i.test(lowerKey);
    const context: CopyContext = HEADING_KEYS.has(lowerKey) ? 'heading' : review ? 'review' : 'schema';
    return normaliseCopy(value, { context, phase3: !review });
  }
  if (Array.isArray(value)) return value.map(child => normaliseJsonLdValue(child, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([childKey, child]) => [childKey, normaliseJsonLdValue(child, childKey)]),
    );
  }
  return value;
}

function normaliseJsonLdScripts(html: string): string {
  return html.replace(
    /(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (full, open: string, json: string, close: string) => {
      try {
        return `${open}${JSON.stringify(normaliseJsonLdValue(JSON.parse(json)))}${close}`;
      } catch {
        return `${open}${normaliseCopy(json, { context: 'schema' })}${close}`;
      }
    },
  );
}

function tagName(token: string): string {
  return token.match(/^<\/?\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase() || '';
}

function tagClass(token: string): string {
  return token.match(/\bclass=["']([^"']*)["']/i)?.[1] || '';
}

function normaliseTagAttributes(token: string, options: NormaliseOptions = {}): string {
  const name = tagName(token);
  const metaKind = token.match(/\b(?:name|property)=["']([^"']*)["']/i)?.[1]?.toLowerCase() || '';
  return token.replace(
    /\b(alt|title|aria-label|content)=(["'])([\s\S]*?)\2/gi,
    (full, attribute: string, quote: string, rawValue: string) => {
      const lower = attribute.toLowerCase();
      if (lower === 'content' && name !== 'meta') return full;
      const context: CopyContext =
        lower === 'alt' ? 'alt'
          : lower === 'content' && /title/.test(metaKind) ? 'heading'
            : lower === 'content' ? 'prose'
              : name === 'img' ? 'alt'
                : 'heading';
      return `${attribute}=${quote}${normaliseCopy(rawValue, { context, phase3bSource: options.phase3bSource })}${quote}`;
    },
  );
}

export function normaliseHtml(html: string, options: NormaliseOptions = {}): string {
  if (!html) return html;
  const prepared = normaliseJsonLdScripts(repairMojibake(html));
  const stack: Array<{ name: string; className: string }> = [];
  let output = '';

  for (const match of prepared.matchAll(/<[^>]+>|[^<]+/g)) {
    const token = match[0];
    if (token.startsWith('<')) {
      const name = tagName(token);
      const closing = /^<\//.test(token);
      const selfClosing = /\/>$/.test(token) || /^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(name);
      if (closing) {
        const index = stack.map(entry => entry.name).lastIndexOf(name);
        if (index >= 0) stack.splice(index);
      }
      output += normaliseTagAttributes(token, options);
      if (!closing && !selfClosing) stack.push({ name, className: tagClass(token) });
      continue;
    }

    const names = stack.map(entry => entry.name);
    if (names.some(name => name === 'script' || name === 'style' || name === 'code' || name === 'pre')) {
      output += token;
      continue;
    }
    const classNames = stack.map(entry => entry.className).join(' ');
    const review = /\b(?:review|testimonial|customer-quote)\b/i.test(classNames) || names.includes('blockquote');
    const table = names.some(name => name === 'table' || name === 'td' || name === 'th');
    const heading = names.some(name => /^h[1-6]$/.test(name));
    const anchor = names.includes('a');
    const context: CopyContext = review ? 'review' : table ? 'table' : heading ? 'heading' : anchor ? 'alt' : (options.context || 'prose');
    output += normaliseCopy(token, {
      context,
      phase3: options.phase3 ?? (!review && !table),
      phase3bSource: options.phase3bSource,
    });
  }
  return output
    .replace(
      /\s+(<\/(?:a|strong|em|span|b|i)>(?:\s*<\/(?:a|strong|em|span|b|i)>)*)\s*([,;:.!?])/gi,
      '$1$2',
    )
    .replace(/(<(?:p|td)[^>]*>)\s*,\s*/gi, '$1');
}

function pathHasExemption(pathParts: string[]): boolean {
  return pathParts.some(part => /review|testimonial|specification|shipping|price|offer|certification/i.test(part));
}

function normaliseRecordValue(value: unknown, pathParts: string[]): unknown {
  if (typeof value === 'string') {
    const key = (pathParts[pathParts.length - 1] || '').toLowerCase();
    if (URL_KEYS.has(key) || /^(?:https?:|tel:|mailto:|\/\/)/i.test(value)) return value;
    const exempt = pathHasExemption(pathParts);
    if (/<[a-z][\s\S]*>/i.test(value)) {
      return normaliseHtml(value, { phase3: !exempt, context: exempt ? 'table' : 'prose' });
    }
    const context: CopyContext = HEADING_KEYS.has(key)
      ? 'heading'
      : ALT_KEYS.has(key)
        ? 'alt'
        : exempt
          ? 'review'
          : 'prose';
    return normaliseCopy(value, { context, phase3: !exempt });
  }
  if (Array.isArray(value)) return value.map((child, index) => normaliseRecordValue(child, [...pathParts, String(index)]));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, child]) => [key, normaliseRecordValue(child, [...pathParts, key])]),
    );
  }
  return value;
}

export function normaliseContentRecord<T>(value: T): T {
  return normaliseRecordValue(value, []) as T;
}

export function normaliseWpExportRecord<T>(value: T, sourceFile = ''): T {
  const source = sourceFile.replace(/\\/g, '/');
  if (!value || typeof value !== 'object') return value;

  // Non-export JSON files are small and may have bespoke render shapes, so the
  // generic walker is appropriate for them. Export records are much larger and
  // include archival API metadata that never reaches a page; only transform the
  // buyer-facing fields below.
  if (source.startsWith('../')) return normaliseRecordValue(value, [sourceFile]) as T;

  const record = value as Record<string, any>;
  const htmlField = (container: Record<string, any> | undefined, key: string, options: NormaliseOptions = {}) => {
    if (container && typeof container[key] === 'string') {
      container[key] = normaliseHtml(container[key], { ...options, phase3bSource: source });
    }
  };
  const copyField = (container: Record<string, any> | undefined, key: string, options: NormaliseOptions = {}) => {
    if (container && typeof container[key] === 'string') {
      container[key] = normaliseCopy(container[key], { ...options, phase3bSource: source });
    }
  };
  const normaliseSeoHead = () => htmlField(record._rank_math_head, 'head');

  if (/^(?:posts|redirected-posts)\//.test(source)) {
    htmlField(record.title, 'rendered', { context: 'heading' });
    htmlField(record.content, 'rendered');
    htmlField(record.excerpt, 'rendered');
    normaliseSeoHead();
    for (const author of record._embedded?.author || []) copyField(author, 'name', { context: 'heading' });
    for (const termGroup of record._embedded?.['wp:term'] || []) {
      for (const term of termGroup || []) copyField(term, 'name', { context: 'heading' });
    }
    for (const media of record._embedded?.['wp:featuredmedia'] || []) {
      copyField(media, 'alt_text', { context: 'alt' });
      htmlField(media.caption, 'rendered');
      htmlField(media.title, 'rendered', { context: 'heading' });
    }
    return value;
  }

  if (/^(?:products|redirected-products)\//.test(source)) {
    copyField(record, 'name', { context: 'heading' });
    htmlField(record, 'description');
    htmlField(record, 'short_description');
    htmlField(record, 'specificationsHtml', { context: 'table', phase3: false });
    htmlField(record, 'shippingHtml', { context: 'table', phase3: false });
    normaliseSeoHead();
    for (const image of record.images || []) {
      copyField(image, 'name', { context: 'heading' });
      copyField(image, 'alt', { context: 'alt' });
      copyField(image, 'caption', { context: 'alt' });
    }
    for (const category of record.categories || []) copyField(category, 'name', { context: 'heading' });
    for (const attribute of record.attributes || []) {
      copyField(attribute, 'name', { context: 'heading', phase3: false });
      if (Array.isArray(attribute.options)) {
        attribute.options = attribute.options.map((option: unknown) =>
          typeof option === 'string' ? normaliseCopy(option, { context: 'table', phase3: false }) : option,
        );
      }
    }
    if (record.faqSchema) record.faqSchema = normaliseJsonLdValue(record.faqSchema);
    for (const entry of record.meta_data || []) {
      if (entry?.key === 'rank_math_schema_FAQPage' && entry.value) {
        entry.value = normaliseJsonLdValue(entry.value);
      }
    }
    return value;
  }

  if (/^(?:categories|redirected-categories)\//.test(source)) {
    copyField(record, 'name', { context: 'heading' });
    htmlField(record, 'description');
    copyField(record.image, 'alt', { context: 'alt' });
    normaliseSeoHead();
    return value;
  }

  if (/^reviews\//.test(source) && Array.isArray(value)) {
    for (const review of value as Array<Record<string, any>>) {
      htmlField(review, 'review', { context: 'review', phase3: false });
    }
    return value;
  }

  // Homepage and manifest-sized one-off exports are safe to walk in full.
  return normaliseRecordValue(value, [sourceFile]) as T;
}
