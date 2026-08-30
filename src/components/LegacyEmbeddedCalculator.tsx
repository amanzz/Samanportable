import Head from 'next/head';
import { useMemo } from 'react';
import type { EmbeddedCalculatorProduct } from '@/lib/cabinCalculatorEmbedRoutes';
import { makeCalculatorPageUrl } from '@/lib/cabinCalculatorEmbedRoutes';
import { renderCabinCalculatorSSR, renderCalculatorEntrySection } from '@/lib/cabinCalculatorSSR';

type LegacyEmbeddedCalculatorProps = {
  category: string;
  mapping: EmbeddedCalculatorProduct;
  productName: string;
};

/** Preserve the established SSR calculator on every non-PC-01 category hub. */
export default function LegacyEmbeddedCalculator({
  category,
  mapping,
  productName,
}: LegacyEmbeddedCalculatorProps) {
  const entryHtml = useMemo(() => {
    if (!mapping.prefill || !mapping.productId) return null;
    return renderCalculatorEntrySection({
      productId: mapping.productId,
      productName,
      ladderKey: mapping.ladderKey,
    });
  }, [mapping, productName]);

  const calculatorHtml = useMemo(() => renderCabinCalculatorSSR({
    embedded: true,
    ...(mapping.prefill && mapping.productId
      ? {
          config: { productId: mapping.productId },
          ladderKey: mapping.ladderKey,
          productName,
        }
      : {}),
    pageUrl: makeCalculatorPageUrl(category),
  }), [category, mapping, productName]);

  return (
    <>
      <Head>
        <script defer src="/scripts/cabin-cost-calculator.js" />
      </Head>
      {entryHtml && <div dangerouslySetInnerHTML={{ __html: entryHtml }} />}
      <section className="mt-4" id="cabin-calculator">
        <div dangerouslySetInnerHTML={{ __html: calculatorHtml }} />
      </section>
    </>
  );
}
