import { GetServerSideProps } from 'next';
import { getAllProductsForFeed } from '@/lib/staticContent';
import { generateGoogleMerchantXml } from '@/lib/merchantFeed';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xmlFeed = generateGoogleMerchantXml(getAllProductsForFeed());

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(xmlFeed);
  res.end();

  return { props: {} };
};

export default function GoogleMerchantFeedXml() {
  return null;
}
