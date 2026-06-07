import { Dropdown, Menu, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { SkinTypeType } from '@/types/catalog';
import DataTable from '@/components/admin/DataTable';
import StatusTag from '@/components/admin/StatusTag';

interface Props {
  loading: boolean;
  dataSource: SkinTypeType[];
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number, limit: number) => void;
  onEdit: (record: SkinTypeType) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (checked: boolean, id: string | number) => void;
}

export default function SkinTypeTable({
  loading, dataSource, page, limit, total,
  onPageChange, onEdit, onDelete, onToggleStatus,
}: Props) {

  const columns: ColumnsType<SkinTypeType> = [
    {
      title: 'STT',
      width: 70,
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
    },
    {
      title: 'Mã loại da',
      dataIndex: 'code',
      width: 150,
      render: (text) => <strong style={{ color: '#1F2937' }}>{text}</strong>,
    },
    {
      title: 'Tên loại da',
      dataIndex: 'name',
      render: (text) => <span style={{ fontWeight: 500, color: '#4b5563' }}>{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      ellipsis: true,
      render: (text) => <span style={{ color: '#6B7280' }}>{text || '---'}</span>,
    },
    {
      title: 'Trạng thái',
      align: 'center',
      width: 150,
      render: (_, record) => (
        <StatusTag
          status={record.isActive ?? true}
          editable
          onChange={(checked) => onToggleStatus(checked, record._id || record.id || '')}
        />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => onEdit(record)}>
                Chỉnh sửa
              </Menu.Item>
              <Menu.Item key="delete" danger>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa?"
                  okText="Xóa"
                  cancelText="Hủy"
                  onConfirm={() => onDelete(record._id || record.id || '')}
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
      ),
    },
  ];

  return (
    <DataTable<SkinTypeType>
      rowKey={(record) => String(record._id || record.id || '')}
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