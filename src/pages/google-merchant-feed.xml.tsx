import { GetServerSideProps } from 'next';
import { getAllProductsForFeed, getPortaCabinVariantData } from '@/lib/staticContent';
import {
  generateGoogleMerchantXml,
  buildPortaCabinVariantItems,
  MERCHANT_BASE_URL,
} from '@/lib/merchantFeed';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const variantItems = buildPortaCabinVariantItems(getPortaCabinVariantData());
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
