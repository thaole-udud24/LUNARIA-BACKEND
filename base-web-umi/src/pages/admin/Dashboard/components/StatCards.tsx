import { FileText, CheckCircle, Truck, UserPlus } from 'lucide-react';
import type { DashboardStats } from '@/services/Admin/types';
import AnimatedNumber from '@/components/common/AnimatedNumber';
import styles from './StatCards.less';

const ProgressRing = ({ percent, color, children }: { percent: number, color: string, children: React.ReactNode }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className={styles.ringWrapper}>
      <svg width="48" height="48" className={styles.svgRing}>
        <circle cx="24" cy="24" r={radius} stroke={`${color}33`} strokeWidth="4" fill="none" />
        <circle 
          cx="24" cy="24" r={radius} stroke={color} strokeWidth="4" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ '--offset': offset } as React.CSSProperties}
          className={styles.progressCircle} 
        />
      </svg>
      <div className={styles.ringIcon} style={{ color }}>{children}</div>
    </div>
  );
};

interface StatCardsProps {
  stats: DashboardStats;
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.cardBlue}`}>
        <div className={styles.header}>
          <h3>Đơn hàng mới</h3>
          <ProgressRing percent={85} color="#2563eb"><FileText size={16}/></ProgressRing>
        </div>
        <div className={styles.count}><AnimatedNumber value={stats.newOrders.count} /></div>
        <div className={styles.footer}>
          <span>Tiềm năng</span> 
          <span className={styles.revenue}>+ <AnimatedNumber value={stats.newOrders.potentialRevenue} /> đ</span>
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardRed}`}>
        <div className={styles.header}>
          <h3>Đơn đã xử lý</h3>
          <ProgressRing percent={64} color="#dc2626"><CheckCircle size={16}/></ProgressRing>
        </div>
        <div className={styles.count}><AnimatedNumber value={stats.processedOrders.count} /></div>
        <div className={styles.footer}>
          <span>Tiềm năng</span> 
          <span className={styles.revenue}>+ <AnimatedNumber value={stats.processedOrders.potentialRevenue} formatter={(value) => `${value.toLocaleString('vi-VN')} VND`} /></span>
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardYellow}`}>
        <div className={styles.header}>
          <h3>Đơn đã giao</h3>
          <ProgressRing percent={92} color="#d97706"><Truck size={16}/></ProgressRing>
        </div>
        <div className={styles.count}><AnimatedNumber value={stats.deliveredOrders.count} /></div>
        <div className={styles.footer}>
          <span>Tiềm năng</span> 
          <span className={styles.revenue}>+ <AnimatedNumber value={stats.deliveredOrders.potentialRevenue} /> đ</span>
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardGreen}`}>
        <div className={styles.header}>
          <h3>Khách hàng mới</h3>
          <ProgressRing percent={78} color="#16a34a"><UserPlus size={16}/></ProgressRing>
        </div>
        <div className={styles.count}><AnimatedNumber value={stats.newCustomers.count} /></div>
        <div className={styles.footer}>
          <span>Tiềm năng</span> 
          <span className={styles.revenue}>+ <AnimatedNumber value={stats.newCustomers.potentialRevenue} formatter={(value) => `${value.toLocaleString('vi-VN')} VND`} /></span>
        </div>
      </div>
    </div>
  );
}