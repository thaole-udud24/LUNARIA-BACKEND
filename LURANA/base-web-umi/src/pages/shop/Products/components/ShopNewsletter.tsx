import React from 'react';
import { Button, Input } from 'antd';

const ShopNewsletter: React.FC = () => {
  return (
    <div className="shop-newsletter-section">
      <div className="newsletter-content">
        <h3>Nhận tin tức từ chúng tôi</h3>
        <div className="newsletter-form">
          <Input placeholder="Nhập Email của bạn" bordered={true} className="newsletter-input" />
          <Button type="primary" className="newsletter-btn">Gửi ngay</Button>
        </div>
      </div>
    </div>
  );
};

export default ShopNewsletter;
