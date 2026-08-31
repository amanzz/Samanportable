/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ProductReviews from '@/components/ProductReviews';
import RelatedProductRail from '@/components/product/RelatedProductRail';
import ProductZoneCtas from '@/components/product/ProductZoneCtas';
import { getRoofingPanelRail } from '@/lib/c16PanelCatalog';
import { tokens } from '@/components/ds/tokens';
import { CheckCircle, Factory, Truck } from 'lucide-react';

const baseImagePath = '/panel-images/roofing-sheet/';
const canonicalUrl = 'https://www.samanportable.com/product/roofing-sheet';
const wcReviewProductId = 272772;

// SHIKHAR T9 Part B — this hub's three subpages, for a first-screen SSR link block.
// href = the CANONICAL singular /product/roofing-sheet/{slug} (each returns 200 and
// declares itself canonical); the plural /product/roofing-sheets/{slug} 301-redirects
// here, so we link the real 200 URL, never the redirect. name = each page's real
// product name (wp-export/products/*.json `name`), used verbatim as anchor text.
const ROOFING_SUBPAGES: ReadonlyArray<{ name: string; href: string }> = [
  { name: 'Polycarbonate Roofing Sheet', href: '/product/roofing-sheet/polycarbonate-roofing-sheet' },
];

const galleryImages = [
  {
    src: `${baseImagePath}roofing-sheet-colour-coated-stack.webp`,
    alt: 'Stack of colour-coated roofing sheets in multiple colours at SAMAN supply yard',
    caption: 'Colour-coated, GI, tile-profile and transparent roof sheets supplied factory-direct.',
  },
  {
    src: `${baseImagePath}roofing-sheet-corrugated-gi-profile.webp`,
    alt: 'Galvanized corrugated GI roofing sheet profile close-up',
    caption: 'GI corrugated profile close-up.',
  },
  {
    src: `${baseImagePath}roofing-sheet-tile-profile-red.webp`,
    alt: 'Tile profile colour-coated roofing sheet in terracotta red',
    caption: 'Tile profile colour-coated roofing sheet.',
  },
  {
    src: `${baseImagePath}roofing-sheet-polycarbonate-multiwall.webp`,
    alt: 'Multiwall polycarbonate roofing sheet showing transparency',
    caption: 'Multiwall polycarbonate sheet for daylight.',
  },
  {
    src: `${baseImagePath}roofing-sheet-trapezoidal-warehouse-roof.webp`,
    alt: 'Trapezoidal colour-coated roofing sheets installed on a warehouse roof',
    caption: 'Trapezoidal PPGL roof sheet on an industrial roof.',
  },
];

const bodyImages = {
  yard: {
    src: `${baseImagePath}roofing-sheet-supply-yard-types.webp`,
    alt: 'All roofing sheet types stocked at SAMAN supply yard in India',
  },
  installation: {
    src: `${baseImagePath}colour-coated-roofing-sheet-installation.webp`,
    alt: 'Colour-coated roofing sheet installation on steel purlins',
  },
  home: {
    src: `${baseImagePath}tile-profile-roof-sheet-home-elevation.webp`,
    alt: 'Tile profile roofing sheet on a residential home elevation',
  },
  shed: {
    src: `${baseImagePath}industrial-shed-trapezoidal-roofing-sheet.webp`,
    alt: 'Industrial shed roof with trapezoidal roofing sheets and polycarbonate skylight strip',
  },
  skylight: {
    src: `${baseImagePath}polycarbonate-skylight-roofing-sheet-canopy.webp`,
    alt: 'Polycarbonate roofing sheet canopy letting daylight through',
  },
};

const specImages = {
  tct: {
    src: `${baseImagePath}roofing-sheet-tct-vs-bmt-coating-diagram.webp`,
    alt: 'TCT vs BMT roofing sheet thickness diagram',
  },
  profiles: {
    src: `${baseImagePath}roofing-sheet-profile-types-diagram.webp`,
    alt: 'Roofing sheet profile types diagram',
  },
  selection: {
    src: `${baseImagePath}roofing-sheet-type-selection-map-diagram.webp`,
    alt: 'Which roofing sheet to choose, selection map',
  },
};

