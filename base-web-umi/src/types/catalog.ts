export interface ProductType {
  id: number;

  name: string;

  category?: string;

  skinType?: string;

  description?: string;

  detail?: string;

  weight: number;

  importPrice: number;

  price: number;

  stock: number;

  warningStock?: number;

  images: string[];

  image?: string;

  active: boolean;

  variants?: VariantType[];

  categoryId?: number;

  skinTypeId?: number;
}

export interface VariantType {
  weight: number;

  importPrice: number;

  price: number;

  stock: number;
}

export interface CategoryType {
  id: number;

  code: string;

  name: string;

  description?: string;

  active: boolean;
}