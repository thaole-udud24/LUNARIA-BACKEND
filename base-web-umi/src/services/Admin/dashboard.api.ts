import request from '@/services/base/request';

// Báo cáo doanh thu
export async function getReportsData(params?: { month?: string; categoryId?: string }) {
  return request('/api/admin/dashboard/revenue', {
    method: 'GET',
    params,
  });
}

// ĐÃ FIX: Thêm fields?: string[] vào đây
export async function exportRevenueReport(params?: { month?: string; fields?: string[]; categoryId?: string }) {
  return request('/api/admin/dashboard/revenue/export', {
    method: 'GET',
    params: {
      month: params?.month,
      categoryId: params?.categoryId || undefined,
      fields: params?.fields?.join(','),
    },
    responseType: 'blob',
  });
}

// API TỔNG QUAN (DASHBOARD) - Chú ý đường dẫn có chữ /overview
export async function getDashboardData(params?: any) {
  return request('/api/admin/dashboard/overview', {
    method: 'GET',
    params,
  });
}