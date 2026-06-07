import React from 'react';
import { Modal } from 'antd';
import { FormFooter } from './FormFooter';
import styles from './FormModal.less';

export interface FormModalProps {
  open: boolean;
  loading?: boolean;
  mode?: 'create' | 'edit';
  title: string;
  subtitle?: string;
  width?: number;
  onCancel: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
}

export const FormModal: React.FC<FormModalProps> = ({
  open,
  loading = false,
  mode = 'create',
  title,
  subtitle,
  width = 980,
  onCancel,
  onSubmit,
  children,
}) => {
  return (
    <Modal
      title={
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      }
      width={width}
      visible={open}
      onCancel={onCancel}
      destroyOnClose
      centered
      maskClosable={false}
      className={styles.customModal}
      footer={
        <FormFooter 
          mode={mode} 
          loading={loading} 
          onCancel={onCancel} 
          onSubmit={onSubmit} 
        />
      }
    >
      {children}
    </Modal>
  );
};