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
import GlassWoolInfoBox from '@/components/product-glasswool/GlassWoolInfoBox';
import { panelAggregateOffer } from '@/lib/panelSchemaOffers';

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

// Local static-JSON mirror id (synthetic 99xxxx range, no collision with the
// live WC ids). The real WooCommerce Draft product id for review submission is
// wired via REVIEW_PRODUCT_ID below.
const PRODUCT_ID = 990021;

// Real WooCommerce product id for SKU SP-C16-GWP-SUB-2026 (Draft + No Index on
// the blog subdomain). Reviews post against this id (FF-1 pattern). Mirrored in
// src/data/wp-export/products/glass-wool-panel.json (wc_review_product_id).
const REVIEW_PRODUCT_ID = 272771;

// ── Summary-box intro (verbatim, C16-P2 Glass Wool draft summary box). Reused as
//    the price-free JSON-LD Product description is NOT — the draft supplies a
//    separate schema description string (see PRODUCT_JSONLD).
const INTRO =
  'A glass wool panel is an insulated building panel with a high-density glass wool core bonded between two coated steel facing sheets. The fibrous, non-combustible core is what buyers choose it for: it absorbs sound the way foam cores cannot, and it handles heat the way budget cores cannot. SAMAN manufactures glass wool panels on our own lines in Bangalore and Greater Noida for acoustic partitions, plant rooms, generator enclosures and fire-conscious walls and roofs.';

// ── Commerce gallery — 5 glass wool photos, 1:1 (alts verbatim from draft image spec).
const GALLERY_IMAGES = [
  { src: '/images/glass-wool-panel/glass-wool-panel-stack-yellow-core.webp', alt: 'Stack of SAMAN glass wool panels showing fibrous core and steel facings', title: 'Stack of SAMAN glass wool panels showing fibrous core and steel facings' },
  { src: '/images/glass-wool-panel/glass-wool-panel-cut-edge-fibre-detail.webp', alt: 'Cut edge of a glass wool panel showing the high-density fibre core', title: 'Cut edge of a glass wool panel showing the high-density fibre core' },
  { src: '/images/glass-wool-panel/glass-wool-panel-acoustic-partition-installed.webp', alt: 'Glass wool panel acoustic partition installed in a commercial interior', title: 'Glass wool panel acoustic partition installed in a commercial interior' },
  { src: '/images/glass-wool-panel/glass-wool-panel-plant-room-wall.webp', alt: 'Glass wool panels lining an industrial plant room', title: 'Glass wool panels lining an industrial plant room' },
  { src: '/images/glass-wool-panel/glass-wool-panel-qc-bench.webp', alt: 'Quality check on a SAMAN glass wool panel at the factory', title: 'Quality check on a SAMAN glass wool panel at the factory' },
];

const JUMP_ITEMS = [
  { id: 'what-is', label: 'What is a glass wool panel?' },
  { id: 'why-core', label: 'Why choose a glass wool core — sound and heat together' },
  { id: 'where-used', label: 'Where glass wool panels are used' },
  { id: 'sizes', label: 'Sizes, thickness and facings' },
  { id: 'chooser', label: 'Glass wool panel or Rockwool panel — an honest chooser' },
  { id: 'manufacturing', label: 'How SAMAN manufactures and checks glass wool panels' },
  { id: 'price-factors', label: 'Price factors — what moves the rate' },
  { id: 'delivery', label: 'Delivery, warranty and quotation' },
  { id: 'why-manufacturer', label: 'Why buy from the manufacturer' },
];

// ── Description-tab "Sizes, thickness and facings" table (verbatim, draft Part).
const SIZES_ROWS = [
  { label: 'Thickness (standard)', value: '30 / 40 / 50 / 60 / 70 / 80 / 90 / 100 / 150 mm' },
  { label: 'Thickness (made to order)', value: '110 / 120 / 130 / 140 / 200 mm — advance payment; price and lead time confirmed at quotation' },
  { label: 'Core density', value: '48–64 kg/m³ high-density glass wool' },
  { label: 'Effective width', value: '~950–1170 mm, profile-dependent' },
  { label: 'Panel length', value: 'Up to 12 m typical; confirmed against transport and handling' },
  { label: 'Facings', value: 'PPGI / PPGL / pre-painted Galvalume or galvanized steel, 0.45–0.60 mm (0.50/0.50 mm recommended)' },
  { label: 'Joints', value: 'Tongue-and-groove / hidden-fix / through-fix with gasket; all edges sealed' },
  { label: 'HSN (GST/RFQ)', value: '940690' },
];

