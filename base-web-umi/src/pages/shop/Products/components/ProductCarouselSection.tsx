import React, { useRef, useState } from 'react';
import { Carousel, Pagination, message, Row, Col } from 'antd';
import { HeartFilled, HeartOutlined, StarFilled, LeftOutlined, RightOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { history } from 'umi';
import useCart from '@/hooks/useCart';

interface ProductCarouselSectionProps {
  title: string;
  products: any[];
}

const PAGE_SIZE = 8;
const FALLBACK_IMAGE = 'https://placehold.co/600x600/FFF8F6/FFA78A?text=Lunaria+Product';

// ✅ Fix: lấy đúng field ảnh từ BE mới
const getProductImage = (p: any) => {
  if (p.mainImage) return p.mainImage;
  if (p.avatar_url) return p.avatar_url;
  if (p.img) return p.img;
  if (p.images && p.images.length > 0) return p.images[0];
  return FALLBACK_IMAGE;
};

// ✅ Fix: lấy giá từ variants[0].priceSell
const getProductPrice = (p: any) => {
  if (p.variants && p.variants.length > 0) {
    const price = p.variants[0].priceSell || p.variants[0].originalPrice || 0;
    return price.toLocaleString('vi-VN') + 'đ';
  }
  if (typeof p.price === 'number') return p.price.toLocaleString('vi-VN') + 'đ';
  return 'Liên hệ';
};

// ✅ Fix: dùng _id thay vì id
const getProductId = (p: any) => p._id || p.id || '';

const ProductCarouselSection: React.FC<ProductCarouselSectionProps> = ({ title, products = [] }) => {
  const carouselRef = useRef<any>(null);
  const { addItem } = useCart();
  const [viewAll, setViewAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  const carouselProducts = products.slice(0, 8);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageProducts = products.slice(startIdx, startIdx + PAGE_SIZE);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      message.info('Đã xóa khỏi danh sách yêu thích.');
    } else {
      setFavorites([...favorites, id]);
      message.success('Đã thêm vào danh sách yêu thích!');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, p: any) => {
    e.stopPropagation();
    const productId = getProductId(p);
    const variantName = p.variants?.[0]?.variantName;
    if (!productId || !variantName) {
      message.info('Vui lòng chọn biến thể tại trang chi tiết sản phẩm');
      history.push(`/products/${productId}`);
      return;
    }

    const ok = await addItem({ productId, variantName, quantity: 1 });
    if (ok) {
      message.success(`Đã thêm "${p.name}" vào giỏ hàng!`);
    }
  };

  const ProductCard = ({ p }: { p: any }) => {
    const id = getProductId(p);
    return (
      <div className="shop2-product-card" onClick={() => history.push(`/products/${id}`)}>
        <div className="card-image-box">
          <img
            src={getProductImage(p)}
            alt={p.name}
            onError={(e: any) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
          />
          <div className="card-hover-actions">
            <button className="action-btn-circle" onClick={(e) => toggleFavorite(e, id)}>
              {favorites.includes(id) ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
            </button>
            <button className="action-btn-circle" onClick={(e) => handleAddToCart(e, p)}>
              <ShoppingCartOutlined />
            </button>
          </div>
          <div className="rating-tag">
            <StarFilled /> <span>4.8</span>
          </div>
        </div>
        <div className="card-body-details">
          <h4 className="prod-title-text">{p.name || 'Sản phẩm Lunaria'}</h4>
          <div className="prod-price-row">
            <span className="current-price">{getProductPrice(p)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="product-carousel-section">
      <div className="carousel-header">
        <h2 className="section-title-faint">{title}</h2>
        <a href="#" className="view-all-anchor" onClick={(e) => { e.preventDefault(); setViewAll(!viewAll); }}>
          {viewAll ? <>Thu gọn <LeftOutlined /></> : <>Xem tất cả ({products.length}) <RightOutlined /></>}
        </a>
      </div>

      {!viewAll ? (
        <div className="carousel-track-wrapper">
          {products.length > 4 && (
            <div className="carousel-nav-arrow prev" onClick={() => carouselRef.current?.prev()}>
              <LeftOutlined />
            </div>
          )}
          <Carousel
            ref={carouselRef}
            dots={false}
            slidesToShow={Math.min(products.length, 4) || 1}
            slidesToScroll={1}
            responsive={[
              { breakpoint: 1200, settings: { slidesToShow: 3 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 480, settings: { slidesToShow: 1 } },
            ]}
          >
            {carouselProducts.map((p) => (
              <div key={getProductId(p)} className="carousel-card-padding">
                <ProductCard p={p} />
              </div>
            ))}
          </Carousel>
          {products.length > 4 && (
            <div className="carousel-nav-arrow next" onClick={() => carouselRef.current?.next()}>
              <RightOutlined />
            </div>
          )}
        </div>
      ) : (
        <div className="product-grid-expanded">
          <Row gutter={[24, 24]}>
            {pageProducts.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} key={getProductId(p)}>
                <ProductCard p={p} />
              </Col>
            ))}
          </Row>
          <div className="grid-pagination-footer">
            <Pagination
              current={currentPage}
              total={products.length}
              pageSize={PAGE_SIZE}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCarouselSection;