import request from '@/services/base/request';

export type ApiNotificationCategory = 'ORDER' | 'PROMOTION' | 'SYSTEM';

export interface ApiNotification {
  _id: string;
  category: ApiNotificationCategory;
  title: string;
  message: string;
  isRead: boolean;
  orderId?: string | null;
  orderCode?: string | null;
  voucherCode?: string | null;
  discountAmount?: string | null;
  productName?: string | null;
  productImage?: string | null;
  actionText?: string | null;
  actionLink?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListNotificationsParams {
  page?: number;
  limit?: number;
  category?: ApiNotificationCategory;
  unreadOnly?: boolean;
  search?: string;
}

export interface NotificationsListResult {
  data: ApiNotification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

export async function getMyNotifications(params?: ListNotificationsParams) {
  return request('/api/notifications', { method: 'GET', params });
}

export async function getUnreadNotificationCount() {
  return request('/api/notifications/unread-count', { method: 'GET' });
}

export async function markNotificationAsRead(id: string) {
  return request(`/api/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsAsRead() {
  return request('/api/notifications/read-all', { method: 'PATCH' });
}

export async function deleteNotification(id: string) {
  return request(`/api/notifications/${id}`, { method: 'DELETE' });
}

export async function getNotificationDetail(id: string) {
  return request(`/api/notifications/${id}`, { method: 'GET' });
}
