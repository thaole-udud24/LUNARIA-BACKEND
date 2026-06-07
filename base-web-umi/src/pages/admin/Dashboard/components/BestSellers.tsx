import { useEffect, useRef } from 'react';
import { history } from 'umi';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BestSeller } from '@/services/Admin/types';
import styles from './BestSellers.less';

interface BestSellersProps {
  products?: BestSeller[];
}

export default function BestSellers({ products }: BestSellersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const scrollAmount = 176;

    if (direction === 'left') {
      scrollRef.current.scrollBy({ left: scrollLeft <= 0 ? scrollWidth : -scrollAmount, behavior: 'smooth' });
    } else {
      scrollRef.current.scrollBy({
        left: Math.ceil(scrollLeft + clientWidth) >= scrollWidth ? -scrollWidth : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (!products?.length) return undefined;
    const interval = setInterval(() => scroll('right'), 3500);
    return () => clearInterval(interval);
  }, [products?.length]);

  if (!products?.length) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Sản phẩm bán chạy</h3>
            <p className={styles.subtitle}>30 ngày qua · đơn đã thanh toán</p>
          </div>
        </div>
        <div className={styles.empty}>Chưa có dữ liệu bán chạy</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Sản phẩm bán chạy</h3>
          <p className={styles.subtitle}>30 ngày qua · đơn đã thanh toán</p>
        </div>
        <div className={styles.navButtons}>
          <button type="button" onClick={() => scroll('left')} aria-label="Trước"><ChevronLeft size={18} /></button>
          <button type="button" onClick={() => scroll('right')} aria-label="Sau"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className={styles.productList} ref={scrollRef}>
        {products.map((product, index) => (
          <div
            key={product.id}
            className={styles.productCard}
            style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
          >
            <div className={styles.imageWrapper}>
              <img src={product.imageUrl} alt={product.name} />
              {product.sales != null && product.sales > 0 && (
                <span className={styles.salesBadge}>Đã bán {product.sales}</span>
              )}
              <div className={styles.overlay}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => history.push(`/admin/products?search=${encodeURIComponent(product.name)}`)}
                  aria-label={`Xem ${product.name}`}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <p className={styles.productName} title={product.name}>{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
