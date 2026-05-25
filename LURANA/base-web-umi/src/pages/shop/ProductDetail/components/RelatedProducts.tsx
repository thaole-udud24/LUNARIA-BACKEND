import React from 'react';
import { Row, Col } from 'antd';
import { HeartFilled, StarFilled } from '@ant-design/icons';
import { history } from 'umi';
import { getImg } from '../utils';

const RelatedProducts: React.FC = () => {
  const mockProducts = [
    { id: 1, name: 'Bye Bye Lines Foundation', price: '320,000đ', rating: 5.0, img: 'anh-san-pham-1.png' },
    { id: 2, name: 'Bye Bye Lines Foundation', price: '325,000đ', rating: 5.0, img: 'anh-san-pham-2.png' },
    { id: 3, name: 'Bye Bye Lines Foundation', price: '320,000đ', rating: 5.0, img: 'anh-san-pham-3.png' },
    { id: 4, name: 'Bye Bye Lines Foundation', price: '325,000đ', rating: 4.8, img: 'anh-san-pham-4.png' },
    { id: 5, name: 'Bye Bye Lines Foundation', price: '320,000đ', rating: 5.0, img: 'anh-san-pham-5.png' },
    { id: 6, name: 'Bye Bye Lines Foundation', price: '325,000đ', rating: 5.0, img: 'anh-san-pham-6.png' },
    { id: 7, name: 'Bye Bye Lines Foundation', price: '320,000đ', rating: 4.9, img: 'anh-san-pham-7.png' },
    { id: 8, name: 'Bye Bye Lines Foundation', price: '325,000đ', rating: 5.0, img: 'anh-san-pham-8.png' },
  ];

  return (
    <div className="related-products-section">
      <div className="section-header">
        <h2>Sản phẩm <span>phù hợp với bạn</span></h2>
        <a href="#/products" className="view-more-link">Xem thêm</a>
      </div>

      <Row gutter={[24, 32]}>
        {mockProducts.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
            <div 
              className="shop2-product-card" 
              onClick={() => history.push(`/products/${p.id}`)}
            >
              <div className="card-top">
                <div className="heart-icon"><HeartFilled /></div>
                <div className="rating-badge"><StarFilled /> {p.rating.toFixed(1)}</div>
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
    </div>
  );
};

export default RelatedProducts;
