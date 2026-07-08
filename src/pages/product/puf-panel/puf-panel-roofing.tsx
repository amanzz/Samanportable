import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import ProductZoneCtas from '@/components/product/ProductZoneCtas';
import CertBadgeStrip from '@/components/product-puf/CertBadgeStrip';
import FaqAccordion from '@/components/product-puf/FaqAccordion';
import JumpNav from '@/components/product-puf/JumpNav';
import MobileStickyCta from '@/components/product-puf/MobileStickyCta';
import SpecTable from '@/components/product-puf/SpecTable';
import ProductInfoBox from '@/components/product-puf/ProductInfoBox';
import ProductDetailTabs from '@/components/product-puf/ProductDetailTabs';
import RelatedProductsRail, { PUF_CATALOG } from '@/components/product-puf/RelatedProductsRail';
import ProductCarousel from '@/components/product-puf/ProductCarousel';
import { LongImage } from '@/components/product-puf/Gallery';

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

const JUMP_ITEMS = [
  { id: 'roof-specs', label: 'Thickness, profile & facing' },
  { id: 'where-used', label: 'Where roof panels work best' },
  { id: 'fixing-slope', label: 'Fixing, slope & leak-prevention' },
  { id: 'heat-durability', label: 'Heat control & durability' },
  { id: 'get-quotation', label: 'Get a roof quotation' },
  { id: 'faq', label: 'Frequently asked questions' },
];

const SPEC_ROWS = [
  { label: 'Profile', value: 'Trapezoidal · ribbed' },
  { label: 'Thickness', value: '30 / 40 / 50 / 60 / 80 / 100 / 120 / 150 / 200 mm' },
  { label: 'Cover width', value: '1000 mm effective (1070 mm overall)' },
  { label: 'Facing sheets', value: 'PPGI · PPGL · BGL · Aluminium · Stainless Steel' },
  { label: 'Facing gauge', value: '0.35–0.80 mm' },
  { label: 'Core', value: 'PUF (PUR), 40 ± 2 kg/m³' },
  { label: 'Length', value: '2–15 m standard; custom transport/site dependent' },
  { label: 'Joints', value: 'Tongue & groove' },
  { label: 'HSN code', value: '940690' },
  { label: 'Warranty', value: 'PUF panel warranty 5–10 years, confirmed at quotation' },
];

const FAQS = [
  { question: 'What is PUF panel roofing?', answer: 'PUF panel roofing is an insulated roof sheet with a trapezoidal or ribbed steel profile and a polyurethane foam core. One sheet provides the roof cover, the insulation and a finished underside, which is why it is used on sheds, factories and site buildings instead of bare metal roofing.' },
  { question: 'How long does a PUF roof last?', answer: 'Service life depends on the facing sheet, coating, slope and how well joints and fasteners are detailed, so we confirm expectations against your drawing rather than quoting a blanket figure. A correctly sloped roof with the right facing and sealed laps is a long-service roof; the panel warranty is 5–10 years, confirmed at quotation.' },
  { question: 'What thickness of PUF panel is best for a roof?', answer: 'It follows the building. 30–50 mm suits site offices and lighter sheds, 60–100 mm suits factory roofs needing stronger heat control, and cold buildings run 100 mm and above. Tell us the use and we advise the thickness before quoting.' },
  { question: 'Does a PUF roof panel leak at the joints?', answer: 'Not when detailed correctly. The tongue-and-groove side joint closes the sheets together, and end-laps and penetrations are sealed to the drawing. The common causes of leaks are under-sloping and unsealed end-laps — both are decided at the drawing stage, which is why we finalise slope and fastener pattern per project.' },
  { question: 'Can PUF roofing panels be fixed over an old metal roof?', answer: 'Yes — a single insulated PUF panel can re-roof over an existing structure, replacing separate deck, insulation and lining in one sheet. The span, fixing and slope are confirmed from the existing frame drawing so the new roof seats and sheds correctly.' },
  { question: 'What roof profile and width do you supply?', answer: 'Roof panels are made in trapezoidal and ribbed profiles at 1000 mm effective (1070 mm overall) cover width, from 30 mm to 200 mm thick. Facing sheets run PPGI, PPGL, BGL, aluminium or stainless steel at 0.35–0.80 mm gauge.' },
  { question: 'How is the PUF roofing sheet delivered to site?', answer: 'We dispatch from the nearer of our Bangalore and Greater Noida factories, with transport confirmed at quotation and a 3–5 business day default dispatch. Because roof sheets are long, we confirm the workable panel length against your road access and offloading space before production.' },
  { question: 'What is the minimum slope for a PUF panel roof?', answer: 'There is no single minimum we publish, because the correct slope depends on span, local rainfall and the fastener pattern used. Slope is finalized from the project drawing and confirmed at quotation, so the roof is engineered to shed water on your specific building, not against a generic number.' },
  { question: 'How heavy is a PUF roof panel?', answer: 'A PUF roof panel weighs approximately 10–12 kg/m² at 50 mm thickness, which is light enough to sit on standard light-gauge purlin structures without extra structural reinforcement. Heavier thicknesses scale up proportionally, and we confirm the exact figure for your chosen build.' },
];

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/puf-panel/puf-panel-roofing#product',
  name: 'PUF Panel Roofing — Insulated Roof Sheets',
  description: 'Insulated PUF roof panels by SAMAN in trapezoidal and ribbed profiles, 30–200 mm, 1000 mm effective width, for sheds, factories, site offices and cold buildings. Manufactured in Bangalore and Greater Noida.',
  category: 'Insulated Roof Panel',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Polyurethane foam core with steel roof facing',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Roof profiles', value: 'Trapezoidal, ribbed' },
    { '@type': 'PropertyValue', name: 'Cover width', value: '1000 mm effective (1070 mm overall)' },
    { '@type': 'PropertyValue', name: 'Thickness range', value: '30–200 mm' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '1050',
    url: 'https://www.samanportable.com/product/puf-panel/puf-panel-roofing',
  },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'PUF Panel', item: 'https://www.samanportable.com/product/puf-panel' },
    { '@type': 'ListItem', position: 4, name: 'PUF Panel Roofing', item: 'https://www.samanportable.com/product/puf-panel/puf-panel-roofing' },
  ],
};

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
};

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-28 text-2xl font-bold text-foreground sm:text-3xl">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">{children}</p>
);

