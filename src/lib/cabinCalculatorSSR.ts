import {
  CONTAINER_HOUSE_LADDERS,
  GST_RATE,
  PRODUCT_LADDERS,
  RATE_CARD,
  calculateAreaBandBase,
} from '@/lib/calculatorRates';

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
  position: number;
  hinge: 'Left' | 'Right';
  opening: 'In' | 'Out';
}

export interface WindowConfig {
  type: 'uPVC Sliding' | 'Aluminium Sliding' | 'Openable uPVC' | 'Fixed Glass';
  wall: Wall;
  position: number;
  width: number;
  height: number;
  track: '2 Track' | '2.5 Track';
}

export interface QuoteFields {
  fullName: string;
  mobile: string;
  email: string;
  company: string;
  city: string;
  state: string;
  notes: string;
}

export interface CalculatorConfig {
  productId: ProductId;
  length: number;
  width: number;
  height: number;
  quantity: number;
  planView: 'plan' | 'elevations';
  rooms: number;
  roof: 'Sloped' | 'Flat / mono-pitch';
  structure: string;
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
  quoteOnly: boolean;
}

export type CalculatorQuery = Record<string, string | string[] | undefined>;

interface ProductDefinition {
  id: ProductId;
  name: string;
  subtitle: string;
  referenceRate?: number;
  quoteOnly?: boolean;
  houseLadder?: keyof typeof CONTAINER_HOUSE_LADDERS;
}

export interface RenderCalculatorOptions {
  config?: CalculatorConfig;
  query?: CalculatorQuery;
  embedded?: boolean;
  includeCopy?: boolean;
  formAction?: string;
  activeStep?: number;
  reference?: string;
  productSlug?: ColonyProductSlug;
  pageUrl?: string;
  submissionStatus?: 'success' | 'failure';
}

export const PRODUCTS: readonly ProductDefinition[] = [
  { id: 'porta-cabin', name: 'Porta Cabin', subtitle: 'All-purpose modular cabin', referenceRate: 1250 },
  { id: 'office-cabin', name: 'Office Cabin', subtitle: 'Furnished workspace cabin', referenceRate: 1350 },
  { id: 'security-cabin', name: 'Security Cabin', subtitle: 'Guard booth / gate post', referenceRate: 1250 },
  { id: 'toilet-cabin', name: 'Toilet Cabin', subtitle: 'Portable washroom block', quoteOnly: true },
  { id: 'accommodation-cabin', name: 'Accommodation Cabin', subtitle: 'Bunkhouse / staff stay', referenceRate: 1450 },
  { id: 'container-office', name: 'Container Office', subtitle: 'Insulated container workspace', referenceRate: 1800 },
  { id: 'site-office', name: 'Site Office', subtitle: 'On-site project office', referenceRate: 1450 },
  { id: 'portable-cabin', name: 'Portable Cabin', subtitle: 'General-purpose portable cabin', referenceRate: 1250 },
  { id: 'container-houses', name: 'Container House', subtitle: 'Standard container home', houseLadder: 'container-houses' },
  { id: 'prefab-container-homes', name: 'Prefab Container Home', subtitle: 'Prefab home specification', houseLadder: 'prefab-container-homes' },
  { id: 'shipping-container-homes', name: 'Shipping Container Home', subtitle: 'Shipping-grade shell', houseLadder: 'shipping-container-homes' },
  { id: 'affordable-container-homes', name: 'Affordable Container Home', subtitle: 'Lowest-rate home ladder', houseLadder: 'affordable-container-homes' },
  { id: 'luxury-container-houses', name: 'Luxury Container House', subtitle: 'Highest-rate luxury ladder', houseLadder: 'luxury-container-houses' },
  { id: 'prefab-modular-home', name: 'Prefab Modular Home', subtitle: 'Turnkey modular living space', referenceRate: 1650 },
  { id: 'container-cafe', name: 'Container Cafe', subtitle: 'Cafe and restaurant unit', referenceRate: 1850 },
  { id: 'labour-colony', name: 'Labour Colony', subtitle: 'Worker housing blocks' },
  { id: 'labor-sheds', name: 'Labour Sheds', subtitle: 'Open-hall worker dormitories' },
  { id: 'labor-hutments', name: 'Labour Hutments', subtitle: 'Room-based worker housing' },
  { id: 'prefab-labor-camps', name: 'Prefab Labour Camps', subtitle: 'Relocatable worker camp blocks' },
] as const;

