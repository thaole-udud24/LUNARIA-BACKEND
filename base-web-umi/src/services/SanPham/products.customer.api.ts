import request from '@/services/base/request';

export interface ListProductsParams {
  search?: string;
  category?: string;
  skinTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export async function getProducts(params?: ListProductsParams) {
  return request('/api/products', { method: 'GET', params });
}

export async function getBestSellingProducts(limit = 8) {
  return request('/api/products/best-sellers', { method: 'GET', params: { limit } });
}

export async function getProductById(id: string) {
  return request(`/api/products/${id}`, { method: 'GET' });
}
