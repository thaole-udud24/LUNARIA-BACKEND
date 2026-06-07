import moment from 'moment';
import { normalizeApiResponse } from '@/pages/shop/Account/account.utils';
import {
  ApiNotification,
  NotificationsListResult,
} from '@/services/ThongBao/notifications.customer.api';
import { NotificationItemData } from '@/pages/shop/Notifications/types';

export const resolveNotificationId = (value: unknown): string => {
  if (value == null || value === '') return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const obj = value as { _id?: unknown; toString?: () => string };
    if (obj._id != null) return resolveNotificationId(obj._id);
    if (typeof obj.toString === 'function') {
      const text = obj.toString();
      if (/^[a-f0-9]{24}$/i.test(text)) return text;
    }
  }
  return String(value);
};

export const parseNotificationsList = (res: unknown): NotificationsListResult => {
  const parsed = normalizeApiResponse<NotificationsListResult>(res);
  return {
    data: Array.isArray(parsed?.data) ? parsed.data : [],
    total: parsed?.total ?? 0,
    page: parsed?.page ?? 1,
    limit: parsed?.limit ?? 50,
    unreadCount: parsed?.unreadCount ?? 0,
  };
};

export const parseUnreadCount = (res: unknown): number => {
  const parsed = normalizeApiResponse<{ unreadCount?: number }>(res);
  return parsed?.unreadCount ?? 0;
};

export const mapApiNotificationToItem = (
  item: ApiNotification,
): NotificationItemData => {
  const createdAt = item.createdAt || item.updatedAt;
  const momentValue = createdAt ? moment(createdAt) : moment();

  return {
    id: resolveNotificationId(item._id),
    category: item.category,
    title: item.title,
    message: item.message,
    date: momentValue.format('DD/MM/YYYY'),
    time: momentValue.format('HH:mm'),
    isRead: Boolean(item.isRead),
    orderCode: item.orderCode ? `#${item.orderCode.replace(/^#/, '')}` : undefined,
    voucherCode: item.voucherCode || undefined,
    discountAmount: item.discountAmount || undefined,
    productName: item.productName || undefined,
    productImage: item.productImage || undefined,
    actionText: item.actionText || undefined,
    actionLink: item.actionLink || undefined,
  };
};

export const mapApiNotifications = (items: ApiNotification[]) =>
  items.map(mapApiNotificationToItem);

export const extractNotificationError = (err: unknown) => {
  const e = err as { data?: { message?: string | string[] }; message?: string };
  const msg = e?.data?.message ?? e?.message;
  if (Array.isArray(msg)) return msg.join(', ');
  return msg || 'Không thể tải thông báo, vui lòng thử lại';
};
