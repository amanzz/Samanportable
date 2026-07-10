/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import RelatedProductRail from '@/components/product/RelatedProductRail';
import { getC16PanelSiblingRail } from '@/lib/c16PanelCatalog';
import { Factory, Mail, Phone, Truck } from 'lucide-react';

const baseImagePath = '/panel-images/sandwich-panel/';
const canonicalUrl = 'https://www.samanportable.com/product/sandwich-panel';
const relatedRail = getC16PanelSiblingRail('sandwich-panel');

const galleryImages = [
  {
    src: `${baseImagePath}sandwich-panel-stack-facing-finishes.webp`,
    alt: 'Stack of new SAMAN sandwich panels showing steel facings and insulated core edges',
    title: 'Stack of new SAMAN sandwich panels showing steel facings and insulated core edges',
    caption: 'Factory-made sandwich panels in multiple facing finishes, ready for dispatch.',
  },
  {
    src: `${baseImagePath}sandwich-panel-core-edge-detail.webp`,
    alt: 'Close-up of a sandwich panel cut edge showing steel facings bonded to the core',
    title: 'Close-up of a sandwich panel cut edge showing steel facings bonded to the core',
    caption: 'The three-layer build — steel facing, insulated core, steel facing — at the panel edge.',
  },
  {
    src: `${baseImagePath}sandwich-panel-wall-installed.webp`,
    alt: 'Insulated sandwich panel walls installed on a light commercial building',
    title: 'Insulated sandwich panel walls installed on a light commercial building',
    caption: 'Sandwich panels as a finished, insulated external wall.',
  },
  {
    src: `${baseImagePath}sandwich-panel-roof-installed.webp`,
    alt: 'Insulated sandwich panel roof on an industrial shed with profiled facing',
    title: 'Insulated sandwich panel roof on an industrial shed with profiled facing',
    caption: 'Profiled sandwich panel roofing keeping heat out of an industrial shed.',
  },
  {
    src: `${baseImagePath}sandwich-panel-cold-room-interior.webp`,
    alt: 'Cold room interior built from insulated sandwich panels with cam-lock joints',
    title: 'Cold room interior built from insulated sandwich panels with cam-lock joints',
    caption: 'Sandwich panels forming an airtight cold-room envelope.',
  },
];

const inBodyImages = {
  anatomy: {
    src: `${baseImagePath}sandwich-panel-anatomy-three-layer-diagram.webp`,
    alt: 'Labelled diagram of a sandwich panel showing the two steel facing sheets and the insulating core',
    title: 'Sandwich panel anatomy — facing, core, facing',
    caption: 'The three-layer build that gives a sandwich panel structure and insulation together.',
  },
  coreComparison: {
    src: `${baseImagePath}types-of-sandwich-panel-core-comparison-diagram.webp`,
    alt: 'Comparison chart of five sandwich panel cores — PUF, PIR, EPS, Rockwool, Glass Wool — by thermal, fire, acoustic and cost positioning',
    title: 'Five sandwich panel cores compared',
    caption: 'Five cores at a glance — pick by thermal, fire, acoustic and cost need.',
  },
  jointTypes: {
    src: `${baseImagePath}sandwich-panel-joint-types-tongue-groove-camlock-diagram.webp`,
    alt: 'Diagram comparing a tongue-and-groove wall joint and a cam-lock cold-room joint on sandwich panels',
    title: 'Sandwich panel joint types — tongue-and-groove and cam-lock',
    caption: 'How panels lock together — tongue-and-groove for walls, cam-lock for cold rooms.',
  },
  manufacturing: {
    src: `${baseImagePath}sandwich-panel-manufacturing-line-india.webp`,
    alt: 'Sandwich panel production line in an Indian factory bonding facings to the core',
    title: 'Sandwich panel production line in an Indian factory bonding facings to the core',
    caption: 'Facings and core bonded and cured into one continuous board on our line.',
  },
  quality: {
    src: `${baseImagePath}sandwich-panel-quality-check-thickness.webp`,
    alt: 'Quality inspector measuring sandwich panel thickness and edge profile at the factory',
    title: 'Quality inspector measuring sandwich panel thickness and edge profile at the factory',
    caption: 'Every batch checked for facing gauge, thickness, core and joint profile.',
  },
  roof: {
    src: `${baseImagePath}insulated-sandwich-panel-warehouse-roof.webp`,
    alt: 'Insulated sandwich roof panels being installed on an Indian warehouse',
    title: 'Insulated sandwich roof panels being installed on an Indian warehouse',
    caption: 'Insulated roof panels going up fast on a warehouse roof.',
  },
  wall: {
    src: `${baseImagePath}sandwich-panel-wall-cladding-site.webp`,
    alt: 'Workers installing insulated sandwich wall panels on a light industrial building',
    title: 'Workers installing insulated sandwich wall panels on a light industrial building',
    caption: 'Wall panels close the building envelope in one fixing step.',
  },
  dispatch: {
    src: `${baseImagePath}sandwich-panel-dispatch-loading-truck.webp`,
    alt: 'Bundled sandwich panels loaded onto a truck for pan-India dispatch',
    title: 'Bundled sandwich panels loaded onto a truck for pan-India dispatch',
    caption: 'Panels bundled and dispatched from the nearer of our two factories.',
  },
};

