import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import { history } from 'umi';
import { getImg } from '../utils';
import EssenceCard from '../UI/EssenceCard';
import styles from '../UI/EssenceCard/index.module.less';

const EssenceSection: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const essenceData = [
    { img: 'icon-lam-sach.png', title: 'Làm sạch da' },
    { img: 'icon-can-bang.png', title: 'Cân bằng da' },
    { img: 'icon-duong-am.png', title: 'Dưỡng ẩm' },
    { img: 'icon-chong-nang.png', title: 'Chống nắng' },
    { img: 'icon-phuc-hoi.png', title: 'Phục hồi' }
  ];

  const handleNavigate = () => {
    history.push('/products');
  };

  return (
    <section className={styles.essenceSection}>
      <img src={getImg('flower-top.png')} className={styles.flowerTop} alt="decor" />
      <img src={getImg('flower-bottom.png')} className={styles.flowerBottom} alt="decor" />

      <div className={styles.titleWrapper}>
        <h2>Tinh Hoa Chăm Sóc Da</h2>
      </div>

      <div className={styles.contentWrapper}>
        <Row gutter={[24, 24]} justify="center">
          {essenceData.map((item, idx) => (
            <Col xs={12} sm={12} md={4} key={idx}>
              <EssenceCard 
                img={item.img} 
                title={item.title} 
                onClick={handleNavigate} 
              />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default EssenceSection;