import { history } from 'umi';
import { ChevronRight } from 'lucide-react';
import type { RecentOrder } from '@/services/Admin/types';
import styles from './RecentOrders.less';

interface RecentOrdersProps {
  orders?: RecentOrder[];
}

export default function RecentOrders({ orders = [] }: RecentOrdersProps) {
  if (!orders.length) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Đơn hàng mới</h3>
        <div className={styles.empty}>Chưa có đơn hàng mới</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Đơn hàng mới</h3>
      <div className={styles.list}>
        {orders.map((order, index) => (
          <div
            key={order.id}
            className={styles.item}
            style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
            onClick={() => history.push(`/admin/orders/${order.orderId || order.id}`)}
            onKeyDown={(e) => e.key === 'Enter' && history.push(`/admin/orders/${order.orderId || order.id}`)}
            role="button"
            tabIndex={0}
          >
            <img src={order.imageUrl} alt={order.productName} />
            <div className={styles.info}>
              <p className={styles.name} title={order.productName}>
                {order.productName}
              </p>
              <p className={styles.qty}>Số lượng: {order.quantity}</p>
              <div className={styles.priceRow}>
                <span className={styles.price}>{order.price.toLocaleString('vi-VN')} đ</span>
                <span className={styles.time}>{order.createdAt}</span>
              </div>
            </div>
            <div className={styles.arrow}>
              <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
