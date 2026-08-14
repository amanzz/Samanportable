/**
 * Statutory tax rates. ONE definition site for the whole codebase.
 *
 * Authority: CALC-L7 §A2, 09 Aug 2026.
 *
 * WHY THIS FILE EXISTS
 *   There are two pricing engines on this site and they share no code:
 *     Engine A — the nine-step wizard   (cabinCalculatorSSR.ts)
 *     Engine B — the four-section form  (price-calculator-config.ts)
 *   Engine B's "GST included guidance" option multiplied by 1.05 while Engine A
 *   used 0.18, so the same buyer was shown a "tax-inclusive" figure understating
 *   GST by roughly 13 percentage points depending which surface he opened.
 *
 *   The fix is deliberately NOT "import Engine A's constant into Engine B" —
 *   that couples two engines that must stay independent — and NOT "write 0.18 in
 *   both" — that is the duplicate-literal defect restated. GST is a statutory
 *   fact, not a property of either engine. It is stated once, here, and both
 *   engines import it.
 *
 * ANYTHING THAT SHOWS A TAX-INCLUSIVE FIGURE READS GST_RATE FROM THIS FILE.
 * Do not re-declare the rate, do not write 0.18 or 1.18 as a literal, and do
 * not add a per-engine copy. A change in the statutory rate must be a one-line
 * change in one file.
 */

/** GST, as a fraction. A tax-inclusive figure is ex-GST x (1 + GST_RATE). */
export const GST_RATE = 0.18;
