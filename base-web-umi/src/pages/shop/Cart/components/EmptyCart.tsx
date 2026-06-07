import React from 'react';
import { Link, history } from 'umi';
import {
  ShoppingCartOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

interface EmptyCartProps {
  isGuest?: boolean;
}

const EmptyCart: React.FC<EmptyCartProps> = ({ isGuest = false }) => {
  return (
    <div className="empty-cart-state">
      <div className="empty-icon">
        <ShoppingCartOutlined />
      </div>
      <h2>{isGuest ? 'Đăng nhập để xem giỏ hàng' : 'Giỏ hàng của bạn đang trống'}</h2>
      <p>
        {isGuest
          ? 'Giỏ hàng được lưu trên tài khoản của bạn. Hãy đăng nhập để thêm sản phẩm và thanh toán.'
          : 'Bạn chưa có sản phẩm nào trong giỏ. Khám phá bộ sưu tập mỹ phẩm LURANA ngay nhé!'}
      </p>
      <div className="empty-cart-state__actions">
        {isGuest ? (
          <button
            type="button"
            className="shop-now-btn"
            onClick={() => history.push('/auth/login')}
          >
            <UserOutlined /> Đăng nhập ngay
          </button>
        ) : (
          <Link to="/products" className="shop-now-btn">
            Khám phá sản phẩm
          </Link>
        )}
        <Link to="/products" className="empty-cart-state__secondary">
          <ArrowLeftOutlined /> Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
