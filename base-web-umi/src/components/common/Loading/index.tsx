import styles from './index.less';

interface LoadingProps {
  text?: string;
  height?: string;
}

export default function Loading({ text = 'ĐANG TẢI DỮ LIỆU...', height = '60vh' }: LoadingProps) {
  return (
    <div className={styles.loaderContainer} style={{ height }}>
      <div className={styles.loaderCore}>
        <div className={styles.ringOne}></div>
        <div className={styles.ringTwo}></div>
        <div className={styles.flowerCenter}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c4-4 8-6 8-12a4 4 0 1 0-8 0 4 4 0 1 0-8 0c0 6 4 8 8 12z"></path>
          </svg>
        </div>
      </div>
      <p className={styles.loadingText}>{text}</p>
    </div>
  );
}