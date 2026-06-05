import React from 'react';
import { PaymentMethodType } from '../types';

interface PaymentMethodsProps {
  selected: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ selected, onSelect }) => {
  return (
    <div className="checkout-card payment-methods-card">
      <h2>2. Phương thức thanh toán</h2>
      <p className="sub-title">Chọn phương thức thanh toán phù hợp với bạn</p>

      <div className="methods-list">
        {/* COD */}
        <div
          className={`payment-method-item ${selected === 'COD' ? 'active' : ''}`}
          onClick={() => onSelect('COD')}
        >
          <div className="method-header">
            <span className="radio-circle"></span>
            <span className="method-icon">🚚</span>
            <div className="method-info">
              <h4>Thanh toán khi nhận hàng (COD)</h4>
              <p>Thanh toán bằng tiền mặt khi shipper giao hàng đến</p>
            </div>
          </div>
        </div>

        {/* BANK */}
        <div
          className={`payment-method-item ${selected === 'BANK' ? 'active' : ''}`}
          onClick={() => onSelect('BANK')}
        >
          <div className="method-header">
            <span className="radio-circle"></span>
            <span className="method-icon">💳</span>
            <div className="method-info">
              <h4>Chuyển khoản ngân hàng (Mã QR)</h4>
              <p>Chuyển khoản nhanh qua quét mã QR ứng dụng ngân hàng</p>
            </div>
          </div>

          {selected === 'BANK' && (
            <div className="method-details bank-details">
              <div className="bank-info-box">
                <p><strong>Ngân hàng:</strong> Techcombank (TCB)</p>
                <p><strong>Số tài khoản:</strong> 19036688990011</p>
                <p><strong>Chủ tài khoản:</strong> LUNARIA COSMETICS</p>
                <p><strong>Nội dung CK:</strong> LN8899 + Số điện thoại</p>
              </div>
              <div className="qr-box">
                <div className="mock-qr">MÃ QR MẪU</div>
                <span>Quét mã bằng ứng dụng ngân hàng</span>
              </div>
            </div>
          )}
        </div>

        {/* MOMO */}
        <div
          className={`payment-method-item ${selected === 'MOMO' ? 'active' : ''}`}
          onClick={() => onSelect('MOMO')}
        >
          <div className="method-header">
            <span className="radio-circle"></span>
            <span className="method-icon">📱</span>
            <div className="method-info">
              <h4>Ví điện tử MoMo / ZaloPay</h4>
              <p>Thanh toán tiện lợi qua cổng ví điện tử</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
