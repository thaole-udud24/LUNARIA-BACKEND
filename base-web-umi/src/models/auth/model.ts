import type { Effect, Reducer } from 'umi';
import { history } from 'umi';
import { tokenStorage } from '@/services/base/storage';
import type { AuthState } from './type';
import { AuthService } from './service';

type AuthModel = {
  namespace: 'auth';
  state: AuthState;
  effects: {
    login: Effect;
    register: Effect;
    fetchMe: Effect;
    logout: Effect;
    forgotPassword: Effect;
    resetPassword: Effect;
  };
  reducers: {
    setLoading: Reducer<AuthState>;
    setUser: Reducer<AuthState>;
    clearAuth: Reducer<AuthState>;
  };
};

const Model: AuthModel = {
  namespace: 'auth',
  state: {
    user: null,
    loading: false,
    isLoggedIn: false,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(AuthService.login, payload);
      const { tokens, user } = res.data;

      tokenStorage.setAccessToken(tokens.accessToken);
      if (tokens.refreshToken) tokenStorage.setRefreshToken(tokens.refreshToken);

      yield put({ type: 'setUser', payload: user });
      yield put({ type: 'setLoading', payload: false });

      history.push('/');
    },

    *register({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(AuthService.register, payload);
      const { tokens, user } = res.data;

      tokenStorage.setAccessToken(tokens.accessToken);
      if (tokens.refreshToken) tokenStorage.setRefreshToken(tokens.refreshToken);

      yield put({ type: 'setUser', payload: user });
      yield put({ type: 'setLoading', payload: false });

      history.push('/');
    },

    *fetchMe(_, { call, put }) {
      const token = tokenStorage.getAccessToken();
      if (!token) return;
      try {
        const res = yield call(AuthService.me);
        yield put({ type: 'setUser', payload: res.data.user });
      } catch (e) {
        tokenStorage.clear();
        yield put({ type: 'clearAuth' });
      }
    },

    *logout(_, { call, put }) {
      try {
        yield call(AuthService.logout);
      } finally {
        tokenStorage.clear();
        yield put({ type: 'clearAuth' });
        history.push('/user/login');
      }
    },

    *forgotPassword({ payload }, { call }) {
      yield call(AuthService.forgotPassword, payload);
      // chuyển sang reset
      history.push(`/user/reset-password?email=${encodeURIComponent(payload.email)}`);
    },

    *resetPassword({ payload }, { call }) {
      yield call(AuthService.resetPassword, payload);
      history.push('/user/login');
    },
  },

  reducers: {
    setLoading(state, { payload }) {
      return { ...(state as AuthState), loading: payload };
    },
    setUser(state, { payload }) {
      return { ...(state as AuthState), user: payload, isLoggedIn: true, loading: false };
    },
    clearAuth(state) {
      return { ...(state as AuthState), user: null, isLoggedIn: false, loading: false };
    },
  },
};

export default Model;