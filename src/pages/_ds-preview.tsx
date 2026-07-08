import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import type { ReactNode } from 'react';
import {
  PageShell,
  Hero,
  SpecStrip,
  SpecTable,
  PriceCard,
  CategoryCard,
  TestimonialCard,
  ClientLogoWall,
  FAQAccordion,
  CTABlock,
  ProcessSteps,
  DeliveryLogRow,
  Breadcrumb,
  StickyMobileBar,
  ZoneContactCard,
  BlogPostLayout,
  SizeVariantSelector,
  TrustBadgeRow,
  CredentialCard,
  GSTRegistrationCard,
  CTARow,
  PhoneIcon,
  RegIcon,
  ShieldIcon,
  CalculatorIcon,
  ChatQuoteIcon,
  type SizeVariant,
  type CallContact,
} from '@/components/ds';

/**
 * /_ds-preview — HIDDEN design-system harness (noindex). Renders every SHIKHAR
 * T0 component with realistic SAMPLE SAMAN data. Not linked from any page and
 * excluded from indexing. Sample copy is placeholder-only (marked SAMPLE where
 * it stands in for real contact data) — no production copy is authored here.
 */

// Inline SVG placeholder using NAMED colors (no hex) so the preview is
// self-contained and never depends on real asset paths.
const ph = (w: number, h: number, label: string): string =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
      `<rect width='100%' height='100%' fill='honeydew'/>` +
      `<rect x='0.5' y='0.5' width='${w - 1}' height='${h - 1}' fill='none' stroke='seagreen'/>` +
      `<text x='50%' y='50%' font-family='monospace' font-size='13' fill='seagreen' ` +
      `text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`,
  );

// Forest-grounded section eyebrow (T0.1 premium pass): small mono uppercase,
// letter-spaced, in the forest brand colour above each component group.
function Demo({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section style={{ padding: '2.5rem 0', borderBottom: '1px solid var(--ds-border)' }}>
      <p
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--ds-text-mono-family)',
          fontSize: 'var(--ds-text-caption-size)',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ds-color-forest)',
          marginBottom: '1rem',
        }}
      >
        <span aria-hidden="true" style={{ width: '18px', height: '1px', background: 'var(--ds-color-forest)' }} />
        {title}
        {note ? ` — ${note}` : ''}
      </p>
      {children}
    </section>
  );
}

// SAMPLE zone-aware Call button values (T0.1 — VERBATIM from owner review).
const CALL_VARIANTS: CallContact[] = [
  { label: 'Call (Pan-India)', phone: '+91 97089 89937' },
  { label: 'Call South Plant', phone: '+91 88616 22859' },
  { label: 'Call North Plant', phone: '+91 87960 39938' },
];

// SAMPLE TrustBadgeRow data (T0.1 — VERBATIM from owner review).
const TRUST_ITEMS = [
  { label: 'MSME ZED Bronze', subLabel: 'Zero Defect Certified' },
  { label: 'Since 2019', subLabel: 'CIN U74999KA2019PTC122176' },
  { label: 'Two Factories', subLabel: 'Bangalore + Greater Noida' },
  { label: 'GST Registered', subLabel: 'Karnataka + Uttar Pradesh' },
  { label: 'EPF & ESIC', subLabel: 'Registered Employer' },
];

