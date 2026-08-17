'use client';
// T24.1 FINAL HERO LAYOUT (supersedes all prior hero-layout revisions).
// Desktop >=1024: THREE columns, one row, equal bottom edges (T28 universal
// rule) — related rail 25 / gallery 40 / info-only buy box 35. The gallery
// column's natural height drives the row; both side columns are full-height
// shells whose content scrolls internally on overflow (.t28-rail-scroll),
// exactly like ProductSummaryLayout variant="summary-first".
// Mobile <1024 (stacked): image+thumbs -> zone contacts -> buy-box info ->
// compare-table cards -> related products LAST; sticky bottom bar keeps the
// price + solid "Get a Quote" (the mobile conversion path).
// Interactive chip/gallery swap is the ONLY client state (T0 rule). Pages
// Router — full SSR HTML on first load; 'use client' is documentation-only,
// matching ds/SizeVariantChips.tsx.
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Download, Play, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { shouldBypassOptimizer } from '@/lib/imageSrc';
import { dsCssVariables } from '@/components/ds/tokens';
import ProductZoneCtas from '@/components/product/ProductZoneCtas';
import RelatedProductRail from '@/components/product/RelatedProductRail';
import type { RelatedRailItem } from '@/lib/c16PanelCatalog';
import type { VariantImage, VariantProductData } from './types';
import { formatIndianPrice } from './types';
import { getVariantPreset, resolveVariantProductName, resolveVariantVideo } from './presets';
import portaCabinsApplications from '@/data/products/porta-cabins-applications.json';
import msPortaCabinApplications from '@/data/products/ms-porta-cabin-applications.json';
import fireRatedPortaCabinApplications from '@/data/products/fire-rated-porta-cabin-applications.json';
import pufPortaCabinApplications from '@/data/products/puf-porta-cabin-applications.json';
import portaCabinWithToiletApplications from '@/data/products/porta-cabin-with-toilet-applications.json';
import soundproofPortaCabinApplications from '@/data/products/soundproof-porta-cabin-applications.json';
import giPortaCabinApplications from '@/data/products/gi-porta-cabin-applications.json';
import doubleStoryPortaCabinApplications from '@/data/products/double-story-porta-cabin-applications.json';
import skidMountedPortaCabinApplications from '@/data/products/skid-mounted-porta-cabin-applications.json';
import knockDownPortaCabinApplications from '@/data/products/knock-down-porta-cabin-applications.json';
import portaCabinShopApplications from '@/data/products/porta-cabin-shop-applications.json';
import laborColonyApplications from '@/data/products/labor-colony-applications.json';
import laborHutmentsApplications from '@/data/products/labor-hutments-applications.json';
import prefabSiteCanteenApplications from '@/data/products/prefab-site-canteen-applications.json';
import oilFieldCampApplications from '@/data/products/oil-field-camp-applications.json';
import portableShopCabinApplications from '@/data/products/portable-shop-cabin-applications.json';
import portableCabinApplications from '@/data/products/portable-cabin-applications.json';
import containerOfficesApplications from '@/data/products/container-offices-applications.json';
import portableOfficeApplications from '@/data/products/portable-office-applications.json';
import portableCabinWithToiletApplications from '@/data/products/portable-cabin-with-toilet-applications.json';
import containerCafeApplications from '@/data/products/container-cafe-applications.json';
import containerRestaurantApplications from '@/data/products/container-restaurant-applications.json';
import foodTruckContainersApplications from '@/data/products/food-truck-containers-applications.json';
import containerHotelApplications from '@/data/products/container-hotel-applications.json';
import modularContainerCafeApplications from '@/data/products/modular-container-cafe-applications.json';
import containerCoffeeShopApplications from '@/data/products/container-coffee-shop-applications.json';
import sectionHDatasets from '@/data/products/section-h-datasets.json';
import c08SectionHDatasets from '@/data/products/c08-section-h-datasets.json';
import { pushDataLayer } from '@/lib/analytics';
import RightToExist, { hasRightToExistEntry } from './RightToExist';

interface ApplicationPanel {
  sizeSlug: string;
  h3: string;
  paragraph: string;
  /** PC-02 revision v1.2 (14 Aug 2026) — second body paragraph, for the owner's
      Shape A variant section (H2 + two paragraphs). Absent on every dataset that
      predates the rule, so their panels render one paragraph exactly as before.
      Shape B (H2 + one paragraph + 3 to 5 bullets) leaves this unset and uses
      `applications` instead. */
  paragraph2?: string;
  applications: string[];
  /** Sub-heading above the applications list. Present only in the T25 Section H
      drop (its per-panel `h3`); the flagship dataset has no equivalent. */
  applicationsHeading?: string;
  /** Owner-authored alt for this panel's photo. Present only where the approved
      copy specifies one (C-02 with-toilet §H → the copy-pack §E exterior template).
      Absent everywhere else → the derived application alt is used, unchanged. */
  imageAlt?: string;
  /** Optional owner-approved image for this explorer panel. It does not populate
      the product gallery and is used only in the active size tab. */
  image?: VariantImage;
  /** Visible tab-strip label from the copy pack. Falls back to the variant's own
      size label when the pack supplies none. */
  tabLabel?: string;
}
interface ApplicationsData {
  /** Section-level heading + intro. The flagship dataset carries them; the T25
      Section H drop is panel-only, so both are optional and their markup is
      omitted rather than invented when absent. */
  h2?: string;
  intro?: string;
  panels: ApplicationPanel[];
}

/**
 * T25 Section H drop — `{slug: {h2?, guidanceLine?, sizeSlug: {h2, intro, h3, applications[4]}}}`.
 * Field mapping (the drop is panel-scoped, the component is section-scoped):
 *   section h2             -> optional section heading
 *   section guidanceLine   -> optional section intro
 *   panel h2               -> panel heading (renders where the flagship renders h3)
 *   panel intro            -> panel paragraph
 *   panel h3               -> applications sub-heading (new slot)
 *   panel applications     -> the 4 checkmark items; [0] also feeds the panel image alt
 */
type SectionHPanel = {
  h2: string;
  intro: string;
  h3: string;
  applications: string[];
  imageAlt?: string;
  /** Visible tab-strip label. Optional: a pack that supplies one has written it
      to its own L13 band, so it is used verbatim; a pack that supplies none
      keeps the variant's own size label and renders byte-identically. */
  tab?: string;
};
type SectionHDataset = Record<string, SectionHPanel | string>;
const fromSectionHDrop = (dataset: SectionHDataset): ApplicationsData => ({
  ...(typeof dataset.h2 === 'string' ? { h2: dataset.h2 } : {}),
  ...(typeof dataset.guidanceLine === 'string' ? { intro: dataset.guidanceLine } : {}),
  panels: Object.entries(dataset).flatMap(([sizeSlug, panel]) =>
    typeof panel === 'string'
      ? []
      : [{
          sizeSlug,
          h3: panel.h2,
          paragraph: panel.intro,
          applications: panel.applications,
          applicationsHeading: panel.h3,
          ...(panel.imageAlt ? { imageAlt: panel.imageAlt } : {}),
          ...(panel.tab ? { tabLabel: panel.tab } : {}),
        }]
  ),
});

