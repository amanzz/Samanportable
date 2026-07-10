import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MoveHorizontal } from 'lucide-react';
import type { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import ProductZoneCtas from '@/components/product/ProductZoneCtas';
import CertBadgeStrip from '@/components/product-puf/CertBadgeStrip';
import FaqAccordion from '@/components/product-puf/FaqAccordion';
import JumpNav from '@/components/product-puf/JumpNav';
import MobileStickyCta from '@/components/product-puf/MobileStickyCta';
import SpecTable from '@/components/product-puf/SpecTable';
import ProductDetailTabs from '@/components/product-puf/ProductDetailTabs';
import RelatedProductsRail, { C16_PANELS } from '@/components/product-puf/RelatedProductsRail';
import ProductCarousel from '@/components/product-puf/ProductCarousel';
import { LongImage } from '@/components/product-puf/Gallery';
import EpsInfoBox from '@/components/product-eps/EpsInfoBox';
import { panelAggregateOffer } from '@/lib/panelSchemaOffers';

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

// ── Summary-box intro (verbatim, C16-P2 EPS draft Part 1). Reused as the
//    price-free JSON-LD Product description.
const INTRO =
  'An EPS panel is a steel-faced insulated sandwich panel with an expanded-polystyrene (thermocol) core — two coated steel sheets bonded to a lightweight EPS core for walls, roofs, partitions and dry storage. It is the most budget-friendly of the five sandwich cores, which makes it the practical pick for site offices, sheds, warehouse partitions and economy wall/roof work. SAMAN manufactures EPS sandwich panels on our own lines in Bangalore and Greater Noida, so you buy the finished panel factory-direct and get the core matched to your budget, thickness and site.';

// ── Commerce gallery — 5 real EPS photos, 1:1 (alts verbatim from draft Part 9A).
const GALLERY_IMAGES = [
  { src: '/images/eps-panel/eps-panel-wall-roof-stack-1x1.webp', alt: 'Stack of SAMAN steel-faced EPS sandwich panels with visible white EPS core', title: 'EPS sandwich panel factory stack' },
  { src: '/images/eps-panel/eps-wall-panel-installed-partition-1x1.webp', alt: 'Installed EPS wall panel partition inside an industrial building', title: 'EPS wall panel partition installed' },
  { src: '/images/eps-panel/eps-roof-panel-installation-1x1.webp', alt: 'EPS roof panels being installed on a steel frame', title: 'EPS roof panel installation' },
  { src: '/images/eps-panel/eps-panel-tongue-groove-joint-closeup-1x1.webp', alt: 'Close-up of an EPS sandwich panel tongue-and-groove joint', title: 'EPS panel tongue-and-groove joint' },
  { src: '/images/eps-panel/eps-panel-core-cutaway-1x1.webp', alt: 'Cutaway sample of an EPS sandwich panel showing steel facings and EPS core', title: 'EPS panel core cutaway sample' },
];

const JUMP_ITEMS = [
  { id: 'what-is', label: 'What is an EPS Panel' },
  { id: 'manufacturing', label: 'How SAMAN Manufactures EPS' },
  { id: 'wall-vs-roof', label: 'Wall Panels vs Roof Panels' },
  { id: 'right-choice', label: 'Where EPS Is the Right Choice' },
  { id: 'wrong-choice', label: 'Where EPS Is the Wrong Choice' },
  { id: 'density', label: 'Choosing Core Density' },
  { id: 'fire', label: 'Fire Behaviour' },
  { id: 'sizes', label: 'Sizes, Delivery & Warranty' },
];

// ── Specifications tab — verbatim from draft Part 4 (two definition tables +
//    one thickness/R-value/weight table).
const SPEC_CORE = [
  { label: 'Core material', value: 'Expanded polystyrene (EPS) bead foam, closed-cell' },
  { label: 'Core density', value: '16 kg/m³ standard; 20–24 kg/m³ upgrade on request' },
  { label: 'Design thermal conductivity (λ)', value: '0.036 W/m·K' },
  { label: 'Fire behaviour', value: 'Combustible core; FR / self-extinguishing EPS grade available on request — not a non-combustible / fire-wall core' },
  { label: 'Acoustic behaviour', value: 'Low to moderate' },
  { label: 'Moisture notes', value: 'Closed-cell EPS; cut edges, joints and penetrations must be sealed' },
  { label: 'Service temperature', value: '−30°C to +70°C practical dry-use range' },
  { label: 'Best applications', value: 'Budget partitions, site offices, temporary sheds, dry storage, economy wall/roof' },
  { label: 'Use caution', value: 'Not for fire-rated walls, deep-freeze cold rooms, impact-prone or wet/edge-exposed positions' },
];

const SPEC_FACINGS = [
  { label: 'Standard facings', value: 'PPGI / PPGL coated steel (Galvalume / aluminium / stainless on request)' },
  { label: 'Facing thickness', value: '0.35–0.60 mm; 0.50/0.50 mm recommended for industrial use' },
  { label: 'Coating / finish', value: 'PPGI/PPGL polyester standard; SMP / PVDF / SS for coastal and food environments' },
  { label: 'Effective width', value: '1000–1170 mm, profile-dependent' },
  { label: 'Panel length', value: 'Up to 12 m typical' },
  { label: 'Joints', value: 'Tongue-and-groove standard; camlock for cold rooms; roof overlap with butyl tape, EPDM washers and sealant' },
  { label: 'Thickness — standard', value: '30 / 40 / 50 / 60 / 70 / 80 / 90 / 100 / 150 mm' },
  { label: 'Thickness — made to order', value: '110 / 120 / 130 / 140 / 200 mm — advance payment; price and lead time confirmed at quotation' },
  { label: 'HSN (GST/RFQ)', value: '940690' },
];

const THERMAL_ROWS = [
  ['30 mm', '0.83', '7.6'],
  ['40 mm', '1.11', '7.8'],
  ['50 mm', '1.39', '8.0'],
  ['60 mm', '1.67', '8.2'],
  ['80 mm', '2.22', '8.5'],
];

// ── FAQ (verbatim, draft Part 7) — drives the FAQPage schema below.
const FAQS = [
  { question: 'What is an EPS panel?', answer: 'An EPS panel is a steel-faced insulated sandwich panel with an expanded-polystyrene core. Two coated steel sheets are bonded to a lightweight EPS foam core to make a rigid board used for walls, roofs, partitions and dry storage. It is the most economical of the sandwich-panel cores.' },
  { question: 'What is the full form of EPS?', answer: 'EPS stands for Expanded Polystyrene — the light, closed-cell bead foam commonly called "thermocol" in India.' },
  { question: 'Is a "thermocol panel" the same as an EPS panel?', answer: 'When someone says "thermocol panel" in a building context they usually mean an EPS sandwich panel — thermocol is the everyday name for expanded polystyrene. It is not the same as a loose thermocol sheet or packaging foam; our EPS panel is a steel-faced structural building panel.' },
  { question: 'Are EPS panels fire-resistant?', answer: 'A standard EPS core is combustible. A fire-retardant (FR / self-extinguishing) EPS grade is available on request and slows ignition and flame spread, but it does not make EPS non-combustible. For fire-rated or fire-critical work, choose a Rockwool or PIR panel instead.' },
  { question: 'What thickness of EPS panel should I choose?', answer: 'Match thickness to your insulation duty using the R-value table — thicker cores give higher R-values. Light partitions often use 30–50 mm; walls and roofs needing more insulation move to 60–100 mm. Standard runs 30–150 mm, with 110–200 mm made to order.' },
  { question: 'Can EPS panels be used for both walls and roofs?', answer: 'Yes. Wall profiles suit partitions and cladding; roof profiles add a rib for run-off and spanning strength and are sealed at the overlaps. Both use the same EPS core.' },
  { question: 'What is the difference between EPS and PUF or PIR panels?', answer: 'EPS is the budget core with higher thermal conductivity (λ 0.036) and a combustible core. PUF and PIR have lower conductivity (better insulation) and better fire behaviour, at a higher price. Choose EPS for economy dry work, and PUF or PIR for cold rooms, higher performance or fire-conscious jobs.' },
  { question: 'Are EPS panels waterproof?', answer: 'The closed-cell core resists moisture, but EPS panels are not for wet or edge-exposed positions unless every cut edge, joint and penetration is properly sealed. Keep them to dry, sheltered duty.' },
];

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/eps-panel#product',
  name: 'EPS Panel',
  description: INTRO,
  category: 'EPS Panels',
  sku: 'SP-C16-EPS-SUB-2026',
  brand: { '@type': 'Brand', name: 'SAMAN Portable' },
  manufacturer: { '@type': 'Organization', name: 'SAMAN Portable' },
  material: 'Expanded polystyrene (EPS) core with coated steel facing sheets',
  image: GALLERY_IMAGES.map((g) => `https://www.samanportable.com${g.src}`),
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Standard thickness', value: '30–150 mm' },
    { '@type': 'PropertyValue', name: 'Made-to-order thickness', value: 'to 200 mm' },
    { '@type': 'PropertyValue', name: 'Core', value: 'Expanded polystyrene (EPS)' },
    { '@type': 'PropertyValue', name: 'Facings', value: 'PPGI / PPGL / Galvalume / aluminium / stainless' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: panelAggregateOffer(770, 'https://www.samanportable.com/product/eps-panel'),
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Sandwich Panels', item: 'https://www.samanportable.com/product/sandwich-panel' },
    { '@type': 'ListItem', position: 3, name: 'EPS Panel', item: 'https://www.samanportable.com/product/eps-panel' },
  ],
};

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-28 text-2xl font-bold text-foreground sm:text-3xl">
    {children}
  </h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">{children}</p>
);

