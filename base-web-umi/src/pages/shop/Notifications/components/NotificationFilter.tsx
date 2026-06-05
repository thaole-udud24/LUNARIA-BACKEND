import React from 'react';
import { SearchOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface NotificationFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterUnread: boolean;
  onFilterUnreadChange: (unreadOnly: boolean) => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({
  searchQuery,
  onSearchChange,
  filterUnread,
  onFilterUnreadChange,
  onMarkAllAsRead,
  unreadCount,
}) => {
  return (
    <div className="notification-filter-bar">
      <div className="filter-left">
        <div className="search-input-wrapper">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-btn ${!filterUnread ? 'active' : ''}`}
            onClick={() => onFilterUnreadChange(false)}
          >
            Tất cả
          </button>
          <button
            className={`filter-btn ${filterUnread ? 'active' : ''}`}
            onClick={() => onFilterUnreadChange(true)}
          >
            Chưa đọc {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </div>

      <div className="filter-right">
        <button
          className="btn-mark-read"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCircleOutlined /> Đánh dấu tất cả đã đọc
        </button>
      </div>
    </div>
  );
};

export default NotificationFilter;
