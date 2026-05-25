import React, { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'antd';
import StepItemCard from '../UI/StepItemCard';
import styles from '../UI/StepItemCard/index.module.less';

const StepsSection: React.FC = () => {
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

  const stepData = [
    { step: 'Bước 01', img: 'icon-step-1.png', title: 'Làm sạch', desc: 'Nhẹ nhàng loại bỏ bụi bẩn, giữ lại độ ẩm tự nhiên.' },
    { step: 'Bước 02', img: 'icon-step-2.png', title: 'Cấp ẩm', desc: 'Làm dịu da, chuẩn bị cho các bước dưỡng tiếp theo.' },
    { step: 'Bước 03', img: 'icon-step-3.png', title: 'Nuôi dưỡng', desc: 'Cấp ẩm và phục hồi làn da từ bên trong.' },
    { step: 'Bước 04', img: 'icon-step-4.png', title: 'Bảo vệ', desc: 'Bảo vệ da tối ưu trước tác hại của môi trường bên ngoài.' }
  ];

  return (
    <section ref={sectionRef} className={styles.stepsSection}>
      <div className={styles.gridContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.sectionTitle}>Các Bước Chăm Sóc Da Cùng LUNARIA</h2>
        </div>
        
        <Row gutter={[24, 24]} justify="center" align="stretch">
          {stepData.map((item, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <StepItemCard
                step={item.step}
                img={item.img}
                title={item.title}
                desc={item.desc}
                index={idx}
                trigger={isVisible}
              />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default StepsSection;