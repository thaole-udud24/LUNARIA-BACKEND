import React, { useRef, useState } from 'react';
import { history, useLocation } from 'umi';
import { Input, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import AuthShell from '../components/AuthShell';

const OTP_LENGTH = 4;

export default function VerifyCodePage() {
  const location = useLocation();
  const emailFromUrl = new URLSearchParams(location.search).get('email') || '';
  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join('');
    if (!email.trim()) {
      message.error('Vui lòng nhập email');
      return;
    }
    if (code.length < OTP_LENGTH) {
      message.error(`Vui lòng nhập đủ ${OTP_LENGTH} số`);
      return;
    }

    history.push(
      `/auth/reset-password?email=${encodeURIComponent(email.trim())}&code=${code}`,
    );
  };

  return (
    <AuthShell
      title="Nhập mã xác minh"
      subtitle="Nhập mã 4 số gửi tới email của bạn để đặt lại mật khẩu"
      backTo="/auth/forgot-password"
      backLabel="Quay lại"
      heroText="Mã xác minh có hiệu lực trong thời gian ngắn — vui lòng hoàn tất sớm."
    >
      <div className="auth-otp-row auth-otp-row--4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            value={digit}
            inputMode="numeric"
            maxLength={1}
            onChange={(e) => handleOtpChange(e.target.value, index)}
            onKeyDown={(e) => handleOtpKeyDown(e, index)}
          />
        ))}
      </div>

      <div className="auth-form-item">
        <label className="auth-field-label" htmlFor="reset-email">
          Email
        </label>
        <div className="auth-input-wrap">
          <MailOutlined />
          <Input
            id="reset-email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>
      </div>

      <button type="button" className="auth-submit" onClick={handleSubmit}>
        Tiếp tục đặt lại mật khẩu
      </button>

      <p className="auth-footer">
        <button type="button" onClick={() => history.push('/auth/login')}>
          Quay lại đăng nhập
        </button>
      </p>
    </AuthShell>
  );
}
