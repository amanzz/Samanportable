import Layout from '@/components/Layout';
import CabinCostCalculatorV9 from '@/components/calculator/CabinCostCalculatorV9';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { siteConfig } from '@/config/seo';

const title = 'Cabin Cost Calculator │ Instant Price Estimate │ SAMAN';
const description = 'Build a live estimate for your portable cabin. Enter any size, choose finishes, doors, electricals and add-ons, and get a fixed quotation within 48 hours.';
const canonical = `${siteConfig.url}/cabin-cost-calculator`;

const faqs = [
  {
    question: 'Is the calculator price final?',
    answer: 'No. It is an indicative estimate from our published price list. Your fixed quotation arrives within 48 hours and is the figure we stand behind.',
  },
  {
    question: 'Can I price a custom size?',
    answer: 'Yes. Enter any length and width in feet; the price follows the same published formula that sets our standard nine sizes.',
  },
  {
    question: 'Does the price include GST and transport?',
    answer: 'GST at 18 percent is always shown separately. Transport is estimated from our freight ladder by distance and confirmed in the quotation; Bangalore city and Delhi NCR are free-delivery zones.',
  },
  {
    question: 'What warranty applies?',
    answer: '5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: 'Cabin Cost Calculator',
      description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': `${siteConfig.url}/#website` },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ],
};

export default function CabinCostCalculatorPage() {
  return (
    <Layout>
      <UnifiedSEO
        rankMathSEO={{ title, description, canonical }}
        fallbackTitle={title}
        fallbackDescription={description}
        fallbackCanonical={canonical}
        structuredData={structuredData}
      />
      <main className="min-h-screen bg-background text-foreground">
        <CabinCostCalculatorV9 />
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6" aria-labelledby="calculator-copy-title">
          <div className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div>
              <h2 id="calculator-copy-title" className="text-2xl font-bold">What this calculator does</h2>
              <p className="mt-3 leading-7 text-muted-foreground">This tool builds a live estimate for a SAMAN portable cabin from our published price list. Pick the product, enter any size in feet, choose the structure, finishes, doors, windows, electrical items and add-ons, and the estimate updates line by line as you select. Every base price comes from the same price list our product pages publish, transport follows our freight ladder, and branded third-party items are shown at current vendor rates plus a 5 percent handling margin.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">What the estimate is and is not</h2>
              <p className="mt-3 leading-7 text-muted-foreground">The figure you see is an indicative ex-factory estimate with GST shown separately. It is not a quotation. When you submit your configuration, our sales team verifies it against your drawing and location and returns a fixed, itemised quotation within 48 hours. Delivery runs 7 to 21 working days across India from our Bengaluru and Greater Noida works.</p>
            </div>
            <section aria-labelledby="calculator-faq-title">
              <h2 id="calculator-faq-title" className="text-2xl font-bold">Cabin cost calculator FAQs</h2>
              <dl className="mt-4 space-y-5">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="font-semibold">{faq.question}</dt>
                    <dd className="mt-1 leading-7 text-muted-foreground">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </section>
      </main>
    </Layout>
  );
}
