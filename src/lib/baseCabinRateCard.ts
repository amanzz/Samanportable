/**
 * SAMAN's base-cabin rate card — the ONE place the calculator's opening figure
 * comes from.
 *
 * Authority: SAMAN-RULING-BASE-CABIN-RATE-CARD-06Aug2026.md, given in session on
 * 06 Aug 2026 with four clarifications answered the same day. Binding on the
 * calculator; nothing here may be edited without a new ruling.
 *
 * THE RULE
 *   Base cabin price = floor area (length × width, sq ft) × per-sq-ft rate.
 *   All rates ex-GST.
 *
 * THE TWO-PRICE DOCTRINE
 *   1. Product price (page, band headline, ladder, feed, PDF) = the FINISHED
 *      product with all fittings. Unchanged by this file. The published ladder
 *      in calculatorLadders.ts stays supreme for everything the page publishes.
 *   2. Base cabin price (calculator, first line) = the BARE cabin from this
 *      card. The published product price does not apply to the base cabin, and
 *      this card does not apply to a finished-product price anywhere outside
 *      the calculator.
 *
 *   Consequence, stated so nobody trips on it: the route-level price identity
 *   test of 03 Aug ("calculator base at default size == page's published
 *   price") is superseded for the base line by this ruling and is retired. The
 *   opening estimate is deliberately LOWER than the page headline because it is
 *   a bare cabin, and the estimate labels it "Base cabin {size}" so a buyer
 *   cannot read it as the finished price.
 *
 * WHAT THIS FILE DELIBERATELY REFUSES TO DO
 *   A floor area of 50 sq ft or less that is not one of the five fixed sizes
 *   has NO rate. SAMAN has not stated one, and the ruling forbids interpolating
 *   it from the neighbouring bands. `baseCabinRate` returns `null` for those
 *   sizes and the calculator renders quote mode rather than a derived number.
 */

/** GST is 18% wherever the estimate shows a tax-inclusive figure. */
export const BASE_CABIN_GST_RATE = 0.18;

export interface FixedRateSize {
  /** Size as SAMAN wrote it, e.g. "4x4x7". */
  readonly sizeLabel: string;
  readonly lengthFt: number;
  readonly widthFt: number;
  /** Height as named in the rate card. The calculator's height control is a
   *  separate uplift line and does not select a rate. */
  readonly heightFt: number;
  readonly areaSqft: number;
  readonly ratePerSqft: number;
  /** areaSqft × ratePerSqft, written out so a transcription slip cannot hide. */
  readonly basePriceExGst: number;
}

/**
 * The five sizes that carry their own rate. Matched on length × width in either
 * orientation; the height in the label is descriptive, not part of the match.
 */
export const FIXED_RATE_SIZES: readonly FixedRateSize[] = [
  { sizeLabel: '4x4x7', lengthFt: 4, widthFt: 4, heightFt: 7, areaSqft: 16, ratePerSqft: 2400, basePriceExGst: 38400 },
  { sizeLabel: '5x5x7', lengthFt: 5, widthFt: 5, heightFt: 7, areaSqft: 25, ratePerSqft: 2150, basePriceExGst: 53750 },
  { sizeLabel: '6x4x8', lengthFt: 6, widthFt: 4, heightFt: 8, areaSqft: 24, ratePerSqft: 1950, basePriceExGst: 46800 },
  { sizeLabel: '6x6x8', lengthFt: 6, widthFt: 6, heightFt: 8, areaSqft: 36, ratePerSqft: 1500, basePriceExGst: 54000 },
  { sizeLabel: '8x6x8', lengthFt: 8, widthFt: 6, heightFt: 8, areaSqft: 48, ratePerSqft: 1250, basePriceExGst: 60000 },
] as const;

/**
 * Area bands for every size that is not one of the five.
 *
 * `maxAreaSqft` is EXCLUSIVE, which is how SAMAN's boundary clarification is
 * expressed in code: "the edge takes the cheaper rate". Exactly 70 sq ft falls
 * out of the ₹1,200 band and into ₹1,150; exactly 90 into ₹1,100; exactly 150
 * into ₹1,050; exactly 200 into ₹1,000. The larger cabin never pays more per
 * square foot than the smaller one.
 */
