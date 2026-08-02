import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { siteConfig } from '@/config/seo';

const title = 'Cabin Cost Calculator │ Instant Price Estimate │ SAMAN';
const description = 'Build a live estimate for your portable cabin. Enter any size, choose finishes, doors, electricals and add-ons, and get a fixed quotation within 48 hours.';
const canonical = `${siteConfig.url}/cabin-cost-calculator`;

const faqs = [
  ['Is the calculator price final?', 'No. It is an indicative estimate from our published price list. Your fixed quotation arrives within 48 hours and is the figure we stand behind.'],
  ['Can I price a custom size?', 'Yes. Enter any length and width in feet; the price follows the same published formula that sets our standard nine sizes.'],
  ['Does the price include GST and transport?', 'GST at 18 percent is always shown separately. Transport is estimated from our freight ladder by distance and confirmed in the quotation; Bangalore city and Delhi NCR are free-delivery zones.'],
  ['What warranty applies?', '5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation.'],
] as const;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: 'Cabin Cost Calculator', description, inLanguage: 'en-IN' },
    { '@type': 'FAQPage', mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
  ],
};

type Props = { calculatorHtml: string };

const estimateReference = () => {
  const now = new Date();
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now).replace(/-/g, '');
  return `SP-EST-${date}-${String(now.getTime() % 1000).padStart(3, '0')}`;
};

export const config = { unstable_runtimeJS: false };

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { renderCabinCalculatorSSR } = await import('@/lib/cabinCalculatorSSR');
  return {
    props: {
      calculatorHtml: renderCabinCalculatorSSR({
        query,
        reference: estimateReference(),
        pageUrl: '/cabin-cost-calculator',
        submissionStatus: query.submitted === '1' ? 'success' : query.submit_error === '1' ? 'failure' : undefined,
      }),
    },
  };
};

export default function CabinCostCalculatorPage({ calculatorHtml }: Props) {
  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script defer src="/scripts/cabin-cost-calculator.js" />
      </Head>
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h1 className="mb-5 text-3xl font-bold sm:text-4xl">Cabin Cost Calculator</h1>
          <div dangerouslySetInnerHTML={{ __html: calculatorHtml }} />
        </div>
      </main>
    </Layout>
  );
}
