// ========================
// PRODUCT TYPES
// ========================

export interface ProductVariant {
  variantName: string;
  priceSell: number;
  priceImport: number;
  stockQty: number;
  reservedQty: number;
  stockAlert: number;
  weight: number;
  profit: number;
}

export interface ProductType {
  _id: string;
  name: string;
  sku: string;
  slug: string;
  category: { _id: string; name: string } | string;
  skinTypes: Array<{ _id: string; name: string } | string>;
  mainImage: string;
  galleryImages: string[];
  description: string;
  detailInfo: string;
  variants: ProductVariant[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  data: ProductType[];
  total: number;
  page: number;
  limit: number;
}

// ========================
// CART TYPES
// ========================

export interface CartItem {
  productId: ProductType | string;
  variantName: string;
  quantity: number;
}

export interface CartType {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}