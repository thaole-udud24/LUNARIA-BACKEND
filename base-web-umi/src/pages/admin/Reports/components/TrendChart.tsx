import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './TrendChart.less';

export default function TrendChart({ data }: any) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Diễn biến Doanh thu & Lợi nhuận</h3>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFA78A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FFA78A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#FFA78A" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorRev)" 
              name="Doanh thu"
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              fill="transparent" 
              name="Lợi nhuận"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}