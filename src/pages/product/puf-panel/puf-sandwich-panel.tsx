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
import TrustCard from '@/components/product-puf/TrustCard';
import ProductInfoBox from '@/components/product-puf/ProductInfoBox';
import ProductDetailTabs from '@/components/product-puf/ProductDetailTabs';
import RelatedProductsRail, { PUF_CATALOG } from '@/components/product-puf/RelatedProductsRail';
import ProductCarousel from '@/components/product-puf/ProductCarousel';
import { LongImage } from '@/components/product-puf/Gallery';

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

const JUMP_ITEMS = [
  { id: 'vocabulary', label: 'One product, many names' },
  { id: 'layers', label: 'Panel layers & facing options' },
  { id: 'thickness-size', label: 'Thickness & size selection' },
  { id: 'uses', label: 'Wall, roof, cabin & cold-room uses' },
  { id: 'manufacturing', label: 'How we manufacture & check' },
  { id: 'faq', label: 'Frequently asked questions' },
];

const LAYER_ROWS = [
  { label: 'Outer facings (×2)', value: 'PPGI · PPGL · BGL · Stainless Steel · Aluminium · Craft Paper' },
  { label: 'Facing gauge', value: '0.35–0.80 mm' },
  { label: 'Core', value: 'PUF (PUR), 40 ± 2 kg/m³ density' },
  { label: 'Thermal conductivity', value: '0.022–0.024 W/m·K' },
  { label: 'Service temperature', value: '−40°C to +80°C' },
  { label: 'Panel weight', value: '≈ 10–12 kg/m² at 50 mm' },
  { label: 'Bond', value: 'Foam injected and cured so it bonds to both facings as one board' },
  { label: 'HSN code', value: '940690' },
  { label: 'Warranty', value: 'PUF panel warranty 5–10 years, confirmed at quotation' },
];

const FAQS = [
  { question: 'What is a PUF sandwich panel?', answer: 'A PUF sandwich panel is a three-layer insulated sheet — two steel facings bonded to a rigid polyurethane foam core. The layered steel-foam-steel build is the "sandwich", and it gives structure, insulation and a finished surface in one board for walls, roofs, cabins and cold rooms.' },
  { question: 'Is a PUF sheet the same as a PUF sandwich panel?', answer: 'Yes. A PUF sheet, PUF panel sheet, puff panel and PUF insulated sheet all describe the same three-layer product. The names vary by seller and spelling, but the panel — steel facing, PUF core, steel facing — is the same, and we quote it the same way.' },
  { question: 'Why is it called a "sandwich" panel?', answer: 'Because the panel is built in three layers, like a sandwich: two outer steel facing sheets with a rigid PUF core in the middle. The core is injected and cured so it bonds to both facings and the three layers act as one board.' },
  { question: 'What sizes do PUF sandwich panels come in?', answer: 'Thickness runs 30 mm to 200 mm, covered width is 1000 mm (roof 1070 mm overall), and lengths run 2–15 m standard, with custom lengths subject to transport and site access. Freezer-grade panels are made up to 150 mm.' },
  { question: 'What facing sheets can I choose?', answer: 'Facings are PPGI, PPGL, BGL, stainless steel, aluminium or craft paper, at 0.35–0.80 mm gauge. PPGI and PPGL suit general wall and roof; stainless steel and aluminium suit hygienic cold rooms and food-grade spaces.' },
  { question: 'Can PUF sandwich panels be used for cold rooms?', answer: 'Yes. With the closed-cell PUF core, a −40°C to +80°C service range and a cam-lock joint option, the panel forms an airtight cold-room envelope. We manufacture freezer-grade PUF panels up to 150 mm for lower-temperature stores.' },
  { question: 'What is the core density of a PUF sandwich panel?', answer: 'Our PUF core is 40 ± 2 kg/m³ with a thermal conductivity of 0.022–0.024 W/m·K. Any tested value beyond this range for a specific order is confirmed at quotation rather than stated as a blanket claim.' },
];

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/puf-panel/puf-sandwich-panel#product',
  name: 'PUF Sandwich Panel',
  description: 'PUF sandwich panel (PUF sheet / insulated sheet) by SAMAN — three-layer steel-foam-steel insulated panel, 30–200 mm, PPGI/PPGL/BGL/stainless/aluminium/craft-paper facings, for wall, roof, cabin and cold-room use. Manufactured in Bangalore and Greater Noida.',
  category: 'Insulated Sandwich Panel',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Polyurethane foam core with steel facing sheets',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Construction', value: 'Three-layer: steel facing / PUF core / steel facing' },
    { '@type': 'PropertyValue', name: 'Thickness range', value: '30–200 mm' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '1050',
    url: 'https://www.samanportable.com/product/puf-panel/puf-sandwich-panel',
  },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'PUF Panel', item: 'https://www.samanportable.com/product/puf-panel' },
    { '@type': 'ListItem', position: 4, name: 'PUF Sandwich Panel', item: 'https://www.samanportable.com/product/puf-panel/puf-sandwich-panel' },
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
  'A PUF sandwich panel is a three-layer insulated sheet: two steel facing sheets bonded to a rigid polyurethane foam core in the middle — the "sandwich" is that layered build. It is the same product buyers also call a PUF sheet, a puff panel or an insulated sheet, made for walls, roofs, cabins and cold rooms.';

