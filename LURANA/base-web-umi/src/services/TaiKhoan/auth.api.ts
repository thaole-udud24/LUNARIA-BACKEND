import request from 'umi-request';

export async function login(data: {
  email: string;
  password: string;
}) {
  return request('/api/auth/login', {
    method: 'POST',
    data,
  });
}

// REGESTER 
export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  return request('/api/auth/register', {
    method: 'POST',
    data,
  });
}

// forgot password 

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

// reset password
export async function resetPassword(data: {
  email: string;
  password: string;
}) {
  return request('/api/auth/reset-password', {
    method: 'POST',
    data,
  });
}