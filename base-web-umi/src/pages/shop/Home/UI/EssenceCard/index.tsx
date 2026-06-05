import React from 'react';
import { getImg } from '../../utils';
import styles from './index.module.less';

interface EssenceCardProps {
  img: string;
  title: string;
  onClick: () => void;
}

const EssenceCard: React.FC<EssenceCardProps> = ({ img, title, onClick }) => {
  return (
    <div className={styles.essenceCard} onClick={onClick}>
      <div className={styles.iconWrapper}>
        <img src={getImg(img)} alt={title} />
      </div>
      <h4>{title}</h4>
    </div>
  );
};

export default EssenceCard;