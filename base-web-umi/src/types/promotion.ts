export interface Promotion {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'DISABLED' | 'EXPIRED';
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  applyScope: 'ALL_PRODUCTS' | 'SPECIFIC_PRODUCTS';
  startDate: string;
  endDate: string;
  applicableProductIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePromotionPayload {
  name: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  applyScope: 'ALL_PRODUCTS' | 'SPECIFIC_PRODUCTS';
  startDate: string;
  endDate: string;
  applicableProductIds?: string[];
}
