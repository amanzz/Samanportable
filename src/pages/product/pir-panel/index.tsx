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
import PirInfoBox from '@/components/product-pir/PirInfoBox';

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

// ── Short description (top, above tabs) — verbatim from C16_1_PIR_pir-panel_FINAL.md
const SHORT_DESCRIPTION =
  'A PIR panel is an insulated sandwich panel with a rigid polyisocyanurate foam core bonded between two steel facing sheets — the panel projects specify when fire behaviour or a higher service temperature matters more than the lowest price. SAMAN manufactures PIR panels to order in 30–150 mm standard thicknesses, with made-to-order options to 200 mm, on our own lines in Bangalore and Greater Noida, supplied factory-direct across India with the certificate to prove what is in the core.';

// ── Commerce gallery — 5 real PIR photos, 1:1 (subjects/alt/title per FINAL G1–G5)
const GALLERY_IMAGES = [
  { src: '/images/pir-panel/pir-cross-section-800x800.webp', alt: 'PIR panel showing the rigid polyisocyanurate core between two steel facing sheets', title: 'PIR insulated panel' },
  { src: '/images/pir-panel/pir-ppgi-face-800x800.webp', alt: 'Colour-coated PPGI facing of a SAMAN PIR sandwich panel', title: 'PIR panel PPGI facing' },
  { src: '/images/pir-panel/pir-tongue-groove-800x800.webp', alt: 'Tongue-and-groove edge profile of a PIR panel ready for on-site closure', title: 'PIR panel tongue-and-groove edge' },
  { src: '/images/pir-panel/pir-stainless-faced-800x800.webp', alt: 'Stainless steel faced insulated panel sample for hygienic partitions', title: 'Stainless steel faced PIR panel' },
  { src: '/images/pir-panel/pir-dispatch-bundle-800x800.webp', alt: 'Bundled PIR panel stack edge-protected for road dispatch', title: 'PIR panel dispatch bundle' },
];

const JUMP_ITEMS = [
  { id: 'why-buyers', label: 'Why buyers ask for a PIR panel' },
  { id: 'factory-made', label: 'Factory-made PIR sandwich panels' },
  { id: 'where-used', label: 'Where PIR panels are used' },
  { id: 'facing', label: 'Choosing the facing sheet' },
  { id: 'price-factors', label: 'What decides your PIR panel price' },
  { id: 'why-manufacturer', label: 'Why a manufacturer beats a trader' },
];

const SPEC_ROWS = [
  { label: 'Core', value: 'Rigid PIR (polyisocyanurate) foam' },
  { label: 'Standard thickness', value: '30 / 40 / 50 / 60 / 70 / 80 / 90 / 100 / 150 mm' },
  { label: 'Made-to-order thickness', value: '110 / 120 / 130 / 140 / 200 mm — made to order, advance payment; price and lead time confirmed at quotation' },
  { label: 'Facing sheets', value: 'PPGI · PPGL · Stainless Steel · Aluminium' },
  { label: 'Facing gauge', value: '0.35–0.80 mm' },
  { label: 'Panel use', value: 'Wall, roof and ceiling applications' },
  { label: 'Joints', value: 'Tongue & groove; cam-lock for cold-room orders' },
  { label: 'HSN code', value: '940690' },
];

// Fully qualitative core comparison — no printed performance numbers (vocabulary wall)
const CORE_COMPARISON = [
  ['Cost position', 'Lowest', 'Baseline', 'Premium over PUF'],
  ['Weight', 'Lightest', 'Standard', 'Standard'],
  ['Insulation per mm', 'Good', 'Better', 'Best of the three'],
  ['Fire behaviour', 'Basic', 'Standard foam core', 'Improved over standard foam'],
  ['Typical duty', 'Budget enclosures, partitions', 'General walls, roofs, cold rooms', 'Specified industrial, food, pharma, audited buildings'],
];