const SIZES: SizeVariant[] = [
  { label: '10 × 8 ft', dimensions: '3.0m × 2.4m × 2.6m', priceFrom: '₹1,05,000', keySpecs: [ { label: 'Area', value: '80 sq ft' }, { label: 'Occupancy', value: '2–3' }, { label: 'Weight', value: '0.9 T' }, { label: 'Lead', value: '7 days' } ] },
  { label: '12 × 8 ft', dimensions: '3.6m × 2.4m × 2.6m', priceFrom: '₹1,18,000', keySpecs: [ { label: 'Area', value: '96 sq ft' }, { label: 'Occupancy', value: '3–4' }, { label: 'Weight', value: '1.1 T' }, { label: 'Lead', value: '7 days' } ] },
  { label: '16 × 8 ft', dimensions: '4.8m × 2.4m × 2.6m', priceFrom: '₹1,42,000', keySpecs: [ { label: 'Area', value: '128 sq ft' }, { label: 'Occupancy', value: '4–5' }, { label: 'Weight', value: '1.4 T' }, { label: 'Lead', value: '9 days' } ] },
  { label: '20 × 8 ft', dimensions: '6.0m × 2.4m × 2.6m', priceFrom: '₹1,68,000', keySpecs: [ { label: 'Area', value: '160 sq ft' }, { label: 'Occupancy', value: '5–6' }, { label: 'Weight', value: '1.7 T' }, { label: 'Lead', value: '10 days' } ] },
  { label: '20 × 10 ft', dimensions: '6.0m × 3.0m × 2.6m', priceFrom: '₹1,96,000', keySpecs: [ { label: 'Area', value: '200 sq ft' }, { label: 'Occupancy', value: '6–8' }, { label: 'Weight', value: '2.1 T' }, { label: 'Lead', value: '12 days' } ] },
  { label: '24 × 10 ft', dimensions: '7.2m × 3.0m × 2.6m', priceFrom: '₹2,28,000', keySpecs: [ { label: 'Area', value: '240 sq ft' }, { label: 'Occupancy', value: '8–10' }, { label: 'Weight', value: '2.5 T' }, { label: 'Lead', value: '12 days' } ] },
  { label: '30 × 10 ft', dimensions: '9.0m × 3.0m × 2.6m', priceFrom: '₹2,74,000', keySpecs: [ { label: 'Area', value: '300 sq ft' }, { label: 'Occupancy', value: '10–12' }, { label: 'Weight', value: '3.0 T' }, { label: 'Lead', value: '14 days' } ] },
  { label: '32 × 10 ft', dimensions: '9.6m × 3.0m × 2.6m', priceFrom: '₹2,92,000', keySpecs: [ { label: 'Area', value: '320 sq ft' }, { label: 'Occupancy', value: '12–14' }, { label: 'Weight', value: '3.2 T' }, { label: 'Lead', value: '14 days' } ] },
  { label: '40 × 10 ft', dimensions: '12.0m × 3.0m × 2.6m', priceFrom: '₹3,58,000', keySpecs: [ { label: 'Area', value: '400 sq ft' }, { label: 'Occupancy', value: '14–18' }, { label: 'Weight', value: '4.0 T' }, { label: 'Lead', value: '16 days' } ] },
];

