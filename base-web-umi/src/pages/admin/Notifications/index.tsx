import { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import { Badge, Button, Empty, List, Spin, Tabs, Tag } from 'antd';
import { BellOutlined, ShoppingOutlined } from '@ant-design/icons';
import { getAdminOrders } from '@/services/DonHang/orders.api';
import type { AdminOrder } from '@/services/DonHang/types';
import styles from './styles.less';

const STATUS_META: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: 'Chờ xác nhận' },
  CONFIRMED: { color: 'blue', label: 'Đã xác nhận' },
  PROCESSING: { color: 'processing', label: 'Đang xử lý' },
  COMPLETED: { color: 'success', label: 'Hoàn thành' },
  CANCELLED: { color: 'error', label: 'Đã hủy' },
};

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState<AdminOrder[]>([]);
  const [processingOrders, setProcessingOrders] = useState<AdminOrder[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pendingRes, processingRes] = await Promise.all([
        getAdminOrders({ page: 1, limit: 20, status: 'PENDING' }),
        getAdminOrders({ page: 1, limit: 20, status: 'PROCESSING' }),
      ]);
      setPendingOrders(pendingRes.data || []);
      setProcessingOrders(processingRes.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const renderList = (orders: AdminOrder[], emptyText: string) => {
    if (!orders.length) {
      return <Empty description={emptyText} />;
    }

    return (
      <List
        dataSource={orders}
        renderItem={(order) => {
          const meta = STATUS_META[order.status] || { color: 'default', label: order.status };
          return (
            <List.Item
              className={styles.item}
              actions={[
                <Button type="link" key="view" onClick={() => history.push(`/admin/orders/${order._id}`)}>
                  Xem chi tiết
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<ShoppingOutlined style={{ fontSize: 22, color: '#FFA78A' }} />}
                title={
                  <span>
                    Đơn #{order.orderCode}{' '}
                    <Tag color={meta.color}>{meta.label}</Tag>
                  </span>
                }
                description={
                  <>
                    {order.shippingAddress?.customerName} · {order.shippingAddress?.phone}
                    <br />
                    {new Intl.NumberFormat('vi-VN').format(order.totalAmount || 0)} đ ·{' '}
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </>
                }
              />
            </List.Item>
          );
        }}
      />
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <BellOutlined /> Trung tâm thông báo Admin
          </h1>
          <p className={styles.subtitle}>Theo dõi đơn hàng cần xử lý từ API thật</p>
        </div>
        <Button onClick={loadData} loading={loading}>
          Làm mới
        </Button>
      </div>

      <Spin spinning={loading}>
        <Tabs defaultActiveKey="pending">
          <Tabs.TabPane
            tab={
              <span>
                Chờ xác nhận <Badge count={pendingOrders.length} style={{ marginLeft: 8 }} />
              </span>
            }
            key="pending"
          >
            {renderList(pendingOrders, 'Không có đơn chờ xác nhận')}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                Đang xử lý <Badge count={processingOrders.length} style={{ marginLeft: 8 }} />
              </span>
            }
            key="processing"
          >
            {renderList(processingOrders, 'Không có đơn đang xử lý')}
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </div>
  );
}
