import { Avatar, Tag, Button, Tooltip, Table, Space } from 'antd';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import { resolveMediaUrl } from '@/utils/adminApi';
import { adminTableStyles as t } from '@/utils/adminTableStyles';
import type { AdminUserListItem } from '@/services/TaiKhoan/users.api';

interface UserTableProps {
  users: AdminUserListItem[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  onViewDetail: (id: string) => void;
}

export default function UserTable({ users, loading, page, limit, total, setPage, setLimit, onViewDetail }: UserTableProps) {
  const getDateFromId = (id: string) => {
    try { return new Date(parseInt(id.substring(0, 8), 16) * 1000).toLocaleDateString('vi-VN'); }
    catch { return 'N/A'; }
  };

  const columns = [
    {
      title: 'Khách hàng',
      key: 'name',
      render: (_: unknown, record: AdminUserListItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            src={resolveMediaUrl(record.avatar)}
            icon={<UserOutlined />}
            size={48}
            style={{ border: '2px solid var(--admin-surface)', boxShadow: 'var(--admin-shadow-sm)', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--admin-text-strong)', fontSize: 15 }}>
              {record.name || record.email?.split('@')[0] || 'Khách hàng'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 2 }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Tài khoản',
      key: 'account',
      render: (_: unknown, record: AdminUserListItem) => (
        <Space direction="vertical" size={4}>
          <Tag color={record.isEmailVerified ? 'success' : 'default'} style={{ borderRadius: 12, padding: '4px 12px', fontWeight: 600, margin: 0 }}>
            {record.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
          </Tag>
          <Tag color={record.status === 'blocked' ? 'error' : 'processing'} style={{ borderRadius: 12, padding: '4px 12px', fontWeight: 600, margin: 0 }}>
            {record.status === 'blocked' ? 'Đã khóa' : 'Hoạt động'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Lịch sử giao dịch',
      key: 'stats',
      render: (_: unknown, record: AdminUserListItem) => (
        <div>
          <div style={t.success}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalSpent || 0)}
          </div>
          <div style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 2, fontWeight: 500 }}>
            {record.totalOrders || 0} đơn hàng
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày tham gia',
      key: 'createdAt',
      render: (_: unknown, record: AdminUserListItem) => (
        <span style={{ color: 'var(--admin-text-muted)', fontWeight: 600, fontSize: 14 }}>
          {record.createdAt ? new Date(record.createdAt).toLocaleDateString('vi-VN') : getDateFromId(record._id)}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (_: unknown, record: AdminUserListItem) => (
        <Tooltip title="Xem chi tiết">
          <Button
            icon={<EyeOutlined />}
            onClick={() => onViewDetail(record._id)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--admin-primary-soft)', border: '1px solid var(--admin-border)', color: 'var(--admin-primary)',
              boxShadow: 'none', fontSize: 18,
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="_id"
      loading={loading}
      pagination={{
        current: page,
        pageSize: limit,
        total,
        onChange: (p: number, l: number) => { setPage(p); setLimit(l); },
        showSizeChanger: true,
      }}
      scroll={{ x: 'max-content' }}
      style={{ background: 'var(--admin-surface)', borderRadius: 16 }}
    />
  );
}