export const STRUCTURES = [
  ['MS frame + insulated panel', 0],
  ['GI-coated frame', 45],
  ['Heavier structural frame', 60],
  ['Container-form Corten build', 75],
] as const;

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
.cabin-calculator-ssr{--calc-bg:#f4f8f5;--calc-panel:#fff;--calc-soft:#eef6f0;--calc-border:#d5e3d9;--calc-text:#1d2b22;--calc-muted:#5c6f64;--calc-accent:#2d7a3f;background:var(--calc-bg);color:var(--calc-text);padding:16px;border-radius:20px}.cabin-calculator-ssr[data-theme="dark"]{--calc-bg:#0c1310;--calc-panel:#121c16;--calc-soft:#0e1712;--calc-border:#26382c;--calc-text:#eaf4ec;--calc-muted:#9db2a4;--calc-accent:#7fd49a}.cabin-calculator-ssr *{box-sizing:border-box}.cabin-calculator-ssr button,.cabin-calculator-ssr input,.cabin-calculator-ssr select,.cabin-calculator-ssr textarea{font:inherit;min-height:44px}.cabin-calculator-ssr button,.cabin-calculator-ssr input,.cabin-calculator-ssr select,.cabin-calculator-ssr textarea,.cabin-calculator-ssr .calc-choice{border:1px solid var(--calc-border);border-radius:8px;background:var(--calc-panel);color:var(--calc-text)}.cabin-calculator-ssr button:focus-visible,.cabin-calculator-ssr input:focus-visible,.cabin-calculator-ssr select:focus-visible,.cabin-calculator-ssr textarea:focus-visible,.cabin-calculator-ssr a:focus-visible{outline:3px solid var(--calc-accent);outline-offset:2px}.calculator-header,.step-card,.estimate-card,.price-tables,.calculator-copy,.noscript-content{background:var(--calc-panel);border:1px solid var(--calc-border);border-radius:14px;padding:18px;margin-block:14px}.calculator-header{display:grid;grid-template-columns:1fr auto;gap:8px 18px;align-items:center}.calculator-header>*{margin:0}.step-nav{display:flex;gap:8px;overflow-x:auto;padding:4px}.step-nav a{white-space:nowrap;min-height:44px;display:inline-flex;align-items:center;padding:8px 12px;border:1px solid var(--calc-border);border-radius:999px;color:var(--calc-text)}.calculator-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,360px);gap:16px}.calc-step{display:block;min-height:220px;padding-block:16px;border-bottom:1px solid var(--calc-border)}.cabin-calculator-ssr.is-enhanced .calc-step:not(.is-active){display:none}.product-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.calc-choice,.quantity-row{display:flex;gap:10px;align-items:flex-start;padding:10px;margin:6px 0;min-height:44px}.calc-choice input{min-height:auto;margin-top:4px}.calc-choice span,.quantity-row span{display:flex;flex-direction:column}.calc-choice small,.quantity-row small,.cabin-calculator-ssr p,.cabin-calculator-ssr dd{color:var(--calc-muted)}.field-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.cabin-calculator-ssr label:not(.calc-choice):not(.quantity-row){display:flex;flex-direction:column;gap:5px;margin-block:8px}.cabin-calculator-ssr input,.cabin-calculator-ssr select,.cabin-calculator-ssr textarea{width:100%;padding:9px 11px}.cabin-calculator-ssr fieldset{border:1px solid var(--calc-border);border-radius:10px;padding:12px;margin-block:12px}.floor-plan{display:block;width:100%;max-width:640px;min-height:220px;background:var(--calc-soft);border:1px solid var(--calc-border);border-radius:12px}.shell{fill:var(--calc-soft);stroke:var(--calc-accent);stroke-width:2}.partition{stroke:var(--calc-muted);stroke-dasharray:4 3}.door-mark{fill:#e0ad20}.window-mark{fill:#368dcc}.floor-plan text{fill:var(--calc-muted);font-size:9px;text-anchor:middle}.quantity-row{justify-content:space-between;background:var(--calc-soft)}.quantity-row input{width:90px}.estimate-card{align-self:start;position:sticky;top:90px}.estimate-lines>div{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--calc-border)}.estimate-lines dd{margin:0;text-align:right}.total{display:flex;flex-direction:column;text-align:center;background:var(--calc-soft);border-radius:10px;padding:12px;margin-block:12px}.total strong{font-size:1.5rem;color:var(--calc-accent)}.estimate-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.price-tables details{margin-block:8px}.price-tables summary{min-height:44px;padding:10px;cursor:pointer;font-weight:700}.cabin-calculator-ssr table{width:100%;border-collapse:collapse;display:table}.cabin-calculator-ssr th,.cabin-calculator-ssr td{text-align:left;padding:8px;border:1px solid var(--calc-border)}.mobile-estimate{display:none}.calculator-status{border:1px solid var(--calc-border);background:var(--calc-soft);padding:10px;border-radius:8px;margin-block:8px}.print-letterhead,.print-footer{display:none}@media(max-width:760px){.calculator-grid{grid-template-columns:1fr}.estimate-card{position:static}.field-grid{grid-template-columns:1fr}.price-tables{overflow-x:auto}.mobile-estimate{position:sticky;bottom:0;display:block;background:var(--calc-panel);border-top:1px solid var(--calc-border);padding:8px;z-index:20}.mobile-estimate a{display:flex;justify-content:space-between;align-items:center;min-height:56px;color:var(--calc-text)}}@media print{.print-letterhead,.print-footer{display:flex;flex-direction:column}.step-nav,.step-card,.mobile-estimate,.estimate-actions{display:none!important}.calculator-grid{display:block}.estimate-card{position:static}}
.calculator-header-actions{display:flex;gap:8px;flex-wrap:wrap}.cabin-calculator-ssr.is-enhanced .step-card{min-height:560px}@media(max-width:600px){.cabin-calculator-ssr{padding-bottom:84px}.cabin-calculator-ssr.is-enhanced .step-card{min-height:610px}.mobile-estimate{position:fixed;left:0;right:0;bottom:0;z-index:40}}
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
  structure: STRUCTURES[0][0],
  wallFinish: WALL_FINISHES[0][0],
  ceiling: CEILINGS[0][0],
  flooring: FLOORING[0][0],
  pufThickness: 50,
  doors: [{ type: 'Steel door', wall: 'Front', position: 20, hinge: 'Left', opening: 'Out' }],
  windows: [
    { type: 'uPVC Sliding', wall: 'Front', position: 35, width: 3, height: 3, track: '2 Track' },
    { type: 'uPVC Sliding', wall: 'Rear', position: 70, width: 3, height: 3, track: '2 Track' },
  ],
  electrical: { 'LED Panel Light': 5, 'Ceiling Fan': 2, 'Plug Point': 4, 'External / Entrance Light': 1 },
  lightColour: 'White',
  lightShape: 'Square',
  addOns: {},
  furniturePosition: 'Wall attached',
  mobility: '100% movable',
  deliveryZone: 'Other',
  distanceKm: 0,
  installation: false,
  colonyVariant: 0,
  workers: 0,
  quote: { fullName: '', mobile: '', email: '', company: '', city: '', state: '', notes: '' },
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
    length: finite(source.length, 20, -10000, 10000),
    width: finite(source.width, 10, -10000, 10000),
    height: finite(source.height, 8.5, -10000, 10000),
    quantity: int(source.quantity, 1, 1, 50),
    planView: member(source.planView, ['plan', 'elevations'] as const, 'plan'),
    rooms: int(source.rooms, 1, 1, 12),
    roof: member(source.roof, ['Sloped', 'Flat / mono-pitch'] as const, 'Sloped'),
    structure: member(source.structure, STRUCTURES.map((entry) => entry[0]), STRUCTURES[0][0]),
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
    installation: source.installation === true,
    colonyVariant: int(source.colonyVariant, 0, 0, Math.max(0, PRODUCT_LADDERS.labourColony.length - 1)),
    workers: int(source.workers, 0, 0, 100000),
    quote: {
      fullName: text(quoteSource.fullName, 120), mobile: text(quoteSource.mobile, 20), email: text(quoteSource.email, 160),
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
  return sanitiseConfig(direct);
}

function sourceLadder(product: ProductDefinition) {
  if (product.houseLadder === 'container-houses') return PRODUCT_LADDERS.containerOffices;
  if (product.houseLadder === 'prefab-container-homes' || product.houseLadder === 'affordable-container-homes') return PRODUCT_LADDERS.containerOfficeCabins;
  return PRODUCT_LADDERS.shippingContainerOffices;
}

function effectiveReferenceRate(product: ProductDefinition): number {
  if (product.referenceRate) return product.referenceRate;
  if (!product.houseLadder) return 0;
  const source = sourceLadder(product);
  const index = Math.max(0, source.findIndex((item) => item.areaSqft === 200));
  return CONTAINER_HOUSE_LADDERS[product.houseLadder][index] / 200;
}

function calculateBase(config: CalculatorConfig, area: number): number | null {
  const product = productFor(config.productId);
  if (product.quoteOnly) return null;
  if (isColonyProduct(config.productId)) return (colonyLadder(config.productId)[config.colonyVariant]?.priceExGst || 0) * config.quantity;
  if (product.houseLadder) {
    const source = sourceLadder(product);
    const publishedIndex = source.findIndex((entry) => entry.areaSqft === Math.round(area));
    if (publishedIndex >= 0) return CONTAINER_HOUSE_LADDERS[product.houseLadder][publishedIndex] * config.quantity;
    const refIndex = Math.max(0, source.findIndex((entry) => entry.areaSqft === 200));
    const refPrice = CONTAINER_HOUSE_LADDERS[product.houseLadder][refIndex];
    return calculateAreaBandBase(area, refPrice / 200) * config.quantity;
  }
  return calculateAreaBandBase(area, product.referenceRate || 1250) * config.quantity;
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
    const structureRate = STRUCTURES.find(([label]) => label === config.structure)?.[1] || 0;
    if (structureRate) addLine(config.structure, Math.round(structureRate * area * config.quantity), 'market');
    if (config.rooms > 1) addLine(`${config.rooms} rooms, ${config.rooms - 1} partitions`, Math.round((config.rooms - 1) * config.width * 8.5 * 300 * config.quantity), 'market');
    const wallArea = 2 * (config.length + config.width) * config.height;
    const surfaces: Array<[string, readonly (readonly [string, number])[], string, number]> = [
      ['Wall finish', WALL_FINISHES, config.wallFinish, wallArea], ['Ceiling', CEILINGS, config.ceiling, area], ['Flooring', FLOORING, config.flooring, area],
    ];
    surfaces.forEach(([label, options, choice, surfaceArea]) => {
      const rate = options.find(([name]) => name === choice)?.[1] || 0;
      if (rate) addLine(`${label}: ${choice}`, Math.round(rate * surfaceArea * config.quantity), 'market');
    });
    const thicknessRate = RATE_CARD.pufThicknessDeltaPerSqft[config.pufThickness];
    if (thicknessRate) addLine(`${config.pufThickness} mm PUF panels`, Math.round(thicknessRate * (wallArea + area) * config.quantity), 'published');
    config.doors.forEach((door, index) => {
      if (index === 0 && door.type === 'Steel door') return;
      addLine(`Door ${index + 1}: ${door.type}`, (door.type === 'Steel door' ? RATE_CARD.marketRates.steelDoor : RATE_CARD.marketRates.upvcGlassDoor) * config.quantity, 'market');
    });
    config.windows.forEach((window, index) => addLine(`Window ${index + 1}: ${window.type} ${window.width}×${window.height} ft`, Math.round(WINDOW_RATES[window.type] * window.width * window.height * (window.track === '2.5 Track' ? 1.12 : 1) * config.quantity), 'market'));
  }
  ELECTRICAL.forEach(([label, rate]) => { const quantity = config.electrical[label] || 0; if (quantity) addLine(`${quantity} × ${label}`, colony ? null : rate * quantity * config.quantity, colony ? 'quotation' : 'market'); });
  ADD_ONS.forEach(([label, rate]) => { const quantity = config.addOns[label] || 0; if (quantity) addLine(`${quantity} × ${label}`, colony ? null : rate * quantity * config.quantity, colony ? 'quotation' : 'market'); });
  let transportNote = '';
  if (config.deliveryZone === 'Bangalore city' || config.deliveryZone === 'Delhi NCR') transportNote = 'Free delivery zone';
  else if (config.distanceKm > 0 && config.distanceKm < 100) transportNote = 'Under 100 km: confirmed at quotation';
  else if (config.distanceKm >= 100) {
    const bandIndex = Math.min(RATE_CARD.freight.bands20ft.length - 1, Math.max(0, Math.ceil((config.distanceKm - 100) / 50) - 1));
    addLine(`Transport ${config.distanceKm} km`, (RATE_CARD.freight.bands20ft[bandIndex] + (config.length > 20 || colony ? RATE_CARD.freight.trailer40ftDelta : 0)) * config.quantity, 'published');
  }
  if (config.installation) addLine('Installation', null, 'quotation');
  const gst = Math.round(total * GST_RATE);
  return { areaSqft: area, lines, totalExGst: total, gst, totalInclGst: total + gst, transportNote, quoteOnly: basePrice === null };
}

