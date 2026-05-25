import React, { useState } from 'react';
import { history, useLocation } from 'umi';
import { message } from 'antd';
import { resetPassword } from '@/services/TaiKhoan/auth.api';

export default function ResetPassword() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';
  const code = (params.get('code') || '').trim();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const pwd = password.trim();
    const confirmPwd = confirmPassword.trim();

    if (!pwd || !confirmPwd) {
      return message.error('Vui lòng nhập đầy đủ thông tin');
    }

    if (pwd !== confirmPwd) {
      return message.error('Mật khẩu không khớp');
    }

    setLoading(true);

    try {
        const res = await resetPassword({
        email,
        password: pwd,
      });

      console.log('RES:', res);

      if (!res?.success) {
        message.error(res?.message || 'Đổi mật khẩu thất bại');
        return;
      }

      message.success('Đổi mật khẩu thành công');

      // chuyển sang trang thành công (hoặc login)
      history.push('/auth/reset-success');
    } catch (err) {
      message.error('Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-overlay">
            <h1>LUNARIA</h1>
            <p>Thiết lập mật khẩu mới cho tài khoản của bạn</p>
            <button>Mua ngay</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form">

            <button
              className="auth-back"
              onClick={() => history.push('/auth/login')}
            >
              ← Trở lại
            </button>

            <h2>Reset Password</h2>
            <p className="auth-desc">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>

            <input
              type="email"
              value={email}
              disabled
            />

            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="auth-loginBtn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>

            <p className="auth-register">
              Quay lại?{' '}
              <span onClick={() => history.push('/auth/login')}>
                Đăng nhập
              </span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}