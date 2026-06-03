import { ChevronRight } from 'lucide-react';
import type { RecentOrder } from '@/services/Admin/types';
import styles from './RecentOrders.less';

interface RecentOrdersProps {
  orders: RecentOrder[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className={styles.container}>
      <h3>Đơn hàng mới</h3>
      <div className={styles.list}>
        {orders.map((order) => (
          <div key={order.id} className={styles.item}>
            <img src={order.imageUrl} alt={order.productName} />
            <div className={styles.info}>
              <p className={styles.name} title={order.productName}>
                {order.productName}
              </p>
              <p className={styles.qty}>Số lượng : {order.quantity}</p>
              <div className={styles.priceRow}>
                <span className={styles.price}>{order.price.toLocaleString()} đ</span>
                <span className={styles.time}>{order.createdAt}</span>
              </div>
            </div>
            <div className={styles.arrow}>
              <ChevronRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}