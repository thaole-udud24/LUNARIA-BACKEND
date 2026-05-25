import React from 'react';
import { Button } from 'antd';
import { Link } from 'umi';
import styles from './index.module.less';

interface HeroContentProps {
  bgImage: string;
  mainProductImg: string;
  textLogoImg: string;
  description: string;
  buttonText: string;
  linkTo: string;
}

const HeroContent: React.FC<HeroContentProps> = ({
  bgImage,
  mainProductImg,
  textLogoImg,
  description,
  buttonText,
  linkTo
}) => {
  return (
    <div
      className={styles.heroWrapper}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
    >

      {/* ===== BONG BÓNG NƯỚC LUNG LINH ===== */}
      <div className={styles.waterGlow}></div>

      <div className={styles.waterBubbleLarge}></div>
      <div className={styles.waterBubbleMedium}></div>
      <div className={styles.waterBubbleSmall}></div>

      {/* bubble nhỏ bay */}
      <div className={styles.bubble1}></div>
      <div className={styles.bubble2}></div>
      <div className={styles.bubble3}></div>

      {/* ===== CỘT TRÁI ===== */}
      <div className={styles.leftCol}>
        <div className={styles.logoContainer}>
          <img
            src={textLogoImg}
            alt="Best Clean Fresh"
            className={styles.textLogo}
          />
        </div>

        <p className={styles.descText}>
          {description}
        </p>

        <Link to={linkTo}>
          <Button
            type="primary"
            className={styles.ctaButton}
          >
            {buttonText}
          </Button>
        </Link>
      </div>

      {/* ===== CỘT PHẢI ===== */}
      <div className={styles.rightCol}>
        <div className={styles.orangeOuterRing}>
          <div className={styles.productInnerCircle}>
            <img
              src={mainProductImg}
              alt="Hero Product"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;