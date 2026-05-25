import React, { useState } from 'react';
import { Link, history } from 'umi';
import { message } from 'antd';
import CartItemTable from './components/CartItemTable';
import OrderSummary from './components/OrderSummary';
import EmptyCart from './components/EmptyCart';
import { CartItem } from './types';
import './index.less';

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([
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

  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState(0);

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return { ...item, qty: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    message.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const clearCart = () => {
    setItems([]);
    message.success('Đã làm sạch giỏ hàng');
  };

  const handleApplyVoucher = () => {
    if (!voucher.trim()) {
      message.warning('Vui lòng nhập mã giảm giá');
      return;
    }
    if (voucher.toUpperCase() === 'LUNARIA20') {
      setDiscount(50000);
      message.success('Áp dụng mã giảm giá LUNARIA20 thành công (Giảm 50,000đ)');
    } else {
      message.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }
  };

  const handleCheckout = () => {
    history.push('/checkout');
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingFee = subtotal > 500000 || subtotal === 0 ? 0 : 30000;
  const total = Math.max(0, subtotal + shippingFee - discount);

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Breadcrumb */}
        <div className="cart-breadcrumb">
          <Link to="/home">Home</Link>
          <span>›</span>
          <span className="current">Giỏ hàng của bạn</span>
        </div>

        {/* Header */}
        <div className="cart-header">
          <h1>Giỏ hàng của bạn <span>({items.length} sản phẩm)</span></h1>
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="cart-content-grid">
            <CartItemTable
              items={items}
              updateQty={updateQty}
              removeItem={removeItem}
              clearCart={clearCart}
            />

            <OrderSummary
              subtotal={subtotal}
              shippingFee={shippingFee}
              discount={discount}
              total={total}
              voucher={voucher}
              setVoucher={setVoucher}
              handleApplyVoucher={handleApplyVoucher}
              handleCheckout={handleCheckout}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
