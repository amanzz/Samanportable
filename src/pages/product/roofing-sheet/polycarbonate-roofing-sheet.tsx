/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProductReviews from '@/components/ProductReviews';
import RelatedProductRail from '@/components/product/RelatedProductRail';
import ProductZoneCtas from '@/components/product/ProductZoneCtas';
import { getPolycarbonateRoofingSheetRail } from '@/lib/c16PanelCatalog';
import { CheckCircle, Factory, Truck } from 'lucide-react';

const baseImagePath = '/panel-images/polycarbonate-roofing-sheet/';
const canonicalUrl = 'https://www.samanportable.com/product/roofing-sheet/polycarbonate-roofing-sheet';
const wcReviewProductId = 272774;

const galleryImages = [
  {
    src: `${baseImagePath}polycarbonate-roofing-sheet-clear-solid.webp`,
    alt: 'Clear solid polycarbonate roofing sheet held against the sky',
    caption: 'Clear solid, multiwall flutes, corrugated profile, protected stack and pergola fixing details for transparent roof selection.',
  },
  {
    src: `${baseImagePath}polycarbonate-roofing-sheet-multiwall-flutes.webp`,
    alt: 'Multiwall polycarbonate roofing sheet flutes close-up',
    caption: 'Multiwall internal flutes and twin-wall structure.',
  },
  {
    src: `${baseImagePath}polycarbonate-roofing-sheet-corrugated-profile.webp`,
    alt: 'Corrugated polycarbonate roofing sheet profile section',
    caption: 'Corrugated profile for daylight strips and transparent shed roofing.',
  },
  {
    src: `${baseImagePath}polycarbonate-roofing-sheet-stack-masking-film.webp`,
    alt: 'Stack of UV-coated polycarbonate roofing sheets with masking film',
    caption: 'UV-coated sheet stack with protective masking film.',
  },
  {
    src: `${baseImagePath}polycarbonate-roofing-sheet-pergola-detail.webp`,
    alt: 'Solid polycarbonate roofing sheet fixed on a pergola frame',
    caption: 'Solid sheet fixed over a pergola frame.',
  },
];

const bodyImages = {
  supply: {
    src: `${baseImagePath}polycarbonate-roofing-sheet-supply-stack.webp`,
    alt: 'Polycarbonate roofing sheet types stocked at SAMAN supply yard',
  },
  pergola: {
    src: `${baseImagePath}polycarbonate-pergola-canopy-installation.webp`,
    alt: 'Installing solid polycarbonate roofing sheets on a pergola',
  },
  skylight: {
    src: `${baseImagePath}polycarbonate-skylight-warehouse-daylight.webp`,
    alt: 'Multiwall polycarbonate skylight bands lighting a warehouse',
  },
  daylight: {
    src: `${baseImagePath}polycarbonate-daylight-strips-metal-roof.webp`,
    alt: 'Corrugated polycarbonate daylight strips in a metal roof',
  },
  fixing: {
    src: `${baseImagePath}polycarbonate-fixing-predrill-screws.webp`,
    alt: 'Pre-drilling a polycarbonate roofing sheet before fixing',
  },
};

const specImages = {
  crossSection: {
    src: `${baseImagePath}polycarbonate-solid-multiwall-corrugated-cross-section-diagram.webp`,
    alt: 'Solid vs multiwall vs corrugated polycarbonate cross-section diagram',
  },
  ladder: {
    src: `${baseImagePath}polycarbonate-thickness-application-ladder-diagram.webp`,
    alt: 'Polycarbonate roofing sheet thickness selection ladder',
  },
  fixing: {
    src: `${baseImagePath}polycarbonate-fixing-expansion-detail-diagram.webp`,
    alt: 'Polycarbonate roofing sheet fixing and thermal expansion detail',
  },
};

const specGrid = [
  ['SIZE', '1.5–10 mm · solid 1220×2440 / 2050×3050 mm · multiwall 1220 / 2100 mm widths'],
  ['MATERIAL', 'UV-coated solid · multiwall · corrugated polycarbonate'],
  ['DELIVERY', '3–5 day dispatch'],
  ['COVERAGE', 'Bangalore · Delhi NCR'],
  ['BRAND', 'SAMAN Portable'],
];

