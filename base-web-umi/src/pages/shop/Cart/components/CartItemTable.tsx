import React from 'react';
import { Link } from 'umi';
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  PictureOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { CartItem } from '../types';
import { formatPrice, getCartItemKey, resolveImageUrl } from '@/services/GioHang/cart.utils';

interface CartItemListProps {
  items: CartItem[];
  updatingKey: string | null;
  onIncrease: (item: CartItem) => void;
  onDecrease: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onClear: () => void;
  clearing?: boolean;
}

const CartItemList: React.FC<CartItemListProps> = ({
  items,
  updatingKey,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  clearing = false,
}) => {
  return (
    <div className="cart-items-section">
      <div className="cart-items-section__head">
        <h2>Sản phẩm trong giỏ</h2>
        <span>{items.length} mặt hàng</span>
      </div>

      <div className="cart-item-list">
        {items.map((item) => {
          const key = getCartItemKey(item.productId, item.variantName);
          const isUpdating = updatingKey === key || updatingKey === '__clear__';
          const hasDiscount =
            item.originalPrice != null &&
            item.originalPrice > item.priceSell &&
            item.priceSell > 0;
          const atMax = item.quantity >= item.stockQty;

          return (
            <article key={key} className={`cart-item-row ${isUpdating ? 'is-updating' : ''}`}>
              <Link to={`/products/${item.productId}`} className="cart-item-row__media">
                {item.mainImage ? (
                  <img src={resolveImageUrl(item.mainImage)} alt={item.name} loading="lazy" />
                ) : (
                  <span className="cart-item-row__no-img">
                    <PictureOutlined />
                    <em>NO IMG</em>
                  </span>
                )}
              </Link>

              <div className="cart-item-row__body">
                <Link to={`/products/${item.productId}`} className="cart-item-row__name">
                  {item.name}
                </Link>
                <p className="cart-item-row__variant">Biến thể: {item.variantName}</p>
                <div className="cart-item-row__price-mobile">
                  {formatPrice(item.priceSell)}
                  {hasDiscount && (
                    <del>{formatPrice(item.originalPrice)}</del>
                  )}
                </div>
              </div>

              <div className="cart-item-row__unit">
                <span className="cart-item-row__unit-label">Đơn giá</span>
                <strong>{formatPrice(item.priceSell)}</strong>
                {hasDiscount && <del>{formatPrice(item.originalPrice)}</del>}
              </div>

              <div className="cart-item-row__qty">
                <span className="cart-item-row__unit-label">Số lượng</span>
                <div className="qty-wrapper">
                  <button
                    type="button"
                    aria-label="Giảm số lượng"
                    disabled={isUpdating || item.quantity <= 1}
                    onClick={() => onDecrease(item)}
                  >
                    <MinusOutlined />
                  </button>
                  <span className="qty-value">
                    {isUpdating ? <LoadingOutlined spin /> : item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Tăng số lượng"
                    disabled={isUpdating || atMax}
                    onClick={() => onIncrease(item)}
                  >
                    <PlusOutlined />
                  </button>
                </div>
                {atMax && item.stockQty > 0 && (
                  <em className="cart-item-row__stock-hint">Tối đa {item.stockQty}</em>
                )}
              </div>

              <div className="cart-item-row__line-total">
                <span className="cart-item-row__unit-label">Thành tiền</span>
                <strong>{formatPrice(item.lineTotal)}</strong>
              </div>

              <button
                type="button"
                className="cart-item-row__remove"
                title="Xóa sản phẩm"
                disabled={isUpdating}
                onClick={() => onRemove(item)}
              >
                <DeleteOutlined />
              </button>
            </article>
          );
        })}
      </div>

      <div className="cart-footer-actions">
        <Link to="/products" className="continue-shopping">
          ← Tiếp tục mua sắm
        </Link>
        <button type="button" className="clear-cart" onClick={onClear} disabled={clearing}>
          {clearing ? <LoadingOutlined spin /> : 'Xóa toàn bộ giỏ hàng'}
        </button>
      </div>
    </div>
  );
};

export default CartItemList;