function radio(name: string, value: string, label: string, isChecked: boolean, detail = '', attributes = ''): string {
  return `<label class="calc-choice"><input type="radio" name="${esc(name)}" value="${esc(value)}"${checked(isChecked)}${attributes}><span><strong>${esc(label)}</strong>${detail ? `<small>${esc(detail)}</small>` : ''}</span></label>`;
}

function optionCards(name: string, choices: readonly (readonly [string, number])[], current: string, suffix = 'per sq ft'): string {
  return choices.map(([label, rate]) => radio(name, label, label, label === current, rate === 0 ? 'Standard, included' : `${rate > 0 ? '+' : '-'}${money(Math.abs(rate))} ${suffix}`, ` data-rate="${rate}" data-rate-basis="${esc(suffix)}"`)).join('');
}

function quantityRow(group: 'electrical' | 'addOns', label: string, rate: number, quantity: number, help = '', quotation = false): string {
  return `<label class="quantity-row"><span><strong>${esc(label)}</strong>${help ? `<small>${esc(help)}</small>` : ''}<small>${quotation ? 'In quotation per building' : `${money(rate)} each, ex-GST`}</small></span><input type="number" inputmode="numeric" min="0" max="50" step="1" name="${group}[${esc(label)}]" value="${quantity}" aria-label="${esc(label)} quantity" data-rate="${rate}" data-rate-basis="each" data-rate-group="${group}"></label>`;
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
  const doors = config.doors.map((door, index) => { const [cx, cy] = wallPoint(door.wall, door.position); return `<circle cx="${cx}" cy="${cy}" r="5" class="door-mark"><title>Door ${index + 1}</title></circle>`; }).join('');
  const windows = config.windows.map((window, index) => { const [wx, wy] = wallPoint(window.wall, window.position); return `<rect x="${wx - 5}" y="${wy - 3}" width="10" height="6" class="window-mark"><title>Window ${index + 1}</title></rect>`; }).join('');
  const elevationLabels = WALLS.map((wall, index) => {
    const bx = index % 2 === 0 ? 12 : 168;
    const by = index < 2 ? 16 : 106;
    return `<g><rect x="${bx}" y="${by}" width="140" height="55" class="shell"/><text x="${bx + 70}" y="${by + 70}">${wall} elevation</text></g>`;
  }).join('');
  return `<svg class="floor-plan" viewBox="0 0 320 190" role="img" aria-label="Cabin floor plan and four elevations" data-floor-plan><g data-plan-view="plan"${config.planView === 'plan' ? '' : ' hidden'}><rect x="${x}" y="${y}" width="${planWidth}" height="${planHeight}" class="shell"/>${partitions}${doors}${windows}<text x="160" y="184">Yellow: doors · Blue: windows</text></g><g data-plan-view="elevations"${config.planView === 'elevations' ? '' : ' hidden'}>${elevationLabels}</g></svg>`;
}

