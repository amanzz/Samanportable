import type { GetServerSideProps } from 'next';
import ProductDetails, {
  getServerSideProps as getProductServerSideProps,
} from '../[category]/[slug]';
import pageData from '@/data/products/bess-container-page.json';
import { buildContainerOfficesShippingHtml } from '@/lib/specsShippingTabs';

export default ProductDetails;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await getProductServerSideProps({
    ...context,
    params: {
      category: 'container-offices',
      slug: 'bess-container',
    },
  });

  if (!('props' in result)) return result;

  const props = await result.props;

  return {
    props: {
      ...props,
      specificationsHtml: pageData.specificationsHtml,
      shippingHtml: buildContainerOfficesShippingHtml().replace(/\s*[\u2013\u2014]\s*/g, ' - '),
      relatedProducts: [],
    },
  };
};
