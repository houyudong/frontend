import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../app/providers/AuthProvider';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

/**
 * RoleGuard - 角色权限守卫
 * 
 * 基于用户角色控制页面访问权限
 * 遵循DRY原则：统一的权限控制逻辑
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/login' 
}) => {
  const { user, isAuthenticated } = useAuth();

  // 未认证用户重定向到登录页
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // 检查用户角色是否有权限访问
  if (!allowedRoles.includes(user.role)) {
    // 根据用户角色重定向到对应的仪表板
    const roleRoutes = {
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
      admin: '/admin/dashboard'
    };
    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
