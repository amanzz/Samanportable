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

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

const JUMP_ITEMS = [
  { id: 'includes', label: 'What a house includes' },
  { id: 'price-in-india', label: 'PUF panel house price in India' },
  { id: 'design-options', label: 'Design options' },
  { id: 'residential-vs-site', label: 'Residential vs site accommodation' },
  { id: 'photos-proof', label: 'Photos, thickness & factory proof' },
  { id: 'faq', label: 'Frequently asked questions' },
];

const FAQS = [
  { question: 'What is a PUF panel house?', answer: 'A PUF panel house is a residential structure built with insulated PUF sandwich panels — steel facing bonded to a rigid polyurethane foam core — for the walls and roof, instead of brick-and-mortar construction or bare metal sheet. The panel gives structure, insulation and a finished surface in one board, which is why it erects faster than conventional construction.' },
  { question: 'How much does a PUF panel house cost?', answer: 'There is no single published PUF panel house price, because the cost depends on built-up area, panel thickness, frame type and finish level. We quote the base panel rate by thickness on our pricing page, and a full house figure — including frame, openings and finish — is confirmed against your drawing.' },
  { question: 'What thickness is used for a PUF panel house?', answer: 'Most residential house shells use 30–80 mm panels, chosen against your climate and budget. Thicker panels (100 mm and above) suit extreme-climate builds and are confirmed at quotation. 70 mm, 90 mm and 140 mm are made to order on request, not standard stock.' },
  { question: 'Can I customize the design of a PUF panel house?', answer: 'Yes. Room layout, built-up area, roof profile, verandah or entry treatment and facing finish are all set from your drawing rather than a fixed template, because every house we supply is built to order.' },
  { question: 'Is a PUF panel house suitable for permanent residential use?', answer: 'Yes — PUF panel houses are supplied for permanent and weekend residential use as well as project-site accommodation. The specification and finish level differ between the two, so tell us which you need before we quote.' },
  { question: 'How is a PUF panel house different from a site accommodation cabin?', answer: 'Both use the same panel technology, but a residential house is specified for long-term living with more attention to layout and finish, while a site-accommodation cabin is specified for project-duration use with simpler fit-out and faster relocation.' },
  { question: 'Do you supply PUF panel houses across India?', answer: 'Yes — we dispatch from Bangalore for South India and Greater Noida for North India and Delhi NCR, with transport confirmed at quotation.' },
  { question: 'What is included in a PUF panel house quotation?', answer: 'A firm quotation covers the panel shell — thickness, facing, roof profile and openings — priced to your drawing. Foundation, structural frame (where not panel-self-supporting), electrical, plumbing and interior fit-out are scoped and quoted alongside the shell, not hidden inside one blended rate.' },
];

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/puf-panel/puf-panel-house#product',
  name: 'PUF Panel House',
  description: 'Factory-made PUF panel house shell by SAMAN — insulated wall and roof panels for residential and site-accommodation use, built to your drawing. Manufactured in Bangalore and Greater Noida.',
  category: 'Insulated Sandwich Panel',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  material: 'Polyurethane foam core with steel facing sheets',
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Thickness range', value: '30–200 mm (70/90/140 mm made to order)' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '1050',
    url: 'https://www.samanportable.com/product/puf-panel/puf-panel-house',
  },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.samanportable.com/' },
    { '@type': 'ListItem', position: 2, name: 'Product', item: 'https://www.samanportable.com/product' },
    { '@type': 'ListItem', position: 3, name: 'PUF Panel', item: 'https://www.samanportable.com/product/puf-panel' },
    { '@type': 'ListItem', position: 4, name: 'PUF Panel House', item: 'https://www.samanportable.com/product/puf-panel/puf-panel-house' },
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
  'A PUF panel house is a residential structure built with insulated PUF sandwich panels for the walls and roof, in place of brick-and-mortar or bare metal sheet. SAMAN manufactures the shell — wall and roof panels, built to your drawing — at our own factories in Bangalore and Greater Noida.';

