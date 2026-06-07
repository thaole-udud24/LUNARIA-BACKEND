import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './CategoryDonut.less';

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

export default function CategoryDonut({ data }: { data: { name: string; value: number; color: string }[] }) {
  const items = data || [];
  const total = items.reduce((sum, item) => sum + (item.value || 0), 0);

  const chartData = items.map((item) => ({
    ...item,
    percent: total > 0 ? Math.round((item.value / total) * 100) : 0,
  }));

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Tỷ trọng doanh thu theo Nhóm hàng</h3>
      <div className={styles.chartContent}>
        <div className={styles.donutBox}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.centerLabel}>
            <span>Tổng DT</span>
            <strong>{total > 0 ? formatVnd(total) : '0 ₫'}</strong>
          </div>
        </div>
        <div className={styles.legend}>
          {chartData.map((item) => (
            <div key={item.name} className={styles.legendItem}>
              <span className={styles.dot} style={{ background: item.color }} />
              <span className={styles.label}>{item.name}</span>
              <span className={styles.percent}>
                {item.percent}% · {formatVnd(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
