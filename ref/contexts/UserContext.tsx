import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserProfile,
  updateUserProfile,
  getUserPreferences,
  updateUserPreferences
} from '../services/index';

// 用户资料类型定义
interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  userType: string;
  schoolName?: string;
  className?: string;
  studentId?: string;
  status: string;
  [key: string]: any;
}

// 用户偏好设置类型定义
interface UserPreferences {
  theme: string;
  language: string;
  notifications: boolean;
  [key: string]: any;
}

// 上下文类型定义
interface UserContextType {
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ success: boolean; message?: string }>;
  updatePreferences: (preferencesData: Partial<UserPreferences>) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

// 创建用户上下文
const UserContext = createContext<UserContextType>({
  profile: null,
  preferences: null,
  updateProfile: async () => ({ success: false }),
  updatePreferences: async () => ({ success: false }),
  loading: false,
  error: null,
  refreshProfile: async () => {},
  refreshPreferences: async () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * UserProvider - 用户上下文提供者
 *
 * 提供用户数据和操作的上下文提供者组件。
 *
 * @component
 * @example
 * ```tsx
 * <UserProvider>
 *   <App />
 * </UserProvider>
 * ```
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取用户资料
  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    setError(null);

    try {
      const profileData = await getUserProfile(user.id);
      setProfile(profileData);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('获取用户资料失败');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // 获取用户偏好设置
  const fetchUserPreferences = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    setError(null);

    try {
      const preferencesData = await getUserPreferences(user.id);
      setPreferences(preferencesData);
    } catch (err) {
      console.error('Failed to fetch user preferences:', err);
      setError('获取用户偏好设置失败');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // 当用户认证状态变化时获取用户数据
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfile();
      fetchUserPreferences();
    } else {
      setProfile(null);
      setPreferences(null);
    }
  }, [isAuthenticated, user, fetchUserProfile, fetchUserPreferences]);

  // 更新用户资料
  const updateProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    if (!isAuthenticated || !user) {
      return { success: false, message: '用户未登录' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateUserProfile(user.id, profileData);

      if (result.success) {
        setProfile(prev => prev ? { ...prev, ...profileData } : null);
        return { success: true };
      } else {
        setError(result.message || '更新用户资料失败');
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error('Update profile error:', err);
      const errorMessage = err instanceof Error ? err.message : '更新用户资料过程中发生错误';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // 更新用户偏好设置
  const updatePreferences = useCallback(async (preferencesData: Partial<UserPreferences>) => {
    if (!isAuthenticated || !user) {
      return { success: false, message: '用户未登录' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateUserPreferences(user.id, preferencesData);

      if (result.success) {
        setPreferences(prev => prev ? { ...prev, ...preferencesData } : null);
        return { success: true };
      } else {
        setError(result.message || '更新用户偏好设置失败');
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error('Update preferences error:', err);
      const errorMessage = err instanceof Error ? err.message : '更新用户偏好设置过程中发生错误';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // 上下文值
  const value = {
    profile,
    preferences,
    updateProfile,
    updatePreferences,
    loading,
    error,
    refreshProfile: fetchUserProfile,
    refreshPreferences: fetchUserPreferences,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * useUser - 用户数据钩子
 *
 * 用于访问用户上下文的自定义钩子。
 *
 * @returns {UserContextType} 用户上下文值
 * @example
 * ```tsx
 * const { profile, preferences, updateProfile } = useUser();
 * ```
 */
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export default UserContext; 