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
import PriceTableUI, { type PriceRow } from '@/components/product-puf/PriceTableUI';
import SpecTable from '@/components/product-puf/SpecTable';
import ComparisonBox from '@/components/product-puf/ComparisonBox';
import ProductInfoBox from '@/components/product-puf/ProductInfoBox';
import ProductDetailTabs from '@/components/product-puf/ProductDetailTabs';
import RelatedProductsRail, { PUF_CATALOG } from '@/components/product-puf/RelatedProductsRail';
import ProductCarousel from '@/components/product-puf/ProductCarousel';
import { LongImage } from '@/components/product-puf/Gallery';

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

const JUMP_ITEMS = [
  { id: 'price-by-thickness', label: 'Price by thickness' },
  { id: 'rate-factors', label: 'What changes the rate' },
  { id: 'sheet-vs-panel', label: 'Sheet price vs panel quotation' },
  { id: 'compare-quotes', label: 'How to compare quotes' },
  { id: 'included-excluded', label: "What's included & excluded" },
  { id: 'request-quotation', label: 'Request a quotation' },
  { id: 'faq', label: 'Frequently asked questions' },
];

const PRICE_ROWS: PriceRow[] = [
  { thickness: '30 mm', ratePerM2: '₹1,050', ratePerSqFt: '₹98', use: 'Budget walls and partitions' },
  { thickness: '40 mm', ratePerM2: '₹1,150', ratePerSqFt: '₹107', use: 'Cabin walls and roofs' },
  { thickness: '50 mm', ratePerM2: '₹1,250', ratePerSqFt: '₹116', use: 'Most common all-round choice' },
  { thickness: '60 mm', ratePerM2: '₹1,330', ratePerSqFt: '₹124', use: 'Better thermal comfort' },
  { thickness: '80 mm', ratePerM2: '₹1,470', ratePerSqFt: '₹137', use: 'Cold rooms and premium roofs' },
  { thickness: '100 / 120 / 150 / 200 mm & freezer-grade', ratePerM2: 'Confirm at quotation', ratePerSqFt: '—', use: 'Cold storage, freezers and specialised high-insulation builds', isQuoteOnly: true },
];

const SPEC_ROWS = [
  { label: 'Core density', value: '40 ± 2 kg/m³' },
  { label: 'Facing gauge', value: '0.35–0.80 mm' },
  { label: 'Facing options', value: 'PPGI · PPGL · BGL · Stainless Steel · Aluminium' },
  { label: 'Joint type', value: 'Tongue & groove (wall/roof); cam-lock (cold room)' },
  { label: 'HSN code', value: '940690' },
  { label: 'Warranty', value: 'PUF panel warranty 5–10 years, confirmed at quotation' },
];

const RATE_LEVERS: { title: string; body: string }[] = [
  { title: 'Thickness', body: 'the biggest single lever. Every step up in core depth adds material cost roughly in line with the per-10 mm rule below, so a 60 mm panel is never priced like a 30 mm panel even from the same supplier.' },
  { title: 'Facing material', body: 'PPGI is the value option; PPGL, BGL, aluminium and stainless steel rise from there, roughly in that order, because the raw coil and corrosion resistance differ.' },
  { title: 'Facing gauge', body: '0.35 mm to 0.80 mm; a thicker facing sheet costs more per panel and adds rigidity, independent of the core.' },
  { title: 'Core density', body: 'our PUF core is 40 ± 2 kg/m³; a tighter density spec for a specific project affects the rate and is confirmed at quotation.' },
  { title: 'Colour / finish', body: 'standard RAL shades cost less than a special or custom-matched shade, since standard colours run in larger coil batches.' },
  { title: 'Profile', body: 'a plain wall profile is the base cost; ribbed roof or wall profiles add a small premium for the extra roll-forming step.' },
  { title: 'Joint type', body: 'standard tongue & groove is the base joint; a cam-lock joint for cold-room airtightness costs marginally more to cut and form.' },
  { title: 'Order size', body: 'larger, single-spec orders quote keener per m² than small mixed lots, because setup and changeover cost spreads over more panels.' },
  { title: 'Location / freight', body: 'distance from the nearer factory (Bangalore or Greater Noida) changes landed cost, which is why dispatch origin matters as much as the panel rate itself.' },
  { title: 'Core type', body: 'a PIR core is typically roughly a third more (about 30–35%) than PUF for improved fire behaviour and higher service temperature; most buyers do not need it (see PUF vs PIR on our hub page).' },
];

