export interface Voucher {
  _id: string;
  id?: string;
  voucherCode: string;
  voucherName: string;
  status: 'DRAFT' | 'ACTIVE' | 'DISABLED' | 'EXPIRED';
  customerScope: 'ALL_CUSTOMERS' | 'SPECIFIC_CUSTOMERS';
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  applyScope: 'ALL_PRODUCTS' | 'SPECIFIC_PRODUCTS';
  startDate: string;
  endDate: string;
  goldenHourStart?: string;
  goldenHourEnd?: string;
  repeatType: 'NONE' | 'WEEKLY' | 'MONTHLY';
  repeatDays?: string[];
  applicableProductIds?: string[];
  minOrderValue?: number;
  usageLimit?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVoucherPayload {
  voucherCode: string;
  voucherName: string;
  customerScope: 'ALL_CUSTOMERS' | 'SPECIFIC_CUSTOMERS';
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  applyScope: 'ALL_PRODUCTS' | 'SPECIFIC_PRODUCTS';
  startDate: string;
  endDate: string;
  goldenHourStart?: string;
  goldenHourEnd?: string;
  repeatType: 'NONE' | 'WEEKLY' | 'MONTHLY';
  repeatDays?: string[];
  applicableProductIds?: string[];
  minOrderValue?: number;
  usageLimit?: number;
  description?: string;
}
