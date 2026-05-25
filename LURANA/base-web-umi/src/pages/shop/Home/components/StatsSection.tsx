import React, { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'antd';
import StatItem from '../UI/StatItem';
import styles from '../UI/StatItem/index.module.less';

const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tải font chữ đồng bộ
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);

    // Tạo bộ theo dõi vùng nhìn: cứ mỗi lần cuộn tới hoặc rời đi sẽ kích hoạt lại số chạy
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false); // Reset lại để khi cuộn tới lần sau số lại chạy tiếp
        }
      },
      { threshold: 0.1 } // Kích hoạt khi khối xuất hiện 10% trên khung màn hình
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

  return (
    <section ref={sectionRef} className={styles.statsSection}>
      <div className={styles.gridContainer}>
        <Row gutter={[60, 40]} align="middle">
          <Col xs={24} lg={10}>
            <div className={styles.statsTextWrapper}>
              <div className={styles.titleContainer}>
                <h3 className={styles.sectionTitle}>Những con số từ LUNARIA</h3>
              </div>
              <p className={styles.sectionDesc}>
                Những giá trị được tạo nên từ sự bền bỉ, tỉ mỉ và cam kết lâu dài với làn da, 
                được nuôi dưỡng qua thời gian, từ nghiên cứu khoa học đến từng trải nghiệm 
                chăm sóc da hằng ngày.
              </p>
            </div>
          </Col>

          <Col xs={24} lg={14}>
            <Row gutter={[28, 28]}>
              <Col xs={12} sm={12}>
                <StatItem targetNumber={10} suffix=" + Năm" label="Nghiên cứu và phát triển" trigger={isVisible} />
              </Col>
              <Col xs={12} sm={12}>
                <StatItem targetNumber={100} suffix="%" label="Sản phẩm được kiểm nghiệm da liễu" trigger={isVisible} />
              </Col>
              <Col xs={12} sm={12}>
                <StatItem targetNumber={5000} suffix=" +" label="Khách hàng lựa chọn và tin dùng" trigger={isVisible} />
              </Col>
              <Col xs={12} sm={12}>
                <StatItem targetNumber={20} suffix=" +" label="Thành phần có nguồn gốc tự nhiên" trigger={isVisible} />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default StatsSection;