const B = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold text-foreground">{children}</span>
);

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="font-semibold text-primary hover:underline">{children}</Link>
);

function DescriptionContent() {
  return (
    <div className="space-y-10">
      <JumpNav items={JUMP_ITEMS} />

      <LongImage
        src="/images/eps-panel/eps-sandwich-panel-cross-section-16x9.webp"
        alt="Cross-section of a SAMAN EPS sandwich panel showing white EPS core between two coated steel sheets"
        title="EPS sandwich panel cross-section"
      />

      <section id="what-is" className="space-y-3">
        <H2 id="what-is">What Is an EPS Panel?</H2>
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          EPS stands for <B>Expanded Polystyrene</B> — the light, closed-cell bead foam many Indian buyers still call &ldquo;thermocol&rdquo;. An <B>EPS panel</B> (or EPS sandwich panel) bonds this insulating core between two coated steel facing sheets to make a rigid, lightweight building board. The steel gives strength and a finished surface; the EPS core gives insulation and keeps the panel light and cheap to handle. Because the core is the least expensive of the five sandwich cores, EPS panels are the economy choice for walls, roofs, partitions and dry storage where budget matters more than fire rating or deep-freeze performance. SAMAN also manufactures the higher-performance cores — see our <A href="/product/puf-panel">PUF insulated panels</A>, our <A href="/product/pir-panel">PIR panels</A> and our <A href="/product/rockwool-panel">non-combustible Rockwool panels</A> — so you can <A href="/product/sandwich-panel">compare all five sandwich panel cores</A> before you commit.
        </p>
      </section>

      <section id="manufacturing" className="space-y-3">
        <H2 id="manufacturing">How SAMAN Manufactures EPS Sandwich Panels</H2>
        <P>{`We produce EPS panels on our own lines in Bangalore and Greater Noida, not as a trader. The steel facings are roll-formed and bonded to a cut-to-thickness EPS core with a controlled adhesive line, then trimmed to a tongue-and-groove or overlap edge so panels lock together on site. Facings are PPGI/PPGL coated steel as standard, with Galvalume, stainless or aluminium available on request, and the coating is matched to the environment — polyester for general use, SMP or PVDF for coastal or food-industry sites. Making the panel in-house is why we can dispatch in 3–5 days and confirm the exact build — thickness, facing, coating, joint and accessories — at quotation.`}</P>
        <LongImage
          src="/images/eps-panel/eps-panel-factory-production-bangalore-16x9.webp"
          alt="EPS sandwich panels on a SAMAN production line in Bangalore"
          title="EPS sandwich panel production line, Bangalore"
        />
      </section>

      <section id="wall-vs-roof" className="space-y-3">
        <H2 id="wall-vs-roof">EPS Wall Panels vs EPS Roof Panels</H2>
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          An <B>EPS wall panel</B> uses a flat or lightly-lined profile for partitions, cladding and cabin walls; an <B>EPS roof panel</B> adds a trapezoidal rib for run-off and spanning strength, and is fixed with butyl tape, EPDM washers and sealant at the overlaps to keep water out. Both come off the same core, so the choice is driven by where the panel sits, not by a different material. For dry, sheltered partition work the wall profile at a modest thickness is usually enough; for a roof you step up thickness and pay close attention to the overlap detailing.
        </p>
        <LongImage
          src="/images/eps-panel/eps-wall-panels-warehouse-partition-16x9.webp"
          alt="EPS wall panels used as a warehouse partition"
          title="EPS wall panels as a warehouse partition"
        />
      </section>

      <section id="right-choice" className="space-y-3">
        <H2 id="right-choice">Where EPS Panels Are the Right Choice</H2>
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          EPS panels earn their place on cost-sensitive, dry, moderate-duty work: warehouse and factory <B>partitions</B>, <B>site offices</B> and portable cabins, <B>temporary sheds</B>, dry-storage rooms, economy <B>wall and roof</B> cladding, and the non-critical interior lining of cold-storage where deep temperature control is not the job. In all of these the panel is light to lift, fast to fix, and priced below every other core — which is exactly why it is specified.
        </p>
        <LongImage
          src="/images/eps-panel/eps-roof-panels-shed-16x9.webp"
          alt="EPS roof panels installed on a lightweight industrial shed"
          title="EPS roof panels on a lightweight industrial shed"
        />
      </section>

      <section id="wrong-choice" className="space-y-3">
        <H2 id="wrong-choice">Where EPS Is the Wrong Choice — an Honest Guide</H2>
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          We would rather quote you the right core than sell you the cheapest one twice. <B>Move up from EPS</B> when the job involves: a <B>fire-rated wall</B> or any fire-critical area (choose <A href="/product/rockwool-panel">our non-combustible Rockwool panels</A> or PIR); <B>deep-freeze or high-performance cold rooms</B> and tight temperature control (choose <A href="/product/puf-panel">our PUF insulated panels</A> or PIR for their lower thermal conductivity); <B>impact-prone industrial walls</B> that take knocks and forklift traffic; <B>long-span or heavily loaded roofs</B>; or <B>wet, humid or edge-exposed positions</B> where water can reach the core. EPS is a dry, budget, moderate-duty panel — used inside those limits it performs well and saves money; pushed outside them it disappoints.
        </p>
      </section>

      <section id="density" className="space-y-3">
        <H2 id="density">Choosing EPS Core Density: 16 vs 20–24 kg/m³</H2>
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Standard EPS core is <B>16 kg/m³</B> — right for light partitions and sheltered walls. Step up to a <B>20–24 kg/m³</B> upgrade when the panel will be handled hard, used as a fuller-height or loaded partition, exposed to more site abuse, or where you simply want a firmer, more dent-resistant board. The denser core costs a little more but survives real sites better; tell us the duty at enquiry and we will recommend the density.
        </p>
      </section>

      <section id="fire" className="space-y-3">
        <H2 id="fire">Fire Behaviour of EPS Panels — Read This Before You Specify</H2>
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Straight talk: a plain EPS core is <B>combustible</B>. A <B>fire-retardant (FR / self-extinguishing) EPS grade</B> is available on request and slows ignition and flame spread, but FR grade does <B>not</B> make EPS a non-combustible or fire-wall material — that is what stone wool is for. If your specification, insurer or building code calls for a non-combustible core or a fire rating, do not force EPS to do that job; use <A href="/product/rockwool-panel">our non-combustible Rockwool panels</A> or PIR instead. Used in low fire-risk, code-permitted positions, EPS is a sound economy choice.
        </p>
        <LongImage
          src="/images/eps-panel/eps-panel-site-office-cabin-16x9.webp"
          alt="Portable site-office cabin built with SAMAN EPS panels"
          title="Portable site-office cabin in EPS panels"
        />
      </section>

      <section id="sizes" className="space-y-3">
        <H2 id="sizes">Sizes, Delivery, Warranty and Quotation</H2>
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          EPS panels are manufactured in standard thicknesses of <B>30, 40, 50, 60, 70, 80, 90, 100 and 150 mm</B>, with <B>110, 120, 130, 140 and 200 mm made to order against advance payment</B> (price and lead time confirmed at quotation). Effective cover width is 1000–1170 mm depending on profile, and panels run up to about 12 m. We dispatch in <B>3–5 days</B> from Bangalore and Greater Noida.
        </p>
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          <B>EPS panel warranty: 5–10 years, confirmed at quotation</B> (a separate line from any structural-frame warranty). Prices shown are ex-GST and exclude transport, unloading, installation, accessories, cut-outs and special profiles, which are quoted separately. Delivery follows our <A href="/delivery-policy">delivery policy</A> and returns follow our <A href="/refund-and-return-policy">returns policy</A>. Send your wall/roof, thickness, facing and quantity to the zone team above and we will confirm the exact panel and price at quotation. HSN 940690.
        </p>
        <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
          <p className="mb-2 text-sm font-bold text-foreground">Get EPS Panel Quotation</p>
          <ProductZoneCtas variant="strip" />
        </div>
      </section>
    </div>
  );
}

function SpecificationsContent() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <H2 id="spec-table">EPS Sandwich Panel — Technical Specifications</H2>
        <P>{`Every SAMAN EPS panel is a three-layer engineered board: two coated steel facing sheets bonded to an expanded-polystyrene core. The tables below give the real engineering data for the EPS core we manufacture — density, thermal conductivity, fire and acoustic behaviour, facings, joints and thickness-wise performance — so you can specify the panel straight from this page.`}</P>
        <LongImage
          src="/images/eps-panel/diagrams/eps-panel-layer-construction-diagram-16x9.webp"
          alt="Diagram of EPS sandwich panel three-layer construction: steel facing, EPS core, steel facing"
          title="EPS sandwich panel three-layer construction diagram"
        />
        <SpecTable title="EPS Core Engineering" subtitle="Owner-verified" rows={SPEC_CORE} />
        <SpecTable title="Facings, Dimensions and Joints" subtitle="Owner-verified" rows={SPEC_FACINGS} />
        <LongImage
          src="/images/eps-panel/diagrams/eps-panel-thickness-range-ladder-diagram-16x9.webp"
          alt="Diagram of EPS panel thickness range from 30 mm to 200 mm with use tags"
          title="EPS panel thickness range diagram"
        />
      </div>

      <section className="space-y-3">
        <H2 id="thermal">Thickness-Wise Thermal Performance (Core-Only Values)</H2>
        <P>{`Approximate R-value (m²K/W) and weight (kg/m² at 0.45/0.45 mm steel facings) by thickness:`}</P>
        <div className="mb-1.5 flex items-center justify-end gap-1 text-xs text-muted-foreground sm:hidden">
          <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          Scroll for more
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-3 py-2 text-left font-bold">Thickness</th>
                <th className="px-3 py-2 text-left font-bold">R-value (m²K/W)</th>
                <th className="px-3 py-2 text-left font-bold">Weight (kg/m²)</th>
              </tr>
            </thead>
            <tbody>
              {THERMAL_ROWS.map((row, i) => (
                <tr key={row[0]} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/40'}>
                  <td className="px-3 py-2 font-semibold text-foreground">{row[0]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row[1]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{`70, 90, 100 and 150 mm EPS panels are also manufactured; core-only R-value scales with thickness at λ 0.036 W/m·K, and exact weight and system performance are confirmed at quotation. Values are core-only thermal calculations; actual system performance varies by profile, joint, facing and installation.`}</P>
      </section>

      <section className="space-y-3">
        <H2 id="how-to-read">How to Read This When Specifying</H2>
        <P>{`Set thickness from the R-value column against your insulation duty, choose the wall or roof profile by position, pick the facing and coating from the environment, and raise the core density if the panel will be handled hard. Then send the filled requirement with your enquiry and we confirm the exact panel, joints and accessories at quotation. GST, transport, unloading, installation, accessories, cut-outs and special profiles are quoted separately.`}</P>
        <LongImage
          src="/images/eps-panel/diagrams/eps-panel-core-selection-decision-map-16x9.webp"
          alt="Decision map showing when to choose EPS panels and when to move to PUF, PIR or Rockwool"
          title="EPS panel core-selection decision map"
        />
        <div className="rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
          <p className="mb-2 text-sm font-bold text-foreground">Request Exact Quotation</p>
          <ProductZoneCtas variant="strip" />
        </div>
      </section>
    </div>
  );
}

function ShippingContent() {
  return (
    <div className="space-y-4">
      <H2 id="shipping">Dispatch, Delivery and Returns</H2>
      <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        EPS panels dispatch in 3–5 days from our Bangalore and Greater Noida factories, with the nearest factory serving your project for shorter transit and lower freight. Transport, unloading and delivery charges are confirmed at quotation, per our <A href="/delivery-policy">delivery policy</A>.
      </p>
      <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        Cut edges and penetrations are sealed during installation to keep moisture out of the core, and openings are trimmed with matching accessories supplied against the project requirement. Returns follow our <A href="/refund-and-return-policy">returns policy</A>.
      </p>
    </div>
  );
}

export default function EpsPanelHub() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="EPS Panel Manufacturer in India | Sizes & Specs | SAMAN"
        fallbackDescription="SAMAN manufactures steel-faced EPS sandwich panels for walls and roofs, factory-direct in Bangalore and Delhi NCR. From ₹770/sq mt, 30–150 mm. Get a quote."
        fallbackCanonical="https://www.samanportable.com/product/eps-panel"
        keywords="eps panel, eps sandwich panel, eps wall panel, eps roof panel, thermocol panel, eps panel manufacturer india"
        author="SAMAN POS India Private Limited"
        publisher="SAMAN POS India Private Limited"
      />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSONLD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />
      </Head>

      <main className="bg-background pb-24 lg:pb-12">
        <div className="mx-auto max-w-7xl container-padding pt-4">
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/product/sandwich-panel" className="hover:text-primary">Sandwich Panels</Link>
            <span>/</span>
            <span className="font-semibold text-foreground">EPS Panel</span>
          </nav>

          {/* Commerce top section — 1:1 gallery + above-fold dual-zone CTA (left),
              H1 + summary info box (right, sticky). Mirrors the pir/rockwool C16
              two-column layout. */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left sibling-panel sidebar (Ruling 4 / L1 default for C16 material pages) */}
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[C16_PANELS.puf, C16_PANELS.pir, C16_PANELS.rockwool, C16_PANELS.sandwich]}
              />
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <ProductCarousel images={GALLERY_IMAGES} />
              <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
                <p className="mb-2 text-sm font-bold text-foreground">Get EPS Panel Quotation</p>
                <ProductZoneCtas variant="strip" />
              </div>
            </div>

            <div className="order-2 lg:order-3 lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <EpsInfoBox
                h1="EPS Panel — Lightweight Expanded-Polystyrene Sandwich Panels by SAMAN"
                priceMain="From ₹770 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                intro={INTRO}
                sku="SP-C16-EPS-SUB-2026"
                hsn="940690"
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="EPS Panel"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={990020}
              reviewProductId={272769}
              productName="EPS Panel"
            />
          </div>

          {/* FAQ renders below the tabs (drives FAQPage schema) */}
          <section id="faq" className="mt-10 space-y-4">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Frequently Asked Questions</h2>
            <FaqAccordion items={FAQS} />
          </section>

          {/* Closing CTA — dual zone */}
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-foreground">Get EPS Panel Quotation</h2>
            <ProductZoneCtas />
          </div>

          {/* Related products now live in the left sibling sidebar above; the
              bottom rail is removed to avoid duplicating the same four links. */}
          <div className="mt-8 space-y-8">
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
