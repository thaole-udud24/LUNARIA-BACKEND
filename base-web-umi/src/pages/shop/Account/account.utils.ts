import moment from 'moment';
import { resolveMediaUrl } from '@/utils/apiUrl';
import {
  formatPhoneDisplay,
  normalizePhoneDigits,
} from '@/pages/shop/Checkout/validators';

export const SAVED_VOUCHERS_KEY = 'lunaria_saved_vouchers';

export type AccountTabType =
  | 'DASHBOARD'
  | 'PROFILE'
  | 'ORDERS'
  | 'ADDRESSES'
  | 'VOUCHERS'
  | 'CHANGE_PASSWORD';

export const ACCOUNT_TABS: AccountTabType[] = [
  'DASHBOARD',
  'PROFILE',
  'ORDERS',
  'ADDRESSES',
  'VOUCHERS',
  'CHANGE_PASSWORD',
];

export type OrderFilterKey =
  | 'ALL'
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ApiOrderItem {
  productId?: string;
  name: string;
  variantName?: string;
  quantity: number;
  priceSell: number;
}

export interface ApiOrder {
  _id: string;
  orderCode: string;
  items: ApiOrderItem[];
  originalTotal: number;
  shippingFee: number;
  discountAmount: number;
  appliedVoucher?: string | null;
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt?: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    addressLine: string;
    province: string;
    district: string;
    ward: string;
  };
}

export interface ApiAddress {
  _id: string;
  label?: string;
  receiver_name: string;
  receiver_phone_e164: string;
  address_line: string;
  province_name: string;
  district_name: string;
  ward_name: string;
  is_default: boolean;
}

export interface AccountProfile {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  birthday: string;
  avatar: string;
  memberSince: string;
}

export interface AccountAddress {
  id: string;
  isDefault: boolean;
  label?: string;
  fullName: string;
  phone: string;
  addressLine: string;
  province: string;
  district: string;
  ward: string;
}

export interface SavedVoucher {
  code: string;
  discountAmount: number;
  savedAt: string;
  name?: string;
  minOrder?: number;
  expiresAt?: string;
}

export interface VoucherView {
  code: string;
  name: string;
  discountAmount: number;
  condition: string;
  expiresAt?: string;
  status: 'available' | 'used' | 'expired';
  usedAt?: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  totalProducts: number;
  totalVouchers: number;
  monthlySpending: { month: string; amount: number; orders: number }[];
  topProducts: { name: string; quantity: number }[];
}

export const normalizeApiResponse = <T>(res: unknown): T => {
  const parsed = res as { data?: T };
  return (parsed?.data ?? res) as T;
};

export const slugifyLocationId = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const phoneToE164 = (phone: string) => {
  const digits = normalizePhoneDigits(phone);
  if (digits.startsWith('0')) return `+84${digits.slice(1)}`;
  if (digits) return `+84${digits}`;
  return '';
};

export const e164ToDisplayPhone = (e164?: string) => {
  if (!e164) return '';
  return formatPhoneDisplay(normalizePhoneDigits(e164));
};

export const resolveDisplayPhone = (options: {
  profilePhone?: string;
  phoneE164?: string;
  countryCode?: string;
  nationalNumber?: string;
}) => {
  const { profilePhone, phoneE164, countryCode, nationalNumber } = options;
  const profileDigits = profilePhone?.replace(/\D/g, '') || '';
  if (profileDigits) return formatPhoneDisplay(profileDigits);

  if (phoneE164) return e164ToDisplayPhone(phoneE164);

  const nationalDigits = nationalNumber?.replace(/\D/g, '') || '';
  if (!nationalDigits) return '';

  if (nationalDigits.startsWith('0')) {
    return formatPhoneDisplay(nationalDigits);
  }

  const cc = (countryCode || '+84').replace(/\D/g, '');
  return formatPhoneDisplay(normalizePhoneDigits(`${cc}${nationalDigits}`));
};

export const formatPrice = (value?: number) =>
  value != null ? `${value.toLocaleString('vi-VN')}đ` : '0đ';

export const formatDate = (value?: string) => {
  if (!value) return '—';
  return moment(value).format('DD/MM/YYYY');
};

export const formatDateTime = (value?: string) => {
  if (!value) return '—';
  return moment(value).format('DD/MM/YYYY HH:mm');
};

export const mapGetMeToProfile = (data: any): AccountProfile => {
  const account = data?.account ?? {};
  const profile = data?.profile ?? {};
  const phones = data?.phones ?? [];
  const defaultPhone =
    phones.find((p: any) => p.is_default) ?? phones[0];

  return {
    fullName: profile.full_name || account.name || account.email?.split('@')[0] || 'Thành viên',
    email: account.email || '',
    phone: normalizePhoneDigits(
      resolveDisplayPhone({
        profilePhone: profile.phone,
        phoneE164: defaultPhone?.phone_e164,
        countryCode: defaultPhone?.country_calling_code,
        nationalNumber: defaultPhone?.national_number,
      }),
    ),
    gender: profile.gender || '',
    birthday: profile.date_of_birth ? moment(profile.date_of_birth).format('YYYY-MM-DD') : '',
    avatar: resolveMediaUrl(profile.avatar_url) || '',
    memberSince: account.createdAt ? moment(account.createdAt).format('MM/YYYY') : '',
  };
};

export const mapApiSavedVouchers = (list: any[] = []): SavedVoucher[] =>
  list.map((item) => ({
    code: item.code,
    name: item.name,
    discountAmount: item.discount_amount ?? item.discountAmount ?? 0,
    expiresAt: item.expires_at || item.expiresAt,
    minOrder: item.min_order ?? item.minOrder,
    savedAt: item.saved_at || item.savedAt,
  }));

