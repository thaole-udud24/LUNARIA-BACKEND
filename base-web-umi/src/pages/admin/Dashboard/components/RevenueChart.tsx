import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AnimatedNumber from '@/components/common/AnimatedNumber';
import type { RevenueData } from '@/services/Admin/types';
import styles from './RevenueChart.less';

interface RevenueChartProps {
  revenue?: RevenueData;
  revenueWeek?: RevenueData;
  revenueMonth?: RevenueData;
  revenueYear?: RevenueData;
}

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.ttLabel}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: '13px', fontWeight: 600 }}>
            {entry.name}: {entry.name === 'Doanh thu'
              ? `${new Intl.NumberFormat('vi-VN').format(entry.value)} đ`
              : new Intl.NumberFormat('vi-VN').format(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({
  revenue,
  revenueWeek,
  revenueMonth,
  revenueYear,
}: RevenueChartProps) {
  const [activeTab, setActiveTab] = useState('Tuần');
  const tabs = ['Tuần', 'Tháng', 'Năm'];

  const activePeriod = useMemo(() => {
    switch (activeTab) {
      case 'Tháng':
        return revenueMonth || revenue;
      case 'Năm':
        return revenueYear || revenue;
      case 'Tuần':
      default:
        return revenueWeek || revenue;
    }
  }, [activeTab, revenue, revenueWeek, revenueMonth, revenueYear]);

  const chartData = activePeriod?.chartData?.length ? activePeriod.chartData : [];
  const totalAmount = activePeriod?.total || 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Doanh thu</h3>
          <h2 className={styles.amount}>
            <AnimatedNumber value={totalAmount} /> đ
          </h2>
        </div>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? styles.active : ''}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.item}><span className={`${styles.dot} ${styles.dotSales}`} /> Số lượng bán</div>
        <div className={styles.item}><span className={`${styles.dot} ${styles.dotRev}`} /> Doanh thu (đ)</div>
      </div>

      <div className={styles.chartWrapper}>
        {chartData.length === 0 ? (
          <div className={styles.emptyChart}>Chưa có dữ liệu doanh thu cho kỳ này</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barGap={6}>
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis yAxisId="left" tickFormatter={formatVnd} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} width={72} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => String(v)} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} width={36} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(248, 138, 110, 0.08)' }} />
              <Bar yAxisId="right" dataKey="salesQuantity" name="Số lượng bán" fill="#8ce1b2" radius={[4, 4, 0, 0]} barSize={22} />
              <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="#f89a9e" radius={[4, 4, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
