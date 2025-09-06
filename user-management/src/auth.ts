
import { logout as logoutAction, setToken } from './features/authSlice';
import { useAppDispatch, useAppSelector } from './hook';

export function useAuth() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  return {
    token,
    isAuthenticated: !!token,
    login: (t: string) => dispatch(setToken(t)),
    logout: () => dispatch(logoutAction()),
  };
}
