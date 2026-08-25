/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProductReviews from '@/components/ProductReviews';
import RelatedProductRail from '@/components/product/RelatedProductRail';
import ProductSummaryLayout from '@/components/product/ProductSummaryLayout';
import { getPvcRoofingSheetRailWithPirFallback } from '@/lib/c16PanelCatalog';
import { CheckCircle, Truck } from 'lucide-react';

const baseImagePath = '/panel-images/pvc-roofing-sheet/';
const canonicalUrl = 'https://www.samanportable.com/product/roofing-sheet/pvc-roofing-sheet';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const staticContent = await import('@/lib/staticContent');
  const allowDraftPreview = staticContent.shouldShowDraftsInListings(req.headers.host);
  if (!allowDraftPreview && !staticContent.isPublicProductSlug('pvc-roofing-sheet')) {
    return { notFound: true };
  }
  return { props: {} };
};
const wcReviewProductId = 0;

const galleryImages = [
  {
    src: `${baseImagePath}pvc-upvc-roofing-sheet-corrugated-profile.webp`,
    alt: 'Corrugated uPVC roofing sheet displayed in a factory yard',
    caption: 'The multi-layer uPVC roofing sheet - rigid corrugated profile with ASA weather cap.',
  },
  {
    src: `${baseImagePath}upvc-roofing-sheet-layer-edge-closeup.webp`,
    alt: 'Cut edge of a multi-layer uPVC roofing sheet showing the ASA cap layer',
    caption: 'The layer that does the work: ASA weather cap co-extruded over the uPVC core.',
  },
  {
    src: `${baseImagePath}pvc-roofing-sheet-stack-factory.webp`,
    alt: 'Stack of new PVC and uPVC roofing sheets at the SAMAN factory',
    caption: 'Factory-made stock at our own plant - not traded sheets.',
  },
  {
    src: `${baseImagePath}upvc-roofing-sheet-shed-roof-detail.webp`,
    alt: 'uPVC roofing sheets fixed on a steel shed roof with crest screws',
    caption: 'Correct fixing in view: crest screws, straight lines, exact one-corrugation lap.',
  },
  {
    src: `${baseImagePath}upvc-roofing-sheet-ridge-fixing-detail.webp`,
    alt: 'Profile-matched uPVC ridge cap on a corrugated roofing sheet roof',
    caption: 'Profile-matched ridge - quoted as a visible line item with every roof.',
  },
];

const bodyImages = {
  extrusion: {
    src: `${baseImagePath}upvc-roofing-sheet-factory-extrusion-stack.webp`,
    alt: 'uPVC roofing sheets stacked beside the extrusion line at an Indian factory',
  },
  coastal: {
    src: `${baseImagePath}upvc-roofing-sheet-coastal-warehouse-installation.webp`,
    alt: 'Installers laying uPVC roofing sheets on a coastal warehouse roof',
  },
  poultry: {
    src: `${baseImagePath}upvc-roofing-sheet-poultry-farm-shed.webp`,
    alt: 'Poultry farm shed roofed with corrugated uPVC sheets',
  },
  rain: {
    src: `${baseImagePath}upvc-roofing-sheet-rain-monsoon-roof.webp`,
    alt: 'Monsoon rain running off a corrugated uPVC roofing sheet roof',
  },
  fixing: {
    src: `${baseImagePath}pvc-upvc-roofing-sheet-fixing-predrill.webp`,
    alt: 'Pre-drilling an oversized fixing hole in a uPVC roofing sheet',
  },
};

const specImages = {
  crossSection: {
    src: `${baseImagePath}pvc-vs-upvc-layer-cross-section-diagram.webp`,
    alt: 'Cross-section diagram comparing PVC and multi-layer uPVC roofing sheets',
  },
  coverage: {
    src: `${baseImagePath}pvc-upvc-profile-coverage-width-diagram.webp`,
    alt: 'Coverage width and side-lap diagram for PVC and uPVC roofing sheets',
  },
  fixing: {
    src: `${baseImagePath}upvc-fixing-expansion-detail-diagram.webp`,
    alt: 'Fixing and thermal expansion detail diagram for uPVC roofing sheets',
  },
};

