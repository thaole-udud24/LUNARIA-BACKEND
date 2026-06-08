import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { Drawer, Tabs, Avatar, Tag, Descriptions, Table, Button, Space, Divider, Typography, Spin, Modal, message } from 'antd';
import {
  UserOutlined, PhoneOutlined, HomeOutlined, StopOutlined, MailOutlined,
  StarFilled, SafetyCertificateFilled, UnlockOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { getAdminUserDetail, updateAdminUserStatus } from '@/services/TaiKhoan/users.api';
import { resolveMediaUrl, unwrapApiData } from '@/utils/adminApi';
import { adminTableStyles as tbl } from '@/utils/adminTableStyles';

const { Title, Text } = Typography;
const VIP_THRESHOLD = 5_000_000;

const ORDER_STATUS: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'default', label: 'Chờ xác nhận' },
  CONFIRMED: { color: 'blue', label: 'Đã xác nhận' },
  PROCESSING: { color: 'processing', label: 'Đang xử lý' },
  COMPLETED: { color: 'success', label: 'Hoàn thành' },
  CANCELLED: { color: 'error', label: 'Đã hủy' },
};

const formatAddress = (addr: Record<string, unknown>) => {
  const name = (addr.receiver_name || addr.full_name || addr.fullName || '—') as string;
  const phone = (addr.receiver_phone_e164 || addr.phone_e164 || addr.phone || '—') as string;
  const parts = [
    addr.address_line || addr.addressLine,
    addr.ward_name || addr.ward,
    addr.district_name || addr.district,
    addr.province_name || addr.province,
  ].filter(Boolean);
  return { name, phone, fullAddress: parts.length ? parts.join(', ') : '—' };
};

const isDefaultFlag = (item: Record<string, unknown>) => item.is_default ?? item.isDefault;

interface UserDetailDrawerProps {
  visible: boolean;
  onClose: () => void;
  userId: string | null;
  onUserUpdated?: () => void;
}

