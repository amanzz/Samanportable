/**
 * Component rates, from SAMAN's price-input workbook.
 *
 * Authority: R1-SAMAN-Calculator-Price-Input-05Aug2026- PR.xlsx (05 Aug,
 * 16:32), imported whole by scripts/calculator/import-price-input.mjs into
 * src/data/calculator/price-input-05Aug2026.json. Every rate below carries the
 * sheet and row it came from, so any figure on a quotation can be walked back
 * to a cell.
 *
 * The 10:03 copy of the same day is superseded and is never read. The
 * workbook's READ ME and PENDING REGISTER tabs still read as a blank request
 * because that prose predates SAMAN filling the file; the cells govern.
 *
 * HOLD LIST. Ten codes carry a number in the spreadsheet but are not approved
 * for use. They render "Quoted separately" and never a figure. They are
 * excluded here at source rather than filtered at the point of display, so a
 * hold cannot be lost by a later refactor, and
 * scripts/calculator/verify-hold-list.mjs fails if one ever renders a number.
 */
import priceInput from '@/data/calculator/price-input-05Aug2026.json';

export interface ComponentRate {
  code: string;
  label: string;
  specification: string | null;
  /** Rupees ex-GST. Null where the workbook holds no usable number. */
  rate: number | null;
  group: string | null;
  /** Sheet and row in the source workbook. */
  origin: string;
  hold: boolean;
}

type RawRow = {
  code: string; sheet: string; row: number; group: string | null;
  label: string | null; specification: string | null;
  rate: number | null; rawValue: string | null; hold: boolean;
};

const RAW = priceInput as unknown as {
  source: { file: string; modified: string };
  holdList: string[];
  rates: Record<string, RawRow[]>;
};

export const PRICE_INPUT_SOURCE = RAW.source;
export const HOLD_LIST: readonly string[] = RAW.holdList;

const toRate = (r: RawRow): ComponentRate => ({
  code: r.code,
  label: r.label || r.code,
  specification: r.specification,
  rate: r.rate,
  group: r.group,
  origin: `${r.sheet} row ${r.row}`,
  hold: r.hold,
});

/** Every row, held or not, for reporting and for the hold-list gate. */
export const ALL_COMPONENT_ROWS: readonly ComponentRate[] =
  Object.values(RAW.rates).flat().map(toRate);

/** Usable rows only: a real number, and not on hold. */
function usable(group: string, predicate: (r: RawRow) => boolean = () => true): ComponentRate[] {
  return (RAW.rates[group] || [])
    .filter((r) => !r.hold && typeof r.rate === 'number' && predicate(r))
    .map(toRate);
}

/**
 * The base cabin already includes a standard interior, so an interior choice is
 * charged as the DIFFERENCE from that standard, not as an absolute rate. Adding
 * the full per-sq-ft rate on top of a base that already contains a lining would
 * charge the buyer twice for the same surface.
 *
 * Each standard is traceable, not chosen:
 *   wall     INT-01 Pre-laminated MDF, the workbook marks it "the current standard"
 *   flooring FLR-06 Vinyl sheet, the workbook marks it "Standard on the cabin spec"
 *   ceiling  CLG-07 Pre-laminated MDF, matching sheet 01 row 28 of the technical
 *            workbook: "Ceiling | Internal ceiling system | 8 mm pre-laminated
 *            MDF ceiling". The price-input workbook marks no ceiling standard,
 *            so the specification workbook settles it.
 */
export const INTERIOR_STANDARD = {
  wall: 'INT-01',
  ceiling: 'CLG-07',
  flooring: 'FLR-06',
} as const;

/**
 * The three standards as a named, traceable set — each with the authority that
 * fixes it, so the baseline can be audited without reading this file's prose.
 *
 * A choice cheaper than the standard produces a NEGATIVE line and reduces the
 * total. It is not clamped at zero: specifying down from the standard is a
 * real saving and the estimate says so.
 */
export const INTERIOR_STANDARD_SET = [
  {
    surface: 'Internal wall',
    code: 'INT-01',
    option: 'Pre-laminated MDF',
    authority: 'Price-input workbook, tab 1 row 5, note "Marked as the current standard"',
  },
  {
    surface: 'Flooring',
    code: 'FLR-06',
    option: 'Vinyl sheet',
    authority: 'Price-input workbook, tab 1 row 22, note "Standard on the cabin spec"',
  },
  {
    surface: 'Ceiling',
    code: 'CLG-07',
    option: 'Pre-laminated MDF',
    authority: 'Technical workbook sheet 01 row 28, "8 mm pre-laminated MDF ceiling". The price-input workbook marks no ceiling standard.',
  },
] as const;

