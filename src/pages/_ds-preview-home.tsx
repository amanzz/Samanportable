import Head from 'next/head';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import type { ReactNode } from 'react';
import {
  PageShell,
  Section,
  Hero,
  SpecStrip,
  SpecTable,
  CategoryCard,
  TestimonialCard,
  CredentialCard,
  GSTRegistrationCard,
  TrustBadgeRow,
  ProcessSteps,
  DeliveryLogRow,
  FAQAccordion,
  ZoneContactCard,
  CTABlock,
  CTARow,
  StickyMobileBar,
  PhoneIcon,
  ChatQuoteIcon,
  CalculatorIcon,
  ShieldIcon,
  RegIcon,
  CertificateIcon,
  type CtaRowItem,
} from '@/components/ds';

/**
 * /_ds-preview-home — HIDDEN (noindex) assembled demo homepage, built entirely
 * from SHIKHAR design-system components with the owner's FINAL copy. T0.4:
 * uniform Section rhythm with alternating surfaces, one-line hero CTA row,
 * uniform 4:3 category imagery, and the GST registration block.
 */

/** The three hero/CTA-block actions. Call shows icon + "Call" only (T0.4). */
const CTA_PRIMARY: CtaRowItem = { label: 'Price Calculator', href: '#calc', icon: <CalculatorIcon /> };
const CTA_OUTLINES: CtaRowItem[] = [
  { label: 'Request a Quote', href: '#quote', icon: <ChatQuoteIcon /> },
  { label: 'Call', href: 'tel:+919708989937', icon: <PhoneIcon />, ariaLabel: 'Call SAMAN Portable' },
];

const gridAuto = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' } as const;

const CATEGORIES = [
  { title: 'Portable Cabins', description: 'Site offices, accommodation and multi-room cabins built on rigid steel frames.', src: '/30x10-portable-office-cabin-rental.png', w: 1024, h: 1024 },
  { title: 'Container Offices', description: '20ft and 40ft converted container offices with insulation, electricals and interiors.', src: '/hero-image/premium-container-site-office-rental.webp', w: 1200, h: 675 },
  { title: 'Portable Toilets', description: 'Single and multi-seater portable toilet units for sites and events.', src: '/gbp-posts/portable-toilet-bangalore.jpg', w: 1200, h: 675 },
  { title: 'Security Cabins', description: 'Compact guard cabins for gates, sites and campuses.', src: '/images/products/security-cabins/frp-security-cabin-01.webp', w: 1200, h: 1200 },
  { title: 'Labour Colonies', description: 'Multi-unit worker accommodation planned, built and installed on site.', src: '/Gallery/imgi_1880_prefab-labor-colony-1-1.jpg', w: 1024, h: 1024 },
  { title: 'PEB & Industrial', description: 'Pre-engineered buildings and industrial sheds, designed and fabricated in-factory.', src: '/images/puf-panel/roof-warehouse-60mm-1200x675.webp', w: 1200, h: 675 },
];

const TRUST_ITEMS = [
  { label: 'MSME ZED Bronze', subLabel: 'Zero Defect Certified' },
  { label: 'Since 2019', subLabel: 'CIN U74999KA2019PTC122176' },
  { label: 'Two Factories', subLabel: 'Bangalore + Greater Noida' },
  { label: 'GST Registered', subLabel: '2 States — KA + UP' },
  { label: 'EPF & ESIC', subLabel: 'Registered Employer' },
];

const GST_ENTRIES = [
  { stateLabel: 'KARNATAKA — BANGALORE PLANT', gstin: '29ABBCS7101B1ZR', caption: 'Goods & Services Tax Registration' },
  { stateLabel: 'UTTAR PRADESH — GREATER NOIDA PLANT', gstin: '09ABBCS7101B1ZT', caption: 'Goods & Services Tax Registration' },
];

const stack = (children: ReactNode, gap = '1.5rem') => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>
);

