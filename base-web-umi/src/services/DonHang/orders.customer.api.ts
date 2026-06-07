import request from '@/services/base/request';

export type PaymentMethod = 'cod' | 'bank_transfer';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  province: string;
  district: string;
  ward: string;
}

export interface CheckoutPayload {
  address: ShippingAddress;
  paymentMethod: PaymentMethod;
  note?: string;
  voucherCode?: string;
}

export interface ListMyOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface CheckoutOrderResult {
  _id: string;
  orderCode: string;
  originalTotal: number;
  shippingFee: number;
  discountAmount: number;
  appliedVoucher?: string | null;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  qrUrl?: string;
  paymentTimeout?: string;
  shippingAddress: ShippingAddress;
  items: Array<{
    name: string;
    variantName: string;
    quantity: number;
    priceSell: number;
  }>;
}

export async function checkout(data: CheckoutPayload) {
  return request('/api/orders/checkout', { method: 'POST', data });
}

export async function getMyOrders(params?: ListMyOrdersParams) {
  return request('/api/orders/my-orders', { method: 'GET', params });
}

export async function getOrderDetail(id: string) {
  return request(`/api/orders/${id}`, { method: 'GET' });
}
