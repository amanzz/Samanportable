import { GST_RATE } from "@/lib/taxRates";

export type PriceCalculatorZone = "South" | "North" | "";

export type TransportOption =
  | "Transport required"
  | "Transport to be confirmed"
  | "Discuss with SAMAN";

export type InstallationOption =
  | "Installation required"
  | "Installation not required"
  | "Discuss with SAMAN";

export type GstOption = "GST extra" | "GST included guidance" | "Discuss with SAMAN";

export type CalculatorProductId =
  | "porta_cabin"
  | "container_office"
  | "portable_cabin"
  | "labor_colony"
  | "container_cafe"
  | "portable_office_cabin"
  | "container_house"
  | "security_cabin"
  | "portable_toilet"
  | "industrial_shed"
  | "peb_construction"
  | "pre_engineered_building"
  | "prefab_building"
  | "prefabricated_house"
  | "puf_panel"
  | "rockwool_panel"
  | "pir_panel"
  | "custom_requirement_quote";

export type SpecialScopeProductId =
  | "labor_colony"
  | "industrial_shed"
  | "peb_construction"
  | "pre_engineered_building"
  | "prefab_building";

export const STANDARD_PRODUCTS: CalculatorProductId[] = [
  "porta_cabin",
  "container_office",
  "portable_cabin",
  "labor_colony",
  "container_cafe",
  "portable_office_cabin",
  "container_house",
  "security_cabin",
  "portable_toilet",
  "industrial_shed",
  "peb_construction",
  "pre_engineered_building",
  "prefab_building",
  "prefabricated_house",
  "puf_panel",
  "rockwool_panel",
  "pir_panel",
];

export const CUSTOM_PRODUCT_ID = "custom_requirement_quote";

export const PANEL_PRODUCTS = new Set<CalculatorProductId>([
  "puf_panel",
  "rockwool_panel",
  "pir_panel",
]);

export const SPECIAL_SCOPE_PRODUCTS = new Set<SpecialScopeProductId>([
  "labor_colony",
  "industrial_shed",
  "peb_construction",
  "pre_engineered_building",
  "prefab_building",
]);

export const SPECIAL_PANEL_SHEET_OPTIONS = [
  "PUF / Puff 50MM",
  "PUF / Puff 75MM",
  "PUF / Puff 100MM",
  "PPGI",
] as const;

export const SPECIAL_FLOOR_STRUCTURE_OPTIONS = ["Single Floor", "G+1", "G+2"] as const;

export const PRODUCT_LABELS: Record<CalculatorProductId, string> = {
  porta_cabin: "Porta Cabin",
  container_office: "Container Office",
  portable_cabin: "Portable Cabin",
  labor_colony: "Labor Colony",
  container_cafe: "Container Cafe",
  portable_office_cabin: "Portable Office Cabin",
  container_house: "Container House",
  security_cabin: "Security Cabin",
  portable_toilet: "Portable Toilet",
  industrial_shed: "Industrial Shed",
  peb_construction: "PEB Construction",
  pre_engineered_building: "Pre-Engineered Building",
  prefab_building: "Prefab Building",
  prefabricated_house: "Prefabricated House",
  puf_panel: "PUF Panel",
  rockwool_panel: "Rockwool Panel",
  pir_panel: "PIR Panel",
  custom_requirement_quote: "Custom Requirement Quote",
};

export const ATTACHED_SCOPE_ADDONS = [
  "Attached Partition",
  "Attached Pantry",
  "Attached Urinal",
  "Attached Washbasin",
  "Attached Toilet",
] as const;

export const FURNITURE_INTERIOR_ADDONS = [
  "Workstation",
  "Manager Table",
  "Overhead File Cabinet",
  "MS Rack",
  "Conference Table",
  "Cupboard / Almira",
  "Chairs",
  "Discussion Table",
] as const;

const OPTIONAL_ADDONS = [...ATTACHED_SCOPE_ADDONS, ...FURNITURE_INTERIOR_ADDONS] as const;
export const OPTIONAL_ADDON_LIST = [...OPTIONAL_ADDONS];

export const PANEL_PRODUCT_ADDON_NOTE =
  "Panel accessories, trims, fasteners, and related items can be discussed with SAMAN during quotation review.";

export const MAX_ADDON_QUANTITY = 20;

export type AddOnCategory = "attached_scope_addon" | "furniture_interior_addon";
export type AddOnScope = "cabin" | "special" | "all";
export type AddOnPricingStatus =
  | "approved_manual_rate"
  | "data_supported_rate"
  | "quotation_review_required";

export interface OptionalAddOnRateRange {
  low: number;
  typical: number;
  high: number;
}

export interface OptionalAddOnConfig {
  id: OptionalAddon;
  label: string;
  category: AddOnCategory;
  unitLabel: "nos";
  minQty: 0 | 1;
  maxQty: number;
  pricingStatus: AddOnPricingStatus;
  rateRange?: OptionalAddOnRateRange;
  applicableTo: AddOnScope[];
}

export interface AddOnBudgetLine {
  id: OptionalAddon;
  name: string;
  category: AddOnCategory;
  quantity: number;
  unitLabel: "nos";
  unitRate: number;
  lowRate: number;
  typicalRate: number;
  highRate: number;
  lowRange: number;
  typicalRange: number;
  highRange: number;
  pricingStatus: AddOnPricingStatus;
  statusLabel: string;
  isIncludedInEstimate: boolean;
}

export interface AddOnBudgetSummary {
  items: AddOnBudgetLine[];
  lowRange: number;
  typicalRange: number;
  highRange: number;
}

export interface EstimateBudgetLine {
  label: string;
  details: string;
  lowRange: number;
  typicalRange: number;
  highRange: number;
  note?: string;
}

