// Static content layer — reads the exported WordPress content from
// src/data/wp-export/ instead of calling the WordPress/WooCommerce API.
//
// SERVER-SIDE ONLY (uses fs). Pages must load this via `await import()` inside
// getServerSideProps/getStaticProps; API routes may import it normally.
//
// Every function mirrors the signature AND return shape of its src/config/api.ts
// counterpart so call sites swap with a one-line change and render identically.
// Content is returned AS-IS from the exported files — no rewriting, no cleanup.
//
// The ONLY WordPress connection left in the system is the scheduled reviews pull
// (scripts/pull-approved-reviews.mjs), which refreshes the files this layer reads.
import fs from 'fs';
import path from 'path';
import {
  parseRankMathHeadHtml,
  type LightweightProduct,
  type WooCommerceProduct,
  type ProductReview,
  type ProductFilters,
  type PaginationInfo,
  type ProductsResponse,
  type RankMathSEOData,
  type ProductCategoryDetail,
  type BlogPost,
} from '@/config/api';
import { decodeHtmlEntities } from '@/lib/utils';
import { PORTA_CABIN_REDIRECTED_SLUGS } from '@/lib/portaCabinClusterRail';
import { PORTABLE_OFFICE_REDIRECTED_SLUGS } from '@/lib/portableOfficeCluster';
import { removeMonetaryHtml, removeMonetarySentencesDeep } from '@/lib/monetaryText';
import {
  normalizeVerifiedCommercialFacts,
  normalizeVerifiedCommercialFactsDeep,
} from '@/lib/verifiedCommercialFacts';
import commercialArchitecture from '@/data/seo/commercialArchitecture.json';
import { getCanonicalProductPath } from '@/lib/productCanonicalPaths';
import { isTemporarilyGatedCommercialProduct } from '@/lib/unapprovedCommercialGating';

const EXPORT_DIR = path.join(process.cwd(), 'src', 'data', 'wp-export');

// C01 (Fable 5 ruling, 24 Jul 2026): product slugs that now 301-redirect and must never
// appear as a card/link in any buyer-facing listing (global /product, category related
// rails, api/products, dynamic sitemap). Mirrors the sitemap/feed "exclude redirect
// sources" rule at the listing chokepoint. The Merchant feed excludes them separately via
// getRedirectSourceSet() so its catalogue path stays governed by the redirect map, not this
// hand-list. Retired product PAGES still resolve (they 301 at the route level before render).
const RETIRED_LISTING_SLUGS = new Set<string>([
  ...PORTA_CABIN_REDIRECTED_SLUGS,
  ...PORTABLE_OFFICE_REDIRECTED_SLUGS,
  'prefabricated-site-office',
  'modular-shipping-container-office',
  'portable-container-offices',
  'prefabricated-container-office',
  'construction-site-office',
  'container-site-office',
  'cargo-container-office',
  'storage-container-office',
  'modular-container-office',
  'container-portable-office',
  'mobile-container-office',
  'mobile-office-container',
  'cargo-container-house',
  'storage-container-house',
  'tiny-container-homes',
  'shipping-container-tiny-house',
  'inexpensive-container-homes',
  'modern-container-home',
  'prebuilt-container-homes',
  'prefabricated-container-home',
  // C06 labour-colony Event A: archived records remain available for audit only.
  // They must never re-enter buyer listings, related rails, Merchant, or local
  // inventory through getAllListingProductsRaw().
  'labor-accommodations',
  'labor-camps',
  'labor-cottages',
  'labor-shelters',
  'prefab-labor-hutments',
  'prefab-labor-sheds',
]);

// Slugs are lowercase-hyphenated; reject anything else so a crafted URL can
// never read outside the export folders.
const SAFE_SLUG = /^[a-z0-9-]+$/;

