export interface VariantType {
  variantName?: string;
  weight: number;
  priceImport: number;
  priceSell: number;
  stockQty: number;
  reservedQty?: number;
  stockAlert?: number;
  profit?: number;
}

export interface ProductType {
  _id?: string;
  id?: string | number;
  name: string;
  sku?: string;
  slug?: string;
  category?: any;
  skinTypes?: any[];
  mainImage?: string;
  galleryImages?: string[];
  description?: string;
  detailInfo?: string;
  variants?: VariantType[];
  isActive?: boolean;
  active?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryType {
  _id?: string;
  id?: string | number;
  code: string;
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkinTypeType {
  _id?: string;
  id?: string | number;
  code: string;
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}