const specGrid = [
  ['SIZE', 'PVC 1.5 mm · uPVC 2.0-2.5 mm · profile widths ~1050-1130 mm'],
  ['MATERIAL', 'Corrugated PVC · multi-layer uPVC with ASA/UV cap'],
  ['DELIVERY', '3-5 day dispatch'],
  ['COVERAGE', 'Bangalore · Delhi NCR · pan-India'],
  ['BRAND', 'SAMAN Portable'],
];

const comparisonRows = [
  ['', 'PVC roofing sheet', 'uPVC roofing sheet'],
  ['Build', 'Single-material corrugated sheet', 'Multi-layer extrusion with ASA/UV weather cap'],
  ['Thickness', '1.5 mm', '2.0-2.5 mm'],
  ['Rigidity', 'Flexible - needs closer support', 'Rigid, dimensionally stable'],
  ['Duty', 'Temporary, light, budget cover', 'Permanent roofs, corrosive environments'],
  ['Where it wins', 'Small sheds, temporary site cover, tight budgets', 'Coastal, chemical, farm and factory roofs'],
  ['Where to skip it', 'Any permanent or corrosive-site roof', 'Very short-term cover where PVC money is enough'],
];

const engineeringRows = [
  ['PVC corrugated roofing sheet', '1.5 mm (options 1.0-2.0 mm)', 'Single-material corrugated PVC, UV/colour where specified', 'Width/profile per quotation', 'Blue, green, white, clear', 'Temporary, light and budget roofs'],
  ['uPVC / ASA roofing sheet', '2.0 / 2.5 mm standard (options 1.5-3.0 mm)', 'Multi-layer unplasticised PVC, co-extruded ASA/UV weather cap on sun face', '~1050-1130 mm per profile', 'Terracotta, blue, grey, green, white', 'Permanent roofs; coastal, chemical, farm'],
  ['uPVC tile profile roofing sheet', '2.5 mm (option 3.0 mm)', 'Tile-look uPVC profile, ASA/UV cap', 'Profile-specific, per quotation', 'Terracotta, red, brown, grey', 'Decorative roofs - homes, resorts'],
];

const buyingRows = [
  ['Permanent-roof default', 'uPVC multi-layer with ASA cap, 2.0-2.5 mm'],
  ['Budget / temporary default', 'PVC corrugated 1.5 mm'],
  ['Corrosive sites (coastal / chemical / poultry)', 'uPVC family only - this is its home ground'],
  ['Cap rule', 'Colour and UV live in the ASA cap; confirm "capped sheet" in writing on any quote, including ours'],
  ['Fixing rule', 'Pre-drilled oversized holes · crest fixing · EPDM-washer screws, snug not crushed · purlin spacing per quotation'],
  ['Foot traffic', 'Crawl boards over purlin lines only - never walk the open sheet'],
  ['Cutting', 'Fine-tooth circular saw / jigsaw, sheet supported at the cut'],
  ['Not supplied', 'FRP / fibre roofing sheets · transparent sheets (see polycarbonate family)'],
  ['Warranty', '5–10 years, confirmed in writing at quotation'],
  ['HSN code', "3925 (plastic builders' ware)"],
  ['Price basis', 'Fixed ex-GST ₹/sq ft · GST, transport, unloading, accessories separate'],
];

