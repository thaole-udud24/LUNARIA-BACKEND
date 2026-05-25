import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import OrderTabs from './components/OrderTabs';
import OrderSearch from './components/OrderSearch';
import OrderCard from './components/OrderCard';
import { OrderStatus, OrderData } from './types';
import './index.less';

export const initialOrdersData: OrderData[] = [
  {
    id: 'order-1',
    orderCode: '#LN-889922',
    date: '19/05/2026',
    status: 'SHIPPING',
    items: [
      {
        id: 'item-1',
        name: 'CC+ Cream Illumination with SPF 50+',
        image: 'product-1.jpg',
        price: 430000,
        quantity: 1,
        variant: 'Tone Sáng (Fair)',
      },
      {
        id: 'item-2',
        name: 'Sữa Rửa Mặt Sâm 1700',
        image: 'product-2.jpg',
        price: 350000,
        quantity: 1,
        variant: '150ml',
      },
    ],
    totalAmount: 780000,
    shippingFee: 30000,
    discountAmount: 50000,
    paymentMethod: 'Thanh toán qua VNPAY',
    paymentStatus: 'PAID',
    shippingAddress: {
      fullName: 'Khách hàng Lunaria',
      phone: '0988777666',
      address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    },
    trackingSteps: [
      { title: 'Đơn hàng đã đặt', description: 'Đơn hàng đã được đặt thành công trên hệ thống', time: '19/05/2026 08:00', completed: true },
      { title: 'Đã xác nhận', description: 'Lunaria đã xác nhận và đóng gói đơn hàng', time: '19/05/2026 10:30', completed: true },
      { title: 'Đang vận chuyển', description: 'Đơn hàng đã được bàn giao cho đối tác vận chuyển GHTK', time: '19/05/2026 14:00', completed: true },
      { title: 'Giao hàng thành công', description: 'Đơn hàng đang trên đường giao tới bạn', time: 'Dự kiến 20/05/2026', completed: false },
    ],
  },
  {
    id: 'order-2',
    orderCode: '#LN-776655',
    date: '15/05/2026',
    status: 'COMPLETED',
    items: [
      {
        id: 'item-3',
        name: 'Bye Bye Lines Foundation',
        image: 'product-3.jpg',
        price: 650000,
        quantity: 1,
        variant: 'Tone Tự Nhiên (Medium)',
      },
    ],
    totalAmount: 650000,
    shippingFee: 0,
    discountAmount: 0,
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    paymentStatus: 'PAID',
    shippingAddress: {
      fullName: 'Khách hàng Lunaria',
      phone: '0988777666',
      address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    },
    trackingSteps: [
      { title: 'Đơn hàng đã đặt', description: 'Đơn hàng đã được đặt thành công trên hệ thống', time: '15/05/2026 09:15', completed: true },
      { title: 'Đã xác nhận', description: 'Lunaria đã xác nhận và đóng gói đơn hàng', time: '15/05/2026 11:00', completed: true },
      { title: 'Đang vận chuyển', description: 'Đơn hàng đã được bàn giao cho đối tác vận chuyển GHTK', time: '15/05/2026 16:20', completed: true },
      { title: 'Giao hàng thành công', description: 'Đơn hàng đã được giao thành công cho người nhận', time: '16/05/2026 14:30', completed: true },
    ],
  },
  {
    id: 'order-3',
    orderCode: '#LN-554433',
    date: '10/05/2026',
    status: 'PENDING',
    items: [
      {
        id: 'item-4',
        name: 'Toner Hoa Hồng Cấp Ẩm Lunaria',
        image: 'product-4.jpg',
        price: 280000,
        quantity: 2,
        variant: '200ml',
      },
    ],
    totalAmount: 560000,
    shippingFee: 30000,
    discountAmount: 30000,
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    paymentStatus: 'UNPAID',
    shippingAddress: {
      fullName: 'Khách hàng Lunaria',
      phone: '0988777666',
      address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    },
    trackingSteps: [
      { title: 'Đơn hàng đã đặt', description: 'Đơn hàng đã được đặt thành công trên hệ thống', time: '10/05/2026 20:00', completed: true },
      { title: 'Đã xác nhận', description: 'Lunaria đang kiểm tra thông tin đơn hàng', time: 'Đang xử lý', completed: false },
      { title: 'Đang vận chuyển', description: 'Chờ bàn giao cho đối tác vận chuyển', time: '', completed: false },
      { title: 'Giao hàng thành công', description: 'Dự kiến giao hàng sau 2-3 ngày', time: '', completed: false },
    ],
  },
  {
    id: 'order-4',
    orderCode: '#LN-332211',
    date: '02/05/2026',
    status: 'CANCELLED',
    items: [
      {
        id: 'item-5',
        name: 'Serum Phục Hồi B5 Lunaria',
        image: 'product-1.jpg',
        price: 450000,
        quantity: 1,
        variant: '30ml',
      },
    ],
    totalAmount: 450000,
    shippingFee: 30000,
    discountAmount: 0,
    paymentMethod: 'Thanh toán qua Momo',
    paymentStatus: 'UNPAID',
    shippingAddress: {
      fullName: 'Khách hàng Lunaria',
      phone: '0988777666',
      address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    },
    trackingSteps: [
      { title: 'Đơn hàng đã đặt', description: 'Đơn hàng đã được đặt thành công trên hệ thống', time: '02/05/2026 10:00', completed: true },
      { title: 'Đã hủy', description: 'Đơn hàng đã được hủy theo yêu cầu của khách hàng', time: '02/05/2026 11:30', completed: true },
    ],
  },
];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>(() => {
    try {
      const saved = localStorage.getItem('lunaria_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return initialOrdersData;
  });

  const [activeTab, setActiveTab] = useState<OrderStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('lunaria_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const handleCancelOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          return {
            ...order,
            status: 'CANCELLED',
            trackingSteps: [
              ...order.trackingSteps.filter((s) => s.title !== 'Đã hủy'),
              { title: 'Đã hủy', description: 'Đơn hàng đã được hủy thành công', time: 'Vừa xong', completed: true },
            ],
          };
        }
        return order;
      })
    );
    message.success('Đã hủy đơn hàng thành công');
  };

  const handleReorder = (order: OrderData) => {
    message.success(`Đã thêm ${order.items.length} sản phẩm vào giỏ hàng`);
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab !== 'ALL' && order.status !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = order.orderCode.toLowerCase().includes(q);
      const matchItem = order.items.some((item) => item.name.toLowerCase().includes(q));
      return matchCode || matchItem;
    }
    return true;
  });

  return (
    <div className="orders-page-wrapper">
      <div className="orders-page-container">
        <div className="page-header">
          <h1>Đơn mua của tôi</h1>
          <p>Quản lý, theo dõi trạng thái và chi tiết các đơn hàng bạn đã đặt tại Lunaria</p>
        </div>

        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} orders={orders} />

        <OrderSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div className="orders-list-content">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancelOrder={handleCancelOrder}
                onReorder={handleReorder}
              />
            ))
          ) : (
            <div className="empty-orders-container">
              <div className="empty-icon">📦</div>
              <h3>Không tìm thấy đơn hàng nào</h3>
              <p>Bạn chưa có đơn hàng nào thuộc trạng thái hoặc từ khóa tìm kiếm này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