const specGrid = [
  ['SIZE', 'Steel 0.30–1.00 mm · plastics 1.5–10 mm · widths 910–1220 mm, length cut to order'],
  ['MATERIAL', 'GI · Galvalume · PPGI/PPGL · aluminium · SS · polycarbonate · UPVC · fibre cement'],
  ['DELIVERY', '3–5 day dispatch'],
  ['COVERAGE', 'Bangalore · Delhi NCR'],
  ['BRAND', 'SAMAN Portable'],
];

const faqs = [
  {
    question: 'Which roofing sheet is best in India?',
    answer:
      'For most permanent roofs: 0.50 mm PPGL colour-coated sheet with AZ150 coating in a light colour: the best balance of life, heat reflection, looks and cost. Economy utility roofs do fine with 0.50 mm GI; special cases (coastal, skylight, design roofs) follow the type table above.',
  },
  {
    question: 'Which roof sheet is best for a hot climate?',
    answer:
      'Light-colour PPGL reflects heat better than bare metal, and fibre cement runs naturally cooler. But a bare sheet only reduces heat, it cannot insulate. For genuinely cool interiors, an insulated PUF roof panel is the correct product, and we supply both.',
  },
  {
    question: 'Which roofing sheet is cheapest?',
    answer:
      'By fixed rate: 6 mm fibre cement (from ₹38/sq ft ex-GST) and light-gauge GI (from ₹58/sq ft) are the economy leaders; PVC corrugated is the temporary-duty budget option. Cheapest per year is a different answer, thin sheets with light coatings age fastest.',
  },
  {
    question: 'What is the difference between TCT and BMT?',
    answer:
      'TCT (Total Coated Thickness) includes coating and paint; BMT (Base Metal Thickness) is the bare steel alone. Strength comes from BMT, so a 0.50 mm TCT sheet carries less steel than a 0.50 mm BMT sheet. Our quotations state both so you can compare quotes honestly.',
  },
  {
    question: 'How much area does one roofing sheet cover?',
    answer:
      'Count on the covered width, not the flat width: profiled steel covers roughly 1000–1070 mm per sheet after overlap (910/1220 mm flat corrugated covers less). Sheets ÷ side = roof length ÷ covered width, rounded up, plus ridge/flashing. Send dimensions and we calculate it in the quotation.',
  },
  {
    question: 'What is the difference between plastic and polycarbonate roofing sheets?',
    answer:
      '"Plastic" usually means PVC (light, temporary) or UPVC/ASA (serious, corrosion-proof, coastal-grade). Polycarbonate is the transparent family, solid, multiwall or corrugated, used where light must pass: skylights, pergolas, canopies. We supply all three and will tell you plainly which your job needs.',
  },
  {
    question: 'Do you supply fibre or FRP roofing sheets?',
    answer:
      'No, we do not deal in FRP/fibre sheets. Most "fibre sheet" requirements are actually served better by UPVC, polycarbonate or fibre cement, all of which we supply; send your requirement and we will map it honestly.',
  },
  {
    question: 'Do you supply roofing sheets for homes as well as factories?',
    answer:
      'Yes. Homes usually take tile-profile or colour-coated PPGL for the finished look; factories and warehouses take trapezoidal PPGL/GI with decking and skylight strips as needed. Both factories dispatch pan-India with cut-to-length sheets.',
  },
];

