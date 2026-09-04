import {
  GST_RATE,
  PRODUCT_LADDERS,
  RATE_CARD,
} from '@/lib/calculatorRates';
import { getRouteLadder, ladderAnchorRate, ladderPriceFor } from '@/lib/calculatorLadders';
import { containerOfficeBuildLabel, hasContainerOfficeBuildLabels } from '@/lib/containerOfficeBuildLabels';
import { BASE_CABIN_RATE_CARD_DATASET, baseCabinRate } from '@/lib/baseCabinRateCard';
import {
  CEILINGS_R1, ELECTRICAL_R1, FITOUT_R1, FLOORINGS_R1, FRAME_OPTIONS,
  INSULATIONS_R1, INTERIOR_STANDARD, INTERNAL_WALLS, WALL_BUILD_OPTIONS,
  ceilingDelta, floorDelta, insulationRate, pufDeltaPerSqft, wallDelta,
} from '@/lib/calculatorComponentRates';
import {
  CONSTRUCTION_DISCLOSURE, CONTROLS, ESTIMATE_PANEL, FIELD_LABELS,
  PRODUCT_STEP, QUOTE_MODE, STEP_COPY, TIPS,
} from '@/lib/calculatorCopy';
import { CABIN_CALCULATOR_SCOPED_STYLES } from '@/lib/cabinCalculatorScopedStyles.generated';
import { GENERAL_ESTIMATE_DISCLOSURE } from '@/lib/cabinEstimateCopy';

export type ProductId =
  | 'porta-cabin'
  | 'office-cabin'
  | 'security-cabin'
  | 'toilet-cabin'
  | 'accommodation-cabin'
  | 'container-office'
  | 'site-office'
  | 'portable-cabin'
  | 'container-houses'
  | 'prefab-container-homes'
  | 'shipping-container-homes'
  | 'affordable-container-homes'
  | 'luxury-container-houses'
  | 'prefab-modular-home'
  | 'container-cafe'
  | 'labour-colony'
  | 'labor-sheds'
  | 'labor-hutments'
  | 'prefab-labor-camps'
  | 'oil-field-camp'
  | 'ablution-block';

export type ColonyProductSlug = 'labor-colony' | 'labor-sheds' | 'labor-hutments' | 'prefab-labor-camps';

export type Wall = 'Front' | 'Rear' | 'Left' | 'Right';
export type QuantityMap = Record<string, number>;

export interface DoorConfig {
  type: 'Steel door' | 'Glass / Aluminium / uPVC door';
  wall: Wall;
  end: 'Left' | 'Right';
  distance: number;
  position: number;
  hinge: 'Left' | 'Right';
  opening: 'In' | 'Out';
}

export interface WindowConfig {
  type: 'uPVC Sliding' | 'Aluminium Sliding' | 'Openable uPVC' | 'Fixed Glass';
  wall: Wall;
  end: 'Left' | 'Right';
  distance: number;
  position: number;
  width: number;
  height: number;
  track: '2 Track' | '2.5 Track';
}

export interface QuoteFields {
  /**
   * These three field names are the /api/enquiry contract, which every other
   * form on the site already posts. The calculator used to post `fullName` and
   * `mobile`, so a native submit with JavaScript disabled returned HTTP 400
   * "Missing required fields" and the enquiry was silently lost. Fixed here at
   * the form rather than at the API, because widening the API would change the
   * contract those other forms depend on.
   */
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  city: string;
  state: string;
  notes: string;
}

export interface CalculatorConfig {
  productId: ProductId;
  /**
   * Product JSON slug of the route this calculator is embedded on. Pricing
   * reads this route's own published ladder and nothing else. Null on the
   * standalone route, where the selected product supplies its own key.
   */
  ladderKey?: string | null;
  length: number;
  width: number;
  height: number;
  quantity: number;
  planView: 'plan' | 'floor' | 'elevations';
  /** Length of each room along the cabin's length, in feet. Sums to length. */
  roomLengths: number[];
  /** Doors cut into the partitions, priced as steel doors. */
  partitionDoors: number;
  rooms: number;
  roof: 'Sloped' | 'Flat / mono-pitch';
  /** Event 1 Step 3. Codes from SAMAN's price-input workbook. */
  frame: string;
  wallBuild: string;
  /** Event 2 Step 4. Interior codes, not free text. */
  internalWall: string;
  ceilingCode: string;
  flooringCode: string;
  insulation: string;
  wallFinish: string;
  ceiling: string;
  flooring: string;
  pufThickness: 30 | 40 | 50 | 60 | 80;
  doors: DoorConfig[];
  windows: WindowConfig[];
  electrical: QuantityMap;
  lightColour: 'White' | 'Warm';
  lightShape: 'Square' | 'Round';
  addOns: QuantityMap;
  furniturePosition: 'Wall attached' | 'Centre';
  mobility: '100% movable' | 'Fixed / semi-permanent';
  deliveryZone: 'Bangalore city' | 'Delhi NCR' | 'Other';
  distanceKm: number;
  includeGst: boolean;
  installation: boolean;
  colonyVariant: number;
  workers: number;
  quote: QuoteFields;
}

export interface EstimateLine {
  label: string;
  amount: number | null;
  source: 'published' | 'market' | 'quotation';
  /** Plain item name for retained documents; the screen label may include quantity. */
  documentLabel?: string;
  /** Quantity priced by this line, including cabin quantity where applicable. */
  quantity?: number;
  /** Unit rate that produced the line. Null means confirmed in quotation. */
  unitRate?: number | null;
  /** Human-readable unit for the retained estimate document. */
  rateBasis?: 'each' | 'sq ft' | 'configuration' | 'cabin';
}

export interface CalculatorEstimate {
  areaSqft: number;
  lines: EstimateLine[];
  totalExGst: number;
  gst: number;
  totalInclGst: number;
  transportNote: string;
  includeGst: boolean;
  quoteOnly: boolean;
}

export type CalculatorQuery = Record<string, string | string[] | undefined>;

interface ProductDefinition {
  id: ProductId;
  name: string;
  subtitle: string;
  /**
   * `referenceRate` removed 07 Aug 2026. Eight per-product per-sq-ft constants
   * lived here and priced nothing after the base-cabin rate card landed: the
   * base is floor area x SAMAN's card, identical for every product. A dead
   * price constant beside a live one is how the last drift started.
   */
  quoteOnly?: boolean;
  /** Ladder this product prices from when chosen on the standalone route. */
  ladderKey?: string;
}

export interface RenderCalculatorOptions {
  config?: Partial<CalculatorConfig>;
  query?: CalculatorQuery;
  embedded?: boolean;
  includeCopy?: boolean;
  formAction?: string;
  activeStep?: number;
  reference?: string;
  productSlug?: ColonyProductSlug;
  /** Product JSON slug of the embedding route, so pricing reads its ladder. */
  ladderKey?: string;
  /**
   * The embedding page's OWN approved product name. A subpage must show its
   * own name, never its hub's: seven routes displayed "Portable Office" when
   * only one of them was Portable Office, which is the same defect class as
   * the porta-cabins routes displaying "Portable Cabin".
   */
  productName?: string;
  pageUrl?: string;
  submissionStatus?: 'success' | 'failure';
  /**
   * PC-05 revision v1.3, R5 (14 Aug 2026) — display-only suppression of the
   * "Published cabin price tables" accordion. A route with no registered
   * calculator ladder (PART 1-A: the page's own six-size ladder must never
   * feed the calculator) falls to the quote-mode fallback ladder, which
   * renders a generic product name with every row unpriced — a truth defect
   * next to a page that publishes six real prices. Default false/absent
   * everywhere else, so every other route's accordion is byte-identical. No
   * calculator logic changes; this hides markup only.
   */
  hidePublishedPriceTable?: boolean;
  /** LC-05 CWV: explicit opt-in for viewport-delayed client enhancement. */
  deferEnhancement?: boolean;
  /** Opt-in copy suppression for pages without approved lead-time/response-time claims. */
  suppressCommitmentCopy?: boolean;
  /** Keep the two approved free zones and quote every other freight destination. */
  quoteFreightOutsideFreeZones?: boolean;
}

export interface EmbeddedProductSummary {
  name: string;
  sizeLabel: string | null;
  price: number | null;
  priceLabel: string;
}

export const PRODUCTS: readonly ProductDefinition[] = [
  { id: 'porta-cabin', name: 'Porta Cabin', subtitle: 'All-purpose modular cabin', ladderKey: 'porta-cabins' },
  { id: 'office-cabin', name: 'Portable Office', subtitle: 'Furnished workspace cabin', ladderKey: 'portable-office' },
  { id: 'security-cabin', name: 'Security Cabin', subtitle: 'Guard booth / gate post' },
  // No quoteOnly flag: this product has a published ladder that prices a 20x10
  // at 3,00,000. The flag and the ladder contradicted each other and the
  // calculator rendered both answers at once.
  { id: 'toilet-cabin', name: 'Toilet Cabin', subtitle: 'Portable washroom block', ladderKey: 'porta-cabin-with-toilet' },
  { id: 'accommodation-cabin', name: 'Accommodation Cabin', subtitle: 'Bunkhouse / staff stay' },
  { id: 'container-office', name: 'Container Office', subtitle: 'Insulated container workspace', ladderKey: 'container-offices' },
  { id: 'site-office', name: 'Site Office', subtitle: 'On-site project office', ladderKey: 'site-office-container' },
  // 'portable-cabin' removed from the product list (SAMAN ruling, 15 Aug 2026).
  // The dropdown offered both "Porta Cabin" and "Portable Cabin" as separate
  // priced products; the Portable Cabin cluster retires into the Porta Cabins
  // hub, so the duplicate option and its ROUTE_LADDERS entry are removed
  // together. The ProductId union keeps 'portable-cabin' so the route resolvers
  // and PRODUCT_ICON stay valid; no formula, layout, banner or logic changed.
  { id: 'container-houses', name: 'Container House', subtitle: 'Standard container home', ladderKey: 'container-houses' },
  { id: 'prefab-container-homes', name: 'Prefab Container Home', subtitle: 'Prefab home specification', ladderKey: 'prefab-container-homes' },
  { id: 'shipping-container-homes', name: 'Shipping Container Home', subtitle: 'Shipping-grade shell', ladderKey: 'shipping-container-homes' },
  { id: 'affordable-container-homes', name: 'Affordable Container Home', subtitle: 'Lowest-rate home ladder', ladderKey: 'affordable-container-homes' },
  { id: 'luxury-container-houses', name: 'Luxury Container House', subtitle: 'Highest-rate luxury ladder', ladderKey: 'luxury-container-houses' },
  { id: 'prefab-modular-home', name: 'Prefab Modular Home', subtitle: 'Turnkey modular living space' },
  // ladderKey added in CALC-L4: the hub publishes a six-row ladder of its own,
  // so this product prices from it instead of falling to quote mode. Each of
  // the five subpages overrides this with its own key at the route.
  { id: 'container-cafe', name: 'Container Cafe', subtitle: 'Cafe and restaurant unit', ladderKey: 'container-cafe' },
  { id: 'labour-colony', name: 'Labour Colony', subtitle: 'Worker housing blocks' },
  { id: 'labor-sheds', name: 'Labour Sheds', subtitle: 'Open-hall worker dormitories' },
  { id: 'labor-hutments', name: 'Labour Hutments', subtitle: 'Room-based worker housing' },
  { id: 'prefab-labor-camps', name: 'Prefab Labour Camps', subtitle: 'Relocatable worker camp blocks' },
  // LC-03 (17 Aug 2026) — not a colony product (isColonyProduct's bespoke
  // multi-step flow is scoped to the four entries above): this page publishes
  // its own six-size ladder and prices from it directly, same pattern as
  // container-cafe above.
  { id: 'oil-field-camp', name: 'Oil Field Camp', subtitle: 'Skid-mounted relocatable crew modules', ladderKey: 'oil-field-camp' },
  // LC-07 (17 Aug 2026) — not a colony product: publishes its own six-size
  // ladder and prices from it directly, same pattern as oil-field-camp above.
  { id: 'ablution-block', name: 'Multi-Toilet Ablution Block', subtitle: 'Camp wet-service and sanitation block', ladderKey: 'ablution-block' },
] as const;

/**
 * Decorative line icons for the product step.
 *
 * These were emoji glyphs sitting inside the label text until 03 Aug 2026. The
 * L20 sweep removed emoji site-wide as a generated-content signal and this file
 * had reintroduced them, so they are now inline SVG: `stroke="currentColor"`,
 * `fill="none"`, so an icon inherits the card's text colour in both the white
 * and green modes without a second rule.
 *
 * Every icon is aria-hidden and purely decorative — the product name beside it
 * carries the meaning, so a screen reader loses nothing. One icon per product
 * family rather than nineteen near-identical building outlines.
 */
type IconName = 'cabin' | 'office' | 'house' | 'colony' | 'unit';

const ICON_PATHS: Record<IconName, string> = {
  // flat-roof cabin on a low plinth
  cabin: '<path d="M3 9.5 12 5l9 4.5"/><path d="M5 10.5V19h14v-8.5"/><path d="M3 19h18"/><path d="M9.5 19v-4.5h5V19"/>',
  // office block with window grid
  office: '<path d="M5 21V4.5h14V21"/><path d="M3 21h18"/><path d="M8.5 8h2M13.5 8h2M8.5 12h2M13.5 12h2"/><path d="M10.5 21v-4h3v4"/>',
  // pitched-roof home
  house: '<path d="M4 10.5 12 4l8 6.5"/><path d="M6 10V20h12V10"/><path d="M3 20h18"/><path d="M10 20v-5h4v5"/>',
  // paired dormitory blocks
  colony: '<path d="M3 20V11l5-3 5 3v9"/><path d="M13 20v-6l4-2.5 4 2.5V20"/><path d="M2 20h20"/><path d="M6 20v-3.5h4V20"/>',
  // shipping-form unit with corrugation
  unit: '<path d="M3 7.5h18v11H3z"/><path d="M7 7.5v11M12 7.5v11M17 7.5v11"/>',
};

const PRODUCT_ICON: Record<ProductId, IconName> = {
  'porta-cabin': 'cabin',
  'office-cabin': 'office',
  'security-cabin': 'cabin',
  'toilet-cabin': 'cabin',
  'accommodation-cabin': 'colony',
  'container-office': 'unit',
  'site-office': 'office',
  'portable-cabin': 'cabin',
  'container-houses': 'house',
  'prefab-container-homes': 'house',
  'shipping-container-homes': 'house',
  'affordable-container-homes': 'house',
  'luxury-container-houses': 'house',
  'prefab-modular-home': 'house',
  'container-cafe': 'unit',
  'labour-colony': 'colony',
  'labor-sheds': 'colony',
  'labor-hutments': 'colony',
  'prefab-labor-camps': 'colony',
  'oil-field-camp': 'colony',
  // LC-07 (17 Aug 2026) — matches every other labor-colony-cluster product's
  // icon; no IconName value fits a wet-service block more specifically.
  'ablution-block': 'colony',
};

function productIcon(id: ProductId): string {
  const paths = ICON_PATHS[PRODUCT_ICON[id] || 'unit'];
  return `<svg class="choice-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
}

/**
 * STRUCTURES removed on 03 Aug 2026.
 *
 * The step offered four options. GI-coated frame has zero hits in the frame
 * workbook; Corten is affirmatively denied by the Sources and Notes row
 * ("Container office and cafe products are not converted used ISO shipping
 * containers"); the heavier frame carries a gauge but only a qualitative cost
 * column against a price sheet that is blank and marked Pending. Rate card v2
 * struck all three uplifts.
 *
 * One option survived, so this stopped being a choice and became a stated
 * standard: see CONSTRUCTION_DISCLOSURE in calculatorCopy.ts. Step count is
 * now 8 standalone and 7 embedded.
 */

/** Help lines are the copy pack's, verbatim. Keyed by step. */
const STEP_GUIDANCE = Object.fromEntries(
  STEP_COPY.map((step) => [step.key, step.help])
) as Record<(typeof STEP_COPY)[number]['key'], string>;

export const WALL_FINISHES = [['Pre-painted steel skin', 0], ['Particle Board', -15], ['PVC', 70], ['HDHMR', 60], ['Gypsum', 85], ['WPC', 140], ['SPC', 170], ['UV Sheet', 350], ['ACP', 260]] as const;
export const CEILINGS = [['Standard ceiling', 0], ['Particle Board', -15], ['PVC', 65], ['HDHMR', 60], ['Gypsum', 85], ['WPC', 140], ['SPC', 170], ['UV Sheet', 350], ['ACP', 260]] as const;
export const FLOORING = [['Vinyl (Standard)', 0], ['PVC', 90], ['SPC', 180], ['Wooden Laminate', 110], ['Tiles', 140]] as const;
/**
 * ELECTRICAL and ADD_ONS are the LEGACY rate rows, kept for one reader only:
 * scripts/calculator/verify-rate-card-diff.mjs, which walks them to compare the
 * rates the calculator applies against rate card v2.
 *
 * They are NOT the control set and must never be used to validate a posted
 * quantity again. The step renders from ELECTRICAL_R1 / FITOUT_R1 and the
 * estimate prices from ELECTRICAL_R1 / FITOUT_R1; sanitising against these
 * arrays instead is what silently dropped every electrical and fit-out item a
 * buyer selected, because "LED Panel Light" is not "LED panel light".
 */
export const ELECTRICAL = [
  ['LED Panel Light', RATE_CARD.marketRates.ledPanel, 'Suggested: one per 40 sq ft'],
  ['Tube Light', 999, ''],
  ['Ceiling Fan', RATE_CARD.marketRates.fan, 'Suggested: one per 100 sq ft'],
  ['Exhaust Fan', RATE_CARD.marketRates.exhaust, ''],
  ['Split AC 1 Ton incl. installation', RATE_CARD.marketRates.ac1T, ''],
  ['Plug Point', RATE_CARD.marketRates.plugPoint, 'Suggested: one per 50 sq ft'],
  ['Pop-up Socket', RATE_CARD.marketRates.popupSocket, ''],
  ['External / Entrance Light', RATE_CARD.marketRates.externalLight, 'Suggested: one per cabin'],
  ['FR Copper Wire Coil 90 m, 1.5 sq mm', RATE_CARD.marketRates.wire15sqmm, ''],
  ['FR Copper Wire Coil 90 m, 2.5 sq mm', RATE_CARD.marketRates.wire25sqmm, ''],
] as const;
export const ADD_ONS = [
  ['Attached WC / Toilet (4x4)', 65000],
  ['Toilet with Bath / Washroom (6x4)', 85000],
  ['Pantry Counter', RATE_CARD.marketRates.pantry],
  ['Wash Basin', RATE_CARD.marketRates.basin],
  ['Urinal', RATE_CARD.marketRates.urinal],
  ['Workstation', RATE_CARD.marketRates.workstation],
  ['Manager Table (5x2)', RATE_CARD.marketRates.managerTable],
  ['Manager Table (L-shaped)', RATE_CARD.marketRates.managerTableLShape],
  ['Conference Table', RATE_CARD.marketRates.conferenceTable],
  ['Cupboard', RATE_CARD.marketRates.cupboard],
  ['Overhead Cabinet', RATE_CARD.marketRates.overheadCabinet],
  ['Table with Drawer', RATE_CARD.marketRates.tableWithDrawer],
  ['Table without Drawer', RATE_CARD.marketRates.tableWithoutDrawer],
  ['Revolving Chair, Head Rest', RATE_CARD.marketRates.revolvingChairHeadRest],
  ['Revolving Chair, Back Rest', RATE_CARD.marketRates.revolvingChairBackRest],
] as const;

const WINDOW_RATES = {
  'uPVC Sliding': RATE_CARD.marketRates.upvcWindow,
  'Aluminium Sliding': RATE_CARD.marketRates.aluminiumSliding,
  'Openable uPVC': RATE_CARD.marketRates.openableUpvc,
  'Fixed Glass': RATE_CARD.marketRates.fixedGlass,
} as const;
const WALLS: readonly Wall[] = ['Front', 'Rear', 'Left', 'Right'];
const PUF_THICKNESSES = [30, 40, 50, 60, 80] as const;
const ROOM_TYPES = ['Reception', 'Bedroom', 'Workspace', 'Kitchen', 'Toilet', 'Storage', 'Hall', 'Other'] as const;
const SCOPE_NOTE = 'Colony buildings are configured as complete blocks. Doors, windows, electrical points and fittings follow the approved building drawing for the configuration you select, and any change you need is itemised in your fixed quotation.';
const SIZE_ERROR = 'Enter a length and width between 4 and 60 ft. For larger buildings, request a quotation and we will size it with you.';

export const CALCULATOR_MESSAGES = {
  sizeInvalid: SIZE_ERROR,
  requiredFields: 'Please add your name and mobile number so our sales team can send your fixed quotation.',
  mobileInvalid: 'Enter a 10-digit Indian mobile number.',
  emailRequired: 'Please add your email so we can send your quotation PDF.',
  saved: 'Design saved on this device.',
  restored: 'Your saved design has been restored. Start over to begin fresh.',
  linkCopied: 'Link copied. Anyone who opens it sees this exact configuration.',
  submitSuccess: 'Configuration received. We aim to send your fixed-price quotation within 48 business hours after receiving complete dimensions, specifications, delivery PIN code and scope. Complex engineered configurations may require additional time, which we will confirm.',
  submitFailure: 'We could not submit right now. Please try again, or WhatsApp us at +91 88616 22859 and we will take it from there.',
} as const;

export const CABIN_CALCULATOR_SSR_STYLES = `
.cabin-calculator-ssr{
  --calc-primary: #1a3c2e;
  --calc-secondary: #2d7a3f;
  --calc-surface: #f0f7f2;
  --calc-bg: var(--calc-surface);
  --calc-card: var(--calc-surface);
  --calc-soft: var(--calc-secondary);
  --calc-softest: var(--calc-surface);
  --calc-border: var(--calc-primary);
  --calc-on-card: var(--calc-primary);
  --calc-text: var(--calc-primary);
  --calc-muted: var(--calc-primary);
  --calc-accent: var(--calc-primary);
  --calc-accent-strong: var(--calc-primary);
  --calc-focus: var(--calc-primary);
  --calc-shadow: rgba(26, 60, 46, 0.28);
  --calc-row-gap: 12px;
  background: var(--calc-bg);
  color: var(--calc-text);
  padding: 1rem;
  border-radius: 16px;
}

.cabin-calculator-ssr[data-theme="light"]{
  --calc-bg: var(--calc-surface);
  --calc-card: var(--calc-secondary);
  --calc-soft: var(--calc-primary);
  --calc-border: var(--calc-primary);
  --calc-on-card: var(--calc-surface);
  --calc-text: var(--calc-surface);
  --calc-muted: var(--calc-surface);
  --calc-accent: var(--calc-primary);
  --calc-accent-strong: var(--calc-surface);
  --calc-focus: var(--calc-surface);
}

.cabin-calculator-ssr[data-theme="green"]{
  --calc-bg: var(--calc-secondary);
  --calc-card: var(--calc-surface);
  --calc-soft: var(--calc-surface);
  --calc-border: var(--calc-primary);
  --calc-on-card: var(--calc-primary);
  --calc-text: var(--calc-primary);
  --calc-muted: var(--calc-primary);
  --calc-accent: var(--calc-primary);
  --calc-accent-strong: var(--calc-primary);
  --calc-focus: var(--calc-primary);
}

.cabin-calculator-ssr *{
  box-sizing: border-box;
}

.cabin-calculator-ssr button,
.cabin-calculator-ssr input,
.cabin-calculator-ssr select,
.cabin-calculator-ssr textarea{
  font: inherit;
  min-height: 44px;
}

.cabin-calculator-ssr button,
.cabin-calculator-ssr input,
.cabin-calculator-ssr select,
.cabin-calculator-ssr textarea,
.cabin-calculator-ssr .calc-choice{
  border: 1px solid var(--calc-border);
  border-radius: 10px;
  background: var(--calc-card);
  color: var(--calc-text);
}

.cabin-calculator-ssr button:focus-visible,
.cabin-calculator-ssr input:focus-visible,
.cabin-calculator-ssr select:focus-visible,
.cabin-calculator-ssr textarea:focus-visible,
.cabin-calculator-ssr a:focus-visible{
  outline: 3px solid var(--calc-focus);
  outline-offset: 2px;
}

.calculator-header,
.step-card,
.estimate-card,
.price-tables,
.calculator-copy,
.noscript-content{
  background: var(--calc-card);
  border: 1px solid var(--calc-border);
  border-radius: 14px;
  padding: 1rem;
  margin-block: var(--calc-row-gap);
}

.calculator-header{
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem 1rem;
  align-items: center;
}

.calculator-header>*{
  margin: 0;
}

.calculator-header p{
  margin-bottom: 0.2rem;
}

.calculator-header small{
  color: var(--calc-muted);
}

.calculator-header strong{
  display: block;
  color: var(--calc-accent-strong);
  font-size: clamp(1.1rem, 2.2vw, 2rem);
}

.calculator-header-actions{
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.calculator-header-actions > button{
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--calc-border);
  background: var(--calc-soft);
}

.step-nav{
  display: flex;
  gap: 0.45rem;
  overflow-x: auto;
  padding: 0.2rem 0;
  scrollbar-width: thin;
}

.step-nav a{
  white-space: nowrap;
  min-height: 40px;
  line-height: 1.1;
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--calc-border);
  color: var(--calc-text);
  background: var(--calc-soft);
}

  .step-nav a.is-active{
  /* Was accent-filled. #2d7a3f is demoted to success and confirmation only,
     so the active pill carries amber and dark text instead. */
  background: var(--saman-amber);
  color: #0D1F17;
  border-color: var(--saman-amber);
}

