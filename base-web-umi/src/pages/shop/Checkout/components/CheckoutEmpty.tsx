import React from 'react';
import { Link, history } from 'umi';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const CheckoutEmpty: React.FC = () => (
  <div className="checkout-empty">
    <ShoppingCartOutlined className="checkout-empty__icon" />
    <h2>Giỏ hàng trống</h2>
    <p>Bạn cần thêm sản phẩm trước khi tiến hành thanh toán.</p>
    <div className="checkout-empty__actions">
      <Link to="/products" className="checkout-empty__primary">
        Khám phá sản phẩm
      </Link>
      <button type="button" className="checkout-empty__secondary" onClick={() => history.push('/cart')}>
        <ArrowLeftOutlined /> Quay lại giỏ hàng
      </button>
    </div>
  </div>
);

export default CheckoutEmpty;
