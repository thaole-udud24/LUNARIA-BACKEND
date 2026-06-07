import { history } from 'umi';
import '@/styles/global.less';
import '@/styles/admin-tokens.less';
import '@/styles/admin.less';
import '@/styles/admin-theme.less';
import '@/styles/admin-responsive.less';
import { getMe } from '@/services/TaiKhoan/users.api';
import { setupLuranaToast } from '@/utils/luranaToast';
import { initAdminTheme } from '@/utils/adminTheme';
import { hasAdminRole } from '@/pages/auth/auth.utils';

setupLuranaToast();

if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
  initAdminTheme();
}

const readStoredRoles = (): string[] => {
  try {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      if (Array.isArray(user?.roles)) return user.roles;
    }
    const role = localStorage.getItem('role');
    return role ? [role] : [];
  } catch {
    return [];
  }
};

const isAdminUser = () => hasAdminRole(readStoredRoles());

// ==========================================
// 1. CONFIG LAYOUT (Tắt Layout mặc định của Umi Pro)
// ==========================================
export function layout(props: any) {
  const pathname = props?.location?.pathname || '';
  if (pathname.startsWith('/auth') || pathname.startsWith('/admin')) {
    return { layout: false };
  }
  return {};
}

// ==========================================
// 2. GLOBAL INITIAL STATE TYPES
// ==========================================
export interface InitialState {
  currentUser?: {
    id: string;
    email: string;
    name?: string;
    roles?: string[];
    createdAt?: string;
  } | null;
}

// ==========================================
// 3. GET INITIAL STATE (Khởi tạo dữ liệu người dùng)
// ==========================================
export async function getInitialState(): Promise<InitialState> {
  const token = localStorage.getItem('token');
  
  // Nếu hoàn toàn không có token, trả về rỗng ngay lập tức (Khách vãng lai)
  if (!token) {
    return { currentUser: null };
  }

  try {
    const userRes: any = await getMe();
    
    // Bẫy lỗi: Kiểm tra nếu API chạy lỗi hoặc không trả về data thực tế
    if (!userRes) {
      localStorage.removeItem('token');
      return { currentUser: null };
    }

    // Tự động bóc tách dữ liệu linh hoạt (Phòng trường hợp Backend bọc trong data hoặc profile)
    const userData = userRes?.data || userRes?.account || userRes;
    const profileData = userRes?.profile || userData;

    if (!userData || (!userData.id && !userData._id)) {
      localStorage.removeItem('token');
      return { currentUser: null };
    }

    return {
      currentUser: {
        id: userData.id || userData._id,
        email: userData.email,
        name: profileData.full_name || userData.name || userData.username || 'User',
        roles: userData.roles || ['USER'], // Nếu không có quyền, mặc định gán quyền USER
        createdAt: userData.createdAt || userData.created_at,
      },
    };
  } catch (error) {
    // Nếu token hết hạn hoặc API sập, xóa luôn token lỗi và đưa về trạng thái chưa đăng nhập
    localStorage.removeItem('token');
    return { currentUser: null };
  }
}

// ==========================================
// 4. ROUTE GUARD (Chặn và điều hướng thông minh)
// ==========================================
export function onRouteChange({ location }: any) {
  const pathname = location.pathname;
  const token = localStorage.getItem('token');
  
  const isAdminPage = pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/auth');
  const protectedCustomerPaths = ['/account', '/checkout', '/orders', '/orderdetail', '/notifications'];
  const isProtectedCustomer = protectedCustomerPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // Trường hợp 1: Chưa đăng nhập mà cố tình vào trang Admin quản trị -> Đá về Login
  if (!token && isAdminPage) {
    history.replace('/auth/login?redirect=%2Fadmin%2Fdashboard');
    return;
  }

  if (!token && isProtectedCustomer) {
    history.replace(`/auth/login?redirect=${encodeURIComponent(pathname + (location.search || ''))}`);
    return;
  }

  // Trường hợp 1b: User thường không được vào admin
  if (token && isAdminPage && !isAdminUser()) {
    history.replace('/home');
    return;
  }

  // Trường hợp 2: Đã đăng nhập rồi mà cố tình quay lại trang Login/Register
  if (token && isAuthPage) {
    history.replace(isAdminUser() ? '/admin/dashboard' : '/home');
    return;
  }

  // Trường hợp 3: Vào gốc '/' khi đã có token
  if (token && pathname === '/') {
    history.replace(isAdminUser() ? '/admin/dashboard' : '/home');
  }

  if (pathname.startsWith('/admin')) {
    initAdminTheme();
  }
}