const CHECKLIST = [
  { title: 'Core density stated', body: 'ours is 40 ± 2 kg/m³. A lighter core reads cheaper and insulates worse.' },
  { title: 'Facing sheet type and gauge stated', body: 'ours is PPGI / PPGL / BGL / stainless steel / aluminium at 0.35–0.80 mm. A thinner facing is the most common hidden cost-cut.' },
  { title: 'Joint type stated', body: 'tongue & groove for wall and roof; cam lock for cold rooms.' },
  { title: 'What the rate excludes', body: 'confirm GST, transport, installation, accessories and unloading are listed, not assumed.' },
  { title: 'HSN 940690 on the quotation and invoice', body: 'so the GST basis is clear and consistent.' },
  { title: 'Warranty in writing', body: 'ours is: PUF panel warranty 5–10 years, confirmed at quotation.' },
];

const FAQS = [
  { question: 'What is the price of a 30 mm PUF panel?', answer: 'A 30 mm PUF panel has a base rate of ₹1,050 per sq mt (≈ ₹98 per sq ft), supply-only, ex-GST. This covers our base specification — PPGI facing, 40 ± 2 kg/m³ core, standard shade. It is the value tier for budget walls and partitions; facing, gauge, colour and joint upgrades are adjusted at quotation.' },
  { question: 'What is the 50 mm PUF panel price per sq ft?', answer: 'A 50 mm PUF panel has a base rate of ₹1,250 per sq mt (≈ ₹116 per sq ft), supply-only, ex-GST, for our base specification — PPGI facing, 40 ± 2 kg/m³ core, standard shade. It remains our most common all-round choice for cabins, offices and general walls; facing, colour and joint upgrades are adjusted at quotation.' },
  { question: 'What is the 80 mm PUF sheet price?', answer: 'An 80 mm PUF panel has a base rate of ₹1,470 per sq mt (≈ ₹137 per sq ft), supply-only, ex-GST, for our base specification — PPGI facing, 40 ± 2 kg/m³ core, standard shade. It suits cold rooms and premium roofs needing more core depth; facing, gauge and joint upgrades are adjusted at quotation.' },
  { question: 'Why do PUF panel quotes differ so much between suppliers?', answer: 'Usually because the panels are not the same, even at the same thickness. A cheaper quote often carries a lower core density or a thinner facing sheet. Ask each supplier to state core density, facing type and gauge, joint type and exclusions in writing, then compare like with like.' },
  { question: 'Does the panel price include GST and transport?', answer: 'No. Our base rates are supply-only and exclude GST, which is added on the invoice under HSN 940690, along with transport, installation, accessories and unloading. This keeps the quote honest and comparable rather than hiding costs inside a single headline rate.' },
  { question: 'Is PIR costlier than PUF?', answer: 'Yes. For the same thickness, a PIR core typically costs roughly a third more (about 30–35%) than PUF, in exchange for improved fire behaviour and a higher service temperature. For most wall, shed and standard cold-room jobs, PUF is the cost-effective choice; PIR is chosen where fire or temperature drives the spec.' },
  { question: 'Do you have a minimum order for PUF panels?', answer: 'For long-distance dispatch we apply a 500 m² minimum billing quantity. Local orders around Bangalore and Greater Noida are more flexible — share your area and site city and we will confirm what applies to your project before quoting.' },
  { question: 'What is the difference between PUF sheet price and panel price?', answer: 'A PUF sheet price is a bare-sheet figure that excludes the facing gauge, profile, joint and colour a finished panel carries, so it reads lower than the real panel. We quote the finished panel to your specification, so the number reflects exactly what you receive.' },
];

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://www.samanportable.com/product/puf-panel/puf-panel-price#product',
  name: 'PUF Panel — Price by Thickness',
  description: 'Fixed base-specification PUF panel prices by thickness (30–80 mm, ₹1,050–₹1,470/m²) with 100–200 mm and freezer-grade confirmed at quotation. Manufactured by SAMAN in Bangalore and Greater Noida.',
  category: 'Insulated Sandwich Panel',
  brand: { '@id': 'https://www.samanportable.com/#organization' },
  manufacturer: { '@id': 'https://www.samanportable.com/#organization' },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Pricing basis', value: 'Supply-only base specification, excluding GST, transport, installation, accessories and unloading' },
    { '@type': 'PropertyValue', name: 'Rates reviewed', value: 'July 2026' },
    { '@type': 'PropertyValue', name: 'HSN', value: '940690' },
  ],
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: 1050,
    highPrice: 1470,
    priceCurrency: 'INR',
    offerCount: 5,
    availability: 'https://schema.org/InStock',
    url: 'https://www.samanportable.com/product/puf-panel/puf-panel-price',
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
    { '@type': 'ListItem', position: 3, name: 'PUF Panel', item: 'https://www.samanportable.com/product/puf-panel' },
    { '@type': 'ListItem', position: 4, name: 'PUF Panel Price', item: 'https://www.samanportable.com/product/puf-panel/puf-panel-price' },
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
  'The PUF panel price you actually pay tracks thickness first, then facing, colour, profile, order size and your site city. Read the table below for the rate by thickness, then send your specification for a firm SAMAN quotation.';

