import React, { useEffect, useRef, useState } from 'react';
import { getImg } from '../utils';
import styles from '../UI/QuoteSection/index.module.less';

const QuoteSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false); 
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const bgImg = getImg('anh-quote-bg.png');

  return (
    <section 
      ref={sectionRef}
      className={styles.quoteSection} 
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className={styles.quoteOverlay}></div>
      <div className={styles.gridContainer}>
        <div className={`${styles.quoteContent} ${isVisible ? styles.animateReveal : ''}`}>
          <p className={styles.quoteText}>
            <span className={styles.line}>"Tôi tin rằng, làn da không cần được thay đổi để trở nên đẹp hơn.</span>
            <span className={styles.line}>Điều làn da thật sự cần là sự thấu hiểu, kiên nhẫn và những điều lành tính từ thiên nhiên.</span>
            <span className={styles.line}>LUNARIA ra đời để đồng hành cùng làn da theo cách dịu dàng và bền vững nhất."</span>
          </p>
          <div className={styles.authorContainer}>
            <span className={styles.authorName}>— Nhà sáng lập LUNARIA</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;