.step-nav a.is-complete{
  color: var(--calc-accent);
  border-color: var(--calc-accent);
  background: var(--calc-soft);
  opacity: 0.85;
}

.step-nav a[aria-current="false"]{
  opacity: 0.65;
}

.step-card{
  position: relative;
}

.calculator-grid{
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
  gap: 1rem;
  align-items: start;
}

.step-card,
.estimate-card{
  min-height: 0;
}

.cabin-calculator-ssr.is-enhanced .calc-step{
  display: none;
}

.cabin-calculator-ssr.is-enhanced .calc-step.is-active{
  display: block;
}

.calc-step{
  padding: 0.75rem 0 1.5rem;
  border-bottom: 1px solid var(--calc-border);
}

.step-guidance{
  margin-bottom: 0.55rem;
  margin-top: -0.25rem;
}

.product-tiles{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 0.75rem;
}

.calc-choice,
.quantity-row{
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  padding: 0.72rem;
  margin: 0.45rem 0;
  border-radius: 12px;
  border: 1px solid var(--calc-border);
  background: var(--calc-soft);
}

.calc-choice{
  min-height: 54px;
  position: relative;
  align-items: center;
}

.calc-choice .choice-title{
  color: var(--calc-on-card);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.calc-choice .choice-icon{
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  vertical-align: -0.2em;
  margin-right: 0.4rem;
}

.choice-title{
  font-weight: 600;
}

.calc-choice .choice-description{
  margin-top: 0.2rem;
}

.choice-badge{
  margin-top: 0.15rem;
  border: 1px solid currentColor;
  border-radius: 999px;
  padding: 0.08rem 0.5rem;
  font-size: 0.74rem;
  width: fit-content;
}

.calc-choice.is-selected{
  border-color: var(--calc-accent);
  background: color-mix(in oklab, var(--calc-surface) 85%, var(--calc-accent) 15%);
  color: var(--calc-accent);
}

.calc-choice.is-selected::after{
  content: "Selected";
  position: absolute;
  right: 0.6rem;
  top: 0.45rem;
  border: 1px solid var(--calc-accent);
  color: var(--calc-accent);
  border-color: var(--calc-accent);
  border-radius: 999px;
  font-size: 0.72rem;
  line-height: 1;
  padding: 0.2rem 0.45rem;
  font-weight: 700;
}

.calc-choice.is-selected small{
  color: var(--calc-accent);
}

.calc-choice input{
  min-height: auto;
  margin-top: 0.2rem;
}

.calc-choice input:checked + span{
  color: var(--calc-accent-strong);
}

.calc-choice input:focus-visible + span{
  outline: 2px solid var(--calc-focus);
  outline-offset: 2px;
}

.calc-choice:has(input:checked){
  /* Was an accent-tinted fill on the label, which painted every selected card
     #2d7a3f straight through the dark surface. The selected state is an amber
     border on the card itself; the label stays a bare wrapper. */
  border-color: transparent;
  background: none;
}

.calc-choice span,
.quantity-row span{
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.quantity-row.is-filled{
  border-color: var(--calc-accent);
}

.calc-choice small,
.quantity-row small,
.cabin-calculator-ssr p,
.cabin-calculator-ssr dd{
  color: var(--calc-muted);
  line-height: 1.35;
}

.field-grid{
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.cabin-calculator-ssr label:not(.calc-choice):not(.quantity-row):not(.ec-card):not(.socket-nudge){
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-block: 0.45rem;
}

.cabin-calculator-ssr input,
.cabin-calculator-ssr select,
.cabin-calculator-ssr textarea{
  width: 100%;
  padding: 0.55rem 0.7rem;
}

.opening-card,
.floor-plan,
.scope-note,
fieldset{
  width: 100%;
}

.wall-diagram{
  margin-block: 0.6rem 0.8rem;
  display: grid;
  gap: 0.35rem;
  border: 1px solid var(--calc-border);
  border-radius: 12px;
  padding: 0.65rem;
  background: var(--calc-soft);
}

.wall-diagram .wall-layer{
  display: flex;
  align-items: center;
  gap: 0.55rem;
  border-radius: 999px;
  border: 1px dashed var(--calc-border);
  padding: 0.35rem 0.55rem;
}

.cabin-calculator-ssr fieldset{
  border: 1px solid var(--calc-border);
  border-radius: 12px;
  padding: 0.8rem;
  margin-block: 0.9rem;
}

.floor-plan{
  display: block;
  width: min(100%, 640px);
  min-height: 220px;
  background: var(--calc-soft);
  border: 1px solid var(--calc-border);
  border-radius: 12px;
}

.shell{
  fill: var(--calc-soft);
  stroke: var(--calc-accent-strong);
  stroke-width: 2;
}

.partition{
  stroke: color-mix(in oklab, var(--calc-muted) 70%, transparent);
  stroke-dasharray: 4 3;
}

.door-mark{
  fill: var(--calc-accent);
}

.window-mark{
  fill: var(--calc-accent);
}

.floor-plan text{
  fill: var(--calc-muted);
  font-size: 9px;
  text-anchor: middle;
}

.quantity-row{
  justify-content: space-between;
  background: var(--calc-soft);
}

.quantity-row input{
  width: 5.2rem;
}

.estimate-card{
  align-self: start;
  position: sticky;
  top: 5.5rem;
}

.estimate-lines > div{
  display: flex;
  justify-content: space-between;
  gap: 0.9rem;
  padding: 0.45rem 0;
  border-bottom: 1px solid var(--calc-border);
}

.estimate-lines dd{
  margin: 0;
  text-align: right;
}

.total{
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  text-align: center;
  background: var(--calc-soft);
  border-radius: 12px;
  padding: 0.75rem;
  margin: 1rem 0;
}

.total strong{
  font-size: clamp(1.35rem, 2.2vw, 2rem);
  color: var(--calc-accent);
}

.estimate-actions{
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.estimate-actions > button{
  width: 100%;
  min-height: 40px;
  border-radius: 10px;
  border: 1px solid var(--calc-border);
  background: var(--calc-soft);
}

.price-tables details{
  margin-block: 0.55rem;
}

.price-tables summary{
  min-height: 40px;
  padding: 0.55rem;
  cursor: pointer;
  font-weight: 700;
}

.cabin-calculator-ssr table{
  width: 100%;
  border-collapse: collapse;
}

.cabin-calculator-ssr th,
.cabin-calculator-ssr td{
  text-align: left;
  padding: 0.65rem 0.45rem;
  border: 1px solid var(--calc-border);
}

.calculator-status{
  border: 1px solid var(--calc-border);
  background: var(--calc-soft);
  padding: 0.65rem;
  border-radius: 10px;
  margin-block: 0.65rem;
}

.cabin-calculator-ssr.is-enhanced .price-tables{
  display: none;
}

.cabin-calculator-ssr.is-enhanced .price-tables[hidden]{
  display: none !important;
}

.print-letterhead,
.print-footer{
  display: none;
}

.calculator-copy section,
.calculator-copy p{
  margin-block: 0.45rem;
}

.mobile-estimate{
  display: none;
}

@media (max-width: 1024px){
  .calculator-grid{
    grid-template-columns: 1fr;
  }

  .step-card{
    min-height: 0;
    max-height: none;
  }
}

@media (max-width: 760px){
  .calculator-header{
    grid-template-columns: 1fr;
  }

  .step-nav{
    gap: 0.35rem;
  }

  .step-nav a{
    border-radius: 999px;
  }

  .estimate-card{
    position: static;
    top: auto;
  }

  .field-grid{
    grid-template-columns: 1fr;
  }

  .price-tables{
    overflow-x: auto;
  }

  .mobile-estimate{
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    display: block;
    background: var(--calc-card);
    border-top: 1px solid var(--calc-border);
    padding: 0.55rem;
    z-index: 40;
  }

  .mobile-estimate a{
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 56px;
    color: var(--calc-text);
    gap: 0.5rem;
    text-decoration: none;
  }

  .cabin-calculator-ssr{
    padding-bottom: 7rem;
  }
}

@media print{
  .print-letterhead,
  .print-footer{
    display: flex;
    flex-direction: column;
  }

  .step-nav,
  .step-card,
  .mobile-estimate,
  .estimate-actions{
    display: none !important;
  }

  .calculator-grid{
    display: block;
  }

  .estimate-card{
    position: static;
  }
}

/* ---------------------------------------------------------------------------
   PHASE 1 LAYER - design spec v1 Part 4 and Part 5.

   Written compactly and last so it wins the cascade over the earlier rules.
   Four colours only: #1a3c2e, #2d7a3f, #f0f7f2, #ffffff. Opacity variants of
   those four are permitted; new hues are not.

   Every box's background differs from the background it sits on. That is the
   defect SAMAN rejected - a green section containing green cards, legible only
   because the text happened to be white - and the mechanical gate asserts it.
--------------------------------------------------------------------------- */
.cabin-calculator-ssr{--c-ink:#1a3c2e;--c-accent:#2d7a3f;--c-soft:#f0f7f2;--c-white:#ffffff}
.cabin-calculator-ssr[data-theme="light"]{--bg-section:var(--c-white);--fg-section:var(--c-ink);--bg-summary:var(--c-ink);--fg-summary:var(--c-white);--bg-card:var(--c-soft);--fg-card:var(--c-ink);--bd-card:rgba(26,60,46,.2);--bg-card-sel:var(--c-ink);--fg-card-sel:var(--c-white);--bd-card-sel:var(--c-accent);--bg-pill:var(--c-soft);--fg-pill:var(--c-ink);--bg-pill-on:var(--c-ink);--fg-pill-on:var(--c-white);--bd-pill-on:transparent;--bg-panel:var(--c-soft);--fg-panel:var(--c-ink);--bd-panel:rgba(26,60,46,.15);--bg-total:var(--c-ink);--fg-total:var(--c-white);--bd-total:transparent}
.cabin-calculator-ssr[data-theme="green"]{--bg-section:var(--c-ink);--fg-section:var(--c-white);--bg-summary:var(--c-white);--fg-summary:var(--c-ink);--bg-card:var(--c-white);--fg-card:var(--c-ink);--bd-card:transparent;--bg-card-sel:var(--c-white);--fg-card-sel:var(--c-ink);--bd-card-sel:var(--c-accent);--bg-pill:var(--c-soft);--fg-pill:var(--c-ink);--bg-pill-on:var(--c-white);--fg-pill-on:var(--c-ink);--bd-pill-on:var(--c-accent);--bg-panel:var(--c-white);--fg-panel:var(--c-ink);--bd-panel:transparent;--bg-total:var(--c-soft);--fg-total:var(--c-ink);--bd-total:var(--c-accent)}
.cabin-calculator-ssr{background:var(--bg-section);color:var(--calc-text)}
.calculator-header{background:var(--bg-summary);color:var(--calc-text);border-radius:12px;padding:1rem 1.15rem}
.calculator-header h2,.calculator-header p,.calculator-header small,.calculator-header strong{color:var(--calc-text)}
.calc-choice>span{background:var(--bg-card);color:var(--calc-text);border:1px solid var(--bd-card);border-radius:10px;display:block;padding:.7rem .8rem}
.calc-choice input:checked+span{background:var(--bg-card-sel);color:var(--calc-text);border:2px solid var(--bd-card-sel)}
.calc-choice input:checked+span *{color:var(--calc-text)}
.step-nav a{background:var(--bg-pill);color:var(--calc-text);border-radius:999px;padding:.45rem .8rem;min-height:44px;display:inline-flex;align-items:center;text-decoration:none;opacity:1}
.step-nav a.is-active,.step-nav a[aria-current="step"]{background:var(--bg-pill-on);color:var(--calc-text);border:2px solid var(--bd-pill-on);opacity:1}
.estimate-card{background:var(--bg-panel);color:var(--calc-text);border:1px solid var(--bd-panel);border-radius:12px;padding:1rem}
.estimate-card .total{background:var(--bg-total);color:var(--calc-text);border:1px solid var(--bd-total);border-radius:10px;padding:.75rem;display:flex;flex-direction:column;gap:.15rem}
.estimate-card .total *{color:var(--calc-text)}
.cabin-calculator-ssr button.primary,.cabin-calculator-ssr [type="submit"]{background:var(--c-accent);color:var(--c-white);border:none;border-radius:8px;min-height:44px;padding:.6rem 1.1rem;font-weight:600;cursor:pointer}
.cabin-calculator-ssr button.ghost{background:var(--bg-card);color:var(--calc-text);border:1px solid var(--bd-card);border-radius:8px;min-height:44px;padding:.6rem 1rem;cursor:pointer}
.cabin-calculator-ssr input,.cabin-calculator-ssr select,.cabin-calculator-ssr textarea,.cabin-calculator-ssr button{min-height:44px}
.cabin-calculator-ssr :focus-visible{outline:3px solid var(--c-accent);outline-offset:2px}
/* Part 5: no fixed inner height, no internal scrollbar. The panel grows. */
.calculator-grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(280px,1fr);gap:1.25rem;align-items:start}
/* The step panel is not one of the spec's painted boxes. It must not paint,
   or the accent primary button ends up sitting on accent. */
.step-card{height:auto;overflow:visible;background:transparent}
.cabin-calculator-ssr .estimate-card .total{background:var(--bg-total)}
.step-counter{margin:0 0 .4rem;font-weight:600}
.step-progress{background:var(--bg-card);border-radius:999px;height:6px;overflow:hidden;margin-bottom:.85rem}
.step-progress>span{display:block;height:100%;background:var(--c-accent)}
.step-actions{display:flex;gap:.6rem;align-items:center;justify-content:space-between;border-top:1px solid var(--bd-card);margin-top:1rem;padding-top:1rem}
/* All steps render visible. Only the enhanced path hides them. */
.calc-step{display:block}
.cabin-calculator-ssr.is-enhanced .calc-step:not(.is-active){display:none}
.construction-disclosure{background:var(--bg-card);color:var(--calc-text);border:1px solid var(--bd-card);border-radius:10px;padding:.85rem 1rem;margin:.75rem 0}
.mobile-estimate{display:none}
/* Contrast fixes found by axe against the real browser, not by eye.
   1. Legacy .step-nav a[aria-current="false"] carried opacity .65 and is more
      specific than our .step-nav a rule, dimming #1a3c2e to an effective
      #6a8077 on #f5faf7 = 4.0:1.
   2. Muted helper text inherited the SOFT colour as a FOREGROUND: #f0f7f2 on
      #ffffff = 1.08:1, effectively invisible.
   3. The copy section and price tables sat on accent, putting #1a3c2e on
      #2d7a3f = 2.29:1. */
.step-nav a[aria-current="false"]{opacity:1;color:var(--calc-text)}
.cabin-calculator-ssr .step-counter,.cabin-calculator-ssr .step-counter *,.cabin-calculator-ssr [data-step-name],.cabin-calculator-ssr .step-guidance,.cabin-calculator-ssr .step-guidance small,.cabin-calculator-ssr .step-tip,.cabin-calculator-ssr .step-tip small,.cabin-calculator-ssr .calc-step,.cabin-calculator-ssr .calc-step h2,.cabin-calculator-ssr .calc-step legend,.cabin-calculator-ssr .calc-step label,.cabin-calculator-ssr .calc-step p,.cabin-calculator-ssr .calc-step small,.cabin-calculator-ssr .calc-step h3{color:var(--calc-text)}
.cabin-calculator-ssr .calc-choice>span,.cabin-calculator-ssr .calc-choice>span *{color:var(--calc-text)}
.cabin-calculator-ssr .calc-choice input:checked+span,.cabin-calculator-ssr .calc-choice input:checked+span *{color:var(--calc-text)}
.cabin-calculator-ssr .estimate-card,.cabin-calculator-ssr .estimate-card *{color:var(--calc-text)}
.cabin-calculator-ssr .estimate-card .total,.cabin-calculator-ssr .estimate-card .total *{color:var(--calc-text)}
.cabin-calculator-ssr .construction-disclosure,.cabin-calculator-ssr .construction-disclosure *{color:var(--calc-text)}
.calculator-copy,.price-tables,.noscript-content{background:var(--bg-section)}
.cabin-calculator-ssr .calculator-intro,.cabin-calculator-ssr .calculator-intro p,.cabin-calculator-ssr .calculator-intro h2,.cabin-calculator-ssr .calculator-faq,.cabin-calculator-ssr .calculator-faq p,.cabin-calculator-ssr .calculator-faq dt,.cabin-calculator-ssr .calculator-faq dd,.cabin-calculator-ssr .calculator-faq h2,.calculator-faq,.calculator-faq h2,.calculator-faq dt,.calculator-faq dd,.cabin-calculator-ssr .calculator-copy,.cabin-calculator-ssr .calculator-copy p,.cabin-calculator-ssr .calculator-copy h2,.cabin-calculator-ssr .calculator-copy h3,.cabin-calculator-ssr .calculator-copy dt,.cabin-calculator-ssr .calculator-copy dd,.cabin-calculator-ssr .calculator-copy li,.cabin-calculator-ssr .calculator-copy small,.cabin-calculator-ssr .price-tables,.cabin-calculator-ssr .price-tables th,.cabin-calculator-ssr .price-tables td,.cabin-calculator-ssr .price-tables caption,.cabin-calculator-ssr .price-tables summary,.cabin-calculator-ssr .price-tables p,.cabin-calculator-ssr .noscript-content,.cabin-calculator-ssr .noscript-content p,.cabin-calculator-ssr .noscript-content h2{color:var(--calc-text)}
.cabin-calculator-ssr button.primary,.cabin-calculator-ssr [type="submit"]{color:var(--c-white)}
/* =========================================================================
   PARITY LAYER - Fable 5 spec, 04 Aug 2026. Competitor geometry at 100%.
   Every value here was measured off their live calculator, not chosen.
   Geometry is theirs; colour stays ours.
   ========================================================================= */

/* P0: the estimate rendered TWICE on mobile - the aside inline at 523px and
   the sticky bar at 64px, both display:block. 523px of pure duplication. */
@media(max-width:1023.98px){.cabin-calculator-ssr .calculator-side>.estimate-card{display:none}}

/* CLASS 1 - container 1280/32 -> 1216 content; grid 852+24+340 = 1216.
   The estimate track is FIXED at 340px, so the step panel takes the
   remainder rather than both being fluid. */
/* Container maths: 1280 max-width minus 32px padding each side = 1216 content,
   which is 852 + 24 + 340 exactly. Scoped to the standalone route so the
   embedded calculator keeps its host page's container. */
.cabin-calculator-ssr[data-mode="standalone"]{max-width:1280px;margin-left:auto;margin-right:auto;padding-left:32px;padding-right:32px}
.cabin-calculator-ssr .calculator-grid{grid-template-columns:minmax(0,1fr) 340px;gap:24px;align-items:stretch}
/* Their header is one content row plus a pill row inside 127px. Ours was four
   stacked blocks at 155px because the four utility buttons and the pill row
   each took a line of their own. */
.cabin-calculator-ssr .calculator-header{min-height:0;height:auto;border-radius:16px;margin-bottom:24px;padding:12px 20px;display:grid;grid-template-columns:minmax(0,1fr) auto auto;grid-template-areas:"summary total actions" "nav nav nav";align-items:center;column-gap:16px;row-gap:8px}
.cabin-calculator-ssr .calculator-header>div:nth-child(1){grid-area:summary}
.cabin-calculator-ssr .calculator-header>div:nth-child(2){grid-area:total;text-align:right}
.cabin-calculator-ssr .calculator-header-actions{grid-area:actions;display:flex;gap:6px;flex-wrap:nowrap}
.cabin-calculator-ssr .calculator-header-actions button{position:relative;height:25px;min-height:25px;padding:4px 10px;font-size:11px;font-weight:500;border-radius:9999px;white-space:nowrap;border:none;background:rgba(255,255,255,.14);color:inherit;cursor:pointer}
.cabin-calculator-ssr .calculator-header-actions button::after{content:"";position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);height:44px;min-width:44px}
.cabin-calculator-ssr .calculator-header .step-nav{grid-area:nav}
/* The pills now sit ON the summary header, so they must contrast with IT, not
   with the section. In mode W the header is ink, so an ink active pill was ink
   on ink - the exact green-on-green defect SAMAN rejected. Inside the header
   the pill tokens invert. */
.cabin-calculator-ssr[data-theme="light"] .calculator-header .step-nav a{background:rgba(255,255,255,.14);color:var(--c-white)}
.cabin-calculator-ssr[data-theme="light"] .calculator-header .step-nav a.is-active,.cabin-calculator-ssr[data-theme="light"] .calculator-header .step-nav a[aria-current="step"]{background:var(--c-soft);color:var(--c-ink)}
.cabin-calculator-ssr[data-theme="green"] .calculator-header .step-nav a{background:var(--c-soft);color:var(--c-ink)}
.cabin-calculator-ssr[data-theme="green"] .calculator-header .step-nav a.is-active,.cabin-calculator-ssr[data-theme="green"] .calculator-header .step-nav a[aria-current="step"]{background:var(--c-ink);color:var(--c-white)}
.cabin-calculator-ssr .calculator-header>div{min-width:0}
.cabin-calculator-ssr .calculator-header>div:first-child{flex:1 1 auto}
.cabin-calculator-ssr .calculator-header p:first-child{font-size:11px;font-weight:700;margin:0}
.cabin-calculator-ssr .calculator-header h2{font-size:18px;font-weight:700;margin:2px 0}
.cabin-calculator-ssr .calculator-header [data-summary-size]{font-size:11px;font-weight:400;margin:0}
.cabin-calculator-ssr .calculator-header [data-summary-label]{font-size:11px;font-weight:400;margin:0}
.cabin-calculator-ssr .calculator-header [data-summary-ex]{font-size:18px;font-weight:700}
.cabin-calculator-ssr .calculator-header [data-summary-incl]{font-size:11px;font-weight:400;display:block}
/* Was 88px, reserving room for a header that overlaid the card. The header is
   now a block above the card with its own 24px margin and overlaps nothing, so
   the reservation was 80px of dead air at the top of all nine steps. */
.cabin-calculator-ssr .step-card>.calc-step{padding-top:8px}

/* CLASS 2 - step pills. Visual height 25px, but the touch target stays 44px
   through a pseudo-element, so density and WCAG 2.5.8 both hold. */
.cabin-calculator-ssr .step-nav{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0}
.cabin-calculator-ssr .step-nav a{position:relative;height:25px;min-height:25px;padding:4px 10px;font-size:11px;font-weight:500;border-radius:9999px;display:inline-flex;align-items:center;line-height:1}
.cabin-calculator-ssr .step-nav a::after{content:"";position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);height:44px;min-width:44px}

/* CLASS 2 - product cards. LANDSCAPE 257x93, icon left / text right. */
.cabin-calculator-ssr .product-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
/* The label wrapping each card carried 80px of legacy padding and margin, so a
   93px card occupied 173px. Four rows of that was 320px of dead space at
   desktop and 960px at mobile. The span IS the card; the label is a wrapper. */
.cabin-calculator-ssr .product-tiles .calc-choice{display:block;width:100%;padding:0;margin:0;border:none;background:none}
/* The radio itself sat above the card inside the label, adding 55px per card.
   Taken out of flow rather than hidden: it stays focusable and stays in the
   accessibility tree, the label still activates it, and the focus ring moves
   to the card so keyboard users see the same target a mouse user clicks. */
.cabin-calculator-ssr .product-tiles .calc-choice>input{position:absolute;width:1px;height:1px;opacity:0;margin:0;pointer-events:none}
.cabin-calculator-ssr .product-tiles .calc-choice{position:relative}
.cabin-calculator-ssr .product-tiles .calc-choice>input:focus-visible+span{outline:3px solid var(--c-accent);outline-offset:2px}
.cabin-calculator-ssr .product-tiles .calc-choice>span{width:100%;box-sizing:border-box;display:grid;grid-template-columns:24px minmax(0,1fr);grid-template-areas:"icon title" "icon desc" "icon price";column-gap:10px;row-gap:1px;align-content:center;height:93px;padding:12px;border-radius:12px;position:relative}
.cabin-calculator-ssr .product-tiles .choice-icon{grid-area:icon;align-self:start;width:24px;height:24px}
.cabin-calculator-ssr .product-tiles .choice-icon svg{width:24px;height:24px}
.cabin-calculator-ssr .product-tiles .choice-title{grid-area:title;font-size:14px;font-weight:600;line-height:1.2;display:block}
.cabin-calculator-ssr .product-tiles .choice-description{grid-area:desc;font-size:11px;font-weight:400;line-height:1.25}
.cabin-calculator-ssr .product-tiles .choice-price{grid-area:price;font-size:11px;font-weight:400;line-height:1.25}
.cabin-calculator-ssr .product-tiles .choice-badge{position:absolute;top:6px;right:6px;font-size:9px;font-weight:700;padding:1px 6px;border-radius:9999px;background:var(--c-accent);color:var(--c-white)}

/* CLASS 2 - estimate panel 340x500, padding 20, radius 16, rows 20-29. */
.cabin-calculator-ssr .calculator-side>.estimate-card{width:340px;padding:20px;border-radius:16px}
.cabin-calculator-ssr .estimate-card h2{font-size:14px;font-weight:700;margin:0 0 8px}
.cabin-calculator-ssr .estimate-card .estimate-lines>div{min-height:20px;padding:2px 0;font-size:12px;line-height:1.4}
.cabin-calculator-ssr .estimate-card .estimate-lines dt,.cabin-calculator-ssr .estimate-card .estimate-lines dd{font-size:12px;line-height:1.4;margin:0}

/* MOBILE - intro capped so it cannot regrow into the 1169px block it was. */
@media(max-width:1023.98px){
  .cabin-calculator-ssr{padding-left:16px;padding-right:16px}
  .cabin-calculator-ssr .calculator-grid{grid-template-columns:minmax(0,1fr)}
  /* The desktop header is a 3-column grid. At 390 those columns cannot fit,
     so each child took a row of its own and the header stood at 360px.
     Two compact rows plus the pill row instead. */
  .cabin-calculator-ssr .calculator-header{min-height:0;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"summary total" "actions actions" "nav nav";row-gap:6px;padding:10px 14px}
  .cabin-calculator-ssr .calculator-header-actions{flex-wrap:wrap}
  .cabin-calculator-ssr .step-card>.calc-step{padding-top:16px}
  /* Two columns below 767px. One column stacked twelve 93px cards into
     1248px of the mobile page; two columns halves the rows. */
  .cabin-calculator-ssr .product-tiles{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .cabin-calculator-ssr .product-tiles .calc-choice>span{height:100px;padding:8px;grid-template-columns:20px minmax(0,1fr);column-gap:8px;grid-template-areas:"icon title" "icon desc" "icon price"}
  .cabin-calculator-ssr .product-tiles .choice-icon,.cabin-calculator-ssr .product-tiles .choice-icon svg{width:20px;height:20px}
  .cabin-calculator-ssr .product-tiles .choice-title{font-size:12px;line-height:1.15}
  /* One line, truncated rather than wrapped, so card height cannot drift. */
  .cabin-calculator-ssr .product-tiles .choice-description{font-size:10px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .cabin-calculator-ssr .product-tiles .choice-price{font-size:10px;line-height:1.2}
  .cabin-calculator-ssr .product-tiles .choice-platform{font-size:8px;top:4px;right:4px;padding:0 4px}
}
.cabin-calculator-ssr .calculator-intro{max-width:768px;margin:0 auto 24px}
.cabin-calculator-ssr .calculator-intro h2{font-size:18px;font-weight:700;margin:0 0 8px}
.cabin-calculator-ssr .calculator-intro p{font-size:13px;line-height:1.5;margin:0 0 8px}
/* =========================================================================
   DARK SURFACE SYSTEM - Fable 5 spec, 04 Aug 2026.
   Last in the cascade, so this is the surface that actually paints.

   ACCENT DISCIPLINE. Amber appears in exactly five roles and nowhere else:
   price figures, primary CTA fill, active pill fill, selected card border,
   add-on "+" values. No amber headings, body text or icons.

   TOKEN NAMES ARE NAMESPACED sd-*, not calc-*. The spec named these
   --calc-ground, --calc-panel, --calc-card and so on, but the retired
   light/green system already owns --calc-card at HIGHER specificity
   (.cabin-calculator-ssr[data-theme="light"] beats .cabin-calculator-ssr).
   Declaring --calc-card here silently inherited the old value and painted
   every selected card #2d7a3f - the very colour this spec demotes. The
   VALUES are exactly as specified; only the names avoid the collision.

   #2d7a3f is DEMOTED to success and confirmation only. It is never an active
   state, never a selected state, never a CTA. That demotion is what removes
   the green-on-green defect class at the root rather than patching it.
   ========================================================================= */
/* §2 revised, 05 Aug. The ground is no longer derived from brand green.
   The --calc-* names are the spec's; the --sd-* names are what every rule in
   this stylesheet already reads, so they alias the same values rather than
   being replaced. Both are declared here, in one place, from one set of
   literals - a second declaration site is how --calc-card came to mean two
   different colours at two different specificities once before. */
/* The selector list matches the theme blocks near the top of this stylesheet,
   which redeclare --calc-card and --calc-text at [data-theme="light"] strength.
   A plain .cabin-calculator-ssr rule loses to them, and the root carries
   data-theme="light" - that is exactly how --calc-card once meant two colours
   at once and painted every selected card green. Same specificity, declared
   later, so these values win outright. Literals on both sets: --sd-* does not
   alias --calc-*, so neither can be pulled out from under the other. */
.cabin-calculator-ssr,.cabin-calculator-ssr[data-theme="light"],.cabin-calculator-ssr[data-theme="green"]{--calc-ground:#0E1729;--calc-panel:#16223A;--calc-card:#1B2942;--calc-inset:#121C31;--calc-hairline:rgba(255,255,255,0.08);--calc-hairline-hi:rgba(255,255,255,0.20);--calc-control-border:rgba(255,255,255,0.34);--calc-text:#EAF0F7;--calc-text-2:rgba(234,240,247,0.64);--calc-text-3:rgba(234,240,247,0.46);--saman-amber:#E0A340;--saman-green:#2d7a3f;--c-ink:#16223A;--c-accent:#E0A340;--bd-card:rgba(255,255,255,0.08);--bd-panel:rgba(255,255,255,0.08);--calc-primary:#16223A;--calc-secondary:#1B2942;--calc-surface:#EAF0F7;--calc-bg:#0E1729;--calc-soft:#1B2942;--calc-softest:#121C31;--calc-border:rgba(255,255,255,0.08);--calc-on-card:#EAF0F7;--calc-muted:rgba(234,240,247,0.64);--calc-accent:#E0A340;--calc-accent-strong:#E0A340;--calc-focus:#E0A340;--calc-shadow:rgba(0,0,0,0.40);--sd-ground:#0E1729;--sd-panel:#16223A;--sd-card:#1B2942;--sd-inset:#121C31;--sd-hairline:rgba(255,255,255,0.08);--sd-hairline-hi:rgba(255,255,255,0.20);--sd-control-border:rgba(255,255,255,0.34);--sd-lift:rgba(255,255,255,0.06);--sd-text:#EAF0F7;--sd-text-2:rgba(234,240,247,0.64);--sd-text-3:rgba(234,240,247,0.46)}
.cabin-calculator-ssr,.cabin-calculator-ssr[data-theme="light"],.cabin-calculator-ssr[data-theme="green"]{background:var(--sd-ground);color:var(--sd-text);border-radius:20px;margin-top:24px;margin-bottom:24px;padding-top:28px;padding-bottom:28px}
/* The brand still opens the module: green on the left, the new ground on the
   right, so the header hands off to the panel below it rather than sitting on
   a colour nothing else uses. */
.cabin-calculator-ssr .calculator-header{background:linear-gradient(135deg,#1A3C2E,#16223A);border:1px solid var(--sd-hairline);border-radius:16px}
.cabin-calculator-ssr .step-card,.cabin-calculator-ssr .calculator-side>.estimate-card{background:var(--sd-panel);border:1px solid var(--sd-hairline);border-radius:16px;padding:20px}
/* The line above only reaches .calculator-side > .estimate-card - the sidebar
   copy. Step 9 renders a SECOND estimate card inside the form, at
   #calculator-step-9 > .estimate-card, which is not a .calculator-grid child.
   It therefore missed the dark override and kept .estimate-card{background:
   var(--bg-panel)}, and --bg-panel is #f0f7f2 - light mint left over from the
   retired light/green palette. Near-white --calc-text on light mint measured
   1.03:1 on production: the "Live estimate" heading, the floor area and the
   total read as blank space on the quotation step. Background only here, no
   padding, so nothing moves and the interaction stays CLS-free. */
.cabin-calculator-ssr .estimate-card{background:var(--sd-panel);border-color:var(--sd-hairline)}
.cabin-calculator-ssr .estimate-card .estimate-lines{background:var(--sd-inset);border-radius:16px;padding:20px;margin:0}
.cabin-calculator-ssr .construction-disclosure,.cabin-calculator-ssr .calculator-intro{background:var(--sd-panel);border:1px solid var(--sd-hairline);border-radius:16px;padding:16px 20px;color:var(--sd-text)}
.cabin-calculator-ssr .product-tiles .calc-choice>span,.cabin-calculator-ssr .calc-choice>span{background:var(--sd-card);border:1px solid var(--sd-hairline);border-radius:12px;color:var(--sd-text)}
.cabin-calculator-ssr .calc-choice:hover>span{border-color:var(--sd-hairline-hi)}
.cabin-calculator-ssr .calc-choice input:checked+span{background:var(--sd-card);color:var(--sd-text);border:1px solid var(--saman-amber);box-shadow:0 0 0 3px rgba(224,163,64,0.15)}
.cabin-calculator-ssr .calculator-header p:first-child{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--sd-text-2)}
.cabin-calculator-ssr .calculator-header h2{font-size:18px;font-weight:700;color:var(--sd-text)}
.cabin-calculator-ssr .calculator-header [data-summary-size],.cabin-calculator-ssr .calculator-header [data-summary-label]{font-size:11px;font-weight:400;color:var(--sd-text-2)}
.cabin-calculator-ssr .calculator-header [data-summary-ex]{font-size:30px;font-weight:700;color:var(--saman-amber);line-height:1.1}
.cabin-calculator-ssr .calculator-header [data-summary-incl]{font-size:11px;font-weight:400;color:var(--sd-text-2)}
.cabin-calculator-ssr .calculator-header [data-general-estimate-disclosure]{display:block;font-size:11px;font-weight:400;line-height:1.35;color:var(--sd-text-2);margin-top:4px;max-width:320px}
.cabin-calculator-ssr .estimate-card h2{font-size:14px;font-weight:700;color:var(--sd-text)}
.cabin-calculator-ssr .estimate-lines dt{font-size:11px;font-weight:400;color:var(--sd-text-2)}
.cabin-calculator-ssr .estimate-lines dd{font-size:11px;font-weight:600;color:var(--sd-text)}
.cabin-calculator-ssr .product-tiles .choice-title{font-size:14px;font-weight:600;color:var(--sd-text)}
.cabin-calculator-ssr .product-tiles .choice-description{font-size:11px;font-weight:400;color:var(--sd-text-2)}
.cabin-calculator-ssr .product-tiles .choice-price{font-size:11px;font-weight:600;color:var(--saman-amber)}
/* The total block sat on --sd-panel inside a panel of the same colour, so it
   read as flat. The spec calls for a lifted fill: a white overlay reads as
   raised where a darker token would read as recessed. */
.cabin-calculator-ssr .estimate-card .total{background:var(--sd-lift);border:1px solid var(--sd-hairline-hi);border-radius:12px}
.cabin-calculator-ssr .estimate-card .total small{color:var(--sd-text-2)}
.cabin-calculator-ssr .estimate-card .total strong,.cabin-calculator-ssr .estimate-card [data-estimate-total]{font-size:30px;font-weight:700;color:var(--saman-amber)}
.cabin-calculator-ssr .step-counter,.cabin-calculator-ssr [data-step-name],.cabin-calculator-ssr .calc-step h2,.cabin-calculator-ssr .calc-step h3,.cabin-calculator-ssr .calc-step legend,.cabin-calculator-ssr .calc-step label,.cabin-calculator-ssr .calculator-intro h2,.cabin-calculator-ssr .construction-disclosure h2,.cabin-calculator-ssr .calculator-faq h2,.cabin-calculator-ssr .calculator-faq dt{color:var(--sd-text)}
.cabin-calculator-ssr .step-guidance,.cabin-calculator-ssr .step-guidance small,.cabin-calculator-ssr .step-tip,.cabin-calculator-ssr .step-tip small,.cabin-calculator-ssr .calc-step p,.cabin-calculator-ssr .calc-step small,.cabin-calculator-ssr .calculator-intro p,.cabin-calculator-ssr .construction-disclosure p,.cabin-calculator-ssr .estimate-fine-print,.cabin-calculator-ssr .estimate-fine-print small,.cabin-calculator-ssr .calculator-faq dd{color:var(--sd-text-2)}
.cabin-calculator-ssr .calc-choice>span .choice-description,.cabin-calculator-ssr .calc-choice>span small:not(.choice-price){color:var(--sd-text-2)}
.cabin-calculator-ssr .calc-choice>span .choice-price{color:var(--saman-amber)}
.cabin-calculator-ssr .calc-choice>span .choice-platform{color:var(--sd-text-2)}
.cabin-calculator-ssr .estimate-card p,.cabin-calculator-ssr .estimate-card p span{color:var(--sd-text-2)}
.cabin-calculator-ssr .choice-platform{position:absolute;top:6px;right:6px;font-size:9px;font-weight:700;padding:1px 6px;border-radius:9999px;background:none;border:1px solid var(--sd-hairline-hi);color:var(--sd-text-2)}
.cabin-calculator-ssr .step-nav a,.cabin-calculator-ssr[data-theme="light"] .calculator-header .step-nav a,.cabin-calculator-ssr[data-theme="green"] .calculator-header .step-nav a{background:rgba(255,255,255,.08);color:var(--sd-text);font-size:11px;font-weight:500}
.cabin-calculator-ssr .step-nav a.is-active,.cabin-calculator-ssr .step-nav a[aria-current="step"],.cabin-calculator-ssr[data-theme="light"] .calculator-header .step-nav a.is-active,.cabin-calculator-ssr[data-theme="green"] .calculator-header .step-nav a.is-active,.cabin-calculator-ssr[data-theme="light"] .calculator-header .step-nav a[aria-current="step"],.cabin-calculator-ssr[data-theme="green"] .calculator-header .step-nav a[aria-current="step"]{background:var(--saman-amber);color:#0E1729;font-weight:600}
.cabin-calculator-ssr button.primary,.cabin-calculator-ssr [type="submit"]{background:var(--saman-amber);color:#0E1729;border:none;border-radius:8px;height:46px;min-height:46px;font-weight:700}
.cabin-calculator-ssr button.ghost,.cabin-calculator-ssr .calculator-header-actions button{background:transparent;border:1px solid var(--sd-control-border);color:var(--sd-text);border-radius:8px}
.cabin-calculator-ssr .calculator-header-actions button{border-radius:9999px}
.cabin-calculator-ssr input,.cabin-calculator-ssr select,.cabin-calculator-ssr textarea{background:var(--sd-inset);border:1px solid var(--sd-control-border);color:var(--sd-text);border-radius:8px}
.cabin-calculator-ssr .step-progress{background:rgba(255,255,255,.08)}
.cabin-calculator-ssr .step-progress>span{background:var(--saman-amber)}
.cabin-calculator-ssr .step-actions{border-top:1px solid var(--sd-hairline)}
/* CALC-L7 2.2 - the button section moves out of the tail of the step card and
   into the column beside it, authorised on CALC-L4's corrected mockup.
   MEASURED BEFORE: Back and Next sat at y~1631px at 1440 step 6, against a
   900px fold - on screen at 3 of 4 scroll positions. At 390 they sat at
   y~2976px, so a phone user scrolled the whole step to reach Next.
   CALC-L4's FIRST mockup made it worse: appending to .calculator-grid created a
   third grid item that auto-placed on a new row and pushed the buttons 116px
   FURTHER down. The correction, and what ships here, is that the estimate card
   and the nav share ONE column - .calculator-side - so no new row is created
   and the document height is unchanged. */
.cabin-calculator-ssr .calculator-side{display:flex;flex-direction:column;gap:16px;min-width:0}
@media(min-width:1024px){
  /* Sticky under the estimate card, inside the column, so the nav follows the
     reader down the step without ever leaving its own track. */
  .cabin-calculator-ssr .calculator-side{position:sticky;top:16px;align-self:start}
  .cabin-calculator-ssr .step-actions{border-top:0;display:flex;gap:8px;flex-wrap:wrap}
}
@media(max-width:1023.98px){
  /* No second column on a phone, so the nav becomes a footer bar instead.
     padding-bottom on the module reserves exactly the bar's height, so the bar
     cannot overlay the last control and nothing shifts when it appears - the
     bar is present from first paint, not revealed on scroll. */
  .cabin-calculator-ssr{padding-bottom:76px}
  .cabin-calculator-ssr .step-actions{
    position:fixed;left:0;right:0;bottom:0;z-index:40;
    display:flex;gap:8px;align-items:center;
    margin:0;padding:12px 16px;
    background:var(--sd-panel);border-top:1px solid var(--sd-hairline);
    box-shadow:0 -2px 12px rgba(0,0,0,0.35);
  }
  .cabin-calculator-ssr .step-actions button{min-height:44px}
  .cabin-calculator-ssr .step-actions [data-action="next"]{margin-left:auto}
}
.cabin-calculator-ssr :focus-visible{outline:3px solid var(--saman-amber);outline-offset:2px}
.cabin-calculator-ssr .mobile-estimate{background:var(--sd-panel);border-top:1px solid var(--sd-hairline-hi)}
.cabin-calculator-ssr .mobile-estimate a{color:var(--sd-text)}
.cabin-calculator-ssr .mobile-estimate strong{color:var(--saman-amber)}
.cabin-calculator-ssr .price-tables,.cabin-calculator-ssr .price-tables th,.cabin-calculator-ssr .price-tables td,.cabin-calculator-ssr .price-tables caption,.cabin-calculator-ssr .price-tables summary,.cabin-calculator-ssr .noscript-content,.cabin-calculator-ssr .noscript-content p,.cabin-calculator-ssr .noscript-content h2{color:var(--sd-text)}



@media(max-width:600px){.calculator-grid{grid-template-columns:1fr}.mobile-estimate{position:fixed;left:0;right:0;bottom:0;z-index:40;display:block;background:var(--bg-total);color:var(--sd-text);padding:.6rem .9rem;min-height:44px}.mobile-estimate a{color:var(--sd-text);display:flex;justify-content:space-between;align-items:center;min-height:44px;text-decoration:none}.step-card{padding-bottom:4.5rem}}

/* =========================================================================
   THE CHIP - parity spec v1 section 4.
   Last in the cascade, so it is what actually paints.

   Their density comes from one decision: material and option choices are
   CHIPS, not rows. A row costs ~44px of vertical space and one per line; a
   chip costs ~56px and four per line. That is the whole difference between a
   step that fits a viewport and one that scrolls.

   ZERO visible native radios or checkboxes anywhere in the calculator. The
   chip IS the control. The input stays in the accessibility tree, visually
   hidden, and the focus ring moves to the chip so a keyboard user sees the
   same target a mouse user clicks.
   ========================================================================= */

/* Every choice input in the calculator, not just the product tiles. The embed
   was showing six visible radios because the hide was scoped to .product-tiles
   and its active step was Size, which has roof and mobility radios. */
.cabin-calculator-ssr .calc-choice > input[type="radio"],
.cabin-calculator-ssr .calc-choice > input[type="checkbox"] {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  margin: 0;
  pointer-events: none;
}
.cabin-calculator-ssr .calc-choice { position: relative; display: inline-block; padding: 0; margin: 0; border: none; background: none; }
.cabin-calculator-ssr .calc-choice > input:focus-visible + span { outline: 3px solid var(--saman-amber); outline-offset: 2px; }

/* The chip itself. Auto-width to content, floor 84, wrapped rows at gap 8. */
.cabin-calculator-ssr fieldset .calc-choice > span {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  min-width: 84px;
  min-height: 52px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--sd-control-border);
  background: var(--sd-card);
  color: var(--sd-text);
  box-sizing: border-box;
}
.cabin-calculator-ssr fieldset .calc-choice > span > strong { font-size: 12px; font-weight: 600; line-height: 1.2; color: var(--sd-text); }
/* Role 5: the "+₹" delta is one of amber's five permitted roles. */
.cabin-calculator-ssr fieldset .calc-choice > span > small:first-of-type { font-size: 11px; font-weight: 500; line-height: 1.2; color: var(--saman-amber); }
.cabin-calculator-ssr fieldset .calc-choice > span > small:not(:first-of-type) { font-size: 10px; font-weight: 400; line-height: 1.2; color: var(--sd-text-2); }
.cabin-calculator-ssr .calc-choice:hover > span { border-color: var(--sd-hairline-hi); }
.cabin-calculator-ssr .calc-choice > input:checked + span { border: 1px solid var(--saman-amber); box-shadow: 0 0 0 3px rgba(224,163,64,0.15); }

/* A group is a wrapped row of chips under an uppercase label. */
.cabin-calculator-ssr .calc-step fieldset {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border: none;
  margin: 0 0 14px;
  padding: 0;
}
.cabin-calculator-ssr .calc-step fieldset > legend {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--sd-text-2);
  margin-bottom: 8px;
  padding: 0;
  float: left;
  width: 100%;
}

/* Product tiles keep the landscape card of section 5, not the chip. */
.cabin-calculator-ssr .product-tiles { display: grid; gap: 12px; }
.cabin-calculator-ssr .product-tiles .calc-choice { display: block; width: 100%; }
.cabin-calculator-ssr .product-tiles .calc-choice > span {
  display: grid;
  min-height: 0;
  height: 93px;
  padding: 12px;
  border-radius: 12px;
  gap: 0;
}
.cabin-calculator-ssr .product-tiles .calc-choice > span > small:first-of-type { color: var(--sd-text-2); font-size: 11px; }

/* Step heading and helper, section 2 type scale. */
.cabin-calculator-ssr .calc-step > h2 { font-size: 16px; font-weight: 700; margin: 0 0 4px; }
.cabin-calculator-ssr .step-guidance { margin: 0 0 12px; }
.cabin-calculator-ssr .step-guidance small { font-size: 12px; font-weight: 400; line-height: 1.4; }

/* Number and select inputs sit on the chip scale rather than the form scale. */
.cabin-calculator-ssr .calc-step label { font-size: 12px; }
.cabin-calculator-ssr .calc-step input[type="number"],
.cabin-calculator-ssr .calc-step select { font-size: 13px; padding: 6px 10px; }

/* =========================================================================
   DENSITY LAYER - parity spec v1 sections 5 to 7.
   Appended last on purpose: the legacy rules above are equally specific, so
   anything declared before them loses on source order.
   Step section ids are ONE indexed. #calculator-step-3 is step 3 on screen.
   ========================================================================= */

/* Chip groups read as a wrapped row of chips under a small uppercase label,
   in every step that is a set of choices rather than a form. */
.cabin-calculator-ssr #calculator-step-2 fieldset,
.cabin-calculator-ssr #calculator-step-3 fieldset,
.cabin-calculator-ssr #calculator-step-4 fieldset,
.cabin-calculator-ssr #calculator-step-8 fieldset { gap: 5px; margin: 0 0 6px; }
.cabin-calculator-ssr #calculator-step-2 fieldset > legend,
.cabin-calculator-ssr #calculator-step-3 fieldset > legend,
.cabin-calculator-ssr #calculator-step-4 fieldset > legend,
.cabin-calculator-ssr #calculator-step-8 fieldset > legend {
  margin: 0 0 1px;
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--sd-text-2);
}

/* Step 8 - the eighteen band freight ladder is a reference table, not a
   decision. It folds; the band that applies is priced live above it. */
.cabin-calculator-ssr .freight-ladder { margin: 10px 0; font-size: 11px; }
.cabin-calculator-ssr .freight-ladder > summary {
  cursor: pointer;
  padding: 6px 0;
  color: var(--sd-text-2);
}

/* Step 9 - the live estimate sits beside the form rather than 430px above it.
   Measured 1085px before, 869px after. */
.cabin-calculator-ssr #calculator-step-9 {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 0 24px;
  align-items: start;
}
.cabin-calculator-ssr #calculator-step-9 > h2,
.cabin-calculator-ssr #calculator-step-9 > .step-guidance { grid-column: 1 / -1; }
.cabin-calculator-ssr #calculator-step-9 > .estimate-card { grid-column: 2; grid-row: 3 / 8; margin: 0; }
.cabin-calculator-ssr #calculator-step-9 > p,
.cabin-calculator-ssr #calculator-step-9 > fieldset,
.cabin-calculator-ssr #calculator-step-9 > button,
.cabin-calculator-ssr #calculator-step-9 > .required-guidance { grid-column: 1; }
.cabin-calculator-ssr #calculator-step-9 fieldset > label { margin-bottom: 4px; font-size: 12px; }
.cabin-calculator-ssr #calculator-step-9 textarea { min-height: 56px; }

/* Four steps below are given a grid. An id selector outranks the
   .is-enhanced .calc-step:not(.is-active) rule that hides an inactive step, so
   the hide has to be restated at the same strength or the grid steps render on
   top of whichever step is active. */
.cabin-calculator-ssr.is-enhanced #calculator-step-2:not(.is-active),
.cabin-calculator-ssr.is-enhanced #calculator-step-3:not(.is-active),
.cabin-calculator-ssr.is-enhanced #calculator-step-4:not(.is-active),
.cabin-calculator-ssr.is-enhanced #calculator-step-7:not(.is-active),
.cabin-calculator-ssr.is-enhanced #calculator-step-9:not(.is-active) { display: none; }

/* -------------------------------------------------------------------------
   Desktop only. The 32px chip and the three-column fit-out list are how the
   1440-wide density targets are met; they must not cost a touch target on a
   phone, where the 44px control floor stays in force.
   ------------------------------------------------------------------------- */
@media (min-width: 1024px) {

.cabin-calculator-ssr #calculator-step-3 .calc-choice > span,
.cabin-calculator-ssr #calculator-step-4 .calc-choice > span {
  min-height: 32px;
  min-width: 0;
  padding: 3px 6px;
  gap: 0;
  border-radius: 8px;
}
.cabin-calculator-ssr #calculator-step-3 .calc-choice > span > strong,
.cabin-calculator-ssr #calculator-step-4 .calc-choice > span > strong { font-size: 11px; line-height: 1.15; }
.cabin-calculator-ssr #calculator-step-3 .calc-choice > span > small,
.cabin-calculator-ssr #calculator-step-4 .calc-choice > span > small { font-size: 9px; line-height: 1.15; }
.cabin-calculator-ssr #calculator-step-3 > h2,
.cabin-calculator-ssr #calculator-step-4 > h2,
.cabin-calculator-ssr #calculator-step-7 > h2 { margin: 0 0 1px; font-size: 17px; }
.cabin-calculator-ssr #calculator-step-3 > .step-guidance,
.cabin-calculator-ssr #calculator-step-4 > .step-guidance,
.cabin-calculator-ssr #calculator-step-7 > .step-guidance { margin: 0 0 6px; }

/* Step 3 - frame and wall side by side. 732px before, 369px after. */
.cabin-calculator-ssr #calculator-step-3 {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 0 18px;
  align-items: start;
}
.cabin-calculator-ssr #calculator-step-3 > h2,
.cabin-calculator-ssr #calculator-step-3 > .step-guidance { grid-column: 1 / -1; }

/* Step 4 - the four finish groups on the left, the wall build-up diagram on
   the right, which is where the spec puts it. 707px before, 615px after. */
.cabin-calculator-ssr #calculator-step-4 {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px;
  gap: 0 14px;
  align-items: start;
}
.cabin-calculator-ssr #calculator-step-4 > h2 { grid-area: 1 / 1 / 2 / -1; }
.cabin-calculator-ssr #calculator-step-4 > .step-guidance { grid-area: 2 / 1 / 3 / -1; }
.cabin-calculator-ssr #calculator-step-4 > fieldset:nth-of-type(1) { grid-area: 3 / 1 / 4 / -1; }
.cabin-calculator-ssr #calculator-step-4 > fieldset:nth-of-type(2) { grid-area: 4 / 1 / 5 / 2; }
.cabin-calculator-ssr #calculator-step-4 > fieldset:nth-of-type(3) { grid-area: 5 / 1 / 6 / 2; }
.cabin-calculator-ssr #calculator-step-4 > fieldset:nth-of-type(4) { grid-area: 6 / 1 / 7 / 2; }
.cabin-calculator-ssr #calculator-step-4 > .wall-diagram { grid-area: 4 / 2 / 7 / 3; margin: 0; font-size: 10px; }

/* Step 7 - three columns, eleven rows, and the furniture position group in the
   cell the last row leaves empty. 2925px before, 884px after. */
.cabin-calculator-ssr #calculator-step-7 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 14px;
  align-items: start;
}
.cabin-calculator-ssr #calculator-step-7 > h2,
.cabin-calculator-ssr #calculator-step-7 > .step-guidance,
.cabin-calculator-ssr #calculator-step-7 > .step-tip { grid-column: 1 / -1; }
.cabin-calculator-ssr #calculator-step-7 > fieldset { grid-area: 13 / 3 / 14 / 4; }
/* CALC-L1b. Step 7's 32 counted items had a bare number input and no +/-, so
   the only affordance was the native spinner: invisible until hover and
   unusable on touch. The column widens from 50px to hold the stepper the
   electrical cards already use - same component, same clamping, one code path
   in quantityRow(). */
