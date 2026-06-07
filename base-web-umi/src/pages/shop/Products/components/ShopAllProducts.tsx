import React, { useState, useEffect } from 'react';
import { Pagination, Select } from 'antd';
import {
  HeartFilled,
  HeartOutlined,
  StarFilled,
  LeftOutlined,
  RightOutlined,
  PictureOutlined,
  ArrowRightOutlined,
  InboxOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { resolveMediaUrl } from '@/utils/apiUrl';
import './ShopAllProducts.less';

interface ShopAllProductsProps {
  products: any[];
  pageSize?: number;
}

const GRID_SIZE = 9;

const hasValidImage = (p: any) => {
  const url = p.mainImage || p.images?.[0] || p.avatar_url || p.img;
  return Boolean(url && typeof url === 'string' && url.trim());
};

const getProductImage = (p: any) => {
  const raw = p.mainImage || p.images?.[0] || p.avatar_url || p.img || '';
  return resolveMediaUrl(raw) || '';
};

const getProductPrices = (p: any) => {
  const variant = p.variants?.[0];
  const sell = variant?.priceSell ?? p.price ?? 0;
  const original = variant?.originalPrice ?? 0;
  const hasDiscount = original > sell && sell > 0;
  const discountPercent = hasDiscount
    ? Math.round(((original - sell) / original) * 100)
    : 0;

  return {
    sell,
    original,
    hasDiscount,
    discountPercent,
    sellText: sell > 0 ? `${sell.toLocaleString('vi-VN')}đ` : 'Liên hệ',
    originalText: original > 0 ? `${original.toLocaleString('vi-VN')}đ` : '',
  };
};

const getProductId = (p: any) => p._id || p.id || '';

const getCategoryName = (p: any) =>
  p?.category?.name || p?.category || '';

const getSkinTypeLabels = (p: any) => {
  if (Array.isArray(p.skinTypes) && p.skinTypes.length > 0) {
    return p.skinTypes.map((s: any) => s?.name || s).filter(Boolean).join(', ');
  }
  if (p?.skinType?.name) return p.skinType.name;
  if (typeof p?.skinType === 'string') return p.skinType;
  return '';
};

const getStockInfo = (p: any) => {
  const variant = p.variants?.[0];
  const stock = variant?.stockQty ?? 0;
  if (stock <= 0) return { label: 'Hết hàng', tone: 'danger' as const };
  if (stock <= (variant?.stockAlert ?? 5)) return { label: `Còn ${stock}`, tone: 'warning' as const };
  return { label: 'Còn hàng', tone: 'success' as const };
};

const NoImagePlaceholder: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <div className={`no-img-placeholder ${compact ? 'no-img-placeholder--compact' : ''}`}>
    <PictureOutlined />
    <span>NO IMG</span>
  </div>
);

const HeartButton: React.FC = () => {
  const [active, setActive] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActive(!active);
  };

  return (
    <button
      type="button"
      className={`lunaria-card__wishlist ${active ? 'is-active' : ''}`}
      onClick={handleClick}
      aria-label="Yêu thích"
    >
      {active ? <HeartFilled /> : <HeartOutlined />}
    </button>
  );
};

