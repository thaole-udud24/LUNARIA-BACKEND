import React from 'react';
import { DeleteOutlined, StarFilled, PlusOutlined } from '@ant-design/icons';
import { UserAddress } from '../types';

interface AddressTabProps {
  addresses: UserAddress[];
  onSetDefault: (id: number) => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
}

const AddressTab: React.FC<AddressTabProps> = ({
  addresses,
  onSetDefault,
  onDelete,
  onAddNew,
}) => {
  return (
    <div className="account-card address-tab-card">
      <div className="card-header address-header">
        <div>
          <h2>Sổ địa chỉ nhận hàng</h2>
          <p>Quản lý các địa chỉ giao hàng để thanh toán nhanh chóng hơn</p>
        </div>
        <button className="btn-add-address" onClick={onAddNew}>
          <PlusOutlined /> Thêm địa chỉ mới
        </button>
      </div>

      <div className="address-list">
        {addresses.map((item) => (
          <div className={`address-item ${item.isDefault ? 'default-address' : ''}`} key={item.id}>
            <div className="address-info">
              <div className="address-name-phone">
                <h4>{item.fullName}</h4>
                <span className="phone">{item.phone}</span>
                {item.isDefault && <span className="default-badge"><StarFilled /> Địa chỉ mặc định</span>}
              </div>
              <p className="address-detail">{item.addressDetail}</p>
            </div>

            <div className="address-actions">
              {!item.isDefault && (
                <button className="btn-set-default" onClick={() => onSetDefault(item.id)}>
                  Thiết lập mặc định
                </button>
              )}
              <button className="btn-delete" onClick={() => onDelete(item.id)} title="Xóa địa chỉ">
                <DeleteOutlined />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressTab;
