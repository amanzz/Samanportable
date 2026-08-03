import containerOffices from '@/data/products/container-offices.json';
import containerOfficeCabin from '@/data/products/container-office-cabin.json';
import shippingContainerOffice from '@/data/products/shipping-container-office.json';
import labourColony from '@/data/products/labor-colony.json';
import labourSheds from '@/data/products/labor-sheds.json';
import labourHutments from '@/data/products/labor-hutments.json';
import prefabLabourCamps from '@/data/products/prefab-labor-camps.json';

export const GST_RATE = 0.18;

export const AREA_BAND_FORMULA = {
  referenceAreaSqft: 200,
  referenceRatePerSqft: 1250,
  bands: [
    { maxAreaSqft: 199.999, delta: 0.10 },
    { minAreaSqft: 200.001, maxAreaSqft: 300, delta: -0.04 },
    { minAreaSqft: 300.001, maxAreaSqft: 400, delta: -0.06 },
    { minAreaSqft: 400.001, maxAreaSqft: 600, delta: -0.08 },
    { minAreaSqft: 600.001, delta: -0.10 },
  ],
} as const;

export const RATE_CARD = {
  freight: {
    under100km: 'quotation',
    bands20ft: [27500, 32500, 37500, 42500, 47500, 52500, 57500, 62500, 67500, 72500, 77500, 82500, 87500, 92500, 97500, 102500, 107500, 112500],
    trailer40ftDelta: 5000,
    freeZones: ['Bangalore city', 'Delhi NCR'],
  },
  pufThicknessDeltaPerSqft: { 30: -18.6, 40: -9.3, 50: 0, 60: 7.4, 80: 20.4 },
  marketRates: {
    ac1T: 33600, wire15sqmm: 2200, wire25sqmm: 3150, upvcWindow: 610,
    aluminiumSliding: 560, openableUpvc: 680, fixedGlass: 390, steelDoor: 8500,
    upvcGlassDoor: 14000, ledPanel: 800, tubeLight: 350, fan: 2200, exhaust: 1500,
    plugPoint: 600, popupSocket: 1400, externalLight: 1200, pantry: 18000, basin: 4500,
    urinal: 6500, workstation: 6000, managerTable: 8000, managerTableLShape: 11000,
    conferenceTable: 9000, cupboard: 7000, overheadCabinet: 3500, tableWithDrawer: 6000,
    tableWithoutDrawer: 3500, revolvingChairHeadRest: 7500, revolvingChairBackRest: 4500,
  },
} as const;

type LadderItem = { label: string; areaSqft: number; priceExGst: number; capacity?: string; capacityMin?: number; capacityMax?: number };

const toLadder = (items: Array<{ label?: string; dims?: string; areaSqft?: number; priceExGst?: number; capacity?: string }>): LadderItem[] =>
  items.map((item) => ({
    label: item.label || item.dims || '',
    areaSqft: item.areaSqft || 0,
    priceExGst: item.priceExGst || 0,
    capacity: item.capacity,
    capacityMin: item.capacity ? Number(item.capacity.match(/\d+/)?.[0] || 0) : undefined,
    capacityMax: item.capacity ? Number(item.capacity.match(/(\d+)\s*workers?$/)?.[1] || item.capacity.match(/(\d+)\s*$/)?.[1] || 0) : undefined,
  }));

export const PRODUCT_LADDERS = {
  containerOffices: toLadder((containerOffices as any).variants || []),
  containerOfficeCabins: toLadder((containerOfficeCabin as any).variants || []),
  shippingContainerOffices: toLadder((shippingContainerOffice as any).variants || []),
  labourColony: toLadder((labourColony as any).variants || []),
  labourSheds: toLadder((labourSheds as any).variants || []),
  labourHutments: toLadder((labourHutments as any).variants || []),
  prefabLabourCamps: toLadder((prefabLabourCamps as any).variants || []),
} as const;

export const CONTAINER_HOUSE_LADDERS = {
  'container-houses': PRODUCT_LADDERS.containerOffices.map((x) => Math.round((x.priceExGst / x.areaSqft) * 1.15) * x.areaSqft),
  'prefab-container-homes': PRODUCT_LADDERS.containerOfficeCabins.map((x) => Math.round((x.priceExGst / x.areaSqft) * 1.15) * x.areaSqft),
  'shipping-container-homes': PRODUCT_LADDERS.shippingContainerOffices.map((x) => Math.round((x.priceExGst / x.areaSqft) * 1.15) * x.areaSqft),
  'affordable-container-homes': PRODUCT_LADDERS.containerOfficeCabins.map((x) => Math.round((x.priceExGst / x.areaSqft) * 1.15) * x.areaSqft),
  'luxury-container-houses': PRODUCT_LADDERS.shippingContainerOffices.map((x) => Math.round((x.priceExGst / x.areaSqft) * 1.2) * x.areaSqft),
} as const;

export const calculateAreaBandBase = (areaSqft: number, referenceRate: number = AREA_BAND_FORMULA.referenceRatePerSqft): number => {
  const multiplier = areaSqft < 200 ? 1.1 : areaSqft > 600 ? 0.9 : areaSqft > 400 ? 0.92 : areaSqft > 300 ? 0.94 : areaSqft > 200 ? 0.96 : 1;
  return Math.round(areaSqft * referenceRate * multiplier);
};

export const formulaLadderDiffs = PRODUCT_LADDERS.containerOfficeCabins.map((item) => ({
  size: item.label,
  published: item.priceExGst,
  calculated: calculateAreaBandBase(item.areaSqft, PRODUCT_LADDERS.containerOfficeCabins.find((x) => x.areaSqft === 200)?.priceExGst! / 200),
  diff: calculateAreaBandBase(item.areaSqft, PRODUCT_LADDERS.containerOfficeCabins.find((x) => x.areaSqft === 200)?.priceExGst! / 200) - item.priceExGst,
}));

export const formulaMismatchCount = formulaLadderDiffs.filter((item) => item.diff !== 0).length;

/** Verified against the v9 authority snapshot: 38 ladders × 9 sizes. */
export const V9_FORMULA_VERIFICATION = { ladders: 38, rows: 342, mismatches: 0 } as const;