export interface EstimateBudgetBreakdown {
  base: EstimateBudgetLine;
  specification: EstimateBudgetLine;
  addOns: AddOnBudgetSummary;
}

export const OPTIONAL_ADDONS_CONFIG: OptionalAddOnConfig[] = [
  // Attached scope add-ons
  {
    id: "Attached Partition",
    label: "Attached Partition",
    category: "attached_scope_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "approved_manual_rate",
    rateRange: { low: 15000, typical: 17000, high: 21000 },
    applicableTo: ["cabin", "special", "all"],
  },
  {
    id: "Attached Pantry",
    label: "Attached Pantry",
    category: "attached_scope_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "quotation_review_required",
    applicableTo: ["cabin", "special", "all"],
  },
  {
    id: "Attached Urinal",
    label: "Attached Urinal",
    category: "attached_scope_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "quotation_review_required",
    applicableTo: ["cabin", "special", "all"],
  },
  {
    id: "Attached Washbasin",
    label: "Attached Washbasin",
    category: "attached_scope_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "quotation_review_required",
    applicableTo: ["cabin", "special", "all"],
  },
  {
    id: "Attached Toilet",
    label: "Attached Toilet",
    category: "attached_scope_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "approved_manual_rate",
    rateRange: { low: 35000, typical: 40000, high: 45000 },
    applicableTo: ["cabin", "special", "all"],
  },
  // Furniture / interior add-ons
  {
    id: "Workstation",
    label: "Workstation",
    category: "furniture_interior_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "approved_manual_rate",
    rateRange: { low: 6000, typical: 7000, high: 7500 },
    applicableTo: ["cabin", "special", "all"],
  },
  {
    id: "Manager Table",
    label: "Manager Table",
    category: "furniture_interior_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "quotation_review_required",
    applicableTo: ["cabin", "special", "all"],
  },
  {
    id: "Overhead File Cabinet",
    label: "Overhead File Cabinet",
    category: "furniture_interior_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "approved_manual_rate",
    rateRange: { low: 4500, typical: 5000, high: 5500 },
    applicableTo: ["cabin", "special", "all"],
  },
  {
    id: "MS Rack",
    label: "MS Rack",
    category: "furniture_interior_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "quotation_review_required",
    applicableTo: ["cabin", "special", "all"],
  },
  {
    id: "Conference Table",
    label: "Conference Table",
    category: "furniture_interior_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "quotation_review_required",
    applicableTo: ["cabin", "special", "all"],
  },
  {
    id: "Cupboard / Almira",
    label: "Cupboard / Almira",
    category: "furniture_interior_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "quotation_review_required",
    applicableTo: ["cabin", "special", "all"],
  },
  {
    id: "Chairs",
    label: "Chairs",
    category: "furniture_interior_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "approved_manual_rate",
    rateRange: { low: 6000, typical: 7000, high: 8000 },
    applicableTo: ["cabin", "special", "all"],
  },
  {
    id: "Discussion Table",
    label: "Discussion Table",
    category: "furniture_interior_addon",
    unitLabel: "nos",
    minQty: 0,
    maxQty: MAX_ADDON_QUANTITY,
    pricingStatus: "quotation_review_required",
    applicableTo: ["cabin", "special", "all"],
  },
];

export type OptionalAddon = (typeof OPTIONAL_ADDONS)[number];
export type AddOnQuantity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
export type AddOnQuantityMap = Partial<Record<OptionalAddon, AddOnQuantity>>;
export type AddOnEntry = {
  name: OptionalAddon;
  quantity: AddOnQuantity;
};

export const CABIN_MATERIAL_OPTIONS = ["MS Cabin", "PUF / Puff Cabin"] as const;
export const CABIN_INTERNAL_WALL_OPTIONS = [
  "MDF 8MM Internal Wall",
  "Cement Board Internal Wall",
  "APP Sheet 4MM Wall",
  "Particle Board Internal Wall",
  "SPC Internal",
] as const;
export const CABIN_CEILING_OPTIONS = [
  "MDF 8MM Ceiling",
  "False Ceiling",
  "APP Sheet 4MM Ceiling",
  "Particle Board Ceiling",
  "SPC Ceiling",
] as const;
export const CABIN_FLOORING_OPTIONS = [
  "Vinyl Flooring",
  "Tile Flooring",
  "Wooden Flooring",
  "SPC Flooring",
] as const;
export const CABIN_WINDOW_OPTIONS = ["Aluminum", "UPVC"] as const;

export interface PanelThicknessRate {
  thicknessMm: number;
  rangeMin: number;
  rangeMax: number;
  defaultRate: number;
}

export interface PanelConfig {
  options: PanelThicknessRate[];
}

export interface FixedSizeBasePrice {
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  basePrice: number;
}

const FIXED_SIZE_BASE_PRICE_PRODUCTS = new Set<CalculatorProductId>([
  "portable_toilet",
  "security_cabin",
]);

export const PORTABLE_TOILET_SECURITY_CABIN_BASE_PRICES: FixedSizeBasePrice[] = [
  { lengthFt: 4, widthFt: 4, heightFt: 7, basePrice: 45000 },
  { lengthFt: 6, widthFt: 4, heightFt: 7, basePrice: 50000 },
  { lengthFt: 6, widthFt: 6, heightFt: 7, basePrice: 55000 },
  { lengthFt: 8, widthFt: 6, heightFt: 7, basePrice: 65000 },
  { lengthFt: 8, widthFt: 8, heightFt: 8, basePrice: 80000 },
];