const FAQS = [
  { question: 'What is a PIR panel?', answer: 'A PIR panel is an insulated sandwich panel with a rigid polyisocyanurate (PIR) foam core bonded between two metal facing sheets. It is used for walls, roofs, cold rooms and partitions where the specification calls for improved fire behaviour or a wider service-temperature range than standard foam-core panels.' },
  { question: 'What is the PIR panel full form?', answer: 'PIR stands for polyisocyanurate. It is a thermoset rigid foam chemistry related to polyurethane but formulated with a higher isocyanurate content, which improves the core\'s fire behaviour and temperature tolerance. The panel is named after this core material.' },
  { question: 'What is the difference between a PIR panel and a PU panel?', answer: 'The facings and construction are the same; the difference is core chemistry. A PU (polyurethane/PUF) core is the standard insulated-panel core. A PIR core is a modified formulation with improved fire behaviour and higher service temperature, at a higher raw-material cost. Projects choose PIR when the specification demands it.' },
  { question: 'What is the difference between PIR and PUR?', answer: 'PUR is polyurethane and PIR is polyisocyanurate — related chemistries with different reaction ratios. PIR chars rather than melting as readily under heat, which is why fire-conscious specifications prefer it. PUR remains the cost-effective default where the fire specification does not demand PIR.' },
  { question: 'What is the difference between PIR and EPS panels?', answer: 'EPS panels use an expanded polystyrene bead core — the lightest and lowest-cost option. PIR uses a rigid thermoset foam core with better insulation per millimetre and improved fire behaviour. EPS suits budget-driven enclosures; PIR suits specified industrial, food and pharma projects.' },
  { question: 'What thicknesses do you manufacture PIR panels in?', answer: 'Nine standard thicknesses: 30, 40, 50, 60, 70, 80, 90, 100 and 150 mm. Thicknesses of 110, 120, 130, 140 and 200 mm are made to order against advance payment, with price and lead time confirmed at quotation.' },
  { question: 'Can PIR panels be used for cold storage?', answer: 'Yes. PIR panels serve cold rooms and freezer rooms with cam-lock joints for airtight closure, with thickness selected against the temperature gap being held. Higher standard thicknesses (100–150 mm) serve deep-freeze duty, and insurers of large cold stores increasingly prefer PIR\'s improved fire behaviour over standard foam cores.' },
  { question: 'Is a PIR panel fireproof?', answer: 'No panel should be sold to you as "fireproof," and we will not describe ours that way. PIR foam is formulated for improved fire behaviour compared with standard polyurethane foam. Where fire performance is a compliance requirement, the fire rating is confirmed through the applicable standard and test certificate, and a third-party or government-authorised inspection certificate is provided at sale for your consultant to verify.' },
  { question: 'How do I verify I received genuine PIR and not ordinary foam?', answer: 'Demand the paper trail: the written quotation naming PIR (polyisocyanurate), the datasheet or test certificate for the order, and the inspection certificate at sale. A manufacturer produces all three without hesitation. A quote priced at ordinary-foam level, or a supplier who cannot produce the certificate, are the two warning signs.' },
  { question: 'What is the HSN code for PIR panels?', answer: 'PIR sandwich panels are supplied under HSN code 940690, the same classification applied across our insulated panel range. GST is charged as applicable on the quoted supply value.' },
];

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/pir-panel#product',
  name: 'PIR Panel',
  description: SHORT_DESCRIPTION,
  category: 'Insulated Sandwich Panel',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Rigid polyisocyanurate (PIR) foam core with steel facing sheets',
  image: GALLERY_IMAGES.map((g) => `https://www.samanportable.com${g.src}`),
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Standard thickness', value: '30–150 mm' },
    { '@type': 'PropertyValue', name: 'Made-to-order thickness', value: 'to 200 mm' },
    { '@type': 'PropertyValue', name: 'Facings', value: 'PPGI / PPGL / Stainless Steel / Aluminium' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: 1410,
    highPrice: 1980,
    priceCurrency: 'INR',
    offerCount: 5,
    availability: 'https://schema.org/InStock',
    url: 'https://www.samanportable.com/product/pir-panel',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      priceCurrency: 'INR',
      unitCode: 'MTK',
      unitText: 'm²',
    },
  },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'PIR Panel', item: 'https://www.samanportable.com/product/pir-panel' },
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