function productPriceRows(product: ProductDefinition): Array<{ label: string; area: number; ex: number | null; capacity?: string }> {
  if (product.quoteOnly) return PRODUCT_LADDERS.containerOfficeCabins.map((row) => ({ label: row.label, area: row.areaSqft, ex: null }));
  if (isColonyProduct(product.id)) return colonyLadder(product.id).map((row) => ({ label: row.label, area: row.areaSqft, ex: row.priceExGst, capacity: row.capacity }));
  if (product.houseLadder) {
    return sourceLadder(product).map((row, index) => ({ label: row.label, area: row.areaSqft, ex: CONTAINER_HOUSE_LADDERS[product.houseLadder!][index] }));
  }
  return PRODUCT_LADDERS.containerOfficeCabins.map((row) => ({ label: row.label, area: row.areaSqft, ex: calculateAreaBandBase(row.areaSqft, product.referenceRate || 1250) }));
}

function renderPriceTables(products: readonly ProductDefinition[] = PRODUCTS): string {
  return `<section class="price-tables" aria-labelledby="published-price-tables"><h2 id="published-price-tables">Published cabin price tables</h2><p>All primary prices are ex-GST. Including-GST figures apply 18 percent GST.</p>${products.map((product) => `<details${products.length === 1 || product.id === 'porta-cabin' ? ' open' : ''}><summary>${esc(product.name)} price table</summary><table data-product-price-table="${product.id}"><caption>${esc(product.name)} published size and price ladder</caption><thead><tr><th scope="col">Size</th><th scope="col">Area</th>${isColonyProduct(product.id) ? '<th scope="col">Workers housed</th>' : ''}<th scope="col">Price ex-GST</th><th scope="col">Including 18% GST</th></tr></thead><tbody>${productPriceRows(product).map((row) => `<tr><th scope="row">${esc(row.label)}</th><td>${row.area.toLocaleString('en-IN')} sq ft</td>${isColonyProduct(product.id) ? `<td>${esc(row.capacity || '')}</td>` : ''}<td>${row.ex === null ? 'price on request' : money(row.ex)}</td><td>${row.ex === null ? 'itemised in quotation' : money(Math.round(row.ex * (1 + GST_RATE)))}</td></tr>`).join('')}</tbody></table></details>`).join('')}</section>`;
}

function renderFreightTable(): string {
  const rows = RATE_CARD.freight.bands20ft.map((price, index) => `<tr data-freight-band data-min-km="${100 + index * 50}" data-max-km="${150 + index * 50}" data-price-20="${price}" data-price-40="${price + RATE_CARD.freight.trailer40ftDelta}"><th scope="row">${100 + index * 50}-${150 + index * 50} km</th><td>${money(price)}</td><td>${money(price + RATE_CARD.freight.trailer40ftDelta)}</td></tr>`).join('');
  return `<table data-freight-table><caption>Delivery freight ladder, ex-GST</caption><thead><tr><th scope="col">Distance</th><th scope="col">20 ft trailer</th><th scope="col">40 ft trailer</th></tr></thead><tbody><tr><th scope="row">Bangalore city</th><td>Free</td><td>Free</td></tr><tr><th scope="row">Delhi NCR</th><td>Free</td><td>Free</td></tr><tr><th scope="row">Under 100 km</th><td>Confirmed at quotation</td><td>Confirmed at quotation</td></tr>${rows}</tbody></table>`;
}

