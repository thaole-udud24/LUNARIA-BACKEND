import {
  ApiOrder,
  formatDate,
  formatDateTime,
  normalizeApiResponse,
} from '../Account/account.utils';
import { OrderData, OrderItem, OrderStatus, TrackingStep } from './types';

export const resolveMongoId = (value: unknown): string => {
  if (value == null || value === '') return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const obj = value as { _id?: unknown; toString?: () => string };
    if (obj._id != null) return resolveMongoId(obj._id);
    if (typeof obj.toString === 'function') {
      const text = obj.toString();
      if (/^[a-f0-9]{24}$/i.test(text)) return text;
    }
  }
  return String(value);
};

export const parseOrdersList = (res: unknown): ApiOrder[] => {
  const parsed = normalizeApiResponse<{ data?: ApiOrder[] } | ApiOrder[]>(res);
  if (Array.isArray(parsed)) return parsed;
  return parsed?.data || [];
};

export const parseOrderDetail = (res: unknown): ApiOrder => {
  return normalizeApiResponse<ApiOrder>(res);
};

export const mapApiStatusToUi = (status: string): OrderData['status'] => {
  const known: OrderData['status'][] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
  if (known.includes(status as OrderData['status'])) {
    return status as OrderData['status'];
  }
  return 'PENDING';
};

export const matchesOrderTab = (order: OrderData, tab: OrderStatus): boolean => {
  if (tab === 'ALL') return true;
  return order.status === tab;
};

const formatPaymentMethod = (method?: string) => {
  if (method === 'cod') return 'Thanh toán khi nhận hàng (COD)';
  if (method === 'bank_transfer') return 'Chuyển khoản ngân hàng';
  return method || '—';
};

const formatShippingAddress = (addr?: ApiOrder['shippingAddress']) => {
  if (!addr) {
    return { fullName: '—', phone: '—', address: '—' };
  }
  const parts = [addr.addressLine, addr.ward, addr.district, addr.province].filter(Boolean);
  return {
    fullName: addr.fullName,
    phone: addr.phone,
    address: parts.join(', '),
  };
};

export const buildTrackingSteps = (order: ApiOrder): TrackingStep[] => {
  const created = formatDateTime(order.createdAt);
  const status = order.status;

  if (status === 'CANCELLED') {
    return [
      {
        title: 'Đơn hàng đã đặt',
        description: 'Đơn hàng đã được đặt thành công trên hệ thống',
        time: created,
        completed: true,
      },
      {
        title: 'Đã hủy',
        description: 'Đơn hàng đã được hủy',
        time: created,
        completed: true,
      },
    ];
  }

  const confirmed = ['CONFIRMED', 'PROCESSING', 'COMPLETED'].includes(status);
  const shipping = ['PROCESSING', 'COMPLETED'].includes(status);
  const completed = status === 'COMPLETED';

  return [
    {
      title: 'Đơn hàng đã đặt',
      description: 'Đơn hàng đã được đặt thành công trên hệ thống',
      time: created,
      completed: true,
    },
    {
      title: 'Đã xác nhận',
      description: 'Lunaria đã xác nhận và đóng gói đơn hàng',
      time: confirmed ? created : '—',
      completed: confirmed,
    },
    {
      title: 'Đang vận chuyển',
      description: 'Đơn hàng đang được giao đến bạn',
      time: shipping ? created : 'Dự kiến',
      completed: shipping,
    },
    {
      title: 'Giao hàng thành công',
      description: 'Đơn hàng đã được giao thành công',
      time: completed ? created : '—',
      completed,
    },
  ];
};

const mapOrderItem = (orderId: string, item: ApiOrder['items'][0], idx: number): OrderItem => {
  const rawProductId = item.productId as string | { _id?: string } | undefined;
  const productId =
    typeof rawProductId === 'object' && rawProductId?._id
      ? String(rawProductId._id)
      : rawProductId
        ? String(rawProductId)
        : undefined;

  return {
    id: `${orderId}-item-${idx}`,
    productId,
    name: item.name,
    image: '',
    price: item.priceSell,
    quantity: item.quantity,
    variant: item.variantName,
  };
};

export const mapApiOrderToOrderData = (order: ApiOrder): OrderData => {
  const orderId = resolveMongoId(order._id);
  return {
    id: orderId,
    orderCode: order.orderCode,
    date: formatDate(order.createdAt),
    status: mapApiStatusToUi(order.status),
    items: (order.items || []).map((item, idx) => mapOrderItem(orderId, item, idx)),
    totalAmount: order.totalAmount,
    shippingFee: order.shippingFee,
    discountAmount: order.discountAmount,
    paymentMethod: formatPaymentMethod((order as ApiOrder & { paymentMethod?: string }).paymentMethod),
    paymentStatus: order.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID',
    shippingAddress: formatShippingAddress(order.shippingAddress),
    trackingSteps: buildTrackingSteps(order),
  };
};
