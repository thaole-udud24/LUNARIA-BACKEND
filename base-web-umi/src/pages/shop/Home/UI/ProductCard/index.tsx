import React, { useState } from 'react';
import { history } from 'umi';
import { message } from 'antd';
import { HeartOutlined, HeartFilled, StarFilled, PictureOutlined } from '@ant-design/icons';
import useCart from '@/hooks/useCart';
import { resolveProductImageUrl } from '../../utils';
import styles from './index.module.less';

interface ProductCardProps {
  id: string;
  img: string;
  name: string;
  price: string;
  rating?: number;
  variantName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  img,
  name,
  price,
  rating,
  variantName,
}) => {
  const { addItem } = useCart();
  const [isWishlist, setIsWishlist] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imageSrc = resolveProductImageUrl(img);

  const handleCardClick = () => {
    if (id) {
      history.push(`/products/${id}`);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!variantName) {
      message.info('Vui lòng chọn biến thể tại trang chi tiết sản phẩm');
      history.push(`/products/${id}`);
      return;
    }

    const ok = await addItem({ productId: id, variantName, quantity: 1 });
    if (ok) {
      message.success(`Đã thêm sản phẩm "${name}" vào giỏ hàng!`);
      setIsWishlist(true);
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
        {isWishlist || hovered ? <HeartFilled /> : <HeartOutlined />}
      </div>
      <div className={styles.imageWrapper}>
        {imageSrc && !imgError ? (
          <img src={imageSrc} alt={name} loading="lazy" onError={() => setImgError(true)} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <PictureOutlined />
          </div>
        )}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.productName}>{name}</h3>
        <div className={styles.priceRow}>
          <span className={styles.price}>{price}</span>
          {rating && (
            <span className={styles.rating}>
              <StarFilled /> {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
