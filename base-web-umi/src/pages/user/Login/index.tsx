import React from 'react';
import { useDispatch, useSelector } from 'umi';
import { Button, Card, Form, Input, Typography } from 'antd';

const { Title, Text } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();

  // lấy loading từ model auth
  const loading = useSelector((state: any) => state.auth.loading);

  const onFinish = (values: any) => {
    dispatch({
      type: 'auth/login',
      payload: values,
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Card style={{ width: 380 }}>
        <Title level={3}>Đăng nhập</Title>
        <Text type="secondary">Đăng nhập bằng email thật để test.</Text>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="you@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Nhập mật khẩu' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <a href="/user/register">Đăng ký</a>
            <a href="/user/forgot-password">Quên mật khẩu?</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}