/**
 * CO-D05 (04 Sep 2026) — per-size build type for the Container Office family.
 *
 * The Shipping Container Office is a MIXED-construction product: its 20x8 ft and
 * 40x8 ft options are converted from used ISO donor containers, while 20x10 ft,
 * 20x12 ft, 30x10 ft and 40x10 ft are newly fabricated MS structures. A buyer
 * comparing the 20x8 ft price against the 20x10 ft price is comparing two
 * different things, so the published size/price table has to say which is which.
 *
 * Why the map lives here rather than in the ladder:
 * `src/lib/calculatorLadders.ts` is SHA-256 protected by
 * `scripts/validate-pc01-calculator-price-parity.mjs`, so `LadderRow` cannot gain
 * a `buildLabel` field without forfeiting that regression control. This module is
 * the non-protected lookup the price-table renderer consults instead. It is keyed
 * by ladder key and row label so it can never be applied to another family: any
 * ladder key absent from BUILD_LABELS returns undefined, and the renderer then
 * emits no Build column at all.
 *
 * Authority: CO-D05 final ruling, decision record §0.8.
 */

const BUILD_LABELS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  'shipping-container-office': {
    '20x8 ft': 'Converted, used ISO donor container',
    '20x10 ft': 'Newly fabricated MS',
    '20x12 ft': 'Newly fabricated MS',
    '30x10 ft': 'Newly fabricated MS',
    '40x8 ft': 'Converted, used ISO donor container',
    '40x10 ft': 'Newly fabricated MS',
  },
};

/**
 * Build type for one published size row, or undefined when the product does not
 * publish per-size build types. Undefined for every non-Container-Office route.
 */
export function containerOfficeBuildLabel(
  ladderKey: string | null | undefined,
  rowLabel: string | null | undefined
): string | undefined {
  if (!ladderKey || !rowLabel) return undefined;
  const forProduct = BUILD_LABELS[ladderKey];
  if (!forProduct) return undefined;
  return forProduct[rowLabel.trim()];
}

/** True when at least one supplied row label carries a build type. */
export function hasContainerOfficeBuildLabels(
  ladderKey: string | null | undefined,
  rowLabels: readonly (string | null | undefined)[]
): boolean {
  return rowLabels.some((l) => containerOfficeBuildLabel(ladderKey, l) !== undefined);
}
