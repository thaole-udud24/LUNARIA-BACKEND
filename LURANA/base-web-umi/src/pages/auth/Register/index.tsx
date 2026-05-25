import React, { useState } from 'react';
import { history } from 'umi';
import { message } from 'antd';
import { register as registerApi } from '@/services/TaiKhoan/auth.api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    const { name, email, password } = form;

    if (!name || !email || !password) {
      return message.error('Vui lòng nhập đầy đủ thông tin');
    }

    setLoading(true);

    try {
      const res = await registerApi({ name, email, password });

      if (!res.success) {
        return message.error(res.message);
      }

      message.success(res.message);
      history.push('/auth/login');
    } catch (error) {
      message.error('Lỗi hệ thống');
    }

    setLoading(false);
  };

  return (
    <div className="auth-page register">
      <div className="auth-container">

        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-overlay">
            <h1>LUNARIA</h1>
            <p>
              Mỗi buổi sáng là một khởi đầu mới, khi làn da cần được đánh thức
              bằng sự dịu dàng.
            </p>
            <button onClick={() => history.push('/products')}>Mua ngay</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form">

            <button
              className="auth-back"
              onClick={() => history.push('/home')}
            >
              ← Trở lại
            </button>

            <h2>TẠO TÀI KHOẢN CỦA BẠN</h2>
            <p className="auth-desc">
              Tạo tài khoản mua sắm của bạn
            </p>

            <button className="auth-google" onClick={() => message.info('Tính năng đăng ký bằng Google đang được bảo trì...')}>
              🔵 Sign up with Google
            </button>

            <div className="auth-divider">Or use email</div>

            <input
              name="name"
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
            />

            <button
              className="auth-loginBtn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>

            <p className="auth-register">
              Bạn đã có tài khoản?{' '}
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
