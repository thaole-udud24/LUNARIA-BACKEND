import React, { useEffect, useState } from 'react';
import { Spin, Empty } from 'antd';
import { history } from 'umi';
import {
  getBestSellingProducts,
  getProducts,
} from '@/services/SanPham/products.customer.api';
import { getProductImageFromApi } from '../utils';
import ProductCard from '../UI/ProductCard';
import styles from '../UI/ProductCard/index.module.less';

const ROW_LIMIT = 4;

const parseProductList = (res: any): any[] => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const mergeUniqueProducts = (primary: any[], secondary: any[], limit: number) => {
  const seen = new Set<string>();
  const merged: any[] = [];

  [...primary, ...secondary].forEach((product) => {
    if (merged.length >= limit) return;
    const id = product?._id || product?.id;
    if (!id || seen.has(id) || product?.isActive === false) return;
    seen.add(id);
    merged.push(product);
  });

  return merged;
};

const getDisplayPrice = (variants: any[] = []) => {
  if (!variants.length) return 'Liên hệ';
  const prices = variants.map((v) => v.priceSell).filter((p) => p != null && p > 0);
  if (!prices.length) return 'Liên hệ';
  return `${Math.min(...prices).toLocaleString('vi-VN')}đ`;
};

const BestSellerSection: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const fetchTopProducts = async () => {
      try {
        const [bestRes, allRes] = await Promise.all([
          getBestSellingProducts(ROW_LIMIT),
          getProducts({ limit: ROW_LIMIT }),
        ]);
        const bestList = parseProductList(bestRes);
        const allList = parseProductList(allRes);
        setProducts(mergeUniqueProducts(bestList, allList, ROW_LIMIT));
      } catch (error) {
        console.error('Không tải được sản phẩm bán chạy:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const handleViewMore = (e: React.MouseEvent) => {
    e.preventDefault();
    history.push('/products');
  };

  return (
    <section className={styles.bestSellerSection}>
      <div className={styles.containerBox}>
        <div className={styles.headerWrapper}>
          <div className={styles.titleContainer}>
            <h2 className={styles.sectionTitle}>Sản phẩm bán chạy</h2>
          </div>
          <a href="/products" onClick={handleViewMore} className={styles.viewMoreLink}>
            Xem thêm
          </a>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Spin size="large" style={{ color: '#ff8e73' }} />
          </div>
        ) : products.length === 0 ? (
          <Empty description="Chưa có sản phẩm" style={{ padding: '40px 0' }} />
        ) : (
          <div className={styles.productGrid}>
            {products.map((product) => {
              const id = product._id || product.id;
              const firstVariant = product.variants?.[0];
              return (
                <ProductCard
                  key={id}
                  id={id}
                  img={getProductImageFromApi(product)}
                  name={product.name}
                  price={getDisplayPrice(product.variants)}
                  rating={product.rating}
                  variantName={firstVariant?.variantName}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellerSection;