// ── Specifications tab — verbatim from draft (single Parameter/Value table,
//    rendered in the established two-caption layout; every row verbatim).
const SPEC_CORE = [
  { label: 'Core material', value: 'High-density glass wool / fibreglass insulation' },
  { label: 'Core density', value: '48–64 kg/m³ common' },
  { label: 'Design thermal conductivity (λ)', value: '0.036 W/m·K' },
  { label: 'Fire behaviour', value: 'Class A1 / non-combustible core when tested; system certificate required for rated assemblies' },
  { label: 'Acoustic behaviour', value: 'Very good to excellent' },
  { label: 'Moisture notes', value: 'Fibrous core — seal all edges, laps and penetrations' },
  { label: 'Service temperature', value: '−50°C to +250°C core/service range; panel system by certificate' },
  { label: 'Best applications', value: 'Acoustic partitions, generator enclosures, HVAC/plant rooms, fire-conscious wall/roof panels' },
  { label: 'Use caution', value: 'Not for wet exposure unless fully sealed' },
];

const SPEC_FACINGS = [
  { label: 'Standard facings', value: 'PPGI / PPGL / pre-painted Galvalume or galvanized steel' },
  { label: 'Facing thickness', value: '0.45–0.60 mm; 0.50/0.50 mm recommended' },
  { label: 'Coating / finish', value: 'PPGI/PPGL polyester standard; SMP / PVDF / SS / PVC for coastal, food and pharma environments' },
  { label: 'Effective width', value: '~950–1170 mm, profile-dependent' },
  { label: 'Panel length', value: 'Up to 12 m typical; confirm handling limit' },
  { label: 'Joints', value: 'Tongue-and-groove / hidden-fix / through-fix with gasket' },
  { label: 'Thickness — standard', value: '30 / 40 / 50 / 60 / 70 / 80 / 90 / 100 / 150 mm' },
  { label: 'Thickness — made to order', value: '110 / 120 / 130 / 140 / 200 mm — advance payment; confirmed at quotation' },
  { label: 'HSN', value: '940690' },
];

// Thickness-wise thermal performance (core-only), verbatim 4-column table.
const THERMAL_ROWS = [
  ['30 mm', '0.83', '9.0', 'Thin acoustic/fire-conscious lining, light roof/wall'],
  ['40 mm', '1.11', '9.7', 'Light acoustic partitions, ceilings'],
  ['50 mm', '1.39', '10.3', 'Acoustic partitions, plant rooms, fire-conscious walls'],
  ['60 mm', '1.67', '10.9', 'Generator enclosures, plant rooms, acoustic walls'],
  ['70 mm', '1.94', '11.6', 'Intermediate acoustic/fire wall thickness'],
  ['80 mm', '2.22', '12.2', 'Premium acoustic/fire-conscious roof and wall'],
];

