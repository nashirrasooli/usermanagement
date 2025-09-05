import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

type AuthCtx = {
  token: string | null;
  login: (t: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx>({
  token: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('accessToken')
  );

  const login = (t: string) => {
    localStorage.setItem('accessToken', t);
    setToken(t);
  };
  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
  };

  // optional: auto-logout when token removed in another tab
  useEffect(() => {
    const f = (e: StorageEvent) => {
      if (e.key === 'accessToken')
        setToken(localStorage.getItem('accessToken'));
    };
    window.addEventListener('storage', f);
    return () => window.removeEventListener('storage', f);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
