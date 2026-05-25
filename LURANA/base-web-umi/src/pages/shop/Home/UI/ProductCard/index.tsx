import React, { useState } from 'react';
import { history } from 'umi';
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

  const handleCardClick = () => {
    if (id) {
      history.push(`/products/${id}`);
    }
  };

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <div 
        className={styles.wishlistIcon} 
        onClick={(e) => {
          e.stopPropagation();
          setIsWishlist(!isWishlist);
        }}
      >
        {isWishlist ? <HeartFilled style={{ color: '#ff8e73' }} /> : <HeartOutlined />}
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