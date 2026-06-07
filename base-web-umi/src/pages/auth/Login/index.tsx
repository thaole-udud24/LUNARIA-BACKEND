import React, { useState } from 'react';
import { history, useLocation } from 'umi';
import { Form, message } from 'antd';
import { MailOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { login as loginApi } from '@/services/TaiKhoan/auth.api';
import AuthShell from '../components/AuthShell';
import AuthFieldInput from '../components/AuthFieldInput';
import {
  extractAuthError,
  parseLoginResponse,
  persistAuthSession,
  resolvePostLoginPath,
} from '../auth.utils';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form] = Form.useForm<LoginFormValues>();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    message.destroy();

    try {
      const res = await loginApi({
        email: values.email.trim(),
        password: values.password,
      });

      const payload = parseLoginResponse(res);
      if (!payload) {
        message.error('Đăng nhập thất bại — không nhận được token từ server');
        return;
      }

      persistAuthSession(payload);
      message.success('Đăng nhập thành công!');
      history.replace(resolvePostLoginPath(payload.user.roles, location.search));
    } catch (error) {
      const msg = extractAuthError(error);
      if (msg.includes('EMAIL_NOT_VERIFIED') || msg.includes('xác thực email')) {
        message.warning('Tài khoản chưa xác thực email. Vui lòng nhập mã OTP.');
        history.push(`/auth/verify-email?email=${encodeURIComponent(values.email.trim())}`);
        return;
      }
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để tiếp tục mua sắm và theo dõi đơn hàng của bạn"
      backTo="/home"
      backLabel="Trở lại trang chủ"
    >
      <Form form={form} layout="vertical" onFinish={handleLogin} requiredMark={false}>
        <Form.Item
          name="email"
          label={<span className="auth-field-label">Email</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <AuthFieldInput
            icon={<MailOutlined />}
            placeholder="email@example.com"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span className="auth-field-label">Mật khẩu</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
          ]}
        >
          <AuthFieldInput
            password
            icon={<LockOutlined />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Form.Item>

        <div className="auth-link-row">
          <span />
          <button type="button" onClick={() => history.push('/auth/forgot-password')}>
            Quên mật khẩu?
          </button>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? (
            <>
              <LoadingOutlined spin /> Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </Form>

      <p className="auth-footer">
        Chưa có tài khoản?
        <button type="button" onClick={() => history.push('/auth/register')}>
          Đăng ký ngay
        </button>
      </p>
    </AuthShell>
  );
}
