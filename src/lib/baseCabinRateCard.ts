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
 * The floor of the banded range. Above this area the bands govern; at or below
 * it the fixed sizes and the 36-50 interpolation do, and under 36 sq ft only
 * the fixed sizes exist at all.
 */
export const UNRATED_AREA_CEILING_SQFT = 50;

/**
 * THE 36-50 SQ FT GAP — ruled by SAMAN on 07 Aug 2026 (rate card v2 §3).
 *
 * Seven selectable sizes sat between the 6x6 fixed size and the >50 band with
 * no rate. No single flat rate can cover them, and the proof is short: not
 * undercutting 6x6 (Rs 54,000) needs at least Rs 1,384.62/sq ft at 39 sq ft,
 * while not exceeding the 50 sq ft price (Rs 60,000) allows at most
 * Rs 1,224.49/sq ft at 49 sq ft. The floor is above the ceiling, so no constant
 * satisfies both. That is why this gap needed a ruling rather than a default.
 *
 * SAMAN's answer: the rate slides linearly between his own stated anchors —
 * 36 sq ft at Rs 1,500, 48 sq ft at Rs 1,250, 50 sq ft at Rs 1,200. Each anchor
 * is a figure he already gave: two are fixed sizes, the third is the >50 band.
 * The segments therefore join continuously and the card stays one card.
 *
 * STRICT LIMITS, from the ruling:
 *   - interpolation applies ONLY in 36 < a <= 50;
 *   - above 50 the bands govern as written, with no interpolation between them;
 *   - below 36 only the fixed sizes exist, and any other size renders quote mode.
 *
 * NEVER round the rate. Rs 1,369.79... is carried at full precision and only
 * the total is rounded, to the rupee. Rounding the rate re-introduces the
 * inversions this interpolation exists to remove.
 */
export interface RateInterpolationSegment {
  readonly label: string;
  /** Exclusive lower edge, inclusive upper edge: `fromArea < a <= toArea`. */
  readonly fromAreaSqft: number;
  readonly toAreaSqft: number;
  readonly fromRate: number;
  readonly toRate: number;
}

export const INTERPOLATION_FLOOR_SQFT = 36;

export const RATE_INTERPOLATION_SEGMENTS: readonly RateInterpolationSegment[] = [
  { label: '36-48 slide', fromAreaSqft: 36, toAreaSqft: 48, fromRate: 1500, toRate: 1250 },
  { label: '48-50 slide', fromAreaSqft: 48, toAreaSqft: 50, fromRate: 1250, toRate: 1200 },
] as const;

/**
 * The interpolated per-sq-ft rate for an area inside the gap, or null outside
 * it. Full precision, deliberately un-rounded.
 */
export function interpolatedRateFor(areaSqft: number): { rate: number; label: string } | null {
  const segment = RATE_INTERPOLATION_SEGMENTS.find(
    (entry) => areaSqft > entry.fromAreaSqft && areaSqft <= entry.toAreaSqft
  );
  if (!segment) return null;
  const span = segment.toAreaSqft - segment.fromAreaSqft;
  const rate = segment.fromRate + (areaSqft - segment.fromAreaSqft) * ((segment.toRate - segment.fromRate) / span);
  return { rate, label: segment.label };
}

export const AREA_BANDS: readonly AreaBand[] = [
  { label: '>50-70', maxAreaSqft: 70, ratePerSqft: 1200 },
  { label: '>70-90', maxAreaSqft: 90, ratePerSqft: 1150 },
  { label: '>90-150', maxAreaSqft: 150, ratePerSqft: 1100 },
  { label: '>150-200', maxAreaSqft: 200, ratePerSqft: 1050 },
  { label: '>200', maxAreaSqft: null, ratePerSqft: 1000 },
] as const;

export interface BaseCabinRate {
  readonly areaSqft: number;
  /** Full precision. Never rounded — see RATE_INTERPOLATION_SEGMENTS. */
  readonly ratePerSqft: number;
  /** The final price: area x rate, rounded to the rupee, then capped. */
  readonly basePriceExGst: number;
  readonly source: 'fixed' | 'band' | 'interpolated';
  /** The fixed size's label, the band's label, or the slide segment's. */
  readonly sourceLabel: string;
  /** The uncapped figure, kept so a gate can show what the cap did. */
  readonly rawPriceExGst: number;
  /** True where the monotonic cap lowered this size's price. */
  readonly capped: boolean;
}

