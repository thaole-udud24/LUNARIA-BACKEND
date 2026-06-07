import React, { useMemo, useState } from 'react';
import { history } from 'umi';
import {
  LoadingOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { message, Spin } from 'antd';
import { addToCart } from '@/services/GioHang/cart.api';
import AccountEmpty from './AccountEmpty';
import {
  ApiOrder,
  OrderFilterKey,
  filterOrdersByTab,
  formatDate,
  formatPrice,
  getOrderStatusMeta,
} from '../account.utils';
import { resolveMongoId } from '../../Orders/order.utils';

interface OrdersTabProps {
  orders: ApiOrder[];
  loading?: boolean;
}

const FILTER_TABS: { key: OrderFilterKey; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ xác nhận' },
  { key: 'PROCESSING', label: 'Đang xử lý' },
  { key: 'SHIPPING', label: 'Đang giao' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

const OrdersTab: React.FC<OrdersTabProps> = ({ orders, loading }) => {
  const [filter, setFilter] = useState<OrderFilterKey>('ALL');
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const filtered = useMemo(() => filterOrdersByTab(orders, filter), [orders, filter]);

  const tabCounts = useMemo(() => {
    const counts: Record<OrderFilterKey, number> = {
      ALL: orders.length,
      PENDING: 0,
      PROCESSING: 0,
      SHIPPING: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    FILTER_TABS.forEach((tab) => {
      if (tab.key !== 'ALL') {
        counts[tab.key] = filterOrdersByTab(orders, tab.key).length;
      }
    });
    return counts;
  }, [orders]);

  const handleReorder = async (order: ApiOrder) => {
    setReorderingId(order._id);
    try {
      for (const item of order.items || []) {
        const rawId = item.productId as string | { _id?: string } | undefined;
        const productId =
          typeof rawId === 'object' && rawId?._id
            ? String(rawId._id)
            : rawId
              ? String(rawId)
              : '';
        if (!productId) continue;
        await addToCart({
          productId,
          variantName: item.variantName || 'Default',
          quantity: item.quantity,
        });
      }
      message.success('Đã thêm sản phẩm vào giỏ hàng');
      history.push('/cart');
    } catch {
      message.error('Không thể mua lại đơn hàng này');
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <div className="account-card orders-tab-card">
      <div className="card-header card-header--compact">
        <div>
          <h2>Đơn hàng của tôi</h2>
          <p>
            {orders.length > 0
              ? `Bạn có ${orders.length} đơn hàng`
              : 'Theo dõi trạng thái đơn hàng tại Lunaria'}
          </p>
        </div>
        {orders.length > 0 && (
          <span className="orders-total-badge">{orders.length}</span>
        )}
      </div>

      <div className="order-status-tabs">
        {FILTER_TABS.map((tab) => {
          const count = tabCounts[tab.key];
          return (
            <button
              key={tab.key}
              type="button"
              className={`status-tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              {count > 0 && <span className="status-tab__count">{count}</span>}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="account-loading-inline">
          <Spin indicator={<LoadingOutlined spin />} tip="Đang tải đơn hàng..." />
        </div>
      ) : filtered.length === 0 ? (
        <AccountEmpty
          icon={<ShoppingOutlined />}
          title="Không có đơn hàng nào"
          description={
            filter === 'ALL'
              ? 'Hãy khám phá sản phẩm và đặt đơn hàng đầu tiên của bạn.'
              : 'Không có đơn hàng nào trong trạng thái này.'
          }
          actionLabel="Mua sắm ngay"
          onAction={() => history.push('/products')}
        />
      ) : (
        <div className="orders-card-list">
          {filtered.map((order) => {
            const meta = getOrderStatusMeta(order.status);

            return (
              <div className="order-card" key={order._id}>
                <div className="order-card__head">
                  <div>
                    <strong>{order.orderCode}</strong>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`status-badge ${meta.className}`}>{meta.label}</span>
                </div>

                <div className="order-card__items">
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <div className="order-card__item" key={`${item.name}-${idx}`}>
                      <span>{item.name}</span>
                      <em>x{item.quantity}</em>
                    </div>
                  ))}
                  {(order.items?.length || 0) > 3 && (
                    <p className="order-card__more">+{(order.items?.length || 0) - 3} sản phẩm khác</p>
                  )}
                </div>

                <div className="order-card__footer">
                  <div>
                    <small>Tổng thanh toán</small>
                    <strong>{formatPrice(order.totalAmount)}</strong>
                  </div>
                  <div className="order-card__actions">
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() =>
                        history.push(
                          `/orderdetail?id=${resolveMongoId(order._id)}&from=account`,
                        )
                      }
                    >
                      <EyeOutlined /> Chi tiết
                    </button>
                    {order.status === 'COMPLETED' && (
                      <button
                        type="button"
                        className="btn-save btn-save--sm"
                        onClick={() => handleReorder(order)}
                        disabled={reorderingId === order._id}
                      >
                        {reorderingId === order._id ? (
                          <LoadingOutlined spin />
                        ) : (
                          <>
                            <ShoppingCartOutlined /> Mua lại
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
