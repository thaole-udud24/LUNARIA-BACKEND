import React, { useState } from 'react';
import { DeleteOutlined, StarFilled, PlusOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import AccountEmpty from './AccountEmpty';
import { Modal } from 'antd';
import { AccountAddress } from '../account.utils';
import AddressFormModal from './AddressFormModal';
import type { AddressPayload } from '@/services/TaiKhoan/users.api';

interface AddressTabProps {
  addresses: AccountAddress[];
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onSave: (payload: AddressPayload, id?: string) => Promise<void>;
}

const AddressTab: React.FC<AddressTabProps> = ({
  addresses,
  onSetDefault,
  onDelete,
  onSave,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AccountAddress | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item: AccountAddress) => {
    setEditing(item);
    setModalOpen(true);
  };

  const confirmDelete = (item: AccountAddress) => {
    Modal.confirm({
      title: 'Xóa địa chỉ này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => onDelete(item.id),
    });
  };

  return (
    <>
      <div className="account-card address-tab-card">
        <div className="card-header address-header">
          <div>
            <h2>Địa chỉ giao hàng</h2>
            <p>Quản lý các địa chỉ giao hàng để thanh toán nhanh chóng hơn</p>
          </div>
          <button type="button" className="btn-add-address" onClick={openCreate}>
            <PlusOutlined /> Thêm địa chỉ mới
          </button>
        </div>

        {addresses.length === 0 ? (
          <AccountEmpty
            icon={<EnvironmentOutlined />}
            title="Chưa có địa chỉ giao hàng"
            description="Thêm địa chỉ để thanh toán nhanh hơn mỗi lần mua sắm."
            actionLabel="Thêm địa chỉ đầu tiên"
            onAction={openCreate}
            compact
          />
        ) : (
          <div className="address-list">
            {addresses.map((item) => (
              <div
                className={`address-item ${item.isDefault ? 'default-address' : ''}`}
                key={item.id}
              >
                <div className="address-info">
                  <div className="address-name-phone">
                    <h4>
                      {item.fullName}
                      {item.label && <em className="address-label">{item.label}</em>}
                    </h4>
                    <span className="phone">{item.phone}</span>
                    {item.isDefault && (
                      <span className="default-badge">
                        <StarFilled /> Địa chỉ mặc định
                      </span>
                    )}
                  </div>
                  <p className="address-detail">
                    {item.addressLine}, {item.ward}, {item.district}, {item.province}
                  </p>
                </div>

                <div className="address-actions">
                  {!item.isDefault && (
                    <button
                      type="button"
                      className="btn-set-default"
                      onClick={() => onSetDefault(item.id)}
                    >
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => openEdit(item)}
                    title="Sửa địa chỉ"
                  >
                    <EditOutlined />
                  </button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => confirmDelete(item)}
                    title="Xóa địa chỉ"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddressFormModal
        visible={modalOpen}
        editing={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={onSave}
      />
    </>
  );
};

export default AddressTab;
