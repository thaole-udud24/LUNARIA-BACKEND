import React from 'react';
import { Modal, message } from 'antd';
import { NotificationItemData } from '../types';
import { CopyOutlined, ShoppingOutlined, RightOutlined } from '@ant-design/icons';
import { history } from 'umi';

interface NotificationDetailModalProps {
  visible: boolean;
  item: NotificationItemData | null;
  onClose: () => void;
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  visible,
  item,
  onClose,
}) => {
  if (!item) return null;

  const handleCopyVoucher = () => {
    if (item.voucherCode) {
      navigator.clipboard.writeText(item.voucherCode);
      message.success(`Đã sao chép mã voucher: ${item.voucherCode}`);
    }
  };

  const handleActionClick = () => {
    onClose();
    if (item.category === 'ORDER') {
      history.push('/account?tab=ORDERS');
    } else if (item.category === 'PROMOTION') {
      history.push('/products');
    } else {
      history.push('/home');
    }
  };

  return (
    <Modal
      title={<span className="modal-title-custom">Chi tiết thông báo</span>}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={560}
      className="notification-modal"
      centered
    >
      <div className="modal-content-container">
        <div className="modal-header-meta">
          <span className={`cat-tag ${item.category.toLowerCase()}`}>
            {item.category === 'ORDER' ? '📦 Đơn hàng' : item.category === 'PROMOTION' ? '🎁 Khuyến mãi' : '⚙️ Hệ thống'}
          </span>
          <span className="modal-time">{item.date} • {item.time}</span>
        </div>

        <h3 className="modal-notif-title">{item.title}</h3>
        <div className="modal-notif-body">
          <p>{item.message}</p>
        </div>

        {item.orderCode && (
          <div className="modal-order-box">
            <div className="order-box-left">
              <span className="label">Mã đơn hàng:</span>
              <span className="code">{item.orderCode}</span>
            </div>
            <button className="btn-track" onClick={handleActionClick}>
              Theo dõi đơn <RightOutlined />
            </button>
          </div>
        )}

        {item.voucherCode && (
          <div className="modal-voucher-box">
            <div className="voucher-info">
              <span className="v-label">Mã giảm giá độc quyền:</span>
              <span className="v-code">{item.voucherCode}</span>
              {item.discountAmount && <span className="v-discount">{item.discountAmount}</span>}
            </div>
            <button className="btn-copy" onClick={handleCopyVoucher}>
              <CopyOutlined /> Sao chép mã
            </button>
          </div>
        )}

        <div className="modal-footer-actions">
          <button className="btn-cta-main" onClick={handleActionClick}>
            <ShoppingOutlined /> {item.category === 'ORDER' ? 'Xem lịch sử đơn hàng' : item.category === 'PROMOTION' ? 'Dùng ngay tại Shop' : 'Khám phá Lunaria'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationDetailModal;