const typeRows = [
  ['GI / GC (galvanized corrugated)', 'Bare zinc-coated steel, 0.30–1.00 mm', 'Economy roofs, utility sheds, boundary/temporary work', 'Looks industrial; bare zinc runs hot and shows age'],
  ['Bare Galvalume (Aluzinc)', 'Al-Zn coated steel, AZ100–AZ150', 'Longer-life bare-metal roofs, coastal-adjacent utility', 'You want colour or a finished look'],
  ['PPGI colour-coated', 'Pre-painted galvanized steel', 'Colour roofs on a budget: sheds, homes, shops', 'Harsh coastal exposure, PPGL lasts longer'],
  ['PPGL colour-coated', 'Pre-painted Galvalume, AZ150 preferred', 'The all-round standard for homes, factories, commercial roofs', 'Pure lowest-cost jobs, PPGI/GI is cheaper'],
  ['Premium coated steel (SDP/PVDF class)', 'AZ150 + premium paint systems', 'Showpiece roofs, long paint-life requirements', 'Budget-led work'],
  ['Tile profile steel', 'Colour-coated sheet pressed in tile shapes', 'Home elevations, villas, resorts, the "roof sheet design" look', 'Plain industrial roofs, you pay for the profile'],
  ['Standing seam / concealed fix', 'No exposed screws; clip-locked long sheets', 'Premium and leak-critical roofs, long spans', 'Small budgets; needs skilled installation'],
  ['Curved / crimped', 'Factory-curved colour sheet', 'Canopies, arch roofs, entrance features', 'Standard flat-slope roofs'],
  ['Aluminium', 'Corrugated aluminium, 0.70 mm', 'Coastal and corrosive environments, lightweight needs', 'Hail-prone or dent-sensitive sites'],
  ['Stainless steel (SS 304)', 'Passivated SS corrugated', 'Food, pharma and process buildings', 'Everywhere else, it is the premium of premiums'],
  ['GI decking sheet', 'Heavy-gauge profiled deck, 0.80–1.00 mm', 'Composite floor/roof decks in structures', 'It is structural decking, not a rain roof by itself'],
  ['Fibre cement (non-asbestos)', '6–8 mm cement-fibre corrugated', 'Lowest-cost roofs, cattle/farm sheds, rural spans; naturally cooler and quieter than bare metal', 'Fragile to walk on; heavy; plain look'],
  ['UPVC / ASA', 'Multi-layer plastic sheet, 2–2.5 mm', 'Coastal and chemical-exposure roofs, quiet rain performance', 'Very hot dark-colour installs; long unsupported spans'],
  ['Polycarbonate (solid / multiwall / corrugated)', 'Transparent/translucent sheet, 1.5–10 mm', 'Skylights, pergolas, canopies, daylight strips in metal roofs', 'Full living-space roofs. It is a light solution, not an insulation solution'],
  ['Bitumen corrugated (Onduline-type)', 'Bitumen-impregnated cellulose', 'Farmhouses, resorts, low-noise small roofs', 'Industrial spans and fire-sensitive sites'],
  ['PVC corrugated', 'Light PVC sheet, ~1.5 mm', 'Temporary roofs, small sheds', 'Anything long-term or wind-exposed'],
];