// T25 — Size & Applications Explorer copy, registered per dataset key. The key is
// `applicationsDataset` from the data file, else the preset's, else productSlug.
// A product with NO entry here renders NO explorer at all (see
// SizeApplicationsExplorer's null return): the per-slug applications copy is
// owner-authored and must never be substituted with another product's text.
const APPLICATIONS_DATASETS: Record<string, ApplicationsData> = {
  'porta-cabins': portaCabinsApplications as ApplicationsData,
  // C-02 portable-shop-cabin — same shape as the porta-cabins dataset, so it renders
  // through the identical SizeApplicationsExplorer. Resolved via productSlug (the data
  // file sets no applicationsDataset override), and additive → porta-cabins unaffected.
  'portable-shop-cabin': portableShopCabinApplications as ApplicationsData,
  // C-02 portable-cabin HUB — same dataset shape → identical SizeApplicationsExplorer.
  // Resolves via productSlug; additive, so porta-cabins/shop-cabin are unaffected.
  'portable-cabin': portableCabinApplications as ApplicationsData,
  // C-04 container-offices HUB — same dataset shape → identical SizeApplicationsExplorer.
  // Resolves via productSlug; additive, so the porta-cabin cluster is unaffected.
  'container-offices': containerOfficesApplications as ApplicationsData,
  // C-03 portable-office HUB — same dataset shape → identical SizeApplicationsExplorer.
  // Resolves via the preset's applicationsDataset key; additive, so every other
  // product's explorer is unaffected.
  'portable-office': portableOfficeApplications as ApplicationsData,
  // C-02 portable-cabin-with-toilet — §H drop (Fable 5, 25 Jul), same dataset shape
  // → identical SizeApplicationsExplorer. Resolves via productSlug; additive.
  'portable-cabin-with-toilet': portableCabinWithToiletApplications as ApplicationsData,
  // C-05 container-cafe HUB — §6 of the 08 Aug draft of record, same dataset shape
  // → identical SizeApplicationsExplorer. Resolves via the preset's
  // applicationsDataset key; additive, so every other product's explorer is
  // unaffected. Six panels, one per published size. The 20x8 panel carries no
  // image (Fable 5 Ruling 2, Option B: no 20x8 render exists in the converted C-05
  // set), so it renders the component's existing on-request placeholder.
  'container-cafe': containerCafeApplications as ApplicationsData,
  // C-05 subpages — section 3 of their 08 Aug drafts of record. Same dataset shape as
  // the hub. Sizes with no renders (restaurant: 20x8 / 40x8 / 40x12; food truck: 20x8)
  // carry no images and fall to the component's existing on-request placeholder.
  'container-restaurant': containerRestaurantApplications as ApplicationsData,
  'food-truck-containers': foodTruckContainersApplications as ApplicationsData,
  'container-hotel': containerHotelApplications as ApplicationsData,
  'modular-container-cafe': modularContainerCafeApplications as ApplicationsData,
  'container-coffee-shop': containerCoffeeShopApplications as ApplicationsData,
  ...Object.fromEntries(
    Object.entries(sectionHDatasets as Record<string, SectionHDataset>).map(
      ([slug, dataset]) => [slug, fromSectionHDrop(dataset)]
    )
  ),
  ...Object.fromEntries(
    Object.entries(c08SectionHDatasets as Record<string, SectionHDataset>).map(
      ([slug, dataset]) => [slug, fromSectionHDrop(dataset)]
    )
  ),
  // PC-01 ms-porta-cabin — §4 SECTION 3 of the approved MS build ticket. Six
  // panels, one per published size, each carrying its own explorer image and alt.
  // The approved copy supplies no application bullets and no section heading or
  // intro, so neither is invented: the component omits both.
  //
  // Registered AFTER the two Section-H spreads on purpose. `section-h-datasets.json`
  // still carries a stale T25-era `ms-porta-cabin` drop written against the old
  // nine-size ladder; an earlier key would be silently overwritten by that spread,
  // which is exactly what happened on the first build of this page. Only this slug
  // is re-bound, so every other Section-H page keeps its drop.
  'ms-porta-cabin': msPortaCabinApplications as ApplicationsData,
  // PC-05 fire-rated-porta-cabin — copy pack v2 §1 V1-V6. Six panels, Shape A
  // (H2 + two paragraphs, V1-V4: no bullets) or Shape B (H2 + one paragraph +
  // 4 bullets, V5/V6). No stale Section-H drop exists for this slug (checked),
  // so no re-registration-after-spread trap applies here.
  'fire-rated-porta-cabin': fireRatedPortaCabinApplications as ApplicationsData,
  // PC-07 (15 Aug 2026) — Section 3 of the approved copy pack v1 §4. Six panels,
  // one per published size, checksum-verified H2/body pairs. No application
  // bullets or explorer image were supplied, so neither is invented: the
  // component's own data row (dims/area/price/rate) already carries the
  // "Published size"/"Price" facts, and explorerImageTemplate on the product
  // data file points each panel at that size's front-elevation gallery slot.
  // Registered AFTER both Section-H spreads for the same reason as every
  // sibling above: a stale same-slug drop would silently overwrite an earlier
  // key (the failure PC-01 hit on ms-porta-cabin).
  'puf-porta-cabin': pufPortaCabinApplications as ApplicationsData,
  // PC-04 porta-cabin-with-toilet — Section 3 of the approved draft v2. Six panels,
  // one per published size. The approved copy supplies no section heading or intro,
  // so neither is invented. Panels carry no explicit image: the product data file's
  // `explorerImageTemplate` points each panel at that size's Block E front-angle
  // slot, so the panel alt resolves to that image's approved Block E alt.
  //
  // Registered AFTER the two Section-H spreads for the same reason as the MS key
  // above: `section-h-datasets.json` still carries a stale `porta-cabin-with-toilet`
  // drop written against the retired nine-size ladder, and an earlier key would be
  // silently overwritten by that spread.
  'porta-cabin-with-toilet': portaCabinWithToiletApplications as ApplicationsData,
  // PC-02 gi-porta-cabin — Section 3 of the approved GI build ticket. Six panels,
  // one per published size, carrying that size's approved H2 and body. The approved
  // copy supplies no application bullets, no section heading and no intro, and the
  // 42-slot image manifest has no Explorer image, so none of the three is invented:
  // the component omits the list, the heading and the picture.
  //
  // Registered AFTER both Section-H spreads on purpose. `gi-porta-cabin` carries no
  // drop in either file today, but an earlier key would be silently overwritten if
  // one were ever added — the failure mode PC-01 hit on ms-porta-cabin.
  'gi-porta-cabin': giPortaCabinApplications as ApplicationsData,
  // PC-06 soundproof-porta-cabin — Section 3 of copy pack v2, VARIANT_1-6_H2/BODY.
  // Six panels, one per published size, single paragraph each (no bodyParagraph2,
  // no bullets). The 42-slot manifest (36 gallery + 6 description) allocates no
  // dedicated Section-3 image, so each panel reuses that size's own gallery slot 1
  // image and alt, matching the gi-porta-cabin precedent for the identical
  // 42-slot situation. No stale Section-H drop exists for this slug (checked).
  'soundproof-porta-cabin': soundproofPortaCabinApplications as ApplicationsData,
  // PC-03 double-story-porta-cabin - Section 3 of build prompt v2 (12.5). Six panels,
  // one per shipping size, each carrying that size's approved H2 and body plus its lead
  // gallery image. The approved copy supplies no application bullets and no section
  // heading, so neither is invented. Registered AFTER both Section-H spreads for the
  // same reason as the two entries above: an earlier key would be silently overwritten.
  'double-story-porta-cabin': doubleStoryPortaCabinApplications as ApplicationsData,
  // PC-08 (15 Aug 2026) — skid-mounted-porta-cabin, Section 3 of copy pack v1
  // section 4, V1-V6_H2/BODY. Six panels, one per published size, single
  // paragraph each (no bodyParagraph2, no bullets), matching the PC-06/PC-03
  // precedent. The 42-slot manifest allocates no dedicated Section-3 image (36
  // gallery + 1 Section-2 card + 5 Description), so each panel reuses that
  // size's own gallery slot 1 image and alt. No stale Section-H drop exists for
  // this slug (checked), but registered AFTER both Section-H spreads anyway,
  // matching every sibling above.
  'skid-mounted-porta-cabin': skidMountedPortaCabinApplications as ApplicationsData,
  // PC-09 (15 Aug 2026) — knock-down-porta-cabin, copy pack v1 section 4. Six
  // panels, one per published size, single paragraph each (no bullets), same
  // shape as PC-08. No dedicated Section-3 image slot in the 42-slot manifest,
  // so each panel reuses that size's own hero gallery slot-1 (exterior) image
  // and alt, matching the PC-08 precedent exactly. Registered after both
  // Section-H spreads.
  'knock-down-porta-cabin': knockDownPortaCabinApplications as ApplicationsData,
  // PC-10 (15 Aug 2026) — registered AFTER the Section-H spreads and every earlier
  // cluster entry, per the documented PC-01 failure mode (silent key overwrite if
  // registered before them). Six panels, one per published size.
  'porta-cabin-shop': portaCabinShopApplications as ApplicationsData,
  // LC-00 (16 Aug 2026) — labor-colony hub, build prompt v1 section 7. Six
  // panels, one per published size. Registered after every earlier entry, per
  // the documented PC-01 failure mode (silent key overwrite if registered
  // before the Section-H spreads).
  'labor-colony': laborColonyApplications as ApplicationsData,
  // LC-01 (17 Aug 2026) - build prompt v1 section 3. Six panels, one per
  // published size.
  'labor-hutments': laborHutmentsApplications as ApplicationsData,
  'prefab-site-canteen': prefabSiteCanteenApplications as ApplicationsData,
  // LC-03 (17 Aug 2026) - build prompt v1 section 3. Six panels, one per
  // published size. Registered after every earlier entry, per the documented
  // PC-01 failure mode (silent key overwrite if registered before it).
  'oil-field-camp': oilFieldCampApplications as ApplicationsData,
};

const C04_PRODUCT_SLUGS = new Set([
  'container-offices',
  'container-office-cabin',
  'shipping-container-office',
  'site-office-container',
]);

const C08_PRODUCT_SLUGS = new Set([
  'container-houses',
  'prefab-container-homes',
  'luxury-container-houses',
  'shipping-container-homes',
  'affordable-container-homes',
  // E3 ruling 1 (Fable 5, 05 Aug): page six follows the same six-per-size slot
  // rule as its siblings — five in the gallery, row six reserved for Section H.
  'prefabricated-container-house',
]);

/** Gallery track classes, written out in full so Tailwind's scanner emits them. */
const GALLERY_TRACK_CLASS: Record<number, string> = {
  1: 'grid grid-cols-1 gap-2',
  2: 'grid grid-cols-2 gap-2',
  3: 'grid grid-cols-3 gap-2',
  4: 'grid grid-cols-4 gap-2',
  5: 'grid grid-cols-5 gap-2',
  6: 'grid grid-cols-6 gap-2',
};

const productThumbSrc = (src: string): string =>
  src.startsWith('/images/products/')
    ? src.replace('/images/products/', '/images/product-thumbs/')
    : src;

const rewriteC04VisiblePunctuation = (
  value: string | undefined,
  productSlug: string,
  heading = false
) =>
  value && C04_PRODUCT_SLUGS.has(productSlug)
    ? value.replace(/\s*\u2014\s*/g, heading ? ': ' : ', ')
    : value;

// Application-panel alt: "Elevated view of {size} ft {product} used as
// {first application}" — first checkmark lowercased + final word singularised
// (matches the owner's example: "…used as project and site office"). Unique per
// size, and distinct from the gallery alts (page-wide alt uniqueness).
const applicationAlt = (label: string, firstApp: string, productLower: string) => {
  const phrase = (firstApp.charAt(0).toLowerCase() + firstApp.slice(1)).replace(/s$/, '');
  return `Elevated view of ${label.replace('x', '×')} ${productLower} used as ${phrase}`;
};

// "Porta Cabin" -> "Porta cabin". Used where the original copy was sentence-cased
// mid-string; keeps the flagship's aria-labels byte-identical.
const sentenceCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

// Explorer panel image. Prefers an explicit template (`{sizeSlug}` token); with no
// template it derives the path from that size's FIRST gallery image by swapping the
// trailing shot segment — so any product whose assets follow the house naming
// convention works without extra configuration.
const explorerImageSrc = (
  template: string | Record<string, string> | undefined,
  shot: string,
  sizeSlug: string,
  gallerySrc: string | undefined
): string | null => {
  if (typeof template === 'string') return template.replace(/\{sizeSlug\}/g, sizeSlug);
  if (template?.[sizeSlug]) return template[sizeSlug].replace(/\{sizeSlug\}/g, sizeSlug);
  if (!gallerySrc) return null;
  const swapped = gallerySrc.replace(/-[a-z0-9]+-view(\.[a-z0-9]+)$/i, `-${shot}$1`);
  return swapped === gallerySrc ? null : swapped;
};

const EnquiryDialog = dynamic(() => import('@/components/EnquiryDialog'), { ssr: false });

