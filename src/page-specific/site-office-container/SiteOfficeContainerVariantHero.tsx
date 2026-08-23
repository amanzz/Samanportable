'use client';

import { PortaCabinVariantHero } from '@/components/product-variant-hero/PortaCabinVariantHero';
import type { VariantProductData } from '@/components/product-variant-hero/types';
import type { RelatedRailItem } from '@/lib/c16PanelCatalog';

interface SiteOfficeContainerVariantHeroProps {
  data: VariantProductData;
  productTitle: string;
  averageRating: string;
  ratingCount: number;
  railItems: RelatedRailItem[];
  currentHref: string;
}

export function SiteOfficeContainerVariantHero(
  props: SiteOfficeContainerVariantHeroProps
) {
  return (
    <PortaCabinVariantHero
      {...props}
      showSectionDividers
      usePremiumSizeTabs
      explorerPanelHeadingAsH2
      sizeEyebrowText="Choose your size - six factory-built options"
      emitSizeAnchors
    />
  );
}

export default SiteOfficeContainerVariantHero;
