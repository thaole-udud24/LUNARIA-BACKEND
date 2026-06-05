import React from 'react';
import styles from './index.module.less';

interface CommitBoxProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  isRightAlign?: boolean;
}

const CommitBox: React.FC<CommitBoxProps> = ({ icon, title, desc, isRightAlign }) => {
  return (
    <div className={`${styles.commitBox} ${isRightAlign ? styles.rightAlign : styles.leftAlign}`}>
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <div className={styles.textContent}>
        <h5>{title}</h5>
        <p>{desc}</p>
      </div>
    </div>
  );
};

export default CommitBox;