import React from 'react';
import { Link } from 'umi';
import { ShoppingCartOutlined } from '@ant-design/icons';

const EmptyCart: React.FC = () => {
  return (
    <div className="empty-cart-state">
      <div className="empty-icon">
        <ShoppingCartOutlined />
      </div>
      <h2>Giỏ hàng của bạn đang trống</h2>
      <p>Có vẻ như bạn chưa chọn sản phẩm nào. Hãy khám phá các dòng mỹ phẩm cao cấp của Lunaria ngay nhé!</p>
      <Link to="/products" className="shop-now-btn">
        Khám phá sản phẩm
      </Link>
    </div>
  );
};

export default EmptyCart;
