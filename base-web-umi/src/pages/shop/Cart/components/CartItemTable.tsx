import React from 'react';
import { Link } from 'umi';
import { DeleteOutlined } from '@ant-design/icons';
import { CartItem } from '../types';

const getImg = (name: string) => {
  try {
    return require(`@/assets/images/${name}`);
  } catch (err) {
    return '';
  }
};

interface CartItemTableProps {
  items: CartItem[];
  updateQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

const CartItemTable: React.FC<CartItemTableProps> = ({
  items,
  updateQty,
  removeItem,
  clearCart,
}) => {
  return (
    <div className="cart-items-section">
      <table className="cart-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="product-col">
                  <div className="product-img">
                    <img src={getImg(item.img)} alt={item.name} />
                  </div>
                  <div className="product-info">
                    <h3>{item.name}</h3>
                    <p>{item.variant}</p>
                  </div>
                </div>
              </td>
              <td className="price-col">{item.price.toLocaleString('vi-VN')}đ</td>
              <td className="qty-col">
                <div className="qty-wrapper">
                  <button onClick={() => updateQty(item.id, -1)}>-</button>
                  <input type="text" value={item.qty} readOnly />
                  <button onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
              </td>
              <td className="subtotal-col">{(item.price * item.qty).toLocaleString('vi-VN')}đ</td>
              <td className="action-col">
                <button className="delete-btn" onClick={() => removeItem(item.id)} title="Xóa sản phẩm">
                  <DeleteOutlined />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-footer-actions">
        <Link to="/products" className="continue-shopping">
          ← Tiếp tục mua sắm
        </Link>
        <button className="clear-cart" onClick={clearCart}>
          Xóa toàn bộ giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default CartItemTable;
