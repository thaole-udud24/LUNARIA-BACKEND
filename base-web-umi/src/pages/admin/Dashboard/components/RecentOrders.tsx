import { history } from 'umi';
import { ChevronRight } from 'lucide-react';
import { Tag } from 'antd';
import type { RecentOrder } from '@/services/Admin/types';
import { resolveMediaUrlWithFallback } from '@/utils/apiUrl';
import styles from './RecentOrders.less';

const PLACEHOLDER_IMG =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><rect fill="#f1f5f9" width="72" height="72" rx="12"/><text x="50%" y="54%" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="sans-serif">N/A</text></svg>',
  );

const STATUS_META: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: 'Chờ xác nhận' },
  CONFIRMED: { color: 'blue', label: 'Đã xác nhận' },
  PROCESSING: { color: 'processing', label: 'Đang xử lý' },
  COMPLETED: { color: 'success', label: 'Hoàn thành' },
  CANCELLED: { color: 'error', label: 'Đã hủy' },
};

interface RecentOrdersProps {
  orders?: RecentOrder[];
}

export default function RecentOrders({ orders = [] }: RecentOrdersProps) {
  if (!orders.length) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Đơn hàng mới</h3>
        <div className={styles.empty}>Chưa có đơn hàng mới</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Đơn hàng mới</h3>
      <div className={styles.list}>
        {orders.map((order, index) => {
          const meta = STATUS_META[order.status || ''] || { color: 'default', label: order.status || '—' };
          return (
            <div
              key={order.id}
              className={styles.item}
              style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
              onClick={() => history.push(`/admin/orders/${order.orderId || order.id}`)}
              onKeyDown={(e) => e.key === 'Enter' && history.push(`/admin/orders/${order.orderId || order.id}`)}
              role="button"
              tabIndex={0}
            >
              <img
                src={resolveMediaUrlWithFallback(order.imageUrl, PLACEHOLDER_IMG)}
                alt={order.productName}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                }}
              />
              <div className={styles.info}>
                <div className={styles.orderMeta}>
                  <span className={styles.orderCode}>{order.orderCode || `#${order.id.slice(-6)}`}</span>
                  <Tag color={meta.color} style={{ margin: 0, borderRadius: 10 }}>{meta.label}</Tag>
                </div>
                <p className={styles.name} title={order.productName}>
                  {order.productName}
                </p>
                <p className={styles.qty}>Số lượng: {order.quantity}</p>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{order.price.toLocaleString('vi-VN')} đ</span>
                  <span className={styles.time}>{order.createdAt}</span>
                </div>
              </div>
              <div className={styles.arrow}>
                <ChevronRight size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
