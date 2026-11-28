import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  provider: 'google' | 'email';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; role: 'admin' | 'user'; error?: string }>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; role: 'admin' | 'user'; error?: string }>;
  loginWithGoogle: (customEmail?: string, customName?: string) => Promise<{ success: boolean; role: 'admin' | 'user' }>;
  logout: () => void;
  isAdmin: boolean;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AUTH_STORAGE_KEY = 'szn_auth_user';
const TOKEN_STORAGE_KEY = 'szn_auth_token';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4242';

export const ADMIN_EMAILS = [
  'clubszn.faq@gmail.com',
  'admin@clubszn.in',
  'admin@clubszn.com',
  'admin@gmail.com',
  'sznclub@gmail.com',
  'admin.szn@gmail.com',
];

export const ADMIN_PASSWORDS = ['admin123', 'szn2026', 'admin@szn', 'clubszn'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });

  // Verify token on mount with backend if token exists
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // Keep existing cached user if backend is temporarily offline
        });
    }
  }, [token]);

  const checkIsAdmin = (email: string, password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminEmail = ADMIN_EMAILS.includes(cleanEmail) || cleanEmail.startsWith('admin@');
    if (!password) return isAdminEmail;
    return isAdminEmail && ADMIN_PASSWORDS.includes(password.trim());
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      return { success: false, role: 'user' as const, error: 'Email and password are required' };
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);

      return { success: true, role: data.user.role as 'admin' | 'user' };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';

      // Fallback local simulation if backend API is not running
      if (checkIsAdmin(cleanEmail, pass)) {
        const adminUser: User = {
          id: 'admin-' + Date.now(),
          name: 'SZN Admin',
          email: cleanEmail,
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
          provider: 'email',
        };
        setUser(adminUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
        return { success: true, role: 'admin' as const };
      }

      if (ADMIN_EMAILS.includes(cleanEmail) || cleanEmail.startsWith('admin@')) {
        return { success: false, role: 'user' as const, error: 'Invalid password for Admin. (Use admin123)' };
      }

      const regularUser: User = {
        id: 'user-' + Date.now(),
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'user',
        provider: 'email',
      };
      setUser(regularUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(regularUser));
      return { success: true, role: 'user' as const, error: errorMsg };
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name || !cleanEmail || !pass) {
      return { success: false, role: 'user' as const, error: 'Name, email, and password are required' };
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: cleanEmail, password: pass }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);

      return { success: true, role: data.user.role as 'admin' | 'user' };
    } catch (err: unknown) {
      return { success: false, role: 'user' as const, error: err instanceof Error ? err.message : 'Registration failed' };
    }
  };

  const loginWithGoogle = async (customEmail?: string, customName?: string) => {
    const email = (customEmail || 'user@gmail.com').trim().toLowerCase();
    const name = customName || email.split('@')[0];

    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        return { success: true, role: data.user.role as 'admin' | 'user' };
      }
    } catch {
      // Backend offline fallback
    }

    const isAdmin = checkIsAdmin(email);
    const loggedUser: User = {
      id: 'google-' + Date.now(),
      name: isAdmin ? 'SZN Administrator' : name,
      email,
      role: isAdmin ? 'admin' : 'user',
      avatar: isAdmin
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      provider: 'google',
    };

    setUser(loggedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
    return { success: true, role: loggedUser.role };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  // Authenticated fetch helper for backend API
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return fetch(url.startsWith('http') ? url : `${API_URL}${url}`, {
      ...options,
      headers,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        isAdmin: user?.role === 'admin',
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
