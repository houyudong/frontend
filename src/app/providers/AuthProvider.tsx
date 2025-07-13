import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// 用户角色类型
export type UserRole = 'student' | 'teacher' | 'admin';

// 用户接口
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  displayName?: string;
}

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - 认证状态管理
 * 
 * 简化的认证系统，支持三种角色登录
 * 遵循DRY原则，统一管理认证状态
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 初始化检查本地存储的用户信息
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 登录函数
  const login = async (username: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      // 模拟API调用 - 实际项目中替换为真实API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 测试账号验证
      const testAccounts = {
        student: { username: '20250001', password: '20250001' },
        teacher: { username: 'teacher001', password: 'teacher001' },
        admin: { username: 'admin', password: 'admin' }
      };
      
      const testAccount = testAccounts[role];
      if (username === testAccount.username && password === testAccount.password) {
        const userData: User = {
          id: `${role}-${Date.now()}`,
          username,
          email: `${username}@stm32.edu.cn`,
          role,
          displayName: role === 'student' ? '学生用户' : role === 'teacher' ? '教师用户' : '管理员'
        };
        
        // 保存用户信息和token
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', `token-${userData.id}`);
        
        setUser(userData);
        
        // 根据角色跳转到对应页面
        const roleRoutes = {
          student: '/student/dashboard',
          teacher: '/teacher/dashboard',
          admin: '/admin/dashboard'
        };
        navigate(roleRoutes[role]);
      } else {
        throw new Error('用户名或密码错误');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // 更新用户信息
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
