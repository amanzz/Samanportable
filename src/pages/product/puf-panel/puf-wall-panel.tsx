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

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

const JUMP_ITEMS = [
  { id: 'thickness-sizes', label: 'Thickness and sizes' },
  { id: 'partition-applications', label: 'Partition panel applications' },
  { id: 'ceiling-false-ceiling', label: 'Ceiling and false-ceiling use' },
  { id: 'price-factors', label: 'Price and quote factors' },
  { id: 'faq', label: 'Frequently asked questions' },
];

const FAQS = [
  { question: 'What is a PUF wall panel?', answer: 'A PUF wall panel is an insulated sandwich panel, steel facing bonded to a rigid polyurethane foam core, built to serve as a wall, partition or ceiling panel. The same core panel range is used across all three applications; the difference is how the panel is fixed and finished on site.' },
  { question: 'Can a PUF panel be used as a partition wall?', answer: 'Yes. A PUF partition panel divides a space while carrying its own insulation and finish, so it goes up faster than a plastered stud wall and needs no drying time before the space is usable.' },
  { question: 'Do you supply PUF panels for ceilings and false ceilings?', answer: 'Yes. A PUF ceiling or false-ceiling panel uses the same panel range as the wall, closing the underside of a roof or upper floor with a finished, insulated board instead of a separate suspended-ceiling system.' },
  { question: 'What thickness of PUF wall panel do I need?', answer: '30–60 mm covers most wall and partition needs; thicker panels (80 mm and above) suit builds needing stronger heat control. 70 mm and 90 mm are made to order rather than standard stock. Tell us your requirement and we advise the correct thickness before quoting.' },
  { question: 'What wall profiles are available?', answer: 'Wall panels are made in plain, baby-rib and micro-rib profiles, from 30 mm to 200 mm thickness, in PPGI, PPGL, BGL, stainless steel, aluminium or craft paper facing.' },
  { question: 'Is a PUF wall panel load-bearing?', answer: 'No. It is a cladding-and-insulation panel, not a structural load-bearing wall in the conventional sense. It is fixed to a supporting frame or structure, which is confirmed against your drawing.' },
  { question: 'How is a PUF wall panel joined on site?', answer: 'Wall panels close with a tongue-and-groove side joint so panels lock together into one continuous, insulated surface.' },
  { question: 'Do you supply PUF panels for doors and openings?', answer: 'Door and window openings are framed into the wall panel layout to your drawing; the door leaf and frame hardware itself are scoped and confirmed at quotation.' },
];

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/puf-panel/puf-wall-panel#product',
  name: 'PUF Wall Panel',
  description: 'Factory-made PUF wall panels by SAMAN for walls, partitions and ceilings, 30–200 mm, plain/baby-rib/micro-rib profiles, PPGI/PPGL/BGL/stainless/aluminium/craft paper facings. Manufactured in Bangalore and Greater Noida.',
  category: 'Insulated Sandwich Panel',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Polyurethane foam core with steel facing sheets',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Thickness range', value: '30–200 mm (70/90/140 mm made to order)' },
    { '@type': 'PropertyValue', name: 'Wall profiles', value: 'Plain, baby ribs, micro ribs' },
    { '@type': 'PropertyValue', name: 'Facing options', value: 'PPGI, PPGL, BGL, Stainless Steel, Aluminium, Craft Paper: 0.35–0.80 mm' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: panelAggregateOffer(1050, 'https://www.samanportable.com/product/puf-panel/puf-wall-panel'),
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'PUF Panel', item: 'https://www.samanportable.com/product/puf-panel' },
    { '@type': 'ListItem', position: 4, name: 'PUF Wall Panel', item: 'https://www.samanportable.com/product/puf-panel/puf-wall-panel' },
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
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-bold text-foreground sm:text-xl">{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">{children}</p>
);

const SHORT_DESCRIPTION =
  'A PUF wall panel is an insulated sandwich panel built to stand as a wall, divide a space as a partition, or close a ceiling, all from the same panel range. SAMAN manufactures the full range at our own factories in Bangalore and Greater Noida.';

