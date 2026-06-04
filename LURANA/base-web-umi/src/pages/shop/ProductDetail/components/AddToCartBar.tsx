import React, { useState } from 'react';
import { StarFilled } from '@ant-design/icons';
import { message } from 'antd';
import { history } from 'umi';

interface AddToCartBarProps {
  productName?: string;
  sku?: string;
  rating?: number;
  price?: string;
}

const AddToCartBar: React.FC<AddToCartBarProps> = ({
  productName = 'CC+ Cream Illumination with SPF 50+',
  sku = 'CS-0005-1',
  rating = 5.0,
  price = '430,000đ',
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      setQuantity(val);
    } else if (e.target.value === '') {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    try {
      const stored = localStorage.getItem('lunaria_cart_items');
      const cartItems: any[] = stored ? JSON.parse(stored) : [];
      const priceNum = parseInt(price.replace(/[^0-9]/g, ''), 10);
      const existingIdx = cartItems.findIndex((item) => item.name === productName);
      
      if (existingIdx > -1) {
        cartItems[existingIdx].qty += quantity;
      } else {
        cartItems.push({
          id: Date.now(),
          name: productName,
          variant: 'Mặc định',
          price: priceNum,
          qty: quantity,
          img: 'anh-san-pham-1.png',
        });
      }
      
      localStorage.setItem('lunaria_cart_items', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cartUpdate'));
      message.success(`Đã thêm ${quantity} sản phẩm "${productName}" vào giỏ hàng!`);
    } catch (e) {
      message.error('Lỗi khi thêm sản phẩm vào giỏ hàng');
    }
  };

  const handleBuyNow = () => {
    try {
      const stored = localStorage.getItem('lunaria_cart_items');
      const cartItems: any[] = stored ? JSON.parse(stored) : [];
      const priceNum = parseInt(price.replace(/[^0-9]/g, ''), 10);
      const existingIdx = cartItems.findIndex((item) => item.name === productName);
      
      if (existingIdx > -1) {
        cartItems[existingIdx].qty += quantity;
      } else {
        cartItems.push({
          id: Date.now(),
          name: productName,
          variant: 'Mặc định',
          price: priceNum,
          qty: quantity,
          img: 'anh-san-pham-1.png',
        });
      }
      
      localStorage.setItem('lunaria_cart_items', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cartUpdate'));
      history.push('/cart');
    } catch (e) {
      message.error('Lỗi xảy ra');
    }
  };

  return (
    <div className="product-info-summary">
      <h1 className="product-title">{productName}</h1>
      <div className="product-sku">SKU: {sku}</div>
      
      <div className="product-rating">
        <StarFilled className="star-icon" />
        <span className="rating-val">{rating.toFixed(1)}</span>
      </div>

      <div className="product-price">{price}</div>

      {/* Quantity Selector */}
      <div className="quantity-selector-wrapper">
        <button className="qty-btn minus" onClick={handleDecrease}>-</button>
        <input 
          type="text" 
          className="qty-input" 
          value={quantity} 
          onChange={handleInputChange} 
        />
        <button className="qty-btn plus" onClick={handleIncrease}>+</button>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-group">
        <button className="btn-add-to-cart" onClick={handleAddToCart}>
          Thêm vào giỏ
        </button>
        <button className="btn-buy-now" onClick={handleBuyNow}>
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default AddToCartBar;