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
import RockwoolInfoBox from '@/components/product-rockwool/RockwoolInfoBox';
import { panelAggregateOffer } from '@/lib/panelSchemaOffers';

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

// ── Answer-first definition (top, above tabs) — verbatim para 1 of the C16-P1
//    ROCKWOOL draft answer-first opening block.
const SHORT_DESCRIPTION =
  'A rockwool panel is an insulated sandwich panel with a stone wool (mineral wool) core bonded between two pre-painted steel facing sheets. Because stone wool is a non-combustible fibre material, rockwool sandwich panels are the standard choice in India for fire-safe industrial walls, PEB partitions, acoustic enclosures and plant rooms — applications where foam-core panels are not permitted or not preferred.';

// ── Commerce gallery — 5 real rockwool photos, 1:1 (subjects/alt/title unique each)
const GALLERY_IMAGES = [
  { src: '/images/rockwool-panel/rockwool-panel-product-front-sq.webp', alt: 'SAMAN rockwool sandwich panel front face with exposed stone wool core edge', title: 'Rockwool sandwich panel front' },
  { src: '/images/rockwool-panel/rockwool-panel-core-cross-section-sq.webp', alt: 'Cut section of a SAMAN rockwool panel showing the stone wool core on the QC table', title: 'Rockwool panel core cross-section' },
  { src: '/images/rockwool-panel/rockwool-panel-joint-profile-sq.webp', alt: 'Hidden-fix joint detail of a SAMAN rockwool panel with stone wool core', title: 'Rockwool panel joint profile detail' },
  { src: '/images/rockwool-panel/rockwool-panel-stacked-sq.webp', alt: 'Stack of black-faced SAMAN rockwool sandwich panels in the factory', title: 'Rockwool sandwich panels stacked' },
  { src: '/images/rockwool-panel/rockwool-panel-installed-wall-sq.webp', alt: 'SAMAN rockwool wall panels installed on an industrial building', title: 'Rockwool wall panels installed' },
];

const JUMP_ITEMS = [
  { id: 'what-is', label: 'What Is a Rockwool Panel' },
  { id: 'why-choose', label: 'Why Choose Rockwool' },
  { id: 'fire', label: 'Fire Performance' },
  { id: 'acoustic', label: 'Acoustic Performance' },
  { id: 'applications', label: 'Applications' },
  { id: 'comparison', label: 'Rockwool vs PUF vs PIR' },
  { id: 'why-saman', label: 'Why SAMAN' },
];

const SPEC_ROWS = [
  { label: 'Core material', value: 'Stone wool / mineral wool, lamella construction' },
  { label: 'Standard thickness', value: '30 / 40 / 50 / 60 / 70 / 80 / 90 / 100 / 150 mm' },
  { label: 'Made-to-order thickness', value: '110 / 120 / 130 / 140 / 200 mm (advance payment)' },
  { label: 'Core density', value: 'High-density stone wool; density confirmed through quotation, datasheet or test certificate' },
  { label: 'Facing sheets', value: 'PPGI (0.35–0.80 mm) · PPGL · Stainless Steel · Aluminium options' },
  { label: 'Coating', value: 'Polyester standard; SMP/PVDF/SS/PVC for coastal, chemical, food and pharma projects' },
  { label: 'Joints', value: 'Tongue-and-groove and cam-lock, both offered' },
  { label: 'Applications', value: 'Wall panels, roof panels, partitions, acoustic enclosures' },
  { label: 'Fire performance', value: 'Non-combustible stone wool core; panel-system fire rating confirmed through test certificate at quotation' },
  { label: 'Acoustic performance', value: 'Sound-absorbing fibre core; tested values confirmed at quotation' },
  { label: 'HSN code', value: '940690' },
  { label: 'Warranty', value: '5–10 years, confirmed at quotation' },
  { label: 'Manufacturing', value: 'Bangalore (Gopasandra) and Greater Noida factories' },
];

