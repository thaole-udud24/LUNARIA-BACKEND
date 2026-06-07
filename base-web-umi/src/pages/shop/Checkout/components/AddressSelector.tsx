import React, { useMemo } from 'react';
import { Select } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import {
  ensureOption,
  getDistrictsByProvince,
  getProvinceNames,
  getWardsByDistrict,
} from '../data/vn-locations';

interface AddressSelectorProps {
  province: string;
  district: string;
  ward: string;
  errors?: {
    province?: string;
    district?: string;
    ward?: string;
  };
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onWardChange: (value: string) => void;
}

const baseSelectProps = {
  showSearch: true,
  optionFilterProp: 'children' as const,
  size: 'large' as const,
};

const AddressSelector: React.FC<AddressSelectorProps> = ({
  province,
  district,
  ward,
  errors,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
}) => {
  const provinceOptions = useMemo(() => ensureOption(getProvinceNames(), province), [province]);
  const districtOptions = useMemo(
    () => ensureOption(province ? getDistrictsByProvince(province) : [], district),
    [province, district],
  );
  const wardOptions = useMemo(
    () => ensureOption(province && district ? getWardsByDistrict(province, district) : [], ward),
    [province, district, ward],
  );

  return (
    <div className="address-selector">
      <div className="address-selector__label">
        <EnvironmentOutlined />
        <span>Khu vực nhận hàng</span>
        <em>*</em>
      </div>

      <div className="address-selector__grid">
        <div className="form-group">
          <label>Tỉnh / Thành phố</label>
          <Select
            {...baseSelectProps}
            placeholder="Chọn Tỉnh/Thành phố"
            value={province || undefined}
            onChange={onProvinceChange}
            className={`checkout-select ${errors?.province ? 'checkout-select--error' : ''}`}
          >
            {provinceOptions.map((name) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
          {errors?.province && <span className="field-error">{errors.province}</span>}
        </div>

        <div className="form-group">
          <label>Quận / Huyện</label>
          <Select
            {...baseSelectProps}
            placeholder={province ? 'Chọn Quận/Huyện' : 'Chọn tỉnh trước'}
            value={district || undefined}
            onChange={onDistrictChange}
            disabled={!province}
            className={`checkout-select ${errors?.district ? 'checkout-select--error' : ''}`}
          >
            {districtOptions.map((name) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
          {errors?.district && <span className="field-error">{errors.district}</span>}
        </div>

        <div className="form-group">
          <label>Phường / Xã</label>
          <Select
            {...baseSelectProps}
            placeholder={district ? 'Chọn Phường/Xã' : 'Chọn quận trước'}
            value={ward || undefined}
            onChange={onWardChange}
            disabled={!district}
            className={`checkout-select ${errors?.ward ? 'checkout-select--error' : ''}`}
          >
            {wardOptions.map((name) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
          {errors?.ward && <span className="field-error">{errors.ward}</span>}
        </div>
      </div>
    </div>
  );
};

export default AddressSelector;