const GALLERY_IMAGES = [
  { src: '/images/puf-panel/house/puf-panel-house-installation-wall-roof.webp', alt: 'PUF panel house wall and roof panels being installed on site over a prepared frame', title: 'PUF panel house, wall and roof panel installation' },
  { src: '/images/puf-panel/house/puf-panel-house-sample-finished-home.webp', alt: 'PUF panel sample alongside a finished PUF panel house, showing panel-to-build correspondence', title: 'PUF panel house, sample and finished home' },
  { src: '/images/puf-panel/house/puf-panel-house-verandah-front-view.webp', alt: 'PUF panel house with a covered verandah entry, front elevation view', title: 'PUF panel house, verandah front view' },
  { src: '/images/puf-panel/house/puf-panel-house-mountain-cabin-style.webp', alt: 'PUF panel house built in a mountain cabin design style', title: 'PUF panel house, cabin-style design' },
  { src: '/images/puf-panel/house/puf-panel-house-construction-site.webp', alt: 'PUF panel house under construction at a residential site, panels being fixed to the frame', title: 'PUF panel house, residential construction site' },
];

function DescriptionContent() {
  return (
    <>
      <div className="space-y-10">
        <P>{SHORT_DESCRIPTION}</P>

        <JumpNav items={JUMP_ITEMS} />

        <section id="includes" className="space-y-3">
          <H2 id="includes">What a PUF panel house includes (and what is quoted separately)</H2>
          <P>
            SAMAN supplies the insulated panel shell — wall and roof panels in the thickness and facing your
            drawing calls for, with door and window openings framed to size. That shell is the part we
            manufacture and control end to end.
          </P>
          <P>
            What sits outside the panel shell is quoted separately or arranged with your contractor, because it
            depends on your site and drawing rather than the panel itself:
          </P>
          <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <li><span className="font-semibold text-foreground">Foundation and plinth</span> — a level base or plinth is prepared before panel erection begins.</li>
            <li><span className="font-semibold text-foreground">Structural frame</span> — many house layouts use a light steel or panel-self-supporting frame; larger or multi-storey layouts may need a full structural frame, confirmed against your drawing.</li>
            <li><span className="font-semibold text-foreground">Electrical, plumbing and interior fit-out</span> — wiring, fittings, flooring and interior finish are scoped to your requirement and quoted alongside the panel shell, not folded into a single blended number.</li>
          </ul>
          <P>
            Keeping these scopes distinct is deliberate. A single &ldquo;per sq ft&rdquo; house figure that
            hides the frame, electrical and finish inside the panel rate is the most common way a house quote
            goes wrong once the site work actually starts.
          </P>
          <LongImage
            src="/images/puf-panel/house/puf-panel-house-installation-wall-roof.webp"
            alt="PUF panel house wall and roof panels being installed on site over a prepared frame"
            title="PUF panel house, wall and roof panel installation"
          />
        </section>

        <section id="price-in-india" className="space-y-3">
          <H2 id="price-in-india">PUF panel house price in India</H2>
          <P>
            There is no single PUF panel house price, because the cost follows the specification — the same
            way it does for any of our panel products. What moves the number for a house specifically:
          </P>

          <H3>Cost factors by size, thickness, frame and finish</H3>
          <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <li><span className="font-semibold text-foreground">Built-up area</span> — a larger footprint means more panel area, more openings and more finishing work.</li>
            <li><span className="font-semibold text-foreground">Panel thickness</span> — thicker panels (60–80 mm and above) hold heat better for extreme climates but cost more per square metre than the 30–50 mm range that suits most moderate-climate homes.</li>
            <li><span className="font-semibold text-foreground">Frame type</span> — a panel-self-supporting light frame costs less than a full structural steel or RCC frame sized for a larger or multi-storey house.</li>
            <li><span className="font-semibold text-foreground">Finish level</span> — facing colour, interior lining, flooring and electrical fit-out each add to the final figure; a basic shell finishes lower than a fully fitted-out home.</li>
          </ul>
          <P>
            You may see house rates quoted online in a single per-square-foot figure. Treat that as a starting
            reference only, not a firm number — it rarely states the panel thickness, frame type or what
            finish is included, and two &ldquo;PUF houses&rdquo; at the same headline rate are often different
            specifications. Our own{' '}
            <Link href="/product/puf-panel/puf-panel-price" className="font-semibold text-primary hover:underline">
              per-square-metre PUF panel pricing by thickness
            </Link>{' '}
            shows the base panel rate alone; a full house figure needs your drawing, because frame, openings
            and finish are not part of that base rate.
          </P>
          <LongImage
            src="/images/puf-panel/house/puf-panel-house-sample-finished-home.webp"
            alt="PUF panel sample alongside a finished PUF panel house, showing panel-to-build correspondence"
            title="PUF panel house, sample and finished home"
          />
        </section>

        <section id="design-options" className="space-y-3">
          <H2 id="design-options">PUF panel house design options</H2>
          <P>
            Because every house is built to your drawing rather than pulled from a fixed template, the design
            follows what the site and budget call for:
          </P>
          <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <li><span className="font-semibold text-foreground">Compact single-floor layouts</span> — a straightforward footprint for a small family home or weekend house.</li>
            <li><span className="font-semibold text-foreground">Multi-room layouts</span> — separate bedroom, living and kitchen spaces within one panel shell.</li>
            <li><span className="font-semibold text-foreground">Verandah and entry treatments</span> — a covered entry or verandah panel extension in front of the main shell.</li>
            <li><span className="font-semibold text-foreground">Roof profile</span> — trapezoidal or ribbed roof panels over the same wall panel range, matching the profile options we manufacture across the rest of our panel line.</li>
            <li><span className="font-semibold text-foreground">Facing finish</span> — standard facing shades, confirmed at quotation against your drawing.</li>
          </ul>
        </section>

        <section id="residential-vs-site" className="space-y-3">
          <H2 id="residential-vs-site">Residential vs site accommodation use</H2>
          <P>
            A PUF panel house and a site-accommodation cabin use the same underlying panel technology, but the
            intent behind each is different. A <span className="font-semibold text-foreground">residential PUF
            panel house</span> is built for longer-term or permanent living — a family home, farmhouse or
            weekend home — where design, room layout, interior finish and facing choice matter as much as the
            shell itself. A <span className="font-semibold text-foreground">site-accommodation unit</span> is
            built for the duration of a project — a labour or staff cabin where load-bearing simplicity, fast
            erection and relocation matter more than interior design.
          </P>
          <P>
            If your requirement is a residential structure, tell us the room layout, built-up area and the
            finish level you expect, and we quote the house shell accordingly. If the requirement is closer to
            project-site staff housing, say so up front — the specification and the way we quote it differ
            from a residential house.
          </P>
        </section>

        <section id="photos-proof" className="space-y-4">
          <H2 id="photos-proof">Photos, thickness and factory supply proof</H2>
          <P>
            Every PUF panel house shell we quote is built from the same panel range we manufacture for our
            full product line — 30–200 mm standard, with 70 mm, 90 mm and 140 mm made to order on client
            request (advance payment; price and lead time confirmed at quotation). We do not source panels
            from a marketplace and rebrand them; every panel is made on our own lines in Bangalore and Greater
            Noida, and we have supplied panels for residential house projects as well as for leading developers
            and EPC contractors across our project history.
          </P>
          <P>
            Because the shell is manufactured, not assembled from mixed stock, the facing gauge, core and joint
            quality stay consistent across the whole house — walls and roof included. For the complete list of
            panels we manufacture beyond the house shell — roofing, wall and cold-storage grades — see our{' '}
            <Link href="/product/puf-panel" className="font-semibold text-primary hover:underline">
              full range of PUF panels we manufacture
            </Link>
            .
          </P>
          <LongImage
            src="/images/puf-panel/house/puf-panel-house-construction-site.webp"
            alt="PUF panel house under construction at a residential site, panels being fixed to the frame"
            title="PUF panel house, residential construction site"
          />
        </section>

        <section id="faq" className="space-y-4">
          <H2 id="faq">Frequently asked questions</H2>
          <FaqAccordion items={FAQS} />
        </section>

        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
          <h3 className="mb-1 text-xl font-bold text-foreground">Get your PUF panel house quotation</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Send your built-up area, room layout and site city for a firm quote.
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
            ['Thickness (made to order)', '70 mm, 90 mm, 140 mm — advance payment; price and lead time confirmed at quotation'],
            ['Roof profile', 'Trapezoidal · ribbed'],
            ['Joint system', 'Tongue & groove'],
            ['Length', '2–15 m standard; custom lengths transport/site dependent'],
            ['Warranty', 'PUF panel warranty 5–10 years, confirmed at quotation'],
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
        Full dimensional reference across our range, including density/weight guidance, sits in our{' '}
        <Link href="/product/puf-panel/puf-panel-specification" className="font-semibold text-primary hover:underline">
          PUF panel specification
        </Link>{' '}
        page.
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
        title="PUF panel construction — three-layer cross-section"
      />
    </div>
  );
}

