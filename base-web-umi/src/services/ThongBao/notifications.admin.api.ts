import request from '@/services/base/request';
import type { ApiNotification, ApiNotificationCategory, ListNotificationsParams } from '@/services/ThongBao/notifications.customer.api';

export interface AdminNotificationsResult {
  data: ApiNotification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

export async function getAdminNotifications(params?: ListNotificationsParams) {
  return request('/api/admin/notifications', { method: 'GET', params }) as Promise<{
    success: boolean;
    data: AdminNotificationsResult;
  }>;
}

export async function getAdminUnreadNotificationCount() {
  return request('/api/admin/notifications/unread-count', { method: 'GET' });
}

export async function markAllAdminNotificationsAsRead(category?: ApiNotificationCategory) {
  return request('/api/admin/notifications/read-all', {
    method: 'PATCH',
    params: category ? { category } : undefined,
  });
}

export async function markAdminNotificationAsRead(id: string) {
  return request(`/api/admin/notifications/${id}/read`, { method: 'PATCH' });
}

export async function deleteAdminNotification(id: string) {
  return request(`/api/admin/notifications/${id}`, { method: 'DELETE' });
}
