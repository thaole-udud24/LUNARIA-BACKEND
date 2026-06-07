import request from '@/services/base/request';

export async function getSkinTypes() {
  return request('/api/skin-types', { method: 'GET' });
}
