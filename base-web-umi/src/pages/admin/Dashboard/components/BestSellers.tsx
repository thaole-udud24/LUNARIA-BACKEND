import { useRef, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import img1 from '@/assets/images/shop2-gallery-1.png';
import img2 from '@/assets/images/shop2-gallery-2.png';
import img3 from '@/assets/images/shop2-gallery-3.png';
import img4 from '@/assets/images/shop2-gallery-4.png';
import img5 from '@/assets/images/shop2-gallery-5.png';
import styles from './BestSellers.less';

const localProducts = [
  { id: '1', name: 'Serum Phục Hồi Trắng Da', imageUrl: img1 },
  { id: '2', name: 'Kem Dưỡng Cấp Ẩm Sâu', imageUrl: img2 },
  { id: '3', name: 'Toner Hoa Hồng Cân Bằng', imageUrl: img3 },
  { id: '4', name: 'Sữa Rửa Mặt Tạo Bọt', imageUrl: img4 },
  { id: '5', name: 'Kem Chống Nắng SPF 50+', imageUrl: img5 },
];

interface BestSellersProps {
  products?: any;
}

export default function BestSellers({ products }: BestSellersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollAmount = 176; 

      if (direction === 'left') {
        if (scrollLeft <= 0) {
          scrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scroll('right');
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Sản phẩm bán chạy</h3>
        <div className={styles.navButtons}>
          <button onClick={() => scroll('left')}><ChevronLeft size={18} /></button>
          <button onClick={() => scroll('right')}><ChevronRight size={18} /></button>
        </div>
      </div>
      
      <div className={styles.productList} ref={scrollRef}>
        {localProducts.map((product, index) => (
          <div 
            key={product.id} 
            className={styles.productCard}
            style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties} 
          >
            <div className={styles.imageWrapper}>
              <img src={product.imageUrl} alt={product.name} />
              <div className={styles.overlay}>
                <button className={styles.actionBtn}>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <p className={styles.productName} title={product.name}>
              {product.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}