// ── FAQ (verbatim, draft Part 7) — drives the FAQPage schema below.
const FAQS = [
  { question: 'What is a glass wool panel?', answer: 'A glass wool panel is a three-layer insulated panel: two coated steel facing sheets bonded to a high-density glass wool core (48–64 kg/m³). The steel gives strength and finish; the fibrous core gives thermal insulation and sound absorption, so one board forms a finished, insulated, acoustic wall or roof.' },
  { question: 'Is a glass wool panel good for soundproofing?', answer: 'Yes — acoustic control is its specialty. The fibrous glass wool core absorbs sound energy in a way foam cores cannot, rating very good to excellent. It is the standard choice for acoustic partitions, generator enclosures, plant rooms and studios where noise must stay inside the room.' },
  { question: 'Is a glass wool panel fireproof?', answer: 'The glass wool core is non-combustible glass mineral (Class A1 core behaviour when tested as a system) — it does not burn. But a "fire-rated wall" needs a certified panel assembly, which is Rockwool panel territory. We state it honestly: glass wool is fire-conscious; certified fire resistance is confirmed per system at quotation.' },
  { question: 'Glass wool panel vs Rockwool panel — which should I choose?', answer: 'Choose Rockwool when a tender demands a certified fire-resistance class or maximum density. Choose glass wool when the problem is noise, heat and budget — it is lighter, easier to handle, acoustically excellent, and starts at ₹1,010/sq mt against Rockwool’s ₹1,290.' },
  { question: 'What is the difference between a glass wool panel and glass wool insulation?', answer: 'Glass wool insulation is loose material — rolls and blankets that still need framing and cladding. A glass wool panel is the finished product: the same wool pressed to high density and factory-bonded between steel facings, arriving as a self-supporting board that installs in one step.' },
  { question: 'What sizes do glass wool panels come in?', answer: 'Standard thickness runs 30 to 150 mm, with 110–200 mm made to order on advance payment. Width is roughly 950–1170 mm depending on profile, and lengths run up to 12 m subject to transport. Facings are PPGI, PPGL or pre-painted Galvalume at 0.45–0.60 mm.' },
  { question: 'Do you manufacture glass wool panels in India?', answer: 'Yes. SAMAN manufactures glass wool panels at two factories — Bangalore serving South India and Greater Noida serving North India and Delhi NCR — with pan-India dispatch, so the density, thickness, facing and length are made to your job rather than picked from stock.' },
];

