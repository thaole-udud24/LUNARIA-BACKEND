import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { StarFilled, PictureOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { getProducts } from '@/services/SanPham/products.customer.api';
import {
  formatPrice,
  getProductId,
  getSkinTypeNames,
  parseApiData,
  resolveImageUrl,
} from '../utils';

interface RelatedProductsProps {
  currentProductId: string;
  categoryName?: string;
  skinTypeNames?: string[];
}

const hasSharedSkinType = (product: any, skinNames: string[]) => {
  if (!skinNames.length) return false;
  const productSkins = getSkinTypeNames(product).map((n) => n.toLowerCase());
  return skinNames.some((name) => productSkins.includes(name.toLowerCase()));
};

const hasSameCategory = (product: any, categoryName: string) => {
  if (!categoryName) return false;
  const cat = (product?.category?.name || product?.category || '').toLowerCase();
  return cat === categoryName.toLowerCase() || cat.includes(categoryName.toLowerCase());
};

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  categoryName = '',
  skinTypeNames = [],
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchType, setMatchType] = useState<'skin' | 'category' | 'other'>('other');

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      try {
        const res = await getProducts({ limit: 50 });
        const parsed = parseApiData<any>(res);
        const items = Array.isArray(parsed) ? parsed : (parsed?.data || []);
        const others = items.filter((p) => getProductId(p) !== currentProductId);

        const bySkin = others.filter((p) => hasSharedSkinType(p, skinTypeNames)).slice(0, 4);
        if (bySkin.length > 0) {
          setProducts(bySkin);
          setMatchType('skin');
          return;
        }

        const byCategory = others.filter((p) => hasSameCategory(p, categoryName)).slice(0, 4);
        if (byCategory.length > 0) {
          setProducts(byCategory);
          setMatchType('category');
          return;
        }

        setProducts(others.slice(0, 4));
        setMatchType('other');
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [currentProductId, categoryName, skinTypeNames.join('|')]);

  if (loading) {
    return (
      <div className="related-products-section related-products-section--loading">
        <Spin tip="Đang tải sản phẩm liên quan..." />
      </div>
    );
  }

  if (products.length === 0) return null;

  const subtitle =
    matchType === 'skin'
      ? 'cùng loại da'
      : matchType === 'category'
        ? 'cùng danh mục'
        : 'phù hợp với bạn';

  return (
    <div className="related-products-section">
      <div className="section-header">
        <h2>
          Sản phẩm <span>{subtitle}</span>
        </h2>
        <a href="/products" className="view-more-link" onClick={(e) => { e.preventDefault(); history.push('/products'); }}>Xem thêm</a>
      </div>

      <div className="related-grid">
        {products.map((p) => {
          const pid = getProductId(p);
          const price = p?.variants?.[0]?.priceSell ?? 0;
          const img = p.mainImage || p.images?.[0];
          const skinLabel = getSkinTypeNames(p)[0];

          return (
            <article
              key={pid}
              className="related-card"
              onClick={() => history.push(`/products/${pid}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && history.push(`/products/${pid}`)}
            >
              <div className="related-card__media">
                {img ? (
                  <img src={resolveImageUrl(img)} alt={p.name} loading="lazy" />
                ) : (
                  <div className="no-img-placeholder no-img-placeholder--compact">
                    <PictureOutlined />
                    <span>NO IMG</span>
                  </div>
                )}
              </div>
              <div className="related-card__body">
                {skinLabel && <span className="related-card__tag">{skinLabel}</span>}
                <h4>{p.name}</h4>
                <div className="related-card__footer">
                  <span className="related-card__price">{formatPrice(price)}</span>
                  <span className="related-card__rating">
                    <StarFilled /> {p.rating || '5.0'}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
