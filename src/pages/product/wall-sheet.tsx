/* eslint-disable @next/next/no-img-element */
import fs from 'fs';
import path from 'path';
import { useState, type ReactNode } from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProductReviews from '@/components/ProductReviews';
import RelatedProductRail from '@/components/product/RelatedProductRail';
import ProductSummaryLayout from '@/components/product/ProductSummaryLayout';
import { C16_PANEL_CATALOG, ROOFING_SHEET_HUB, type RelatedRailItem } from '@/lib/c16PanelCatalog';
import { CheckCircle, Truck } from 'lucide-react';

const baseImagePath = '/panel-images/wall-sheet/';
const canonicalUrl = 'https://www.samanportable.com/product/wall-sheet';
const wcReviewProductId = 272776;

type SummaryContent = {
  chip: string;
  h1: string;
  priceLine: string;
  subline: string;
  intro: string;
  bullets: string[];
  ctaLine: string;
  specGrid: string[][];
};

type ImageMeta = {
  file: string;
  src: string;
  alt: string;
  caption: string;
};

type CtaContent = {
  title: string;
  contacts: Array<{ label: string; value: string }>;
  note: string;
};

type HeadingBlock = {
  type: 'heading';
  level: number;
  text: string;
};

type ParagraphBlock = {
  type: 'paragraph';
  text: string;
};

type QuoteBlockContent = {
  type: 'blockquote';
  text: string;
};

type TableBlock = {
  type: 'table';
  headers: string[];
  rows: string[][];
};

type FigureBlock = {
  type: 'figure';
  image: ImageMeta;
};

type FaqBlock = {
  type: 'faq';
  question: string;
  answer: string;
};

type ContentBlock = HeadingBlock | ParagraphBlock | QuoteBlockContent | TableBlock | FigureBlock | FaqBlock;

type WallSheetPageProps = {
  metaTitle: string;
  metaDescription: string;
  summary: SummaryContent;
  galleryImages: ImageMeta[];
  descriptionBlocks: ContentBlock[];
  specBlocks: ContentBlock[];
  faqs: Array<{ question: string; answer: string }>;
  cta: CtaContent;
  certifications: string[];
  productSchema: Record<string, unknown>;
  breadcrumbSchema: Record<string, unknown>;
};

const relatedRail: RelatedRailItem[] = [
  C16_PANEL_CATALOG['puf-panel'],
  {
    ...C16_PANEL_CATALOG['sandwich-panel'],
    title: 'Sandwich Panel',
    href: '/product/puf-panel/puf-sandwich-panel',
  },
  ROOFING_SHEET_HUB,
  C16_PANEL_CATALOG['eps-panel'],
  C16_PANEL_CATALOG['pir-panel'],
  // Swap cards 4–5 for PVC Wall Sheet + UV Marble Sheet when the C18 children go live.
];

function extractBetween(source: string, startMarker: string, endMarker: string): string {
  const start = source.indexOf(startMarker);
  if (start === -1) return '';
  const end = source.indexOf(endMarker, start + startMarker.length);
  return source.slice(start, end === -1 ? undefined : end).trim();
}

function extractLineValue(source: string, label: string): string {
  const match = source.match(new RegExp(`- \\*\\*${label}:\\*\\*\\s*(.+)`));
  return match?.[1]?.trim() || '';
}

function stripStrong(value: string): string {
  return value.replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');
}

function parseSummary(source: string): SummaryContent {
  const section = extractBetween(source, '## COLUMN 1', '## COLUMN 2');
  const bulletsSection = extractBetween(section, '- **Benefit bullets (6):**', '- **CTA line:**');
  const specSection = extractBetween(section, '- **Icon spec grid:**', '## COLUMN 2');

  const bullets = bulletsSection
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^- /, '').trim());

  const specGrid = specSection
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^- /, '').trim())
    .map((line) => {
      const [label, ...rest] = line.split(' — ');
      return [label, rest.join(' — ')];
    });

  return {
    chip: extractLineValue(section, 'Category chip'),
    h1: extractLineValue(section, 'H1'),
    priceLine: extractLineValue(section, 'Price line \\(green\\)'),
    subline: extractLineValue(section, 'Subline \\(grey\\)'),
    intro: extractLineValue(section, 'Intro paragraph'),
    bullets,
    ctaLine: extractLineValue(section, 'CTA line'),
    specGrid,
  };
}

