import { GetServerSideProps } from 'next';
import { getAllProductsForFeed } from '@/lib/staticContent';
import { generateGoogleMerchantXml, MERCHANT_BASE_URL } from '@/lib/merchantFeed';
import { getAllVariantFeedItems } from '@/lib/feedSources';
import { getRedirectSourceSet } from '@/lib/redirectSources';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // T26: shared source — keeps this byte-identical to the /api twin.
  // C01: pass the redirect-source set so no item can land on a 301'd URL.
  const variantItems = getAllVariantFeedItems();
  const redirectSources = await getRedirectSourceSet();
  const xmlFeed = generateGoogleMerchantXml(getAllProductsForFeed(), MERCHANT_BASE_URL, variantItems, redirectSources);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(xmlFeed);
  res.end();

  return { props: {} };
};

export default function GoogleMerchantFeedXml() {
  return null;
}