const GALLERY_IMAGES = [
  { src: '/images/puf-panel/cross-section-30mm-800x800.webp', alt: 'Cross-section of a 30 mm panel showing the two facing layers and the foam core between them', title: 'Panel layer cross-section, facing and core' },
  { src: '/images/puf-panel/corner-detail-40mm-800x800.webp', alt: 'Corner studio photo of a 40 mm panel showing both steel facings and the foam edge', title: '40 mm panel corner detail' },
  { src: '/images/puf-panel/sandwich-factory-80mm-800x800.webp', alt: 'Grey 80 mm PUF sandwich panel on the factory floor display', title: '80 mm PUF sandwich panel, factory floor' },
  { src: '/images/puf-panel/factory-display-60mm-800x800.webp', alt: 'Grey 60 mm panel on factory display showing the wall profile', title: '60 mm panel, factory display' },
  { src: '/images/puf-panel/factory-stack-ivory-70mm-800x800.webp', alt: 'Ivory 70 mm PUF panel factory stack ready for wall or cold-room use', title: '70 mm PUF panel, factory stack' },
];

function DescriptionContent() {
  return (
    <>
      <div className="space-y-10">
        <JumpNav items={JUMP_ITEMS} />

        <section id="vocabulary" className="space-y-3">
          <H2 id="vocabulary">PUF sheet, puff panel, insulated sheet — one product, many names</H2>
          <P>
            Buyers search for this panel under half a dozen names, and the mismatched vocabulary causes real
            confusion when comparing quotes. To be clear: a{' '}
            <span className="font-semibold text-foreground">PUF sheet</span>, a{' '}
            <span className="font-semibold text-foreground">PUF panel sheet</span>, a{' '}
            <span className="font-semibold text-foreground">puff panel</span> (a common spelling of PUF), a{' '}
            <span className="font-semibold text-foreground">PUF insulated sheet</span> and a{' '}
            <span className="font-semibold text-foreground">PUF sandwich panel</span> all describe the same
            three-layer product. There is no material difference between them — only the word the seller
            happens to use.
          </P>
          <P>
            We use that name because it describes the build honestly: steel&ndash;foam&ndash;steel. But whether
            your drawing says &ldquo;PUF sheet&rdquo;, &ldquo;insulated sheet&rdquo; or &ldquo;puff
            panel&rdquo;, you are asking for the same panel, and we quote it the same way. Mapping these names
            in one place is deliberate — no ranking page states plainly that these are one product, and it is
            the single most common reason buyers mis-compare sellers.
          </P>
          <LongImage
            src="/images/puf-panel/cutaway-detail-30mm-1200x675.webp"
            alt="Cutaway of a 30 mm panel showing the steel-foam-steel three-layer build"
            title="30 mm panel cutaway detail"
          />
          <LongImage
            src="/images/puf-panel/sandwich-studio-30mm-1200x675.webp"
            alt="Studio product shot of a 30 mm PUF sandwich panel"
            title="30 mm PUF sandwich panel, studio shot"
          />
        </section>

        <section id="layers" className="space-y-3">
          <H2 id="layers">Panel layers and facing options</H2>
          <P>
            The three layers are what make the panel work. The two outer{' '}
            <span className="font-semibold text-foreground">facing sheets</span> carry the finish and the
            structure; the <span className="font-semibold text-foreground">PUF core</span> in between carries
            the insulation.
          </P>
          <P>
            The facing choice sets both the look and the environment fit: PPGI and PPGL for general wall and
            roof, stainless steel or aluminium for hygienic cold rooms and food spaces, craft paper where a
            lightweight backing is enough.
          </P>
          <LongImage
            src="/images/puf-panel/grey-studio-40mm-1200x675.webp"
            alt="Grey 40 mm PUF panel studio shot showing the facing and core layers"
            title="40 mm PUF panel, studio shot"
          />
        </section>

        <section id="thickness-size" className="space-y-3">
          <H2 id="thickness-size">Thickness and size selection</H2>
          <P>
            These panels are made from <span className="font-semibold text-foreground">30 mm to 200 mm</span>:
            30 / 40 / 50 / 60 / 80 / 100 / 120 / 150 / 200 mm, with freezer-grade produced up to 150 mm. Covered
            width is <span className="font-semibold text-foreground">1000 mm</span> (roof 1070 mm overall), and
            lengths run <span className="font-semibold text-foreground">2–15 m</span> standard.
          </P>
          <P>
            Thickness follows the job: thinner sheets for partitions and cabins, mid-range for sheds and better
            thermal control, and the thick end for cold rooms and freezers. Longer panels reduce joints but are
            transport- and site-dependent — a 15 m sheet needs road access and offloading space — so we confirm
            the workable length against your site. For the full thickness-and-size rate view, see{' '}
            <Link href="/product/puf-panel/puf-panel-price" className="font-semibold text-primary hover:underline">
              PUF sheet price by thickness and size
            </Link>
            .
          </P>
        </section>

        <section id="uses" className="space-y-3">
          <H2 id="uses">Wall, roof, cabin and cold-room uses</H2>
          <P>
            One panel, several jobs. As a <span className="font-semibold text-foreground">wall</span>, it is an
            insulated, finished partition or external wall in plain, baby-rib or micro-rib profile. As a{' '}
            <span className="font-semibold text-foreground">roof</span>, it is an insulated roof cover — for
            roof-specific span, slope and fixing depth, see our roofing page. As a{' '}
            <span className="font-semibold text-foreground">cabin</span> shell, it forms the walls and roof of
            porta cabins and site offices in one board. As a{' '}
            <span className="font-semibold text-foreground">cold room</span>, it is the thermal envelope,
            usually with a cam-lock joint so panels lock airtight.
          </P>
          <P>
            Because it serves all of these, this build is the base product across our range — explore{' '}
            <Link href="/product/puf-panel" className="font-semibold text-primary hover:underline">
              every PUF panel option we make
            </Link>{' '}
            to see how the wall, roof and cold-room versions differ.
          </P>
        </section>

        <section id="manufacturing" className="space-y-3">
          <H2 id="manufacturing">How SAMAN manufactures and checks PUF sandwich panels</H2>
          <P>
            The sandwich is made by feeding two facing coils through the line, injecting polyurethane between
            them, and letting the foam expand and cure so it bonds to both sheets as one continuous board — not
            a slab glued in afterwards. That injected bond is what makes the three layers behave as a single
            panel.
          </P>
          <P>
            On every batch we check facing gauge, panel thickness, foam rise and the tongue-and-groove profile
            so joints close cleanly and the panel sits flat. Panels are then edge-protected, stacked and
            bundled for dispatch from the nearer of our two factories.
          </P>
          <LongImage
            src="/images/puf-panel/sandwich-industrial-70mm-1200x675.webp"
            alt="Grey 70 mm PUF sandwich panel on an industrial floor display after quality checks"
            title="70 mm PUF sandwich panel, industrial floor display"
          />
        </section>

        <section id="faq" className="space-y-4">
          <H2 id="faq">Frequently asked questions</H2>
          <FaqAccordion items={FAQS} />
        </section>

        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
          <h3 className="mb-1 text-xl font-bold text-foreground">Get a PUF sandwich panel quotation</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Send your thickness, facing, area and site city.
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
      <P>The three-layer panel specification referenced throughout this page, tabulated for quick reference.</P>
      <SpecTable title="Panel Layer Specifications" rows={LAYER_ROWS} />
      <LongImage
        priority
        src="/images/puf-panel/diagrams/puf-panel-cross-section-diagram.webp"
        alt="Technical diagram of a PUF panel cross-section showing PPGI facings and the PUF core"
        title="PUF panel cross-section diagram"
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
      <TrustCard
        deliveryLine="Pan-India delivery; transport confirmed at quotation; 3–5 business day default dispatch — see our"
        returnsLine="7-day returns on standard products (3-day on custom) — see our"
      />
      <P>
        We dispatch from Bangalore for South India and Greater Noida for North India and Delhi NCR, and a{' '}
        <span className="font-semibold text-foreground">500 m² minimum billing</span> applies to
        long-distance dispatch.
      </P>
      <P>
        These panels fall under <span className="font-semibold text-foreground">HSN 940690</span> for GST
        and RFQ purposes. Quotes are supply-only unless stated otherwise. To see the complete range of
        builds,{' '}
        <Link href="/product/puf-panel" className="font-semibold text-primary hover:underline">
          explore every PUF panel option we make
        </Link>
        .
      </P>
      <LongImage
        src="/images/puf-panel/sandwich-product-shot-50mm-1200x675.webp"
        alt="Smoke-grey 50 mm PUF sandwich panel product shot"
        title="50 mm PUF sandwich panel, product shot"
      />
    </div>
  );
}

