import type {
  ProductType,
} from '@/types/catalog';

import {
  MOCK_PRODUCTS,
} from '../../../mock/catalog';

// =========================
// NORMALIZE PRODUCT
// =========================

const normalizeProduct = (
  product: any,
): ProductType => {

  return {

    ...product,

    image:
      product.image ||
      product.thumbnail ||
      '',

    price:
      Number(product.price) || 0,

    stock:
      Number(product.stock) || 0,

    variants:
      product.variants || [],
  };
};

const PRODUCT_KEY = 'products';

// =========================
// TYPES
// =========================

export interface ProductResponse<T> {
  success: boolean;

  data: T;

  message?: string;
}

// =========================
// STORAGE HELPERS
// =========================

const seedMockProducts = () => {
  const products =
    localStorage.getItem(
      PRODUCT_KEY,
    );

  if (!products) {
    localStorage.setItem(
      PRODUCT_KEY,
      JSON.stringify(MOCK_PRODUCTS),
    );
  }
};

const getStoredProducts =
  (): ProductType[] => {
    try {
      seedMockProducts();

      const products =
        localStorage.getItem(
          PRODUCT_KEY,
        );

      const parsedProducts =
        products
          ? JSON.parse(products)
          : [];

      return parsedProducts.map(
        normalizeProduct,
      );
    } catch (error) {
      console.error(
        'Parse products error:',
        error,
      );

      return [];
    }
  };

const saveStoredProducts = (
  products: ProductType[],
) => {
  localStorage.setItem(
    PRODUCT_KEY,
    JSON.stringify(products),
  );
};

// =========================
// GET ALL PRODUCTS
// =========================

export async function getAdminProducts(): Promise<
  ProductResponse<ProductType[]>
> {
  try {
    const products =
      getStoredProducts();

    return {
      success: true,

      data: products,

      message:
        'Lấy danh sách sản phẩm thành công',
    };
  } catch (error) {
    return {
      success: false,

      data: [],

      message:
        'Không thể tải danh sách sản phẩm',
    };
  }
}

// =========================
// GET PRODUCTS
// PUBLIC FOR SHOP/PROMOTION
// =========================

export async function getProducts(): Promise<
  ProductType[]
> {

  try {

    return getStoredProducts();

  } catch (error) {

    console.error(
      'Get products error:',
      error,
    );

    return [];
  }
}

// =========================
// GET PRODUCT DETAIL
// =========================

export async function getProductDetail(
  productId: number,
): Promise<
  ProductResponse<
    ProductType | null
  >
> {
  try {
    const products =
      getStoredProducts();

    const product =
      products.find(
        (item) =>
          item.id === productId,
      ) || null;

    return {
      success: true,

      data: product,

      message:
        'Lấy chi tiết sản phẩm thành công',
    };
  } catch (error) {
    return {
      success: false,

      data: null,

      message:
        'Không thể tải chi tiết sản phẩm',
    };
  }
}

// =========================
// CREATE PRODUCT
// =========================

export async function createProduct(
  product: ProductType,
): Promise<
  ProductResponse<ProductType>
> {
  try {
    const products =
      getStoredProducts();

    const newProduct: ProductType =
      normalizeProduct({
        ...product,

        id:
          product.id ||
          Date.now(),

        variants:
          product.variants || [],
      });

    const updatedProducts = [
      newProduct,
      ...products,
    ];

    saveStoredProducts(
      updatedProducts,
    );

    return {
      success: true,

      data: newProduct,

      message:
        'Tạo sản phẩm thành công',
    };
  } catch (error) {
    return {
      success: false,

      data: product,

      message:
        'Không thể tạo sản phẩm',
    };
  }
}

// =========================
// UPDATE PRODUCT
// =========================

export async function updateProduct(
  productId: number,
  payload: Partial<ProductType>,
): Promise<
  ProductResponse<
    ProductType | null
  >
> {
  try {
    const products =
      getStoredProducts();

    let updatedProduct:
      | ProductType
      | null = null;

    const updatedProducts =
      products.map((item) => {
        if (
          item.id === productId
        ) {
          updatedProduct =
            normalizeProduct({
              ...item,
              ...payload,
            });

          return updatedProduct;
        }

        return item;
      });

    saveStoredProducts(
      updatedProducts,
    );

    return {
      success: true,

      data: updatedProduct,

      message:
        'Cập nhật sản phẩm thành công',
    };
  } catch (error) {
    return {
      success: false,

      data: null,

      message:
        'Không thể cập nhật sản phẩm',
    };
  }
}

// =========================
// DELETE PRODUCT
// =========================

export async function deleteProduct(
  productId: number,
): Promise<
  ProductResponse<null>
> {
  try {
    const products =
      getStoredProducts();

    const updatedProducts =
      products.filter(
        (item) =>
          item.id !== productId,
      );

    saveStoredProducts(
      updatedProducts,
    );

    return {
      success: true,

      data: null,

      message:
        'Xóa sản phẩm thành công',
    };
  } catch (error) {
    return {
      success: false,

      data: null,

      message:
        'Không thể xóa sản phẩm',
    };
  }
}

// =========================
// UPDATE PRODUCT STATUS
// =========================

export async function updateProductStatus(
  productId: number,
  active: boolean,
): Promise<
  ProductResponse<
    ProductType | null
  >
> {
  try {
    const products =
      getStoredProducts();

    let updatedProduct:
      | ProductType
      | null = null;

    const updatedProducts =
      products.map((item) => {
        if (
          item.id === productId
        ) {
          updatedProduct = {
            ...item,
            active,
          };

          return updatedProduct;
        }

        return item;
      });

    saveStoredProducts(
      updatedProducts,
    );

    return {
      success: true,

      data: updatedProduct,

      message:
        'Cập nhật trạng thái thành công',
    };
  } catch (error) {
    return {
      success: false,

      data: null,

      message:
        'Không thể cập nhật trạng thái',
    };
  }
}

// =========================
// RESET MOCK DATA
// =========================

export async function resetMockProducts() {
  localStorage.setItem(
    PRODUCT_KEY,
    JSON.stringify(MOCK_PRODUCTS),
  );

  return {
    success: true,
  };
}