const materialRows = [
  ['GI / GC galvanized', '0.30–1.00 mm BMT', 'Z80–Z275 zinc', '910/1220 mm wide, length cut to order', 'IS 277, ASTM A653, IS 459 profile', 'Economy/utility roofs and walls; industrial at heavy gauges'],
  ['Bare Galvalume (Aluzinc)', '0.35–0.50 mm TCT', 'AZ100–AZ150 Al-Zn', '1000–1070 mm cover after profiling', 'ASTM A792 class', 'Longer-life bare-metal roofs'],
  ['PPGI colour-coated', '0.35–0.50 mm TCT', 'Z80–Z180 + primer + 15–25 µm top coat', '1000–1070 mm cover', 'IS 14246 class', 'Budget colour roofs and walls'],
  ['PPGL colour-coated', '0.35–0.60 mm TCT', 'AZ100–AZ200 + 20–25 µm top coat', 'Full 1070–1220 mm; cover ~1000–1070 mm', 'ASTM A792 + paint class', 'The standard colour roof, homes to factories'],
  ['Premium coated steel', '0.47–0.50 mm TCT', 'AZ150 + SDP/PVDF paint', 'Full 1070 mm / covered ~1010 mm; 8–24 ft lengths', 'Brand systems', 'Premium/long-paint-life roofs'],
  ['Tile profile steel', '0.45–0.50 mm TCT', 'AZ150 preferred + colour coat', 'Profile-specific cover', 'Profile standards', 'Home elevations, villas, resorts'],
  ['Standing seam / concealed fix', '0.50 mm TCT', 'AZ150 + premium paint', 'Roll-formed long lengths, profile-specific', 'System standards', 'Leak-critical premium roofs, no exposed screws'],
  ['Curved / crimped', '0.50 mm TCT', 'AZ150 + colour coat', 'Radius per site design', 'Profile standards', 'Canopies and arch features'],
  ['Aluminium', '0.70 mm', 'Mill/anodized or colour', 'Supplier profile', 'Aluminium class', 'Coastal/corrosive, lightweight'],
  ['Stainless steel', '0.50 mm SS 304', 'Passivated', 'Supplier profile', 'SS 304', 'Food/pharma/process buildings'],
  ['GI decking', '0.80–1.00 mm BMT', 'Z120/Z275', 'Profile depth 44–75 mm; cover 900–1000 mm', 'Deck standards', 'Composite floor/roof decks'],
  ['Fibre cement (non-asbestos)', '6–8 mm', 'Cement-fibre matrix; colour option', '~1050 mm overall, ~1010 mm cover', 'IS class non-asbestos', 'Economy, farm and rural roofs; cooler and quieter than bare metal'],
  ['UPVC / ASA', '2.0–2.5 mm', 'ASA/UV top layer over UPVC core', '~1050–1130 mm profile widths', 'Supplier class', 'Coastal/chemical roofs, quiet rain performance'],
  ['Polycarbonate solid', '2–5 mm', 'UV-coated solid PC', '1220×2440 / 2050×3050 mm', 'PC class', 'Canopies, premium skylights'],
  ['Polycarbonate multiwall', '4–10 mm', 'UV-coated multiwall PC', '1220/2100 mm widths', 'PC class', 'Skylights, pergolas, greenhouses'],
  ['Polycarbonate corrugated', '1.5 mm', 'UV-coated corrugated PC', 'Matched to metal profiles', 'PC class', 'Daylight strips in metal roofs'],
  ['Bitumen corrugated', '3 mm', 'Bitumen-impregnated cellulose, coloured', '~2000×950/970 mm', 'Brand class', 'Farmhouse/resort low-noise roofs'],
  ['PVC corrugated', '~1.5 mm', 'UV/colour PVC where specified', 'Supplier profile', 'PVC class', 'Temporary and small-shed roofs'],
];

const guideRows = [
  ['GI thickness options', '0.30 / 0.35 / 0.40 / 0.45 / 0.50 / 0.60 / 0.80 / 1.00 mm BMT, default quote 0.50 mm; 0.40–0.45 mm minimum for utility; 0.80–1.00 mm industrial'],
  ['Colour-coated (PPGI/PPGL) options', '0.35 / 0.40 / 0.45 / 0.50 / 0.60 mm TCT: 0.45–0.50 mm practical standard'],
  ['Owner locked defaults', 'Standard roof: 0.50 mm PPGL colour, AZ150 preferred · Economy roof: 0.50 mm GI/GC, Z275 where available'],
  ['TCT vs BMT', 'TCT includes coating + paint; BMT is bare steel. Strength = BMT. SAMAN quotations state BOTH.'],
  ['Zinc coating classes (GI)', 'Z80 light economy → Z120 preferred standard → Z180 heavy → Z275 industrial'],
  ['Galvalume coating classes', 'AZ100 economy → AZ150 preferred standard → AZ200 premium'],
  ['Paint systems', 'Standard RMP/SMP polyester 15–25 µm → premium SDP/PVDF for long paint life; coating warranties per brand, confirmed at quotation'],
  ['Key standards', 'GI: IS 277 / ASTM A653 · profiles: IS 459 · Galvalume/PPGL: ASTM A792 class · PPGI: IS 14246 class'],
  ['Accessories (quoted separately)', 'Self-drilling screws with EPDM washers · long polycarbonate screws + buttons · ridge caps · flashings · gutters'],
  ['Price basis', 'Fixed ex-GST rates per sq ft (₹/sq m auto-calculated); GST, transport, unloading and accessories quoted separately'],
];