const faqs = [
  {
    question: 'Which is better, PVC or uPVC roofing sheet?',
    answer:
      'For any permanent roof, uPVC - the unplasticised multi-layer build with ASA cap is rigid, UV-stable and made for years of weather. PVC (1.5 mm corrugated) is better only when the duty is genuinely temporary or the budget is the whole decision. The honest test: if replacing the roof in a few years would annoy you, buy uPVC.',
  },
  {
    question: 'What is the size of a PVC roofing sheet?',
    answer:
      'Our PVC corrugated sheets are 1.5 mm thick and uPVC sheets 2.0-2.5 mm, with profile widths covering roughly 1050-1130 mm after overlap. Lengths are cut per order and profile. Send roof dimensions and the quotation returns the exact sheet count and cut list.',
  },
  {
    question: 'What are the disadvantages of uPVC roofing sheets?',
    answer:
      'Honestly: higher thermal movement than steel (managed by oversized fixing holes), limited foot traffic (use crawl boards), closer purlin spacing than metal, thermoplastic fire behaviour, and fade on cheap uncapped sheets - the ASA cap layer is the spec that prevents it. The full section above covers each with its fix.',
  },
  {
    question: 'Are uPVC roofing sheets good for coastal areas?',
    answer:
      'They are the default answer for coastal roofs. Salt air corrodes zinc and steel; uPVC has nothing to rust. The same logic covers chemical units, fertilizer plants and ammonia-heavy poultry and dairy sheds.',
  },
  {
    question: 'Does a uPVC roof reduce rain noise?',
    answer:
      'Noticeably, compared with bare metal. The thicker plastic section damps the drumming, which matters in schools, homes, farm sheds and any workspace under the roof deck. It is a comfort difference you hear in the first monsoon.',
  },
  {
    question: 'How do you cut and fix a PVC roofing sheet?',
    answer:
      'Cut with a fine-tooth circular saw or jigsaw, supporting the sheet close to the cut. Fix with pre-drilled oversized holes on the profile crest using EPDM-washer roofing screws, snug not crushed, at the purlin spacing stated on your quotation. The oversized hole is non-negotiable - it is what lets the sheet move with heat instead of cracking.',
  },
  {
    question: 'What is the HSN code for PVC roofing sheets?',
    answer:
      "HSN 3925 - plastic builders' ware, the correct code for PVC and uPVC roofing sheets. The applicable GST rate is stated on every SAMAN quotation and invoice so your purchase entry matches the document exactly.",
  },
  {
    question: 'What do PVC and uPVC roofing sheets cost?',
    answer:
      'PVC corrugated is the budget line; multi-layer uPVC costs more and buys permanence. The exact rate depends on family, thickness, colour, quantity and delivery distance - the roofing family rate card lives on the roofing price page, and your quotation states fixed ex-GST rates with GST and transport as separate lines.',
  },
  {
    question: 'Can uPVC sheets replace old cement or asbestos sheets?',
    answer:
      'Yes, and it is one of the most common jobs we quote - lighter sheets, no corrosion, no fibre-dust concerns, fixed to the existing or lightly corrected purlin structure. Send the shed dimensions and current sheet type, and the quotation covers sheets, ridges and fixings.',
  },
  {
    question: 'Do you make transparent PVC sheets for roofs?',
    answer:
      'No - transparency is the polycarbonate family\'s job, which we also manufacture with UV coating as standard. If your roof needs daylight, the polycarbonate page covers solid, multiwall and corrugated options; if it needs opaque rust-proof cover, you are on the right page.',
  },
];

