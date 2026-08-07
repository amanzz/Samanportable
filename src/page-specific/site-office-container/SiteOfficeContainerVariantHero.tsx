'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { PortaCabinVariantHero } from '@/components/product-variant-hero/PortaCabinVariantHero';
import type { VariantProductData } from '@/components/product-variant-hero/types';
import { formatIndianPrice } from '@/components/product-variant-hero/types';
import { dsCssVariables } from '@/components/ds/tokens';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RelatedRailItem } from '@/lib/c16PanelCatalog';
import applicationsJson from '@/data/products/site-office-container-applications.json';

const EnquiryDialog = dynamic(() => import('@/components/EnquiryDialog'), { ssr: false });

interface ApplicationPanel {
  sizeSlug: string;
  h3: string;
  paragraph: string;
  applications: string[];
}

interface ApplicationsData {
  h2: string;
  guidanceLine: string;
  panels: ApplicationPanel[];
}

interface SiteOfficeContainerVariantHeroProps {
  data: VariantProductData;
  productTitle: string;
  averageRating: string;
  ratingCount: number;
  railItems: RelatedRailItem[];
  currentHref: string;
}

const applications = applicationsJson as ApplicationsData;
const DETAILS_HASH_RE = /^#sizedetails-([0-9]+x[0-9]+)$/;
const SECTION_ID = 'site-office-size-applications';
const rewriteVisiblePunctuation = (value: string, heading = false) =>
  value.replace(/\s*\u2014\s*/g, heading ? ': ' : ', ');

export function SiteOfficeContainerVariantHero(
  props: SiteOfficeContainerVariantHeroProps
) {
  return (
    <>
      <PortaCabinVariantHero {...props} />
      <SiteOfficeApplicationsExplorer data={props.data} />
    </>
  );
}

function SiteOfficeApplicationsExplorer({ data }: { data: VariantProductData }) {
  const defaultIndex = Math.max(
    0,
    data.variants.findIndex((variant) => variant.sizeSlug === data.defaultVariant)
  );
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [quoteIndex, setQuoteIndex] = useState(defaultIndex);
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    const match = window.location.hash.match(DETAILS_HASH_RE);
    if (!match) return;
    const index = data.variants.findIndex((variant) => variant.sizeSlug === match[1]);
    if (index < 0) return;
    setActiveIndex(index);
    window.requestAnimationFrame(() => {
      document.getElementById(SECTION_ID)?.scrollIntoView({ block: 'start' });
    });
  }, [data.variants]);

  const selectTab = (index: number) => {
    setActiveIndex(index);
    window.history.replaceState(
      null,
      '',
      `#sizedetails-${data.variants[index].sizeSlug}`
    );
  };

  const openQuote = (index: number) => {
    setQuoteIndex(index);
    setShowEnquiry(true);
  };

  const panelBySlug = new Map(
    applications.panels.map((panel) => [panel.sizeSlug, panel])
  );

  return (
    <section
      id={SECTION_ID}
      className="mb-4 scroll-mt-20"
      data-site-office-explorer=""
      aria-labelledby="site-office-size-applications-heading"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `[data-site-office-explorer]{${dsCssVariables()}}`,
        }}
      />

      <div className="mb-4">
        <h2
          id="site-office-size-applications-heading"
          className="text-xl font-bold text-[var(--ds-color-forest)] sm:text-2xl"
        >
          {rewriteVisiblePunctuation(applications.h2, true)}
        </h2>
        <p className="mt-1 text-sm text-[var(--ds-color-steel)]">
          {rewriteVisiblePunctuation(applications.guidanceLine)}
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Site Office Container sizes"
        className="flex gap-1 overflow-x-auto border-b border-[var(--ds-color-border)]"
      >
        {data.variants.map((variant, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={variant.sizeSlug}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`site-office-app-panel-${variant.sizeSlug}`}
              id={`site-office-app-tab-${variant.sizeSlug}`}
              onClick={() => selectTab(index)}
              className={cn(
                '-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-semibold transition-colors',
                selected
                  ? 'border-[var(--ds-color-leaf)] text-[var(--ds-color-forest)]'
                  : 'border-transparent text-[var(--ds-color-steel)] hover:text-[var(--ds-color-forest)]'
              )}
            >
              {variant.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid">
        {data.variants.map((variant, index) => {
          const panel = panelBySlug.get(variant.sizeSlug);
          if (!panel) return null;
          const rate = data.pricePerSqft?.[variant.sizeSlug];
          const image = variant.images?.[0];

          return (
            <div
              key={variant.sizeSlug}
              id={`site-office-app-panel-${variant.sizeSlug}`}
              role="tabpanel"
              aria-labelledby={`site-office-app-tab-${variant.sizeSlug}`}
              aria-hidden={index !== activeIndex}
              className={cn(
                '[grid-area:1/1] flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-10',
                index === activeIndex ? 'visible' : 'invisible pointer-events-none'
              )}
            >
              <div className="lg:w-[44%]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--ds-color-border)] bg-[var(--ds-color-mist)]">
                  {index === activeIndex && image ? (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 1023px) calc(100vw - 34px), 500px"
                      loading="lazy"
                      decoding="async"
                      unoptimized
                    />
                  ) : null}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center lg:justify-between">
                <h3 className="text-lg font-bold text-[var(--ds-color-ink)] sm:text-xl">
                  {rewriteVisiblePunctuation(panel.h3, true)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ds-color-steel)]">
                  {rewriteVisiblePunctuation(panel.paragraph)}
                </p>

                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {panel.applications.map((application) => (
                    <li
                      key={application}
                      className="flex items-start gap-2 text-sm text-[var(--ds-color-ink)]"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ds-color-leaf)]"
                        aria-hidden="true"
                      />
                      <span>{rewriteVisiblePunctuation(application)}</span>
                    </li>
                  ))}
                </ul>

                <div>
                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--ds-color-steel)]">
                    <span className="font-medium text-[var(--ds-color-ink)]">
                      {variant.dims}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{variant.areaSqft} sq ft</span>
                    <span aria-hidden="true">·</span>
                    <span>{variant.capacity}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold text-[var(--ds-color-forest)]">
                      {formatIndianPrice(variant.priceExGst as number)} + GST
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>₹{rate}/sq ft</span>
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      className="bg-[var(--ds-color-leaf)] text-white hover:bg-[var(--ds-color-forest)]"
                      onClick={() => openQuote(index)}
                    >
                      Get Quote
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <EnquiryDialog
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        prefillMessage={`Enquiry for ${data.variants[quoteIndex].label} Site Office Container`}
      />
    </section>
  );
}

export default SiteOfficeContainerVariantHero;