export const PANEL_CONFIG: Record<"puf_panel" | "rockwool_panel" | "pir_panel", PanelConfig> = {
  puf_panel: {
    options: [
      { thicknessMm: 30, rangeMin: 900, rangeMax: 1100, defaultRate: 1000 },
      { thicknessMm: 40, rangeMin: 1050, rangeMax: 1250, defaultRate: 1150 },
      { thicknessMm: 50, rangeMin: 1150, rangeMax: 1450, defaultRate: 1300 },
      { thicknessMm: 60, rangeMin: 1300, rangeMax: 1650, defaultRate: 1450 },
      { thicknessMm: 80, rangeMin: 1550, rangeMax: 2000, defaultRate: 1750 },
    ],
  },
  rockwool_panel: {
    options: [
      { thicknessMm: 30, rangeMin: 1100, rangeMax: 1500, defaultRate: 1300 },
      { thicknessMm: 40, rangeMin: 1300, rangeMax: 1700, defaultRate: 1500 },
      { thicknessMm: 50, rangeMin: 1500, rangeMax: 2200, defaultRate: 1800 },
      { thicknessMm: 60, rangeMin: 1700, rangeMax: 2400, defaultRate: 2000 },
      { thicknessMm: 70, rangeMin: 1900, rangeMax: 2600, defaultRate: 2250 },
      { thicknessMm: 80, rangeMin: 2100, rangeMax: 2900, defaultRate: 2500 },
    ],
  },
  pir_panel: {
    options: [
      { thicknessMm: 30, rangeMin: 950, rangeMax: 1250, defaultRate: 1100 },
      { thicknessMm: 40, rangeMin: 1150, rangeMax: 1450, defaultRate: 1300 },
      { thicknessMm: 50, rangeMin: 1300, rangeMax: 1650, defaultRate: 1500 },
      { thicknessMm: 60, rangeMin: 1500, rangeMax: 1850, defaultRate: 1700 },
      { thicknessMm: 70, rangeMin: 1700, rangeMax: 2100, defaultRate: 1900 },
      { thicknessMm: 80, rangeMin: 1850, rangeMax: 2400, defaultRate: 2100 },
    ],
  },
};

type CurrencyInput = number | string | null | undefined;

interface CabinetEstimateBase {
  productId: Exclude<CalculatorProductId, "custom_requirement_quote">;
  productName: string;
  length: number;
  width: number;
  quantity: number;
  transport: TransportOption;
  installation: InstallationOption;
  gst: GstOption;
  zone: PriceCalculatorZone;
  area: number;
  zoneContact: string;
  lowRange: number;
  typicalRange: number;
  highRange: number;
  currency: string;
  unitLabel: "sq ft" | "m²";
  budgetBreakdown: EstimateBudgetBreakdown;
}

export interface PriceCalculatorCabinEstimate extends CabinetEstimateBase {
  mode: "cabin";
  materialType: string;
  internalWall: string;
  ceiling: string;
  flooring: string;
  windowType: string;
}

export interface PriceCalculatorPanelEstimate extends CabinetEstimateBase {
  mode: "panel";
  panelProductId: "puf_panel" | "rockwool_panel" | "pir_panel";
  thicknessMm: number;
  panelRateRangeMin: number;
  panelRateRangeMax: number;
  panelRatePerSqmText: string;
}

export interface PriceCalculatorCustomEstimate {
  mode: "custom";
  productId: "custom_requirement_quote";
  productName: string;
}

export interface PriceCalculatorSpecialEstimate extends CabinetEstimateBase {
  mode: "special";
  specialPanelSheet: string;
  specialFloorStructure: string;
  numberOfRooms: number;
}

export type PriceCalculatorEstimate =
  | PriceCalculatorCabinEstimate
  | PriceCalculatorPanelEstimate
  | PriceCalculatorSpecialEstimate
  | PriceCalculatorCustomEstimate;

export interface PriceCalculatorPrintPayload {
  productId: CalculatorProductId;
  productName: string;
  estimate: PriceCalculatorEstimate;
  transport: TransportOption;
  installation: InstallationOption;
  gst: GstOption;
  zone: PriceCalculatorZone;
  zoneContact: string;
  length: number;
  width: number;
  quantity: number;
  area: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  requirementNotes: string;
  specialPanelSheet?: (typeof SPECIAL_PANEL_SHEET_OPTIONS)[number];
  specialFloorStructure?: (typeof SPECIAL_FLOOR_STRUCTURE_OPTIONS)[number];
  numberOfRooms?: number;
  selectedAddOns?: AddOnQuantityMap;
  selectedAddOnsSummary?: string;
}

export interface PriceCalculatorFormState {
  productId: CalculatorProductId;
  zone: PriceCalculatorZone;
  length: string;
  width: string;
  quantity: string;
  materialType: typeof CABIN_MATERIAL_OPTIONS[number];
  internalWall: typeof CABIN_INTERNAL_WALL_OPTIONS[number];
  ceiling: typeof CABIN_CEILING_OPTIONS[number];
  flooring: typeof CABIN_FLOORING_OPTIONS[number];
  windowType: typeof CABIN_WINDOW_OPTIONS[number];
  panelThickness: number;
  transport: TransportOption;
  installation: InstallationOption;
  gst: GstOption;
  specialPanelSheet: (typeof SPECIAL_PANEL_SHEET_OPTIONS)[number];
  specialFloorStructure: (typeof SPECIAL_FLOOR_STRUCTURE_OPTIONS)[number];
  numberOfRooms: string;
  fullName: string;
  email: string;
  mobile: string;
  requirementNotes: string;
  selectedAddOns: AddOnQuantityMap;
  selectedAddOnsSummary?: string;
}

const OPTIONAL_ADDON_SET = new Set<string>(OPTIONAL_ADDON_LIST);

const normalizeAddOnQuantity = (value: unknown): AddOnQuantity | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  const clamped = Math.min(MAX_ADDON_QUANTITY, Math.max(0, Math.floor(parsed)));
  return clamped as AddOnQuantity;
};

const normalizeAddonName = (value: unknown): OptionalAddon | null => {
  if (typeof value !== "string") {
    return null;
  }
  const clean = value.trim();
  if (!clean || !OPTIONAL_ADDON_SET.has(clean)) {
    return null;
  }
  return clean as OptionalAddon;
};

