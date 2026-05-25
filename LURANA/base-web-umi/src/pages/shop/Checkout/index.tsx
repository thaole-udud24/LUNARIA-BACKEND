import React, { useState } from 'react';
import { Link } from 'umi';
import { message } from 'antd';
import ShippingForm from './components/ShippingForm';
import PaymentMethods from './components/PaymentMethods';
import OrderSummaryCard from './components/OrderSummaryCard';
import OrderSuccessView from './components/OrderSuccessView';
import { OrderItem, ShippingInfo, PaymentMethodType } from './types';
import './index.less';

const Checkout: React.FC = () => {
  // Mock items from Cart
  const [items] = useState<OrderItem[]>([
    {
      id: 1,
      name: 'CC+ Cream Illumination with SPF 50+',
      variant: 'Tone Sáng (Light)',
      price: 430000,
      qty: 1,
      img: 'anh-san-pham-1.png',
    },
    {
      id: 2,
      name: 'Bye Bye Lines Foundation',
      variant: 'Tone Tự Nhiên (Medium)',
      price: 320000,
      qty: 2,
      img: 'anh-san-pham-2.png',
    },
    {
      id: 3,
      name: 'Sữa Rửa Mặt Sâm 1700',
      variant: 'Dành cho da nhạy cảm',
      price: 325000,
      qty: 1,
      img: 'anh-san-pham-3.png',
    },
  ]);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('COD');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleInfoChange = (field: keyof ShippingInfo, val: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: val }));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingFee = subtotal > 500000 || subtotal === 0 ? 0 : 30000;
  // Giả sử có áp dụng mã LUNARIA20 từ trước
  const discount = 50000;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const handleSubmitOrder = () => {
    if (!shippingInfo.fullName.trim()) {
      message.error('Vui lòng nhập họ và tên người nhận');
      return;
    }
    if (!shippingInfo.phone.trim()) {
      message.error('Vui lòng nhập số điện thoại liên hệ');
      return;
    }
    if (!shippingInfo.address.trim()) {
      message.error('Vui lòng nhập địa chỉ nhận hàng cụ thể');
      return;
    }

    message.loading({ content: 'Đang xử lý đơn hàng...', duration: 2 });
    setTimeout(() => {
      const randomId = '#LN-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(randomId);
      setIsSubmitted(true);
      message.success('Đặt hàng thành công!');
    }, 2000);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Breadcrumb */}
        {!isSubmitted && (
          <div className="checkout-breadcrumb">
            <Link to="/home">Home</Link>
            <span>›</span>
            <Link to="/cart">Giỏ hàng</Link>
            <span>›</span>
            <span className="current">Thanh toán</span>
          </div>
        )}

        {isSubmitted ? (
          <OrderSuccessView
            orderId={orderId}
            total={total}
            paymentMethod={paymentMethod}
            shippingInfo={shippingInfo}
          />
        ) : (
          <div className="checkout-content-grid">
            <div className="checkout-left-sections">
              <ShippingForm info={shippingInfo} onChange={handleInfoChange} />
              <PaymentMethods selected={paymentMethod} onSelect={setPaymentMethod} />
            </div>

            <div className="checkout-right-sections">
              <OrderSummaryCard
                items={items}
                subtotal={subtotal}
                shippingFee={shippingFee}
                discount={discount}
                total={total}
                onSubmit={handleSubmitOrder}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
