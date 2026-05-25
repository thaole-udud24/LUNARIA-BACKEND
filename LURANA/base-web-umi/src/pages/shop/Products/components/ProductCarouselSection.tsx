import React, { useRef, useState } from 'react';
import { Carousel, Pagination } from 'antd';
import { HeartFilled, StarFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { getImg } from '../utils';

interface ProductCarouselSectionProps {
  title: string;
  searchQuery?: string;
}

const PAGE_SIZE = 12;

// Mock data pool - 20 products per category
const generateProducts = (count: number) =>
  Array.from({ length: count }).map((_, idx) => ({
    id: idx,
    name: 'Bye Bye Lines Foundation',
    price: '320,000đ',
    rating: (4 + Math.random()).toFixed(1),
    img: `anh-san-pham-${(idx % 8) + 1}.png`,
  }));

const ProductCarouselSection: React.FC<ProductCarouselSectionProps> = ({ title, searchQuery }) => {
  const carouselRef = useRef<any>(null);
  const [viewAll, setViewAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const allProducts = generateProducts(20);
  const carouselProducts = allProducts.slice(0, 5);

  // Paginated grid products
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageProducts = allProducts.slice(startIdx, startIdx + PAGE_SIZE);

  const next = () => carouselRef.current?.next();
  const prev = () => carouselRef.current?.prev();

  const handleToggleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewAll(!viewAll);
    setCurrentPage(1);
  };

  const ProductCard = ({ p }: { p: typeof allProducts[0] }) => (
    <div className="shop2-product-card" onClick={() => history.push(`/products/${p.id}`)} style={{ cursor: 'pointer' }}>
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
  );

  return (
    <div className="product-carousel-section">
      <div className="carousel-header">
        <h2>{title}</h2>
        <a href="#" className="view-all" onClick={handleToggleViewAll}>
          {viewAll ? (
            <>Thu gọn <LeftOutlined style={{ fontSize: '12px' }} /></>
          ) : (
            <>Xem tất cả <RightOutlined style={{ fontSize: '12px' }} /></>
          )}
        </a>
      </div>

      {!viewAll ? (
        /* ── Carousel mode ── */
        <div className="carousel-wrapper">
          <div className="carousel-arrow left" onClick={prev}>
            <LeftOutlined />
          </div>

          <Carousel
            ref={carouselRef}
            dots={false}
            slidesToShow={4}
            slidesToScroll={1}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 3 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 480, settings: { slidesToShow: 1 } },
            ]}
          >
            {carouselProducts.map((p) => (
              <div key={p.id} className="carousel-item-wrapper">
                <ProductCard p={p} />
              </div>
            ))}
          </Carousel>

          <div className="carousel-arrow right" onClick={next}>
            <RightOutlined />
          </div>
        </div>
      ) : (
        /* ── Grid (View All) mode ── */
        <div className="product-grid-view">
          <div className="product-grid">
            {pageProducts.map((p) => (
              <div key={`${p.id}-${currentPage}`} className="grid-card-wrapper">
                <ProductCard p={p} />
              </div>
            ))}
          </div>

          <div className="grid-pagination">
            <span className="pagination-total">
              Trang {currentPage} / {Math.ceil(allProducts.length / PAGE_SIZE)}
            </span>
            <Pagination
              current={currentPage}
              total={allProducts.length}
              pageSize={PAGE_SIZE}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              simple={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCarouselSection;