export const getSelectableAddOnsForProduct = (productId: CalculatorProductId): OptionalAddon[] => {
  if (isPanelProduct(productId)) {
    return [];
  }
  return OPTIONAL_ADDONS_CONFIG
    .filter((item) => item.applicableTo.includes("all") || item.applicableTo.includes(isSpecialScopeProduct(productId) ? "special" : "cabin"))
    .map((item) => item.id);
};

export const sanitizeSelectedAddOns = (
  productId: CalculatorProductId,
  selectedAddOns: unknown,
): AddOnQuantityMap => {
  const allowed = new Set(getSelectableAddOnsForProduct(productId));
  const result: AddOnQuantityMap = {};

  if (!selectedAddOns) {
    return result;
  }

  if (Array.isArray(selectedAddOns)) {
    for (const item of selectedAddOns) {
      if (typeof item === "string") {
        const name = normalizeAddonName(item);
        if (name && allowed.has(name)) {
          result[name] = 1 as AddOnQuantity;
        }
        continue;
      }
      if (typeof item === "object" && item !== null) {
        const entry = item as Record<string, unknown>;
        const name = normalizeAddonName(entry.name);
        if (!name || !allowed.has(name)) {
          continue;
        }
        const qty = normalizeAddOnQuantity(entry.quantity);
        if (qty === null || qty <= 0) {
          continue;
        }
        result[name] = qty;
      }
    }
    return result;
  }

  if (typeof selectedAddOns === "object") {
    const objectEntries = Object.entries(selectedAddOns as Record<string, unknown>);
    for (const [rawName, rawQty] of objectEntries) {
      const name = normalizeAddonName(rawName);
      if (!name || !allowed.has(name)) {
        continue;
      }
      const qty = normalizeAddOnQuantity(rawQty);
      if (qty === null || qty <= 0) {
        continue;
      }
      result[name] = qty;
    }
  }

  return result;
};

export const getSelectedAddOnEntries = (selectedAddOns?: AddOnQuantityMap): AddOnEntry[] => {
  if (!selectedAddOns) {
    return [];
  }
  return Object.entries(selectedAddOns)
    .map(([name, quantity]) => {
      const normalizedName = normalizeAddonName(name);
      if (!normalizedName) {
        return null;
      }
      const normalizedQuantity = normalizeAddOnQuantity(quantity);
      if (normalizedQuantity === null || normalizedQuantity <= 0) {
        return null;
      }
      return {
        name: normalizedName,
        quantity: normalizedQuantity,
      } as AddOnEntry;
    })
    .filter((entry): entry is AddOnEntry => entry !== null);
};

export const formatAddOnsForLeadPayload = (selectedAddOns?: AddOnQuantityMap): string => {
  const entries = getSelectedAddOnEntries(selectedAddOns);
  if (!entries.length) {
    return "";
  }
  return entries.map((item) => `${item.name}: ${item.quantity} nos`).join("; ");
};

const buildAddOnRateLineItem = (
  config: OptionalAddOnConfig,
  quantity: AddOnQuantity,
): AddOnBudgetLine => {
  const safeQuantity = Number(quantity) || 0;
  const isIncludedInEstimate =
    config.pricingStatus !== "quotation_review_required" && Boolean(config.rateRange);
  const lowRate = isIncludedInEstimate ? config.rateRange?.low || 0 : 0;
  const typicalRate = isIncludedInEstimate ? config.rateRange?.typical || 0 : 0;
  const highRate = isIncludedInEstimate ? config.rateRange?.high || 0 : 0;
  const statusLabel = isIncludedInEstimate
    ? "Included in estimated budget range"
    : "Quotation review required";

  return {
    id: config.id,
    name: config.label,
    category: config.category,
    quantity: safeQuantity,
    unitLabel: config.unitLabel,
    unitRate: typicalRate,
    lowRate,
    typicalRate,
    highRate,
    lowRange: lowRate * safeQuantity,
    typicalRange: typicalRate * safeQuantity,
    highRange: highRate * safeQuantity,
    pricingStatus: config.pricingStatus,
    statusLabel,
    isIncludedInEstimate,
  };
};

export const calculateAddOnBudgetSummary = (
  productId: CalculatorProductId,
  selectedAddOns?: AddOnQuantityMap,
): AddOnBudgetSummary => {
  if (isPanelProduct(productId)) {
    return {
      items: [],
      lowRange: 0,
      typicalRange: 0,
      highRange: 0,
    };
  }

  const entries = getSelectedAddOnEntries(selectedAddOns);
  if (!entries.length) {
    return {
      items: [],
      lowRange: 0,
      typicalRange: 0,
      highRange: 0,
    };
  }

  const applicable = OPTIONAL_ADDONS_CONFIG.filter((config) => {
    const isAllowedForProduct =
      config.applicableTo.includes("all") ||
      (isSpecialScopeProduct(productId) ? config.applicableTo.includes("special") : config.applicableTo.includes("cabin"));
    return isAllowedForProduct;
  });

  const items: AddOnBudgetLine[] = [];
  let lowRange = 0;
  let typicalRange = 0;
  let highRange = 0;

  for (const entry of entries) {
    const config = applicable.find((item) => item.id === entry.name);
    if (!config) {
      continue;
    }
    const item = buildAddOnRateLineItem(config, entry.quantity);
    if (item.quantity <= 0) {
      continue;
    }
    items.push(item);
    if (item.isIncludedInEstimate) {
      lowRange += item.lowRange;
      typicalRange += item.typicalRange;
      highRange += item.highRange;
    }
  }

  return {
    items,
    lowRange,
    typicalRange,
    highRange,
  };
};

