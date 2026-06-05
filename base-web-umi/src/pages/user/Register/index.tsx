import React from 'react';
import { connect } from 'umi';
import { Button, Card, Form, Input, Typography } from 'antd';

const { Title } = Typography;

function RegisterPage(props: any) {
  const { dispatch, loading } = props;

  const onFinish = (values: any) => {
    dispatch({
      type: 'auth/register',
      payload: { email: values.email, password: values.password, full_name: values.full_name },
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <Card style={{ width: 380 }}>
        <Title level={3}>Đăng ký</Title>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item label="Họ tên" name="full_name">
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input placeholder="you@email.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Nhập mật khẩu' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Nhập lại mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Mật khẩu không khớp'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo tài khoản
          </Button>

          <div style={{ marginTop: 12 }}>
            <a href="/user/login">Đã có tài khoản? Đăng nhập</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default connect(({ auth }: any) => ({
  loading: auth.loading,
}))(RegisterPage);