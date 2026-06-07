import request from '@/services/base/request';
import type { CreateProductDto, UpdateProductDto } from './types';

// Strip các field BE không chấp nhận trong variants
const cleanVariants = (variants?: any[]) =>
  variants?.map(({ reservedQty, originalPrice, profit, ...rest }) => rest) ?? [];

export async function getAdminProducts(params?: any) {
  return request('/api/admin/products', {
    method: 'GET',
    params,
  });
}

export async function getAdminProductById(id: string) {
  return request(`/api/admin/products/${id}`, {
    method: 'GET',
  });
}

export async function createProduct(data: CreateProductDto) {
  return request('/api/admin/products', {
    method: 'POST',
    data: {
      ...data,
      variants: cleanVariants(data.variants),
    },
  });
}

export async function updateProduct(id: string, data: UpdateProductDto) {
  return request(`/api/admin/products/${id}`, {
    method: 'PUT',
    data: {
      ...data,
      variants: cleanVariants(data.variants),
    },
  });
}

export async function updateProductStatus(id: string, isActive: boolean) {
  return request(`/api/admin/products/${id}/status`, {
    method: 'PATCH',
    data: { isActive },
  });
}

/** @deprecated dùng updateProductStatus */
export async function toggleProductStatus(id: string) {
  return request(`/api/admin/products/${id}/toggle`, {
    method: 'PATCH',
  });
}

export async function deleteProduct(id: string) {
  return request(`/api/admin/products/${id}`, {
    method: 'DELETE',
  });
}

// ==== ĐÃ FIX: Dùng chung một hàm uploadImage duy nhất ====
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/api/admin/products/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}