const GALLERY_IMAGES = [
  { src: '/images/puf-panel/stack-factory-30mm-800x800.webp', alt: '30 mm PUF panel stack on the factory floor, the value-tier base rate', title: '30 mm PUF panel stack, factory floor' },
  { src: '/images/puf-panel/red-panel-50mm-800x800.webp', alt: 'Red 50 mm PUF panel on the factory floor, our most common all-round choice', title: '50 mm PUF panel, factory floor' },
  { src: '/images/puf-panel/factory-stack-80mm-800x800.webp', alt: 'Ivory 80 mm PUF panel stack, the cold-room and premium-roof thickness tier', title: '80 mm PUF panel stack, factory floor' },
  { src: '/images/puf-panel/stockyard-lightblue-60mm-800x800.webp', alt: 'Light-blue 60 mm PUF panel stacked in the stockyard, better thermal comfort tier', title: '60 mm PUF panel, stockyard' },
  { src: '/images/puf-panel/cross-section-30mm-800x800.webp', alt: 'Cross-section of a 30 mm PUF panel showing the foam core density a fair quote must state', title: 'PUF panel cross-section, core density reference' },
];

function DescriptionContent() {
  return (
    <>
      <div className="space-y-10">
        <div className="rounded-xl bg-primary/[0.06] px-4 py-3">
          <p className="text-base font-bold text-foreground sm:text-lg">
            SAMAN PUF panel price: ₹1,050–₹1,470 per sq mt (≈ ₹98–₹137 per sq ft) fixed base rates for 30–80 mm —
            thicker and freezer-grade panels quoted per project.
          </p>
          <p className="mt-1 text-xs italic text-muted-foreground">Rates reviewed: July 2026.</p>
        </div>

        <section id="price-by-thickness" className="space-y-4">
          <PriceTableUI
            rows={PRICE_ROWS}
            labelLine="Fixed base-specification rates · supply-only · excluding GST, transport, unloading, installation, accessories, cut-outs, cam-lock and special profile or sheet-finish upgrades · base spec: PPGI facing both sides, 40 ± 2 kg/m³ PUF core, standard shade."
          />
          <p className="text-xs italic text-muted-foreground">
            (₹/sq ft column derived from the ₹/m² range at 1 m² ≈ 10.764 sq ft, rounded. ₹/m² is the primary
            supply unit.)
          </p>

          <LongImage
            src="/images/puf-panel/price-stack-40mm-1200x675.webp"
            alt="Blue-faced 40 mm PUF panels stacked on the factory floor, priced supply-only per square metre"
            title="40 mm PUF panel stock, factory floor"
          />
        </section>

        <JumpNav items={JUMP_ITEMS} />

        <section id="price-by-thickness-detail" className="space-y-4">
          <H2 id="price-by-thickness">PUF panel price by thickness</H2>
          <P>
            Thickness is the single biggest driver of a PUF panel rate — more core means more polyurethane and
            a heavier panel. Below is how the bands break down.
          </P>

          <H3>30 mm, 40 mm and 50 mm panel rates</H3>
          <P>
            These are the value tier. A 30 mm PUF panel has a base rate of ₹1,050/m² supply-only, 40 mm ₹1,150/m²,
            and 50 mm ₹1,250/m². The 50 mm panel is our most common all-round choice — it balances insulation and
            cost for cabins, offices and general insulated walls, which is why most standard enquiries settle
            here.
          </P>

          <H3>60 mm, 80 mm and 100 mm panel rates</H3>
          <P>
            The mid tier steps up as core depth increases: 60 mm at a ₹1,330/m² base rate for better thermal
            comfort, and 80 mm at ₹1,470/m² for cold rooms and premium roofs. 100 mm is quoted per order — its
            rate depends on facing and profile — so it is confirmed at quotation. This tier suits sheds,
            better-insulated buildings and lighter cold storage.
          </P>

          <H3>120–200 mm and freezer-grade panels (confirm at quotation)</H3>
          <P>
            Above 100 mm — 120 mm, 150 mm, 200 mm and freezer-grade panels — the rate is confirmed at quotation
            rather than banded. These are specialised builds where facing, joint type and density are set by the
            cold-chain or high-insulation requirement, and a blanket per-sq-ft figure would mislead more than it
            helps. We manufacture freezer-grade panels up to 150 mm.
          </P>
        </section>

        <section id="rate-factors" className="space-y-3">
          <H2 id="rate-factors">What changes the PUF panel rate</H2>
          <P>Two panels of the same thickness can quote differently. The rate moves with:</P>
          <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {RATE_LEVERS.map((lever) => (
              <li key={lever.title}>
                <span className="font-semibold text-foreground">{lever.title}</span> — {lever.body}
              </li>
            ))}
          </ul>

          <LongImage
            src="/images/puf-panel/tg-joint-40mm-1200x675.webp"
            alt="Tongue-and-groove joint on a 40 mm PUF panel, the standard joint priced into the base rate"
            title="PUF panel tongue-and-groove joint, standard vs cam-lock"
          />

          <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <span className="font-bold text-foreground">The per-10 mm step.</span> From the base rates above,
            each additional 10 mm of core adds roughly{' '}
            <span className="font-semibold text-foreground">₹70–₹100 per square metre</span>; the exact step for
            thicker and freezer-grade panels is confirmed at quotation.
          </p>
          <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <span className="font-bold text-foreground">Volume and repeat orders.</span> Larger orders and
            repeat or project buyers earn better rates than one-off small lots — the exact slabs are confirmed
            at quotation. We do not publish blanket discount percentages, because the real number depends on
            thickness, facing and total area, and a headline &ldquo;bulk %&rdquo; that ignores those would be
            misleading.
          </p>
          <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <span className="font-bold text-foreground">The roof-cost trade-off.</span> If your build is
            roof-led, expect an insulated PUF roof panel to cost more per sq ft than a plain metal sheet — but
            it replaces the metal sheet, a separate layer of insulation and a lining step, and it goes up faster
            as one board. Judged on the finished, insulated roof rather than the bare sheet, it is usually the
            lower total cost. For how the roof profile and thickness change the selection, see our{' '}
            <Link href="/product/puf-panel/puf-panel-roofing" className="font-semibold text-primary hover:underline">
              roof-specific PUF panel selection guidance
            </Link>
            .
          </p>
        </section>

        <section id="sheet-vs-panel" className="space-y-3">
          <H2 id="sheet-vs-panel">PUF sheet price versus finished panel quotation</H2>
          <P>
            Buyers often ask for a &ldquo;PUF sheet price&rdquo; expecting a single number, but a PUF sheet and
            a finished, profiled panel are quoted differently. A bare sheet rate ignores the facing gauge,
            profile, joint and colour that a real panel carries — so a headline &ldquo;sheet price&rdquo; is
            almost always lower than the panel you actually need.
          </P>
          <P>
            We quote the finished panel to your specification so the number is real. That way the rate you
            approve already includes the facing, profile and joint your drawing calls for, with no surprise
            additions when the panel is made.
          </P>
        </section>

        <section id="compare-quotes">
          <H2 id="compare-quotes">How to compare PUF panel quotes correctly</H2>
          <div className="mt-3">
            <ComparisonBox eyebrow="Flagship information gain" title="The 6-point quote comparison checklist">
              <P>
                The reason two PUF panel quotes can differ by a wide margin is rarely the seller&apos;s margin
                — it is usually a different panel hiding behind the same thickness number. Before you compare
                prices, get all six of these in writing:
              </P>
              <ol className="my-4 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-foreground sm:text-base">
                {CHECKLIST.map((item) => (
                  <li key={item.title}>
                    <span className="font-semibold">{item.title}</span> — {item.body}
                  </li>
                ))}
              </ol>
              <p className="text-[15px] font-medium leading-relaxed text-foreground sm:text-base">
                Honest-buyer warning: a quote that is much cheaper for the &ldquo;same&rdquo; thickness almost
                always means a lower core density or a thinner facing sheet. Ask for the specification, not
                just the number — then compare like with like.
              </p>
            </ComparisonBox>
          </div>
        </section>

        <section id="included-excluded" className="space-y-3">
          <H2 id="included-excluded">What is included and excluded in a SAMAN quote</H2>
          <P>
            Most sellers quote a bare rate and let the extras appear later. We state them upfront. A SAMAN PUF
            panel quotation is <span className="font-semibold text-foreground">supply-only</span> and, unless
            written otherwise, <span className="font-semibold text-foreground">excludes</span>:
          </P>
          <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <li><span className="font-semibold text-foreground">GST</span> (PUF panels fall under HSN 940690; GST is added on the invoice)</li>
            <li><span className="font-semibold text-foreground">Transport</span> to site</li>
            <li><span className="font-semibold text-foreground">Installation</span> / erection</li>
            <li><span className="font-semibold text-foreground">Accessories</span> (flashings, fasteners, trims, sealants)</li>
            <li><span className="font-semibold text-foreground">Unloading / offloading</span> at site</li>
          </ul>
          <P>
            Installation itself is quoted separately because it depends on building height, site access,
            scaffolding or crane needs and the accessories used — so we never publish an installed ₹/sq ft
            figure that would fall apart on a real site. Stating exclusions cleanly is deliberate: it is the
            single most common cause of a disputed panel bill.
          </P>
        </section>

        <section id="request-quotation" className="space-y-3">
          <H2 id="request-quotation">How to request an accurate manufacturer quotation</H2>
          <P>The faster you give us the build, the tighter the quote. Send:</P>
          <ol className="list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            <li><span className="font-semibold text-foreground">Use</span> — cabin, shed, cold room, partition, roof, etc.</li>
            <li><span className="font-semibold text-foreground">Thickness</span> — or the temperature/insulation target if you are unsure.</li>
            <li><span className="font-semibold text-foreground">Area</span> — total m² (or panel run and count).</li>
            <li><span className="font-semibold text-foreground">Site city</span> — for the correct dispatch factory and transport.</li>
            <li><span className="font-semibold text-foreground">Facing and colour</span> — if already decided.</li>
          </ol>
          <P>
            With that, we return a firm rate against the{' '}
            <Link href="/product/puf-panel" className="font-semibold text-primary hover:underline">
              complete factory-made PUF panel range
            </Link>{' '}
            rather than just the base rate. No calculator, no obligation — a real manufacturer quotation.
          </P>
          <LongImage
            src="/images/puf-panel/loading-area-grey-50mm-1200x675.webp"
            alt="Grey 50 mm PUF panels staged in the loading area ahead of a firm quotation"
            title="50 mm PUF panel, loading area"
          />
        </section>

        <section id="faq" className="space-y-4">
          <H2 id="faq">Frequently asked questions</H2>
          <FaqAccordion items={FAQS} />
          <p className="text-xs italic text-muted-foreground">
            Base rates reviewed July 2026; rates move with steel and chemical prices — request a current
            quotation for project pricing.
          </p>
        </section>

        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
          <h3 className="mb-1 text-xl font-bold text-foreground">Get your firm PUF panel rate</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Send thickness, area, facing and site city for a firm quote.
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
        The specification behind every rate on the price table — the same core, facing and joint options
        referenced above, tabulated for quick reference.
      </P>
      <SpecTable title="PUF Panel Specifications" subtitle="Owner-verified" rows={SPEC_ROWS} />
      <LongImage
        priority
        src="/images/puf-panel/diagrams/puf-panel-thickness-chart.webp"
        alt="Technical chart of PUF panel thickness options from 30 to 200 mm"
        title="PUF panel thickness chart"
      />
    </div>
  );
}

