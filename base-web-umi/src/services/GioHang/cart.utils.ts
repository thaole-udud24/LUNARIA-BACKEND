export interface CartItemViewModel {
  productId: string;
  variantName: string;
  quantity: number;
  name: string;
  mainImage: string;
  priceSell: number;
  originalPrice?: number;
  stockQty: number;
  weight?: number;
  lineTotal: number;
}

export const CART_UPDATE_EVENT = 'cartUpdate';

import { resolveMediaUrl } from '@/utils/apiUrl';

export const resolveImageUrl = (url?: string) => resolveMediaUrl(url || '');

export const getCartItemKey = (productId: string, variantName: string) =>
  `${productId}::${variantName}`;

export const parseApiData = <T>(res: any): T => (res?.data ?? res) as T;

export const normalizeApiResponse = async (res: any) => {
  if (res && typeof res.json === 'function') {
    return res.json();
  }
  return res;
};

export const mapCartItem = (item: any): CartItemViewModel => {
  const product = item?.productId && typeof item.productId === 'object' ? item.productId : null;
  const productId =
    product?._id?.toString?.() ||
    item?.productId?.toString?.() ||
    String(item?.productId || '');
  const variant = product?.variants?.find(
    (v: any) => v.variantName === item.variantName,
  );
  const priceSell = item.priceSell ?? variant?.priceSell ?? 0;
  const quantity = item.quantity ?? 1;

  return {
    productId,
    variantName: item.variantName || 'Mặc định',
    quantity,
    name: product?.name || 'Sản phẩm',
    mainImage: product?.mainImage || '',
    priceSell,
    originalPrice: item.originalPrice,
    stockQty: variant?.stockQty ?? 0,
    weight: variant?.weight,
    lineTotal: priceSell * quantity,
  };
};

export const mapCartItems = (res: any): CartItemViewModel[] => {
  const cart = parseApiData<any>(res);
  const items = Array.isArray(cart?.items) ? cart.items : [];
  return items.map(mapCartItem);
};

export const getCartCount = (items: CartItemViewModel[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

export const dispatchCartUpdate = (count: number) => {
  window.dispatchEvent(
    new CustomEvent(CART_UPDATE_EVENT, { detail: { count } }),
  );
};

export const isAuthenticated = () => Boolean(localStorage.getItem('token'));

export const formatPrice = (price?: number) =>
  price && price > 0 ? `${price.toLocaleString('vi-VN')}đ` : '0đ';

export const extractApiError = async (error: any): Promise<string> => {
  try {
    if (error?.data) {
      const data = error.data;
      if (typeof data?.message === 'string') return data.message;
      if (Array.isArray(data?.message)) return data.message.join(', ');
    }
    if (error?.response) {
      const data = await error.response.clone?.().json?.();
      if (typeof data?.message === 'string') return data.message;
      if (Array.isArray(data?.message)) return data.message.join(', ');
    }
  } catch {
    // ignore parse errors
  }
  return error?.message || 'Đã xảy ra lỗi, vui lòng thử lại';
};