function readJson(file: string): any | null {
  try {
    return trimImageAltWhitespaceDeep(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } catch {
    return null;
  }
}

// C06 internal-link hygiene. The four winner records are byte-locked for this
// event, so approved hrefs are corrected at the static content boundary without
// changing any visible text, L3 field, schema payload, or winner source byte.
const RETIRED_INTERNAL_LINKS = new Map<string, string>([
  ['/product/portable-cabin', '/product/porta-cabins'],
  ['/product/porta-cabins/portacabin-office', '/product/porta-cabins'],
  ['/product/porta-cabins/luxury-porta-cabin', '/product/porta-cabins'],
  ['/product/porta-cabins/steel-porta-cabin', '/product/porta-cabins/ms-porta-cabin'],
  ['/product/container-cafe/shipping-container-cafe', '/product/container-cafe'],
  ['/product/porta-cabins/low-cost-porta-cabin', '/product/porta-cabins'],
  ['/product/porta-cabins/mini-porta-cabin', '/product/porta-cabins'],
  ['/product/portable-cabin/office-portable-cabin', '/product/porta-cabins'],
  ['/product/portable-cabin/portable-cabin-with-toilet', '/product/porta-cabins/porta-cabin-with-toilet'],
  ['/product/portable-cabin/buy-portable-cabin', '/product/porta-cabins'],
  ['/product/prefabricated-houses/portable-cabin-house', '/product/prefabricated-houses/porta-cabin-house'],
  ['/portable-cabins-in-bellandur', '/product/porta-cabins'],
  ['/product/portable-cabin/modular-portable-cabin', '/product/porta-cabins'],
  ['/product/portable-cabin/portable-cabin-building', '/product/porta-cabins'],
  ['/product/portable-cabin/ms-portable-cabin', '/product/porta-cabins/ms-porta-cabin'],
  ['/product/portable-cabin/small-portable-cabin', '/product/porta-cabins'],
  ['/cheap-porta-cabins-for-sale', '/product/porta-cabins'],
  ['/product/labor-colony/prefab-labor-sheds', '/product/labor-colony/labor-sheds'],
  ['/product/labor-colony/prefab-labor-hutments', '/product/labor-colony/labor-hutments'],
  ['/product/labor-colony/labor-camps', '/product/labor-colony/prefab-labor-camps'],
  ['/product/labor-colony/labor-accommodations', '/product/labor-colony'],
  ['/product/labor-colony/labor-cottages', '/product/labor-colony'],
  ['/product/labor-colony/labor-shelters', '/product/labor-colony'],
  ['/product/labor-colony/prefab-labour-colony', '/product/labor-colony'],
  ['/product-category/labor-colony', '/product/labor-colony'],
  ['/product/container-offices/modular-shipping-container-office', '/product/container-offices/shipping-container-office'],
  ['/product/container-offices/portable-container-offices', '/product/container-offices'],
  ['/product/container-offices/prefabricated-container-office', '/product/container-offices/container-office-cabin'],
  ['/product/container-offices/construction-site-office', '/product/container-offices/site-office-container'],
  ['/product/container-offices/container-site-office', '/product/container-offices/site-office-container'],
  ['/container-offices-for-sale-in-jayanagar', '/product-category/container-offices'],
  ['/container-offices-for-sale-in-hoskote', '/product-category/container-offices'],
  ['/container-offices-for-sale-in-hosur', '/product-category/container-offices'],
  ['/container-offices-for-sale-in-jp-nagar', '/product-category/container-offices'],
  ['/container-offices-for-sale-in-bommasandra', '/product-category/container-offices'],
  ['/container-offices-for-sale-in-vijayanagar', '/product-category/container-offices'],
  ['/20ft-container-office', '/product/container-offices/shipping-container-office'],
  ['/10-foot-shipping-container-office-perfect-fit-for-small-spaces', '/product/container-offices/shipping-container-office'],
  ['/12ft-office-container-smart-choice-for-growing-startups', '/product/container-offices'],
  ['/affordable-office-containers-for-sale', '/product/container-offices'],
  ['/why-you-need-to-consider-a-container-office', '/product/container-offices'],
  ['/container-office-rental-is-perfect-solution', '/rental-services'],
  ['/product/container-houses/prebuilt-container-homes', '/product/container-houses/prefab-container-homes'],
  ['/product/container-houses/cargo-container-house', '/product/container-houses/shipping-container-homes'],
  ['/product/container-houses/storage-container-house', '/product/container-houses/shipping-container-homes'],
  ['/product/container-houses/tiny-container-homes', '/product/container-houses/shipping-container-homes'],
  ['/product/container-houses/shipping-container-tiny-house', '/product/container-houses/shipping-container-homes'],
  ['/product/container-houses/inexpensive-container-homes', '/product/container-houses/affordable-container-homes'],
  ['/product/container-houses/modern-container-home', '/product/container-houses'],
  ['/product/container-houses/prefabricated-container-home', '/product/container-houses'],
  ['/container-houses-cost-guide-2024', '/product/container-houses'],
  ['/prefab-container-homes', '/product/container-houses/prefab-container-homes'],
  ['/shipping-container-home', '/product/container-houses/shipping-container-homes'],
  ['/used-container-price', '/ship-container-price-in-india'],
  ['/used-shipping-container-price-in-india', '/ship-container-price-in-india'],
]);

const PC01_HUB_PATH = '/product/porta-cabins';
const PC01_GUIDE_PATH = '/porta-cabin-price-a-complete-guide-2025';
const PC01_GUIDE_SLUG = 'porta-cabin-price-a-complete-guide-2025';
const PC01_MS_CHILD_PATH = '/product/porta-cabins/ms-porta-cabin';

function pc01AnchorText(innerHtml: string): string {
  return innerHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function pc01InternalPath(href: string): string {
  return href
    .replace(/^https?:\/\/(?:www\.)?samanportable\.com/i, '')
    .split(/[?#]/, 1)[0]
    .replace(/\/+$/, '') || '/';
}

function replaceAnchorHref(attributes: string, href: string): string {
  return attributes.replace(
    /\bhref=(['"])(.*?)\1/i,
    (_whole, quote: string) => `href=${quote}${href}${quote}`
  );
}

/**
 * PC01-REL-04: normalize only link ownership while preserving all visible source copy.
 * The retained guide owns information intent; PC-01 owns broad commercial intent; and
 * the MS child keeps only anchors that explicitly say MS or mild steel.
 */
export function rewritePc01KeywordOwnershipLinks(html: string, contextSlug = ''): string {
  if (!html || !html.includes('href=')) return html;
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (whole, attributes: string, innerHtml: string) => {
    const hrefMatch = attributes.match(/\bhref=(['"])(.*?)\1/i);
    if (!hrefMatch) return whole;
    const target = pc01InternalPath(hrefMatch[2]);
    const anchor = pc01AnchorText(innerHtml);

    // The maintained related-product module supplies the guide's one purposeful
    // commercial-selection link. Existing body words remain, but their six duplicate
    // links are unwrapped.
    if (contextSlug === PC01_GUIDE_SLUG && target === PC01_HUB_PATH) return innerHtml;

    const informationalGuideAnchor = /\b(?:guide|how\b[^\n]{0,50}\bpricing\b|pricing\s+(?:works|breakdown|logic)|cost(?:-per-[a-z-]+|\s+per\s+[a-z]+)?\s+(?:factors?|benchmark|breakdown)|understand\b[^\n]{0,50}\bpricing\b)\b/i.test(anchor);
    if (target === PC01_GUIDE_PATH && !informationalGuideAnchor) {
      return `<a${replaceAnchorHref(attributes, PC01_HUB_PATH)}>${innerHtml}</a>`;
    }

    if (target === '/product/portable-office' && /^(?:porta|portable)\s+cabins?\s+range$/i.test(anchor)) {
      return `<a${replaceAnchorHref(attributes, PC01_HUB_PATH)}>${innerHtml}</a>`;
    }

    if (target === PC01_MS_CHILD_PATH && !/\bms\b|mild[- ]steel/i.test(anchor)) {
      return `<a${replaceAnchorHref(attributes, PC01_HUB_PATH)}>${innerHtml}</a>`;
    }

    return whole;
  });
}

export function rewriteRetiredInternalLinks(html: string, contextSlug = ''): string {
  if (!html || !html.includes('href=')) return html;
  let rewritten = html;
  for (const [source, destination] of RETIRED_INTERNAL_LINKS) {
    for (const quote of ['"', "'"]) {
      rewritten = rewritten
        .split(`href=${quote}${source}${quote}`)
        .join(`href=${quote}${destination}${quote}`)
        .split(`href=${quote}https://www.samanportable.com${source}${quote}`)
        .join(`href=${quote}https://www.samanportable.com${destination}${quote}`);
    }
  }
  return rewritePc01KeywordOwnershipLinks(rewritten, contextSlug);
}

// C-08 P0 (SAMAN ruling, 03 Aug 2026): a category archive publishes NO price.
// Frozen WordPress exports stay read-only; each price-bearing or ruled retired-name
// section is removed here, heading and body together, without replacement copy.
// Images inside removed sections are removed with their sections. This also removes
// the previously preserved container-house ladder image that sat without context.
const CATEGORY_PRICE_LADDER_REMOVALS = new Map<
  string,
  { removeLeading?: boolean; headings: string[] }
>([
  [
    'container-cafe',
    {
      removeLeading: true,
      headings: [
        'Container cafe types and price bands compared',
        'How much does a container cafe cost in India?',
        'Why do container cafe prices range from ₹2 lakh to ₹33 lakh?',
      ],
    },
  ],
  [
    'container-houses',
    {
      removeLeading: true,
      headings: [
        'Which container house fits your budget and family size?',
        'Container house price range by type',
        'How much does a container house cost in India?',
        'How much does a container house cost?',
        'Where can I buy a container house?',
        "What's the difference between a prefabricated container home and a prefabricated container house?",
      ],
    },
  ],
  [
    'container-offices',
    {
      headings: [
        'Which container office do you need?',
        'Container office types and sizes compared',
        'Can container offices be stacked or joined into a larger office?',
        'Container office range and starting prices',
        'SAMAN container office vs an IndiaMART listing',
      ],
    },
  ],
  [
    'industrial-sheds',
    {
      removeLeading: true,
      headings: [
        'Industrial shed types, spans and price bands',
        'What an industrial shed costs in India',
        "Why buy your shed range from SAMAN's own plants",
      ],
    },
  ],
  [
    'peb-constructions',
    {
      headings: [
        'Which PEB structure should you build — warehouse, factory, shed or multi-storey?',
        'PEB construction range — spans, applications and indicative price bands',
        "What does PEB construction cost, and what's included in the price?",
        'What is the cost of PEB construction?',
      ],
    },
  ],
  [
    'portable-cabin',
    {
      removeLeading: true,
      headings: [
        'Portable cabin types, sizes and starting prices compared',
        'How much does a portable cabin cost?',
        'Buying your portable cabin range from a manufacturer, not a reseller',
      ],
    },
  ],
  [
    'portable-toilet',
    {
      removeLeading: true,
      headings: [
        "SAMAN's Portable Toilet Range — ₹65,000 to ₹1,05,000, Side by Side",
        'Why Buyers Order From SAMAN',
        "What's the price range across SAMAN's portable toilet variants?",
      ],
    },
  ],
  [
    'pre-engineered-buildings',
    {
      removeLeading: true,
      headings: [
        'Which pre-engineered building fits your warehouse, factory or workshop?',
        'How much does a pre-engineered building cost in India?',
        'What is the cost of a pre-engineered building in India?',
      ],
    },
  ],
  [
    'prefab-buildings',
    {
      removeLeading: true,
      headings: [
        "How to Choose the Right Prefab Building from SAMAN's Range",
        'The Full Prefab Building Range — Sizes, Price Bands and What Each Suits',
        'Questions Buyers Ask Before Choosing a Prefab Building Manufacturer',
      ],
    },
  ],
  [
    'prefabricated-houses',
    {
      removeLeading: true,
      headings: [
        'Which prefabricated house do you need?',
        'Compare the SAMAN prefabricated house range',
        "What is SAMAN's price range for prefabricated houses?",
      ],
    },
  ],
  [
    'security-cabins',
    {
      headings: [
        'How Much Does a Security Cabin Cost in India?',
      ],
    },
  ],
]);

const HEADING_TAG = /<(h[23])\b[^>]*>([\s\S]*?)<\/\1>/gi;

function headingTextMatches(rawHeading: string, target: string): boolean {
  const normalize = (s: string) =>
    s
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&#8217;|&rsquo;|’/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  return normalize(rawHeading) === normalize(target);
}

/**
 * Drops the price-bearing sections from a category description. A section runs from
 * its heading to the next heading of the same or higher level, so an <h3> inside a
 * retained <h2> can be removed on its own without disturbing its siblings.
 */
export function removeCategoryPriceLadderSections(html: string, slug: string): string {
  const rule = CATEGORY_PRICE_LADDER_REMOVALS.get(slug);
  if (!rule || !html) return html;

  // Index every heading with its level and span.
  const headings: Array<{ level: number; start: number; end: number; text: string }> = [];
  HEADING_TAG.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = HEADING_TAG.exec(html))) {
    headings.push({
      level: Number(match[1][1]),
      start: match.index,
      end: match.index + match[0].length,
      text: match[2],
    });
  }

  const cuts: Array<[number, number]> = [];
  if (rule.removeLeading && headings[0]?.start) cuts.push([0, headings[0].start]);
  headings.forEach((heading, index) => {
    if (!rule.headings.some((target) => headingTextMatches(heading.text, target))) return;
    // Section ends at the next heading of the same or higher level, else end of input.
    const next = headings.slice(index + 1).find((h) => h.level <= heading.level);
    cuts.push([heading.start, next ? next.start : html.length]);
  });

  // Apply from the end so earlier offsets stay valid.
  let result = html;
  for (const [start, end] of cuts.sort((a, b) => b[0] - a[0])) {
    result = result.slice(0, start) + result.slice(end);
  }

  return result
    .replace(/<h([1-6])\b[^>]*>\s*<\/h\1>/gi, '')
    .replace(/(?:\r\n|\n|\s){3,}/g, '\r\n\r\n')
    .trim();
}

const C04_CANONICAL_WARRANTY =
  '5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation. Typical service life is 20 to 25 years under proper use and maintenance, which is an engineering expectation, not a warranty period.';

const C04_PRODUCT_SLUGS = new Set([
  'container-offices',
  'container-office-cabin',
  'shipping-container-office',
]);
const C04_REVIEW_PRODUCT_IDS = new Set([1050, 1273, 1281]);

// C-04 closure micro-REV: the first 100 rendered description words are the
// byte-frozen L3 zone. Outside that boundary, render em dashes as punctuation
// without changing the read-only WordPress export or any HTML attributes.
// Heading text takes a colon; prose, FAQs and captions take a comma.
function rewriteC04NonL3Punctuation(html: string, slug: string): string {
  if (!C04_PRODUCT_SLUGS.has(slug) || !html.includes('\u2014')) return html;

  let wordsSeen = 0;
  let headingDepth = 0;
  const replaceDashes = (text: string) =>
    text.replace(/\s*\u2014\s*/g, headingDepth > 0 ? ': ' : ', ');

  return html.replace(/<[^>]+>|[^<]+/g, (chunk) => {
    if (chunk.startsWith('<')) {
      if (/^<h[1-6]\b/i.test(chunk)) headingDepth += 1;
      if (/^<\/h[1-6]\b/i.test(chunk)) headingDepth = Math.max(0, headingDepth - 1);
      return chunk;
    }

    const words = [...chunk.matchAll(/\S+/g)];
    if (words.length === 0) return chunk;
    if (wordsSeen >= 100) return replaceDashes(chunk);

    const frozenWordsRemaining = 100 - wordsSeen;
    wordsSeen += words.length;
    if (words.length <= frozenWordsRemaining) return chunk;

    const lastFrozenWord = words[frozenWordsRemaining - 1];
    const boundary = lastFrozenWord.index! + lastFrozenWord[0].length;
    return `${chunk.slice(0, boundary)}${replaceDashes(chunk.slice(boundary))}`;
  });
}

const C04_PLATFORM_DISCLOSURES: Record<string, { marker: string; sentence: string }> = {
  'container-offices': {
    marker: 'Every SAMAN container office is fabricated from new ISO-grade Corten steel.',
    sentence:
      'Every model on this page is newly fabricated in container form at our Bengaluru and Greater Noida works; a converted used ISO container is available only as a separately quoted option.',
  },
  'container-office-cabin': {
    marker: 'A container office cabin is a container.',
    sentence:
      'This cabin is newly fabricated in container form; no used cargo shell is involved unless you separately request a converted-container quotation.',
  },
  'shipping-container-office': {
    marker: 'A shipping container office starts life as a corrugated steel box, not as a set of panels.',
    sentence:
      'The shipping-form office is newly fabricated to container dimensions and hardware standards; conversion of a used ISO cargo container is quoted separately on request.',
  },
};

function applyC04GapCloseCopy(html: string, slug: string): string {
  const disclosure = C04_PLATFORM_DISCLOSURES[slug];
  if (!disclosure) return html;

  const markerIndex = html.indexOf(disclosure.marker);
  const paragraphEnd = markerIndex < 0 ? -1 : html.indexOf('</p>', markerIndex);
  if (markerIndex < 0 || paragraphEnd < 0) {
    throw new Error(`C04 platform-copy anchor is missing for ${slug}`);
  }

  let rendered = html;
  if (slug === 'container-offices') {
    rendered = rendered.replace(
      /(?:Warranty is )?5 years on the structural frame\/base, 1[-\u2013]2 years on finishing depending on scope, and 20[-\u2013]25 years engineered service life with proper maintenance\.?/g,
      C04_CANONICAL_WARRANTY
    );
  }
  rendered = rendered.replace(
    '5 years structural frame and base, 1-2 years finishing, 20-25 years engineered service life',
    C04_CANONICAL_WARRANTY
  );

  const canonicalAlreadyPresent = rendered.includes(C04_CANONICAL_WARRANTY);
  const insertion =
    `<p>${disclosure.sentence}</p>` +
    (canonicalAlreadyPresent || slug === 'shipping-container-office' ? '' : `<p>${C04_CANONICAL_WARRANTY}</p>`);
  const adjustedEnd = rendered.indexOf('</p>', rendered.indexOf(disclosure.marker));
  return `${rendered.slice(0, adjustedEnd + 4)}${insertion}${rendered.slice(adjustedEnd + 4)}`;
}

// C03 Event Q: WordPress exports are read-only, so the approved punctuation
// correction is applied only to the rendered description HTML for these six
// routes. Headings and labelled list rows read naturally with a colon; prose
// uses a comma. SEO fields, schema, the first-section copy and source bytes are
// outside this boundary and remain untouched.
const C03_RENDER_PUNCTUATION_SLUGS = new Set([
  'portable-office',
  'readymade-office-cabin',
  'modern-office-cabin',
  'prefabricated-office-cabins',
  'portable-office-container',
  'small-office-cabin',
]);

export function rewriteC03RenderPunctuation(html: string, slug: string): string {
  if (!html || !C03_RENDER_PUNCTUATION_SLUGS.has(slug) || !html.includes('\u2014')) {
    return html;
  }

  const rewritten = html
    .replace(
      /(<h[1-6]\b[^>]*>)([\s\S]*?)(<\/h[1-6]>)/gi,
      (_match, open: string, inner: string, close: string) =>
        `${open}${inner.replace(/\s*\u2014\s*/g, ': ')}${close}`
    )
    .replace(
      /(<li\b[^>]*>)([\s\S]*?)(<\/li>)/gi,
      (_match, open: string, inner: string, close: string) =>
        `${open}${inner.replace(/\s*\u2014\s*/g, ': ')}${close}`
    )
    .replace(/(<\/strong>)\s*\u2014\s*/gi, '$1: ')
    .replace(/\s*\u2014\s*/g, ', ');

  // The hub's first description heading begins at body-copy word 97; its dash
  // is therefore inside the L3-frozen first 100 words and must remain byte-exact.
  if (slug === 'portable-office') {
    return rewritten.replace(
      'Portable Office: Professional Workspace, Delivered in 7-21 Days',
      'Portable Office \u2014 Professional Workspace, Delivered in 7-21 Days'
    );
  }
  return rewritten;
}

function emptyPagination(page: number, perPage: number): PaginationInfo {
  return {
    currentPage: page,
    totalPages: 0,
    totalProducts: 0,
    perPage,
    hasNextPage: false,
    hasPrevPage: false,
  };
}

function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.ceil(items.length / perPage);
  return {
    slice: items.slice((page - 1) * perPage, (page - 1) * perPage + perPage),
    pagination: {
      currentPage: page,
      totalPages,
      perPage,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    } as PaginationInfo,
  };
}

/**
 * FAQ schema source of truth is the curated `rank_math_schema_FAQPage` meta field.
 * `_rank_math_head` is a CACHED blob that lags the live body: after the T25 L3
 * appends, seven subpages had 8 curated FAQs but a cached head carrying only 3,
 * and low-cost had 10 vs 3 — so the cached copy was under-emitting approved
 * content and, on low-cost/office, still carried retired figures. T25 ruling,
 * 18 Jul 2026: curated wins, cached blob is the fallback when curated is absent.
 *
 * Returns a clean standalone FAQPage node, or null when there is no usable
 * curated set (so the caller falls through to the existing cached-blob path).
 */
function curatedFaqSchema(raw: any): any | null {
  const meta = raw?.meta_data;
  if (!Array.isArray(meta)) return null;
  const entry = meta.find((m: any) => m?.key === 'rank_math_schema_FAQPage');
  const questions = entry?.value?.mainEntity;
  if (!Array.isArray(questions)) return null;
  const mainEntity = questions
    .filter((q: any) =>
      typeof q?.name === 'string' && q.name.trim() &&
      typeof q?.acceptedAnswer?.text === 'string' && q.acceptedAnswer.text.trim())
    .map((q: any) => ({
      '@type': 'Question',
      name: q.name.trim(),
      acceptedAnswer: { '@type': 'Answer', text: q.acceptedAnswer.text.trim() },
    }));
  return mainEntity.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity } : null;
}

/**
 * @param preferCuratedFaq FENCED, per T25 ruling (b): the curated-FAQ preference
 *   applies to PRODUCT records only in this PR. Posts and categories keep the
 *   cached-blob path untouched and move in the Track-B ticket.
 */
function headToSeo(raw: any, preferCuratedFaq = false): RankMathSEOData | null {
  const head = raw?._rank_math_head;
  const seo = head?.success && head?.head ? parseRankMathHeadHtml(head.head) : null;
  if (!preferCuratedFaq) return seo;

  const curated = curatedFaqSchema(raw);
  if (!curated) return seo;                      // absent -> existing cached-blob path

  const base = (seo || {}) as RankMathSEOData;

  // Carry over the cached node's descriptive metadata. Only `mainEntity` is being
  // corrected here; dropping `name`/`inLanguage` would silently strip properties the
  // page already emits — and would break the flagship's byte-lock, since its curated
  // and cached FAQ sets are identical (17/17). Assigned BEFORE @id/url so the emitted
  // key order stays @context,@type,mainEntity,name,inLanguage,@id,url exactly as today.
  const cached: any = (base as any).faqSchema;
  if (cached && typeof cached === 'object') {
    for (const key of ['name', 'inLanguage']) {
      if (cached[key] !== undefined && curated[key] === undefined) curated[key] = cached[key];
    }
  }

  const canonical = typeof base.canonical === 'string' ? base.canonical.trim() : '';
  if (canonical) {
    curated['@id'] = `${canonical.replace(/\/$/, '')}#faq`;
    curated.url = canonical;
  }
  base.faqSchema = curated;                      // curated wins
  return base;
}

function applyPublicFaqSchemaUrl(seoData: RankMathSEOData | null, pageUrl: string): RankMathSEOData | null {
  if (!seoData?.faqSchema) return seoData;
  const publicUrl = pageUrl.replace(
    /^https?:\/\/(?:[a-z0-9-]+\.)*samanportable\.com/i,
    'https://www.samanportable.com'
  );
  seoData.faqSchema['@id'] = `${publicUrl.replace(/\/$/, '')}#faq`;
  seoData.faqSchema.url = publicUrl;
  return seoData;
}

// ─── posts ───────────────────────────────────────────────────────────────────

// Light index (slug + date) built once; full post JSON is read per request.
let postIndex: Array<{ slug: string; date: string }> | null = null;

function getPostIndex(): Array<{ slug: string; date: string }> {
  if (postIndex) return postIndex;
  const entries: Array<{ slug: string; date: string }> = [];
  for (const directory of ['posts', 'redirected-posts']) {
    const dir = path.join(EXPORT_DIR, directory);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json')) continue;
      const post = readJson(path.join(dir, f));
      if (post?.slug) entries.push({ slug: post.slug, date: post.date || '' });
    }
  }
  // Newest first — same order the WordPress posts API returned.
  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  postIndex = entries;
  return entries;
}

function readPostFile(slug: string): any | null {
  if (!SAFE_SLUG.test(slug)) return null;
  return readJson(path.join(EXPORT_DIR, 'posts', `${slug}.json`));
}

function readPostListingFile(slug: string): any | null {
  return readPostFile(slug) ||
    readJson(path.join(EXPORT_DIR, 'redirected-posts', `${slug}.json`));
}

// Mirrors api.fetchBlogPost: post object, or null when it genuinely doesn't exist.
export async function fetchBlogPost(slug: string): Promise<any | null> {
  const post = readPostFile(slug);
  if (!post) return null;
  const { _rank_math_head, ...rest } = post;
  if (typeof rest?.content?.rendered === 'string') {
    rest.content = {
      ...rest.content,
      rendered: normalizeVerifiedCommercialFacts(rewriteRetiredInternalLinks(rest.content.rendered, slug)),
    };
  }
  if (typeof rest?.excerpt?.rendered === 'string') {
    rest.excerpt = {
      ...rest.excerpt,
      rendered: normalizeVerifiedCommercialFacts(rewriteRetiredInternalLinks(rest.excerpt.rendered, slug)),
    };
  }
  return rest;
}

// Mirrors api.fetchBlogPostRankMathSEO.
export async function fetchBlogPostRankMathSEO(slug: string): Promise<RankMathSEOData | null> {
  return headToSeo(readPostFile(slug));
}

// Mirrors api.fetchBlogPosts (newest first + pagination).
export async function fetchBlogPosts(
  page = 1,
  perPage = 6
): Promise<{ posts: BlogPost[]; pagination: PaginationInfo }> {
  const index = getPostIndex();
  const { slice, pagination } = paginate(index, page, perPage);
  const posts = slice
    .map((entry) => readPostListingFile(entry.slug))
    .filter(Boolean)
    .map(({ _rank_math_head, ...rest }: any) => rest);
  return {
    posts: posts as BlogPost[],
    pagination: { ...pagination, totalPosts: index.length },
  };
}

export function getAllPostSlugs(): string[] {
  return getPostIndex().map((p) => p.slug);
}

export type BlogCategory = { id: number; name: string; slug: string; count: number };

// REAL blog categories with REAL post counts, derived from every exported post's
// embedded `wp:term` category terms. This replaces the previously hardcoded category
// list on /blog, whose counts were invented. Only categories with at least one post
// are returned, so a rendered count can never claim posts that don't exist.
let blogCategoriesCache: BlogCategory[] | null = null;

export function getBlogCategories(): BlogCategory[] {
  if (blogCategoriesCache) return blogCategoriesCache;

  const bySlug = new Map<string, BlogCategory>();
  for (const directory of ['posts', 'redirected-posts']) {
    const dir = path.join(EXPORT_DIR, directory);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json')) continue;
      const post = readJson(path.join(dir, f));
      if (!post?.slug) continue;

      const terms: any[] = post?._embedded?.['wp:term']?.[0] || [];
      for (const term of terms) {
        if (term?.taxonomy !== 'category' || !term?.slug) continue;
        const existing = bySlug.get(term.slug);
        if (existing) {
          existing.count += 1;
        } else {
          bySlug.set(term.slug, { id: term.id, name: term.name, slug: term.slug, count: 1 });
        }
      }
    }
  }

  blogCategoriesCache = Array.from(bySlug.values())
    .filter((c) => c.count >= 1)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return blogCategoriesCache;
}

// ─── T8.1 blog hub helpers ───────────────────────────────────────────────────
// Every value these produce is derived from the exported post files themselves —
// read time from real word counts, "start here" from real category sizes, search
// from real titles. Nothing here invents, curates or estimates.

type PostMeta = {
  slug: string;
  date: string;
  title: string;
  categories: Array<{ name: string; slug: string }>;
};

// Title + category index (newest first), built once. `getPostIndex()` carries only
// slug + date, which is not enough for title search or newest-per-category.
let postMetaIndex: PostMeta[] | null = null;

function getPostMetaIndex(): PostMeta[] {
  if (postMetaIndex) return postMetaIndex;

  const entries: PostMeta[] = [];
  for (const directory of ['posts', 'redirected-posts']) {
    const dir = path.join(EXPORT_DIR, directory);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json')) continue;
      const post = readJson(path.join(dir, f));
      if (!post?.slug) continue;

      const terms: any[] = post?._embedded?.['wp:term']?.[0] || [];
      entries.push({
        slug: post.slug,
        date: post.date || '',
        title: post?.title?.rendered || '',
        categories: terms
          .filter((t) => t?.taxonomy === 'category' && t?.slug)
          .map((t) => ({ name: t.name, slug: t.slug })),
      });
    }
  }

  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  postMetaIndex = entries;
  return entries;
}

/** Total number of published posts — the real figure the hub renders. */
export function getBlogPostCount(): number {
  return getPostIndex().length;
}

/** Read time from the post's REAL word count: ceil(words / 200). */
export function computeReadTime(html: string): number {
  const words = (html || '')
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.ceil(words / 200);
}

export type StartHereItem = {
  categoryName: string;
  categorySlug: string;
  postTitle: string;
  postSlug: string;
};

// The newest post in each of the N largest categories. "Largest" uses the same real
// counts getBlogCategories() reports, so the selection is fully deterministic — no
// pinning, no curation, no popularity signal.
export function getStartHerePosts(topCategories = 4): StartHereItem[] {
  const index = getPostMetaIndex(); // newest first
  const items: StartHereItem[] = [];

  for (const category of getBlogCategories().slice(0, topCategories)) {
    const newest = index.find((p) => p.categories.some((c) => c.slug === category.slug));
    if (!newest) continue;
    items.push({
      categoryName: category.name,
      categorySlug: category.slug,
      postTitle: newest.title,
      postSlug: newest.slug,
    });
  }

  return items;
}

// Case-insensitive substring match against post TITLES only (fast, predictable).
// `total` is the REAL number of matching posts; `posts` is the newest `limit` of
// them — so the results line can state a true count even when the render is capped.
export async function searchPostsByTitle(
  query: string,
  limit = 50
): Promise<{ posts: BlogPost[]; total: number }> {
  const q = (query || '').trim().toLowerCase();
  if (!q) return { posts: [], total: 0 };

  const matches = getPostMetaIndex().filter((p) =>
    decodeHtmlEntities(p.title).toLowerCase().includes(q)
  );

  const posts = matches
    .slice(0, limit)
    .map((m) => readPostListingFile(m.slug))
    .filter(Boolean)
    .map(({ _rank_math_head, ...rest }: any) => rest);

  return { posts: posts as BlogPost[], total: matches.length };
}

// ─── products ────────────────────────────────────────────────────────────────

let productsCache: any[] | null = null;
let listingProductsCache: any[] | null = null;

function getAllProductsRaw(): any[] {
  if (productsCache) return productsCache;
  const dir = path.join(EXPORT_DIR, 'products');
  const items: any[] = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const p = readJson(path.join(dir, f));
    if (p?.slug) items.push(p);
  }
  // Newest first — WooCommerce's default product list order (orderby=date desc).
  items.sort((a, b) =>
    (a.date_created || '') < (b.date_created || '') ? 1 : (a.date_created || '') > (b.date_created || '') ? -1 : 0
  );
  productsCache = items;
  return items;
}

