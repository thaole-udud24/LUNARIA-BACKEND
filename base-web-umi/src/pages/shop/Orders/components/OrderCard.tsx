import React from 'react';
import { OrderData } from '../types';
import { history } from 'umi';
import { EyeOutlined, ReloadOutlined, LoadingOutlined, PictureOutlined } from '@ant-design/icons';

interface OrderCardProps {
  order: OrderData;
  reordering?: boolean;
  onReorder: (order: OrderData) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, reordering, onReorder }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="order-status-badge pending">Chờ xác nhận</span>;
      case 'CONFIRMED':
        return <span className="order-status-badge processing">Đã xác nhận</span>;
      case 'PROCESSING':
        return <span className="order-status-badge shipping">Đang giao hàng</span>;
      case 'COMPLETED':
        return <span className="order-status-badge completed">Đã giao hàng</span>;
      case 'CANCELLED':
        return <span className="order-status-badge cancelled">Đã hủy</span>;
      default:
        return null;
    }
  };

  const goDetail = () => history.push(`/orderdetail?id=${order.id}`);

  return (
    <div className="order-card-container">
      <div className="order-card-header">
        <div className="header-left">
          <span className="order-code">{order.orderCode}</span>
          <span className="order-date">{order.date}</span>
        </div>
        <div className="header-right">{getStatusBadge(order.status)}</div>
      </div>

      <div className="order-card-body" onClick={goDetail}>
        {order.items.map((item) => (
          <div key={item.id} className="order-item-row">
            <div className="item-img item-img--placeholder">
              <PictureOutlined />
            </div>
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
          {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
            <button
              className="btn-action btn-reorder"
              onClick={() => onReorder(order)}
              disabled={reordering}
            >
              {reordering ? <LoadingOutlined spin /> : <ReloadOutlined />} Mua lại
            </button>
          )}

          <button className="btn-action btn-detail" onClick={goDetail}>
            <EyeOutlined /> Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
