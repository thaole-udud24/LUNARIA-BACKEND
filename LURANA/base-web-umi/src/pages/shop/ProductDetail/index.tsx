import React, { useState } from 'react';
import { Row, Col } from 'antd';
import CategoryTabs from '../Products/components/CategoryTabs';
import ShopNewsletter from '../Products/components/ShopNewsletter';
import ProductImages from './components/ProductImages';
import AddToCartBar from './components/AddToCartBar';
import ProductTabs from './components/ProductTabs';
import RelatedProducts from './components/RelatedProducts';
import './index.less';

const ProductDetail: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const handleCategoryChange = (tab: string) => {
    setActiveCategory(tab);
    // Có thể chuyển hướng sang trang Products kèm tab nếu muốn
    // history.push(`/products?tab=${tab}`);
  };

  return (
    <div className="product-detail-page">
      {/* Category Tabs Bar */}
      <CategoryTabs activeTab={activeCategory} onTabChange={handleCategoryChange} />

      <div className="product-detail-container">
        {/* Breadcrumb */}
        <div className="product-breadcrumb">
          <span>Shop</span> &gt; <span>Làm sạch da</span> &gt; <span>Da nhạy cảm</span> &gt; <span className="current">CC+ Cream Illumination with SPF 50+</span>
        </div>

        {/* Main Product Info Section (Images + Summary/AddToCart) */}
        <div className="product-main-overview">
          <Row gutter={[48, 48]} align="top">
            {/* Left: Images Gallery */}
            <Col xs={24} md={12}>
              <ProductImages />
            </Col>

            {/* Right: Summary & Add to Cart */}
            <Col xs={24} md={12}>
              <AddToCartBar />
            </Col>
          </Row>
        </div>

        {/* Product Tabs (Description, Info, Reviews) */}
        <ProductTabs />

        {/* Related Products */}
        <RelatedProducts />
      </div>

      {/* Newsletter */}
      <ShopNewsletter />
    </div>
  );
};

export default ProductDetail;
