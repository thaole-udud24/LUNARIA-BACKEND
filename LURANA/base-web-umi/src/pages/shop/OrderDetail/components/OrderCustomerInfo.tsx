import React from 'react';
import { EnvironmentOutlined, CreditCardOutlined } from '@ant-design/icons';

interface OrderCustomerInfoProps {
  address: { fullName: string; phone: string; address: string };
  paymentMethod: string;
  paymentStatus: string;
}

const OrderCustomerInfo: React.FC<OrderCustomerInfoProps> = ({ address, paymentMethod, paymentStatus }) => {
  return (
    <div className="order-customer-info-grid">
      <div className="info-card address-card">
        <div className="card-heading">
          <EnvironmentOutlined className="heading-icon" />
          <h3>Địa chỉ nhận hàng</h3>
        </div>
        <div className="card-body-content">
          <h4 className="customer-name">{address.fullName}</h4>
          <p className="customer-phone">Số điện thoại: <strong>{address.phone}</strong></p>
          <p className="customer-addr">{address.address}</p>
        </div>
      </div>

      <div className="info-card payment-card">
        <div className="card-heading">
          <CreditCardOutlined className="heading-icon" />
          <h3>Hình thức thanh toán</h3>
        </div>
        <div className="card-body-content">
          <p className="pay-method">{paymentMethod}</p>
          <div className="pay-status-wrapper">
            <span>Trạng thái:</span>
            <span className={`pay-status-badge ${paymentStatus === 'PAID' ? 'paid' : 'unpaid'}`}>
              {paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCustomerInfo;