const GALLERY_IMAGES = [
  { src: '/images/puf-panel/wall/40mm-puf-wall-panel-stockyard.webp', alt: '40 mm PUF wall panel stock stored outdoors in the stockyard, standard general wall use thickness', title: '40 mm PUF wall panel, stockyard stock' },
  { src: '/images/puf-panel/wall/60mm-green-puf-wall-panel-yard-stack.webp', alt: 'Green 60 mm PUF wall panel stacked in the yard', title: '60 mm PUF wall panel, yard stack' },
  { src: '/images/puf-panel/wall/70mm-light-blue-puf-wall-panel-stockyard.webp', alt: 'Light-blue 70 mm PUF wall panel in stockyard storage, made-to-order thickness', title: '70 mm PUF wall panel, stockyard' },
  { src: '/images/puf-panel/wall/80mm-green-puf-wall-panel-yard-storage.webp', alt: 'Green 80 mm PUF wall panel in yard storage, used for internal partition applications', title: '80 mm PUF wall panel, yard storage' },
  { src: '/images/puf-panel/wall/50mm-green-puf-wall-panel-storage-yard.webp', alt: 'Green 50 mm PUF wall panel in storage yard, panel range also used for ceiling applications', title: '50 mm PUF wall panel, storage yard' },
];

function DescriptionContent() {
  return (
    <>
      <div className="space-y-10">
        <P>{SHORT_DESCRIPTION}</P>

        <JumpNav items={JUMP_ITEMS} />

        <section id="thickness-sizes" className="space-y-3">
          <H2 id="thickness-sizes">Wall panel thickness and sizes</H2>
          <P>
            Wall panels run the same core range we manufacture across our product line, in plain, baby-rib or
            micro-rib wall profiles.
          </P>

          <H3>30/40/50/60 mm: general wall use</H3>
          <P>
            The 30–60 mm range covers most wall applications: partitions, office cabin walls, shed and
            warehouse walls, and general enclosure panels. Thickness within this range is chosen on heat
            control and budget rather than structural load, since the panel is a cladding-and-insulation
            element, not a load-bearing wall in the conventional building sense.
          </P>
          <LongImage
            src="/images/puf-panel/wall/40mm-puf-wall-panel-stockyard.webp"
            alt="40 mm PUF wall panel stock stored outdoors in the stockyard, standard general wall use thickness"
            title="40 mm PUF wall panel, stockyard stock"
          />

          <H3>70/90 mm: made-to-order use</H3>
          <P>
            70 mm and 90 mm wall panels sit between our standard thickness steps and are made to order rather
            than held as stock, typically specified where a project needs heat control between the 60 mm and
            100 mm standard steps. These are manufactured on client request against advance payment, with
            price and lead time confirmed at quotation rather than quoted as a standard stock rate.
          </P>
          <LongImage
            src="/images/puf-panel/wall/70mm-light-blue-puf-wall-panel-stockyard.webp"
            alt="Light-blue 70 mm PUF wall panel in stockyard storage, made-to-order thickness"
            title="70 mm PUF wall panel, stockyard"
          />
        </section>

        <section id="partition-applications" className="space-y-3">
          <H2 id="partition-applications">Partition panel applications</H2>
          <P>
            As an internal partition, a PUF wall panel divides a space while carrying its own insulation and
            finish, useful anywhere you need to split a room, cabin or industrial floor without a wet-trade
            wall build. Common partition uses include office cabin divisions, cold-room-adjacent partitions,
            and internal walls inside prefab structures. Because the panel arrives finished, a partition wall
            goes up in a fraction of the time a plastered stud wall takes, with no drying time before the space
            is usable.
          </P>
          <LongImage
            src="/images/puf-panel/wall/80mm-green-puf-wall-panel-yard-storage.webp"
            alt="Green 80 mm PUF wall panel in yard storage, used for internal partition applications"
            title="80 mm PUF wall panel, yard storage"
          />
        </section>

        <section id="ceiling-false-ceiling" className="space-y-3">
          <H2 id="ceiling-false-ceiling">Ceiling and false-ceiling use</H2>
          <P>
            PUF panels are also supplied as a <span className="font-semibold text-foreground">ceiling and
            false-ceiling panel</span>, closing the underside of a roof or floor with the same insulated board
            used on the walls, rather than a separate suspended-ceiling system. A PUF ceiling panel gives a
            clean, finished underside and adds a further insulation layer where the roof panel alone doesn&apos;t
            fully control heat gain, which matters most in larger industrial spans and in rooms sitting
            directly under an uninsulated upper floor.
          </P>
          <P>
            Because it uses the same core panel range as the wall, a PUF false ceiling panel is specified in
            the same thickness and facing options as the wall itself, confirmed against your ceiling drawing
            and span.
          </P>
          <LongImage
            src="/images/puf-panel/wall/50mm-green-puf-wall-panel-storage-yard.webp"
            alt="Green 50 mm PUF wall panel in storage yard, panel range also used for ceiling applications"
            title="50 mm PUF wall panel, storage yard"
          />
        </section>

        <section id="price-factors" className="space-y-3">
          <H2 id="price-factors">Price and quote factors</H2>
          <P>
            A PUF wall panel rate moves with thickness, facing, profile, length and order size. The same
            drivers that set every panel rate in our range. For the base panel rate by thickness, see our{' '}
            <Link href="/product/puf-panel/puf-panel-specification" className="font-semibold text-primary hover:underline">
              detailed PUF panel specifications and sizes
            </Link>
            , and reach out with your wall or ceiling area, thickness and site city for a firm quotation.
          </P>
          <P>
            Panels fall under HSN 940690, and every quotation states facing, gauge and joint type in writing
            rather than a single blended rate. The same way every PUF panel quote from SAMAN is structured,
            across walls, roofing and cold storage.
          </P>
        </section>

        <section id="faq" className="space-y-4">
          <H2 id="faq">Frequently asked questions</H2>
          <FaqAccordion items={FAQS} />
        </section>

        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
          <h3 className="mb-1 text-xl font-bold text-foreground">Get your PUF wall panel quotation</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Send your wall, partition or ceiling area, thickness and site city for a firm quote.
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
      <table className="w-full border-collapse overflow-hidden rounded-xl border border-border text-sm">
        <tbody>
          {[
            ['Thickness (standard)', '30 / 40 / 50 / 60 / 80 / 100 / 120 / 150 / 200 mm'],
            ['Thickness (made to order)', '70 mm, 90 mm, 140 mm, advance payment; price and lead time confirmed at quotation'],
            ['Facing options', 'PPGI / PPGL / BGL / Stainless Steel / Aluminium / Craft Paper · 0.35–0.80 mm'],
            ['Profile', 'Plain · baby ribs · micro ribs'],
            ['Length', '2–15 m standard; custom lengths transport/site dependent'],
            ['Joint system', 'Tongue & groove'],
            ['HSN code', '940690'],
          ].map((row, i) => (
            <tr key={row[0]} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/40'}>
              <td className="w-2/5 px-5 py-3 text-sm font-semibold text-foreground">{row[0]}</td>
              <td className="px-5 py-3 text-sm text-muted-foreground">{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <P>
        Full dimensional reference across our range sits in our{' '}
        <Link href="/product/puf-panel/puf-panel-specification" className="font-semibold text-primary hover:underline">
          PUF panel specification
        </Link>{' '}
        page.
      </P>
      <LongImage
        priority
        src="/images/puf-panel/diagrams/p1-partition-fixing-diagram.webp"
        alt="PUF wall panel installation diagram showing panel fixing into floor and top U-channels"
        title="PUF partition panel installation schematic"
      />
      <LongImage
        src="/images/puf-panel/diagrams/p1-thickness-lineup-diagram.webp"
        alt="PUF panel standard thickness comparison diagram from 30 mm to 200 mm with 70 mm and 90 mm made to order"
        title="Standard PUF panel thickness range 30–200 mm"
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

export default function PufWallPanel() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="PUF Wall Panel, Partition & Ceiling Panels | SAMAN"
        fallbackDescription="PUF wall panel from SAMAN: insulated wall, partition and ceiling panels, 30–200 mm, factory-made in Bangalore and Greater Noida. Get a factory-direct quote."
        fallbackCanonical="https://www.samanportable.com/product/puf-panel/puf-wall-panel"
        keywords="puf wall panel, wall puf panel, puf panel wall, puf panel for wall, puf partition panel"
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
            <span className="font-semibold text-foreground">PUF Wall Panel</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[PUF_CATALOG.hub, PUF_CATALOG.house, PUF_CATALOG.specification]}
              />
            </div>

            <div className="order-2 lg:order-2 lg:col-span-5">
              <ProductCarousel images={GALLERY_IMAGES} />
              <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
                <p className="mb-2 text-sm font-bold text-foreground">Get a factory-direct wall panel quotation</p>
                <ProductZoneCtas variant="strip" />
              </div>
            </div>

            <div className="order-1 lg:order-3 lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <ProductInfoBox
                h1="PUF Wall Panel for Walls, Partitions and Ceilings"
                priceMain="From ₹1,050 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                shortDescription={SHORT_DESCRIPTION}
                application="Walls, partitions, ceilings, false ceilings"
                sku="SP-C15-WAL-2026"
                averageRating="0.00"
                ratingCount={0}
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="PUF Wall Panel"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={990006}
              reviewProductId={272762}
              productName="PUF Wall Panel"
            />
          </div>

          <div className="mt-8 space-y-8">
            <RelatedProductsRail items={[PUF_CATALOG.hub, PUF_CATALOG.house, PUF_CATALOG.specification]} />
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
