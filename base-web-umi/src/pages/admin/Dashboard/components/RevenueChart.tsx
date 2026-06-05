import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AnimatedNumber from '@/components/common/AnimatedNumber';
import styles from './RevenueChart.less';

interface ChartDataItem {
  label: string;
  salesQuantity: number;
  revenue: number;
}

interface RevenueData {
  total: number;
  chartData: ChartDataItem[];
}

interface RevenueChartProps {
  revenue?: RevenueData;
}

const dataThang: ChartDataItem[] = [
  { label: 'Tuần 1', salesQuantity: 120, revenue: 95 },
  { label: 'Tuần 2', salesQuantity: 150, revenue: 130 },
  { label: 'Tuần 3', salesQuantity: 110, revenue: 105 },
  { label: 'Tuần 4', salesQuantity: 180, revenue: 160 },
];

const dataNam: ChartDataItem[] = [
  { label: 'Quý 1', salesQuantity: 450, revenue: 380 },
  { label: 'Quý 2', salesQuantity: 520, revenue: 490 },
  { label: 'Quý 3', salesQuantity: 410, revenue: 350 },
  { label: 'Quý 4', salesQuantity: 680, revenue: 620 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.ttLabel}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: '13px', fontWeight: 600 }}>
            {entry.name}: {new Intl.NumberFormat('vi-VN').format(entry.value * (entry.name === 'Doanh thu' ? 1000000 : 1))} {entry.name === 'Doanh thu' ? 'VND' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ revenue }: RevenueChartProps) {
  const [activeTab, setActiveTab] = useState('Tuần');
  const tabs = ['Tuần', 'Tháng', 'Năm', 'Tùy chọn'];

  const getChartData = () => {
    switch (activeTab) {
      case 'Tháng': return dataThang;
      case 'Năm': return dataNam;
      case 'Tùy chọn': return dataThang;
      case 'Tuần':
      default:
        return revenue?.chartData && revenue.chartData.length > 0 ? revenue.chartData : [
          { label: 'T2', salesQuantity: 45, revenue: 35 },
          { label: 'T3', salesQuantity: 22, revenue: 16 },
          { label: 'T4', salesQuantity: 25, revenue: 32 },
          { label: 'T5', salesQuantity: 35, revenue: 41 },
          { label: 'T6', salesQuantity: 45, revenue: 32 },
          { label: 'T7', salesQuantity: 55, revenue: 48 },
          { label: 'CN', salesQuantity: 15, revenue: 10 },
        ];
    }
  };

  const chartData = getChartData();
  const getTotalAmount = () => {
    if (activeTab === 'Tháng') return 490000000;
    if (activeTab === 'Năm') return 1840000000;
    return revenue?.total || 12984000;
  };

  const formatMoney = (value: number) => new Intl.NumberFormat('vi-VN').format(value * 1000000) + ' VND';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Doanh thu</h3>
          <h2 className={styles.amount}>
            <AnimatedNumber value={getTotalAmount()} /> đ
          </h2>
        </div>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? styles.active : ''}>{tab}</button>
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.item}><span className={`${styles.dot} ${styles.dotSales}`} /> Số lượng bán</div>
        <div className={styles.item}><span className={`${styles.dot} ${styles.dotRev}`} /> Doanh thu</div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barGap={6}>
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
            <YAxis tickFormatter={formatMoney} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} width={85} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(248, 138, 110, 0.08)' }} />
            <Bar dataKey="salesQuantity" name="Số lượng bán" fill="#8ce1b2" radius={[4, 4, 0, 0]} barSize={22} isAnimationActive={true} animationDuration={800} animationEasing="ease-out" />
            <Bar dataKey="revenue" name="Doanh thu" fill="#f89a9e" radius={[4, 4, 0, 0]} barSize={22} isAnimationActive={true} animationDuration={800} animationEasing="ease-out" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}