import React from 'react';
import { ShoppingOutlined, ClockCircleOutlined } from '@ant-design/icons';

export type ShippingMethodType = 'standard' | 'express';

interface ShippingMethodCardProps {
  selected: ShippingMethodType;
  onSelect: (method: ShippingMethodType) => void;
}

const ShippingMethodCard: React.FC<ShippingMethodCardProps> = ({ selected, onSelect }) => (
  <section className="checkout-card shipping-method-card">
    <div className="checkout-card__head">
      <span className="checkout-card__step">02</span>
      <div>
        <h2>Phương thức giao hàng</h2>
        <p className="sub-title">LURANA hỗ trợ giao hàng toàn quốc</p>
      </div>
    </div>

    <div className="methods-list">
      <button
        type="button"
        className={`shipping-method-item ${selected === 'standard' ? 'is-active' : ''}`}
        onClick={() => onSelect('standard')}
      >
        <span className="radio-circle" />
        <ShoppingOutlined className="method-icon" />
        <div className="method-info">
          <h4>Giao hàng tiêu chuẩn</h4>
          <p>Nhận hàng trong 3–5 ngày làm việc</p>
        </div>
        <strong className="method-fee">40.000đ</strong>
      </button>

      <button
        type="button"
        className={`shipping-method-item shipping-method-item--disabled ${selected === 'express' ? 'is-active' : ''}`}
        onClick={() => onSelect('express')}
        disabled
      >
        <span className="radio-circle" />
        <ClockCircleOutlined className="method-icon" />
        <div className="method-info">
          <h4>Giao hàng nhanh</h4>
          <p>Sắp ra mắt — giao trong 24h nội thành</p>
        </div>
        <em className="method-soon">Sắp có</em>
      </button>
    </div>
  </section>
);

export default ShippingMethodCard;
