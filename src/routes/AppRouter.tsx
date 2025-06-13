import React, { Suspense, ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import routes from './routes';
import Spinner from '../components/ui/Spinner';

interface RouteGuardProps {
  children: ReactNode;
  auth?: boolean;
  roles?: string[];
}

/**
 * 路由守卫组件
 * 
 * 处理路由权限控制，未登录用户重定向到登录页面
 * 
 * @param props - 组件属性
 * @returns 渲染的组件
 */
const RouteGuard: React.FC<RouteGuardProps> = ({ children, auth, roles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  
  // 如果认证状态正在加载，显示加载指示器
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" label="加载中..." />
      </div>
    );
  }
  
  // 如果路由不需要认证，直接渲染子组件
  if (!auth) {
    return <>{children}</>;
  }
  
  // 如果需要认证但用户未登录，重定向到登录页面
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 如果指定了角色限制，检查用户角色是否有权限
  if (roles && roles.length > 0 && !roles.includes(role)) {
    // 如果用户没有权限，重定向到首页
    return <Navigate to="/" replace />;
  }
  
  // 通过所有检查，渲染子组件
  return <>{children}</>;
};

interface PageComponentProps {
  setDocumentTitle: (title: string) => void;
  title?: string;
}

/**
 * 应用路由组件
 * 
 * 根据路由配置渲染路由
 * 
 * @returns 渲染的路由组件
 */
const AppRouter: React.FC = () => {
  // 设置页面标题
  const setDocumentTitle = (title: string) => {
    document.title = title ? `${title} - STM32 AI嵌入式教学平台` : 'STM32 AI嵌入式教学平台';
  };
  
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" label="页面加载中..." />
      </div>
    }>
      <Routes>
        {routes.map((route) => {
          const { path, component: Component, auth = true, roles, title, exact } = route;
          
          return (
            <Route
              key={path}
              path={path}
              element={
                <RouteGuard auth={auth} roles={roles}>
                  <Component setDocumentTitle={setDocumentTitle} title={title} />
                </RouteGuard>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AppRouter; 