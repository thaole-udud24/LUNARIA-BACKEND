import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Empty, Button } from 'antd';
import { useParams, history } from 'umi';
import Loading from '@/components/common/Loading';
import ShopNewsletter from '../Products/components/ShopNewsletter';
import ProductImages from './components/ProductImages';
import AddToCartBar from './components/AddToCartBar';
import ProductTabs from './components/ProductTabs';
import RelatedProducts from './components/RelatedProducts';
import { getProductById } from '@/services/SanPham/products.customer.api';
import {
  getCategoryLabel,
  getProductId,
  getSkinTypeNames,
  mapVariants,
  parseApiData,
} from './utils';
import './index.less';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const res = await getProductById(id);
      const data = parseApiData<any>(res);
      if (!data || !data.name) {
        setError(true);
        setProduct(null);
      } else {
        setProduct(data);
      }
    } catch (err) {
      console.error('Lỗi tải chi tiết sản phẩm:', err);
      setError(true);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [fetchProduct]);

  if (loading) return <Loading />;

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-container product-detail-empty">
          <Empty description="Không tìm thấy sản phẩm hoặc sản phẩm đã ngừng kinh doanh." />
          <Button type="primary" onClick={() => history.push('/products')}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const productId = getProductId(product);
  const categoryName = getCategoryLabel(product);
  const skinTypeNames = getSkinTypeNames(product);
  const variants = mapVariants(product.variants || []);

  return (
    <div className="product-detail-page">
      <div key={productId} className="product-detail-container animate-fade-in">
        <div className="product-breadcrumb">
          <span onClick={() => history.push('/products')}>Shop</span>
          <span>&gt;</span>
          {categoryName && (
            <>
              <span onClick={() => history.push('/products')}>{categoryName}</span>
              <span>&gt;</span>
            </>
          )}
          <span className="current">{product.name}</span>
        </div>

        <div className="product-main-overview">
          <Row gutter={[40, 32]} align="top">
            <Col xs={24} lg={11}>
              <div className="pd-media-card">
                <ProductImages
                  mainImage={product.mainImage}
                  galleryImages={product.galleryImages}
                />
              </div>
            </Col>
            <Col xs={24} lg={13}>
              <div className="pd-info-card">
                <AddToCartBar
                productId={productId}
                productName={product.name}
                sku={product.sku}
                rating={product.rating || 5.0}
                mainImage={product.mainImage}
                variants={variants}
              />
              </div>
            </Col>
          </Row>
        </div>

        <ProductTabs product={product} />

        <RelatedProducts
          currentProductId={productId}
          categoryName={categoryName}
          skinTypeNames={skinTypeNames}
        />
      </div>

      <ShopNewsletter />
    </div>
  );
};

export default ProductDetail;
