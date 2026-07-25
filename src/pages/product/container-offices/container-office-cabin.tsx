import type { GetServerSideProps } from 'next';
import ProductDetails, {
  getServerSideProps as getProductServerSideProps,
} from '../[category]/[slug]';
import {
  buildContainerOfficeCabinShippingHtml,
  buildContainerOfficeCabinSpecificationsHtml,
  insertContainerOfficeCabinPriceHtml,
} from '@/data/products/container-office-cabin-page';

export default ProductDetails;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await getProductServerSideProps({
    ...context,
    params: {
      category: 'container-offices',
      slug: 'container-office-cabin',
    },
  });

  if (!('props' in result)) return result;

  const props = await result.props;
  const product = props.product
    ? {
        ...props.product,
        description: insertContainerOfficeCabinPriceHtml(props.product.description || ''),
      }
    : props.product;

  return {
    props: {
      ...props,
      product,
      specificationsHtml: buildContainerOfficeCabinSpecificationsHtml(),
      shippingHtml: buildContainerOfficeCabinShippingHtml(),
    },
  };
};
