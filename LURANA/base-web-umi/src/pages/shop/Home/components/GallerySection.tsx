import React, { useEffect } from 'react';
import { getImg } from '../utils';
import styles from '../UI/GallerySection/index.module.less';

const GallerySection: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <section className={styles.gallerySection}>
      <div className={styles.gridContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.sectionTitle}>Khách Hàng và LUNARIA</h2>
        </div>

        <div className={styles.galleryGridContainer}>
          {/* Cột 1: Gồm 2 ảnh vuông nhỏ bên trái ngoài cùng */}
          <div className={styles.galleryColumn}>
            <div className={styles.galleryItem}>
              <img src={getImg('anh4-gallery-1.png')} alt="LUNARIA Product Texture" />
              <div className={styles.glareOverlay}></div>
            </div>
            <div className={styles.galleryItem}>
              <img src={getImg('anh-gallery-6.png')} alt="LUNARIA Eco-concept" />
              <div className={styles.glareOverlay}></div>
            </div>
          </div>

          {/* Cột 2: Ảnh chân dung lớn trung tâm */}
          <div className={`${styles.galleryColumn} ${styles.columnLarge}`}>
            <div className={styles.galleryItem}>
              <img src={getImg('anh5-gallery-2.png')} alt="Customer with LUNARIA" />
              <div className={styles.glareOverlay}></div>
            </div>
          </div>

          {/* Cột 3: Gồm 2 ảnh nhỡ góc trên và dưới */}
          <div className={styles.galleryColumn}>
            <div className={styles.galleryItem}>
              <img src={getImg('anh6-gallery-3.png')} alt="LUNARIA Skincare Model" />
              <div className={styles.glareOverlay}></div>
            </div>
            <div className={styles.galleryItem}>
              <img src={getImg('anh7-gallery-4.png')} alt="LUNARIA Plant Extracts" />
              <div className={styles.glareOverlay}></div>
            </div>
          </div>

          {/* Cột 4: Gồm 2 ảnh bên phải ngoài cùng */}
          <div className={styles.galleryColumn}>
            <div className={styles.galleryItem}>
              <img src={getImg('anh-gallery-7.png')} alt="LUNARIA Flatlay Cosmetic" />
              <div className={styles.glareOverlay}></div>
            </div>
            <div className={styles.galleryItem}>
              <img src={getImg('anh8-gallery-5.png')} alt="Customer Roller Massage" />
              <div className={styles.glareOverlay}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;