function DescriptionContent() {
  return (
    <div className="space-y-10">
      <JumpNav items={JUMP_ITEMS} />

      <section id="why-buyers" className="space-y-3">
        <H2 id="why-buyers">Why buyers ask for a PIR panel instead of standard foam cores</H2>
        <P>{`Buyers move to PIR for one main reason: the project specification demands better fire behaviour or a higher working temperature than a standard polyurethane core offers. Food processing units, pharma buildings, insurer-audited warehouses and consultant-driven industrial projects increasingly write PIR into the panel schedule — sometimes by name, sometimes through a fire-performance clause that standard foam cannot satisfy.`}</P>
        <P>{`The sourcing problem is the one every panel buyer faces, made sharper by PIR's smaller market. Most search results for a PIR panel in India are marketplace listings that show a photo and a price but not the core specification. And because PIR looks identical to an ordinary foam-core panel from the outside — same steel facings, same profile, same colour — a reseller can quote "PIR" with no way for you to verify what actually arrives on the truck. The premium you pay for PIR is wasted the moment the core is not what was quoted, and you will typically discover that only when an auditor or insurer asks for documentation you cannot produce.`}</P>
        <P>
          {`The protection is straightforward: buy from the manufacturer, confirm the specification in writing at quotation, and receive the supporting datasheet or test certificate with your order. That is how we supply every PIR order. If your project does not actually need PIR's fire and temperature advantages, our `}
          <Link href="/product/puf-panel" className="font-semibold text-primary hover:underline">standard PUF panel</Link>
          {` covers the cost-driven alternative — and we will tell you honestly which core your job needs when you share the service conditions.`}
        </P>
      </section>

      <section id="factory-made" className="space-y-3">
        <H2 id="factory-made">Factory-made PIR sandwich panels from SAMAN</H2>
        <P>{`SAMAN is a manufacturer, not a trading yard. We produce insulated sandwich panels on our own lines in Bangalore and Greater Noida, so a PIR order is specified, produced and dispatched under one roof — thickness, facing, colour, profile and length are all set from your project requirement rather than pulled from stock. Running two factories also means shorter road distance to most Indian project sites, which matters more than buyers expect: long insulated panels are transport-sensitive, and every extra hundred kilometres adds handling risk and freight cost to a product that cannot be folded, cut down or repaired at site.`}</P>
        <P>{`Because the panel is made to your order, we hold the two disciplines a PIR buyer actually needs. First, the core material you specified is the core material foamed into your panels — the foam system on the line is not interchangeable with a cheaper chemistry without us knowing it. Second, every specification we commit to is either published on this page or confirmed in writing at quotation. We do not print marketing numbers we cannot certify at delivery, and we do not quote values we cannot stand behind when your consultant asks for the test basis.`}</P>
        <LongImage
          src="/images/pir-panel/pir-factory-stack-1200x675.webp"
          alt="PIR panels stacked and edge-protected on the SAMAN factory floor before dispatch"
          title="SAMAN PIR panel stock, factory floor"
        />
      </section>

      <section id="where-used" className="space-y-4">
        <H2 id="where-used">Where PIR panels are used</H2>
        <P>{`PIR earns its premium in buildings where fire behaviour, temperature range or an auditor's specification rules the panel choice. Four demand areas cover most of the PIR orders we quote.`}</P>

        <div className="space-y-2">
          <H3>Food processing, pharma and audited facilities</H3>
          <P>{`Processing halls, packing areas and pharma envelopes are the most common PIR-specified projects. Consultants and insurers who write panel schedules for these buildings increasingly name a PIR core for its improved fire behaviour over standard foam, and audit trails in these industries demand exactly the certificate-backed supply chain a manufacturer provides. Hygiene-critical zones in the same facilities often pair the PIR core with a stainless steel facing, which cleans and sanitises the way a food or pharma auditor expects. For fire-critical walls where a mineral core is preferred instead, we also make a `}<Link href="/product/rockwool-panel" className="font-semibold text-primary hover:underline">rockwool panel</Link>{` option for fire-focused walls.`}</P>
        </div>
        <LongImage
          src="/images/pir-panel/pir-hygienic-partition-1200x675.webp"
          alt="Insulated panel partition with hygienic facing inside a processing facility"
          title="Hygienic PIR panel partition"
        />

        <div className="space-y-2">
          <H3>Cold rooms, freezers and temperature-controlled storage</H3>
          <P>{`A PIR cold room panel works exactly like a standard foam-core cold room panel on site — cam-lock joints for an airtight closure, thickness set by the temperature gap being held — while adding the fire-performance margin that insurers of large cold stores increasingly ask for. Higher thicknesses (100 mm and 150 mm standard, with made-to-order options above) serve deep-freeze and low-temperature duty. The correct thickness and the tested thermal values for your duty are confirmed at quotation against your actual design temperatures, not read off a generic chart.`}</P>
        </div>
        <LongImage
          src="/images/pir-panel/pir-cold-room-interior-1200x675.webp"
          alt="High-thickness insulated panels forming a cold room interior with cam-lock joints"
          title="Cold room insulated panel interior"
        />

        <div className="space-y-2">
          <H3>Hot process areas and rooftop exposure</H3>
          <P>{`PIR's higher service-temperature tolerance is the other half of its case. Panels near ovens, boilers, hot process equipment, or on roofs that bake under direct Indian summer sun, work closer to the ceiling of what a standard foam core is comfortable with. Where the working temperature genuinely approaches that ceiling, PIR is the responsible specification rather than the premium one.`}</P>
        </div>

        <div className="space-y-2">
          <H3>PIR wall panels, roof panels and partitions</H3>
          <P>{`For factory roofs and walls, a PIR sandwich panel installs the same way as any insulated panel — over a steel frame, closing tongue-and-groove on site — so upgrading to PIR changes the core specification, not the construction method or the installer's toolkit. Buyers usually pair a thickness with a facing for the duty: a 30 mm PIR roof panel or a 50 mm PIR wall panel in PPGI or PPGL is a common pairing for sheds and factory offices, while stainless-steel-faced panels suit hygienic partitions. Partitions inside audited facilities are the other steady PIR demand: same panel logic, chosen for the core rather than the span.`}</P>
        </div>
        <LongImage
          src="/images/pir-panel/pir-wall-roof-install-1200x675.webp"
          alt="Insulated sandwich panels installed as wall and roof cladding over a steel frame"
          title="PIR panel wall and roof installation"
        />
      </section>

      <section id="facing" className="space-y-3">
        <H2 id="facing">Choosing the facing sheet for your PIR panel</H2>
        <P>{`The core decides the panel's thermal and fire character; the facing decides how it survives its environment. We face PIR panels in four materials, and the right choice is usually obvious once the duty is named:`}</P>
        <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          <li><span className="font-semibold text-foreground">PPGI (pre-painted galvanised iron)</span> — the standard choice for most walls and roofs: colour-coated, economical, and proven across Indian industrial buildings.</li>
          <li><span className="font-semibold text-foreground">PPGL (pre-painted galvalume)</span> — chosen where the environment is harsher on steel: coastal air, chemical exposure nearby, or roofs where long-term corrosion resistance justifies the step up from PPGI.</li>
          <li><span className="font-semibold text-foreground">Stainless steel</span> — the hygiene facing: food processing, pharma, and any wall an auditor will inspect with a swab. It costs more and earns it in exactly those rooms.</li>
          <li><span className="font-semibold text-foreground">Aluminium</span> — selected for specific corrosion or weight requirements, typically at consultant instruction.</li>
        </ul>
        <P>{`All facings run in 0.35–0.80 mm gauge. Tell us the environment — coastal, chemical, hygienic, or standard industrial — and we will recommend the facing honestly rather than defaulting to the costliest option.`}</P>
        <LongImage
          src="/images/pir-panel/pir-facing-options-1200x675.webp"
          alt="Colour-coated and metal facing sheet options for insulated sandwich panels"
          title="PIR panel facing sheet options"
        />
      </section>

      <section id="price-factors" className="space-y-3">
        <H2 id="price-factors">What decides your PIR panel price</H2>
        <P>{`Full price tables sit on their own dedicated guide, not here — but the levers are worth knowing before you request a quotation. Thickness is the biggest driver: each step up in millimetres adds core material and cost. The PIR core itself carries a real raw-material premium over standard foam, which is the honest reason a PIR quote is never the cheapest quote on your table — and why a suspiciously cheap "PIR" quote deserves suspicion, not celebration. Facing choice moves the price next: stainless steel costs meaningfully more than PPGI. Panel length, total order quantity and delivery distance set the remainder, and made-to-order thicknesses are always priced individually at quotation.`}</P>
        <P>{`Indicative range: ₹1,410–₹1,980 per m² for 30–80 mm at base specification — supply-only, ex-GST, excluding transport, installation and accessories; 90 mm and above, plus made-to-order thicknesses, are confirmed at quotation.`}</P>
        <P>{`If the lowest possible panel cost is the priority and fire specification is not driving your project, PIR may genuinely be the wrong choice — a standard foam-core or EPS panel will do the thermal job for less. We would rather tell you that at enquiry than after supply.`}</P>
      </section>

      <section id="why-manufacturer" className="space-y-3">
        <H2 id="why-manufacturer">Why a manufacturer beats a trader for PIR supply</H2>
        <P>{`For an ordinary panel, buying through a trader costs you margin. For a PIR panel it costs you certainty — the entire point of specifying PIR is the core, and the core is the one thing a trader cannot verify, control or document. A manufacturer controls the foam system going into the line, holds the batch record, and provides the inspection certificate at sale. That chain of custody is exactly what your consultant, insurer or auditor is asking for when the schedule says PIR. We have supplied insulated panels for leading developers and EPC contractors across India, and in every case the specification quoted is the panel produced — because the same factory answers for both.`}</P>
      </section>
    </div>
  );
}

