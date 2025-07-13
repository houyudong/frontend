import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, UserRole } from './AuthProvider';

// 角色权限配置
interface RolePermissions {
  canViewStudents: boolean;
  canManageUsers: boolean;
  canAccessIDE: boolean;
  canViewAnalytics: boolean;
  canManageSystem: boolean;
}

// 角色上下文类型
interface RoleContextType {
  role: UserRole | null;
  permissions: RolePermissions;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  isRole: (role: UserRole) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
}

/**
 * RoleProvider - 角色权限管理
 * 
 * 基于用户角色提供权限控制
 * 遵循奥卡姆原则：简单有效的权限系统
 */
export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // 角色权限映射
  const getPermissions = (role: UserRole | null): RolePermissions => {
    switch (role) {
      case 'student':
        return {
          canViewStudents: false,
          canManageUsers: false,
          canAccessIDE: true,
          canViewAnalytics: false,
          canManageSystem: false
        };
      case 'teacher':
        return {
          canViewStudents: true,
          canManageUsers: false,
          canAccessIDE: false,
          canViewAnalytics: true,
          canManageSystem: false
        };
      case 'admin':
        return {
          canViewStudents: true,
          canManageUsers: true,
          canAccessIDE: false,
          canViewAnalytics: true,
          canManageSystem: true
        };
      default:
        return {
          canViewStudents: false,
          canManageUsers: false,
          canAccessIDE: false,
          canViewAnalytics: false,
          canManageSystem: false
        };
    }
  };

  const role = user?.role || null;
  const permissions = getPermissions(role);

  // 权限检查函数
  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  // 角色检查函数
  const isRole = (targetRole: UserRole): boolean => {
    return role === targetRole;
  };

  const value: RoleContextType = {
    role,
    permissions,
    hasPermission,
    isRole
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

// 自定义Hook
export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
