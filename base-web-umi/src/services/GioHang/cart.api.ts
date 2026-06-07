import request from '@/services/base/request';

export interface AddToCartPayload {
  productId: string;
  variantName: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  productId: string;
  variantName: string;
  quantity: number;
}

export async function getCart() {
  return request('/api/cart', { method: 'GET' });
}

export async function addToCart(data: AddToCartPayload) {
  return request('/api/cart/add', { method: 'POST', data });
}

export async function updateCartItem(data: UpdateCartItemPayload) {
  return request('/api/cart/update', { method: 'PUT', data });
}