const constructionRows = [
  ['Solid polycarbonate', 'A single glass-clear monolithic pane (2 / 3 / 5 mm)', 'Looks matter — pergolas, entrance canopies, premium skylights where you want true glass-like clarity without glass risk', 'Budget is tight or the span is large — clarity costs more per covered foot than multiwall'],
  ['Multiwall (twin-wall) polycarbonate', 'Two or more thin walls joined by internal ribs, forming air flutes (4 / 6 / 10 mm)', 'The everyday workhorse — skylights, covered walkways, greenhouses; lightest per sq ft, and the air gap tempers heat and noise slightly', 'You want perfect transparency — flutes read as translucent lines, not glass'],
  ['Corrugated polycarbonate', 'A 1.5 mm sheet pressed into a roofing profile, matched to metal-sheet profiles', 'Daylight strips inside a metal roof, or full corrugated transparent roofs on sheds and utility structures', 'Frameless or flat-glazed looks — it is a profiled roofing sheet, not a glazing pane'],
];

const engineeringRows = [
  ['Solid polycarbonate', '2 / 3 / 5 mm', 'Co-extruded UV layer, weather face', '1220 × 2440 mm · 2050 × 3050 mm', 'Pergolas, entrance canopies, premium skylights, glazing-style covers'],
  ['Multiwall polycarbonate', '4 / 6 / 10 mm', 'Co-extruded UV layer, weather face', '1220 / 2100 mm widths', 'Skylights, covered walkways, greenhouses, daylight bands'],
  ['Corrugated polycarbonate', '1.5 mm', 'UV-protected, profile-matched', 'Covered width per matched metal profile', 'Daylight strips in metal roofs, transparent shed and utility roofs'],
];

const buyingRows = [
  ['Everyday skylight standard', '4 mm UV multiwall (the From-price base spec)'],
  ['Premium clarity choice', 'Solid 3 mm pergola pane / 5 mm feature canopy'],
  ['Daylight strips in metal roofs', '1.5 mm corrugated, profile-matched to the metal sheet — exact match only'],
  ['UV rule', 'Every quoted family is UV-protected as standard; UV face installed upward, marked on masking film; UV documentation confirmed at quotation'],
  ['Fixing rule', 'Pre-drilled oversized holes · EPDM-washer screws, snug not crushed · support spacing per thickness confirmed at quotation'],
  ['Multiwall sealing', 'Flutes down-slope · solid aluminium tape top edge · breathable tape bottom edge'],
  ['Cutting', 'Fine-tooth circular saw / jigsaw (solid, corrugated) · sharp utility knife (multiwall) · masking film on until fixed'],
  ['Not supplied', 'Acrylic roof sheets · FRP / transparent fibre sheets — polycarbonate is the SAMAN transparent family'],
  ['Price basis', 'Fixed ex-GST ₹/sq ft · GST, transport, unloading, accessories separate'],
];