const relatedRail = getPvcRoofingSheetRailWithPirFallback();

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/roofing-sheet/pvc-roofing-sheet#product',
  name: 'PVC & uPVC Roofing Sheet',
  description:
    'PVC and uPVC roofing sheets factory-made in India - 1.5 mm corrugated PVC for budget and temporary roofs, and 2.0-2.5 mm multi-layer uPVC with co-extruded ASA weather cap for permanent, coastal, chemical and farm roofs. Honest PVC-vs-uPVC guidance with sizes, fixing rules and stated limitations.',
  category: 'Roofing Sheet',
  sku: 'SP-C17-PVC-SUB-2026',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'PVC (corrugated) and unplasticised PVC (uPVC) with ASA weather cap',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Thickness range', value: 'PVC 1.5 mm; uPVC 2.0-2.5 mm' },
    { '@type': 'PropertyValue', name: 'Build', value: 'Corrugated PVC; multi-layer uPVC with co-extruded ASA/UV cap' },
    { '@type': 'PropertyValue', name: 'Profile width', value: '~1050-1130 mm per profile' },
    { '@type': 'PropertyValue', name: 'Duty environments', value: 'Coastal, chemical, poultry/dairy and farm roofs; temporary and budget cover (PVC)' },
    { '@type': 'PropertyValue', name: 'HSN', value: '3925' },
  ],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: 50,
    offerCount: 4,
    availability: 'https://schema.org/InStock',
    url: 'https://www.samanportable.com/product/roofing-sheet/pvc-roofing-sheet',
    seller: { '@id': 'https://www.samanportable.com/#organization' },
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'Roofing Sheet', item: 'https://www.samanportable.com/product/roofing-sheet' },
    { '@type': 'ListItem', position: 4, name: 'PVC & uPVC Roofing Sheet', item: 'https://www.samanportable.com/product/roofing-sheet/pvc-roofing-sheet' },
  ],
};

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

