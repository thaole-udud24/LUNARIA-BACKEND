import type { UserMe } from '@/services/TaiKhoan/types';

export type AuthState = {
  user?: UserMe | null;
  loading?: boolean;
  isLoggedIn: boolean;
};