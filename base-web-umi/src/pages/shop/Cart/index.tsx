import React, { useMemo, useState } from 'react';
import { Link, history } from 'umi';
import { Modal, message } from 'antd';
import useCart from '@/hooks/useCart';
import { applyVoucher } from '@/services/DonHang/vouchers.customer.api';
import { extractApiError } from '@/services/GioHang/cart.utils';
import CartItemList from './components/CartItemTable';
import OrderSummary from './components/OrderSummary';
import EmptyCart from './components/EmptyCart';
import CartSkeleton from './components/CartSkeleton';
import {
  CHECKOUT_META_KEY,
  SHIPPING_FEE,
  SHIPPING_FREE_THRESHOLD,
  CartItem,
} from './types';
import { hasFlashSaleItems } from '../Checkout/utils';
import './index.less';

const Cart: React.FC = () => {
  const {
    items,
    loading,
    updatingKey,
    cartCount,
    isAuthenticated,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [voucher, setVoucher] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.lineTotal, 0),
    [items],
  );

  const shippingFee =
    subtotal > SHIPPING_FREE_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const handleIncrease = async (item: CartItem) => {
    if (item.quantity >= item.stockQty) {
      message.warning(`Chỉ còn ${item.stockQty} sản phẩm trong kho`);
      return;
    }
    await setQuantity(item.productId, item.variantName, item.quantity + 1);
  };

  const handleDecrease = async (item: CartItem) => {
    if (item.quantity <= 1) return;
    await setQuantity(item.productId, item.variantName, item.quantity - 1);
  };

  const handleRemove = async (item: CartItem) => {
    Modal.confirm({
      title: 'Xóa sản phẩm khỏi giỏ?',
      content: `Bạn có chắc muốn xóa "${item.name}" (${item.variantName})?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        const ok = await removeItem(item.productId, item.variantName);
        if (ok) message.success('Đã xóa sản phẩm khỏi giỏ hàng');
      },
    });
  };

  const handleClearCart = () => {
    Modal.confirm({
      title: 'Xóa toàn bộ giỏ hàng?',
      content: 'Thao tác này không thể hoàn tác.',
      okText: 'Xóa tất cả',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        setClearing(true);
        const ok = await clearCart();
        setClearing(false);
        if (ok) {
          setDiscount(0);
          setAppliedVoucher('');
          setVoucher('');
          message.success('Đã làm sạch giỏ hàng');
        }
      },
    });
  };

  const handleApplyVoucher = async () => {
    const code = voucher.trim();
    if (!code) {
      message.warning('Vui lòng nhập mã voucher');
      return;
    }
    if (items.length === 0) {
      message.warning('Giỏ hàng trống, không thể áp dụng voucher');
      return;
    }

    setVoucherLoading(true);
    try {
      const productIds = items.map((item) => item.productId);
      const result = await applyVoucher({
        voucherCode: code,
        cartTotal: subtotal,
        productIds,
        hasDirectDiscount: hasFlashSaleItems(items),
      });
      setDiscount(result.discountAmount || 0);
      setAppliedVoucher(result.voucherCode || code.toUpperCase());
      message.success(result.message || 'Áp dụng voucher thành công');
    } catch (error) {
      setDiscount(0);
      setAppliedVoucher('');
      message.error(await extractApiError(error));
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      message.warning('Giỏ hàng trống');
      return;
    }

    sessionStorage.setItem(
      CHECKOUT_META_KEY,
      JSON.stringify({
        voucherCode: appliedVoucher || undefined,
        discount,
        subtotal,
        shippingFee,
        total,
      }),
    );
    history.push('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-breadcrumb">
          <Link to="/home">Trang chủ</Link>
          <span>›</span>
          <span className="current">Giỏ hàng</span>
        </div>

        <div className="cart-header">
          <h1>
            Giỏ hàng của bạn
            {!loading && isAuthenticated && (
              <span>({cartCount} sản phẩm)</span>
            )}
          </h1>
        </div>

        {loading ? (
          <CartSkeleton />
        ) : !isAuthenticated ? (
          <EmptyCart isGuest />
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="cart-content-grid">
            <CartItemList
              items={items}
              updatingKey={updatingKey}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
              onClear={handleClearCart}
              clearing={clearing}
            />

            <OrderSummary
              subtotal={subtotal}
              shippingFee={shippingFee}
              discount={discount}
              total={total}
              voucher={voucher}
              appliedVoucher={appliedVoucher}
              voucherLoading={voucherLoading}
              setVoucher={setVoucher}
              handleApplyVoucher={handleApplyVoucher}
              handleCheckout={handleCheckout}
              itemCount={cartCount}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
