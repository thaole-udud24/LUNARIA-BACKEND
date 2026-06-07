import React, { useEffect, useRef, useState } from 'react';
import { history, useLocation } from 'umi';
import { Input, message } from 'antd';
import { LoadingOutlined, MailOutlined } from '@ant-design/icons';
import { resendVerifyEmail, verifyEmail } from '@/services/TaiKhoan/auth.api';
import AuthShell from '../components/AuthShell';
import { extractAuthError, parseApiData } from '../auth.utils';

const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
  const location = useLocation();
  const emailFromUrl = new URLSearchParams(location.search).get('email') || '';
  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (emailFromUrl) setEmail(emailFromUrl);
  }, [emailFromUrl]);

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
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      message.error('Vui lòng nhập email');
      return;
    }
    setResending(true);
    try {
      const res = await resendVerifyEmail({ email: email.trim() });
      const data = parseApiData<{ message?: string }>(res);
      message.success(data?.message || 'Đã gửi lại mã xác thực');
    } catch (error) {
      message.error(extractAuthError(error));
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (!email.trim()) {
      message.error('Vui lòng nhập email');
      return;
    }
    if (code.length < OTP_LENGTH) {
      message.error(`Vui lòng nhập đủ ${OTP_LENGTH} số`);
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmail({ email: email.trim(), code });
      const data = parseApiData<{ message?: string }>(res);
      message.success(data?.message || 'Xác thực email thành công!');
      history.push('/auth/login');
    } catch (error) {
      message.error(extractAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Xác thực email"
      subtitle="Nhập mã 6 số đã gửi tới hộp thư của bạn (kiểm tra cả mục Spam)"
      backTo="/auth/register"
      backLabel="Quay lại đăng ký"
      heroText="Xác thực email giúp bảo vệ tài khoản và nhận thông báo đơn hàng kịp thời."
    >
      <div className="auth-otp-row">
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
            disabled={loading}
          />
        ))}
      </div>

      <div className="auth-form-item">
        <label className="auth-field-label" htmlFor="verify-email">
          Email đăng ký
        </label>
        <div className="auth-input-wrap">
          <MailOutlined />
          <Input
            id="verify-email"
            className="auth-input"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || Boolean(emailFromUrl)}
          />
        </div>
      </div>

      <button type="button" className="auth-submit" onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <>
            <LoadingOutlined spin /> Đang xác thực...
          </>
        ) : (
          'Xác nhận email'
        )}
      </button>

      <button
        type="button"
        className="auth-submit auth-submit--ghost"
        onClick={handleResend}
        disabled={resending || loading}
      >
        {resending ? (
          <>
            <LoadingOutlined spin /> Đang gửi lại...
          </>
        ) : (
          'Gửi lại mã'
        )}
      </button>

      <p className="auth-footer">
        Đã xác thực rồi?
        <button type="button" onClick={() => history.push('/auth/login')}>
          Đăng nhập
        </button>
      </p>
    </AuthShell>
  );
}
