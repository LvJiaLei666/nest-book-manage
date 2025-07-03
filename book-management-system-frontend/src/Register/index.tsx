import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import request from '../utils/request';

interface RegisterForm {
  username: string;
  password: string;
  passwordConfirm: string;
}

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterForm) => {
    try {
      setLoading(true);
      await request.post('/user/register', {
        username: values.username,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
      });
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      console.error('注册失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card title="图书管理系统 - 注册" style={{ width: 400 }}>
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="passwordConfirm"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              注册
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            已有账号？ <a onClick={() => navigate('/login')}>立即登录</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}