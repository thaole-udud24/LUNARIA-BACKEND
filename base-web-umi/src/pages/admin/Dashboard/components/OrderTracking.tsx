import { Search } from 'lucide-react';
import bgImage from '@/assets/images/OrderTracking.png'; 
import styles from './OrderTracking.less';

export default function OrderTracking() {
  return (
    <div className={styles.container}>
      <img src={bgImage} alt="Background" className={styles.bgImage} />
      <div className={styles.overlayContent}>
        <h3 className={styles.title}>Theo dõi đơn hàng</h3>
        <p className={styles.subtitle}>Nhập mã đơn hàng của bạn và tìm kiếm</p>
        
        <div className={styles.searchBox}>
          <input type="text" placeholder="Nhập mã đơn hàng" />
          <button type="button">
            <Search size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}