import { extend } from 'umi-request';

const request = extend({
  prefix: '',

  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
  },

  errorHandler: (error) => {
    console.error('API ERROR:', error);

    throw error;
  },
});

// =========================
// REQUEST INTERCEPTOR
// =========================

request.interceptors.request.use(
  (url, options) => {
    const token =
      localStorage.getItem('token');

    return {
      url,
      options: {
        ...options,
        headers: {
          ...options.headers,
          Authorization: token
            ? `Bearer ${token}`
            : '',
        },
      },
    };
  },
);

// =========================
// RESPONSE INTERCEPTOR
// =========================

request.interceptors.response.use(
  async (response) => {
    return response;
  },
);

export default request;