function ShippingContent() {
  return (
    <div className="space-y-4">
      <P>
        We dispatch from Bangalore for South India and Greater Noida for North India and Delhi NCR, so most
        house projects are served from the nearer line. Pan-India delivery; transport confirmed at quotation;
        3–5 business day default dispatch — see our{' '}
        <Link href="/delivery-policy" className="font-semibold text-primary hover:underline">
          Delivery Policy
        </Link>
        .
      </P>
      <P>
        Standard products carry 7-day returns (3-day on custom) — see our{' '}
        <Link href="/refund-and-return-policy" className="font-semibold text-primary hover:underline">
          Refund &amp; Return Policy
        </Link>
        .
      </P>
    </div>
  );
}

export default function PufPanelHouse() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="PUF Panel House — Price, Design & Residential Use | SAMAN"
        fallbackDescription="PUF panel house from SAMAN — factory-made insulated panel homes for residential and site use. Design options, real project photos and cost factors. Get a firm quote."
        fallbackCanonical="https://www.samanportable.com/product/puf-panel/puf-panel-house"
        keywords="puf panel house, puf panel house price, puf panel house price in india, puf panel house design"
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
            <span className="font-semibold text-foreground">PUF Panel House</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[PUF_CATALOG.hub, PUF_CATALOG.wall, PUF_CATALOG.specification]}
              />
            </div>

            <div className="order-2 lg:order-2 lg:col-span-5">
              <ProductCarousel images={GALLERY_IMAGES} />
              <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
                <p className="mb-2 text-sm font-bold text-foreground">Get a factory-direct house shell quotation</p>
                <ProductZoneCtas variant="strip" />
              </div>
            </div>

            <div className="order-1 lg:order-3 lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <ProductInfoBox
                h1="PUF Panel House — Price, Design and Residential Use in India"
                priceMain="From ₹1,050 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                shortDescription={SHORT_DESCRIPTION}
                application="Residential homes, weekend homes, site accommodation"
                sku="SP-C15-HSE-2026"
                averageRating="0.00"
                ratingCount={0}
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="PUF Panel House"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={990005}
              reviewProductId={272761}
              productName="PUF Panel House"
            />
          </div>

          <div className="mt-8 space-y-8">
            <RelatedProductsRail items={[PUF_CATALOG.hub, PUF_CATALOG.wall, PUF_CATALOG.specification]} />
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
