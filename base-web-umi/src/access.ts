import type { InitialState } from './app';

export default function access(initialState: InitialState) {
  return {
    isLogin: !!initialState?.user,
  };
}