const SHORT_DESCRIPTION =
  'PUF panel roofing is an insulated roof sheet: a trapezoidal or ribbed steel roof profile with a polyurethane foam core, so one sheet gives you the roof cover and the insulation together. SAMAN manufactures PUF roofing panels direct at our Bangalore and Greater Noida lines, built to your roof drawing.';

const GALLERY_IMAGES = [
  { src: '/images/puf-panel/roof-profile-60mm-800x800.webp', alt: 'Royal-blue 60 mm PUF roof panel showing the trapezoidal profile on a steel frame', title: '60 mm PUF roof panel profile, steel frame' },
  { src: '/images/puf-panel/roof-prefab-red-60mm-800x800.webp', alt: 'Red 60 mm PUF roof panel on a prefab shed roof', title: '60 mm PUF roof panel, prefab shed' },
  { src: '/images/puf-panel/roof-industrial-white-50mm-800x800.webp', alt: 'White 50 mm PUF roof panel on an industrial building floor', title: '50 mm PUF roof panel, industrial building' },
  { src: '/images/puf-panel/roof-install-50mm-800x800.webp', alt: 'Dark-blue 50 mm PUF roof panel being installed on a steel roof frame', title: '50 mm PUF roof panel installation' },
  { src: '/images/puf-panel/roof-profile-30mm-800x800.webp', alt: 'White 30 mm PUF roofing panel showing the trapezoidal roof profile', title: '30 mm PUF panel trapezoidal roof profile' },
];

