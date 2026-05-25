import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { history } from 'umi';
import request from '../../../../utils/request';
import { getImg } from '../utils';
import ProductCard from '../UI/ProductCard';
import styles from '../UI/ProductCard/index.module.less';

const BestSellerSection: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const fetchTopProducts = async () => {
      try {
        const response = await request('/api/products', {
          method: 'GET',
          params: { page: 1, limit: 8 },
        });
        
        if (response && response.data && response.data.length > 0) {
          setProducts(response.data);
        } else {
          const mockData = [1, 2, 3, 4, 5, 6, 7, 8].map((item) => ({
            _id: String(item),
            name: `Sản phẩm mẫu ${item}`,
            variants: [{ priceSell: 320000 }],
            images: [`anh-san-pham-${item}.png`],
            rating: item === 1 ? 5.0 : undefined,
          }));
          setProducts(mockData);
        }
      } catch (error) {
        const mockData = [1, 2, 3, 4, 5, 6, 7, 8].map((item) => ({
          _id: String(item),
          name: `Sản phẩm lỗi kết nối ${item}`,
          variants: [{ priceSell: 320000 }],
          images: [`anh-san-pham-${item}.png`],
          rating: item === 1 ? 5.0 : undefined,
        }));
        setProducts(mockData);
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

  const getDisplayPrice = (variants: any[]) => {
    if (!variants || variants.length === 0) return '320,000đ';
    const prices = variants.map(v => v.priceSell).filter(p => p !== undefined);
    if (prices.length === 0) return '320,000đ';
    const minPrice = Math.min(...prices);
    return `${minPrice.toLocaleString('vi-VN')}đ`;
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
        ) : (
          <Row gutter={[24, 24]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={6} lg={6} key={product._id}>
                <ProductCard
                  id={product._id}
                  img={product.images && product.images.length > 0 ? product.images[0] : 'anh-san-pham-1.png'}
                  name={product.name}
                  price={getDisplayPrice(product.variants)}
                  rating={product.rating} 
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </section>
  );
};

export default BestSellerSection;