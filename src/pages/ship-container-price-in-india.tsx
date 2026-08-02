import Link from 'next/link';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';

const TITLE = 'Ship Container Price in India 2026 │ Size-Wise Guide │ SAMAN';
const DESCRIPTION = 'Ship container price in India explained size by size, new fabricated container-form units versus used ISO boxes, and what converts a shell into a usable building.';
const CANONICAL = 'https://www.samanportable.com/ship-container-price-in-india';

const FAQS = [
  {
    question: 'What does a used 20 ft shipping container cost in India?',
    answer: 'Used ISO boxes trade on condition, age and distance from port, and the box arrives unfit to occupy; conversion work usually exceeds the shell price. Get the delivered, converted total before comparing it with a fabricated unit.',
  },
  {
    question: 'Is a new container-form building costlier than a used box?',
    answer: 'Once conversion is honestly priced, the fabricated unit is usually level or cheaper, and it carries our published price, specification and warranty rather than a one-off rebuild.',
  },
  {
    question: 'What do SAMAN container-form units cost?',
    answer: 'Published ex-GST prices start at Rs 2,52,960 for the 160 sq ft affordable home unit, with homes running to Rs 9,53,760 and offices on their own ladders; GST 18 percent is shown separately.',
  },
  {
    question: 'Does the price include delivery?',
    answer: 'Bangalore city and Delhi NCR are free-delivery zones; elsewhere transport follows our published freight ladder by distance and trailer length, confirmed in the fixed quotation.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${CANONICAL}#faq`,
  mainEntity: FAQS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
};

export default function ShipContainerPriceInIndiaPage() {
  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={TITLE}
        fallbackDescription={DESCRIPTION}
        fallbackCanonical={CANONICAL}
        structuredData={faqSchema}
      />

      <main className="bg-slate-50 py-10 sm:py-14">
        <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-5 py-8 shadow-sm sm:px-10 sm:py-10">
          <h1 className="text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl">
            Ship Container Price in India: What Steel Space Really Costs
          </h1>

          <div className="mt-7 space-y-5 text-base leading-8 text-slate-700">
            <p>The ship container price in India depends on one question buyers rarely ask first: are you pricing a used ISO cargo box, or a newly fabricated container-form building? They are different products with different economics, and most price confusion online comes from mixing them.</p>

            <p>A used 20 ft ISO cargo container typically trades in India on condition, age and port proximity, and the box alone is only the start; it arrives uninsulated, unlined, unwired and unfit to occupy. Cutting openings, framing them, insulating, lining, flooring and wiring a used box is real fabrication work, and by the end the shell is often the smallest line on the bill.</p>

            <p>A newly fabricated container-form unit prices differently because it is built as a building from the first weld. At SAMAN, published container-form prices start at Rs 2,52,960 ex-GST for a 160 sq ft <Link className="font-semibold text-emerald-800 underline underline-offset-2" href="/product/container-houses/affordable-container-homes">affordable home unit</Link> and Rs 2,93,440 for the <Link className="font-semibold text-emerald-800 underline underline-offset-2" href="/product/container-houses">standard container house</Link>, rising by size and specification to Rs 9,53,760 for the 480 sq ft luxury villa build. <Link className="font-semibold text-emerald-800 underline underline-offset-2" href="/product/container-offices">Offices in container form</Link> follow their own published ladders. Every unit leaves our Bengaluru or Greater Noida works insulated with glasswool, lined, wired and ready for its use, which is why the fabricated route usually costs less than a <Link className="font-semibold text-emerald-800 underline underline-offset-2" href="/2nd-hand-containers">used box plus honest conversion</Link>, and always costs less surprise.</p>

            <p>Transport is the other real number: our freight ladder runs by road distance and trailer length, with Bangalore city and Delhi NCR as free-delivery zones. GST at 18 percent applies to either route and is always shown separately in our pricing.</p>

            <p>If you are pricing a shell for storage, buy the cheapest sound box near a port. If you are pricing space people will occupy, price the finished building, not the container; that number is on our product pages, published to the rupee, and confirmed as a fixed quotation within 48 hours.</p>
          </div>

          <section className="mt-10 border-t border-slate-200 pt-8" aria-labelledby="ship-container-price-faqs">
            <h2 id="ship-container-price-faqs" className="text-2xl font-bold text-emerald-950">FAQs</h2>
            <div className="mt-5 space-y-6">
              {FAQS.map(({ question, answer }) => (
                <div key={question}>
                  <h3 className="text-lg font-semibold text-slate-900">{question}</h3>
                  <p className="mt-2 leading-7 text-slate-700">{answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
    </Layout>
  );
}
