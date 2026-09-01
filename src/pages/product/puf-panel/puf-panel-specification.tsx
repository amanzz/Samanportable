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
import ProductInfoBox from '@/components/product-puf/ProductInfoBox';
import ProductDetailTabs from '@/components/product-puf/ProductDetailTabs';
import RelatedProductsRail, { PUF_CATALOG } from '@/components/product-puf/RelatedProductsRail';
import ProductCarousel from '@/components/product-puf/ProductCarousel';
import { LongImage } from '@/components/product-puf/Gallery';
import { panelAggregateOffer } from '@/lib/panelSchemaOffers';
import { isTemporarilyGatedCommercialPath } from '@/lib/unapprovedCommercialGating';

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

const JUMP_ITEMS = [
  { id: 'spec-table', label: 'Specification table' },
  { id: 'thickness', label: 'PUF panel thickness' },
  { id: 'size', label: 'Size and sheet size' },
  { id: 'density-weight', label: 'Density, weight, R-value & U-value' },
  { id: 'applications', label: 'Wall, house and cold storage specs' },
  { id: 'read-quote', label: 'How to read a quote' },
  { id: 'faq', label: 'Frequently asked questions' },
];

const SPEC_ROWS: [string, string][] = [
  ['Thickness (standard)', '30 / 40 / 50 / 60 / 80 / 100 / 120 / 150 / 200 mm'],
  ['Thickness (made to order)', '70 mm, 90 mm, 140 mm, advance payment; price and lead time confirmed at quotation'],
  ['Freezer-grade thickness', 'Manufactured up to 150 mm'],
  ['Facing options', 'PPGI / PPGL / BGL / Stainless Steel / Aluminium / Craft Paper · 0.35–0.80 mm'],
  ['Roof cover width', '1000 mm effective (1070 mm overall)'],
  ['Roof profiles', 'Trapezoidal · ribbed'],
  ['Wall profiles', 'Plain · baby ribs · micro ribs'],
  ['Length', '2–15 m standard; custom lengths transport/site dependent'],
  ['Joint system', 'Tongue & groove (other joint systems confirmed at quotation)'],
  ['Panel weight', 'Approximately 10–12 kg/m² at 50 mm thickness; scales with thickness, exact figure confirmed at quotation'],
  ['Warranty', 'PUF panel warranty 5–10 years, confirmed at quotation'],
  ['HSN code', '940690'],
  ['Core density, thermal conductivity, R-value, U-value, fire rating', 'Confirmed at quotation against tested values'],
];