.cabin-calculator-ssr #calculator-step-7 > .quantity-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0 6px;
  margin: 0;
  padding: 0 6px;
  border-radius: 7px;
}
.cabin-calculator-ssr #calculator-step-7 > .quantity-row > span {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 6px;
  row-gap: 0;
  align-items: baseline;
}
.cabin-calculator-ssr #calculator-step-7 > .quantity-row > span > strong {
  grid-area: 1 / 1 / 2 / 2;
  font-size: 11px;
  line-height: 1.2;
}
.cabin-calculator-ssr #calculator-step-7 > .quantity-row > span > small:last-child {
  grid-area: 1 / 2 / 2 / 3;
  font-size: 10px;
  line-height: 1.2;
  white-space: nowrap;
}
.cabin-calculator-ssr #calculator-step-7 > .quantity-row > span > small:not(:last-child) {
  grid-area: 2 / 1 / 3 / 3;
  font-size: 9px;
  line-height: 1.2;
}
.cabin-calculator-ssr #calculator-step-7 > .quantity-row input {
  width: 30px; min-width: 30px;
  padding: 2px 4px;
  text-align: center;
}

}

/* ===== EVENT 3 - the drawing viewer ===================================== */
.cabin-calculator-ssr .drawing-viewer { margin: 10px 0 4px; }
.cabin-calculator-ssr .drawing-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 8px; padding: 0; border: 0; }
.cabin-calculator-ssr .drawing-tabs > legend { flex: 1 0 100%; margin: 0 0 3px; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--calc-text-2); }
.cabin-calculator-ssr .floor-plan { width: 100%; height: auto; background: var(--calc-inset); border: 1px solid var(--calc-hairline); border-radius: 12px; }
.cabin-calculator-ssr .dw-shell { fill: none; stroke: var(--calc-text); stroke-width: 1.6; }
.cabin-calculator-ssr .dw-partition { stroke: var(--calc-text-2); stroke-width: 1.2; stroke-dasharray: 5 3; }
/* Door fill is text colour, not amber. Amber has five roles and a marker on a
   drawing is not one of them; a plan tells a door from a window by fill
   against outline, which is what a drawing does anyway. */
