import { useEffect, useState } from 'react';
import { getDashboardData } from '@/services/Admin/dashboard.api';
import type { DashboardResponse } from '@/services/Admin/types';
import OrderTracking from './components/OrderTracking';
import StatCards from './components/StatCards';
import RecentOrders from './components/RecentOrders';
import RevenueChart from './components/RevenueChart';
import BestSellers from './components/BestSellers';
import styles from './styles.less';

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getDashboardData().then((res) => {
      if (res.success) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      
      {/* KHỐI TRÊN: 1 ô Theo dõi đơn hàng + 4 ô Thống kê */}
      <div className={styles.topRow}>
        <OrderTracking />
        <StatCards stats={data.stats} />
      </div>

      {/* KHỐI DƯỚI: Ô Đơn hàng mới + Nhóm (Biểu đồ & Sản phẩm bán chạy) */}
      <div className={styles.bottomRow}>
        <RecentOrders orders={data.recentOrders} />
        <div className={styles.chartGroup}>
          <RevenueChart revenue={data.revenue} />
          <BestSellers products={data.bestSellers} />
        </div>
      </div>

    </div>
  );
}