function Figure({ image }: { image: { src: string; alt: string } }) {
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
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-slate-700">
          {rows.map((row) => (
            <tr key={row.join('|')}>
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`} className="align-top px-4 py-3">
                  {index === 0 ? <strong className="text-slate-950">{cell}</strong> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuoteBlock() {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
      <h2 className="text-xl font-bold text-slate-950">Get a PVC / uPVC roofing sheet quotation</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-4">
          <p className="text-sm font-semibold text-slate-950">South India</p>
          <p className="text-sm text-slate-700">+91 88616 22859 · sales@samanportable.com</p>
        </div>
        <div className="rounded-lg bg-white p-4">
          <p className="text-sm font-semibold text-slate-950">North India / Delhi NCR</p>
          <p className="text-sm text-slate-700">+91 87960 39938 · ncr@samanportable.com</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-700">
        Or use the <strong>Send Enquiry</strong> form with your roof dimensions, site city, duty (permanent / temporary) and current roof type if replacing - we return family, thickness, sheet count and fixing spec in writing.
      </p>
    </div>
  );
}

export default function PvcRoofingSheetPage() {
  const [activeTab, setActiveTab] = useState('description');
  const tabs = [
    ['description', 'Description'],
    ['specifications', 'Specifications'],
    ['reviews', 'Reviews'],
    ['faqs', 'FAQs'],
  ];

  return (
    <Layout>
      <Head>
        <title>PVC &amp; uPVC Roofing Sheets - Corrugated, Rust-Proof | SAMAN</title>
        <meta
          name="description"
          content="PVC and uPVC roofing sheets factory-made in India - 1.5 mm corrugated PVC and 2.0-2.5 mm multi-layer uPVC with ASA weather cap for coastal, chemical and farm roofs. Honest PVC-vs-uPVC guidance, sizes, fixing rules and the disadvantages nobody lists. Pan-India dispatch."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="PVC & uPVC Roofing Sheets - Corrugated, Rust-Proof | SAMAN" />
        <meta
          property="og:description"
          content="PVC and uPVC roofing sheets factory-made in India - 1.5 mm corrugated PVC and 2.0-2.5 mm multi-layer uPVC with ASA weather cap for coastal, chemical and farm roofs. Honest PVC-vs-uPVC guidance, sizes, fixing rules and the disadvantages nobody lists. Pan-India dispatch."
        />
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
            <Link href="/product/roofing-sheet" className="hover:text-emerald-700">Roofing Sheet</Link>
            <span>/</span>
            <span className="font-semibold text-slate-950">PVC & uPVC Roofing Sheet</span>
          </nav>

          <ProductSummaryLayout
            rail={<RelatedProductRail items={relatedRail} currentHref="/product/roofing-sheet/pvc-roofing-sheet" className="lg:h-auto lg:min-h-full" scroll />}
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
                        loading="lazy"
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
                  ROOFING SHEETS
                </p>
                <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                  PVC & uPVC Roofing Sheets - The Roof That Cannot Rust, Chosen Honestly
                </h1>
                <p className="mt-4 text-2xl font-bold text-emerald-700">From ₹50 / sq ft</p>
                <p className="mt-1 text-sm text-slate-500">1.5 mm PVC corrugated base spec · ex-GST · final price at quotation</p>
                <p className="mt-5 text-base leading-7 text-slate-700">
                  A uPVC roofing sheet is the plastic roof you buy when metal keeps losing - to salt air, chemical fumes, ammonia in poultry sheds or plain coastal humidity. A PVC roofing sheet is its lighter, budget cousin for small sheds and temporary cover. Sellers quote the two words as if they were one product; they are not, and the difference decides how your roof looks in year six. This page separates PVC and uPVC the way we build them in our own factories - thickness, layers, sizes, honest limitations included.
                </p>
                <ul className="mt-5 space-y-3 text-sm text-slate-700">
                  {[
                    'Factory-made at our Bangalore and Greater Noida plants - not traded stock',
                    '1.5 mm corrugated PVC for budget and temporary roofs',
                    '2.0-2.5 mm multi-layer uPVC with ASA weather cap for permanent duty',
                    'Cannot rust - built for coastal, chemical and farm environments',
                    'Quieter under rain than bare metal sheets',
                    'Pan-India dispatch in 3-5 working days',
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm font-semibold text-slate-950">
                  Request a quotation - share roof size, site city and duty (permanent / temporary).
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {specGrid.map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-normal text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="font-semibold text-slate-950">SKU:</span> SP-C17-PVC-SUB-2026
                </div>
              </div>
            }
            mobileRail={<RelatedProductRail items={relatedRail} currentHref="/product/roofing-sheet/pvc-roofing-sheet" />}
          />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="tablist" aria-label="PVC and uPVC Roofing Sheet product tabs">
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
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
                <h2>PVC & uPVC Roofing Sheets - The Roof That Cannot Rust, Chosen Honestly</h2>
                <p>
                  Walk any Indian coastline, fertilizer unit or poultry farm and you will find the same story on the roofs: metal sheets replaced twice in a decade, and beside them a plastic roof quietly doing its job. That is the honest case for a <strong>uPVC roofing sheet</strong> - and, one budget rung below it, the <strong>PVC roofing sheet</strong>. The dishonest part of this market is that most sellers quote "PVC/uPVC" as one word and one price, hiding the fact that they are two different products with different builds, lives and fair prices. We manufacture both, so we can afford to tell you the difference before you pay.
                </p>
                <blockquote>
                  <p><strong>Get a factory-direct PVC/uPVC roofing sheet quotation:</strong> South India +91 88616 22859 · sales@samanportable.com | North India / Delhi NCR +91 87960 39938 · ncr@samanportable.com</p>
                </blockquote>

                <h2>What is a PVC roofing sheet?</h2>
                <p>
                  A PVC roofing sheet is polyvinyl chloride pressed into a corrugated roofing profile - in our range a <strong>1.5 mm</strong> sheet built for light, budget and temporary duty. It is fully waterproof, immune to rust by nature, light enough for one person to carry, and honest about what it is: cover for small sheds, cycle stands, temporary site structures and back-of-plot roofs where the budget leads the decision. What it is not is a twenty-year industrial roof - and a seller who quotes bare "PVC" for permanent factory duty is either confused or hoping you are.
                </p>

                <h2>What is a uPVC roofing sheet - and what the "u" actually buys you</h2>
                <p>
                  The "u" stands for <strong>unplasticised</strong>. Ordinary PVC carries plasticisers that keep it flexible; uPVC removes them, producing a rigid, dimensionally stable sheet that behaves like a roofing material rather than a tarpaulin with ambitions. Our uPVC roofing sheets are built as <strong>multi-layer extrusions, 2.0-2.5 mm thick</strong>, with an <strong>ASA weather cap co-extruded on the sun face</strong> - the layer that takes the UV and weather so the structural core underneath does not. This is the serious plastic roof: corrosion-immune where steel corrodes, stable where plain plastic sags, and quiet under rain where metal drums. If your site smells of salt, acid or ammonia, this sheet is usually why you are on this page. The family also includes a <strong>uPVC tile-profile roofing sheet</strong> (2.5 mm, same ASA cap) - the tile-look option homes and resorts choose when the roof is part of the elevation, in terracotta, red, brown and grey.
                </p>
              </div>

              <Figure image={bodyImages.extrusion} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>PVC vs uPVC - the two-minute decision</h2>
              </div>
              <DataTable headers={comparisonRows[0]} rows={comparisonRows.slice(1)} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <p>
                  The pattern to remember: <strong>PVC when the roof is temporary, uPVC when the roof is the point.</strong> Both come from our own lines, so the quotation states which sheet you are getting - by name, thickness and layer build - instead of a blurred "PVC/uPVC" line item.
                </p>

                <h2>Searching "plastic sheet for roof"? Decide with one question</h2>
                <p>
                  A large share of buyers arrive with exactly those words, and the market answers with three unrelated products. The one question that sorts them: <strong>does light need to pass through the roof?</strong> If yes, you want the transparent family - <Link href="/product/roofing-sheet/polycarbonate-roofing-sheet">UV-coated polycarbonate roofing sheets</Link>, a different material we also make. If no - you want an opaque plastic roof that never rusts - you are already on the right page: PVC for temporary duty, uPVC for permanent. And if what you actually meant was "cheap fibre sheet": we do not deal in FRP/fibre roofing at all, and most such requirements are served better and longer by the uPVC sheet on this page.
                </p>
              </div>

              <Figure image={bodyImages.coastal} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Thickness, profile and size - the numbers that matter</h2>
                <p>
                  Three numbers decide most PVC/uPVC purchases. <strong>Thickness:</strong> 1.5 mm (PVC corrugated) or 2.0-2.5 mm (uPVC multi-layer, the standard quoted specs - options run 1.5 to 3.0 mm and are confirmed at quotation) - thicker means stiffer, wider purlin tolerance and permanent duty. <strong>Profile width:</strong> our sheets cover roughly <strong>1050-1130 mm per profile</strong> after overlap, so your sheet count is the roof width divided by covered width, rounded up in whole sheets. <strong>Length:</strong> cut per order and profile, confirmed at quotation - long sheets mean fewer laps and fewer leak lines. Purlin spacing follows thickness and local wind, so we state it on the quotation for your exact sheet rather than publishing a one-line rule that fails on a windy site.
                </p>

                <h2>Colours - and where the colour actually lives</h2>
                <p>
                  Standard stock colours, stated plainly: <strong>uPVC/ASA roofing sheets come in terracotta, blue, grey, green and white</strong>; the <strong>uPVC tile profile in terracotta, red, brown and grey</strong>; and <strong>PVC corrugated in blue, green, white and clear</strong>. Two working rules from our own roofs: light colours run visibly cooler under Indian sun and hide dust better than dark ones, and terracotta is the default ask for homes and resorts because it reads as tile from the road. The part that matters more than the shade: on uPVC, <strong>colour lives in the ASA cap layer, not in a surface paint</strong> - which is why a capped sheet holds its shade for years while cheap uncapped sheet chalks and fades in a few summers.
                </p>

                <h2>Where PVC and uPVC roofs actually work</h2>
                <p>
                  <strong>Coastal buildings:</strong> the headline case - salt air eats zinc coatings; uPVC simply has nothing to rust. <strong>Chemical, fertilizer and pickling units:</strong> acid fumes that shorten metal-roof life leave uPVC indifferent. <strong>Poultry, dairy and farm sheds:</strong> ammonia is brutal on galvanized sheet and irrelevant to uPVC - and the quieter rain response keeps birds and cattle calmer. <strong>Warehouses and workshops near the sea:</strong> uPVC as the roof skin, with steel structure kept safely under cover. <strong>Homes, terraces and parking:</strong> uPVC for the permanent verandah or car roof; PVC where the structure itself is temporary. One honest exclusion: for genuinely temperature-controlled interiors, a roof <em>sheet</em> is the wrong product class - that job belongs to an insulated panel roof, which we also manufacture and will recommend when your requirement says so.
                </p>
              </div>

              <Figure image={bodyImages.poultry} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>uPVC roofing sheet disadvantages - the honest list</h2>
                <p>
                  No other seller ranking for this product will write this section; it is also the most-asked genuine question about the material. The real limitations, each with its management: <strong>(1) Thermal movement.</strong> Plastic expands and contracts with heat more than steel - which is why every fixing rule below exists. Fixed correctly, it is a non-issue; fixed like a metal sheet, it cracks. <strong>(2) Foot traffic.</strong> You do not walk freely on a plastic roof the way you might on heavy-gauge steel - use crawl boards over purlin lines during fixing and maintenance. <strong>(3) Span discipline.</strong> uPVC wants closer purlin spacing than an equivalent metal sheet; the quotation states the spacing, and stretching it to save purlins is how plastic roofs fail in wind. <strong>(4) Fire behaviour.</strong> It is a thermoplastic - it will not rust, but it is not a fire barrier either; where fire rating drives the design, we say so and spec accordingly at quotation. <strong>(5) Cheap-sheet fade.</strong> Uncapped budget sheets chalk and fade in a few Indian summers; the ASA cap layer is the spec that prevents it - ask any seller, in writing, whether their sheet is capped. <strong>(6) Very large industrial spans</strong> with heavy service loads remain metal-and-decking territory; we will tell you when your building is one of them. A material with known limits, honestly fixed, beats a material with hidden ones.
                </p>

                <h2>Rain noise and roof heat - where plastic quietly beats metal</h2>
                <p>
                  Two behaviours buyers only discover after installation. <strong>Noise:</strong> rain on bare metal drums; the same rain on a 2.5 mm uPVC sheet lands with a damped, duller note - a real difference in schools, farm sheds, homes and anywhere people sit under the roof deck. <strong>Heat:</strong> uPVC conducts heat far more slowly than steel, so the underside runs cooler to the touch than bare metal under the same sun - a comfort gain, though not insulation; a genuinely cool interior still needs an insulated roof build-up, stated honestly above.
                </p>
              </div>

              <Figure image={bodyImages.rain} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Fixing rules - how plastic roofs survive their installers</h2>
                <p>
                  Most "uPVC failed" stories are fixing failures, and the rules fit in one paragraph. <strong>Pre-drill every hole oversized</strong> - the sheet must move around the screw as it heats and cools; a tight hole becomes a crack by summer. <strong>Use EPDM-washer roofing screws, snug not crushed</strong> - a crushed washer dimples the sheet and starts a leak. <strong>Fix on the crest, not the valley,</strong> so water crosses no screw line. <strong>Respect the stated purlin spacing</strong> and lap the profile exactly one corrugation with the weather-side sheet on top. <strong>Cut with a fine-tooth saw</strong> (the harvest question "how to cut a PVC roofing sheet" has a one-line answer: fine-tooth circular saw or jigsaw, sheet supported close to the cut line). Our supply quotations include the screw-and-accessory count as visible line items, because a stalled roof waiting for washers is a silly way to lose a week.
                </p>

                <h2>What decides the price</h2>
                <p>
                  Sheet family first - PVC corrugated is the budget line, multi-layer uPVC costs more and buys the ASA cap, rigidity and permanent duty, and the tile profile sits at the top for its looks - then thickness, colour, quantity, cut lengths and delivery distance. Rates for the whole roofing family sit together on the roofing sheet price page (Phase 2) rather than scattered per page; the From ₹50/sq ft above is the 1.5 mm PVC corrugated base spec, ex-GST, with GST, transport, unloading and accessories always separate visible lines per the fixed-rate policy on every SAMAN quotation.
                </p>

                <h2>Warranty, delivery and quotation</h2>
                <p>
                  <strong>PVC/uPVC roofing sheet warranty: 5–10 years, confirmed in writing at quotation.</strong> Dispatch from Bangalore (South) and Greater Noida (North/NCR) in 3-5 working days standard - <Link href="/delivery-policy">Delivery Policy</Link>; returns follow the <Link href="/refund-and-return-policy">Refund &amp; Return Policy</Link>. Supply-only unless stated otherwise; profile-matched ridges, flashings and screws quoted as visible line items.
                </p>
              </div>

              <Figure image={bodyImages.fixing} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Why buy PVC and uPVC roofing sheets from SAMAN</h2>
                <p>
                  Because both sheets come off <strong>our own lines at Bangalore and Greater Noida</strong> - we are the manufacturer, not a reseller relabelling trader stock, and the specification on the quotation (family, thickness, layer build, cap, colour) is written by the people who made the sheet. Because we sell the whole roofing family - metal, polycarbonate, PVC/uPVC - so we have no incentive to force plastic where steel is right, and we routinely say so. And because the guidance above is the checklist our own site teams follow on our cabins and prefab structures. To compare every family in one place before you decide, start at <Link href="/product/roofing-sheet">the complete roofing sheet range</Link>.
                </p>

                <h2>Frequently asked questions</h2>
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>

              <QuoteBlock />
            </div>

            <div hidden={activeTab !== 'specifications'} role="tabpanel">
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h2>PVC & uPVC Roofing Sheet Technical Specifications</h2>
              </div>
              <Figure image={specImages.crossSection} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h3>Family engineering matrix</h3>
              </div>
              <DataTable headers={['Family', 'Thickness', 'Build', 'Profile width', 'Standard colours', 'Duty class']} rows={engineeringRows} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h3>Buying rules (owner-locked)</h3>
              </div>
              <DataTable headers={['Rule', 'Value']} rows={buyingRows} />
              <Figure image={specImages.coverage} />
              <Figure image={specImages.fixing} />
            </div>

            <div hidden={activeTab !== 'reviews'} role="tabpanel">
              <ProductReviews reviews={[]} averageRating="0.00" ratingCount={0} productId={wcReviewProductId} productName="PVC & uPVC Roofing Sheet" />
            </div>

            <div hidden={activeTab !== 'faqs'} role="tabpanel">
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h2>Frequently asked questions</h2>
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <section className="mt-8">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
                <Truck className="h-4 w-4 text-emerald-700" />
                Certifications
              </div>
              <p className="text-sm text-slate-700">
                ISO 9001:2015 (E20250218645) · ISO 14001:2015 (E20250218646) · ISO 45001:2018 (E20250218647) · NSIC (NSIC/GP/BAN/2024/0055207) · DPIIT (DIPP56005) · Udyam (UDYAM-KR-03-0172770)
              </p>
              <p className="mt-2 text-sm text-slate-700">GST: 29ABBCS7101B1ZR (Bangalore) / 09ABBCS7101B1ZT (Noida)</p>
            </div>
          </section>

          <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Factory-made sheets', 'Family, thickness, layer build, cap and colour stated in writing.'],
                ['Fixing rules included', 'Oversized holes, crest fixing, EPDM washers and purlin spacing listed.'],
                ['Two dispatch origins', 'Bangalore and Greater Noida for shorter freight routes.'],
              ].map(([title, text]) => (
                <div key={title} className="flex gap-3">
                  <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-700" />
                  <div>
                    <p className="font-semibold text-slate-950">{title}</p>
                    <p className="text-sm text-slate-700">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-8">
            <QuoteBlock />
          </div>
        </section>
      </main>
    </Layout>
  );
}
