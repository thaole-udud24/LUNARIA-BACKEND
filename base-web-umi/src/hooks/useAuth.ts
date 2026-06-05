import { useModel } from 'umi';
import type { InitialState } from '@/app';
import { login } from '@/services/TaiKhoan';

export default function useAuth() {
  const { initialState, setInitialState } =
    useModel('@@initialState');

  // 👉 login
  const handleLogin = async (email: string, password: string) => {
    const res = await login({ email, password });

    setInitialState((prev) => ({
      ...prev,
      user: res.user,
    }));

    // lưu token
    localStorage.setItem('token', res.access_token);

    return res;
  };

  // 👉 logout
  const logout = () => {
    setInitialState((prev) => ({
      ...prev,
      user: null,
    }));

    localStorage.removeItem('token');
  };

  return {
    user: initialState?.user,
    setUser: (user: InitialState['user']) =>
      setInitialState((prev) => ({
        ...prev,
        user,
      })),

    login: handleLogin,
    logout,
  };
}