function SpecificationsContent() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <H2 id="spec-table">PIR panel specification table</H2>
        <P>{`The table below is our owner-verified specification. Performance values are confirmed against your project through datasheet or test certificate rather than printed as fixed marketing numbers — that discipline protects you as much as it protects us, because a number on a webpage certifies nothing, while a test certificate in your project file certifies everything.`}</P>
        <SpecTable title="PIR Panel Specifications" subtitle="Owner-verified" rows={SPEC_ROWS} />
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
          <p className="text-[15px] leading-relaxed text-foreground sm:text-base">
            <span className="font-bold">Standards and performance basis.</span>{` PIR panel specifications are supplied as per approved project requirement and applicable standards such as IS 12436, IS 16203, EN 14509, EN 13165, or ASTM C591/C1289, where required. Density, k-value, service temperature, and fire rating are confirmed through quotation, datasheet, or test certificate. A third-party or government-authorised inspection certificate is provided at the time of sale.`}
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <H2 id="choosing-core">Choosing the core — PIR against the alternatives</H2>
        <P>{`Every insulated panel is the same construction with a different heart. The honest, qualitative comparison — with the actual tested values for your project confirmed by datasheet or certificate at quotation:`}</P>
        <div className="mb-1.5 flex items-center justify-end gap-1 text-xs text-muted-foreground sm:hidden">
          <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          Scroll for more
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-3 py-2 text-left font-bold">Consideration</th>
                <th className="px-3 py-2 text-left font-bold">EPS core</th>
                <th className="px-3 py-2 text-left font-bold">PUF core (standard)</th>
                <th className="px-3 py-2 text-left font-bold">PIR core</th>
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
        <LongImage
          src="/images/pir-panel/diagrams/pir-vs-puf-vs-eps-panel-core-comparison-diagram.webp"
          alt="Diagram comparing EPS, PUF and PIR insulated panel cores by cost, weight and fire behaviour"
          title="PIR vs PUF vs EPS panel core comparison diagram"
        />
        <P>{`The selection rule we give buyers: let the specification choose the core. If your project document, insurer or consultant names fire performance or elevated service temperature, PIR is the answer. If it names only a temperature to hold and a budget to meet, standard PUF is usually the honest recommendation — and if it names only "insulated enclosure, lowest cost," EPS may be. Paying the PIR premium without a specification that uses it buys margin you will never draw on.`}</P>
      </section>

      <section className="space-y-3">
        <H2 id="standard-vs-mto">Standard vs made-to-order thickness</H2>
        <P>{`Nine standard thicknesses (30–150 mm) cover the overwhelming majority of PIR projects and carry normal production lead times. The five made-to-order thicknesses — 110, 120, 130, 140 and 200 mm — are manufactured only against a confirmed order with advance payment, and their price and lead time are set at quotation. We publish that distinction because no ranking supplier does, and it changes your project planning: a standard thickness schedules tight; an MTO thickness cannot, and a contractor who discovers that after the civil work is programmed has a problem no discount fixes.`}</P>
        <LongImage
          src="/images/pir-panel/diagrams/pir-panel-thickness-chart-standard-made-to-order.webp"
          alt="PIR panel thickness chart showing 30–150 mm standard and 110–200 mm made-to-order options"
          title="PIR panel thickness chart"
        />
        <P>{`As working guidance: walls and partitions in ordinary industrial buildings sit at the lower end of the range; roofs move up a step for solar load; cold rooms are sized by the temperature gap being held, with deep-freeze duty using the top of the standard range and above. The exact thickness for your duty is an engineering answer we confirm at quotation, not a guess we print.`}</P>
      </section>

      <section className="space-y-3">
        <H2 id="manufacturing">How we manufacture and check every PIR panel</H2>
        <P>{`A PIR panel is formed as one continuous process, not assembled from parts:`}</P>
        <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          <li><span className="font-semibold text-foreground">Coil feed</span> — two facing coils (PPGI, PPGL, stainless steel or aluminium, per your spec) are uncoiled and fed into the line simultaneously, one for each face.</li>
          <li><span className="font-semibold text-foreground">Forming</span> — roll-forming stations set the wall or roof profile before the core is introduced.</li>
          <li><span className="font-semibold text-foreground">Foaming</span> — the liquid PIR system is injected continuously between the two formed facings. PIR chemistry runs at different reaction parameters from standard polyurethane, which is one reason a genuine manufacturer can tell you exactly what is in the core and a reseller cannot.</li>
          <li><span className="font-semibold text-foreground">Curing</span> — the foam expands and cures under a heated press, bonding to both facings so the panel behaves as one rigid board rather than a sheet with foam glued behind it.</li>
          <li><span className="font-semibold text-foreground">Edge profiling</span> — panel edges are cut and profiled for tongue-and-groove closure, or cam-lock on cold-room orders, so panels close tight on site.</li>
          <li><span className="font-semibold text-foreground">Batch checks</span> — each batch is checked for panel thickness, foam rise and facing-to-core adhesion before approval for dispatch.</li>
        </ol>
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
          <p className="text-[15px] leading-relaxed text-foreground sm:text-base">
            <span className="font-bold">A common buyer mistake:</span>{` accepting a "PIR" quotation priced suspiciously close to a standard foam-core panel. PIR raw material carries a genuine cost premium; a PIR quote at ordinary-foam price is the strongest single signal that the core is not what the invoice says. Ask for the core specification in the written quotation and the certificate at sale — a manufacturer provides both without hesitation, and a reseller usually goes quiet.`}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <H2 id="quotation-checklist">{`What to confirm at quotation — the PIR buyer's checklist`}</H2>
        <P>{`Bring these five points to any PIR supplier, including us. The answers separate a manufacturer from a middleman in one phone call:`}</P>
        <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          <li><span className="font-semibold text-foreground">Core confirmation in writing</span>{` — the quotation must say PIR (polyisocyanurate), not "insulated foam" or another vague phrase.`}</li>
          <li><span className="font-semibold text-foreground">Density, k-value and fire rating basis</span> — by datasheet or test certificate for your order, not a brochure average.</li>
          <li><span className="font-semibold text-foreground">Thickness class</span> — standard (30–150 mm) or made-to-order (110–140, 200 mm), because it decides your lead time and payment terms.</li>
          <li><span className="font-semibold text-foreground">Facing and gauge</span> — named material (PPGI / PPGL / SS / aluminium) and gauge within 0.35–0.80 mm.</li>
          <li><span className="font-semibold text-foreground">Inspection certificate</span> — third-party or government-authorised, provided at time of sale.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <H2 id="sizes">Sizes and customisation — with the real constraints</H2>
        <P>{`Panel length, facing colour and profile are set per order. Long panels are transport-sensitive — the practical length limit for your site is a road and unloading question as much as a production one, so we confirm feasible lengths at quotation against your delivery location and dispatch factory rather than promising a number your access road cannot receive.`}</P>
      </section>
    </div>
  );
}

