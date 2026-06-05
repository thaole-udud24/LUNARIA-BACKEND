import request from '@/services/base/request';

// ==============================
// AUTHENTICATION
// ==============================

export async function login(data: { email: string; password: string }) {
  return request('/api/auth/login', {
    method: 'POST',
    data,
  });
}

export async function logout() {
  return request('/api/auth/logout', {
    method: 'POST',
  });
}

export async function me() {
  return request('/api/users/me', {
    method: 'GET',
  });
}

// ==============================
// REGISTRATION
// ==============================

export async function register(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;  // ← thêm field này
}) {
  return request('/api/auth/register', {
    method: 'POST',
    data,
  });
}

// ==============================
// FORGOT & RESET PASSWORD
// ==============================

export async function forgotPassword(data: { email: string }) {
  return request('/api/auth/forgot-password', {
    method: 'POST',
    data,
  });
}

export async function verifyCode(data: { email: string; code: string }) {
  return request('/api/auth/verify-code', {
    method: 'POST',
    data,
  });
}

export async function resendCode(data: { email: string }) {
  return request('/api/auth/resend-code', {
    method: 'POST',
    data,
  });
}

export async function resetPassword(data: {
  email: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  return request('/api/auth/reset-password', {
    method: 'POST',
    data,
  });
}