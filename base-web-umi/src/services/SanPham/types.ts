export interface ProductVariant {
  variantName: string;
  priceImport: number;
  priceSell: number;
  stockQty: number;
  reservedQty?: number;
  stockAlert?: number;
  weight: number;
  profit?: number;
}

export interface ProductType {
  _id: string;
  id?: string;
  name: string;
  sku: string;
  slug: string;
  category: any;
  skinTypes: any[];
  mainImage: string;
  galleryImages: string[];
  description: string;
  detailInfo: string;
  variants: ProductVariant[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  category: string;
  skinTypes?: string[];
  mainImage: string;
  galleryImages?: string[];
  description?: string;
  detailInfo?: string;
  variants: ProductVariant[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  isActive?: boolean;
}