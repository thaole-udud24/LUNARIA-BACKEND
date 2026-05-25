import React, { useState, useEffect } from 'react';
import { Row, Col, Checkbox } from 'antd';
import { useLocation } from 'umi';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
import CategoryTabs from './components/CategoryTabs';
import ShopHeroBanner from './components/ShopHeroBanner';
import ProductCarouselSection from './components/ProductCarouselSection';
import ShopGallery from './components/ShopGallery';
import ShopNewsletter from './components/ShopNewsletter';
import './index.less';

const ALL_CATEGORIES = ['Làm sạch da', 'Cân bằng da', 'Dưỡng ẩm', 'Chống nắng', 'Phục hồi'];

const Products: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const tab = params.get('tab') || '';

    setSearchQuery(q);

    // Nếu có ?tab= thì bật tab đó
    if (tab && ALL_CATEGORIES.includes(tab)) {
      setActiveTab(tab);
    } else if (!tab) {
      // Chỉ reset tab về "Tất cả" khi không có tab param
      if (!q) setActiveTab('Tất cả');
    }

    // Scroll xuống phần sản phẩm
    if (q || tab) {
      setTimeout(() => {
        const el = document.querySelector('.shop2-main-layout');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [location.search]);


  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const clearSearch = () => {
    setSearchQuery('');
    history.push('/products');
  };

  const visibleCategories =
    activeTab === 'Tất cả' ? ALL_CATEGORIES : [activeTab];

  return (
    <div className="shop2-page">
      {/* Banner */}
      <ShopHeroBanner />

      {/* Search keyword banner */}
      {searchQuery && (
        <div className="search-keyword-bar">
          <SearchOutlined />
          <span>Kết quả tìm kiếm cho: <strong>"{searchQuery}"</strong></span>
          <button className="clear-search-btn" onClick={clearSearch}>
            <CloseCircleOutlined /> Xóa tìm kiếm
          </button>
        </div>
      )}

      {/* Sticky Category Tabs */}
      <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Layout: Filter sidebar + Carousel sections */}
      <div className="shop2-container shop2-main-layout">
        <Row gutter={40} align="top">

          {/* Left Sidebar — Filter */}
          <Col xs={24} md={5}>
            <div className="sidebar-filter-custom">

              <div className="filter-block">
                <div className="filter-header">Giá tiền</div>
                <div className="filter-body">
                  <Checkbox>&gt;= 500,000đ</Checkbox>
                  <Checkbox>&lt;= 900,000đ</Checkbox>
                  <Checkbox>&gt;= 1,200,000đ</Checkbox>
                </div>
              </div>

              <div className="filter-block">
                <div className="filter-header">Loại da phù hợp</div>
                <div className="filter-body">
                  <Checkbox>Da nhạy cảm</Checkbox>
                  <Checkbox>Da dầu mụn</Checkbox>
                  <Checkbox>Da khô</Checkbox>
                  <Checkbox>Da thường</Checkbox>
                </div>
              </div>

              <div className="filter-block">
                <div className="filter-header">Đánh giá</div>
                <div className="filter-body">
                  <Checkbox>&gt;=4.5 sao</Checkbox>
                  <Checkbox>&gt;=4.0 sao</Checkbox>
                  <Checkbox>&gt;=3.5 sao</Checkbox>
                </div>
              </div>

            </div>
          </Col>

          {/* Right — Carousel sections by category */}
          <Col xs={24} md={19}>
            {visibleCategories.map((category) => (
              <ProductCarouselSection key={category} title={category} searchQuery={searchQuery} />
            ))}
          </Col>

        </Row>
      </div>

      <ShopGallery />
      <ShopNewsletter />
    </div>
  );
};

export default Products;

