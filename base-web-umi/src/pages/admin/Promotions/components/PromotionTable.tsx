import { Dropdown, Menu, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, MenuOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Promotion } from '@/types/promotion';
import DataTable from '@/components/admin/DataTable';

const STATUS_COLOR: Record<string, string> = { DRAFT: 'default', ACTIVE: 'success', DISABLED: 'warning', EXPIRED: 'error' };
const STATUS_LABEL: Record<string, string> = { DRAFT: 'Nháp', ACTIVE: 'Đang chạy', DISABLED: 'Đã tắt', EXPIRED: 'Hết hạn' };

interface Props {
  loading: boolean;
  dataSource: Promotion[];
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number, limit: number) => void;
  onEdit: (record: Promotion) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onDisable: (id: string) => void;
}

export default function PromotionTable(props: Props) {
  const columns: ColumnsType<Promotion> = [
    { title: 'STT', width: 60, render: (_: any, __: any, index: number) => (props.page - 1) * props.limit + index + 1 },
    { title: 'Tên chương trình', dataIndex: 'name', render: (text) => <strong style={{ color: '#1F2937' }}>{text}</strong> },
    {
      title: 'Loại giảm',
      render: (_, r) => r.discountType === 'PERCENTAGE'
        ? <Tag color="blue">Phần trăm: {r.discountValue}%</Tag>
        : <Tag color="green">Cố định: {r.discountValue.toLocaleString('vi-VN')}đ</Tag>,
    },
    {
      title: 'Phạm vi',
      render: (_, r) => r.applyScope === 'ALL_PRODUCTS'
        ? <Tag>Tất cả SP</Tag>
        : <Tag color="purple">SP cụ thể ({r.applicableProductIds?.length || 0})</Tag>,
    },
    {
      title: 'Thời gian',
      render: (_, r) => (
        <div style={{ fontSize: 12 }}>
          <div>Từ: {dayjs(r.startDate).format('DD/MM/YYYY HH:mm')}</div>
          <div>Đến: {dayjs(r.endDate).format('DD/MM/YYYY HH:mm')}</div>
        </div>
      ),
    },
    { title: 'Trạng thái', align: 'center', render: (_, r) => <Tag color={STATUS_COLOR[r.status]}>{STATUS_LABEL[r.status]}</Tag> },
    {
      title: 'Thao tác', align: 'center', width: 100,
      render: (_, record) => {
        const id = record._id || record.id || '';
        return (
          <Dropdown overlay={
            <Menu>
              <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => props.onEdit(record)}>Chỉnh sửa</Menu.Item>
              {record.status !== 'ACTIVE' && <Menu.Item key="activate" icon={<CheckCircleOutlined />} onClick={() => props.onActivate(id)}>Kích hoạt</Menu.Item>}
              {record.status === 'ACTIVE' && <Menu.Item key="disable" icon={<StopOutlined />} onClick={() => props.onDisable(id)}>Tắt</Menu.Item>}
              <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
                <Popconfirm title="Xóa chương trình này?" okText="Xóa" cancelText="Hủy" onConfirm={() => props.onDelete(id)}>
                  <span>Xóa</span>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          } trigger={['click']} placement="bottomRight">
            <div style={{ padding: 8, cursor: 'pointer', color: '#6B7280' }}><MenuOutlined /></div>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <DataTable<Promotion>
      rowKey={(r) => r._id || r.id || ''}
      loading={props.loading}
      columns={columns}
      dataSource={props.dataSource}
      pagination={{
        current: props.page, pageSize: props.limit, total: props.total, showSizeChanger: true,
        onChange: props.onPageChange,
      }}
    />
  );
}