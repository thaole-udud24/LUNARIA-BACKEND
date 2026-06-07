import React from 'react';
import {
  ShoppingOutlined,
  CreditCardOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { PaymentMethod } from '../types';

interface PaymentMethodsProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  previewQrUrl?: string;
  previewAmount?: number;
  previewOrderCode?: string;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selected,
  onSelect,
  previewQrUrl,
  previewAmount,
  previewOrderCode,
}) => {
  return (
    <section className="checkout-card payment-methods-card">
      <div className="checkout-card__head">
        <span className="checkout-card__step">03</span>
        <div>
          <h2>Phương thức thanh toán</h2>
          <p className="sub-title">Chọn cách thanh toán phù hợp với bạn</p>
        </div>
      </div>

      <div className="methods-list">
        <button
          type="button"
          className={`payment-method-item ${selected === 'cod' ? 'is-active' : ''}`}
          onClick={() => onSelect('cod')}
        >
          <span className="radio-circle" />
          <ShoppingOutlined className="method-icon" />
          <div className="method-info">
            <h4>Thanh toán khi nhận hàng (COD)</h4>
            <p>Thanh toán bằng tiền mặt khi nhận hàng từ shipper</p>
          </div>
        </button>

        <button
          type="button"
          className={`payment-method-item ${selected === 'bank_transfer' ? 'is-active' : ''}`}
          onClick={() => onSelect('bank_transfer')}
        >
          <span className="radio-circle" />
          <CreditCardOutlined className="method-icon" />
          <div className="method-info">
            <h4>Chuyển khoản / VietQR</h4>
            <p>Quét mã QR sau khi đặt hàng — hệ thống giữ đơn 15 phút</p>
          </div>
        </button>
      </div>

      {selected === 'bank_transfer' && (
        <div className="payment-hint">
          <InfoCircleOutlined />
          <span>
            Sau khi đặt hàng, mã QR VietQR sẽ hiển thị với số tiền chính xác.
            Vui lòng chuyển khoản trong vòng 15 phút để giữ đơn hàng.
          </span>
        </div>
      )}

      {selected === 'bank_transfer' && previewQrUrl && (
        <div className="payment-qr-preview">
          <img src={previewQrUrl} alt="Mã QR thanh toán" />
          <div>
            <strong>{previewOrderCode}</strong>
            <p>{previewAmount?.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentMethods;
