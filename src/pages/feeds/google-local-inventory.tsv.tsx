import { GetServerSideProps } from 'next';
import { getAllProductsForFeed } from '@/lib/staticContent';
import { generateGoogleLocalInventoryTsv } from '@/lib/localInventoryFeed';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const tsvFeed = generateGoogleLocalInventoryTsv(getAllProductsForFeed());

  res.setHeader('Content-Type', 'text/tab-separated-values; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(tsvFeed);
  res.end();

  return { props: {} };
};

export default function GoogleLocalInventoryTsv() {
  return null;
}