export default function DsPreviewHome() {
  return (
    <>
      {/* Override _app's DefaultSeo robots (set via additionalMetaTags, key
          `meta:robots`) by re-emitting the same key; renders after _app so it
          wins the next/head dedupe. */}
      <NextSeo additionalMetaTags={[{ name: 'robots', content: 'noindex, nofollow' }]} />
      <Head>
        <title>SAMAN Portable — assembled demo homepage (preview)</title>
      </Head>

      <PageShell
        background="paper"
        contained={false}
        header={<Image src="/saman-logo.svg" alt="SAMAN Portable" width={64} height={32} unoptimized priority style={{ height: '32px', width: 'auto' }} />}
      >
        {/* 1 — HERO (paper) */}
        <Section background="paper">
          <Hero
            headline="Portable Cabins & Prefab Buildings, Factory-Direct Since 2019"
            subline="SAMAN Portable manufactures porta cabins, container offices, portable toilets and prefab structures at two factories — Bangalore and Greater Noida — and delivers across India."
            media={{ src: '/hero-image/saman-portable-office-cabin-bangalore.webp', alt: 'SAMAN portable office cabin', width: 1600, height: 900 }}
            actions={<CTARow primary={CTA_PRIMARY} outlines={CTA_OUTLINES} />}
            trustSlot={<TrustBadgeRow items={TRUST_ITEMS} />}
            specStrip={
              <SpecStrip
                eyebrow="PUF PANEL"
                items={[
                  { label: '', value: 'PRICE FROM ₹1,050/m²' },
                  { label: '', value: 'THICKNESS 30–80 mm' },
                  { label: '', value: 'EX-GST' },
                  { label: '', value: 'PAN-INDIA DELIVERY' },
                ]}
              />
            }
          />
        </Section>

        {/* 2 — CATEGORY GRID (mist) */}
        <Section heading="What We Manufacture" background="mist">
          <div style={gridAuto}>
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.title} title={c.title} description={c.description} href="#" image={{ src: c.src, alt: c.title, width: c.w, height: c.h }} />
            ))}
          </div>
        </Section>

        {/* 3 — PRICE TABLE (paper) */}
        <Section heading="PUF Panel Prices" background="paper">
          <SpecTable
            labelHeading="Thickness"
            valueHeading="Price per m² (ex-GST)"
            rows={[
              { label: '30 mm', value: '₹1,050' },
              { label: '40 mm', value: '₹1,150' },
              { label: '50 mm', value: '₹1,250' },
              { label: '60 mm', value: '₹1,330' },
              { label: '80 mm', value: '₹1,470' },
            ]}
          />
          <p style={{ marginTop: '0.75rem', fontSize: 'var(--ds-text-small-size)', color: 'var(--ds-text-secondary)' }}>
            Prices confirmed at quotation. Customisations quoted separately.
          </p>
        </Section>

        {/* 4 — PROCESS (mist) */}
        <Section heading="How It Works" background="mist">
          <ProcessSteps
            steps={[
              { title: 'Share Requirement' },
              { title: 'Drawing & Quotation' },
              { title: 'Factory Production' },
              { title: 'Dispatch' },
              { title: 'Site Installation' },
            ]}
          />
        </Section>

        {/* 5 — TRUST (paper) */}
        <Section heading="A Manufacturer You Can Verify" background="paper">
          {stack(
            <>
              <div style={gridAuto}>
                <CredentialCard name="ZED Bronze" regNumber="27022025_429647" icon={<ShieldIcon />} />
                <CredentialCard name="Udyam" regNumber="UDYAM-KR-03-0172770" icon={<RegIcon />} />
                <CredentialCard name="DPIIT" regNumber="DIPP56005" icon={<CertificateIcon />} />
              </div>
              <GSTRegistrationCard entries={GST_ENTRIES} />
              <div style={gridAuto}>
                <TestimonialCard quote="SAMPLE — placeholder testimonial; a real customer quote will replace this." name="Placeholder Customer (SAMPLE)" designation="SAMPLE" company="SAMPLE" />
                <TestimonialCard quote="SAMPLE — placeholder testimonial; a real customer quote will replace this." name="Placeholder Customer (SAMPLE)" designation="SAMPLE" company="SAMPLE" />
              </div>
              {stack(
                <>
                  <DeliveryLogRow project="Site Office Delivery (SAMPLE)" city="Bangalore" size="20 × 10 ft" deliveryDays={12} photo={{ src: '/40x8-container-office-rental-bangalore.png', alt: 'SAMPLE delivery', width: 1024, height: 1024 }} />
                  <DeliveryLogRow project="Container Office (SAMPLE)" city="Chennai" size="40 × 8 ft" deliveryDays={15} photo={{ src: '/20x10-site-office-cabin-bangalore.png', alt: 'SAMPLE delivery', width: 1024, height: 1024 }} />
                  <DeliveryLogRow project="Security Cabin (SAMPLE)" city="Hyderabad" size="6 × 4 ft" deliveryDays={7} photo={{ src: '/images/products/security-cabins/frp-security-cabin-02.webp', alt: 'SAMPLE delivery', width: 1200, height: 1200 }} />
                </>,
                '0.75rem',
              )}
            </>,
          )}
        </Section>

        {/* 6 — FAQ (mist) */}
        <Section heading="Common Questions" background="mist">
          <FAQAccordion
            emitJsonLd
            items={[
              { question: 'What is the PUF panel price per square metre?', answer: 'PUF panel prices start at ₹1,050/m² for 30 mm and go up to ₹1,470/m² for 80 mm, ex-GST. Final price is confirmed at quotation.' },
              { question: 'What warranty does SAMAN Portable provide?', answer: '5–10 years, confirmed at quotation based on the product and specification.' },
              { question: 'Where does SAMAN deliver?', answer: 'Pan-India, from two factories: Bangalore (South) and Greater Noida (North).' },
              { question: 'How do I get a price?', answer: 'Use the Price Calculator, request a quote online, or call +91 97089 89937.' },
              { question: 'Can cabins be customised?', answer: 'Yes — doors, windows, partitions, AC provision, toilets, pantry and electrical load are customised per requirement and quoted separately.' },
            ]}
          />
        </Section>

        {/* 7 — ZONE CONTACTS (paper) */}
        <Section heading="Talk to Your Zone" background="paper">
          <div style={gridAuto}>
            <ZoneContactCard zone="south" office="SAMAN South (Bangalore)" phone="+91 88616 22859" phoneHref="tel:+918861622859" email="sales@samanportable.com" />
            <ZoneContactCard zone="north" office="SAMAN North (Greater Noida)" phone="+91 87960 39938" phoneHref="tel:+918796039938" email="ncr@samanportable.com" />
          </div>
        </Section>

        {/* 8 — CLOSING CTA (forest, full-bleed) */}
        <CTABlock
          tone="inverse"
          title="Share your size and site location. Get a clear quotation."
          actions={<CTARow primary={CTA_PRIMARY} outlines={CTA_OUTLINES} tone="onDark" />}
        />

        <StickyMobileBar callHref="tel:+919708989937" whatsappHref="https://wa.me/919708989937" calculatorHref="#calc" />
      </PageShell>
    </>
  );
}
