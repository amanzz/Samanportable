export interface VariantImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductVariant {
  sizeSlug: string;
  label: string;
  dims: string;
  areaSqft: number;
  priceExGst: number;
  /** Incl-GST (18%) price — owner-supplied figure; = priceExGst × 1.18. Shown as
      a muted line under the ex-GST price, and used for Merchant offers.price. */
  priceInclGst: number;
  capacity: string;
  useCase: string;
  sku: string;
  images: VariantImage[];
  imagesPending?: boolean;
  /** Per-size buy-box blurb (Fable 5 Section E). Rendered only when present —
      the copy has not been supplied yet, so the slot stays empty until then. */
  shortDescription?: string;
}

export interface VariantProductData {
  productSlug: string;
  variantAxis: string;
  defaultVariant: string;
  hsn: string;
  gstPercent: number;
  variants: ProductVariant[];
}

export const formatIndianPrice = (value: number): string => `₹${Math.round(value).toLocaleString('en-IN')}`;
