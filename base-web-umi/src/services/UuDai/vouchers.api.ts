import request from '@/services/base/request';
import type { CreateVoucherPayload } from '@/types/voucher';

export async function getVouchers(params?: any) {
  return request('/api/admin/vouchers', { method: 'GET', params });
}

export async function getVoucher(id: string) {
  return request(`/api/admin/vouchers/${id}`, { method: 'GET' });
}

export async function createVoucher(data: CreateVoucherPayload) {
  return request('/api/admin/vouchers', { method: 'POST', data });
}

export async function updateVoucher(id: string, data: Partial<CreateVoucherPayload>) {
  return request(`/api/admin/vouchers/${id}`, { method: 'PATCH', data });
}

export async function deleteVoucher(id: string) {
  return request(`/api/admin/vouchers/${id}`, { method: 'DELETE' });
}

export async function activateVoucher(id: string) {
  return request(`/api/admin/vouchers/${id}/activate`, { method: 'PATCH' });
}

export async function disableVoucher(id: string) {
  return request(`/api/admin/vouchers/${id}/disable`, { method: 'PATCH' });
}

export async function exportVouchers(fields: string[], filters?: any) {
  return request('/api/admin/vouchers/export', {
    method: 'POST',
    data: { fields, filters },
    responseType: 'blob',
  });
}

export async function previewImportVouchers(file: File, mapping: Record<string, string>) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mapping', JSON.stringify(mapping));
  return request('/api/admin/vouchers/import/preview', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

export async function commitImportVouchers(data: any[]) {
  return request('/api/admin/vouchers/import/commit', {
    method: 'POST',
    data: { data },
  });
}