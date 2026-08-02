/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProductReviews from '@/components/ProductReviews';
import RelatedProductRail from '@/components/product/RelatedProductRail';
import ProductZoneCtas from '@/components/product/ProductZoneCtas';
import { getMetalRoofingSheetRail } from '@/lib/c16PanelCatalog';
import { CheckCircle, Factory, Truck } from 'lucide-react';

const baseImagePath = '/panel-images/metal-roofing-sheet/';
const canonicalUrl = 'https://www.samanportable.com/product/roofing-sheet/metal-roofing-sheet';
const wcReviewProductId = 272773;

const galleryImages = [
  {
    src: `${baseImagePath}metal-roofing-sheet-colour-stack.webp`,
    alt: 'Stack of colour-coated metal roofing sheets in multiple colours',
    caption: 'PPGL colour sheet stacks, GI corrugated, trapezoidal, tile and standing seam profiles supplied factory-direct.',
  },
  {
    src: `${baseImagePath}metal-roofing-sheet-gi-corrugated-texture.webp`,
    alt: 'Galvanized GI corrugated metal roofing sheet close-up',
    caption: 'GI corrugated zinc spangle and wave profile.',
  },
  {
    src: `${baseImagePath}metal-roofing-sheet-trapezoidal-profile.webp`,
    alt: 'Trapezoidal profile metal roofing sheet in colour-coated steel',
    caption: 'Trapezoidal PPGL rib geometry.',
  },
  {
    src: `${baseImagePath}metal-roofing-sheet-tile-profile.webp`,
    alt: 'Tile profile metal roofing sheet section',
    caption: 'Tile profile colour-coated steel for home elevations.',
  },
  {
    src: `${baseImagePath}metal-roofing-sheet-standing-seam-detail.webp`,
    alt: 'Standing seam metal roofing sheet joint with concealed fixing',
    caption: 'Standing seam concealed-fix joint detail.',
  },
];

const bodyImages = {
  yard: {
    src: `${baseImagePath}metal-roofing-sheet-supply-yard.webp`,
    alt: 'Metal roofing sheet types stocked at SAMAN supply yard',
  },
  factory: {
    src: `${baseImagePath}colour-coated-metal-sheet-factory-roof.webp`,
    alt: 'Colour-coated PPGL metal roofing sheets on a factory roof',
  },
  screws: {
    src: `${baseImagePath}metal-roofing-sheet-installation-screws.webp`,
    alt: 'Installing metal roofing sheets with self-drilling screws',
  },
  utility: {
    src: `${baseImagePath}gi-corrugated-sheet-utility-shed.webp`,
    alt: 'GI corrugated metal roofing sheet on a utility shed',
  },
  villa: {
    src: `${baseImagePath}tile-profile-metal-sheet-villa-roof.webp`,
    alt: 'Tile profile metal roofing sheet on a residential villa',
  },
};

const specImages = {
  families: {
    src: `${baseImagePath}metal-sheet-four-families-coating-diagram.webp`,
    alt: 'GI vs Galvalume vs PPGI vs PPGL coating layers diagram',
  },
  gauge: {
    src: `${baseImagePath}metal-sheet-gauge-application-ladder-diagram.webp`,
    alt: 'Metal roofing sheet gauge selection ladder',
  },
  fastener: {
    src: `${baseImagePath}metal-sheet-fastener-overlap-detail-diagram.webp`,
    alt: 'Metal roofing sheet fastener and overlap detail',
  },
};

const specGrid = [
  ['SIZE', 'Steel 0.30–1.00 mm BMT · widths 910–1220 mm · length cut to order'],
  ['MATERIAL', 'GI/GC · Galvalume · PPGI · PPGL · premium coated · aluminium · SS 304'],
  ['DELIVERY', '3–5 day dispatch'],
  ['COVERAGE', 'Bangalore · Delhi NCR'],
  ['BRAND', 'SAMAN Portable'],
];

