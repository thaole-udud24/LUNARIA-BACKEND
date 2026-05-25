import React from 'react';
import { connect } from 'umi';
import { Button, Card, Form, Input, Typography } from 'antd';

const { Title, Text } = Typography;

function ForgotPasswordPage(props: any) {
  const { dispatch, loading } = props;

  const onFinish = (values: any) => {
    dispatch({ type: 'auth/forgotPassword', payload: values });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <Card style={{ width: 420 }}>
        <Title level={3}>Quên mật khẩu</Title>
        <Text type="secondary">Hệ thống sẽ gửi code 4 ký tự về email (hết hạn sau 2 phút).</Text>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input placeholder="you@email.com" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Gửi mã reset
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
}))(ForgotPasswordPage);