export const mapApiAddresses = (addresses: ApiAddress[] = []): AccountAddress[] =>
  addresses.map((item) => ({
    id: String(item._id),
    isDefault: !!item.is_default,
    label: item.label,
    fullName: item.receiver_name,
    phone: e164ToDisplayPhone(item.receiver_phone_e164),
    addressLine: item.address_line,
    province: item.province_name,
    district: item.district_name,
    ward: item.ward_name,
  }));

export const getOrderStatusMeta = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { label: 'Chờ xác nhận', className: 'pending', filter: 'PENDING' as OrderFilterKey };
    case 'CONFIRMED':
      return { label: 'Đã xác nhận', className: 'processing', filter: 'CONFIRMED' as OrderFilterKey };
    case 'PROCESSING':
      return { label: 'Đang giao hàng', className: 'shipping', filter: 'PROCESSING' as OrderFilterKey };
    case 'COMPLETED':
      return { label: 'Hoàn thành', className: 'completed', filter: 'COMPLETED' as OrderFilterKey };
    case 'CANCELLED':
      return { label: 'Đã hủy', className: 'cancelled', filter: 'CANCELLED' as OrderFilterKey };
    default:
      return { label: status, className: 'pending', filter: 'ALL' as OrderFilterKey };
  }
};

export const filterOrdersByTab = (orders: ApiOrder[], filter: OrderFilterKey) => {
  if (filter === 'ALL') return orders;
  return orders.filter((o) => o.status === filter);
};

export const buildDashboardStats = (
  orders: ApiOrder[],
  savedVouchers: SavedVoucher[],
): DashboardStats => {
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const totalSpent = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalProducts = orders.reduce(
    (sum, o) => sum + (o.items || []).reduce((s, i) => s + (i.quantity || 0), 0),
    0,
  );

  const monthMap = new Map<string, { amount: number; orders: number }>();
  orders.forEach((order) => {
    const key = moment(order.createdAt).format('MM/YYYY');
    const prev = monthMap.get(key) || { amount: 0, orders: 0 };
    monthMap.set(key, {
      amount: prev.amount + (order.totalAmount || 0),
      orders: prev.orders + 1,
    });
  });

  const monthlySpending = Array.from(monthMap.entries())
    .map(([month, val]) => ({ month, ...val }))
    .sort((a, b) => moment(a.month, 'MM/YYYY').valueOf() - moment(b.month, 'MM/YYYY').valueOf())
    .slice(-6);

  const productMap = new Map<string, number>();
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      productMap.set(item.name, (productMap.get(item.name) || 0) + item.quantity);
    });
  });

  const topProducts = Array.from(productMap.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const usedCodes = new Set(
    orders.filter((o) => o.appliedVoucher).map((o) => o.appliedVoucher as string),
  );

  return {
    totalOrders: orders.length,
    totalSpent,
    totalProducts,
    totalVouchers: savedVouchers.filter((v) => !usedCodes.has(v.code)).length + usedCodes.size,
    monthlySpending,
    topProducts,
  };
};

export const readSavedVouchers = (): SavedVoucher[] => {
  try {
    const raw = localStorage.getItem(SAVED_VOUCHERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveVoucherLocally = (voucher: SavedVoucher) => {
  const list = readSavedVouchers();
  const exists = list.find((v) => v.code === voucher.code);
  const next = exists
    ? list.map((v) => (v.code === voucher.code ? { ...v, ...voucher } : v))
    : [voucher, ...list];
  localStorage.setItem(SAVED_VOUCHERS_KEY, JSON.stringify(next));
  return next;
};

export const buildVoucherViews = (
  orders: ApiOrder[],
  savedVouchers: SavedVoucher[],
): VoucherView[] => {
  const usedFromOrders: VoucherView[] = orders
    .filter((o) => o.appliedVoucher && (o.discountAmount || 0) > 0)
    .map((o) => ({
      code: o.appliedVoucher as string,
      name: `Voucher ${o.appliedVoucher}`,
      discountAmount: o.discountAmount,
      condition: 'Đã áp dụng khi thanh toán đơn hàng',
      status: 'used' as const,
      usedAt: o.createdAt,
    }));

  const usedCodes = new Set(usedFromOrders.map((v) => v.code));
  const now = moment();

  const availableFromStorage: VoucherView[] = savedVouchers
    .filter((v) => !usedCodes.has(v.code))
    .map((v) => {
      const expired = v.expiresAt ? moment(v.expiresAt).isBefore(now) : false;
      return {
        code: v.code,
        name: v.name || `Voucher ${v.code}`,
        discountAmount: v.discountAmount,
        condition: v.minOrder ? `Đơn tối thiểu ${formatPrice(v.minOrder)}` : 'Áp dụng tại giỏ hàng',
        expiresAt: v.expiresAt,
        status: expired ? ('expired' as const) : ('available' as const),
      };
    });

  const merged = [...availableFromStorage];
  usedFromOrders.forEach((item) => {
    if (!merged.find((v) => v.code === item.code)) merged.push(item);
  });

  return merged.sort((a, b) => {
    const rank = { available: 0, used: 1, expired: 2 };
    return rank[a.status] - rank[b.status];
  });
};

export const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: '', className: '' };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: 'Yếu', className: 'weak' };
  if (score === 2) return { score: 2, label: 'Trung bình', className: 'medium' };
  if (score === 3) return { score: 3, label: 'Khá', className: 'good' };
  return { score: 4, label: 'Mạnh', className: 'strong' };
};
