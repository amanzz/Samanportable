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
import ComparisonBox from '@/components/product-puf/ComparisonBox';
import TrustCard from '@/components/product-puf/TrustCard';
import ProductInfoBox from '@/components/product-puf/ProductInfoBox';
import ProductDetailTabs from '@/components/product-puf/ProductDetailTabs';
import RelatedProductsRail, { PUF_CATALOG } from '@/components/product-puf/RelatedProductsRail';
import ProductCarousel from '@/components/product-puf/ProductCarousel';
import { LongImage } from '@/components/product-puf/Gallery';
import { panelAggregateOffer } from '@/lib/panelSchemaOffers';

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

const JUMP_ITEMS = [
  { id: 'why-buyers-struggle', label: 'Why buyers struggle to source PUF panels' },
  { id: 'factory-made', label: 'Factory-made PUF panels' },
  { id: 'manufacturing', label: 'How we manufacture & check' },
  { id: 'where-used', label: 'Where PUF panels are used' },
  { id: 'puf-vs-pir', label: 'PUF vs PIR' },
  { id: 'sizes-colours', label: 'Sizes, colours & customization' },
  { id: 'price-factors', label: 'What decides your quotation' },
  { id: 'why-manufacturer', label: 'Why a manufacturer beats a trader' },
  { id: 'faq', label: 'Frequently asked questions' },
];

const SPEC_ROWS = [
  { label: 'Thickness', value: '30 / 40 / 50 / 60 / 80 / 100 / 120 / 150 / 200 mm (roof and wall); freezer-grade to 150 mm' },
  { label: 'Facing sheets', value: 'PPGI · PPGL · BGL · Stainless Steel · Aluminium · Craft Paper' },
  { label: 'Facing gauge', value: '0.35–0.80 mm' },
  { label: 'Core', value: 'PUF (PUR), 40 ± 2 kg/m³ density' },
  { label: 'Thermal conductivity', value: '0.022–0.024 W/m·K' },
  { label: 'Service temperature', value: '−40°C to +80°C' },
  { label: 'Panel weight', value: '≈ 10–12 kg/m² at 50 mm' },
  { label: 'Effective width', value: 'Roof 1000 mm (1070 mm overall) · Wall 1000 mm covered' },
  { label: 'Length', value: '2–15 m standard; custom lengths transport/site dependent' },
  { label: 'Roof profiles', value: 'Trapezoidal · ribbed' },
  { label: 'Wall profiles', value: 'Plain · baby ribs · micro ribs' },
  { label: 'Joints', value: 'Tongue & groove; cold room cam lock or T&G' },
  { label: 'HSN code', value: '940690' },
];