function ShippingContent() {
  return (
    <div className="space-y-4">
      <P>
        Transport is quoted separately because it depends on distance, load size and access. Here SAMAN has
        a structural advantage: we dispatch from{' '}
        <span className="font-semibold text-foreground">Bangalore for South India and Greater Noida for
        North India and Delhi NCR</span>, so the{' '}
        <span className="font-semibold text-foreground">nearer factory quotes your freight</span>. A
        single-plant supplier ships every long-distance order from one location, and that freight quietly
        inflates the landed cost — the panel rate looks similar, but the delivered price is not.
      </P>
      <P>
        Pan-India delivery; transport confirmed at quotation; 3–5 business day default dispatch — see our{' '}
        <Link href="/delivery-policy" className="font-semibold text-primary hover:underline">
          Delivery Policy
        </Link>
        . For long-distance dispatch a <span className="font-semibold text-foreground">500 m² minimum
        billing</span> quantity applies — worth knowing before you plan a small remote order, since it
        changes the effective per-m² cost. Offloading at site is arranged and costed with you; a long panel
        needs offloading space, so factor it into the delivered price rather than treating the panel rate
        as the final number.
      </P>
      <P>
        Standard products carry 7-day returns (3-day on custom builds) — see our{' '}
        <Link href="/refund-and-return-policy" className="font-semibold text-primary hover:underline">
          Refund &amp; Return Policy
        </Link>
        .
      </P>
      <LongImage
        src="/images/puf-panel/dispatch-bundle-80mm-1200x675.webp"
        alt="Smoke-grey 80 mm PUF panels bundled and ready for dispatch from the nearer SAMAN factory"
        title="PUF panel dispatch bundle, ready for freight"
      />
      <LongImage
        src="/images/puf-panel/shipment-bundle-60mm-1200x675.webp"
        alt="Smoke-grey 60 mm PUF panel shipment bundle staged for outbound freight"
        title="60 mm PUF panel, shipment bundle"
      />
    </div>
  );
}