function DescriptionContent() {
  return (
    <>
      <div className="space-y-10">
        <JumpNav items={JUMP_ITEMS} />

        <section id="roof-specs" className="space-y-3">
          <H2 id="roof-specs">Roof panel thickness, profile and facing options</H2>
          <P>
            A PUF roof panel is chosen by profile first, then thickness and facing. Roof panels run a{' '}
            <span className="font-semibold text-foreground">trapezoidal or ribbed profile</span> so they shed
            water and span between purlins, at{' '}
            <span className="font-semibold text-foreground">1000 mm effective / 1070 mm overall</span> cover
            width.
          </P>
          <P>
            Thinner 30–50 mm roof sheets suit site offices and lighter sheds; 60–100 mm suits factory roofs
            needing stronger heat control; above 100 mm is for cold buildings and is confirmed at quotation.
          </P>
          <LongImage
            src="/images/puf-panel/roofing-installed-shed-40mm-1200x675.webp"
            alt="40 mm PUF roofing panel installed as an insulated shed roof on a steel frame"
            title="40 mm PUF roofing panel on a shed roof"
          />
          <LongImage
            src="/images/puf-panel/roofing-steel-frame-30mm-1200x675.webp"
            alt="30 mm PUF roofing panel on a steel frame, ready for fixing"
            title="30 mm PUF roofing panel, steel frame"
          />
        </section>

        <section id="where-used" className="space-y-3">
          <H2 id="where-used">Where insulated PUF roof panels work best</H2>
          <P>
            PUF roof panels earn their place wherever the roof has to do more than keep rain out. The common
            cases:
          </P>
          <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <li><span className="font-semibold text-foreground">Factory and warehouse roofs</span> — large spans that would otherwise radiate heat all day; the insulated core keeps the floor workable.</li>
            <li><span className="font-semibold text-foreground">Prefab sheds and site offices</span> — the roof goes on finished, insulated and sealed in one pass over the frame.</li>
            <li><span className="font-semibold text-foreground">Cold buildings and controlled-temperature rooms</span> — where the roof is part of the thermal envelope, not just cover.</li>
            <li><span className="font-semibold text-foreground">Re-roofing over old metal</span> — a single insulated sheet replaces separate deck, insulation and lining.</li>
          </ul>
          <P>
            Because the panel is finished on both faces, the underside reads as a clean ceiling — no separate
            lining trade needed.
          </P>
        </section>

        <section id="fixing-slope" className="space-y-3">
          <H2 id="fixing-slope">Fixing, slope and leak-prevention on PUF roofs</H2>
          <P>
            PUF roof panels lock together with{' '}
            <span className="font-semibold text-foreground">tongue-and-groove joints</span> that close
            side-to-side, and are fixed through to the purlins so the roof acts as one sealed skin. Done right,
            the joint line is the waterproofing.
          </P>
          <P>
            Slope, span and fastener pattern are not one-size numbers — they are finalized from the project
            drawing and confirmed at quotation, because they depend on your purlin spacing, panel length and
            local conditions. What holds on every job: keep a genuine fall so water runs off, seal end-laps and
            penetrations, and use the correct fastener and washer for the facing. Under-sloping and skipping
            end-lap sealing are the two most common causes of a leaking insulated roof — both are avoidable at
            the drawing stage.
          </P>
        </section>

        <section id="heat-durability" className="space-y-3">
          <H2 id="heat-durability">Heat control, condensation and roof durability</H2>
          <P>
            The reason to insulate the roof, not just the walls, is that the roof takes the sun. A PUF roof
            panel has a thermal conductivity of{' '}
            <span className="font-semibold text-foreground">0.022–0.024 W/m·K</span> and a service temperature
            of <span className="font-semibold text-foreground">−40°C to +80°C</span>, so it holds a large
            temperature gap across a thin sheet and keeps interior heat gain down.
          </P>
          <P>
            The closed-cell PUF core also resists the through-panel moisture path, which is what causes a bare
            metal roof to drip in humid or cold conditions. On fire, the core is a closed-cell PUF; where a
            project needs improved fire performance, PIR offers better fire behaviour than standard PUF. We
            keep this qualitative — no class code or hour rating is stated without test data.
          </P>
          <LongImage
            src="/images/puf-panel/roof-install-70mm-1200x675.webp"
            alt="Royal-blue 70 mm PUF roof panel being installed on a steel frame roof, mid-fixing"
            title="70 mm PUF roof panel installation, steel frame"
          />
          <LongImage
            src="/images/puf-panel/roof-steel-building-80mm-1200x675.webp"
            alt="Royal-blue 80 mm PUF roof panel on a steel building, showing heat and durability performance"
            title="80 mm PUF roof panel, steel building"
          />
        </section>

        <section id="get-quotation" className="space-y-3">
          <H2 id="get-quotation">How to get a correct roof panel quotation</H2>
          <P>
            For an accurate roof quote, send the roof plan or at least the covered area, the span and purlin
            spacing, the thickness or heat-control target, the facing and colour, and the site city. With the
            drawing we finalise slope, panel length and fastener pattern — and price the roof, not just the
            sheet.
          </P>
          <P>
            If you also want to sanity-check budget by thickness first, see the{' '}
            <Link href="/product/puf-panel/puf-panel-price" className="font-semibold text-primary hover:underline">
              current PUF panel rate table by thickness
            </Link>
            , then send the roof drawing for a firm figure.
          </P>
        </section>

        <section id="faq" className="space-y-4">
          <H2 id="faq">Frequently asked questions</H2>
          <FaqAccordion items={FAQS} />
        </section>

        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
          <h3 className="mb-1 text-xl font-bold text-foreground">Get a PUF roofing panel quotation</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Send your roof area, span, thickness and site city.
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
      <P>The roof-panel specification referenced throughout this page, tabulated for quick reference.</P>
      <SpecTable title="Roof Panel Specifications" rows={SPEC_ROWS} />
      <LongImage
        priority
        src="/images/puf-panel/diagrams/puf-roof-panel-profile-diagram.webp"
        alt="Technical diagram of the PUF roof panel trapezoidal and ribbed profile"
        title="PUF roof panel profile diagram"
      />
      <LongImage
        src="/images/puf-panel/diagrams/puf-panel-joint-detail-diagram.webp"
        alt="Technical diagram of the PUF panel tongue-and-groove joint detail"
        title="PUF panel joint detail diagram"
      />
    </div>
  );
}

