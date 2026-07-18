import { GetServerSideProps } from 'next';
import { getAllProductsForFeed, getPortaCabinVariantData } from '@/lib/staticContent';
import { generateGoogleLocalInventoryTsv } from '@/lib/localInventoryFeed';
import { buildPortaCabinVariantItems } from '@/lib/merchantFeed';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const variantItems = buildPortaCabinVariantItems(getPortaCabinVariantData());
  const tsvFeed = generateGoogleLocalInventoryTsv(getAllProductsForFeed(), variantItems);

  res.setHeader('Content-Type', 'text/tab-separated-values; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(tsvFeed);
  res.end();

  return { props: {} };
};

export default function GoogleLocalInventoryTsv() {
  return null;
}