export interface AreaBand {
  readonly label: string;
  /** Exclusive upper edge. `null` is the open top band. */
  readonly maxAreaSqft: number | null;
  readonly ratePerSqft: number;
}

/**
 * The floor of the banded range. At or below this area the bands do not apply:
 * the ruling states the ≤50 band is populated by the five fixed sizes, and any
 * other size in it needs a rate SAMAN has not given.
 */
export const UNRATED_AREA_CEILING_SQFT = 50;

export const AREA_BANDS: readonly AreaBand[] = [
  { label: '>50-70', maxAreaSqft: 70, ratePerSqft: 1200 },
  { label: '>70-90', maxAreaSqft: 90, ratePerSqft: 1150 },
  { label: '>90-150', maxAreaSqft: 150, ratePerSqft: 1100 },
  { label: '>150-200', maxAreaSqft: 200, ratePerSqft: 1050 },
  { label: '>200', maxAreaSqft: null, ratePerSqft: 1000 },
] as const;

export interface BaseCabinRate {
  readonly areaSqft: number;
  readonly ratePerSqft: number;
  readonly basePriceExGst: number;
  readonly source: 'fixed' | 'band';
  /** The fixed size's label, or the band's label. Shown in gate tables. */
  readonly sourceLabel: string;
}

const sameSize = (size: FixedRateSize, length: number, width: number): boolean =>
  (size.lengthFt === length && size.widthFt === width)
  || (size.lengthFt === width && size.widthFt === length);

/** The fixed-rate size for these dimensions, or null. Orientation-insensitive. */
export function fixedRateSizeFor(length: number, width: number): FixedRateSize | null {
  return FIXED_RATE_SIZES.find((size) => sameSize(size, length, width)) || null;
}

/**
 * The base cabin price for a size, or `null` where SAMAN has stated no rate.
 *
 * `null` means STOP, not zero and not "derive something close". The only sizes
 * that return null are floor areas of 50 sq ft or less that are not one of the
 * five fixed sizes.
 */
export function baseCabinRate(length: number, width: number): BaseCabinRate | null {
  if (!Number.isFinite(length) || !Number.isFinite(width) || length <= 0 || width <= 0) return null;

  const fixed = fixedRateSizeFor(length, width);
  if (fixed) {
    return {
      areaSqft: fixed.areaSqft,
      ratePerSqft: fixed.ratePerSqft,
      basePriceExGst: fixed.basePriceExGst,
      source: 'fixed',
      sourceLabel: fixed.sizeLabel,
    };
  }

  const areaSqft = length * width;
  if (areaSqft <= UNRATED_AREA_CEILING_SQFT) return null;

  const band = AREA_BANDS.find((entry) => entry.maxAreaSqft === null || areaSqft < entry.maxAreaSqft);
  if (!band) return null;

  return {
    areaSqft,
    ratePerSqft: band.ratePerSqft,
    basePriceExGst: Math.round(areaSqft * band.ratePerSqft),
    source: 'band',
    sourceLabel: band.label,
  };
}

/**
 * The card serialised for the browser enhancer, so the client cannot hold a
 * second copy of the numbers that drifts from this one. Read back by
 * public/scripts/cabin-cost-calculator.js.
 *
 *   fixed: "4x4=2400;5x5=2150;..."   (length x width = rate per sq ft)
 *   bands: "70=1200;90=1150;..."     (exclusive upper edge = rate per sq ft)
 *   top:   the open >200 rate
 *   floor: the area at or below which there is no rate outside the five sizes
 */
export const BASE_CABIN_RATE_CARD_DATASET = {
  fixed: FIXED_RATE_SIZES.map((size) => `${size.lengthFt}x${size.widthFt}=${size.ratePerSqft}`).join(';'),
  bands: AREA_BANDS.filter((band) => band.maxAreaSqft !== null)
    .map((band) => `${band.maxAreaSqft}=${band.ratePerSqft}`).join(';'),
  top: String((AREA_BANDS.find((band) => band.maxAreaSqft === null) as AreaBand).ratePerSqft),
  floor: String(UNRATED_AREA_CEILING_SQFT),
} as const;