function ShippingContent() {
  return (
    <div className="space-y-4">
      <P>
        Roof panels are long, so delivery is a real part of the roofing decision, not an afterthought.
        Standard lengths run 2–15 m; a single-length roof sheet avoids end-laps but needs the truck and the
        site to take it. Custom lengths are possible, but a long roof panel needs road clearance to reach
        site and offloading room to land safely — so we confirm the workable length against your access
        before production.
      </P>
      <P>
        We dispatch from Bangalore for South India and Greater Noida for North India and Delhi NCR, which
        shortens the road run for most sites — an advantage that matters more for long roof panels than for
        wall panels. Pan-India delivery; transport confirmed at quotation; 3–5 business day default dispatch
        — see our{' '}
        <Link href="/delivery-policy" className="font-semibold text-primary hover:underline">
          Delivery Policy
        </Link>
        . A <span className="font-semibold text-foreground">500 m² minimum billing</span> applies to
        long-distance dispatch.
      </P>
      <P>
        If a roof order needs to go back, standard panels can be returned within 7 days (3 days for
        custom-profiled runs) under our{' '}
        <Link href="/refund-and-return-policy" className="font-semibold text-primary hover:underline">
          Refund &amp; Return Policy
        </Link>
        .
      </P>
      <LongImage
        src="/images/puf-panel/roof-prefab-shed-70mm-1200x675.webp"
        alt="Red 70 mm PUF roof panel applied on a prefab shed at a live site"
        title="70 mm PUF roof panel, prefab shed application"
      />
    </div>
  );
}

export default function PufPanelRoofing() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="PUF Panel Roofing Sheet — Insulated Roof Panels | SAMAN"
        fallbackDescription="PUF panel roofing from SAMAN — insulated roof sheets in trapezoidal and ribbed profiles, 30–200 mm, for sheds, factories and site buildings. Factory-direct from Bangalore and Greater Noida. Get a roof quote."
        fallbackCanonical="https://www.samanportable.com/product/puf-panel/puf-panel-roofing"
        keywords="puf panel roofing, puf panel roof, puff sheet roofing, puf roofing sheet"
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
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <Link href="/product" className="hover:text-primary">Product</Link><span>/</span>
            <Link href="/product/puf-panel" className="hover:text-primary">PUF Panel</Link><span>/</span>
            <span className="font-semibold text-foreground">PUF Panel Roofing</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[PUF_CATALOG.hub, PUF_CATALOG.price, PUF_CATALOG.sandwich]}
              />
            </div>

            <div className="order-2 lg:order-2 lg:col-span-5">
              <ProductCarousel images={GALLERY_IMAGES} />
              <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
                <p className="mb-2 text-sm font-bold text-foreground">Get a factory-direct roofing quotation</p>
                <ProductZoneCtas variant="strip" />
              </div>
            </div>

            <div className="order-1 lg:order-3 lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <ProductInfoBox
                h1="PUF Panel Roofing — Insulated Roof Sheets for Sheds and Site Buildings"
                priceMain="From ₹1,050 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                shortDescription={SHORT_DESCRIPTION}
                application="Factory sheds, warehouses, cold buildings"
                sku="SP-C15-ROF-2026"
                averageRating="0.00"
                ratingCount={0}
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="PUF Panel Roofing"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={990003}
              reviewProductId={272759}
              productName="PUF Panel Roofing"
            />
          </div>

          <div className="mt-8 space-y-8">
            <RelatedProductsRail items={[PUF_CATALOG.hub, PUF_CATALOG.price, PUF_CATALOG.sandwich]} />
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
