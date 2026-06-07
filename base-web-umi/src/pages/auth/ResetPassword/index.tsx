import React, { useState } from 'react';
import { history, useLocation } from 'umi';
import { Form, Input, message } from 'antd';
import { LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { resetPassword } from '@/services/TaiKhoan/auth.api';
import AuthShell from '../components/AuthShell';
import AuthFieldInput from '../components/AuthFieldInput';
import { extractAuthError, parseApiData } from '../auth.utils';

export default function ResetPasswordPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';
  const code = (params.get('code') || '').trim();
  const [form] = Form.useForm<{ newPassword: string; confirmNewPassword: string }>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { newPassword: string; confirmNewPassword: string }) => {
    if (!email || !code) {
      message.error('Thiếu email hoặc mã xác minh — vui lòng thử lại từ đầu');
      history.push('/auth/forgot-password');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        email: email.trim(),
        code,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });
      const data = parseApiData<{ message?: string }>(res);
      message.success(data?.message || 'Đặt lại mật khẩu thành công');
      history.push('/auth/reset-success');
    } catch (error) {
      message.error(extractAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Đặt lại mật khẩu"
      subtitle="Tạo mật khẩu mới an toàn cho tài khoản của bạn"
      backTo="/auth/verify-code"
      backLabel="Quay lại nhập mã"
    >
      <div className="auth-form-item">
        <label className="auth-field-label">Email</label>
        <Input className="auth-input" value={email} disabled style={{ borderRadius: 14, minHeight: 48 }} />
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          name="newPassword"
          label={<span className="auth-field-label">Mật khẩu mới</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
          ]}
        >
          <AuthFieldInput password icon={<LockOutlined />} placeholder="Tối thiểu 6 ký tự" autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          name="confirmNewPassword"
          label={<span className="auth-field-label">Xác nhận mật khẩu</span>}
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
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
              <LoadingOutlined spin /> Đang cập nhật...
            </>
          ) : (
            'Cập nhật mật khẩu'
          )}
        </button>
      </Form>
    </AuthShell>
  );
}
