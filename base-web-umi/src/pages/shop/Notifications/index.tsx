import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import NotificationSidebar from './components/NotificationSidebar';
import NotificationFilter from './components/NotificationFilter';
import NotificationItem from './components/NotificationItem';
import NotificationDetailModal from './components/NotificationDetailModal';
import { NotificationCategory, NotificationItemData } from './types';
import './index.less';

const initialNotifications: NotificationItemData[] = [
  {
    id: 'notif-1',
    category: 'ORDER',
    title: 'Đơn hàng #LN-889922 đang được giao tới bạn!',
    message: 'Đơn hàng gồm "CC+ Cream Illumination with SPF 50+" và các sản phẩm khác đã được bàn giao cho đơn vị vận chuyển. Vui lòng chú ý điện thoại từ shipper nhé.',
    date: '19/05/2026',
    time: '08:30',
    isRead: false,
    orderCode: '#LN-889922',
  },
  {
    id: 'notif-2',
    category: 'PROMOTION',
    title: '🎁 Quà tặng độc quyền: Voucher giảm 100K cho đơn từ 500K',
    message: 'Lunaria gửi tặng bạn mã ưu đãi đặc biệt tháng 5. Nhập mã ngay tại bước thanh toán để tận hưởng ưu đãi tuyệt vời này nhé!',
    date: '18/05/2026',
    time: '15:20',
    isRead: false,
    voucherCode: 'LUNARIA100K',
    discountAmount: 'Giảm 100K',
  },
  {
    id: 'notif-3',
    category: 'SYSTEM',
    title: '🚀 Nâng cấp hệ thống & Ra mắt dòng sản phẩm làm sạch da mới',
    message: 'Lunaria vừa hoàn tất nâng cấp giao diện trải nghiệm người dùng và ra mắt bộ sưu tập Tẩy trang & Sữa rửa mặt thiên nhiên hoàn toàn mới. Khám phá ngay hôm nay!',
    date: '16/05/2026',
    time: '10:00',
    isRead: true,
  },
  {
    id: 'notif-4',
    category: 'ORDER',
    title: 'Giao hàng thành công đơn #LN-776655',
    message: 'Đơn hàng #LN-776655 (Sữa Rửa Mặt Sâm 1700...) đã được giao thành công. Cảm ơn bạn đã đồng hành cùng Lunaria. Hãy để lại đánh giá sản phẩm nhé!',
    date: '12/05/2026',
    time: '14:15',
    isRead: true,
    orderCode: '#LN-776655',
  },
  {
    id: 'notif-5',
    category: 'PROMOTION',
    title: '✨ Freeship toàn quốc cho mọi đơn hàng dịp cuối tuần',
    message: 'Ưu đãi miễn phí vận chuyển 100% không giới hạn giá trị đơn hàng áp dụng duy nhất trong thứ 7 và Chủ nhật tuần này. Nhanh tay săn ngay sản phẩm yêu thích!',
    date: '08/05/2026',
    time: '09:00',
    isRead: true,
    voucherCode: 'FREESHIPWEEKEND',
    discountAmount: 'Miễn phí vận chuyển',
  },
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItemData[]>(() => {
    try {
      const saved = localStorage.getItem('lunaria_notifications');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // fallback
    }
    return initialNotifications;
  });

  const [activeTab, setActiveTab] = useState<NotificationCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);

  const [selectedItem, setSelectedItem] = useState<NotificationItemData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lunaria_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  const handleTabChange = (tab: NotificationCategory) => {
    setActiveTab(tab);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    message.success('Đã đánh dấu là đã đọc');
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    message.success('Đã xóa thông báo');
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    message.success('Đã đánh dấu tất cả là đã đọc');
  };

  const handleViewDetail = (item: NotificationItemData) => {
    // Mark as read when viewing detail
    if (!item.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
    }
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  // Lọc dữ liệu
  const filteredNotifications = notifications.filter((item) => {
    // Lọc theo danh mục
    if (activeTab !== 'ALL' && item.category !== activeTab) {
      return false;
    }
    // Lọc theo trạng thái chưa đọc
    if (filterUnread && item.isRead) {
      return false;
    }
    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchMsg = item.message.toLowerCase().includes(q);
      const matchOrder = item.orderCode?.toLowerCase().includes(q) || false;
      const matchVoucher = item.voucherCode?.toLowerCase().includes(q) || false;
      return matchTitle || matchMsg || matchOrder || matchVoucher;
    }
    return true;
  });

  const totalUnreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="page-header">
          <h1>Thông báo của tôi</h1>
          <p>Cập nhật nhanh chóng mọi thông tin đơn hàng, ưu đãi và tin tức từ Lunaria</p>
        </div>

        <div className="notifications-layout-grid">
          <NotificationSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
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
                  <div className="empty-icon">📭</div>
                  <h3>Không tìm thấy thông báo nào</h3>
                  <p>Bạn chưa có thông báo nào trong danh mục hoặc bộ lọc này.</p>
                </div>
              )}
            </div>
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
