import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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

// Dữ liệu mẫu cho Tab "Tháng"
const dataThang: ChartDataItem[] = [
  { label: 'Tuần 1', salesQuantity: 120, revenue: 95 },
  { label: 'Tuần 2', salesQuantity: 150, revenue: 130 },
  { label: 'Tuần 3', salesQuantity: 110, revenue: 105 },
  { label: 'Tuần 4', salesQuantity: 180, revenue: 160 },
];

// Dữ liệu mẫu cho Tab "Năm"
const dataNam: ChartDataItem[] = [
  { label: 'Quý 1', salesQuantity: 450, revenue: 380 },
  { label: 'Quý 2', salesQuantity: 520, revenue: 490 },
  { label: 'Quý 3', salesQuantity: 410, revenue: 350 },
  { label: 'Quý 4', salesQuantity: 680, revenue: 620 },
];

export default function RevenueChart({ revenue }: RevenueChartProps) {
  const [activeTab, setActiveTab] = useState('Tuần');
  const tabs = ['Tuần', 'Tháng', 'Năm', 'Tùy chọn'];

  // Hàm chọn dữ liệu hiển thị dựa vào Tab đang được click
  const getChartData = () => {
    switch (activeTab) {
      case 'Tháng':
        return dataThang;
      case 'Năm':
        return dataNam;
      case 'Tùy chọn':
        return dataThang;
      case 'Tuần':
      default:
        return revenue?.chartData && revenue.chartData.length > 0 
          ? revenue.chartData 
          : [
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
  
  // Thay đổi tổng tiền hiển thị trên Header theo Tab
  const getTotalAmount = () => {
    if (activeTab === 'Tháng') return 490000000;
    if (activeTab === 'Năm') return 1840000000;
    return revenue?.total || 12984000;
  };

  // Định dạng số tiền của trục tung và Tooltip
  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value * 1000000) + ' VND';
  };

  // Định dạng số tiền tổng ở Header
  const formatHeaderMoney = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Doanh thu</p>
          <h2 className={styles.amount}>{formatHeaderMoney(getTotalAmount())}</h2>
        </div>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? styles.active : ''}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.item}>
          <span className={`${styles.dot} ${styles.dotSales}`} /> Số lượng bán
        </div>
        <div className={styles.item}>
          <span className={`${styles.dot} ${styles.dotRev}`} /> Doanh thu
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            barGap={6}
          >
            {/* Lưới ngang màu xám nhạt nhẹ nhàng sạch sẽ */}
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            
            <XAxis 
              dataKey="label"
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9ca3af' }} 
              dy={10} 
            />
            
            <YAxis 
              tickFormatter={formatMoney} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              width={85}
            />
            
            <Tooltip
              formatter={(value: any) => [formatMoney(Number(value)), '']}
              cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />

            {/* Cột được tăng kích thước béo lên (barSize={22}) trông cân đối và rõ nét */}
            <Bar dataKey="salesQuantity" name="Số lượng bán" fill="#8ce1b2" radius={[4, 4, 0, 0]} barSize={22} />
            <Bar dataKey="revenue" name="Doanh thu" fill="#f89a9e" radius={[4, 4, 0, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}