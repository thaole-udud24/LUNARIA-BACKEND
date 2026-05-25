import React from 'react';
import { SearchOutlined } from '@ant-design/icons';

interface OrderSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const OrderSearch: React.FC<OrderSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="order-search-bar">
      <div className="search-input-wrapper">
        <SearchOutlined className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default OrderSearch;