function renderCopy(): string {
  const faqs = [
    ['Is the calculator price final?', 'No. It is an indicative estimate from our published price list. Your fixed quotation arrives within 48 hours and is the figure we stand behind.'],
    ['Can I price a custom size?', 'Yes. Enter any length and width in feet; the price follows the same published formula that sets our standard nine sizes.'],
    ['Does the price include GST and transport?', 'GST at 18 percent is always shown separately. Transport is estimated from our freight ladder by distance and confirmed in the quotation; Bangalore city and Delhi NCR are free-delivery zones.'],
    ['What warranty applies?', '5-year structural warranty and 1-year finishing warranty as standard; finishing warranty extendable to 2 years on request, confirmed at quotation.'],
  ];
  return `<section class="calculator-copy" aria-labelledby="calculator-copy-title"><h2 id="calculator-copy-title">What this calculator does</h2><p>This tool builds a live estimate for a SAMAN portable cabin from our published price list. Pick the product, enter any size in feet, choose the structure, finishes, doors, windows, electrical items and add-ons, and the estimate updates line by line as you select. Every base price comes from the same price list our product pages publish, transport follows our freight ladder, and branded third-party items are shown at current vendor rates plus a 5 percent handling margin.</p><h2>What the estimate is and is not</h2><p>The figure you see is an indicative ex-factory estimate with GST shown separately. It is not a quotation. When you submit your configuration, our sales team verifies it against your drawing and location and returns a fixed, itemised quotation within 48 hours. Delivery runs 7 to 21 working days across India from our Bengaluru and Greater Noida works.</p><section aria-labelledby="calculator-faq-title"><h2 id="calculator-faq-title">Cabin cost calculator FAQs</h2><dl>${faqs.map(([question, answer]) => `<div><dt>${esc(question)}</dt><dd>${esc(answer)}</dd></div>`).join('')}</dl></section></section>`;
}

function renderEstimate(estimate: CalculatorEstimate): string {
  return `<aside class="estimate-card" aria-label="Live itemised estimate"><h2>Live estimate</h2><p>${estimate.areaSqft.toLocaleString('en-IN')} sq ft</p><dl class="estimate-lines">${estimate.lines.map((line) => `<div><dt>${esc(line.label)}</dt><dd>${line.amount === null ? 'in quotation' : money(line.amount)}</dd></div>`).join('')}${estimate.transportNote ? `<div><dt>Transport</dt><dd>${esc(estimate.transportNote)}</dd></div>` : ''}</dl><div class="total"><small>Estimated total, ex-GST</small><strong data-estimate-ex-gst>${estimate.quoteOnly ? 'Price on request' : money(estimate.totalExGst)}</strong><span data-estimate-incl-gst>${estimate.quoteOnly ? 'Fixed quotation within 48 hours' : `${money(estimate.totalInclGst)} incl. 18% GST`}</span></div><div class="estimate-actions"><button type="button" data-action="pdf">PDF</button><button type="button" data-action="whatsapp">WhatsApp</button><button type="button" data-action="copy-link">Copy link</button></div><p>Indicative estimate from the published price list, ex-factory and ex-GST. GST at 18% is itemised separately. Final pricing follows drawing and location review.</p></aside>`;
}

function renderDoorCard(door: DoorConfig, index: number, reserved: boolean): string {
  const state = reserved ? ' data-reserved-door hidden disabled' : '';
  return `<fieldset class="opening-card"${state}><legend>Door ${index + 1}</legend>${radio(`doors[${index}][type]`, 'Steel door', 'Steel door', door.type === 'Steel door', `${index === 0 ? 'First door included' : money(RATE_CARD.marketRates.steelDoor)}${index === 0 ? '' : ' each, ex-GST'}`, ` data-rate="${index === 0 ? 0 : RATE_CARD.marketRates.steelDoor}" data-rate-basis="each"`)}${radio(`doors[${index}][type]`, 'Glass / Aluminium / uPVC door', 'Glass / Aluminium / uPVC door', door.type !== 'Steel door', `${money(RATE_CARD.marketRates.upvcGlassDoor)} each, ex-GST`, ` data-rate="${RATE_CARD.marketRates.upvcGlassDoor}" data-rate-basis="each"`)}<label>Wall<select name="doors[${index}][wall]">${WALLS.map((wall) => `<option${selected(door.wall === wall)}>${wall}</option>`).join('')}</select></label><label>Position along wall, percent<input type="range" min="0" max="100" name="doors[${index}][position]" value="${door.position}" aria-label="Door ${index + 1} position along wall"></label><fieldset><legend>Hinge</legend>${radio(`doors[${index}][hinge]`, 'Left', 'Left hinge', door.hinge === 'Left')}${radio(`doors[${index}][hinge]`, 'Right', 'Right hinge', door.hinge === 'Right')}</fieldset><fieldset><legend>Opening</legend>${radio(`doors[${index}][opening]`, 'In', 'Opens in', door.opening === 'In')}${radio(`doors[${index}][opening]`, 'Out', 'Opens out', door.opening === 'Out')}</fieldset></fieldset>`;
}