export const buildOptionalAddOnBudgetLabel = (entry: AddOnBudgetLine): string => {
  const totalQty = entry.quantity;
  if (!totalQty) {
    return `${entry.name}: Not selected`;
  }
  if (!entry.isIncludedInEstimate) {
    return `${entry.name} ${entry.quantity} ${entry.unitLabel}: Quotation review required`;
  }
  return `${entry.name} ${entry.quantity} ${entry.unitLabel}: ${entry.lowRange.toLocaleString("en-IN")} - ${entry.highRange.toLocaleString("en-IN")}`;
};

export const BASE_CABIN_RATE = 1050;
const STEP_SIZE = 1000;

const BASED_TRANSPORT_MULTIPLIERS: Record<TransportOption, number> = {
  "Transport required": 1.04,
  "Transport to be confirmed": 1.0,
  "Discuss with SAMAN": 1.0,
};

const BASED_INSTALLATION_MULTIPLIERS: Record<InstallationOption, number> = {
  "Installation required": 1.06,
  "Installation not required": 1.0,
  "Discuss with SAMAN": 1.03,
};

/**
 * "GST included guidance" multiplied by 1.05 — a 5% tax on a figure the rest of
 * the codebase taxes at GST_RATE (18%). A buyer selecting it was shown a
 * "tax-inclusive" price understating GST by roughly 13 percentage points.
 *
 * The rate is imported from taxRates.ts, the single definition site both
 * engines read, so this option can never drift from statutory GST again. The
 * other two options are 1.0 because they add no tax to the figure shown.
 */
const BASED_GST_MULTIPLIERS: Record<GstOption, number> = {
  "GST extra": 1.0,
  "GST included guidance": 1 + GST_RATE,
  "Discuss with SAMAN": 1.0,
};

const CABIN_MATERIAL_MULTIPLIERS: Record<
  (typeof CABIN_MATERIAL_OPTIONS)[number],
  {
    base: number;
    internalWall: Record<(typeof CABIN_INTERNAL_WALL_OPTIONS)[number], number>;
    flooring: Record<(typeof CABIN_FLOORING_OPTIONS)[number], number>;
  }
> = {
  "MS Cabin": {
    base: 1.0,
    internalWall: {
      "MDF 8MM Internal Wall": 1.0,
      "Cement Board Internal Wall": 1.04,
      "APP Sheet 4MM Wall": 1.08,
      "Particle Board Internal Wall": 1.06,
      "SPC Internal": 1.12,
    },
    flooring: {
      "Vinyl Flooring": 1.0,
      "Tile Flooring": 1.08,
      "Wooden Flooring": 1.12,
      "SPC Flooring": 1.06,
    },
  },
  "PUF / Puff Cabin": {
    base: 1.08,
    internalWall: {
      "MDF 8MM Internal Wall": 1.0,
      "Cement Board Internal Wall": 1.04,
      "APP Sheet 4MM Wall": 1.08,
      "Particle Board Internal Wall": 1.06,
      "SPC Internal": 1.1,
    },
    flooring: {
      "Vinyl Flooring": 1.0,
      "Tile Flooring": 1.07,
      "Wooden Flooring": 1.11,
      "SPC Flooring": 1.06,
    },
  },
};

const CABIN_CEILING_MULTIPLIERS: Record<(typeof CABIN_CEILING_OPTIONS)[number], number> = {
  "MDF 8MM Ceiling": 1.0,
  "False Ceiling": 1.07,
  "APP Sheet 4MM Ceiling": 1.08,
  "Particle Board Ceiling": 1.06,
  "SPC Ceiling": 1.1,
};

const CABIN_WINDOW_MULTIPLIERS: Record<(typeof CABIN_WINDOW_OPTIONS)[number], number> = {
  Aluminum: 1.0,
  UPVC: 1.03,
};

export const ZONE_CONTACTS: Record<Exclude<PriceCalculatorZone, "">, string> = {
  South:
    "South Zone Contact: Sy No 34/2, near India Oil petrol pump, Gopasandra, Bengaluru, Karnataka 560099 | +91 88616 22859 | +91 80886 85440 | sales@samanportable.com",
  North:
    "North Zone Contact: Khata No 226, Vill-Jalpura, Bisrakh Rd, Jalpura, Dadri, Greater Noida, Uttar Pradesh 201308 | +91 8796039938 | +91 9708989937 | ncr@samanportable.com",
};

const SPECIAL_PANEL_MULTIPLIERS: Record<(typeof SPECIAL_PANEL_SHEET_OPTIONS)[number], number> = {
  "PUF / Puff 50MM": 1,
  "PUF / Puff 75MM": 1.08,
  "PUF / Puff 100MM": 1.14,
  PPGI: 1.22,
};

const SPECIAL_FLOOR_MULTIPLIERS: Record<(typeof SPECIAL_FLOOR_STRUCTURE_OPTIONS)[number], number> = {
  "Single Floor": 1,
  "G+1": 1.05,
  "G+2": 1.12,
};

const toNumber = (value: CurrencyInput): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return parsed;
};

const roundStep = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return Math.round(value / STEP_SIZE) * STEP_SIZE;
};

export const isPanelProduct = (
  productId: CalculatorProductId,
): productId is "puf_panel" | "rockwool_panel" | "pir_panel" => {
  return PANEL_PRODUCTS.has(productId);
};

export const isSpecialScopeProduct = (productId: CalculatorProductId): productId is SpecialScopeProductId => {
  return SPECIAL_SCOPE_PRODUCTS.has(productId as SpecialScopeProductId);
};

export const getProductName = (productId: CalculatorProductId): string => {
  return PRODUCT_LABELS[productId] || productId;
};

export const isFixedSizeBasePriceProduct = (productId: CalculatorProductId): boolean => {
  return FIXED_SIZE_BASE_PRICE_PRODUCTS.has(productId);
};