.cabin-calculator-ssr .dw-door { fill: var(--calc-text); stroke: none; }
.cabin-calculator-ssr .dw-window { fill: none; stroke: var(--calc-text); stroke-width: 1.4; }
.cabin-calculator-ssr .dw-roof { fill: none; stroke: var(--calc-text-2); stroke-width: 1.4; }
.cabin-calculator-ssr .dw-dim { stroke: var(--calc-text-3); stroke-width: 1; }
.cabin-calculator-ssr .dw-dim-text { fill: var(--calc-text-2); font-size: 11px; text-anchor: middle; }
.cabin-calculator-ssr .dw-dim-vertical { text-anchor: end; dominant-baseline: middle; }
.cabin-calculator-ssr .dw-title { fill: var(--calc-text-2); font-size: 11px; letter-spacing: 0.06em; text-anchor: middle; text-transform: uppercase; }
.cabin-calculator-ssr .dw-code { fill: var(--calc-text-2); font-size: 9px; text-anchor: middle; }
.cabin-calculator-ssr .dw-room-fill { fill: var(--calc-card); stroke: var(--calc-hairline-hi); stroke-width: 1; }
.cabin-calculator-ssr .dw-room-code { fill: var(--calc-text); font-size: 13px; font-weight: 700; text-anchor: middle; }
.cabin-calculator-ssr .dw-room-size { fill: var(--calc-text-2); font-size: 9px; text-anchor: middle; }
.cabin-calculator-ssr .dw-elevation-label { fill: var(--calc-text-2); font-size: 10px; text-anchor: middle; }
.cabin-calculator-ssr .drawing-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 10px; }
.cabin-calculator-ssr .drawing-tile { background: var(--calc-card); border: 1px solid var(--calc-hairline); border-radius: 10px; padding: 8px 12px; }
.cabin-calculator-ssr .drawing-tile small { display: block; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--calc-text-2); }
.cabin-calculator-ssr .drawing-tile strong { font-size: 16px; color: var(--calc-text); }
.cabin-calculator-ssr .room-lengths { display: flex; flex-wrap: wrap; gap: 8px; align-items: end; margin: 8px 0; }
.cabin-calculator-ssr .room-lengths label { display: flex; flex-direction: column; gap: 2px; font-size: 11px; max-width: 132px; }
.cabin-calculator-ssr .room-chips { display: flex; flex-wrap: wrap; gap: 5px; margin: 0 0 8px; padding: 0; border: 0; }
.cabin-calculator-ssr .room-chips > legend { flex: 1 0 100%; margin: 0 0 3px; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--calc-text-2); }

@media (min-width: 1024px) {
  /* Step 2 puts the controls on the left and the drawing on the right, so a
     size change and the drawing it produces are in view at the same time. */
  .cabin-calculator-ssr #calculator-step-2 {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 430px;
    gap: 0 20px;
    align-items: start;
  }
  .cabin-calculator-ssr #calculator-step-2 > h2,
  .cabin-calculator-ssr #calculator-step-2 > .step-guidance { grid-column: 1 / -1; }
  .cabin-calculator-ssr #calculator-step-2 > .drawing-viewer { grid-column: 2; grid-row: 3 / 12; }
  .cabin-calculator-ssr #calculator-step-2 > .field-grid,
  .cabin-calculator-ssr #calculator-step-2 > fieldset,
  .cabin-calculator-ssr #calculator-step-2 > label,
  .cabin-calculator-ssr #calculator-step-2 > p,
  .cabin-calculator-ssr #calculator-step-2 > .room-lengths { grid-column: 1; }
  .cabin-calculator-ssr #calculator-step-2 .calc-choice > span { min-height: 32px; padding: 3px 8px; }
  .cabin-calculator-ssr #calculator-step-2 .calc-choice > span > strong { font-size: 11px; line-height: 1.15; }
  .cabin-calculator-ssr #calculator-step-2 .calc-choice > span > small { font-size: 9px; line-height: 1.15; }
}

/* ===== P0 1 · SELECTED STATE, AND THE ONE PLACE GREEN LIVES ==============
   Selected is a 1px amber border and a 3px amber ring at 15%. Never a fill:
   a fill change is what put brand green on a control three times running.
   ======================================================================== */
.cabin-calculator-ssr .calc-choice>input:checked+span{background:var(--calc-card);border:1px solid var(--saman-amber);box-shadow:0 0 0 3px rgba(224,163,64,0.15)}
.cabin-calculator-ssr .quantity-row.is-filled{background:var(--calc-card);border:1px solid var(--saman-amber);box-shadow:0 0 0 3px rgba(224,163,64,0.15)}
.cabin-calculator-ssr .step-nav a[aria-current="step"]{box-shadow:0 0 0 3px rgba(224,163,64,0.15)}

/* Quantity rows are cards on the panel, not green tiles. */
.cabin-calculator-ssr .quantity-row {
  background: var(--calc-card);
  border: 1px solid var(--calc-hairline);
}

/* The site-wide a:hover rule paints #0a3d2a and reaches the nine step links,
   tinting them brand green on hover. They are controls, so that is the
   demotion rule verbatim. Restated here at a specificity it cannot beat. */
.cabin-calculator-ssr .step-nav a:hover,
.cabin-calculator-ssr .step-nav a:focus,
.cabin-calculator-ssr .step-nav a:active { color: var(--calc-text); }
.cabin-calculator-ssr .step-nav a[aria-current="step"]:hover,
.cabin-calculator-ssr .step-nav a[aria-current="step"]:focus { color: #0E1729; }

/* Success and confirmation. The only #2d7a3f in the calculator, and it is
   here on purpose: this element exists to say something worked. */
.cabin-calculator-ssr .calculator-status,
.cabin-calculator-ssr [data-calculator-notice],
.cabin-calculator-ssr [data-restore-banner] {
  background: var(--saman-green);
  color: #EAF0F7;
  border: 1px solid var(--saman-green);
}

/* The published price tables carried brand green on 498 cell borders. */
.cabin-calculator-ssr table th,
.cabin-calculator-ssr table td { border-color: var(--calc-hairline); }

/* Amber has five roles and a door marker on a drawing is not one of them.
   The plan tells a door from a window by fill against outline, which is what
   a drawing does anyway. */
.cabin-calculator-ssr .dw-door { fill: var(--calc-text); stroke: none; }

/* ===== ELECTRICAL STEP - two columns, cards, inline steppers ============= */
.cabin-calculator-ssr .ec-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.cabin-calculator-ssr .ec-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0 8px;
  margin: 0;
  padding: 6px 8px;
  background: var(--calc-card);
  border: 1px solid var(--calc-hairline);
  border-radius: 8px;
}
.cabin-calculator-ssr .ec-card.is-filled { border-color: var(--saman-amber); box-shadow: 0 0 0 3px rgba(224,163,64,0.15); }
.cabin-calculator-ssr .ec-name { display: flex; flex-direction: column; gap: 0; min-width: 0; }
.cabin-calculator-ssr .ec-name strong { font-size: 12px; font-weight: 600; line-height: 1.25; color: var(--calc-text); }
.cabin-calculator-ssr .ec-name small { font-size: 10px; line-height: 1.25; color: var(--calc-text-2); }
.cabin-calculator-ssr .ec-stepper { display: flex; align-items: center; gap: 2px; }
.cabin-calculator-ssr .ec-stepper button {
  width: 26px; min-width: 26px; height: 26px; min-height: 26px; padding: 0;
  font-size: 14px; line-height: 1; font-weight: 700;
  background: var(--calc-inset); color: var(--calc-text);
  border: 1px solid var(--calc-control-border); border-radius: 6px;
}
/* The [type="number"] is load-bearing, not decoration. The density rule
   .cabin-calculator-ssr .calc-step input[type="number"] { padding: 6px 10px }
   is (0,3,1); a plain .ec-stepper input is (0,2,1) and LOSES to it. That put
   20px of horizontal padding inside a 30px border-box control, leaving an 8px
   content box for a digit needing 8.1px, so the value painted zero pixels and
   the field read as an empty box between - and +. Matching the attribute here
   reaches (0,3,1) and wins on source order. Step 7 never showed the bug only
   because #calculator-step-7 > .quantity-row input is (1,2,1) and outranks the
   density rule by an id; step 6 had no such escape hatch. Do not drop the
   attribute selector from this rule or from the two overrides below. */
.cabin-calculator-ssr .ec-stepper input[type="number"] {
  width: 34px; min-width: 34px; height: 26px; min-height: 26px;
  padding: 0; text-align: center; font-size: 12px;
}
.cabin-calculator-ssr .ec-chip-groups { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 14px; margin-top: 8px; }

/* Socket placement: one row of room chips, one panel, four one-line walls. */
.cabin-calculator-ssr .socket-rooms { display: flex; flex-wrap: wrap; gap: 5px; margin: 0 0 6px; padding: 0; border: 0; }
.cabin-calculator-ssr .socket-rooms > legend { flex: 1 0 100%; margin: 0 0 3px; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--calc-text-2); }
.cabin-calculator-ssr .socket-panel[hidden] { display: none; }
.cabin-calculator-ssr .socket-walls { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.cabin-calculator-ssr .socket-wall {
  display: grid; grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center; gap: 0 6px;
  padding: 5px 8px; font-size: 11px;
  background: var(--calc-card); border: 1px solid var(--calc-hairline); border-radius: 8px;
}
.cabin-calculator-ssr .socket-wall-name { color: var(--calc-text-2); }
.cabin-calculator-ssr .socket-nudge { display: flex; align-items: center; gap: 2px; margin: 0; font-size: 10px; color: var(--calc-text-2); }
.cabin-calculator-ssr .socket-nudge input { width: 40px; min-width: 40px; height: 26px; min-height: 26px; padding: 0 2px; text-align: center; font-size: 11px; }

@media (min-width: 1024px) {
  /* Two columns for the whole step. The 26px stepper is desktop only; on touch
     widths the 44px control floor is untouched. */
  .cabin-calculator-ssr #calculator-step-6 {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 430px;
    gap: 0 20px;
    align-items: start;
  }
  .cabin-calculator-ssr #calculator-step-6 > h2,
  .cabin-calculator-ssr #calculator-step-6 > .step-guidance,
  .cabin-calculator-ssr #calculator-step-6 > .scope-note { grid-column: 1 / -1; }
  .cabin-calculator-ssr #calculator-step-6 > .ec-left { grid-column: 1; }
  .cabin-calculator-ssr #calculator-step-6 > .ec-right { grid-column: 2; }
  .cabin-calculator-ssr #calculator-step-6 .ec-chip-groups .calc-choice > span { min-height: 32px; padding: 3px 8px; }
  .cabin-calculator-ssr #calculator-step-6 .ec-chip-groups .calc-choice > span > strong { font-size: 11px; line-height: 1.15; }
  .cabin-calculator-ssr #calculator-step-6 .socket-rooms .calc-choice > span { min-height: 28px; padding: 2px 8px; }
  .cabin-calculator-ssr #calculator-step-6 .socket-rooms .calc-choice > span > strong { font-size: 11px; line-height: 1.15; }
  .cabin-calculator-ssr #calculator-step-6 .floor-plan { max-height: 200px; }
  .cabin-calculator-ssr #calculator-step-6 .drawing-legend { display: none; }
}

/* A grid on an id outranks the rule that hides an inactive step. Restate it,
   the same way steps 2, 3, 4, 7 and 9 have to. */
.cabin-calculator-ssr.is-enhanced #calculator-step-6:not(.is-active) { display: none; }

/* The card is a row: name and price left, stepper right, ~56px tall. */
.cabin-calculator-ssr label.ec-card { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 0 8px; margin: 0; min-height: 52px; }
.cabin-calculator-ssr label.socket-nudge { display: flex; flex-direction: row; align-items: center; gap: 2px; margin: 0; }

/* One row of room chips. Eight of them do not fit 430px, and the spec asks for
   a row, so the row scrolls rather than becoming two rows. */
/* The spec asks for ONE row of room chips. It is two rows of four, and this is
   a deliberate deviation rather than a miss.
   A fieldset's legend is a flex item, so on a nowrap row it takes its 100%
   basis, consumes the line and pushes all eight chips out of view - the
   control rendered as an empty 60px gap. Getting one row needs the legend out
   of the flex container, which means dropping the fieldset grouping that
   carries the accessible name for these eight radios. Two rows costs 30px on a
   step now measuring 697 against a 900 ceiling; the grouping is not worth 30px.
   .calc-step fieldset (0,3,1) outranks a plain .socket-rooms rule, so the wrap
   is restated at the same reach rather than left to chance. */
.cabin-calculator-ssr .calc-step fieldset.socket-rooms { flex-wrap: wrap; padding-bottom: 2px; }
.cabin-calculator-ssr .calc-step fieldset.socket-rooms .calc-choice { flex: 0 0 auto; }

/* Names like "External / entrance light" wrapped to three lines and pushed the
   card past 90px. Smaller name, tighter stepper, so the card holds ~56px with
   the name intact - a product name is not something to truncate. */
.cabin-calculator-ssr .ec-name strong { font-size: 11px; line-height: 1.2; }
.cabin-calculator-ssr .ec-name small { font-size: 9px; line-height: 1.2; }
.cabin-calculator-ssr .ec-card { padding: 5px 6px; }
.cabin-calculator-ssr .ec-stepper button { width: 22px; min-width: 22px; height: 24px; min-height: 24px; font-size: 13px; }
.cabin-calculator-ssr .ec-stepper input[type="number"] { width: 30px; min-width: 30px; height: 24px; min-height: 24px; font-size: 11px; }
.cabin-calculator-ssr .socket-nudge input { width: 46px; min-width: 46px; font-size: 10px; }

/* The nudge input needs room for three digits without clipping. */
.cabin-calculator-ssr .socket-nudge input { width: 44px; min-width: 44px; }

/* ===== ONE STEP OF ELEVATION, AND NO MORE ==============================
   Panels lift off the ground with a 1px top highlight above the hairline.
   The drawing sits one step darker than the panel it is on. The estimate
   total comes down from 30px: it was the loudest thing on the screen.
   No gradient anywhere except the summary header bar.
   ====================================================================== */
.cabin-calculator-ssr .step-card,
.cabin-calculator-ssr .calculator-side > .estimate-card,
.cabin-calculator-ssr .calculator-intro,
.cabin-calculator-ssr .construction-disclosure {
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
}
.cabin-calculator-ssr .drawing-viewer .floor-plan,
.cabin-calculator-ssr .entry-plan {
  background: var(--calc-inset);
  border: 1px solid var(--calc-hairline);
  border-radius: 16px;
}
.cabin-calculator-ssr .estimate-card .total strong { font-size: 26px; }

/* Alternating room tints, so adjacent rooms read apart without colour. */
.cabin-calculator-ssr .dw-room:nth-child(odd) .dw-room-fill { fill: var(--calc-panel); }
.cabin-calculator-ssr .dw-room:nth-child(even) .dw-room-fill { fill: var(--calc-card); }

/* Dimension strings sit lighter than the outline they measure. */
.cabin-calculator-ssr .dw-dim-text { font-weight: 400; }
.cabin-calculator-ssr .dw-ext { stroke: var(--calc-text-3); stroke-width: 0.8; }
.cabin-calculator-ssr .dw-tick { stroke: var(--calc-text-3); stroke-width: 1.2; }
.cabin-calculator-ssr .dw-swing { fill: none; stroke: var(--calc-text-2); stroke-width: 1; stroke-dasharray: 3 2; }
.cabin-calculator-ssr .dw-door-leaf { stroke: var(--calc-text); stroke-width: 1.6; }
.cabin-calculator-ssr .dw-break { stroke: var(--calc-inset); stroke-width: 3.2; }

.cabin-calculator-ssr .drawing-key { margin: 6px 0 0; font-size: 10px; letter-spacing: 0.04em; color: var(--calc-text-3); }

/* ===== STEP 5 - two columns, opening cards in a grid ==================== */
.cabin-calculator-ssr .op-left { min-width: 0; }
/* Two cards across, never four. At four the labels - "Distance from selected
   end (ft)" among them - had no width left and clipped. */
.cabin-calculator-ssr .op-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; align-items: start; }
.cabin-calculator-ssr #calculator-step-5 .opening-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 4px;
  margin: 0;
  padding: 8px;
  background: var(--calc-card);
  border: 1px solid var(--calc-hairline);
  border-radius: 8px;
}
.cabin-calculator-ssr .op-cards .opening-card > legend {
  padding: 0; margin: 0 0 2px;
  font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--calc-text-2);
}
/* Controls sit on a row, not stacked with a label above each. */
.cabin-calculator-ssr #calculator-step-5 .opening-card > label {
  display: grid; grid-template-columns: minmax(0, 1fr) 92px;
  align-items: center; gap: 2px 8px; margin: 0;
  font-size: 11px; line-height: 1.35;
  /* No height and no clipping: the label wraps and the row grows with it. */
  min-height: 0; height: auto; overflow: visible;
  overflow-wrap: break-word; hyphens: auto; padding: 2px 0;
}
.cabin-calculator-ssr #calculator-step-5 .opening-card > label > select,
.cabin-calculator-ssr #calculator-step-5 .opening-card > label > input { align-self: center; }
.cabin-calculator-ssr #calculator-step-5 .opening-card fieldset > legend,
.cabin-calculator-ssr #calculator-step-5 .opening-card > legend { overflow: visible; white-space: normal; }
.cabin-calculator-ssr #calculator-step-5 .opening-card .calc-choice > span { white-space: normal; }
.cabin-calculator-ssr #calculator-step-5 .opening-card > label > select,
.cabin-calculator-ssr #calculator-step-5 .opening-card > label > input { height: 26px; min-height: 26px; padding: 0 4px; font-size: 11px; }
/* Nested groups - type, hinge, opening, track - are chip rows. */
.cabin-calculator-ssr #calculator-step-5 .opening-card fieldset {
  display: flex; flex-wrap: wrap; gap: 4px; margin: 2px 0; padding: 0; border: 0;
}
.cabin-calculator-ssr .op-cards .opening-card fieldset > legend {
  flex: 1 0 100%; margin: 0; font-size: 9px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--calc-text-3);
}
.cabin-calculator-ssr .op-cards .opening-card .calc-choice > span { min-height: 26px; padding: 2px 7px; }
.cabin-calculator-ssr .op-cards .opening-card .calc-choice > span > strong { font-size: 10px; line-height: 1.15; }
.cabin-calculator-ssr .op-cards .opening-card .calc-choice > span > small { font-size: 9px; line-height: 1.15; }
/* The long per-card note is a tip, not a control. It lives in the step tip. */
.cabin-calculator-ssr #calculator-step-5 .opening-card > small { display: none; }

@media (min-width: 1024px) {
  .cabin-calculator-ssr #calculator-step-5 {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 430px;
    gap: 0 20px;
    align-items: start;
  }
  .cabin-calculator-ssr #calculator-step-5 > h2,
  .cabin-calculator-ssr #calculator-step-5 > .step-guidance,
  .cabin-calculator-ssr #calculator-step-5 > .scope-note { grid-column: 1 / -1; }
  .cabin-calculator-ssr #calculator-step-5 > .op-left { grid-column: 1; }
  .cabin-calculator-ssr #calculator-step-5 > .op-right { grid-column: 2; }
  .cabin-calculator-ssr #calculator-step-5 .floor-plan { max-height: 210px; }
  /* The legend sentence repeats under every viewer. The short key carries it
     inside the steps; the sentence stays where there is room for it. */
  .cabin-calculator-ssr #calculator-step-2 .drawing-legend,
  .cabin-calculator-ssr #calculator-step-5 .drawing-legend { display: none; }
}

/* A grid on an id outranks the rule that hides an inactive step. */
.cabin-calculator-ssr.is-enhanced #calculator-step-5:not(.is-active) { display: none; }

/* Touch targets. 44x44 below 1024 for both the fit-out and electrical
   steppers; the compact size is desktop-only, where the pointer is fine. */
