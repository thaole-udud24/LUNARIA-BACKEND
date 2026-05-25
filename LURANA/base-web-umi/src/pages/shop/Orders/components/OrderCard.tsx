import React from 'react';
import { OrderData } from '../types';
import { history } from 'umi';
import { EyeOutlined, ReloadOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface OrderCardProps {
  order: OrderData;
  onCancelOrder: (id: string) => void;
  onReorder: (order: OrderData) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancelOrder, onReorder }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="order-status-badge pending">Chờ xác nhận</span>;
      case 'PROCESSING':
        return <span className="order-status-badge processing">Đang xử lý</span>;
      case 'SHIPPING':
        return <span className="order-status-badge shipping">Đang vận chuyển</span>;
      case 'COMPLETED':
        return <span className="order-status-badge completed">Đã giao hàng</span>;
      case 'CANCELLED':
        return <span className="order-status-badge cancelled">Đã hủy</span>;
      default:
        return null;
    }
  };

  const getImg = (name: string) => {
    try {
      return require(`@/assets/images/${name}`);
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="order-card-container">
      <div className="order-card-header">
        <div className="header-left">
          <span className="order-code">{order.orderCode}</span>
          <span className="order-date">{order.date}</span>
        </div>
        <div className="header-right">
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="order-card-body" onClick={() => history.push(`/orderdetail?code=${encodeURIComponent(order.orderCode)}`)}>
        {order.items.map((item) => (
          <div key={item.id} className="order-item-row">
            <img src={getImg(item.image)} alt={item.name} className="item-img" />
            <div className="item-info">
              <h4 className="item-name">{item.name}</h4>
              {item.variant && <span className="item-variant">Phân loại: {item.variant}</span>}
              <span className="item-qty">x{item.quantity}</span>
            </div>
            <div className="item-price">
              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
            </div>
          </div>
        ))}
      </div>

      <div className="order-card-footer">
        <div className="footer-total">
          <span>Thành tiền:</span>
          <strong className="total-amount">{order.totalAmount.toLocaleString('vi-VN')}đ</strong>
        </div>

        <div className="footer-actions">
          {order.status === 'PENDING' && (
            <button className="btn-action btn-cancel" onClick={() => onCancelOrder(order.id)}>
              <CloseCircleOutlined /> Hủy đơn
            </button>
          )}

          <button className="btn-action btn-reorder" onClick={() => onReorder(order)}>
            <ReloadOutlined /> Mua lại
          </button>

          <button
            className="btn-action btn-detail"
            onClick={() => history.push(`/orderdetail?code=${encodeURIComponent(order.orderCode)}`)}
          >
            <EyeOutlined /> Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