// JSON-LD — verbatim from the draft schema plan (Product with SKU, no price/
// offers, no AggregateRating; BreadcrumbList; FAQPage generated from FAQS).
const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/glass-wool-panel#product',
  name: 'Glass Wool Panel',
  description:
    'Glass wool panel by SAMAN — high-density glass wool core (48–64 kg/m³) bonded between coated steel facings, for acoustic partitions, generator enclosures, plant rooms and fire-conscious walls and roofs. Manufactured in Bangalore and Greater Noida.',
  category: 'Insulated Sandwich Panel',
  sku: 'SP-C16-GWP-SUB-2026',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'High-density glass wool core with steel facing sheets',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Core density', value: '48–64 kg/m³' },
    { '@type': 'PropertyValue', name: 'Thermal conductivity', value: '0.036 W/m·K (design)' },
    { '@type': 'PropertyValue', name: 'Fire behaviour', value: 'Non-combustible glass wool core (Class A1 core behaviour when tested)' },
    { '@type': 'PropertyValue', name: 'Thickness range', value: '30–150 mm standard; 110–200 mm made to order' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: panelAggregateOffer(1010, 'https://www.samanportable.com/product/glass-wool-panel'),
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'Glass Wool Panel', item: 'https://www.samanportable.com/product/glass-wool-panel' },
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
      <P>
        A glass wool panel gives you three jobs in one board: a finished steel wall surface, thermal insulation, and — its real specialty — sound absorption from a fibrous core that foam panels cannot match. If your project has a noise problem, a plant room, or a specification that asks for a non-combustible core at a sensible price, this is the panel that fits.
      </P>

      <blockquote className="rounded-xl border-l-4 border-primary bg-primary/[0.04] px-4 py-3 text-[15px] leading-relaxed text-foreground">
        <B>Get a factory-direct glass wool panel quotation:</B> South India +91 88616 22859 · sales@samanportable.com | North India / Delhi NCR +91 87960 39938 · ncr@samanportable.com
      </blockquote>

      <JumpNav items={JUMP_ITEMS} />

      <section id="what-is" className="space-y-3">
        <H2 id="what-is">What is a glass wool panel?</H2>
        <P>
          A glass wool panel is a three-layer insulated panel: two coated steel facing sheets bonded to a core of high-density glass wool — fine glass fibres pressed to 48–64 kg/m³. The steel facings carry the strength, weather resistance and finish; the fibrous core carries the thermal and acoustic performance.
        </P>
        <P>
          Do not confuse the panel with loose glass wool insulation. Rolls and blankets of glass wool are raw material — they need a frame, a cladding layer and site labour before they become a wall. A glass wool panel arrives from our line as a finished, self-supporting board: fix it, seal the joints, and the partition or roof is done. Buyers searching for &ldquo;glass wool&rdquo; often land on loose-roll sellers; if you want the finished panel, this page is the right place.
        </P>
        <LongImage
          src="/images/glass-wool-panel/glass-wool-panel-production-line-india.webp"
          alt="Glass wool panel production line bonding steel facings to the fibre core"
          title="Glass wool panel production line bonding steel facings to the fibre core"
        />
      </section>

      <section id="why-core" className="space-y-3">
        <H2 id="why-core">Why choose a glass wool core — sound and heat together</H2>
        <P>
          The core is the decision. Glass wool&rsquo;s fibre structure traps sound energy, which is why its acoustic behaviour rates very good to excellent — the best in our range alongside Rockwool, and clearly ahead of PUF, PIR or EPS foam cores. The same fibre structure is non-combustible glass mineral (Class A1 core behaviour when tested as a system), and the core tolerates a service range far beyond foam.
        </P>
        <P>
          That combination — acoustic control, fire-conscious behaviour, honest thermal insulation (λ 0.036 W/m·K design value) — at a price below Rockwool is the reason consultants specify glass wool panels for sound-sensitive and heat-exposed rooms that do not need a certified fire-rated wall assembly.
        </P>
        <P>
          One honest limitation, because it decides jobs: the core is fibrous, so cut edges, laps and penetrations must be sealed against moisture. For wet or open-edge exposure, choose a closed-cell core instead — we will tell you which one when you send the application.
        </P>
      </section>

      <section id="where-used" className="space-y-3">
        <H2 id="where-used">Where glass wool panels are used</H2>
        <P>
          <B>Acoustic partitions.</B> Studios, halls, offices beside noisy floors, test rooms — the panel forms the partition and absorbs the noise in one build step.
        </P>
        <P>
          <B>Generator enclosures and plant rooms.</B> DG sets, compressors, HVAC plants — the panel takes the heat and cuts the noise leaving the room, which is the usual compliance problem.
        </P>
        <P>
          <B>Fire-conscious walls and roofs.</B> Where the brief says &ldquo;non-combustible core&rdquo; without demanding a certified fire-resistance rating, glass wool panels answer it economically. Where a certified EI rating is demanded, see <A href="/product/rockwool-panel">our Rockwool panel range&rsquo;s fire-rated systems</A> — that is its territory, not this page&rsquo;s.
        </P>
        <P>
          <B>Insulated partitions and linings.</B> Interior walls and ceilings in industrial and commercial buildings where thermal comfort and sound both matter.
        </P>
        <LongImage
          src="/images/glass-wool-panel/glass-wool-panel-acoustic-partition-install.webp"
          alt="Installing glass wool acoustic partition panels at an Indian commercial site"
          title="Installing glass wool acoustic partition panels at an Indian commercial site"
        />
      </section>

      <section id="sizes" className="space-y-3">
        <H2 id="sizes">Sizes, thickness and facings</H2>
        <SpecTable title="Sizes, Thickness and Facings" subtitle="Owner-verified" rows={SIZES_ROWS} />
        <P>
          Thickness follows the duty: 30–50 mm for interior acoustic partitions and linings, 50–80 mm for plant rooms, enclosures and roofs, and the thicker end where thermal load or sound targets are higher. Exact rate per thickness is confirmed at quotation; the price factors below explain what moves it.
        </P>
        <LongImage
          src="/images/glass-wool-panel/glass-wool-panel-generator-room-enclosure.webp"
          alt="Generator enclosure built with glass wool sandwich panels"
          title="Generator enclosure built with glass wool sandwich panels"
        />
      </section>

      <section id="chooser" className="space-y-3">
        <H2 id="chooser">Glass wool panel or Rockwool panel — an honest chooser</H2>
        <P>
          Both are mineral-fibre, non-combustible cores with strong acoustic behaviour, and they are the two panels buyers cross-shop. The honest split: <B>Rockwool</B> is denser (100–120 kg/m³), carries certified fire-rated wall assemblies, and costs more — it is the specification-grade fire panel. <B>Glass wool</B> is lighter, quieter for its price, easier to handle, and from ₹1,010/sq mt against Rockwool&rsquo;s ₹1,290 — it is the value choice for acoustic and heat-conscious work that does not need a certified fire rating. If a tender names a fire-resistance class, go Rockwool; if the problem is noise, heat and budget, glass wool usually wins the comparison.
        </P>
      </section>

      <section id="manufacturing" className="space-y-3">
        <H2 id="manufacturing">How SAMAN manufactures and checks glass wool panels</H2>
        <P>
          Our lines bond the high-density glass wool core between two facing coils under pressure so the fibre slab and both steel skins behave as one board — not a loose infill inside a tray. Each batch is checked for facing gauge, panel thickness, core density and joint profile, and every panel leaves edge-protected and bundled, because an unsealed fibrous edge is the one weakness this product has. We dispatch from Bangalore for South India and Greater Noida for North India and Delhi NCR.
        </P>
        <LongImage
          src="/images/glass-wool-panel/glass-wool-panel-qc-density-check.webp"
          alt="Factory QC checking glass wool panel density and facing gauge"
          title="Factory QC checking glass wool panel density and facing gauge"
        />
      </section>

      <section id="price-factors" className="space-y-3">
        <H2 id="price-factors">Price factors — what moves the rate</H2>
        <P>
          The published base is ₹1,010/sq mt for the 30 mm base spec, ex-GST. Thickness is the biggest lever; core density, facing steel and coating, panel length and any hidden-fix or gasket detailing move it from there. GST, transport, unloading, installation and accessories are quoted separately. Send thickness, area and site city and we return a fixed quotation — for the thickness-wise rate table, a dedicated price guide follows this page.
        </P>
      </section>

      <section id="delivery" className="space-y-3">
        <H2 id="delivery">Delivery, warranty and quotation</H2>
        <P>
          Default dispatch is 3–5 business days on standard products; transport is confirmed at quotation, and a 500 m² minimum billing applies to long-distance dispatch — see our <A href="/delivery-policy">Delivery Policy</A>. Panel warranty is 5–10 years, confirmed at quotation. Standard products carry 7-day returns (3-day on custom) — see our <A href="/refund-and-return-policy">Refund &amp; Return Policy</A>. Quotes are supply-only unless stated otherwise.
        </P>
      </section>

      <section id="why-manufacturer" className="space-y-3">
        <H2 id="why-manufacturer">Why buy from the manufacturer</H2>
        <P>
          A trader sells the panel that is in stock; we manufacture to your job — density, thickness, facing, length and joint matched to the noise, heat or fire brief, with factory QC on every batch and two dispatch origins to shorten freight. To see how glass wool sits against all five cores we make, <A href="/product/sandwich-panel">compare every sandwich panel core we manufacture</A>. For cost-led dry partitions where acoustic performance is not the driver, <A href="/product/eps-panel">the budget-friendly EPS panel option</A> is the honest alternative.
        </P>
        <LongImage
          src="/images/glass-wool-panel/glass-wool-panel-dispatch-bundles.webp"
          alt="Glass wool panel bundles dispatched from the SAMAN factory"
          title="Glass wool panel bundles dispatched from the SAMAN factory"
        />
        <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
          <p className="mb-2 text-sm font-bold text-foreground">Get Glass Wool Panel Quotation</p>
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
        <H2 id="spec-table">Glass Wool Panel Technical Specifications</H2>
        <LongImage
          src="/images/glass-wool-panel/diagrams/glass-wool-panel-anatomy-fibre-core-diagram.webp"
          alt="Anatomy diagram of a glass wool panel"
          title="Anatomy diagram of a glass wool panel"
        />
        <SpecTable title="Glass Wool Core & Performance" subtitle="Owner-verified" rows={SPEC_CORE} />
        <SpecTable title="Facings, Dimensions and Joints" subtitle="Owner-verified" rows={SPEC_FACINGS} />
      </div>

      <section className="space-y-3">
        <H2 id="thermal">Thickness-wise thermal performance (core-only values)</H2>
        <div className="mb-1.5 flex items-center justify-end gap-1 text-xs text-muted-foreground sm:hidden">
          <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          Scroll for more
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-3 py-2 text-left font-bold">Thickness</th>
                <th className="px-3 py-2 text-left font-bold">Approx R-value (m²K/W)</th>
                <th className="px-3 py-2 text-left font-bold">Approx weight (kg/m² at 0.45/0.45 steel)</th>
                <th className="px-3 py-2 text-left font-bold">Typical use</th>
              </tr>
            </thead>
            <tbody>
              {THERMAL_ROWS.map((row, i) => (
                <tr key={row[0]} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/40'}>
                  <td className="px-3 py-2 font-semibold text-foreground">{row[0]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row[1]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row[2]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{`Values are core-only thermal calculations; system performance varies by profile, joint, facing and installation. 90–150 mm standard and MTO values confirmed at quotation.`}</P>
        <LongImage
          src="/images/glass-wool-panel/diagrams/glass-wool-panel-edge-sealing-detail-diagram.webp"
          alt="Edge sealing detail for glass wool panels"
          title="Edge sealing detail for glass wool panels"
        />
        <LongImage
          src="/images/glass-wool-panel/diagrams/glass-wool-vs-rockwool-selection-diagram.webp"
          alt="Choosing between glass wool and Rockwool panels"
          title="Choosing between glass wool and Rockwool panels"
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
        Default dispatch is 3–5 business days on standard products; transport is confirmed at quotation, and a 500 m² minimum billing applies to long-distance dispatch — see our <A href="/delivery-policy">Delivery Policy</A>. Panel warranty is 5–10 years, confirmed at quotation.
      </p>
      <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        Standard products carry 7-day returns (3-day on custom) — see our <A href="/refund-and-return-policy">Refund &amp; Return Policy</A>. Quotes are supply-only unless stated otherwise.
      </p>
    </div>
  );
}

export default function GlassWoolPanelHub() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="Glass Wool Panel Manufacturer — Acoustic & Thermal Panels | SAMAN"
        fallbackDescription="Glass wool panel by SAMAN — insulated panels with a non-combustible glass wool core for acoustic partitions, plant rooms and fire-conscious walls. From ₹1,010/sq mt, 30–150 mm, factory-made in Bangalore and Greater Noida."
        fallbackCanonical="https://www.samanportable.com/product/glass-wool-panel"
        keywords="glass wool panel, glasswool panel, glass wool sandwich panel, glass wool panel manufacturer"
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
            <Link href="/product" className="hover:text-primary">Product</Link>
            <span>/</span>
            <span className="font-semibold text-foreground">Glass Wool Panel</span>
          </nav>

          {/* Commerce top section — three-column desktop layout (siblings rail /
              gallery / summary box). Mobile stack order is set to match the
              porta-cabin / portable-cabin product pages: gallery (5 images) first,
              then the summary + short description, then the related range. Desktop
              order (rail → gallery → summary) is preserved via the lg:order-* utils. */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left sibling-panel sidebar (Ruling 4 / L1 default for C16 material pages).
                Mobile: last (order-3, related range at the bottom). Desktop: first. */}
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[C16_PANELS.puf, C16_PANELS.pir, C16_PANELS.eps, C16_PANELS.rockwool, C16_PANELS.sandwich]}
              />
            </div>

            {/* Gallery — mobile: first (order-1, the 5 WooCommerce images). Desktop: middle. */}
            <div className="order-1 lg:order-2 lg:col-span-5">
              <ProductCarousel images={GALLERY_IMAGES} />
              <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
                <p className="mb-2 text-sm font-bold text-foreground">Get Glass Wool Panel Quotation</p>
                <ProductZoneCtas variant="strip" />
              </div>
            </div>

            {/* Summary box (H1 + price + short description). Mobile: second (order-2). Desktop: last. */}
            <div className="order-2 lg:order-3 lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <GlassWoolInfoBox
                h1="Glass Wool Panel — Acoustic and Thermal Insulated Panels by SAMAN"
                priceMain="From ₹1,010 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                intro={INTRO}
                sku="SP-C16-GWP-SUB-2026"
                hsn="940690"
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="Glass Wool Panel"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={PRODUCT_ID}
              reviewProductId={REVIEW_PRODUCT_ID}
              productName="Glass Wool Panel"
            />
          </div>

          {/* FAQ renders below the tabs (drives FAQPage schema) */}
          <section id="faq" className="mt-10 space-y-4">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Frequently Asked Questions</h2>
            <FaqAccordion items={FAQS} />
          </section>

          {/* Closing CTA — dual zone */}
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-foreground">Get Glass Wool Panel Quotation</h2>
            <ProductZoneCtas />
          </div>

          {/* Related products live in the left sibling sidebar above; the bottom
              rail is removed to avoid duplicating the same four links. */}
          <div className="mt-8 space-y-8">
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
