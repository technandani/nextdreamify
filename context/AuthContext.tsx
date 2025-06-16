'use client';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('uid');
    const cookieToken = getCookie('uid');
    setIsLoggedIn(!!(token || cookieToken));
  }, []);

  const login = () => setIsLoggedIn(true);

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('uid');
    Cookies.remove('uid');
    Cookies.remove('loggedInUser');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};