import { Dropdown, Menu, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ProductType } from '@/services/SanPham/types';
import { resolveMediaUrl } from '@/utils/adminApi';
import DataTable from '@/components/admin/DataTable';
import StatusTag from '@/components/admin/StatusTag';

const PLACEHOLDER_IMG =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect fill="#f1f5f9" width="44" height="44" rx="8"/><text x="50%" y="54%" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="sans-serif">N/A</text></svg>',
  );

const getProductId = (p: ProductType) => String(p._id || p.id || '');

const formatSellPrice = (variants?: ProductType['variants']) => {
  if (!variants?.length) return '0 đ';
  const prices = variants.map((v) => v.priceSell || 0);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return `${min.toLocaleString('vi-VN')} đ`;
  return `${min.toLocaleString('vi-VN')} – ${max.toLocaleString('vi-VN')} đ`;
};

interface ProductTableProps {
  loading: boolean;
  dataSource: ProductType[];
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number, limit: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (checked: boolean, id: string) => void;
}

export default function ProductTable({
  loading,
  dataSource,
  page,
  limit,
  total,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProductTableProps) {
  const columns: ColumnsType<ProductType> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 200 }}>
          <img
            src={resolveMediaUrl(record.mainImage)}
            alt={text}
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              objectFit: 'cover',
              border: '1px solid #F3E5DF',
              flexShrink: 0,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <strong
              style={{
                color: '#1F2937',
                fontSize: 14,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </strong>
            <span style={{ color: '#6B7280', fontSize: 12 }}>SKU: {record.sku}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      width: 140,
      render: (_, record) => (
        <span style={{ color: '#4b5563', fontWeight: 500 }}>
          {record.category?.name || 'Chưa phân loại'}
        </span>
      ),
    },
    {
      title: 'Giá bán',
      align: 'right',
      width: 160,
      render: (_, record) => (
        <strong style={{ color: '#FFA78A', fontSize: 14, whiteSpace: 'nowrap' }}>
          {formatSellPrice(record.variants)}
        </strong>
      ),
    },
    {
      title: 'Tồn kho',
      align: 'center',
      width: 90,
      render: (_, record) => {
        const stock =
          record.variants?.reduce((sum, v) => sum + (v.stockQty || 0), 0) || 0;
        return (
          <span style={{ fontWeight: 600, color: stock > 0 ? '#10b981' : '#ef4444' }}>
            {stock}
          </span>
        );
      },
    },
    {
      title: 'Trạng thái',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <StatusTag
          status={record.isActive ?? true}
          editable
          onChange={(checked) => onToggleStatus(checked, getProductId(record))}
        />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (_, record) => {
        const id = getProductId(record);
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => onEdit(id)}>
                  Chỉnh sửa
                </Menu.Item>
                <Menu.Item key="delete" danger>
                  <Popconfirm
                    title="Đưa sản phẩm vào thùng rác?"
                    okText="Xóa"
                    cancelText="Hủy"
                    onConfirm={() => onDelete(id)}
                  >
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <DeleteOutlined /> Xóa
                    </div>
                  </Popconfirm>
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
            placement="bottomRight"
          >
            <div style={{ padding: 8, cursor: 'pointer', color: '#6B7280' }}>
              <MenuOutlined />
            </div>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <DataTable<ProductType>
      rowKey={(record) => getProductId(record) || record.sku}
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={{
        current: page,
        pageSize: limit,
        total,
        showSizeChanger: true,
        onChange: onPageChange,
      }}
    />
  );
}