const familyRows = [
  ['GI / GC (galvanized)', 'Steel + zinc coating (Z80–Z275), bare finish', 'Lowest-cost workhorse: utility sheds, boundary roofs, back-of-plot structures', 'The roof is visible or coastal, zinc alone ages faster'],
  ['Bare Galvalume (Aluzinc)', 'Steel + aluminium-zinc coating (AZ100–AZ150), bare finish', 'Longer life than GI at bare-metal cost; better corrosion resistance', "You want colour, that's PPGL for a small step up"],
  ['PPGI (colour-coated GI)', 'GI + primer + colour coat', 'Colour on a budget: shops, homes, light commercial', 'Coastal or long-life demands, the base is still zinc-only'],
  ['PPGL (colour-coated Galvalume)', 'Galvalume + primer + colour coat, AZ150 preferred', 'The default we recommend: homes, factories, anything people see or work under', 'Strictly lowest-cost utility work'],
];

const engineeringRows = [
  ['GI / GC galvanized', '0.30 / 0.35 / 0.40 / 0.45 / 0.50 / 0.60 / 0.80 / 1.00 mm BMT', 'Z80–Z275 zinc', 'Natural zinc spangle, paintable', '910 / 1220 mm, length cut to order', 'IS 277, ASTM A653, IS 459 profile'],
  ['Bare Galvalume / Aluzinc', '0.35 / 0.45 / 0.50 mm TCT', 'AZ100–AZ150 Al-Zn', 'Bare metallic', '1000–1070 mm cover after profiling', 'ASTM A792 class'],
  ['PPGI colour-coated', '0.35 / 0.40 / 0.45 / 0.50 mm TCT', 'Z80–Z180 + primer + 15–25 µm colour coat', 'Full colour range', '1000–1070 mm cover', 'IS 14246 class'],
  ['PPGL colour-coated', '0.35 / 0.40 / 0.45 / 0.50 / 0.60 mm TCT', 'AZ100–AZ200 + 20–25 µm colour coat', 'Full colour range', 'Full width 1070–1220 mm; cover ~1000–1070 mm', 'ASTM A792 + paint class'],
  ['Premium coated steel', '0.47 / 0.50 mm TCT', 'AZ150 + SDP/PVDF premium paint', 'Premium colour systems', 'Full 1070 mm / covered ~1010 mm; 8–24 ft lengths', 'Brand systems'],
  ['Tile profile steel', '0.45 / 0.50 mm TCT', 'AZ150 preferred + colour coat', 'Tile-look colour', 'Profile-specific cover', 'Profile standards'],
  ['Standing seam / concealed fix', '0.50 mm TCT', 'AZ150 + premium paint', 'No exposed fasteners', 'Roll-formed long lengths', 'System standards'],
  ['Curved / crimped', '0.50 mm TCT', 'AZ150 + colour coat', 'Colour, factory-curved', 'Radius per site design', 'Profile standards'],
  ['Aluminium corrugated', '0.70 mm', 'Mill / anodized / colour', 'Metallic or colour', 'Supplier profile', 'Aluminium class'],
  ['Stainless SS 304', '0.50 mm', 'Passivated', 'Stainless', 'Supplier profile', 'SS 304'],
  ['GI decking', '0.80 / 1.00 mm BMT', 'Z120 / Z275', 'Structural deck', 'Profile depth 44–75 mm; cover 900–1000 mm', 'Deck standards'],
];

const buyingRows = [
  ['Everyday standard', '0.50 mm PPGL colour, AZ150 preferred'],
  ['Economy standard', '0.50 mm GI/GC, Z275 where available'],
  ['Thickness truth', 'Quotes state BOTH TCT and BMT; strength = BMT'],
  ['Zinc classes (GI)', 'Z80 economy → Z120 standard → Z180 heavy → Z275 industrial'],
  ['Aluzinc classes', 'AZ100 economy → AZ150 standard → AZ200 premium'],
  ['Paint systems', 'RMP/SMP polyester standard · SDP/PVDF premium; warranties brand-backed, confirmed at quotation'],
  ['Fasteners', 'Self-drilling screws with EPDM washers, length per purlin; quoted as separate line items with ridge/flashing/gutters'],
  ['Brands', 'Tata / JSW / SAIL or equivalent approved, stated on quotation'],
  ['Price basis', 'Fixed ex-GST ₹/sq ft; GST, transport, unloading, accessories separate'],
];