/**
 * THE MONOTONIC CAP — ruled 07 Aug 2026, closing the defect the monotonicity
 * gate found in rate card v2.
 *
 *   No cabin may cost more than a larger cabin. Where the card would charge
 *   more, it charges the larger cabin's price.
 *
 *   price(a) = min( raw(a), raw(e) for every anchor e >= a )
 *
 * WHY THE CARD NEEDED IT, in one line each:
 *
 *   A whole-area band card with "the edge takes the cheaper rate" MUST invert at
 *   every edge, because the cheaper rate applies to every square foot at once
 *   rather than only to the marginal ones. 69.75 sq ft x 1200 = Rs 83,700, but
 *   70 sq ft x 1150 = Rs 80,500 — a quarter of a square foot larger and
 *   Rs 3,200 cheaper. Worst case was at 200 sq ft: Rs 2,09,738 -> Rs 2,00,000.
 *
 *   The 48-50 slide is quadratic, not linear: with a linear RATE the total is
 *   a x (2450 - 25a), which peaks at exactly a = 49 and falls away either side.
 *   v2's own published table carried the inversion — 7x7 at Rs 60,025 sitting
 *   above the 50 sq ft price of Rs 60,000.
 *
 * WHAT THE CAP CANNOT DO: raise a price. It is a `min`, so it only ever lowers,
 * and no buyer can be quoted more than the card's stated figure for any size.
 * Every rate SAMAN stated is preserved exactly — the anchors are the stated
 * points themselves, so `raw(e)` at an anchor is its own value and the cap is a
 * no-op there.
 */
export const MONOTONIC_CAP_ANCHORS: readonly number[] = [50, 70, 90, 150, 200];

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
 * `null` means STOP, not zero and not "derive something close". Under rate card
 * v2 the only sizes that return null are floor areas UNDER 36 sq ft that are
 * not one of the fixed sizes — the ruling is explicit that below 36 sq ft only
 * the fixed sizes exist. The 36-50 gap that used to return null is now covered
 * by SAMAN's linear slide.
 *
 * Order matters: a fixed size is a stated price and is never recomputed, so it
 * is matched first and by dimensions rather than by area. 8x6 is Rs 60,000
 * because SAMAN said so, not because 48 x 1250 happens to agree.
 */
type RawRate = { rate: number; source: BaseCabinRate['source']; label: string };

/**
 * The card BEFORE the monotonic cap: the rate an area attracts on its own.
 * Keyed on area alone — fixed sizes are matched by dimension in the caller,
 * because a stated price belongs to a size, not to an area.
 */
function rawRateForArea(areaSqft: number): RawRate | null {
  if (!Number.isFinite(areaSqft) || areaSqft <= 0) return null;
  if (areaSqft < INTERPOLATION_FLOOR_SQFT) return null;

  const slide = interpolatedRateFor(areaSqft);
  if (slide) return { rate: slide.rate, source: 'interpolated', label: slide.label };

  // Exactly 36 sq ft with dimensions other than 6x6 — 9x4, 4.5x8 and so on. The
  // slide's lower anchor is stated by AREA, so the rate applies to the area
  // even where the dimensions are not the fixed size's.
  if (areaSqft === INTERPOLATION_FLOOR_SQFT) {
    return { rate: RATE_INTERPOLATION_SEGMENTS[0].fromRate, source: 'interpolated', label: '36 sq ft anchor' };
  }

  const band = AREA_BANDS.find((entry) => entry.maxAreaSqft === null || areaSqft < entry.maxAreaSqft);
  return band ? { rate: band.ratePerSqft, source: 'band', label: band.label } : null;
}

/** Uncapped price for an area, to the rupee. */
function rawPriceForArea(areaSqft: number): number | null {
  const raw = rawRateForArea(areaSqft);
  return raw === null ? null : Math.round(areaSqft * raw.rate);
}

/**
 * The cap: the cheapest price any cabin at least this large can be charged.
 * `Infinity` above the top anchor, where nothing larger constrains it.
 */