export default function PufSandwichPanel() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="PUF Sandwich Panel & PUF Sheet — Manufacturer | SAMAN"
        fallbackDescription="PUF sandwich panel by SAMAN — the three-layer insulated PUF sheet, also called puff panel or insulated sheet, for wall, roof and cold rooms. 30–200 mm, factory-made in Bangalore and Greater Noida."
        fallbackCanonical="https://www.samanportable.com/product/puf-panel/puf-sandwich-panel"
        keywords="puf sandwich panel, puf sheet, puf insulated sheets, puff panel"
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
            <span className="font-semibold text-foreground">PUF Sandwich Panel</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[PUF_CATALOG.hub, PUF_CATALOG.price, PUF_CATALOG.roofing]}
              />
            </div>

            <div className="order-2 lg:order-2 lg:col-span-5">
              <ProductCarousel images={GALLERY_IMAGES} />
              <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
                <p className="mb-2 text-sm font-bold text-foreground">Get a factory-direct sandwich panel quotation</p>
                <ProductZoneCtas variant="strip" />
              </div>
            </div>

            <div className="order-1 lg:order-3 lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <ProductInfoBox
                h1="PUF Sandwich Panel — PUF Sheets Manufactured for Wall, Roof and Cold Rooms"
                priceMain="From ₹1,050 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                shortDescription={SHORT_DESCRIPTION}
                application="Walls, roofs, cabins, cold rooms"
                sku="SP-C15-SND-2026"
                averageRating="0.00"
                ratingCount={0}
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="PUF Sandwich Panel"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={990004}
              reviewProductId={272760}
              productName="PUF Sandwich Panel"
            />
          </div>

          <div className="mt-8 space-y-8">
            <RelatedProductsRail items={[PUF_CATALOG.hub, PUF_CATALOG.price, PUF_CATALOG.roofing]} />
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
