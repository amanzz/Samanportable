import type { GetServerSideProps } from 'next';
import GenericProductDetails, {
  getServerSideProps as getGenericProductServerSideProps,
} from '../[category]/[slug]';
import {
  buildShippingContainerOfficeShippingHtml,
  buildShippingContainerOfficeSpecificationsHtml,
} from '@/page-specific/shipping-container-office/content';

const CATEGORY = 'container-offices';
const SLUG = 'shipping-container-office';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await getGenericProductServerSideProps({
    ...context,
    params: {
      ...context.params,
      category: CATEGORY,
      slug: SLUG,
    },
  });

  if (!('props' in result)) {
    return result;
  }

  const props = await result.props;
  const product = (props as any).product;
  const shippingHtml = buildShippingContainerOfficeShippingHtml();

  return {
    props: {
      ...props,
      product: {
        ...product,
        shippingHtml: true,
      },
      category: CATEGORY,
      slug: SLUG,
      specificationsHtml: buildShippingContainerOfficeSpecificationsHtml(),
      shippingHtml,
    },
  };
};

export default GenericProductDetails;
