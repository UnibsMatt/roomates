import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '../lib/api';
import type { TokenResponse } from '../types';

const TOKEN_KEY = 'rm_token';
const USER_KEY = 'rm_user';

interface AuthUser {
  user_id: number;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function storeSession(resp: TokenResponse) {
  localStorage.setItem(TOKEN_KEY, resp.token);
  localStorage.setItem(USER_KEY, JSON.stringify({ user_id: resp.user_id, email: resp.email, name: resp.name }));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  const applySession = (resp: TokenResponse) => {
    storeSession(resp);
    setToken(resp.token);
    setUser({ user_id: resp.user_id, email: resp.email, name: resp.name });
  };

  const login = useCallback(async (email: string, password: string) => {
    const resp = await api.login(email, password);
    applySession(resp);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const resp = await api.register(name, email, password);
    applySession(resp);
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try { await api.logout(token); } catch { /* ignore */ }
    }
    clearSession();
    setToken(null);
    setUser(null);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
