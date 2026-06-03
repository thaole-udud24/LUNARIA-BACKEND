import { FileText, CheckCircle, Truck, UserPlus } from 'lucide-react';
import type { DashboardStats } from '@/services/Admin/types';
import styles from './StatCards.less';

interface StatCardsProps {
  stats: DashboardStats;
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.cardBlue}`}>
        <div className={styles.header}>
          <h3>Đơn hàng mới</h3>
          <div className={`${styles.iconWrapper} ${styles.iconBlue}`}><FileText size={18}/></div>
        </div>
        <div className={styles.count}>{stats.newOrders.count}</div>
        <div className={styles.footer}>
          <span>Tiềm năng</span> 
          <span className={styles.revenue}>+ {stats.newOrders.potentialRevenue.toLocaleString()} đ</span>
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardRed}`}>
        <div className={styles.header}>
          <h3>Đơn đã xử lý</h3>
          <div className={`${styles.iconWrapper} ${styles.iconRed}`}><CheckCircle size={18}/></div>
        </div>
        <div className={styles.count}>{stats.processedOrders.count}</div>
        <div className={styles.footer}>
          <span>Tiềm năng</span> 
          <span className={styles.revenue}>+ {stats.processedOrders.potentialRevenue.toLocaleString()} đ</span>
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardYellow}`}>
        <div className={styles.header}>
          <h3>Đơn đã giao</h3>
          <div className={`${styles.iconWrapper} ${styles.iconYellow}`}><Truck size={18}/></div>
        </div>
        <div className={styles.count}>{stats.deliveredOrders.count}</div>
        <div className={styles.footer}>
          <span>Tiềm năng</span> 
          <span className={styles.revenue}>+ {stats.deliveredOrders.potentialRevenue.toLocaleString()} đ</span>
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardGreen}`}>
        <div className={styles.header}>
          <h3>Khách hàng mới</h3>
          <div className={`${styles.iconWrapper} ${styles.iconGreen}`}><UserPlus size={18}/></div>
        </div>
        <div className={styles.count}>{stats.newCustomers.count}</div>
        <div className={styles.footer}>
          <span>Tiềm năng</span> 
          <span className={styles.revenue}>+ {stats.newCustomers.potentialRevenue.toLocaleString()} đ</span>
        </div>
      </div>
    </div>
  );
}