const faqs = [
  {
    question: 'Which metal sheet is best for roofing?',
    answer:
      'For most Indian buildings: 0.50 mm PPGL colour-coated sheet with AZ150 coating. The best life-to-cost balance, and our locked standard recommendation. Pure economy work does fine with 0.50 mm GI; coastal sites step up to aluminium or heavier AZ coatings.',
  },
  {
    question: 'Is a tin sheet the same as a GI sheet?',
    answer:
      'Effectively yes. "Tin sheet" is the everyday Indian name for galvanized corrugated steel: there is no actual tin in it. If your requirement or old quote says tin sheet, the GI/GC family on this page is the same product with its real name.',
  },
  {
    question: 'What is the difference between GI and Galvalume roofing sheets?',
    answer:
      'The coating. GI is zinc-coated steel; Galvalume is coated with an aluminium-zinc alloy that resists corrosion longer at similar cost. Bare-for-bare, Galvalume generally outlasts GI, which is why our colour-coated default (PPGL) is built on the Galvalume base.',
  },
  {
    question: 'What thickness of metal roofing sheet should I use?',
    answer:
      '0.50 mm BMT is the everyday default for homes, shops and factories. Light utility work can drop to 0.40–0.45 mm; industrial roofs and decking run 0.60–1.00 mm. Always confirm whether a quoted thickness is TCT or BMT, strength lives in the BMT.',
  },
  {
    question: 'How wide is a metal roofing sheet?',
    answer:
      'Corrugated GI comes 910 or 1220 mm flat; profiled colour sheets cover about 1000–1070 mm after overlap. Order using covered width, not flat width, and get length cut to your roof so joints are minimal.',
  },
  {
    question: 'How many screws per sheet of metal roofing?',
    answer:
      'Plan roughly one self-drilling screw per rib at every purlin line. The exact count depends on profile and purlin spacing. What matters as much as the count: EPDM-washer screws, correct length, driven straight. Our quotations list fastener quantities explicitly.',
  },
  {
    question: 'How do I reduce heat from a metal sheet roof?',
    answer:
      'First step: a light-colour PPGL sheet, which reflects meaningfully more sun than bare metal. But no single-skin sheet insulates. For genuinely cooler interiors, the answer is an insulated PUF panel roof, which we also manufacture and will recommend honestly when your use case needs it.',
  },
  {
    question: 'Do you supply Tata or JSW metal roofing sheets?',
    answer:
      "We supply ISI-marked material from Tata, JSW, SAIL or equivalent approved brands, per category, and we state the brand and standard on the quotation itself. What we don't do is charge a mystery premium for a name: you see the brand, the coating class and both thickness numbers before you pay.",
  },
];

const relatedRail = getMetalRoofingSheetRail();

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/roofing-sheet/metal-roofing-sheet#product',
  name: 'Metal Roofing Sheet',
  description:
    'Metal roofing sheets factory-direct in India: GI/GC galvanized, bare Galvalume, colour-coated PPGI and PPGL, premium coated, tile profile, standing seam, aluminium and stainless options, 0.30–1.00 mm, with TCT/BMT and coating class stated on every quotation.',
  category: 'Roofing Sheet',
  sku: 'SP-C17-MRS-SUB-2026',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Galvanized steel, Galvalume steel, colour-coated steel (PPGI/PPGL), aluminium, stainless steel',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Thickness range', value: '0.30–1.00 mm BMT' },
    { '@type': 'PropertyValue', name: 'Coating classes', value: 'Z80–Z275 zinc / AZ100–AZ200 Aluzinc' },
    { '@type': 'PropertyValue', name: 'Profiles', value: 'Corrugated, trapezoidal, tile, standing seam, curved, decking' },
    { '@type': 'PropertyValue', name: 'Width', value: '910–1220 mm, length cut to order' },
  ],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: 58,
    offerCount: 30,
    availability: 'https://schema.org/InStock',
    url: 'https://www.samanportable.com/product/roofing-sheet/metal-roofing-sheet',
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
    { '@type': 'ListItem', position: 4, name: 'Metal Roofing Sheet', item: 'https://www.samanportable.com/product/roofing-sheet/metal-roofing-sheet' },
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
      <h2 className="text-xl font-bold text-slate-950">Get a metal roofing sheet quotation</h2>
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
        Or use the <strong>Send Enquiry</strong> form with your building size, use, preferred colour and site city. We return gauge, coating and both thickness numbers in writing.
      </p>
    </div>
  );
}

