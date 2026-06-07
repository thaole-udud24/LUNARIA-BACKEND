/** Phí ship thống nhất FE — khớp BE shipping.constant.ts */
export const SHIPPING_FREE_THRESHOLD = 500000;
export const SHIPPING_FEE = 30000;

export const calcShippingFee = (subtotal: number): number => {
  if (subtotal <= 0) return 0;
  return subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FEE;
};
