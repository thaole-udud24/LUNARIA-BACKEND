import { Avatar, Tag, Button, Tooltip, Table } from 'antd';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';

interface UserTableProps {
  users: any[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  onViewDetail: (id: string) => void;
}

export default function UserTable({ users, loading, page, limit, total, setPage, setLimit, onViewDetail }: UserTableProps) {
  
  // Hàm lấy ngày tạo từ _id của MongoDB (nếu thiếu createdAt)
  const getDateFromId = (id: string) => {
    try { return new Date(parseInt(id.substring(0, 8), 16) * 1000).toLocaleDateString('vi-VN'); } 
    catch { return 'N/A'; }
  };

  const columns = [
    {
      title: 'Khách hàng',
      key: 'name',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />} 
            size={48} 
            style={{ border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexShrink: 0 }} 
          />
          <div>
            {/* Ưu tiên hiện name, nếu không có thì lấy phần trước dấu @ của email */}
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>
              {record.name || record.email?.split('@')[0] || 'Khách hàng'}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Tài khoản',
      key: 'verified',
      render: (_: any, record: any) => (
        <Tag color={record.isEmailVerified ? 'success' : 'default'} style={{ borderRadius: 12, padding: '4px 12px', fontWeight: 600 }}>
          {record.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
        </Tag>
      ),
    },
    {
      title: 'Lịch sử giao dịch',
      key: 'stats',
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 800, color: '#10b981', fontSize: 15 }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalSpent || 0)}
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 2, fontWeight: 500 }}>
            {record.totalOrders || 0} đơn hàng
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày tham gia',
      key: 'createdAt',
      render: (_: any, record: any) => (
        <span style={{ color: '#475569', fontWeight: 600, fontSize: 14 }}>
          {/* Lấy từ createdAt, nếu không có thì trích xuất từ _id */}
          {record.createdAt ? new Date(record.createdAt).toLocaleDateString('vi-VN') : getDateFromId(record._id)}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Tooltip title="Xem chi tiết">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => onViewDetail(record._id)}
            style={{ 
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 10,
              background: '#f0f8ff', border: 'none', color: '#00a2ff',
              boxShadow: 'none', fontSize: 18
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
        total: total,
        onChange: (p: number, l: number) => { setPage(p); setLimit(l); },
        showSizeChanger: true,
      }}
      scroll={{ x: 'max-content' }}
      style={{ background: '#fff', borderRadius: 16 }}
    />
  );
}