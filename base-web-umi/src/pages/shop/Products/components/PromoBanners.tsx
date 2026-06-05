import React from 'react';
import { Row, Col } from 'antd';
import { getImg } from '../utils';

const PromoBanners: React.FC = () => {
  return (
    <div className="promo-banners">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div className="promo-card">
            <img src={getImg('shop2-promo-1.png')} alt="Promo 1" />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="promo-card">
            <img src={getImg('shop2-promo-2.png')} alt="Promo 2" />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="promo-card">
            <img src={getImg('shop2-promo-3.png')} alt="Promo 3" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PromoBanners;
