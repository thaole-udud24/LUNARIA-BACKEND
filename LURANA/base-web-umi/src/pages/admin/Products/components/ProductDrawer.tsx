import {
  Dropdown,
  Menu,
  Modal,
  Popconfirm,
} from 'antd';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MenuOutlined,
} from '@ant-design/icons';

import type {
  ColumnsType,
} from 'antd/es/table';

import ProductForm from '@/components/admin/ProductForm';

import type { ProductType } from '@/types/catalog';

import StatusTag from '@/components/admin/StatusTag';

interface ProductDrawerProps {
  open: boolean;

  mode?: 'create' | 'edit' | 'detail';

  product?: ProductType | null;

  onClose: () => void;

  onSuccess: (
    newProduct: ProductType,
  ) => void;
}

interface ProductColumnProps {
  onDelete: (
    productId: number,
  ) => void;

  onToggleStatus: (
    checked: boolean,
    productId: number,
  ) => void;

  onView: (
    product: ProductType,
  ) => void;

  onEdit: (
    product: ProductType,
  ) => void;
}

// =========================
// ACTION MENU
// =========================

const renderActionMenu = (
  record: ProductType,

  onView: (
    product: ProductType,
  ) => void,

  onEdit: (
    product: ProductType,
  ) => void,

  onDelete: (
    productId: number,
  ) => void,
) => {
  return (
    <Menu>
      <Menu.Item
        key="detail"
        icon={<EyeOutlined />}
        onClick={() =>
          onView(record)
        }
      >
        Xem chi tiết
      </Menu.Item>

      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() =>
          onEdit(record)
        }
      >
        Chỉnh sửa
      </Menu.Item>

      <Menu.Item
        key="delete"
        danger
      >
        <Popconfirm
          title="Xác nhận xóa sản phẩm?"
          okText="Ok"
          cancelText="Hủy"
          placement="left"
          onConfirm={() =>
            onDelete(record.id)
          }
        >
          <div className="action-item delete-item">
            <DeleteOutlined />

            <span>Xóa</span>
          </div>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
};

// =========================
// TABLE COLUMNS
// =========================

export const getProductColumns = ({
  onDelete,
  onToggleStatus,
  onView,
  onEdit,
}: ProductColumnProps): ColumnsType<ProductType> => {
  return [
    {
      title: 'STT',

      width: 80,

      render: (
        _: any,
        __: any,
        index: number,
      ) => index + 1,
    },

    {
      title: 'Sản phẩm',

      dataIndex: 'name',

      render: (
        text: string,
        record: ProductType,
      ) => (
        <div className="admin-product">
          <img
            src={
              record.images?.[0] ||
              'https://via.placeholder.com/80'
            }
            alt={record.name}
          />

          <span>{text}</span>
        </div>
      ),
    },

    {
      title: 'Giá',

      dataIndex: 'price',

      align: 'center',

      render: (
        value?: number,
      ) =>
        `${Number(
          value || 0,
        ).toLocaleString()} đ`,
    },

    {
      title: 'Tồn kho',

      dataIndex: 'stock',

      align: 'center',

      render: (
        value?: number,
      ) => value || 0,
    },

    {
      title: 'Trạng thái',

      dataIndex: 'active',

      align: 'center',

      render: (
        value: boolean,
        record: ProductType,
      ) => (
        <StatusTag
            status={
                value
                ? 'ACTIVE'
                : 'INACTIVE'
            }
            editable
            onChange={(checked) =>
                onToggleStatus(
                checked,
                record.id,
                )
            }
        />
      ),
    },

    {
      title: 'Thao tác',

      width: 120,
      align: 'center',

      render: (
        _: any,
        record: ProductType,
      ) => (
        <Dropdown
          overlay={renderActionMenu(
            record,
            onView,
            onEdit,
            onDelete,
          )}
          trigger={['click']}
          placement="bottomRight"
        >
          <div className="admin-action">
            <MenuOutlined />
          </div>
        </Dropdown>
      ),
    },
  ];
};

// =========================
// PRODUCT DRAWER
// =========================

export default function ProductDrawer({
  open,
  mode = 'create',
  product,
  onClose,
  onSuccess,
}: ProductDrawerProps) {
  return (
    <Modal
      visible={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnClose
      className="product-modal"
    >
      <ProductForm
        mode={mode}
        initialValues={product}
        onCancel={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}