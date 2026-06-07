/** Địa chỉ giao hàng từ BE (checkout) hoặc legacy FE */
export interface RawShippingAddress {
  fullName?: string;
  customerName?: string;
  phone?: string;
  addressLine?: string;
  ward?: string;
  district?: string;
  province?: string;
  address?: string;
}

export interface NormalizedShippingAddress {
  customerName: string;
  phone: string;
  address: string;
}

export function formatShippingAddress(addr?: RawShippingAddress | null): NormalizedShippingAddress {
  if (!addr) {
    return { customerName: '—', phone: '—', address: '—' };
  }

  const customerName = addr.customerName || addr.fullName || '—';
  const phone = addr.phone || '—';
  const address =
    addr.address ||
    [addr.addressLine, addr.ward, addr.district, addr.province].filter(Boolean).join(', ') ||
    '—';

  return { customerName, phone, address };
}

export function normalizeAdminOrder<T extends { shippingAddress?: RawShippingAddress }>(
  order: T,
): T & { shippingAddress: NormalizedShippingAddress } {
  return {
    ...order,
    shippingAddress: formatShippingAddress(order.shippingAddress),
  };
}

export function normalizeAdminOrders<T extends { shippingAddress?: RawShippingAddress }>(
  orders: T[],
): Array<T & { shippingAddress: NormalizedShippingAddress }> {
  return orders.map(normalizeAdminOrder);
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  COD: 'Thanh toán khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  QR: 'Quét mã QR',
};

export function getPaymentMethodLabel(method?: string) {
  if (!method) return '—';
  return PAYMENT_METHOD_LABEL[method] || method;
}
