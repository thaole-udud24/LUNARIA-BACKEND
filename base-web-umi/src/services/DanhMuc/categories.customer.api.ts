import request from '@/services/base/request';

export async function getCategories() {
  return request('/api/categories', { method: 'GET' });
}