function renderWindowCard(window: WindowConfig, index: number, reserved: boolean): string {
  const state = reserved ? ' data-reserved-window hidden disabled' : '';
  return `<fieldset class="opening-card"${state}><legend>Window ${index + 1}</legend><label>Type<select name="windows[${index}][type]">${Object.entries(WINDOW_RATES).map(([name, rate]) => `<option value="${esc(name)}"${selected(name === window.type)} data-rate="${rate}" data-rate-basis="per sq ft">${esc(name)} · ${money(rate)} per sq ft</option>`).join('')}</select></label><label>Wall<select name="windows[${index}][wall]">${WALLS.map((wall) => `<option${selected(window.wall === wall)}>${wall}</option>`).join('')}</select></label><label>Position along wall, percent<input type="range" min="0" max="100" name="windows[${index}][position]" value="${window.position}" aria-label="Window ${index + 1} position along wall"></label><label>Width in ft<input type="number" inputmode="decimal" min="1" max="12" step="0.5" name="windows[${index}][width]" value="${window.width}"></label><label>Height in ft<input type="number" inputmode="decimal" min="1" max="12" step="0.5" name="windows[${index}][height]" value="${window.height}"></label><fieldset><legend>Track</legend>${radio(`windows[${index}][track]`, '2 Track', '2 Track', window.track === '2 Track', '', ' data-rate-multiplier="1"')}${radio(`windows[${index}][track]`, '2.5 Track', '2.5 Track', window.track === '2.5 Track', '+12%', ' data-rate-multiplier="1.12"')}</fieldset></fieldset>`;
}

