import { extend } from 'umi-request';
import { message } from 'antd';
import { history } from 'umi';

const request = extend({
  prefix: '', // Để trống nếu bạn dùng proxy trong file config, hoặc điền 'http://localhost:3000' nếu gọi trực tiếp
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  
  // =========================
  // GLOBAL ERROR HANDLER
  // =========================
  errorHandler: (error) => {
    const { response } = error;
    
    if (response && response.status) {
      // Nếu lỗi 401 -> Hết phiên đăng nhập -> Xóa token và bắt đăng nhập lại
      if (response.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
        localStorage.removeItem('token');
        
        // Tránh bị loop redirect nếu đang ở sẵn trang login
        if (history.location.pathname !== '/auth/login') {
          history.push('/auth/login');
        }
      } else if (response.status >= 500) {
        message.error('Lỗi máy chủ Backend, vui lòng thử lại sau!');
      }
    } else {
      // Lỗi không có response (Ví dụ: Backend sập, đứt cáp mạng...)
      message.error('Không thể kết nối đến máy chủ!');
    }

    throw error;
  },
});

// =========================
// REQUEST INTERCEPTOR
// =========================
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token');
  
  // Clone lại headers cũ để không bị mất các cấu hình mặc định
  const headers: any = { ...options.headers };

  // CHỈ thêm Authorization khi có Token thật sự
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    url,
    options: {
      ...options,
      headers,
    },
  };
});

// =========================
// RESPONSE INTERCEPTOR
// =========================
request.interceptors.response.use(async (response) => {
  // Bạn có thể format lại data trả về ở đây nếu Backend bọc quá nhiều tầng (VD: res.data.data)
  return response;
});

export default request;