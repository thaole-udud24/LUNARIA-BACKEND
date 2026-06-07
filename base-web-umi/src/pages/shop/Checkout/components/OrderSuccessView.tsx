import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import { CheckoutFormState, CheckoutOrderResult } from '../types';
import { formatPrice, paymentMethodLabel } from '../utils';
import { resolveMongoId } from '../../Orders/order.utils';

interface OrderSuccessViewProps {
  order: CheckoutOrderResult;
  email?: string;
}

const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ order, email }) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!order.paymentTimeout || order.paymentMethod !== 'bank_transfer') return undefined;

    const tick = () => {
      const diff = new Date(order.paymentTimeout!).getTime() - Date.now();
      if (diff <= 0) {
        setCountdown('00:00');
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [order.paymentTimeout, order.paymentMethod]);

  const copyOrderCode = () => {
    navigator.clipboard?.writeText(order.orderCode);
    message.success('Đã sao chép mã đơn hàng');
  };

  const showQr = order.paymentMethod === 'bank_transfer' && order.qrUrl;
  const orderId = resolveMongoId(order._id);

  return (
    <div className="order-success-view">
      <div className="success-header">
        <CheckCircleOutlined className="success-icon" />
        <h1>Đặt hàng thành công!</h1>
        <p>Cảm ơn bạn đã tin tưởng LURANA. Chúng tôi sẽ xử lý đơn hàng sớm nhất.</p>
      </div>

      {showQr && (
        <div className="success-qr-card">
          <div className="success-qr-card__head">
            <CreditCardOutlined />
            <div>
              <h3>Quét mã VietQR để thanh toán</h3>
              <p>Vui lòng chuyển khoản đúng số tiền trong thời gian quy định</p>
            </div>
          </div>
          <div className="success-qr-card__body">
            <img src={order.qrUrl} alt={`QR thanh toán ${order.orderCode}`} />
            <div className="success-qr-card__meta">
              <p><strong>Số tiền:</strong> {formatPrice(order.totalAmount)}</p>
              <p><strong>Nội dung:</strong> {order.orderCode}</p>
              {countdown && (
                <p className="success-qr-card__timer">
                  <ClockCircleOutlined /> Còn lại: {countdown}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="success-details-card">
        <div className="detail-row">
          <span className="label">Mã đơn hàng</span>
          <span className="value highlight">
            {order.orderCode}
            <button type="button" className="copy-btn" onClick={copyOrderCode} title="Sao chép">
              <CopyOutlined />
            </button>
          </span>
        </div>

        <div className="detail-row">
          <span className="label">Người nhận</span>
          <span className="value">
            {order.shippingAddress.fullName} ({order.shippingAddress.phone})
          </span>
        </div>

        {email && (
          <div className="detail-row">
            <span className="label">Email</span>
            <span className="value">{email}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="label">Địa chỉ giao hàng</span>
          <span className="value">
            {order.shippingAddress.addressLine}, {order.shippingAddress.ward},{' '}
            {order.shippingAddress.district}, {order.shippingAddress.province}
          </span>
        </div>

        <div className="detail-row">
          <span className="label">Phương thức thanh toán</span>
          <span className="value">{paymentMethodLabel(order.paymentMethod)}</span>
        </div>

        {order.appliedVoucher && (
          <div className="detail-row">
            <span className="label">Voucher</span>
            <span className="value">{order.appliedVoucher} (-{formatPrice(order.discountAmount)})</span>
          </div>
        )}

        <div className="detail-row total-row">
          <span className="label">Tổng thanh toán</span>
          <span className="value total-price">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div className="success-actions">
        {orderId ? (
          <Link to={`/orderdetail?id=${orderId}`} className="btn-continue">
            Xem chi tiết đơn hàng
          </Link>
        ) : (
          <Link to="/orders" className="btn-continue">
            Xem đơn hàng của tôi
          </Link>
        )}
        <Link to="/account?tab=ORDERS" className="btn-home">
          Tài khoản → Đơn hàng
        </Link>
        <Link to="/products" className="btn-home btn-home--muted">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessView;
