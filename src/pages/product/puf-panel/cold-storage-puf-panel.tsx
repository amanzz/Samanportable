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
  { id: 'thickness-by-use', label: 'Recommended thickness by use case' },
  { id: 'specifications', label: 'Wall, ceiling & floor specifications' },
  { id: 'price-factors', label: 'Price and quote factors' },
  { id: 'installation-condensation', label: 'Installation & condensation' },
  { id: 'faq', label: 'Frequently asked questions' },
];

const FAQS = [
  { question: 'What is a cold storage PUF panel?', answer: 'A cold storage PUF panel is an insulated sandwich panel, steel facing bonded to a rigid polyurethane foam core, built thick enough to hold a temperature difference between a cold room or freezer and the outside air. SAMAN manufactures cold storage grade panels including freezer-grade panels up to 150 mm.' },
  { question: 'What thickness do I need for a cold room?', answer: 'As general guidance, chiller and standard cold-storage rooms commonly use 80–100 mm; freezer rooms commonly use 120–150 mm. This is a starting reference only. The correct thickness for your project is set from a heat-load calculation at quotation.' },
  { question: 'What is the difference between a chiller room panel and a freezer room panel?', answer: 'A chiller room holds produce above freezing and typically uses a thinner panel (80–100 mm guidance); a freezer room holds product below freezing and needs a larger temperature gap, typically using a thicker panel (120–150 mm guidance). Both figures are confirmed against your actual heat load.' },
  { question: 'Do you manufacture freezer-grade PUF panels?', answer: 'Yes. We manufacture freezer-grade panels up to 150 mm at our own factories in Bangalore and Greater Noida.' },
  { question: 'How is condensation prevented in a cold storage PUF panel room?', answer: 'Vapour sealing at panel joints, floor/ceiling junctions and door openings is what prevents condensation in a cold room. These are confirmed against your installation drawing rather than treated as a fixed standard detail, since the risk depends on your specific room geometry and access points.' },
  { question: 'What joint system do cold storage panels use?', answer: 'Panels are supplied with tongue-and-groove or cam-lock joining, selected per project at quotation.' },
  { question: 'Do you supply floor panels for freezer rooms?', answer: 'Yes. SAMAN also manufactures insulated floor panels for freezer rooms, alongside the wall and ceiling range. Specification and pricing are confirmed at quotation against your room layout.' },
  { question: 'What is the price of a cold storage PUF panel?', answer: 'There is no single published cold room price, because the rate depends on thickness, room size and finish. Base panel rates by thickness are on our pricing page; a full room quotation is confirmed once we have your dimensions and target temperature.' },
  { question: 'Do you supply cold storage panels pan-India?', answer: 'Yes. We dispatch from Bangalore for South India and Greater Noida for North India and Delhi NCR, with transport confirmed at quotation.' },
];

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/puf-panel/cold-storage-puf-panel#product',
  name: 'Cold Storage PUF Panel',
  description: 'Factory-made cold storage PUF panels by SAMAN for cold rooms and freezer rooms, freezer-grade manufacture up to 150 mm. Manufactured in Bangalore and Greater Noida.',
  category: 'Insulated Sandwich Panel',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Polyurethane foam core with steel facing sheets',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Cold storage thickness', value: '80/100/120/150 mm typical; freezer-grade up to 150 mm' },
    { '@type': 'PropertyValue', name: 'Facing options', value: 'PPGI, PPGL, BGL, Stainless Steel, Aluminium, Craft Paper: 0.35–0.80 mm' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: panelAggregateOffer(1050, 'https://www.samanportable.com/product/puf-panel/cold-storage-puf-panel'),
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'PUF Panel', item: 'https://www.samanportable.com/product/puf-panel' },
    { '@type': 'ListItem', position: 4, name: 'Cold Storage PUF Panel', item: 'https://www.samanportable.com/product/puf-panel/cold-storage-puf-panel' },
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
  'A cold storage PUF panel is an insulated sandwich panel built to hold a temperature difference between a cold room or freezer and the outside air. SAMAN manufactures cold storage grade panels, including freezer-grade up to 150 mm, at our own factories.';

const GALLERY_IMAGES = [
  { src: '/images/puf-panel/cold-storage/100mm-dairy-cold-storage-room-interior.webp', alt: '100 mm cold storage PUF panel room interior, dairy cold-storage application', title: 'Cold storage PUF panel, 100 mm dairy room interior' },
  { src: '/images/puf-panel/cold-storage/150mm-deep-freezer-cold-storage-room.webp', alt: '150 mm deep-freezer cold storage PUF panel room', title: 'Cold storage PUF panel, 150 mm deep-freezer room' },
  { src: '/images/puf-panel/cold-storage/150mm-stainless-steel-facing-sample.webp', alt: '150 mm PUF panel with brushed stainless-steel facing, hygiene-grade cold storage sample', title: 'Cold storage PUF panel, 150 mm stainless-steel facing sample' },
  { src: '/images/puf-panel/cold-storage/90mm-cold-storage-corner-joint.webp', alt: '90 mm cold storage PUF panel corner joint, vegetable cold room', title: 'Cold storage PUF panel, 90 mm corner joint' },
  { src: '/images/puf-panel/cold-storage/100mm-cold-room-floor-channel-fixing.webp', alt: '100 mm cold room PUF panel floor channel fixing detail', title: 'Cold storage PUF panel, floor channel fixing' },
];

