import { useCallback, useEffect, useState } from 'react';
import { message, Tooltip } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { getDashboardData } from '@/services/Admin/dashboard.api';
import type { DashboardResponse } from '@/services/Admin/types';
import { unwrapDashboardOverview, resolveMediaUrl } from '@/utils/adminApi';
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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async (showMsg = false) => {
    setLoading(true);
    try {
      const res = await getDashboardData();
      const parsed = unwrapDashboardOverview<DashboardResponse['data']>(res);
      if (parsed) {
        setData(parsed);
        setLastUpdated(new Date());
        if (showMsg) message.success('Đã cập nhật dữ liệu tổng quan!');
      } else {
        message.error('Dữ liệu Tổng quan bị rỗng hoặc sai cấu trúc!');
      }
    } catch {
      message.error('Không thể kết nối đến máy chủ API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !data) return <Loading />;

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h2>Không thể tải dữ liệu Dashboard</h2>
          <p>Vui lòng kiểm tra lại kết nối Backend hoặc thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Tổng quan</h1>
          <div className={styles.breadcrumb}>
            <span>Trang chủ</span>
            <span className={styles.separator}>/</span>
            <span className={styles.active}>Tổng quan</span>
          </div>
        </div>
        <div className={styles.metaRow}>
          Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          <Tooltip title="Làm mới">
            <SyncOutlined spin={loading} className={styles.refreshIcon} onClick={() => fetchData(true)} />
          </Tooltip>
        </div>
      </div>

      <div className={styles.topRow}>
        <OrderTracking />
        <StatCards stats={data.stats} />
      </div>

      <div className={styles.bottomRow}>
        <RecentOrders
          orders={data.recentOrders?.map((order) => ({
            ...order,
            imageUrl: resolveMediaUrl(order.imageUrl),
          }))}
        />
        <div className={styles.chartGroup}>
          <RevenueChart
            revenue={data.revenue}
            revenueWeek={data.revenueWeek || data.revenue}
            revenueMonth={data.revenueMonth}
            revenueYear={data.revenueYear}
          />
          <BestSellers
            products={data.bestSellers?.map((p) => ({
              ...p,
              imageUrl: resolveMediaUrl(p.imageUrl),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