// Thickness & indicative price table — verbatim from the draft.
const PRICE_ROWS = [
  ['30 mm', '₹1,290', 'Thin fire-safe lining and partitions'],
  ['40 mm', '₹1,420', 'Fire-conscious partitions'],
  ['50 mm', '₹1,540', 'Industrial wall panels, acoustic partitions'],
  ['60 mm', '₹1,640', 'Higher fire and acoustic performance'],
  ['80 mm', '₹1,810', 'Premium fire-safe wall/roof and acoustic work'],
  ['90 / 100 / 150 mm & MTO sizes', 'Confirmed at quotation', 'Project-specific systems'],
];

// Rockwool vs PUF vs PIR — verbatim from the draft.
const CORE_COMPARISON = [
  ['Core type', 'Non-combustible stone wool fibre', 'Rigid polyurethane foam', 'Fire-improved polyisocyanurate foam'],
  ['Fire behaviour', 'Non-combustible core; system rating by certificate', 'Self-extinguishing grades available', 'Improved fire reaction over PUF; system-tested'],
  ['Thermal insulation', 'Good', 'Excellent', 'Excellent'],
  ['Acoustic absorption', 'Excellent', 'Moderate', 'Moderate'],
  ['Weight', 'Heaviest', 'Light', 'Light'],
  ['Best for', 'Fire-rated walls, acoustic enclosures, plant rooms', 'Cold rooms, cabins, insulated roofing', 'Cleanrooms, pharma, premium cold rooms'],
];

const FAQS = [
  { question: 'What is a rockwool panel?', answer: 'A rockwool panel is a sandwich panel with a non-combustible stone wool (mineral wool) core bonded between two coated steel sheets, used for fire-safe and acoustic wall, roof and partition systems.' },
  { question: 'What is the difference between rockwool and mineral wool?', answer: 'Rockwool is a type of mineral wool made from volcanic rock. In the Indian market the terms rockwool, rock wool, stone wool and mineral wool are used interchangeably for the same panel core.' },
  { question: 'What thicknesses are available in rockwool panels?', answer: 'SAMAN manufactures 30, 40, 50, 60, 70, 80, 90, 100 and 150 mm as standard, with 110, 120, 130, 140 and 200 mm available made-to-order against advance payment.' },
  { question: 'Are rockwool panels fireproof?', answer: 'The stone wool core is non-combustible. The fire rating of the complete panel system is established by test certificate for the exact assembly, which SAMAN confirms at quotation.' },
  { question: 'Are rockwool panels good for soundproofing?', answer: 'Yes — the fibre core absorbs sound effectively, which is why rockwool panels are the common choice for generator enclosures, compressor rooms and acoustic partitions. Tested values are confirmed at quotation.' },
  { question: 'Can rockwool panels be used for both walls and roofs?', answer: 'Yes. Wall and roof profiles are both supplied. Because rockwool panels are heavier than foam-core panels, support spacing is confirmed during quotation.' },
  { question: 'Who manufactures rockwool panels in India?', answer: 'SAMAN Portable manufactures rockwool sandwich panels at two factories — Bangalore (Gopasandra) and Greater Noida — supplying projects across India with nearest-factory dispatch.' },
  { question: 'What is the difference between rockwool, PUF and PIR panels?', answer: 'Rockwool has a non-combustible fibre core chosen for fire and acoustic performance; PUF and PIR have foam cores chosen for maximum thermal insulation. See the comparison table above, or ask our team to recommend the right core at quotation.' },
  { question: 'What facing sheets are used on rockwool panels?', answer: 'PPGI in 0.35–0.80 mm is standard, with PPGL, stainless steel and aluminium options, and special coatings for coastal, food and pharma projects.' },
  { question: 'How is rockwool panel price decided?', answer: 'By thickness, core density, facing gauge, coating and order quantity. Indicative base prices are listed above; exact pricing is confirmed at quotation.' },
];

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'ProductGroup',
  '@id': 'https://www.samanportable.com/product/rockwool-panel#product',
  name: 'Rockwool Panel',
  description: SHORT_DESCRIPTION,
  category: 'Rockwool Panels',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Non-combustible stone wool (mineral wool) core with steel facing sheets',
  image: GALLERY_IMAGES.map((g) => `https://www.samanportable.com${g.src}`),
  productGroupID: 'rockwool-panel',
  variesBy: ['https://schema.org/size'],
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Standard thickness', value: '30–150 mm' },
    { '@type': 'PropertyValue', name: 'Made-to-order thickness', value: 'to 200 mm' },
    { '@type': 'PropertyValue', name: 'Core', value: 'Non-combustible stone wool / mineral wool' },
    { '@type': 'PropertyValue', name: 'Facings', value: 'PPGI / PPGL / Stainless Steel / Aluminium' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: panelAggregateOffer(1290, 'https://www.samanportable.com/product/rockwool-panel'),
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'Rockwool Panel', item: 'https://www.samanportable.com/product/rockwool-panel' },
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

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-bold text-foreground sm:text-xl">{children}</h3>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">{children}</p>
);

