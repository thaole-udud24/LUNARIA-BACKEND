import React from 'react';
import { Row, Col, Checkbox, Pagination, Select } from 'antd';
import { HeartFilled, StarFilled } from '@ant-design/icons';
import { history } from 'umi';
import { getImg } from '../utils';

const ShopAllProducts: React.FC = () => {
  const mockProducts = Array.from({ length: 12 }).map((_, idx) => ({
    id: idx,
    name: 'Bye Bye Lines Foundation',
    price: '320,000đ',
    rating: idx % 4 === 3 ? 4.9 : 5.0,
    img: `anh-san-pham-${(idx % 8) + 1}.png`,
    active: idx === 4 // Set the 5th item as active (blue border) for demo
  }));

  return (
    <div className="shop-all-products">
      <Row gutter={40}>
        {/* Left Sidebar */}
        <Col xs={24} md={5}>
          <div className="sidebar-filter-custom">
            
            <div className="filter-block">
              <div className="filter-header">Giá tiền</div>
              <div className="filter-body">
                <Checkbox>&gt;= 500,000</Checkbox>
                <Checkbox>&lt;= 900,000</Checkbox>
                <Checkbox>&gt;= 1,200,000</Checkbox>
              </div>
            </div>

            <div className="filter-block">
              <div className="filter-header">Chức năng</div>
              <div className="filter-body">
                <Checkbox>Làm sạch</Checkbox>
                <Checkbox>Cân bằng</Checkbox>
                <Checkbox>Dưỡng ẩm</Checkbox>
                <Checkbox>Phục hồi</Checkbox>
                <Checkbox>Chống nắng</Checkbox>
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

        {/* Right Grid */}
        <Col xs={24} md={19}>
          <div className="grid-top-bar">
            <a href="#" className="view-more-link">Xem thêm</a>
          </div>

          <Row gutter={[24, 32]}>
            {mockProducts.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
                <div 
                  className={`shop2-product-card ${p.active ? 'active-card' : ''}`}
                  onClick={() => history.push(`/products/${p.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-top">
                    <div className="heart-icon"><HeartFilled /></div>
                    <div className="rating-badge"><StarFilled /> {p.rating}</div>
                  </div>
                  <div className="card-img-container">
                    <img src={getImg(p.img)} alt={p.name} />
                  </div>
                  <div className="card-info">
                    <h4 className="prod-name">{p.name}</h4>
                    <div className="prod-price">{p.price}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <div className="custom-pagination">
            <span className="total-text">Tổng số: 1</span>
            <Pagination 
              simple 
              defaultCurrent={1} 
              total={10} 
              showSizeChanger={false}
              itemRender={(page, type, originalElement) => {
                if (type === 'prev') {
                  return <a>&lt;</a>;
                }
                if (type === 'next') {
                  return <a>&gt;</a>;
                }
                return originalElement;
              }}
            />
            <Select defaultValue="10" bordered={false} className="per-page-select">
              <Select.Option value="10">10/trang</Select.Option>
              <Select.Option value="20">20/trang</Select.Option>
            </Select>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ShopAllProducts;
