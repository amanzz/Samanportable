import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  CONTAINER_HOUSE_LADDERS,
  GST_RATE,
  PRODUCT_LADDERS,
  RATE_CARD,
  calculateAreaBandBase,
} from '@/lib/calculatorRates';
import { pushDataLayer } from '@/lib/analytics';

type ProductId =
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
  | 'labour-colony';

type Wall = 'Front' | 'Rear' | 'Left' | 'Right';
type Theme = 'light' | 'dark';
type QuantityMap = Record<string, number>;

interface DoorConfig {
  type: 'Steel door' | 'Glass / Aluminium / uPVC door';
  wall: Wall;
  position: number;
  hinge: 'Left' | 'Right';
  opening: 'In' | 'Out';
}

interface WindowConfig {
  type: 'uPVC Sliding' | 'Aluminium Sliding' | 'Openable uPVC' | 'Fixed Glass';
  wall: Wall;
  position: number;
  width: number;
  height: number;
  track: '2 Track' | '2.5 Track';
}

interface QuoteFields {
  fullName: string;
  mobile: string;
  email: string;
  company: string;
  city: string;
  state: string;
  notes: string;
}

interface CalculatorConfig {
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

interface EstimateLine {
  label: string;
  amount: number | null;
  source?: 'published' | 'market' | 'quotation';
}

const STEPS = ['Product', 'Size', 'Structure', 'Interior', 'Doors & Windows', 'Electrical', 'Add-ons', 'Delivery', 'Get Quotation'] as const;
const STORAGE_KEY = 'saman-cabin-calculator-v9';
const SCOPE_NOTE = 'Colony buildings are configured as complete blocks. Doors, windows, electrical points and fittings follow the approved building drawing for the configuration you select, and any change you need is itemised in your fixed quotation.';
const SIZE_ERROR = 'Enter a length and width between 6 and 60 ft. For larger buildings, request a quotation and we will size it with you.';

const PRODUCTS: Array<{
  id: ProductId;
  name: string;
  subtitle: string;
  icon: string;
  referenceRate?: number;
  quoteOnly?: boolean;
  houseLadder?: keyof typeof CONTAINER_HOUSE_LADDERS;
}> = [
  { id: 'porta-cabin', name: 'Porta Cabin', subtitle: 'All-purpose modular cabin', icon: '⌂', referenceRate: 1250 },
  { id: 'office-cabin', name: 'Office Cabin', subtitle: 'Furnished workspace cabin', icon: '▦', referenceRate: 1350 },
  { id: 'security-cabin', name: 'Security Cabin', subtitle: 'Guard booth / gate post', icon: '◈', referenceRate: 1250 },
  { id: 'toilet-cabin', name: 'Toilet Cabin', subtitle: 'Portable washroom block', icon: '♢', quoteOnly: true },
  { id: 'accommodation-cabin', name: 'Accommodation Cabin', subtitle: 'Bunkhouse / staff stay', icon: '▤', referenceRate: 1450 },
  { id: 'container-office', name: 'Container Office', subtitle: 'Insulated container workspace', icon: '▣', referenceRate: 1800 },
  { id: 'site-office', name: 'Site Office', subtitle: 'On-site project office', icon: '△', referenceRate: 1450 },
  { id: 'portable-cabin', name: 'Portable Cabin', subtitle: 'General-purpose portable cabin', icon: '□', referenceRate: 1250 },
  { id: 'container-houses', name: 'Container House', subtitle: 'Standard container home', icon: '⌂', houseLadder: 'container-houses' },
  { id: 'prefab-container-homes', name: 'Prefab Container Home', subtitle: 'Prefab home specification', icon: '⌂', houseLadder: 'prefab-container-homes' },
  { id: 'shipping-container-homes', name: 'Shipping Container Home', subtitle: 'Shipping-grade shell', icon: '▣', houseLadder: 'shipping-container-homes' },
  { id: 'affordable-container-homes', name: 'Affordable Container Home', subtitle: 'Lowest-rate home ladder', icon: '⌂', houseLadder: 'affordable-container-homes' },
  { id: 'luxury-container-houses', name: 'Luxury Container House', subtitle: 'Highest-rate luxury ladder', icon: '◆', houseLadder: 'luxury-container-houses' },
  { id: 'prefab-modular-home', name: 'Prefab Modular Home', subtitle: 'Turnkey modular living space', icon: '◇', referenceRate: 1650 },
  { id: 'container-cafe', name: 'Container Cafe', subtitle: 'Cafe and restaurant unit', icon: '○', referenceRate: 1850 },
  { id: 'labour-colony', name: 'Labour Colony', subtitle: 'Worker housing blocks', icon: '▥' },
];

const STRUCTURES = [
  ['MS frame + insulated panel', 0],
  ['GI-coated frame', 45],
  ['Heavier structural frame', 60],
  ['Container-form Corten build', 75],
] as const;
const WALL_FINISHES = [['Pre-painted steel skin', 0], ['Particle Board', -15], ['PVC', 70], ['HDHMR', 60], ['Gypsum', 85], ['WPC', 140], ['SPC', 170], ['UV Sheet', 350], ['ACP', 260]] as const;
const CEILINGS = [['Standard ceiling', 0], ['Particle Board', -15], ['PVC', 65], ['HDHMR', 60], ['Gypsum', 85], ['WPC', 140], ['SPC', 170], ['UV Sheet', 350], ['ACP', 260]] as const;
const FLOORING = [['Vinyl (Standard)', 0], ['PVC', 90], ['SPC', 180], ['Wooden Laminate', 110], ['Tiles', 140]] as const;
const ELECTRICAL = [
  ['LED Panel Light', RATE_CARD.marketRates.ledPanel, 40],
  ['Tube Light', RATE_CARD.marketRates.tubeLight, 0],
  ['Ceiling Fan', RATE_CARD.marketRates.fan, 100],
  ['Exhaust Fan', RATE_CARD.marketRates.exhaust, 0],
  ['Split AC 1 Ton incl. installation', RATE_CARD.marketRates.ac1T, 0],
  ['Plug Point', RATE_CARD.marketRates.plugPoint, 50],
  ['Pop-up Socket', RATE_CARD.marketRates.popupSocket, 0],
  ['External / Entrance Light', RATE_CARD.marketRates.externalLight, -1],
  ['FR Copper Wire Coil 90 m, 1.5 sq mm', RATE_CARD.marketRates.wire15sqmm, 0],
  ['FR Copper Wire Coil 90 m, 2.5 sq mm', RATE_CARD.marketRates.wire25sqmm, 0],
] as const;
const ADD_ONS = [
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
const WALLS: Wall[] = ['Front', 'Rear', 'Left', 'Right'];

const initialConfig: CalculatorConfig = {
  productId: 'porta-cabin', length: 20, width: 10, height: 8.5, quantity: 1,
  planView: 'plan', rooms: 1, roof: 'Sloped', structure: STRUCTURES[0][0],
  wallFinish: WALL_FINISHES[0][0], ceiling: CEILINGS[0][0], flooring: FLOORING[0][0], pufThickness: 50,
  doors: [{ type: 'Steel door', wall: 'Front', position: 20, hinge: 'Left', opening: 'Out' }],
  windows: [
    { type: 'uPVC Sliding', wall: 'Front', position: 35, width: 3, height: 3, track: '2 Track' },
    { type: 'uPVC Sliding', wall: 'Rear', position: 70, width: 3, height: 3, track: '2 Track' },
  ],
  electrical: { 'LED Panel Light': 5, 'Ceiling Fan': 2, 'Plug Point': 4, 'External / Entrance Light': 1 },
  lightColour: 'White', lightShape: 'Square', addOns: {}, furniturePosition: 'Wall attached', mobility: '100% movable',
  deliveryZone: 'Other', distanceKm: 0, installation: false, colonyVariant: 0, workers: 0,
  quote: { fullName: '', mobile: '', email: '', company: '', city: '', state: '', notes: '' },
};

const formatMoney = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
const selectedProduct = (id: ProductId) => PRODUCTS.find((product) => product.id === id) || PRODUCTS[0];
const isColony = (id: ProductId) => id === 'labour-colony';

function encodeDesign(config: CalculatorConfig): string {
  const { quote: _quote, ...shareableDesign } = config;
  const json = JSON.stringify(shareableDesign);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeDesign(value: string): CalculatorConfig | null {
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Partial<CalculatorConfig>;
    if (!parsed.productId || !PRODUCTS.some((product) => product.id === parsed.productId)) return null;
    return { ...initialConfig, ...parsed, quote: initialConfig.quote };
  } catch {
    return null;
  }
}

function makeReference(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  let sequence = 1;
  try {
    const key = `saman-estimate-seq-${date}`;
    sequence = Number(window.localStorage.getItem(key) || 0) + 1;
    window.localStorage.setItem(key, String(sequence));
  } catch {
    sequence = Math.floor(Math.random() * 900) + 100;
  }
  return `SP-EST-${date}-${String(sequence).padStart(3, '0')}`;
}

function QuantityRow({ label, help, price, value, onChange, quotation = false }: {
  label: string; help?: string; price: number; value: number; onChange: (value: number) => void; quotation?: boolean;
}) {
  return (
    <div className="quantity-row">
      <div><strong>{label}</strong>{help && <small>{help}</small>}</div>
      <div className="quantity-controls">
        <span className="rate-tag">{quotation ? 'In quotation' : `${formatMoney(price)} each`}</span>
        <button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(Math.max(0, value - 1))}>−</button>
        <output aria-label={`${label} quantity`}>{value}</output>
        <button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(Math.min(50, value + 1))}>+</button>
      </div>
    </div>
  );
}

