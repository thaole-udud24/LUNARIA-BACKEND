import React from 'react';
import styles from './FormModal.less';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {description && <p className={styles.sectionDesc}>{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
};