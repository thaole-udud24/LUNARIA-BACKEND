import { request } from 'umi';

export async function getSkinTypes() {
  return request('/api/skin-types', { method: 'GET' });
}