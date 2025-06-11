import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * RouteGuard - 路由守卫组件
 *
 * 用于保护需要认证的路由，并处理角色权限控制
 *
 * @component
 * @example
 * ```jsx
 * <Route
 *   path="/dashboard"
 *   element={
 *     <RouteGuard roles={['admin', 'manager']}>
 *       <DashboardPage />
 *     </RouteGuard>
 *   }
 * />
 * ```
 */
const RouteGuard = ({
  children,
  roles = [],
  auth = true
}) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  // 记录访问历史，用于登录后重定向
  useEffect(() => {
    if (auth && !isAuthenticated && !loading && location.pathname !== '/login') {
      sessionStorage.setItem('redirectPath', location.pathname);
    }
  }, [auth, isAuthenticated, loading, location.pathname]);

  // 如果认证状态正在加载中，显示加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // 如果路由需要认证但用户未登录，重定向到登录页
  if (auth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果路由有角色限制，检查用户角色是否有权限
  if (auth && isAuthenticated && roles.length > 0) {
    if (!roles.includes(role)) {
      // 用户没有权限，重定向到首页或显示无权限页面
      return <Navigate to="/" state={{ from: location, error: '您没有权限访问该页面' }} replace />;
    }
  }

  // 用户有权限，渲染子组件
  return children;
};

export default RouteGuard;
