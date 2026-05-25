export const PRODUCT_STORAGE_KEY =
  'products';

export const getProductsStorage = () => {
  const data = localStorage.getItem(
    PRODUCT_STORAGE_KEY,
  );

  return data ? JSON.parse(data) : [];
};

export const saveProductsStorage = (
  products: any[],
) => {
  localStorage.setItem(
    PRODUCT_STORAGE_KEY,
    JSON.stringify(products),
  );
};