const interiorGroup = (name: string) =>
  usable('interior', (r) => (r.group || '').toLowerCase() === name);

export const INTERNAL_WALLS = interiorGroup('internal wall');
export const CEILINGS_R1 = interiorGroup('ceiling');
export const FLOORINGS_R1 = interiorGroup('flooring');
export const INSULATIONS_R1 = interiorGroup('insulation');

/** Rate of the standard option in a group, used as the delta baseline. */
function standardRate(list: readonly ComponentRate[], code: string): number {
  return list.find((r) => r.code === code)?.rate ?? 0;
}
export const WALL_STANDARD_RATE = standardRate(INTERNAL_WALLS, INTERIOR_STANDARD.wall);
export const CEILING_STANDARD_RATE = standardRate(CEILINGS_R1, INTERIOR_STANDARD.ceiling);
export const FLOOR_STANDARD_RATE = standardRate(FLOORINGS_R1, INTERIOR_STANDARD.flooring);

/** Per sq ft, relative to the standard already in the base price. */
export const wallDelta = (code: string) =>
  (INTERNAL_WALLS.find((r) => r.code === code)?.rate ?? WALL_STANDARD_RATE) - WALL_STANDARD_RATE;
export const ceilingDelta = (code: string) =>
  (CEILINGS_R1.find((r) => r.code === code)?.rate ?? CEILING_STANDARD_RATE) - CEILING_STANDARD_RATE;
export const floorDelta = (code: string) =>
  (FLOORINGS_R1.find((r) => r.code === code)?.rate ?? FLOOR_STANDARD_RATE) - FLOOR_STANDARD_RATE;

/**
 * Insulation is additive, not a substitution: the workbook notes both options
 * are "Charged per sq.ft. of wall + ceiling". Selecting none costs nothing.
 */
export const insulationRate = (code: string) =>
  INSULATIONS_R1.find((r) => r.code === code)?.rate ?? 0;

/** EL-01 to EL-10. EL-11 is on hold; EL-12 is a rule, not a rate. */
export const ELECTRICAL_R1 = usable('electrical');

/** The 36 fit-out components, minus the four on hold. */
export const FITOUT_R1 = usable('fitout');

/**
 * Frame and wall construction — Event 1, Step 3.
 *
 * Percentages are SAMAN's 05 Aug ruling, recorded in the workbook's own
 * sourced list: "MS is base, GI is +5%, container conversion is +10% over
 * container office."
 *
 * Container conversion carries a specification as well as a rate: SAMAN's
 * 05 Aug written instruction, "we do refurbish and sell as new but demand is
 * very less". Under SOP section 1 the owner's latest written instruction
 * outranks the technical workbook's Sources and Notes line, which is a
 * narrower statement about the container office and cafe product lines.
 *
 * EPS carries a specification but no rate anywhere in this workbook, so it
 * ships disabled. It is listed rather than hidden, because a buyer asking for
 * EPS should see that we build it and that the price is being confirmed.
 */
export const FRAME_OPTIONS = [
  { code: 'FR-MS', label: 'MS structural frame', percent: 0, disabled: false },
  { code: 'FR-GI', label: 'GI structural frame', percent: 5, disabled: false },
  { code: 'FR-CONV', label: 'Container conversion', percent: 10, disabled: false },
] as const;

export const WALL_BUILD_OPTIONS = [
  { code: 'WB-MS', label: 'MS sheet 1.2 mm', perSqmDelta: 0, disabled: false },
  { code: 'WB-EPS', label: 'EPS wall panel', perSqmDelta: null, disabled: true },
] as const;

/**
 * PUF panel wall by thickness, per square metre ex-GST, sourced in the
 * workbook's own "already sourced" list and matching rate card v2's per-sq-ft
 * deltas to two decimals.
 */
export const PUF_PER_SQM: Readonly<Record<number, number>> = {
  30: 1050, 40: 1150, 50: 1250, 60: 1330, 80: 1470,
};
const SQFT_PER_SQM = 10.7639;
/** Delta per sq ft against the 50 mm standard already in the base price. */
export const pufDeltaPerSqft = (mm: number) =>
  ((PUF_PER_SQM[mm] ?? PUF_PER_SQM[50]) - PUF_PER_SQM[50]) / SQFT_PER_SQM;
