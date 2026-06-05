import React, { useState } from 'react';
import { getImg } from '../utils';

interface ProductImagesProps {
  images?: string[];
}

const defaultImages = [
  'anh-san-pham-1.png',
  'anh-san-pham-2.png',
  'anh-san-pham-3.png',
  'anh-san-pham-4.png',
  'anh-san-pham-5.png',
];

const ProductImages: React.FC<ProductImagesProps> = ({ images = defaultImages }) => {
  const [activeImg, setActiveImg] = useState<string>(images[0]);

  return (
    <div className="product-images-container">
      {/* Main Large Image */}
      <div className="main-image-display">
        <img src={getImg(activeImg)} alt="Product Main" className="main-img" />
      </div>

      {/* Thumbnails */}
      <div className="thumbnail-list">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`thumbnail-item ${activeImg === img ? 'active' : ''}`}
            onClick={() => setActiveImg(img)}
          >
            <img src={getImg(img)} alt={`Thumbnail ${idx + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