const faqs = [
  {
    question: 'Which polycarbonate sheet is best for roofing?',
    answer:
      'Match the construction to the job: solid (2–5 mm) where clarity and looks lead — pergolas and entrance canopies; multiwall (4–10 mm) for everyday skylights, walkways and greenhouses — the best coverage per rupee; corrugated (1.5 mm, profile-matched) for daylight strips in metal roofs. For most buyers the 4 mm UV multiwall is the right starting spec.',
  },
  {
    question: 'How thick is a polycarbonate roof sheet?',
    answer:
      'Our range runs 1.5 mm (corrugated) through 2, 3 and 5 mm (solid) to 4, 6 and 10 mm (multiwall). Everyday skylights and walkways sit at 4–6 mm multiwall; pergola panes at 3–5 mm solid; large industrial skylights step up to 10 mm. Thickness follows span and wind exposure — we confirm support spacing at quotation.',
  },
  {
    question: 'Is a transparent roof sheet the same as a polycarbonate sheet?',
    answer:
      'In practice, yes — when Indian buyers search for a transparent roof sheet, polycarbonate is almost always the product behind the result. The exceptions are acrylic (brittle overhead) and transparent fibre sheets (a weaker material family) — we supply neither for roofing, so with us "transparent roof sheet" means UV-coated polycarbonate, stated plainly.',
  },
  {
    question: 'Does a polycarbonate roof make the room below hot?',
    answer:
      'A fully clear roof over an occupied space will heat it — the same physics that makes greenhouses warm. Use transparency deliberately: daylight bands rather than full clear roofs over sitting or working areas, multiwall rather than thin clear sheet where heat matters, and an insulated PUF panel roof with designed daylight openings when the requirement is a genuinely cool interior.',
  },
  {
    question: 'Why do polycarbonate sheets turn yellow?',
    answer:
      "Sun. Raw polycarbonate degrades under UV light — unprotected sheet in Indian sun yellows, hazes and turns brittle within a few years. Roofing grades carry a co-extruded UV-protective layer on the weather face; every family we quote is UV-protected as standard. The buyer's job is simply to confirm UV protection in writing and install the marked UV face upward.",
  },
  {
    question: 'How do you cut a polycarbonate roof sheet?',
    answer:
      'Solid and corrugated sheets cut cleanly with a fine-tooth circular saw or jigsaw; multiwall sheets cut with a sharp utility knife along a straightedge. Keep the masking film on while cutting and drilling — it prevents scratches and chip marks — and peel it only after the sheet is fixed.',
  },
  {
    question: 'How do you fix a polycarbonate sheet to a roof?',
    answer:
      'Pre-drill oversized holes so the sheet can expand and contract with heat, fix with EPDM-washer roofing screws snugged — never crushed — keep the UV face up, respect the support spacing for your thickness, and on multiwall run the flutes down-slope with solid tape on top edges and breathable tape at the bottom. Most cracked transparent roofs broke these rules, not the sheet.',
  },
  {
    question: 'What sizes do polycarbonate roofing sheets come in?',
    answer:
      'Solid: 1220 × 2440 mm and 2050 × 3050 mm panes. Multiwall: 1220 mm and 2100 mm widths. Corrugated: matched to the metal roofing profile it pairs with, so covered width follows the profile. Send your frame or roof dimensions and the quotation includes the pane plan and count.',
  },
  {
    question: 'Can polycarbonate sheets be used in a metal roof?',
    answer:
      'Yes — that is the single best use of the corrugated family. A 1.5 mm profile-matched corrugated polycarbonate sheet laps into a metal roof run like any other sheet — same overlap, same purlin lines — giving free daylight down every strip. The two non-negotiables: an exact profile match, and polycarbonate-correct fixing with oversized holes.',
  },
];

const relatedRail = getPolycarbonateRoofingSheetRail();

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/roofing-sheet/polycarbonate-roofing-sheet#product',
  name: 'Polycarbonate Roofing Sheet',
  description:
    'Polycarbonate roofing sheets factory-direct in India — UV-coated solid (2–5 mm), multiwall (4–10 mm) and profile-matched corrugated (1.5 mm) transparent sheets for skylights, pergolas, canopies, greenhouses and daylight strips in metal roofs, with honest thickness, heat and fixing guidance.',
  category: 'Roofing Sheet',
  sku: 'SP-C17-PCR-SUB-2026',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'UV-coated polycarbonate (solid, multiwall, corrugated)',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Thickness range', value: '1.5–10 mm' },
    { '@type': 'PropertyValue', name: 'Constructions', value: 'Solid, multiwall (twin-wall), corrugated profile-matched' },
    { '@type': 'PropertyValue', name: 'UV protection', value: 'Co-extruded UV layer on weather face, all families' },
    { '@type': 'PropertyValue', name: 'Sheet sizes', value: 'Solid 1220×2440 / 2050×3050 mm; multiwall 1220 / 2100 mm widths' },
  ],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: 66,
    offerCount: 7,
    availability: 'https://schema.org/InStock',
    url: 'https://www.samanportable.com/product/roofing-sheet/polycarbonate-roofing-sheet',
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
    { '@type': 'ListItem', position: 4, name: 'Polycarbonate Roofing Sheet', item: 'https://www.samanportable.com/product/roofing-sheet/polycarbonate-roofing-sheet' },
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
      <h2 className="text-xl font-bold text-slate-950">Get a polycarbonate roofing sheet quotation</h2>
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
        Or use the <strong>Send Enquiry</strong> form with your roof or frame dimensions, application (skylight / pergola / canopy / greenhouse / daylight strips) and site city — we return construction, thickness, UV documentation and a pane-count plan in writing.
      </p>
    </div>
  );
}

