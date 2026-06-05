import React from 'react';
import { Link } from 'umi';
import { CheckCircleOutlined } from '@ant-design/icons';
import { ShippingInfo } from '../types';

interface OrderSuccessViewProps {
  orderId: string;
  total: number;
  paymentMethod: string;
  shippingInfo: ShippingInfo;
}

const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  orderId,
  total,
  paymentMethod,
  shippingInfo,
}) => {
  return (
    <div className="order-success-view">
      <div className="success-header">
        <CheckCircleOutlined className="success-icon" />
        <h1>Đặt hàng thành công!</h1>
        <p>Cảm ơn bạn đã tin tưởng và lựa chọn mỹ phẩm Lunaria</p>
      </div>

      <div className="success-details-card">
        <div className="detail-row">
          <span className="label">Mã đơn hàng:</span>
          <span className="value highlight">{orderId}</span>
        </div>

        <div className="detail-row">
          <span className="label">Người nhận:</span>
          <span className="value">{shippingInfo.fullName} ({shippingInfo.phone})</span>
        </div>

        <div className="detail-row">
          <span className="label">Địa chỉ giao hàng:</span>
          <span className="value">{shippingInfo.address}</span>
        </div>

        <div className="detail-row">
          <span className="label">Phương thức thanh toán:</span>
          <span className="value">
            {paymentMethod === 'COD' && 'Thanh toán khi nhận hàng (COD)'}
            {paymentMethod === 'BANK' && 'Chuyển khoản ngân hàng'}
            {paymentMethod === 'MOMO' && 'Ví điện tử MoMo / ZaloPay'}
          </span>
        </div>

        <div className="detail-row total-row">
          <span className="label">Tổng thanh toán:</span>
          <span className="value total-price">{total.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>

      <div className="success-actions">
        <Link to="/products" className="btn-continue">
          Tiếp tục mua sắm
        </Link>
        <Link to="/home" className="btn-home">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessView;
