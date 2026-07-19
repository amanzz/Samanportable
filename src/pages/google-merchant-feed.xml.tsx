import { GetServerSideProps } from 'next';
import { getAllProductsForFeed } from '@/lib/staticContent';
import { generateGoogleMerchantXml, MERCHANT_BASE_URL } from '@/lib/merchantFeed';
import { getAllVariantFeedItems } from '@/lib/feedSources';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // T26: shared source — keeps this byte-identical to the /api twin.
  const variantItems = getAllVariantFeedItems();
  const xmlFeed = generateGoogleMerchantXml(getAllProductsForFeed(), MERCHANT_BASE_URL, variantItems);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(xmlFeed);
  res.end();

  return { props: {} };
};

export default function GoogleMerchantFeedXml() {
  return null;
}