function ShippingContent() {
  return (
    <div className="space-y-4">
      <P>{`We supply PIR panels pan-India, dispatched from the nearer of our Bangalore and Greater Noida lines — which keeps road distance, freight cost and handling risk lower for most project sites in both South and North India.`}</P>
      <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        <span className="font-bold text-foreground">Dispatch.</span>{` 3–5 business day default dispatch estimate for standard thicknesses. Made-to-order thicknesses carry the lead time confirmed at quotation. Panels dispatch stacked, edge-protected and bundled to survive Indian road transport.`}
      </p>
      <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        <span className="font-bold text-foreground">Transport.</span>{` Transport cost is confirmed at quotation against your delivery location, panel lengths and order size — see our `}
        <Link href="/delivery-policy" className="font-semibold text-primary hover:underline">Delivery Policy</Link>
        {` for the governing terms. Long panels may need site-access confirmation before dispatch; we ask about your unloading arrangement at quotation, not at the gate.`}
      </p>
      <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        <span className="font-bold text-foreground">Returns.</span>{` Returns follow our live `}
        <Link href="/refund-and-return-policy" className="font-semibold text-primary hover:underline">Refund & Return Policy</Link>
        {` — 7-day window on standard products (3-day on custom); customer pays return transport outside Bangalore and Delhi NCR.`}
      </p>
      <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        <span className="font-bold text-foreground">Installation support.</span>{` Site installation follows standard insulated-panel practice — tongue-and-groove closure on walls and roofs, cam-lock on cold rooms — and our team supports installers with panel drawings and fixing guidance at supply stage. An installer who has fixed any insulated sandwich panel can fix a PIR panel; nothing about the core changes the site method.`}
      </p>
    </div>
  );
}