function DescriptionContent() {
  return (
    <>
      <div className="space-y-10">
        <P>{SHORT_DESCRIPTION}</P>

        <JumpNav items={JUMP_ITEMS} />

        <section id="thickness-by-use" className="space-y-4">
          <H2 id="thickness-by-use">Recommended thickness by use case</H2>
          <P>
            Cold storage thickness is not a fixed number. It follows the temperature you need to hold, the
            room size and the local climate, and the final figure is properly set from a heat-load calculation
            at quotation rather than picked off a generic chart. As general industry guidance to start the
            conversation:
          </P>

          <H3>Chiller rooms</H3>
          <P>
            Chiller and general cold-storage rooms, holding produce, dairy or general perishables above
            freezing, commonly use panels in the <span className="font-semibold text-foreground">80–100
            mm</span> range as a starting reference. This is guidance, not a fixed SAMAN specification; your
            actual room size, door frequency and ambient climate all move the correct thickness, confirmed at
            quotation.
          </P>
          <LongImage
            src="/images/puf-panel/cold-storage/100mm-dairy-cold-storage-room-interior.webp"
            alt="100 mm cold storage PUF panel room interior, dairy cold-storage application"
            title="Cold storage PUF panel, 100 mm dairy room interior"
          />

          <H3>Freezer rooms</H3>
          <P>
            Freezer and deep-freeze rooms, holding product below freezing, commonly use panels in the{' '}
            <span className="font-semibold text-foreground">120–150 mm</span> range as general guidance, since
            a larger temperature gap needs more core depth to hold efficiently. SAMAN manufactures freezer-grade
            panels up to 150 mm; the exact thickness for your freezer room is still set from your heat-load
            calculation, not from this guidance alone.
          </P>
          <LongImage
            src="/images/puf-panel/cold-storage/150mm-deep-freezer-cold-storage-room.webp"
            alt="150 mm deep-freezer cold storage PUF panel room"
            title="Cold storage PUF panel, 150 mm deep-freezer room"
          />
          <LongImage
            src="/images/puf-panel/cold-storage/150mm-stainless-steel-facing-sample.webp"
            alt="150 mm PUF panel with brushed stainless-steel facing, hygiene-grade cold storage sample"
            title="Cold storage PUF panel, 150 mm stainless-steel facing sample"
          />
        </section>

        <section id="specifications" className="space-y-3">
          <H2 id="specifications">Wall, ceiling and floor panel specifications</H2>
          <P>
            Cold storage panels use the same PUF core and facing range as the rest of our line, scaled to the
            thicker end for cold-chain use. Panels are supplied with tongue-and-groove or cam-lock joining,
            selected per project at quotation. SAMAN also manufactures insulated floor panels for freezer
            rooms, alongside the wall and ceiling range: specification and pricing confirmed at quotation
            against your room layout.
          </P>
          <P>
            For the full dimensional reference across our range, see our{' '}
            <Link href="/product/puf-panel/puf-panel-specification" className="font-semibold text-primary hover:underline">
              thickness, density and size specification details
            </Link>
            .
          </P>
          <LongImage
            src="/images/puf-panel/cold-storage/90mm-cold-storage-corner-joint.webp"
            alt="90 mm cold storage PUF panel corner joint, vegetable cold room"
            title="Cold storage PUF panel, 90 mm corner joint"
          />
        </section>

        <section id="price-factors" className="space-y-3">
          <H2 id="price-factors">Price and quote factors</H2>
          <P>
            A cold storage PUF panel rate moves with thickness, facing, room size and finish, the same drivers
            behind every panel rate in our range: there is no single published &ldquo;cold room price&rdquo;
            we can quote without your specification, because a genuine cold-chain quote depends on the
            heat-load calculation, not a headline rate. Base panel rates by thickness sit on our{' '}
            <Link href="/product/puf-panel/puf-panel-price" className="font-semibold text-primary hover:underline">
              pricing page
            </Link>
            ; a full cold room or freezer room figure is confirmed once we have your room size, target
            temperature and door/access requirement.
          </P>
          <P>
            Send your room dimensions, target temperature and site city, and we return a firm quotation rather
            than a generic per-square-foot estimate.
          </P>
        </section>

        <section id="installation-condensation" className="space-y-3">
          <H2 id="installation-condensation">Installation and condensation considerations</H2>
          <P>
            A cold storage panel room is only as effective as its sealing. A few qualitative points worth
            knowing before you order:
          </P>
          <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <li><span className="font-semibold text-foreground">Vapour sealing at joints</span> matters more in a cold room than in a standard wall or roof, because the temperature difference across the panel drives condensation risk if joints and penetrations aren&apos;t properly sealed.</li>
            <li><span className="font-semibold text-foreground">Floor and ceiling junctions</span> need particular attention, since these are common points where cold-side moisture finds a path if not detailed correctly.</li>
            <li><span className="font-semibold text-foreground">Door and access openings</span> are a frequent condensation point: the framing and seal around a cold-room door is confirmed against your drawing rather than treated as a standard detail.</li>
          </ul>
          <P>
            These are qualitative cautions, not a substitute for a proper installation drawing. We confirm the
            sealing and fixing detail for your specific room at quotation.
          </P>
          <LongImage
            src="/images/puf-panel/cold-storage/100mm-cold-room-floor-channel-fixing.webp"
            alt="100 mm cold room PUF panel floor channel fixing detail"
            title="Cold storage PUF panel, floor channel fixing"
          />
        </section>

        <section id="faq" className="space-y-4">
          <H2 id="faq">Frequently asked questions</H2>
          <FaqAccordion items={FAQS} />
        </section>

        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
          <h3 className="mb-1 text-xl font-bold text-foreground">Get your cold storage PUF panel quotation</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Send your room size, target temperature and site city for a firm quote.
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
            ['Thickness', '80/100/120/150 mm typical for cold storage; freezer-grade manufactured up to 150 mm'],
            ['Facing options', 'PPGI / PPGL / BGL / Stainless Steel / Aluminium / Craft Paper · 0.35–0.80 mm'],
            ['Wall profile', 'Plain, baby-rib or micro-rib'],
            ['Joint system', 'Tongue-and-groove or cam-lock, selected per project'],
            ['Floor panels', 'Manufactured for freezer rooms; specification and pricing confirmed at quotation'],
            ['Length', '2–15 m standard; transport/site dependent'],
            ['HSN code', '940690'],
          ].map((row, i) => (
            <tr key={row[0]} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/40'}>
              <td className="w-2/5 px-5 py-3 text-sm font-semibold text-foreground">{row[0]}</td>
              <td className="px-5 py-3 text-sm text-muted-foreground">{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <LongImage
        priority
        src="/images/puf-panel/diagrams/p1-cold-room-assembly-diagram.webp"
        alt="Cold room PUF panel assembly diagram showing wall panels, ceiling panel and joints for freezer rooms up to 150 mm"
        title="Cold room panel assembly schematic"
      />
      <LongImage
        src="/images/puf-panel/diagrams/p1-tg-joint-diagram.webp"
        alt="Tongue and groove joint detail diagram of two PUF panels interlocking to minimise thermal bridging"
        title="PUF panel tongue-and-groove joining detail"
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

export default function ColdStoragePufPanel() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="Cold Storage PUF Panel, Cold Room & Freezer Panels | SAMAN"
        fallbackDescription="Cold storage PUF panel from SAMAN: insulated cold room and freezer room panels, freezer-grade up to 150 mm, factory-made in Bangalore and Greater Noida. Get a quote."
        fallbackCanonical="https://www.samanportable.com/product/puf-panel/cold-storage-puf-panel"
        keywords="cold storage puf panel, puf panel for cold storage, cold room puf panel, freezer room panel, cold room panel"
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
            <span className="font-semibold text-foreground">Cold Storage PUF Panel</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[PUF_CATALOG.hub, PUF_CATALOG.specification, PUF_CATALOG.wall]}
              />
            </div>

            <div className="order-2 lg:order-2 lg:col-span-5">
              <ProductCarousel images={GALLERY_IMAGES} />
              <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
                <p className="mb-2 text-sm font-bold text-foreground">Get a factory-direct cold storage panel quotation</p>
                <ProductZoneCtas variant="strip" />
              </div>
            </div>

            <div className="order-1 lg:order-3 lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <ProductInfoBox
                h1="Cold Storage PUF Panel for Cold Rooms and Freezer Rooms"
                priceMain="From ₹1,050 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                shortDescription={SHORT_DESCRIPTION}
                application="Cold rooms, freezer rooms, cold-chain storage"
                sku="SP-C15-CLD-2026"
                averageRating="0.00"
                ratingCount={0}
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="Cold Storage PUF Panel"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={990008}
              reviewProductId={272764}
              productName="Cold Storage PUF Panel"
            />
          </div>

          <div className="mt-8 space-y-8">
            <RelatedProductsRail items={[PUF_CATALOG.hub, PUF_CATALOG.specification, PUF_CATALOG.wall]} />
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
