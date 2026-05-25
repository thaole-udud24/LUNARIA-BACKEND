import { request, safeRequest } from '../base/request';
import type { ApiResponse } from '../base/types';
import type { ForgotPasswordBody, LoginBody, LoginResult, RegisterBody, ResetPasswordBody } from './types';

export async function apiLogin(body: LoginBody) {
  return safeRequest(
    request.post<ApiResponse<LoginResult>>('/auth/login', { data: body }),
  );
}

export async function apiRegister(body: RegisterBody) {
  return safeRequest(
    request.post<ApiResponse<LoginResult>>('/auth/register', { data: body }),
  );
}

export async function apiForgotPassword(body: ForgotPasswordBody) {
  return safeRequest(
    request.post<ApiResponse<{ ok: true }>>('/auth/forgot-password', { data: body }),
  );
}

export async function apiResetPassword(body: ResetPasswordBody) {
  return safeRequest(
    request.post<ApiResponse<{ ok: true }>>('/auth/reset-password', { data: body }),
  );
}

export async function apiMe() {
  return safeRequest(
    request.get<ApiResponse<{ user: any }>>('/auth/me'),
  );
}

export async function apiLogout() {
  return safeRequest(
    request.post<ApiResponse<{ ok: true }>>('/auth/logout'),
  );
}