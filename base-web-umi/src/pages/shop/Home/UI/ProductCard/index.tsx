import React, { useState } from 'react';
import { history } from 'umi';
import { message } from 'antd';
import { HeartOutlined, HeartFilled, StarFilled } from '@ant-design/icons';
import { getImg } from '../../utils';
import styles from './index.module.less';

interface ProductCardProps {
  id: string;
  img: string;
  name: string;
  price: string;
  rating?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, img, name, price, rating }) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCardClick = () => {
    if (id) {
      history.push(`/products/${id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('lunaria_cart_items');
      const cartItems: any[] = stored ? JSON.parse(stored) : [];
      const priceNum = parseInt(price.replace(/[^0-9]/g, ''), 10);
      const existingIdx = cartItems.findIndex((item) => item.name === name);
      
      if (existingIdx > -1) {
        cartItems[existingIdx].qty += 1;
      } else {
        cartItems.push({
          id: Date.now(),
          name: name,
          variant: 'Mặc định',
          price: priceNum,
          qty: 1,
          img: img,
        });
      }
      
      localStorage.setItem('lunaria_cart_items', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cartUpdate'));
      message.success(`Đã thêm sản phẩm "${name}" vào giỏ hàng!`);
      setIsWishlist(true);
    } catch (err) {
      message.error('Lỗi khi thêm sản phẩm vào giỏ hàng');
    }
  };

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <div 
        className={styles.wishlistIcon} 
        onClick={handleAddToCart}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {isWishlist || hovered ? <HeartFilled style={{ color: '#ff8e73' }} /> : <HeartOutlined style={{ color: '#ffa78a' }} />}
      </div>
      
      {rating && (
        <div className={styles.ratingBadge}>
          <StarFilled style={{ color: '#ffb800' }} />
          <span>{rating.toFixed(1)}</span>
        </div>
      )}

      <div className={styles.imageWrapper}>
        <img src={img.startsWith('http') ? img : getImg(img)} alt={name} />
      </div>

      <div className={styles.productInfo}>
        <div className={styles.productName}>{name}</div>
        <div className={styles.productPrice}>{price}</div>
      </div>
    </div>
  );
};

export default ProductCard;