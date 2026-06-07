import React, { useState } from 'react';
import { history } from 'umi';
import { Form, message } from 'antd';
import { MailOutlined, LoadingOutlined } from '@ant-design/icons';
import { forgotPassword } from '@/services/TaiKhoan/auth.api';
import AuthShell from '../components/AuthShell';
import AuthFieldInput from '../components/AuthFieldInput';
import { extractAuthError, parseApiData } from '../auth.utils';

export default function ForgotPasswordPage() {
  const [form] = Form.useForm<{ email: string }>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    try {
      const res = await forgotPassword({ email: values.email.trim() });
      const data = parseApiData<{ message?: string }>(res);
      message.success(data?.message || 'Nếu email tồn tại, mã đặt lại mật khẩu đã được gửi');
      history.push(`/auth/verify-code?email=${encodeURIComponent(values.email.trim())}`);
    } catch (error) {
      message.error(extractAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Quên mật khẩu"
      subtitle="Nhập email để nhận mã xác minh đặt lại mật khẩu"
      backTo="/auth/login"
      backLabel="Quay lại đăng nhập"
      heroText="Chúng tôi sẽ giúp bạn lấy lại quyền truy cập tài khoản một cách an toàn."
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          name="email"
          label={<span className="auth-field-label">Email</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <AuthFieldInput icon={<MailOutlined />} placeholder="email@example.com" autoComplete="email" />
        </Form.Item>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? (
            <>
              <LoadingOutlined spin /> Đang gửi...
            </>
          ) : (
            'Gửi mã xác minh'
          )}
        </button>
      </Form>

      <p className="auth-footer">
        Nhớ mật khẩu?
        <button type="button" onClick={() => history.push('/auth/login')}>
          Đăng nhập ngay
        </button>
      </p>
    </AuthShell>
  );
}