@media (max-width: 1023px) {
  .cabin-calculator-ssr .ec-stepper button { width: 44px; min-width: 44px; height: 44px; min-height: 44px; font-size: 16px; }
  .cabin-calculator-ssr .ec-stepper input[type="number"] { height: 44px; min-height: 44px; width: 46px; min-width: 46px; font-size: 14px; }
}
.cabin-calculator-ssr .ec-stepper button:disabled { opacity: 0.35; cursor: default; }`;

export const DEFAULT_CALCULATOR_CONFIG: CalculatorConfig = {
  productId: 'porta-cabin',
  length: 20,
  width: 10,
  height: 8.5,
  quantity: 1,
  planView: 'plan',
  rooms: 1,
  // Empty means "not chosen", and drawGeometry divides the length equally.
  roomLengths: [],
  partitionDoors: 0,
  roof: 'Sloped',
  frame: 'FR-MS',
  wallBuild: 'WB-MS',
  internalWall: INTERIOR_STANDARD.wall,
  ceilingCode: INTERIOR_STANDARD.ceiling,
  flooringCode: INTERIOR_STANDARD.flooring,
  insulation: 'none',
  wallFinish: WALL_FINISHES[0][0],
  ceiling: CEILINGS[0][0],
  flooring: FLOORING[0][0],
  pufThickness: 50,
  doors: [{ type: 'Steel door', wall: 'Front', end: 'Left', distance: 2, position: 20, hinge: 'Left', opening: 'Out' }],
  windows: [
    { type: 'uPVC Sliding', wall: 'Front', end: 'Left', distance: 1.5, position: 35, width: 3, height: 3, track: '2 Track' },
    { type: 'uPVC Sliding', wall: 'Rear', end: 'Right', distance: 1.5, position: 70, width: 3, height: 3, track: '2 Track' },
  ],
  /**
   * Empty, because empty is what the calculator has always actually rendered.
   *
   * This carried { 'LED Panel Light': 5, 'Ceiling Fan': 2, 'Plug Point': 4,
   * 'External / Entrance Light': 1 } — legacy labels. The step renders its
   * controls from ELECTRICAL_R1 ("LED panel light"), so `config.electrical[label]`
   * missed on every one and all ten controls rendered at 0. The defaults have
   * never reached a buyer's screen or a buyer's price.
   *
   * Normalising the key comparison would have quietly revived three of the four
   * and raised the opening estimate on every priced route, while the fourth,
   * 'Plug Point', has no single R1 counterpart — ELECTRICAL_R1 splits it into
   * 'Plug point (6A)' and 'Plug point (16A)', and choosing between them is a
   * pricing decision, not a spelling one. Reviving a default quantity is a
   * change to the opening price and needs a ruling, so this preserves exactly
   * what ships today and the question goes in the report instead.
   */
  electrical: {},
  lightColour: 'White',
  lightShape: 'Square',
  addOns: {},
  furniturePosition: 'Wall attached',
  mobility: '100% movable',
  deliveryZone: 'Other',
  distanceKm: 0,
  includeGst: true,
  installation: false,
  colonyVariant: 0,
  workers: 0,
  quote: { firstName: '', lastName: '', phone: '', email: '', company: '', city: '', state: '', notes: '' },
};

const money = (value: number): string => `₹${Math.round(value).toLocaleString('en-IN')}`;
const esc = (value: unknown): string => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] || character));
const one = (value: string | string[] | undefined): string | undefined => Array.isArray(value) ? value[0] : value;
const finite = (value: unknown, fallback: number, min: number, max: number): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};
const int = (value: unknown, fallback: number, min: number, max: number): number => Math.round(finite(value, fallback, min, max));
const member = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => allowed.includes(value as T) ? value as T : fallback;
const productFor = (id: ProductId): ProductDefinition => PRODUCTS.find((product) => product.id === id) || PRODUCTS[0];
export const getCalculatorProductName = (id: ProductId): string => productFor(id).name;
const isColonyProduct = (id: ProductId): boolean => ['labour-colony', 'labor-sheds', 'labor-hutments', 'prefab-labor-camps'].includes(id);
const colonyLadder = (id: ProductId) => id === 'labor-sheds'
  ? PRODUCT_LADDERS.labourSheds
  : id === 'labor-hutments'
    ? PRODUCT_LADDERS.labourHutments
    : id === 'prefab-labor-camps'
      ? PRODUCT_LADDERS.prefabLabourCamps
      : PRODUCT_LADDERS.labourColony;
const productIdForSlug = (slug: ColonyProductSlug): ProductId => slug === 'labor-colony' ? 'labour-colony' : slug;
const checked = (condition: boolean): string => condition ? ' checked' : '';
const selected = (condition: boolean): string => condition ? ' selected' : '';

/**
 * Case-folded, whitespace-collapsed quantity key.
 *
 * The comparison is normalised on BOTH sides so that a difference of case or
 * spacing between a stored key and a control's label can never again silently
 * drop a priced quantity. Matching on the raw string is what broke: the
 * sanitiser validated posted quantities against the legacy ELECTRICAL array
 * ("LED Panel Light") while the step rendered its controls from ELECTRICAL_R1
 * ("LED panel light") and the estimate priced from ELECTRICAL_R1 too. One
 * capital P, and every electrical and fit-out item a buyer selected was
 * discarded by the server before it reached the estimate.
 */
const quantityKey = (label: string): string => String(label).toLowerCase().replace(/\s+/g, ' ').trim();

/**
 * `allowed` is the list the STEP RENDERS and the estimate PRICES — never a
 * parallel list that only the sanitiser knows about. Quantities come back
 * under the canonical label from that list, so everything downstream reads one
 * spelling.
 */
function cleanQuantities(value: unknown, allowed: readonly string[]): QuantityMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  const posted = new Map<string, unknown>();
  Object.entries(source).forEach(([key, entry]) => posted.set(quantityKey(key), entry));
  const quantities: QuantityMap = {};
  allowed.forEach((label) => {
    const quantity = int(posted.get(quantityKey(label)), 0, 0, 50);
    if (quantity > 0) quantities[label] = quantity;
  });
  return quantities;
}

function cleanDoor(value: unknown): DoorConfig | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const item = value as Partial<DoorConfig>;
  return {
    type: member(item.type, ['Steel door', 'Glass / Aluminium / uPVC door'] as const, 'Steel door'),
    wall: member(item.wall, WALLS, 'Front'),
    end: member(item.end, ['Left', 'Right'] as const, 'Left'),
    distance: finite(item.distance, 2, 0, 1000),
    position: finite(item.position, 20, 0, 100),
    hinge: member(item.hinge, ['Left', 'Right'] as const, 'Left'),
    opening: member(item.opening, ['In', 'Out'] as const, 'Out'),
  };
}

function cleanWindow(value: unknown): WindowConfig | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const item = value as Partial<WindowConfig>;
  return {
    type: member(item.type, Object.keys(WINDOW_RATES) as Array<keyof typeof WINDOW_RATES>, 'uPVC Sliding'),
    wall: member(item.wall, WALLS, 'Front'),
    end: member(item.end, ['Left', 'Right'] as const, 'Left'),
    distance: finite(item.distance, 1.5, 0, 1000),
    position: finite(item.position, 35, 0, 100),
    width: finite(item.width, 3, 1, 12),
    height: finite(item.height, 3, 1, 12),
    track: member(item.track, ['2 Track', '2.5 Track'] as const, '2 Track'),
  };
}

export function normaliseCalculatorConfig(value: unknown): CalculatorConfig {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value as Partial<CalculatorConfig> : {};
  const productIds = PRODUCTS.map((product) => product.id);
  const quoteSource = source.quote && typeof source.quote === 'object' ? source.quote : {} as Partial<QuoteFields>;
  const text = (input: unknown, max = 300): string => typeof input === 'string' ? input.slice(0, max) : '';
  const doors = Array.isArray(source.doors) ? source.doors.slice(0, 12).map(cleanDoor).filter((item): item is DoorConfig => Boolean(item)) : DEFAULT_CALCULATOR_CONFIG.doors;
  const windows = Array.isArray(source.windows) ? source.windows.slice(0, 20).map(cleanWindow).filter((item): item is WindowConfig => Boolean(item)) : DEFAULT_CALCULATOR_CONFIG.windows;
  return {
    productId: member(source.productId, productIds, DEFAULT_CALCULATOR_CONFIG.productId),
    ladderKey: typeof source.ladderKey === 'string' && source.ladderKey ? source.ladderKey : null,
    length: finite(source.length, 20, -10000, 10000),
    width: finite(source.width, 10, -10000, 10000),
    height: finite(source.height, 8.5, -10000, 10000),
    quantity: int(source.quantity, 1, 1, 50),
    planView: member(source.planView, ['plan', 'floor', 'elevations'] as const, 'plan'),
    rooms: int(source.rooms, 1, 1, 12),
    partitionDoors: int(source.partitionDoors, 0, 0, 5),
    roomLengths: Array.isArray(source.roomLengths)
      ? source.roomLengths.map((entry: unknown) => Math.max(0, Number(entry) || 0))
      : [],
    roof: member(source.roof, ['Sloped', 'Flat / mono-pitch'] as const, 'Sloped'),
    frame: member(source.frame, FRAME_OPTIONS.filter((o) => !o.disabled).map((o) => o.code), 'FR-MS'),
    wallBuild: member(source.wallBuild, WALL_BUILD_OPTIONS.filter((o) => !o.disabled).map((o) => o.code), 'WB-MS'),
    internalWall: member(source.internalWall, INTERNAL_WALLS.map((o) => o.code), INTERIOR_STANDARD.wall),
    ceilingCode: member(source.ceilingCode, CEILINGS_R1.map((o) => o.code), INTERIOR_STANDARD.ceiling),
    flooringCode: member(source.flooringCode, FLOORINGS_R1.map((o) => o.code), INTERIOR_STANDARD.flooring),
    insulation: member(source.insulation, ['none', ...INSULATIONS_R1.map((o) => o.code)], 'none'),
    wallFinish: member(source.wallFinish, WALL_FINISHES.map((entry) => entry[0]), WALL_FINISHES[0][0]),
    ceiling: member(source.ceiling, CEILINGS.map((entry) => entry[0]), CEILINGS[0][0]),
    flooring: member(source.flooring, FLOORING.map((entry) => entry[0]), FLOORING[0][0]),
    pufThickness: PUF_THICKNESSES.includes(source.pufThickness as typeof PUF_THICKNESSES[number]) ? source.pufThickness as CalculatorConfig['pufThickness'] : 50,
    doors: doors.length ? doors : DEFAULT_CALCULATOR_CONFIG.doors,
    windows,
    electrical: cleanQuantities(source.electrical, ELECTRICAL_R1.map((item) => item.label)),
    lightColour: member(source.lightColour, ['White', 'Warm'] as const, 'White'),
    lightShape: member(source.lightShape, ['Square', 'Round'] as const, 'Square'),
    addOns: cleanQuantities(source.addOns, FITOUT_R1.map((item) => item.label)),
    furniturePosition: member(source.furniturePosition, ['Wall attached', 'Centre'] as const, 'Wall attached'),
    mobility: member(source.mobility, ['100% movable', 'Fixed / semi-permanent'] as const, '100% movable'),
    deliveryZone: member(source.deliveryZone, ['Bangalore city', 'Delhi NCR', 'Other'] as const, 'Other'),
    distanceKm: finite(source.distanceKm, 0, 0, 5000),
    includeGst: source.includeGst !== false,
    installation: source.installation === true,
    colonyVariant: int(source.colonyVariant, 0, 0, Math.max(0, PRODUCT_LADDERS.labourColony.length - 1)),
    workers: int(source.workers, 0, 0, 100000),
    quote: {
      firstName: text(quoteSource.firstName, 60), lastName: text(quoteSource.lastName, 60),
      phone: text(quoteSource.phone, 20), email: text(quoteSource.email, 160),
      company: text(quoteSource.company, 160), city: text(quoteSource.city, 100), state: text(quoteSource.state, 100), notes: text(quoteSource.notes, 2000),
    },
  };
}

function decodeDesign(encoded: string): unknown {
  if (!/^[A-Za-z0-9_-]{1,16000}$/.test(encoded)) return null;
  try {
    const normalised = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (normalised.length % 4)) % 4);
    return JSON.parse(Buffer.from(normalised + padding, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

export function parseCalculatorQuery(query: CalculatorQuery = {}): CalculatorConfig {
  const encoded = one(query.design) || one(query.d);
  const shared = encoded ? decodeDesign(encoded) : null;
  const source = shared && typeof shared === 'object' ? shared as Partial<CalculatorConfig> : {};
  const direct: Partial<CalculatorConfig> = { ...source };
  const productId = one(query.product) || one(query.productId);
  if (productId) direct.productId = productId as ProductId;
  for (const key of ['length', 'width', 'height', 'quantity', 'rooms', 'distanceKm', 'colonyVariant', 'workers'] as const) {
    const value = one(query[key]);
    if (value !== undefined) (direct as Record<string, unknown>)[key] = value;
  }
  // Roof, frame and the three view names round-trip too. A shared link that
  // dropped them came back as a different cabin from the one that was shared;
  // the sanitiser rejects anything that is not an approved value.
  const roof = one(query.roof);
  if (roof) direct.roof = roof as CalculatorConfig['roof'];
  const planView = one(query.planView);
  if (planView) direct.planView = planView as CalculatorConfig['planView'];
  const frame = one(query.frame);
  if (frame) direct.frame = frame;
  const zone = one(query.deliveryZone);
  if (zone) direct.deliveryZone = zone as CalculatorConfig['deliveryZone'];
  const includeGst = one(query.includeGst);
  if (includeGst !== undefined) direct.includeGst = includeGst === '1' || includeGst.toLowerCase() === 'true';
  return normaliseCalculatorConfig(direct);
}

/**
 * Removed 07 Aug 2026: effectiveReferenceRate.
 *
 * It published each route's own ladder anchor rate to the browser so a custom
 * size could be derived from it. Under SAMAN's base-cabin rate card there is
 * one card for every product and the rate comes from floor area, not from the
 * route — so a per-route rate on the element is a second source of truth with
 * nothing left to be true about. See BASE_CABIN_RATE_CARD_DATASET.
 */

/**
 * Whether this product renders quote mode — derived, never asserted.
 *
 * Quote mode belongs to a product with no priced rows at all. It used to be a
 * hand-set boolean on the product definition, and a hand-set boolean can
 * disagree with the ladder sitting next to it: Porta Cabin with Toilet carried
 * `quoteOnly: true` AND `ladderKey: 'porta-cabin-with-toilet'`, which prices a
 * 20x10 at 3,00,000. The server priced it from the ladder and rendered a
 * subtotal and GST; the browser read the flag and printed "Price on request"
 * as the total. One product, two answers, on the same screen.
 *
 * So the question is now asked of the ladder, which is the thing that actually
 * knows. The `quoteOnly` flag only survives where there is genuinely nothing to
 * price, where it agrees with the ladder anyway.
 */
function rendersQuoteMode(product: ProductDefinition, ladderKey?: string | null): boolean {
  // LC-02 (16 Aug 2026) — this unconditionally returned false for every
  // colony product, correct until now because all four had a real price on
  // every variant. That return value becomes `data-quote-only` on the
  // client (cabin-cost-calculator.js), which the interactive widget trusts
  // completely for colony products (its own quoteOnly check is `quoteProduct
  // || (!colony && ...)` — the non-colony fallback never runs for a colony
  // product). Left as `false` here, a null-priced colony product's
  // interactive estimate would compute and display ₹0, not "Price on
  // request". A product only renders quote mode once EVERY variant in its
  // ladder is null — verified zero effect on the three siblings, whose
  // ladders currently have no null variants at all.
  if (isColonyProduct(product.id)) {
    return colonyLadder(product.id).every((item) => item.priceExGst === null);
  }
  const key = ladderKey ?? product.ladderKey;
  if (getRouteLadder(key)) return false;
  return ladderAnchorRate(key) === null;
}

function dimensionsFromLabel(label: string): { length: number; width: number } | null {
  const match = label.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  return { length: Number(match[1]), width: Number(match[2]) };
}

/**
 * The ladder this configuration prices from: the embedding route's own ladder
 * where there is one, otherwise the selected product's own. Never a parent's,
 * never a sibling's, never a shared reference row.
 */
function ladderKeyFor(config: CalculatorConfig): string | null {
  return config.ladderKey ?? productFor(config.productId).ladderKey ?? null;
}

/** REL-06C-R owner decision: only PC-01 uses its selected published variant as base. */
export function usesPc01SelectedVariantPriceBase(config: CalculatorConfig): boolean {
  return ladderKeyFor(config) === 'porta-cabins';
}

function isPc01IncludedDefaultWindow(config: CalculatorConfig, window: WindowConfig, index: number): boolean {
  if (!usesPc01SelectedVariantPriceBase(config)) return false;
  const included = DEFAULT_CALCULATOR_CONFIG.windows[index];
  return Boolean(
    included
    && window.type === included.type
    && window.width === included.width
    && window.height === included.height
    && window.track === included.track
  );
}

/**
 * The BASE CABIN figure — a bare cabin, from SAMAN's rate card of 06 Aug 2026.
 *
 * What changed, and why the ladder is no longer the source here:
 *
 *   Until this ruling the base line was the route's own PUBLISHED price, which
 *   is the finished product with every fitting in it. The estimate therefore
 *   opened at the finished price and then charged for the fittings again as the
 *   buyer added them. SAMAN's two-price doctrine separates the two: the page
 *   and the band headline keep the finished price, and the calculator opens at
 *   the bare cabin and grows.
 *
 *   So the ladder is still read — but only to decide whether this route prices
 *   at all (see rendersQuoteMode). It no longer supplies the number.
 *
 * Returning null means SAMAN has stated no rate for this size. It is not zero
 * and it is not "close enough": the calculator renders quote mode and asks.
 */
function calculateBase(config: CalculatorConfig): number | null {
  if (isColonyProduct(config.productId)) {
    // LC-02 (16 Aug 2026) — the colony branch never returned null before,
    // because every colony product had a real price on every variant until
    // now. A null variant price means SAMAN has stated no rate (quote mode,
    // same meaning as the non-colony `rate === null` case just below), not
    // zero — so this must return null too, or the estimate silently prices
    // the building at ₹0 instead of asking for a quotation.
    const colonyPrice = colonyLadder(config.productId)[config.colonyVariant]?.priceExGst;
    if (colonyPrice === null || colonyPrice === undefined) return null;
    return colonyPrice * config.quantity;
  }

  // A route with no ladder of its own prices on drawing — Security Cabins is
  // the ruled example. The rate card does not override that.
  if (rendersQuoteMode(productFor(config.productId), ladderKeyFor(config))) return null;

  // PC01-CALCULATOR-BASE-PARITY-2026-08-31 supersedes the two-price doctrine
  // for this route only. The exact selected row comes from porta-cabins.json
  // through calculatorLadders.ts. A custom/unpublished size asks for a quote;
  // it is never replaced by an area-rate approximation.
  if (usesPc01SelectedVariantPriceBase(config)) {
    const published = ladderPriceFor(ladderKeyFor(config), config.length, config.width);
    return published === null ? null : published * config.quantity;
  }

  const rate = baseCabinRate(config.length, config.width);
  if (rate === null) return null;
  return rate.basePriceExGst * config.quantity;
}

export function computeCalculatorEstimate(input: CalculatorConfig): CalculatorEstimate {
  const config = normaliseCalculatorConfig(input);
  const colony = isColonyProduct(config.productId);
  const product = productFor(config.productId);
  const area = colony ? (colonyLadder(config.productId)[config.colonyVariant]?.areaSqft || 0) : config.length * config.width;
  const basePrice = calculateBase(config);
  const lines: EstimateLine[] = [{
    label: basePrice === null ? `${product.name} base` : colony ? `${colonyLadder(config.productId)[config.colonyVariant]?.label || 'Colony block'} × ${config.quantity}` : `Base cabin ${config.length}×${config.width} ft${config.quantity > 1 ? ` × ${config.quantity}` : ''}`,
    amount: basePrice,
    source: basePrice === null ? 'quotation' : 'published',
    documentLabel: basePrice === null ? `${product.name} base` : colony ? `${colonyLadder(config.productId)[config.colonyVariant]?.label || 'Colony block'} base` : `Base cabin ${config.length} x ${config.width} ft`,
    quantity: config.quantity,
    unitRate: basePrice === null ? null : Math.round(basePrice / config.quantity),
    rateBasis: 'cabin',
  }];
  let total = basePrice || 0;
  const addLine = (
    label: string,
    amount: number | null,
    source: EstimateLine['source'],
    detail: Pick<EstimateLine, 'documentLabel' | 'quantity' | 'unitRate' | 'rateBasis'> = {},
  ) => {
    lines.push({
      label,
      amount,
      source,
      documentLabel: detail.documentLabel || label,
      quantity: detail.quantity ?? 1,
      unitRate: detail.unitRate === undefined ? amount : detail.unitRate,
      rateBasis: detail.rateBasis || 'configuration',
    });
    if (amount !== null) total += amount;
  };
  if (!colony && basePrice !== null) {
    if (config.height > 8.5) addLine(`Height ${config.height} ft`, Math.round((basePrice / config.quantity) * 0.06 * (config.height - 8.5)) * config.quantity, 'market');
    if (config.roof === 'Flat / mono-pitch') addLine('Flat / mono-pitch roof', Math.round(basePrice * 0.04), 'market');
    const frame = FRAME_OPTIONS.find((o) => o.code === config.frame);
    if (frame && frame.percent) {
      addLine(`${frame.label}, +${frame.percent}%`, Math.round(basePrice * (frame.percent / 100)), 'published');
    }
    if (config.rooms > 1) addLine(
      `${config.rooms} rooms, ${config.rooms - 1} partitions`,
      Math.round((config.rooms - 1) * config.width * 8.5 * 300 * config.quantity),
      'market',
      { quantity: (config.rooms - 1) * config.quantity, unitRate: Math.round(config.width * 8.5 * 300), rateBasis: 'each' },
    );
    const wallArea = 2 * (config.length + config.width) * config.height;
    const surfaceChoices: Array<[string, string, number, (code: string) => number, readonly { code: string; label: string }[]]> = [
      ['Internal wall', config.internalWall, wallArea, wallDelta, INTERNAL_WALLS],
      ['Ceiling', config.ceilingCode, area, ceilingDelta, CEILINGS_R1],
      ['Flooring', config.flooringCode, area, floorDelta, FLOORINGS_R1],
    ];
    surfaceChoices.forEach(([label, code, surfaceArea, delta, list]) => {
      const rate = delta(code);
      if (!rate) return;
      const name = list.find((o) => o.code === code)?.label || code;
      addLine(`${label}: ${name}`, Math.round(rate * surfaceArea * config.quantity), 'published', {
        quantity: surfaceArea * config.quantity,
        unitRate: rate,
        rateBasis: 'sq ft',
      });
    });
    if (config.insulation !== 'none') {
      const rate = insulationRate(config.insulation);
      const name = INSULATIONS_R1.find((o) => o.code === config.insulation)?.label || config.insulation;
      if (rate) addLine(`Insulation: ${name}`, Math.round(rate * (wallArea + area) * config.quantity), 'published', {
        quantity: (wallArea + area) * config.quantity,
        unitRate: rate,
        rateBasis: 'sq ft',
      });
    }
    const thicknessRate = pufDeltaPerSqft(config.pufThickness);
    if (thicknessRate) addLine(`${config.pufThickness} mm PUF panels`, Math.round(thicknessRate * (wallArea + area) * config.quantity), 'published', {
      quantity: (wallArea + area) * config.quantity,
      unitRate: thicknessRate,
      rateBasis: 'sq ft',
    });
    config.doors.forEach((door, index) => {
      if (index === 0 && door.type === 'Steel door') return;
      const rate = door.type === 'Steel door' ? RATE_CARD.marketRates.steelDoor : RATE_CARD.marketRates.upvcGlassDoor;
      addLine(`Door ${index + 1}: ${door.type}`, rate * config.quantity, 'market', {
        quantity: config.quantity,
        unitRate: rate,
        rateBasis: 'each',
      });
    });
    config.windows.forEach((window, index) => {
      if (isPc01IncludedDefaultWindow(config, window, index)) return;
      const rate = Math.round(WINDOW_RATES[window.type] * window.width * window.height * (window.track === '2.5 Track' ? 1.12 : 1));
      addLine(`Window ${index + 1}: ${window.type} ${window.width}×${window.height} ft`, rate * config.quantity, 'market', {
        quantity: config.quantity,
        unitRate: rate,
        rateBasis: 'each',
      });
    });
  }
  ELECTRICAL_R1.forEach((item) => {
    const quantity = config.electrical[item.label] || 0;
    if (!quantity) return;
    addLine(`${quantity} × ${item.label}`, colony ? null : (item.rate || 0) * quantity * config.quantity, colony ? 'quotation' : 'published', {
      documentLabel: item.label,
      quantity: quantity * config.quantity,
      unitRate: colony ? null : item.rate || 0,
      rateBasis: 'each',
    });
  });
  FITOUT_R1.forEach((item) => {
    const quantity = config.addOns[item.label] || 0;
    if (!quantity) return;
    addLine(`${quantity} × ${item.label}`, colony ? null : (item.rate || 0) * quantity * config.quantity, colony ? 'quotation' : 'published', {
      documentLabel: item.label,
      quantity: quantity * config.quantity,
      unitRate: colony ? null : item.rate || 0,
      rateBasis: 'each',
    });
  });
  let transportNote = '';
  if (config.deliveryZone === 'Bangalore city' || config.deliveryZone === 'Delhi NCR') transportNote = 'Free delivery zone';
  else if (config.distanceKm > 0 && config.distanceKm < 100) transportNote = 'Under 100 km: confirmed at quotation';
  else if (config.distanceKm >= 100) {
    const bandIndex = Math.min(RATE_CARD.freight.bands20ft.length - 1, Math.max(0, Math.ceil((config.distanceKm - 100) / 50) - 1));
    const rate = config.length > 20 || colony
      ? RATE_CARD.freight.bands40ft[bandIndex]
      : RATE_CARD.freight.bands20ft[bandIndex];
    addLine(`Transport ${config.distanceKm} km`, rate * config.quantity, 'published', {
      quantity: config.quantity,
      unitRate: rate,
      rateBasis: 'each',
    });
  }
  // IN-01 is on the hold list and the workbook records only "Depends upon
  // location". It carries no figure and says so.
  if (config.installation) addLine('Installation and fixing (IN-01)', null, 'quotation', {
    quantity: config.quantity,
    unitRate: null,
    rateBasis: 'each',
  });
  const gst = Math.round(total * GST_RATE);
  return {
    areaSqft: area,
    lines,
    totalExGst: total,
    gst,
    totalInclGst: total + gst,
    transportNote,
    includeGst: config.includeGst,
    quoteOnly: basePrice === null,
  };
}

