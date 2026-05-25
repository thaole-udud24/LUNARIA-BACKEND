import { apiLogin, apiRegister, apiForgotPassword, apiResetPassword, apiMe, apiLogout } from '@/services/TaiKhoan';

export const AuthService = {
  login: apiLogin,
  register: apiRegister,
  forgotPassword: apiForgotPassword,
  resetPassword: apiResetPassword,
  me: apiMe,
  logout: apiLogout,
};