export default function DsPreview() {
  return (
    <>
      {/* Override _app's DefaultSeo robots (set via additionalMetaTags, key
          `meta:robots`) by re-emitting the same key; renders after _app so it
          wins the next/head dedupe → single noindex tag. */}
      <NextSeo additionalMetaTags={[{ name: 'robots', content: 'noindex, nofollow' }]} />
      <Head>
        <title>SAMAN Design System — Preview (SAMPLE)</title>
      </Head>

      <PageShell
        background="paper"
        header={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
            {/* Real SAMAN logo (public/saman-logo.svg, intrinsic 250×125) at
                64×32 — height ≤32px, explicit dims for zero CLS. unoptimized so
                it renders without depending on next.config SVG settings. */}
            <Image src="/saman-logo.svg" alt="SAMAN" width={64} height={32} unoptimized priority style={{ height: '32px', width: 'auto' }} />
            <strong style={{ fontFamily: 'var(--ds-text-h3-family)', fontWeight: 800 }}>SAMAN Design System — /_ds-preview (SAMPLE)</strong>
          </span>
        }
        footer={<span style={{ opacity: 0.8 }}>SHIKHAR T0 — design-system preview harness. All data marked SAMPLE.</span>}
      >
        <p style={{ padding: '1rem 0 0', fontSize: 'var(--ds-text-small-size)', color: 'var(--ds-text-secondary)' }}>
          ▸ See the components assembled into a full page:{' '}
          <Link href="/_ds-preview-home" style={{ color: 'var(--ds-primary)', fontWeight: 600 }}>/_ds-preview-home</Link>{' '}
          (noindex demo homepage).
        </p>

        <Demo title="Hero + SpecStrip (signature band)" note="with zone Call button + trust slot">
          <Hero
            headline="Portable Cabins & PUF Panel Solutions"
            subline="SAMPLE subline — engineered modular units delivered pan-India."
            primaryCta={{ label: 'Get a Quote', href: '#quote' }}
            secondaryCta={{ label: 'Price Calculator', href: '#calc' }}
            callContact={CALL_VARIANTS[0]}
            trustSlot={<TrustBadgeRow items={TRUST_ITEMS.slice(0, 4)} />}
            media={{ src: ph(640, 420, '640×420 media'), alt: 'SAMPLE product image', width: 640, height: 420 }}
            specStrip={
              <SpecStrip
                eyebrow="PUF Panel"
                items={[
                  { label: 'Price from', value: '₹1,050/m²' },
                  { label: 'Thickness', value: '50–100 mm' },
                  { label: 'Core', value: 'PUF 40 kg/m³' },
                  { label: 'Span', value: 'up to 6 m' },
                  { label: 'Lead time', value: '7 days' },
                ]}
              />
            }
          />
        </Demo>

        <Demo title="CTARow (SAMPLE)" note="1 filled pill + 2 outline pills · stacks full-width ≤419px">
          <CTARow
            primary={{ label: 'Price Calculator', href: '#calc', icon: <CalculatorIcon /> }}
            outlines={[
              { label: 'Request a Quote', href: '#quote', icon: <ChatQuoteIcon /> },
              { label: 'Call Us', href: 'tel:+919708989937', icon: <PhoneIcon /> },
            ]}
          />
        </Demo>

        <Demo title="TrustBadgeRow (SAMPLE)" note="ink on paper + reversed on forest">
          <TrustBadgeRow items={TRUST_ITEMS} />
          <div style={{ background: 'var(--ds-surface-inverse)', borderRadius: 'var(--ds-radius-md)', padding: '1.25rem', marginTop: '1rem' }}>
            <TrustBadgeRow tone="inverse" items={TRUST_ITEMS} />
          </div>
        </Demo>

        <Demo title="CredentialCard (SAMPLE)" note="About-page credentials grid">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <CredentialCard name="MSME ZED Bronze" regNumber="27022025_429647" issuer="Ministry of MSME" icon={<ShieldIcon />} />
            <CredentialCard name="Udyam Registration" regNumber="UDYAM-KR-03-0172770" issuer="Udyam / MSME" icon={<RegIcon />} />
            <CredentialCard name="DPIIT Startup" regNumber="DIPP56005" issuer="DPIIT" />
          </div>
        </Demo>

        <Demo title="GSTRegistrationCard" note="two-column, stacks at 360px">
          <GSTRegistrationCard
            entries={[
              { stateLabel: 'KARNATAKA — BANGALORE PLANT', gstin: '29ABBCS7101B1ZR', caption: 'Goods & Services Tax Registration' },
              { stateLabel: 'UTTAR PRADESH — GREATER NOIDA PLANT', gstin: '09ABBCS7101B1ZT', caption: 'Goods & Services Tax Registration' },
            ]}
          />
        </Demo>

        <Demo title="SpecStrip (standalone, 3–5 items)">
          <SpecStrip
            eyebrow="20ft Office Container"
            items={[
              { label: 'Price from', value: '₹1,68,000' },
              { label: 'Size', value: '20 × 8 ft' },
              { label: 'Insulation', value: 'PUF 50 mm' },
              { label: 'Lead time', value: '10 days' },
            ]}
          />
        </Demo>

        <Demo title="SizeVariantSelector" note="exactly 9 sizes · crawlable table + zero-CLS panel">
          <SizeVariantSelector title="Choose your cabin size" sizes={SIZES} />
        </Demo>

        <Demo title="SpecTable">
          <SpecTable
            caption="Portable Cabin — Technical Specification (SAMPLE)"
            rows={[
              { label: 'Wall panel', value: 'PUF 50 mm' },
              { label: 'Roof panel', value: 'PUF 60 mm' },
              { label: 'Frame', value: 'GI 2 mm' },
              { label: 'Flooring', value: 'Marine ply 18 mm' },
              { label: 'Electricals', value: 'IP65, MCB' },
              { label: 'Wind rating', value: '150 km/h' },
            ]}
          />
        </Demo>

        <Demo title="PriceCard (PUF ₹1,050–₹1,470/m² range)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <PriceCard title="PUF Panel 50 mm" priceFrom="₹1,050" unit="/m²" features={['40 kg/m³ core', 'Std delivery 7 days']} cta={{ label: 'Enquire', href: '#' }} />
            <PriceCard title="PUF Panel 80 mm" priceFrom="₹1,290" unit="/m²" badge="Popular" highlighted features={['Better insulation', 'Cold storage grade']} cta={{ label: 'Enquire', href: '#' }} />
            <PriceCard title="PUF Panel 100 mm" priceFrom="₹1,470" unit="/m²" features={['Max insulation', 'Freezer grade']} cta={{ label: 'Enquire', href: '#' }} />
          </div>
        </Demo>

        <Demo title="CategoryCard">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <CategoryCard title="Portable Cabins" href="#" eyebrow="12 models" description="SAMPLE — bunkhouses, offices, toilets." image={{ src: ph(480, 360, 'cabin'), alt: 'SAMPLE', width: 480, height: 360 }} />
            <CategoryCard title="Office Containers" href="#" eyebrow="9 models" description="SAMPLE — 10ft to 40ft." image={{ src: ph(480, 360, 'container'), alt: 'SAMPLE', width: 480, height: 360 }} />
            <CategoryCard title="PUF Panels" href="#" eyebrow="3 grades" description="SAMPLE — 50/80/100 mm." image={{ src: ph(480, 360, 'panel'), alt: 'SAMPLE', width: 480, height: 360 }} />
          </div>
        </Demo>

        <Demo title="TestimonialCard">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <TestimonialCard quote="SAMPLE — delivery was on time and the fit-out quality was excellent." name="R. Kumar" designation="Site Manager" company="ABC Infra" avatar={{ src: ph(88, 88, 'RK'), alt: 'SAMPLE', width: 88, height: 88 }} />
            <TestimonialCard quote="SAMPLE — the PUF panels kept our cold room within spec through summer." name="S. Nair" designation="Operations Head" company="FreshCo" avatar={{ src: ph(88, 88, 'SN'), alt: 'SAMPLE', width: 88, height: 88 }} />
          </div>
        </Demo>

        <Demo title="ClientLogoWall (single source, dedup)">
          <ClientLogoWall
            title="Trusted by"
            logos={[
              { src: ph(160, 48, 'Client A'), alt: 'SAMPLE Client A', width: 160, height: 48 },
              { src: ph(160, 48, 'Client B'), alt: 'SAMPLE Client B', width: 160, height: 48 },
              { src: ph(160, 48, 'Client C'), alt: 'SAMPLE Client C', width: 160, height: 48 },
              { src: ph(160, 48, 'Client A'), alt: 'DUPLICATE (collapsed)', width: 160, height: 48 },
              { src: ph(160, 48, 'Client D'), alt: 'SAMPLE Client D', width: 160, height: 48 },
              { src: ph(160, 48, 'Client E'), alt: 'SAMPLE Client E', width: 160, height: 48 },
            ]}
          />
        </Demo>

        <Demo title="ProcessSteps">
          <ProcessSteps
            title="How it works"
            steps={[
              { title: 'Enquiry', description: 'SAMPLE — share size & site.' },
              { title: 'Site survey', description: 'SAMPLE — access & levelling.' },
              { title: 'Fabrication', description: 'SAMPLE — 7–16 day build.' },
              { title: 'Delivery & install', description: 'SAMPLE — craned & handed over.' },
            ]}
          />
        </Demo>

        <Demo title="DeliveryLogRow">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <DeliveryLogRow project="Metro Depot Office" city="Chennai" size="20 × 8 ft" deliveryDays={9} photo={{ src: ph(144, 144, 'job'), alt: 'SAMPLE', width: 144, height: 144 }} />
            <DeliveryLogRow project="Cold Room" city="Hosur" size="16 × 10 ft" deliveryDays={12} photo={{ src: ph(144, 144, 'job'), alt: 'SAMPLE', width: 144, height: 144 }} />
          </div>
        </Demo>

        <Demo title="FAQAccordion (details/summary + JSON-LD)">
          <FAQAccordion
            emitJsonLd
            exclusive
            items={[
              { question: 'What is the lead time?', answer: 'SAMPLE — 7 to 16 days depending on size.' },
              { question: 'Do you deliver pan-India?', answer: 'SAMPLE — yes, South and North zones.' },
              { question: 'What insulation is used?', answer: 'SAMPLE — PUF 40 kg/m³, 50–100 mm.' },
            ]}
          />
        </Demo>

        <Demo title="Breadcrumb (visual + JSON-LD)">
          <Breadcrumb
            emitJsonLd
            origin="https://samanportable.com"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: 'Portable Cabins', href: '/portable-cabins' },
              { label: '20ft Office Cabin' },
            ]}
          />
        </Demo>

        <Demo title="ZoneContactCard (South / North — SAMPLE numbers)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <ZoneContactCard zone="south" office="SAMAN South (Bangalore)" phone="+91 88616 22859 (SAMPLE)" phoneHref="tel:+918861622859" whatsappHref="https://wa.me/918861622859" email="sales@samanportable.com" serving="SAMPLE — serving South India" cities={['Chennai', 'Bengaluru', 'Hosur', 'Coimbatore']} />
            <ZoneContactCard zone="north" office="SAMAN North (Greater Noida)" phone="+91 87960 39938 (SAMPLE)" phoneHref="tel:+918796039938" whatsappHref="https://wa.me/918796039938" email="ncr@samanportable.com" serving="SAMPLE — serving North India" cities={['Delhi', 'Gurugram', 'Faridabad', 'Ghaziabad']} />
          </div>
        </Demo>

        <Demo title="CTABlock">
          <CTABlock
            title="Ready to spec your cabin?"
            description="SAMPLE — get a same-day quote from your zone team."
            primaryCta={{ label: 'Get a Quote', href: '#' }}
            secondaryCta={{ label: 'Call us', href: '#' }}
          />
        </Demo>

        <Demo title="BlogPostLayout (breadcrumb · author · TOC · related · CTA slots)">
          <BlogPostLayout
            title="Choosing the Right Portable Cabin Size (SAMPLE)"
            subtitle="SAMPLE subtitle — a short guide to sizing your unit."
            author={{ name: 'SAMAN Editorial', role: 'Product Team', avatar: { src: ph(88, 88, 'SA'), alt: 'SAMPLE', width: 88, height: 88 } }}
            publishedLabel="12 Jun 2026"
            readingTime="6 min read"
            breadcrumb={<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: 'Sizing Guide' }]} />}
            toc={
              <nav aria-label="Table of contents" style={{ fontSize: 'var(--ds-text-small-size)' }}>
                <strong>On this page</strong>
                <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1rem' }}>
                  <li>Overview</li>
                  <li>Sizing</li>
                  <li>Delivery</li>
                </ul>
              </nav>
            }
            relatedProducts={<SpecStrip eyebrow="Related" items={[{ label: '10×8', value: '₹1,05,000' }, { label: '20×8', value: '₹1,68,000' }, { label: '40×10', value: '₹3,58,000' }]} />}
            cta={<CTABlock tone="soft" title="Need help sizing?" primaryCta={{ label: 'Talk to us', href: '#' }} />}
          >
            <h2>Overview</h2>
            <p>SAMPLE body paragraph. Lorem ipsum placeholder content for layout verification only.</p>
            <h2>Sizing</h2>
            <p>SAMPLE body paragraph two. Placeholder text to exercise the body typography scale.</p>
            <h3>Delivery</h3>
            <p>SAMPLE body paragraph three.</p>
          </BlogPostLayout>
        </Demo>

        <Demo title="StickyMobileBar" note="fixed bottom on <1024px; narrow the viewport to see it">
          <p style={{ color: 'var(--ds-text-secondary)' }}>Rendered at the page root below — visible under 1024px width (Call | WhatsApp | Calculator).</p>
        </Demo>

        {/* Inside PageShell so it inherits the font variables; position:fixed
            still pins it to the viewport (no transformed ancestor). */}
        <StickyMobileBar callHref="tel:+919000000001" whatsappHref="https://wa.me/919000000001" calculatorHref="#calc" />
      </PageShell>
    </>
  );
}
