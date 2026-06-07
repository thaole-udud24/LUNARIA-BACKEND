import { extend } from 'umi-request';
import { message } from 'antd';
import { history } from 'umi';
import { getRequestPrefix } from '@/utils/apiUrl';

const request = extend({
  prefix: getRequestPrefix(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },

  errorHandler: (error) => {
    const { response } = error;

    if (response && response.status) {
      if (response.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
        localStorage.removeItem('token');

        if (history.location.pathname !== '/auth/login') {
          history.push('/auth/login');
        }
      } else if (response.status >= 500) {
        message.error('Lỗi máy chủ Backend, vui lòng thử lại sau!');
      }
    } else {
      message.error('Không thể kết nối đến máy chủ!');
    }

    throw error;
  },
});

request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token');
  const headers: any = { ...options.headers };

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

request.interceptors.response.use(async (response) => response);

export default request;
