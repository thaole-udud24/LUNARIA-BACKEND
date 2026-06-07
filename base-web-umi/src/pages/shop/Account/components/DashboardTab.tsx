import React, { useMemo } from 'react';
import { history } from 'umi';
import {
  ShoppingOutlined,
  CreditCardOutlined,
  InboxOutlined,
  TagOutlined,
  ArrowRightOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import {
  ApiOrder,
  DashboardStats,
  SavedVoucher,
  buildDashboardStats,
  formatDate,
  formatPrice,
  getOrderStatusMeta,
} from '../account.utils';

interface DashboardTabProps {
  orders: ApiOrder[];
  savedVouchers: SavedVoucher[];
}

const KPI_CONFIG = [
  { key: 'orders', icon: <ShoppingOutlined />, label: 'Tổng đơn hàng' },
  { key: 'spent', icon: <CreditCardOutlined />, label: 'Tổng chi tiêu' },
  { key: 'products', icon: <InboxOutlined />, label: 'Sản phẩm đã mua' },
  { key: 'vouchers', icon: <TagOutlined />, label: 'Voucher' },
] as const;

const CHART_OPTS = {
  chart: { toolbar: { show: false }, zoom: { enabled: false } },
};

const DashboardTab: React.FC<DashboardTabProps> = ({ orders, savedVouchers }) => {
  const stats: DashboardStats = useMemo(
    () => buildDashboardStats(orders, savedVouchers),
    [orders, savedVouchers],
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 5),
    [orders],
  );

  const kpiValues: Record<string, string> = {
    orders: String(stats.totalOrders),
    spent: formatPrice(stats.totalSpent),
    products: String(stats.totalProducts),
    vouchers: String(stats.totalVouchers),
  };

  const spendingChart = {
    xAxis: stats.monthlySpending.map((m) => m.month),
    yAxis: [stats.monthlySpending.map((m) => m.amount)],
    yLabel: ['Chi tiêu (đ)'],
    height: 240,
    type: 'area' as const,
    formatY: (val: number) => `${(val / 1000).toFixed(0)}k`,
    colors: ['#FFA78A'],
    otherOptions: CHART_OPTS,
  };

  const ordersChart = {
    xAxis: stats.monthlySpending.map((m) => m.month),
    yAxis: [stats.monthlySpending.map((m) => m.orders)],
    yLabel: ['Số đơn'],
    height: 240,
    type: 'bar' as const,
    colors: ['#f39a7d'],
    otherOptions: CHART_OPTS,
  };

  const productChart = {
    xAxis: stats.topProducts.map((p) => p.name),
    yAxis: [stats.topProducts.map((p) => p.quantity)],
    yLabel: ['Số lượng'],
    height: 320,
    colors: ['#FFA78A', '#f39a7d', '#ffd4c7', '#ffb89e', '#ffcdb8'],
    otherOptions: {
      chart: { toolbar: { show: false } },
      legend: { position: 'bottom' as const, horizontalAlign: 'center' as const },
    },
  };

  return (
    <div className="account-card dashboard-tab">
      <div className="dashboard-hero">
        <div className="dashboard-hero__text">
          <span className="dashboard-hero__badge">
            <RiseOutlined /> Tổng quan
          </span>
          <h2>Xin chào, thành viên Lunaria!</h2>
          <p>Theo dõi chi tiêu, đơn hàng và ưu đãi của bạn</p>
        </div>
        <div className="dashboard-hero__stats">
          <div className="hero-stat-chip">
            <strong>{stats.totalOrders}</strong>
            <span>Đơn hàng</span>
          </div>
          <div className="hero-stat-chip">
            <strong>{formatPrice(stats.totalSpent)}</strong>
            <span>Đã chi tiêu</span>
          </div>
        </div>
      </div>

      <div className="dashboard-kpi-grid">
        {KPI_CONFIG.map((item) => (
          <div className="dashboard-kpi" key={item.key}>
            <div className="dashboard-kpi__icon">{item.icon}</div>
            <div className="dashboard-kpi__content">
              <p>{item.label}</p>
              <strong>{kpiValues[item.key]}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts-stack">
        {stats.monthlySpending.length > 0 ? (
          <>
            <div className="chart-card">
              <ColumnChart {...spendingChart} title="Chi tiêu theo tháng" />
            </div>
            <div className="chart-card">
              <ColumnChart {...ordersChart} title="Đơn hàng theo tháng" />
            </div>
          </>
        ) : (
          <div className="account-empty mini">
            <p>Chưa có dữ liệu biểu đồ. Hãy đặt đơn hàng đầu tiên!</p>
          </div>
        )}

        {stats.topProducts.length > 0 && (
          <div className="chart-card chart-card--donut">
            <DonutChart {...productChart} title="Top sản phẩm" showTotal />
          </div>
        )}
      </div>

      <div className="dashboard-recent">
        <div className="dashboard-recent__header">
          <h3>Đơn hàng gần đây</h3>
          <button
            type="button"
            className="link-btn"
            onClick={() => history.push('/account?tab=ORDERS')}
          >
            Xem tất cả <ArrowRightOutlined />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="account-empty mini">
            <p>Bạn chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <div className="recent-orders-list">
            {recentOrders.map((order) => {
              const meta = getOrderStatusMeta(order.status);
              const firstItem = order.items?.[0];
              return (
                <div
                  className="recent-order-row"
                  key={order._id}
                  onClick={() => history.push(`/orderdetail?id=${order._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && history.push(`/orderdetail?id=${order._id}`)}
                >
                  <div className="recent-order-row__main">
                    <strong>{order.orderCode}</strong>
                    <span>{firstItem?.name || 'Sản phẩm'}</span>
                  </div>
                  <div className="recent-order-row__meta">
                    <span>{formatDate(order.createdAt)}</span>
                    <em>{formatPrice(order.totalAmount)}</em>
                  </div>
                  <span className={`status-badge ${meta.className}`}>{meta.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;
