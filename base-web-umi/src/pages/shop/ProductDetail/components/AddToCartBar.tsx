import React, { useState, useEffect } from 'react';
import { StarFilled } from '@ant-design/icons';
import { message } from 'antd';
import { history } from 'umi';
import useCart from '@/hooks/useCart';
import { formatPrice, formatWeight, VariantViewModel } from '../utils';

interface AddToCartBarProps {
  productId: string;
  productName: string;
  sku?: string;
  rating?: number;
  mainImage?: string;
  variants?: VariantViewModel[];
}

const AddToCartBar: React.FC<AddToCartBarProps> = ({
  productId,
  productName,
  sku = '',
  rating = 5.0,
  mainImage = '',
  variants = [],
}) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const activeVariant = variants[selectedVariantIdx] || variants[0];
  const priceSell = activeVariant?.priceSell ?? 0;
  const originalPrice = activeVariant?.originalPrice ?? 0;
  const availableQty = activeVariant?.availableQty ?? activeVariant?.stockQty ?? 0;
  const hasDiscount = originalPrice > priceSell && priceSell > 0;
  const outOfStock = !activeVariant || availableQty <= 0;

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariantIdx, productId]);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (outOfStock) return;
    const maxQty = availableQty > 0 ? availableQty : 99;
    if (quantity < maxQty) setQuantity(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const maxQty = availableQty > 0 ? availableQty : 99;
    if (!isNaN(val) && val > 0) {
      setQuantity(Math.min(val, maxQty));
    } else if (e.target.value === '') {
      setQuantity(1);
    }
  };

  const handleAddToCart = async () => {
    if (outOfStock) {
      message.warning('Biến thể này đã hết hàng');
      return;
    }

    const ok = await addItem({
      productId,
      variantName: activeVariant?.variantName || 'Mặc định',
      quantity,
    });

    if (ok) {
      message.success(`Đã thêm ${quantity} × ${activeVariant?.variantName} vào giỏ hàng!`);
    }
  };

  const handleBuyNow = async () => {
    if (outOfStock) {
      message.warning('Biến thể này đã hết hàng');
      return;
    }

    const ok = await addItem({
      productId,
      variantName: activeVariant?.variantName || 'Mặc định',
      quantity,
    });

    if (ok) {
      history.push('/cart');
    }
  };

  const getStockLabel = (variant: VariantViewModel) => {
    const qty = variant.availableQty ?? variant.stockQty;
    if (qty <= 0) return { text: 'Hết hàng', tone: 'danger' as const };
    if (qty <= 5) return { text: `Còn ${qty}`, tone: 'warning' as const };
    return { text: `Còn ${qty}`, tone: 'success' as const };
  };

  return (
    <div className="product-info-summary">
      <h1 className="product-title">{productName}</h1>
      <div className="product-sku">SKU: {sku || '—'}</div>

      <div className="product-rating">
        <StarFilled className="star-icon" />
        <span className="rating-val">{Number(rating).toFixed(1)}</span>
      </div>

      <div className="product-price-row">
        <div className="product-price">{formatPrice(priceSell)}</div>
        {hasDiscount && (
          <div className="product-price-old">{formatPrice(originalPrice)}</div>
        )}
      </div>

      {variants.length > 0 && (
        <div className="variant-selector">
          <div className="variant-selector__head">
            <span className="variant-label">Chọn biến thể</span>
            <span className="variant-count">{variants.length} lựa chọn</span>
          </div>
          <div className="variant-card-list">
            {variants.map((v, idx) => {
              const stock = getStockLabel(v);
              const isSelected = selectedVariantIdx === idx;
              const variantDiscount = v.originalPrice && v.originalPrice > v.priceSell;

              return (
                <button
                  key={`${v.variantName}-${idx}`}
                  type="button"
                  className={`variant-card ${isSelected ? 'is-active' : ''} ${stock.tone === 'danger' ? 'is-disabled' : ''}`}
                  onClick={() => setSelectedVariantIdx(idx)}
                  disabled={stock.tone === 'danger'}
                >
                  <div className="variant-card__top">
                    <span className="variant-card__name">{v.variantName}</span>
                    <span className={`variant-card__stock variant-card__stock--${stock.tone}`}>
                      {stock.text}
                    </span>
                  </div>
                  <div className="variant-card__price">{formatPrice(v.priceSell)}</div>
                  {variantDiscount && (
                    <div className="variant-card__price-old">{formatPrice(v.originalPrice)}</div>
                  )}
                  <div className="variant-card__meta">
                    <span>Khối lượng: {formatWeight(v.weight)}</span>
                    <span>Tồn: {v.stockQty}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeVariant && (
        <div className="selected-variant-summary">
          <span>Đã chọn:</span>
          <strong>{activeVariant.variantName}</strong>
          <em>{formatWeight(activeVariant.weight)}</em>
        </div>
      )}

      <div className={`stock-status ${outOfStock ? 'is-danger' : 'is-success'}`}>
        {outOfStock ? 'Hết hàng' : `Còn hàng: ${availableQty}`}
      </div>

      <div className="quantity-row">
        <span className="quantity-row__label">Số lượng</span>
        <div className="quantity-selector-wrapper">
          <button type="button" className="qty-btn minus" onClick={handleDecrease} disabled={quantity <= 1 || outOfStock}>-</button>
          <input
            type="text"
            className="qty-input"
            value={quantity}
            onChange={handleInputChange}
            disabled={outOfStock}
          />
          <button type="button" className="qty-btn plus" onClick={handleIncrease} disabled={outOfStock}>+</button>
        </div>
      </div>

      <div className="action-buttons-group">
        <button type="button" className="btn-add-to-cart" onClick={handleAddToCart} disabled={outOfStock}>
          Thêm vào giỏ
        </button>
        <button type="button" className="btn-buy-now" onClick={handleBuyNow} disabled={outOfStock}>
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default AddToCartBar;
