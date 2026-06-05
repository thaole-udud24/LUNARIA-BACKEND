import { request } from 'umi';

// API lấy thông tin người dùng hiện tại (Profile)
export async function getCurrentUser() {
  return request('/api/users/me', {
    method: 'GET',
  });
}

// API cập nhật thông tin cá nhân
export async function updateProfile(data: any) {
  return request('/api/users/update-profile', {
    method: 'PATCH',
    data,
  });
}

// API thêm địa chỉ
export async function addAddress(data: any) {
  return request('/api/users/add-address', {
    method: 'POST',
    data,
  });
}