function getAllListingProductsRaw(): any[] {
  if (listingProductsCache) return listingProductsCache;
  const items = [...getAllProductsRaw()];
  const dir = path.join(EXPORT_DIR, 'redirected-products');
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json')) continue;
      const product = readJson(path.join(dir, f));
      if (product?.slug) items.push(product);
    }
  }
  items.sort((a, b) =>
    (a.date_created || '') < (b.date_created || '') ? 1 : (a.date_created || '') > (b.date_created || '') ? -1 : 0
  );
  listingProductsCache = items;
  return items;
}

export type ProductLookupOptions = {
  includeDrafts?: boolean;
};

type ListingOptions = ProductLookupOptions;

const APPROVED_PRODUCTION_PATHS = new Set<string>(commercialArchitecture.approvedProductionPaths);
const PLANNED_RELEASE_PATHS = new Set<string>(commercialArchitecture.plannedReleasePaths);

function hasPublishedStatus(product: any): boolean {
  return !product?.status || product.status === 'publish';
}

/**
 * One public product decision shared by direct routes, listings, SEO and schema
 * lookups. The release fixture governs approved-plan URLs; legacy published
 * products outside that fixture remain unchanged pending their separate owner
 * dispositions. Draft status always fails closed in ordinary production.
 */
export function isProductPubliclyRenderable(product: any): boolean {
  if (!product?.slug || !hasPublishedStatus(product)) return false;
  const canonicalPath = getCanonicalProductPath(product);
  const governedByReleaseFixture = APPROVED_PRODUCTION_PATHS.has(canonicalPath)
    || PLANNED_RELEASE_PATHS.has(canonicalPath);
  return !governedByReleaseFixture
    || (APPROVED_PRODUCTION_PATHS.has(canonicalPath) && !PLANNED_RELEASE_PATHS.has(canonicalPath));
}

