import { history } from 'umi';
import '@/styles/global.less';
import '@/styles/admin.less';

// =========================
// LAYOUT
// =========================

export function layout(props: any) {
  const pathname =
    props?.location?.pathname || '';

  // Auth và Admin tự dùng layout riêng
  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/admin')
  ) {
    return {
      layout: false,
    };
  }

  return {};
}

// =========================
// INITIAL STATE
// =========================

export interface InitialState {
  user?: {
    id: number;
    email: string;
    name?: string;
  } | null;
}

export async function getInitialState(): Promise<InitialState> {
  return {
    user: null,
  };
}

// =========================
// ROUTE GUARD
// =========================

export function onRouteChange({
  location,
}: any) {
  const pathname =
    location.pathname;

  const token =
    localStorage.getItem('token');

  const isAuthPage =
    pathname.startsWith('/auth');

  const isAdminPage =
    pathname.startsWith('/admin');

  // Chưa đăng nhập
  // Chỉ chặn trang admin
  if (!token && isAdminPage) {
    history.replace('/auth/login');
    return;
  }

  // Đã đăng nhập
  // Không cho quay lại login/register
  if (token && isAuthPage) {
    history.replace(
      '/admin/dashboard',
    );
  }
}