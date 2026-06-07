import { request } from 'umi';
export async function getCategories() {
  return request('/api/categories', { method: 'GET' });
}