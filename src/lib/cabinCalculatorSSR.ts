import {
  GST_RATE,
  PRODUCT_LADDERS,
  RATE_CARD,
  calculateAreaBandBase,
} from '@/lib/calculatorRates';
import { getRouteLadder, ladderAnchorRate, ladderPriceFor } from '@/lib/calculatorLadders';
import {
  CEILINGS_R1, ELECTRICAL_R1, FITOUT_R1, FLOORINGS_R1, FRAME_OPTIONS,
  INSULATIONS_R1, INTERIOR_STANDARD, INTERNAL_WALLS, WALL_BUILD_OPTIONS,
  ceilingDelta, floorDelta, insulationRate, pufDeltaPerSqft, wallDelta,
} from '@/lib/calculatorComponentRates';
import {
  CONSTRUCTION_DISCLOSURE, CONTROLS, ESTIMATE_PANEL, FIELD_LABELS,
  PRODUCT_STEP, QUOTE_MODE, STEP_COPY, TIPS,
} from '@/lib/calculatorCopy';

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
  | 'prefab-labor-camps';

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
  planView: 'plan' | 'elevations';
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
  referenceRate?: number;
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
}

export interface EmbeddedProductSummary {
  name: string;
  sizeLabel: string | null;
  price: number | null;
  priceLabel: string;
}

