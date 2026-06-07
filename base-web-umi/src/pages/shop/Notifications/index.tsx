import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { history } from 'umi';
import NotificationSidebar from './components/NotificationSidebar';
import NotificationFilter from './components/NotificationFilter';
import NotificationItem from './components/NotificationItem';
import NotificationDetailModal from './components/NotificationDetailModal';
import { NotificationCategory, NotificationItemData } from './types';
import {
  deleteNotification,
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/services/ThongBao/notifications.customer.api';
import {
  extractNotificationError,
  mapApiNotifications,
  parseNotificationsList,
} from './notification.utils';
import './index.less';

const notifyUnreadChanged = () => {
  window.dispatchEvent(new Event('notifications:updated'));
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NotificationCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NotificationItemData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const res = await getMyNotifications({
        page: 1,
        limit: 100,
      });
      const parsed = parseNotificationsList(res);
      setNotifications(mapApiNotifications(parsed.data));
      setTotalUnreadCount(parsed.unreadCount);
    } catch (error) {
      message.error(extractNotificationError(error));
      setNotifications([]);
      setTotalUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab !== 'ALL' && item.category !== activeTab) {
        return false;
      }
      if (filterUnread && item.isRead) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q) ||
          item.orderCode?.toLowerCase().includes(q) ||
          item.voucherCode?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notifications, activeTab, filterUnread, searchQuery]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
      );
      setTotalUnreadCount((prev) => Math.max(0, prev - 1));
      notifyUnreadChanged();
      message.success('Đã đánh dấu là đã đọc');
    } catch (error) {
      message.error(extractNotificationError(error));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const target = notifications.find((item) => item.id === id);
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((item) => item.id !== id));
      if (target && !target.isRead) {
        setTotalUnreadCount((prev) => Math.max(0, prev - 1));
      }
      notifyUnreadChanged();
      message.success('Đã xóa thông báo');
    } catch (error) {
      message.error(extractNotificationError(error));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setTotalUnreadCount(0);
      notifyUnreadChanged();
      message.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      message.error(extractNotificationError(error));
    }
  };

  const handleViewDetail = async (item: NotificationItemData) => {
    if (!item.isRead) {
      try {
        await markNotificationAsRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
        );
        setTotalUnreadCount((prev) => Math.max(0, prev - 1));
        notifyUnreadChanged();
      } catch {
        // vẫn mở modal nếu mark read lỗi
      }
    }
    setSelectedItem({ ...item, isRead: true });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="page-header">
          <h1>Thông báo của tôi</h1>
          <p>Cập nhật nhanh chóng mọi thông tin đơn hàng, ưu đãi và tin tức từ LURANA</p>
        </div>

        <div className="notifications-layout-grid">
          <NotificationSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            notifications={notifications}
          />

          <div className="notifications-content-main">
            <NotificationFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterUnread={filterUnread}
              onFilterUnreadChange={setFilterUnread}
              onMarkAllAsRead={handleMarkAllAsRead}
              unreadCount={totalUnreadCount}
            />

            <Spin spinning={loading}>
              <div className="notifications-list-container">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((item) => (
                    <NotificationItem
                      key={item.id}
                      item={item}
                      onViewDetail={handleViewDetail}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="empty-notifications">
                    <div className="empty-icon">
                      <InboxOutlined style={{ fontSize: '64px', color: '#ff9a7a' }} />
                    </div>
                    <h3>Không tìm thấy thông báo nào</h3>
                    <p>
                      {loading
                        ? 'Đang tải thông báo...'
                        : 'Bạn chưa có thông báo nào trong danh mục hoặc bộ lọc này.'}
                    </p>
                  </div>
                )}
              </div>
            </Spin>
          </div>
        </div>
      </div>

      <NotificationDetailModal
        visible={modalVisible}
        item={selectedItem}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default NotificationsPage;
