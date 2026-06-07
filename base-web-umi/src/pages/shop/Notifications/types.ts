export type NotificationCategory = 'ALL' | 'ORDER' | 'PROMOTION' | 'SYSTEM';

export interface NotificationItemData {
  id: string;
  category: 'ORDER' | 'PROMOTION' | 'SYSTEM';
  title: string;
  message: string;
  date: string;
  time: string;
  isRead: boolean;
  orderCode?: string;
  voucherCode?: string;
  discountAmount?: string;
  productName?: string;
  productImage?: string;
  actionText?: string;
  actionLink?: string;
}