function parseGalleryFiles(source: string): string[] {
  return extractBetween(source, '## COLUMN 2', '## COLUMN 3')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s/.test(line))
    .map((line) => line.replace(/^\d+\.\s*/, '').trim());
}

function parseImageSpecs(source: string): Record<string, ImageMeta> {
  const sections = source.split(/\r?\n(?=### )/);
  const images: Record<string, ImageMeta> = {};

  sections.forEach((section) => {
    const file = section.match(/\*\*File Name:\*\*\s*(.+)/)?.[1]?.trim();
    const alt = section.match(/\*\*Alt Text:\*\*\s*(.+)/)?.[1]?.trim();
    const caption = section.match(/\*\*Caption:\*\*\s*(.+)/)?.[1]?.trim();
    if (!file || !alt || !caption) return;
    images[file] = {
      file,
      src: `${baseImagePath}${file.replace(/\.png$/, '.webp')}`,
      alt,
      caption,
    };
  });

  return images;
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function parseContentBlocks(section: string, images: Record<string, ImageMeta>): ContentBlock[] {
  const lines = section.split(/\r?\n/);
  const blocks: ContentBlock[] = [];
  let paragraph: string[] = [];
  let inFaqSection = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
    paragraph = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line || line === '---') {
      flushParagraph();
      continue;
    }

    const imageFile = line.match(/file:\s*([^\s]+\.png)/)?.[1];
    if (imageFile && images[imageFile]) {
      flushParagraph();
      blocks.push({ type: 'figure', image: images[imageFile] });
      continue;
    }

    if (line.startsWith('|')) {
      flushParagraph();
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        tableLines.push(lines[index].trim());
        index += 1;
      }
      index -= 1;
      const headers = parseTableRow(tableLines[0]);
      const rows = tableLines.slice(2).map(parseTableRow);
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    if (line.startsWith('>')) {
      flushParagraph();
      blocks.push({ type: 'blockquote', text: line.replace(/^>\s*/, '') });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)/);
    if (heading) {
      flushParagraph();
      const text = heading[2].trim();
      const level = heading[1].length;
      inFaqSection = text === 'Frequently asked questions';
      blocks.push({ type: 'heading', level, text });
      continue;
    }

    const faqQuestion = inFaqSection ? line.match(/^\*\*(.+)\*\*$/)?.[1] : null;
    if (faqQuestion) {
      flushParagraph();
      const answerLines: string[] = [];
      index += 1;
      while (index < lines.length) {
        const answerLine = lines[index].trim();
        if (!answerLine) {
          index += 1;
          continue;
        }
        if (/^\*\*(.+)\*\*$/.test(answerLine) || /^#{1,6}\s+/.test(answerLine) || answerLine === '---') {
          index -= 1;
          break;
        }
        answerLines.push(answerLine);
        index += 1;
      }
      blocks.push({ type: 'faq', question: faqQuestion, answer: answerLines.join(' ') });
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
}

function parseCta(source: string): CtaContent {
  const section = extractBetween(source, '## CTA BLOCK', '## CERTIFICATIONS STRIP');
  const lines = section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const title = stripStrong(lines.find((line) => line.startsWith('**')) || '');
  const bullets = lines.filter((line) => line.startsWith('- ')).map((line) => line.replace(/^- /, ''));
  const contacts: Array<{ label: string; value: string }> = [];
  let note = '';

  bullets.forEach((bullet) => {
    const contact = bullet.match(/^\*\*(.+?):\*\*\s*(.+)$/);
    if (contact) {
      contacts.push({ label: contact[1], value: contact[2] });
    } else {
      note = bullet;
    }
  });

  return { title, contacts, note };
}

function parseCertifications(source: string): string[] {
  return extractBetween(source, '## CERTIFICATIONS STRIP', '---')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('##'));
}

function parseSchemaBlocks(source: string): Record<string, unknown>[] {
  return Array.from(source.matchAll(/```json\r?\n([\s\S]*?)\r?\n```/g))
    .map((match) => match[1].trim())
    .map((block) => {
      try {
        return JSON.parse(block) as Record<string, unknown>;
      } catch {
        return null;
      }
    })
    .filter((block): block is Record<string, unknown> => Boolean(block));
}

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      parts.push(
        <Link key={`${match.index}-${match[2]}`} href={match[3]}>
          {match[2]}
        </Link>
      );
    } else if (match[4]) {
      parts.push(<strong key={`${match.index}-${match[4]}`}>{match[4]}</strong>);
    } else if (match[5]) {
      parts.push(<em key={`${match.index}-${match[5]}`}>{match[5]}</em>);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function Figure({ image }: { image: ImageMeta }) {
  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="relative aspect-video w-full bg-slate-100">
        <img
          src={image.src}
          alt={image.alt}
          title={image.alt}
          className="absolute inset-0 h-full w-full object-cover"
          width={1200}
          height={675}
          loading="lazy"
          decoding="async"
        />
      </div>
    </figure>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-slate-100 text-slate-950">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">
                {renderInline(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-slate-700">
          {rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row.join('|')}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="align-top px-4 py-3">
                  {cellIndex === 0 ? <strong className="text-slate-950">{renderInline(cell)}</strong> : renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuoteBlock({ cta }: { cta: CtaContent }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
      <h2 className="text-xl font-bold text-slate-950">{cta.title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {cta.contacts.map((contact) => (
          <div key={contact.label} className="rounded-lg bg-white p-4">
            <p className="text-sm font-semibold text-slate-950">{contact.label}</p>
            <p className="text-sm text-slate-700">{contact.value}</p>
          </div>
        ))}
      </div>
      {cta.note && <p className="mt-4 text-sm text-slate-700">{renderInline(cta.note)}</p>}
    </div>
  );
}

function RenderBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'figure') {
          return <Figure key={`${block.image.file}-${index}`} image={block.image} />;
        }

        if (block.type === 'table') {
          return <DataTable key={`${block.headers.join('|')}-${index}`} headers={block.headers} rows={block.rows} />;
        }

        return (
          <div key={`${block.type}-${index}`} className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
            {block.type === 'heading' && block.level <= 1 && <h2>{block.text}</h2>}
            {block.type === 'heading' && block.level === 2 && <h2>{block.text}</h2>}
            {block.type === 'heading' && block.level === 3 && <h2>{block.text}</h2>}
            {block.type === 'heading' && block.level >= 4 && <h3>{block.text}</h3>}
            {block.type === 'paragraph' && <p>{renderInline(block.text)}</p>}
            {block.type === 'blockquote' && (
              <blockquote>
                <p>{renderInline(block.text)}</p>
              </blockquote>
            )}
            {block.type === 'faq' && (
              <div>
                <h3>{block.question}</h3>
                <p>{renderInline(block.answer)}</p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export const getStaticProps: GetStaticProps<WallSheetPageProps> = async () => {
  const draftPath = path.join(process.cwd(), 'page-structure', 'content-drafts', 'C18P0_WallSheet_Hub_DRAFT.md');
  const source = fs.readFileSync(draftPath, 'utf8');
  const imageSpecs = parseImageSpecs(source);
  const galleryImages = parseGalleryFiles(source).map((file) => imageSpecs[file]).filter(Boolean);
  const descriptionSection = extractBetween(source, '# Wall Sheets —', '## CTA BLOCK');
  const specSection = extractBetween(source, '### Wall Sheet Technical Specifications', '## INTERNAL LINKS');
  const descriptionBlocks = parseContentBlocks(descriptionSection, imageSpecs);
  const specBlocks = parseContentBlocks(specSection, imageSpecs);
  const faqs = descriptionBlocks
    .filter((block): block is FaqBlock => block.type === 'faq')
    .map((faq) => ({
      question: stripInlineMarkdown(faq.question),
      answer: stripInlineMarkdown(faq.answer),
    }));
  const schemaBlocks = parseSchemaBlocks(source);

  return {
    props: {
      metaTitle: extractLineValue(source, 'Meta title'),
      metaDescription: extractLineValue(source, 'Meta description'),
      summary: parseSummary(source),
      galleryImages,
      descriptionBlocks,
      specBlocks,
      faqs,
      cta: parseCta(source),
      certifications: parseCertifications(source),
      productSchema: schemaBlocks[0] || {},
      breadcrumbSchema: schemaBlocks[1] || {},
    },
  };
};

export default function WallSheetPage({
  metaTitle,
  metaDescription,
  summary,
  galleryImages,
  descriptionBlocks,
  specBlocks,
  faqs,
  cta,
  certifications,
  productSchema,
  breadcrumbSchema,
}: WallSheetPageProps) {
  const [activeTab, setActiveTab] = useState('description');
  const tabs = [
    ['description', 'Description'],
    ['specifications', 'Specifications'],
    ['reviews', 'Reviews'],
    ['faqs', 'FAQs'],
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Layout>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <main className="bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-emerald-700">Home</Link>
            <span>/</span>
            <Link href="/product" className="hover:text-emerald-700">Product</Link>
            <span>/</span>
            <span className="font-semibold text-slate-950">Wall Sheet</span>
          </nav>

          <ProductSummaryLayout
            rail={<RelatedProductRail items={relatedRail} currentHref="/product/wall-sheet" className="lg:h-auto lg:min-h-full" scroll />}
            gallery={
              <div className="h-full rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={galleryImages[0].src}
                    alt={galleryImages[0].alt}
                    title={galleryImages[0].alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    width={1200}
                    height={1200}
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {galleryImages.map((image) => (
                    <div key={image.src} className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                      <img
                        src={image.src}
                        alt={image.alt}
                        title={image.alt}
                        className="absolute inset-0 h-full w-full object-cover"
                        width={1200}
                        height={1200}
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-600">{galleryImages[0].caption}</p>
              </div>
            }
            description={
              <div className="h-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <p className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-normal text-emerald-700">
                  {summary.chip}
                </p>
                <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                  {summary.h1}
                </h1>
                <p className="mt-4 text-2xl font-bold text-emerald-700">{summary.priceLine}</p>
                <p className="mt-1 text-sm text-slate-500">{summary.subline}</p>
                <p className="mt-5 text-base leading-7 text-slate-700">{summary.intro}</p>
                <ul className="mt-5 space-y-3 text-sm text-slate-700">
                  {summary.bullets.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm font-semibold text-slate-950">{summary.ctaLine}</p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {summary.specGrid.map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-normal text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="font-semibold text-slate-950">SKU:</span> SP-C18-WSH-HUB-2026
                </div>
              </div>
            }
            mobileRail={<RelatedProductRail items={relatedRail} currentHref="/product/wall-sheet" />}
          />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="tablist" aria-label="Wall Sheet product tabs">
              {tabs.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === id}
                  onClick={() => setActiveTab(id)}
                  className={`rounded-md px-4 py-3 text-sm font-semibold transition ${activeTab === id ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <article className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div hidden={activeTab !== 'description'} role="tabpanel">
              <RenderBlocks blocks={descriptionBlocks} />
              <QuoteBlock cta={cta} />
            </div>

            <div hidden={activeTab !== 'specifications'} role="tabpanel">
              <RenderBlocks blocks={specBlocks} />
            </div>

            <div hidden={activeTab !== 'reviews'} role="tabpanel">
              <ProductReviews reviews={[]} averageRating="0.00" ratingCount={0} productId={wcReviewProductId} productName="Wall Sheet" />
            </div>

            <div hidden={activeTab !== 'faqs'} role="tabpanel">
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h2>Frequently asked questions</h2>
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3>{faq.question}</h3>
                    <p>{renderInline(faq.answer)}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className="mt-8">
            <QuoteBlock cta={cta} />
          </div>

          <section className="mt-8">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
                <Truck className="h-4 w-4 text-emerald-700" />
                Certifications
              </div>
              {certifications.map((line, index) => (
                <p key={line} className={`${index > 0 ? 'mt-2 ' : ''}text-sm text-slate-700`}>
                  {line}
                </p>
              ))}
            </div>
          </section>

        </section>
      </main>
    </Layout>
  );
}
