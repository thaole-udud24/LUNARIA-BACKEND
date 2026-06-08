import { Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { history } from 'umi';
import moment from 'moment';
import type { AdminOrder } from '@/services/DonHang/types';

import DataTable from '@/components/admin/DataTable';
import { adminTableStyles as t } from '@/utils/adminTableStyles';

interface OrderTableProps {
  orders: AdminOrder[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  onConfirmPayment: (id: string) => void;
  onCancelOrder: (id: string) => void;
}

export default function OrderTable({
  orders, loading, page, limit, total, setPage, setLimit,
  onConfirmPayment, onCancelOrder,
}: OrderTableProps) {

  const tagBaseStyle: React.CSSProperties = {
    padding: '4px 14px', borderRadius: '100px', fontWeight: 600, fontSize: '13px', display: 'inline-block',
  };

  const actionBtnStyle = (color: string, disabled: boolean = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '32px', height: '32px', borderRadius: '6px',
    background: disabled ? 'var(--admin-surface-soft)' : 'var(--admin-surface-elevated)',
    color: disabled ? 'var(--admin-text-subtle)' : color,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s', border: '1px solid var(--admin-border)',
  });

  const columns: ColumnsType<AdminOrder> = [
    {
      title: 'Mã Đơn', dataIndex: 'orderCode', key: 'orderCode',
      render: (text: string) => <strong style={t.primaryCode}>{text}</strong>,
    },
    {
      title: 'Khách hàng', key: 'customer',
      render: (_, record) => {
        const name = record.shippingAddress?.customerName || 'Khách chưa cập nhật tên';
        const phone = record.shippingAddress?.phone || 'Chưa có SĐT';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={t.title}>{name}</div>
            <div style={t.phone}>{phone}</div>
          </div>
        );
      },
    },
    {
      title: 'Ngày đặt', dataIndex: 'createdAt', key: 'createdAt',
      render: (date: string) => <span style={t.date}>{moment(date).format('HH:mm - DD/MM/YYYY')}</span>,
    },
    {
      title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount',
      render: (amount: number) => <strong style={t.amount}>{amount?.toLocaleString('vi-VN')} đ</strong>,
    },
    {
      title: 'Thanh toán', dataIndex: 'paymentStatus', key: 'paymentStatus',
      render: (status: string) => status === 'PAID'
        ? <span style={{ ...tagBaseStyle, background: '#e0fef0', color: '#10b981' }}>Đã thanh toán</span>
        : <span style={{ ...tagBaseStyle, background: '#fffbeb', color: '#f59e0b' }}>Chưa thanh toán</span>,
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { bg: string; color: string; text: string }> = {
          PENDING: { bg: '#e0f2fe', color: '#0ea5e9', text: 'Chờ xác nhận' },
          CONFIRMED: { bg: '#dbeafe', color: '#2563eb', text: 'Đã xác nhận' },
          PROCESSING: { bg: '#fef08a', color: '#ca8a04', text: 'Đang xử lý' },
          COMPLETED: { bg: '#dcfce7', color: '#22c55e', text: 'Hoàn thành' },
          CANCELLED: { bg: '#ffe4e6', color: '#e11d48', text: 'Đã hủy' },
        };
        const st = statusMap[status] || { bg: '#f1f5f9', color: '#64748b', text: status };
        return <span style={{ ...tagBaseStyle, background: st.bg, color: st.color }}>{st.text}</span>;
      },
    },
    {
      title: 'Thao tác', key: 'actions',
      render: (_, record) => {
        const isOrderFinalized = ['COMPLETED', 'CANCELLED'].includes(record.status);

        return (
          <Space size="small">
            {/* NÚT XEM CHI TIẾT */}
            <Tooltip title="Xem chi tiết">
              <div
                style={actionBtnStyle('#0ea5e9')}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e0f2fe'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#eef2f6'; e.currentTarget.style.transform = 'scale(1)'; }}
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(`/admin/orders/${record._id}`); // ✅ ĐÃ FIX
                }}
              >
                <EyeOutlined style={{ fontSize: '16px' }} />
              </div>
            </Tooltip>

            {/* NÚT XÁC NHẬN */}
            {record.status === 'PENDING' && record.paymentStatus === 'UNPAID' && (
              <Tooltip title="Xác nhận đã chuyển khoản">
                <div
                  style={actionBtnStyle('#10b981')}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#d1fae5'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#eef2f6'; e.currentTarget.style.transform = 'scale(1)'; }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onConfirmPayment(record._id as string);
                  }}
                >
                  <CheckOutlined style={{ fontSize: '16px' }} />
                </div>
              </Tooltip>
            )}

            {/* NÚT HỦY ĐƠN */}
            <Tooltip title={isOrderFinalized ? 'Đơn hàng đã hoàn tất/hủy' : 'Hủy đơn'}>
              <div
                style={actionBtnStyle('#e11d48', isOrderFinalized)}
                onMouseEnter={(e) => {
                  if (!isOrderFinalized) {
                    e.currentTarget.style.background = '#ffe4e6';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOrderFinalized) {
                    e.currentTarget.style.background = '#eef2f6';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOrderFinalized) {
                    onCancelOrder(record._id as string);
                  }
                }}
              >
                <DeleteOutlined style={{ fontSize: '16px' }} />
              </div>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <DataTable<AdminOrder>
      columns={columns} dataSource={orders} rowKey="_id" loading={loading}
      pagination={{
        current: page, pageSize: limit, total: total, showSizeChanger: true,
        onChange: (p, l) => { setPage(p); setLimit(l || 10); },
      }}
      onRow={(record) => ({
        onClick: () => history.push(`/admin/orders/${record._id}`), // ✅ ĐÃ FIX
        style: { cursor: 'pointer' },
      })}
    />
  );
}