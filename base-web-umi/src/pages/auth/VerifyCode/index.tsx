import React, { useState, useRef } from 'react';
import { history, useLocation } from 'umi';
import { message } from 'antd';
import { verifyCode, resendCode } from '@/services/TaiKhoan/auth.api';

export default function VerifyCode() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const location = useLocation();
  const emailFromUrl = new URLSearchParams(location.search).get('email');
  const [email, setEmail] = useState(emailFromUrl || '');
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<any[]>([]);

  const handleChange = (value: string, index: number) => {
    const val = value.slice(-1);

    if (!/^[0-9]?$/.test(val)) return;
    
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // auto focus next
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    console.log("CODE FINAL:", code);

    if (code.length < 4 || !email) {
      return message.error('Nhập đầy đủ thông tin');
    }

    setLoading(true);

    try {
      const res = await verifyCode({ email, code });
      console.log("VERIFY RESPONSE:", res);

      if (res && res.success === false) {
        setLoading(false);
        message.error(res?.message || 'Xác thực thất bại');
        return;
      }

      message.success('Xác thực thành công');

      // chuyển sang reset password
      history.push(
        `/auth/reset-password?email=${encodeURIComponent(email)}&code=${code}`
      );

      return; 
    } catch (err) {
      message.error('Lỗi hệ thống');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      return message.error('Nhập email trước');
    }

    await resendCode({ email });
    message.success('Đã gửi lại mã');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-overlay">
            <h1>LUNARIA</h1>
            <p>
              Chúng tôi đã gửi mã xác nhận đến email của bạn.
            </p>
            <button>Mua ngay</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form">

            <button
              className="auth-back"
              onClick={() => history.push('/auth/forgot-password')}
            >
              ← Trở lại
            </button>

            <h2>Enter Code</h2>
            <p className="auth-desc">
              Chúng tôi đã gửi mã xác nhận vào email của bạn
            </p>

            {/* OTP INPUT */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  value={digit}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e.target.value, index)}
                  maxLength={1}
                  style={{
                    width: 60,
                    height: 60,
                    textAlign: 'center',
                    fontSize: 20,
                  }}
                />
              ))}
            </div>

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
              {loading ? 'Đang xác thực...' : 'Thiết lập lại mật khẩu'}
            </button>

            <button
              style={{
                width: '100%',
                marginTop: 10,
                padding: 10,
                border: '1px solid #ccc',
                background: '#fff',
                cursor: 'pointer',
              }}
              onClick={handleResend}
            >
              Gửi lại
            </button>

            <p className="auth-register">
              Trở lại?{' '}
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