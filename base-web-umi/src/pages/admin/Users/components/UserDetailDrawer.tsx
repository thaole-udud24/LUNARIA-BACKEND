import { useState, useEffect } from 'react';
import { Drawer, Tabs, Avatar, Tag, Descriptions, Table, Button, Space, Divider, Typography, Spin } from 'antd';
import { 
  UserOutlined, PhoneOutlined, HomeOutlined, StopOutlined, MailOutlined, StarFilled, SafetyCertificateFilled
} from '@ant-design/icons';
import { getAdminUserDetail } from '@/services/TaiKhoan/users'; // Đảm bảo import đúng

const { Title, Text } = Typography;

export default function UserDetailDrawer({ visible, onClose, userId }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(650);

  useEffect(() => {
    const updateWidth = () => {
      setDrawerWidth(window.innerWidth <= 768 ? window.innerWidth : 650);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (visible && userId) {
      fetchUserDetail();
    } else {
      setData(null);
    }
  }, [visible, userId]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const res = await getAdminUserDetail(userId);
      if (res && res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết khách hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const orderColumns = [
    { title: 'Mã đơn', dataIndex: 'orderCode', key: 'orderCode', render: (text: string) => <Text strong style={{ color: '#0f172a' }}>{text}</Text> },
    { title: 'Ngày đặt', dataIndex: 'createdAt', key: 'createdAt', render: (text: string) => <Text style={{ color: '#64748b' }}>{new Date(text).toLocaleDateString('vi-VN')}</Text> },
    { title: 'Trị giá', dataIndex: 'totalAmount', key: 'totalAmount', render: (val: number) => <Text strong style={{ color: '#10b981' }}>{formatCurrency(val)}</Text> },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (status: string) => {
        let color = 'default', label = status;
        if (status === 'COMPLETED') { color = 'success'; label = 'Hoàn thành'; }
        if (status === 'PROCESSING') { color = 'processing'; label = 'Đang xử lý'; }
        if (status === 'CANCELLED') { color = 'error'; label = 'Đã hủy'; }
        return <Tag color={color} style={{ borderRadius: 12 }}>{label}</Tag>;
      },
    },
  ];

  return (
    <Drawer
      title={<span style={{ fontWeight: 800, fontSize: 20, color: '#0f172a' }}>Hồ sơ Khách hàng 360°</span>}
      placement="right" width={drawerWidth} onClose={onClose} visible={visible} bodyStyle={{ padding: 0, background: '#f8fafc' }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button danger icon={<StopOutlined />} style={{ borderRadius: 8, fontWeight: 600, height: 42 }} disabled title="Tính năng khóa tài khoản chưa có API">
            Khóa tài khoản
          </Button>
          <Space>
            <Button onClick={onClose} style={{ borderRadius: 8, height: 42, fontWeight: 600 }}>Đóng</Button>
            <Button
              type="primary"
              icon={<MailOutlined />}
              style={{ borderRadius: 8, background: 'linear-gradient(135deg, #a7c7e7, #b0e0e6)', color: '#0f172a', border: 'none', height: 42, fontWeight: 600 }}
              href={data?.account?.email ? `mailto:${data.account.email}` : undefined}
              disabled={!data?.account?.email}
            >
              Gửi Email
            </Button>
          </Space>
        </div>
      }
    >
      {loading || !data ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <>
          <div style={{ padding: '32px 24px', background: 'linear-gradient(135deg, #ffffff 0%, #fffbfc 100%)', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 24, alignItems: 'center' }}>
            <Avatar src={data.profile.avatar} size={100} icon={<UserOutlined />} style={{ border: '4px solid #fff', boxShadow: '0 10px 20px rgba(167, 199, 231, 0.3)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>{data.profile.fullName}</Title>
                {data.metrics.totalSpent > 5000000 && <Tag color="gold" icon={<StarFilled />} style={{ borderRadius: 12, border: 'none', background: '#fef08a', color: '#854d0e', fontWeight: 600 }}>VIP</Tag>}
              </div>
              <Text style={{ fontSize: 15, color: '#64748b', fontWeight: 500 }}><MailOutlined style={{ marginRight: 6 }}/>{data.account.email}</Text>
              
              <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Tổng chi tiêu</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>{formatCurrency(data.metrics.totalSpent)}</div>
                </div>
                <Divider type="vertical" style={{ height: 40 }} />
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Số đơn hàng</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{data.metrics.totalOrders} <span style={{ fontSize: 14, fontWeight: 500, color: '#64748b' }}>đơn</span></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 24px' }}>
            <Tabs defaultActiveKey="1" tabBarStyle={{ fontWeight: 600, color: '#64748b' }}>
              <Tabs.TabPane tab="Tổng quan" key="1">
                <div style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginTop: 8 }}>
                  <Descriptions column={1} labelStyle={{ color: '#94a3b8', width: 140, fontWeight: 600 }} contentStyle={{ fontWeight: 600, color: '#0f172a' }}>
                    <Descriptions.Item label="ID Hệ thống"><Text copyable>{data.account.id}</Text></Descriptions.Item>
                    <Descriptions.Item label="Ngày tham gia">{new Date(data.account.createdAt || Date.now()).toLocaleString('vi-VN')}</Descriptions.Item>
                    <Descriptions.Item label="Giới tính">{data.profile.gender === 'female' ? 'Nữ' : data.profile.gender === 'male' ? 'Nam' : 'Chưa cập nhật'}</Descriptions.Item>
                    <Descriptions.Item label="Bảo mật">
                      {data.account.isEmailVerified ? <Text type="success"><SafetyCertificateFilled /> Đã xác minh Email</Text> : <Text type="warning">Chưa xác minh</Text>}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="Sổ địa chỉ & SĐT" key="2">
                <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 8 }}>
                  {data.contacts.addresses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 20, color: '#94a3b8' }}>Khách hàng chưa thêm địa chỉ nào</div>
                  ) : (
                    data.contacts.addresses.map((addr: any) => (
                      <div key={addr._id} style={{ background: '#fff', padding: 20, borderRadius: 16, border: addr.is_default ? '2px solid #ffb6b9' : '1px solid #f1f5f9', position: 'relative' }}>
                        {addr.is_default && <Tag color="magenta" style={{ position: 'absolute', top: 20, right: 16, borderRadius: 10, border: 'none', fontWeight: 600 }}>Mặc định</Tag>}
                        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8, color: '#0f172a' }}><HomeOutlined style={{ marginRight: 8, color: '#ff8c69' }}/>{addr.full_name || addr.fullName}</div>
                        <div style={{ color: '#475569', marginBottom: 4, fontWeight: 500 }}><PhoneOutlined style={{ marginRight: 8 }}/>{addr.phone}</div>
                        <div style={{ color: '#64748b', fontWeight: 500 }}>{`${addr.addressLine}, ${addr.ward}, ${addr.district}, ${addr.province}`}</div>
                      </div>
                    ))
                  )}
                </Space>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Lịch sử mua hàng" key="3">
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text strong style={{ color: '#475569', fontSize: 15 }}>Đơn hàng gần đây</Text>
                  </div>
                  <Table 
                    columns={orderColumns} dataSource={data.recentOrders} rowKey="_id" pagination={false} size="middle"
                    locale={{ emptyText: 'Chưa có đơn hàng nào' }}
                    style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
                  />
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </>
      )}
    </Drawer>
  );
}