function radio(name: string, value: string, label: string, isChecked: boolean, detail = '', attributes = ''): string {
  return `<label class="calc-choice"><input type="radio" name="${esc(name)}" value="${esc(value)}"${checked(isChecked)}${attributes}><span><strong>${esc(label)}</strong>${detail ? `<small>${esc(detail)}</small>` : ''}</span></label>`;
}

/**
 * A product tile in the product step. Takes the copy pack's entry, not the
 * internal ProductDefinition, so the name and description shown to a buyer are
 * the approved strings rather than the code's internal subtitles.
 */
function productChoice(
  name: string,
  entry: { id: string; name: string; description: string | null; platform: string | null },
  isChecked: boolean
): string {
  const definition = PRODUCTS.find((product) => product.id === entry.id);
  const ladder = definition ? getRouteLadder(definition.ladderKey) : null;
  // A product with no approved ladder shows no number anywhere. It is not
  // hidden and it is not given a borrowed price: it renders in quote mode.
  const price = ladder
    ? `from ${money(productPriceRows(definition!, definition!.ladderKey)[0]?.ex || 0)} ex-GST`
    : 'Price on drawing';
  // P0, 05 Aug. These four carried nothing but data-product-choice, so the
  // browser had no anchor rate to price an unpublished size with: it multiplied
  // by an undefined rate, got zero, and showed a base cabin at nothing at all
  // for every size not in the ladder. The embedded route's hidden product field
  // has always carried them; the twelve tiles never did.
  //
  // The per-product rate is gone as of the 06 Aug rate-card ruling: the base
  // cabin is priced from floor area on ONE card for every product, published on
  // the root element, so a tile can no longer carry a rate of its own that
  // disagrees with it. What survives here is quote mode and the ladder key.
  const productAttributes = definition
    ? ` data-label="${esc(entry.name)}"`
      + ` data-quote-only="${rendersQuoteMode(definition, definition.ladderKey) ? 'true' : 'false'}"`
      + ` data-ladder="${esc(definition.ladderKey || (isColonyProduct(definition.id) ? definition.id : 'none'))}"`
    : '';
  return `<label class="calc-choice"><input type="radio" name="${esc(name)}" value="${esc(entry.id)}"${checked(isChecked)} data-product-choice="1"${productAttributes}><span>${productIcon(entry.id as ProductId)}<strong class="choice-title">${esc(entry.name)}</strong>${entry.description ? `<small class="choice-description">${esc(entry.description)}</small>` : ''}<small class="choice-price">${esc(price)}</small>${entry.platform ? `<span class="choice-platform">${esc(entry.platform)}</span>` : ''}</span></label>`;
}

/**
 * A radio list built from workbook rows. The rate shown is the DIFFERENCE
 * from the standard already in the base price, so a buyer is never charged
 * twice for a surface the cabin already has.
 */
function componentChoices(
  name: string,
  list: readonly { code: string; label: string; specification: string | null }[],
  current: string,
  delta: (code: string) => number,
  suffix: string,
  lineGroup: string
): string {
  return list.map((item) => {
    const rate = delta(item.code);
    const detail = rate === 0
      ? 'Standard, included'
      : `${rate > 0 ? '+' : '-'}${money(Math.abs(Math.round(rate)))} ${suffix}`;
    return radio(name, item.code, item.label, item.code === current, detail,
      ` data-rate="${rate}" data-rate-basis="${esc(suffix)}" data-component-code="${esc(item.code)}" data-line-label="${esc(`${lineGroup}: ${item.label}`)}"`);
  }).join('');
}

/** One electrical item: name, unit price beneath, inline stepper on the right. */
function electricalCard(
  item: { label: string; rate: number | null; specification: string | null },
  quantity: number,
  quotation: boolean
): string {
  const name = `electrical[${esc(item.label)}]`;
  const price = quotation ? 'In quotation per building' : `${money(item.rate || 0)} each, ex-GST`;
  return `<label class="ec-card"${item.specification ? ` title="${esc(item.specification)}"` : ''}>`
    + `<span class="ec-name"><strong>${esc(item.label)}</strong><small>${esc(price)}</small></span>`
    + `<span class="ec-stepper">`
    + `<button type="button" data-action="qty-down" data-qty-target="${name}" aria-label="One fewer ${esc(item.label)}">-</button>`
    + `<input type="number" inputmode="numeric" min="0" max="50" step="1" name="${name}"`
    + ` value="${quantity}" aria-label="${esc(item.label)} quantity"`
    + ` data-electrical-item="${esc(item.label)}" data-rate="${item.rate || 0}" data-rate-basis="each"`
    + ` data-rate-group="electrical" data-line-label="${esc(item.label)}" data-line-quantified="true">`
    + `<button type="button" data-action="qty-up" data-qty-target="${name}" aria-label="One more ${esc(item.label)}">+</button>`
    + `</span></label>`;
}

/**
 * One wall of the active room: count stepper and position nudge, one line.
 *
 * DO NOT DELETE THESE AS DEAD CODE. Nothing reads `socket-{room}-{wall}` or
 * `socket-{room}-{wall}-position` today - not the estimate, not the drawing -
 * and a dead-code sweep will therefore find them and be wrong. They are
 * PLACEMENT inputs, not priced quantities: the priced item is the
 * "Plug point (6A)" electrical card at Rs 1,100, and the gate
 * verify-every-stepper-all-states.mjs asserts these four controls do NOT move
 * the estimate precisely so a future double count is caught.
 *
 * THEIR CONSUMER IS CALC-L7 C2, in Merge 4: every placed electrical item gets a
 * standard symbol in the 2D plan, positioned by the wall and the percent-along-
 * the-wall these fields already capture. Ruled 09 Aug: C2 consumes this data and
 * no second position model is built alongside it.
 *
 * Same class as the orphaned FROZEN_OPENER anchor - a value that looks unused
 * right up until something needs it.
 */
function socketWallRow(roomSlug: string, wall: string): string {
  const base = `socket-${roomSlug}-${wall.toLowerCase()}`;
  return `<div class="socket-wall">`
    + `<span class="socket-wall-name">${esc(wall)}</span>`
    + `<span class="ec-stepper">`
    + `<button type="button" data-action="qty-down" data-qty-target="${base}" aria-label="One fewer socket on the ${esc(wall.toLowerCase())} wall">-</button>`
    + `<input type="number" inputmode="numeric" min="0" max="20" step="1" name="${base}" value="0" aria-label="${esc(wall)} wall socket count">`
    + `<button type="button" data-action="qty-up" data-qty-target="${base}" aria-label="One more socket on the ${esc(wall.toLowerCase())} wall">+</button>`
    + `</span>`
    + `<label class="socket-nudge">`
    + `<input type="number" inputmode="numeric" min="0" max="100" step="5" name="${base}-position" value="50" aria-label="${esc(wall)} wall socket position, percent along the wall">`
    + `<span>%</span></label>`
    + `</div>`;
}

function renderStepGuidance(key: keyof typeof STEP_GUIDANCE): string {
  return `<p class="step-guidance"><small>${esc(STEP_GUIDANCE[key])}</small></p>`;
}

function renderWallBuildDiagram(insulationLabel: string): string {
  return `<section class="wall-diagram" aria-label="Wall build-up">
      <small>Wall build-up from outside to inside</small>
      <div class="wall-layer"><span>Weather skin</span><span data-wall-build-thickness>${esc(insulationLabel)}</span></div>
      <div class="wall-layer"><span>Structural face</span><span>MS frame & panel support</span></div>
      <div class="wall-layer"><span>Thermal layer</span><span><span data-wall-build-thickness>${esc(insulationLabel)}</span> PUF</span></div>
    </section>`;
}

function optionCards(name: string, choices: readonly (readonly [string, number])[], current: string, suffix = 'per sq ft'): string {
  return choices.map(([label, rate]) => radio(name, label, label, label === current, rate === 0 ? 'Standard, included' : `${rate > 0 ? '+' : '-'}${money(Math.abs(rate))} ${suffix}`, ` data-rate="${rate}" data-rate-basis="${esc(suffix)}"`)).join('');
}

function quantityRow(group: 'electrical' | 'addOns', label: string, rate: number, quantity: number, help = '', quotation = false): string {
  return `<label class="quantity-row"><span><strong>${esc(label)}</strong>${help ? `<small>${esc(help)}</small>` : ''}<small>${quotation ? 'In quotation per building' : `${money(rate)} each, ex-GST`}</small></span><span class="ec-stepper"><button type="button" data-action="qty-down" data-qty-target="${group}[${esc(label)}]" aria-label="One fewer ${esc(label)}">-</button><input type="number" inputmode="numeric" min="0" max="50" step="1"${group === 'electrical' ? ` data-electrical-item="${esc(label)}"` : ''} name="${group}[${esc(label)}]" value="${quantity}" aria-label="${esc(label)} quantity" data-rate="${rate}" data-rate-basis="each" data-rate-group="${group}" data-line-label="${esc(label)}" data-line-quantified="true">`
    + `<button type="button" data-action="qty-up" data-qty-target="${group}[${esc(label)}]" aria-label="One more ${esc(label)}">+</button>`
    + `</span></label>`;
}

/**
 * One geometry for all three views.
 *
 * Everything downstream - the dimensioned plan, the filled floor plan, the four
 * elevations, the carpet area tile - reads these numbers and nothing else, so
 * the three drawings can never disagree about where a wall is.
 *
 * Room lengths that do not sum to the cabin length are distributed equally.
 * A buyer who has not touched them has none, and equal is the right answer.
 */
export interface DrawGeometry {
  length: number;
  width: number;
  height: number;
  rooms: number;
  roomLengths: number[];
  carpetAreaSqft: number;
  doors: Array<{ index: number; code: string; wall: Wall; position: number; type: string }>;
  windows: Array<{ index: number; code: string; wall: Wall; position: number; width: number; height: number; type: string }>;
  roof: string;
}

export function drawGeometry(config: CalculatorConfig): DrawGeometry {
  const rooms = Math.max(1, config.rooms);
  const supplied = (config.roomLengths || []).slice(0, rooms).filter((n) => n > 0);
  const equal = config.length / rooms;
  const lengths = supplied.length === rooms
    ? supplied
    : Array.from({ length: rooms }, () => equal);
  const sum = lengths.reduce((a, b) => a + b, 0) || config.length;
  const scaled = lengths.map((n) => (n / sum) * config.length);
  return {
    length: config.length,
    width: config.width,
    height: config.height,
    rooms,
    roomLengths: scaled,
    // Carpet area is the floor inside the walls. Partitions are 3 inches, so
    // each one takes a quarter foot of width off the usable floor.
    carpetAreaSqft: Math.max(0, config.length * config.width - (rooms - 1) * 0.25 * config.width),
    doors: config.doors.map((door, index) => ({
      index, code: `D${index + 1}`, wall: door.wall, position: door.position, type: door.type,
    })),
    windows: config.windows.map((item, index) => ({
      index, code: `W${index + 1}`, wall: item.wall, position: item.position,
      width: item.width, height: item.height, type: item.type,
    })),
    roof: config.roof,
  };
}

/** 20.5 ft reads as 20' 6". A drawing gives feet and inches, not decimals. */
export function feetInches(value: number): string {
  const whole = Math.floor(value);
  const inches = Math.round((value - whole) * 12);
  if (inches === 12) return `${whole + 1}' 0"`;
  return `${whole}' ${inches}"`;
}

const VIEW_W = 420;
const VIEW_H = 260;

function planFrame(g: DrawGeometry, pad: number) {
  const scale = Math.min((VIEW_W - pad * 2) / Math.max(6, g.length), (VIEW_H - pad * 2) / Math.max(6, g.width));
  const w = g.length * scale;
  const h = g.width * scale;
  return { scale, w, h, x: (VIEW_W - w) / 2, y: (VIEW_H - h) / 2 };
}

function wallPointAt(frame: { x: number; y: number; w: number; h: number }, wall: Wall, position: number): [number, number] {
  const ratio = Math.min(1, Math.max(0, position / 100));
  if (wall === 'Front') return [frame.x + frame.w * ratio, frame.y + frame.h];
  if (wall === 'Rear') return [frame.x + frame.w * ratio, frame.y];
  if (wall === 'Left') return [frame.x, frame.y + frame.h * ratio];
  return [frame.x + frame.w, frame.y + frame.h * ratio];
}

/** VIEW 1 - the dimensioned plan. Outline, overall dimensions, named openings. */
function renderPlanView(g: DrawGeometry): string {
  const f = planFrame(g, 54);
  const partitions = g.roomLengths.slice(0, -1).map((_, index) => {
    const at = f.x + (g.roomLengths.slice(0, index + 1).reduce((a, b) => a + b, 0) / g.length) * f.w;
    return `<line x1="${at.toFixed(1)}" y1="${f.y}" x2="${at.toFixed(1)}" y2="${f.y + f.h}" class="dw-partition"/>`;
  }).join('');
  const openings = [
    ...g.doors.map((d) => ({ ...d, kind: 'door' as const })),
    ...g.windows.map((w) => ({ ...w, kind: 'window' as const })),
  ].map((item) => {
    const [cx, cy] = wallPointAt(f, item.wall, item.position);
    // A real break in the wall, with a swing arc on a door. Not a shape
    // sitting on top of the line.
    const horizontal = item.wall === 'Front' || item.wall === 'Rear';
    const half = item.kind === 'door' ? 7 : 8;
    const breakLine = horizontal
      ? `<line x1="${(cx - half).toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx + half).toFixed(1)}" y2="${cy.toFixed(1)}" class="dw-break"/>`
      : `<line x1="${cx.toFixed(1)}" y1="${(cy - half).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${(cy + half).toFixed(1)}" class="dw-break"/>`;
    const inward = item.wall === 'Front' ? -1 : item.wall === 'Rear' ? 1 : 0;
    const inwardX = item.wall === 'Left' ? 1 : item.wall === 'Right' ? -1 : 0;
    const mark = item.kind === 'door'
      ? `${breakLine}<path d="M ${(cx - half).toFixed(1)} ${cy.toFixed(1)} A ${(half * 2).toFixed(1)} ${(half * 2).toFixed(1)} 0 0 1 ${(cx + inwardX * half * 2 - (inwardX ? 0 : half)).toFixed(1)} ${(cy + inward * half * 2).toFixed(1)}" class="dw-swing"/><line x1="${(cx - half).toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx - half + inwardX * half * 2).toFixed(1)}" y2="${(cy + inward * half * 2).toFixed(1)}" class="dw-door-leaf"/>`
      : `${breakLine}${horizontal ? `<line x1="${(cx - half).toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx + half).toFixed(1)}" y2="${cy.toFixed(1)}" class="dw-window"/>` : `<line x1="${cx.toFixed(1)}" y1="${(cy - half).toFixed(1)}" x2="${cx.toFixed(1)}" y2="${(cy + half).toFixed(1)}" class="dw-window"/>`}`;
    const lx = item.wall === 'Left' ? cx - 12 : item.wall === 'Right' ? cx + 12 : cx;
    const ly = item.wall === 'Rear' ? cy - 8 : item.wall === 'Front' ? cy + 14 : cy - 8;
    return `${mark}<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" class="dw-code">${esc(item.code)}</text>`;
  }).join('');
  const dimY = f.y + f.h + 24;
  const dimX = f.x - 26;
  return `<g data-plan-view="plan" data-view-name="2D Plan">`
    + `<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" class="dw-shell"/>${partitions}${openings}`
    + `<line x1="${f.x}" y1="${dimY}" x2="${f.x + f.w}" y2="${dimY}" class="dw-dim"/>`
    + `<text x="${f.x + f.w / 2}" y="${dimY - 5}" class="dw-dim-text" data-dim-length>${esc(feetInches(g.length))}</text>`
    + `<line x1="${dimX}" y1="${f.y}" x2="${dimX}" y2="${f.y + f.h}" class="dw-dim"/>`
    // Rotated, not right-aligned into the margin: at anchor end it ran off the
    // left of the viewBox and the width read as a clipped stub.
    + `<text x="${dimX - 6}" y="${f.y + f.h / 2}" class="dw-dim-text" transform="rotate(-90 ${dimX - 6} ${f.y + f.h / 2})" data-dim-width>${esc(feetInches(g.width))}</text>`
    + `<text x="${VIEW_W / 2}" y="18" class="dw-title">2D Plan</text>`
    + `</g>`;
}

/** VIEW 2 - filled room blocks, each with its code and its own length. */
function renderFloorView(g: DrawGeometry): string {
  const f = planFrame(g, 40);
  let run = 0;
  const blocks = g.roomLengths.map((roomLength, index) => {
    const bx = f.x + (run / g.length) * f.w;
    const bw = (roomLength / g.length) * f.w;
    run += roomLength;
    return `<g class="dw-room" data-room="${index + 1}">`
      + `<rect x="${(bx + 2).toFixed(1)}" y="${(f.y + 2).toFixed(1)}" width="${Math.max(0, bw - 4).toFixed(1)}" height="${(f.h - 4).toFixed(1)}" class="dw-room-fill"/>`
      + `<text x="${(bx + bw / 2).toFixed(1)}" y="${(f.y + f.h / 2 - 4).toFixed(1)}" class="dw-room-code">R${index + 1}</text>`
      // Short label, never a dimension string. Dimensions belong to the 2D
      // Plan; repeating them here made the two views read as the same drawing
      // with different fills.
      + `<text x="${(bx + bw / 2).toFixed(1)}" y="${(f.y + f.h / 2 + 11).toFixed(1)}" class="dw-room-size">Room ${index + 1}</text>`
      + `</g>`;
  }).join('');
  return `<g data-plan-view="floor" data-view-name="Floor Plan" hidden>`
    + `<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" class="dw-shell"/>${blocks}`
    + `<text x="${VIEW_W / 2}" y="18" class="dw-title">Floor Plan</text>`
    + `</g>`;
}

/** VIEW 3 - front, rear, left and right in a 2x2 grid, each with its openings. */
function renderElevationsView(g: DrawGeometry): string {
  const cells: Array<{ wall: Wall; col: number; row: number }> = [
    { wall: 'Front', col: 0, row: 0 },
    { wall: 'Rear', col: 1, row: 0 },
    { wall: 'Left', col: 0, row: 1 },
    { wall: 'Right', col: 1, row: 1 },
  ];
  const cellW = 186, cellH = 100;
  const body = cells.map(({ wall, col, row }) => {
    const ox = 18 + col * (cellW + 22);
    const oy = 30 + row * (cellH + 34);
    const spanFt = wall === 'Front' || wall === 'Rear' ? g.length : g.width;
    const scale = Math.min(cellW / Math.max(6, spanFt), cellH / Math.max(6, g.height));
    const w = spanFt * scale;
    const h = g.height * scale;
    const x = ox + (cellW - w) / 2;
    const y = oy + (cellH - h);
    const marks = [
      ...g.doors.filter((d) => d.wall === wall).map((d) => {
        const cx = x + w * (d.position / 100);
        const dh = Math.min(h * 0.82, 7 * scale);
        return `<rect x="${(cx - 1.6 * scale).toFixed(1)}" y="${(y + h - dh).toFixed(1)}" width="${(3.2 * scale).toFixed(1)}" height="${dh.toFixed(1)}" class="dw-door"/>`
          + `<text x="${cx.toFixed(1)}" y="${(y + h - dh - 3).toFixed(1)}" class="dw-code">${esc(d.code)}</text>`;
      }),
      ...g.windows.filter((item) => item.wall === wall).map((item) => {
        const cx = x + w * (item.position / 100);
        const ww = item.width * scale;
        const wh = item.height * scale;
        const wy = y + h - wh - Math.min(h * 0.3, 3 * scale);
        return `<rect x="${(cx - ww / 2).toFixed(1)}" y="${wy.toFixed(1)}" width="${ww.toFixed(1)}" height="${wh.toFixed(1)}" class="dw-window"/>`
          + `<text x="${cx.toFixed(1)}" y="${(wy - 3).toFixed(1)}" class="dw-code">${esc(item.code)}</text>`;
      }),
    ].join('');
    const roofLine = g.roof === 'Sloped'
      ? `<polyline points="${x.toFixed(1)},${y.toFixed(1)} ${(x + w / 2).toFixed(1)},${(y - 10).toFixed(1)} ${(x + w).toFixed(1)},${y.toFixed(1)}" class="dw-roof"/>`
      : `<line x1="${x.toFixed(1)}" y1="${(y - 4).toFixed(1)}" x2="${(x + w).toFixed(1)}" y2="${(y - 7).toFixed(1)}" class="dw-roof"/>`;
    return `<g class="dw-elevation" data-elevation="${wall}">`
      + `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" class="dw-shell"/>`
      + `${roofLine}${marks}`
      + `<text x="${(ox + cellW / 2).toFixed(1)}" y="${(oy + cellH + 16).toFixed(1)}" class="dw-elevation-label">${wall} elevation</text>`
      + `</g>`;
  }).join('');
  return `<g data-plan-view="elevations" data-view-name="4 Elevations" hidden>${body}`
    + `<text x="${VIEW_W / 2}" y="18" class="dw-title">4 Elevations</text></g>`;
}

/**
 * The viewer: three tab-switched views, then the Carpet Area and Base Price
 * tiles. Without JavaScript the tabs are radio buttons that still change which
 * view the server renders, so all three remain reachable.
 */
function renderDrawing(config: CalculatorConfig, basePrice: number | null): string {
  const g = drawGeometry(config);
  const tab = (value: string, label: string) =>
    radio('planView', value, label, config.planView === value, '', ' data-view-tab');
  return `<div class="drawing-viewer" data-drawing-viewer>`
    + `<fieldset class="drawing-tabs"><legend>Drawing view</legend>${tab('plan', '2D Plan')}${tab('floor', 'Floor Plan')}${tab('elevations', '4 Elevations')}</fieldset>`
    + `<svg class="floor-plan" viewBox="0 0 ${VIEW_W} ${VIEW_H}" role="img" aria-label="Cabin drawing: 2D plan, floor plan and four elevations" data-floor-plan data-view="${esc(config.planView)}">`
    + `${renderPlanView(g)}${renderFloorView(g)}${renderElevationsView(g)}`
    + `</svg>`
    // Ruling, 05 Aug: codes stay on the drawing where space is tight, and
    // everything a buyer reads uses words. This line is the bridge between the
    // two, so nobody has to learn a code to read their own quotation.
    + `<p class="drawing-key">R = room &middot; D = door &middot; W = window</p>`
    + `<p class="drawing-legend"><small>On the drawing, R1 is Room 1, D1 is Door 1 and W1 is Window 1. Every control and every line of your quotation uses the full words.</small></p>`
    + `<div class="drawing-tiles">`
    + `<div class="drawing-tile"><small>Carpet Area</small><strong data-carpet-area>${g.carpetAreaSqft.toLocaleString('en-IN', { maximumFractionDigits: 0 })} sq ft</strong></div>`
    + `<div class="drawing-tile"><small>Base cabin price</small><strong data-base-price>${basePrice === null ? 'Quoted separately' : money(basePrice)}</strong></div>`
    + `</div></div>`;
}


function productPriceRows(
  product: ProductDefinition,
  ladderKey?: string | null
): Array<{ label: string; area: number; ex: number | null; capacity?: string; length?: number; width?: number }> {
  const withDimensions = (row: { label: string; areaSqft: number }, ex: number | null, capacity?: string) => ({
    label: row.label,
    area: row.areaSqft,
    ex,
    capacity,
    ...(dimensionsFromLabel(row.label) || {}),
  });
  if (isColonyProduct(product.id)) {
    return colonyLadder(product.id).map((row) => withDimensions(row, row.priceExGst, row.capacity));
  }
  // The route's own published ladder, or the product's own if none was supplied.
  const ladder = getRouteLadder(ladderKey ?? product.ladderKey);
  if (ladder) {
    return ladder.map((row) => ({
      label: row.label,
      area: row.areaSqft,
      ex: row.priceExGst,
      capacity: undefined,
      ...(row.length !== null && row.width !== null ? { length: row.length, width: row.width } : {}),
    }));
  }
  // No ladder of its own. Quote mode: sizes are listed, no number is published.
  return PRODUCT_LADDERS.containerOfficeCabins.map((row) => withDimensions(row, null));
}

