export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
  name?: string;
}

export interface LoginPayload {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

export const parseApiData = <T>(res: unknown): T => {
  const raw = res as { data?: T };
  return (raw?.data ?? res) as T;
};

export const extractAuthError = (error: unknown): string => {
  const err = error as {
    data?: { message?: string | string[] };
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  const nested = err?.data?.message ?? err?.response?.data?.message;
  if (Array.isArray(nested)) return nested.join(', ');
  if (typeof nested === 'string') return nested;
  return err?.message || 'Đã xảy ra lỗi, vui lòng thử lại';
};

export const parseLoginResponse = (res: unknown): LoginPayload | null => {
  const data = parseApiData<any>(res);
  const token = data?.accessToken || data?.access_token;
  const user = data?.user;
  if (!token || !user) return null;

  const roles = user.roles || (user.role ? [user.role] : ['USER']);
  return {
    accessToken: token,
    refreshToken: data?.refreshToken,
    user: {
      id: String(user.id || user._id || ''),
      email: user.email,
      roles,
      name: user.name,
    },
  };
};

export const persistAuthSession = (payload: LoginPayload) => {
  const role = payload.user.roles?.[0] || 'USER';
  localStorage.setItem('token', payload.accessToken);
  localStorage.setItem('user', JSON.stringify(payload.user));
  localStorage.setItem('role', role);
  if (payload.refreshToken) {
    localStorage.setItem('refreshToken', payload.refreshToken);
  }
};

export const getAuthRedirectPath = (role?: string) =>
  role === 'ADMIN' ? '/admin/orders' : '/home';