const FAQS = [
  { question: 'What is a PUF panel?', answer: 'A PUF panel is an insulated sandwich panel with a rigid polyurethane foam core bonded between two steel facing sheets. It provides structure, insulation and a finished surface in a single board, which is why it is used for cabins, cold rooms and industrial sheds.' },
  { question: 'What thickness of PUF panel do I need?', answer: 'Thickness follows the job, not the price. Thinner 30–50 mm panels suit site offices and partitions; 60–100 mm suits sheds and better thermal control; cold rooms and freezers run 100–150 mm. Send your use case and we advise the correct thickness before quoting.' },
  { question: 'What is the core density of a SAMAN PUF panel?', answer: 'Our PUF core is 40 ± 2 kg/m³ with a thermal conductivity of 0.022–0.024 W/m·K. Any tested value beyond this range for a specific order is confirmed at quotation rather than stated as a blanket claim.' },
  { question: 'Do you make both roof and wall panels?', answer: 'Yes. We make roof panels in trapezoidal and ribbed profiles and wall panels in plain, baby-rib and micro-rib profiles, both from 30 mm to 200 mm. Roof and wall panels share the same core but differ in profile and effective width.' },
  { question: 'Are you a manufacturer or a reseller?', answer: 'SAMAN is a manufacturer. We produce PUF panels on our own lines in Bangalore and Greater Noida, which is why we can commit to custom thickness, facing, colour and cold-room joints that a reseller cannot.' },
  { question: 'How long can a single PUF panel be?', answer: 'Standard lengths run 2–15 m, and custom lengths are possible. The practical limit is transport and site access — a very long panel needs road clearance and offloading space, so we confirm the workable length against your site before production.' },
  { question: 'What is the difference between PUF and PIR panels?', answer: 'Both are polyurethane-based, but PIR uses a modified core with improved fire behaviour and a higher service temperature, at roughly a third more (about 30–35%) cost. PUF suits most cabins, sheds and cold rooms; PIR is chosen where fire or temperature genuinely drives the spec.' },
  { question: 'Do you supply PUF panels outside Bangalore and Delhi?', answer: 'Yes — we deliver pan-India, dispatching from whichever factory is nearer to your site. Transport is confirmed at quotation, and a 500 m² minimum billing applies to long-distance dispatch.' },
  { question: 'Is a PUF panel waterproof?', answer: 'The steel facing sheets are weatherproof and the closed-cell PUF core does not absorb water in normal use, which is why the panel resists the moisture and condensation problems of a bare metal sheet. Joint sealing and correct slope on roofs still matter — the panel is only as watertight as its detailing.' },
  { question: 'How does a PUF panel behave in a fire?', answer: 'The core is a closed-cell PUF; where a project needs improved fire performance, PIR offers better fire behaviour than standard PUF. We state this qualitatively and do not publish class codes or hour ratings without independent test data for the specific build.' },
];

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/puf-panel#product',
  name: 'PUF Panel',
  description:
    'Factory-made PUF (polyurethane foam) insulated sandwich panels by SAMAN, manufactured in Bangalore and Greater Noida. 30–200 mm thickness, PPGI/PPGL/BGL/stainless/aluminium facings, roof and wall profiles.',
  category: 'Insulated Sandwich Panel',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Polyurethane foam core with steel facing sheets',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Thickness range', value: '30–200 mm' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: panelAggregateOffer(1050, 'https://www.samanportable.com/product/puf-panel'),
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'PUF Panel', item: 'https://www.samanportable.com/product/puf-panel' },
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

const INTRO_TEXT =
  'A PUF panel — often searched as “puff panel” — is an insulated building panel with a rigid polyurethane foam core bonded between two steel facing sheets. SAMAN manufactures each panel on our own lines in Bangalore and Greater Noida, so you buy the finished insulated panel direct from the maker — not through a trader — in the thickness, facing and profile your project drawing calls for.';

const GALLERY_IMAGES = [
  { src: '/images/puf-panel/cross-section-30mm-800x800.webp', alt: 'Cross-section of a 30 mm PUF panel showing the polyurethane foam core between two steel facings', title: '30 mm PUF panel cross-section' },
  { src: '/images/puf-panel/factory-bundle-60mm-800x800.webp', alt: 'Ivory 60 mm PUF panel bundle staged on the factory floor after quality checks', title: '60 mm panel factory bundle, post-QC' },
  { src: '/images/puf-panel/roof-application-80mm-800x800.webp', alt: 'Red 80 mm PUF roof panel applied on a prefab industrial building roof', title: '80 mm PUF roof panel, prefab building application' },
  { src: '/images/puf-panel/tg-joint-40mm-800x800.webp', alt: 'Tongue-and-groove edge joint on a 40 mm PUF wall panel', title: '40 mm PUF panel tongue-and-groove joint' },
  { src: '/images/puf-panel/wall-panel-yard-30mm-800x800.webp', alt: '30 mm PUF wall panel stacked in the yard, showing a standard RAL shade', title: '30 mm PUF wall panel, yard stock' },
];

