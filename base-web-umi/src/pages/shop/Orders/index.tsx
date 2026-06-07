import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Spin } from 'antd';
import { history } from 'umi';
import { getMyOrders } from '@/services/DonHang/orders.customer.api';
import { addToCart } from '@/services/GioHang/cart.api';
import OrderTabs from './components/OrderTabs';
import OrderSearch from './components/OrderSearch';
import OrderCard from './components/OrderCard';
import { OrderStatus, OrderData } from './types';
import { mapApiOrderToOrderData, matchesOrderTab, parseOrdersList } from './order.utils';
import './index.less';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const res = await getMyOrders({ page: 1, limit: 100 });
      const list = parseOrdersList(res).map(mapApiOrderToOrderData);
      setOrders(list);
    } catch {
      message.error('Không tải được danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchOrders();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [fetchOrders]);

  const handleReorder = async (order: OrderData) => {
    setReorderingId(order.id);
    try {
      for (const item of order.items) {
        if (!item.productId) continue;
        await addToCart({
          productId: item.productId,
          variantName: item.variantName || item.variant || 'Mặc định',
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

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (!matchesOrderTab(order, activeTab)) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const matchCode = order.orderCode.toLowerCase().includes(q);
        const matchItem = order.items.some((item) => item.name.toLowerCase().includes(q));
        return matchCode || matchItem;
      }),
    [orders, activeTab, searchQuery],
  );

  return (
    <div className="orders-page-wrapper">
      <div className="orders-page-container">
        <div className="page-header">
          <h1>Đơn mua của tôi</h1>
          <p>Quản lý, theo dõi trạng thái và chi tiết các đơn hàng bạn đã đặt tại Lunaria</p>
        </div>

        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} orders={orders} />
        <OrderSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {loading ? (
          <div className="orders-loading">
            <Spin size="large" />
          </div>
        ) : (
          <div className="orders-list-content">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  reordering={reorderingId === order.id}
                  onReorder={handleReorder}
                />
              ))
            ) : (
              <div className="empty-orders-container">
                <div className="empty-icon">📦</div>
                <h3>Không tìm thấy đơn hàng nào</h3>
                <p>
                  {orders.length === 0
                    ? 'Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm và đặt hàng ngay!'
                    : 'Không có đơn hàng nào khớp với bộ lọc hoặc từ khóa tìm kiếm.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