const relatedRail = getRoofingPanelRail();

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/roofing-sheet#product',
  name: 'Roofing Sheet',
  description:
    'Roofing sheets factory-direct in India: GI and Galvalume, colour-coated PPGI/PPGL, tile and premium profiles, aluminium, stainless, polycarbonate, UPVC and fibre cement, with honest gauge, coating and coverage guidance. Supplied from Bangalore and Greater Noida.',
  category: 'Roofing Sheet',
  sku: 'SP-C17-RFS-HUB-2026',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Steel (GI/Galvalume/colour-coated), aluminium, stainless steel, polycarbonate, UPVC, fibre cement',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Steel thickness range', value: '0.30–1.00 mm' },
    { '@type': 'PropertyValue', name: 'Plastic sheet range', value: '1.5–10 mm' },
    { '@type': 'PropertyValue', name: 'Coating classes', value: 'Z80–Z275 zinc / AZ100–AZ200 Aluzinc' },
    { '@type': 'PropertyValue', name: 'Width', value: '910–1220 mm, length cut to order' },
  ],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: 38,
    offerCount: 48,
    availability: 'https://schema.org/InStock',
    url: 'https://www.samanportable.com/product/roofing-sheet',
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
      <img src={image.src} alt={image.alt} title={image.alt} className="aspect-video w-full object-cover" loading="lazy" decoding="async" />
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
      <h2 className="text-xl font-bold text-slate-950">Get a roofing sheet quotation</h2>
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
        Or use the <strong>Send Enquiry</strong> form with your sheet type (or just the problem), roof dimensions, site city and any gauge/colour requirement.
      </p>
    </div>
  );
}

