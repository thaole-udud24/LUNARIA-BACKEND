import React, { useState, useEffect } from 'react';
import { history, useLocation } from 'umi';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { OrderData } from '../Orders/types';
import { initialOrdersData } from '../Orders/index';
import OrderTracking from './components/OrderTracking';
import OrderCustomerInfo from './components/OrderCustomerInfo';
import OrderItemList from './components/OrderItemList';
import OrderSummary from './components/OrderSummary';
import './index.less';

const OrderDetailPage: React.FC = () => {
  const location = useLocation() as any;
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const queryCode = location.query?.code || '#LN-889922';
    try {
      const saved = localStorage.getItem('lunaria_orders');
      let ordersList = initialOrdersData;
      if (saved) {
        ordersList = JSON.parse(saved);
      }
      const found = ordersList.find((o) => o.orderCode === queryCode || o.id === queryCode);
      if (found) {
        setOrder(found);
      } else {
        setOrder(ordersList[0]);
      }
    } catch (e) {
      setOrder(initialOrdersData[0]);
    }
  }, [location.query]);

  if (!order) {
    return (
      <div className="order-detail-page-wrapper">
        <div className="order-detail-page-container">
          <div className="loading-state">Đang tải thông tin đơn hàng...</div>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="order-detail-page-wrapper">
      <div className="order-detail-page-container">
        <div className="detail-page-navigation">
          <button className="btn-back-orders" onClick={() => history.push('/orders')}>
            <ArrowLeftOutlined /> Quay lại danh sách đơn hàng
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
            <span className={`status-pill ${order.status.toLowerCase()}`}>
              {order.status === 'PENDING' && 'Chờ xác nhận'}
              {order.status === 'PROCESSING' && 'Đang xử lý'}
              {order.status === 'SHIPPING' && 'Đang vận chuyển'}
              {order.status === 'COMPLETED' && 'Đã giao hàng'}
              {order.status === 'CANCELLED' && 'Đã hủy'}
            </span>
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
