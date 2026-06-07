import { extend } from 'umi-request';
import { message } from 'antd';
import { history } from 'umi';
import { getRequestPrefix, buildApiUrl } from '@/utils/apiUrl';
import { AUTH_SESSION_EVENT } from '@/pages/auth/auth.utils';

const AUTH_PUBLIC_API_PATTERN =
  /\/api\/auth\/(login|register|verify-email|resend-verify-email|forgot-password|reset-password|refresh)(\/|$|\?)/;

let refreshPromise: Promise<string | null> | null = null;

const tryRefreshToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const storedRefresh = localStorage.getItem('refreshToken');
    if (!storedRefresh) return null;

    try {
      const res = await fetch(buildApiUrl('/api/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefresh }),
      });

      if (!res.ok) return null;

      const body = await res.json();
      const payload = body?.data ?? body;
      const accessToken = payload?.accessToken || payload?.access_token;
      const newRefresh = payload?.refreshToken || payload?.refresh_token;

      if (!accessToken) return null;

      localStorage.setItem('token', accessToken);
      if (newRefresh) {
        localStorage.setItem('refreshToken', newRefresh);
      }
      window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT));
      return accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const request = extend({
  prefix: getRequestPrefix(),
  timeout: 30000,

  errorHandler: async (error) => {
    const { response, request: reqMeta } = error;
    const requestUrl = String(reqMeta?.url || error?.url || '');
    const isAuthPublicRequest = AUTH_PUBLIC_API_PATTERN.test(requestUrl);
    const isOnAuthPage =
      typeof window !== 'undefined' && window.location.pathname.startsWith('/auth');
    const alreadyRetried = Boolean((reqMeta as { _retried?: boolean })?._retried);

    if (response && response.status) {
      if (response.status === 401) {
        if (!isAuthPublicRequest && !isOnAuthPage && !alreadyRetried) {
          const newToken = await tryRefreshToken();
          if (newToken) {
            const retryOptions = {
              ...(reqMeta?.options || {}),
              _retried: true,
              headers: {
                ...(reqMeta?.options?.headers as Record<string, string>),
                Authorization: `Bearer ${newToken}`,
              },
            };
            return request(requestUrl, retryOptions);
          }

          message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');

          if (history.location.pathname !== '/auth/login') {
            history.push('/auth/login');
          }
        }
      } else if (response.status >= 500) {
        message.error('Lỗi máy chủ Backend, vui lòng thử lại sau!');
      }
    } else if (!isAuthPublicRequest) {
      message.error('Không thể kết nối đến máy chủ!');
    }

    throw error;
  },
});

request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token');
  const isFormUpload =
    options.data instanceof FormData ||
    options.requestType === 'form';

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!isFormUpload) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  } else {
    delete headers['Content-Type'];
    delete headers['content-type'];
  }

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

export default request;
