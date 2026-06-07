import { TrendingUp, DollarSign, Tag, CreditCard } from 'lucide-react';
import AnimatedNumber from '@/components/common/AnimatedNumber';
import styles from './FinancialCards.less';

export default function FinancialCards({ kpis }: any) {
  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.cardOne}`}>
        <div className={styles.cardHeader}>
          <span className={styles.title}>Doanh thu thuần</span>
          <div className={styles.iconWrap}>
            <DollarSign />
          </div>
        </div>
        <div className={styles.cardBody}>
          <h2 className={styles.valueRow}>
            <AnimatedNumber value={kpis?.totalRevenue?.value || 0} />
            <span className={styles.currency}>VNĐ</span>
          </h2>
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardTwo}`}>
        <div className={styles.cardHeader}>
          <span className={styles.title}>Lợi nhuận ròng</span>
          <div className={styles.iconWrap}>
            <TrendingUp />
          </div>
        </div>
        <div className={styles.cardBody}>
          <h2 className={styles.valueRow}>
            <AnimatedNumber value={kpis?.netProfit?.value || 0} />
            <span className={styles.currency}>VNĐ</span>
          </h2>
          {typeof kpis?.netProfit?.trend === 'number' && (
            <div className={styles.trendBadge}>
              So với tháng trước {kpis.netProfit.trend >= 0 ? '↑' : '↓'} {Math.abs(kpis.netProfit.trend)}%
            </div>
          )}
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardThree}`}>
        <div className={styles.cardHeader}>
          <span className={styles.title}>Khuyến mãi & Chiết khấu</span>
          <div className={styles.iconWrap}>
            <Tag />
          </div>
        </div>
        <div className={styles.cardBody}>
          <h2 className={styles.valueRow}>
            <AnimatedNumber value={kpis?.discounts?.value || 0} />
            <span className={styles.currency}>VNĐ</span>
          </h2>
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardFour}`}>
        <div className={styles.cardHeader}>
          <span className={styles.title}>Giá trị đơn trung bình</span>
          <div className={styles.iconWrap}>
            <CreditCard />
          </div>
        </div>
        <div className={styles.cardBody}>
          <h2 className={styles.valueRow}>
            <AnimatedNumber value={kpis?.aov?.value || 0} />
            <span className={styles.currency}>VNĐ</span>
          </h2>
        </div>
      </div>
    </div>
  );
}