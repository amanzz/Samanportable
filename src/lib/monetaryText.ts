const MONETARY_TEXT_PATTERN = /(?:₹|Rs\.?\s*)\s*\d[\d,]*(?:\.\d+)?(?:\s*[–-]\s*(?:₹|Rs\.?\s*)?\s*\d[\d,]*(?:\.\d+)?)?\s*(?:lakh|crore|L)?/i;

export function hasMonetaryText(value: string): boolean {
  return MONETARY_TEXT_PATTERN.test(value);
}

function sentenceRanges(value: string): Array<[number, number]> {
  const Segmenter = (Intl as typeof Intl & {
    Segmenter?: new (locale: string, options: { granularity: 'sentence' }) => {
      segment(input: string): Iterable<{ index: number; segment: string }>;
    };
  }).Segmenter;

  if (Segmenter) {
    return Array.from(new Segmenter('en', { granularity: 'sentence' }).segment(value))
      .filter(({ segment }) => hasMonetaryText(segment))
      .map(({ index, segment }) => [index, index + segment.length]);
  }

  const ranges: Array<[number, number]> = [];
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const decimalPoint = char === '.' && /\d/.test(value[index - 1] || '') && /\d/.test(value[index + 1] || '');
    if (!decimalPoint && /[.!?]/.test(char) && (index + 1 === value.length || /\s/.test(value[index + 1]))) {
      const end = index + 1;
      if (hasMonetaryText(value.slice(start, end))) ranges.push([start, end]);
      start = end;
    }
  }
  if (start < value.length && hasMonetaryText(value.slice(start))) ranges.push([start, value.length]);
  return ranges;
}

export function removeMonetarySentences(value: string): string {
  const ranges = sentenceRanges(value);
  if (!ranges.length) return value;
  let output = '';
  let cursor = 0;
  for (const [start, end] of ranges) {
    output += value.slice(cursor, start);
    cursor = end;
  }
  output += value.slice(cursor);
  return output.replace(/\s{2,}/g, ' ').trim();
}

export function removeMonetarySentencesDeep<T>(value: T): T {
  if (typeof value === 'string') return removeMonetarySentences(value) as T;
  if (Array.isArray(value)) return value.map((item) => removeMonetarySentencesDeep(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([key, item]) => [key, removeMonetarySentencesDeep(item)])
    ) as T;
  }
  return value;
}

function removeRanges(value: string, ranges: Array<[number, number]>): string {
  if (!ranges.length) return value;
  let output = '';
  let cursor = 0;
  for (const [start, end] of ranges) {
    output += value.slice(cursor, start);
    cursor = end;
  }
  return output + value.slice(cursor);
}

function removeMonetarySentencesFromHtmlFragment(fragment: string): string {
  const tokens = fragment.split(/(<[^>]+>)/g);
  const textTokens: Array<{ tokenIndex: number; start: number; end: number }> = [];
  let plain = '';
  tokens.forEach((token, tokenIndex) => {
    if (token.startsWith('<')) return;
    const start = plain.length;
    plain += token;
    textTokens.push({ tokenIndex, start, end: plain.length });
  });

  const ranges = sentenceRanges(plain);
  if (!ranges.length) return fragment;
  for (const token of textTokens) {
    const localRanges = ranges
      .map(([start, end]) => [Math.max(start, token.start), Math.min(end, token.end)] as [number, number])
      .filter(([start, end]) => start < end)
      .map(([start, end]) => [start - token.start, end - token.start] as [number, number]);
    tokens[token.tokenIndex] = removeRanges(tokens[token.tokenIndex], localRanges);
  }

  let output = tokens.join('');
  let previous: string;
  do {
    previous = output;
    output = output.replace(/<(a|strong|em|span|b|i)\b[^>]*>\s*<\/\1>/gi, '');
  } while (output !== previous);
  return output.replace(/\s{2,}/g, ' ').trim();
}

function removeMonetaryHeadingSections(html: string): string {
  const headingPattern = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi;
  const headings: Array<{ level: number; start: number; inner: string }> = [];
  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(html))) {
    headings.push({ level: Number(match[1][1]), start: match.index, inner: match[2] });
  }
  const cuts: Array<[number, number]> = [];
  headings.forEach((heading, index) => {
    if (!hasMonetaryText(heading.inner.replace(/<[^>]+>/g, ' '))) return;
    const next = headings.slice(index + 1).find((candidate) => candidate.level <= heading.level);
    cuts.push([heading.start, next?.start ?? html.length]);
  });
  let output = html;
  for (const [start, end] of cuts.sort((a, b) => b[0] - a[0])) {
    output = output.slice(0, start) + output.slice(end);
  }
  return output;
}

export function removeMonetaryHtml(html: string): string {
  if (!html || !hasMonetaryText(html)) return html;
  let output = removeMonetaryHeadingSections(html);
  output = output.replace(/<table\b[^>]*>[\s\S]*?<\/table>/gi, (table) => (
    hasMonetaryText(table) ? '' : table
  ));
  output = output.replace(/<(p|li|figcaption|caption)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
    (whole, tag: string, attributes: string, inner: string) => {
      if (!hasMonetaryText(inner)) return whole;
      const cleaned = removeMonetarySentencesFromHtmlFragment(inner);
      return cleaned.replace(/<[^>]+>/g, '').trim()
        ? `<${tag}${attributes}>${cleaned}</${tag}>`
        : '';
    });
  output = removeMonetarySentencesFromHtmlFragment(output)
    .replace(/<h([1-6])\b[^>]*>\s*<\/h\1>/gi, '')
    .replace(/(?:\r?\n|\s){3,}/g, '\n\n')
    .trim();
  return output;
}
