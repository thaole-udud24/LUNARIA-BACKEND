import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Checkbox, Slider, Spin, Empty, Input, Button } from 'antd';
import { useLocation, history } from 'umi';
import {
  SearchOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import ShopHeroBanner from './components/ShopHeroBanner';
import ShopAllProducts from './components/ShopAllProducts';
import ShopGallery from './components/ShopGallery';
import ShopNewsletter from './components/ShopNewsletter';
import { getProducts } from '@/services/SanPham/products.customer.api';
import { getCategories } from '@/services/DanhMuc/categories.customer.api';
import { getSkinTypes } from '@/services/LoaiDa/skin-types.customer.api';

import './index.less';

const Products: React.FC = () => {
  const location = useLocation();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [dynamicSkinTypes, setDynamicSkinTypes] = useState<any[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);

  const fetchMasterData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, skinRes] = await Promise.all([
        getProducts({ limit: 100 }),
        getCategories(),
        getSkinTypes(),
      ]);
      setAllProducts(prodRes?.data || prodRes?.items || prodRes || []);
      setDynamicCategories(catRes?.data || catRes?.items || (Array.isArray(catRes) ? catRes : []));
      setDynamicSkinTypes(skinRes?.data || skinRes?.items || (Array.isArray(skinRes) ? skinRes : []));
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu từ API:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchKeyword(q);

    const tab = params.get('tab');
    if (tab) {
      const match = dynamicCategories.find(
        (c) =>
          (c.name || c.title || '').toLowerCase() === tab.toLowerCase() ||
          (c.slug || c.code || '').toLowerCase() === tab.toLowerCase(),
      );
      if (match) {
        setSelectedCategories([(match.name || match.title || tab).toLowerCase()]);
      }
    }
  }, [location.search, dynamicCategories]);

  const handleReload = () => {
    setReloadKey((k) => k + 1);
    fetchMasterData();
  };

  const handleSearch = () => {
    const trimmed = searchKeyword.trim();
    if (trimmed) {
      history.push(`/products?q=${encodeURIComponent(trimmed)}`);
    } else {
      history.push('/products');
    }
  };

  const finalFilteredProducts = allProducts.filter((p) => {
    const matchSearch = !searchKeyword ||
      (p.name && p.name.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(searchKeyword.toLowerCase()));

    const pCategoryName = (p?.category?.name || p?.category || '').toLowerCase();
    const matchSidebarCat = selectedCategories.length === 0 ||
      selectedCategories.some(c => pCategoryName.includes(c.toLowerCase()));

    let pSkinNames = '';
    if (Array.isArray(p.skinTypes)) {
      pSkinNames = p.skinTypes.map((s: any) => s?.name || s).join(' ').toLowerCase();
    } else {
      pSkinNames = (p?.skinType?.name || p?.skinType || '').toLowerCase();
    }
    const matchSkin = selectedSkinTypes.length === 0 ||
      selectedSkinTypes.some(s => pSkinNames.includes(s.toLowerCase()));

    const pPrice = p.variants?.[0]?.priceSell
      || p.variants?.[0]?.originalPrice
      || p.price
      || 0;
    const matchPrice = pPrice >= priceRange[0] && pPrice <= priceRange[1];

    return matchSearch && matchSidebarCat && matchSkin && matchPrice;
  });

  return (
    <div className="shop2-page">
      <ShopHeroBanner />

      {searchKeyword && (
        <div className="search-keyword-bar">
          <div className="search-inner-info">
            <SearchOutlined />
            <span>Kết quả tìm kiếm cho: <strong>&quot;{searchKeyword}&quot;</strong></span>
          </div>
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => { setSearchKeyword(''); history.push('/products'); }}
          >
            <CloseCircleOutlined /> Xóa tìm kiếm
          </button>
        </div>
      )}

      <div className="shop2-container shop2-main-layout">
        <Row gutter={[32, 32]} align="top">
          <Col xs={24} lg={6}>
            <div className="sidebar-filter-custom">
              <div className="sidebar-main-title">Bộ lọc sản phẩm</div>

              <div className="filter-block">
                <div className="filter-header">Khoảng giá (VND)</div>
                <div className="filter-body filter-body--slider">
                  <Slider
                    range
                    min={0}
                    max={3000000}
                    step={50000}
                    value={priceRange}
                    onChange={(val) => setPriceRange(val as [number, number])}
                    trackStyle={[{ backgroundColor: '#FFA78A' }]}
                    handleStyle={[{ borderColor: '#FFA78A' }, { borderColor: '#FFA78A' }]}
                  />
                  <div className="price-range-labels">
                    <span>{priceRange[0].toLocaleString('vi-VN')}đ</span>
                    <span>{priceRange[1].toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              <div className="filter-block">
                <div className="filter-header">Danh mục sản phẩm</div>
                <div className="filter-body">
                  <Checkbox.Group
                    value={selectedCategories}
                    onChange={(vals) => setSelectedCategories(vals as string[])}
                    style={{ width: '100%' }}
                  >
                    <Row gutter={[0, 8]}>
                      {dynamicCategories.map((cat, idx) => (
                        <Col span={24} key={`cat-${idx}`}>
                          <Checkbox value={cat.name || cat.title}>{cat.name || cat.title}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </div>
              </div>

              <div className="filter-block">
                <div className="filter-header">Loại da phù hợp</div>
                <div className="filter-body">
                  <Checkbox.Group
                    value={selectedSkinTypes}
                    onChange={(vals) => setSelectedSkinTypes(vals as string[])}
                    style={{ width: '100%' }}
                  >
                    <Row gutter={[0, 8]}>
                      {dynamicSkinTypes.map((skin, idx) => (
                        <Col span={24} key={`skin-${idx}`}>
                          <Checkbox value={skin.name || skin.title}>{skin.name || skin.title}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={18}>
            <div className="shop-products-wrapper">
              <div className="products-toolbar">
                <div className="products-toolbar__left">
                  <h2 className="products-toolbar__title">Danh sách sản phẩm</h2>
                  <p className="products-toolbar__subtitle">
                    Tìm thấy <strong>{finalFilteredProducts.length}</strong> sản phẩm
                  </p>
                </div>
                <div className="products-toolbar__actions">
                  <Input
                    className="products-toolbar__search"
                    placeholder="Tìm theo tên, mã SKU..."
                    prefix={<SearchOutlined />}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onPressEnter={handleSearch}
                    allowClear
                  />
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    className="products-toolbar__btn products-toolbar__btn--search"
                    onClick={handleSearch}
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    icon={<ReloadOutlined spin={loading} />}
                    className="products-toolbar__btn products-toolbar__btn--reload"
                    onClick={handleReload}
                    loading={loading}
                  >
                    Tải lại
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="shop-loading-state">
                  <Spin size="large" tip="Đang tải dữ liệu Lunaria..." />
                </div>
              ) : finalFilteredProducts.length === 0 ? (
                <div className="shop-empty-state">
                  <Empty description="Không tìm thấy sản phẩm nào phù hợp với bộ lọc." />
                </div>
              ) : (
                <ShopAllProducts
                  key={reloadKey}
                  products={finalFilteredProducts}
                  pageSize={9}
                />
              )}
            </div>
          </Col>
        </Row>
      </div>

      <ShopGallery />
      <ShopNewsletter />
    </div>
  );
};

export default Products;
