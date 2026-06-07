import React, { useState } from 'react';
import { history } from 'umi';
import { Form, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { register as registerApi } from '@/services/TaiKhoan/auth.api';
import AuthShell from '../components/AuthShell';
import AuthFieldInput from '../components/AuthFieldInput';
import { extractAuthError, parseApiData } from '../auth.utils';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [form] = Form.useForm<RegisterFormValues>();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: RegisterFormValues) => {
    setLoading(true);
    message.destroy();

    try {
      const res = await registerApi({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      const data = parseApiData<{ message?: string; email?: string }>(res);
      message.success(data?.message || 'Đăng ký thành công! Kiểm tra email để lấy mã OTP.');

      history.push(
        `/auth/verify-email?email=${encodeURIComponent(values.email.trim())}`,
      );
    } catch (error) {
      const errMsg = extractAuthError(error);
      const email = values.email.trim();

      if (errMsg.includes('không gửi được email') || errMsg.includes('Gửi lại mã')) {
        message.warning(errMsg);
        history.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }

      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Tạo tài khoản"
      subtitle="Tham gia LURANA để nhận ưu đãi và theo dõi đơn hàng dễ dàng"
      backTo="/auth/login"
      backLabel="Quay lại đăng nhập"
      heroText="Bắt đầu hành trình chăm sóc da cùng những sản phẩm được chọn lọc dành riêng cho bạn."
    >
      <Form form={form} layout="vertical" onFinish={handleRegister} requiredMark={false}>
        <Form.Item
          name="name"
          label={<span className="auth-field-label">Họ và tên</span>}
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <AuthFieldInput icon={<UserOutlined />} placeholder="Nguyễn Văn A" autoComplete="name" />
        </Form.Item>

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

        <Form.Item
          name="password"
          label={<span className="auth-field-label">Mật khẩu</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
          ]}
        >
          <AuthFieldInput password icon={<LockOutlined />} placeholder="Tối thiểu 6 ký tự" autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<span className="auth-field-label">Xác nhận mật khẩu</span>}
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
              },
            }),
          ]}
        >
          <AuthFieldInput password icon={<LockOutlined />} placeholder="Nhập lại mật khẩu" autoComplete="new-password" />
        </Form.Item>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? (
            <>
              <LoadingOutlined spin /> Đang tạo tài khoản...
            </>
          ) : (
            'Đăng ký'
          )}
        </button>
      </Form>

      <p className="auth-footer">
        Đã có tài khoản?
        <button type="button" onClick={() => history.push('/auth/login')}>
          Đăng nhập
        </button>
      </p>
    </AuthShell>
  );
}
