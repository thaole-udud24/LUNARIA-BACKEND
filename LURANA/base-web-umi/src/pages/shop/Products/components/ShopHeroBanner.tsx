import React from 'react';
import { getImg } from '../utils';

const ShopHeroBanner: React.FC = () => {
  return (
    <div className="shop-hero-banner">
      <img src={getImg('shop2-hero.png')} alt="Hero Banner" className="hero-img" />
    </div>
  );
};

export default ShopHeroBanner;
