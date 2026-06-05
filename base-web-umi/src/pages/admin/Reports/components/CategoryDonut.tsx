import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './CategoryDonut.less';

export default function CategoryDonut({ data }: any) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Tỷ trọng doanh thu theo Nhóm hàng</h3>
      <div className={styles.chartContent}>
        <div className={styles.donutBox}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.centerLabel}>
            <span>Tổng số</span>
            <strong>100%</strong>
          </div>
        </div>
        <div className={styles.legend}>
          {data.map((item: any) => (
            <div key={item.name} className={styles.legendItem}>
              <span className={styles.dot} style={{ background: item.color }}></span>
              <span className={styles.label}>{item.name}</span>
              <span className={styles.percent}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}