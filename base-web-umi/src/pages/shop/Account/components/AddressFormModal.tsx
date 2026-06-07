import React, { useEffect, useState } from 'react';
import { Modal, Switch } from 'antd';
import AddressSelector from '@/pages/shop/Checkout/components/AddressSelector';
import {
  validateFullName,
  validatePhone,
  formatPhoneDisplay,
  parsePhoneInput,
  phoneToApiFormat,
} from '@/pages/shop/Checkout/validators';
import { AccountAddress, slugifyLocationId, phoneToE164 } from '../account.utils';
import type { AddressPayload } from '@/services/TaiKhoan/users.api';
import './AddressFormModal.less';

interface AddressFormModalProps {
  visible: boolean;
  editing?: AccountAddress | null;
  onClose: () => void;
  onSubmit: (payload: AddressPayload, id?: string) => Promise<void>;
}

const emptyForm = {
  label: '',
  fullName: '',
  phone: '',
  addressLine: '',
  province: '',
  district: '',
  ward: '',
  isDefault: false,
};

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  visible,
  editing,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && editing) {
      setForm({
        label: editing.label || '',
        fullName: editing.fullName,
        phone: parsePhoneInput(editing.phone),
        addressLine: editing.addressLine,
        province: editing.province,
        district: editing.district,
        ward: editing.ward,
        isDefault: editing.isDefault,
      });
    } else if (visible) {
      setForm(emptyForm);
    }
    setErrors({});
  }, [visible, editing]);

  const update = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    const nameErr = validateFullName(form.fullName);
    if (nameErr) next.fullName = nameErr;
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) next.phone = phoneErr;
    if (!form.addressLine.trim()) next.addressLine = 'Vui lòng nhập số nhà, tên đường';
    if (!form.province) next.province = 'Vui lòng chọn Tỉnh/Thành phố';
    if (!form.district) next.district = 'Vui lòng chọn Quận/Huyện';
    if (!form.ward) next.ward = 'Vui lòng chọn Phường/Xã';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = (): AddressPayload => ({
    label: form.label || undefined,
    receiver_name: form.fullName.trim(),
    receiver_phone_e164: phoneToE164(phoneToApiFormat(form.phone)),
    country_id: 'VN',
    country_name: 'Việt Nam',
    province_id: slugifyLocationId(form.province),
    province_name: form.province,
    district_id: slugifyLocationId(`${form.province}-${form.district}`),
    district_name: form.district,
    ward_id: slugifyLocationId(`${form.province}-${form.district}-${form.ward}`),
    ward_name: form.ward,
    address_line: form.addressLine.trim(),
    is_default: form.isDefault,
  });

  const handleOk = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(buildPayload(), editing?.id);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={editing ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText={editing ? 'Lưu thay đổi' : 'Thêm địa chỉ'}
      cancelText="Hủy"
      confirmLoading={submitting}
      width={640}
      destroyOnClose
      wrapClassName="account-address-modal-wrap"
      centered
    >
      <div className="modal-form">
        <div className="form-group col-12">
          <label>Nhãn địa chỉ (tuỳ chọn)</label>
          <input
            type="text"
            placeholder="VD: Nhà riêng, Văn phòng"
            value={form.label}
            onChange={(e) => update('label', e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group col-6">
            <label>Họ và tên người nhận</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              className={errors.fullName ? 'input-error' : ''}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>
          <div className="form-group col-6">
            <label>Số điện thoại</label>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={formatPhoneDisplay(form.phone)}
              onChange={(e) => update('phone', parsePhoneInput(e.target.value))}
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-group col-12">
          <label>Số nhà, tên đường</label>
          <input
            type="text"
            value={form.addressLine}
            onChange={(e) => update('addressLine', e.target.value)}
            className={errors.addressLine ? 'input-error' : ''}
          />
          {errors.addressLine && <span className="field-error">{errors.addressLine}</span>}
        </div>

        <AddressSelector
          province={form.province}
          district={form.district}
          ward={form.ward}
          errors={{
            province: errors.province,
            district: errors.district,
            ward: errors.ward,
          }}
          onProvinceChange={(v) => {
            update('province', v);
            update('district', '');
            update('ward', '');
          }}
          onDistrictChange={(v) => {
            update('district', v);
            update('ward', '');
          }}
          onWardChange={(v) => update('ward', v)}
        />

        <div className="form-group col-12 default-switch">
          <label>Đặt làm địa chỉ mặc định</label>
          <Switch checked={form.isDefault} onChange={(v) => update('isDefault', v)} />
        </div>
      </div>
    </Modal>
  );
};

export default AddressFormModal;