export default function RoofingSheetPage() {
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
        <title>Roofing Sheet, All Roof Sheet Types, Sizes &amp; Designs | SAMAN</title>
        <meta
          name="description"
          content="Roofing sheet supply, factory-direct in India. Compare every roof sheet type, GI, Galvalume, colour-coated PPGI/PPGL, tile profile, polycarbonate, UPVC, fibre cement, with honest specs, sizes and coverage. From ₹38/sq ft."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Roofing Sheet, All Roof Sheet Types, Sizes & Designs | SAMAN" />
        <meta
          property="og:description"
          content="Roofing sheet supply, factory-direct in India. Compare every roof sheet type, GI, Galvalume, colour-coated PPGI/PPGL, tile profile, polycarbonate, UPVC, fibre cement, with honest specs, sizes and coverage. From ₹38/sq ft."
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
              <span className="font-medium text-slate-950">Roofing Sheet</span>
            </nav>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)_minmax(360px,0.95fr)] lg:px-8">
            {/* T28.5 v2 — universal height rule: the gallery column's natural height
                (image card + caption + quotation CTA block) drives the hero row; the
                rail is contained to it and scrolls internally on overflow. */}
            <aside className="hidden lg:relative lg:block lg:min-h-0">
              <div className="t28-rail-scroll lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">
                <RelatedProductRail items={relatedRail} className="lg:h-auto lg:min-h-full" />
              </div>
            </aside>

            <div className="order-1 lg:order-none">
              <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100" data-product-main-gallery="true">
                  <img
                    src={galleryImages[0].src}
                    alt={galleryImages[0].alt}
                    title={galleryImages[0].alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {galleryImages.map((image) => (
                    <div key={image.src} className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                      <img src={image.src} alt={image.alt} title={image.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
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
              {/* T28.5 v2 — the long description is contained to the gallery-driven
                  row height and scrolls IN its column (visible thin scrollbar). */}
              <div className="t28-rail-scroll lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                  <Factory className="h-4 w-4" />
                  ROOFING SHEETS
                </div>
                <h1 className="mt-5 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                  Roofing Sheet: Compare Every Roof Sheet Type and Buy Factory-Direct
                </h1>
                <p className="mt-4 text-2xl font-bold text-emerald-700">From ₹38 / sq ft</p>
                <p className="mt-1 text-sm text-slate-500">6mm fibre cement base spec · ex-GST · final price at quotation</p>
                <p className="mt-5 text-base leading-7 text-slate-700">
                  A roofing sheet is a profiled sheet, steel, polycarbonate, UPVC or fibre cement, that forms the finished, weather-tight cover of a roof. SAMAN supplies every mainstream roof sheet type sold in India from one counter: bare GI and Galvalume, colour-coated PPGI/PPGL, tile and premium profiles, transparent polycarbonate, UPVC and fibre cement: with honest gauge, coating and coverage guidance so you buy the right sheet, not just the cheapest quote.
                </p>
                {/* SHIKHAR T9 Part B — first-screen, SSR, all-breakpoints links to this
                    hub's own subpages (previously linked from nowhere on the hub). Text
                    links only → zero layout shift. DS tokens (forest/leaf/mist), no raw hex. */}
                <nav aria-label="Roofing sheet types" className="mt-6">
                  <p
                    className="text-xs font-bold uppercase tracking-normal"
                    style={{ color: tokens.palette.forest }}
                  >
                    Explore roofing sheet types
                  </p>
                  <ul className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {ROOFING_SUBPAGES.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className="inline-flex items-center rounded-lg border px-3 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                          style={{
                            borderColor: tokens.palette.leaf,
                            backgroundColor: tokens.palette.mist,
                            color: tokens.palette.forest,
                          }}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {specGrid.map(([label, value], index) => (
                    <div key={label} className={`rounded-lg border border-slate-200 p-4 ${index === 0 ? 'sm:col-span-2' : ''}`}>
                      <p className="text-xs font-bold uppercase tracking-normal text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="font-semibold text-slate-950">SKU:</span> SP-C17-RFS-HUB-2026
                </div>
              </div>
              </div>
            </div>

            <div className="order-3 lg:hidden">
              <RelatedProductRail items={relatedRail} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="tablist" aria-label="Roofing Sheet product tabs">
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
            <div hidden={activeTab !== 'description'} role="tabpanel" aria-labelledby="description">
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
                <h2>Roofing Sheet: Compare Every Roof Sheet Type and Buy Factory-Direct</h2>
                <p>
                  A roofing sheet does one job, keep weather out, but the material you pick decides everything else: how hot the space runs, how long the roof lasts, how it looks from the road and what you pay per square foot. This page compares every roof sheet type we supply in India, honestly, so you can choose in minutes and get a fixed quotation the same day.
                </p>
                <blockquote>
                  <p><strong>Get a factory-direct roofing sheet quotation:</strong> South India +91 88616 22859 · sales@samanportable.com | North India / Delhi NCR +91 87960 39938 · ncr@samanportable.com</p>
                </blockquote>

                <h2>What is a roofing sheet?</h2>
                <p>
                  A roofing sheet is a thin, profiled sheet fixed over purlins or a frame to form the finished roof surface. The profile, corrugated waves, trapezoidal ribs, tile shapes, is what gives a thin sheet its strength and lets rainwater run. Sheets are sold by material (steel, polycarbonate, UPVC, fibre cement), by thickness, and by coating: and those three choices, not the brand sticker, decide how the roof performs.
                </p>
              </div>

              <Figure image={bodyImages.yard} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700 prose-table:text-sm">
                <h2>Types of roofing sheets: the honest comparison</h2>
                <p>Most pages list types; few tell you when each one is the wrong choice. Here is the full range we supply, compared the way a buyer actually decides:</p>
              </div>
              <DataTable headers={['Type', 'What it is', 'Best for', 'Think twice when']} rows={typeRows} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <p>
                  One honest exclusion: <strong>we do not deal in FRP or fibre sheets.</strong> If a quote you received says "fibre sheet", it is usually either FRP (which we don&apos;t supply) or actually one of the plastic sheets above. Send it to us and we will tell you plainly which.
                </p>
                <p>Detailed pages for the metal, polycarbonate and PVC/UPVC families are coming next on this site; until then, every type above is quotable today through the enquiry form.</p>
              </div>

              <Figure image={bodyImages.installation} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Which roof sheet is best? Choose by the problem</h2>
                <p><strong>Lowest cost per square foot:</strong> fibre cement (6 mm) and light-gauge GI lead; PVC corrugated for strictly temporary work.</p>
                <p><strong>Heat, the "roof gets hot" complaint:</strong> white/light-colour PPGL reflects better than bare metal; fibre cement runs naturally cooler; and if the real requirement is a cool interior, no bare sheet beats an insulated panel, see the comparison below.</p>
                <p><strong>Looks: home, villa, resort:</strong> tile-profile colour steel is the design leader; curved/crimped sheets for feature canopies.</p>
                <p><strong>Coastal and corrosive sites:</strong> Galvalume over GI, aluminium or UPVC/ASA where salt is severe, SS 304 for process areas.</p>
                <p><strong>Daylight:</strong> polycarbonate, multiwall for skylights and pergolas, corrugated strips matched into metal roofs.</p>
                <p><strong>Leak-critical, long-span, premium:</strong> standing seam or concealed-fix PPGL, no exposed screw holes at all.</p>
                <p>
                  <strong>Hot climate, best for home, best overall</strong>, the honest answer is 0.50 mm PPGL colour-coated with AZ150 coating in a light colour: it is our locked standard recommendation because it balances life, looks and cost for Indian conditions. The economy answer is 0.50 mm GI. Everything else is a special case from the list above.
                </p>

                <h2>The 0.50 mm truth: why two "same" quotes are not the same</h2>
                <p><strong>TCT vs BMT.</strong> TCT (Total Coated Thickness) includes the coating and paint; BMT (Base Metal Thickness) is the bare steel only. A "0.50 mm" quote in TCT can carry visibly less steel than a 0.50 mm BMT quote. Strength lives in the BMT. Always ask which one the quote states, ours state both.</p>
                <p><strong>Coating class.</strong> On GI, zinc coating runs from Z80 (light economy) to Z275 (industrial); on Galvalume, AZ100 to AZ150+. Two sheets of identical thickness with Z80 vs Z180 coating are different products with different lives, and different fair prices.</p>
                <p><strong>Paint system.</strong> On colour sheets, a 15–20 µm standard polyester coat and an SDP/PVDF premium coat look identical on day one and age completely differently.</p>
                <p>So when one dealer quotes noticeably cheaper for the "same 0.50 mm sheet", the difference is almost always hiding in TCT-vs-BMT, the coating class, or the paint system. Our quotations state all three, which is exactly how you should compare any quote: including ours against others.</p>
              </div>

              <Figure image={bodyImages.home} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Colour-coated or bare sheet: where the money goes</h2>
                <p>Bare GI and bare Galvalume are honest workhorses: cheapest per square foot, fine for utility sheds, back-of-plot roofs and anywhere looks don&apos;t matter. Colour-coating adds three real things, a finished look, an extra protective paint layer, and better heat reflection in light colours, and one cost step. The practical rule we quote by: <strong>utility roof → bare GI (0.50 mm, Z-coating stated); anything people see or work under daily → colour-coated PPGL.</strong> Paying for colour on a hidden shed is waste; skipping it on a customer-facing building is false economy.</p>

                <h2>Plastic sheet for roof: PVC, UPVC or polycarbonate?</h2>
                <p>"Plastic sheet for roof" covers three different products, and sellers rarely say which they mean. <strong>PVC corrugated</strong> is the light, temporary-duty sheet. <strong>UPVC/ASA</strong> is the serious plastic roof: multi-layer, UV-protected, corrosion-immune, the pick for coastal and chemical sites. <strong>Polycarbonate</strong> is the transparent one: solid for canopies, multiwall for skylights and pergolas, corrugated to lay daylight strips inside a metal roof. If your requirement says "plastic", answer one question, <em>permanent or temporary, and does light need to pass through?</em>, and the right sheet falls out of the table above. All three families are supplied here.</p>

                <h2>Roofing sheet or insulated panel?</h2>
                <p>
                  A bare roofing sheet is a weather skin; it does not insulate. If your building needs a cool or temperature-controlled interior, offices, cold rooms, work floors under Indian summer roofs, the correct product is an insulated roof panel, not a sheet with regrets. See our <Link href="/product/puf-panel/puf-panel-roofing">insulated PUF roofing panels for temperature-controlled roofs</Link>; for everything where weather cover is the job, the sheets on this page are the right money.
                </p>

                <h2>Sizes, coverage and how many sheets you need</h2>
                <p>Steel sheets come 910/1220 mm wide (corrugated) or roughly 1000–1070 mm <em>covered</em> width after profiling, with length cut to order: long sheets mean fewer joints. Plastics and fibre cement come in their own standard widths (polycarbonate commonly 1220/2100 mm; fibre cement ~1050 mm overall). The number that matters for quantity is <strong>covered width</strong>. The width a sheet actually spans after overlap, always less than the flat width. Quick method: roof length ÷ covered width = sheets per side, rounded up; add ridge, flashing and wastage. Send your roof dimensions with the enquiry and we return the exact sheet count, cut lengths and accessories in the quotation.</p>
              </div>

              <Figure image={bodyImages.shed} />

              <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-a:text-emerald-700">
                <h2>Accessories and installation reality</h2>
                <p>A roof is sheets plus the parts cheap quotes forget: self-drilling screws with EPDM washers (the washer is what keeps the hole dry), longer screws for polycarbonate with their own fixing buttons, ridge caps, flashings and gutters. These are quoted as separate line items. A quote that hides them inside "per sq ft" is a quote you can&apos;t compare. We list them separately, always.</p>

                <h2>What decides the price</h2>
                <p>Material family first (fibre cement and light GI at the economy end, premium coated and stainless at the top), then thickness/gauge, coating class (Z/AZ number), paint system, profile (tile, standing seam and curved cost more than plain trapezoidal), length and quantity, and accessories. GST, transport and unloading are quoted separately, ex-GST pricing as standard. A full type-by-type price guide is coming as its own page; until then every rate above is fixed and quotable today, send the specification and get the number.</p>

                <h2>Delivery, brands and quotation</h2>
                <p>Dispatch runs from Bangalore for South India and Greater Noida for North India and Delhi NCR, 3–5 business days on standard items, see our <Link href="/delivery-policy">Delivery Policy</Link>. We supply ISI-marked, brand-backed material (Tata, JSW, SAIL or equivalent approved brands per category) and state the brand and standard (IS 277 / IS 459 / ASTM class) on the quotation, with manufacturer-backed coating warranties confirmed at quotation. Returns follow our <Link href="/refund-and-return-policy">Refund &amp; Return Policy</Link>. Quotes are supply-only unless stated otherwise.</p>

                <h2>Why buy roofing sheets from SAMAN</h2>
                <p>Because we build with what we sell. SAMAN manufactures portable cabins, sheds and prefab structures every day, so our roof-sheet guidance comes from installing these sheets, not reselling boxes: we know which gauge walks without denting, which coating survives which city, and which "cheap" quote costs more by year three. You get one counter for every sheet type, both-number (TCT and BMT) quotations, brand-backed material, and accessories listed honestly: from either factory, pan-India.</p>
              </div>

              <Figure image={bodyImages.skylight} />
              <QuoteBlock />
            </div>

            <div hidden={activeTab !== 'specifications'} role="tabpanel" aria-labelledby="specifications">
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h2>Roofing Sheet Technical Specifications: All Types</h2>
              </div>
              <Figure image={specImages.tct} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h3>Material engineering matrix</h3>
              </div>
              <DataTable headers={['Family', 'Thickness range', 'Coating / build', 'Width & cover', 'Standards', 'Best application']} rows={materialRows} />
              <Figure image={specImages.profiles} />
              <div className="prose prose-slate max-w-none prose-headings:text-slate-950">
                <h3>Thickness and coating buying guide (steel families)</h3>
              </div>
              <DataTable headers={['Parameter', 'Guide']} rows={guideRows} />
              <Figure image={specImages.selection} />
            </div>

            <div hidden={activeTab !== 'reviews'} role="tabpanel" aria-labelledby="reviews">
              <ProductReviews reviews={[]} averageRating="0.00" ratingCount={0} productId={wcReviewProductId} productName="Roofing Sheet" />
            </div>

            <div hidden={activeTab !== 'faqs'} role="tabpanel" aria-labelledby="faqs">
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
                ['Factory-direct', 'Both-number TCT and BMT quotations.'],
                ['Transparent accessories', 'Screws, ridges, flashings and gutters listed separately.'],
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
