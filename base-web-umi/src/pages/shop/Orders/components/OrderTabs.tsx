import React from 'react';
import { OrderStatus, OrderData } from '../types';

interface OrderTabsProps {
  activeTab: OrderStatus;
  onTabChange: (status: OrderStatus) => void;
  orders: OrderData[];
}

const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange, orders }) => {
  const getCount = (status: OrderStatus) => {
    if (status === 'ALL') return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  const tabs: { key: OrderStatus; label: string }[] = [
    { key: 'ALL', label: 'Tất cả đơn' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'PROCESSING', label: 'Đang giao' },
    { key: 'COMPLETED', label: 'Hoàn thành' },
    { key: 'CANCELLED', label: 'Đã hủy' },
  ];

  return (
    <div className="order-tabs-container">
      {tabs.map((tab) => {
        const count = getCount(tab.key);
        return (
          <button
            key={tab.key}
            className={`order-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            <span>{tab.label}</span>
            {count > 0 && <span className="tab-badge">{count}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default OrderTabs;