export function getEmbeddedProductSummary(productId: ProductId, ladderKey?: string | null, productName?: string): EmbeddedProductSummary {
  const product = productFor(productId);
  const rows = productPriceRows(product, ladderKey);
  const pricedRows = rows.filter((row): row is { label: string; area: number; ex: number; capacity?: string; length?: number; width?: number } => row.ex !== null && Number.isFinite(row.ex));
  if (pricedRows.length === 0) {
    return {
      name: productName || product.name,
      sizeLabel: null,
      price: null,
      priceLabel: 'Price on request',
    };
  }
  const cheapest = pricedRows.reduce((best, current) => (current.ex < best.ex ? current : best), pricedRows[0]);
  return {
    name: productName || product.name,
    sizeLabel: cheapest.label,
    price: cheapest.ex,
    priceLabel: `${cheapest.label} starts at ${money(cheapest.ex)}`,
  };
}

function renderPriceTables(products: readonly ProductDefinition[] = PRODUCTS, ladderKey?: string | null): string {
  return `<section class="price-tables" aria-labelledby="published-price-tables"><h2 id="published-price-tables">Published cabin price tables</h2><p>All primary prices are ex-GST. Including-GST figures apply 18 percent GST.</p>${products.map((product) => { const tableLadderKey = products.length === 1 ? (ladderKey ?? product.ladderKey) : product.ladderKey; const tableRows = productPriceRows(product, tableLadderKey); const showBuild = hasContainerOfficeBuildLabels(tableLadderKey, tableRows.map((r) => r.label)); return `<details><summary>${esc(product.name)} price table</summary><table data-product-price-table="${product.id}"><caption>${esc(product.name)} published size and price ladder</caption><thead><tr><th scope="col">Size</th><th scope="col">Area</th>${isColonyProduct(product.id) ? '<th scope="col">Workers housed</th>' : ''}${showBuild ? '<th scope="col">Build</th>' : ''}<th scope="col">Price ex-GST</th><th scope="col">Including 18% GST</th></tr></thead><tbody>${tableRows.map((row) => `<tr${row.length !== undefined && row.width !== undefined && row.ex !== null ? ` data-published-size data-length="${row.length}" data-width="${row.width}" data-price-ex-gst="${row.ex}"` : ''}><th scope="row">${esc(row.label)}</th><td>${row.area.toLocaleString('en-IN')} sq ft</td>${isColonyProduct(product.id) ? `<td>${esc(row.capacity || '')}</td>` : ''}${showBuild ? `<td>${esc(containerOfficeBuildLabel(tableLadderKey, row.label) || '')}</td>` : ''}<td>${row.ex === null ? 'price on request' : money(row.ex)}</td><td>${row.ex === null ? 'itemised in quotation' : money(Math.round(row.ex * (1 + GST_RATE)))}</td></tr>`).join('')}</tbody></table></details>`; }).join('')}</section>`;
}

function renderFreightTable(): string {
  const rows = RATE_CARD.freight.bands20ft.map((price, index) => `<tr data-freight-band data-min-km="${100 + index * 50}" data-max-km="${150 + index * 50}" data-price-20="${price}" data-price-40="${RATE_CARD.freight.bands40ft[index]}"><th scope="row">${100 + index * 50}-${150 + index * 50} km</th><td>${money(price)}</td><td>${money(RATE_CARD.freight.bands40ft[index])}</td></tr>`).join('');
  return `<table data-freight-table><caption>Delivery freight ladder, ex-GST. Freight figures are tentative and confirmed with the delivery quotation.</caption><thead><tr><th scope="col">Distance</th><th scope="col">20 ft trailer</th><th scope="col">40 ft trailer</th></tr></thead><tbody><tr><th scope="row">Bangalore city</th><td>Free</td><td>Free</td></tr><tr><th scope="row">Delhi NCR</th><td>Free</td><td>Free</td></tr><tr><th scope="row">Under 100 km</th><td>Confirmed at quotation</td><td>Confirmed at quotation</td></tr>${rows}</tbody></table>`;
}

/**
 * The two explainer paragraphs, rendered ABOVE the calculator.
 *
 * They used to sit below it inside a 1169px `calculator-copy` block that made
 * up 29.4% of the mobile page. The competitor carries a 505px intro above
 * instead, so this is capped to match and the FAQ moves out of the section
 * entirely (see renderCalculatorFaq, rendered by the page further down).
 */
function renderIntro(): string {
  return `<section class="calculator-intro" aria-labelledby="calculator-copy-title"><h2 id="calculator-copy-title">What this calculator does</h2><p>This tool builds a live estimate for a SAMAN portable cabin from our base-cabin rate card. Pick the product, enter any size in feet, choose the structure, finishes, doors, windows, electrical items and add-ons, and the estimate updates line by line as you select. Every base price comes from our base-cabin rate card, not from the finished-product price our product pages publish, transport follows our freight ladder, and branded third-party items are shown at current vendor rates plus a 5 percent handling margin.</p><p>The figure you see is an indicative ex-factory estimate with GST shown separately. It is not a quotation. When you submit your configuration, our sales team verifies it against your drawing and location and returns a fixed, itemised quotation. Custom quote target: 48 business hours for custom configurations. Delivery timing is confirmed in the fixed quotation after the site and order are reviewed.</p></section>`;
}

/** FAQ block. Rendered by the page BELOW the calculator section, not inside it. */
export function renderCalculatorFaq(): string {
  const faqs = [
    ['Is the calculator price final?', 'No. It is an indicative estimate from our base-cabin rate card. Your fixed quotation is targeted within 48 business hours for custom configurations and is the figure we stand behind.'],
    ['Can I price a custom size?', 'Yes. Enter any length and width in feet. The base cabin prices from our rate card by floor area, at a lower rate per square foot as the cabin gets larger.'],
    ['Does the price include GST and transport?', 'GST at 18 percent is always shown separately. Transport is estimated from our freight ladder by distance and confirmed in the quotation; Bangalore city and Delhi NCR are free-delivery zones.'],
    ['What warranty applies?', '5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation.'],
  ];
  return `<section class="calculator-faq" aria-labelledby="calculator-faq-title"><h2 id="calculator-faq-title">Cabin cost calculator FAQs</h2><dl>${faqs.map(([question, answer]) => `<div><dt>${esc(question)}</dt><dd>${esc(answer)}</dd></div>`).join('')}</dl></section>`;
}

function renderEstimate(estimate: CalculatorEstimate): string {
  const totalWithGST = estimate.quoteOnly
    ? 'Custom quote target: 48 business hours'
    : (estimate.includeGst ? `${money(estimate.totalInclGst)} incl. 18% GST` : 'GST line shown above');
  return `<aside class="estimate-card" aria-label="Live itemised estimate"><h2>${esc(ESTIMATE_PANEL.heading)}</h2><p><span>${esc(ESTIMATE_PANEL.floorArea)}</span> <span data-estimate-area>${estimate.areaSqft.toLocaleString('en-IN')} sq ft</span></p><dl class="estimate-lines" data-estimate-lines>${estimate.lines.map((line) => `<div data-estimate-line><dt>${esc(line.label)}</dt><dd>${line.amount === null ? 'in quotation' : money(line.amount)}</dd></div>`).join('')}${estimate.transportNote ? `<div><dt>Transport</dt><dd>${esc(estimate.transportNote)}</dd></div>` : ''}<div><dt>${esc(ESTIMATE_PANEL.subtotal)}</dt><dd>${estimate.quoteOnly ? 'in quotation' : money(estimate.totalExGst)}</dd></div><div><dt>${esc(ESTIMATE_PANEL.gst)}</dt><dd>${estimate.quoteOnly ? 'in quotation' : money(estimate.gst)}</dd></div></dl><div class="total"><small>${esc(ESTIMATE_PANEL.total)}</small><strong data-estimate-total>${estimate.quoteOnly ? 'Price on request' : money(estimate.totalExGst)}</strong><small data-estimate-total-note>${esc(totalWithGST)}</small></div>${estimate.quoteOnly ? `<p class="quote-mode">${esc(QUOTE_MODE)}</p>` : ''}<p class="estimate-fine-print"><small>${esc(ESTIMATE_PANEL.finePrint)}</small></p></aside>`;
}

function renderDoorCard(door: DoorConfig, index: number, reserved: boolean): string {
  const state = reserved ? ' data-reserved-door hidden disabled' : '';
  return `<fieldset class="opening-card" data-door-index="${index}"${state}><legend>Door ${index + 1}</legend>${radio(`doors[${index}][type]`, 'Steel door', 'Steel door', door.type === 'Steel door', `${index === 0 ? 'Standard included' : `${money(RATE_CARD.marketRates.steelDoor)} each, ex-GST`}`, ` data-rate="${index === 0 ? 0 : RATE_CARD.marketRates.steelDoor}" data-rate-basis="each"`)}${radio(`doors[${index}][type]`, 'Glass / Aluminium / uPVC door', 'Glass / Aluminium / uPVC door', door.type !== 'Steel door', `${money(RATE_CARD.marketRates.upvcGlassDoor)} each, ex-GST`, ` data-rate="${RATE_CARD.marketRates.upvcGlassDoor}" data-rate-basis="each"`)}<label>Wall<select name="doors[${index}][wall]">${WALLS.map((wall) => `<option${selected(door.wall === wall)}>${wall}</option>`).join('')}</select></label><label>End of wall<select name="doors[${index}][end]">${['Left', 'Right'].map((end) => `<option${selected(door.end === end)}>${end}</option>`).join('')}</select></label><label>Distance from selected end (ft)<input type="number" inputmode="numeric" min="0" step="0.5" name="doors[${index}][distance]" value="${door.distance}" aria-label="Door ${index + 1} distance from end"></label><fieldset><legend>Hinge side</legend>${radio(`doors[${index}][hinge]`, 'Left', 'Left-side hinge', door.hinge === 'Left')}${radio(`doors[${index}][hinge]`, 'Right', 'Right-side hinge', door.hinge === 'Right')}</fieldset><fieldset><legend>Opening</legend>${radio(`doors[${index}][opening]`, 'In', 'Opens in', door.opening === 'In')}${radio(`doors[${index}][opening]`, 'Out', 'Opens out', door.opening === 'Out')}</fieldset><small>Use "In" when hand flow should remain inside the room edge. Use "Out" when swing clearance is outside.</small><input type="hidden" name="doors[${index}][position]" aria-label="Door ${index + 1} position along wall" value="${door.position}"></fieldset>`;
}

function renderWindowCard(window: WindowConfig, index: number, reserved: boolean): string {
  const state = reserved ? ' data-reserved-window hidden disabled' : '';
  return `<fieldset class="opening-card" data-window-index="${index}"${state}><legend>Window ${index + 1}</legend><label>Type<select name="windows[${index}][type]">${Object.entries(WINDOW_RATES).map(([name, rate]) => `<option value="${esc(name)}"${selected(name === window.type)} data-rate="${rate}" data-rate-basis="per sq ft">${esc(name)} · ${money(rate)} per sq ft</option>`).join('')}</select></label><label>Wall<select name="windows[${index}][wall]">${WALLS.map((wall) => `<option${selected(window.wall === wall)}>${wall}</option>`).join('')}</select></label><label>End of wall<select name="windows[${index}][end]">${['Left', 'Right'].map((end) => `<option${selected(window.end === end)}>${end}</option>`).join('')}</select></label><label>Distance from selected end (ft)<input type="number" inputmode="numeric" min="0" step="0.5" name="windows[${index}][distance]" value="${window.distance}" aria-label="Window ${index + 1} distance from end"></label><label>Width in ft<input type="number" inputmode="decimal" min="1" max="12" step="0.5" name="windows[${index}][width]" value="${window.width}"></label><label>Height in ft<input type="number" inputmode="decimal" min="1" max="12" step="0.5" name="windows[${index}][height]" value="${window.height}"></label><fieldset><legend>Track</legend>${radio(`windows[${index}][track]`, '2 Track', '2 Track', window.track === '2 Track', 'Standard', ' data-rate-multiplier="1"')}${radio(`windows[${index}][track]`, '2.5 Track', '2.5 Track', window.track === '2.5 Track', '+12%', ' data-rate-multiplier="1.12"')}</fieldset><small>Track choice affects how much frame is needed along the edge.</small><input type="hidden" name="windows[${index}][position]" value="${window.position}"></fieldset>`;
}

/**
 * The default size a product's preview draws: the first row of its published
 * ladder, so the plan a buyer sees is a size we actually publish. Falls back to
 * the calculator's own default only where a product publishes nothing.
 */

/**
 * THE BAND'S RADIUS, RE-VERIFIED 08 Aug 2026 — CALC-L3 §2.
 *
 * Written here rather than inside CALCULATOR_ENTRY_STYLES below, because that
 * template literal is emitted verbatim into a <style> tag on every product page
 * carrying the band. A comment in there is shipped to 41 pages; a comment here
 * costs nothing.
 *
 * The ticket expected the product-page redesign to have landed and every
 * section card to have become radius 16 on a #F3F6F4 ground with a #E3EAE5
 * border and a 64px rhythm, and instructed a fix if the band no longer matched
 * its siblings. It was re-checked after merging origin/static-migration
 * (a996515b) into this branch.
 *
 * IT STILL MATCHES AT 8px, so nothing was changed. Measured on the merged
 * production build across 41 routes at 1440 / 1920 / 390: every sibling section
 * card computes to 8px, because `--radius` is still 0.5rem and the shared Card
 * is still `rounded-lg`. Neither #E3EAE5 nor #F3F6F4 occurs anywhere in the
 * merged tree.
 *
 * The redesign is real but UNMERGED. It lives on
 * agent/pp-t1-section-framing-20260806 (50a79ca9, src/styles/pp-sections.css)
 * and is not an ancestor of origin/static-migration. When that branch lands,
 * this radius must move to 16 in the same change — the band cannot detect the
 * section system for itself, which is exactly why this is written down.
 */
export const CALCULATOR_ENTRY_STYLES = `
/* ===== THE CALCULATOR ENTRY BAND ON PRODUCT PAGES ======================= */
.calc-entry {
  /* A contained feature card in the same column as its siblings, not a
     full-bleed band. Measured on the page: the column is 1216px wide at both
     1440 and 1920, and this element's parent IS that column - so the width is
     inherited rather than declared and cannot drift from the sibling cards by
     a pixel.
     Radius 8px, read off the Product Details card. The ticket guessed ~16;
     the measured value is 8, and matching the sibling matters more than the
     guess. overflow:hidden clips the photograph to it.
     Three devices mark it out and no more: a step more elevation than the
     sibling cards, a 1px amber keyline, and the pulsing eyebrow dot. */
  position: relative;
  margin: 16px 0;
  background-color: #0E1729;
  color: #EAF0F7;
  /* outline, not border. A 1px border is part of the box, so the card came out
     422px against a specified 420. An outline with a negative offset draws the
     same keyline just inside the edge, follows the radius, and occupies no
     layout at all. */
  outline: 1px solid rgba(224,163,64,0.35);
  outline-offset: -1px;
  border-radius: 8px;
  overflow: hidden;
  isolation: isolate;
  box-shadow: 0 12px 32px rgba(14,23,41,0.22), 0 2px 8px rgba(14,23,41,0.12);
}
.calc-entry-photo,
.calc-entry-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
.calc-entry-photo img { object-fit: cover; object-position: center right; }
.calc-entry-scrim {
  position: absolute;
  inset: 0;
  /* Rotated to 180deg below 1024 so it darkens from the bottom. */
  /* Mobile is the 180deg rotation, deepened at the top under the authorised
     cap of 0.98 / 0.95 on the first two stops.
     Measured at 390 with the original 0.35/0.72 stops: the copy sits in the
     upper third, which is exactly where a bottom-up gradient is thinnest, and
     the amber price came out at 2.91:1 on rgb(88,95,107). The headline passed
     at 5.61:1 - amber is the tighter of the two and it is what set this. */
  background: linear-gradient(180deg, rgba(14,23,41,0.88) 0%, rgba(14,23,41,0.93) 45%, rgba(14,23,41,0.97) 100%);
}
.calc-entry-inner {
  position: relative;
  padding: 48px 40px;
  display: flex;
  align-items: center;
}
.calc-entry-copy { max-width: 600px; }
/* The wordmark is near-black and so is the band under the left scrim, so
   the logo sits on a white chip rather than on the photograph. That also
   keeps the mark in its designed colours instead of inventing a knockout.
   Source is 981x500 rendering at 56px tall - downscaled 8.9x, never up. */
.calc-entry-chip {
  display: inline-block;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 12px 14px;
  margin: 0 0 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}
.calc-entry-chip img { display: block; height: 56px; width: auto; }
/* The only motion on the band. Opacity only - no transform and no size
   change - so it cannot shift layout, and it stops entirely for anyone
   who has asked for reduced motion. */
.calc-entry-dot {
  display: inline-block;
  width: 6px; height: 6px;
  margin-right: 8px;
  border-radius: 50%;
  background: #E0A340;
  vertical-align: middle;
  animation: calc-entry-pulse 2.5s ease-in-out infinite;
}
@keyframes calc-entry-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@media (prefers-reduced-motion: reduce) {
  .calc-entry-dot { animation: none; }
}
.calc-entry-eyebrow { margin: 0 0 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #E0A340; }
.calc-entry-headline { margin: 0 0 10px; font-size: 30px; line-height: 1.18; font-weight: 700; color: #EAF0F7; }
.calc-entry-price { color: #E0A340; }
.calc-entry-line { margin: 0 0 16px; font-size: 15px; font-weight: 400; line-height: 1.45; color: rgba(234,240,247,0.72); }
.calc-entry-cta {
  display: inline-flex; align-items: center; justify-content: center;
  height: 46px; min-height: 46px; padding: 0 22px;
  background: #E0A340; color: #0E1729;
  font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 8px;
  border: none; cursor: pointer;
}
.calc-entry-cta:hover, .calc-entry-cta:focus { background: #E0A340; color: #0E1729; }
.calc-entry-trust { margin: 12px 0 0; font-size: 12px; font-weight: 400; color: rgba(234,240,247,0.56); }

@media (max-width: 767px) {
  .calc-entry-chip { padding: 10px 12px; margin-bottom: 16px; }
  .calc-entry-chip img { height: 44px; }
}

@media (min-width: 1024px) {
  .calc-entry-scrim {
    background: linear-gradient(90deg,
      rgba(14,23,41,0.97) 0%,
      rgba(14,23,41,0.92) 38%,
      rgba(14,23,41,0.55) 62%,
      rgba(14,23,41,0.15) 100%);
  }
  .calc-entry-inner { min-height: 420px; padding: 0 48px; }
  .calc-entry-chip { padding: 12px 14px; margin-bottom: 20px; }
  .calc-entry-chip img { height: 56px; }
  .calc-entry-headline { font-size: 34px; }
}
`;

function defaultSizeFor(product: ProductDefinition, ladderKey?: string | null): { length: number; width: number } {
  const rows = productPriceRows(product, ladderKey ?? product.ladderKey);
  const first = rows.find((row) => row.length && row.width);
  return { length: first?.length || 20, width: first?.width || 10 };
}

/**
 * The live 2D Plan for a product's default size. The real component - the same
 * renderPlanView the calculator draws with - not a screenshot and not an
 * illustration. Inline SVG, so it costs no image request and cannot move LCP.
 */
export function renderProductPlanPreview(productId: string, ladderKey?: string | null): string {
  const product = productFor(productId as ProductId);
  const size = defaultSizeFor(product, ladderKey);
  const config = normaliseCalculatorConfig({ productId, length: size.length, width: size.width } as Partial<CalculatorConfig>);
  const geometry = drawGeometry(config);
  return `<svg class="entry-plan floor-plan" viewBox="0 0 420 260" role="img"`
    + ` aria-label="Plan of a ${size.length} by ${size.width} foot ${esc(product.name)}" focusable="false">`
    + `${renderPlanView(geometry)}</svg>`;
}

/**
 * The entry band. Placeholder copy only, each slot marked data-copy-slot.
 */
export function renderCalculatorEntrySection(options: {
  productId?: string;
  productName: string;
  ladderKey?: string | null;
  href?: string;
  photo?: {
    webpSrcSet: string;
    jpgSrcSet: string;
    src: string;
    alt: string;
  };
  suppressCommitmentCopy?: boolean;
}): string {
  // LC-06 FIX v1.1 (17 Aug 2026) — `productId` is now optional so a no-prefill
  // route (this page's own calculator misattribution fix; also every existing
  // UNVERIFIED_PRODUCT_ID_CLUSTERS route) can still show this entry band
  // instead of no band at all. With no productId there is no ladder to read a
  // price from, so `entry` stays undefined and the existing "Design your
  // {product}" branch below renders exactly as it already does for
  // container-cafe and every other unpriced-ladder route. Every existing
  // caller still passes a real productId, so their output is unchanged.
  const entry = options.productId
    ? (() => {
        const product = productFor(options.productId as ProductId);
        const rows = productPriceRows(product, options.ladderKey ?? product.ladderKey);
        return rows.find((row) => row.ex !== null && row.ex !== undefined);
      })()
    : undefined;
    // An in-page anchor, not a route. The whole calculator is already embedded
  // further down this page; sending the buyer to /cabin-cost-calculator threw
  // away the product context and the scroll position. The standalone route
  // stays exactly as it is for direct traffic.
  const href = options.href || '#cabin-calculator';
  const photo = options.photo || {
    webpSrcSet: '/credentials/optimized/calculator-band-v1-768.webp 768w, /credentials/optimized/calculator-band-v1-1216.webp 1216w, /credentials/optimized/calculator-band-v1-1440.webp 1440w, /credentials/optimized/calculator-band-v1-1926.webp 1926w',
    jpgSrcSet: '/credentials/optimized/calculator-band-v1-768.jpg 768w, /credentials/optimized/calculator-band-v1-1216.jpg 1216w, /credentials/optimized/calculator-band-v1-1440.jpg 1440w, /credentials/optimized/calculator-band-v1-1926.jpg 1926w',
    src: '/credentials/optimized/calculator-band-v1-1926.jpg',
    alt: 'SAMAN portable cabin calculator',
  };
  return `<style>${CALCULATOR_ENTRY_STYLES}</style>`
    + `<section class="calc-entry" data-calculator-entry aria-labelledby="calc-entry-title">`
    + `<picture class="calc-entry-photo">`
    + `<source type="image/webp" sizes="(min-width: 1280px) 1216px, 100vw" srcset="${esc(photo.webpSrcSet)}">`
    + `<img src="${esc(photo.src)}" sizes="(min-width: 1280px) 1216px, 100vw" srcset="${esc(photo.jpgSrcSet)}" alt="${esc(photo.alt)}" width="1926" height="817" loading="lazy" decoding="async">`
    + `</picture>`
    + `<div class="calc-entry-scrim" aria-hidden="true"></div>`
    + `<div class="calc-entry-inner">`
    + `<div class="calc-entry-copy">`
    + `<span class="calc-entry-chip"><img src="/credentials/optimized/saman-logo-band-cropped.webp" alt="SAMAN Portable" width="110" height="56" loading="lazy" decoding="async"></span>`
    + `<p class="calc-entry-eyebrow" data-copy-slot="eyebrow"><span class="calc-entry-dot" aria-hidden="true"></span>PRICE IT YOURSELF</p>`
    + `<h2 id="calc-entry-title" class="calc-entry-headline" data-copy-slot="headline">`
    + `${entry ? `Your ${esc(options.productName)} from <span class="calc-entry-price">${money(entry.ex as number)}</span>` : `Design your ${esc(options.productName)}`}</h2>`
    + `<p class="calc-entry-line" data-copy-slot="subline">`
    + `Set the size, choose the finish, watch the price move as you go.</p>`
    + `<a class="calc-entry-cta" href="${esc(href)}" data-copy-slot="cta" aria-controls="cabin-calculator" aria-expanded="true">Start your design</a>`
    + (options.suppressCommitmentCopy ? '' : `<p class="calc-entry-trust" data-copy-slot="trust">Custom quote target: 48 business hours. Built in our own works.</p>`)
    + `</div></div></section>`;
}