const FAQS = [
  { question: 'What is the PUF panel specification?', answer: 'The core specification covers thickness (30–200 mm standard, with 70/90/140 mm made to order), facing (PPGI/PPGL/BGL/stainless steel/aluminium/craft paper, 0.35–0.80 mm), profile (plain/baby-rib/micro-rib for walls, trapezoidal/ribbed for roofs), length (2–15 m standard) and joint type (tongue & groove).' },
  { question: 'What is the density of a PUF panel?', answer: 'We do not publish a core density figure, because we do not have an independently tested value we can stand behind for every batch. Ask any seller, including us, for a batch-tested certificate rather than a generic industry number; we confirm tested values at quotation against your project’s requirement.' },
  { question: 'What is the standard PUF panel thickness?', answer: '30, 40, 50, 60, 80, 100, 120, 150 and 200 mm are standard. 70 mm, 90 mm and 140 mm are made to order on request, not standard stock.' },
  { question: 'How much does a PUF panel weigh?', answer: 'A PUF panel weighs approximately 10–12 kg/m² at 50 mm thickness, scaling up with thickness. We confirm the exact figure for your chosen build at quotation.' },
  { question: 'What size sheets does a PUF panel come in?', answer: 'Roof panels cover 1000 mm effective width (1070 mm overall); wall panels run the same core width range. Length runs 2–15 m standard, with custom lengths confirmed against transport and site access.' },
  { question: 'Do you publish R-value or U-value figures?', answer: 'No. We do not publish R-value, U-value or thermal conductivity figures without a test certificate behind them for the specific order. We confirm tested values at quotation rather than quote a borrowed industry number.' },
  { question: 'What joint system do PUF panels use?', answer: 'Standard panels use a tongue-and-groove side joint. Other joint systems are confirmed at quotation against your project’s requirement.' },
  { question: 'What should I check before buying a PUF panel?', answer: 'Ask for thickness, facing type and gauge, profile, joint system, length, what the rate excludes, and the warranty, all in writing. A quote missing any of these is not comparable to one that states them.' },
];

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/puf-panel/puf-panel-specification#product',
  name: 'PUF Panel Specification',
  description: 'Owner-verified PUF panel specification by SAMAN: thickness, size, facing and weight for wall, roof, house and cold-storage panels. Manufactured in Bangalore and Greater Noida.',
  category: 'Insulated Sandwich Panel',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Polyurethane foam core with steel facing sheets',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Thickness range', value: '30–200 mm (70/90/140 mm made to order)' },
    { '@type': 'PropertyValue', name: 'Facing options', value: 'PPGI, PPGL, BGL, Stainless Steel, Aluminium, Craft Paper: 0.35–0.80 mm' },
    { '@type': 'PropertyValue', name: 'Roof cover width', value: '1000 mm effective (1070 mm overall)' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: panelAggregateOffer(1050, 'https://www.samanportable.com/product/puf-panel/puf-panel-specification'),
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'PUF Panel', item: 'https://www.samanportable.com/product/puf-panel' },
    { '@type': 'ListItem', position: 4, name: 'PUF Panel Specification', item: 'https://www.samanportable.com/product/puf-panel/puf-panel-specification' },
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
  'This is the PUF panel specification reference for our full panel range: thickness, size, facing and weight, gathered in one place with the numbers we can verify and the ones we deliberately don’t publish.';

const GALLERY_IMAGES = [
  { src: '/images/puf-panel/spec/50mm-off-white-puf-panel-factory-stack.webp', alt: '50 mm PUF panel factory stack, standard specification thickness', title: 'PUF panel specification, 50 mm factory stock' },
  { src: '/images/puf-panel/spec/100mm-cut-section-qc-inspection.webp', alt: '100 mm ivory PUF panel cut-section shown during quality-control inspection', title: 'PUF panel specification, 100 mm cut-section QC' },
  { src: '/images/puf-panel/spec/150mm-cut-section-qc-inspection.webp', alt: '150 mm white PUF panel cut-section shown during quality-control inspection', title: 'PUF panel specification, 150 mm cut-section QC' },
  { src: '/images/puf-panel/spec/60mm-yellow-puf-panel-product-photo.webp', alt: 'Yellow 60 mm PUF insulated panel, full product photo', title: 'PUF panel specification, 60 mm product photo' },
  { src: '/images/puf-panel/spec/80mm-ivory-puf-panel-factory-stack.webp', alt: 'Ivory 80 mm PUF panel factory stack, mid-range specification thickness', title: 'PUF panel specification, 80 mm factory stack' },
];