export const PRODUCTS: readonly ProductDefinition[] = [
  { id: 'porta-cabin', name: 'Porta Cabin', subtitle: 'All-purpose modular cabin', referenceRate: 1250, ladderKey: 'porta-cabins' },
  { id: 'office-cabin', name: 'Portable Office', subtitle: 'Furnished workspace cabin', referenceRate: 1350, ladderKey: 'portable-office' },
  { id: 'security-cabin', name: 'Security Cabin', subtitle: 'Guard booth / gate post', referenceRate: 1250 },
  { id: 'toilet-cabin', name: 'Toilet Cabin', subtitle: 'Portable washroom block', quoteOnly: true, ladderKey: 'porta-cabin-with-toilet' },
  { id: 'accommodation-cabin', name: 'Accommodation Cabin', subtitle: 'Bunkhouse / staff stay', referenceRate: 1450 },
  { id: 'container-office', name: 'Container Office', subtitle: 'Insulated container workspace', referenceRate: 1800, ladderKey: 'container-offices' },
  { id: 'site-office', name: 'Site Office', subtitle: 'On-site project office', referenceRate: 1450, ladderKey: 'site-office-container' },
  { id: 'portable-cabin', name: 'Portable Cabin', subtitle: 'General-purpose portable cabin', referenceRate: 1250, ladderKey: 'portable-cabin' },
  { id: 'container-houses', name: 'Container House', subtitle: 'Standard container home', ladderKey: 'container-houses' },
  { id: 'prefab-container-homes', name: 'Prefab Container Home', subtitle: 'Prefab home specification', ladderKey: 'prefab-container-homes' },
  { id: 'shipping-container-homes', name: 'Shipping Container Home', subtitle: 'Shipping-grade shell', ladderKey: 'shipping-container-homes' },
  { id: 'affordable-container-homes', name: 'Affordable Container Home', subtitle: 'Lowest-rate home ladder', ladderKey: 'affordable-container-homes' },
  { id: 'luxury-container-houses', name: 'Luxury Container House', subtitle: 'Highest-rate luxury ladder', ladderKey: 'luxury-container-houses' },
  { id: 'prefab-modular-home', name: 'Prefab Modular Home', subtitle: 'Turnkey modular living space', referenceRate: 1650 },
  { id: 'container-cafe', name: 'Container Cafe', subtitle: 'Cafe and restaurant unit', referenceRate: 1850 },
  { id: 'labour-colony', name: 'Labour Colony', subtitle: 'Worker housing blocks' },
  { id: 'labor-sheds', name: 'Labour Sheds', subtitle: 'Open-hall worker dormitories' },
  { id: 'labor-hutments', name: 'Labour Hutments', subtitle: 'Room-based worker housing' },
  { id: 'prefab-labor-camps', name: 'Prefab Labour Camps', subtitle: 'Relocatable worker camp blocks' },
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
export const ELECTRICAL = [
  ['LED Panel Light', RATE_CARD.marketRates.ledPanel, 'Suggested: one per 40 sq ft'],
  ['Tube Light', RATE_CARD.marketRates.tubeLight, ''],
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
const SIZE_ERROR = 'Enter a length and width between 6 and 60 ft. For larger buildings, request a quotation and we will size it with you.';

export const CALCULATOR_MESSAGES = {
  sizeInvalid: SIZE_ERROR,
  requiredFields: 'Please add your name and mobile number so our sales team can send your fixed quotation.',
  mobileInvalid: 'Enter a 10-digit Indian mobile number.',
  emailRequired: 'Please add your email so we can send your quotation PDF.',
  saved: 'Design saved on this device.',
  restored: 'Your saved design has been restored. Start over to begin fresh.',
  linkCopied: 'Link copied. Anyone who opens it sees this exact configuration.',
  submitSuccess: 'Configuration received. Our sales team will send your fixed, itemised quotation within 48 hours.',
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

.cabin-calculator-ssr label:not(.calc-choice):not(.quantity-row){
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
@media(max-width:1023.98px){.cabin-calculator-ssr .calculator-grid>.estimate-card{display:none}}

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
.cabin-calculator-ssr .calculator-grid>.estimate-card{width:340px;padding:20px;border-radius:16px}
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
.cabin-calculator-ssr{--sd-ground:#0D1F17;--sd-panel:#14301F;--sd-card:#14291E;--sd-inset:#0F241A;--sd-hairline:rgba(255,255,255,0.07);--sd-hairline-hi:rgba(255,255,255,0.18);--sd-control-border:rgba(255,255,255,0.36);--sd-lift:rgba(255,255,255,0.06);--sd-text:#F0F7F2;--sd-text-2:rgba(240,247,242,0.62);--sd-text-3:rgba(240,247,242,0.45);--saman-amber:#E0A340}
.cabin-calculator-ssr,.cabin-calculator-ssr[data-theme="light"],.cabin-calculator-ssr[data-theme="green"]{background:var(--sd-ground);color:var(--sd-text);border-radius:20px;margin-top:24px;margin-bottom:24px;padding-top:28px;padding-bottom:28px}
.cabin-calculator-ssr .calculator-header{background:linear-gradient(135deg,#1A3C2E,#14302A);border:1px solid var(--sd-hairline);border-radius:16px}
.cabin-calculator-ssr .step-card,.cabin-calculator-ssr .calculator-grid>.estimate-card{background:var(--sd-panel);border:1px solid var(--sd-hairline);border-radius:16px;padding:20px}
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
.cabin-calculator-ssr .step-nav a.is-active,.cabin-calculator-ssr .step-nav a[aria-current="step"],.cabin-calculator-ssr[data-theme="light"] .calculator-header .step-nav a.is-active,.cabin-calculator-ssr[data-theme="green"] .calculator-header .step-nav a.is-active,.cabin-calculator-ssr[data-theme="light"] .calculator-header .step-nav a[aria-current="step"],.cabin-calculator-ssr[data-theme="green"] .calculator-header .step-nav a[aria-current="step"]{background:var(--saman-amber);color:#0D1F17;font-weight:600}
.cabin-calculator-ssr button.primary,.cabin-calculator-ssr [type="submit"]{background:var(--saman-amber);color:#0D1F17;border:none;border-radius:8px;height:46px;min-height:46px;font-weight:700}
.cabin-calculator-ssr button.ghost,.cabin-calculator-ssr .calculator-header-actions button{background:transparent;border:1px solid var(--sd-control-border);color:var(--sd-text);border-radius:8px}
.cabin-calculator-ssr .calculator-header-actions button{border-radius:9999px}
.cabin-calculator-ssr input,.cabin-calculator-ssr select,.cabin-calculator-ssr textarea{background:var(--sd-inset);border:1px solid var(--sd-control-border);color:var(--sd-text);border-radius:8px}
.cabin-calculator-ssr .step-progress{background:rgba(255,255,255,.08)}
.cabin-calculator-ssr .step-progress>span{background:var(--saman-amber)}
.cabin-calculator-ssr .step-actions{border-top:1px solid var(--sd-hairline)}
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
.cabin-calculator-ssr #calculator-step-7 > .quantity-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 50px;
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
  width: 100%;
  padding: 2px 4px;
  text-align: center;
}

}
`;

export const DEFAULT_CALCULATOR_CONFIG: CalculatorConfig = {
  productId: 'porta-cabin',
  length: 20,
  width: 10,
  height: 8.5,
  quantity: 1,
  planView: 'plan',
  rooms: 1,
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
  electrical: { 'LED Panel Light': 5, 'Ceiling Fan': 2, 'Plug Point': 4, 'External / Entrance Light': 1 },
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

function cleanQuantities(value: unknown, allowed: readonly (readonly [string, number, ...unknown[]])[]): QuantityMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  const quantities: QuantityMap = {};
  allowed.forEach(([label]) => {
    const quantity = int(source[label], 0, 0, 50);
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

function sanitiseConfig(value: unknown): CalculatorConfig {
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
    planView: member(source.planView, ['plan', 'elevations'] as const, 'plan'),
    rooms: int(source.rooms, 1, 1, 12),
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
    electrical: cleanQuantities(source.electrical, ELECTRICAL),
    lightColour: member(source.lightColour, ['White', 'Warm'] as const, 'White'),
    lightShape: member(source.lightShape, ['Square', 'Round'] as const, 'Square'),
    addOns: cleanQuantities(source.addOns, ADD_ONS),
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
  const zone = one(query.deliveryZone);
  if (zone) direct.deliveryZone = zone as CalculatorConfig['deliveryZone'];
  const includeGst = one(query.includeGst);
  if (includeGst !== undefined) direct.includeGst = includeGst === '1' || includeGst.toLowerCase() === 'true';
  return sanitiseConfig(direct);
}

/**
 * Rate published to the client enhancer for custom sizes. Taken from the
 * route's own ladder so the browser can never derive a figure from a rate the
 * page does not publish.
 */
function effectiveReferenceRate(product: ProductDefinition, ladderKey?: string | null): number {
  return ladderAnchorRate(ladderKey ?? product.ladderKey) ?? 0;
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

function calculateBase(config: CalculatorConfig, area: number): number | null {
  if (isColonyProduct(config.productId)) {
    return (colonyLadder(config.productId)[config.colonyVariant]?.priceExGst || 0) * config.quantity;
  }
  const key = ladderKeyFor(config);

  // A published size is a lookup and is never recalculated.
  const published = ladderPriceFor(key, config.length, config.width);
  if (published !== null) return published * config.quantity;

  // A size this route does not publish is derived from this route's own anchor
  // rate. A route with no ladder at all returns null and renders quote mode.
  const rate = ladderAnchorRate(key);
  if (rate === null) return null;
  return calculateAreaBandBase(area, rate) * config.quantity;
}

export function computeCalculatorEstimate(input: CalculatorConfig): CalculatorEstimate {
  const config = sanitiseConfig(input);
  const colony = isColonyProduct(config.productId);
  const product = productFor(config.productId);
  const area = colony ? (colonyLadder(config.productId)[config.colonyVariant]?.areaSqft || 0) : config.length * config.width;
  const basePrice = calculateBase(config, area);
  const lines: EstimateLine[] = [{
    label: basePrice === null ? `${product.name} base` : colony ? `${colonyLadder(config.productId)[config.colonyVariant]?.label || 'Colony block'} × ${config.quantity}` : `Base cabin ${config.length}×${config.width} ft${config.quantity > 1 ? ` × ${config.quantity}` : ''}`,
    amount: basePrice,
    source: basePrice === null ? 'quotation' : 'published',
  }];
  let total = basePrice || 0;
  const addLine = (label: string, amount: number | null, source: EstimateLine['source']) => { lines.push({ label, amount, source }); if (amount !== null) total += amount; };
  if (!colony && basePrice !== null) {
    if (config.height > 8.5) addLine(`Height ${config.height} ft`, Math.round((basePrice / config.quantity) * 0.06 * (config.height - 8.5)) * config.quantity, 'market');
    if (config.roof === 'Flat / mono-pitch') addLine('Flat / mono-pitch roof', Math.round(basePrice * 0.04), 'market');
    const frame = FRAME_OPTIONS.find((o) => o.code === config.frame);
    if (frame && frame.percent) {
      addLine(`${frame.label}, +${frame.percent}%`, Math.round(basePrice * (frame.percent / 100)), 'published');
    }
    if (config.rooms > 1) addLine(`${config.rooms} rooms, ${config.rooms - 1} partitions`, Math.round((config.rooms - 1) * config.width * 8.5 * 300 * config.quantity), 'market');
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
      addLine(`${label}: ${name}`, Math.round(rate * surfaceArea * config.quantity), 'published');
    });
    if (config.insulation !== 'none') {
      const rate = insulationRate(config.insulation);
      const name = INSULATIONS_R1.find((o) => o.code === config.insulation)?.label || config.insulation;
      if (rate) addLine(`Insulation: ${name}`, Math.round(rate * (wallArea + area) * config.quantity), 'published');
    }
    const thicknessRate = pufDeltaPerSqft(config.pufThickness);
    if (thicknessRate) addLine(`${config.pufThickness} mm PUF panels`, Math.round(thicknessRate * (wallArea + area) * config.quantity), 'published');
    config.doors.forEach((door, index) => {
      if (index === 0 && door.type === 'Steel door') return;
      addLine(`Door ${index + 1}: ${door.type}`, (door.type === 'Steel door' ? RATE_CARD.marketRates.steelDoor : RATE_CARD.marketRates.upvcGlassDoor) * config.quantity, 'market');
    });
    config.windows.forEach((window, index) => addLine(`Window ${index + 1}: ${window.type} ${window.width}×${window.height} ft`, Math.round(WINDOW_RATES[window.type] * window.width * window.height * (window.track === '2.5 Track' ? 1.12 : 1) * config.quantity), 'market'));
  }
  ELECTRICAL_R1.forEach((item) => {
    const quantity = config.electrical[item.label] || 0;
    if (!quantity) return;
    addLine(`${quantity} × ${item.label}`, colony ? null : (item.rate || 0) * quantity * config.quantity, colony ? 'quotation' : 'published');
  });
  FITOUT_R1.forEach((item) => {
    const quantity = config.addOns[item.label] || 0;
    if (!quantity) return;
    addLine(`${quantity} × ${item.label}`, colony ? null : (item.rate || 0) * quantity * config.quantity, colony ? 'quotation' : 'published');
  });
  let transportNote = '';
  if (config.deliveryZone === 'Bangalore city' || config.deliveryZone === 'Delhi NCR') transportNote = 'Free delivery zone';
  else if (config.distanceKm > 0 && config.distanceKm < 100) transportNote = 'Under 100 km: confirmed at quotation';
  else if (config.distanceKm >= 100) {
    const bandIndex = Math.min(RATE_CARD.freight.bands20ft.length - 1, Math.max(0, Math.ceil((config.distanceKm - 100) / 50) - 1));
    addLine(`Transport ${config.distanceKm} km`, (RATE_CARD.freight.bands20ft[bandIndex] + (config.length > 20 || colony ? RATE_CARD.freight.trailer40ftDelta : 0)) * config.quantity, 'published');
  }
  // IN-01 is on the hold list and the workbook records only "Depends upon
  // location". It carries no figure and says so.
  if (config.installation) addLine('Installation and fixing (IN-01)', null, 'quotation');
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
  return `<label class="calc-choice"><input type="radio" name="${esc(name)}" value="${esc(entry.id)}"${checked(isChecked)} data-product-choice="1"><span>${productIcon(entry.id as ProductId)}<strong class="choice-title">${esc(entry.name)}</strong>${entry.description ? `<small class="choice-description">${esc(entry.description)}</small>` : ''}<small class="choice-price">${esc(price)}</small>${entry.platform ? `<span class="choice-platform">${esc(entry.platform)}</span>` : ''}</span></label>`;
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
  suffix: string
): string {
  return list.map((item) => {
    const rate = delta(item.code);
    const detail = rate === 0
      ? 'Standard, included'
      : `${rate > 0 ? '+' : '-'}${money(Math.abs(Math.round(rate)))} ${suffix}`;
    return radio(name, item.code, item.label, item.code === current, detail,
      ` data-rate="${rate}" data-rate-basis="${esc(suffix)}" data-component-code="${esc(item.code)}"`);
  }).join('');
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
  return `<label class="quantity-row"><span><strong>${esc(label)}</strong>${help ? `<small>${esc(help)}</small>` : ''}<small>${quotation ? 'In quotation per building' : `${money(rate)} each, ex-GST`}</small></span><input type="number" inputmode="numeric" min="0" max="50" step="1"${group === 'electrical' ? ` data-electrical-item="${esc(label)}"` : ''} name="${group}[${esc(label)}]" value="${quantity}" aria-label="${esc(label)} quantity" data-rate="${rate}" data-rate-basis="each" data-rate-group="${group}"></label>`;
}

function renderPlan(config: CalculatorConfig): string {
  const width = 320, height = 190, pad = 30;
  const scale = Math.min((width - pad * 2) / Math.max(6, config.length), (height - pad * 2) / Math.max(6, config.width));
  const planWidth = config.length * scale, planHeight = config.width * scale;
  const x = (width - planWidth) / 2, y = (height - planHeight) / 2;
  const wallPoint = (wall: Wall, position: number): [number, number] => {
    const ratio = position / 100;
    if (wall === 'Front') return [x + planWidth * ratio, y + planHeight];
    if (wall === 'Rear') return [x + planWidth * ratio, y];
    if (wall === 'Left') return [x, y + planHeight * ratio];
    return [x + planWidth, y + planHeight * ratio];
  };
  const partitions = Array.from({ length: Math.max(0, config.rooms - 1) }, (_, index) => `<line x1="${x + planWidth * (index + 1) / config.rooms}" y1="${y}" x2="${x + planWidth * (index + 1) / config.rooms}" y2="${y + planHeight}" class="partition"/>`).join('');
  const doors = config.doors.map((door, index) => {
    const [cx, cy] = wallPoint(door.wall, door.position);
    return `<circle data-opening="door" data-opening-index="${index}" data-wall="${door.wall}" data-end="${door.end}" data-distance="${door.distance}" data-index="${index}" cx="${cx}" cy="${cy}" r="5" class="door-mark"><title>Door ${index + 1}</title></circle>`;
  }).join('');
  const windows = config.windows.map((window, index) => {
    const [wx, wy] = wallPoint(window.wall, window.position);
    return `<rect data-opening="window" data-opening-index="${index}" data-wall="${window.wall}" data-end="${window.end}" data-distance="${window.distance}" data-index="${index}" x="${wx - 5}" y="${wy - 3}" width="10" height="6" class="window-mark"><title>Window ${index + 1}</title></rect>`;
  }).join('');
  const elevationLabels = WALLS.map((wall, index) => {
    const bx = index % 2 === 0 ? 12 : 168;
    const by = index < 2 ? 16 : 106;
    return `<g><rect x="${bx}" y="${by}" width="140" height="55" class="shell"/><text x="${bx + 70}" y="${by + 70}">${wall} elevation</text></g>`;
  }).join('');
  return `<svg class="floor-plan" viewBox="0 0 320 190" role="img" aria-label="Cabin floor plan and four elevations" data-floor-plan><g data-plan-view="plan"${config.planView === 'plan' ? '' : ' hidden'}><rect x="${x}" y="${y}" width="${planWidth}" height="${planHeight}" class="shell"/>${partitions}${doors}${windows}<text x="160" y="184">Yellow: doors · Blue: windows</text></g><g data-plan-view="elevations"${config.planView === 'elevations' ? '' : ' hidden'}>${elevationLabels}</g></svg>`;
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
  return `<section class="price-tables" aria-labelledby="published-price-tables"><h2 id="published-price-tables">Published cabin price tables</h2><p>All primary prices are ex-GST. Including-GST figures apply 18 percent GST.</p>${products.map((product) => `<details><summary>${esc(product.name)} price table</summary><table data-product-price-table="${product.id}"><caption>${esc(product.name)} published size and price ladder</caption><thead><tr><th scope="col">Size</th><th scope="col">Area</th>${isColonyProduct(product.id) ? '<th scope="col">Workers housed</th>' : ''}<th scope="col">Price ex-GST</th><th scope="col">Including 18% GST</th></tr></thead><tbody>${productPriceRows(product, products.length === 1 ? ladderKey : product.ladderKey).map((row) => `<tr${row.length !== undefined && row.width !== undefined && row.ex !== null ? ` data-published-size data-length="${row.length}" data-width="${row.width}" data-price-ex-gst="${row.ex}"` : ''}><th scope="row">${esc(row.label)}</th><td>${row.area.toLocaleString('en-IN')} sq ft</td>${isColonyProduct(product.id) ? `<td>${esc(row.capacity || '')}</td>` : ''}<td>${row.ex === null ? 'price on request' : money(row.ex)}</td><td>${row.ex === null ? 'itemised in quotation' : money(Math.round(row.ex * (1 + GST_RATE)))}</td></tr>`).join('')}</tbody></table></details>`).join('')}</section>`;
}

function renderFreightTable(): string {
  const rows = RATE_CARD.freight.bands20ft.map((price, index) => `<tr data-freight-band data-min-km="${100 + index * 50}" data-max-km="${150 + index * 50}" data-price-20="${price}" data-price-40="${price + RATE_CARD.freight.trailer40ftDelta}"><th scope="row">${100 + index * 50}-${150 + index * 50} km</th><td>${money(price)}</td><td>${money(price + RATE_CARD.freight.trailer40ftDelta)}</td></tr>`).join('');
  return `<table data-freight-table><caption>Delivery freight ladder, ex-GST</caption><thead><tr><th scope="col">Distance</th><th scope="col">20 ft trailer</th><th scope="col">40 ft trailer</th></tr></thead><tbody><tr><th scope="row">Bangalore city</th><td>Free</td><td>Free</td></tr><tr><th scope="row">Delhi NCR</th><td>Free</td><td>Free</td></tr><tr><th scope="row">Under 100 km</th><td>Confirmed at quotation</td><td>Confirmed at quotation</td></tr>${rows}</tbody></table>`;
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
  return `<section class="calculator-intro" aria-labelledby="calculator-copy-title"><h2 id="calculator-copy-title">What this calculator does</h2><p>This tool builds a live estimate for a SAMAN portable cabin from our published price list. Pick the product, enter any size in feet, choose the structure, finishes, doors, windows, electrical items and add-ons, and the estimate updates line by line as you select. Every base price comes from the same price list our product pages publish, transport follows our freight ladder, and branded third-party items are shown at current vendor rates plus a 5 percent handling margin.</p><p>The figure you see is an indicative ex-factory estimate with GST shown separately. It is not a quotation. When you submit your configuration, our sales team verifies it against your drawing and location and returns a fixed, itemised quotation within 48 hours. Delivery runs 7 to 21 working days across India from our Bengaluru and Greater Noida works.</p></section>`;
}

/** FAQ block. Rendered by the page BELOW the calculator section, not inside it. */
export function renderCalculatorFaq(): string {
  const faqs = [
    ['Is the calculator price final?', 'No. It is an indicative estimate from our published price list. Your fixed quotation arrives within 48 hours and is the figure we stand behind.'],
    ['Can I price a custom size?', 'Yes. Enter any length and width in feet; the price follows the same published formula that sets our standard nine sizes.'],
    ['Does the price include GST and transport?', 'GST at 18 percent is always shown separately. Transport is estimated from our freight ladder by distance and confirmed in the quotation; Bangalore city and Delhi NCR are free-delivery zones.'],
    ['What warranty applies?', '5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation.'],
  ];
  return `<section class="calculator-faq" aria-labelledby="calculator-faq-title"><h2 id="calculator-faq-title">Cabin cost calculator FAQs</h2><dl>${faqs.map(([question, answer]) => `<div><dt>${esc(question)}</dt><dd>${esc(answer)}</dd></div>`).join('')}</dl></section>`;
}

function renderEstimate(estimate: CalculatorEstimate): string {
  const totalWithGST = estimate.quoteOnly
    ? 'Fixed quotation within 48 hours'
    : (estimate.includeGst ? `${money(estimate.totalInclGst)} incl. 18% GST` : 'GST line shown above');
  return `<aside class="estimate-card" aria-label="Live itemised estimate"><h2>${esc(ESTIMATE_PANEL.heading)}</h2><p><span>${esc(ESTIMATE_PANEL.floorArea)}</span> ${estimate.areaSqft.toLocaleString('en-IN')} sq ft</p><dl class="estimate-lines">${estimate.lines.map((line) => `<div><dt>${esc(line.label)}</dt><dd>${line.amount === null ? 'in quotation' : money(line.amount)}</dd></div>`).join('')}${estimate.transportNote ? `<div><dt>Transport</dt><dd>${esc(estimate.transportNote)}</dd></div>` : ''}<div><dt>${esc(ESTIMATE_PANEL.subtotal)}</dt><dd>${estimate.quoteOnly ? 'in quotation' : money(estimate.totalExGst)}</dd></div><div><dt>${esc(ESTIMATE_PANEL.gst)}</dt><dd>${estimate.quoteOnly ? 'in quotation' : money(estimate.gst)}</dd></div></dl><div class="total"><small>${esc(ESTIMATE_PANEL.total)}</small><strong data-estimate-total>${estimate.quoteOnly ? 'Price on request' : money(estimate.totalExGst)}</strong><small>${esc(totalWithGST)}</small></div>${estimate.quoteOnly ? `<p class="quote-mode">${esc(QUOTE_MODE)}</p>` : ''}<p class="estimate-fine-print"><small>${esc(ESTIMATE_PANEL.finePrint)}</small></p></aside>`;
}

function renderDoorCard(door: DoorConfig, index: number, reserved: boolean): string {
  const state = reserved ? ' data-reserved-door hidden disabled' : '';
  return `<fieldset class="opening-card" data-door-index="${index}"${state}><legend>Door ${index + 1}</legend>${radio(`doors[${index}][type]`, 'Steel door', 'Steel door', door.type === 'Steel door', `${index === 0 ? 'Standard included' : `${money(RATE_CARD.marketRates.steelDoor)} each, ex-GST`}`, ` data-rate="${index === 0 ? 0 : RATE_CARD.marketRates.steelDoor}" data-rate-basis="each"`)}${radio(`doors[${index}][type]`, 'Glass / Aluminium / uPVC door', 'Glass / Aluminium / uPVC door', door.type !== 'Steel door', `${money(RATE_CARD.marketRates.upvcGlassDoor)} each, ex-GST`, ` data-rate="${RATE_CARD.marketRates.upvcGlassDoor}" data-rate-basis="each"`)}<label>Wall<select name="doors[${index}][wall]">${WALLS.map((wall) => `<option${selected(door.wall === wall)}>${wall}</option>`).join('')}</select></label><label>End of wall<select name="doors[${index}][end]">${['Left', 'Right'].map((end) => `<option${selected(door.end === end)}>${end}</option>`).join('')}</select></label><label>Distance from selected end (ft)<input type="number" inputmode="numeric" min="0" step="0.5" name="doors[${index}][distance]" value="${door.distance}" aria-label="Door ${index + 1} distance from end"></label><fieldset><legend>Hinge side</legend>${radio(`doors[${index}][hinge]`, 'Left', 'Left-side hinge', door.hinge === 'Left')}${radio(`doors[${index}][hinge]`, 'Right', 'Right-side hinge', door.hinge === 'Right')}</fieldset><fieldset><legend>Opening</legend>${radio(`doors[${index}][opening]`, 'In', 'Opens in', door.opening === 'In')}${radio(`doors[${index}][opening]`, 'Out', 'Opens out', door.opening === 'Out')}</fieldset><small>Use "In" when hand flow should remain inside the room edge. Use "Out" when swing clearance is outside.</small><input type="hidden" name="doors[${index}][position]" aria-label="Door ${index + 1} position along wall" value="${door.position}"></fieldset>`;
}

function renderWindowCard(window: WindowConfig, index: number, reserved: boolean): string {
  const state = reserved ? ' data-reserved-window hidden disabled' : '';
  return `<fieldset class="opening-card" data-window-index="${index}"${state}><legend>Window ${index + 1}</legend><label>Type<select name="windows[${index}][type]">${Object.entries(WINDOW_RATES).map(([name, rate]) => `<option value="${esc(name)}"${selected(name === window.type)} data-rate="${rate}" data-rate-basis="per sq ft">${esc(name)} · ${money(rate)} per sq ft</option>`).join('')}</select></label><label>Wall<select name="windows[${index}][wall]">${WALLS.map((wall) => `<option${selected(window.wall === wall)}>${wall}</option>`).join('')}</select></label><label>End of wall<select name="windows[${index}][end]">${['Left', 'Right'].map((end) => `<option${selected(window.end === end)}>${end}</option>`).join('')}</select></label><label>Distance from selected end (ft)<input type="number" inputmode="numeric" min="0" step="0.5" name="windows[${index}][distance]" value="${window.distance}" aria-label="Window ${index + 1} distance from end"></label><label>Width in ft<input type="number" inputmode="decimal" min="1" max="12" step="0.5" name="windows[${index}][width]" value="${window.width}"></label><label>Height in ft<input type="number" inputmode="decimal" min="1" max="12" step="0.5" name="windows[${index}][height]" value="${window.height}"></label><fieldset><legend>Track</legend>${radio(`windows[${index}][track]`, '2 Track', '2 Track', window.track === '2 Track', 'Standard', ' data-rate-multiplier="1"')}${radio(`windows[${index}][track]`, '2.5 Track', '2.5 Track', window.track === '2.5 Track', '+12%', ' data-rate-multiplier="1.12"')}</fieldset><small>Track choice affects how much frame is needed along the edge.</small><input type="hidden" name="windows[${index}][position]" value="${window.position}"></fieldset>`;
}

export function renderCabinCalculatorSSR(options: RenderCalculatorOptions = {}): string {
  const parsedConfig = sanitiseConfig(options.config || parseCalculatorQuery(options.query));
  const withSlug = options.productSlug
    ? sanitiseConfig({ ...parsedConfig, productId: productIdForSlug(options.productSlug) })
    : parsedConfig;
  // The embedding route's ladder wins over anything supplied in the query, so a
  // page can never be talked into pricing from a different route's ladder.
  const config: CalculatorConfig = options.ladderKey
    ? { ...withSlug, ladderKey: options.ladderKey }
    : withSlug;
  const embedded = options.embedded === true;
  const includeCopy = options.includeCopy ?? !embedded;
  const product = productFor(config.productId);
  const colony = isColonyProduct(config.productId);
  const estimate = computeCalculatorEstimate(config);
  const active = int(options.activeStep, 0, 0, 8);
  // Eight steps standalone, seven embedded. The structure step was removed on
  // 03 Aug 2026 and became a stated-construction disclosure; a step that offers
  // one option is not a step. Headings are the copy pack's, verbatim.
  const stepDefinitions = STEP_COPY.map((step) => [step.heading, step.key] as const);
  // Nine steps on both routes. The embed preselects a product; it does not
  // remove the step that chooses one.
  const visibleSteps = stepDefinitions;
  const section = (index: number, body: string): string => `<section class="calc-step${active === index ? ' is-active' : ''}" id="calculator-step-${index + 1}" data-step="${index + 1}" aria-labelledby="calculator-step-title-${index + 1}"><h2 id="calculator-step-title-${index + 1}">Step ${index + 1} of 9: ${esc(stepDefinitions[index][0])}</h2>${body}</section>`;

  const productStep = section(0, `${renderStepGuidance('product')}<fieldset><legend>Choose your product</legend><div class="product-tiles">${PRODUCT_STEP.map((entry) => productChoice('productId', entry, entry.id === config.productId)).join('')}</div></fieldset>`);

  const selectedColony = colonyLadder(config.productId)[config.colonyVariant];
  const suggestedQuantity = config.workers > 0 && selectedColony?.capacityMax ? Math.ceil(config.workers / selectedColony.capacityMax) : config.quantity;
  const colonySize = `<label>Workers to accommodate<input type="number" inputmode="numeric" min="1" max="100000" name="workers" value="${config.workers || ''}" data-workers></label><p data-worker-suggestion>${config.workers > 0 && selectedColony ? `${selectedColony.label} × ${suggestedQuantity} accommodates at least ${config.workers.toLocaleString('en-IN')} workers.` : 'Enter the worker headcount to see the smallest sufficient configuration and quantity.'}</p><fieldset><legend>Approved building configuration</legend>${colonyLadder(config.productId).map((item, index) => radio('colonyVariant', String(index), `${item.label}, ${item.areaSqft.toLocaleString('en-IN')} sq ft`, index === config.colonyVariant, `${item.capacity || 'Capacity confirmed at quotation'} · ${money(item.priceExGst)} ex-GST`, ` data-price="${item.priceExGst}" data-area="${item.areaSqft}" data-capacity-max="${item.capacityMax || 0}"`)).join('')}</fieldset><label>Building quantity<input type="number" inputmode="numeric" min="1" max="50" name="quantity" value="${config.quantity}"></label>`;
  const regularSize = `<div class="field-grid"><label>Length in ft<input type="number" inputmode="decimal" min="6" max="60" step="0.5" name="length" value="${config.length}" required aria-describedby="size-guidance"></label><label>Width in ft<input type="number" inputmode="decimal" min="6" max="60" step="0.5" name="width" value="${config.width}" required aria-describedby="size-guidance"></label><label>Height in ft<input type="number" inputmode="decimal" min="7" max="16" step="0.5" name="height" value="${config.height}"></label><label>Cabin quantity<input type="number" inputmode="numeric" min="1" max="50" step="1" name="quantity" value="${config.quantity}"></label></div><p id="size-guidance">${SIZE_ERROR}</p><fieldset><legend>Plan view</legend>${radio('planView', 'plan', 'Floor plan', config.planView === 'plan')}${radio('planView', 'elevations', 'Four elevations', config.planView === 'elevations')}</fieldset><label>Rooms<input type="number" inputmode="numeric" min="1" max="12" name="rooms" value="${config.rooms}"></label>${renderPlan(config)}`;
  // Roof and mobility used to sit in the structure step. That step is gone, so
  // they move here, next to the other size and form decisions.
  const roofAndMobility = colony ? '' : `<fieldset><legend>Roof</legend>${radio('roof', 'Sloped', 'Sloped roof', config.roof === 'Sloped', 'Standard, included', ' data-rate="0" data-rate-basis="percent of base"')}${radio('roof', 'Flat / mono-pitch', 'Flat / mono-pitch roof', config.roof === 'Flat / mono-pitch', '+4% of base price', ' data-rate="4" data-rate-basis="percent of base"')}</fieldset><fieldset><legend>Mobility</legend>${radio('mobility', '100% movable', '100% movable', config.mobility === '100% movable')}${radio('mobility', 'Fixed / semi-permanent', 'Fixed / semi-permanent', config.mobility === 'Fixed / semi-permanent')}</fieldset>`;
  const sizeStep = section(1, `${renderStepGuidance('size')}${colony ? colonySize : regularSize}${roofAndMobility}<p class="step-tip"><small>${esc(TIPS.customSize)}</small></p>`);

  const structureStep = section(2, `${renderStepGuidance('structure')}<fieldset><legend>Structural frame</legend>${FRAME_OPTIONS.map((opt) => radio('frame', opt.code, opt.label, opt.code === config.frame, opt.percent === 0 ? 'Base construction, included' : `+${opt.percent}% of the base price`, ` data-rate="${opt.percent}" data-rate-basis="percent of base" data-component-code="${esc(opt.code)}"`)).join('')}</fieldset><fieldset><legend>Wall construction</legend>${WALL_BUILD_OPTIONS.map((opt) => opt.disabled  ? `<label class="calc-choice is-disabled"><input type="radio" name="wallBuild" value="${esc(opt.code)}" disabled><span><strong>${esc(opt.label)}</strong><small>Rate pending</small></span></label>`  : radio('wallBuild', opt.code, opt.label, opt.code === config.wallBuild, 'Base construction, included',      ` data-component-code="${esc(opt.code)}"`)).join('')}${PUF_THICKNESSES.map((thickness) => radio('pufThickness', String(thickness), `PUF panel ${thickness} mm`, config.pufThickness === thickness, thickness === 50 ? 'Standard, included' : `${pufDeltaPerSqft(thickness) > 0 ? '+' : '-'}${money(Math.abs(Math.round(pufDeltaPerSqft(thickness))))} per sq ft of wall and roof`, ` data-rate="${pufDeltaPerSqft(thickness)}" data-rate-basis="per sq ft of wall and roof"`)).join('')}</fieldset>`);
  const interiorStep = section(3, `${renderStepGuidance('interior')}<fieldset><legend>Internal wall lining, per sq ft of wall</legend>${componentChoices('internalWall', INTERNAL_WALLS, config.internalWall, wallDelta, 'per sq ft of wall')}</fieldset><fieldset><legend>Ceiling, per sq ft of floor</legend>${componentChoices('ceilingCode', CEILINGS_R1, config.ceilingCode, ceilingDelta, 'per sq ft')}</fieldset><fieldset><legend>Flooring, per sq ft of floor</legend>${componentChoices('flooringCode', FLOORINGS_R1, config.flooringCode, floorDelta, 'per sq ft')}</fieldset>${renderWallBuildDiagram(config.pufThickness.toString())}<fieldset><legend>Added insulation, per sq ft of wall and ceiling</legend>${radio('insulation', 'none', 'No added insulation', config.insulation === 'none', 'Standard, included', ' data-rate="0"')}${INSULATIONS_R1.map((item) => radio('insulation', item.code, item.label, config.insulation === item.code, `+${money(item.rate || 0)} per sq ft`, ` data-rate="${item.rate || 0}" data-rate-basis="per sq ft of wall and ceiling" data-component-code="${esc(item.code)}"`)).join('')}</fieldset>`);

  const doorSlots = Array.from({ length: Math.max(4, config.doors.length) }, (_, index) => config.doors[index] || DEFAULT_CALCULATOR_CONFIG.doors[0]);
  const windowSlots = Array.from({ length: Math.max(4, config.windows.length) }, (_, index) => config.windows[index] || DEFAULT_CALCULATOR_CONFIG.windows[0]);
  const doorCards = doorSlots.map((door, index) => renderDoorCard(door, index, index >= config.doors.length)).join('');
  const windowCards = windowSlots.map((window, index) => renderWindowCard(window, index, index >= config.windows.length)).join('');
  const socketPlacement = ROOM_TYPES.map((room) => `<fieldset><legend>${esc(room)} socket layout</legend><label>Wall placement<select name="socket-${esc(room.toLowerCase())}-wall">${WALLS.map((wall) => `<option>${wall}</option>`).join('')}</select><label>Front wall count<input type="number" inputmode="numeric" min="0" max="20" name="socket-${esc(room.toLowerCase())}-front" value="0"></label><label>Rear wall count<input type="number" inputmode="numeric" min="0" max="20" name="socket-${esc(room.toLowerCase())}-rear" value="0"></label><label>Left wall count<input type="number" inputmode="numeric" min="0" max="20" name="socket-${esc(room.toLowerCase())}-left" value="0"></label><label>Right wall count<input type="number" inputmode="numeric" min="0" max="20" name="socket-${esc(room.toLowerCase())}-right" value="0"></label></fieldset>`).join('');
  const openingsStep = section(4, `${renderStepGuidance('openings')}${colony ? `<p class="scope-note">${SCOPE_NOTE}</p>` : `${renderPlan(config)}<h3>Door placement</h3>${doorCards}<button type="button" data-action="add-door">Add another door</button><h3>Window placement</h3>${windowCards}<button type="button" data-action="add-window">Add another window</button><p class="step-tip"><small>${esc(TIPS.doorOpening)}</small></p><p class="step-tip"><small>${esc(TIPS.windowTrack)}</small></p>`}`);
  const electricalStep = section(5, `${renderStepGuidance('electrical')}<p>${colony ? 'Quantities are quotation items per building.' : 'Suggested quantities are a starting point and can be changed.'}</p>${ELECTRICAL_R1.map((item) => quantityRow('electrical', item.label, item.rate || 0, config.electrical[item.label] || 0, item.specification || '', colony)).join('')}<fieldset><legend>Light appearance</legend>${radio('lightColour', 'White', 'White light', config.lightColour === 'White')}${radio('lightColour', 'Warm', 'Warm light', config.lightColour === 'Warm')}${radio('lightShape', 'Square', 'Square fitting', config.lightShape === 'Square')}${radio('lightShape', 'Round', 'Round fitting', config.lightShape === 'Round')}</fieldset><fieldset><legend>Socket placement (no cost impact)</legend><p class="step-tip"><small>${esc(TIPS.socketPlacement)}</small></p>${socketPlacement}</fieldset>`);
  const addOnsStep = section(6, `${renderStepGuidance('addons')}${FITOUT_R1.map((item) => quantityRow('addOns', item.label, item.rate || 0, config.addOns[item.label] || 0, item.specification || '', colony)).join('')}<p class="step-tip"><small>Some fit-out components are being confirmed and show as Quoted separately.</small></p><fieldset><legend>Furniture position</legend>${radio('furniturePosition', 'Wall attached', 'Wall attached', config.furniturePosition === 'Wall attached')}${radio('furniturePosition', 'Centre', 'Centre', config.furniturePosition === 'Centre')}</fieldset>`);
  const deliveryStep = section(7, `${renderStepGuidance('delivery')}<fieldset><legend>Delivery scope</legend>${(['Bangalore city', 'Delhi NCR', 'Other'] as const).map((zone) => radio('deliveryZone', zone, zone, config.deliveryZone === zone, zone === 'Other' ? 'Use the freight ladder below' : 'Free delivery zone', ` data-freight-zone="${esc(zone)}" data-price="${zone === 'Other' ? '' : '0'}"`)).join('')}</fieldset><label>Road distance in km<input type="number" inputmode="numeric" min="0" max="5000" step="1" name="distanceKm" value="${config.distanceKm}"></label><label class="checkbox"><input type="checkbox" name="installation" value="1"${checked(config.installation)}>Installation required, confirmed in fixed quotation</label><label class="checkbox"><input type="checkbox" name="includeGst" value="1"${checked(config.includeGst)}>Show GST as a line item in the estimate</label><details class="freight-ladder"><summary>See the full distance ladder</summary>${renderFreightTable()}</details><p>Delivery in 7 to 21 working days. Freight is confirmed once the exact delivery location and order are approved.</p>`);
  const quotationStep = section(8, `${renderStepGuidance('quotation')}<p>Submit the exact configuration for a fixed, itemised quotation within 48 hours.</p>${renderEstimate(estimate)}<fieldset><legend>Your contact details</legend><label>${esc(FIELD_LABELS.firstName)} *<input name="firstName" autocomplete="given-name" value="${esc(config.quote.firstName)}" required></label><label>${esc(FIELD_LABELS.lastName)} *<input name="lastName" autocomplete="family-name" value="${esc(config.quote.lastName)}" required></label><label>${esc(FIELD_LABELS.phone)} *<input type="tel" inputmode="numeric" name="phone" autocomplete="tel" pattern="[6-9][0-9]{9}" value="${esc(config.quote.phone)}" required aria-describedby="mobile-error"></label><small id="mobile-error">Enter a 10-digit Indian mobile number.</small><label>${esc(FIELD_LABELS.email)} *<input type="email" inputmode="email" name="email" autocomplete="email" value="${esc(config.quote.email)}" required aria-describedby="email-error"></label><small id="email-error">Please add your email so we can send your quotation PDF.</small><label>${esc(FIELD_LABELS.companyName)}<input name="company" autocomplete="organization" value="${esc(config.quote.company)}"></label><label>${esc(FIELD_LABELS.city)}<input name="city" autocomplete="address-level2" value="${esc(config.quote.city)}"></label><label>${esc(FIELD_LABELS.state)}<input name="state" autocomplete="address-level1" value="${esc(config.quote.state)}"></label><label>${esc(FIELD_LABELS.notes)}<textarea name="notes" rows="4">${esc(config.quote.notes)}</textarea></label></fieldset><input type="hidden" name="configuration" value="${esc(JSON.stringify(config))}"><input type="hidden" name="estimate" value="${esc(JSON.stringify(estimate))}"><button type="submit">${esc(CONTROLS.getQuotation)}</button><p class="required-guidance">Please add your name and mobile number so our sales team can send your fixed quotation.</p>`);

  const allSections = [productStep, sizeStep, structureStep, interiorStep, openingsStep, electricalStep, addOnsStep, deliveryStep, quotationStep];
  const renderedSections = allSections;
  const reference = options.reference || 'SP-EST';
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const pageUrl = options.pageUrl || '/cabin-cost-calculator';
  const itemisedMessage = `SAMAN ${product.name} configuration | ${estimate.lines.map((line) => `${line.label}: ${line.amount === null ? 'in quotation' : money(line.amount)}`).join(' | ')} | Total: ${estimate.quoteOnly ? 'price on request' : `${money(estimate.totalExGst)} ex-GST`}`;
  const messageCatalog = Object.entries(CALCULATOR_MESSAGES).map(([key, value]) => `<p hidden data-message="${key}">${esc(value)}</p>`).join('');
  const rootRates = `data-area-band-under200="1.1" data-area-band-at200="1" data-area-band-over200="0.96" data-area-band-over300="0.94" data-area-band-over400="0.92" data-area-band-over600="0.9" data-height-rate-per-foot="0.06" data-partition-rate="300" data-gst-rate="${GST_RATE}" data-freight-bands="${RATE_CARD.freight.bands20ft.join(',')}" data-freight40-delta="${RATE_CARD.freight.trailer40ftDelta}"`;
  const hiddenProduct = embedded ? `<input type="hidden" name="productId" value="${config.productId}" data-label="${esc(product.name)}" data-reference-rate="${effectiveReferenceRate(product, config.ladderKey)}" data-quote-only="${product.quoteOnly ? 'true' : 'false'}" data-ladder="${esc(config.ladderKey || product.ladderKey || (isColonyProduct(product.id) ? product.id : 'none'))}">` : '';
  const standardPostFields = `${hiddenProduct}<input type="hidden" name="message" value="${esc(itemisedMessage)}"><input type="hidden" name="productName" value="${esc(product.name)}"><input type="hidden" name="pageUrl" value="${esc(pageUrl)}"><input type="hidden" name="returnTo" value="${esc(pageUrl)}">`;
  const statusText = options.submissionStatus === 'success' ? CALCULATOR_MESSAGES.submitSuccess : options.submissionStatus === 'failure' ? CALCULATOR_MESSAGES.submitFailure : '';
  const tableProducts = embedded ? [product] : PRODUCTS;
  const summarySize = colony ? `${esc(colonyLadder(config.productId)[config.colonyVariant]?.label || '')} · quantity ${config.quantity}` : `${config.length}×${config.width} ft · ${estimate.areaSqft.toLocaleString('en-IN')} sq ft`;
  return `<section class="cabin-calculator-ssr" data-cabin-calculator data-mode="${embedded ? 'embedded' : 'standalone'}" data-theme="light" data-product-slug="${esc(options.productSlug || (config.productId === 'labour-colony' ? 'labor-colony' : config.productId))}" data-reference="${esc(reference)}" ${rootRates}><style>${CABIN_CALCULATOR_SSR_STYLES}</style>${messageCatalog}<p class="calculator-status" data-calculator-notice role="status"${statusText ? '' : ' hidden'}>${esc(statusText)}</p><p class="calculator-status" data-restore-banner role="status" hidden>${esc(CALCULATOR_MESSAGES.restored)}</p><input type="text" data-share-url value="${esc(pageUrl)}" readonly hidden>${includeCopy ? renderIntro() : ''}<div class="print-letterhead"><strong>SAMAN POS India Private Limited · SAMAN Portable</strong><span>Founded 2009 · Incorporated 2019 · ISO 9001:2015</span><span>Bengaluru (Unit 1): +91 88616 22859 · sales@samanportable.com</span><span>Greater Noida (Unit 2): +91 87960 39938 · ncr@samanportable.com</span><span>www.samanportable.com</span></div><header class="calculator-header"><div><p>Customized cabin</p><h2 data-summary-product>${esc(options.productName || product.name)}</h2><p data-summary-size>${summarySize}</p></div><div><p data-summary-label>Estimated total</p><p><strong data-summary-ex>${estimate.quoteOnly ? 'Price on request' : money(estimate.totalExGst)}</strong><small data-summary-incl>${estimate.quoteOnly ? 'Fixed quotation within 48 hours' : `${money(estimate.totalInclGst)} incl. GST`}</small></p></div><div class="calculator-header-actions"><button type="button" data-action="save">${esc(CONTROLS.saveDesign)}</button><button type="button" data-action="restore">${esc(CONTROLS.restoreDesign)}</button><button type="button" data-action="start-over">${esc(CONTROLS.startOver)}</button></div><nav class="step-nav" aria-label="Calculator steps">${visibleSteps.map(([name], index) => `<a href="#calculator-step-${index + 1}" data-step-link="${index + 1}">${esc(name)}</a>`).join('')}</nav></header><form method="post" action="${esc(options.formAction || '/api/enquiry')}" enctype="application/x-www-form-urlencoded" data-enhanced-action="/api/enquiry" data-calculator-form>${standardPostFields}<div class="calculator-grid"><div class="step-card"><p class="step-counter" data-step-counter>Step <span data-step-current>${embedded ? 1 : 1}</span> of 9: <span data-step-name>${esc(visibleSteps[0][0])}</span></p><div class="step-progress" role="progressbar" aria-label="Calculator progress" aria-valuemin="1" aria-valuemax="9" aria-valuenow="1" data-step-progress><span data-step-progress-fill style="width:${Math.round(100 / 9)}%"></span></div>${renderedSections.join('')}<div class="estimate-actions"><button type="button" data-action="pdf" class="ghost">${esc(CONTROLS.downloadPdf)}</button><button type="button" data-action="whatsapp" class="ghost">${esc(CONTROLS.sendWhatsApp)}</button><button type="button" data-action="copy-link" class="ghost">${esc(CONTROLS.copyLink)}</button></div><div class="step-actions"><button type="button" data-action="back" class="ghost">${esc(CONTROLS.back)}</button><button type="button" data-action="start-over" class="ghost">${esc(CONTROLS.startOver)}</button><button type="button" data-action="next" class="primary">${esc(CONTROLS.next)}</button></div></div>${renderEstimate(estimate)}</div></form><div class="mobile-estimate"><a href="#calculator-step-9"><span>Total, ex-GST</span><strong data-mobile-estimate>${estimate.quoteOnly ? 'On request' : money(estimate.totalExGst)}</strong><span>Expand estimate</span></a></div>${renderPriceTables(tableProducts, config.ladderKey)}<noscript><section class="noscript-content"><h2>Complete published pricing and enquiry</h2><p>All calculator steps, options, published prices, freight rates and the working quotation form are shown above. Use the native controls and submit the form to request your fixed quotation.</p></section></noscript><footer class="print-footer">Indicative estimate ${esc(reference)} · ${esc(date)} · Fixed, itemised quotation within 48 hours of submission.</footer></section>`;
}

