// 1. Dùng import default (không có ngoặc nhọn)
import request from '../base/request';

// Nếu file types.ts của bạn đang bị lỗi, chúng ta tạm thời dùng 'any' cho dữ liệu 
// để đảm bảo ứng dụng chạy mượt mà trước, việc rèn dũa Type chặt chẽ có thể làm sau.

// =========================================================
// API DÀNH CHO KHÁCH HÀNG (END-USER)
// =========================================================

export async function getMe() {
  return request('/api/users/me', { method: 'GET' });
}

export async function apiUpdateProfile(body: any) {
  // Thay .patch bằng việc gọi request chuẩn của Umi, dùng method PUT cho khớp Backend
  return request('/api/users/me', { 
    method: 'PUT', 
    data: body 
  });
}

// ... Các API như addPhone, updateAddress... của user bạn có thể viết thêm vào đây

// =========================================================
// API DÀNH CHO ADMIN QUẢN LÝ KHÁCH HÀNG
// =========================================================

/**
 * 1. Lấy danh sách khách hàng (Có phân trang, tìm kiếm)
 */
export async function getAdminUsers(params: { page: number; limit: number; search?: string }) {
  return request('/api/admin/users', {
    method: 'GET',
    params,
  });
}

/**
 * 2. Lấy hồ sơ chi tiết Khách hàng 360°
 */
export async function getAdminUserDetail(userId: string) {
  return request(`/api/admin/users/${userId}`, {
    method: 'GET',
  });
}

/**
 * 3. Xuất file Excel danh sách khách hàng
 */
export async function exportUsersAdmin(params?: any) {
  return request('/api/admin/users/export', {
    method: 'GET',
    params,
    responseType: 'blob', 
  });
}