function DescriptionContent() {
  return (
    <>
      <div className="space-y-10">
        <P>{SHORT_DESCRIPTION}</P>

        <JumpNav items={JUMP_ITEMS} />

        <section id="spec-table" className="space-y-4">
          <H2 id="spec-table">PUF panel specification table</H2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <tbody>
                {SPEC_ROWS.map((row, i) => (
                  <tr key={row[0]} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/40'}>
                    <td className="w-2/5 px-4 py-3 text-sm font-semibold text-foreground">{row[0]}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>
            Every row above is owner-verified for SAMAN&apos;s own panels. The last row is deliberately
            unfilled, see{' '}
            <a href="#density-weight" className="font-semibold text-primary hover:underline">
              Density, weight, R-value and U-value
            </a>{' '}
            for why.
          </P>
          <LongImage
            src="/images/puf-panel/spec/50mm-off-white-puf-panel-factory-stack.webp"
            alt="50 mm PUF panel factory stack, standard specification thickness"
            title="PUF panel specification, 50 mm factory stock"
          />
        </section>

        <section id="thickness" className="space-y-3">
          <H2 id="thickness">PUF panel thickness</H2>
          <P>
            PUF panel thickness runs from 30 mm to 200 mm in standard steps: 30, 40, 50, 60, 80, 100, 120, 150
            and 200 mm. Freezer-grade panels are manufactured up to 150 mm. Three thicknesses sit outside the
            standard line: <span className="font-semibold text-foreground">70 mm, 90 mm and 140 mm are made to
            order</span> on client request, against advance payment, with price and lead time confirmed at
            quotation rather than quoted as a stock rate.
          </P>
          <P>
            Thickness selection follows the job, not a fixed rule: thinner panels (30–50 mm) suit walls,
            partitions and general cabin use; 60–100 mm suits roofs and buildings needing stronger heat
            control; 100 mm and above suits cold storage and extreme-climate builds. For
            application-specific guidance, see our{' '}
            <Link href="/product/puf-panel/cold-storage-puf-panel" className="font-semibold text-primary hover:underline">
              cold storage grade panel thickness guidance
            </Link>
            .
          </P>
          <LongImage
            src="/images/puf-panel/spec/100mm-cut-section-qc-inspection.webp"
            alt="100 mm ivory PUF panel cut-section shown during quality-control inspection"
            title="PUF panel specification, 100 mm cut-section QC"
          />
          <LongImage
            src="/images/puf-panel/spec/150mm-cut-section-qc-inspection.webp"
            alt="150 mm white PUF panel cut-section shown during quality-control inspection"
            title="PUF panel specification, 150 mm cut-section QC"
          />
        </section>

        <section id="size" className="space-y-3">
          <H2 id="size">PUF panel size and sheet size</H2>
          <P>
            A PUF panel sheet is defined by three dimensions: thickness (30–200 mm, as above), covered width,
            and length. Roof panels cover <span className="font-semibold text-foreground">1000 mm effective
            width (1070 mm overall)</span>; wall panels are supplied in plain, baby-rib and micro-rib profiles
            at the same core width range. Length runs <span className="font-semibold text-foreground">2–15 m
            as standard</span>, with longer or custom lengths possible but transport- and site-access-dependent. A long panel needs road clearance and offloading space, so the workable length for your site is
            confirmed before production.
          </P>
          <P>
            There is no single fixed &ldquo;PUF sheet size&rdquo; beyond these ranges, because panels are cut
            and profiled to your drawing rather than sold as a pre-fixed sheet. The thickness, width and
            length are set from your specification at quotation.
          </P>
        </section>

        <section id="density-weight" className="space-y-3">
          <H2 id="density-weight">Density, weight, R-value and U-value: what to verify before you buy</H2>
          <P>
            This is the section most PUF panel listings get wrong, because it is where sellers most often
            quote borrowed industry figures as if they were tested values for their own panels. We do not
            publish a core density, thermal conductivity, R-value or U-value for our panels here, because we
            do not have independently tested values we can stand behind in writing for every batch.
          </P>
          <P>
            That is not the same as having nothing to say. Here is what to actually verify before you buy any
            PUF panel, from any seller:
          </P>
          <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <li><span className="font-semibold text-foreground">Ask for the core density in writing</span>, not a verbal claim. A lower-density core insulates worse and is more prone to facing separation over time, and it is the most common hidden cost-cut in a cheap quote.</li>
            <li><span className="font-semibold text-foreground">Ask for a thermal conductivity or R-value/U-value figure backed by a test certificate</span>, not a number copied from a generic PUF datasheet. Two panels labelled the same thickness can perform differently if the core density differs.</li>
            <li><span className="font-semibold text-foreground">Ask how the figure was tested</span>. Batch-tested values are worth more than a one-time factory average applied to every order.</li>
          </ul>
          <P>
            When you send us your project&apos;s insulation requirement, we confirm the tested values that
            apply to your order at quotation, rather than quoting a number that may not hold for your actual
            batch. A seller who can&apos;t produce a certificate on request is the clearest sign the figure
            was never tested for their panels either.
          </P>
          <LongImage
            src="/images/puf-panel/spec/60mm-yellow-puf-panel-product-photo.webp"
            alt="Yellow 60 mm PUF insulated panel, full product photo"
            title="PUF panel specification, 60 mm product photo"
          />
        </section>

        <section id="applications" className="space-y-3">
          <H2 id="applications">Wall, roof, house and cold storage specifications</H2>
          <P>
            The thickness, facing and length ranges above apply across our whole panel line, only the profile
            and joint detailing change by application:
          </P>
          <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <li>Walls, partitions and ceilings use the same core range in{' '}
              <Link href="/product/puf-panel/puf-wall-panel" className="font-semibold text-primary hover:underline">
                wall and partition panel applications
              </Link>
              , in plain, baby-rib or micro-rib profiles.
            </li>
            <li><span className="font-semibold text-foreground">Roof panels</span> use trapezoidal or ribbed profiles at 1000 mm effective width.</li>
            <li>The same wall and roof panel range, specified to your residential drawing, supplies{' '}
              <Link href="/product/puf-panel/puf-panel-house" className="font-semibold text-primary hover:underline">
                residential PUF panel house projects
              </Link>
              .
            </li>
            <li><span className="font-semibold text-foreground">Cold storage panels</span> typically run 80 mm and above, with freezer-grade manufacture up to 150 mm.</li>
          </ul>
          <LongImage
            src="/images/puf-panel/spec/80mm-ivory-puf-panel-factory-stack.webp"
            alt="Ivory 80 mm PUF panel factory stack, mid-range specification thickness"
            title="PUF panel specification, 80 mm factory stack"
          />
        </section>

        <section id="read-quote" className="space-y-3">
          <H2 id="read-quote">How to read a PUF panel quote</H2>
          <P>A complete PUF panel quote states, in writing:</P>
          <ol className="list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <li><span className="font-semibold text-foreground">Thickness</span>, one of the standard steps, or a made-to-order thickness with its own lead time.</li>
            <li><span className="font-semibold text-foreground">Facing type and gauge</span>: PPGI, PPGL, BGL, stainless steel, aluminium or craft paper, at the gauge quoted.</li>
            <li><span className="font-semibold text-foreground">Profile</span>: plain, baby-rib, micro-rib, trapezoidal or ribbed, depending on wall or roof use.</li>
            <li><span className="font-semibold text-foreground">Joint system</span>, tongue &amp; groove as our standard.</li>
            <li><span className="font-semibold text-foreground">Length</span>, within the 2–15 m standard range, or confirmed for a custom length.</li>
            <li><span className="font-semibold text-foreground">What is excluded</span>. GST, transport, installation and accessories are not bundled into the panel rate.</li>
            <li><span className="font-semibold text-foreground">Warranty</span>, stated as a specific figure, not left unstated.</li>
          </ol>
          <P>
            If a quote is missing any of these seven, ask for it before you compare price. Our{' '}
            <Link href="/product/puf-panel" className="font-semibold text-primary hover:underline">
              PUF panels manufactured in Bangalore and Greater Noida
            </Link>{' '}
            are quoted against this exact structure every time.
          </P>
        </section>

        <section id="faq" className="space-y-4">
          <H2 id="faq">Frequently asked questions</H2>
          <FaqAccordion items={FAQS} />
        </section>

        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
          <h3 className="mb-1 text-xl font-bold text-foreground">Get your PUF panel specification confirmed at quotation</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Send your application, thickness and site city for a firm quote.
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
        The table above (Description tab) is the full reference. This tab holds the same owner-verified
        specification alongside the technical diagrams.
      </P>
      <LongImage
        priority
        src="/images/puf-panel/diagrams/p1-thickness-lineup-diagram.webp"
        alt="PUF panel standard thickness comparison diagram from 30 mm to 200 mm with 70 mm and 90 mm made to order"
        title="Standard PUF panel thickness range 30–200 mm"
      />
      <LongImage
        src="/images/puf-panel/diagrams/p1-cross-section-diagram.webp"
        alt="PUF sandwich panel cross-section diagram showing steel facing, PUF insulation core and 30–200 mm thickness range"
        title="PUF panel construction, three-layer cross-section"
      />
      <LongImage
        src="/images/puf-panel/diagrams/p1-master-dimension-diagram.webp"
        alt="PUF panel master dimension diagram showing 1000 mm width, 2 to 15 m standard length and route and site access checked before dispatch for long panels"
        title="PUF panel dimensions, width, length and transport"
      />
    </div>
  );
}

function ShippingContent() {
  return (
    <div className="space-y-4">
      <P>
        We dispatch from Bangalore for South India and Greater Noida for North India and Delhi NCR. Pan-India
        delivery; transport confirmed at quotation; 3–5 business day default dispatch, see our{' '}
        <Link href="/delivery-policy" className="font-semibold text-primary hover:underline">
          Delivery Policy
        </Link>
        .
      </P>
      <P>
        Standard products carry 7-day returns (3-day on custom), see our{' '}
        <Link href="/refund-and-return-policy" className="font-semibold text-primary hover:underline">
          Refund &amp; Return Policy
        </Link>
        .
      </P>
    </div>
  );
}

export default function PufPanelSpecification() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="PUF Panel Specification: Thickness, Size & Density | SAMAN"
        fallbackDescription="PUF panel specification from SAMAN: thickness, size, facing and weight, owner-verified. Learn what to check before you buy, and what we confirm at quotation."
        fallbackCanonical="https://www.samanportable.com/product/puf-panel/puf-panel-specification"
        keywords="puf panel specification, puf panel thickness, puf panel size, puf sheet size, puf panel density, puf panel weight"
        author="SAMAN POS India Private Limited"
        publisher="SAMAN POS India Private Limited"
      />
      <Head>
        {!isTemporarilyGatedCommercialPath('/product/puf-panel/puf-panel-specification') && <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSONLD) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />
        </>}
      </Head>

      <main className="bg-background pb-24 lg:pb-12">
        <div className="mx-auto max-w-7xl container-padding pt-4">
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <Link href="/product" className="hover:text-primary">Product</Link><span>/</span>
            <Link href="/product/puf-panel" className="hover:text-primary">PUF Panel</Link><span>/</span>
            <span className="font-semibold text-foreground">PUF Panel Specification</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[PUF_CATALOG.hub, PUF_CATALOG.house, PUF_CATALOG.coldStorage]}
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
                h1="PUF Panel Specification: Thickness, Size, Facing and Weight"
                priceMain="From ₹1,050 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                shortDescription={SHORT_DESCRIPTION}
                application="Wall, roof, house and cold storage panels"
                sku="SP-C15-SPC-2026"
                averageRating="0.00"
                ratingCount={0}
                materialOverride="PPGI-faced PUF core, density stated at quotation with test documentation"
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="PUF Panel Specification"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={990007}
              reviewProductId={272763}
              productName="PUF Panel Specification"
            />
          </div>

          <div className="mt-8 space-y-8">
            <RelatedProductsRail items={[PUF_CATALOG.hub, PUF_CATALOG.house, PUF_CATALOG.coldStorage]} />
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
