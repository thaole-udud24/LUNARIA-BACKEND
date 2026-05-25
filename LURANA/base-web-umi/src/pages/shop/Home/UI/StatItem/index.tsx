import React, { useEffect, useState } from 'react';
import styles from './index.module.less';

interface StatItemProps {
  targetNumber: number;
  suffix: string;
  label: string;
  trigger: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ targetNumber, suffix, label, trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Nếu khối bị ẩn khỏi khung màn hình, đưa giá trị số trở lại bằng 0
    if (!trigger) {
      setCount(0);
      return;
    }

    let animationFrameId: number;
    const duration = 2000; // Thời gian chạy số tổng cộng 2 giây
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const easeOutQuad = (x: number): number => {
        return x * (2 - x);
      };

      const currentCount = Math.floor(easeOutQuad(progress) * targetNumber);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [trigger, targetNumber]);

  return (
    <div className={styles.statItemCard}>
      <h4 className={styles.statNumber}>
        {count.toLocaleString('vi-VN')}
        <span className={styles.statSuffix}>{suffix}</span>
      </h4>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
};

export default StatItem;