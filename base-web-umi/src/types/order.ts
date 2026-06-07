// ========================
// ORDER TYPES
// ========================

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'VIETQR';

export interface OrderItem {
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  priceSell: number;
  mainImage?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  province: string;
  district: string;
  ward: string;
}

export interface OrderType {
  _id: string;
  orderCode: string;
  userId: string;
  items: OrderItem[];
  originalTotal: number;
  shippingFee: number;
  discountAmount: number;
  appliedVoucher?: string;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  note?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  qrUrl?: string;               // URL ảnh VietQR nếu paymentMethod = VIETQR
  paymentTimeout?: string;      // ISO date — deadline quét QR
  cancelReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ========================
// VOUCHER TYPES
// ========================

export interface VoucherResult {
  discountAmount: number;
  voucherCode: string;
  message?: string;
}

// ========================
// PROMOTION TYPES
// ========================

export type PromotionDiscountType = 'PERCENT' | 'FIXED';
export type PromotionApplyScope = 'ALL' | 'CATEGORY' | 'PRODUCT';
export type PromotionStatus = 'DRAFT' | 'ACTIVE' | 'ENDED';

export interface PromotionType {
  _id: string;
  name: string;
  description?: string;
  status: PromotionStatus;
  discountType: PromotionDiscountType;
  discountValue: number;
  applyScope: PromotionApplyScope;
  startDate: string;
  endDate: string;
  applicableProductIds: string[];
}