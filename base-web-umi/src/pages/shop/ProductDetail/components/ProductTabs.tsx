import React, { useState } from 'react';
import { StarFilled, UserOutlined } from '@ant-design/icons';
import { getCategoryLabel, getSkinTypeLabels, formatPrice, formatWeight } from '../utils';

interface ProductTabsProps {
  product: any;
}

const FAKE_REVIEWS = [
  {
    name: 'Nguyễn Phương Thảo',
    date: '15/05/2026',
    rating: 5,
    comment: (name: string) =>
      `${name} dùng rất thích, kết cấu mỏng nhẹ thấm nhanh, da căng mịn sau vài ngày. Sẽ mua lại!`,
  },
  {
    name: 'Trần Mai Anh',
    date: '10/05/2026',
    rating: 5,
    comment: () =>
      'Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm chính hãng, mùi thơm nhẹ, phù hợp da nhạy cảm.',
  },
  {
    name: 'Lê Hoàng Yến',
    date: '02/05/2026',
    rating: 4,
    comment: (name: string) =>
      `Chất lượng ${name} ổn trong tầm giá, da không bị kích ứng. Recommend cho bạn bè.`,
  },
];

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'info' | 'reviews'>('desc');

  const productName = product?.name || 'Sản phẩm';
  const description = product?.description || product?.detailInfo || '';
  const detailInfo = product?.detailInfo || '';
  const categoryName = getCategoryLabel(product);
  const skinLabels = getSkinTypeLabels(product);
  const variants = product?.variants || [];
  const avgRating = 4.8;
  const reviewCount = 12;

  return (
    <div className="product-tabs-section">
      <div className="tabs-nav">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
          onClick={() => setActiveTab('desc')}
        >
          Mô tả
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Thông tin sản phẩm
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Đánh giá
        </button>
      </div>

      <div className="tab-content-container">
        {activeTab === 'desc' && (
          <div className="tab-pane desc-pane animate-fade-in">
            {description ? (
              description.split('\n').filter(Boolean).map((line: string, idx: number) => (
                <p key={idx}>{line}</p>
              ))
            ) : (
              <>
                <p>
                  {productName} là sản phẩm chăm sóc da cao cấp từ Lunaria, được nghiên cứu
                  tối ưu cho làn da Việt, giúp dưỡng ẩm, phục hồi và bảo vệ da khỏi tác động môi trường.
                </p>
                <p>
                  Kết cấu mỏng nhẹ, thấm nhanh, không gây bít tắc lỗ chân lông. Phù hợp sử dụng
                  hàng ngày trong routine chăm sóc da.
                </p>
              </>
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="tab-pane info-pane animate-fade-in">
            <table className="product-info-table">
              <tbody>
                <tr>
                  <td className="info-label">Sản phẩm</td>
                  <td className="info-value">{productName}</td>
                </tr>
                <tr>
                  <td className="info-label">SKU</td>
                  <td className="info-value">{product?.sku || '—'}</td>
                </tr>
                <tr>
                  <td className="info-label">Danh mục</td>
                  <td className="info-value">{categoryName || '—'}</td>
                </tr>
                <tr>
                  <td className="info-label">Phân loại / Biến thể</td>
                  <td className="info-value">
                    {variants.length > 0 ? `${variants.length} biến thể` : '—'}
                  </td>
                </tr>
                {variants.length > 0 && (
                  <tr>
                    <td className="info-label">Chi tiết biến thể</td>
                    <td className="info-value">
                      <div className="variant-info-table">
                        {variants.map((v: any, idx: number) => (
                          <div className="variant-info-row" key={`${v.variantName}-${idx}`}>
                            <strong>{v.variantName}</strong>
                            <span>{formatPrice(v.priceSell)}</span>
                            <span>Còn {Math.max((v.stockQty ?? 0) - (v.reservedQty ?? 0), 0)}</span>
                            <span>{formatWeight(v.weight)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="info-label">Hình ảnh</td>
                  <td className="info-value">
                    1 ảnh chính
                    {Array.isArray(product?.galleryImages) && product.galleryImages.length > 0
                      ? ` + ${product.galleryImages.filter(Boolean).length} ảnh phụ`
                      : ''}
                  </td>
                </tr>
                <tr>
                  <td className="info-label">Quy cách mặc định</td>
                  <td className="info-value">{variants[0]?.variantName || '—'}</td>
                </tr>
                <tr>
                  <td className="info-label">Loại da phù hợp</td>
                  <td className="info-value">{skinLabels || 'Mọi loại da'}</td>
                </tr>
                {detailInfo && (
                  <tr>
                    <td className="info-label">Chi tiết</td>
                    <td className="info-value">{detailInfo}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="tab-pane reviews-pane animate-fade-in">
            <div className="reviews-summary">
              <div className="summary-left">
                <h3>{avgRating.toFixed(1)} / 5</h3>
                <div className="stars">
                  <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
                </div>
                <span>({reviewCount} bài đánh giá — dữ liệu mẫu)</span>
              </div>
            </div>

            <div className="reviews-list">
              {FAKE_REVIEWS.map((review, idx) => (
                <div className="review-item" key={idx}>
                  <div className="reviewer-avatar"><UserOutlined /></div>
                  <div className="review-details">
                    <div className="review-header">
                      <span className="reviewer-name">{review.name}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-stars">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <StarFilled key={i} />
                      ))}
                    </div>
                    <p className="review-comment">{review.comment(productName)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
