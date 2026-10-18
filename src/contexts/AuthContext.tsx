'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, tokenStorage } from '@/lib/api';
import type { AuthResponse, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sayfa ilk açıldığında: token varsa /me çağır
  useEffect(() => {
    const init = async () => {
      if (!tokenStorage.getAccess()) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get<User>('/users/me/');
        setUser(data);
      } catch {
        tokenStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/users/login/', {
      username,
      password,
    });
    tokenStorage.set(data.access, data.refresh);
    setUser(data.user);
    router.push('/');
  };

  const register = async (payload: {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name?: string;
  }) => {
    const { data } = await api.post<AuthResponse>('/users/register/', payload);
    tokenStorage.set(data.access, data.refresh);
    setUser(data.user);
    router.push('/');
  };

  const logout = async () => {
    const refresh = tokenStorage.getRefresh();
    if (refresh) {
      try {
        await api.post('/users/logout/', { refresh });
      } catch {
        // Token zaten geçersiz olabilir, sorun değil
      }
    }
    tokenStorage.clear();
    setUser(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    const { data } = await api.get<User>('/users/me/');
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth, AuthProvider içinde kullanılmalı');
  return ctx;
}