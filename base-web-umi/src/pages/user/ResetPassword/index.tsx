import React, { useMemo } from 'react';
import { connect, useLocation } from 'umi';
import { Button, Card, Form, Input, Typography } from 'antd';

const { Title, Text } = Typography;

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function ResetPasswordPage(props: any) {
  const { dispatch, loading } = props;
  const query = useQuery();
  const emailFromQuery = query.get('email') || '';

  const onFinish = (values: any) => {
    dispatch({
      type: 'auth/resetPassword',
      payload: {
        email: values.email,
        code: values.code,
        newPassword: values.newPassword,
      },
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <Card style={{ width: 420 }}>
        <Title level={3}>Đặt lại mật khẩu</Title>
        <Text type="secondary">Nhập email + code 4 ký tự + mật khẩu mới.</Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 16 }}
          initialValues={{ email: emailFromQuery }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input placeholder="you@email.com" />
          </Form.Item>

          <Form.Item
            label="Code (4 ký tự)"
            name="code"
            rules={[{ required: true, message: 'Nhập code' }, { len: 4, message: 'Code phải đúng 4 ký tự' }]}
          >
            <Input placeholder="1234" maxLength={4} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: 'Nhập mật khẩu mới' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Đổi mật khẩu
          </Button>

          <div style={{ marginTop: 12 }}>
            <a href="/user/login">Quay lại đăng nhập</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default connect(({ auth }: any) => ({
  loading: auth.loading,
}))(ResetPasswordPage);