function Choice({ active, children, onClick, ariaLabel }: { active: boolean; children: React.ReactNode; onClick: () => void; ariaLabel?: string }) {
  return <button type="button" className={`choice${active ? ' active' : ''}`} aria-pressed={active} aria-label={ariaLabel} onClick={onClick}>{children}</button>;
}

function PlanGraphic({ config }: { config: CalculatorConfig }) {
  const width = 320;
  const height = 190;
  const pad = 30;
  const scale = Math.min((width - pad * 2) / Math.max(6, config.length), (height - pad * 2) / Math.max(6, config.width));
  const planWidth = config.length * scale;
  const planHeight = config.width * scale;
  const x = (width - planWidth) / 2;
  const y = (height - planHeight) / 2;
  const wallPoint = (wall: Wall, position: number): [number, number] => {
    const ratio = position / 100;
    if (wall === 'Front') return [x + planWidth * ratio, y + planHeight];
    if (wall === 'Rear') return [x + planWidth * ratio, y];
    if (wall === 'Left') return [x, y + planHeight * ratio];
    return [x + planWidth, y + planHeight * ratio];
  };
  if (config.planView === 'elevations') {
    return (
      <svg viewBox="0 0 320 190" role="img" aria-label="Four cabin elevations">
        {WALLS.map((wall, index) => {
          const bx = index % 2 === 0 ? 12 : 168;
          const by = index < 2 ? 16 : 106;
          return <g key={wall}><rect x={bx} y={by} width="140" height="55" className="shell"/><text x={bx + 70} y={by + 70}>{wall} elevation</text></g>;
        })}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 190" role="img" aria-label={`${config.length} by ${config.width} foot cabin plan`}>
      <rect x={x} y={y} width={planWidth} height={planHeight} className="shell" />
      {Array.from({ length: Math.max(0, config.rooms - 1) }, (_, index) => {
        const partitionX = x + (planWidth * (index + 1)) / config.rooms;
        return <line key={index} x1={partitionX} y1={y} x2={partitionX} y2={y + planHeight} className="partition" />;
      })}
      {config.doors.map((door, index) => { const [dx, dy] = wallPoint(door.wall, door.position); return <circle key={`d${index}`} cx={dx} cy={dy} r="5" className="door-mark"><title>{`Door ${index + 1}`}</title></circle>; })}
      {config.windows.map((win, index) => { const [wx, wy] = wallPoint(win.wall, win.position); return <rect key={`w${index}`} x={wx - 5} y={wy - 3} width="10" height="6" className="window-mark"><title>{`Window ${index + 1}`}</title></rect>; })}
      <text x="160" y="184">Yellow: doors · Blue: windows</text>
    </svg>
  );
}

export default function CabinCostCalculatorV9() {
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState<Theme>('light');
  const [config, setConfig] = useState<CalculatorConfig>(initialConfig);
  const [mobileEstimateOpen, setMobileEstimateOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [restored, setRestored] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof QuoteFields | 'form', string>>>({});
  const [reference, setReference] = useState('SP-EST');

  const product = selectedProduct(config.productId);
  const colony = isColony(config.productId);
  const sizeValid = colony || (config.length >= 6 && config.length <= 60 && config.width >= 6 && config.width <= 60);
  const area = colony ? (PRODUCT_LADDERS.labourColony[config.colonyVariant]?.areaSqft || 0) : config.length * config.width;

  const houseSourceLadder = useMemo(() => {
    if (!product.houseLadder) return null;
    if (product.houseLadder === 'container-houses') return PRODUCT_LADDERS.containerOffices;
    if (product.houseLadder === 'prefab-container-homes' || product.houseLadder === 'affordable-container-homes') return PRODUCT_LADDERS.containerOfficeCabins;
    return PRODUCT_LADDERS.shippingContainerOffices;
  }, [product.houseLadder]);

  const basePrice = useMemo(() => {
    if (product.quoteOnly) return null;
    if (colony) return (PRODUCT_LADDERS.labourColony[config.colonyVariant]?.priceExGst || 0) * config.quantity;
    if (product.houseLadder && houseSourceLadder) {
      const publishedIndex = houseSourceLadder.findIndex((entry) => entry.areaSqft === Math.round(area));
      if (publishedIndex >= 0) return CONTAINER_HOUSE_LADDERS[product.houseLadder][publishedIndex] * config.quantity;
      const refIndex = houseSourceLadder.findIndex((entry) => entry.areaSqft === 200);
      const refPrice = CONTAINER_HOUSE_LADDERS[product.houseLadder][Math.max(0, refIndex)];
      return calculateAreaBandBase(area, refPrice / 200) * config.quantity;
    }
    return calculateAreaBandBase(area, product.referenceRate || 1250) * config.quantity;
  }, [area, colony, config.colonyVariant, config.quantity, houseSourceLadder, product]);

  const estimate = useMemo(() => {
    const lines: EstimateLine[] = [];
    if (basePrice === null) lines.push({ label: `${product.name} base`, amount: null, source: 'quotation' });
    else lines.push({ label: colony ? `${PRODUCT_LADDERS.labourColony[config.colonyVariant]?.label || 'Colony block'} × ${config.quantity}` : `Base cabin ${config.length}×${config.width} ft${config.quantity > 1 ? ` × ${config.quantity}` : ''}`, amount: basePrice, source: 'published' });
    let total = basePrice || 0;
    if (!colony && basePrice !== null) {
      if (config.height > 8.5) { const value = Math.round((basePrice / config.quantity) * 0.06 * (config.height - 8.5)) * config.quantity; lines.push({ label: `Height ${config.height} ft`, amount: value, source: 'market' }); total += value; }
      if (config.roof === 'Flat / mono-pitch') { const value = Math.round(basePrice * 0.04); lines.push({ label: 'Flat / mono-pitch roof', amount: value, source: 'market' }); total += value; }
      const structureRate = STRUCTURES.find((entry) => entry[0] === config.structure)?.[1] || 0;
      if (structureRate) { const value = Math.round(structureRate * area * config.quantity); lines.push({ label: config.structure, amount: value, source: 'market' }); total += value; }
      if (config.rooms > 1) { const value = Math.round((config.rooms - 1) * config.width * 8.5 * 300 * config.quantity); lines.push({ label: `${config.rooms} rooms, ${config.rooms - 1} partitions`, amount: value, source: 'market' }); total += value; }
      const wallArea = 2 * (config.length + config.width) * config.height;
      const surfaces: Array<[string, readonly (readonly [string, number])[], number]> = [['Wall finish', WALL_FINISHES, wallArea], ['Ceiling', CEILINGS, area], ['Flooring', FLOORING, area]];
      for (const [label, choices, surfaceArea] of surfaces) {
        const selected = label === 'Wall finish' ? config.wallFinish : label === 'Ceiling' ? config.ceiling : config.flooring;
        const rate = choices.find((entry) => entry[0] === selected)?.[1] || 0;
        if (rate) { const value = Math.round(rate * surfaceArea * config.quantity); lines.push({ label: `${label}: ${selected}`, amount: value, source: 'market' }); total += value; }
      }
      const thicknessRate = RATE_CARD.pufThicknessDeltaPerSqft[config.pufThickness];
      if (thicknessRate) { const value = Math.round(thicknessRate * (wallArea + area) * config.quantity); lines.push({ label: `${config.pufThickness} mm PUF panels`, amount: value, source: 'published' }); total += value; }
      config.doors.forEach((door, index) => {
        if (index === 0 && door.type === 'Steel door') return;
        const value = (door.type === 'Steel door' ? RATE_CARD.marketRates.steelDoor : RATE_CARD.marketRates.upvcGlassDoor) * config.quantity;
        lines.push({ label: `Door ${index + 1}: ${door.type}`, amount: value, source: 'market' }); total += value;
      });
      const windowRate = { 'uPVC Sliding': RATE_CARD.marketRates.upvcWindow, 'Aluminium Sliding': RATE_CARD.marketRates.aluminiumSliding, 'Openable uPVC': RATE_CARD.marketRates.openableUpvc, 'Fixed Glass': RATE_CARD.marketRates.fixedGlass } as const;
      config.windows.forEach((win, index) => { const value = Math.round(windowRate[win.type] * win.width * win.height * (win.track === '2.5 Track' ? 1.12 : 1) * config.quantity); lines.push({ label: `Window ${index + 1}: ${win.type} ${win.width}×${win.height} ft`, amount: value, source: 'market' }); total += value; });
    }
    ELECTRICAL.forEach(([label, rate]) => { const qty = config.electrical[label] || 0; if (qty > 0) { const value = colony ? null : rate * qty * config.quantity; lines.push({ label: `${qty} × ${label}`, amount: value, source: colony ? 'quotation' : 'market' }); if (value !== null) total += value; } });
    ADD_ONS.forEach(([label, rate]) => { const qty = config.addOns[label] || 0; if (qty > 0) { const value = colony ? null : rate * qty * config.quantity; lines.push({ label: `${qty} × ${label}`, amount: value, source: colony ? 'quotation' : 'market' }); if (value !== null) total += value; } });
    let transportNote = '';
    if (config.deliveryZone === 'Bangalore city' || config.deliveryZone === 'Delhi NCR') transportNote = 'Free delivery zone';
    else if (config.distanceKm > 0 && config.distanceKm < 100) transportNote = 'Under 100 km: confirmed at quotation';
    else if (config.distanceKm >= 100) {
      const bandIndex = Math.min(RATE_CARD.freight.bands20ft.length - 1, Math.max(0, Math.ceil((config.distanceKm - 100) / 50) - 1));
      const freight = RATE_CARD.freight.bands20ft[bandIndex] + (config.length > 20 || colony ? RATE_CARD.freight.trailer40ftDelta : 0);
      const value = freight * config.quantity; lines.push({ label: `Transport ${config.distanceKm} km`, amount: value, source: 'published' }); total += value;
    }
    if (config.installation) lines.push({ label: 'Installation', amount: null, source: 'quotation' });
    return { lines, total, transportNote, quoteOnly: basePrice === null };
  }, [area, basePrice, colony, config, product.name]);

  const gst = estimate.total * GST_RATE;
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('design', encodeDesign({ ...config, quote: initialConfig.quote }));
    return url.toString();
  }, [config]);
  const itemisedText = useMemo(() => {
    const items = estimate.lines.map((line) => `${line.label}: ${line.amount === null ? 'in quotation' : formatMoney(line.amount)}`).join(' | ');
    const total = estimate.quoteOnly ? 'price on request' : `${formatMoney(estimate.total)} ex-GST`;
    return `SAMAN ${product.name} configuration | ${items} | Total: ${total}`;
  }, [estimate, product.name]);

  useEffect(() => {
    setReference(makeReference());
    try {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get('design');
      if (shared) {
        const restoredDesign = decodeDesign(shared);
        if (restoredDesign) setConfig(restoredDesign);
        return;
      }
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const restoredDesign = decodeDesign(saved);
        if (restoredDesign) { setConfig(restoredDesign); setRestored(true); }
      }
    } catch { /* Storage and malformed links are deliberately non-fatal. */ }
  }, []);

  useEffect(() => {
    pushDataLayer('step_view', { calculator: 'cabin_cost_v9', step_number: step + 1, step_name: STEPS[step], product_type: config.productId });
  }, [config.productId, step]);

  const update = <K extends keyof CalculatorConfig>(key: K, value: CalculatorConfig[K]) => setConfig((current) => ({ ...current, [key]: value }));
  const updateQuote = (key: keyof QuoteFields, value: string) => setConfig((current) => ({ ...current, quote: { ...current.quote, [key]: value } }));

  const goToStep = (next: number) => {
    if (next > 1 && !sizeValid) { setStep(1); setNotice(SIZE_ERROR); return; }
    setNotice(''); setStep(Math.max(0, Math.min(8, next)));
    if (typeof window !== 'undefined') window.requestAnimationFrame(() => document.getElementById('calculator-step-panel')?.focus());
  };

  const saveDesign = () => {
    try { window.localStorage.setItem(STORAGE_KEY, encodeDesign({ ...config, quote: initialConfig.quote })); setNotice('Design saved on this device.'); }
    catch { setNotice('This browser could not save the design on this device.'); }
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setNotice('Link copied. Anyone who opens it sees this exact configuration.'); }
    catch { setNotice('Copy the share link from your browser address bar.'); }
  };

  const reset = () => { setConfig(initialConfig); setStep(0); setRestored(false); setNotice(''); setFormErrors({}); };

  const whatsapp = () => {
    pushDataLayer('whatsapp_share', { calculator: 'cabin_cost_v9', product_type: config.productId, page_path: '/cabin-cost-calculator' });
    window.open(`https://wa.me/918861622859?text=${encodeURIComponent(`${itemisedText}\n${shareUrl}`)}`, '_blank', 'noopener,noreferrer');
  };

  const printEstimate = () => {
    pushDataLayer('pdf_download', { calculator: 'cabin_cost_v9', product_type: config.productId, page_path: '/cabin-cost-calculator' });
    window.print();
  };

  const submitQuote = async (event: FormEvent) => {
    event.preventDefault();
    const errors: Partial<Record<keyof QuoteFields | 'form', string>> = {};
    if (!config.quote.fullName.trim() || !config.quote.mobile.trim()) errors.form = 'Please add your name and mobile number so our sales team can send your fixed quotation.';
    if (!/^\d{10}$/.test(config.quote.mobile.replace(/\D/g, ''))) errors.mobile = 'Enter a 10-digit Indian mobile number.';
    if (!config.quote.email.trim()) errors.email = 'Please add your email so we can send your quotation PDF.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.quote.email)) errors.email = 'Enter a valid email address.';
    setFormErrors(errors);
    if (Object.keys(errors).length) return;
    const words = config.quote.fullName.trim().split(/\s+/);
    const firstName = words.length === 1 ? words[0] : words.slice(0, -1).join(' ');
    const lastName = words.length === 1 ? words[0] : words[words.length - 1];
    setSubmitting(true);
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName, email: config.quote.email.trim(), phone: config.quote.mobile.replace(/\D/g, ''),
          productName: product.name, region: config.quote.state || config.deliveryZone,
          pageUrl: typeof window === 'undefined' ? '/cabin-cost-calculator' : window.location.href,
          message: `${itemisedText}\nReference: ${reference}\nLocation: ${[config.quote.city, config.quote.state].filter(Boolean).join(', ') || 'Not supplied'}\nCompany: ${config.quote.company || 'Not supplied'}\nNotes: ${config.quote.notes || 'None'}\nShare link: ${shareUrl}`,
        }),
      });
      if (!response.ok) throw new Error('Request failed');
      pushDataLayer('quote_submit', { calculator: 'cabin_cost_v9', product_type: config.productId, page_path: '/cabin-cost-calculator' });
      pushDataLayer('contact_form_submit', { form_type: 'cabin_cost_calculator', product_type: config.productId, page_path: '/cabin-cost-calculator' });
      setNotice('Configuration received. Our sales team will send your fixed, itemised quotation within 48 hours.');
      setFormErrors({});
    } catch {
      setNotice('We could not submit right now. Please try again, or WhatsApp us at +91 88616 22859 and we will take it from there.');
    } finally { setSubmitting(false); }
  };

  const colonySuggestion = useMemo(() => {
    if (!config.workers) return null;
    return PRODUCT_LADDERS.labourColony.map((variant, index) => {
      const capacity = variant.capacityMax || variant.capacityMin || 1;
      const quantity = Math.ceil(config.workers / capacity);
      return { index, quantity, capacity: capacity * quantity, cost: variant.priceExGst * quantity, variant };
    }).sort((a, b) => a.capacity - b.capacity || a.cost - b.cost)[0] || null;
  }, [config.workers]);

  const renderStep = () => {
    if (step === 0) return <><h2>Select your product</h2><p className="sub">Pick the cabin type closest to what you need.</p><div className="tiles">{PRODUCTS.map((item) => <Choice key={item.id} active={config.productId === item.id} onClick={() => update('productId', item.id)} ariaLabel={`Select ${item.name}`}><span className="tile-icon" aria-hidden="true">{item.icon}</span><strong>{item.name}</strong><small>{item.subtitle}</small><span className="price-line">{item.quoteOnly ? 'price on request' : item.id === 'labour-colony' ? `from ${formatMoney(PRODUCT_LADDERS.labourColony[0]?.priceExGst || 0)}` : item.houseLadder ? `from ${formatMoney(CONTAINER_HOUSE_LADDERS[item.houseLadder][0])}` : `from ${formatMoney(calculateAreaBandBase(100, item.referenceRate || 1250))}`}</span></Choice>)}</div></>;

    if (step === 1 && colony) return <><h2>Choose a colony configuration</h2><p className="sub">Published complete-building prices from the Labour Colony pages.</p><label className="field workers"><span>Workers to accommodate</span><input type="number" inputMode="numeric" min="1" value={config.workers || ''} onChange={(event) => update('workers', Number(event.target.value))} /></label>{colonySuggestion && <div className="scope-note"><strong>Suggested:</strong> {colonySuggestion.quantity} × {colonySuggestion.variant.label}, housing up to {colonySuggestion.capacity} workers. <button type="button" onClick={() => { update('colonyVariant', colonySuggestion.index); update('quantity', colonySuggestion.quantity); }}>Use suggestion</button></div>}<div className="tiles colony-tiles">{PRODUCT_LADDERS.labourColony.map((variant, index) => <Choice key={variant.label} active={config.colonyVariant === index} onClick={() => update('colonyVariant', index)}><strong>{variant.label}</strong><small>{variant.areaSqft.toLocaleString('en-IN')} sq ft · {variant.capacity}</small><span className="price-line">{formatMoney(variant.priceExGst)} ex-GST</span></Choice>)}</div><label className="field compact"><span>Building quantity</span><input type="number" inputMode="numeric" min="1" max="50" value={config.quantity} onChange={(event) => update('quantity', Math.max(1, Number(event.target.value)))} /></label></>;

    if (step === 1) return <><h2>Enter the size</h2><p className="sub">Any size from 6 to 60 ft. Published sizes and custom sizes use the approved formula.</p><div className="size-plan"><div><div className="field-grid">{([['Length', 'length', 6, 60, 1], ['Width', 'width', 6, 60, 1], ['Height', 'height', 8.5, 12, 0.5], ['Quantity', 'quantity', 1, 20, 1]] as const).map(([label, key, min, max, increment]) => <label className="field" key={key}><span>{label}</span><input type="number" inputMode={increment < 1 ? 'decimal' : 'numeric'} min={min} max={max} step={increment} value={config[key]} aria-invalid={(key === 'length' || key === 'width') && !sizeValid} aria-describedby={!sizeValid ? 'size-error' : undefined} onChange={(event) => update(key, Number(event.target.value))} /></label>)}</div>{!sizeValid && <p id="size-error" className="error" role="alert">{SIZE_ERROR}</p>}<div className="area-card"><span>Carpet area</span><strong>{config.length} × {config.width} = {area.toLocaleString('en-IN')} sq ft</strong></div><h3>Rooms and roof</h3><div className="choices">{[1, 2, 3, 4].map((rooms) => <Choice key={rooms} active={config.rooms === rooms} onClick={() => update('rooms', rooms)}>{rooms === 1 ? 'Single room' : `${rooms} rooms`}</Choice>)}</div><div className="choices"><Choice active={config.roof === 'Sloped'} onClick={() => update('roof', 'Sloped')}>Sloped roof · included</Choice><Choice active={config.roof === 'Flat / mono-pitch'} onClick={() => update('roof', 'Flat / mono-pitch')}>Flat / mono-pitch · +4%</Choice></div></div><div><div className="view-tabs"><Choice active={config.planView === 'plan'} onClick={() => update('planView', 'plan')}>2D Plan</Choice><Choice active={config.planView === 'elevations'} onClick={() => update('planView', 'elevations')}>4 Elevations</Choice></div><PlanGraphic config={config} /></div></div></>;

    if (step === 2) return colony ? <><h2>Building scope</h2><p className="scope-note">{SCOPE_NOTE}</p></> : <><h2>Select structure</h2><p className="sub">The frame and shell affect durability and price.</p><div className="tiles four">{STRUCTURES.map(([label, rate]) => <Choice key={label} active={config.structure === label} onClick={() => update('structure', label)}><strong>{label}</strong><small>{rate === 0 ? 'Published base specification' : `+${formatMoney(rate)} per sq ft`}</small></Choice>)}</div><h3>Plan rooms and roof</h3><div className="choices">{[1, 2, 3, 4].map((rooms) => <Choice key={rooms} active={config.rooms === rooms} onClick={() => update('rooms', rooms)}>{rooms === 1 ? 'Single room' : `${rooms} rooms`}</Choice>)}</div><div className="choices"><Choice active={config.roof === 'Sloped'} onClick={() => update('roof', 'Sloped')}>Sloped roof</Choice><Choice active={config.roof === 'Flat / mono-pitch'} onClick={() => update('roof', 'Flat / mono-pitch')}>Flat / mono-pitch</Choice></div></>;

    if (step === 3) return colony ? <><h2>Approved building finish</h2><p className="scope-note">{SCOPE_NOTE}</p></> : <><h2>Interior finish</h2><p className="sub">Standard finishes are included. Upgrade rates apply to the surface they cover.</p>{([['Internal wall', WALL_FINISHES, 'wallFinish'], ['Ceiling', CEILINGS, 'ceiling'], ['Flooring', FLOORING, 'flooring']] as const).map(([heading, choices, key]) => <section className="option-section" key={heading}><h3>{heading}</h3><div className="choices">{choices.map(([label, rate]) => <Choice key={label} active={config[key] === label} onClick={() => update(key, label)}>{label}<small>{rate === 0 ? 'Included' : `${rate > 0 ? '+' : '−'}${formatMoney(Math.abs(rate))}/sq ft`}</small></Choice>)}</div></section>)}<section className="option-section"><h3>PUF panel thickness</h3><div className="choices">{([30, 40, 50, 60, 80] as const).map((thickness) => <Choice key={thickness} active={config.pufThickness === thickness} onClick={() => update('pufThickness', thickness)}>{thickness} mm<small>{RATE_CARD.pufThicknessDeltaPerSqft[thickness] === 0 ? 'Standard' : `${RATE_CARD.pufThicknessDeltaPerSqft[thickness] > 0 ? '+' : '−'}${formatMoney(Math.abs(RATE_CARD.pufThicknessDeltaPerSqft[thickness]))}/sq ft`}</small></Choice>)}</div></section></>;

    if (step === 4) return colony ? <><h2>Doors and windows</h2><p className="scope-note">{SCOPE_NOTE}</p></> : <><h2>Doors and windows</h2><p className="sub">Choose every opening and place it on the live plan. The first steel door is included.</p><div className="opening-layout"><div><div className="section-title"><h3>Doors ({config.doors.length})</h3><button type="button" onClick={() => update('doors', [...config.doors, { ...initialConfig.doors[0], position: 50 }])}>Add door</button></div>{config.doors.map((door, index) => <fieldset className="opening-card" key={index}><legend>Door {index + 1}</legend><label className="field"><span>Type</span><select value={door.type} onChange={(event) => update('doors', config.doors.map((item, itemIndex) => itemIndex === index ? { ...item, type: event.target.value as DoorConfig['type'] } : item))}><option>Steel door</option><option>Glass / Aluminium / uPVC door</option></select></label><div className="choices">{WALLS.map((wall) => <Choice key={wall} active={door.wall === wall} onClick={() => update('doors', config.doors.map((item, itemIndex) => itemIndex === index ? { ...item, wall } : item))}>{wall}</Choice>)}</div><label className="field"><span>Position from corner: {door.position}%</span><input type="range" inputMode="numeric" min="8" max="92" value={door.position} aria-label={`Door ${index + 1} position`} onChange={(event) => update('doors', config.doors.map((item, itemIndex) => itemIndex === index ? { ...item, position: Number(event.target.value) } : item))} /></label><div className="choices">{(['Left', 'Right'] as const).map((hinge) => <Choice key={hinge} active={door.hinge === hinge} onClick={() => update('doors', config.doors.map((item, itemIndex) => itemIndex === index ? { ...item, hinge } : item))}>{`Hinge ${hinge}`}</Choice>)}{(['In', 'Out'] as const).map((opening) => <Choice key={opening} active={door.opening === opening} onClick={() => update('doors', config.doors.map((item, itemIndex) => itemIndex === index ? { ...item, opening } : item))}>{`Opens ${opening}`}</Choice>)}</div>{config.doors.length > 1 && <button type="button" className="remove" onClick={() => update('doors', config.doors.filter((_, itemIndex) => itemIndex !== index))}>Remove door</button>}</fieldset>)}</div><div><div className="section-title"><h3>Windows ({config.windows.length})</h3><button type="button" onClick={() => update('windows', [...config.windows, { ...initialConfig.windows[0], position: 50 }])}>Add window</button></div>{config.windows.map((win, index) => <fieldset className="opening-card" key={index}><legend>Window {index + 1}</legend><label className="field"><span>Type</span><select value={win.type} onChange={(event) => update('windows', config.windows.map((item, itemIndex) => itemIndex === index ? { ...item, type: event.target.value as WindowConfig['type'] } : item))}>{['uPVC Sliding', 'Aluminium Sliding', 'Openable uPVC', 'Fixed Glass'].map((type) => <option key={type}>{type}</option>)}</select></label><div className="field-grid"><label className="field"><span>Width, ft</span><input type="number" inputMode="decimal" min="1" max="8" value={win.width} onChange={(event) => update('windows', config.windows.map((item, itemIndex) => itemIndex === index ? { ...item, width: Number(event.target.value) } : item))} /></label><label className="field"><span>Height, ft</span><input type="number" inputMode="decimal" min="1" max="6" value={win.height} onChange={(event) => update('windows', config.windows.map((item, itemIndex) => itemIndex === index ? { ...item, height: Number(event.target.value) } : item))} /></label></div><div className="choices">{(['2 Track', '2.5 Track'] as const).map((track) => <Choice key={track} active={win.track === track} onClick={() => update('windows', config.windows.map((item, itemIndex) => itemIndex === index ? { ...item, track } : item))}>{track}</Choice>)}</div><div className="choices">{WALLS.map((wall) => <Choice key={wall} active={win.wall === wall} onClick={() => update('windows', config.windows.map((item, itemIndex) => itemIndex === index ? { ...item, wall } : item))}>{wall}</Choice>)}</div><label className="field"><span>Position from corner: {win.position}%</span><input type="range" inputMode="numeric" min="8" max="92" value={win.position} aria-label={`Window ${index + 1} position`} onChange={(event) => update('windows', config.windows.map((item, itemIndex) => itemIndex === index ? { ...item, position: Number(event.target.value) } : item))} /></label><button type="button" className="remove" onClick={() => update('windows', config.windows.filter((_, itemIndex) => itemIndex !== index))}>Remove window</button></fieldset>)}<div className="view-tabs"><Choice active={config.planView === 'plan'} onClick={() => update('planView', 'plan')}>2D Plan</Choice><Choice active={config.planView === 'elevations'} onClick={() => update('planView', 'elevations')}>4 Elevations</Choice></div><PlanGraphic config={config} /></div></div></>;

    if (step === 5) return <><h2>Electrical</h2><p className="sub">Suggested quantities follow the floor area. Adjust every item freely.{colony ? ' Colony selections are quotation items per building.' : ''}</p>{ELECTRICAL.map(([label, rate, divisor]) => { const suggested = divisor === -1 ? 1 : divisor ? Math.ceil(area / divisor) : 0; return <QuantityRow key={label} label={label} help={suggested ? `Suggested for this area: ${suggested}` : 'Optional'} price={rate} value={config.electrical[label] || 0} quotation={colony} onChange={(value) => update('electrical', { ...config.electrical, [label]: value })} />; })}<h3>Light options</h3><div className="choices"><Choice active={config.lightColour === 'White'} onClick={() => update('lightColour', 'White')}>White</Choice><Choice active={config.lightColour === 'Warm'} onClick={() => update('lightColour', 'Warm')}>Warm</Choice><Choice active={config.lightShape === 'Square'} onClick={() => update('lightShape', 'Square')}>Square LED</Choice><Choice active={config.lightShape === 'Round'} onClick={() => update('lightShape', 'Round')}>Round LED</Choice></div></>;

    if (step === 6) return <><h2>Optional add-ons</h2><p className="sub">Furniture and fittings. Add only what you need.{colony ? ' Colony selections are quotation items per building.' : ''}</p>{ADD_ONS.map(([label, rate]) => <QuantityRow key={label} label={label} price={rate} value={config.addOns[label] || 0} quotation={colony} onChange={(value) => update('addOns', { ...config.addOns, [label]: value })} />)}<h3>Furniture position</h3><div className="choices"><Choice active={config.furniturePosition === 'Wall attached'} onClick={() => update('furniturePosition', 'Wall attached')}>Wall attached</Choice><Choice active={config.furniturePosition === 'Centre'} onClick={() => update('furniturePosition', 'Centre')}>Centre</Choice></div><h3>Shifting and mobility</h3><div className="choices"><Choice active={config.mobility === '100% movable'} onClick={() => update('mobility', '100% movable')}>100% movable</Choice><Choice active={config.mobility === 'Fixed / semi-permanent'} onClick={() => update('mobility', 'Fixed / semi-permanent')}>Fixed / semi-permanent</Choice></div></>;

    if (step === 7) return <><h2>Delivery and installation</h2><p className="sub">Transport follows the published 20 ft trailer bands, with ₹5,000 added for a 40 ft trailer.</p><h3>Delivery zone</h3><div className="choices">{(['Bangalore city', 'Delhi NCR', 'Other'] as const).map((zone) => <Choice key={zone} active={config.deliveryZone === zone} onClick={() => update('deliveryZone', zone)}>{zone}{zone !== 'Other' ? ' · free' : ' · by distance'}</Choice>)}</div>{config.deliveryZone === 'Other' && <label className="field compact"><span>Road distance, km</span><input type="number" inputMode="numeric" min="0" max="1000" value={config.distanceKm || ''} onChange={(event) => update('distanceKm', Number(event.target.value))} /><small>Under 100 km is confirmed at quotation.</small></label>}<label className="toggle-row"><input type="checkbox" checked={config.installation} onChange={(event) => update('installation', event.target.checked)} /><span><strong>Installation required</strong><small>Site assembly is confirmed in the fixed quotation.</small></span></label><p className="scope-note">Delivery in 7 to 21 working days. Freight is confirmed once the exact delivery location and order are approved.</p></>;

    return <><h2>Get your official quotation</h2><p className="sub">Submit the exact configuration for a fixed, itemised quotation within 48 hours.</p><div className="review-lines">{estimate.lines.map((line, index) => <div key={`${line.label}-${index}`}><span>{line.label}</span><strong>{line.amount === null ? 'in quotation' : formatMoney(line.amount)}</strong></div>)}{estimate.transportNote && <div><span>Transport</span><strong>{estimate.transportNote}</strong></div>}<div className="review-total"><span>Estimated total, ex-GST</span><strong>{estimate.quoteOnly ? 'Price on request' : formatMoney(estimate.total)}</strong></div><div className="muted-total"><span>GST at 18%</span><span>{estimate.quoteOnly ? 'Itemised in quotation' : formatMoney(gst)}</span></div><div className="muted-total"><span>Including GST</span><span>{estimate.quoteOnly ? 'Itemised in quotation' : formatMoney(estimate.total + gst)}</span></div></div><form className="quote-form" onSubmit={submitQuote} noValidate>{formErrors.form && <p className="error full" role="alert">{formErrors.form}</p>}<label className="field"><span>Full name *</span><input autoComplete="name" value={config.quote.fullName} onChange={(event) => updateQuote('fullName', event.target.value)} /></label><label className="field"><span>Mobile / WhatsApp *</span><input type="tel" inputMode="numeric" autoComplete="tel" value={config.quote.mobile} aria-invalid={Boolean(formErrors.mobile)} onChange={(event) => updateQuote('mobile', event.target.value)} />{formErrors.mobile && <small className="error" role="alert">{formErrors.mobile}</small>}</label><label className="field"><span>Email *</span><input type="email" inputMode="email" autoComplete="email" value={config.quote.email} aria-invalid={Boolean(formErrors.email)} onChange={(event) => updateQuote('email', event.target.value)} />{formErrors.email && <small className="error" role="alert">{formErrors.email}</small>}</label><label className="field"><span>Company</span><input autoComplete="organization" value={config.quote.company} onChange={(event) => updateQuote('company', event.target.value)} /></label><label className="field"><span>City</span><input autoComplete="address-level2" value={config.quote.city} onChange={(event) => updateQuote('city', event.target.value)} /></label><label className="field"><span>State</span><input autoComplete="address-level1" value={config.quote.state} onChange={(event) => updateQuote('state', event.target.value)} /></label><label className="field full"><span>Requirement notes</span><textarea rows={4} value={config.quote.notes} onChange={(event) => updateQuote('notes', event.target.value)} /></label><button className="primary full" disabled={submitting} type="submit">{submitting ? 'Submitting…' : 'Get My Official Quotation'}</button></form></>;
  };

  const estimatePanel = <><div className="estimate-heading"><strong>Live estimate</strong><span>{area.toLocaleString('en-IN')} sq ft</span></div><div className="estimate-lines">{estimate.lines.map((line, index) => <div key={`${line.label}-${index}`}><span>{line.label}</span><strong>{line.amount === null ? 'in quotation' : `${index ? '+' : ''}${formatMoney(line.amount)}`}</strong></div>)}{estimate.transportNote && <div className="muted"><span>Transport</span><span>{estimate.transportNote}</span></div>}</div><div className="total"><small>Estimated total, ex-GST</small><strong>{estimate.quoteOnly ? 'Price on request' : formatMoney(estimate.total)}</strong><span>{estimate.quoteOnly ? 'Fixed quotation within 48 hours' : `${formatMoney(estimate.total + gst)} incl. 18% GST`}</span></div><div className="estimate-actions"><button type="button" onClick={printEstimate}>PDF</button><button type="button" onClick={whatsapp}>WhatsApp</button><button type="button" onClick={copyLink}>Copy link</button></div><button type="button" className="primary" onClick={() => goToStep(8)}>Get Official Quotation</button><p className="fine">Indicative estimate from the published price list, ex-factory and ex-GST. GST at 18% is itemised separately. Market items use the approved rate card. Final pricing follows drawing and location review.</p></>;

  const printDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <section className="calc" data-theme={theme} aria-label="Cabin cost calculator">
      <div className="print-letterhead"><strong>SAMAN POS India Private Limited · SAMAN Portable</strong><span>Founded 2009 · Incorporated 2019 · ISO 9001:2015</span><span>Bengaluru (Unit 1): +91 88616 22859 · sales@samanportable.com</span><span>Greater Noida (Unit 2): +91 87960 39938 · ncr@samanportable.com</span><span>www.samanportable.com</span></div>
      <header className="calculator-header"><div><small>Customized cabin</small><strong>{product.name}</strong><span>{colony ? `${PRODUCT_LADDERS.labourColony[config.colonyVariant]?.label || ''} · qty ${config.quantity}` : `${config.length}×${config.width} ft · ${area.toLocaleString('en-IN')} sq ft`}</span></div><div className="header-price"><small>Estimated price, ex-GST</small><strong>{estimate.quoteOnly ? 'On request' : formatMoney(estimate.total)}</strong><span>{estimate.quoteOnly ? 'fixed quotation in 48 hours' : `${formatMoney(estimate.total + gst)} incl. GST`}</span></div><button type="button" className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? 'Dark' : 'Light'} mode</button></header>
      {restored && <div className="restore-banner" role="status">Your saved design has been restored. Start over to begin fresh.</div>}
      {notice && <div className="notice" role="status">{notice}</div>}
      <div className="calculator-grid">
        <div className="step-card">
          <div className="step-top"><strong>Step {step + 1} of 9 · {STEPS[step]}</strong><button type="button" onClick={saveDesign}>Save design</button></div>
          <nav className="steps" aria-label="Calculator steps">{STEPS.map((label, index) => <button type="button" key={label} aria-current={index === step ? 'step' : undefined} className={index === step ? 'active' : index < step ? 'done' : ''} onClick={() => goToStep(index)}>{label}</button>)}</nav>
          <div id="calculator-step-panel" className="step-panel" tabIndex={-1}>{renderStep()}</div>
          <div className="navigation"><button type="button" onClick={() => goToStep(step - 1)} disabled={step === 0}>Back</button><button type="button" className="text-button" onClick={reset}>Start over</button>{step < 8 && <button type="button" className="primary" onClick={() => goToStep(step + 1)}>Next</button>}</div>
        </div>
        <aside className="estimate-card" aria-label="Live itemised estimate">{estimatePanel}</aside>
      </div>
      <div className={`mobile-estimate${mobileEstimateOpen ? ' open' : ''}`}><button type="button" className="mobile-summary" aria-expanded={mobileEstimateOpen} onClick={() => setMobileEstimateOpen(!mobileEstimateOpen)}><span>Total, ex-GST</span><strong>{estimate.quoteOnly ? 'On request' : formatMoney(estimate.total)}</strong><span aria-hidden="true">{mobileEstimateOpen ? '↓' : '↑'}</span></button>{mobileEstimateOpen && <div className="mobile-sheet">{estimatePanel}</div>}</div>
      <footer className="print-footer">Indicative estimate {reference} · {printDate} · Fixed, itemised quotation within 48 hours of submission.</footer>
      <style jsx>{`
        .calc{--bg:#f4f8f5;--panel:#fff;--panel2:#f0f7f2;--border:#d5e3d9;--text:#1d2b22;--muted:#5c6f64;--accent:#2d7a3f;--accentSoft:#e4f0e8;--danger:#b42318;background:var(--bg);color:var(--text);padding:16px;border-radius:20px;min-height:760px}.calc[data-theme="dark"]{--bg:#0c1310;--panel:#121c16;--panel2:#0e1712;--border:#26382c;--text:#eaf4ec;--muted:#9db2a4;--accent:#7fd49a;--accentSoft:#173722;--danger:#ff8b7e}.calculator-header{position:sticky;top:8px;z-index:12;display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:16px;padding:14px 18px;border:1px solid var(--border);border-radius:14px;background:var(--panel);box-shadow:0 8px 28px rgba(0,0,0,.12)}.calculator-header>div{display:flex;flex-direction:column}.calculator-header small,.calculator-header span{color:var(--muted);font-size:12px}.calculator-header strong{font-size:18px}.header-price{text-align:right}.header-price strong{font-size:25px;color:var(--accent)}button,input,select,textarea{font:inherit}button{min-height:44px;cursor:pointer}.theme-toggle,.step-top button,.estimate-actions button,.navigation>button,.section-title button,.scope-note button,.remove{border:1px solid var(--border);border-radius:9px;background:var(--panel2);color:var(--text);padding:8px 13px}.calculator-grid{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px;margin-top:16px}.step-card,.estimate-card{border:1px solid var(--border);border-radius:14px;background:var(--panel);padding:20px}.estimate-card{position:sticky;top:100px;align-self:start}.step-top,.estimate-heading,.navigation,.section-title{display:flex;align-items:center;justify-content:space-between;gap:12px}.steps,.choices,.view-tabs{display:flex;gap:7px;flex-wrap:wrap}.steps{margin:14px 0 18px}.steps button,.choice{border:1px solid var(--border);border-radius:999px;background:var(--panel2);color:var(--muted);padding:7px 12px}.steps button.active,.choice.active{border-color:var(--accent);background:var(--accentSoft);color:var(--text);font-weight:700}.steps button.done{border-color:var(--accent);color:var(--accent)}.step-panel{min-height:560px;outline:none}.step-panel:focus-visible{box-shadow:0 0 0 3px var(--accent);border-radius:8px}.step-panel h2{font-size:22px;margin:0 0 5px}.step-panel h3{font-size:15px;margin:18px 0 9px}.sub,.fine{color:var(--muted);line-height:1.5}.sub{margin:0 0 16px}.fine{font-size:11px}.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:10px}.tiles .choice{border-radius:12px;min-height:126px;text-align:left;display:flex;flex-direction:column;align-items:flex-start}.tiles.four{grid-template-columns:repeat(2,minmax(0,1fr))}.tile-icon{font-size:22px;color:var(--accent)}.choice small{display:block;font-size:11px;color:var(--muted);margin-top:3px}.price-line{margin-top:auto;color:var(--accent);font-weight:700;font-size:12px}.field-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.field{display:flex;flex-direction:column;gap:5px;color:var(--muted);font-size:13px}.field input,.field select,.field textarea{width:100%;min-height:44px;border:1px solid var(--border);border-radius:8px;background:var(--panel2);color:var(--text);padding:9px 11px}.field input[type="range"]{padding:0}.field.compact{max-width:320px;margin-top:14px}.field.workers{max-width:360px;margin-bottom:12px}.size-plan,.opening-layout{display:grid;grid-template-columns:1fr 1fr;gap:16px}.size-plan svg,.opening-layout svg{width:100%;min-height:220px;border:1px solid var(--border);border-radius:12px;background:var(--panel2)}.area-card,.scope-note,.notice,.restore-banner{border:1px solid var(--border);border-radius:9px;background:var(--panel2);padding:11px 13px;margin:12px 0}.area-card{display:flex;flex-direction:column}.area-card span{color:var(--muted);font-size:11px;text-transform:uppercase}.error{color:var(--danger)!important;font-size:12px;line-height:1.4;margin:5px 0}.option-section{margin-top:17px}.quantity-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:9px 11px;margin:7px 0;border:1px solid var(--border);border-radius:10px;background:var(--panel2)}.quantity-row>div:first-child{display:flex;flex-direction:column}.quantity-row small{color:var(--muted)}.quantity-controls{display:flex;align-items:center;gap:6px}.quantity-controls button{width:44px;border:1px solid var(--border);border-radius:8px;background:var(--panel);color:var(--text);font-weight:800}.quantity-controls output{min-width:24px;text-align:center}.rate-tag{font-size:11px;color:var(--accent);font-weight:700}.opening-card{border:1px solid var(--border);border-radius:11px;padding:12px;margin:8px 0;background:var(--panel2)}.opening-card legend{font-weight:700;padding:0 5px}.opening-card .choices{margin:9px 0}.remove{color:var(--danger);margin-top:6px}.toggle-row{display:flex;gap:12px;align-items:center;border:1px solid var(--border);border-radius:10px;padding:12px;margin-top:14px}.toggle-row input{width:24px;height:24px}.toggle-row span{display:flex;flex-direction:column}.toggle-row small{color:var(--muted)}.review-lines,.estimate-lines{display:flex;flex-direction:column}.review-lines>div,.estimate-lines>div{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px}.review-lines strong,.estimate-lines strong{text-align:right}.review-total{margin-top:8px;font-size:16px}.muted-total,.estimate-lines .muted{color:var(--muted)}.quote-form{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:16px}.quote-form .full{grid-column:1/-1}.primary{border:0;border-radius:9px;background:var(--accent);color:${theme === 'dark' ? '#0c1310' : '#fff'};font-weight:800;padding:10px 16px;min-height:44px}.primary:disabled{opacity:.55}.navigation{margin-top:18px}.text-button{border-color:transparent!important;background:transparent!important;color:var(--muted)!important}.estimate-heading{font-size:13px;text-transform:uppercase;color:var(--accent);margin-bottom:10px}.estimate-heading span{color:var(--muted);font-size:11px}.total{text-align:center;border:1px solid var(--border);border-radius:11px;background:var(--accentSoft);padding:13px;margin:12px 0;display:flex;flex-direction:column}.total small{text-transform:uppercase;color:var(--muted)}.total strong{font-size:25px}.total span{font-size:11px;color:var(--muted)}.estimate-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.estimate-actions button{border:1px solid var(--border);border-radius:8px;background:var(--panel2);color:var(--text)}.estimate-card>.primary,.mobile-sheet>.primary{width:100%;margin-top:9px}.mobile-estimate{display:none}.print-letterhead,.print-footer{display:none}.notice,.restore-banner{color:var(--accent);font-weight:600}.restore-banner{margin-top:12px}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid var(--accent);outline-offset:2px}.shell{fill:var(--accentSoft);stroke:var(--accent);stroke-width:2}.partition{stroke:var(--muted);stroke-dasharray:4 3}.door-mark{fill:#e0ad20}.window-mark{fill:#368dcc}.size-plan text,.opening-layout text{fill:var(--muted);font-size:9px;text-anchor:middle}
        @media(max-width:980px){.calculator-grid{grid-template-columns:1fr}.estimate-card{position:static}.opening-layout{grid-template-columns:1fr 1fr}}
        @media(max-width:600px){.calc{padding:10px 10px 88px;border-radius:0}.calculator-header{grid-template-columns:1fr auto;top:4px}.header-price{display:none}.theme-toggle{padding:6px 9px}.step-card{padding:14px}.step-panel{min-height:610px}.steps{flex-wrap:nowrap;overflow-x:auto;padding:3px}.steps button{white-space:nowrap}.tiles,.tiles.four,.size-plan,.opening-layout,.quote-form{grid-template-columns:1fr}.field-grid{grid-template-columns:1fr 1fr}.quantity-row{align-items:flex-start;flex-direction:column}.quantity-controls{width:100%;justify-content:flex-end}.rate-tag{margin-right:auto}.estimate-card{display:none}.mobile-estimate{display:block;position:fixed;left:0;right:0;bottom:0;z-index:40;background:var(--panel);border-top:1px solid var(--border);box-shadow:0 -8px 24px rgba(0,0,0,.2)}.mobile-summary{width:100%;min-height:64px;border:0;background:var(--panel);color:var(--text);display:grid;grid-template-columns:1fr auto 28px;align-items:center;gap:8px;padding:9px 14px;text-align:left}.mobile-summary strong{font-size:20px;color:var(--accent)}.mobile-sheet{max-height:68vh;overflow-y:auto;padding:12px 14px 18px;border-top:1px solid var(--border)}.mobile-sheet .estimate-heading{display:none}.mobile-estimate.open{max-height:85vh}.quote-form .full{grid-column:1}.navigation .primary{min-width:88px}}
      `}</style>
      <style jsx global>{`
        @media print{body *{visibility:hidden!important}.calc,.calc *{visibility:visible!important}.calc{position:absolute;inset:0;background:#fff!important;color:#111!important;padding:20px!important}.calculator-header,.step-card,.estimate-card .estimate-actions,.estimate-card>.primary,.mobile-estimate,.notice,.restore-banner{display:none!important}.calculator-grid{display:block!important}.estimate-card{display:block!important;position:static!important;border:0!important;padding:0!important}.print-letterhead,.print-footer{display:flex!important;flex-direction:column;gap:4px;color:#111!important}.print-letterhead{border-bottom:2px solid #275c3c;padding-bottom:12px;margin-bottom:18px}.print-letterhead strong{font-size:18px}.print-letterhead span{font-size:11px}.print-footer{position:fixed;bottom:12px;left:20px;right:20px;border-top:1px solid #999;padding-top:7px;font-size:10px}.estimate-lines>div,.total{color:#111!important;background:#fff!important;border-color:#ccc!important}.fine{color:#555!important}}
      `}</style>
    </section>
  );
}
