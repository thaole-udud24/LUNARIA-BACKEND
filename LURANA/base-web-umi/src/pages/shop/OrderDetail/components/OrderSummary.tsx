import React from 'react';

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingFee,
  discountAmount,
  totalAmount,
}) => {
  return (
    <div className="order-summary-card">
      <div className="card-header-title">
        <h3>Tổng quan chi phí</h3>
      </div>

      <div className="summary-breakdown-list">
        <div className="summary-line">
          <span>Tạm tính:</span>
          <strong>{subtotal.toLocaleString('vi-VN')}đ</strong>
        </div>

        <div className="summary-line">
          <span>Phí vận chuyển:</span>
          <strong>{shippingFee > 0 ? `${shippingFee.toLocaleString('vi-VN')}đ` : 'Miễn phí'}</strong>
        </div>

        {discountAmount > 0 && (
          <div className="summary-line discount">
            <span>Giảm giá voucher:</span>
            <strong>-{discountAmount.toLocaleString('vi-VN')}đ</strong>
          </div>
        )}

        <div className="summary-line grand-total">
          <span>Tổng tiền thanh toán:</span>
          <strong className="final-price">{totalAmount.toLocaleString('vi-VN')}đ</strong>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