export function shouldShowDraftsInListings(host?: string | null): boolean {
  const normalized = String(host || '').toLowerCase();
  const isLoopback = /^(localhost|127\.0\.0\.1|\[::1\])(?::|$)/.test(normalized);
  return process.env.NODE_ENV !== 'production'
    && isLoopback
    && process.env.SAMAN_SHOW_DRAFTS_IN_LISTINGS !== 'false';
}

// Buyer-visible production listings only contain published products. Localhost
// preview can opt into drafts so owners can review listing-card behavior before
// publish approval.
function getPublishedProducts(): any[] {
  return getAllListingProductsRaw().filter(isProductPubliclyRenderable);
}

function getListingProducts(options: ListingOptions = {}): any[] {
  const base = !options.includeDrafts
    ? getPublishedProducts()
    : getAllListingProductsRaw().filter((p) => !p.status || p.status === 'publish' || p.status === 'draft');
  // C01: drop retired/301'd products so no listing card or rail links to a redirecting URL.
  return base.filter(
    (p) => !RETIRED_LISTING_SLUGS.has(p.slug) && !isTemporarilyGatedCommercialProduct(p)
  );
}

function findProductBySlug(slug: string, options: ProductLookupOptions = {}): any | null {
  if (!SAFE_SLUG.test(slug)) return null;
  const product = getAllProductsRaw().find((p) => p.slug === slug) || null;
  if (!product || options.includeDrafts) return product;
  return isProductPubliclyRenderable(product) ? product : null;
}