export default function PirPanelHub() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="PIR Panels Manufacturer in India | SAMAN"
        fallbackDescription="SAMAN manufactures PIR sandwich panels in 30–150 mm standard thicknesses (made-to-order to 200 mm), with PPGI/PPGL/SS/aluminium facings from our Bangalore and Greater Noida lines. Factory-direct supply pan-India. Get a quotation."
        fallbackCanonical="https://www.samanportable.com/product/pir-panel"
        keywords="pir panel, pir panels, pir sandwich panel, pir insulated panel, pir panel manufacturer"
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
            <span className="font-semibold text-foreground">PIR Panel</span>
          </nav>

          {/* Commerce top section — 3-column: left sibling-panel sidebar, middle
              1:1 gallery + above-fold dual-zone CTA, right H1 + short description
              info box (sticky). Sidebar = C16 material siblings (Ruling 4). */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[C16_PANELS.puf, C16_PANELS.eps, C16_PANELS.rockwool, C16_PANELS.sandwich]}
              />
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <ProductCarousel images={GALLERY_IMAGES} />
              <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
                <p className="mb-2 text-sm font-bold text-foreground">Get a factory-direct quotation</p>
                <ProductZoneCtas variant="strip" />
              </div>
            </div>

            <div className="order-2 lg:order-3 lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <PirInfoBox
                h1="PIR Panel — Polyisocyanurate Insulated Panels by SAMAN"
                priceMain="From ₹1,410 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                shortDescription={SHORT_DESCRIPTION}
                sku="SP-C16-PIR-2026"
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="PIR Panel"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={990016}
              reviewProductId={272765}
              productName="PIR Panel"
            />
          </div>

          {/* FAQ renders below the tabs (drives FAQPage schema) */}
          <section id="faq" className="mt-10 space-y-4">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Frequently asked questions</h2>
            <FaqAccordion items={FAQS} />
          </section>

          {/* Closing CTA (after content) */}
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
            <h2 className="mb-1 text-xl font-bold text-foreground">Get a PIR panel quotation</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {`Send your thickness, facing, quantity and site location, and we will return a written quotation with the confirmed specification — and the certificate basis behind it.`}
            </p>
            <ProductZoneCtas />
          </div>

          {/* Related products now live in the left sibling sidebar above. */}
          <div className="mt-8 space-y-8">
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
