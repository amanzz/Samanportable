export function panelAggregateOffer(lowPrice: number, url: string, offerCount = 9, includeAvailability = true) {
  return {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice,
    offerCount,
    ...(includeAvailability ? { availability: 'https://schema.org/InStock' } : {}),
    url,
    seller: { '@id': 'https://www.samanportable.com/#organization' },
  };
}
