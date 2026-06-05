import React from 'react';
import { getImg } from '../utils';

const ShopGallery: React.FC = () => {
  return (
    <div className="shop-gallery-section">
      <div className="gallery-container">
        {/* Gallery Image 3 shows overlapping images on a light background */}
        <div className="gallery-item item-1">
          <img src={getImg('shop2-gallery-1.png')} alt="Gallery 1" />
        </div>
        <div className="gallery-item item-2">
          <img src={getImg('shop2-gallery-2.png')} alt="Gallery 2" />
        </div>
        <div className="gallery-item item-3">
          <img src={getImg('shop2-gallery-3.png')} alt="Gallery 3" />
        </div>
        <div className="gallery-item item-4">
          <img src={getImg('shop2-gallery-4.png')} alt="Gallery 4" />
        </div>
        <div className="gallery-item item-5">
          <img src={getImg('shop2-gallery-5.png')} alt="Gallery 5" />
        </div>
      </div>
    </div>
  );
};

export default ShopGallery;
