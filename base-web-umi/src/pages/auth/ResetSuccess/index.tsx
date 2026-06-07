import React from 'react';
import { history } from 'umi';
import { CheckCircleFilled } from '@ant-design/icons';
import AuthShell from '../components/AuthShell';

export default function ResetSuccessPage() {
  return (
    <AuthShell
      title="Hoàn tất!"
      subtitle="Mật khẩu của bạn đã được cập nhật thành công"
      backTo="/auth/login"
      backLabel="Đăng nhập"
    >
      <div className="success-box" style={{ marginTop: 0 }}>
        <div className="success-icon" style={{ border: 'none', color: '#52c41a', fontSize: 56 }}>
          <CheckCircleFilled />
        </div>
        <p className="success-desc">Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.</p>
        <button type="button" className="auth-submit" onClick={() => history.push('/auth/login')}>
          Đăng nhập ngay
        </button>
      </div>
    </AuthShell>
  );
}
