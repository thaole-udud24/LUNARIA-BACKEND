import React, { useState } from 'react';
import { history } from 'umi';
import { message } from 'antd';
import { forgotPassword } from '@/services/TaiKhoan/auth.api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      return message.error('Vui lòng nhập email');
    }

    setLoading(true);

    try {
      const res = await forgotPassword({ email });
      console.log("API RESPONSE:", res);

      if (!res || res.success === false) {
      message.error(res?.message || 'Có lỗi xảy ra');
      return;
      }

      message.success('Đã gửi email xác nhận');

      localStorage.setItem('resetEmail', email);

      //  CHUYỂN SANG ENTER CODE + truyền email
      history.push(`/auth/verify-code?email=${encodeURIComponent(email)}`);

    } catch (err) {
      console.log("ERROR FULL:", err); 
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
            <p>
              Chúng tôi sẽ giúp bạn lấy lại quyền truy cập nhanh chóng.
            </p>
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

            <h2>Quên mật khẩu</h2>
            <p className="auth-desc">
              Nhập email để nhận link đặt lại mật khẩu
            </p>

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="auth-loginBtn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
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