function DescriptionContent() {
  return (
    <>
      <div className="space-y-10">
        <P>{INTRO_TEXT}</P>

        <JumpNav items={JUMP_ITEMS} />

        <section id="why-buyers-struggle" className="space-y-3">
          <H2 id="why-buyers-struggle">Why buyers struggle to source PUF panels in India</H2>
          <P>
            Most buyers searching for a PUF panel land on marketplace listings, not manufacturers. The listing
            shows one price, one photo and no real specification — so you cannot tell a genuine maker from a
            reseller repackaging someone else&apos;s stock.
          </P>
          <P>
            The result is avoidable risk. You commit to a panel without knowing the actual core density, the
            facing gauge, or whether the panel length can even reach your site by road. Two &ldquo;50 mm
            panels&rdquo; from two sellers can differ in facing thickness, foam density and joint type — and the
            cheaper one often hides a thinner facing sheet.
          </P>
          <P>
            Buying from a manufacturer removes that guesswork. You confirm the exact build before you order, and
            the same factory that quotes you is the one that produces and dispatches your panels.
          </P>
        </section>

        <section id="factory-made" className="space-y-3">
          <H2 id="factory-made">Factory-made PUF panels from our Bangalore and Greater Noida lines</H2>
          <P>
            SAMAN runs two panel factories — one in Bangalore for South India dispatch and one in Greater Noida
            for North India and Delhi NCR. Both are real, owned production lines, not trading yards. Running two
            lines means shorter road distance to most Indian project sites, which matters because long insulated
            panels are transport-sensitive.
          </P>
          <P>
            Every panel we quote is made to your specification: thickness, facing sheet, colour, profile and
            length are all set from your requirement, not pulled from fixed stock. Because we manufacture the
            panel, we can also honour custom lengths and cold-room joint types that a reseller simply cannot
            promise.
          </P>
          <P>
            This is the core difference: a manufacturer controls the foam density, the facing gauge and the
            lamination, so the panel you receive matches the panel you were quoted.
          </P>
        </section>

        <section id="manufacturing" className="space-y-3">
          <H2 id="manufacturing">How we manufacture and check every PUF panel</H2>
          <P>
            A panel is not assembled from pre-made parts — it is formed as one continuous process on our line:
          </P>
          <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <li><span className="font-semibold text-foreground">Coil feed</span> — two facing coils (PPGI, PPGL, BGL, stainless steel or aluminium, per your spec) are uncoiled and fed into the line simultaneously, one for each face.</li>
            <li><span className="font-semibold text-foreground">Forming</span> — each coil passes through roll-forming stations that set the flat, ribbed or trapezoidal profile before the core is added.</li>
            <li><span className="font-semibold text-foreground">Foaming</span> — liquid polyurethane is injected continuously between the two formed facings as they travel down the line.</li>
            <li><span className="font-semibold text-foreground">Curing</span> — the foam expands and cures in a heated press, bonding to both facings as it sets. This is what makes the panel one rigid board rather than a sheet with foam glued behind it.</li>
            <li><span className="font-semibold text-foreground">Tongue-and-groove profiling</span> — the panel edges are cut and profiled for T&amp;G (or cam-lock for cold-room orders) so panels close tight on site.</li>
            <li><span className="font-semibold text-foreground">Quality checks</span> — every batch is checked for facing gauge, panel thickness, foam density and rise, and facing-to-core adhesion, before the panel is approved for stock.</li>
          </ol>
          <P>
            Panels are then stacked, edge-protected and bundled for dispatch from the nearer of our two
            factories.
          </P>
          <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
            <p className="text-[15px] leading-relaxed text-foreground sm:text-base">
              <span className="font-bold">A common buyer mistake:</span> accepting a panel batch without asking
              for the density check result. Two panels can look identical and still differ in core density —
              and a lower-density core insulates worse and is more prone to facing separation over time. Ask
              your supplier for the batch density figure before you accept delivery, not after.
            </p>
          </div>
          <LongImage
            src="/images/puf-panel/hub-factory-stack-50mm-1200x675.webp"
            alt="Off-white 50 mm PUF panel stock stacked on the SAMAN factory floor before dispatch"
            title="SAMAN 50 mm PUF panel stack, factory floor"
          />
        </section>

        <section id="where-used" className="space-y-4">
          <H2 id="where-used">Where PUF panels are used</H2>
          <P>
            These panels suit any building where you need insulation, speed and a clean finish in one board.
            Three demand areas cover most of our orders.
          </P>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground sm:text-xl">Site offices, cabins and prefab rooms</h3>
            <P>
              Contractors use these panels as the walls and roof of porta cabins, site offices and prefab rooms
              because the panel arrives finished on both faces. There is no separate insulation, cladding and
              lining step — one panel does all three, which is why prefab builders standardise on them.
            </P>
            <P>
              For this use, thickness usually stays modest: 30–50 mm covers most cabin walls and partitions,
              since the building is occupied for working hours rather than holding a fixed internal temperature
              against the outside. A 50 mm panel is our most common choice here — it adds meaningfully better
              heat control than 30 mm for a small step up in weight and cost, without over-specifying a
              structure that does not need cold-room-level insulation. Where a cabin sits in direct sun for long
              hours, moving up to 50 mm rather than 30 mm is usually the better trade.
            </P>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground sm:text-xl">Cold rooms and controlled-temperature spaces</h3>
            <P>
              For cold rooms, freezers and any controlled-temperature space, the closed-cell PUF core and the
              −40°C to +80°C service range make it a working envelope, not just a wall. Cold-room orders
              typically use cam-lock joints so panels lock airtight, and we manufacture freezer-grade panels up
              to 150 mm.
            </P>
            <P>
              Here thickness is set by the temperature gap you need to hold, not by budget: 80 mm and above is
              the practical starting point for a genuine cold room, since thinner panels struggle to hold a
              large indoor-outdoor temperature difference without excessive running cost on the refrigeration
              side. Deep-freeze and very low-temperature stores are why we manufacture up to 150 mm
              freezer-grade — going thinner to save on panel cost usually costs more back in compressor load
              over the life of the store.
            </P>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground sm:text-xl">Industrial sheds, offices and partitions</h3>
            <P>
              For factory sheds, industrial offices and internal partitions, they give an insulated roof and
              wall that goes up fast over a steel frame. For roof-specific span, slope and fixing depth, see our{' '}
              <Link href="/product/puf-panel/puf-panel-roofing" className="font-semibold text-primary hover:underline">
                insulated PUF roof panels for factory buildings
              </Link>
              .
            </P>
            <P>
              For sheds and factory offices, 50–80 mm is the typical range: enough core to keep a large-span
              roof from radiating heat into the shop floor, without the added weight and cost of cold-room-grade
              panels the building does not need. Internal partitions that only need to separate space, not hold
              a temperature difference, can drop back to 30–40 mm.
            </P>
          </div>

          <LongImage
            src="/images/puf-panel/roof-warehouse-60mm-1200x675.webp"
            alt="White 60 mm PUF roof panel installed across a large warehouse span"
            title="60 mm PUF roof panel, warehouse installation"
          />
        </section>

        <section id="puf-vs-pir">
          <H2 id="puf-vs-pir">PUF vs PIR — which core do you need?</H2>
          <div className="mt-3">
            <ComparisonBox eyebrow="Information gain" title="The honest PUF vs PIR trade-off">
              <P>
                PUF and PIR panels look identical from outside — the difference is the core chemistry. PIR is a
                modified formulation that improves fire behaviour and raises the service temperature, at a
                higher price.
              </P>
              <div className="mb-1.5 flex items-center justify-end gap-1 text-xs text-muted-foreground sm:hidden">
                <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                Scroll for more
              </div>
              <div className="my-4 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="px-3 py-2 text-left font-bold">Property</th>
                      <th className="px-3 py-2 text-left font-bold">PUF (our standard)</th>
                      <th className="px-3 py-2 text-left font-bold">PIR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Core density', '40 ± 2 kg/m³', 'up to 45 ± 2 kg/m³'],
                      ['Thermal conductivity', '0.022–0.024 W/m·K', '0.018–0.021 W/m·K'],
                      ['Service temperature', '−40°C to +80°C', 'up to +120°C'],
                      ['Fire behaviour', 'closed-cell PUF core', 'improved over standard PUF'],
                      ['Indicative cost', 'baseline', 'roughly a third more (≈ 30–35%) than PUF'],
                    ].map((row, i) => (
                      <tr key={row[0]} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/40'}>
                        <td className="px-3 py-2 font-semibold text-foreground">{row[0]}</td>
                        <td className="px-3 py-2 text-muted-foreground">{row[1]}</td>
                        <td className="px-3 py-2 text-muted-foreground">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <P>
                For most cabins, sheds, offices and standard cold rooms, PUF is the right choice. PIR earns its
                premium only where fire performance or higher service temperature genuinely drives the
                specification. We manufacture both, so we recommend on the drawing — not on the margin.
              </P>
              <P>
                The roughly-a-third premium is worth paying when your service temperature will genuinely approach
                PIR&apos;s higher ceiling — up to +120°C against PUF&apos;s +80°C — such as near hot process
                equipment or in a building code that specifically calls for improved fire performance in the
                core. If your project sits comfortably within PUF&apos;s −40°C to +80°C range and has no
                fire-rating requirement beyond standard practice, the premium buys margin you are unlikely to
                use. When in doubt, share the actual service condition and we will tell you honestly which core
                the job needs.
              </P>
            </ComparisonBox>
          </div>
          <LongImage
            src="/images/puf-panel/product-shot-yellow-80mm-1200x675.webp"
            alt="Yellow 80 mm PUF panel, full product shot showing facing and core edge"
            title="80 mm PUF panel, full product shot"
          />
        </section>

        <section id="sizes-colours" className="space-y-3">
          <H2 id="sizes-colours">Sizes, colours and customization</H2>
          <P>
            Panels are made to 1000 mm covered width, in lengths from 2 m to 15 m. Longer panels are possible,
            but length is transport- and site-dependent: a 15 m panel needs road access and offloading space a
            tight urban site may not have, so we confirm the maximum practical length against your site before
            you order.
          </P>
          <P>
            Standard RAL shades we produce: Off White 9002, Pure White 9010, Wooden Finish, Sky Blue 5012, Royal
            Blue 5002, Graphite Grey 7024, Dark Grey 7015, Brick Red 8004, Mist Green 6021 and Caulfield Green
            6005. Roof panels run trapezoidal or ribbed; wall panels run plain, baby-rib or micro-rib.
          </P>
          <LongImage
            src="/images/puf-panel/roof-site-yellow-50mm-1200x675.webp"
            alt="Yellow 50 mm PUF roof panel applied at a live site installation"
            title="50 mm PUF roof panel, site application"
          />
        </section>

        <section id="price-factors" className="space-y-3">
          <H2 id="price-factors">What decides your PUF panel quotation</H2>
          <P>
            A panel&apos;s price is not one number — it moves with the build you choose. The main factors are
            thickness (30 mm to 200 mm), facing gauge (0.35–0.80 mm), facing material (PPGI costs less than
            stainless steel), core density, colour, profile, panel length and order size. Delivery distance
            from the nearer of our two factories also affects the landed cost.
          </P>
          <P>
            Because these stack differently for every project, we publish the drivers here and the rates on a
            dedicated page. See the{' '}
            <Link href="/product/puf-panel/puf-panel-price" className="font-semibold text-primary hover:underline">
              thickness-wise PUF panel price list
            </Link>{' '}
            for indicative rates by thickness, then send your specification for a firm quotation.
          </P>
        </section>

        <section id="why-manufacturer" className="space-y-3">
          <H2 id="why-manufacturer">Why a manufacturer beats a trader for panel supply</H2>
          <P>
            A trader sells you whatever coil and foam their supplier ran that week. A manufacturer sets the
            facing gauge, foam density and lamination to your drawing and stands behind the result. When a
            panel needs a non-standard length, a specific RAL shade or a cold-room cam lock, only the maker can
            actually produce it.
          </P>
          <P>
            There is also accountability. If a site query comes up, the factory that made the panel is the one
            answering — not a middle layer forwarding your question. We have delivered for leading developers
            and EPC contractors across Bangalore, Delhi, Mumbai, Bhopal, Chennai and Hyderabad, and in every
            case the specification we quoted is the panel we produced.
          </P>
          <LongImage
            src="/images/puf-panel/transport-bundle-40mm-1200x675.webp"
            alt="40 mm PUF panel bundle wrapped and ready for transport from the factory"
            title="40 mm PUF panel, transport-ready bundle"
          />
          <P>
            Beyond the roofing and sandwich ranges above, we also supply{' '}
            <Link href="/product/puf-panel/puf-panel-house" className="font-semibold text-primary hover:underline">
              PUF panel houses and residential units
            </Link>
            , <Link href="/product/puf-panel/puf-wall-panel" className="font-semibold text-primary hover:underline">
              wall and partition PUF panels
            </Link>
            , the full{' '}
            <Link href="/product/puf-panel/puf-panel-specification" className="font-semibold text-primary hover:underline">
              technical specification of our PUF panels
            </Link>
            , and{' '}
            <Link href="/product/puf-panel/cold-storage-puf-panel" className="font-semibold text-primary hover:underline">
              PUF panels for cold rooms and freezer rooms
            </Link>
            .
          </P>
        </section>

        <section id="faq" className="space-y-4">
          <H2 id="faq">Frequently asked questions</H2>
          <FaqAccordion items={FAQS} />
        </section>

        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
          <h3 className="mb-1 text-xl font-bold text-foreground">Get a factory-direct PUF panel quotation</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Send your thickness, facing, area and site city for a firm quote.
          </p>
          <ProductZoneCtas />
        </div>
      </div>
    </>
  );
}

function SpecificationsContent() {
  return (
    <div className="space-y-6">
      <P>
        The table below is our owner-verified panel specification. Values not listed here are confirmed at
        quotation rather than guessed.
      </P>
      <SpecTable title="PUF Panel Specifications" subtitle="Owner-verified" rows={SPEC_ROWS} />
      <P>
        The full facing, colour and cold-room joint range sits in{' '}
        <Link href="/product/puf-panel/puf-sandwich-panel" className="font-semibold text-primary hover:underline">
          our PUF sandwich panel and sheet range
        </Link>
        , where we map every panel name and sheet variant we make.
      </P>
      <p className="text-[15px] leading-relaxed text-foreground sm:text-base">
        <span className="font-bold">Warranty:</span> PUF panel warranty 5–10 years, confirmed at quotation.
      </p>
      <LongImage
        priority
        src="/images/puf-panel/diagrams/puf-panel-cross-section-diagram.webp"
        alt="Technical diagram of a PUF panel cross-section showing PPGI facings and the PUF core"
        title="PUF panel cross-section diagram"
      />
      <LongImage
        src="/images/puf-panel/diagrams/puf-panel-thickness-chart.webp"
        alt="Technical chart of PUF panel thickness options from 30 to 200 mm"
        title="PUF panel thickness chart"
      />
      <LongImage
        src="/images/puf-panel/diagrams/puf-panel-size-transport-diagram.webp"
        alt="Technical diagram of PUF panel size and transport dimensions"
        title="PUF panel size and transport diagram"
      />
    </div>
  );
}

function ShippingContent() {
  return (
    <div className="space-y-4">
      <P>
        We dispatch from Bangalore for South India and Greater Noida for North India and Delhi NCR, so most
        sites are served from the nearer line. That matters for cost, not just speed: the nearer factory
        quotes your freight, so you are not paying a long-haul rate from a single distant plant the way you
        would with a supplier that runs only one line. For long-distance dispatch we apply a{' '}
        <span className="font-semibold text-foreground">500 m² minimum billing</span> quantity, a fact most
        sellers never state upfront.
      </P>
      <TrustCard
        deliveryLine="Pan-India delivery; transport confirmed at quotation; 3–5 business day default dispatch — see our"
        returnsLine="7-day returns on standard products (3-day on custom) — see our"
      />
    </div>
  );
}

export default function PufPanelHub() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="PUF Panel Manufacturer in India | Price & Sizes | SAMAN"
        fallbackDescription="SAMAN manufactures PUF panel systems at our Bangalore and Greater Noida lines — 30–200 mm thickness, PPGI/PPGL/SS facings, roof and wall profiles. Get factory-direct specs and a quotation."
        fallbackCanonical="https://www.samanportable.com/product/puf-panel"
        keywords="puf panel, puf panel manufacturers in india, puf panel suppliers, puf panel near me"
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
            <span className="font-semibold text-foreground">PUF Panel</span>
          </nav>

          {/* 3-column top section — consistent top edge via items-start; no
              awkward 2-col tablet state (single jump from 1-col to 3-col at lg:);
              sidebar sticky + height-capped with internal scroll. */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[PUF_CATALOG.price, PUF_CATALOG.roofing, PUF_CATALOG.sandwich]}
              />
            </div>

            <div className="order-2 lg:order-2 lg:col-span-5">
              <ProductCarousel images={GALLERY_IMAGES} />
              <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
                <p className="mb-2 text-sm font-bold text-foreground">Get a factory-direct quotation</p>
                <ProductZoneCtas variant="strip" />
              </div>
            </div>

            <div className="order-1 lg:order-3 lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <ProductInfoBox
                h1="PUF Panel — Factory-Made Insulated Panels by SAMAN"
                priceMain="From ₹1,050 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                shortDescription={INTRO_TEXT}
                application="Site offices, cold rooms, industrial sheds"
                sku="SP-C15-HUB-2026"
                averageRating="0.00"
                ratingCount={0}
              />
            </div>
          </div>

          {/* HUB-only sub-page navigation grid */}
          <div className="mt-8">
            <RelatedProductsRail
              heading="Explore the PUF Panel Range"
              items={[PUF_CATALOG.price, PUF_CATALOG.roofing, PUF_CATALOG.sandwich]}
            />
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="PUF Panel"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={990001}
              reviewProductId={272757}
              productName="PUF Panel"
            />
          </div>

          <div className="mt-8 space-y-8">
            <RelatedProductsRail items={[PUF_CATALOG.price, PUF_CATALOG.roofing, PUF_CATALOG.sandwich]} />
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