export default function PufPanelPrice() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle="PUF Panel Price 2026 — Rate Per Sq Ft by Thickness | SAMAN"
        fallbackDescription="PUF panel price 2026 by thickness — fixed base rates ₹1,050–₹1,470 per sq mt for 30–80 mm, with 100–200 mm and freezer-grade confirmed at quotation. Supply-only, ex-GST. Get a firm SAMAN quote."
        fallbackCanonical="https://www.samanportable.com/product/puf-panel/puf-panel-price"
        keywords="puf panel price, puf panel cost, puf panel rate, puf sheet price"
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
            <span className="font-semibold text-foreground">PUF Panel Price</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <RelatedProductsRail
                variant="sidebar"
                heading="Explore the Range"
                items={[PUF_CATALOG.hub, PUF_CATALOG.roofing, PUF_CATALOG.sandwich, PUF_CATALOG.house, PUF_CATALOG.wall, PUF_CATALOG.specification, PUF_CATALOG.coldStorage]}
              />
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <ProductCarousel images={GALLERY_IMAGES} />
              <div className="mt-4 rounded-xl border-2 border-primary/25 bg-primary/[0.04] p-3 sm:p-4">
                <p className="mb-2 text-sm font-bold text-foreground">Get a factory-direct firm rate</p>
                <ProductZoneCtas variant="strip" />
              </div>
            </div>

            <div className="order-2 lg:order-3 lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto">
              <ProductInfoBox
                h1="PUF Panel Price 2026 — Rate per Sq Ft and Sq Mt by Thickness"
                priceMain="From ₹1,050 / sq mt"
                priceSubline="30mm base spec · ex-GST · final price at quotation"
                shortDescription={SHORT_DESCRIPTION}
                application="Cabin walls, roofs, cold rooms"
                sku="SP-C15-PRC-2026"
                averageRating="0.00"
                ratingCount={0}
              />
            </div>
          </div>

          <div className="mt-8">
            <ProductDetailTabs
              productTitle="PUF Panel Price"
              descriptionContent={<DescriptionContent />}
              specificationsContent={<SpecificationsContent />}
              shippingContent={<ShippingContent />}
              reviews={[]}
              averageRating="0.00"
              ratingCount={0}
              productId={990002}
              reviewProductId={272758}
              productName="PUF Panel Price"
            />
          </div>

          <div className="mt-8 space-y-8">
            <RelatedProductsRail items={[PUF_CATALOG.hub, PUF_CATALOG.roofing, PUF_CATALOG.sandwich, PUF_CATALOG.house, PUF_CATALOG.wall, PUF_CATALOG.specification, PUF_CATALOG.coldStorage]} />
            <CertBadgeStrip />
          </div>
        </div>
      </main>

      <MobileStickyCta />
    </Layout>
  );
}
