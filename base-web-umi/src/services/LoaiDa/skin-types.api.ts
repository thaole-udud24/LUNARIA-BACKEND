import request from '@/services/base/request';

export async function getSkinTypes(params?: any) {
  return request('/api/admin/skin-types', { method: 'GET', params });
}

export async function createSkinType(data: any) {
  return request('/api/admin/skin-types', { method: 'POST', data });
}

export async function updateSkinType(id: string, data: any) {
  return request(`/api/admin/skin-types/${id}`, { method: 'PUT', data });
}

export async function deleteSkinType(id: string) {
  return request(`/api/admin/skin-types/${id}`, { method: 'DELETE' });
}

export async function updateSkinTypeStatus(id: string, isActive: boolean) {
  return request(`/api/admin/skin-types/${id}/status`, { method: 'PATCH', data: { isActive } });
}

export async function exportSkinTypes(fields: string[], filters?: any) {
  return request('/api/admin/skin-types/export', {
    method: 'POST',
    data: { fields, filters },
    responseType: 'blob',
  });
}

export async function previewImportSkinTypes(file: File, mapping: Record<string, string>) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mapping', JSON.stringify(mapping));
  return request('/api/admin/skin-types/import/preview', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

export async function commitImportSkinTypes(data: any[]) {
  return request('/api/admin/skin-types/import/commit', {
    method: 'POST',
    data: { data },
  });
}