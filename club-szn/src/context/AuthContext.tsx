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
  loginWithEmail: (email: string, pass: string) => { success: boolean; role: 'admin' | 'user'; error?: string };
  loginWithGoogle: (customEmail?: string, customName?: string) => { success: boolean; role: 'admin' | 'user' };
  logout: () => void;
  isAdmin: boolean;
}

const AUTH_STORAGE_KEY = 'szn_auth_user';

// Designated Admin Accounts & Passwords
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

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const checkIsAdmin = (email: string, password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminEmail = ADMIN_EMAILS.includes(cleanEmail) || cleanEmail.startsWith('admin@');
    if (!password) return isAdminEmail;
    const isCorrectPassword = ADMIN_PASSWORDS.includes(password.trim());
    return isAdminEmail && isCorrectPassword;
  };

  const loginWithEmail = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      return { success: false, role: 'user' as const, error: 'Email and password are required' };
    }

    // Auto-detect Admin
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
      return { success: true, role: 'admin' as const };
    }

    // If admin email used with wrong password
    if (ADMIN_EMAILS.includes(cleanEmail) || cleanEmail.startsWith('admin@')) {
      return {
        success: false,
        role: 'user' as const,
        error: 'Invalid password for Admin. (Hint: use admin123 or szn2026)',
      };
    }

    // Standard User login
    const regularUser: User = {
      id: 'user-' + Date.now(),
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: 'user',
      provider: 'email',
    };
    setUser(regularUser);
    return { success: true, role: 'user' as const };
  };

  const loginWithGoogle = (customEmail?: string, customName?: string) => {
    const email = (customEmail || 'user@gmail.com').trim().toLowerCase();
    const name = customName || email.split('@')[0];

    // Check if Google Sign In uses an Admin Gmail
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
    return { success: true, role: loggedUser.role };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithEmail,
        loginWithGoogle,
        logout,
        isAdmin: user?.role === 'admin',
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
