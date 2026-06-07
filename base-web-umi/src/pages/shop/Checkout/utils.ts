import { CartItemViewModel } from '@/services/GioHang/cart.utils';
import { PaymentMethod } from '@/services/DonHang/orders.customer.api';
import { calcShippingFee, SHIPPING_FEE } from '@/constants/shipping';

/** @deprecated dùng calcShippingFee — giữ alias tương thích */
export const CHECKOUT_SHIPPING_FEE = SHIPPING_FEE;

export interface CheckoutFormState {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  province: string;
  district: string;
  ward: string;
  note: string;
}

export interface SavedAddressOption {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  province: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export interface CheckoutSummaryItem extends CartItemViewModel {
  promotionSaving: number;
}

export interface CheckoutMeta {
  voucherCode?: string;
  discount?: number;
}

export const parseCheckoutMeta = (): CheckoutMeta => {
  try {
    const raw = sessionStorage.getItem('lunaria_checkout_meta');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const clearCheckoutMeta = () => {
  sessionStorage.removeItem('lunaria_checkout_meta');
};

export const buildSummaryItems = (items: CartItemViewModel[]): CheckoutSummaryItem[] =>
  items.map((item) => ({
    ...item,
    promotionSaving:
      item.originalPrice && item.originalPrice > item.priceSell
        ? (item.originalPrice - item.priceSell) * item.quantity
        : 0,
  }));

export const calcSubtotal = (items: CartItemViewModel[]) =>
  items.reduce((sum, item) => sum + item.lineTotal, 0);

export const calcPromotionSaving = (items: CheckoutSummaryItem[]) =>
  items.reduce((sum, item) => sum + item.promotionSaving, 0);

export const calcTotal = (subtotal: number, shippingFee: number, discount: number) =>
  Math.max(0, subtotal + shippingFee - discount);

export const hasFlashSaleItems = (items: CartItemViewModel[]) =>
  items.some(
    (item) =>
      item.originalPrice != null &&
      item.originalPrice > item.priceSell &&
      item.priceSell > 0,
  );

export const paymentMethodLabel = (method: PaymentMethod | string) => {
  if (method === 'cod') return 'Thanh toán khi nhận hàng (COD)';
  if (method === 'bank_transfer') return 'Chuyển khoản / Quét mã VietQR';
  return String(method);
};

export const formatPrice = (value?: number) =>
  value != null ? `${value.toLocaleString('vi-VN')}đ` : '0đ';

export const normalizeOrderResponse = (res: any) => {
  const data = res?.data ?? res;
  if (!data || typeof data !== 'object') return data;
  const id = data._id ?? data.id;
  return {
    ...data,
    _id: id != null ? String(typeof id === 'object' && id.toString ? id.toString() : id) : undefined,
  };
};
