import request from '@/services/base/request';
import type { CreatePromotionPayload } from '@/types/promotion';

export async function getPromotions(params?: any) {
  return request('/api/admin/promotions', { method: 'GET', params });
}

export async function getPromotion(id: string) {
  return request(`/api/admin/promotions/${id}`, { method: 'GET' });
}

export async function createPromotion(data: CreatePromotionPayload) {
  return request('/api/admin/promotions', { method: 'POST', data });
}

export async function updatePromotion(id: string, data: Partial<CreatePromotionPayload>) {
  return request(`/api/admin/promotions/${id}`, { method: 'PUT', data });
}

export async function deletePromotion(id: string) {
  return request(`/api/admin/promotions/${id}`, { method: 'DELETE' });
}

export async function activatePromotion(id: string) {
  return request(`/api/admin/promotions/${id}/activate`, { method: 'PATCH' });
}

export async function disablePromotion(id: string) {
  return request(`/api/admin/promotions/${id}/disable`, { method: 'PATCH' });
}

export async function exportPromotions(fields: string[], filters?: any) {
  return request('/api/admin/promotions/export', {
    method: 'POST',
    data: { fields, filters },
    responseType: 'blob',
  });
}

export async function previewImportPromotions(file: File, mapping: Record<string, string>) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mapping', JSON.stringify(mapping));
  return request('/api/admin/promotions/import/preview', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

export async function commitImportPromotions(data: any[]) {
  return request('/api/admin/promotions/import/commit', {
    method: 'POST',
    data: { data },
  });
}