export function isPublicProductSlug(slug: string): boolean {
  return Boolean(findProductBySlug(slug));
}

// Same field subset that api.fetchProducts requested via _fields.
function toFeedProduct(p: any): WooCommerceProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    regular_price: p.regular_price,
    sale_price: p.sale_price,
    on_sale: p.on_sale,
    images: p.images || [],
    short_description: normalizeVerifiedCommercialFacts(
      rewriteRetiredInternalLinks(p.short_description || '')
    ),
    stock_status: p.stock_status,
    stock_quantity: p.stock_quantity ?? null,
    average_rating: p.average_rating,
    rating_count: p.rating_count,
    categories: p.categories || [],
    weight: p.weight || '',
    dimensions: p.dimensions || { length: '', width: '', height: '' },
    ...(p.priceDisplay ? { priceDisplay: p.priceDisplay } : {}),
    ...(p.priceSubline ? { priceSubline: p.priceSubline } : {}),
  } as unknown as WooCommerceProduct;
}

function toLightweight(p: any, categoryName?: string, categorySlug?: string): LightweightProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    regular_price: p.regular_price,
    sale_price: p.sale_price,
    on_sale: p.on_sale,
    ...(typeof p.valueAddedTaxIncluded === 'boolean'
      ? { valueAddedTaxIncluded: p.valueAddedTaxIncluded }
      : {}),
    featured_image: p.images?.[0]?.src || '/placeholder.svg',
    category: categoryName || p.categories?.[0]?.name || 'Uncategorized',
    category_slug: categorySlug || p.categories?.[0]?.slug || 'uncategorized',
    short_description: normalizeVerifiedCommercialFacts(
      rewriteRetiredInternalLinks(p.short_description || '')
    ),
    stock_status: p.stock_status,
    average_rating: p.average_rating,
    rating_count: p.rating_count,
    sku: p.sku || '',
    ...(p.priceDisplay ? { priceDisplay: p.priceDisplay } : {}),
    ...(p.priceSubline ? { priceSubline: p.priceSubline } : {}),
    ...(Array.isArray(p.relatedProductSlugs) ? { relatedProductSlugs: p.relatedProductSlugs } : {}),
    ...(p.schemaMode ? { schemaMode: p.schemaMode } : {}),
  };
}

