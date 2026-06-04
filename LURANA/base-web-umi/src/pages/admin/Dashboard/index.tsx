import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getDashboardData } from '@/services/Admin/dashboard.api';
import type { DashboardResponse } from '@/services/Admin/types';
import OrderTracking from './components/OrderTracking';
import StatCards from './components/StatCards';
import RecentOrders from './components/RecentOrders';
import RevenueChart from './components/RevenueChart';
import BestSellers from './components/BestSellers';
import Loading from '@/components/common/Loading';
import styles from './styles.less';

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    getDashboardData()
      .then((res: any) => {
        if (res && res.success && res.data) {
          setData(res.data);
        } else {
          message.error('Dữ liệu Tổng quan bị rỗng hoặc sai cấu trúc!');
        }
      })
      .catch((err) => {
        console.error('Lỗi API Dashboard:', err);
        message.error('Không thể kết nối đến máy chủ API.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', background: 'white', borderRadius: '20px', margin: '24px' }}>
        <h2 style={{ color: '#ff4d4f', marginBottom: '16px' }}>Opps! Không thể tải dữ liệu</h2>
        <p style={{ fontSize: '16px', color: '#4b5563' }}>Vui lòng kiểm tra lại kết nối Backend hoặc thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <div className={styles.breadcrumb}>
          <span>Home</span>
          <span className={styles.separator}>/</span>
          <span className={styles.active}>Dashboard</span>
        </div>
      </div>

      <div className={styles.topRow}>
        <OrderTracking />
        <StatCards stats={data.stats} />
      </div>
      
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