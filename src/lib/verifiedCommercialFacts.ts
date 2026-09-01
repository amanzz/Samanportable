const FLAT_FREIGHT = '(?:₹|â‚¹|Ã¢â€šÂ¹|\\?)3,000';

const freightPattern = (prefix: string, suffix = '') =>
  new RegExp(`${prefix}${FLAT_FREIGHT}${suffix}`, 'gi');

const FREIGHT_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [
    freightPattern('with a ', ' default delivery charge'),
    'with a route-based delivery charge confirmed at quotation',
  ],
  [freightPattern('a default delivery charge of ', ' applies where relevant'), 'delivery freight is route-based and confirmed at quotation'],
  [freightPattern('default delivery (?:charge )?is ', '(?: where applicable)?'), 'delivery freight is route-based and confirmed at quotation'],
  [freightPattern('delivery (?:charge )?(?:is|:) ', ' standard'), 'delivery freight is route-based and confirmed at quotation'],
  [freightPattern('delivery runs ', ' (?:as )?standard'), 'delivery freight is route-based and confirmed at quotation'],
  [freightPattern('delivery charged at ', ' where applicable'), 'delivery freight confirmed for the route at quotation'],
  [freightPattern('delivery to ([^.<]{1,80}) is charged at ', ' where applicable'), 'delivery to $1 is quoted for the route'],
  [freightPattern('', ' default delivery charge'), 'route-based delivery charge confirmed at quotation'],
  [freightPattern('', ' standard delivery'), 'route-based delivery confirmed at quotation'],
  [freightPattern(''), 'a route-based amount confirmed at quotation'],
];

/**
 * Removes the retired flat-freight claim from buyer-visible and structured
 * strings. It does not invent route prices; freight remains a quotation item.
 */
export function normalizeVerifiedCommercialFacts(value: string | null | undefined): string {
  if (!value) return value || '';
  return FREIGHT_REPLACEMENTS.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    value
  );
}

export function normalizeVerifiedCommercialFactsDeep<T>(value: T): T {
  if (typeof value === 'string') return normalizeVerifiedCommercialFacts(value) as T;
  if (Array.isArray(value)) return value.map(normalizeVerifiedCommercialFactsDeep) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, child]) => [
        key,
        normalizeVerifiedCommercialFactsDeep(child),
      ])
    ) as T;
  }
  return value;
}