const ProductImage: React.FC<{ product: any }> = ({ product }) => {
  const [broken, setBroken] = useState(false);
  const src = getProductImage(product);
  const showPlaceholder = !hasValidImage(product) || broken || !src;

  if (showPlaceholder) {
    return <NoImagePlaceholder />;
  }

  return (
    <img
      src={src}
      alt={product.name}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
};

const ShopAllProducts: React.FC<ShopAllProductsProps> = ({
  products = [],
  pageSize = GRID_SIZE,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length, limit]);

  const startIdx = (currentPage - 1) * limit;
  const pageProducts = products.slice(startIdx, startIdx + limit);
  const emptySlotsCount = Math.max(0, limit - pageProducts.length);

  const goToDetail = (pid: string) => {
    if (pid) history.push(`/products/${pid}`);
  };

  return (
    <div className="shop-all-products">
      <div className="lunaria-product-grid">
        {pageProducts.map((p) => {
          const pid = getProductId(p);
          const prices = getProductPrices(p);
          const categoryName = getCategoryName(p);
          const skinLabels = getSkinTypeLabels(p);
          const stockInfo = getStockInfo(p);
          const variant = p.variants?.[0];
          const isActive = p.isActive !== false;

          return (
            <article
              key={pid}
              className="lunaria-card"
              onClick={() => goToDetail(pid)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') goToDetail(pid);
              }}
            >
              <div className="lunaria-card__media">
                <span className={`lunaria-card__status lunaria-card__status--${isActive ? 'active' : 'inactive'}`}>
                  {isActive ? 'ĐANG BÁN' : 'NGỪNG BÁN'}
                </span>
                <HeartButton />
                <ProductImage product={p} />
                {categoryName && (
                  <span className="lunaria-card__category-tag">{categoryName}</span>
                )}
                {prices.hasDiscount && (
                  <span className="lunaria-card__discount">-{prices.discountPercent}%</span>
                )}
              </div>

              <div className="lunaria-card__content">
                <div className="lunaria-card__meta-row">
                  <div className="lunaria-card__brand">
                    <span className="lunaria-card__sku">{p.sku || 'LUNARIA'}</span>
                  </div>
                  <span className="lunaria-card__price-top">{prices.sellText}</span>
                </div>

                <h3 className="lunaria-card__title">{p.name}</h3>

                <div className="lunaria-card__details">
                  {variant?.variantName && (
                    <span className="lunaria-card__detail-item">
                      <InboxOutlined /> {variant.variantName}
                    </span>
                  )}
                  <span className={`lunaria-card__detail-item lunaria-card__detail-item--${stockInfo.tone}`}>
                    <TagOutlined /> {stockInfo.label}
                  </span>
                  {skinLabels && (
                    <span className="lunaria-card__detail-item lunaria-card__detail-item--skin">
                      {skinLabels}
                    </span>
                  )}
                </div>

                <div className="lunaria-card__footer">
                  <div className="lunaria-card__rating">
                    <StarFilled />
                    <span>{p.rating || '5.0'}</span>
                  </div>
                  <button
                    type="button"
                    className="lunaria-card__cta"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToDetail(pid);
                    }}
                  >
                    Xem chi tiết <ArrowRightOutlined />
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {Array.from({ length: emptySlotsCount }).map((_, index) => (
          <div key={`empty-${index}`} className="lunaria-card lunaria-card--empty">
            <div className="lunaria-card__media lunaria-card__media--empty">
              <NoImagePlaceholder compact />
            </div>
            <div className="lunaria-card__content lunaria-card__content--empty">
              <div className="empty-slot-line" />
              <div className="empty-slot-line empty-slot-line--short" />
              <div className="empty-slot-line empty-slot-line--btn" />
            </div>
          </div>
        ))}
      </div>

      {products.length > 0 && (
        <div className="lunaria-pagination">
          <div className="lunaria-pagination__summary">
            <span>Tổng số: <strong>{products.length}</strong></span>
          </div>

          <div className="lunaria-pagination__nav">
            <Pagination
              current={currentPage}
              total={products.length}
              pageSize={limit}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              itemRender={(page, type, originalElement) => {
                if (type === 'prev') {
                  return (
                    <button type="button" className="lunaria-pagination__arrow" aria-label="Trang trước">
                      <LeftOutlined />
                    </button>
                  );
                }
                if (type === 'next') {
                  return (
                    <button type="button" className="lunaria-pagination__arrow" aria-label="Trang sau">
                      <RightOutlined />
                    </button>
                  );
                }
                return originalElement;
              }}
            />
          </div>

          <Select
            value={limit.toString()}
            onChange={(val) => {
              setLimit(parseInt(val, 10));
              setCurrentPage(1);
            }}
            className="lunaria-pagination__size"
            dropdownClassName="lunaria-pagination__dropdown"
          >
            <Select.Option value="9">9 / trang</Select.Option>
            <Select.Option value="18">18 / trang</Select.Option>
            <Select.Option value="27">27 / trang</Select.Option>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ShopAllProducts;
