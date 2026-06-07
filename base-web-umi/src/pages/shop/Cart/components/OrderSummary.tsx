import React from 'react';
import {
  ArrowRightOutlined,
  LoadingOutlined,
  ShoppingOutlined,
  TagOutlined,
} from '@ant-design/icons';

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  voucher: string;
  appliedVoucher?: string;
  voucherLoading?: boolean;
  setVoucher: (val: string) => void;
  handleApplyVoucher: () => void;
  handleCheckout: () => void;
  itemCount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingFee,
  discount,
  total,
  voucher,
  appliedVoucher,
  voucherLoading = false,
  setVoucher,
  handleApplyVoucher,
  handleCheckout,
  itemCount,
}) => {
  const freeShippingRemaining = Math.max(0, 500000 - subtotal);

  return (
    <aside className="cart-summary-section">
      <h2>Tóm tắt đơn hàng</h2>

      <div className="summary-badge">
        <TagOutlined />
        <span>{itemCount} sản phẩm</span>
      </div>

      <div className="summary-row">
        <span className="label">Tạm tính</span>
        <span className="value">{subtotal.toLocaleString('vi-VN')}đ</span>
      </div>

      <div className="summary-row">
        <span className="label">
          <ShoppingOutlined /> Phí vận chuyển
        </span>
        <span className="value">
          {shippingFee === 0 ? (
            <span className="value--success">Miễn phí</span>
          ) : (
            `${shippingFee.toLocaleString('vi-VN')}đ`
          )}
        </span>
      </div>

      {discount > 0 && (
        <div className="summary-row">
          <span className="label">
            <TagOutlined /> Voucher
            {appliedVoucher && <em>({appliedVoucher})</em>}
          </span>
          <span className="value value--discount">
            -{discount.toLocaleString('vi-VN')}đ
          </span>
        </div>
      )}

      <div className="voucher-box">
        <input
          type="text"
          placeholder="Nhập mã voucher"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyVoucher()}
          disabled={voucherLoading}
        />
        <button type="button" onClick={handleApplyVoucher} disabled={voucherLoading}>
          {voucherLoading ? <LoadingOutlined spin /> : 'Áp dụng'}
        </button>
      </div>

      <div className="shipping-notice">
        <ShoppingOutlined className="icon" />
        <span>
          {freeShippingRemaining > 0
            ? `Mua thêm ${freeShippingRemaining.toLocaleString('vi-VN')}đ để được miễn phí vận chuyển`
            : 'Bạn đã được miễn phí vận chuyển cho đơn này'}
        </span>
      </div>

      <div className="total-row">
        <span className="label">Tổng thanh toán</span>
        <span className="value">{total.toLocaleString('vi-VN')}đ</span>
      </div>

      <button type="button" className="checkout-btn" onClick={handleCheckout}>
        Tiến hành thanh toán <ArrowRightOutlined />
      </button>
    </aside>
  );
};

export default OrderSummary;
