import request from '@/services/base/request';

export type AppLocale = 'vi-VN' | 'en-US';

export interface NotificationPrefs {
  emailAlerts: boolean;
  pushAlerts: boolean;
  newOrderAlerts: boolean;
  cancelOrderAlerts: boolean;
}

export interface RegionalPrefs {
  timezone: string;
  dateFormat: string;
  currency: string;
}

export interface UserPreferences {
  locale: AppLocale;
  notification_prefs: NotificationPrefs;
  regional_prefs: RegionalPrefs;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  emailAlerts: true,
  pushAlerts: true,
  newOrderAlerts: true,
  cancelOrderAlerts: true,
};

export const DEFAULT_REGIONAL_PREFS: RegionalPrefs = {
  timezone: 'gmt7',
  dateFormat: 'dmy',
  currency: 'vnd',
};

// =========================================================
// API DÀNH CHO KHÁCH HÀNG (END-USER)
// =========================================================

/**
 * Lấy thông tin tài khoản và hồ sơ cá nhân hiện tại
 */
export async function getMe() {
  return request('/api/users/me', { 
    method: 'GET' 
  });
}

/**
 * Cập nhật thông tin cơ bản của hồ sơ (Họ tên, giới tính, ảnh đại diện)
 */
export async function updateProfile(data: {
  full_name?: string;
  gender?: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  phone?: string;
  date_of_birth?: string;
}) {
  return request('/api/users/profile', {
    method: 'PATCH',
    data,
  });
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/api/users/avatar', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

export async function saveVoucherToWallet(data: {
  code: string;
  name?: string;
  discount_amount?: number;
  expires_at?: string;
  min_order?: number;
}) {
  return request('/api/users/me/vouchers', {
    method: 'POST',
    data,
  });
}

export async function removeVoucherFromWallet(code: string) {
  return request(`/api/users/me/vouchers/${encodeURIComponent(code)}`, {
    method: 'DELETE',
  });
}

// ─── QUẢN LÝ SỐ ĐIỆN THOẠI KHÁCH HÀNG ───────────────────────────────────

/**
 * Thêm số điện thoại mới vào danh sách
 */
export async function addPhone(data: {
  region_code: string;
  country_calling_code: string;
  national_number: string;
  phone_type?: string;
  is_default?: boolean;
}) {
  return request('/api/users/phones', {
    method: 'POST',
    data,
  });
}

/**
 * Cập nhật thông tin số điện thoại cụ thể
 */
export async function updatePhone(
  phoneId: string,
  data: {
    region_code?: string;
    country_calling_code?: string;
    national_number?: string;
    phone_type?: string;
    is_default?: boolean;
  },
) {
  return request(`/api/users/phones/${phoneId}`, {
    method: 'PATCH',
    data,
  });
}

/**
 * Đặt một số điện thoại làm mặc định cho tài khoản
 */
export async function setDefaultPhone(phoneId: string) {
  return request(`/api/users/phones/${phoneId}/default`, {
    method: 'PATCH',
  });
}

/**
 * Xóa số điện thoại khỏi danh sách
 */
export async function removePhone(phoneId: string) {
  return request(`/api/users/phones/${phoneId}`, {
    method: 'DELETE',
  });
}

// ─── QUẢN LÝ SỔ ĐỊA CHỈ KHÁCH HÀNG ──────────────────────────────────────

/**
 * Thêm một địa chỉ nhận hàng mới
 */
export interface AddressPayload {
  label?: string;
  receiver_name: string;
  receiver_phone_e164: string;
  country_id: string;
  country_name: string;
  province_id: string;
  province_name: string;
  district_id: string;
  district_name: string;
  ward_id: string;
  ward_name: string;
  address_line: string;
  postal_code?: string;
  delivery_note?: string;
  is_default?: boolean;
}

export async function addAddress(data: AddressPayload) {
  return request('/api/users/addresses', {
    method: 'POST',
    data,
  });
}

/**
 * Cập nhật thông tin địa chỉ nhận hàng
 */
export async function updateAddress(
  addressId: string,
  data: Partial<AddressPayload>,
) {
  return request(`/api/users/addresses/${addressId}`, {
    method: 'PATCH',
    data,
  });
}

/**
 * Đặt một địa chỉ làm địa chỉ giao hàng mặc định
 */
export async function setDefaultAddress(addressId: string) {
  return request(`/api/users/addresses/${addressId}/default`, {
    method: 'PATCH',
  });
}

/**
 * Xóa một địa chỉ nhận hàng (Xóa mềm ở phía Backend)
 */
export async function removeAddress(addressId: string) {
  return request(`/api/users/addresses/${addressId}`, {
    method: 'DELETE',
  });
}


// =========================================================
// API DÀNH CHO ADMIN QUẢN LÝ KHÁCH HÀNG
// =========================================================

/**
 * 1. Lấy danh sách khách hàng (Có phân trang, bộ lọc tìm kiếm)
 */
export interface AdminUserListParams {
  page: number;
  limit: number;
  search?: string;
  status?: 'active' | 'blocked';
  verified?: 'true' | 'false';
  vip?: 'true';
}

export interface AdminUserListItem {
  _id: string;
  email: string;
  name: string;
  avatar?: string | null;
  isEmailVerified: boolean;
  status?: 'active' | 'blocked';
  createdAt?: string;
  totalOrders: number;
  totalSpent: number;
}

export async function getAdminUsers(params: AdminUserListParams) {
  return request('/api/admin/users', {
    method: 'GET',
    params,
  });
}

/**
 * 2. Lấy hồ sơ chi tiết Khách hàng 360° (Gồm Profile, Địa chỉ, Thống kê & 5 Đơn hàng gần nhất)
 */
export async function getAdminUserDetail(userId: string) {
  return request(`/api/admin/users/${userId}`, {
    method: 'GET',
  });
}

/**
 * 3. Xuất file Excel danh sách khách hàng từ hệ thống
 */
export async function exportUsersAdmin(params?: {
  search?: string;
  exportOptions?: string;
  status?: string;
  verified?: string;
  vip?: string;
}) {
  return request('/api/admin/users/export', {
    method: 'GET',
    params,
    responseType: 'blob', // Định dạng bắt buộc để xử lý tải xuống file nhị phân (Excel)
  });
}

export async function getAdminUserStats() {
  return request('/api/admin/users/stats', { method: 'GET' });
}

export async function updateAdminUserStatus(userId: string, status: 'active' | 'blocked') {
  return request(`/api/admin/users/${userId}/status`, {
    method: 'PATCH',
    data: { status },
  });
}

export async function getPreferences() {
  return request('/api/users/me/preferences', { method: 'GET' }) as Promise<{
    success: boolean;
    data: UserPreferences;
  }>;
}

export async function updatePreferences(data: Partial<UserPreferences> & {
  notification_prefs?: Partial<NotificationPrefs>;
  regional_prefs?: Partial<RegionalPrefs>;
}) {
  return request('/api/users/me/preferences', {
    method: 'PATCH',
    data,
  }) as Promise<{ success: boolean; data: UserPreferences }>;
}