export default function UserDetailDrawer({ visible, onClose, userId, onUserUpdated }: UserDetailDrawerProps) {
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

  const fetchUserDetail = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await getAdminUserDetail(userId);
      const payload = unwrapApiData<any>(res);
      if (payload) setData(payload);
    } catch {
      message.error('Không thể tải thông tin khách hàng');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (visible && userId) {
      fetchUserDetail();
    } else {
      setData(null);
    }
  }, [visible, userId, fetchUserDetail]);

  const isBlocked = data?.account?.status === 'blocked';

  const handleToggleBlock = () => {
    if (!userId) return;
    const nextStatus = isBlocked ? 'active' : 'blocked';
    Modal.confirm({
      title: isBlocked ? 'Mở khóa tài khoản?' : 'Khóa tài khoản khách hàng?',
      content: isBlocked
        ? 'Khách hàng sẽ có thể đăng nhập lại bình thường.'
        : 'Khách hàng sẽ không thể đăng nhập cho đến khi được mở khóa.',
      okText: isBlocked ? 'Mở khóa' : 'Khóa',
      okType: isBlocked ? 'primary' : 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await updateAdminUserStatus(userId, nextStatus);
          message.success(isBlocked ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
          await fetchUserDetail();
          onUserUpdated?.();
        } catch (err: any) {
          message.error(err?.data?.message || err?.message || 'Không thể cập nhật trạng thái');
          throw err;
        }
      },
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const orderColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderCode',
      key: 'orderCode',
      render: (text: string, record: { _id: string }) => (
        <Button type="link" style={{ padding: 0, fontWeight: 700 }} onClick={() => history.push(`/admin/orders/${record._id}`)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => <Text style={tbl.date}>{new Date(text).toLocaleDateString('vi-VN')}</Text>,
    },
    {
      title: 'Trị giá',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val: number) => <Text strong style={tbl.success}>{formatCurrency(val)}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const meta = ORDER_STATUS[status] || { color: 'default', label: status };
        return <Tag color={meta.color} style={{ borderRadius: 12 }}>{meta.label}</Tag>;
      },
    },
  ];

  const phones: Record<string, unknown>[] = data?.contacts?.phones || [];
  const addresses: Record<string, unknown>[] = data?.contacts?.addresses || [];

  const panelStyle: CSSProperties = {
    background: 'var(--admin-surface)',
    padding: 24,
    borderRadius: 16,
    boxShadow: 'var(--admin-shadow-sm)',
    border: '1px solid var(--admin-border)',
  };

  const cardStyle: CSSProperties = {
    background: 'var(--admin-surface)',
    padding: 20,
    borderRadius: 16,
    border: '1px solid var(--admin-border)',
    position: 'relative',
  };

  return (
    <Drawer
      title={<span style={{ fontWeight: 800, fontSize: 20, color: 'var(--admin-text-strong)' }}>Hồ sơ Khách hàng 360°</span>}
      placement="right"
      width={drawerWidth}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ padding: 0, background: 'var(--admin-bg-subtle)' }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            danger={!isBlocked}
            icon={isBlocked ? <UnlockOutlined /> : <StopOutlined />}
            style={{ borderRadius: 8, fontWeight: 600, height: 42 }}
            onClick={handleToggleBlock}
          >
            {isBlocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
          </Button>
          <Space>
            <Button onClick={onClose} style={{ borderRadius: 8, height: 42, fontWeight: 600 }}>Đóng</Button>
            <Button
              type="primary"
              icon={<MailOutlined />}
              style={{ borderRadius: 8, background: 'var(--admin-primary-soft)', color: 'var(--admin-text-strong)', border: '1px solid var(--admin-border)', height: 42, fontWeight: 600 }}
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
          <div style={{ padding: '32px 24px', background: 'var(--admin-gradient-topbar)', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: 24, alignItems: 'center' }}>
            <Avatar src={resolveMediaUrl(data.profile.avatar)} size={100} icon={<UserOutlined />} style={{ border: '4px solid var(--admin-surface)', boxShadow: 'var(--admin-shadow-md)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <Title level={3} style={{ margin: 0, fontWeight: 800, color: 'var(--admin-text-strong)' }}>{data.profile.fullName || data.account.email}</Title>
                {data.metrics.totalSpent > VIP_THRESHOLD && (
                  <Tag color="gold" icon={<StarFilled />} style={{ borderRadius: 12, border: 'none', background: '#fef08a', color: '#854d0e', fontWeight: 600 }}>VIP</Tag>
                )}
                <Tag color={isBlocked ? 'error' : 'success'} style={{ borderRadius: 12, fontWeight: 600 }}>
                  {isBlocked ? 'Đã khóa' : 'Hoạt động'}
                </Tag>
              </div>
              <Text style={{ fontSize: 15, color: 'var(--admin-text-muted)', fontWeight: 500 }}><MailOutlined style={{ marginRight: 6 }} />{data.account.email}</Text>

              <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Tổng chi tiêu</div>
                  <div style={tbl.success}>{formatCurrency(data.metrics.totalSpent)}</div>
                </div>
                <Divider type="vertical" style={{ height: 40 }} />
                <div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Số đơn hàng</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--admin-text-strong)' }}>{data.metrics.totalOrders} <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--admin-text-muted)' }}>đơn</span></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 24px' }}>
            <Tabs defaultActiveKey="1" tabBarStyle={{ fontWeight: 600, color: 'var(--admin-text-muted)' }}>
              <Tabs.TabPane tab="Tổng quan" key="1">
                <div style={{ ...panelStyle, marginTop: 8 }}>
                  <Descriptions column={1} labelStyle={{ color: 'var(--admin-text-subtle)', width: 140, fontWeight: 600 }} contentStyle={{ fontWeight: 600, color: 'var(--admin-text-strong)' }}>
                    <Descriptions.Item label="ID Hệ thống"><Text copyable>{String(data.account.id)}</Text></Descriptions.Item>
                    <Descriptions.Item label="Ngày tham gia">{new Date(data.account.createdAt || Date.now()).toLocaleString('vi-VN')}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      <Tag color={isBlocked ? 'error' : 'success'}>{isBlocked ? 'Đã khóa' : 'Hoạt động'}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Giới tính">{data.profile.gender === 'female' ? 'Nữ' : data.profile.gender === 'male' ? 'Nam' : 'Chưa cập nhật'}</Descriptions.Item>
                    <Descriptions.Item label="Bảo mật">
                      {data.account.isEmailVerified
                        ? <Text type="success"><SafetyCertificateFilled /> Đã xác minh Email</Text>
                        : <Text type="warning">Chưa xác minh</Text>}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Sổ địa chỉ & SĐT" key="2">
                <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 8 }}>
                  <Text strong style={{ ...tbl.title, fontSize: 15 }}>Số điện thoại</Text>
                  {phones.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 16, color: 'var(--admin-text-subtle)', background: 'var(--admin-surface)', borderRadius: 12, border: '1px solid var(--admin-border)' }}>Chưa có số điện thoại</div>
                  ) : (
                    phones.map((phone) => (
                      <div
                        key={String(phone._id)}
                        style={{
                          ...cardStyle,
                          border: isDefaultFlag(phone) ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)',
                        }}
                      >
                        {isDefaultFlag(phone) && (
                          <Tag color="magenta" style={{ position: 'absolute', top: 20, right: 16, borderRadius: 10, border: 'none', fontWeight: 600 }}>Mặc định</Tag>
                        )}
                        <div style={{ ...tbl.title, fontSize: 16 }}>
                          <PhoneOutlined style={{ marginRight: 8, color: 'var(--admin-primary)' }} />
                          {String(phone.full_phone_e164 || phone.national_number || '—')}
                        </div>
                        {phone.phone_type && (
                          <div style={{ ...tbl.muted, marginTop: 6, fontSize: 13 }}>
                            Loại: {String(phone.phone_type)}
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  <Text strong style={{ ...tbl.title, fontSize: 15, marginTop: 8 }}>Địa chỉ giao hàng</Text>
                  {addresses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 20, color: 'var(--admin-text-subtle)' }}>Khách hàng chưa thêm địa chỉ nào</div>
                  ) : (
                    addresses.map((addr) => {
                      const formatted = formatAddress(addr);
                      return (
                        <div
                          key={String(addr._id)}
                          style={{
                            ...cardStyle,
                            border: isDefaultFlag(addr) ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)',
                          }}
                        >
                          {isDefaultFlag(addr) && (
                            <Tag color="magenta" style={{ position: 'absolute', top: 20, right: 16, borderRadius: 10, border: 'none', fontWeight: 600 }}>Mặc định</Tag>
                          )}
                          <div style={{ ...tbl.title, fontSize: 16, marginBottom: 8 }}>
                            <HomeOutlined style={{ marginRight: 8, color: 'var(--admin-primary)' }} />{formatted.name}
                          </div>
                          <div style={{ ...tbl.name, marginBottom: 4 }}>
                            <PhoneOutlined style={{ marginRight: 8 }} />{formatted.phone}
                          </div>
                          <div style={tbl.muted}>{formatted.fullAddress}</div>
                        </div>
                      );
                    })
                  )}
                </Space>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Lịch sử mua hàng" key="3">
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text strong style={{ ...tbl.title, fontSize: 15 }}>Đơn hàng gần đây</Text>
                  </div>
                  <Table
                    columns={orderColumns}
                    dataSource={data.recentOrders}
                    rowKey="_id"
                    pagination={false}
                    size="middle"
                    locale={{ emptyText: 'Chưa có đơn hàng nào' }}
                    style={{ background: 'var(--admin-surface)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--admin-shadow-sm)', border: '1px solid var(--admin-border)' }}
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