// Mirrors api.fetchProducts (category/search/price/orderby filters).
export async function fetchProducts(
  page = 1,
  perPage = 12,
  filters: ProductFilters = {},
  options: ListingOptions = {}
): Promise<ProductsResponse> {
  let items = getListingProducts(options);

  if (filters.category) {
    const wanted = String(filters.category);
    items = items.filter((p) =>
      (p.categories || []).some((c: any) => c.slug === wanted || String(c.id) === wanted)
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter((p) => (p.name || '').toLowerCase().includes(q));
  }
  if (filters.min_price !== undefined) {
    items = items.filter((p) => parseFloat(p.price || '0') >= filters.min_price!);
  }
  if (filters.max_price !== undefined) {
    items = items.filter((p) => parseFloat(p.price || '0') <= filters.max_price!);
  }
  if (filters.on_sale) {
    items = items.filter((p) => p.on_sale);
  }
  if (filters.stock_status) {
    items = items.filter((p) => p.stock_status === filters.stock_status);
  }
  if (filters.orderby) {
    const dir = filters.order === 'asc' ? 1 : -1;
    const key = filters.orderby;
    items = [...items].sort((a, b) => {
      if (key === 'price') return (parseFloat(a.price || '0') - parseFloat(b.price || '0')) * dir;
      if (key === 'title') return a.name.localeCompare(b.name) * dir;
      if (key === 'rating') return (parseFloat(a.average_rating || '0') - parseFloat(b.average_rating || '0')) * dir;
      // date / popularity → keep date order
      return ((a.date_created || '') < (b.date_created || '') ? -1 : 1) * dir;
    });
  }

  const { slice, pagination } = paginate(items, page, perPage);
  return {
    products: slice.map(toFeedProduct),
    pagination: { ...pagination, totalProducts: items.length },
  };
}

// Mirrors api.fetchLightweightProduct: product or null (genuinely absent → 404 ok).
export async function fetchLightweightProduct(
  slug: string,
  options: ProductLookupOptions = {}
): Promise<LightweightProduct | null> {
  const p = findProductBySlug(slug, options);
  return p ? toLightweight(p) : null;
}

// C-08 (Fable 5 ruling, 03 Aug 2026): several exported alt strings carry a leading
// or trailing space, which screen readers announce as a pause and which breaks
// byte-comparison against an approved manifest. Trimming the attribute changes only
// whitespace — no word, no punctuation, no ordering — so it is defect removal, not
// copy. Empty and whitespace-only alts are left exactly as they are, since a
// decorative empty alt is meaningful.
export function trimImageAltWhitespace(html: string): string {
  if (!html || !html.includes('alt=')) return html;
  return html.replace(/\balt=(["'])([\s\S]*?)\1/gi, (whole, quote: string, value: string) => {
    const trimmed = value.trim();
    return trimmed && trimmed !== value ? `alt=${quote}${trimmed}${quote}` : whole;
  });
}

export function trimImageAltWhitespaceDeep<T>(value: T, key = ''): T {
  if (typeof value === 'string') {
    if (key === 'alt') {
      const trimmed = value.trim();
      return (trimmed && trimmed !== value ? trimmed : value) as T;
    }
    return trimImageAltWhitespace(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => trimImageAltWhitespaceDeep(item)) as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([childKey, item]) => [childKey, trimImageAltWhitespaceDeep(item, childKey)])
    ) as T;
  }
  return value;
}

