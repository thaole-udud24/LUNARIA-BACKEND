export type VoucherApplyType =
  | 'all'
  | 'specific';

export type VoucherStatus =
  | 'upcoming'
  | 'active'
  | 'expired'
  | 'inactive';

export type VoucherCustomerScope =
  | 'all'
  | 'new'
  | 'vip';

export type VoucherRepeatType =
  | 'none'
  | 'daily'
  | 'weekly';

export interface Voucher {
  id: number;

  name: string;

  code: string;

  applyType: VoucherApplyType;

  customerScope: VoucherCustomerScope;

  repeatType?: VoucherRepeatType;

  productIds: number[];

  discountPercent: number;

  goldenHourStart?: string;

  goldenHourEnd?: string;

  startDate: string;

  endDate: string;

  status?: VoucherStatus;

  active?: boolean;

  createdAt?: string;

  updatedAt?: string;
}

export interface CreateVoucherPayload {
  name: string;

  code: string;

  applyType: VoucherApplyType;

  customerScope: VoucherCustomerScope;

  repeatType?: VoucherRepeatType;

  productIds: number[];

  discountPercent: number;

  goldenHourStart?: string;

  goldenHourEnd?: string;

  startDate: string;

  endDate: string;
}

export interface VoucherPreviewProduct {
  id: number;

  name: string;

  image?: string;

  originalPrice: number;

  discountPercent: number;

  discountPrice: number;

  stock?: number;

  active?: boolean;
}