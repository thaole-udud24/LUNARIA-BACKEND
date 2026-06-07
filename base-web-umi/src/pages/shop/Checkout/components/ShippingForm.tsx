import React from 'react';
import { Input } from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { CheckoutFormState, SavedAddressOption } from '../types';
import AddressSelector from './AddressSelector';
import { formatPhoneDisplay } from '../validators';

interface ShippingFormProps {
  form: CheckoutFormState;
  errors: Partial<Record<keyof CheckoutFormState, string>>;
  savedAddresses: SavedAddressOption[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onChange: (field: keyof CheckoutFormState, value: string) => void;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onWardChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  form,
  errors,
  savedAddresses,
  selectedAddressId,
  onSelectAddress,
  onChange,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  onPhoneChange,
}) => {
  return (
    <section className="checkout-card shipping-form-card">
      <div className="checkout-card__head">
        <span className="checkout-card__step">01</span>
        <div>
          <h2>Thông tin giao hàng</h2>
          <p className="sub-title">Thông tin chính xác giúp giao hàng nhanh và đúng địa chỉ</p>
        </div>
      </div>

      {savedAddresses.length > 0 && (
        <div className="saved-address-list">
          <h3>Chọn địa chỉ đã lưu</h3>
          <div className="saved-address-grid">
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                className={`saved-address-item ${selectedAddressId === addr.id ? 'is-active' : ''}`}
                onClick={() => onSelectAddress(addr.id)}
              >
                <strong>{addr.fullName}</strong>
                <span>{formatPhoneDisplay(addr.phone)}</span>
                <p>{addr.addressLine}, {addr.ward}, {addr.district}, {addr.province}</p>
                {addr.isDefault && <em>Mặc định</em>}
              </button>
            ))}
            <button
              type="button"
              className={`saved-address-item saved-address-item--new ${selectedAddressId === 'new' ? 'is-active' : ''}`}
              onClick={() => onSelectAddress('new')}
            >
              <EditOutlined />
              <span>Địa chỉ mới</span>
            </button>
          </div>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group col-12">
          <label><UserOutlined /> Họ và tên người nhận <span>*</span></label>
          <Input
            size="large"
            placeholder="VD: Nguyễn Văn An"
            value={form.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            className={`checkout-input ${errors.fullName ? 'checkout-input--error' : ''}`}
          />
          {errors.fullName ? (
            <span className="field-error">{errors.fullName}</span>
          ) : (
            <span className="field-hint">Nhập đầy đủ họ tên như trên CMND/CCCD</span>
          )}
        </div>

        <div className="form-group col-6">
          <label><PhoneOutlined /> Số điện thoại <span>*</span></label>
          <Input
            size="large"
            prefix={<span className="phone-prefix">+84</span>}
            placeholder="912 345 678"
            value={form.phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            maxLength={13}
            inputMode="numeric"
            className={`checkout-input checkout-input--phone ${errors.phone ? 'checkout-input--error' : ''}`}
          />
          {errors.phone ? (
            <span className="field-error">{errors.phone}</span>
          ) : (
            <span className="field-hint">10–11 số, bắt đầu bằng 0</span>
          )}
        </div>

        <div className="form-group col-6">
          <label><MailOutlined /> Email (tuỳ chọn)</label>
          <Input
            size="large"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            className={`checkout-input ${errors.email ? 'checkout-input--error' : ''}`}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group col-12">
          <label><HomeOutlined /> Số nhà, tên đường <span>*</span></label>
          <Input
            size="large"
            placeholder="VD: 256 Cầu Giấy, Khu đô thị..."
            value={form.addressLine}
            onChange={(e) => onChange('addressLine', e.target.value)}
            className={`checkout-input ${errors.addressLine ? 'checkout-input--error' : ''}`}
          />
          {errors.addressLine && <span className="field-error">{errors.addressLine}</span>}
        </div>

        <div className="form-group col-12">
          <AddressSelector
            province={form.province}
            district={form.district}
            ward={form.ward}
            errors={{
              province: errors.province,
              district: errors.district,
              ward: errors.ward,
            }}
            onProvinceChange={onProvinceChange}
            onDistrictChange={onDistrictChange}
            onWardChange={onWardChange}
          />
        </div>

        <div className="form-group col-12">
          <label>Ghi chú cho shipper</label>
          <Input.TextArea
            rows={3}
            placeholder="VD: Giao giờ hành chính, gọi trước 15 phút..."
            value={form.note}
            onChange={(e) => onChange('note', e.target.value)}
            className="checkout-textarea"
          />
        </div>
      </div>
    </section>
  );
};

export default ShippingForm;
