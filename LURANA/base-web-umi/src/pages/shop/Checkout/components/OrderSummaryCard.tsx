import React from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { OrderItem } from '../types';

const getImg = (name: string) => {
  try {
    return require(`@/assets/images/${name}`);
  } catch (err) {
    return '';
  }
};

interface OrderSummaryCardProps {
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  onSubmit: () => void;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items,
  subtotal,
  shippingFee,
  discount,
  total,
  onSubmit,
}) => {
  return (
    <div className="checkout-card order-summary-card">
      <h2>Đơn hàng của bạn</h2>

      <div className="summary-items-list">
        {items.map((item) => (
          <div className="summary-item" key={item.id}>
            <div className="item-img">
              <img src={getImg(item.img)} alt={item.name} />
              <span className="item-qty">{item.qty}</span>
            </div>
            <div className="item-info">
              <h4>{item.name}</h4>
              <p>{item.variant}</p>
            </div>
            <div className="item-price">
              {(item.price * item.qty).toLocaleString('vi-VN')}đ
            </div>
          </div>
        ))}
      </div>

      <div className="summary-calculations">
        <div className="calc-row">
          <span className="label">Tạm tính:</span>
          <span className="value">{subtotal.toLocaleString('vi-VN')}đ</span>
        </div>

        <div className="calc-row">
          <span className="label">Phí vận chuyển:</span>
          <span className="value">
            {shippingFee === 0 ? (
              <span style={{ color: '#38a169' }}>Miễn phí</span>
            ) : (
              `${shippingFee.toLocaleString('vi-VN')}đ`
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="calc-row">
            <span className="label">Voucher giảm giá:</span>
            <span className="value" style={{ color: '#ff4d4f' }}>
              -{discount.toLocaleString('vi-VN')}đ
            </span>
          </div>
        )}

        <div className="calc-row total-row">
          <span className="label">Tổng thanh toán:</span>
          <span className="value">{total.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>

      <button className="place-order-btn" onClick={onSubmit}>
        Đặt hàng ngay <ArrowRightOutlined />
      </button>
    </div>
  );
};

export default OrderSummaryCard;
