import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useParams, history } from 'umi';
import CategoryTabs from '../Products/components/CategoryTabs';
import Loading from '@/components/common/Loading';
import ShopNewsletter from '../Products/components/ShopNewsletter';
import ProductImages from './components/ProductImages';
import AddToCartBar from './components/AddToCartBar';
import ProductTabs from './components/ProductTabs';
import RelatedProducts from './components/RelatedProducts';
import './index.less';

const getProductById = (idStr?: string) => {
  const id = idStr ? parseInt(idStr, 10) : 1;
  const names = [
    'CC+ Cream Illumination with SPF 50+',
    'Bye Bye Lines Foundation',
    'Ceramide Hydrating Cream',
    'Vitamin C Brightening Serum',
    'Green Tea Foaming Cleanser',
    'Hyaluronic Acid Toner',
    'Daily SPF 50+ Sunscreen',
    'B5 Skin Recovery Gel',
    'Retinol Night Renewal Serum'
  ];
  
  const prices = [
    '430,000đ',
    '320,000đ',
    '450,000đ',
    '380,000đ',
    '280,000đ',
    '310,000đ',
    '390,000đ',
    '350,000đ',
    '480,000đ'
  ];

  const skus = [
    'CS-0005-1',
    'CS-0005-2',
    'CS-0005-3',
    'CS-0005-4',
    'CS-0005-5',
    'CS-0005-6',
    'CS-0005-7',
    'CS-0005-8',
    'CS-0005-9'
  ];

  // Map ID to an index in our arrays
  const index = isNaN(id) ? 0 : id % names.length;
  const name = names[index];
  const price = prices[index];
  const sku = skus[index];
  
  // Determine index of main image, cyclic between 1 and 8
  const mainImageIndex = isNaN(id) ? 1 : (id % 8) + 1;
  
  const images = [
    `anh-san-pham-${mainImageIndex}.png`,
    `anh-san-pham-${((mainImageIndex) % 8) + 1}.png`,
    `anh-san-pham-${((mainImageIndex + 1) % 8) + 1}.png`,
    `anh-san-pham-${((mainImageIndex + 2) % 8) + 1}.png`,
    `anh-san-pham-${((mainImageIndex + 3) % 8) + 1}.png`,
  ];

  return {
    id,
    name,
    price,
    sku,
    rating: 4.5 + (isNaN(id) ? 0 : id % 6) * 0.1,
    images
  };
};

const ProductDetail: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top instantly to simulate page load
    window.scrollTo(0, 0);
    
    // Simulate loading for detail switch
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [id]);

  const handleCategoryChange = (tab: string) => {
    setActiveCategory(tab);
    history.push(tab === 'Tất cả' ? '/products' : `/products?tab=${encodeURIComponent(tab)}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="product-detail-page">
      {/* Category Tabs Bar */}
      <CategoryTabs activeTab={activeCategory} onTabChange={handleCategoryChange} />

      <div key={product.id} className="product-detail-container animate-fade-in">
        {/* Breadcrumb */}
        <div className="product-breadcrumb">
          <span>Shop</span> &gt; <span>Làm sạch da</span> &gt; <span>Da nhạy cảm</span> &gt; <span className="current">{product.name}</span>
        </div>

        {/* Main Product Info Section (Images + Summary/AddToCart) */}
        <div className="product-main-overview">
          <Row gutter={[48, 48]} align="top">
            {/* Left: Images Gallery */}
            <Col xs={24} md={12}>
              <ProductImages images={product.images} />
            </Col>

            {/* Right: Summary & Add to Cart */}
            <Col xs={24} md={12}>
              <AddToCartBar 
                productName={product.name} 
                sku={product.sku} 
                rating={product.rating} 
                price={product.price} 
              />
            </Col>
          </Row>
        </div>

        {/* Product Tabs (Description, Info, Reviews) */}
        <ProductTabs productName={product.name} />

        {/* Related Products */}
        <RelatedProducts />
      </div>

      {/* Newsletter */}
      <ShopNewsletter />
    </div>
  );
};

export default ProductDetail;