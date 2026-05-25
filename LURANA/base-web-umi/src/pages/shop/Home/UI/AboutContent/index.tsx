import React, { useEffect } from 'react';
import { getImg } from '../../utils';
import styles from './index.module.less';

const AboutContent: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Montserrat:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <section className={styles.aboutContainer}>
      <div className={styles.aboutImg}>
        <img src={getImg('anh2-about.png')} alt="Về chúng tôi" />
      </div>
      
      <div className={styles.aboutTextWrapper}>
        <div className={styles.aboutText}>
          <h2>Vẻ đẹp bắt đầu từ sự thấu hiểu</h2>
          <p>
            Mỗi buổi sáng là một khởi đầu mới, khi làn da cần được đánh thức bằng sự dịu dàng.
            LUNARIA Beauty đồng hành cùng bạn từ những bước chăm sóc đầu tiên, giúp làn da 
            tươi tắn, cân bằng và sẵn sàng cho một ngày tràn đầy năng lượng.
          </p>
          <p>
            Bởi một ngày đẹp luôn bắt đầu từ cảm giác dễ chịu trên làn da.
          </p>
          
          <a href="/about" className={styles.readMoreBtn}>
            Đọc thêm
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;