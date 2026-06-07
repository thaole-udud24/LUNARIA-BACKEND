import request from '@/services/base/request';

export async function getCategories(params?: any) {
  return request('/api/admin/categories', { method: 'GET', params });
}

export async function createCategory(data: any) {
  return request('/api/admin/categories', { method: 'POST', data });
}

export async function updateCategory(id: string, data: any) {
  return request(`/api/admin/categories/${id}`, { method: 'PUT', data });
}

export async function deleteCategory(id: string) {
  return request(`/api/admin/categories/${id}`, { method: 'DELETE' });
}

export async function updateCategoryStatus(id: string, isActive: boolean) {
  return request(`/api/admin/categories/${id}/status`, { method: 'PATCH', data: { isActive } });
}

export async function exportCategories(fields: string[], filters?: any) {
  return request('/api/admin/categories/export', {
    method: 'POST',
    data: { fields, filters },
    responseType: 'blob',
  });
}

export async function previewImportCategories(file: File, mapping: Record<string, string>) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mapping', JSON.stringify(mapping));
  return request('/api/admin/categories/import/preview', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

export async function commitImportCategories(data: any[]) {
  return request('/api/admin/categories/import/commit', {
    method: 'POST',
    data: { data },
  });
}