export function renderCabinCalculatorSSR(options: RenderCalculatorOptions = {}): string {
  const parsedConfig = normaliseCalculatorConfig(options.config || parseCalculatorQuery(options.query));
  const withSlug = options.productSlug
    ? normaliseCalculatorConfig({ ...parsedConfig, productId: productIdForSlug(options.productSlug) })
    : parsedConfig;
  // The embedding route's ladder wins over anything supplied in the query, so a
  // page can never be talked into pricing from a different route's ladder.
  const config: CalculatorConfig = options.ladderKey
    ? { ...withSlug, ladderKey: options.ladderKey }
    : withSlug;
  const embedded = options.embedded === true;
  const includeCopy = options.includeCopy ?? !embedded;
  // A no-prefill mount deliberately opens the general cabin calculator. The
  // default ProductId still drives that calculator internally, but it must not
  // be represented as the host page's product in the retained document.
  const documentProductMode = embedded && !options.productSlug && !options.config?.productId && !one(options.query?.productId)
    ? 'general'
    : 'selected';
  const product = productFor(config.productId);
  const colony = isColonyProduct(config.productId);
  const estimate = computeCalculatorEstimate(config);
  if (options.quoteFreightOutsideFreeZones) {
    const transportAmounts = estimate.lines
      .filter((line) => line.label.startsWith('Transport '))
      .reduce((sum, line) => sum + (line.amount || 0), 0);
    estimate.lines = estimate.lines.filter((line) => !line.label.startsWith('Transport '));
    estimate.totalExGst -= transportAmounts;
    estimate.gst = Math.round(estimate.totalExGst * GST_RATE);
    estimate.totalInclGst = estimate.totalExGst + estimate.gst;
    estimate.transportNote =
      config.deliveryZone === 'Bangalore city' || config.deliveryZone === 'Delhi NCR'
        ? 'Free delivery zone'
        : 'Quoted separately';
  }
  const active = int(options.activeStep, 0, 0, 8);
  // Eight steps standalone, seven embedded. The structure step was removed on
  // 03 Aug 2026 and became a stated-construction disclosure; a step that offers
  // one option is not a step. Headings are the copy pack's, verbatim.
  const stepDefinitions = STEP_COPY.map((step) => [step.heading, step.key] as const);
  // Nine steps on both routes. The embed preselects a product; it does not
  // remove the step that chooses one.
  const visibleSteps = stepDefinitions;
  const section = (index: number, body: string): string => `<section class="calc-step${active === index ? ' is-active' : ''}" id="calculator-step-${index + 1}" data-step="${index + 1}" aria-labelledby="calculator-step-title-${index + 1}"><h2 id="calculator-step-title-${index + 1}">${esc(stepDefinitions[index][0])}</h2>${body}</section>`;

  const productStep = section(0, `${renderStepGuidance('product')}<fieldset><legend>Choose your product</legend><div class="product-tiles">${PRODUCT_STEP.map((entry) => productChoice('productId', entry, entry.id === config.productId)).join('')}</div></fieldset>`);

  const selectedColony = colonyLadder(config.productId)[config.colonyVariant];
  const suggestedQuantity = config.workers > 0 && selectedColony?.capacityMax ? Math.ceil(config.workers / selectedColony.capacityMax) : config.quantity;
  const colonySize = `<label>Workers to accommodate<input type="number" inputmode="numeric" min="1" max="100000" name="workers" value="${config.workers || ''}" data-workers></label><p data-worker-suggestion>${config.workers > 0 && selectedColony ? `${selectedColony.label} × ${suggestedQuantity} accommodates at least ${config.workers.toLocaleString('en-IN')} workers.` : 'Enter the worker headcount to see the smallest sufficient configuration and quantity.'}</p><fieldset><legend>Approved building configuration</legend>${colonyLadder(config.productId).map((item, index) => radio('colonyVariant', String(index), `${item.label}, ${item.areaSqft.toLocaleString('en-IN')} sq ft`, index === config.colonyVariant, `${item.capacity || 'Capacity confirmed at quotation'} · ${item.priceExGst === null ? 'Price on request' : `${money(item.priceExGst)} ex-GST`}`, ` data-price="${item.priceExGst ?? 0}" data-area="${item.areaSqft}" data-capacity-max="${item.capacityMax || 0}"`)).join('')}</fieldset><label>Building quantity<input type="number" inputmode="numeric" min="1" max="50" name="quantity" value="${config.quantity}"></label>`;
  // The tile shows the same base the estimate's first line shows.
  const basePriceForDrawing = estimate.lines[0]?.amount ?? null;
  const regularSize = `<div class="field-grid"><label>Length in ft<input type="number" inputmode="decimal" min="4" max="60" step="0.5" name="length" value="${config.length}" required aria-describedby="size-guidance"></label><label>Width in ft<input type="number" inputmode="decimal" min="4" max="60" step="0.5" name="width" value="${config.width}" required aria-describedby="size-guidance"></label><label>Height in ft<input type="number" inputmode="decimal" min="7" max="16" step="0.5" name="height" value="${config.height}"></label><label>Cabin quantity<input type="number" inputmode="numeric" min="1" max="50" step="1" name="quantity" value="${config.quantity}"></label></div><p id="size-guidance">${SIZE_ERROR}</p><fieldset class="room-chips"><legend>Rooms and partitions</legend>${[1, 2, 3, 4, 5, 6].map((count) => radio('rooms', String(count), count === 1 ? '1 room, no partition' : `${count} rooms, ${count - 1} partitions`, config.rooms === count, '', ' data-room-count')).join('')}</fieldset><div class="room-lengths" data-room-lengths>${Array.from({ length: config.rooms }, (unused, index) => `<label>Room ${index + 1} length in ft<input type="number" inputmode="decimal" min="0" max="60" step="any" name="roomLengths[${index}]" value="${(drawGeometry(config).roomLengths[index] || 0).toFixed(1)}" data-room-length="${index}"></label>`).join('')}<button type="button" data-action="distribute-rooms" class="ghost">Distribute equally</button></div><fieldset><legend>Partition doors</legend>${[0, 1, 2, 3, 4, 5].slice(0, Math.max(1, config.rooms)).map((count) => radio('partitionDoors', String(count), count === 0 ? 'No partition door' : `${count} partition door${count > 1 ? 's' : ''}`, config.partitionDoors === count, count === 0 ? 'Included' : `${money(RATE_CARD.marketRates.steelDoor)} each, ex-GST`, ` data-rate="${count === 0 ? 0 : RATE_CARD.marketRates.steelDoor * count}" data-rate-basis="each" data-line-label="${count} partition door${count > 1 ? 's' : ''}"`)).join('')}</fieldset>${renderDrawing(config, basePriceForDrawing)}`;
  // Roof and mobility used to sit in the structure step. That step is gone, so
  // they move here, next to the other size and form decisions.
  const roofAndMobility = colony ? '' : `<fieldset><legend>Roof</legend>${radio('roof', 'Sloped', 'Sloped roof', config.roof === 'Sloped', 'Standard, included', ' data-rate="0" data-rate-basis="percent of base"')}${radio('roof', 'Flat / mono-pitch', 'Flat / mono-pitch roof', config.roof === 'Flat / mono-pitch', '+4% of base price', ' data-rate="4" data-rate-basis="percent of base" data-line-label="Flat / mono-pitch roof"')}</fieldset><fieldset><legend>Mobility</legend>${radio('mobility', '100% movable', '100% movable', config.mobility === '100% movable')}${radio('mobility', 'Fixed / semi-permanent', 'Fixed / semi-permanent', config.mobility === 'Fixed / semi-permanent')}</fieldset>`;
  const sizeStep = section(1, `${renderStepGuidance('size')}${colony ? colonySize : regularSize}${roofAndMobility}<p class="step-tip"><small>${esc(TIPS.customSize)}</small></p>`);

  const structureStep = section(2, `${renderStepGuidance('structure')}<fieldset><legend>Structural frame</legend>${FRAME_OPTIONS.map((opt) => radio('frame', opt.code, opt.label, opt.code === config.frame, opt.percent === 0 ? 'Base construction, included' : `+${opt.percent}% of the base price`, ` data-rate="${opt.percent}" data-rate-basis="percent of base" data-component-code="${esc(opt.code)}" data-line-label="${esc(`${opt.label}, +${opt.percent}%`)}"`)).join('')}</fieldset><fieldset><legend>Wall construction</legend>${WALL_BUILD_OPTIONS.map((opt) => opt.disabled  ? `<label class="calc-choice is-disabled"><input type="radio" name="wallBuild" value="${esc(opt.code)}" disabled><span><strong>${esc(opt.label)}</strong><small>Rate pending</small></span></label>`  : radio('wallBuild', opt.code, opt.label, opt.code === config.wallBuild, 'Base construction, included',      ` data-component-code="${esc(opt.code)}"`)).join('')}${PUF_THICKNESSES.map((thickness) => radio('pufThickness', String(thickness), `PUF panel ${thickness} mm`, config.pufThickness === thickness, thickness === 50 ? 'Standard, included' : `${pufDeltaPerSqft(thickness) > 0 ? '+' : '-'}${money(Math.abs(Math.round(pufDeltaPerSqft(thickness))))} per sq ft of wall and roof`, ` data-rate="${pufDeltaPerSqft(thickness)}" data-rate-basis="per sq ft of wall and roof" data-line-label="${thickness} mm PUF panels"`)).join('')}</fieldset>`);
  const interiorStep = section(3, `${renderStepGuidance('interior')}<fieldset><legend>Internal wall lining, per sq ft of wall</legend>${componentChoices('internalWall', INTERNAL_WALLS, config.internalWall, wallDelta, 'per sq ft of wall', 'Internal wall')}</fieldset><fieldset><legend>Ceiling, per sq ft of floor</legend>${componentChoices('ceilingCode', CEILINGS_R1, config.ceilingCode, ceilingDelta, 'per sq ft', 'Ceiling')}</fieldset><fieldset><legend>Flooring, per sq ft of floor</legend>${componentChoices('flooringCode', FLOORINGS_R1, config.flooringCode, floorDelta, 'per sq ft', 'Flooring')}</fieldset>${renderWallBuildDiagram(config.pufThickness.toString())}<fieldset><legend>Added insulation, per sq ft of wall and ceiling</legend>${radio('insulation', 'none', 'No added insulation', config.insulation === 'none', 'Standard, included', ' data-rate="0"')}${INSULATIONS_R1.map((item) => radio('insulation', item.code, item.label, config.insulation === item.code, `+${money(item.rate || 0)} per sq ft`, ` data-rate="${item.rate || 0}" data-rate-basis="per sq ft of wall and ceiling" data-component-code="${esc(item.code)}" data-line-label="${esc(`Insulation: ${item.label}`)}"`)).join('')}</fieldset>`);

  const doorSlots = Array.from({ length: Math.max(4, config.doors.length) }, (_, index) => config.doors[index] || DEFAULT_CALCULATOR_CONFIG.doors[0]);
  const windowSlots = Array.from({ length: Math.max(4, config.windows.length) }, (_, index) => config.windows[index] || DEFAULT_CALCULATOR_CONFIG.windows[0]);
  const doorCards = doorSlots.map((door, index) => renderDoorCard(door, index, index >= config.doors.length)).join('');
  const windowCards = windowSlots.map((window, index) => renderWindowCard(window, index, index >= config.windows.length)).join('');
  const socketRoomChips = ROOM_TYPES.map((room, index) => radio('socketRoom', String(index), room, index === 0, '', ' data-socket-room')).join('');
  const socketPanels = ROOM_TYPES.map((room, index) => `<div class="socket-panel" data-socket-panel="${index}"${index === 0 ? '' : ' hidden'}><div class="socket-walls">${WALLS.map((wall) => socketWallRow(esc(room.toLowerCase()), wall)).join('')}</div></div>`).join('');
  const openingsStep = section(4, `${renderStepGuidance('openings')}${colony ? `<p class="scope-note">${SCOPE_NOTE}</p>` : `<div class="op-left"><h3>Door placement</h3><div class="op-cards">${doorCards}</div><button type="button" data-action="add-door" class="ghost">Add another door</button><h3>Window placement</h3><div class="op-cards">${windowCards}</div><button type="button" data-action="add-window" class="ghost">Add another window</button><p class="step-tip"><small>${esc(TIPS.doorOpening)}</small></p><p class="step-tip"><small>${esc(TIPS.windowTrack)}</small></p></div><div class="op-right">${renderDrawing(config, basePriceForDrawing)}</div>`}`);
  const electricalStep = section(5, `${renderStepGuidance('electrical')}${colony ? '<p class="scope-note">Quantities are quotation items per building.</p>' : ''}<div class="ec-left"><div class="ec-cards">${ELECTRICAL_R1.map((item) => electricalCard(item, config.electrical[item.label] || 0, colony)).join('')}</div><div class="ec-chip-groups"><fieldset><legend>Light colour</legend>${radio('lightColour', 'White', 'White light', config.lightColour === 'White')}${radio('lightColour', 'Warm', 'Warm light', config.lightColour === 'Warm')}</fieldset><fieldset><legend>LED shape</legend>${radio('lightShape', 'Square', 'Square fitting', config.lightShape === 'Square')}${radio('lightShape', 'Round', 'Round fitting', config.lightShape === 'Round')}</fieldset></div></div><div class="ec-right"><fieldset class="socket-rooms"><legend>Socket placement, no cost impact</legend>${socketRoomChips}</fieldset><p class="step-tip"><small>${esc(TIPS.socketPlacement)}</small></p>${socketPanels}${renderDrawing(config, basePriceForDrawing)}</div>`);
  const addOnsStep = section(6, `${renderStepGuidance('addons')}${FITOUT_R1.map((item) => quantityRow('addOns', item.label, item.rate || 0, config.addOns[item.label] || 0, item.specification || '', colony)).join('')}<p class="step-tip"><small>Some fit-out components are being confirmed and show as Quoted separately.</small></p><fieldset><legend>Furniture position</legend>${radio('furniturePosition', 'Wall attached', 'Wall attached', config.furniturePosition === 'Wall attached')}${radio('furniturePosition', 'Centre', 'Centre', config.furniturePosition === 'Centre')}</fieldset>`);
  const deliveryCommitment = options.suppressCommitmentCopy ? 'Freight is confirmed once the exact delivery location and order are approved.' : 'Delivery in 7 to 21 working days. Freight is confirmed once the exact delivery location and order are approved.';
  const quotationCommitment = options.suppressCommitmentCopy ? 'Submit the exact configuration for an itemised quotation.' : 'Submit the exact configuration for an itemised quotation. Custom quote target: 48 business hours.';
  const freightControls = options.quoteFreightOutsideFreeZones
    ? '<p>Delivery is free within Bangalore city and Delhi NCR. Freight for every other destination is quoted separately.</p>'
    : `<label>Road distance in km<input type="number" inputmode="numeric" min="0" max="5000" step="1" name="distanceKm" value="${config.distanceKm}"></label><details class="freight-ladder"><summary>See the full distance ladder</summary>${renderFreightTable()}</details>`;
  const deliveryStep = section(7, `${renderStepGuidance('delivery')}<fieldset><legend>Delivery scope</legend>${(['Bangalore city', 'Delhi NCR', 'Other'] as const).map((zone) => radio('deliveryZone', zone, zone, config.deliveryZone === zone, zone === 'Other' ? (options.quoteFreightOutsideFreeZones ? 'Quoted separately' : 'Use the freight ladder below') : 'Free delivery zone', ` data-freight-zone="${esc(zone)}" data-price="${zone === 'Other' ? '' : '0'}"`)).join('')}</fieldset>${freightControls}<label class="checkbox"><input type="checkbox" name="installation" value="1"${checked(config.installation)}>Installation required, confirmed in fixed quotation</label><label class="checkbox"><input type="checkbox" name="includeGst" value="1"${checked(config.includeGst)}>Show GST as a line item in the estimate</label><p>${deliveryCommitment}</p>`);
  const quotationStep = section(8, `${renderStepGuidance('quotation')}<p>${quotationCommitment}</p>${renderEstimate(estimate)}<fieldset><legend>Your contact details</legend><label>${esc(FIELD_LABELS.firstName)} *<input name="firstName" autocomplete="given-name" value="${esc(config.quote.firstName)}" required></label><label>${esc(FIELD_LABELS.lastName)} *<input name="lastName" autocomplete="family-name" value="${esc(config.quote.lastName)}" required></label><label>${esc(FIELD_LABELS.phone)} *<input type="tel" inputmode="numeric" name="phone" autocomplete="tel" pattern="[6-9][0-9]{9}" value="${esc(config.quote.phone)}" required aria-describedby="mobile-error"></label><small id="mobile-error">Enter a 10-digit Indian mobile number.</small><label>${esc(FIELD_LABELS.email)} *<input type="email" inputmode="email" name="email" autocomplete="email" value="${esc(config.quote.email)}" required aria-describedby="email-error"></label><small id="email-error">Please add your email so we can send your quotation PDF.</small><label>${esc(FIELD_LABELS.companyName)}<input name="company" autocomplete="organization" value="${esc(config.quote.company)}"></label><label>${esc(FIELD_LABELS.city)}<input name="city" autocomplete="address-level2" value="${esc(config.quote.city)}"></label><label>${esc(FIELD_LABELS.state)}<input name="state" autocomplete="address-level1" value="${esc(config.quote.state)}"></label><label>${esc(FIELD_LABELS.notes)}<textarea name="notes" rows="4">${esc(config.quote.notes)}</textarea></label></fieldset><input type="hidden" name="configuration" value="${esc(JSON.stringify(config))}"><input type="hidden" name="estimate" value="${esc(JSON.stringify(estimate))}"><button type="submit">${esc(CONTROLS.getQuotation)}</button><p class="required-guidance">Please add your name and mobile number so our sales team can send your fixed quotation.</p>`);

  const allSections = [productStep, sizeStep, structureStep, interiorStep, openingsStep, electricalStep, addOnsStep, deliveryStep, quotationStep];
  const renderedSections = allSections;
  const reference = options.reference || 'SP-EST';
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const pageUrl = options.pageUrl || '/cabin-cost-calculator';
  const itemisedMessage = `SAMAN ${product.name} configuration | ${estimate.lines.map((line) => `${line.label}: ${line.amount === null ? 'in quotation' : money(line.amount)}`).join(' | ')} | Total: ${estimate.quoteOnly ? 'price on request' : `${money(estimate.totalExGst)} ex-GST`}`;
  const messageCatalog = `<style>${CABIN_CALCULATOR_SCOPED_STYLES}</style>${Object.entries(CALCULATOR_MESSAGES).map(([key, value]) => `<p hidden data-message="${key}">${esc(value)}</p>`).join('')}`;
  // SAMAN's base-cabin rate card, published once on the root so the browser
  // prices from the same numbers the server did. The six area-band multipliers
  // that used to sit here are gone with the formula they belonged to.
  let rootRates = `data-base-fixed="${esc(BASE_CABIN_RATE_CARD_DATASET.fixed)}" data-base-bands="${esc(BASE_CABIN_RATE_CARD_DATASET.bands)}" data-base-band-top="${esc(BASE_CABIN_RATE_CARD_DATASET.top)}" data-base-slide="${esc(BASE_CABIN_RATE_CARD_DATASET.slide)}" data-base-cap="${esc(BASE_CABIN_RATE_CARD_DATASET.cap)}" data-base-unrated-ceiling="${esc(BASE_CABIN_RATE_CARD_DATASET.floor)}" data-height-rate-per-foot="0.06" data-partition-rate="300" data-gst-rate="${GST_RATE}"`;
  if (!options.quoteFreightOutsideFreeZones) {
    rootRates += ` data-freight-bands="${RATE_CARD.freight.bands20ft.join(',')}" data-freight40-delta="${RATE_CARD.freight.trailer40ftDelta}"`;
  }
  if (usesPc01SelectedVariantPriceBase(config)) {
    const includedWindows = DEFAULT_CALCULATOR_CONFIG.windows
      .map((window, index) => [index, window.type, window.width, window.height, window.track].join('|'))
      .join(';');
    rootRates += ` data-selected-variant-price-base="true" data-published-base-included-windows="${esc(includedWindows)}"`;
  }
  if (options.deferEnhancement) rootRates += ' data-defer-enhancement="true"';
  if (options.quoteFreightOutsideFreeZones) rootRates += ' data-quote-freight-outside-free-zones="true"';
  const hiddenProduct = embedded ? `<input type="hidden" name="productId" value="${config.productId}" data-label="${esc(product.name)}" data-quote-only="${rendersQuoteMode(product, config.ladderKey) ? 'true' : 'false'}" data-ladder="${esc(config.ladderKey || product.ladderKey || (isColonyProduct(product.id) ? product.id : 'none'))}">` : '';
  const standardPostFields = `${hiddenProduct}<input type="hidden" name="message" value="${esc(itemisedMessage)}"><input type="hidden" name="productName" value="${esc(product.name)}"><input type="hidden" name="pageUrl" value="${esc(pageUrl)}"><input type="hidden" name="returnTo" value="${esc(pageUrl)}">`;
  const statusText = options.submissionStatus === 'success' ? CALCULATOR_MESSAGES.submitSuccess : options.submissionStatus === 'failure' ? CALCULATOR_MESSAGES.submitFailure : '';
  const tableProducts = embedded ? [product] : PRODUCTS;
  const summarySize = colony ? `${esc(colonyLadder(config.productId)[config.colonyVariant]?.label || '')} · quantity ${config.quantity}` : `${config.length}×${config.width} ft · ${estimate.areaSqft.toLocaleString('en-IN')} sq ft`;
  const generalDisclosure = documentProductMode === 'general'
    ? `<small data-general-estimate-disclosure>${esc(GENERAL_ESTIMATE_DISCLOSURE)}</small>`
    : '';
  const summaryIncl = estimate.quoteOnly
    ? (options.suppressCommitmentCopy ? 'Confirmed in quotation' : 'Custom quote target: 48 business hours')
    : `${money(estimate.totalInclGst)} incl. GST`;
  const printFooter = options.suppressCommitmentCopy
    ? `Indicative estimate ${esc(reference)} · ${esc(date)} · Itemised quotation confirmed after submission.`
    : `Indicative estimate ${esc(reference)} · ${esc(date)} · Custom quote target: 48 business hours after submission.`;
  const noscriptContent = options.quoteFreightOutsideFreeZones
    ? '<noscript><section class="noscript-content"><h2>Complete published pricing and enquiry</h2><p>All calculator steps, options, published prices, approved delivery-zone terms and the working quotation form are shown above. Use the native controls and submit the form to request your quotation.</p></section></noscript>'
    : '<noscript><section class="noscript-content"><h2>Complete published pricing and enquiry</h2><p>All calculator steps, options, published prices, freight rates and the working quotation form are shown above. Use the native controls and submit the form to request your quotation.</p></section></noscript>';
  return `<section class="cabin-calculator-ssr" data-cabin-calculator data-mode="${embedded ? 'embedded' : 'standalone'}" data-theme="light" data-document-product-mode="${documentProductMode}" data-initial-document-product-mode="${documentProductMode}" data-product-slug="${esc(options.productSlug || (config.productId === 'labour-colony' ? 'labor-colony' : config.productId))}" data-reference="${esc(reference)}" ${rootRates}>${messageCatalog}<p class="calculator-status" data-calculator-notice role="status"${statusText ? '' : ' hidden'}>${esc(statusText)}</p><p class="calculator-status" data-restore-banner role="status" hidden>${esc(CALCULATOR_MESSAGES.restored)}</p><input type="text" data-share-url value="${esc(pageUrl)}" readonly hidden>${includeCopy ? renderIntro() : ''}<div class="print-letterhead"><strong>SAMAN POS India Private Limited · SAMAN Portable</strong><span>Founded 2009 · Incorporated 2019 · ISO 9001:2015</span><span>Bengaluru (Unit 1): +91 88616 22859 · sales@samanportable.com</span><span>Greater Noida (Unit 2): +91 87960 39938 · ncr@samanportable.com</span><span>www.samanportable.com</span></div><header class="calculator-header"><div><p>Customized cabin</p><h2 data-summary-product>${esc(options.productName || product.name)}</h2><p data-summary-size>${summarySize}</p></div><div><p data-summary-label>Estimated total</p><p><strong data-summary-ex>${estimate.quoteOnly ? 'Price on request' : money(estimate.totalExGst)}</strong><small data-summary-incl>${summaryIncl}</small>${generalDisclosure}</p></div><div class="calculator-header-actions"><button type="button" data-action="save">${esc(CONTROLS.saveDesign)}</button><button type="button" data-action="restore">${esc(CONTROLS.restoreDesign)}</button><button type="button" data-action="start-over">${esc(CONTROLS.startOver)}</button></div><nav class="step-nav" aria-label="Calculator steps">${visibleSteps.map(([name], index) => `<a href="#calculator-step-${index + 1}" data-step-link="${index + 1}">${esc(name)}</a>`).join('')}</nav></header><form method="post" action="${esc(options.formAction || '/api/enquiry')}" enctype="application/x-www-form-urlencoded" data-enhanced-action="/api/enquiry" data-calculator-form>${standardPostFields}<div class="calculator-grid"><div class="step-card"><p class="step-counter" data-step-counter>Step <span data-step-current>1</span> of ${visibleSteps.length}</p><div class="step-progress" role="progressbar" aria-label="Calculator progress" aria-valuemin="1" aria-valuemax="9" aria-valuenow="1" data-step-progress><span data-step-progress-fill style="width:${Math.round(100 / 9)}%"></span></div>${renderedSections.join('')}<div class="estimate-actions"><button type="button" data-action="pdf" class="ghost">${esc(CONTROLS.downloadPdf)}</button><button type="button" data-action="whatsapp" class="ghost">${esc(CONTROLS.sendWhatsApp)}</button><button type="button" data-action="copy-link" class="ghost">${esc(CONTROLS.copyLink)}</button></div></div><div class="calculator-side">${renderEstimate(estimate)}<div class="step-actions"><button type="button" data-action="back" class="ghost">${esc(CONTROLS.back)}</button><button type="button" data-action="start-over" class="ghost">${esc(CONTROLS.startOver)}</button><button type="button" data-action="next" class="primary">${esc(CONTROLS.next)}</button></div></div></div></form><div class="mobile-estimate"><a href="#calculator-step-9"><span>Total, ex-GST</span><strong data-mobile-estimate>${estimate.quoteOnly ? 'On request' : money(estimate.totalExGst)}</strong><span>Expand estimate</span></a></div>${options.hidePublishedPriceTable ? '' : renderPriceTables(tableProducts, config.ladderKey)}${noscriptContent}<footer class="print-footer">${printFooter}</footer></section>`;
}
