import React from 'react';
import { Button } from 'antd';
import styles from './FormModal.less';

export interface FormFooterProps {
  mode: 'create' | 'edit';
  loading?: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const FormFooter: React.FC<FormFooterProps> = ({ mode, loading, onCancel, onSubmit }) => {
  return (
    <div className={styles.footer}>
      <Button className={styles.btnCancel} onClick={onCancel} disabled={loading}>
        Hủy bỏ
      </Button>
      <Button
        type="primary"
        className={styles.btnSubmit}
        onClick={onSubmit}
        loading={loading}
      >
        {mode === 'create' ? 'Tạo mới' : 'Lưu thay đổi'}
      </Button>
    </div>
  );
};