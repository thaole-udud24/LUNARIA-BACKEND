// =========================
// APPLY TYPE
// =========================

export type PromotionApplyType =
  | 'all'
  | 'specific';

export type PromotionCustomerScope =
  | 'all_customers'
  | 'new_customers'
  | 'vip_customers';

export type PromotionRepeatType =
  | 'none'
  | 'daily'
  | 'weekly';

// =========================
// PROMOTION ENTITY
// =========================

/**
 * BUSINESS ENTITY
 *
 * Chỉ chứa:
 * - persistence data
 * - business data
 *
 * KHÔNG chứa:
 * - runtime UI
 * - preview data
 * - calculated pricing
 * - status derived
 */

export interface Promotion {
  id: number;

  name: string;

  code?: string;

  /**
   * all
   * specific
   */

  applyType: PromotionApplyType;

  /**
   * applyType = all
   * -> empty array
   *
   * applyType = specific
   * -> selected product ids
   */

  productIds: number[];

  /**
   * ONE promotion
   * = ONE discount percent
   *
   * dùng cho:
   * - all products
   * - specific products
   */

  discountPercent: number;

  customerScope: PromotionCustomerScope;

  goldenHourStart?: string;

  goldenHourEnd?: string;

  repeatType: PromotionRepeatType;

  startDate: string;

  endDate: string;
}

// =========================
// CREATE PAYLOAD
// =========================

export interface CreatePromotionPayload {
  name: string;

  code?: string;

  applyType: PromotionApplyType;

  productIds: number[];

  discountPercent: number;

  startDate: string;

  endDate: string;

  customerScope: PromotionCustomerScope;

  goldenHourStart?: string;

  goldenHourEnd?: string;

  repeatType: PromotionRepeatType;
}

// =========================
// UPDATE PAYLOAD
// =========================

export interface UpdatePromotionPayload
  extends Partial<CreatePromotionPayload> {}

// =========================
// PREVIEW PRODUCT MODEL
// =========================

/**
 * UI VIEW MODEL
 *
 * Chỉ dùng render preview
 * KHÔNG lưu database
 */

export interface PromotionPreviewProduct {
  id: number;

  name: string;

  image?: string;

  originalPrice: number;

  discountPercent: number;

  discountPrice: number;

  stock: number;

  active?: boolean;
}