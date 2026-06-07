import React, { useState } from 'react';
import { Alert, Input, message } from 'antd';
import { LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { forgotPassword, resetPassword } from '@/services/TaiKhoan/auth.api';
import { getPasswordStrength } from '../account.utils';

interface PasswordTabProps {
  email: string;
}

const PasswordTab: React.FC<PasswordTabProps> = ({ email }) => {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [code, setCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(newPass);

  const handleSendCode = async () => {
    if (!email) {
      message.error('Không tìm thấy email tài khoản');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword({ email });
      message.success('Mã xác nhận đã được gửi đến email của bạn');
      setStep('reset');
    } catch {
      message.error('Không thể gửi mã xác nhận. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!code.trim()) {
      message.error('Vui lòng nhập mã xác nhận');
      return;
    }
    if (newPass.length < 6) {
      message.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPass !== confirmPass) {
      message.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email,
        code: code.trim(),
        newPassword: newPass,
        confirmNewPassword: confirmPass,
      });
      message.success('Đổi mật khẩu thành công');
      setCode('');
      setNewPass('');
      setConfirmPass('');
      setStep('request');
    } catch {
      message.error('Mã xác nhận không đúng hoặc đã hết hạn');
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
        message="Xác thực qua email"
        description="Hệ thống gửi mã xác nhận về email đăng ký để đổi mật khẩu an toàn."
        className="password-alert"
      />

      {step === 'request' ? (
        <div className="password-form">
          <div className="form-group col-12">
            <label>Email tài khoản</label>
            <Input size="large" prefix={<MailOutlined />} value={email} disabled />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-save" onClick={handleSendCode} disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
            </button>
          </div>
        </div>
      ) : (
        <div className="password-form">
          <div className="form-group col-12">
            <label>Mã xác nhận từ email</label>
            <Input
              size="large"
              prefix={<LockOutlined />}
              placeholder="Nhập mã 6 số"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="form-group col-12">
            <label>Mật khẩu mới</label>
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu mới"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            {newPass && (
              <div className={`password-strength password-strength--${strength.className}`}>
                <div className="password-strength__bar">
                  <span style={{ width: `${(strength.score / 4) * 100}%` }} />
                </div>
                <em>Độ mạnh: {strength.label}</em>
              </div>
            )}
          </div>

          <div className="form-group col-12">
            <label>Xác nhận mật khẩu mới</label>
            <Input.Password
              size="large"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </div>

          <div className="form-actions form-actions--split">
            <button type="button" className="btn-outline" onClick={() => setStep('request')}>
              Quay lại
            </button>
            <button type="button" className="btn-save" onClick={handleReset} disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordTab;