const faqs = [
  {
    question: 'What is a sandwich panel?',
    answer:
      'A sandwich panel is a three-layer insulated board: two steel facing sheets bonded to a lightweight insulating core. The facings give strength and finish; the core gives insulation. Because the board is finished on both faces, it forms a wall or roof in a single fixing step.',
  },
  {
    question: 'What are sandwich panels made of?',
    answer:
      "Two steel facing sheets — PPGI, PPGL, BGL, stainless steel, aluminium or craft paper — bonded to an insulating core. The core is one of five materials: PUF, PIR, EPS, Rockwool or Glass Wool, and the core is what sets the panel's thermal, fire and acoustic behaviour.",
  },
  {
    question: 'What are the types of sandwich panels?',
    answer:
      'By core, there are five: PUF (polyurethane, the all-round thermal default), PIR (premium fire-and-heat), EPS (budget and lightweight), Rockwool (mineral fire and acoustic) and Glass Wool (acoustic and thermal). SAMAN manufactures all five. The right one depends on your cost, thermal, fire and noise needs.',
  },
  {
    question: 'How do I choose the right sandwich panel core?',
    answer:
      'Start from the problem. Budget-led light-duty walls suit EPS; cabins, cladding and cold rooms suit PUF; fire clauses and high heat suit PIR or Rockwool; noise control suits Rockwool or Glass Wool. Send us your temperature, fire or acoustic requirement and we will confirm the core and thickness.',
  },
  {
    question: 'What thickness do sandwich panels come in?',
    answer:
      "Standard thicknesses run 30 to 150 mm, with 110–200 mm made to order on advance payment. Thicker panels insulate more but cost and weigh more, so thickness is matched to the job. Exact thickness lists and rates are on each material's page.",
  },
  {
    question: 'Are sandwich panels good for both roofs and walls?',
    answer:
      'Yes. The same core is made as a wall panel and a roof panel; the difference is the facing profile and the joint. Roof panels use a profiled, weather-lapped top; wall panels use a flatter profile with a tongue-and-groove joint. Cold rooms use a cam-lock joint.',
  },
  {
    question: 'Do you manufacture sandwich panels in India?',
    answer:
      'Yes. SAMAN manufactures sandwich panels at two factories — Bangalore for South India and Greater Noida for North India and Delhi NCR — and dispatches pan-India. Buying from the manufacturer means the core, facing, thickness and length are matched to your job, not to warehouse stock.',
  },
  {
    question: 'What is the difference between PUF, PIR and mineral-wool sandwich panels?',
    answer:
      'PUF and PIR are foam cores: PUF is the cost-effective thermal all-rounder, PIR adds fire performance and higher service temperature. Rockwool and Glass Wool are mineral cores that add fire resistance and acoustic control. EPS is the budget foam. Exact tested values are on each material page and confirmed at quotation.',
  },
];

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/sandwich-panel#product',
  name: 'Sandwich Panel',
  description:
    'Insulated sandwich panel by SAMAN — two steel facing sheets bonded to an insulating core, manufactured in five cores (PUF, PIR, EPS, Rockwool, Glass Wool) for wall, roof, cabin and cold-room use. Made in Bangalore and Greater Noida.',
  category: 'Insulated Sandwich Panel',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Steel facing sheets with insulating core (PUF / PIR / EPS / Rockwool / Glass Wool)',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Construction', value: 'Three-layer: steel facing / insulating core / steel facing' },
    { '@type': 'PropertyValue', name: 'Core options', value: 'PUF, PIR, EPS, Rockwool, Glass Wool' },
    { '@type': 'PropertyValue', name: 'Thickness range', value: '30–200 mm (standard 30–150 mm; 110–200 mm made to order)' },
    { '@type': 'PropertyValue', name: 'Facing options', value: 'PPGI, PPGL, BGL, stainless steel, aluminium, craft paper' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'Sandwich Panel', item: canonicalUrl },
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

