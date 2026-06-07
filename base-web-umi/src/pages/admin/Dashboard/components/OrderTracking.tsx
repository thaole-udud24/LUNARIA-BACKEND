import { useState } from 'react';
import { history } from 'umi';
import { message } from 'antd';
import { Search } from 'lucide-react';
import { getAdminOrders } from '@/services/DonHang/orders.api';
import { unwrapListResponse } from '@/utils/adminApi';
import bgImage from '@/assets/images/OrderTracking.png';
import styles from './OrderTracking.less';

export default function OrderTracking() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const query = keyword.trim();
    if (!query) {
      message.warning('Vui lòng nhập mã đơn hàng hoặc số điện thoại');
      return;
    }

    setLoading(true);
    try {
      const res = await getAdminOrders({ page: 1, limit: 5, search: query });
      const { list } = unwrapListResponse<any>(res);

      if (!list.length) {
        message.info('Không tìm thấy đơn hàng phù hợp');
        return;
      }

      const order = list[0];
      const orderId = order._id || order.id;
      history.push(`/admin/orders/${orderId}`);
    } catch {
      message.error('Không tra cứu được đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <img src={bgImage} alt="Background" className={styles.bgImage} />
      <div className={styles.overlayContent}>
        <h3 className={styles.title}>Theo dõi đơn hàng</h3>
        <p className={styles.subtitle}>Nhập mã đơn hoặc SĐT khách hàng</p>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="VD: LRN... hoặc 09xx..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={loading}
          />
          <button type="button" onClick={handleSearch} disabled={loading}>
            <Search size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
