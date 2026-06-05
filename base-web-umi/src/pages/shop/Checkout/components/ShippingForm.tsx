import React from 'react';
import { ShippingInfo } from '../types';

interface ShippingFormProps {
  info: ShippingInfo;
  onChange: (field: keyof ShippingInfo, val: string) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ info, onChange }) => {
  return (
    <div className="checkout-card shipping-form-card">
      <h2>1. Thông tin giao hàng</h2>
      <p className="sub-title">Vui lòng điền đầy đủ thông tin để Lunaria giao hàng nhanh nhất</p>

      <div className="form-grid">
        <div className="form-group col-12">
          <label>Họ và tên <span>*</span></label>
          <input
            type="text"
            placeholder="Nhập họ và tên người nhận"
            value={info.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
          />
        </div>

        <div className="form-group col-6">
          <label>Số điện thoại <span>*</span></label>
          <input
            type="tel"
            placeholder="Nhập số điện thoại liên hệ"
            value={info.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>

        <div className="form-group col-6">
          <label>Email liên hệ</label>
          <input
            type="email"
            placeholder="Nhập email để nhận hóa đơn"
            value={info.email}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>

        <div className="form-group col-12">
          <label>Địa chỉ nhận hàng cụ thể <span>*</span></label>
          <input
            type="text"
            placeholder="Số nhà, ngõ/hẻm, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
            value={info.address}
            onChange={(e) => onChange('address', e.target.value)}
          />
        </div>

        <div className="form-group col-12">
          <label>Ghi chú đơn hàng (Tùy chọn)</label>
          <textarea
            rows={3}
            placeholder="Ghi chú về thời gian giao hàng, chỉ dẫn địa điểm..."
            value={info.note}
            onChange={(e) => onChange('note', e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