export default function PolycarbonateRoofingSheetPage() {
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
        <title>Polycarbonate Roofing Sheet — Solid, Multiwall &amp; Corrugated | SAMAN</title>
        <meta
          name="description"
          content="Polycarbonate roofing sheets factory-direct — UV-coated solid, multiwall and corrugated transparent sheets for skylights, pergolas, canopies and greenhouses. 1.5–10 mm with honest thickness, heat and fixing guidance. From ₹66/sq ft, pan-India."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Polycarbonate Roofing Sheet — Solid, Multiwall & Corrugated | SAMAN" />
        <meta
          property="og:description"
          content="Polycarbonate roofing sheets factory-direct — UV-coated solid, multiwall and corrugated transparent sheets for skylights, pergolas, canopies and greenhouses. 1.5–10 mm with honest thickness, heat and fixing guidance. From ₹66/sq ft, pan-India."
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
            <span className="font-semibold text-slate-950">Polycarbonate Roofing Sheet</span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_420px]">
            <aside className="order-3 hidden lg:order-none lg:block">
              <RelatedProductRail items={relatedRail} currentHref="/product/roofing-sheet/polycarbonate-roofing-sheet" scroll />
            </aside>

            <div className="order-1 lg:order-none">
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
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
              <div className="mt-4">
                <h2 className="mb-2 text-lg font-bold text-slate-950">Get a factory-direct quotation</h2>
                <ProductZoneCtas variant="strip" className="w-full" showPhoneNumber />
              </div>
            </div>

            <div className="order-2 flex flex-col justify-start lg:order-none">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                  <Factory className="h-4 w-4" />
                  ROOFING SHEETS
                </div>
                <h1 className="mt-5 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                  Polycarbonate Roofing Sheet — Solid, Multiwall and Corrugated, Chosen for Indian Sun
                </h1>
                <p className="mt-4 text-2xl font-bold text-emerald-700">From ₹66 / sq ft</p>
                <p className="mt-1 text-sm text-slate-500">4mm multiwall base spec · ex-GST · final price at quotation</p>
                <p className="mt-5 text-base leading-7 text-slate-700">
                  A polycarbonate roofing sheet is how you put daylight on a roof without putting glass over people's heads — a transparent sheet tough enough to walk a ladder over, light enough to fix to a simple frame. But "polycarbonate" covers three very different sheet constructions, and the wrong one — or the right one without UV coating — is the transparent roof that yellows, cracks or cooks the room below. This page compares solid, multiwall and corrugated the way we fit them on our own cabins and canopies, with the thickness, UV and fixing rules stated plainly.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {specGrid.map(([label, value], index) => (
                    <div key={label} className={`rounded-lg border border-slate-200 p-4 ${index === 0 ? 'sm:col-span-2' : ''}`}>
                      <p className="text-xs font-bold uppercase tracking-normal text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="font-semibold text-slate-950">SKU:</span> SP-C17-PCR-SUB-2026
                </div>
              </div>
            </div>

            <div className="order-3 lg:hidden">
              <RelatedProductRail items={relatedRail} currentHref="/product/roofing-sheet/polycarbonate-roofing-sheet" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="tablist" aria-label="Polycarbonate Roofing Sheet product tabs">
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
                <h2>Polycarbonate Roofing Sheet — Solid, Multiwall and Corrugated, Chosen for Indian Sun</h2>
                <p>
                  Every transparent roof in India has the same two enemies: sun and screws. Buy a polycarbonate roofing sheet without a UV layer and the sun turns it yellow and brittle; fix it like a metal sheet and your own screws crack it at the first hot afternoon. Both failures are avoidable at the moment of purchase — if someone tells you the truth about sheet types, thickness and fixing before you pay. That is what this page is for.
                </p>
                <blockquote>
                  <p><strong>Get a factory-direct polycarbonate roofing sheet quotation:</strong> South India +91 88616 22859 · sales@samanportable.com | North India / Delhi NCR +91 87960 39938 · ncr@samanportable.com</p>
                </blockquote>

                <h2>What is a polycarbonate roofing sheet?</h2>
                <p>
                  A polycarbonate roofing sheet is a transparent or translucent plastic sheet made from polycarbonate resin — the same material family used for safety glazing — formed either as a solid pane, a hollow multiwall panel or a corrugated profile, and fixed over a frame to make a light-transmitting roof. Compared with glass it is a fraction of the weight, far more impact-resistant and safe to install overhead on a simple steel or timber frame; compared with ordinary plastic film or unprotected sheet, a proper roofing grade carries a co-extruded UV-protective layer on the weather face, which is the single spec that decides whether the sheet is still clear in year eight or hazy in year two.
                </p>
                <p>
                  One naming note, because searches arrive here under several names: when Indian buyers say <strong>transparent roof sheet or transparent sheet for roof, polycarbonate is almost always the product they mean.</strong> Acrylic exists but is brittle overhead, and transparent fibre sheets are a different (and weaker) material family — we manufacture and supply neither for roofing; polycarbonate is our transparent family, and we say so plainly rather than blur the terms.
                </p>
              </div>

              <Figure image={bodyImages.supply} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Solid vs multiwall vs corrugated — the three constructions, decided honestly</h2>
                <p>Most pages selling a polycarbonate sheet for roof work never tell you there are three different constructions, let alone when each one is wrong. Here is the chooser we use on our own builds:</p>
              </div>
              <DataTable headers={['Construction', 'What it is', 'Choose it when', 'Skip it when']} rows={constructionRows} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <p>
                  The pattern to remember: <strong>solid for clarity, multiwall for coverage, corrugated for matching a profiled roof.</strong> All three families we supply are UV-protected roofing grades — that is a locked spec, not an optional extra.
                </p>
              </div>

              <Figure image={bodyImages.pergola} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Thickness — what each millimetre is actually for</h2>
                <p>
                  Transparent sheets run <strong>1.5 to 10 mm</strong> in our range, and the right answer follows the application, not the budget alone. The honest mapping: <strong>1.5 mm corrugated</strong> is purpose-made for profile-matched daylight strips and corrugated transparent roofs; <strong>2 mm solid</strong> suits light canopies and small covered openings; <strong>3 mm solid</strong> is the standard pergola and canopy pane; <strong>4 mm multiwall</strong> is the everyday skylight and walkway default — and the base spec behind our From-price; <strong>5 mm solid</strong> is the premium clarity choice for entrance canopies and feature roofs; <strong>6 mm multiwall</strong> steps up stiffness for wider support spacing; <strong>10 mm multiwall</strong> is the industrial answer — large skylights and spans where a thin sheet would drum and deflect. Support spacing depends on thickness, profile and wind exposure, so we confirm the span design at quotation rather than quoting a one-line rule that fails on your site.
                </p>

                <h2>UV coating — why cheap transparent sheets yellow in a few years</h2>
                <p>
                  This is the spec that separates a roofing-grade polycarbonate sheet from a bargain that becomes brittle confetti. Raw polycarbonate degrades under ultraviolet light: unprotected sheet exposed to Indian sun visibly yellows, loses clarity and turns brittle within a few years. Roofing grades solve this with a <strong>co-extruded UV-protective layer bonded to the weather face</strong> during manufacture — not a paint or film that peels, but part of the sheet itself. Two buying rules follow. First, ask in writing whether the sheet is UV-coated and on which face — every sheet family we quote is UV-protected as standard, and the UV documentation is confirmed with the quotation. Second, <strong>install the UV face up.</strong> The protected side is marked on the masking film; fit it downward and even a premium sheet ages like a cheap one. If a competing quote is much cheaper for the "same 4 mm sheet", the missing UV layer is the first place to look.
                </p>
              </div>

              <Figure image={bodyImages.skylight} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Light vs heat — the honest physics of a transparent roof</h2>
                <p>
                  Here is the sentence most sellers of transparent roofing will not write: <strong>a clear roof brings in daylight AND heat — that is the same physics that makes greenhouses work.</strong> Under full sun, a fully transparent roof over a sitting area or work floor turns it into the warm side of a greenhouse by afternoon. So specify transparency deliberately: use clear sheet where light is the whole point — greenhouses, plant areas, daylight strips over aisles and corridors; use it as a <strong>portion</strong> of the roof (a skylight band, not the whole roof) over occupied spaces; and remember multiwall's air flutes temper the effect compared with thin clear sheet, which is one more reason it is the everyday skylight default. And when the real requirement is a bright but genuinely cool interior — offices, cabins, work floors through an Indian summer — the honest answer is an insulated roof with designed daylight openings, not an all-transparent one; that insulated layer is <Link href="/product/puf-panel/puf-panel-roofing">PUF panel roofing we manufacture ourselves</Link>. Daylight is a design decision. We help you make it, not oversell it.
                </p>

                <h2>Where polycarbonate roofing works — skylights, pergolas, canopies, greenhouses</h2>
                <p>
                  <strong>Skylights and daylight strips:</strong> the highest-value use — a band of multiwall or profile-matched corrugated sheet set into an opaque roof cuts daytime lighting load exactly where work happens. <strong>Pergolas:</strong> solid 3 mm (or 5 mm for larger panes) keeps the open-sky feel while actually keeping rain off; the frame stays light because the sheet is a fraction of glass weight. <strong>Entrance and walkway canopies:</strong> solid or multiwall over mild-steel framing — the standard answer for buildings, shops and site walkways that need cover without darkness. <strong>Greenhouses and plant sheds:</strong> multiwall is the working choice — diffused light, lighter frames, and far more forgiving than glass around ladders and hail. <strong>Sheds and utility roofs:</strong> corrugated transparent sheet, either full-cover or as strips within a metal roof. Same three constructions everywhere — the application just changes which one leads.
                </p>
              </div>

              <Figure image={bodyImages.daylight} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Daylight strips inside a metal roof — the pairing nobody explains</h2>
                <p>
                  The most cost-effective daylighting in Indian industrial roofing is not a skylight unit — it is replacing every nth metal sheet with a <strong>1.5 mm corrugated polycarbonate sheet in the matching profile.</strong> Because our corrugated transparent sheets are profile-matched, they lap into the metal run like any other sheet: same overlap, same purlin line, no curbs, no flashing kits, no leak-prone transition. A shed that would need tube lights at noon gets free daylight down every strip line. Two rules make it work: match the profile exactly (a near-match profile is a guaranteed leak), and fix the polycarbonate strip with the oversized-hole method below, not like the steel around it. We supply the metal and transparent sheets together so profiles match by construction, and quote the strips as visible line items.
                </p>

                <h2>Fixing rules — the mistakes that crack transparent roofs</h2>
                <p>
                  The installation videos ranking for this product exist for a reason: most polycarbonate failures are fixing failures. The rules, plainly: <strong>(1) Pre-drill every hole oversized</strong> — polycarbonate expands and contracts with heat far more than steel, and a tight screw hole becomes a crack at the first hot afternoon; the oversized hole gives the sheet room to move around the screw. <strong>(2) Never over-tighten.</strong> Use self-drilling or self-tapping screws with EPDM-washer profiles made for sheet roofing, snugged just enough to seal — a crushed washer and a dimpled sheet is a leak and a future crack. <strong>(3) UV face up, always</strong> (it is marked on the masking film). <strong>(4) Support spacing per thickness</strong> — thin sheet over lazy purlin spacing drums in wind and sags in heat; we state the spacing for your sheet at quotation. <strong>(5) On multiwall, run the flutes down-slope and seal the ends properly</strong> — solid aluminium tape on the top edge, breathable tape at the bottom, so the flutes drain and never grow the grey algae line that ruins the look. <strong>Cutting</strong> is the easy part: a fine-tooth circular saw or jigsaw for solid and corrugated sheet, and multiwall cuts cleanly with a sharp utility knife; leave the masking film on while cutting and drilling, and peel it only after fixing.
                </p>
              </div>

              <Figure image={bodyImages.fixing} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Sizes and ordering — the simple math</h2>
                <p>
                  Solid sheets come as <strong>1220 × 2440 mm and 2050 × 3050 mm</strong> panes; multiwall sheets come in <strong>1220 mm and 2100 mm widths</strong>; corrugated transparent sheets follow the metal profile they match, so their covered width is the profile's covered width. For pergolas and canopies, plan panes to land joints on frame members — a joint in mid-air is a sag line. For daylight strips, count in whole profile widths. Send the frame or roof dimensions with your enquiry and the quotation comes back with a cutting-and-count plan, screws and tapes included as visible line items — the accessories are small money, but forgetting them stalls an installation for a week.
                </p>

                <h2>What decides the price</h2>
                <p>
                  Construction first — multiwall gives the lowest cost per covered foot, solid costs more for its clarity, corrugated sits between — then thickness, sheet size, quantity and delivery distance. The From ₹66/sq ft base is the 4 mm UV multiwall spec; the full transparent-sheet rate card joins the roofing price page when Phase 2 opens. GST, transport, unloading and accessories are always separate lines, per the fixed-rate policy on every SAMAN quotation, and there is no "UV extra" line — UV protection is standard in every family we quote, not an upsell.
                </p>

                <h2>Delivery and quotation</h2>
                <p>
                  Dispatch from Bangalore (South) and Greater Noida (North/NCR), 3–5 business days standard — <Link href="/delivery-policy">Delivery Policy</Link>. Sheets travel flat or in supplier packing with masking film on; leave the film on until fixed. UV documentation and span/support guidance are confirmed in writing at quotation, and returns follow the <Link href="/refund-and-return-policy">Refund &amp; Return Policy</Link>. Supply-only unless stated otherwise.
                </p>

                <h2>Why buy polycarbonate roofing sheets from SAMAN</h2>
                <p>
                  Because we install what we sell. Our cabins, canopies and prefab structures use these exact sheets, so the guidance above is not catalogue copy — it is the checklist our own teams follow. We will tell you when solid is worth the premium and when it is not, when a transparent roof will overheat your space and how to use strips instead, and we put UV grade, thickness, sheet count and every accessory on the quotation in the open. And we keep the family honest: no acrylic or transparent fibre sheets sold as "same thing" — polycarbonate is the transparent roof we stand behind. To see how it compares against metal and every other roof sheet family, start at <Link href="/product/roofing-sheet">the roofing sheet selection guide</Link>.
                </p>
              </div>

              <QuoteBlock />
            </div>

            <div hidden={activeTab !== 'specifications'} role="tabpanel">
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h2>Polycarbonate Roofing Sheet Technical Specifications</h2>
              </div>
              <Figure image={specImages.crossSection} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h3>Construction engineering matrix</h3>
              </div>
              <DataTable headers={['Construction', 'Thickness options', 'UV protection', 'Sheet size / width', 'Typical applications']} rows={engineeringRows} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h3>Buying rules (owner-locked)</h3>
              </div>
              <DataTable headers={['Rule', 'Value']} rows={buyingRows} />
              <Figure image={specImages.ladder} />
              <Figure image={specImages.fixing} />
            </div>

            <div hidden={activeTab !== 'reviews'} role="tabpanel">
              <ProductReviews reviews={[]} averageRating="0.00" ratingCount={0} productId={wcReviewProductId} productName="Polycarbonate Roofing Sheet" />
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
                ['UV stated upfront', 'UV face, thickness and construction confirmed at quotation.'],
                ['Fixing rules included', 'Oversized holes, EPDM washers, support spacing and tapes listed.'],
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
