import React from 'react';
import { OrderItem } from '../../Orders/types';

interface OrderItemListProps {
  items: OrderItem[];
}

const OrderItemList: React.FC<OrderItemListProps> = ({ items }) => {
  const getImg = (name: string) => {
    try {
      return require(`@/assets/images/${name}`);
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="order-items-detail-card">
      <div className="card-header-title">
        <h3>Sản phẩm trong đơn hàng</h3>
      </div>

      <div className="items-table-container">
        <table className="detail-items-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="product-col-info">
                    <img src={getImg(item.image)} alt={item.name} className="p-img" />
                    <div className="p-details">
                      <h4 className="p-name">{item.name}</h4>
                      {item.variant && <span className="p-variant">Phân loại: {item.variant}</span>}
                    </div>
                  </div>
                </td>
                <td className="price-col">{item.price.toLocaleString('vi-VN')}đ</td>
                <td className="qty-col">{item.quantity}</td>
                <td className="subtotal-col">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderItemList;