function ceilingForArea(areaSqft: number): number {
  return MONOTONIC_CAP_ANCHORS
    .filter((anchor) => anchor >= areaSqft)
    .reduce((lowest, anchor) => Math.min(lowest, rawPriceForArea(anchor) ?? Infinity), Infinity);
}

/**
 * The base cabin price for a size, or `null` where SAMAN has stated no rate.
 *
 * `null` means STOP, not zero and not "derive something close". Under rate card
 * v2 the only sizes that return null are floor areas UNDER 36 sq ft that are
 * not one of the fixed sizes — the ruling is explicit that below 36 sq ft only
 * the fixed sizes exist. The 36-50 gap that used to return null is covered by
 * SAMAN's linear slide.
 *
 * Order matters: a fixed size is a stated price and is never recomputed, so it
 * is matched first and by dimensions rather than by area. 8x6 is Rs 60,000
 * because SAMAN said so, not because 48 x 1250 happens to agree.
 *
 * The monotonic cap is applied last and to every path, including the fixed
 * sizes. It is a no-op on all five of them — each already prices below the
 * ceiling its area faces — and applying it uniformly rather than exempting them
 * means there is no path through this function that can escape monotonicity.
 */
export function baseCabinRate(length: number, width: number): BaseCabinRate | null {
  if (!Number.isFinite(length) || !Number.isFinite(width) || length <= 0 || width <= 0) return null;

  const fixed = fixedRateSizeFor(length, width);
  const areaSqft = fixed ? fixed.areaSqft : length * width;
  const raw: RawRate | null = fixed
    ? { rate: fixed.ratePerSqft, source: 'fixed', label: fixed.sizeLabel }
    : rawRateForArea(areaSqft);
  if (!raw) return null;

  const rawPriceExGst = fixed ? fixed.basePriceExGst : Math.round(areaSqft * raw.rate);
  const basePriceExGst = Math.min(rawPriceExGst, ceilingForArea(areaSqft));

  return {
    areaSqft,
    ratePerSqft: raw.rate,
    basePriceExGst,
    source: raw.source,
    sourceLabel: raw.label,
    rawPriceExGst,
    capped: basePriceExGst < rawPriceExGst,
  };
}

/**
 * The card serialised for the browser enhancer, so the client cannot hold a
 * second copy of the numbers that drifts from this one. Read back by
 * public/scripts/cabin-cost-calculator.js.
 *
 *   fixed: "4x4=2400;5x5=2150;..."      (length x width = rate per sq ft)
 *   bands: "70=1200;90=1150;..."        (exclusive upper edge = rate per sq ft)
 *   top:   the open 200-and-above rate, which is also the ceiling
 *   slide: "36:48=1500:1250;48:50=1250:1200"  (from:to area = from:to rate)
 *   floor: the area below which only the fixed sizes have a rate
 */
export const BASE_CABIN_RATE_CARD_DATASET = {
  fixed: FIXED_RATE_SIZES.map((size) => `${size.lengthFt}x${size.widthFt}=${size.ratePerSqft}`).join(';'),
  bands: AREA_BANDS.filter((band) => band.maxAreaSqft !== null)
    .map((band) => `${band.maxAreaSqft}=${band.ratePerSqft}`).join(';'),
  top: String((AREA_BANDS.find((band) => band.maxAreaSqft === null) as AreaBand).ratePerSqft),
  slide: RATE_INTERPOLATION_SEGMENTS
    .map((s) => `${s.fromAreaSqft}:${s.toAreaSqft}=${s.fromRate}:${s.toRate}`).join(';'),
  floor: String(INTERPOLATION_FLOOR_SQFT),
  /**
   * The monotonic cap, serialised as "area=price" pairs the browser can read
   * without re-deriving anything: 50=60000;70=80500;90=99000;150=157500;200=200000.
   * Sending the resolved prices rather than the anchor areas keeps one arithmetic
   * implementation on the server, where the ruling lives.
   */
  cap: MONOTONIC_CAP_ANCHORS.map((anchor) => `${anchor}=${rawPriceForArea(anchor)}`).join(';'),
} as const;
