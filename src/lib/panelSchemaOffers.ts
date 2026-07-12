export function panelAggregateOffer(lowPrice: number, url: string, offerCount = 9) {
  return {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice,
    offerCount,
    availability: 'https://schema.org/InStock',
    url,
    seller: { '@id': 'https://www.samanportable.com/#organization' },
  };
}
