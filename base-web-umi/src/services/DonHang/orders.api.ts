// SỬA DÒNG NÀY: Trỏ import về file request custom của bạn
import request from '@/services/base/request'; 
import type { GetOrdersParams } from './types';

// 1. Lấy danh sách đơn hàng (Có phân trang, lọc, tìm kiếm)
export async function getAdminOrders(params: GetOrdersParams) {
  return request('/api/admin/orders', {
    method: 'GET',
    params,
  });
}

// 2. Xác nhận đã nhận tiền (Duyệt đơn)
export async function confirmPaymentAdmin(id: string) {
  return request(`/api/admin/orders/${id}/confirm-payment`, {
    method: 'PATCH',
  });
}

// 3. Hủy đơn hàng (Kèm lý do)
export async function cancelOrderAdmin(id: string, reason: string) {
  return request(`/api/admin/orders/${id}/cancel`, {
    method: 'PATCH',
    data: { reason },
  });
}

export async function updateOrderStatusAdmin(id: string, status: string) {
  return request(`/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    data: { status },
  });
}

// 4. Lấy chi tiết đơn hàng
export async function getAdminOrderById(id: string) {
  return request(`/api/admin/orders/${id}`, { method: 'GET' });
}

// 5. Xuất Excel danh sách đơn hàng
export async function exportOrdersAdmin(params: any) {
  return request('/api/admin/orders/export', {
    method: 'GET', // Hoặc POST tùy theo Backend của bạn thiết kế
    params,
    responseType: 'blob', // Bắt buộc phải có dòng này để tải file
  });
}