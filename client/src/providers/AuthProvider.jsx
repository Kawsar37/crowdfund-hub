'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access-token');
    if (token) {
      api.getMe()
        .then((data) => {
          setUser(data.user);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('access-token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    const data = await api.login({ user_email: email, password });
    localStorage.setItem('access-token', data.token);
    setUser(data.user);
    return data;
  };

  const registerUser = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('access-token', data.token);
    setUser(data.user);
    return data;
  };

  const googleLoginUser = async (googleUser) => {
    const data = await api.googleLogin({
      display_name: googleUser.displayName,
      user_email: googleUser.email,
      photo_url: googleUser.photoURL,
    });
    localStorage.setItem('access-token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('access-token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, googleLoginUser, logout, refreshUser }}>
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