// Mirrors api.fetchProductDescription.
export async function fetchProductDescription(
  slug: string,
  options: ProductLookupOptions = {}
): Promise<{ description: string; images: Array<{ src: string; alt: string }>; specificationsHtml?: string; shippingHtml?: string } | null> {
  const p = findProductBySlug(slug, options);
  if (!p) return null;
  return {
    description: normalizeVerifiedCommercialFacts(
      trimImageAltWhitespace(
        rewriteC04NonL3Punctuation(
          applyC04GapCloseCopy(
            rewriteC03RenderPunctuation(rewriteRetiredInternalLinks(p.description || '', slug), slug),
            slug
          ),
          slug
        )
      )
    ),
    images: (p.images || []).map((image: any) =>
      typeof image?.alt === 'string' && image.alt.trim() && image.alt.trim() !== image.alt
        ? { ...image, alt: image.alt.trim() }
        : image
    ),
    // Optional per-product tab overrides — passed through only when present in the
    // product JSON. Absent on all other products, so their tabs render unchanged.
    ...(p.specificationsHtml
      ? { specificationsHtml: normalizeVerifiedCommercialFacts(p.specificationsHtml) }
      : {}),
    ...(p.shippingHtml
      ? { shippingHtml: normalizeVerifiedCommercialFacts(p.shippingHtml) }
      : {}),
  };
}

// Mirrors api.fetchProductRankMathSEO. Accepts "category/slug" or a bare slug —
// the LAST path segment identifies the product file.
export async function fetchProductRankMathSEO(
  categorySlug: string,
  options: ProductLookupOptions = {}
): Promise<RankMathSEOData | null> {
  const parts = String(categorySlug).split('/').filter(Boolean);
  const slug = parts[parts.length - 1] || '';
  const productPath = parts.join('/');
  const productUrl = `https://www.samanportable.com/product/${productPath}${productPath.includes('/') ? '/' : ''}`;
  const product = findProductBySlug(slug, options);
  // preferCuratedFaq: PRODUCT path (T25 ruling b — products only in this PR).
  const seoData = headToSeo(product, true) || (product?.faqSchema ? {} : null);
  if (seoData && product?.faqSchema) seoData.faqSchema = product.faqSchema;
  return normalizeVerifiedCommercialFactsDeep(applyPublicFaqSchemaUrl(seoData, productUrl));
}

// Mirrors api.fetchProductReviews: approved-only, latest first, capped, non-fatal.
export async function fetchProductReviews(productId: number, perPage = 5): Promise<ProductReview[]> {
  if (!productId || productId <= 0) return [];
  const file = path.join(EXPORT_DIR, 'reviews', `product-${productId}.json`);
  const reviews = readJson(file);
  if (!Array.isArray(reviews)) return [];
  return reviews
    .filter(
      (r: any) =>
        r &&
        (r.status === 'approved' || r.status === undefined) &&
        typeof r.rating === 'number' &&
        r.rating > 0 &&
        typeof r.review === 'string' &&
        r.review.trim().length > 0
    )
    .sort((a: any, b: any) => ((a.date_created || '') < (b.date_created || '') ? 1 : -1))
    .slice(0, Math.max(1, Math.min(perPage, 10)))
    .map((r: any) => ({
      id: r.id,
      product_id: r.product_id,
      reviewer: (r.reviewer && String(r.reviewer).trim()) || 'Anonymous',
      rating: r.rating,
      review: C04_REVIEW_PRODUCT_IDS.has(productId)
        ? r.review.replace(/\s*\u2014\s*/g, ', ')
        : r.review,
      date_created: r.date_created || '',
      verified: Boolean(r.verified),
      status: r.status,
    }));
}

// ─── categories ──────────────────────────────────────────────────────────────

let categoriesCache: any[] | null = null;

function getAllCategoriesRaw(): any[] {
  if (categoriesCache) return categoriesCache;
  const dir = path.join(EXPORT_DIR, 'categories');
  const items: any[] = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const c = readJson(path.join(dir, f));
    if (c?.slug) items.push(c);
  }
  items.sort((a, b) => a.name.localeCompare(b.name)); // WooCommerce default: name asc
  categoriesCache = items;
  return items;
}

// Mirrors api.fetchProductCategories (_fields=id,name,slug,count).
export async function fetchProductCategories(): Promise<any[]> {
  return getAllCategoriesRaw().map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c.count }));
}

// SHIKHAR T8.2: a product hub's own display name (e.g. 'porta-cabins' → 'Porta Cabins'),
// or null when no such category ships. Sync because the blog→hub mapping runs inside
// getStaticProps; it reads the same cache fetchProductCategories() does. The name is
// never derived from the blog term — the hub is the authority for its own name.
export function getProductCategoryName(slug: string): string | null {
  if (!SAFE_SLUG.test(slug)) return null;
  return getAllCategoriesRaw().find((c) => c.slug === slug)?.name || null;
}

