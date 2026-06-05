import { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { message, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getAdminOrderById } from '@/services/DonHang/orders.api';
import type { AdminOrder } from '@/services/DonHang/types';
import CustomerInfo from './components/CustomerInfo';
import OrderItemsTable from './components/OrderItemsTable';
import OrderTimeline from './components/OrderTimeline';
import PaymentSummary from './components/PaymentSummary';
import Loading from '@/components/common/Loading';

import styles from './styles.less';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getAdminOrderById(id)
      .then((res: any) => {
        setOrder(res.data || res);
      })
      .catch(() => {
        message.error('Không thể tải thông tin đơn hàng!');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loading />;
  if (!order) return <div className={styles.errorText}>Không tìm thấy đơn hàng.</div>;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.pageHeader}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => history.push('/admin/orders')}
          className={styles.backBtn}
        >
          Quay lại danh sách
        </Button>
        <h1 className={styles.pageTitle}>Chi tiết đơn hàng #{order.orderCode}</h1>
      </div>

      <div className={styles.gridLayout}>
        {/* CỘT TRÁI (Lớn) */}
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Lộ trình đơn hàng</h3>
            <OrderTimeline status={order.status} createdAt={order.createdAt} />
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Sản phẩm đã đặt</h3>
            <OrderItemsTable items={order.items} />
          </div>
        </div>

        {/* CỘT PHẢI (Nhỏ) */}
        <div className={styles.sideCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Thông tin giao hàng</h3>
            <CustomerInfo address={order.shippingAddress} note={order.note} />
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Thanh toán</h3>
            <PaymentSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}