export function renderCabinCalculatorSSR(options: RenderCalculatorOptions = {}): string {
  const parsedConfig = sanitiseConfig(options.config || parseCalculatorQuery(options.query));
  const config = options.productSlug ? sanitiseConfig({ ...parsedConfig, productId: productIdForSlug(options.productSlug) }) : parsedConfig;
  const embedded = options.embedded === true;
  const includeCopy = options.includeCopy ?? !embedded;
  const product = productFor(config.productId);
  const colony = isColonyProduct(config.productId);
  const estimate = computeCalculatorEstimate(config);
  const active = int(options.activeStep, embedded ? 1 : 0, embedded ? 1 : 0, 8);
  const stepDefinitions = [
    ['Product', 'Choose a cabin type'], ['Size', colony ? 'Choose a colony building' : 'Set size and plan'], ['Structure', 'Choose structure and roof'], ['Interior', 'Choose panels and finishes'],
    ['Doors & Windows', colony ? 'Building drawing scope' : 'Place doors and windows'], ['Electrical', 'Add electrical items'], ['Add-ons', 'Add furniture and fittings'], ['Delivery', 'Set delivery and installation'], ['Get Quotation', 'Get your official quotation'],
  ] as const;
  const visibleSteps = embedded ? stepDefinitions.slice(1) : stepDefinitions;
  const section = (index: number, body: string): string => `<section class="calc-step${active === index ? ' is-active' : ''}" id="calculator-step-${index + 1}" data-step="${index + 1}" aria-labelledby="calculator-step-title-${index + 1}"><h2 id="calculator-step-title-${index + 1}">Step ${embedded ? index : index + 1} of ${embedded ? 8 : 9}: ${esc(stepDefinitions[index][0])}</h2>${body}</section>`;

  const productStep = section(0, `<p>Pick the SAMAN building you want to configure.</p><fieldset><legend>Product</legend><div class="product-tiles">${PRODUCTS.map((item) => radio('productId', item.id, item.name, item.id === config.productId, `${item.subtitle}. ${item.quoteOnly ? 'price on request' : isColonyProduct(item.id) ? 'published per-building prices' : `from ${money(productPriceRows(item)[0]?.ex || 0)} ex-GST`}`, ` data-label="${esc(item.name)}" data-reference-rate="${effectiveReferenceRate(item)}" data-quote-only="${item.quoteOnly ? 'true' : 'false'}" data-ladder="${esc(item.houseLadder || (isColonyProduct(item.id) ? item.id : 'formula'))}"`)).join('')}</div></fieldset>`);

  const selectedColony = colonyLadder(config.productId)[config.colonyVariant];
  const suggestedQuantity = config.workers > 0 && selectedColony?.capacityMax ? Math.ceil(config.workers / selectedColony.capacityMax) : config.quantity;
  const colonySize = `<label>Workers to accommodate<input type="number" inputmode="numeric" min="1" max="100000" name="workers" value="${config.workers}" data-workers></label><p data-worker-suggestion>${config.workers > 0 && selectedColony ? `${selectedColony.label} × ${suggestedQuantity} accommodates at least ${config.workers.toLocaleString('en-IN')} workers.` : 'Enter the worker headcount to see the smallest sufficient configuration and quantity.'}</p><fieldset><legend>Approved building configuration</legend>${colonyLadder(config.productId).map((item, index) => radio('colonyVariant', String(index), `${item.label}, ${item.areaSqft.toLocaleString('en-IN')} sq ft`, index === config.colonyVariant, `${item.capacity || 'Capacity confirmed at quotation'} · ${money(item.priceExGst)} ex-GST`, ` data-price="${item.priceExGst}" data-area="${item.areaSqft}" data-capacity-max="${item.capacityMax || 0}"`)).join('')}</fieldset><label>Building quantity<input type="number" inputmode="numeric" min="1" max="50" name="quantity" value="${config.quantity}"></label>`;
  const regularSize = `<div class="field-grid"><label>Length in ft<input type="number" inputmode="decimal" min="6" max="60" step="0.5" name="length" value="${config.length}" required aria-describedby="size-guidance"></label><label>Width in ft<input type="number" inputmode="decimal" min="6" max="60" step="0.5" name="width" value="${config.width}" required aria-describedby="size-guidance"></label><label>Height in ft<input type="number" inputmode="decimal" min="7" max="16" step="0.5" name="height" value="${config.height}"></label><label>Cabin quantity<input type="number" inputmode="numeric" min="1" max="50" step="1" name="quantity" value="${config.quantity}"></label></div><p id="size-guidance">${SIZE_ERROR}</p><fieldset><legend>Plan view</legend>${radio('planView', 'plan', 'Floor plan', config.planView === 'plan')}${radio('planView', 'elevations', 'Four elevations', config.planView === 'elevations')}</fieldset><label>Rooms<input type="number" inputmode="numeric" min="1" max="12" name="rooms" value="${config.rooms}"></label>${renderPlan(config)}`;
  const sizeStep = section(1, colony ? colonySize : regularSize);

  const structureStep = section(2, `<fieldset><legend>Frame structure, rate per sq ft of floor</legend>${optionCards('structure', STRUCTURES, config.structure)}</fieldset><fieldset><legend>Roof</legend>${radio('roof', 'Sloped', 'Sloped roof', config.roof === 'Sloped', 'Standard, included', ' data-rate="0" data-rate-basis="percent of base"')}${radio('roof', 'Flat / mono-pitch', 'Flat / mono-pitch roof', config.roof === 'Flat / mono-pitch', '+4% of base price', ' data-rate="4" data-rate-basis="percent of base"')}</fieldset><fieldset><legend>Mobility</legend>${radio('mobility', '100% movable', '100% movable', config.mobility === '100% movable')}${radio('mobility', 'Fixed / semi-permanent', 'Fixed / semi-permanent', config.mobility === 'Fixed / semi-permanent')}</fieldset>`);
  const interiorStep = section(3, `<fieldset><legend>Wall finish, rate per sq ft of wall</legend>${optionCards('wallFinish', WALL_FINISHES, config.wallFinish, 'per sq ft of wall')}</fieldset><fieldset><legend>Ceiling, rate per sq ft</legend>${optionCards('ceiling', CEILINGS, config.ceiling)}</fieldset><fieldset><legend>Flooring, rate per sq ft</legend>${optionCards('flooring', FLOORING, config.flooring)}</fieldset><fieldset><legend>PUF panel thickness, delta per sq ft of wall and roof</legend>${PUF_THICKNESSES.map((thickness) => radio('pufThickness', String(thickness), `${thickness} mm`, config.pufThickness === thickness, thickness === 50 ? 'Standard, included' : `${RATE_CARD.pufThicknessDeltaPerSqft[thickness] > 0 ? '+' : '-'}${money(Math.abs(RATE_CARD.pufThicknessDeltaPerSqft[thickness]))} per sq ft`, ` data-rate="${RATE_CARD.pufThicknessDeltaPerSqft[thickness]}" data-rate-basis="per sq ft of wall and roof"`)).join('')}</fieldset>`);

  const doorSlots = Array.from({ length: Math.max(4, config.doors.length) }, (_, index) => config.doors[index] || DEFAULT_CALCULATOR_CONFIG.doors[0]);
  const windowSlots = Array.from({ length: Math.max(4, config.windows.length) }, (_, index) => config.windows[index] || DEFAULT_CALCULATOR_CONFIG.windows[0]);
  const doorCards = doorSlots.map((door, index) => renderDoorCard(door, index, index >= config.doors.length)).join('');
  const windowCards = windowSlots.map((window, index) => renderWindowCard(window, index, index >= config.windows.length)).join('');
  const openingsStep = section(4, colony ? `<p class="scope-note">${SCOPE_NOTE}</p>` : `${renderPlan(config)}<h3>Door placement</h3>${doorCards}<button type="button" data-action="add-door">Add another door</button><h3>Window placement</h3>${windowCards}<button type="button" data-action="add-window">Add another window</button>`);
  const electricalStep = section(5, `<p>${colony ? 'Quantities are quotation items per building.' : 'Suggested quantities are a starting point and can be changed.'}</p>${ELECTRICAL.map(([label, rate, help]) => quantityRow('electrical', label, rate, config.electrical[label] || 0, help, colony)).join('')}<fieldset><legend>Light appearance</legend>${radio('lightColour', 'White', 'White light', config.lightColour === 'White')}${radio('lightColour', 'Warm', 'Warm light', config.lightColour === 'Warm')}${radio('lightShape', 'Square', 'Square fitting', config.lightShape === 'Square')}${radio('lightShape', 'Round', 'Round fitting', config.lightShape === 'Round')}</fieldset>`);
  const addOnsStep = section(6, `${ADD_ONS.map(([label, rate]) => quantityRow('addOns', label, rate, config.addOns[label] || 0, '', colony)).join('')}<fieldset><legend>Furniture position</legend>${radio('furniturePosition', 'Wall attached', 'Wall attached', config.furniturePosition === 'Wall attached')}${radio('furniturePosition', 'Centre', 'Centre', config.furniturePosition === 'Centre')}</fieldset>`);
  const deliveryStep = section(7, `<fieldset><legend>Delivery zone</legend>${(['Bangalore city', 'Delhi NCR', 'Other'] as const).map((zone) => radio('deliveryZone', zone, zone, config.deliveryZone === zone, zone === 'Other' ? 'Use the freight ladder below' : 'Free delivery zone', ` data-freight-zone="${esc(zone)}" data-price="${zone === 'Other' ? '' : '0'}"`)).join('')}</fieldset><label>Road distance in km<input type="number" inputmode="numeric" min="0" max="5000" step="1" name="distanceKm" value="${config.distanceKm}"></label><label class="checkbox"><input type="checkbox" name="installation" value="1"${checked(config.installation)}>Installation required, confirmed in fixed quotation</label>${renderFreightTable()}<p>Delivery in 7 to 21 working days. Freight is confirmed once the exact delivery location and order are approved.</p>`);
  const quotationStep = section(8, `<p>Submit the exact configuration for a fixed, itemised quotation within 48 hours.</p>${renderEstimate(estimate)}<fieldset><legend>Your contact details</legend><label>Full name *<input name="fullName" autocomplete="name" value="${esc(config.quote.fullName)}" required></label><label>Mobile / WhatsApp *<input type="tel" inputmode="numeric" name="mobile" autocomplete="tel" pattern="[6-9][0-9]{9}" value="${esc(config.quote.mobile)}" required aria-describedby="mobile-error"></label><small id="mobile-error">Enter a 10-digit Indian mobile number.</small><label>Email *<input type="email" inputmode="email" name="email" autocomplete="email" value="${esc(config.quote.email)}" required aria-describedby="email-error"></label><small id="email-error">Please add your email so we can send your quotation PDF.</small><label>Company<input name="company" autocomplete="organization" value="${esc(config.quote.company)}"></label><label>City<input name="city" autocomplete="address-level2" value="${esc(config.quote.city)}"></label><label>State<input name="state" autocomplete="address-level1" value="${esc(config.quote.state)}"></label><label>Requirement notes<textarea name="notes" rows="4">${esc(config.quote.notes)}</textarea></label></fieldset><input type="hidden" name="configuration" value="${esc(JSON.stringify(config))}"><input type="hidden" name="estimate" value="${esc(JSON.stringify(estimate))}"><button type="submit">Get My Official Quotation</button><p class="required-guidance">Please add your name and mobile number so our sales team can send your fixed quotation.</p>`);

  const allSections = [productStep, sizeStep, structureStep, interiorStep, openingsStep, electricalStep, addOnsStep, deliveryStep, quotationStep];
  const renderedSections = embedded ? allSections.slice(1) : allSections;
  const reference = options.reference || 'SP-EST';
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const pageUrl = options.pageUrl || '/cabin-cost-calculator';
  const itemisedMessage = `SAMAN ${product.name} configuration | ${estimate.lines.map((line) => `${line.label}: ${line.amount === null ? 'in quotation' : money(line.amount)}`).join(' | ')} | Total: ${estimate.quoteOnly ? 'price on request' : `${money(estimate.totalExGst)} ex-GST`}`;
  const messageCatalog = Object.entries(CALCULATOR_MESSAGES).map(([key, value]) => `<p hidden data-message="${key}">${esc(value)}</p>`).join('');
  const rootRates = `data-area-band-under-200="1.1" data-area-band-at-200="1" data-area-band-over-200="0.96" data-area-band-over-300="0.94" data-area-band-over-400="0.92" data-area-band-over-600="0.9" data-height-rate-per-foot="0.06" data-partition-rate="300" data-gst-rate="${GST_RATE}" data-freight-bands="${RATE_CARD.freight.bands20ft.join(',')}" data-freight-40-delta="${RATE_CARD.freight.trailer40ftDelta}"`;
  const hiddenProduct = embedded ? `<input type="hidden" name="productId" value="${config.productId}">` : '';
  const standardPostFields = `${hiddenProduct}<input type="hidden" name="message" value="${esc(itemisedMessage)}"><input type="hidden" name="productName" value="${esc(product.name)}"><input type="hidden" name="pageUrl" value="${esc(pageUrl)}"><input type="hidden" name="returnTo" value="${esc(pageUrl)}">`;
  const statusText = options.submissionStatus === 'success' ? CALCULATOR_MESSAGES.submitSuccess : options.submissionStatus === 'failure' ? CALCULATOR_MESSAGES.submitFailure : '';
  const tableProducts = embedded ? [product] : PRODUCTS;
  return `<section class="cabin-calculator-ssr" data-cabin-calculator data-mode="${embedded ? 'embedded' : 'standalone'}" data-theme="light" data-product-slug="${esc(options.productSlug || (config.productId === 'labour-colony' ? 'labor-colony' : config.productId))}" data-reference="${esc(reference)}" ${rootRates}><style>${CABIN_CALCULATOR_SSR_STYLES}</style>${messageCatalog}<p class="calculator-status" data-calculator-notice role="status"${statusText ? '' : ' hidden'}>${esc(statusText)}</p><p class="calculator-status" data-restore-banner role="status" hidden>${esc(CALCULATOR_MESSAGES.restored)}</p><input type="text" data-share-url value="${esc(pageUrl)}" readonly hidden><div class="print-letterhead"><strong>SAMAN POS India Private Limited · SAMAN Portable</strong><span>Founded 2009 · Incorporated 2019 · ISO 9001:2015</span><span>Bengaluru (Unit 1): +91 88616 22859 · sales@samanportable.com</span><span>Greater Noida (Unit 2): +91 87960 39938 · ncr@samanportable.com</span><span>www.samanportable.com</span></div><header class="calculator-header"><div><p>Customized cabin</p><h2>${esc(product.name)}</h2><p>${colony ? `${esc(colonyLadder(config.productId)[config.colonyVariant]?.label || '')} · quantity ${config.quantity}` : `${config.length}×${config.width} ft · ${estimate.areaSqft.toLocaleString('en-IN')} sq ft`}</p></div><p><strong>${estimate.quoteOnly ? 'Price on request' : money(estimate.totalExGst)}</strong> ex-GST <small>${estimate.quoteOnly ? 'fixed quotation within 48 hours' : `${money(estimate.totalInclGst)} incl. GST`}</small></p><div class="calculator-header-actions"><button type="button" data-action="theme" aria-label="Switch colour theme">Theme</button><button type="button" data-action="save">Save design</button><button type="button" data-action="restore">Restore design</button><button type="button" data-action="start-over">Start over</button></div></header><nav class="step-nav" aria-label="Calculator steps">${visibleSteps.map(([name], index) => `<a href="#calculator-step-${embedded ? index + 2 : index + 1}" data-step-link="${embedded ? index + 2 : index + 1}">${esc(name)}</a>`).join('')}</nav><form method="post" action="${esc(options.formAction || '/api/enquiry')}" enctype="application/x-www-form-urlencoded" data-enhanced-action="/api/enquiry" data-calculator-form>${standardPostFields}<div class="calculator-grid"><div class="step-card">${renderedSections.join('')}</div>${renderEstimate(estimate)}</div></form><div class="mobile-estimate"><a href="#calculator-step-9"><span>Total, ex-GST</span><strong data-mobile-estimate>${estimate.quoteOnly ? 'On request' : money(estimate.totalExGst)}</strong><span>Expand estimate</span></a></div>${renderPriceTables(tableProducts)}${includeCopy ? renderCopy() : ''}<noscript><section class="noscript-content"><h2>Complete published pricing and enquiry</h2><p>All calculator steps, options, published prices, freight rates and the working quotation form are shown above. Use the native controls and submit the form to request your fixed quotation.</p></section></noscript><footer class="print-footer">Indicative estimate ${esc(reference)} · ${esc(date)} · Fixed, itemised quotation within 48 hours of submission.</footer></section>`;
}