const Lead = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
    <span className="font-bold text-foreground">{label}</span> {children}
  </p>
);

function DescriptionContent() {
  return (
    <div className="space-y-10">
      <P>{`SAMAN Portable manufactures rockwool sandwich panels at both of our factories — Gopasandra, Bangalore (South India dispatch) and Greater Noida (North India dispatch) — in standard thicknesses from 30mm to 150mm, with made-to-order thicknesses up to 200mm against advance payment. Panels are supplied for wall and roof applications with tongue-and-groove or cam-lock joints and a choice of facing sheets and coatings.`}</P>

      <JumpNav items={JUMP_ITEMS} />

      <section id="what-is" className="space-y-3">
        <H2 id="what-is">What Is a Rockwool Sandwich Panel?</H2>
        <P>{`A rockwool sandwich panel — also written as rock wool panel or mineral wool panel — is a three-layer building panel. The core is stone wool: molten volcanic rock spun into dense fibres, arranged in lamella strips so the fibres run perpendicular to the panel faces. This fibre orientation gives the panel its compressive strength and keeps the core stable at high temperatures. The core is bonded under pressure between two coated steel sheets, and the panel edges are profiled into an interlocking joint.`}</P>
        <P>{`The result is a single factory-finished component that replaces brickwork, insulation, and cladding in one installation step. Where PUF and PIR panels use foam cores optimised for thermal insulation, the rockwool core is chosen when fire safety and sound absorption lead the specification.`}</P>
        <LongImage
          src="/images/rockwool-panel/rockwool-panel-manufacturer-india-saman.webp"
          alt="Rockwool sandwich panels stacked at SAMAN factory showing stone wool core"
          title="Rockwool sandwich panel stock, factory floor"
        />
      </section>

      <section id="why-choose" className="space-y-3">
        <H2 id="why-choose">Why Choose Rockwool Panels?</H2>
        <Lead label="Non-combustible core.">{`Stone wool is a mineral fibre that does not burn. For fire-conscious buyers — plant rooms, electrical rooms, industrial partitions near hot work — this is the deciding factor over foam-core panels. The fire rating of the complete panel assembly is confirmed through test certificate at the time of quotation.`}</Lead>
        <Lead label="Strong acoustic behaviour.">{`The open fibre structure of stone wool absorbs sound energy instead of reflecting it, which is why rockwool panels are widely used for generator enclosures, compressor rooms and acoustic partitions. Tested acoustic values for a specific panel build are confirmed at quotation.`}</Lead>
        <Lead label="High-temperature stability.">{`Stone wool retains its form at service temperatures far beyond the range of foam cores, making rockwool panels suitable for plant areas with sustained heat exposure.`}</Lead>
        <Lead label="Dimensional stability and durability.">{`The dense lamella core resists sagging and maintains joint integrity over the panel's service life. SAMAN rockwool panels carry a 5–10 year warranty, confirmed at quotation.`}</Lead>
        <Lead label="One honest caution:">{`rockwool panels are heavier than PUF, PIR or EPS panels of the same thickness. Purlin and girt spacing, lifting method and supporting structure must be checked before ordering — our team verifies this with you at quotation stage.`}</Lead>
        <LongImage
          src="/images/rockwool-panel/rockwool-sandwich-panel-factory-production.webp"
          alt="Rockwool sandwich panel production at SAMAN Portable factory"
          title="Rockwool sandwich panel production line"
        />
      </section>

      <section id="fire" className="space-y-3">
        <H2 id="fire">Fire Performance of Rockwool Panels</H2>
        <P>{`Stone wool is made from rock melted at very high temperature and spun into fibre — the raw material itself does not burn. This is the fundamental difference between rockwool panels and foam-core panels: the fire behaviour starts at the material level, not from additives.`}</P>
        <P>{`Two things matter when specifying fire performance, and buyers should insist on both being clear in every quotation they compare:`}</P>
        <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          <li><span className="font-semibold text-foreground">Core behaviour</span>{` — stone wool is non-combustible by nature.`}</li>
          <li><span className="font-semibold text-foreground">Panel-system fire rating</span>{` — the rating of the complete assembly (core + facings + joints + sealants) is established only by a test certificate for that exact build. SAMAN confirms the applicable fire documentation through quotation, datasheet or test certificate, and a third-party/government-authorized inspection certificate is provided at time of sale.`}</li>
        </ol>
        <P>{`A core-only fire claim without an assembly certificate is not a fire rating. We state this plainly because it is the single most common source of confusion in panel procurement.`}</P>
        <LongImage
          src="/images/rockwool-panel/rockwool-panel-stone-wool-core-closeup.webp"
          alt="Close-up of non-combustible stone wool core in SAMAN rockwool panel"
          title="Stone wool core close-up"
        />
      </section>

      <section id="acoustic" className="space-y-3">
        <H2 id="acoustic">Acoustic Performance — Rockwool for Sound Insulation</H2>
        <P>{`The same fibre structure that resists fire also absorbs sound. Rockwool's dense, non-directional fibres convert sound energy into minute amounts of heat, reducing both airborne noise transmission and reverberation. This makes rockwool sandwich panels the practical choice for generator and compressor enclosures, DG rooms and plant-room partitions where equipment noise must be contained, and for industrial walls where a quieter working environment is required.`}</P>
        <P>{`Acoustic performance depends on panel thickness, core density and the complete wall build-up. Tested acoustic values for your specific requirement are confirmed at quotation — describe the noise source and target environment in your enquiry and our team will recommend the appropriate panel configuration.`}</P>
        <LongImage
          src="/images/rockwool-panel/rockwool-panel-acoustic-enclosure-plant-room.webp"
          alt="Rockwool panels used for acoustic enclosure in a plant room"
          title="Rockwool acoustic enclosure, plant room"
        />
      </section>

      <section id="applications" className="space-y-4">
        <H2 id="applications">Rockwool Panel Applications</H2>
        <Lead label="Fire-rated and fire-conscious walls.">{`Industrial partitions, plant rooms, electrical and battery rooms, and walls near hot-work zones where a non-combustible core is mandatory or preferred.`}</Lead>
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          <span className="font-bold text-foreground">PEB and industrial buildings.</span>{` Wall cladding and internal partitions for pre-engineered buildings, warehouses and factories — SAMAN also supplies `}
          <Link href="/prefab-solutions" className="font-semibold text-primary hover:underline">complete PEB structures</Link>
          {`, so panels and structure can be specified together.`}
        </p>
        <Lead label="Acoustic enclosures.">{`Generator, compressor and HVAC plant enclosures where sound absorption leads the specification.`}</Lead>
        <Lead label="Industrial facades and roofs.">{`Fire-safe insulated envelopes where panel weight and purlin spacing are engineered accordingly.`}</Lead>
        <LongImage
          src="/images/rockwool-panel/rockwool-wall-panel-industrial-installation.webp"
          alt="Rockwool wall panels installed in an industrial building"
          title="Rockwool wall panel installation"
        />
      </section>

      <section id="comparison" className="space-y-3">
        <H2 id="comparison">Rockwool vs PUF vs PIR — Which Panel for Which Job?</H2>
        <div className="mb-1.5 flex items-center justify-end gap-1 text-xs text-muted-foreground sm:hidden">
          <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          Scroll for more
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-3 py-2 text-left font-bold">Factor</th>
                <th className="px-3 py-2 text-left font-bold">Rockwool Panel</th>
                <th className="px-3 py-2 text-left font-bold">PUF Panel</th>
                <th className="px-3 py-2 text-left font-bold">PIR Panel</th>
              </tr>
            </thead>
            <tbody>
              {CORE_COMPARISON.map((row, i) => (
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
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {`Simple rule of thumb: if fire safety or acoustics leads your specification, choose rockwool. If thermal insulation leads it, a `}
          <Link href="/product/puf-panel" className="font-semibold text-primary hover:underline">PUF panel</Link>
          {` or `}
          <Link href="/product/pir-panel" className="font-semibold text-primary hover:underline">PIR panel</Link>
          {` is usually the better fit. Our team will confirm the right core for your project at quotation — many projects combine cores, using rockwool for fire-critical walls and foam-core panels elsewhere.`}
        </p>
      </section>

      <section id="why-saman" className="space-y-3">
        <H2 id="why-saman">Why Buy Rockwool Panels from SAMAN Portable?</H2>
        <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          <span className="font-bold text-foreground">Two factories, nationwide dispatch.</span>{` Rockwool panels are manufactured at both Gopasandra, Bangalore and Greater Noida. South and West India orders dispatch from Bangalore; North and East India orders dispatch from Greater Noida — shorter transit, lower freight, faster delivery. Dispatch typically begins within 3–5 business days as per our `}
          <Link href="/delivery-policy" className="font-semibold text-primary hover:underline">published delivery policy</Link>
          {`, with transport confirmed at quotation.`}
        </p>
        <Lead label="Verified manufacturer, not a trader.">{`You buy directly from the production line, with factory visits welcome at either location. Our panels are supplied to leading developers and EPC contractors across India.`}</Lead>
        <Lead label="Documentation with every sale.">{`Quotation, datasheet or test certificate confirming density, k-value, service temperature and fire rating as applicable — plus third-party/government-authorized inspection certificate at time of sale, invoice with HSN 940690, and warranty terms in writing.`}</Lead>
        <Lead label="Straight answers.">{`Where a value depends on your exact panel build, we say "confirmed at quotation" — and then we confirm it, in writing, before you pay.`}</Lead>
        <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
          <p className="mb-2 text-sm font-bold text-foreground">Get Rockwool Panel Quotation</p>
          <ProductZoneCtas variant="strip" />
        </div>
      </section>
    </div>
  );
}

function SpecificationsContent() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <H2 id="spec-table">Rockwool Panel Specifications</H2>
        <SpecTable title="SAMAN Rockwool Panel" subtitle="Owner-verified" rows={SPEC_ROWS} />
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
          <p className="text-[15px] leading-relaxed text-foreground sm:text-base">
            {`Rockwool panels are supplied as per approved project requirement and applicable standards such as IS 12436, IS 16203, EN 14509, EN 13165, ASTM C591/C1289 where required; density, k-value, service temperature and fire rating are confirmed through quotation, datasheet or test certificate; third-party/government-authorized inspection certificate is provided at time of sale.`}
          </p>
        </div>
        <LongImage
          src="/images/rockwool-panel/diagrams/rockwool-panel-fire-behaviour-concept.webp"
          alt="Rockwool panel fire behaviour diagram — non-combustible stone wool core, system rating by test certificate"
          title="Rockwool panel fire behaviour diagram"
        />
        <LongImage
          src="/images/rockwool-panel/diagrams/rockwool-panel-thickness-range-lineup.webp"
          alt="Rockwool panel thickness range diagram 30mm to 150mm standard and made-to-order sizes"
          title="Rockwool panel thickness range diagram"
        />
        <LongImage
          src="/images/rockwool-panel/diagrams/rockwool-panel-joint-systems.webp"
          alt="Rockwool panel tongue-and-groove and cam-lock joint systems diagram"
          title="Rockwool panel joint systems diagram"
        />
      </div>

      <section className="space-y-3">
        <H2 id="price">Rockwool Panel Thickness and Price</H2>
        <P>{`Indicative supply-only prices, ex-GST. Transport, installation, accessories and unloading are quoted separately.`}</P>
        <div className="mb-1.5 flex items-center justify-end gap-1 text-xs text-muted-foreground sm:hidden">
          <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          Scroll for more
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-3 py-2 text-left font-bold">Thickness</th>
                <th className="px-3 py-2 text-left font-bold">Indicative Price (per sq. mt, ex-GST)</th>
                <th className="px-3 py-2 text-left font-bold">Typical Use</th>
              </tr>
            </thead>
            <tbody>
              {PRICE_ROWS.map((row, i) => (
                <tr key={row[0]} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/40'}>
                  <td className="px-3 py-2 font-semibold text-foreground">{row[0]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row[1]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
          <p className="text-[15px] leading-relaxed text-foreground sm:text-base">
            <span className="font-bold">Price disclaimer:</span>{` Prices shown are indicative Indian market supply-only rates for base specification. Final price depends on core density, facing sheet gauge, coating, profile, order quantity, project location and drawings. GST, transport, installation, flashings, fasteners and accessories are additional and confirmed at quotation.`}
          </p>
        </div>
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
      <H2 id="systems">Wall and Roof Systems</H2>
      <P>{`Rockwool wall panels are installed vertically or horizontally on steel girts with tongue-and-groove or hidden-fix joints, sealed with fire-safe sealants and finished with matching trims and flashings. Rockwool roof panels use overlap joints with weather-side fasteners, EPDM washers and butyl sealing. Because rockwool panels are heavier than foam-core panels, SAMAN confirms purlin/girt spacing and lifting methodology as part of every quotation — this is checked for you, not left to site improvisation.`}</P>
      <P>{`Cut edges and penetrations (doors, ducts, cable trays) are protected and sealed during installation to keep moisture out of the fibre core, and all openings are trimmed with matching accessories supplied against the project BOQ.`}</P>
    </div>
  );
}

export default function RockwoolPanelHub() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="Rockwool Panels Manufacturer in India | SAMAN"
        fallbackDescription="Rockwool sandwich panels from SAMAN's Bangalore & Greater Noida factories. Non-combustible stone wool core, 30–150mm, wall & roof systems. Get a quote."
        fallbackCanonical="https://www.samanportable.com/product/rockwool-panel"
        keywords="rockwool panel, rockwool panels, rock wool panel, rockwool sandwich panel, rockwool manufacturers in india"
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
            <span className="font-semibold text-foreground">Rockwool Panel</span>
          </nav>

          {/* Commerce top section — 1:1 gallery + above-fold dual-zone CTA (left),
              H1 + short description info box (right, sticky). Mirrors the pir-panel
              C16 layout (two columns; no sibling sub-pages to fill a third rail). */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[C16_PANELS.puf, C16_PANELS.sandwich, C16_PANELS.pir, C16_PANELS.eps, C16_PANELS.glassWool]}
              />
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <ProductCarousel images={GALLERY_IMAGES} />
              <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
                <p className="mb-2 text-sm font-bold text-foreground">Get Rockwool Panel Quotation</p>
                <ProductZoneCtas variant="strip" />
              </div>
            </div>

            <div className="order-2 lg:order-3 lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RockwoolInfoBox
                h1="Rockwool Panel — Non-Combustible Stone Wool Sandwich Panels"
                priceMain="From ₹1,290 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                shortDescription={SHORT_DESCRIPTION}
                hsn="940690"
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="Rockwool Panel"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={990017}
              reviewProductId={272766}
              productName="Rockwool Panel"
            />
          </div>

          {/* FAQ renders below the tabs (drives FAQPage schema) */}
          <section id="faq" className="mt-10 space-y-4">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Frequently Asked Questions</h2>
            <FaqAccordion items={FAQS} />
          </section>

          {/* Closing CTA — dual zone */}
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-foreground">Get Rockwool Panel Quotation</h2>
            <ProductZoneCtas />
          </div>

          <div className="mt-8 space-y-8">
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
