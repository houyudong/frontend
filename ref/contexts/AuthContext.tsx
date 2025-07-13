import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/apiService';

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
        const response = await authAPI.getCurrentUser();
        setUser(response);
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
      const response = await authAPI.login(username, password);
      const { user, token } = response;
      
      // 保存用户信息和令牌
      setUser(user);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // 获取重定向路径
      const redirectPath = sessionStorage.getItem('redirectPath') || '/';
      sessionStorage.removeItem('redirectPath');
      
      navigate(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // 注册
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ username, email, password });
      setUser(response.user);
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  // 更新用户信息
  const updateUser = async (userData: Partial<User>) => {
    if (!user) {
      throw new Error('用户未登录');
    }
    try {
      const updatedUser = await authAPI.updateUser(user.id, userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  };

  // 更新密码
  const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await authAPI.updatePassword(oldPassword, newPassword);
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