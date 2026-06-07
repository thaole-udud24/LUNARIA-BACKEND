import request from '@/services/base/request';

export interface ApplyVoucherPayload {
  voucherCode: string;
  cartTotal?: number;
  eligibleCartTotal?: number;
  productIds?: string[];
  hasDirectDiscount?: boolean;
}

export interface ApplyVoucherResult {
  discountAmount: number;
  voucherCode: string;
  voucherName?: string;
  endDate?: string;
  minOrderAmount?: number;
  message?: string;
}

export async function applyVoucher(data: ApplyVoucherPayload): Promise<ApplyVoucherResult> {
  const res = await request('/api/vouchers/validate', { method: 'POST', data });
  const parsed = (res as any)?.data ?? res;
  const voucher = parsed?.voucher;
  return {
    discountAmount: parsed?.discountAmount ?? 0,
    voucherCode: voucher?.voucherCode ?? data.voucherCode,
    voucherName: voucher?.voucherName,
    endDate: voucher?.endDate,
    minOrderAmount: voucher?.minOrderAmount,
    message: parsed?.valid ? 'Áp dụng voucher thành công' : undefined,
  };
}
