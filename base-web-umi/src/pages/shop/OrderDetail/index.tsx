import React, { useEffect, useState } from 'react';
import { history, useLocation } from 'umi';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { Empty, Spin, message } from 'antd';
import { getOrderDetail } from '@/services/DonHang/orders.customer.api';
import { OrderData } from '../Orders/types';
import { mapApiOrderToOrderData, parseOrderDetail } from '../Orders/order.utils';
import OrderTracking from './components/OrderTracking';
import OrderCustomerInfo from './components/OrderCustomerInfo';
import OrderItemList from './components/OrderItemList';
import OrderSummary from './components/OrderSummary';
import { getOrderStatusMeta } from '../Account/account.utils';
import './index.less';

const OrderDetailPage: React.FC = () => {
  const location = useLocation() as any;
  const orderId = location.query?.id;
  const fromAccount = location.query?.from === 'account';
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/auth/login');
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getOrderDetail(String(orderId));
        setOrder(mapApiOrderToOrderData(parseOrderDetail(res)));
      } catch {
        setError('Không tải được chi tiết đơn hàng');
        message.error('Không tải được chi tiết đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location.query?.id]);

  if (loading) {
    return (
      <div className="order-detail-page-wrapper">
        <div className="order-detail-page-container">
          <div className="loading-state">
            <Spin size="large" />
            <p>Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  const backHref = fromAccount ? '/account?tab=ORDERS' : '/orders';
  const backLabel = fromAccount ? 'Quay lại tài khoản' : 'Quay lại danh sách đơn hàng';

  if (error || !order) {
    return (
      <div className="order-detail-page-wrapper">
        <div className="order-detail-page-container">
          <button className="btn-back-orders" onClick={() => history.push(backHref)}>
            <ArrowLeftOutlined /> {backLabel}
          </button>
          <Empty description={error || 'Không tìm thấy đơn hàng'} style={{ padding: '60px 0' }} />
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const statusMeta = getOrderStatusMeta(order.status);

  return (
    <div className="order-detail-page-wrapper">
      <div className="order-detail-page-container">
        <div className="detail-page-navigation">
          <button className="btn-back-orders" onClick={() => history.push(backHref)}>
            <ArrowLeftOutlined /> {backLabel}
          </button>
          <button className="btn-print-order" onClick={() => window.print()}>
            <PrinterOutlined /> In đơn hàng
          </button>
        </div>

        <div className="detail-header-card">
          <div className="header-meta-left">
            <h2>Chi tiết đơn hàng {order.orderCode}</h2>
            <span className="order-date-time">Ngày đặt: {order.date}</span>
          </div>
          <div className="header-status-right">
            <span className={`status-pill ${statusMeta.className}`}>{statusMeta.label}</span>
          </div>
        </div>

        <div className="detail-content-layout">
          <OrderTracking steps={order.trackingSteps} />

          <OrderCustomerInfo
            address={order.shippingAddress}
            paymentMethod={order.paymentMethod}
            paymentStatus={order.paymentStatus}
          />

          <OrderItemList items={order.items} />

          <OrderSummary
            subtotal={subtotal}
            shippingFee={order.shippingFee}
            discountAmount={order.discountAmount}
            totalAmount={order.totalAmount}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