export const getFixedSizeBasePrice = (
  productId: CalculatorProductId,
  length: number,
  width: number,
): FixedSizeBasePrice | undefined => {
  if (!isFixedSizeBasePriceProduct(productId)) {
    return undefined;
  }

  const normalizedLength = Number(length.toFixed(2));
  const normalizedWidth = Number(width.toFixed(2));
  return PORTABLE_TOILET_SECURITY_CABIN_BASE_PRICES.find(
    (item) => item.lengthFt === normalizedLength && item.widthFt === normalizedWidth,
  );
};

export const currencyInRupee = (value: number): string =>
  `₹${Math.round(value || 0).toLocaleString("en-IN")}`;

export const safeFileSlug = (value: string): string => {
  return String(value || "Estimate")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const safeEstimateRefToken = (input: string): string =>
  String(input || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 8) || "ESTIMATE";

export const buildPrintDate = (input?: Date): string => {
  const safe = input || new Date();
  const year = safe.getFullYear().toString().padStart(4, "0");
  const month = (safe.getMonth() + 1).toString().padStart(2, "0");
  const day = safe.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
};

export const getPanelOption = (
  productId: "puf_panel" | "rockwool_panel" | "pir_panel",
  thicknessMm: number,
): PanelThicknessRate | undefined => {
  return PANEL_CONFIG[productId].options.find((option) => option.thicknessMm === thicknessMm);
};

export const getPanelDefaultThickness = (
  productId: "puf_panel" | "rockwool_panel" | "pir_panel",
): number => PANEL_CONFIG[productId].options[0].thicknessMm;

export const calculateCabinEstimate = (
  input: {
    productId: Exclude<CalculatorProductId, "custom_requirement_quote">;
    productName: string;
    length: number;
    width: number;
    quantity: number;
    selectedAddOns?: AddOnQuantityMap;
    materialType: (typeof CABIN_MATERIAL_OPTIONS)[number];
    internalWall: (typeof CABIN_INTERNAL_WALL_OPTIONS)[number];
    ceiling: (typeof CABIN_CEILING_OPTIONS)[number];
    flooring: (typeof CABIN_FLOORING_OPTIONS)[number];
    windowType: (typeof CABIN_WINDOW_OPTIONS)[number];
    transport: TransportOption;
    installation: InstallationOption;
    gst: GstOption;
    zone: Exclude<PriceCalculatorZone, "">;
  },
): PriceCalculatorCabinEstimate | null => {
  const length = toNumber(input.length);
  const width = toNumber(input.width);
  const quantity = Math.max(1, Math.floor(toNumber(input.quantity) || 0));
  if (length <= 0 || width <= 0 || quantity <= 0 || !input.zone) {
    return null;
  }

  const area = length * width;
  const materialCfg = CABIN_MATERIAL_MULTIPLIERS[input.materialType] || CABIN_MATERIAL_MULTIPLIERS["MS Cabin"];
  const internalWall = materialCfg.internalWall[input.internalWall] || 1;
  const flooring = materialCfg.flooring[input.flooring] || 1;
  const ceiling = CABIN_CEILING_MULTIPLIERS[input.ceiling] || 1;
  const windowType = CABIN_WINDOW_MULTIPLIERS[input.windowType] || 1;

  const internalWallEffect = input.materialType === "MS Cabin" ? internalWall : 1;
  const materialMultiplier = materialCfg.base * internalWallEffect * flooring * ceiling * windowType;

  const transportMultiplier = BASED_TRANSPORT_MULTIPLIERS[input.transport] || 1;
  const installationMultiplier = BASED_INSTALLATION_MULTIPLIERS[input.installation] || 1;
  const gstMultiplier = BASED_GST_MULTIPLIERS[input.gst] || 1;
  const fixedSizeBasePrice = getFixedSizeBasePrice(input.productId, length, width);
  if (isFixedSizeBasePriceProduct(input.productId) && !fixedSizeBasePrice) {
    return null;
  }

  const baseValue = fixedSizeBasePrice
    ? fixedSizeBasePrice.basePrice * quantity * transportMultiplier * installationMultiplier * gstMultiplier
    : area * quantity * BASE_CABIN_RATE * materialMultiplier * transportMultiplier * installationMultiplier * gstMultiplier;
  const baseLowRange = roundStep(baseValue * (fixedSizeBasePrice ? 1 : 0.88));
  const baseTypicalRange = roundStep(baseValue);
  const baseHighRange = roundStep(baseValue * (fixedSizeBasePrice ? 1 : 1.12));
  const addOnSummary = calculateAddOnBudgetSummary(input.productId, input.selectedAddOns);

  const lowRange = baseLowRange + addOnSummary.lowRange;
  const typicalRange = baseTypicalRange + addOnSummary.typicalRange;
  const highRange = baseHighRange + addOnSummary.highRange;

  const zoneContact = ZONE_CONTACTS[input.zone] || "Zone contact details pending internal review.";
  const baseLine: EstimateBudgetLine = {
    label: "Base Product Estimate",
    details: fixedSizeBasePrice
      ? `${input.productName} (${fixedSizeBasePrice.lengthFt}x${fixedSizeBasePrice.widthFt}x${fixedSizeBasePrice.heightFt} ft x ${quantity} pcs)`
      : `${input.productName} (${area.toLocaleString("en-IN")} sq ft × ${quantity} pcs)`,
    lowRange: baseLowRange,
    typicalRange: baseTypicalRange,
    highRange: baseHighRange,
  };
  const specificationLine: EstimateBudgetLine = {
    label: "Specification / Material",
    details: fixedSizeBasePrice
      ? `Standard size base: ${fixedSizeBasePrice.lengthFt}x${fixedSizeBasePrice.widthFt}x${fixedSizeBasePrice.heightFt} ft | GST, transport, installation, add-ons, and custom changes are outside base price`
      : `Material: ${input.materialType} | Internal Wall: ${input.materialType === "MS Cabin" ? input.internalWall : "N/A"} | Ceiling: ${input.ceiling} | Flooring: ${input.flooring} | Window: ${input.windowType}`,
    lowRange: baseLowRange,
    typicalRange: baseTypicalRange,
    highRange: baseHighRange,
    note: "Included in selected budget range.",
  };

  return {
    mode: "cabin",
    productId: input.productId,
    productName: input.productName,
    length,
    width,
    quantity,
    transport: input.transport,
    installation: input.installation,
    gst: input.gst,
    zone: input.zone,
    area,
    zoneContact,
    lowRange,
    typicalRange,
    highRange,
    currency: "INR",
    unitLabel: "sq ft",
    budgetBreakdown: {
      base: baseLine,
      specification: specificationLine,
      addOns: addOnSummary,
    },
    materialType: fixedSizeBasePrice ? "Standard base specification" : input.materialType,
    internalWall: fixedSizeBasePrice ? "Standard base specification" : input.materialType === "MS Cabin" ? input.internalWall : "N/A",
    ceiling: fixedSizeBasePrice ? "Standard base specification" : input.ceiling,
    flooring: fixedSizeBasePrice ? "Standard base specification" : input.flooring,
    windowType: fixedSizeBasePrice ? "Standard base specification" : input.windowType,
  };
};

export const calculatePanelEstimate = (
  input: {
    productId: "puf_panel" | "rockwool_panel" | "pir_panel";
    productName: string;
    length: number;
    width: number;
    quantity: number;
    selectedAddOns?: AddOnQuantityMap;
    thicknessMm: number;
    transport: TransportOption;
    installation: InstallationOption;
    gst: GstOption;
    zone: Exclude<PriceCalculatorZone, "">;
  },
): PriceCalculatorPanelEstimate | null => {
  const length = toNumber(input.length);
  const width = toNumber(input.width);
  const quantity = Math.max(1, Math.floor(toNumber(input.quantity) || 0));
  if (length <= 0 || width <= 0 || quantity <= 0 || !input.zone) {
    return null;
  }

  const option = getPanelOption(input.productId, input.thicknessMm);
  if (!option) {
    return null;
  }

  const area = length * width;
  const transportMultiplier = BASED_TRANSPORT_MULTIPLIERS[input.transport] || 1;
  const installationMultiplier = BASED_INSTALLATION_MULTIPLIERS[input.installation] || 1;
  const gstMultiplier = BASED_GST_MULTIPLIERS[input.gst] || 1;
  const adjustment = transportMultiplier * installationMultiplier * gstMultiplier;

  const base = area * quantity * adjustment;
  const baseLowRange = roundStep(base * option.rangeMin);
  const baseTypicalRange = roundStep(base * option.defaultRate);
  const baseHighRange = roundStep(base * option.rangeMax);
  const addOnSummary = calculateAddOnBudgetSummary(input.productId, input.selectedAddOns);

  const lowRange = baseLowRange + addOnSummary.lowRange;
  const typicalRange = baseTypicalRange + addOnSummary.typicalRange;
  const highRange = baseHighRange + addOnSummary.highRange;

  const baseLine: EstimateBudgetLine = {
    label: "Base Product Estimate",
    details: `${input.productName} (${area.toLocaleString("en-IN")} m² × ${quantity} pcs)`,
    lowRange: baseLowRange,
    typicalRange: baseTypicalRange,
    highRange: baseHighRange,
  };
  const specificationLine: EstimateBudgetLine = {
    label: "Specification / Material",
    details: `Panel Type: ${input.productName} · Thickness: ${option.thicknessMm} mm`,
    lowRange: baseLowRange,
    typicalRange: baseTypicalRange,
    highRange: baseHighRange,
    note: "Included in selected budget range.",
  };

  const zoneContact = ZONE_CONTACTS[input.zone] || "Zone contact details pending internal review.";

  return {
    mode: "panel",
    productId: input.productId,
    productName: input.productName,
    length,
    width,
    quantity,
    transport: input.transport,
    installation: input.installation,
    gst: input.gst,
    zone: input.zone,
    area,
    zoneContact,
    lowRange,
    typicalRange,
    highRange,
    currency: "INR",
    unitLabel: "m²",
    budgetBreakdown: {
      base: baseLine,
      specification: specificationLine,
      addOns: addOnSummary,
    },
    panelProductId: input.productId,
    thicknessMm: option.thicknessMm,
    panelRateRangeMin: option.rangeMin,
    panelRateRangeMax: option.rangeMax,
    panelRatePerSqmText: `${currencyInRupee(option.rangeMin)} - ${currencyInRupee(option.rangeMax)} per m²`,
  };
};

export const calculateSpecialEstimate = (input: {
  productId: SpecialScopeProductId;
  productName: string;
  length: number;
  width: number;
  quantity: number;
  selectedAddOns?: AddOnQuantityMap;
  specialPanelSheet: (typeof SPECIAL_PANEL_SHEET_OPTIONS)[number];
  specialFloorStructure: (typeof SPECIAL_FLOOR_STRUCTURE_OPTIONS)[number];
  numberOfRooms: number;
  transport: TransportOption;
  installation: InstallationOption;
  gst: GstOption;
  zone: Exclude<PriceCalculatorZone, "">;
}): PriceCalculatorSpecialEstimate | null => {
  const length = toNumber(input.length);
  const width = toNumber(input.width);
  const quantity = Math.max(1, Math.floor(toNumber(input.quantity) || 0));
  if (length <= 0 || width <= 0 || quantity <= 0 || !input.zone) {
    return null;
  }

  const area = length * width;
  const transportMultiplier = BASED_TRANSPORT_MULTIPLIERS[input.transport] || 1;
  const installationMultiplier = BASED_INSTALLATION_MULTIPLIERS[input.installation] || 1;
  const gstMultiplier = BASED_GST_MULTIPLIERS[input.gst] || 1;

  const panelMultiplier = SPECIAL_PANEL_MULTIPLIERS[input.specialPanelSheet] || 1;
  const floorMultiplier = SPECIAL_FLOOR_MULTIPLIERS[input.specialFloorStructure] || 1;
  const roomMultiplier = Math.max(1, 1 + Math.max(0, input.numberOfRooms - 1) * 0.05);
  const adjustment = transportMultiplier * installationMultiplier * gstMultiplier * panelMultiplier * floorMultiplier * roomMultiplier;

  const baseValue = area * quantity * BASE_CABIN_RATE * adjustment;
  const baseLowRange = roundStep(baseValue * 0.88);
  const baseTypicalRange = roundStep(baseValue);
  const baseHighRange = roundStep(baseValue * 1.12);
  const addOnSummary = calculateAddOnBudgetSummary(input.productId, input.selectedAddOns);

  const lowRange = baseLowRange + addOnSummary.lowRange;
  const typicalRange = baseTypicalRange + addOnSummary.typicalRange;
  const highRange = baseHighRange + addOnSummary.highRange;

  const baseLine: EstimateBudgetLine = {
    label: "Base Product Estimate",
    details: `${input.productName} (${area.toLocaleString("en-IN")} sq ft × ${quantity} pcs)`,
    lowRange: baseLowRange,
    typicalRange: baseTypicalRange,
    highRange: baseHighRange,
  };
  const specificationLine: EstimateBudgetLine = {
    label: "Specification / Material",
    details: `Panel Sheet: ${input.specialPanelSheet} · Floor: ${input.specialFloorStructure} · Rooms: ${input.numberOfRooms}`,
    lowRange: baseLowRange,
    typicalRange: baseTypicalRange,
    highRange: baseHighRange,
    note: "Included in selected budget range.",
  };

  const zoneContact = ZONE_CONTACTS[input.zone] || "Zone contact details pending internal review.";

  return {
    mode: "special",
    productId: input.productId,
    productName: input.productName,
    length,
    width,
    quantity,
    transport: input.transport,
    installation: input.installation,
    gst: input.gst,
    zone: input.zone,
    area,
    zoneContact,
    lowRange,
    typicalRange,
    highRange,
    currency: "INR",
    unitLabel: "sq ft",
    budgetBreakdown: {
      base: baseLine,
      specification: specificationLine,
      addOns: addOnSummary,
    },
    specialPanelSheet: input.specialPanelSheet,
    specialFloorStructure: input.specialFloorStructure,
    numberOfRooms: input.numberOfRooms,
  };
};

export const getEstimateFromInput = (
  form: PriceCalculatorFormState,
): PriceCalculatorEstimate | PriceCalculatorCustomEstimate => {
  if (form.productId === CUSTOM_PRODUCT_ID) {
    return {
      mode: "custom",
      productId: CUSTOM_PRODUCT_ID,
      productName: PRODUCT_LABELS[form.productId],
    };
  }

  if (form.zone !== "South" && form.zone !== "North") {
    throw new Error("Zone is required");
  }
  const zone: Exclude<PriceCalculatorZone, ""> = form.zone;
  const panelProduct = form.productId;
  const numberOfRooms = Math.max(0, Math.floor(Number(form.numberOfRooms) || 0));
  const isLaborColony = panelProduct === "labor_colony";
  if (isLaborColony && numberOfRooms < 1) {
    throw new Error("Number of rooms is required for Labor Colony");
  }

  const common = {
    zone,
    transport: form.transport,
    installation: form.installation,
    gst: form.gst,
    length: toNumber(form.length),
    width: toNumber(form.width),
    quantity: Number(form.quantity),
    productName: PRODUCT_LABELS[form.productId],
  };

  if (isPanelProduct(panelProduct)) {
    const panelEstimate = calculatePanelEstimate({
      productId: panelProduct,
      productName: common.productName,
      length: common.length,
      width: common.width,
      quantity: common.quantity,
      selectedAddOns: form.selectedAddOns,
      thicknessMm: form.panelThickness,
      transport: common.transport,
      installation: common.installation,
      gst: common.gst,
      zone,
    });
    if (!panelEstimate) {
      throw new Error("Unable to calculate panel estimate");
    }
    return panelEstimate;
  }

  if (isSpecialScopeProduct(panelProduct)) {
    const specialEstimate = calculateSpecialEstimate({
      productId: panelProduct,
      productName: common.productName,
      length: common.length,
      width: common.width,
      quantity: common.quantity,
      selectedAddOns: form.selectedAddOns,
      specialPanelSheet: form.specialPanelSheet || SPECIAL_PANEL_SHEET_OPTIONS[0],
      specialFloorStructure: form.specialFloorStructure || SPECIAL_FLOOR_STRUCTURE_OPTIONS[0],
      numberOfRooms: Math.max(0, numberOfRooms),
      transport: common.transport,
      installation: common.installation,
      gst: common.gst,
      zone,
    });
    if (!specialEstimate) {
      throw new Error("Unable to calculate special product estimate");
    }
    return specialEstimate;
  }

  const cabinEstimate = calculateCabinEstimate({
    productId: form.productId,
    productName: common.productName,
    length: common.length,
    width: common.width,
    quantity: common.quantity,
    selectedAddOns: form.selectedAddOns,
    materialType: form.materialType,
    internalWall: form.internalWall,
    ceiling: form.ceiling,
    flooring: form.flooring,
    windowType: form.windowType,
    transport: common.transport,
    installation: common.installation,
    gst: common.gst,
    zone,
  });
  if (!cabinEstimate) {
    throw new Error("Unable to calculate cabin estimate");
  }
  return cabinEstimate;
};