function Figure({
  image,
  aspect = 'aspect-video',
}: {
  image: { src: string; alt: string; title: string; caption: string };
  aspect?: string;
}) {
  return (
    <figure className="my-8">
      <div className={`relative ${aspect} overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm`}>
        <img src={image.src} alt={image.alt} title={image.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
      </div>
      <figcaption className="mt-2 text-sm text-slate-600">{image.caption}</figcaption>
    </figure>
  );
}

function QuoteBlock() {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
      <h2 className="text-xl font-semibold text-slate-950">Get a sandwich panel quotation</h2>
      <ul className="mt-3 space-y-2 text-slate-800">
        <li>
          <strong>South India:</strong> +91 88616 22859 · sales@samanportable.com
        </li>
        <li>
          <strong>North India / Delhi NCR:</strong> +91 87960 39938 · ncr@samanportable.com
        </li>
        <li>Or use the <strong>Send Enquiry</strong> form with your core, thickness, facing, area and site city.</li>
      </ul>
    </div>
  );
}

export default function SandwichPanelPage() {
  return (
    <Layout>
      <Head>
        <title>Sandwich Panel Manufacturer in India — Types, Cores &amp; Sizes | SAMAN</title>
        <meta
          name="description"
          content="Sandwich panel manufacturer in India. Compare PUF, PIR, EPS, Rockwool and Glass Wool insulated panels — cores, thickness, wall and roof use — made in Bangalore and Greater Noida. Get a factory-direct quote."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta property="og:title" content="Sandwich Panel Manufacturer in India — Types, Cores &amp; Sizes | SAMAN" />
        <meta
          property="og:description"
          content="Sandwich panel manufacturer in India. Compare PUF, PIR, EPS, Rockwool and Glass Wool insulated panels — cores, thickness, wall and roof use — made in Bangalore and Greater Noida. Get a factory-direct quote."
        />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`https://www.samanportable.com${galleryImages[0].src}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-slate-600" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-emerald-700">Home</Link>
              <span>›</span>
              <Link href="/product" className="hover:text-emerald-700">Product</Link>
              <span>›</span>
              <span className="font-medium text-slate-950">Sandwich Panel</span>
            </nav>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:px-8">
            <aside className="hidden lg:block">
              <RelatedProductRail items={relatedRail} className="sticky top-24" />
            </aside>

            <div>
              <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm" data-product-main-gallery="true">
                <img
                  src={galleryImages[0].src}
                  alt={galleryImages[0].alt}
                  title={galleryImages[0].title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {galleryImages.map((image) => (
                  <div key={image.src} className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                    <img src={image.src} alt={image.alt} title={image.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-600">{galleryImages[0].caption}</p>
            </div>

            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                <Factory className="h-4 w-4" />
                Manufacturer in Bangalore and Greater Noida
              </div>
              <div className="mt-5 space-y-4 text-slate-700">
                <p>
                  <strong>Sandwich panels, factory-made in India by SAMAN.</strong> A sandwich panel is an insulated building board — two steel facing sheets bonded to an insulating core — used for walls, roofs, cabins and cold rooms. We manufacture all five cores at our Bangalore and Greater Noida lines and help you pick the right one for your job.
                </p>
                <ul className="space-y-2">
                  <li><strong>Five cores in one place:</strong> PUF, PIR, EPS, Rockwool and Glass Wool — matched to your cost, thermal, fire and acoustic need.</li>
                  <li><strong>Wall, roof, cabin and cold-room</strong> panels from a single manufacturer.</li>
                  <li><strong>Thickness 30 mm to 200 mm</strong> (standard 30–150 mm; 110–200 mm made to order).</li>
                  <li><strong>Steel facings:</strong> PPGI, PPGL, BGL, stainless steel, aluminium or craft paper.</li>
                  <li><strong>Two factories</strong> — dispatch from Bangalore for South India, Greater Noida for North India and Delhi NCR.</li>
                  <li><strong>HSN 940690.</strong> Supply-only quotes; panel warranty 5–10 years, confirmed at quotation; transport confirmed at quotation.</li>
                </ul>
                <p>
                  <strong>Get a factory-direct sandwich panel quote</strong> → South India +91 88616 22859 · North India / NCR +91 87960 39938, or send your thickness, core, facing, area and site city through the Send Enquiry form.
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-4">
                  <Phone className="mb-2 h-5 w-5 text-emerald-700" />
                  <p className="text-sm font-semibold text-slate-950">South India</p>
                  <p className="text-sm text-slate-700">+91 88616 22859</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <Mail className="mb-2 h-5 w-5 text-emerald-700" />
                  <p className="text-sm font-semibold text-slate-950">North India / Delhi NCR</p>
                  <p className="text-sm text-slate-700">+91 87960 39938</p>
                </div>
              </div>
            </div>

            <div className="lg:hidden">
              <RelatedProductRail items={relatedRail} />
            </div>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
            <h1>Sandwich Panel Manufacturer in India — Compare the Five Cores and Choose Right</h1>
            <p>
              A sandwich panel is an insulated building board made of two steel facing sheets bonded to a lightweight core, so one board gives you structure, insulation and a finished surface together. SAMAN manufactures sandwich panels in five cores — PUF, PIR, EPS, Rockwool and Glass Wool — at our Bangalore and Greater Noida factories, for walls, roofs, cabins and cold rooms across India.
            </p>
            <blockquote>
              <p><strong>Get a factory-direct sandwich panel quotation:</strong> South India +91 88616 22859 · sales@samanportable.com | North India / Delhi NCR +91 87960 39938 · ncr@samanportable.com</p>
            </blockquote>
            <p>
              Most buyers do not arrive knowing which core they need. They know the problem — heat coming through a shed roof, a cold room that will not hold temperature, a fire-rating clause in a tender, a wall that has to go up fast — and they need the panel that solves it without paying for performance they will never use. This hub exists to make that choice clear, then send you to the exact material page for specifications and price.
            </p>
          </div>

          <Figure image={inBodyImages.anatomy} />

          <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
            <h2>What is a sandwich panel?</h2>
            <p>
              A sandwich panel — also written &quot;sandwitch panel&quot;, and sold as an insulated panel or insulated sheet — is a three-layer board. Two thin metal facing sheets sit on the outside; a low-density insulating core sits in the middle; the core is bonded to both facings so the three layers act as one stiff, self-supporting board. That layered build is where the name comes from.
            </p>
            <p>
              The outer facings carry the finish, the weather resistance and most of the strength. The core carries the insulation — how well the panel blocks heat, cold, fire or sound. Change the core and you change what the panel is good at, which is exactly why the same-looking board comes in five very different materials.
            </p>
            <p>
              Because the panel arrives finished on both faces, there is no separate insulation, cladding or lining step on site. You fix the panel and the wall or roof is done — which is why sandwich panels put up buildings far faster than block-and-plaster or single-skin sheeting with loose insulation.
            </p>

            <h2>Types of sandwich panels — the five cores we manufacture</h2>
            <p>
              The facings barely change between products; the <strong>core</strong> is the real decision. Here is what each core is known for and where it fits. For exact density, thermal, fire and acoustic figures — and price — open the material&apos;s own page.
            </p>
          </div>

          <Figure image={inBodyImages.coreComparison} />

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-950">
                <tr>
                  <th className="px-4 py-3">Core</th>
                  <th className="px-4 py-3">Known for</th>
                  <th className="px-4 py-3">Typical use</th>
                  <th className="px-4 py-3">Where to go next</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr><td className="px-4 py-3"><strong>PUF (polyurethane)</strong></td><td className="px-4 py-3">Strong thermal insulation for the cost; the all-round default</td><td className="px-4 py-3">Cold rooms, cabins, cladding, roofing</td><td className="px-4 py-3">Our full PUF range</td></tr>
                <tr><td className="px-4 py-3"><strong>PIR</strong></td><td className="px-4 py-3">Improved fire behaviour and higher service temperature than standard PUF; the premium thermal core</td><td className="px-4 py-3">Where fire performance and heat matter together</td><td className="px-4 py-3">PIR panel page</td></tr>
                <tr><td className="px-4 py-3"><strong>EPS (thermocol)</strong></td><td className="px-4 py-3">Budget, lightweight</td><td className="px-4 py-3">Cost-led walls and partitions where thermal load is light</td><td className="px-4 py-3">EPS panel page (routing only)</td></tr>
                <tr><td className="px-4 py-3"><strong>Rockwool (stone wool)</strong></td><td className="px-4 py-3">Fire resistance and acoustic control from a mineral core</td><td className="px-4 py-3">Fire-rated walls, noisy or heat-exposed areas</td><td className="px-4 py-3">Rockwool panel page (routing only)</td></tr>
                <tr><td className="px-4 py-3"><strong>Glass Wool</strong></td><td className="px-4 py-3">Acoustic and thermal control from a mineral-fibre core</td><td className="px-4 py-3">Sound-sensitive and insulated partition work</td><td className="px-4 py-3">Glass Wool panel page (routing only)</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose prose-slate mt-6 max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
            <p>
              Read the table as positioning, not as a spec sheet: it tells you which core to shortlist, and the material page gives you the tested numbers for your order. If you are unsure, tell us the problem — temperature, fire clause, noise, or budget — and we will point you to the right core.
            </p>
            <p>
              For the polyurethane family specifically, start with <Link href="/product/puf-panel">our complete PUF panel range</Link>; if you already know you want the three-layer PUF board by its common names — PUF sheet, puff panel, insulated sheet — go straight to the <Link href="/product/puf-panel/puf-sandwich-panel">PUF sandwich panel and sheet page</Link>. For a fire-and-heat brief, see the <Link href="/product/pir-panel">PIR insulated panel page</Link>; for fire-rated and acoustic work, see <Link href="/product/rockwool-panel">our Rockwool panel range</Link>. EPS and Glass Wool material pages route from here as each goes live.
            </p>

            <h2>Where sandwich panels are used</h2>
            <p>One build, several jobs — and the right core depends on the job as much as the panel itself.</p>
            <p><strong>Walls.</strong> As an external wall or internal partition, a sandwich panel gives an insulated, finished surface in one board, in plain or lightly ribbed profile. It is the fastest way to close a building envelope.</p>
          </div>

          <Figure image={inBodyImages.wall} />

          <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
            <p><strong>Roofs.</strong> As a roof cover, the panel keeps heat out of the space below — the single biggest reason factories, warehouses and workshops in Indian conditions choose insulated panels over bare single-skin sheeting. Roof panels use a profiled top facing and a lapped, weather-tight joint.</p>
          </div>

          <Figure image={inBodyImages.roof} />

          <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
            <p><strong>Cabins and porta units.</strong> The same board forms the walls and roof of porta cabins, site offices and security cabins, giving insulation and finish without a separate lining.</p>
            <p><strong>Cold rooms and freezers.</strong> For temperature-controlled stores, the panel is the thermal envelope, usually with a cam-lock joint so panels lock airtight. Core choice and thickness matter most here.</p>

            <h2>Sizes, thickness and facing options</h2>
            <p>Sandwich panels are made across a wide thickness range so the panel matches the thermal or fire duty of the job rather than a one-size board.</p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-950">
                <tr><th className="px-4 py-3">Attribute</th><th className="px-4 py-3">Range</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr><td className="px-4 py-3">Thickness (standard)</td><td className="px-4 py-3">30 / 40 / 50 / 60 / 70 / 80 / 90 / 100 / 150 mm*</td></tr>
                <tr><td className="px-4 py-3">Thickness (made to order)</td><td className="px-4 py-3">110 / 120 / 130 / 140 / 200 mm — advance payment; price and lead time confirmed at quotation</td></tr>
                <tr><td className="px-4 py-3">Covered width</td><td className="px-4 py-3">1000 mm (roof profile 1070 mm overall)</td></tr>
                <tr><td className="px-4 py-3">Facing sheets</td><td className="px-4 py-3">PPGI · PPGL · BGL · stainless steel · aluminium · craft paper</td></tr>
                <tr><td className="px-4 py-3">Facing gauge</td><td className="px-4 py-3">0.35–0.80 mm</td></tr>
                <tr><td className="px-4 py-3">HSN (GST/RFQ)</td><td className="px-4 py-3">940690</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose prose-slate mt-6 max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
            <p><em>*Standard thickness list applies to the mineral and EPS/PIR cores; the PUF range runs 30–200 mm with freezer-grade to 150 mm. Exact list per core is on the material page.</em></p>
            <p>
              Thicker panels insulate more but cost more and weigh more, so the right thickness is a balance, not &quot;as thick as possible&quot;. Thin panels suit partitions and cabins; mid-range suits sheds and better thermal control; the thick end suits cold rooms and freezers. Longer panels reduce joints but depend on road access and offloading space at your site, so we confirm a workable length against your delivery point. This hub gives ranges only — for rate-per-square-foot by thickness and core, use the material&apos;s price page.
            </p>

            <h2>How SAMAN manufactures and checks sandwich panels</h2>
            <p>
              Our lines feed two facing coils through the machine, bond the core between them, and cure the panel so the core grips both facings as one continuous board — not a slab glued on afterwards. That bonded build is what lets a thin, light panel behave as a single structural board.
            </p>
          </div>

          <Figure image={inBodyImages.manufacturing} />

          <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
            <p>
              On every batch we check facing gauge, panel thickness, core rise or density, and the tongue-and-groove profile so joints close cleanly and the panel sits flat. Panels are edge-protected, stacked and bundled for dispatch from the nearer of our two factories. Making the panel ourselves — rather than buying and reselling — is why we can match core, facing, thickness and length to your job instead of offering only what is in stock.
            </p>
          </div>

          <Figure image={inBodyImages.quality} />
          <Figure image={inBodyImages.jointTypes} />

          <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
            <h2>How to choose the right sandwich panel</h2>
            <p>Work from the problem, not the product:</p>
            <ul>
              <li><strong>Leading with cost and light thermal load?</strong> EPS is the budget core.</li>
              <li><strong>Need strong thermal insulation for cabins, cladding or cold rooms?</strong> PUF is the all-round default.</li>
              <li><strong>Fire performance and higher heat together?</strong> PIR is the premium thermal core; Rockwool is the mineral fire-and-acoustic core.</li>
              <li><strong>Fighting noise?</strong> Rockwool or Glass Wool bring acoustic control a foam core does not.</li>
              <li><strong>Roof vs wall?</strong> Same core, different facing profile and joint — tell us which face is exposed.</li>
            </ul>
            <p>
              Then set thickness to the duty and facing to the environment (stainless or aluminium for hygienic cold rooms and food spaces; PPGI or PPGL for general wall and roof). If a tender specifies a fire class or a temperature, send it with your enquiry and we will confirm the core, thickness and any tested value at quotation.
            </p>

            <h2>Delivery, warranty and quotation</h2>
            <p>
              We manufacture and dispatch pan-India: Bangalore for South India, Greater Noida for North India and Delhi NCR. Default dispatch is 3–5 business days on standard products; transport is confirmed at quotation, and a <strong>500 m² minimum billing</strong> applies to long-distance dispatch. See our <Link href="/delivery-policy">Delivery Policy</Link> for the full terms.
            </p>
          </div>

          <Figure image={inBodyImages.dispatch} />

          <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
            <p>
              Panel warranty is 5–10 years, confirmed at quotation. Quotes are supply-only unless stated otherwise, and any tested performance value for a specific core is confirmed at quotation rather than stated as a blanket claim. Standard products carry 7-day returns (3-day on custom) — see our <Link href="/refund-and-return-policy">Refund &amp; Return Policy</Link>. All sandwich panels fall under <strong>HSN 940690</strong> for GST and RFQ purposes.
            </p>

            <h2>Why buy sandwich panels from a manufacturer, not a trader</h2>
            <p>
              A trader sells you whatever core and thickness is already in the warehouse and marks it up. As the manufacturer, we cut the panel to your job — core matched to your fire, thermal, acoustic or budget need, facing matched to your environment, thickness matched to the duty, and length matched to what your site can actually receive. You get one point of accountability from quote to dispatch, real factory QC on every batch, and two dispatch origins so freight is shorter to most of the country. When a specification has to be met and proven, that direct line to the line that made the panel is the difference.
            </p>

            <h2>Frequently asked questions</h2>
            {faqs.map((faq) => (
              <div key={faq.question}>
                <p><strong>{faq.question}</strong></p>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <QuoteBlock />
          </div>

          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
            <QuoteBlock />
            <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-700">
              <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
                <Truck className="h-4 w-4 text-emerald-700" />
                Certifications
              </div>
              <p>
                ISO 9001:2015 (E20250218645) · ISO 14001:2015 (E20250218646) · ISO 45001:2018 (E20250218647) · NSIC (NSIC/GP/BAN/2024/0055207) · DPIIT (DIPP56005) · Udyam (UDYAM-KR-03-0172770)
              </p>
              <p className="mt-2">GST: 29ABBCS7101B1ZR (Bangalore) / 09ABBCS7101B1ZT (Noida)</p>
            </div>
          </div>
        </article>
      </main>
    </Layout>
  );
}
