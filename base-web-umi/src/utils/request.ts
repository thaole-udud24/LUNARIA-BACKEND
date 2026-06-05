import { message } from 'antd';
import instance from './axios';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: any;
  data?: any;
  headers?: any;
}

const request = async (url: string, options: RequestOptions = {}) => {
  const { method = 'GET', params, data, headers } = options;

  try {
    const response = await instance({
      url,
      method,
      params,
      data,
      headers,
    });
    
    return response.data;
  } catch (error: any) {
    const response = error.response;
    
    if (response) {
      const status = response.status;
      const errorMessage = response.data?.message || 'Đã xảy ra lỗi hệ thống';

      switch (status) {
        case 401:
          message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
          localStorage.removeItem('token');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          message.error('Bạn không có quyền truy cập vào tính năng này');
          break;
        case 400:
          message.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
          break;
        case 404:
          message.error('Không tìm thấy dữ liệu yêu cầu');
          break;
        case 500:
          message.error('Lỗi máy chủ nội bộ, vui lòng thử lại sau');
          break;
        default:
          message.error(errorMessage);
      }
    } else {
      message.error('Không thể kết nối đến máy chủ, vui lòng kiểm tra mạng');
    }
    
    throw error;
  }
};

export default request;