import { request, safeRequest } from '../base/request';
import type { ApiResponse } from '../base/types';
import type { UserMe } from './types';

export async function apiUpdateProfile(body: Partial<UserMe>) {
  return safeRequest(
    request.patch<ApiResponse<{ user: UserMe }>>('/users/me', { data: body }),
  );
}