// Mirrors api.fetchProductCategoryBySlug.
export async function fetchProductCategoryBySlug(slug: string): Promise<ProductCategoryDetail | null> {
  if (!SAFE_SLUG.test(slug)) return null;
  const c = getAllCategoriesRaw().find((x) => x.slug === slug);
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: removeMonetaryHtml(
      removeCategoryPriceLadderSections(
        rewriteRetiredInternalLinks(c.description || ''),
        slug
      )
    ),
    extraDescription: '', // category meta_data is not part of the WC category object
    count: c.count || 0,
    image: c.image || null,
  };
}

// Mirrors api.fetchCategoryRankMathSEO.
export async function fetchCategoryRankMathSEO(categorySlug: string): Promise<RankMathSEOData | null> {
  if (!SAFE_SLUG.test(categorySlug)) return null;
  const c = getAllCategoriesRaw().find((x) => x.slug === categorySlug);
  let seo = headToSeo(c);
  if (seo) {
    seo = removeMonetarySentencesDeep(seo);
  }
  return seo;
}

// Mirrors api.fetchProductAttributes — derived from the exported products
// (only one product carries attributes; the rest are spec-in-description).
export async function fetchProductAttributes(): Promise<any[]> {
  const seen = new Map<string, { id: number; name: string; options: string[] }>();
  for (const p of getPublishedProducts()) {
    for (const a of p.attributes || []) {
      if (!a?.name) continue;
      const cur = seen.get(a.name) || { id: a.id || 0, name: a.name, options: [] };
      cur.options = Array.from(new Set([...cur.options, ...(a.options || [])]));
      seen.set(a.name, cur);
    }
  }
  return Array.from(seen.values());
}

// Mirrors api.fetchLightweightProductsByCategory — including the "unknown
// category → empty result" behavior the live site has today.
export async function fetchLightweightProductsByCategory(
  categorySlug: string,
  page = 1,
  perPage = 20,
  options: ListingOptions = {}
): Promise<{ products: LightweightProduct[]; pagination: PaginationInfo }> {
  if (!SAFE_SLUG.test(categorySlug)) {
    return { products: [], pagination: emptyPagination(page, perPage) };
  }
  const category = getAllCategoriesRaw().find((c) => c.slug === categorySlug);
  if (!category) {
    return { products: [], pagination: emptyPagination(page, perPage) };
  }
  const items = getListingProducts(options)
    .filter((p) => (p.categories || []).some((c: any) => c.slug === categorySlug))
    .filter((p) => !(options.includeDrafts && categorySlug === 'roofing-sheets' && p.slug === 'roofing-sheet'));
  const { slice, pagination } = paginate(items, page, perPage);
  return {
    products: slice.map((p) => toLightweight(p, category.name, categorySlug)),
    pagination: { ...pagination, totalProducts: items.length },
  };
}

// Mirrors api.fetchProductsByCategoryPriority (homepage featured slider and
// /product hub). additionalFilters supports the same fields as fetchProducts.
export async function fetchProductsByCategoryPriority(
  page = 1,
  perPage = 8,
  additionalFilters: Omit<ProductFilters, 'category'> = {},
  options: ListingOptions = {}
): Promise<ProductsResponse> {
  const categoryPriority = [
    'roofing-sheets',
    'sandwich-panel',
    'puf-panel',
    'pir-panel',
    'rockwool-panel',
    'eps-panel',
    'glass-wool-panel',
    'portable-cabin',
    'container-offices',
    'porta-cabins',
    'labor-colony',
    'portable-office',
    'container-cafe',
    'industrial-sheds',
  ];
  let all: any[] = [];
  const seenProductKeys = new Set<string>();

  for (const categorySlug of categoryPriority) {
    const category = getAllCategoriesRaw().find((c) => c.slug === categorySlug);
    if (!category) continue;
    const inCat = getListingProducts(options)
      .filter((p) => (p.categories || []).some((c: any) => c.slug === categorySlug))
      .filter((p) => {
        const key = String(p.id || p.slug);
        if (seenProductKeys.has(key)) return false;
        seenProductKeys.add(key);
        return true;
      })
      .slice(0, 20)
      .map((p) => ({
        ...toFeedProduct(p),
        category_slug: categorySlug,
        category_name: category.name,
      }));
    all = [...all, ...inCat];
  }
  if (additionalFilters.search) {
    const q = additionalFilters.search.toLowerCase();
    all = all.filter((p) => (p.name || '').toLowerCase().includes(q));
  }
  if (additionalFilters.min_price !== undefined) {
    all = all.filter((p) => parseFloat(p.price || '0') >= additionalFilters.min_price!);
  }
  if (additionalFilters.max_price !== undefined) {
    all = all.filter((p) => parseFloat(p.price || '0') <= additionalFilters.max_price!);
  }
  if (additionalFilters.on_sale) {
    all = all.filter((p) => p.on_sale);
  }
  if (additionalFilters.stock_status) {
    all = all.filter((p) => p.stock_status === additionalFilters.stock_status);
  }
  const { slice, pagination } = paginate(all, page, perPage);
  return { products: slice as any, pagination: { ...pagination, totalProducts: all.length } };
}

// Mirrors api.fetchRankMathSEO(url) for the few call sites that pass a full URL.
// Only URLs whose head was exported resolve; anything else returns null and the
// caller's existing fallback SEO takes over (e.g. the /product hub page, which is
// not a WordPress entity and has no exported head).
export async function fetchRankMathSEO(url: string): Promise<RankMathSEOData | null> {
  const parts = String(url).replace(/[?#].*$/, '').split('/').filter(Boolean);
  const last = parts[parts.length - 1] || '';
  if (!SAFE_SLUG.test(last)) return null;
  const post = readPostFile(last);
  if (post) return headToSeo(post);                  // posts unchanged (Track-B)
  const product = findProductBySlug(last);
  if (product) return headToSeo(product, true);      // PRODUCT path — curated FAQ wins
  const category = getAllCategoriesRaw().find((c) => c.slug === last);
  if (category) return headToSeo(category);          // categories unchanged (Track-B)
  return null;
}

export function getAllProductsForFeed(): WooCommerceProduct[] {
  return getListingProducts().map(toFeedProduct);
}

// Porta-cabin variant group data (T24.1) — single source of truth for the nine
// standard sizes/prices/images used by the product page AND the Merchant feed.
// Read straight from disk (server-side only); null if the file is absent.
export function getPortaCabinVariantData(): any | null {
  return readJson(path.join(process.cwd(), 'src', 'data', 'products', 'porta-cabins.json'));
}

// T26 — the same variant data for one of the T25 porta-cabin SUBPAGES. Slug is
// whitelist-checked against SAFE_SLUG so a caller can never read outside the folder.
export function getVariantProductData(slug: string): any | null {
  if (!SAFE_SLUG.test(slug)) return null;
  return readJson(path.join(process.cwd(), 'src', 'data', 'products', `${slug}.json`));
}

// T26 — every subpage's variant data, keyed by slug, for the Merchant + local-inventory
// feeds. Missing files simply yield null and that slug contributes no items.
export function getSubpageVariantData(slugs: readonly string[]): Record<string, any | null> {
  const out: Record<string, any | null> = {};
  for (const slug of slugs) out[slug] = getVariantProductData(slug);
  return out;
}
