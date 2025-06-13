import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: string;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 检查用户是否已登录
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 登录
  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      setUser(response.data.user);
      
      // 获取重定向路径
      const redirectPath = sessionStorage.getItem('redirectPath') || '/';
      sessionStorage.removeItem('redirectPath');
      
      navigate(redirectPath);
    } catch (error) {
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      throw error;
    }
  };

  // 注册
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/register', {
        username,
        email,
        password
      });
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  // 更新用户信息
  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await apiClient.put('/auth/user', userData);
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  // 更新密码
  const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await apiClient.put('/auth/password', {
        oldPassword,
        newPassword
      });
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    role: user?.role || '',
    loading,
    login,
    logout,
    register,
    updateUser,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 