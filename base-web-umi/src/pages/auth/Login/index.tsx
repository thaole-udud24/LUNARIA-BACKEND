// import styles from './index.less';
import React, { useState } from 'react';
import { history } from 'umi';
import { message } from 'antd';
import { login as loginApi } from '@/services/TaiKhoan/auth.api';
import useAuth from '@/hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return message.error('Vui lòng nhập đầy đủ!');
    setLoading(true);
    message.destroy(); 

    try {
      const res: any = await loginApi({ email, password });
      
      console.log("🔥 [DEBUG] DỮ LIỆU TỪ BACKEND TRẢ VỀ:", res);

      // Nếu Axios bọc dữ liệu trong trường 'data'
      const data = res?.data || res;

      // Nếu Backend cố tình trả về 200 nhưng kèm thông báo lỗi (ví dụ: success: false)
      if (data && data.success === false) {
        setLoading(false);
        return message.error(data.message || 'Lỗi từ server!');
      }

      // Quét tìm accessToken ở mọi tầng dữ liệu
      const token = data?.accessToken || data?.data?.accessToken || res?.accessToken;
      
      if (!token) {
        setLoading(false);
        return message.error('Đăng nhập được rồi nhưng FE không tìm thấy Token (Vui lòng F12 xem Console)');
      }

      // Quét tìm user data
      const userData = data?.user || data?.data?.user || res?.user || { email, roles: ['ADMIN'] };
      const role = userData?.roles?.[0] || 'ADMIN';

      // Lưu trữ
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', role);

      message.success('Đăng nhập thành công!');
      
      // Điều hướng
      history.push(role === 'ADMIN' ? '/admin/orders' : '/home');
      
    } catch (error: any) {
      console.error("🔥 [DEBUG] LỖI CATCH:", error);
      // Hiển thị ĐÚNG lỗi do Backend ném ra thay vì câu fix cứng "Sai email hoặc mật khẩu"
      const errMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra, F12 xem Console!';
      message.error(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login"> 
      <div className="auth-container">
        {/* LEFT */}
        <div className="auth-left" >
          <div className="auth-overlay">
            <h1>LUNARIA</h1>
            <p>
              Mỗi buổi sáng là một khởi đầu mới, khi làn da cần được đánh thức
              bằng sự dịu dàng.
            </p>
            <button onClick={() => history.push('/products')}>Mua ngay</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form">
            <div className="auth-top">
              <button className="auth-back" onClick={() => history.push('/home')}>← Trở lại</button>
            </div>

            <h2>Chào mừng trở lại</h2>
            <p className="auth-desc">
              Nhập thông tin để truy cập tài khoản của bạn
            </p>

            <button className="auth-google" onClick={() => message.info('Tính năng đăng nhập bằng Google đang được bảo trì...')}>
              🔵 Sign up with Google
            </button>

            <div className="auth-divider">Or use email</div>

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading} 
            />

            <div className="auth-forgot" onClick={() => history.push('/auth/forgot-password')}>Quên mật khẩu?</div>

            <button 
              className="auth-loginBtn" 
              onClick={handleLogin}
              disabled={loading} 
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>

            <p className="auth-register">
              Bạn chưa có tài khoản? <span onClick={() => history.push('/auth/register')}>Tạo tài khoản</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}