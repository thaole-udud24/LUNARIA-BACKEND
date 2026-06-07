import React from 'react';
import { NotificationItemData } from '../types';
import {
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  ShoppingOutlined,
  GiftOutlined,
  SettingOutlined,
} from '@ant-design/icons';

interface NotificationItemProps {
  item: NotificationItemData;
  onViewDetail: (item: NotificationItemData) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  onViewDetail,
  onMarkAsRead,
  onDelete,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ORDER':
        return <ShoppingOutlined />;
      case 'PROMOTION':
        return <GiftOutlined />;
      case 'SYSTEM':
      default:
        return <SettingOutlined />;
    }
  };

  return (
    <div className={`notification-item-card ${!item.isRead ? 'unread' : ''}`}>
      <div className="card-left" onClick={() => onViewDetail(item)}>
        <div className="icon-container">
          <span className="cat-icon">{getCategoryIcon(item.category)}</span>
          {!item.isRead && <span className="unread-dot"></span>}
        </div>

        <div className="content-container">
          <div className="top-meta">
            <span className={`cat-tag ${item.category.toLowerCase()}`}>{item.category === 'ORDER' ? 'Đơn hàng' : item.category === 'PROMOTION' ? 'Khuyến mãi' : 'Hệ thống'}</span>
            <span className="time-text">{item.date} • {item.time}</span>
          </div>

          <h4 className="notif-title">{item.title}</h4>
          <p className="notif-message">{item.message}</p>

          {item.orderCode && (
            <div className="extra-meta">
              <span>Mã đơn hàng: <strong>{item.orderCode}</strong></span>
            </div>
          )}

          {item.voucherCode && (
            <div className="extra-meta voucher-meta">
              <span>Mã voucher: <strong className="voucher-code">{item.voucherCode}</strong></span>
              {item.discountAmount && <span className="discount-badge">{item.discountAmount}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="card-actions">
        <button
          className="action-btn btn-view"
          onClick={() => onViewDetail(item)}
          title="Xem chi tiết"
        >
          <EyeOutlined />
          <span>Chi tiết</span>
        </button>

        {!item.isRead && (
          <button
            className="action-btn btn-read"
            onClick={() => onMarkAsRead(item.id)}
            title="Đánh dấu đã đọc"
          >
            <CheckOutlined />
            <span>Đã đọc</span>
          </button>
        )}

        <button
          className="action-btn btn-delete"
          onClick={() => onDelete(item.id)}
          title="Xóa thông báo"
        >
          <DeleteOutlined />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;