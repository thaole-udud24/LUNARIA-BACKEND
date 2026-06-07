import React, { useState } from 'react';
import { Alert, Input, message } from 'antd';
import { LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { changePassword } from '@/services/TaiKhoan/auth.api';
import { extractAuthError } from '@/pages/auth/auth.utils';
import { getPasswordStrength } from '../account.utils';

const PasswordTab: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(newPass);

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      message.error('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (newPass.length < 8) {
      message.error('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    if (newPass !== confirmPass) {
      message.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword,
        newPassword: newPass,
        confirmNewPassword: confirmPass,
      });
      message.success('Đổi mật khẩu thành công');
      setCurrentPassword('');
      setNewPass('');
      setConfirmPass('');
    } catch (error) {
      message.error(extractAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-card password-tab-card">
      <div className="card-header">
        <h2>Đổi mật khẩu</h2>
        <p>Bảo vệ tài khoản bằng mật khẩu mạnh và không chia sẻ cho người khác</p>
      </div>

      <Alert
        type="info"
        showIcon
        icon={<SafetyOutlined />}
        message="Mật khẩu mới sẽ có hiệu lực ngay sau khi bạn lưu thay đổi."
        style={{ marginBottom: 24 }}
      />

      <div className="password-form-grid">
        <div className="form-field">
          <label>Mật khẩu hiện tại</label>
          <Input.Password
            prefix={<LockOutlined />}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
            size="large"
          />
        </div>

        <div className="form-field">
          <label>Mật khẩu mới</label>
          <Input.Password
            prefix={<LockOutlined />}
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Tối thiểu 8 ký tự"
            size="large"
          />
          {newPass && strength.className && (
            <div className={`password-strength password-strength--${strength.className}`}>
              Độ mạnh: {strength.label}
            </div>
          )}
        </div>

        <div className="form-field">
          <label>Xác nhận mật khẩu mới</label>
          <Input.Password
            prefix={<LockOutlined />}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            size="large"
          />
        </div>
      </div>

      <button
        type="button"
        className="account-primary-btn"
        disabled={loading}
        onClick={handleChangePassword}
      >
        {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
      </button>
    </div>
  );
};

export default PasswordTab;