interface PortaCabinVariantHeroProps {
  data: VariantProductData;
  productTitle: string;
  averageRating: string;
  ratingCount: number;
  railItems: RelatedRailItem[];
  currentHref: string;
  /** PC-00 (14 Aug 2026) — opt-in for the four `.saman-section-divider` rules.
      Default false = byte-identical to today on every page. Pass true ONLY from
      the page route that has been rebuilt to the divider spec (currently just
      the porta-cabins hub); every sibling page using this shared component stays
      unaffected until its own rewrite turns this on. */
  showSectionDividers?: boolean;
  /** R3 (14 Aug 2026) — opt-in brand-chip restyle of the size selector, plus its
      eyebrow line. Same blast-radius rule as showSectionDividers: default false,
      hub-only for now. */
  usePremiumSizeTabs?: boolean;
  /** PC-01 (14 Aug 2026) — render the Explorer panel headings as `h2` instead of
      `h3`. Needed only where the approved copy specifies Section-3 headings at H2
      and the section itself carries no H2 of its own (ms-porta-cabin). Default
      false keeps every other page's heading level byte-identical. */
  explorerPanelHeadingAsH2?: boolean;
  /** Ad-hoc revision (14 Aug 2026, owner screenshots) — halves the mobile
      (<1024px) top/bottom margin on the two `.saman-section-divider` rules
      this component renders, from the global 40px to 20px. The global rule
      (and every other page that renders `.saman-section-divider`) is
      untouched; this only overrides the two dividers inside THIS component's
      own `.pc-hero-grid` scope, and only when the flag is on. Default false
      keeps every existing page (including ms-porta-cabin, which already has
      showSectionDividers on) byte-identical; pass true only for
      fire-rated-porta-cabin. */
  compactMobileDividers?: boolean;
  /** PC-04 (14 Aug 2026) — opt-in override for the premium size-selector eyebrow.
      Absent (the default) renders the deployed literal below, which contains an
      em dash, so every other page using `usePremiumSizeTabs` stays byte-identical.
      Set ONLY from a page whose approved copy states a different eyebrow: PC-04's
      draft specifies a hyphen, and its acceptance gate requires zero U+2014 in the
      page's own copy. Fixing the shared literal in place would change the hub and
      the MS page too, so the string is opted into, not edited. */
  sizeEyebrowText?: string;
  /** LC-05 (16 Aug 2026) - opt-in fragment targets for its six required
      `#size-*` deep links. Default false preserves every existing hero. */
  emitSizeAnchors?: boolean;
  /** PC-02 (14 Aug 2026) — suppress the Explorer panel image. The GI page's approved
      manifest is exactly 42 slots (36 gallery + 6 description) and supplies no
      seventh image or alt per size, so Section 3 renders copy-only rather than
      repeating a gallery file or deriving an unapproved alt. Default false keeps
      every other page's Explorer imagery byte-identical. */
  explorerHidePanelImages?: boolean;
  /** LC-05 CWV v2: hold non-LCP images until the active hero has painted.
      Default false preserves the rendered HTML and behaviour of every sibling. */
  deferNonLcpImagesUntilHeroPaint?: boolean;
  /** LC-05 CWV v3: render only the active explorer panel in the initial DOM.
      Default false preserves the crawlable grid-stack markup on every sibling. */
  renderOnlyActiveExplorerPanel?: boolean;
}

// Star row for the review badge (Amendment G v2 — real rating: 4.6 from the 5
// SAMAN-verified reviews only). Renders solely when ratingCount > 0.
const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
  ));

// Deep-linkable size fragments (L12-safe: hash only, NEVER query params — the
// URL path/canonical/sitemap/schema stay identical, zero SEO surface change).
// The hero and the applications explorer are DECOUPLED, each with its own
// fragment namespace: #size-{WxL} (hero) and #sizedetails-{WxL} (explorer).
const sizeFragment = (sizeSlug: string) => `size-${sizeSlug}`;
const detailsFragment = (sizeSlug: string) => `sizedetails-${sizeSlug}`;
const SIZE_HASH_RE = /^#size-([0-9]+x[0-9]+)$/;
const DETAILS_HASH_RE = /^#sizedetails-([0-9]+x[0-9]+)$/;
const APPLICATIONS_SECTION_ID = 'porta-size-applications';

type InternalLinkRow = {
  before: string;
  anchor: string;
  href: string;
  after: string;
};

type InternalLinkModule = {
  heading: string;
  rows: InternalLinkRow[];
};

/**
 * UNUSED DRAFT — retained verbatim after SAMAN's exact porta-cabins parity ruling.
 * Do not render this copy in the product hero.
 */
export const PORTABLE_OFFICE_LINK_MODULES: Record<string, InternalLinkModule> = {
  'portable-office': {
    heading: 'Which portable office build fits the job',
    rows: [
      {
        before: 'Where the specification is fixed and the build already done, ',
        anchor: 'an off-the-shelf office cabin',
        href: '/product/portable-office/readymade-office-cabin',
        after: ' ships without a drawing cycle.',
      },
      {
        before: 'Where the unit must assemble on site and be re-partitioned later, ',
        anchor: 'prefabricated office cabins',
        href: '/product/portable-office/prefabricated-office-cabins',
        after: ' bolt together from panel modules.',
      },
      {
        before: 'When the budget favours a rebuilt shell, a ',
        anchor: 'portable office container',
        href: '/product/portable-office/portable-office-container',
        after: ' reuses a shipping container and is supplied as new.',
      },
      {
        before: 'For a front-of-house position that has to look the part, the ',
        anchor: 'modern office cabin',
        href: '/product/portable-office/modern-office-cabin',
        after: ' carries wide glazing and a flush finish.',
      },
      {
        before: 'Where the site has room for only a hundred or two hundred square feet, the ',
        anchor: 'small office cabin',
        href: '/product/portable-office/small-office-cabin',
        after: ' covers three compact sizes.',
      },
    ],
  },
  'readymade-office-cabin': {
    heading: 'Other ways to get the same floor area',
    rows: [
      {
        before: 'See how this size sits against the rest when you ',
        anchor: 'compare all nine portable office sizes',
        href: '/product/portable-office',
        after: '.',
      },
      {
        before: 'If the unit has to travel in parts and go up on site, ',
        anchor: 'bolted panel construction',
        href: '/product/portable-office/prefabricated-office-cabins',
        after: ' does that instead.',
      },
      {
        before: 'Where a reused shell is acceptable, ',
        anchor: 'offices rebuilt from shipping containers',
        href: '/product/portable-office/portable-office-container',
        after: ' cost less for the same footprint.',
      },
      {
        before: 'If a hundred to two hundred square feet is all the site allows, ',
        anchor: 'the compact three-size range',
        href: '/product/portable-office/small-office-cabin',
        after: ' starts smaller.',
      },
    ],
  },
  'modern-office-cabin': {
    heading: 'Plainer builds at a lower rate',
    rows: [
      {
        before: 'The same nine sizes without the glazing premium sit in ',
        anchor: 'the full portable office range',
        href: '/product/portable-office',
        after: '.',
      },
      {
        before: 'For an immediate dispatch rather than a build slot, ',
        anchor: 'cabins held in ready stock',
        href: '/product/portable-office/readymade-office-cabin',
        after: ' ship faster.',
      },
      {
        before: 'Where the unit must be dismantled and moved again, ',
        anchor: 'site-assembled panel offices',
        href: '/product/portable-office/prefabricated-office-cabins',
        after: ' take apart cleanly.',
      },
      {
        before: 'On a working site where finish matters less than cost, ',
        anchor: 'container-derived offices',
        href: '/product/portable-office/portable-office-container',
        after: ' do the same job.',
      },
    ],
  },
  'prefabricated-office-cabins': {
    heading: 'When a single delivered unit is simpler',
    rows: [
      {
        before: 'To weigh assembly against a unit that arrives complete, see ',
        anchor: 'every office cabin size in one place',
        href: '/product/portable-office',
        after: '.',
      },
      {
        before: 'Where no site assembly is wanted at all, ',
        anchor: 'a unit that ships from stock',
        href: '/product/portable-office/readymade-office-cabin',
        after: ' arrives finished.',
      },
      {
        before: 'For a customer-facing position, ',
        anchor: 'the glazed contemporary build',
        href: '/product/portable-office/modern-office-cabin',
        after: ' presents better.',
      },
      {
        before: 'If the shell can be reused rather than fabricated, ',
        anchor: 'rebuilt container offices',
        href: '/product/portable-office/portable-office-container',
        after: ' are the cheaper route.',
      },
    ],
  },
  'portable-office-container': {
    heading: 'Newly fabricated alternatives',
    rows: [
      {
        before: 'Both platforms sit side by side in ',
        anchor: 'the wider portable office lineup',
        href: '/product/portable-office',
        after: ', priced on the same nine sizes.',
      },
      {
        before: 'Where a new steel body is preferred to a reused shell, ',
        anchor: 'stock-built cabins',
        href: '/product/portable-office/readymade-office-cabin',
        after: ' dispatch from stock.',
      },
      {
        before: 'If the unit has to be taken apart and re-erected, ',
        anchor: 'bolt-together panel cabins',
        href: '/product/portable-office/prefabricated-office-cabins',
        after: ' are built for it.',
      },
      {
        before: 'For a gate post or a single desk, ',
        anchor: 'single-bay compact cabins',
        href: '/product/portable-office/small-office-cabin',
        after: ' are the smaller answer.',
      },
    ],
  },
  'small-office-cabin': {
    heading: 'When three sizes are not enough',
    rows: [
      {
        before: 'Nine sizes up to four hundred and eighty square feet sit in ',
        anchor: 'larger portable office options',
        href: '/product/portable-office',
        after: '.',
      },
      {
        before: 'For the same compact footprint delivered complete, ',
        anchor: 'ready-to-dispatch cabins',
        href: '/product/portable-office/readymade-office-cabin',
        after: ' ship from stock.',
      },
      {
        before: 'Where the cabin must grow later, ',
        anchor: 'the panel-module build',
        href: '/product/portable-office/prefabricated-office-cabins',
        after: ' extends on its own module lines.',
      },
      {
        before: 'If a reused shell suits the budget, ',
        anchor: 'the container-based option',
        href: '/product/portable-office/portable-office-container',
        after: ' covers the same sizes.',
      },
    ],
  },
};

// T24.1-V — product overview video. ONE video per page. LAZY FACADE: the page ships
// only the poster WebP; the YouTube iframe is injected on click and never before, so
// a cold load makes ZERO requests to youtube.com / ytimg.com. The 1:1 box is reserved
// by the existing aspect-square wrapper, so swapping poster -> player is zero-CLS.
// T25 — OPT-IN: the video exists only for a product whose data file sets
// `hasProductVideo: true` AND supplies video metadata (resolveVariantVideo). Every
// other product gets no facade thumb and no VideoObject JSON-LD.
const VIDEO_PRECONNECT_ORIGIN = 'https://www.youtube-nocookie.com';

