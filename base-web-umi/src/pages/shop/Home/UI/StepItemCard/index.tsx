import React from 'react';
import { getImg } from '../../utils';
import styles from './index.module.less';

interface StepItemCardProps {
  step: string;
  img: string;
  title: string;
  desc: string;
  index: number;
  trigger: boolean;
}

const StepItemCard: React.FC<StepItemCardProps> = ({ step, img, title, desc, index, trigger }) => {
  // Hàm gán class màu sắc riêng biệt cho từng bước từ 1 đến 4
  const getStepColorClass = (idx: number) => {
    if (idx === 0) return styles.stepOne;
    if (idx === 1) return styles.stepTwo;
    if (idx === 2) return styles.stepThree;
    return styles.stepFour;
  };

  return (
    <div 
      className={`${styles.stepItemCard} ${getStepColorClass(index)} ${trigger ? styles.animateIn : ''}`}
      style={{ '--delay-idx': index } as React.CSSProperties}
    >
      <div className={styles.stepBadge}>{step}</div>
      <div className={styles.iconWrapper}>
        <img src={getImg(img)} alt={title} />
      </div>
      <div className={styles.titleWrapper}>
        <h5 className={styles.stepTitle}>{title}</h5>
      </div>
      <p className={styles.stepDesc}>{desc}</p>
    </div>
  );
};

export default StepItemCard;