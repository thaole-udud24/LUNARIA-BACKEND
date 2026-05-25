import React from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  voucher: string;
  setVoucher: (val: string) => void;
  handleApplyVoucher: () => void;
  handleCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingFee,
  discount,
  total,
  voucher,
  setVoucher,
  handleApplyVoucher,
  handleCheckout,
}) => {
  return (
    <div className="cart-summary-section">
      <h2>Tổng quan đơn hàng</h2>

      <div className="summary-row">
        <span className="label">Tạm tính:</span>
        <span className="value">{subtotal.toLocaleString('vi-VN')}đ</span>
      </div>

      <div className="summary-row">
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
        <div className="summary-row">
          <span className="label">Voucher giảm giá:</span>
          <span className="value" style={{ color: '#ff4d4f' }}>
            -{discount.toLocaleString('vi-VN')}đ
          </span>
        </div>
      )}

      <div className="voucher-box">
        <input
          type="text"
          placeholder="Nhập LUNARIA20 giảm 50K"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
        />
        <button onClick={handleApplyVoucher}>Áp dụng</button>
      </div>

      <div className="shipping-notice">
        <span className="icon">🏷️</span>
        <span>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</span>
      </div>

      <div className="total-row">
        <span className="label">Tổng thanh toán:</span>
        <span className="value">{total.toLocaleString('vi-VN')}đ</span>
      </div>

      <button className="checkout-btn" onClick={handleCheckout}>
        Tiến hành thanh toán <ArrowRightOutlined />
      </button>
    </div>
  );
};

export default OrderSummary;