const preconnectVideoOrigin = () => {
  if (typeof document === 'undefined') return;
  if (document.head.querySelector(`link[rel="preconnect"][href="${VIDEO_PRECONNECT_ORIGIN}"]`)) return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = VIDEO_PRECONNECT_ORIGIN;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

// ₹/sq ft display values — OFFICIAL owner-supplied figures. T25: derived per variant
// as round(priceExGst / areaSqft) in en-IN grouping, which reproduces the flagship's
// nine literals EXACTLY (1,375 · 1,375 · 1,250 · 1,200 · 1,200 · 1,175 · 1,175 ·
// 1,175 · 1,150 — verified against the previous hardcoded map). A product may still
// override any figure via `pricePerSqft` in its data file.
const pricePerSqft = (
  overrides: Record<string, string> | undefined,
  sizeSlug: string,
  priceExGst: number | null,
  areaSqft: number
): string => {
  const override = overrides?.[sizeSlug];
  if (override) return override;
  // Price GATED (null) → no derived ₹/sq ft. Never reached by the flagship (all
  // nine prices are numbers), so its output is unchanged.
  if (priceExGst == null) return '';
  if (!areaSqft) return '';
  return Math.round(priceExGst / areaSqft).toLocaleString('en-IN');
};


export function PortaCabinVariantHero({
  data,
  productTitle,
  averageRating,
  ratingCount,
  railItems,
  currentHref,
  showSectionDividers = false,
  usePremiumSizeTabs = false,
  explorerPanelHeadingAsH2 = false,
  compactMobileDividers = false,
  sizeEyebrowText,
  emitSizeAnchors = false,
  explorerHidePanelImages = false,
  deferNonLcpImagesUntilHeroPaint = false,
  renderOnlyActiveExplorerPanel = false,
}: PortaCabinVariantHeroProps) {
  const defaultIndex = Math.max(
    0,
    data.variants.findIndex((v) => v.sizeSlug === data.defaultVariant)
  );
  // DECOUPLED selection: the hero and the explorer each own their own index.
  const [heroIndex, setHeroIndex] = useState(defaultIndex);
  const [explorerIndex, setExplorerIndex] = useState(defaultIndex);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // T24.1-V — false until the visitor clicks the video thumb. While false no
  // YouTube markup exists in the tree at all (facade), so nothing is requested.
  const [showVideo, setShowVideo] = useState(false);
  // Which size the enquiry dialog quotes (set at the moment a Get Quote is
  // clicked; never changes hero/explorer selection).
  const [quoteIndex, setQuoteIndex] = useState(defaultIndex);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const lcpImageRef = useRef<HTMLImageElement>(null);
  const [nonLcpImagesReady, setNonLcpImagesReady] = useState(!deferNonLcpImagesUntilHeroPaint);

  useEffect(() => {
    if (!deferNonLcpImagesUntilHeroPaint || nonLcpImagesReady) return;

    let observer: PerformanceObserver | undefined;
    let postPaintDelay: number | undefined;
    const release = () => {
      observer?.disconnect();
      setNonLcpImagesReady(true);
    };

    if ('PerformanceObserver' in window) {
      try {
        observer = new PerformanceObserver((list) => {
          const hero = lcpImageRef.current;
          if (
            hero
            && postPaintDelay === undefined
            && list.getEntries().some((entry) => (
              entry as PerformanceEntry & { element?: Element }
            ).element === hero)
          ) {
            // LCP entries are provisional until user input/page hide. Keep the
            // lazy thumbnails out of the final candidate window instead of
            // releasing them on the hero's first interim paint notification.
            postPaintDelay = window.setTimeout(release, 6000);
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (_error) {
        observer = undefined;
      }
    }

    const fallback = window.setTimeout(release, 10000);
    return () => {
      observer?.disconnect();
      if (postPaintDelay !== undefined) window.clearTimeout(postPaintDelay);
      window.clearTimeout(fallback);
    };
  }, [deferNonLcpImagesUntilHeroPaint, nonLcpImagesReady]);

  // T25 — every value that used to be a porta-cabins literal, resolved from the
  // data file first, then the product's preset. Anything unresolved is omitted
  // rather than defaulted to the flagship's content.
  const preset = getVariantPreset(data);
  const productName = resolveVariantProductName(data, productTitle);
  const productNameLower = productName.toLowerCase();
  const categoryLabel = data.categoryLabel || preset.categoryLabel;
  const categoryLinkHref = data.categoryHref || preset.categoryHref;
  const productSku = data.productSku || preset.productSku;
  const specPdfHref = data.specPdfHref || preset.specPdfHref;
  const hasRightToExist = hasRightToExistEntry(data.productSlug);
  const isC04Product = C04_PRODUCT_SLUGS.has(data.productSlug);
  const isC08Product = C08_PRODUCT_SLUGS.has(data.productSlug);
  const requiresUniqueThumbnailAlts = data.productSlug === 'labor-sheds';
  const optimizeInViewportThumbnails = data.productSlug === 'labor-sheds';
  // Video: null unless the product opted in AND supplied metadata (T25 §4).
  const video = resolveVariantVideo(data);
  // Explorer copy: resolved by dataset key. undefined => the Explorer section is
  // not rendered at all (never another product's copy).
  const applications = APPLICATIONS_DATASETS[data.applicationsDataset || preset.applicationsDataset || data.productSlug];
  const heroActive = data.variants[heroIndex];
  const imagesForVariant = (variant: typeof heroActive) => {
    const images = variant.images?.length ? variant.images : (data.galleryImages || []);
    // C-08 reserves manifest row six for the independent Section H image slot.
    // Rows one to five remain the Section 2 image set (hero plus thumbnails).
    return isC08Product && images.length === 6 ? images.slice(0, 5) : images;
  };
  const activeVariantImages = imagesForVariant(heroActive);
  const heroImages = activeVariantImages.length > 0 ? activeVariantImages : null;
  // Columns in the thumbnail strip: the product's LARGEST thumb count across all
  // its sizes, plus the video facade thumb when the product has one. Taking the
  // maximum (not the active size's count) keeps the track constant while the size
  // chips are used, so the strip never reflows; taking the real count rather than
  // a fixed 6 means there is never an empty reserved cell.
  const thumbTrackCount = Math.max(
    ...data.variants.map((v) => imagesForVariant(v).length),
    0
  ) + (video ? 1 : 0);

  // Hero chips: change ONLY the hero; write #size-{WxL} (replaceState — no
  // navigation, no scroll, no history entry).
  const selectHero = (index: number) => {
    setHeroIndex(index);
    setActiveImageIndex(0);
    // Changing size returns the viewer to that size's photos (the video is a
    // page-level asset, not a per-size one).
    setShowVideo(false);
    window.history.replaceState(null, '', `#${sizeFragment(data.variants[index].sizeSlug)}`);
  };

  // Explorer tabs: change ONLY the explorer panel; write #sizedetails-{WxL}.
  const selectExplorer = (index: number) => {
    setExplorerIndex(index);
    window.history.replaceState(null, '', `#${detailsFragment(data.variants[index].sizeSlug)}`);
  };

  // Get Quote (from either surface) opens the dialog for that size only.
  const openQuote = (index: number) => {
    setQuoteIndex(index);
    setShowEnquiry(true);
  };

  // On load: #size-{WxL} pre-selects the hero only; #sizedetails-{WxL}
  // pre-selects the explorer only and scrolls it into view; no hash → both stay
  // at the 20x10 default. The URL carries one fragment, so at most one applies.
  // Runs once after hydration (hash invisible to SSR → no mismatch).
  useEffect(() => {
    const hash = window.location.hash;
    const m1 = hash.match(SIZE_HASH_RE);
    if (m1) {
      const i = data.variants.findIndex((v) => v.sizeSlug === m1[1]);
      if (i >= 0) {
        setHeroIndex(i);
        setActiveImageIndex(0);
        setShowVideo(false);
      }
      return;
    }
    const m2 = hash.match(DETAILS_HASH_RE);
    if (m2) {
      const i = data.variants.findIndex((v) => v.sizeSlug === m2[1]);
      if (i >= 0) {
        setExplorerIndex(i);
        document.getElementById(APPLICATIONS_SECTION_ID)?.scrollIntoView({ block: 'start' });
      }
    }
    // Mount-only by design: later edits go through selectHero / selectExplorer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------------------------ */
  /* Column pieces. Desktop and mobile branches both render these, CSS-  */
  /* toggled by breakpoint (established pattern on this page). Factories */
  /* so the H1 exists exactly once per page (mobile = real h1).          */
  /* ------------------------------------------------------------------ */

  const galleryColumn = (
    <Card className="p-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm lg:h-full lg:flex lg:flex-col">
      <div className="space-y-2 lg:flex lg:flex-1 lg:flex-col">
        <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden relative">
          {showVideo && video ? (
            // Injected ONLY after the thumb click. autoplay=1 because the click
            // that mounted it IS the play gesture. The privacy-enhanced
            // youtube-nocookie host is fixed in the approved video config.
            <iframe
              src={video.embedSrc}
              title={video.title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : heroImages ? (
            <Image
              ref={lcpImageRef}
              key={heroImages[activeImageIndex].src}
              src={heroImages[activeImageIndex].src}
              unoptimized={data.optimizeLocalGalleryImages ? false : shouldBypassOptimizer(heroImages[activeImageIndex].src)}
              alt={heroImages[activeImageIndex].alt}
              width={heroImages[activeImageIndex].width}
              height={heroImages[activeImageIndex].height}
              className="w-full h-full object-cover"
              // LCP: ONLY the default variant's first image is priority — next/image
              // then emits loading=eager + fetchpriority=high + <link rel=preload>.
              // Every other image (priority=false) defaults to loading=lazy. Passing
              // an explicit `loading` alongside `priority` is a next/image error, so
              // we rely on priority to drive both.
              priority={heroIndex === defaultIndex && activeImageIndex === 0}
              decoding="async"
              // T30 / T24.1-IMG §5.1 — the hero does NOT fill the viewport below
              // 1024: it sits inside the page container (px-4 <640, px-6 >=640) and
              // the gallery Card (p-2). MEASURED rendered width on this build:
              //   360 -> 312px | 390 -> 342px | 412 -> 364px  (= 100vw - 48px)
              //   768 -> 704px                                 (= 100vw - 64px)
              // Declaring 100vw overstated the box by ~12% and made mobile resolve
              // ~1170px, selecting the w=1200 candidate (~92 KiB into a 342px box) —
              // a direct breach of the MOBILE CWV LAW ("correct sizes attr so mobile
              // never downloads the 1200px variant"). calc() is exact at every width,
              // so it never under-declares either (no blurring).
              sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc(100vw - 64px), 40vw"
              quality={85}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-center p-4">
              <p className="text-sm text-muted-foreground">
                Reference photographs for this size are available on request. Send an enquiry and we will share them.
              </p>
            </div>
          )}
        </div>

        {/* The track sizes to its CONTENTS — never a reserved slot.
            E4 item 1: C-08 was pinned to 6 columns while its gallery is 5 (row six
            of the manifest is the Section H image, not a thumbnail), which left a
            visible empty cell after the fifth thumb.
            The count is the product's MAXIMUM thumb count, not the active size's,
            so switching size chips can never change the column count and reflow
            the strip — the row keeps a constant height and CLS stays 0.
            Full class names (never an interpolated `grid-cols-${n}`) so Tailwind's
            scanner emits them. */}
        {heroImages && (
          <div className={GALLERY_TRACK_CLASS[thumbTrackCount] || 'grid grid-cols-5 gap-2'}>
            {heroImages.map((img, i) => (
              <button
                key={img.src}
                type="button"
                className={cn(
                  'aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden border-2 transition-all duration-200',
                  !showVideo && activeImageIndex === i ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'
                )}
                onClick={() => { setActiveImageIndex(i); setShowVideo(false); }}
                aria-label={`Show image ${i + 1} of ${heroActive.label} ${productNameLower}`}
              >
                {/* The thumbnail whose photo is currently enlarged in the main
                    viewer is decorative (alt="") — the main <img> already carries
                    that shot's descriptive alt, so this avoids the same alt/photo
                    reading twice on the page (V5). The other four keep their unique
                    per-shot alts and stay crawlable. The button's aria-label names
                    the control either way. */}
                {/* T30 / T24.1-IMG §5.3 — these 5 thumbnails are INSIDE the initial
                    viewport on mobile AND desktop (measured 52-62px boxes, all
                    in-viewport). They still remain lazy so only the main viewer
                    competes in the eager/high-priority LCP lane. */}
                {nonLcpImagesReady && <Image
                  src={optimizeInViewportThumbnails ? productThumbSrc(img.src) : img.src}
                  unoptimized={optimizeInViewportThumbnails || (data.optimizeLocalGalleryImages ? false : shouldBypassOptimizer(img.src))}
                  alt={
                    requiresUniqueThumbnailAlts
                      ? `${img.alt} thumbnail`
                      : isC04Product || isC08Product
                        ? img.alt
                        : (!showVideo && i === activeImageIndex ? '' : img.alt)
                  }
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                  loading={optimizeInViewportThumbnails ? 'eager' : 'lazy'}
                  decoding="async"
                  sizes="(max-width: 1023px) 18vw, 80px"
                />}
              </button>
            ))}

            {/* T24.1-V — video facade thumb. This is the ONLY YouTube-related
                surface on the page until it is clicked: a local WebP poster plus a
                CSS play badge. No iframe, no YouTube script, no ytimg preconnect.
                Accessible name comes from the poster alt (the packet's string), so
                no aria-label is added on top of it.
                T25 — rendered ONLY for a product that opted in via
                `hasProductVideo` and supplied video metadata. */}
            {video && (
            <button
              type="button"
              className={cn(
                'aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden border-2 transition-all duration-200 relative',
                showVideo ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'
              )}
              onPointerEnter={preconnectVideoOrigin}
              onFocus={preconnectVideoOrigin}
              onClick={() => {
                preconnectVideoOrigin();
                setShowVideo(true);
              }}
            >
              {/* Sibling thumbs are eager because T30 MEASURED this row inside the
                  initial viewport at 360/390/412/768 and on desktop. The approved
                  video rule deliberately keeps this non-LCP facade poster lazy. */}
              {nonLcpImagesReady && <Image
                src={video.posterSrc}
                unoptimized={shouldBypassOptimizer(video.posterSrc)}
                alt={video.posterAlt}
                width={150}
                height={150}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1023px) 15vw, 70px"
              />}
              <span className="absolute inset-0 flex items-center justify-center bg-black/25" aria-hidden="true">
                <span className="flex items-center justify-center w-1/2 h-1/2 rounded-full bg-white/90 shadow">
                  <Play className="w-1/2 h-1/2 text-primary fill-primary" />
                </span>
              </span>
            </button>
            )}
          </div>
        )}

        {/* Zone contact cards directly under the thumbnails — the desktop
            conversion path (Call / Send Enquiry). lg:flex-1 stretches them to
            absorb remaining column height (T28.4 equal-bottom-edge rule). */}
        <div className="pt-1 md:pt-2 lg:flex lg:flex-1 lg:flex-col lg:gap-2">
          <ProductZoneCtas variant="strip" className="w-full" stretch />
          {isC08Product && specPdfHref && (
          <a
            href={specPdfHref}
            download
            onClick={() => pushDataLayer('file_download', { product_slug: data.productSlug })}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--ds-color-leaf)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ds-color-leaf)] transition-colors hover:bg-[var(--ds-color-mist)]"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {data.specPdfButtonLabel || 'Download Specification PDF'}
          </a>
          )}
        </div>

      </div>
    </Card>
  );

  // LC-00 (16 Aug 2026) — a variant carrying its own `featureCells` replaces the
  // standard five-cell set outright, for a product whose approved FEATURE_CELLS
  // table names entirely different concepts. Absent everywhere else, so the
  // standard computation below is unreached and byte-identical on every other
  // product.
  const FEATURE_CELLS = heroActive.featureCells || [
    { label: 'Size', value: heroActive.dims },
    // Material: data → preset → the deployed literal. Absent on every product except
    // portable-office (W3-A Ruling 1) → byte-identical Material cell everywhere else.
    // PC-10 — `frontageLabel` replaces this cell (label and value) outright, for a
    // product whose FEATURE_CELLS table names a frontage line, not a material line.
    data.frontageLabel
      ? { label: 'Frontage', value: data.frontageLabel }
      : { label: 'Material', value: data.materialLabel || preset.materialLabel || 'MS Frame · Insulated Panels' },
    { label: 'Delivery', value: data.deliveryLabel || '7–21 Working Days' },
    // PC-01 (14 Aug 2026) — Coverage is data-driven the same way Material and
    // Delivery already are. Absent on every product except ms-porta-cabin, so the
    // deployed literal below is what every other page still renders.
    // PC-10 — `fitOutLabel` replaces this cell (label and value) outright, for a
    // product whose FEATURE_CELLS table names a fit-out line, not a coverage line.
    data.fitOutLabel
      ? { label: 'Fit-out', value: data.fitOutLabel }
      : { label: 'Coverage', value: data.coverageLabel || 'Bangalore · Delhi NCR' },
    { label: 'Brand', value: 'SAMAN Portable' },
    // Application: omitted, not defaulted, when the product has no approved
    // per-size use-case copy. Filtered below so the cell never renders empty.
    ...(heroActive.useCase
      ? [{ label: 'Application', value: rewriteC04VisiblePunctuation(heroActive.useCase, data.productSlug) }]
      : []),
  ];

  // INFO-ONLY buy box: no CTA buttons here (owner ruling — desktop conversion
  // lives in the gallery column's zone cards; mobile keeps the sticky bar).
  const buyBoxColumn = (Heading: 'h1' | 'p') => (
    <Card className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden lg:h-full lg:overflow-visible lg:flex lg:flex-col">
      <div className="space-y-3 lg:flex lg:flex-1 lg:flex-col">
        <div className="space-y-1">
          {/* `h1` is the owner-approved page heading when the draft's L3 zone rules one
              that is not the product noun. It is deliberately NOT `productName`: that
              value also feeds alts, aria-labels and the enquiry prefill, so a long
              marketing heading must not be routed through it. Absent everywhere today
              except the C-05 subpages and the porta-cabins hub, so every other product
              renders byte-identically. */}
          <Heading className="text-2xl md:text-3xl font-bold text-foreground leading-tight break-words">{data.h1 || data.productName || productTitle}</Heading>
          {/* Amendment G v2 — real rating badge: the computed 4.6 average of the 5
              SAMAN-verified reviews only (ratingCount 5). Matches the JSON-LD
              aggregateRating + the Reviews tab. Renders only when ratingCount > 0. */}
          {ratingCount > 0 && (
            <div className="flex items-center space-x-2 flex-wrap">
              <div className="flex items-center space-x-1">{renderStars(parseFloat(averageRating) || 0)}</div>
              <span className="text-sm text-muted-foreground">
                {averageRating} ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {usePremiumSizeTabs ? (
            <p className="text-sm font-semibold text-foreground">{sizeEyebrowText || 'Choose your size — six factory-built options'}</p>
          ) : (
            <p className="text-sm font-semibold text-foreground">Choose size</p>
          )}
          {/* R20a (v1.5) — the HERO buy-box selector is the premium CHIP design
              (pills). The SAP underline strip belongs to the Section 3 explorer,
              not here; v1.4 had applied it to the wrong selector. */}
          <div
            className={usePremiumSizeTabs ? 'saman-size-chips' : 'grid grid-cols-3 gap-2'}
            role="group"
            aria-label={`Choose ${productNameLower} size`}
          >
            {data.variants.map((v, i) => (
              <button
                key={v.sizeSlug}
                id={emitSizeAnchors ? sizeFragment(v.sizeSlug) : undefined}
                type="button"
                aria-pressed={i === heroIndex}
                onClick={() => selectHero(i)}
                className={usePremiumSizeTabs
                  ? cn('saman-size-chip', i === heroIndex && 'active')
                  : cn(
                      'min-h-11 rounded-lg border px-2 py-2 text-sm font-semibold transition-colors',
                      i === heroIndex
                        ? 'bg-[var(--ds-color-leaf)] text-white border-[var(--ds-color-leaf)] shadow-sm'
                        : 'bg-white text-foreground border-slate-200 hover:border-[var(--ds-color-leaf)]'
                    )}
              >
                {v.label}
                {/* Quotation-mode products carry no price ladder, so the size
                    list is the only place the six areas can be read. Rendered
                    ONLY when gatedPriceLabel is set — every priced product keeps
                    its original label-only chip, byte-identical. */}
                {data.gatedPriceLabel && (
                  <span className="block text-[11px] font-normal opacity-80">{v.areaSqft} sq ft</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-label + price — fixed height so size swaps cause zero CLS.
            Ex-GST stays prominent; the incl-GST line (G1) is a small muted line
            below it. Both swap in place, constant height → no CLS. */}
        <div className="min-h-[5.25rem]" aria-live="polite">
          {/* Two children (not three) so React SSR emits ONE `<!-- -->` text
              separator here — byte-identical to the T24.1 markup, which had the
              product noun as a literal in the trailing static string. */}
          <p className="text-sm text-muted-foreground">{heroActive.label}{` ${productName}`}</p>
          {/* Price GATED (priceExGst null): show the enquiry line, no numbers, no
              incl-GST line. When priceExGst is a number the ORIGINAL two elements
              render unchanged (the fragment is transparent → flagship byte-identity). */}
          {heroActive.priceExGst == null ? (
            <span className="text-2xl md:text-3xl font-bold text-[var(--ds-color-forest)] break-words">{data.gatedPriceLabel || 'Price on request — send enquiry'}</span>
          ) : (
            <>
              <span className="text-2xl md:text-3xl font-bold text-[var(--ds-color-forest)] break-words">
                {formatIndianPrice(heroActive.priceExGst)} + GST
              </span>
              <p className="text-xs text-muted-foreground">{formatIndianPrice(heroActive.priceInclGst!)} incl. 18% GST</p>
            </>
          )}
        </div>

        {/* Price caption — one owner-approved line under the price, identical for
            all sizes so a chip swap cannot move it. Rendered OUTSIDE the fixed-height
            price box above, and only for a product that supplies the copy. */}
        {data.priceCaption && (
          <p className="-mt-1 text-xs text-muted-foreground">{data.priceCaption}</p>
        )}

        {/* Per-size shortDescription (Section E v2.1). Per-breakpoint FIXED heights
            (14px / 1.5 → 21px line): each sized to the TALLEST of the 9 blurbs at
            that tier's narrowest width, measured on the production build —
            <360:6L(126) · 360:5L(105) · 640:3L(63) · 768:2L(42) · 1024:5L(105) ·
            1280+:4L(84). All 9 share one height per tier, so size swaps are zero-CLS;
            every blurb fits with no truncation at 360/768/1024/1440. overflow-hidden
            is a safety net only (nothing is actually clipped at any width ≥320). */}
        {/* R10 (14 Aug 2026) — an opener may contain a "\n\n" paragraph break;
            each becomes its own <p>, same text, no rewrite. Single-paragraph
            openers and the per-variant shortDescription fallback are unaffected. */}
        {(heroActive.shortDescription || data.opener) && (
          data.opener && data.opener.includes('\n\n') ? (
            <div className="space-y-2">
              {data.opener.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm leading-[1.5] text-[var(--ds-color-steel)]">
                  {rewriteC04VisiblePunctuation(para, data.productSlug)}
                </p>
              ))}
            </div>
          ) : (
            <p className={data.opener
              ? 'text-sm leading-[1.5] text-[var(--ds-color-steel)]'
              : 'h-[126px] min-[360px]:h-[105px] sm:h-[63px] md:h-[42px] lg:h-[105px] xl:h-[84px] overflow-hidden text-sm leading-[1.5] text-[var(--ds-color-steel)]'}>
              {rewriteC04VisiblePunctuation(data.opener || heroActive.shortDescription, data.productSlug)}
            </p>
          )
        )}

        {/* Feature grid — 2-column bordered cells, small-caps gray labels, bold
            values; compacted ~10% (owner direction: tighter cells, no dead space
            in col 3). SIZE and APPLICATION swap with the selected chip; min-h
            keeps rows CLS-stable. */}
        <div className="grid grid-cols-2 rounded-lg border border-[var(--ds-color-border)] overflow-hidden">
          {FEATURE_CELLS.map((cell, i) => (
            <div
              key={cell.label}
              className={cn(
                'px-2.5 py-1.5 min-h-[3.25rem]',
                i % 2 === 0 && 'border-r border-[var(--ds-color-border)]',
                i < FEATURE_CELLS.length - 2 && 'border-b border-[var(--ds-color-border)]'
              )}
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.7px] text-[var(--ds-color-steel)]">{cell.label}</div>
              <div className="text-[13px] font-semibold text-[var(--ds-color-forest)]">{cell.value}</div>
            </div>
          ))}
        </div>

        {/* Green chips line (verbatim, from the approved short-description footer). */}
        <div className="flex items-center gap-2 rounded-md bg-[var(--ds-color-mist)] px-3 py-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ds-color-leaf)]" aria-hidden="true" />
          <p className="text-xs text-[var(--ds-color-ink)]">
            Custom sizes available · <strong className="text-[var(--ds-color-forest)]">500+ projects delivered</strong> · Factory-tested before dispatch
          </p>
        </div>

        {/* Product Information (owner ruling: mandatory on every product page) —
            static, not per-variant. Verbatim SKU + category anchor. Fills the
            gap between the green chips line and the trust row.
            T25: both rows are data-driven. A row (and, if neither resolves, the
            whole block) is omitted rather than showing another product's SKU or
            category anchor — those are owner-supplied values, never defaulted. */}
        {(productSku || (categoryLabel && categoryLinkHref)) && (
        <div className="rounded-lg border border-[var(--ds-color-border)] px-3 py-2.5">
          <h3 className="mb-1.5 text-[13px] font-semibold text-[var(--ds-color-ink)]">Product Information</h3>
          <dl className="space-y-1 text-[13px]">
            {productSku && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[10px] font-bold uppercase tracking-[0.7px] text-[var(--ds-color-steel)]">SKU</dt>
              <dd className="font-semibold text-[var(--ds-color-forest)]">{productSku}</dd>
            </div>
            )}
            {categoryLabel && categoryLinkHref && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[10px] font-bold uppercase tracking-[0.7px] text-[var(--ds-color-steel)]">Category</dt>
              <dd>
                <Link href={categoryLinkHref} className="font-semibold text-[var(--ds-color-leaf)] hover:underline">{categoryLabel}</Link>
              </dd>
            </div>
            )}
          </dl>
        </div>
        )}

        {/* Trust row — anchored at the card bottom (mt-auto within the
            full-height flex column). */}
        {/* LC-02 (16 Aug 2026) — disabled state: the control renders, visibly
            inactive, when a page's PDF exists but is unsigned/draft and must
            not be linked. Same label text as the working button; no href, no
            download, no click. Absent on every other product -> unchanged. */}
        {data.specPdfDisabled && !isC08Product && (
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-400"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {data.specPdfButtonLabel || (hasRightToExist ? 'Download Specification PDF' : 'Download specifications')}
        </button>
        )}
        {specPdfHref && !data.specPdfDisabled && !isC08Product && (
        <a
          href={specPdfHref}
          download
          onClick={hasRightToExist ? () => pushDataLayer('file_download', { product_slug: data.productSlug }) : undefined}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--ds-color-leaf)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ds-color-leaf)] transition-colors hover:bg-[var(--ds-color-mist)]"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {data.specPdfButtonLabel || (hasRightToExist ? 'Download Specification PDF' : 'Download specifications')}
        </a>
        )}
        {/* PC-09 (15 Aug 2026) — optional caption rendered directly beneath the
            PDF button, carrying the "not for construction" control the PDF
            itself lacks (copy pack v1 §2). Absent on every other product ->
            byte-identical elsewhere. */}
        {specPdfHref && !data.specPdfDisabled && !isC08Product && data.specPdfCaption && (
        <p className="-mt-1 text-xs italic text-slate-500 text-center">{data.specPdfCaption}</p>
        )}

        <p className="!mt-auto pt-4 text-xs text-muted-foreground text-center">
          {isC04Product
            ? <>GST registered · ISO 9001:2015 certified manufacturer · {data.trustWarranty} · Pan-India delivery</>
            : isC08Product
              ? <>GST registered · ISO 9001:2015 certified manufacturer · {data.trustWarranty} · Pan-India delivery</>
              : <>GST registered · ISO 9001:2015 certified manufacturer · 5-year structural and 1-year finishing warranty · Pan-India delivery</>}
        </p>
      </div>
    </Card>
  );

  return (
    // data-ds-root + the injected token rule scope the --ds-* color variables to
    // this subtree — the same self-sufficient pattern Header.tsx uses for global
    // chrome outside PageShell. Hex lives only in ds/tokens.ts (T0 law).
    <section ref={heroRef} className="mb-4 scroll-mt-20" data-ds-root="">
      {/* DS color tokens + the single-tree layout. Layout CSS only (no hex). The
          hero mounts ONCE (V5 fix: the old hidden-lg / lg:hidden dual tree rendered
          gallery, buy box and rail twice). Source order is gallery → buy box →
          related rail → full-width sections.
          MOBILE (<1024): plain BLOCK FLOW — the source order IS the visual order,
          and, crucially, the browser can lay out and paint the gallery (the LCP
          hero) FIRST, independently of the content-heavy buy box below it. H2 wrapped
          all four in ONE grid formatting context; a grid resolves its whole track
          layout (gallery + buy box) before first paint, which pushed the mobile LCP
          ~0.4s later than the baseline's block-flow mobile tree (the H2 regression).
          Block flow restores the baseline paint order at one mount.
          DESKTOP (>=1024): grid-template-areas repositions the related rail into
          column 1 — rail|gallery|buybox 25/40/35, explorer full-width below,
          equal bottom edges (align-items:stretch). Visuals identical at every
          breakpoint; only the mobile formatting context changes. */}
      <style dangerouslySetInnerHTML={{ __html: `[data-ds-root]{${dsCssVariables()}}`
        + `.pc-hero-grid{display:block;}`
        + `.pc-hero-grid>.pc-gallery{min-width:0;}.pc-hero-grid>.pc-buybox{min-width:0;margin-top:1rem;}.pc-hero-grid>.pc-transcript{min-width:0;margin-top:1rem;}.pc-hero-grid>.pc-rte{min-width:0;margin-top:1rem;}.pc-hero-grid>.pc-explorer{min-width:0;margin-top:1rem;}.pc-hero-grid>.pc-rail{margin-top:1rem;}`
        // Ad-hoc revision (14 Aug 2026) — compactMobileDividers halves the
        // global 40px mobile divider margin to 20px, ONLY for this
        // component's own .pc-divider1/.pc-divider2 elements, ONLY below the
        // 1024px breakpoint (the desktop rule below already sets margin:0 and
        // wins at >=1024px regardless), and ONLY when the flag is on.
        + (compactMobileDividers ? `.pc-hero-grid>.pc-divider1,.pc-hero-grid>.pc-divider2{margin:20px auto;}` : ``)
        // PC-00 divider rows are inserted into grid-template-areas ONLY when
        // showSectionDividers is on, so the areas string (and every sibling
        // page that never sets the prop) stays byte-identical to before.
        + `@media(min-width:1024px){.pc-hero-grid{display:grid;grid-template-columns:minmax(0,25fr) minmax(0,40fr) minmax(0,35fr);column-gap:1.5rem;row-gap:2rem;align-items:stretch;grid-template-areas:"rail gallery buybox" "transcript transcript transcript" `
        + (showSectionDividers ? `"divider1 divider1 divider1" ` : ``)
        + `"rte rte rte" `
        + (showSectionDividers ? `"divider2 divider2 divider2" ` : ``)
        + `"explorer explorer explorer";}.pc-hero-grid>.pc-rail{grid-area:rail;margin-top:0;}.pc-hero-grid>.pc-gallery{grid-area:gallery;}.pc-hero-grid>.pc-buybox{grid-area:buybox;margin-top:0;}.pc-hero-grid>.pc-transcript{grid-area:transcript;margin-top:0;}.pc-hero-grid>.pc-rte{grid-area:rte;margin-top:0;}.pc-hero-grid>.pc-explorer{grid-area:explorer;margin-top:0;}`
        + (showSectionDividers ? `.pc-hero-grid>.pc-divider1{grid-area:divider1;margin-top:0;}.pc-hero-grid>.pc-divider2{grid-area:divider2;margin-top:0;}` : ``)
        + `}` } } />

      {/* SINGLE responsive tree (V5 fix). Every piece — rail, gallery, buy box,
          explorer — is mounted EXACTLY ONCE; grid-template-areas (see <style>)
          place them: desktop one row rail|gallery|buybox (25/40/35) with the
          explorer full-width below; mobile begins gallery→buybox→rail.
          The buy box renders the sole H1. */}
      <div className="pc-hero-grid">
        {/* Gallery FIRST in source — on mobile (block flow) this makes the LCP hero
            image the first laid-out/painted element; its natural height drives the
            desktop row height. */}
        <div className="pc-gallery">{galleryColumn}</div>

        {/* Buy box — the ONLY H1 on the page. Internally-scrolling T28 shell on
            desktop; normal flow on mobile. */}
        <div className="pc-buybox lg:relative lg:min-h-0">
          <div className="t28-rail-scroll lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">{buyBoxColumn('h1')}</div>
        </div>

        <aside className="pc-rail lg:relative lg:min-h-0">
          <div className="t28-rail-scroll lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain">
            <RelatedProductRail
              items={railItems}
              currentHref={currentHref}
              className="bg-white/80 shadow-lg lg:h-auto lg:min-h-full"
              scroll
              deferImagesUntilVisible={deferNonLcpImagesUntilHeroPaint}
              imageLoadGate={nonLcpImagesReady}
              optimizeThumbnails={optimizeInViewportThumbnails}
              eagerThumbnails={optimizeInViewportThumbnails}
            />
          </div>
        </aside>

        {video?.transcriptHeading && video.transcript && (
          <details className="pc-transcript rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700">
            <summary className="cursor-pointer font-semibold text-slate-900">
              Video transcript
            </summary>
            <div className="pt-3">
              <h3 className="text-base font-semibold text-slate-900">
                {video.transcriptHeading}
              </h3>
              <p className="mt-2 leading-6">{video.transcript}</p>
            </div>
          </details>
        )}

        {showSectionDividers && hasRightToExist && (
          <hr className="pc-divider1 saman-section-divider" aria-hidden="true" />
        )}

        {hasRightToExist && (
          <div className="pc-rte">
            <RightToExist
              productSlug={data.productSlug}
              deferSplitImageUntilVisible={deferNonLcpImagesUntilHeroPaint}
              imageLoadGate={nonLcpImagesReady}
            />
          </div>
        )}

        {showSectionDividers && hasRightToExist && applications && (
          <hr className="pc-divider2 saman-section-divider" aria-hidden="true" />
        )}

        {/* Size Applications Explorer — full-width row below on desktop, third on
            mobile. DECOUPLED from the hero (own explorerIndex + #sizedetails-*).
            Only the ACTIVE panel renders its <img> (P1/V7); every panel's text
            ships in SSR (crawlable); grid-stack → zero CLS. */}
        {/* T25 — the explorer is rendered only when THIS product has its own
            applications dataset. Without one the wrapper is omitted too, so the
            desktop grid simply loses its second row instead of reserving an empty
            full-width area. */}
        {applications && (
        <div className="pc-explorer">
          <SizeApplicationsExplorer
            data={data}
            applications={applications}
            productName={productName}
            sectionId={APPLICATIONS_SECTION_ID}
            activeIndex={explorerIndex}
            onSelectTab={selectExplorer}
            onGetQuote={openQuote}
            usePremiumSizeTabs={usePremiumSizeTabs}
            panelHeadingAsH2={explorerPanelHeadingAsH2}
            hidePanelImages={explorerHidePanelImages}
            renderOnlyActivePanel={renderOnlyActiveExplorerPanel}
          />
        </div>
        )}

      </div>

      {/* Mobile sticky buy bar — sits above the site-wide MobileBottomNav (h-16),
          hidden >=1024. The mobile conversion path stays: price + solid CTA. */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-2px_8px_rgba(20,33,27,0.08)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-[11px] text-muted-foreground leading-none">{heroActive.label}</p>
            <p className="text-base font-bold text-primary leading-tight">{heroActive.priceExGst == null ? (data.gatedPriceLabel || 'Price on request') : <>{formatIndianPrice(heroActive.priceExGst)} + GST</>}</p>
          </div>
          <Button
            type="button"
            className="bg-primary hover:bg-primary/90 text-white min-h-11 px-5"
            onClick={() => openQuote(heroIndex)}
          >
            Get a Quote
          </Button>
        </div>
      </div>
      {/* Reserve space so the sticky bar never covers page content on mobile. */}
      <div className="lg:hidden h-16" aria-hidden="true" />

      <EnquiryDialog
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        prefillMessage={`Enquiry for ${data.variants[quoteIndex].label} ${productName}`}
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Size Applications Explorer — H2 + intro + leaf-underline tab strip + 9 panels.
// Panels map to variants by sizeSlug; all copy is verbatim from
// data/products/porta-cabins-applications.json (Fable 5 Section H). Every panel
// is in SSR HTML (inactive = visibility:hidden, crawlable). DECOUPLED from the
// hero: its own explorerIndex + #sizedetails-* hash — tabs move ONLY this panel.
// ---------------------------------------------------------------------------

interface SizeApplicationsExplorerProps {
  data: VariantProductData;
  /** This product's OWN applications copy. Required — there is no shared default,
      so a product without a dataset never reaches this component (T25 §3). */
  applications: ApplicationsData | undefined;
  productName: string;
  sectionId: string;
  activeIndex: number;
  onSelectTab: (index: number) => void;
  onGetQuote: (index: number) => void;
  /** R20b (v1.5) — opt-in SAP-style tab strip for this section. Default false
      keeps every other product's strip byte-identical. */
  usePremiumSizeTabs?: boolean;
  /** PC-02 — see `explorerPanelHeadingAsH2` on the hero. Default false. */
  panelHeadingAsH2?: boolean;
  /** PC-02 — see `explorerHidePanelImages` on the hero. Default false. */
  hidePanelImages?: boolean;
  renderOnlyActivePanel?: boolean;
}

function SizeApplicationsExplorer({ data, applications, productName, sectionId, activeIndex, onSelectTab, onGetQuote, usePremiumSizeTabs = false, panelHeadingAsH2 = false, hidePanelImages = false, renderOnlyActivePanel = false }: SizeApplicationsExplorerProps) {
  // T25 — HARD NULL. The per-slug applications copy is owner-authored; when a
  // product has none this section renders NOTHING. It must never fall back to the
  // porta-cabins copy.
  if (!applications) return null;

  const preset = getVariantPreset(data);
  const productNameLower = productName.toLowerCase();
  const isC08Product = C08_PRODUCT_SLUGS.has(data.productSlug);
  const explorerTemplate = data.explorerImageTemplate || preset.explorerImageTemplate;
  const explorerShot = data.explorerImageShot || preset.explorerImageShot || 'elevated-view';

  // Align the copy panels to the variant order (both keyed by sizeSlug).
  const panelBySlug = new Map(applications.panels.map((p) => [p.sizeSlug, p]));
  const renderedVariants = renderOnlyActivePanel
    ? data.variants.map((v, i) => ({ v, i })).filter(({ i }) => i === activeIndex)
    : data.variants.map((v, i) => ({ v, i }));

  return (
    <section
      id={sectionId}
      className="scroll-mt-20"
      {...(applications.h2
        ? { 'aria-labelledby': 'size-applications-heading' }
        : { 'aria-label': `${sentenceCase(productName)} sizes and applications` })}
    >
      {/* Section heading + intro exist only on datasets that supply them (the
          flagship). The T25 Section H drop is panel-only, so this block is omitted
          rather than filled with invented copy — each panel carries its own
          heading, which keeps the section self-describing either way. */}
      {applications.h2 && (
        <div className="mb-4">
          <h2 id="size-applications-heading" className="text-xl font-bold text-[var(--ds-color-forest)] sm:text-2xl">
            {rewriteC04VisiblePunctuation(applications.h2, data.productSlug, true)}
          </h2>
          {applications.intro && (
            <p className="mt-1 text-sm text-[var(--ds-color-steel)]">{rewriteC04VisiblePunctuation(applications.intro, data.productSlug)}</p>
          )}
        </div>
      )}

      {/* Tab strip — horizontal, scrollable on mobile; selected = leaf underline
          + forest text (homepage PopularSizes design language).
          R20b (v1.5): opt-in SAP-style strip (white ground, brand-green label,
          3px green underline). This section is full-page-width, so all six tabs
          sit in one row on desktop. Keyboard/ARIA behaviour is unchanged. */}
      <div
        role="tablist"
        aria-label={`${sentenceCase(productName)} sizes`}
        className={usePremiumSizeTabs
          ? 'saman-size-tabs'
          : 'flex gap-1 overflow-x-auto border-b border-[var(--ds-color-border)]'}
      >
        {data.variants.map((v, i) => {
          const selected = i === activeIndex;
          return (
            <button
              key={v.sizeSlug}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`app-panel-${v.sizeSlug}`}
              id={`app-tab-${v.sizeSlug}`}
              onClick={() => onSelectTab(i)}
              className={usePremiumSizeTabs
                ? cn('saman-size-tab', selected && 'active')
                : cn(
                    '-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-semibold transition-colors',
                    selected
                      ? 'border-[var(--ds-color-leaf)] text-[var(--ds-color-forest)]'
                      : 'border-transparent text-[var(--ds-color-steel)] hover:text-[var(--ds-color-forest)]'
                  )}
            >
              {panelBySlug.get(v.sizeSlug)?.tabLabel || v.label}
            </button>
          );
        })}
      </div>

      {/* Panels — GRID-STACK: all 9 occupy the SAME grid cell ([grid-area:1/1]),
          so the container always sizes to the TALLEST panel and its height never
          changes when tabs switch → zero CLS at every viewport, no magic min-h.
          The active panel is visible; the others are visibility:hidden (still in
          the DOM, still laid out, fully crawlable — stronger than display:none for
          SEO). All 9 panels ship in SSR. */}
      <div className="mt-4 grid">
        {renderedVariants.map(({ v, i }) => {
          const panel = panelBySlug.get(v.sizeSlug);
          if (!panel) return null;
          const variantImages = v.images?.length ? v.images : (data.galleryImages || []);
          // C-08 manifest row six is the dedicated Section H image. Other clusters
          // retain the explicit-image/template/derived-shot resolution order.
          const c08ExplorerImage = isC08Product && variantImages.length === 6
            ? variantImages[5]
            : undefined;
          const hasPhotos = variantImages.length > 0;
          // PC-02 revision v1.2: `hidePanelImages` is retained but is no longer used by
          // any product. R3/R4 ruled that a panel must never fall through to the
          // component's "Reference photographs … on request" placeholder, so the GI page
          // supplies a real per-panel image instead of suppressing the slot.
          const panelSrc = hidePanelImages
            ? null
            : panel.image?.src ||
            c08ExplorerImage?.src ||
            (hasPhotos
              ? explorerImageSrc(explorerTemplate, explorerShot, v.sizeSlug, variantImages[0]?.src)
              : null);
          const manifestImage = variantImages.find((image) => image.src === panelSrc);
          const panelImage = panelSrc
            ? {
                src: panelSrc,
                // When the Explorer resolves to a manifest image, carry that image's
                // approved alt. Products whose Explorer uses a derived application shot
                // retain the established application-alt fallback, byte-identical.
                // An owner-authored panel alt (C-02 with-toilet §H) wins outright;
                // otherwise the existing two-branch behaviour is unchanged.
                alt:
                  panel.image?.alt ||
                  panel.imageAlt ||
                  manifestImage?.alt ||
                  (panelSrc === variantImages[0]?.src && variantImages[0]?.alt
                    ? variantImages[0].alt
                    // PC-01: the derived alt needs a first application to name; a
                    // dataset with no bullets always supplies its own panel alt
                    // above, so this branch is unreachable for it and must not
                    // read applications[0] of an empty list.
                    : panel.applications.length > 0
                      ? applicationAlt(v.label, panel.applications[0], productNameLower)
                      : ''),
              }
            : null;
          const rate = pricePerSqft(data.pricePerSqft, v.sizeSlug, v.priceExGst, v.areaSqft);
          return (
            <div
              key={v.sizeSlug}
              id={`app-panel-${v.sizeSlug}`}
              role="tabpanel"
              aria-labelledby={`app-tab-${v.sizeSlug}`}
              aria-hidden={i !== activeIndex}
              className={cn(
                '[grid-area:1/1] flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-10',
                i === activeIndex ? 'visible' : 'invisible pointer-events-none'
              )}
            >
              {/* LEFT — that size's dedicated Explorer photo (or the honest placeholder
                  when a size has no photos). The aspect-[4/3] box always reserves
                  space (zero CLS, grid-stack). V7: only the ACTIVE panel renders an
                  <img>, so INACTIVE panels issue ZERO network requests at initial
                  load (display:none alone would still fetch). Every panel's TEXT
                  ships in SSR (crawlable); the newly-active panel mounts and fetches
                  its image on demand when the tab is selected — into the already
                  reserved box, so activation is zero-CLS. */}
              {!hidePanelImages && <div className="lg:w-[44%]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--ds-color-border)] bg-[var(--ds-color-mist)]">
                  {panelImage ? (
                    i === activeIndex ? (
                      /* T30 / T24.1-IMG §5.4 — this was the ONLY <img> on the page
                         with no intrinsic dimensions (next/image `fill` cannot emit
                         width/height). It swaps on every tab click, so it carried a
                         CLS risk. Explicit intrinsic width/height (the source files
                         are 1254x1254) + w-full/h-full/object-cover render exactly as
                         `fill` did inside the aspect-[4/3] box — same crop, same box,
                         but the browser now knows the intrinsic aspect.
                         Also right-sized (item 5): it renders ~326-378px on mobile
                         (measured = 100vw - 34px), not 100vw. */
                      <Image
                        src={panelImage.src}
                        unoptimized={shouldBypassOptimizer(panelImage.src)}
                        alt={panelImage.alt}
                        width={panel.image?.width || manifestImage?.width || 1254}
                        height={panel.image?.height || manifestImage?.height || 1254}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 1023px) calc(100vw - 34px), 500px"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-4 text-center">
                      <p className="text-sm text-[var(--ds-color-steel)]">
                        Reference photographs for this size are available on request. Send an enquiry and we will share them.
                      </p>
                    </div>
                  )}
                </div>
              </div>}

              {/* RIGHT — H3, paragraph, 4 checkmark applications, data row, CTA.
                  L13 REV 2 STRUCTURAL FILL RULE: on lg+ the column distributes its
                  four groups — title / body / uses / stats+CTA — across the full row
                  height with space-between, so the CTA baseline lands on the tab
                  image's bottom edge at every viewport instead of leaving a visible
                  gap below it. Below lg the panel is a normal stacked column and
                  keeps justify-center exactly as before. This is the one sanctioned
                  shared-component change; every §H page inherits it. */}
              <div className="flex min-w-0 flex-1 flex-col justify-center lg:justify-between">
                {/* PC-01 — heading LEVEL is opt-in; the class string is identical in
                    both branches, so the rendered look never changes. */}
                {panelHeadingAsH2 ? (
                  <h2 className="text-lg font-bold text-[var(--ds-color-ink)] sm:text-xl">{rewriteC04VisiblePunctuation(panel.h3, data.productSlug, true)}</h2>
                ) : (
                  <h3 className="text-lg font-bold text-[var(--ds-color-ink)] sm:text-xl">{rewriteC04VisiblePunctuation(panel.h3, data.productSlug, true)}</h3>
                )}
                {/* PC-05 standing rule 13 — Shape A panels carry a blank-line
                    break between two approved paragraphs; each becomes its own
                    <p>, same convention as the buy-box opener (R10). No existing
                    panel paragraph contains "\n\n", so every other product's
                    single <p> is unaffected. */}
                {panel.paragraph.includes('\n\n') ? (
                  <div className="mt-2 space-y-2">
                    {panel.paragraph.split('\n\n').map((para, pi) => (
                      <p key={pi} className="text-sm leading-relaxed text-[var(--ds-color-steel)]">
                        {rewriteC04VisiblePunctuation(para, data.productSlug)}
                      </p>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--ds-color-steel)]">{rewriteC04VisiblePunctuation(panel.paragraph, data.productSlug)}</p>
                    {/* PC-02 revision v1.2 — Shape A second paragraph. Same class string as
                        the first, so a dataset that supplies none is byte-identical. */}
                    {panel.paragraph2 && (
                      <p className="mt-2 text-sm leading-relaxed text-[var(--ds-color-steel)]">{rewriteC04VisiblePunctuation(panel.paragraph2, data.productSlug)}</p>
                    )}
                  </>
                )}

                {/* Sub-heading above the applications list — T25 Section H drop only. */}
                {panel.applicationsHeading && (
                  <p className="mt-4 text-sm font-semibold text-[var(--ds-color-forest)]">
                    {rewriteC04VisiblePunctuation(panel.applicationsHeading, data.productSlug, true)}
                  </p>
                )}

                {/* Margin class stays FIRST so the flagship keeps its exact original
                    class string ("mt-4 grid gap-2 sm:grid-cols-2") byte-for-byte.
                    PC-01: a dataset whose approved copy supplies NO application
                    bullets (ms-porta-cabin) renders no list at all rather than an
                    empty <ul>. Every dataset that has bullets is unaffected. */}
                {panel.applications.length > 0 && (
                <ul className={cn(panel.applicationsHeading ? 'mt-2' : 'mt-4', 'grid gap-2 sm:grid-cols-2')}>
                  {panel.applications.map((app, ai) => (
                    <li key={ai} className="flex items-start gap-2 text-sm text-[var(--ds-color-ink)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ds-color-leaf)]" aria-hidden="true" />
                      <span>{rewriteC04VisiblePunctuation(app, data.productSlug)}</span>
                    </li>
                  ))}
                </ul>
                )}

                {/* Stats + CTA are ONE space-between group (REV 2): free height is
                    absorbed above them, never between the figures and the button. */}
                <div>
                {/* Data row from the data file. */}
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--ds-color-steel)]">
                  <span className="font-medium text-[var(--ds-color-ink)]">{v.dims}</span>
                  <span aria-hidden="true">·</span>
                  <span>{v.areaSqft} sq ft</span>
                  <span aria-hidden="true">·</span>
                  {/* Capacity is an occupancy claim, so it is rendered only where the
                      product's approved data supplies one. Without this guard a page
                      barred from people-count claims (C-02 with-toilet, §H rules) would
                      print an empty cell between two separators. Products that DO carry
                      capacity emit the same three nodes as before. */}
                  {v.capacity && (
                    <>
                      <span>{v.capacity}</span>
                      <span aria-hidden="true">·</span>
                    </>
                  )}
                  <span className="font-bold text-[var(--ds-color-forest)]">{v.priceExGst == null ? 'Price on request' : <>{formatIndianPrice(v.priceExGst)} + GST</>}</span>
                  {/* LC-02 (16 Aug 2026) — same guard as `v.capacity` above: `rate` is
                      already '' for a gated/quote-mode variant (pricePerSqft() returns
                      '' when priceExGst is null), but this span rendered unconditionally,
                      printing a bare "₹/sq ft" fragment between two separators. Never
                      reached before this page, since every prior product had a real
                      price on every variant. */}
                  {rate && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>₹{rate}/sq ft</span>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    className="bg-[var(--ds-color-leaf)] text-white hover:bg-[var(--ds-color-forest)]"
                    onClick={() => onGetQuote(i)}
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
    </section>
  );
}


export default PortaCabinVariantHero;