export default function MetalRoofingSheetPage() {
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
        <title>Metal Roofing Sheet: GI, Galvalume, PPGI &amp; PPGL Sheets | SAMAN</title>
        <meta
          name="description"
          content="Metal roofing sheets factory-direct: GI/GC, bare Galvalume, colour-coated PPGI and PPGL, tile and standing seam profiles, 0.30–1.00 mm with honest TCT/BMT and coating-class guidance. From ₹58/sq ft, pan-India."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Metal Roofing Sheet: GI, Galvalume, PPGI & PPGL Sheets | SAMAN" />
        <meta
          property="og:description"
          content="Metal roofing sheets factory-direct: GI/GC, bare Galvalume, colour-coated PPGI and PPGL, tile and standing seam profiles, 0.30–1.00 mm with honest TCT/BMT and coating-class guidance. From ₹58/sq ft, pan-India."
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
            <span className="font-semibold text-slate-950">Metal Roofing Sheet</span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_420px]">
            {/* T28.5 v2 — universal height rule: the gallery column's natural height
                drives the hero row; the rail is contained to it and scrolls
                internally on overflow. */}
            <aside className="order-3 hidden lg:relative lg:order-none lg:block lg:min-h-0">
              <div className="t28-rail-scroll lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">
                <RelatedProductRail items={relatedRail} currentHref="/product/roofing-sheet/metal-roofing-sheet" className="lg:h-auto lg:min-h-full" scroll />
              </div>
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

            <div className="order-2 flex flex-col justify-start lg:order-none lg:relative lg:min-h-0">
              {/* T28.5 v2 — description contained to the gallery-driven row height;
                  scrolls in-column when longer (visible thin scrollbar). */}
              <div className="t28-rail-scroll lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                  <Factory className="h-4 w-4" />
                  ROOFING SHEETS
                </div>
                <h1 className="mt-5 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                  Metal Roofing Sheet: GI, Galvalume and Colour-Coated Steel, Compared Honestly
                </h1>
                <p className="mt-4 text-2xl font-bold text-emerald-700">From ₹58 / sq ft</p>
                <p className="mt-1 text-sm text-slate-500">0.30mm GI base spec · ex-GST · final price at quotation</p>
                <p className="mt-5 text-base leading-7 text-slate-700">
                  A metal roofing sheet is the workhorse roof of India: steel or aluminium, profiled for strength, screwed onto purlins, done in a day. But "metal sheet" covers four different steel families and a dozen specs, and that's where quotes go wrong. This page compares GI, bare Galvalume, PPGI and PPGL the way we specify them on our own buildings. With the gauge, coating class and TCT/BMT stated plainly, so you can compare any two quotes and know which one is actually cheaper.
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
                  <span className="font-semibold text-slate-950">SKU:</span> SP-C17-MRS-SUB-2026
                </div>
              </div>
              </div>
            </div>

            <div className="order-3 lg:hidden">
              <RelatedProductRail items={relatedRail} currentHref="/product/roofing-sheet/metal-roofing-sheet" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="tablist" aria-label="Metal Roofing Sheet product tabs">
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
                <h2>Metal Roofing Sheet: GI, Galvalume and Colour-Coated Steel, Compared Honestly</h2>
                <p>
                  A metal roofing sheet should be the simplest thing you buy for a building. It isn't, because "0.50 mm metal sheet" can mean four different steels, three coating classes and two ways of measuring thickness, and every seller quotes the version that suits them. Here is the whole metal family, specified the way we install it ourselves.
                </p>
                <blockquote>
                  <p><strong>Get a factory-direct metal roofing sheet quotation:</strong> South India +91 88616 22859 · sales@samanportable.com | North India / Delhi NCR +91 87960 39938 · ncr@samanportable.com</p>
                </blockquote>

                <h2>What is a metal roofing sheet?</h2>
                <p>
                  A metal roofing sheet is a thin steel or aluminium sheet, roll-formed into a profile, corrugated waves, trapezoidal ribs, tile shapes, and fixed over purlins with self-drilling screws to form the finished roof. The profile gives the thin metal its stiffness; the coating gives it its life. And a note on names: what most of India calls a <strong>tin sheet or tin roof is not tin at all, it is galvanized steel (GI)</strong>. The word survives from an older era; the material under it is the same GI family on this page, so if your requirement says "tin sheet," you're in the right place.
                </p>
              </div>

              <Figure image={bodyImages.yard} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>GI vs Galvalume vs PPGI vs PPGL: the four steel families, decided honestly</h2>
                <p>This is the decision that matters, and no ranking page makes it plainly:</p>
              </div>
              <DataTable headers={['Family', 'What it is', 'Choose it when', 'Skip it when']} rows={familyRows} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <p>
                  The pattern to remember: <strong>Galvalume base outlasts GI base; colour coat protects and finishes either.</strong> Our locked standards: everyday roof = 0.50 mm PPGL colour with AZ150; economy roof = 0.50 mm GI with Z275 where available. Beyond these four sit the specialists, <strong>aluminium</strong> (0.70 mm, coastal and corrosive sites), <strong>stainless SS 304</strong> (food and process buildings), and heavy <strong>GI decking</strong> (0.80–1.00 mm for composite floor/roof decks).
                </p>
              </div>

              <Figure image={bodyImages.factory} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Gauge: which thickness your roof actually needs</h2>
                <p>
                  Steel roof sheets run <strong>0.30 to 1.00 mm BMT</strong>, and thicker is not automatically better, it's heavier and costlier. The honest mapping: 0.30–0.35 mm for light economy and temporary work; 0.40–0.45 mm as the practical utility standard; <strong>0.50 mm as the everyday default</strong> for homes, shops and factories (the gauge that walks without denting); 0.60 mm heavy duty; 0.80–1.00 mm for industrial roofs and decking. Marketplace listings that say "0.3–0.5 mm depending on stock" are exactly the ambiguity to avoid. A quote should state one gauge, and ours do.
                </p>

                <h2>TCT vs BMT and coating class: how metal quotes hide their differences</h2>
                <p><strong>Thickness:</strong> TCT (Total Coated Thickness) includes the zinc/aluzinc coating and paint; <strong>BMT (Base Metal Thickness) is the steel alone, and strength lives in the BMT.</strong> A 0.50 mm TCT sheet carries visibly less steel than a 0.50 mm BMT sheet. Every SAMAN quotation states both numbers.</p>
                <p><strong>Coating class:</strong> on GI, zinc runs Z80 (light economy) → Z120 (preferred standard) → Z180 (heavy) → Z275 (industrial). On Galvalume, AZ100 (economy) → AZ150 (our preferred standard) → AZ200 (premium). Same gauge, different coating class = different product, different life, different fair price.</p>
                <p><strong>Paint system:</strong> standard polyester (RMP/SMP, 15–25 µm) versus premium SDP/PVDF, identical on day one, very different at year eight. Coating and paint warranties are brand-backed and confirmed with documents at quotation.</p>
                <p>When a competitor's quote is suspiciously cheaper for the "same sheet", the difference is hiding in one of these three lines. Ask for all three numbers: from anyone, including us.</p>
              </div>

              <Figure image={bodyImages.screws} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Profiles: corrugated, trapezoidal, tile, standing seam, curved</h2>
                <p>
                  <strong>Corrugated</strong> (the classic wave) is the economical, familiar profile for utility roofs. <strong>Trapezoidal</strong> ribs span further and shed water faster, the standard for sheds and factories. <strong>Tile profile</strong> turns steel into a home elevation, the design choice for villas and resorts. <strong>Standing seam / concealed-fix</strong> eliminates exposed screw holes entirely. The premium answer for leak-critical and long-span roofs, installed with clips and skilled hands. <strong>Crimped curved</strong> sheets form canopies and arches. Same steel families throughout: the profile changes the look, the span and the fixing method, not the metallurgy.
                </p>
                <p>And the fixing reality most pages skip: exposed-fastener profiles are only as waterproof as their screws: self-drilling screws with EPDM washers, correct length for the purlin, driven straight and not over-tightened. We quote fasteners and flashings as visible line items, never buried.</p>

                <h2>Heat: what a metal sheet can and cannot do</h2>
                <p>
                  A light-colour PPGL sheet genuinely reflects more sun than bare metal, and it's the right first step against heat. But a single-skin metal sheet <strong>cannot insulate</strong>, it slows nothing once heat is through. If the requirement is a genuinely cooler interior, work floors, offices, anything occupied through an Indian summer, the correct product is an insulated panel roof, and we make those too: see our <Link href="/product/puf-panel/puf-panel-roofing">PUF roof panels built for heat control</Link>. Honest sequencing: colour first, insulation when the requirement is real.
                </p>
              </div>

              <Figure image={bodyImages.utility} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Sizes, coverage and screws: the ordering math</h2>
                <p>
                  Corrugated GI comes 910/1220 mm wide; profiled colour sheets cover roughly 1000–1070 mm after overlap; lengths are cut to order so long roofs take fewer joints. Count with <strong>covered width</strong> (never flat width): roof length ÷ covered width, rounded up, per side. Screws: plan roughly one per rib per purlin line: the exact count depends on profile and purlin spacing, and our quotation lists screws, ridge, flashings and gutters as separate items so nothing surprises you on site. These sheets also pair naturally with structural work, for complete steel buildings, see our <Link href="/product/industrial-sheds">industrial shed structures we fabricate</Link>.
                </p>

                <h2>What decides the price</h2>
                <p>
                  Family first (GI cheapest → Galvalume → PPGI → PPGL → premium/tile/standing seam → aluminium → stainless), then gauge, coating class, paint system, profile, length and quantity: accessories, GST, transport and unloading always separate. The From ₹58/sq ft base is the 0.30 mm GI economy spec; the full metal rate card lives on the roofing price page when Phase 2 opens. Send your building size and use, and the quotation comes back with gauge, coating, TCT and BMT all stated.
                </p>

                <h2>Delivery, brands and quotation</h2>
                <p>
                  Dispatch from Bangalore (South) and Greater Noida (North/NCR), 3–5 business days standard, <Link href="/delivery-policy">Delivery Policy</Link>. Material is ISI-marked and brand-backed, Tata, JSW, SAIL or equivalent approved brands per category, with the brand and standard (IS 277, IS 459 profiles, ASTM A653/A792 class) stated on the quotation and coating warranties confirmed with brand documents at quotation. Returns per the <Link href="/refund-and-return-policy">Refund &amp; Return Policy</Link>. Supply-only unless stated otherwise.
                </p>

                <h2>Why buy metal roofing sheets from SAMAN</h2>
                <p>
                  We are not a trading counter. We build with these sheets every week on our own cabins, sheds and prefab structures. That's why our recommendation engine is simple and honest: the gauge that survives site handling, the coating class that matches your city's air, the profile that suits the span, both thickness numbers on paper, and every accessory priced in the open. To see how metal compares against every other roof sheet material, start at <Link href="/product/roofing-sheet">the complete roofing sheet comparison</Link>.
                </p>
              </div>

              <Figure image={bodyImages.villa} />
              <QuoteBlock />
            </div>

            <div hidden={activeTab !== 'specifications'} role="tabpanel">
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h2>Metal Roofing Sheet Technical Specifications</h2>
              </div>
              <Figure image={specImages.families} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h3>Steel family engineering matrix</h3>
              </div>
              <DataTable headers={['Family', 'Thickness options', 'Coating', 'Finish', 'Width / cover', 'Standards']} rows={engineeringRows} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h3>Buying rules (owner-locked)</h3>
              </div>
              <DataTable headers={['Rule', 'Value']} rows={buyingRows} />
              <Figure image={specImages.gauge} />
              <Figure image={specImages.fastener} />
            </div>

            <div hidden={activeTab !== 'reviews'} role="tabpanel">
              <ProductReviews reviews={[]} averageRating="0.00" ratingCount={0} productId={wcReviewProductId} productName="Metal Roofing Sheet" />
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
                ['Both-number quotes', 'Gauge, coating, TCT and BMT stated in writing.'],
                ['Accessories visible', 'Screws, ridges, flashings and gutters listed separately.'],
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
