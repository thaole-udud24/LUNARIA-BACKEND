import { request } from 'umi';

export async function getCategories() {
  return request('/api/categories', { method: 'GET' });
}

export async function getSkinTypes() {
  return request('/api/skin-types', { method: 'GET' });
}