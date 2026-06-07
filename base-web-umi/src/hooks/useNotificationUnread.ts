import { useCallback, useEffect, useState } from 'react';
import { getUnreadNotificationCount } from '@/services/ThongBao/notifications.customer.api';
import { parseUnreadCount } from '@/pages/shop/Notifications/notification.utils';

export default function useNotificationUnread(refreshKey?: string | number) {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      const res = await getUnreadNotificationCount();
      setUnreadCount(parseUnreadCount(res));
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount, refreshKey]);

  return { unreadCount, refreshUnreadCount, setUnreadCount };
}
